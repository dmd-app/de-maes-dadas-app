CREATE TABLE IF NOT EXISTS public.email_confirm_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS email_confirm_tokens_email_idx ON public.email_confirm_tokens (email);
CREATE UNIQUE INDEX IF NOT EXISTS email_confirm_tokens_token_idx ON public.email_confirm_tokens (token);

ALTER TABLE public.email_confirm_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert from service role" ON public.email_confirm_tokens
  FOR ALL USING (true) WITH CHECK (true);
