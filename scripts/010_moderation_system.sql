-- =============================================
-- 010: Moderation System
-- Alters status constraints, defaults and RLS
-- =============================================

-- 1. Drop old CHECK constraints on posts.status
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_status_check;
-- Add new CHECK with moderation values
ALTER TABLE posts ADD CONSTRAINT posts_status_check
  CHECK (status IN ('active', 'pending', 'approved', 'rejected', 'removed'));

-- Change default to 'pending' (everything needs approval)
ALTER TABLE posts ALTER COLUMN status SET DEFAULT 'pending';

-- Migrate existing 'active' posts to 'approved' so they remain visible
UPDATE posts SET status = 'approved' WHERE status = 'active';

-- 2. Drop old CHECK constraints on comments.status
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_status_check;
-- Add new CHECK with moderation values
ALTER TABLE comments ADD CONSTRAINT comments_status_check
  CHECK (status IN ('active', 'pending', 'approved', 'rejected', 'removed'));

-- Change default to 'pending'
ALTER TABLE comments ALTER COLUMN status SET DEFAULT 'pending';

-- Migrate existing 'active' comments to 'approved'
UPDATE comments SET status = 'approved' WHERE status = 'active';

-- 3. Update RLS for posts: users see 'approved' + own 'pending'
DROP POLICY IF EXISTS posts_select_active ON posts;
CREATE POLICY posts_select_active ON posts
  FOR SELECT USING (
    status = 'approved'
    OR (status = 'pending' AND user_id = auth.uid())
  );

-- 4. Update RLS for comments: users see 'approved' + own 'pending'
DROP POLICY IF EXISTS comments_select_active ON comments;
CREATE POLICY comments_select_active ON comments
  FOR SELECT USING (
    status = 'approved'
    OR (status = 'pending' AND user_id = auth.uid())
  );

-- 5. Update the notification trigger to only fire on 'approved' posts/comments
-- (so authors dont get spurious notifications for pending content)
-- The existing triggers fire on INSERT; we'll add a trigger for UPDATE to 'approved'
-- to create "post_approved" / "comment_approved" notifications.

-- Trigger: when a post status changes to 'approved', notify the author
CREATE OR REPLACE FUNCTION notify_post_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status = 'approved' AND NEW.user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, body, post_id)
    VALUES (
      NEW.user_id,
      'post_approved',
      'Seu post foi aprovado!',
      LEFT(NEW.body, 80),
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_post_approved ON posts;
CREATE TRIGGER trg_notify_post_approved
  AFTER UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION notify_post_approved();

-- Trigger: when a comment status changes to 'approved', notify the author
CREATE OR REPLACE FUNCTION notify_comment_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status = 'approved' AND NEW.user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, body, comment_id, post_id)
    VALUES (
      NEW.user_id,
      'comment_approved',
      'Seu comentario foi aprovado!',
      LEFT(NEW.body, 80),
      NEW.id,
      NEW.post_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_comment_approved ON comments;
CREATE TRIGGER trg_notify_comment_approved
  AFTER UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_comment_approved();

-- 6. Also update the existing comment notification trigger to only fire for approved comments
-- so the post author doesnt get notified about pending comments
CREATE OR REPLACE FUNCTION notify_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  post_owner uuid;
BEGIN
  -- Only notify when comment is approved (not pending)
  IF NEW.status <> 'approved' THEN
    RETURN NEW;
  END IF;

  SELECT user_id INTO post_owner FROM posts WHERE id = NEW.post_id;

  IF post_owner IS NOT NULL AND post_owner <> NEW.user_id THEN
    IF NEW.parent_comment_id IS NULL THEN
      INSERT INTO notifications (user_id, type, title, body, post_id, comment_id, actor_id)
      VALUES (post_owner, 'comment', 'Novo comentario no seu post', LEFT(NEW.body, 80), NEW.post_id, NEW.id, NEW.user_id);
    ELSE
      -- Reply: notify the parent comment author
      DECLARE
        parent_owner uuid;
      BEGIN
        SELECT user_id INTO parent_owner FROM comments WHERE id = NEW.parent_comment_id;
        IF parent_owner IS NOT NULL AND parent_owner <> NEW.user_id THEN
          INSERT INTO notifications (user_id, type, title, body, post_id, comment_id, actor_id)
          VALUES (parent_owner, 'reply', 'Nova resposta ao seu comentario', LEFT(NEW.body, 80), NEW.post_id, NEW.id, NEW.user_id);
        END IF;
      END;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
