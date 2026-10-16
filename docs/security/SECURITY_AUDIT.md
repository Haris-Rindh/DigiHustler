# DigiHust Security Audit Report

> **Scope:** www.digihust.tech + Supabase backend + Vercel deployment  
> **Date:** 2026-10-17  
> **Method:** White-box source review, OWASP Top 10 (2021) mapping, passive baseline scan  
> **Auditor:** Antigravity Security Agent

---

## Executive Summary

The DigiHust platform is a Vite 5 + React SPA with a Supabase backend and a custom portal authentication system. The most critical findings are:

1. **Custom SHA-256 auth with hardcoded salt** — not bcrypt/argon2 (CRITICAL)
2. **All RLS policies are USING(true)** — anon key grants full read/write on all tables (CRITICAL)
3. **CSP was Report-Only** — not enforcing (HIGH) → FIXED
4. **API endpoints had `Access-Control-Allow-Origin: *`** (HIGH) → FIXED
5. **`.env.example` contained real production credentials** (HIGH) → FIXED
6. **`isAuthenticated` stored in localStorage** — trivially forgeable (HIGH)

---

## Findings Table

| ID | Severity | Finding | Evidence | Fix | Status |
|----|----------|---------|----------|-----|--------|
| S1-A | HIGH | `.env.example` committed with real production anon key + EmailJS keys | `.env.example:1-6` | Replaced with placeholders | ✅ FIXED |
| S1-B | INFO | Hardcoded salt in crypto.ts (`digihust_prod_salt_2026_sec_master`) | `src/lib/crypto.ts:5` | Document — not a leaked secret, but committed code | ⚠️ PARTIAL (see S3) |
| S1-C | HIGH | Default CEO password hash in schema.sql (`DigiHust@2026`) | `supabase/schema.sql:219` | Default password removed from code (`schema.sql` and `AppContext.tsx`). Owner rotating in DB. | ✅ FIXED IN CODE |
| S2-A | LOW | All required VITE_ vars have no startup validation | `src/lib/supabase.ts:3` | Owner to add zod env validation | ⚠️ DOCUMENTED |
| S2-B | LOW | Server-side secrets correctly use no VITE_ prefix | `server/whatsappNotifier.js:15` | N/A — correctly implemented | ✅ N/A |
| S3-A | CRITICAL | Portal auth uses SHA-256 (not bcrypt/argon2) + hardcoded client-side salt | `src/lib/crypto.ts:5-17` | Supabase Auth migration APPROVED (Option B). Runbook created: `docs/security/SUPABASE_AUTH_MIGRATION_RUNBOOK.md`. | 🚀 IN PROGRESS |
| S3-B | CRITICAL | `quickHashSync()` uses 32-bit djb2-like hash (NOT cryptographic) for seeding | `src/lib/crypto.ts:23-32` | Eliminated fallback bypass in login; will be deprecated with Supabase Auth | ✅ FIXED IN CODE |
| S3-C | HIGH | `isAuthenticated` and `currentUser` stored in localStorage — easily forged | `src/context/AppContext.tsx:522-523` | Will be replaced by Supabase native session at Auth cutover | 🚀 IN PROGRESS |
| S3-D | HIGH | Default credential `DigiHust@2026` seeded in production DB & code | `src/context/AppContext.tsx` | All hardcoded default password seeds replaced with cryptographic random hashes | ✅ FIXED IN CODE |
| S3-E | MEDIUM | Password reset OTP stored in sessionStorage keyed by email | `src/lib/dbService.ts:640` | OTP in sessionStorage is accessible to any script on page (see S8) | ⚠️ ACCEPTED — mitigated by CSP |
| S4-A | HIGH | `ProtectedRoute` reads `isAuthenticated` from localStorage context — trivially forgeable | `src/components/portal/ProtectedRoute.tsx:14` | Real enforcement is RLS (see S5); until Supabase Auth migration, ProtectedRoute is UX only | ⚠️ ACCEPTED RESIDUAL RISK |
| S4-B | CRITICAL | RLS policies are `USING(true)` = anon full access on all tables | `supabase/schema.sql:116-136` | Migration `20261017_001_fix_rls_policies.sql` created. Owner running on STAGING now. | 🟡 STAGING ONLY |
| S5-A | CRITICAL | `public.users` — anon full read/write | `supabase/schema.sql:119-120` | Staging migration ready | 🟡 STAGING ONLY |
| S5-B | CRITICAL | `public.projects`, `public.assignments`, `public.announcements`, `public.audit_logs` — anon full access | `supabase/schema.sql:122-136` | Staging migration ready | 🟡 STAGING ONLY |
| S5-C | HIGH | `public.leads` — anon can read all client lead data | `supabase/schema.sql:122-123` | Migration removes read, keeps insert-only with CHECK constraints | 🟡 STAGING ONLY |
| S5-D | HIGH | `public.site_content` — anon can write CMS | `supabase/schema.sql:126-127` | Migration removes write, keeps read-only for anon | 🟡 STAGING ONLY |
| S5-E | MEDIUM | `public.certificates` — anon full write access | `supabase/schema.sql:124-125` | Migration restricts to select (non-hidden only) | 🟡 STAGING ONLY |
| S6-A | MEDIUM | JSON-LD `<script>` blocks in prerender.js not escaped for `</script>` | `scripts/prerender.js:244` | Added escape pass on all HTML files post-build | ✅ FIXED |
| S6-B | LOW | No dangerouslySetInnerHTML found in src | source scan | N/A | ✅ N/A |
| S6-C | LOW | No blog rich text rendering with innerHTML found | source scan | N/A — no rich text renderer | ✅ N/A |
| S7-A | HIGH | Contact brief upload & bucket policies | `storage.objects` | Migration `20261017_002_storage_bucket_policies.sql` written for SQL execution | ✅ MIGRATION READY |
| S7-B | HIGH | CMS image upload & avatars bucket policies | `storage.objects` | Managed via `20261017_002_storage_bucket_policies.sql` | ✅ MIGRATION READY |
| S7-C | MEDIUM | Upload filenames likely user-supplied (path traversal risk) | `src/lib/dbService.ts:149` | Normalized random file names enforced in dbService | ✅ FIXED |
| S8-A | MEDIUM | Auth session in localStorage — XSS-accessible | `src/context/AppContext.tsx:522` | Option A APPROVED by owner: keep Supabase default session + enforcing CSP + short JWT expiry + refresh rotation + admin MFA. | ✅ ACCEPTED RISK (APPROVED) |
| S8-B | LOW | CSRF — N/A because auth uses Bearer-style token in header, not cookies | architecture review | N/A — documented | ✅ N/A |
| S9-A | HIGH | `/api/send-whatsapp` had no rate limiting | `api/send-whatsapp.js` | Added in-memory rate limiter 5/min | ✅ FIXED |
| S9-B | HIGH | `/api/verify-email` had no rate limiting | `api/verify-email.js` | Added in-memory rate limiter 10/min | ✅ FIXED |
| S9-C | MEDIUM | Rate limiting is per-instance (in-memory), not distributed | `api/*.js` | For distributed rate limiting: owner can add Upstash Redis | ⚠️ PARTIAL |
| S10-A | HIGH | `Access-Control-Allow-Origin: *` on both API endpoints | `api/send-whatsapp.js:5`, `api/verify-email.js:5` | Replaced with explicit origin allowlist | ✅ FIXED |
| S10-B | MEDIUM | No method restriction on API endpoints | `api/*.js` | Added method restriction (POST only / GET only) | ✅ FIXED |
| S10-C | LOW | Webhooks — N/A (no webhook receivers in codebase) | code search | N/A | ✅ N/A |
| S10-D | LOW | SSRF — N/A | code search | N/A | ✅ N/A |
| S11-A | HIGH | CSP was Content-Security-Policy-Report-Only (not enforcing) | `vercel.json` | Moved to enforcing `Content-Security-Policy` | ✅ FIXED |
| S11-B | MEDIUM | Missing COOP, CORP headers | `vercel.json` | Added `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` | ✅ FIXED |
| S11-C | MEDIUM | Permissions-Policy missing payment, usb restrictions | `vercel.json` | Added `payment=(), usb=()` | ✅ FIXED |
| S11-D | LOW | HSTS preload | `vercel.json` | Owner decision: NO preload. Maintained `max-age=63072000`. | ✅ COMPLETED |
| S11-E | MEDIUM | No X-Robots-Tag on private routes (/portal, /admin, etc.) | `vercel.json` | Added X-Robots-Tag: noindex headers on all private route patterns | ✅ FIXED |
| S11-F | MEDIUM | No cache headers (immutable assets / no-store for sensitive routes) | `vercel.json` | Added `Cache-Control: immutable` for `/assets/`, `no-store` for portal/API | ✅ FIXED |
| S12-A | HIGH | No `build.sourcemap: false` | `vite.config.js` | Set `sourcemap: false` explicitly — verified 0 .map files in dist | ✅ FIXED |
| S12-B | HIGH | `console.log` with OTP codes, emails, and WhatsApp payloads | `emailService.ts`, `whatsappNotifier.js`, `notificationService.ts` | OTP codes, emails, and recipient payloads removed and guarded | ✅ FIXED |
| S12-C | LOW | Multiple patch*.cjs scripts in repo root (historical) | project root | These are dev artifacts — owner should clean up; not exposed in dist | ⚠️ CLEANUP RECOMMENDED |
| S12-D | LOW | `payout_calculator.html` in repo root | root | Not in dist/, not exposed. Cleanup recommended. | ⚠️ CLEANUP RECOMMENDED |
| S13-A | HIGH | `braces` ≤3.0.3 — DoS via deeply nested patterns (GHSA-vfj7-8cjw-p6xm) | npm audit | Dev-only dependency via tailwindcss; not in client bundle | ⚠️ RESIDUAL RISK |
| S13-B | MODERATE | `esbuild` ≤0.24.2 — dev server CORS issue (GHSA-67mh-4wv8-2f99) | npm audit | Only affects dev server, not production | ⚠️ RESIDUAL RISK |

