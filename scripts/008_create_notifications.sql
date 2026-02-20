-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('comment_on_post', 'reply_to_comment', 'post_approved', 'comment_approved')),
  actor_name TEXT NOT NULL DEFAULT 'Alguem',
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- RLS: users can only see and update their own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can insert (via API)
CREATE POLICY "Service can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================================
-- Trigger: auto-create notification when a comment is added
-- ============================================================
CREATE OR REPLACE FUNCTION notify_on_comment()
RETURNS TRIGGER AS $$
DECLARE
  post_owner_id UUID;
  parent_comment_owner_id UUID;
  post_body_preview TEXT;
  actor TEXT;
BEGIN
  -- Get actor name from the comment
  actor := COALESCE(NEW.author_name, 'Alguem');

  -- Get post owner
  SELECT user_id, LEFT(body, 50) INTO post_owner_id, post_body_preview
  FROM posts WHERE id = NEW.post_id;

  -- If this is a reply to another comment
  IF NEW.parent_comment_id IS NOT NULL THEN
    SELECT user_id INTO parent_comment_owner_id
    FROM comments WHERE id = NEW.parent_comment_id;

    -- Notify parent comment owner (if not replying to yourself)
    IF parent_comment_owner_id IS NOT NULL AND parent_comment_owner_id != NEW.user_id THEN
      INSERT INTO notifications (user_id, type, actor_name, post_id, comment_id, message)
      VALUES (
        parent_comment_owner_id,
        'reply_to_comment',
        actor,
        NEW.post_id,
        NEW.id,
        actor || ' respondeu ao seu comentario'
      );
    END IF;

    -- Also notify post owner if different from parent comment owner and comment author
    IF post_owner_id IS NOT NULL
       AND post_owner_id != NEW.user_id
       AND (parent_comment_owner_id IS NULL OR post_owner_id != parent_comment_owner_id) THEN
      INSERT INTO notifications (user_id, type, actor_name, post_id, comment_id, message)
      VALUES (
        post_owner_id,
        'comment_on_post',
        actor,
        NEW.post_id,
        NEW.id,
        actor || ' comentou no seu post'
      );
    END IF;
  ELSE
    -- Direct comment on post: notify post owner (if not commenting on your own post)
    IF post_owner_id IS NOT NULL AND post_owner_id != NEW.user_id THEN
      INSERT INTO notifications (user_id, type, actor_name, post_id, comment_id, message)
      VALUES (
        post_owner_id,
        'comment_on_post',
        actor,
        NEW.post_id,
        NEW.id,
        actor || ' comentou no seu post'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger
DROP TRIGGER IF EXISTS trigger_notify_on_comment ON comments;
CREATE TRIGGER trigger_notify_on_comment
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_comment();
