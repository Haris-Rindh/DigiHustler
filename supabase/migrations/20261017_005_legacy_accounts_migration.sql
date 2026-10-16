-- ==============================================================================
-- Migration: 20261017_005_legacy_accounts_migration.sql
-- Purpose:   Data model, tables, security-definer RPCs, and seed data for automated
--            legacy account to Supabase Auth migration.
-- ==============================================================================

BEGIN;

-- 1. LEGACY ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.legacy_accounts (
  legacy_id TEXT PRIMARY KEY,
  email_normalized TEXT NOT NULL,
  auth_user_id UUID,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'notice_sent', 'reset_sent', 'completed', 'failed', 'suppressed', 'needs_attention')
  ),
  notice_sent_at TIMESTAMPTZ,
  reset_sent_at TIMESTAMPTZ,
  reminder_count INT NOT NULL DEFAULT 0,
  last_reminder_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failed_attempts INT NOT NULL DEFAULT 0,
  last_error_code TEXT,
  needs_attention_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legacy_accounts_email ON public.legacy_accounts(email_normalized);
CREATE INDEX IF NOT EXISTS idx_legacy_accounts_status ON public.legacy_accounts(status);
CREATE INDEX IF NOT EXISTS idx_legacy_accounts_auth_id ON public.legacy_accounts(auth_user_id);

-- 2. MIGRATION CONFIG (SINGLETON)
CREATE TABLE IF NOT EXISTS public.migration_config (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  notice_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  cutover_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '14 days'),
  window_days INT NOT NULL DEFAULT 30,
  batch_size INT NOT NULL DEFAULT 25,
  paused BOOLEAN NOT NULL DEFAULT true, -- Kill switch defaults to paused until owner approval
  dry_run_completed_at TIMESTAMPTZ,
  test_email_sent_at TIMESTAMPTZ,
  test_email_recipient TEXT,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed singleton if not exists
INSERT INTO public.migration_config (id, notice_at, cutover_at, window_days, batch_size, paused)
VALUES (1, NOW() + INTERVAL '7 days', NOW() + INTERVAL '14 days', 30, 25, true)
ON CONFLICT (id) DO NOTHING;

-- 3. EMAILS SENT AUDIT TABLE
-- Logs only internal account IDs, template types, and message IDs.
-- Rule: Never stores emails or links.
CREATE TABLE IF NOT EXISTS public.emails_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id TEXT NOT NULL REFERENCES public.legacy_accounts(legacy_id) ON DELETE CASCADE,
  template TEXT NOT NULL CHECK (template IN ('notice', 'cutover', 'reminder_1', 'reminder_2', 'test')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  provider_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'bounced', 'complained', 'failed'))
);

CREATE INDEX IF NOT EXISTS idx_emails_sent_account ON public.emails_sent(account_id);
CREATE INDEX IF NOT EXISTS idx_emails_sent_timestamp ON public.emails_sent(timestamp);

-- 4. STRICT RLS ENFORCEMENT
-- Only service_role and security-definer RPCs have access.
ALTER TABLE public.legacy_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migration_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails_sent ENABLE ROW LEVEL SECURITY;

-- Explicitly ensure no public / authenticated access
DROP POLICY IF EXISTS "No anon legacy_accounts" ON public.legacy_accounts;
DROP POLICY IF EXISTS "No anon migration_config" ON public.migration_config;
DROP POLICY IF EXISTS "No anon emails_sent" ON public.emails_sent;

-- 5. POPULATE LEGACY ACCOUNTS FROM public.users
INSERT INTO public.legacy_accounts (legacy_id, email_normalized, status, needs_attention_reason)
SELECT 
  u.id AS legacy_id,
  COALESCE(LOWER(TRIM(u.email)), '') AS email_normalized,
  CASE
    WHEN u.email IS NULL OR TRIM(u.email) = '' THEN 'needs_attention'
    WHEN u.email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN 'needs_attention'
    ELSE 'pending'
  END AS status,
  CASE
    WHEN u.email IS NULL OR TRIM(u.email) = '' THEN 'missing_email'
    WHEN u.email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN 'invalid_email_format'
    ELSE NULL
  END AS needs_attention_reason
