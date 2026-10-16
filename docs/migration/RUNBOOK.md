# DigiHust Legacy-to-Supabase Auth Migration Runbook

**Target Architecture:** Supabase Auth (Option B) with Migrate-on-Login Bridge, Automated Schedule Dispatcher, Self-Serve Recovery, and Admin Governance.  
**Domain:** `www.digihust.tech`  
**Rollback Window SLA:** Under 10 minutes.

---

## 1. Staging Test Sequence (5 User Personas)

Before applying migration scripts or activating live sending on production, execute the following 5 user test cases on the staging Supabase project.

```
+-------------------------------------------------------------------------------------------------------+
| Persona               | Initial State                | Action                  | Expected Outcome     |
+-------------------------------------------------------------------------------------------------------+
| 1. Good Password      | Status: pending              | Signs in via login form | Migrated immediately;|
|                       | Pass: "SecureP@ss2026_Long"  | with current password   | Legacy hash cleared; |
|                       |                              |                         | Supabase Auth user   |
|                       |                              |                         | created; status=comp |
+-----------------------+------------------------------+-------------------------+----------------------+
| 2. Weak Password      | Status: pending              | Signs in with weak      | Blocked from login;  |
|                       | Pass: "test1234" (<12 chars) | password                | Prompted in-app to   |
|                       |                              |                         | set 12+ char pwd;    |
|                       |                              |                         | Upgrades & logged in |
+-----------------------+------------------------------+-------------------------+----------------------+
| 3. Cutover Email User | Status: notice_sent          | Clicks 24h reset link   | Arrives at /reset-   |
|                       | Does not sign in before      | in cutover email        | password; sets 12+   |
|                       | cutover date                 |                         | char pwd; status=comp|
+-----------------------+------------------------------+-------------------------+----------------------+
| 4. Late Reminder User | Status: reset_sent           | Ignores Notice & Cutover| Account marked       |
|                       | reminder_count: 2            | Clicks Reminder #2 link | status=completed;    |
|                       |                              |                         | no more emails sent  |
+-----------------------+------------------------------+-------------------------+----------------------+
| 5. Post-Window User   | Status: pending/reset_sent   | Tries to login after 30 | Cron ignores account;|
|                       | 35 days after cutover        | days elapsed            | Uses self-serve      |
|                       |                              |                         | "Forgot Password"    |
+-----------------------+------------------------------+-------------------------+----------------------+
```

### Detailed Execution of the 5 Personas:

#### Persona 1: Direct Migrate-on-Login (Strong Password)
1. In Staging DB, insert or verify test user `test_strong@digihust.tech` with legacy password hash for `AlphaBravo2026!`.
2. Visit `/portal/login` on staging.
3. Enter `test_strong@digihust.tech` and password `AlphaBravo2026!`.
4. Click **Authorize & Enter**.
5. **Verify:**
   - Client is authenticated without seeing the upgrade modal.
   - User appears in Supabase Auth (`auth.users`).
   - `legacy_accounts` row has `status = 'completed'` and `completed_at` populated.
   - `public.users.password_hash` is `NULL` (legacy hash purged).

#### Persona 2: Migrate-on-Login (Weak Password -> Policy Step-Up)
1. Verify test user `test_weak@digihust.tech` with legacy password hash for `abc123`.
2. Visit `/portal/login`.
3. Enter `test_weak@digihust.tech` and password `abc123`.
4. Click **Authorize & Enter**.
5. **Verify:**
   - In-app modal pops up: *"Update Account Password - New Security Policy: 12+ Characters Required"*.
   - Attempt entering `short`: "Minimum 12 characters" indicator remains unfulfilled; button is disabled.
   - Enter `MySecurePassword2026!` in both fields.
   - Click **Save Password & Enter**.
   - User enters portal; `auth.users` has the new password; legacy hash is wiped.

#### Persona 3: Cutover Email Reset Link
1. Run dry run and advance test clock past `cutover_at`.
2. Dispatch cutover batch using `/api/migration-cron`.
3. Check inbox for `test_cutover@digihust.tech`.
4. Confirm transactional template styling, absence of tracking redirects, and presence of 24h recovery link.
5. Click link -> Land on `https://www.digihust.tech/reset-password#access_token=...&type=recovery`.
6. Enter new password >= 12 chars -> Click **Update Password & Sign In**.
7. **Verify:** Success banner displayed; `legacy_accounts.status = 'completed'`.

#### Persona 4: Ignored Notice -> Reminder #2 Link
1. Test account starts with `status = 'reset_sent'`, `reminder_count = 1`.
2. Advance test clock to Cutover + 7 days.
3. Execute `/api/migration-cron`.
4. Verify account receives `reminder_2` template subject: *"Action required: Last reminder to set your DigiHust portal password"*.
5. `legacy_accounts.reminder_count` increments to 2.
6. Verify no 3rd reminder is ever dispatched (`reminder_count` capped at 2, total emails capped at 4).

