-- ===========================================
-- Fase 1: Tabelas principais da aplicacao
-- ===========================================

-- 1. PROFILES - Dados publicos do utilizador
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_service" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- 2. POSTS - Rodas de Conversa
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Anonima',
  category TEXT NOT NULL DEFAULT 'Geral',
  category_color TEXT DEFAULT '#FF66C4',
  title TEXT DEFAULT '',
  body TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'removed')),
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_select_active" ON public.posts
  FOR SELECT USING (status = 'active');

CREATE POLICY "posts_insert_auth" ON public.posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "posts_update_own" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "posts_delete_own" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- 3. POST_LIKES - Likes em posts
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "post_likes_select_all" ON public.post_likes
  FOR SELECT USING (true);

CREATE POLICY "post_likes_insert_auth" ON public.post_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "post_likes_delete_own" ON public.post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 4. COMMENTS - Comentarios e respostas
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Anonima',
  body TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'removed')),
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_select_active" ON public.comments
  FOR SELECT USING (status = 'active');

CREATE POLICY "comments_insert_auth" ON public.comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "comments_update_own" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "comments_delete_own" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- 5. COMMENT_LIKES - Likes em comentarios
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comment_likes_select_all" ON public.comment_likes
  FOR SELECT USING (true);

CREATE POLICY "comment_likes_insert_auth" ON public.comment_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "comment_likes_delete_own" ON public.comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ===========================================
-- Funcoes para contadores atomicos
-- ===========================================

CREATE OR REPLACE FUNCTION public.increment_post_likes(p_post_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = p_post_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_post_likes(p_post_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = p_post_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_post_comments(p_post_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = p_post_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_post_comments(p_post_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = p_post_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_comment_likes(p_comment_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.comments SET likes_count = likes_count + 1 WHERE id = p_comment_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_comment_likes(p_comment_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = p_comment_id;
END;
$$;

-- ===========================================
-- Trigger: auto-criar perfil ao signup
-- ===========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'Mamae'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- Indices para performance
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);

-- ===========================================
-- Seed: Posts iniciais (sistema)
-- ===========================================

INSERT INTO public.posts (id, user_id, author_name, category, category_color, body, likes_count, comments_count, created_at)
VALUES
  (gen_random_uuid(), NULL, 'Mamae Anon', 'Desabafo', '#FF66C4',
   'Hoje foi um daqueles dias em que a exaustao falou mais alto. Amo meus filhos, mas preciso de 5 minutos so pra mim. Alguem mais se sente assim?',
   12, 3, now() - interval '2 hours'),
  (gen_random_uuid(), NULL, 'Mamae Real', 'Vitoria', '#34D399',
   'Meu bebe dormiu a noite toda pela primeira vez! Sao esses pequenos marcos que fazem tudo valer a pena.',
   24, 5, now() - interval '5 hours'),
  (gen_random_uuid(), NULL, 'ForcaDeMae', 'Dica', '#60A5FA',
   'Dica que mudou minha rotina: preparar as lancheiras na noite anterior. Parece pouco, mas economiza uns 20 minutos de manha!',
   8, 2, now() - interval '1 day'),
  (gen_random_uuid(), NULL, 'MaeGuerreira', 'Pergunta', '#A78BFA',
   'Maes de primeira viagem: qual foi o melhor conselho que voces receberam? Estou no 7o mes e comecando a ficar ansiosa!',
   15, 7, now() - interval '3 hours')
ON CONFLICT DO NOTHING;
