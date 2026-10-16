-- ==============================================================================
-- Migration: 20261017_004_production_stopgap.sql
-- Purpose:   IMMEDIATE PRODUCTION STOPGAP (Safe to apply now without breaking portal)
--            Locks down the highest-risk exposure points without requiring auth.uid():
--            1. site_content: Removes anon write (prevents public defacement)
--            2. leads: Removes anon read (prevents dumping client inquiries and budgets)
--            3. audit_logs: Removes anon access (prevents log tampering)
--            4. certificates: Removes anon write (prevents forgery of credentials)
--
-- Note: Does NOT modify users, projects, or assignments yet to keep current
--       portal functions operating until the Supabase Auth cutover.
-- ==============================================================================

BEGIN;

-- 1. SITE_CONTENT: Public read-only; anon write revoked
DROP POLICY IF EXISTS "Allow full access site_content" ON public.site_content;
DROP POLICY IF EXISTS "Allow public read site_content" ON public.site_content;

CREATE POLICY "site_content_public_read_only"
  ON public.site_content
  FOR SELECT
  USING (true);

-- 2. LEADS: Anon insert-only; anon read revoked (protects client PII & budget data)
DROP POLICY IF EXISTS "Allow full access leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public insert leads" ON public.leads;

CREATE POLICY "leads_anon_insert_only"
  ON public.leads
  FOR INSERT
  WITH CHECK (
    char_length(client_name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 5 AND 254
    AND char_length(scope_description) BETWEEN 1 AND 5000
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
  );

-- 3. AUDIT_LOGS: Lock completely against anon read/write
DROP POLICY IF EXISTS "Allow full access audit_logs" ON public.audit_logs;

-- 4. CERTIFICATES: Public read for verification only; anon write revoked
DROP POLICY IF EXISTS "Allow full access certificates" ON public.certificates;
DROP POLICY IF EXISTS "Allow public read certificates" ON public.certificates;

CREATE POLICY "certificates_public_read_verified"
  ON public.certificates
  FOR SELECT
  USING (
    (pdf_config->>'isHidden')::boolean IS NOT TRUE
    OR pdf_config->>'isHidden' IS NULL
  );

COMMIT;