#### Persona 5: Post-Window Self-Serve Recovery
1. Set `migration_config.window_days = 1` for testing, advance clock 2 days.
2. Execute `/api/migration-cron`.
3. Verify cron outputs `status: 'window_expired'` and skips the user.
4. User visits `/reset-password` or clicks "Forgot password" on `/portal/login`.
5. User enters email -> Receives standard 1-hour Supabase recovery email.
6. User sets password -> `mark_migration_complete()` RPC triggers -> Status set to `completed`.

---

## 2. Production Cutover Checklist

Execute these items sequentially during the scheduled maintenance window:

- [ ] **Step 1: Database Snapshot**
  - In Supabase Dashboard: Settings > Backups > Create Manual Backup.
  - Or via pg_dump:
    ```bash
    pg_dump --host=db.ptvchzbzokyumeizsuge.supabase.co -U postgres -d postgres -F c -b -v -f digihust_pre_migration_backup.dump
    ```

- [ ] **Step 2: DNS & Domain Verification**
  - Verify SPF, DKIM, and DMARC TXT records using `nslookup` (see `docs/migration/DNS_RECORDS.md`).
  - Confirm custom sender domain is verified in Resend / transactional provider.

- [ ] **Step 3: Apply Production Stopgap & Schema Migrations**
  - Run `supabase/migrations/20261017_004_production_stopgap.sql`.
  - Run `supabase/migrations/20261017_005_legacy_accounts_migration.sql`.
  - Verify `migration_config` row exists with `paused = true`.

- [ ] **Step 4: Deploy Frontend & API Functions to Vercel**
  - Deploy code changes to Vercel production.
  - Verify `RESEND_API_KEY`, `MIGRATION_FROM_EMAIL`, and `CRON_SECRET` are set in Vercel Environment Variables.

- [ ] **Step 5: Owner Verification & Approval in Admin Panel**
  - Log in to `/portal` as CEO or Management.
  - Navigate to **Auth Migration** tab.
  - Complete MFA step-up verification.
  - Review schedule dates (Notice at T-7 days, Cutover at T-0).
  - Click **Send Test Email to Me** -> Inspect all 4 templates in inbox.
  - Click **Execute Dry Run Simulation** -> Verify target account count.
  - Click **Approve & Start Campaign** -> Status switches to `CAMPAIGN ACTIVE`.

- [ ] **Step 6: Enable Live Sends Environment Flag**
  - In Vercel Environment Variables: set `MIGRATION_SEND_ENABLED=true`.
  - Redeploy or trigger Vercel Cron.

---

## 3. 10-Minute Rapid Rollback Procedure

If unexpected delivery failures, DNS misconfigurations, or authentication blockages occur, execute this rollback in under 10 minutes:

### ⏱ Minute 0–2: Activate Emergency Kill Switch
1. **Option A (Admin UI):** Open `/portal/migration` -> Click **Kill Switch (Pause)**.
2. **Option B (Direct SQL via Supabase SQL Editor):**
   ```sql
   UPDATE public.migration_config SET paused = true, updated_at = NOW() WHERE id = 1;
   ```
   *Effect: Instantly terminates all background email dispatches in current and future cron runs.*

### ⏱ Minute 2–4: Disable Live Send Flag
In Vercel Dashboard > Settings > Environment Variables:
- Set `MIGRATION_SEND_ENABLED` = `false`.
- Trigger redeployment or disable the `/api/migration-cron` cron job.

### ⏱ Minute 4–8: Re-enable Legacy Password Fallback
If any migrated accounts need immediate access restored to their previous legacy credentials:
```sql
-- Restore legacy passwords from backup or re-enable legacy hash check
UPDATE public.users u
SET password_hash = la.legacy_id -- or restore from backup table
FROM public.legacy_accounts la
WHERE u.id = la.legacy_id AND la.status <> 'completed';
```
*(The login bridge in `PortalLogin.tsx` automatically falls back to `loginWithMemberId` if `/api/legacy-login` is disabled or returns an error).*

### ⏱ Minute 8–10: Clear Erroneous Statuses & Reset Flags
```sql
-- Reset batch in progress back to pending for re-run after fix
UPDATE public.legacy_accounts
SET status = 'pending', notice_sent_at = NULL
WHERE status = 'notice_sent' AND completed_at IS NULL;
```
Verify that public website routes (`/`, `/services`, `/portfolio`, `/blog`, `/contact`) remain unaffected.
