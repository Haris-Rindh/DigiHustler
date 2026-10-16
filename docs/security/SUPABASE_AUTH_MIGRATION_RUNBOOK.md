# Supabase Auth Migration & Cutover Runbook

> **Target Architecture:** Native Supabase Auth (`auth.users`, bcrypt hashing, native JWTs, TOTP MFA, `app_metadata` role RBAC)  
> **Replaces:** Custom SHA-256 client-side hashing and `localStorage` session spoofing  
> **Estimated Execution Time:** 2-3 hours during a scheduled maintenance window

---

## 1. Prerequisites & Preparation

### 1.1 Mandatory Full Database Backup
Before initiating any changes or running cutover scripts:
1. Navigate to **Supabase Dashboard** → **Database** → **Backups**.
2. Click **Create Backup (Manual)** or run `pg_dump` via connection pooling URL:
   ```bash
   pg_dump "postgres://postgres:[YOUR-PASSWORD]@db.ptvchzbzokyumeizsuge.supabase.co:5432/postgres" > backup_pre_auth_migration_$(date +%Y%m%d_%H%M%S).sql
   ```
3. Verify backup file size and integrity.

### 1.2 Custom SMTP Configuration (Supabase Dashboard)
Replace Supabase default email limits (3-4/hour) with custom SMTP:
1. Navigate to **Project Settings** → **Authentication** → **Email Templates** / **SMTP Settings**.
2. Enable **Custom SMTP**:
   - Host: `smtp.resend.com` or `smtp.sendgrid.net` (or Google Workspace SMTP `smtp.gmail.com`)
   - Port: `587` (TLS) or `465` (SSL)
   - User: `resend` / `apikey`
   - Password: `[YOUR-SMTP-API-KEY]`
   - Sender Email: `auth@digihust.tech` or `digihust@gmail.com`
   - Sender Name: `DigiHust Security Operations`
3. Send a test email to verify delivery.

### 1.3 Supabase Auth Settings Hardening
In **Authentication** → **Configuration**:
- **Enable Email Confirmations:** ON
- **Minimum Password Length:** 12 characters
- **Password Strength Check / Leaked Password Protection:** ON
- **JWT Expiry (Access Token):** 3600 seconds (1 hour)
- **Refresh Token Rotation:** Enabled
- **Reuse Detection:** Enabled (revokes token family if reused)
- **Redirect URLs:** Whitelist strictly `https://www.digihust.tech/**` and `http://localhost:3000/**` (dev only).

---

## 2. Database Schema Migration: Roles & `is_admin()`

The following SQL migration creates the role hierarchy, synchronizes `app_metadata`, and defines the `is_admin()` and `is_staff()` security definer functions with locked search paths.

Save and execute as migration `20261017_003_supabase_auth_roles.sql`:

```sql
BEGIN;

-- 1. Create dedicated user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_tier TEXT NOT NULL CHECK (role_tier IN ('ceo', 'manager', 'group_leader', 'member', 'intern')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_roles_user_id_unique UNIQUE(user_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Link public.users to auth.users via auth_user_id UUID
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON public.users(auth_user_id);

-- 3. Security Definer Helper: is_admin() with locked search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
      AND role_tier IN ('ceo', 'manager')
  );
END;
$$;

-- 4. Security Definer Helper: current_role_tier()
CREATE OR REPLACE FUNCTION public.current_role_tier()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
STABLE
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role_tier INTO v_role
  FROM public.user_roles
  WHERE user_id = auth.uid();
  RETURN COALESCE(v_role, 'member');
END;
$$;

-- 5. Trigger to mirror role_tier into auth.users.raw_app_meta_data
CREATE OR REPLACE FUNCTION public.sync_user_role_to_jwt()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role_tier', NEW.role_tier, 'is_admin', NEW.role_tier IN ('ceo', 'manager'))
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_user_role ON public.user_roles;
CREATE TRIGGER trg_sync_user_role
  AFTER INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_role_to_jwt();

COMMIT;
```

---

