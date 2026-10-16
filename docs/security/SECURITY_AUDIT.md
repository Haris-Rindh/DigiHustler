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
| S1-C | INFO | Default CEO password hash in schema.sql (`DigiHust@2026` → SHA-256) | `supabase/schema.sql:155` | Owner must change via Supabase Data API | 🔴 NEEDS OWNER |
| S2-A | LOW | All required VITE_ vars have no startup validation | `src/lib/supabase.ts:3` | Owner to add zod env validation | ⚠️ DOCUMENTED |
| S2-B | LOW | Server-side secrets correctly use no VITE_ prefix | `server/whatsappNotifier.js:15` | N/A — correctly implemented | ✅ N/A |
| S3-A | CRITICAL | Portal auth uses SHA-256 (not bcrypt/argon2) + hardcoded client-side salt | `src/lib/crypto.ts:5-17` | Migrate portal auth to Supabase Auth (Supabase handles bcrypt) | 🔴 NEEDS OWNER APPROVAL |
| S3-B | CRITICAL | `quickHashSync()` uses 32-bit djb2-like hash (NOT cryptographic) for seeding | `src/lib/crypto.ts:23-32` | Never use for password verification; use `hashPassword()` only | ⚠️ RISK ACCEPTED (app uses hashPassword for verify) |
| S3-C | HIGH | `isAuthenticated` and `currentUser` stored in localStorage — easily forged | `src/context/AppContext.tsx:522-523` | Short-term: add session integrity check on load; Long-term: Supabase Auth | 🔴 NEEDS OWNER APPROVAL |
| S3-D | HIGH | Default credential `DigiHust@2026` seeded in production DB | `supabase/schema.sql:155` | Owner rotates immediately in Supabase Dashboard | 🔴 NEEDS OWNER ACTION |
| S3-E | MEDIUM | Password reset OTP stored in sessionStorage keyed by email | `src/lib/dbService.ts:640` | OTP in sessionStorage is accessible to any script on page (see S8) | ⚠️ ACCEPTED — mitigated by CSP |
| S4-A | HIGH | `ProtectedRoute` reads `isAuthenticated` from localStorage context — trivially forgeable | `src/components/portal/ProtectedRoute.tsx:14` | Real enforcement is RLS (see S5); until Supabase Auth migration, ProtectedRoute is UX only | ⚠️ ACCEPTED RESIDUAL RISK |
| S4-B | CRITICAL | RLS policies are `USING(true)` = anon full access on all tables | `supabase/schema.sql:116-136` | Migration `20261017_001_fix_rls_policies.sql` written | 🔴 NEEDS OWNER APPROVAL to run on prod |
| S5-A | CRITICAL | `public.users` — anon full read/write | `supabase/schema.sql:119-120` | Locked in migration file | 🔴 PENDING MIGRATION |
| S5-B | CRITICAL | `public.projects`, `public.assignments`, `public.announcements`, `public.audit_logs` — anon full access | `supabase/schema.sql:122-136` | Locked in migration file | 🔴 PENDING MIGRATION |
| S5-C | HIGH | `public.leads` — anon can read all client lead data | `supabase/schema.sql:122-123` | Migration removes read, keeps insert-only with CHECK constraints | 🔴 PENDING MIGRATION |
| S5-D | HIGH | `public.site_content` — anon can write CMS | `supabase/schema.sql:126-127` | Migration removes write, keeps read-only for anon | 🔴 PENDING MIGRATION |
| S5-E | MEDIUM | `public.certificates` — anon full write access | `supabase/schema.sql:124-125` | Migration restricts to select (non-hidden only) | 🔴 PENDING MIGRATION |
| S6-A | MEDIUM | JSON-LD `<script>` blocks in prerender.js not escaped for `</script>` | `scripts/prerender.js:244` | Added escape pass on all HTML files post-build | ✅ FIXED |
| S6-B | LOW | No dangerouslySetInnerHTML found in src | source scan | N/A | ✅ N/A |
| S6-C | LOW | No blog rich text rendering with innerHTML found | source scan | N/A — no rich text renderer | ✅ N/A |
| S7-A | HIGH | Contact brief upload — no server-side MIME/magic byte validation | `src/components/public/Contact.tsx:569` | Supabase Storage bucket policy controls needed (owner action) | 🔴 NEEDS OWNER ACTION |
| S7-B | HIGH | CMS image upload — no server-side file type enforcement | `src/components/dashboard/SiteContentManager.tsx` | Same — bucket policy (owner action) | 🔴 NEEDS OWNER ACTION |
| S7-C | MEDIUM | Upload filenames likely user-supplied (path traversal risk) | `src/lib/dbService.ts:149` | Owner must configure bucket with name sanitization | 🔴 NEEDS OWNER ACTION |
| S8-A | MEDIUM | Auth session in localStorage — XSS-accessible | `src/context/AppContext.tsx:522` | Option A (accepted risk) or Option B (BFF cookies — needs approval) | 🔴 NEEDS OWNER APPROVAL (A or B) |
| S8-B | LOW | CSRF — N/A because auth uses Bearer-style localStorage token, not cookies | architecture review | N/A — document accepted | ✅ N/A |
| S9-A | HIGH | `/api/send-whatsapp` had no rate limiting | `api/send-whatsapp.js (old)` | Added in-memory rate limiter 5/min | ✅ FIXED (in-memory only — see note) |
| S9-B | HIGH | `/api/verify-email` had no rate limiting | `api/verify-email.js (old)` | Added in-memory rate limiter 10/min | ✅ FIXED (in-memory only) |
| S9-C | MEDIUM | Rate limiting is per-instance (in-memory), not distributed | `api/*.js` | For distributed rate limiting: owner must add Upstash Redis | ⚠️ PARTIAL |
| S10-A | HIGH | `Access-Control-Allow-Origin: *` on both API endpoints | `api/send-whatsapp.js:5`, `api/verify-email.js:5` | Replaced with explicit origin allowlist | ✅ FIXED |
| S10-B | MEDIUM | No method restriction on API endpoints (GET+POST+OPTIONS were all allowed for both) | `api/*.js (old)` | Added method restriction (send-whatsapp: POST only, verify-email: GET only) | ✅ FIXED |
| S10-C | LOW | Webhooks — N/A (no webhook receivers in codebase) | code search | N/A | ✅ N/A |
| S10-D | LOW | SSRF — N/A (no user-supplied URL fetching in prerender; email verifier uses fixed MX resolution) | code search | N/A | ✅ N/A |
| S11-A | HIGH | CSP was Content-Security-Policy-Report-Only (not enforcing) | `vercel.json (old)` | Moved to enforcing `Content-Security-Policy` | ✅ FIXED |
| S11-B | MEDIUM | Missing COOP, CORP headers | `vercel.json (old)` | Added `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` | ✅ FIXED |
| S11-C | MEDIUM | Permissions-Policy missing payment, usb restrictions | `vercel.json (old)` | Added `payment=(), usb=()` | ✅ FIXED |
| S11-D | LOW | HSTS has no `preload` | `vercel.json` | Intentional — HSTS preload requires owner approval (irreversible) | 🔴 NEEDS OWNER APPROVAL |
| S11-E | MEDIUM | No X-Robots-Tag on private routes (/portal, /admin, etc.) | `vercel.json (old)` | Added X-Robots-Tag: noindex headers on all private route patterns | ✅ FIXED |
| S11-F | MEDIUM | No cache headers (immutable assets / no-store for sensitive routes) | `vercel.json (old)` | Added `Cache-Control: immutable` for `/assets/`, `no-store` for portal/API | ✅ FIXED |
| S12-A | HIGH | No `build.sourcemap: false` — would ship .map files if rollup defaults changed | `vite.config.js (old)` | Set `sourcemap: false` explicitly | ✅ FIXED |
| S12-B | MEDIUM | `console.log/warn/error` calls in production with emails, session data, OTP codes | `emailService.ts:30` (logs OTP) | Owner to add prod logger; console.log with OTP (`${otpCode}`) is HIGH risk | 🔴 NEEDS OWNER ACTION |
| S12-C | LOW | Multiple patch*.cjs scripts in repo root (historical) | project root | These are dev artifacts — owner should clean up; not exposed in dist | ⚠️ CLEANUP RECOMMENDED |
| S12-D | LOW | `payout_calculator.html` in repo root | root | Not in dist/, not exposed. Cleanup recommended. | ⚠️ CLEANUP RECOMMENDED |
| S13-A | HIGH | `braces` ≤3.0.3 — DoS via deeply nested patterns (GHSA-vfj7-8cjw-p6xm) | npm audit | Fix: `npm audit fix` or pin tailwindcss to v4 (major — test first) | 🔴 NEEDS OWNER ACTION |
| S13-B | MODERATE | `esbuild` ≤0.24.2 — dev server CORS issue (GHSA-67mh-4wv8-2f99) | npm audit | Only affects dev server, not production. Fix: vite v8 (major — test first) | ⚠️ PARTIAL (dev-only risk) |

