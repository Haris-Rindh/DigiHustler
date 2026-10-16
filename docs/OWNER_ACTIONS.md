# Owner Action Items  DigiHust Security & SEO Hardening

> **Generated:** 2026-10-17  
> Some items below require owner approval before agents can proceed. Others are purely owner/team actions.

---

## 🟢 DECISIONS RECORDED & IN PROGRESS

### 1. Supabase Auth Migration (APPROVED - Option B)
- **Status:** APPROVED. Runbook created: [`docs/security/SUPABASE_AUTH_MIGRATION_RUNBOOK.md`](./security/SUPABASE_AUTH_MIGRATION_RUNBOOK.md).
- **Includes:** DB backup procedure, custom SMTP setup, Supabase email OTP (replaces custom emailService), admin TOTP MFA, roles table + `is_admin()` security definer function, forced password reset for all users, cutover checklist, and rollback runbook.

### 2. Token Storage Strategy (APPROVED - Option A)
- **Status:** APPROVED. Storing Supabase session in client storage is recorded as an accepted residual risk in [`docs/security/SECURITY_AUDIT.md`](./security/SECURITY_AUDIT.md).
- **Compensating Controls Active:** Enforcing CSP, X-Frame-Options DENY, COOP same-origin-allow-popups, short 1h JWT access token expiration, refresh token family reuse detection, and admin TOTP MFA.

### 3. HSTS Configuration (NO Preload)
- **Status:** COMPLETED. `vercel.json` configured with `max-age=63072000` without preload or includeSubDomains until all subdomains are verified.

### 4. OTP and Sensitive Logging Purge
- **Status:** COMPLETED. Removed OTP codes, recipient email addresses, and payload logs from `emailService.ts`, `whatsappNotifier.js`, and `notificationService.ts`.

### 5. Default Passwords Purged from Code
- **Status:** COMPLETED. Removed `DigiHust@2026` and its hardcoded hash from `schema.sql` and `AppContext.tsx`. Invitations and imports now assign unique cryptographic temporary hashes with forced reset, and login blocks empty password bypasses.

---

## 🔴 ACTIVE OWNER ACTIONS (Execute Now)

### 1. Apply RLS Migration on STAGING First
Migration file: [`supabase/migrations/20261017_001_fix_rls_policies.sql`](../supabase/migrations/20261017_001_fix_rls_policies.sql).
Apply to your staging Supabase project and verify tests pass. Production deployment will occur during the Supabase Auth cutover window.

### 2. Apply Storage Bucket Policies Migration
Migration file: [`supabase/migrations/20261017_002_storage_bucket_policies.sql`](../supabase/migrations/20261017_002_storage_bucket_policies.sql).
Creates and configures `avatars`, `documents`, and `lead-attachments` buckets with proper size/mime limits and RLS policies on `storage.objects`.

### 3. Rotate the Default CEO Portal Password in Production Database
Owner action: In Supabase Dashboard → Table Editor → `users` table:
Update user `usr-ceo-1` to rotate the initial password or trigger password reset.
- **tailwindcss v4** (major): fixes the `braces` DoS vulnerability. Test first  breaking changes.
- **vite v8** (major): fixes the esbuild dev-server issue. Test first.

**→ Approve major upgrades?** Agents will test before committing.

---

## 🔴 OWNER/TEAM ACTION REQUIRED (Cannot be automated)

### 9. Supabase Storage Bucket Policies (S7-A,B,C)
Go to Supabase Dashboard → Storage → Buckets:
- **Contact briefs bucket:** Set to **PRIVATE**, allow only authenticated admin reads, restrict MIME types to PDF, DOCX, PNG, JPG. No public listing.
- **Avatars bucket:** Restrict uploads to authenticated users only, image types, max 5MB.
- **CMS images bucket:** Admin-only uploads, image types only, max 10MB.
- **All buckets:** Enable `Content-Disposition: attachment` for downloads, verify `X-Content-Type-Options: nosniff` is set.

### 10. Supabase Auth Settings (S3)
In Supabase Dashboard → Authentication → Settings:
- Enable email confirmation: ON
- Minimum password length: 12
- Enable "Leaked password protection" (if on Pro plan)
- Site URL: `https://www.digihust.tech`
- Redirect URL allowlist: `https://www.digihust.tech/**` (no wildcards beyond this)
- JWT expiry: 3600 (1 hour)
- Enable token refresh rotation

### 11. Stop Logging OTP Codes (S12-B)
In [`src/lib/emailService.ts:30`](../src/lib/emailService.ts#L30):
```
console.log(`[DigiHust Mailer] Sending password recovery OTP (${otpCode}) to ...`)
```
This logs the actual OTP to server logs. **Remove the OTP from this log immediately.**  
Agent can fix this  just say "go".

### 12. EmailJS Domain Restriction (S2)
Log into https://emailjs.com → Account → Services → Allowed Origins.  
Add ONLY: `https://www.digihust.tech`. Remove any wildcards.

### 13. Enable GitHub Secret Scanning (S1)
If repository is on GitHub:
- Settings → Code Security → Secret scanning: **Enable**
- Settings → Code Security → Push protection: **Enable**

### 14. Upstash Redis for Distributed Rate Limiting (S9-C)
Current rate limiting is in-memory per Vercel instance (resets on cold starts).  
For production-grade rate limiting: create an Upstash Redis account (free tier available) and install `@upstash/ratelimit`. Agent can implement once you provide the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

### 15. Admin MFA (S3)
Enable TOTP MFA for all admin/CEO accounts via Supabase Auth (requires migration #7 above) or a third-party auth provider.

---

## 🟡 SEO OWNER ACTIONS

### 16. Google Search Console Verification (E18)
See [SEARCH_CONSOLE.md](../seo/SEARCH_CONSOLE.md).  
Provide the HTML meta tag token to agent for injection into prerender.js.

### 17. OG Image Brand Check (E17)
Confirm `public/og-image.jpg` (1200×630) is brand artwork, not a stock photo.  
If you need a custom card: agent can generate a design brief.

### 18. apex→www Redirect (E15)
In Vercel Dashboard → Project → Domains:  
- Ensure `digihust.tech` (apex) redirects 301 to `www.digihust.tech`
- Confirm both domains are added and one is set as primary

### 19. Backlink Execution (E19)
See [backlink-strategy.md](../seo/backlink-strategy.md) for the 90-day plan.  
Start with: Google Business Profile, Clutch, LinkedIn Company Page.

### 20. Search Console Sitemap Submission
After GSC verification: Sitemaps → `https://www.digihust.tech/sitemap.xml` → Submit

---

## ✅ Already Done (No Action Needed)

| Item | What was done |
|------|-------------|
| CSP enforcing | Moved from Report-Only to enforcing Content-Security-Policy |
| CORS tightened | API endpoints now allowlist only (no wildcard) |
| Rate limiting | Basic rate limiting added to both /api endpoints |
| X-Robots-Tag | noindex headers on all private routes |
| Source maps | Disabled in vite.config.js (no .map files in production) |
| .env.example | Replaced real production keys with placeholders |
| Sitemap | Real lastmod dates, proper exclusions, correct sitemap URL |
| robots.txt | Clean, no duplicates, correct disallows |
| OG image tags | width/height/alt added to prerendered HTML |
| JSON-LD XSS | `</script>` sequences escaped in all prerendered JSON-LD |
| Security docs | RECON.md, SECURITY_AUDIT.md, ENV.md |
| SEO docs | SEO_CHECKLIST.md, SEARCH_CONSOLE.md, backlink-strategy.md |
| RLS migration | Written and ready (pending owner approval to run) |