FROM public.users u
ON CONFLICT (legacy_id) DO UPDATE SET
  email_normalized = EXCLUDED.email_normalized;

-- Detect and mark duplicate emails as needs_attention
WITH duplicates AS (
  SELECT email_normalized
  FROM public.legacy_accounts
  WHERE email_normalized <> ''
  GROUP BY email_normalized
  HAVING COUNT(*) > 1
)
UPDATE public.legacy_accounts la
SET 
  status = 'needs_attention',
  needs_attention_reason = 'duplicate_email'
FROM duplicates d
WHERE la.email_normalized = d.email_normalized;

-- 6. SECURITY-DEFINER RPC: mark_migration_complete()
-- Invoked automatically after user completes password reset or login
CREATE OR REPLACE FUNCTION public.mark_migration_complete()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_auth_id UUID;
  v_email TEXT;
  v_updated INT := 0;
BEGIN
  v_auth_id := auth.uid();
  IF v_auth_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = v_auth_id;

  UPDATE public.legacy_accounts
  SET 
    status = 'completed',
    auth_user_id = v_auth_id,
    completed_at = NOW(),
    updated_at = NOW()
  WHERE (auth_user_id = v_auth_id OR email_normalized = LOWER(TRIM(v_email)))
    AND status <> 'completed';

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  -- Also link public.users if not already linked
  UPDATE public.users
  SET auth_user_id = v_auth_id, is_first_login = false, updated_at = NOW()
  WHERE email_normalized(email) = LOWER(TRIM(v_email))
    AND (auth_user_id IS NULL OR auth_user_id <> v_auth_id);

  RETURN jsonb_build_object('success', true, 'updated_count', v_updated);
END;
$$;

-- 7. SECURITY-DEFINER RPC: get_migration_stats()
-- For admin dashboard display
CREATE OR REPLACE FUNCTION public.get_migration_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_is_adm BOOLEAN;
  v_config RECORD;
  v_total INT;
  v_pending INT;
  v_notice_sent INT;
  v_reset_sent INT;
  v_completed INT;
  v_failed INT;
  v_suppressed INT;
  v_needs_attention INT;
  v_progress_pct NUMERIC := 0;
BEGIN
  -- Verify caller is admin
  SELECT public.is_admin() INTO v_is_adm;
  IF v_is_adm IS NOT TRUE THEN
    -- Fallback check for bootstrap/superadmin in users table
    IF NOT EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.auth_user_id = auth.uid() 
        AND (u.role_tier IN ('ceo', 'manager') OR u.role = 'management')
    ) THEN
      RETURN jsonb_build_object('error', 'access_denied');
    END IF;
  END IF;

  SELECT * INTO v_config FROM public.migration_config WHERE id = 1;

  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'pending'),
    COUNT(*) FILTER (WHERE status = 'notice_sent'),
    COUNT(*) FILTER (WHERE status = 'reset_sent'),
    COUNT(*) FILTER (WHERE status = 'completed'),
    COUNT(*) FILTER (WHERE status = 'failed'),
    COUNT(*) FILTER (WHERE status = 'suppressed'),
    COUNT(*) FILTER (WHERE status = 'needs_attention')
  INTO 
    v_total, v_pending, v_notice_sent, v_reset_sent, v_completed, v_failed, v_suppressed, v_needs_attention
  FROM public.legacy_accounts;

  IF (v_total - v_needs_attention) > 0 THEN
    v_progress_pct := ROUND((v_completed::numeric / (v_total - v_needs_attention)::numeric) * 100, 1);
  END IF;

  RETURN jsonb_build_object(
    'total', v_total,
    'pending', v_pending,
    'notice_sent', v_notice_sent,
    'reset_sent', v_reset_sent,
    'completed', v_completed,
    'failed', v_failed,
    'suppressed', v_suppressed,
    'needs_attention', v_needs_attention,
    'progress_pct', v_progress_pct,
    'config', row_to_json(v_config)
  );
