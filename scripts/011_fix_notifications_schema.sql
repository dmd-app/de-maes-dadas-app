-- Fix notifications schema: add missing columns and fix triggers

-- 1. Drop the broken type CHECK constraint and re-add with all types
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('comment_on_post', 'reply_to_comment', 'post_approved', 'comment_approved', 'comment', 'reply', 'post_pending'));

-- 2. Recreate notify_post_approved to use correct columns (message instead of title/body)
CREATE OR REPLACE FUNCTION notify_post_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status = 'approved' AND NEW.user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, actor_name, post_id, message, read)
    VALUES (
      NEW.user_id,
      'post_approved',
      'Aldeia',
      NEW.id,
      'Seu post foi aprovado e ja esta no ar!',
      false
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

-- 3. Recreate notify_comment_approved to use correct columns
CREATE OR REPLACE FUNCTION notify_comment_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status = 'approved' AND NEW.user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, actor_name, comment_id, post_id, message, read)
    VALUES (
      NEW.user_id,
      'comment_approved',
      'Aldeia',
      NEW.id,
      NEW.post_id,
      'Seu comentario foi aprovado!',
      false
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

-- 4. Fix notify_new_comment (from migration 010) to use correct columns
CREATE OR REPLACE FUNCTION notify_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  post_owner uuid;
  actor TEXT;
BEGIN
  -- Only notify when comment is approved (not pending)
  IF NEW.status <> 'approved' THEN
    RETURN NEW;
  END IF;

  actor := COALESCE(NEW.author_name, 'Alguem');
  SELECT user_id INTO post_owner FROM posts WHERE id = NEW.post_id;

  IF post_owner IS NOT NULL AND post_owner <> NEW.user_id THEN
    IF NEW.parent_comment_id IS NULL THEN
      INSERT INTO notifications (user_id, type, actor_name, post_id, comment_id, message, read)
      VALUES (post_owner, 'comment_on_post', actor, NEW.post_id, NEW.id, actor || ' comentou no seu post', false);
    ELSE
      -- Reply: notify the parent comment author
      DECLARE
        parent_owner uuid;
      BEGIN
        SELECT user_id INTO parent_owner FROM comments WHERE id = NEW.parent_comment_id;
        IF parent_owner IS NOT NULL AND parent_owner <> NEW.user_id THEN
          INSERT INTO notifications (user_id, type, actor_name, post_id, comment_id, message, read)
          VALUES (parent_owner, 'reply_to_comment', actor, NEW.post_id, NEW.id, actor || ' respondeu ao seu comentario', false);
        END IF;
      END;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach trigger (010 used a different trigger name, keep both dropped and recreate one)
DROP TRIGGER IF EXISTS trg_notify_new_comment ON comments;
DROP TRIGGER IF EXISTS trigger_notify_on_comment ON comments;
CREATE TRIGGER trigger_notify_on_comment
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_comment();

-- 5. Also create a trigger for when a NEW post is created (pending) -> notify the author
CREATE OR REPLACE FUNCTION notify_post_pending()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' AND NEW.user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, actor_name, post_id, message, read)
    VALUES (
      NEW.user_id,
      'post_pending',
      'Aldeia',
      NEW.id,
      'Sua mensagem foi recebida e esta aguardando aprovacao.',
      false
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_post_pending ON posts;
CREATE TRIGGER trg_notify_post_pending
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION notify_post_pending();