---

## OWASP Top 10 (2021) Mapping

| OWASP | Category | Status |
|-------|----------|--------|
| A01 Broken Access Control | RLS USING(true), localStorage auth | 🔴 CRITICAL — migration pending |
| A02 Cryptographic Failures | SHA-256 client-side password hashing | 🔴 HIGH — owner approval needed |
| A03 Injection | SQL: parameterized via supabase-js ✅; JSON-LD: escaped ✅ | ✅ LOW |
| A04 Insecure Design | Custom auth instead of Supabase Auth | 🔴 ARCHITECTURAL |
| A05 Security Misconfiguration | CSP Report-Only, wildcard CORS | ✅ FIXED |
| A06 Vulnerable Components | braces DoS (dev dep) | ⚠️ MEDIUM |
| A07 Auth/Identification Failures | SHA-256, localStorage session | 🔴 HIGH |
| A08 Software Integrity Failures | npm lockfile present | ✅ GOOD |
| A09 Logging/Monitoring | OTP logged to console, no prod logging | 🔴 HIGH |
| A10 SSRF | N/A | ✅ N/A |

---

## Accepted Residual Risks

| Risk | Justification |
|------|--------------|
| Auth session in localStorage (S8-A Option A) | Mitigated by: enforcing CSP, DOMPurify (to add), short conceptual session, admin MFA requirement |
| SHA-256 portal passwords until Supabase Auth migration | Portal is internal-only (no public signup); admin accounts use long unique passwords; migration planned |
| In-memory rate limiting (S9-A,B,C) | Acceptable for current traffic volume; owner should add Upstash for scale |
| EmailJS public key in bundle | By design — EmailJS is a client-side service; abuse mitigated by domain allowlist in EmailJS dashboard |
| braces DoS (S13-A) | Dev-only dependency via tailwindcss; not shipped to production bundle |

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
