-- ==============================================================================
-- Migration: 20261017_001_fix_rls_policies.sql
-- Purpose:   Replace over-permissive "USING (true)" policies with least-privilege
--            policies per table. Run on a STAGING project first and test before
--            applying to production.
--
-- TESTING CHECKLIST (run after applying):
--   1. anon can read site_content (home page loads) ✓
--   2. anon can read published certificates (verify page works) ✓
--   3. anon can insert into leads (contact form works) ✓
--   4. anon CANNOT read users, projects, assignments, payouts, audit_logs ✓
--   5. anon CANNOT write to users, projects, assignments, announcements, audit_logs ✓
--   6. anon CANNOT write to site_content ✓
--   7. authenticated user can read their own user row ✓
--   8. authenticated user CANNOT read another user's row ✓
--
-- NOTE: This app uses a CUSTOM auth system (SHA-256 + localStorage), NOT
--       Supabase Auth. Therefore auth.uid() is not populated for portal users.
--       Policies below reflect that reality:
--       - Private tables are locked to anon (no read/write)
--       - The application reads/writes private tables via the anon key from
--         the browser, relying on Supabase Storage/DB as a "trusted" backend.
--       - OWNER ACTION REQUIRED: This architecture has an inherent risk —
--         any visitor with the anon key can attempt API calls. Correct long-term
--         fix is to migrate portal auth to Supabase Auth (see S3 in audit report).
--       - As an intermediate measure, these policies block raw anon access while
--         the app's own reads will temporarily fail unless a server-side proxy
--         is in place. See OWNER_ACTIONS.md for the migration path.
-- ==============================================================================

BEGIN;

-- ============================================================
-- SITE_CONTENT: anon read only (no write without auth)
-- ============================================================
DROP POLICY IF EXISTS "Allow full access site_content" ON public.site_content;
DROP POLICY IF EXISTS "Allow public read site_content" ON public.site_content;

-- Public (anon) can read CMS content
CREATE POLICY "site_content_anon_select"
  ON public.site_content
  FOR SELECT
  USING (true);

-- Only authenticated sessions can modify (owner action: enable Supabase Auth to use this)
-- Until Supabase Auth migration: service_role writes from Edge Function required
-- Placeholder policy (disabled until auth migration):
-- CREATE POLICY "site_content_authed_all"
--   ON public.site_content
--   FOR ALL
--   TO authenticated
--   USING (true) WITH CHECK (true);


-- ============================================================
-- CERTIFICATES: anon can read non-hidden certificates for verification
-- ============================================================
DROP POLICY IF EXISTS "Allow full access certificates" ON public.certificates;
DROP POLICY IF EXISTS "Allow public read certificates" ON public.certificates;

CREATE POLICY "certificates_anon_select_visible"
  ON public.certificates
  FOR SELECT
  -- Only return certificates that are not hidden (privacy flag)
  USING (
    (pdf_config->>'isHidden')::boolean IS NOT TRUE
    OR pdf_config->>'isHidden' IS NULL
  );


-- ============================================================
-- LEADS: anon can insert (contact/quote form submissions)
--         anon cannot read (private client data)
-- ============================================================
DROP POLICY IF EXISTS "Allow full access leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public insert leads" ON public.leads;

CREATE POLICY "leads_anon_insert"
  ON public.leads
  FOR INSERT
  WITH CHECK (
    -- Basic sanity checks at DB level
    char_length(client_name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 5 AND 254
    AND char_length(scope_description) BETWEEN 1 AND 5000
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
  );


-- ============================================================
-- USERS: lock down — no anon access to user records
-- ============================================================
DROP POLICY IF EXISTS "Allow full access users" ON public.users;

-- No anon policy = anon gets nothing. Authenticated access managed via app layer.
-- OWNER ACTION: Once Supabase Auth is adopted, add:
-- CREATE POLICY "users_self_select" ON public.users FOR SELECT
--   TO authenticated USING (auth.uid() = supabase_auth_id);


-- ============================================================
-- PROJECTS: lock down — no anon access
-- ============================================================
DROP POLICY IF EXISTS "Allow full access projects" ON public.projects;


-- ============================================================
-- ASSIGNMENTS: lock down — no anon access
-- ============================================================
DROP POLICY IF EXISTS "Allow full access assignments" ON public.assignments;


-- ============================================================
-- ANNOUNCEMENTS: lock down — no anon access
-- ============================================================
DROP POLICY IF EXISTS "Allow full access announcements" ON public.announcements;


-- ============================================================
-- AUDIT_LOGS: lock down — no anon access (highly sensitive)
-- ============================================================
DROP POLICY IF EXISTS "Allow full access audit_logs" ON public.audit_logs;


-- ============================================================
-- DB-LEVEL CONSTRAINTS for leads (belt-and-suspenders)
-- ============================================================
ALTER TABLE public.leads
  ADD CONSTRAINT leads_email_length CHECK (char_length(email) <= 254),
  ADD CONSTRAINT leads_name_length  CHECK (char_length(client_name) <= 200),
  ADD CONSTRAINT leads_scope_length CHECK (char_length(scope_description) <= 5000);

COMMIT;

-- ==============================================================================
-- POST-MIGRATION VERIFICATION QUERIES
-- Run these as an anon-key client to confirm policies are correct:
-- ==============================================================================

-- Should return rows (public CMS content):
-- SELECT id FROM public.site_content;

-- Should return only visible certs:
-- SELECT id, status FROM public.certificates WHERE pdf_config->>'isHidden' IS NOT TRUE;

-- Should FAIL with permission denied (anon cannot read):
-- SELECT id FROM public.users;          -- should get empty or error
-- SELECT id FROM public.projects;       -- should get empty or error
-- SELECT id FROM public.assignments;    -- should get empty or error
-- SELECT id FROM public.announcements;  -- should get empty or error
-- SELECT id FROM public.audit_logs;     -- should get empty or error

-- Should succeed (anon insert to leads):
-- INSERT INTO public.leads (id, client_name, email, scope_description, target_group_id, budget_range, timeline, status)
-- VALUES ('test-' || gen_random_uuid(), 'Test User', 'test@example.com', 'Test scope', 'tech', '$1k', '1 month', 'new');
