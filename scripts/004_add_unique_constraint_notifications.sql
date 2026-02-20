-- Add unique constraint on email + feature to support upsert
ALTER TABLE coming_soon_notifications
ADD CONSTRAINT coming_soon_notifications_email_feature_key UNIQUE (email, feature);