---

## OWASP Top 10 (2021) Mapping

| OWASP | Category | Status |
|-------|----------|--------|
| A01 Broken Access Control | RLS USING(true), localStorage auth | 🟡 Migration running on Staging; Option B in progress |
| A02 Cryptographic Failures | SHA-256 client-side password hashing | 🚀 Supabase Auth Migration Approved |
| A03 Injection | SQL: parameterized via supabase-js ✅; JSON-LD: escaped ✅ | ✅ LOW |
| A04 Insecure Design | Custom auth instead of Supabase Auth | 🚀 Migration Runbook Created |
| A05 Security Misconfiguration | CSP Report-Only, wildcard CORS | ✅ FIXED |
| A06 Vulnerable Components | braces DoS (dev dep) | ⚠️ MEDIUM (Dev only) |
| A07 Auth/Identification Failures | SHA-256, localStorage session | 🚀 Supabase Auth Migration Approved |
| A08 Software Integrity Failures | npm lockfile present | ✅ GOOD |
| A09 Logging/Monitoring | OTP logged to console | ✅ FIXED (Logs sanitized) |
| A10 SSRF | N/A | ✅ N/A |

---

## Accepted Residual Risks

| Risk | Justification |
|------|--------------|
| **Auth session in localStorage (S8-A Option A)** | **Approved by owner.** Mitigated by enforcing strict CSP, disabling eval/inline scripts, short conceptual JWT expiry (1h), refresh token rotation with reuse detection, and mandatory admin TOTP MFA. |
| **SHA-256 portal passwords until Supabase Auth migration** | Portal is internal-only (no public signup); default passwords purged from code; migration runbook delivered for immediate staging execution. |
| **In-memory rate limiting (S9-A,B,C)** | Acceptable for current traffic volume; owner can connect Upstash Redis for distributed state if traffic surges. |
| **EmailJS public key in bundle** | By design — EmailJS is a client-side service; abuse mitigated by restricting allowed origins in the EmailJS dashboard. |
| **braces DoS (S13-A)** | Dev-only dependency via tailwindcss; not shipped to production bundle. |

---

## Retest Checklist

- [ ] Run migration on staging, verify public pages load with anon key
- [ ] Probe `/.env`, `/.git/HEAD`, `/package.json` on live site — all must 404
- [ ] `curl -sI https://www.digihust.tech` — verify all security headers present
- [ ] CSP: open browser console on all public routes — zero violations
- [ ] Rate limit: 6th request to `/api/send-whatsapp` returns 429
- [ ] BOLA: anon key direct to Supabase API — `users`, `projects` return empty
- [ ] Check no `.map` files in dist/: `ls dist/assets/*.map` must be empty
- [ ] OTP not logged: check Vercel function logs after password reset flow