END;
$$;

-- 8. SECURITY-DEFINER RPC: get_migration_masked_accounts()
-- Returns masked emails (e.g. j***@domain.com) for admin inspection
CREATE OR REPLACE FUNCTION public.get_migration_masked_accounts(p_limit INT DEFAULT 50, p_offset INT DEFAULT 0)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_is_adm BOOLEAN;
  v_rows JSONB;
BEGIN
  SELECT public.is_admin() INTO v_is_adm;
  IF v_is_adm IS NOT TRUE THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.auth_user_id = auth.uid() 
        AND (u.role_tier IN ('ceo', 'manager') OR u.role = 'management')
    ) THEN
      RETURN jsonb_build_object('error', 'access_denied');
    END IF;
  END IF;

  SELECT jsonb_agg(sub) INTO v_rows
  FROM (
    SELECT 
      la.legacy_id,
      CASE 
        WHEN la.email_normalized = '' THEN '[missing email]'
        ELSE 
          SUBSTRING(la.email_normalized FROM 1 FOR 1) || '***@' || 
          SPLIT_PART(la.email_normalized, '@', 2)
      END AS masked_email,
      la.status,
      la.reminder_count,
      la.notice_sent_at,
      la.reset_sent_at,
      la.completed_at,
      la.needs_attention_reason
    FROM public.legacy_accounts la
    ORDER BY la.created_at DESC
    LIMIT p_limit OFFSET p_offset
  ) sub;

  RETURN COALESCE(v_rows, '[]'::jsonb);
END;
$$;

-- 9. SECURITY-DEFINER RPC: approve_migration()
CREATE OR REPLACE FUNCTION public.approve_migration(p_approver_name TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_is_adm BOOLEAN;
  v_cfg RECORD;
BEGIN
  SELECT public.is_admin() INTO v_is_adm;
  IF v_is_adm IS NOT TRUE THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.auth_user_id = auth.uid() 
        AND (u.role_tier IN ('ceo', 'manager') OR u.role = 'management')
    ) THEN
      RETURN jsonb_build_object('error', 'access_denied');
    END IF;
  END IF;

  SELECT * INTO v_cfg FROM public.migration_config WHERE id = 1;

  IF v_cfg.test_email_sent_at IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Must send and verify a test email before approval');
  END IF;

  IF v_cfg.dry_run_completed_at IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Must execute a dry run before approval');
  END IF;

  UPDATE public.migration_config
  SET 
    approved_by = p_approver_name,
    approved_at = NOW(),
    paused = false,
    updated_at = NOW()
  WHERE id = 1;

  RETURN jsonb_build_object('success', true, 'approved_at', NOW());
END;
$$;

-- 10. SECURITY-DEFINER RPC: toggle_migration_pause()
CREATE OR REPLACE FUNCTION public.toggle_migration_pause(p_paused BOOLEAN)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_is_adm BOOLEAN;
BEGIN
  SELECT public.is_admin() INTO v_is_adm;
  IF v_is_adm IS NOT TRUE THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.auth_user_id = auth.uid() 
        AND (u.role_tier IN ('ceo', 'manager') OR u.role = 'management')
    ) THEN
      RETURN jsonb_build_object('error', 'access_denied');
    END IF;
  END IF;

  UPDATE public.migration_config
  SET paused = p_paused, updated_at = NOW()
  WHERE id = 1;

  RETURN jsonb_build_object('success', true, 'paused', p_paused);
END;
$$;

-- Helper function: email_normalized
CREATE OR REPLACE FUNCTION public.email_normalized(p_email TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT LOWER(TRIM(COALESCE(p_email, '')));
$$;

COMMIT;
