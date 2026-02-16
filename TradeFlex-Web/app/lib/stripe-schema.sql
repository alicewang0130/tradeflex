--
-- app/lib/stripe-schema.sql
-- Stripe Subscriptions & Referral System Schema
-- Run this in Supabase SQL Editor
--

-- ==========================================
-- 1. SUBSCRIPTIONS TABLE (Stripe Sync)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  plan TEXT CHECK (plan IN ('monthly', 'yearly', 'lifetime')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "Users can read own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role (backend) can insert/update
-- (No insert/update policy for public role needed)

-- ==========================================
-- 2. REFERRALS TABLE (Invite System)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Who invited
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  -- Who joined
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'converted', 'paid')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(referred_id) -- One user can only be referred once
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users can read who they referred
CREATE POLICY "Users can read their referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id);

-- New users can insert a record saying who invited them
CREATE POLICY "Users can record their referrer"
  ON public.referrals FOR INSERT
  WITH CHECK (auth.uid() = referred_id);

-- ==========================================
-- 3. NEWSLETTER TABLE (If not exists)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.newsletter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (anon insert)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter FOR INSERT
  WITH CHECK (true);
