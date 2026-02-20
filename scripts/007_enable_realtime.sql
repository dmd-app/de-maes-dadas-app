-- Enable Supabase Realtime for posts and comments tables
-- This allows clients to subscribe to INSERT/UPDATE/DELETE events

ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
