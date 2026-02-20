-- Create table for Coming Soon notification requests
CREATE TABLE IF NOT EXISTS public.coming_soon_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  feature TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(email, feature)
);

-- Enable RLS
ALTER TABLE public.coming_soon_notifications ENABLE ROW LEVEL SECURITY;

-- Allow inserts from the service role (API endpoint)
CREATE POLICY "allow_insert_coming_soon" ON public.coming_soon_notifications
  FOR INSERT WITH CHECK (true);

-- Allow select for service role
CREATE POLICY "allow_select_coming_soon" ON public.coming_soon_notifications
  FOR SELECT USING (true);
