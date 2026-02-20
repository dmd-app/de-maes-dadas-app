-- Create users table for DeMaesDadas app
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  accepted_terms BOOLEAN NOT NULL DEFAULT false,
  terms_accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: allow inserts from the API (service role bypasses RLS, but we add this for completeness)
CREATE POLICY "allow_insert_users" ON public.users FOR INSERT WITH CHECK (true);

-- Policy: allow select by anyone (the API will filter by email)
CREATE POLICY "allow_select_users" ON public.users FOR SELECT USING (true);

-- Policy: allow update by anyone (the API handles authorization)
CREATE POLICY "allow_update_users" ON public.users FOR UPDATE USING (true);

-- Index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