## 3. Account Migration & Forced Password Reset Plan

Because passwords in legacy `public.users` were stored as custom SHA-256 strings (which are irreversible and cannot be imported directly into Supabase Auth's bcrypt engine), all users must claim their account and set a strong permanent password through the official Supabase Auth flow.

### Step 3.1: Seed `auth.users` Stubs
Run a server-side migration script (via Supabase Edge Function or Node CLI using `SUPABASE_SERVICE_ROLE_KEY`):

```js
// scripts/migrate-users-to-auth.js
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Server-side admin only
);

async function migrateUsers() {
  const { data: legacyUsers } = await supabaseAdmin.from('users').select('*');

  for (const user of legacyUsers) {
    if (!user.email) continue;

    // Create user in auth.users with random temporary password (never emailed/stored)
    const { data: authUser, error } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      email_confirm: true,
      user_metadata: { name: user.name, member_id: user.member_id },
      app_metadata: { role_tier: user.role_tier || 'member' }
    });

    if (authUser?.user) {
      // 1. Link auth_user_id in public.users
      await supabaseAdmin.from('users').update({ auth_user_id: authUser.user.id }).eq('id', user.id);
      
      // 2. Insert into user_roles
      await supabaseAdmin.from('user_roles').upsert({
        user_id: authUser.user.id,
        role_tier: user.role_tier || 'member'
      });

      // 3. Send Supabase Password Reset / Magic Link to force initial password creation
      await supabaseAdmin.auth.resetPasswordForEmail(user.email, {
        redirectTo: 'https://www.digihust.tech/portal/login?reset=true'
      });
      console.log(`Migrated and dispatched reset link for: ${user.email}`);
    }
  }
}
```

---

## 4. Admin TOTP MFA Configuration

1. In **Supabase Dashboard** → **Authentication** → **MFA**:
   - Turn **TOTP (Authenticator App)** to **Enabled**.
   - Max authenticators per user: `2` (allows phone app + backup key).
2. For CEO and Managers:
   - Upon initial login, enforce enrollment step using `supabase.auth.mfa.enroll({ factorType: 'totp' })`.
   - Admin routes check `(await supabase.auth.mfa.getAuthenticatorAssuranceLevel()).currentLevel === 'aal2'`.

---

## 5. Cutover Checklist (Window: 45 Minutes)

1. [ ] Post temporary maintenance banner (`/maintenance` rewrite in `vercel.json` if needed).
2. [ ] Take full PostgreSQL snapshot backup.
3. [ ] Apply migration `20261017_003_supabase_auth_roles.sql`.
4. [ ] Run `scripts/migrate-users-to-auth.js` via local secure terminal.
5. [ ] Apply `supabase/migrations/20261017_001_fix_rls_policies.sql` (now safe because `auth.uid()` exists).
6. [ ] Deploy updated frontend bundle with `supabase.auth.signInWithPassword()` client integration.
7. [ ] Verify:
   - CEO logs in with new credentials + enrolls TOTP MFA.
   - Public pages load (home, blog, services, portfolio).
   - Leads insert succeeds from `/contact`.
   - Anon cannot select `users`, `projects`, or `audit_logs`.
8. [ ] Lift maintenance banner.

---

## 6. Rollback Runbook (Under 10 Minutes)

If a critical blocker is encountered during cutover:
1. **Revert Frontend:** In Vercel Dashboard → Deployments → Instant Rollback to prior production deployment.
2. **Revert Database Policies:** Run rollback SQL in Supabase SQL Editor:
   ```sql
   -- Restore open system policies temporarily
   CREATE POLICY "Allow full access users" ON public.users FOR ALL USING (true) WITH CHECK (true);
   CREATE POLICY "Allow full access projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
   CREATE POLICY "Allow full access assignments" ON public.assignments FOR ALL USING (true) WITH CHECK (true);
   ```
3. **Database Restore (if data was altered):** Restore the point-in-time snapshot created in Step 1.1.
4. Notify the team and conduct post-mortem.
