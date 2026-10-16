-- ==============================================================================
-- Migration: 20261017_006_newsletter_subscribers.sql
-- Purpose:   Add dedicated public.newsletter_subscribers table with RLS policies
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id TEXT PRIMARY KEY DEFAULT ('nl_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'footer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 1. Public insert policy (allow website visitors to subscribe)
DROP POLICY IF EXISTS "Allow public insert newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow public insert newsletter_subscribers"
  ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (
    char_length(email) BETWEEN 5 AND 254 
    AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  );

-- 2. Public / system read policy
DROP POLICY IF EXISTS "Allow full access newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow full access newsletter_subscribers"
  ON public.newsletter_subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index on email for quick lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers (email);
