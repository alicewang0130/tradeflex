--
--  app/lib/schema.sql
--  TradeFlex - Supabase Database Schema
--
--  Run this in Supabase SQL Editor to set up all tables.
--

-- ============================================
-- 1. PROFILES TABLE (synced with auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  banned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can read profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. FLEXES TABLE (track generated images)
-- ============================================
CREATE TABLE IF NOT EXISTS public.flexes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ticker TEXT NOT NULL,
  instrument TEXT DEFAULT 'STOCK',
  position_type TEXT DEFAULT 'LONG',
  pnl_percent NUMERIC,
  pnl_amount NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.flexes ENABLE ROW LEVEL SECURITY;

-- Everyone can read flexes (for leaderboard)
CREATE POLICY "Flexes are viewable by everyone"
  ON public.flexes FOR SELECT
  USING (true);

-- Logged-in users can insert their own flexes
CREATE POLICY "Users can insert own flexes"
  ON public.flexes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. ORACLE VOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.oracle_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  vote TEXT NOT NULL CHECK (vote IN ('bull', 'bear')),
  voted_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, voted_at)
);

ALTER TABLE public.oracle_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Votes are viewable by everyone"
  ON public.oracle_votes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own votes"
  ON public.oracle_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. BACKFILL: Create profiles for existing users
-- ============================================
INSERT INTO public.profiles (id, email, display_name)
SELECT id, email, COALESCE(raw_user_meta_data->>'display_name', SPLIT_PART(email, '@', 1))
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
