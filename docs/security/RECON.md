# DigiHust Security Reconnaissance Report

> **Date:** 2026-10-17 | **Auditor:** Antigravity Security Agent | **Target:** https://www.digihust.tech

---

## 1. Architecture Overview

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Vite 5 + React 18 SPA (TypeScript) | Prerendered static HTML per route via `scripts/prerender.js` |
| Routing | react-router-dom v6 | Client-side, 40+ routes |
| Styling | Tailwind CSS v3.4.1 | `postcss.config.js` present |
| Build | `vite build && node scripts/prerender.js` | Outputs to `dist/` |
| Hosting | Vercel | `vercel.json` with headers, redirects, rewrites |
| Database | Supabase (PostgreSQL) | URL: `ptvchzbzokyumeizsuge.supabase.co` |
| Auth (portal) | **Custom SHA-256 + localStorage**  NOT Supabase Auth | ⚠️ HIGH RISK  see S3 |
| Email | EmailJS (client-side `@emailjs/browser`) | Public key in VITE_ vars |
| Notifications | WhatsApp via CallMeBot / Twilio / Webhook (server-side) | Keys via process.env |
| Realtime | Supabase Realtime broadcast channel | `lib/realtimeSync.ts` |
| CMS | Custom SiteContentManager backed by `site_content` Supabase table | |
| File Uploads | Supabase Storage buckets | Contact brief + CMS images |
| API Functions | Vercel Functions in `/api/` | `send-whatsapp.js`, `verify-email.js` |
| CI/CD | GitHub Actions → GitHub Pages (legacy) + Vercel (production) | |

---

## 2. Route Inventory

### 2a. Public Routes (indexable)

| Route | Component | Auth Required |
|-------|-----------|--------------|
| `/` | Home | None |
| `/services` | Services | None |
| `/services/saas-mvp-development` | SaasDevelopmentLanding | None |
| `/services/ai-workflow-automation` | AiAutomationLanding | None |
| `/services/brand-identity-design-system` | DesignSystemLanding | None |
| `/services/digital-marketing-seo` | DigitalMarketingLanding | None |
| `/services/cybersecurity-audit` | CybersecurityLanding | None |
| `/services/data-intelligence-analytics` | DataIntelligenceLanding | None |
| `/portfolio` | Work | None |
| `/portfolio/:slug` | CaseStudyDetail | None |
| `/how-it-works` | HowItWorks | None |
| `/about` | About | None |
| `/team` | Team | None |
| `/blog` | Blog | None |
| `/blog/:slug` | BlogPost | None |
| `/contact` | Contact | None  has file upload |
| `/apply` | Apply | None |
| `/careers` | Careers | None |
| `/privacy` | PrivacyPolicy | None |
| `/terms` | TermsOfService | None |
| `/editorial-policy` | EditorialPolicy | None |

### 2b. Semi-Public Routes (noindex, limited data exposure)

| Route | Component | Notes |
|-------|-----------|-------|
| `/verify/:certId` | CertificateVerification | Public lookup by cert ID |
| `/cert/:certId` | CertificateVerification | Same as above |
| `/verify/cert/:certId` | CertificateVerification | Same as above |
| `/project/track/:trackingToken` | ClientProjectTracker | Token-gated, no auth |

### 2c. Protected Portal Routes (auth required)

| Route | Component | Minimum Tier |
|-------|-----------|-------------|
| `/portal/login` | PortalLogin | None (login page) |
| `/portal` | PortalDashboard | member |
| `/portal/dashboard` | PortalDashboard | member |
| `/portal/assignments` | AssignmentWorkspace | member |
| `/portal/roster` | PeopleDirectoryView | group_leader+ |
| `/portal/people` | PeopleDirectoryView | group_leader+ |
| `/portal/directory` | PeopleDirectoryView | group_leader+ |
| `/portal/announcements` | AnnouncementsFeed | member |
| `/portal/certificates` | CertificateManager | manager+ |
| `/portal/cms` | SiteContentManager | ceo / cms_editor |

### 2d. Legacy Routes (redirect to `/portal/login`)

`/dashboard`, `/ledger`, `/roster`, `/admin`, `/admin/people`, `/admin/applicants`, `/admin/squads`

### 2e. Error / Utility Routes (noindex)

`/404`, `/500`, `/403`, `/401`, `/maintenance`, `/offline`

---

## 3. Environment Variables

| Variable | Prefix | Visibility | Purpose | Risk |
|----------|--------|-----------|---------|------|
| `VITE_SUPABASE_URL` | VITE_ | **PUBLIC** (in bundle) | Supabase project URL | Low  anon key enforces RLS |
| `VITE_SUPABASE_ANON_KEY` | VITE_ | **PUBLIC** (in bundle) | Supabase anonymous JWT | Low IF RLS is strict |
| `VITE_EMAILJS_SERVICE_ID` | VITE_ | **PUBLIC** | EmailJS service identifier | Medium  could abuse free quota |
| `VITE_EMAILJS_PUBLIC_KEY` | VITE_ | **PUBLIC** | EmailJS public key | Medium  same |
| `VITE_EMAILJS_CONTACT_TEMPLATE_ID` | VITE_ | **PUBLIC** | EmailJS contact template | Low |
| `VITE_EMAILJS_RESET_TEMPLATE_ID` | VITE_ | **PUBLIC** | EmailJS reset OTP template | Low |
| `VITE_SITE_URL` | VITE_ | **PUBLIC** | Canonical site URL | None |
| `CALLMEBOT_API_KEY` / `WHATSAPP_API_KEY` | none | **Server-side only** | WhatsApp via CallMeBot | Medium if leaked |
| `WHATSAPP_WEBHOOK_URL` | none | **Server-side only** | Webhook for lead notifications | Medium |
| `TWILIO_ACCOUNT_SID` | none | **Server-side only** | Twilio API auth | High if leaked |
| `TWILIO_AUTH_TOKEN` | none | **Server-side only** | Twilio API auth | **Critical if leaked** |
| `TWILIO_WHATSAPP_FROM` | none | **Server-side only** | Twilio sender number | Low |

**Finding:** No `service_role` key found in source. No `VITE_` leakage of server secrets found.  
**Finding:** `.env` file contains the **real Supabase anon key** and EmailJS keys  this file is correctly `.gitignore`'d but committed `.env.example` also contains the real production anon key (not a placeholder).

---

## 4. Supabase Tables

| Table | RLS Enabled | Current Policies | Risk |
|-------|------------|-----------------|------|
| `public.users` | ✅ | `FOR ALL USING (true)`  anon full access | **CRITICAL** |
| `public.leads` | ✅ | `FOR ALL USING (true)` + anon insert | **HIGH**  anon can read all leads |
| `public.projects` | ✅ | `FOR ALL USING (true)` | **CRITICAL**  anon can read/write |
| `public.assignments` | ✅ | `FOR ALL USING (true)` | **CRITICAL** |
| `public.certificates` | ✅ | `FOR ALL USING (true)` + public read | HIGH  over-permissive write |
| `public.announcements` | ✅ | `FOR ALL USING (true)` | **CRITICAL** |
| `public.site_content` | ✅ | `FOR ALL USING (true)` + public read | **CRITICAL**  anon can write CMS |
| `public.audit_logs` | ✅ | `FOR ALL USING (true)` | **CRITICAL**  anon can read/write |

**Supabase Storage Buckets:** avatars (seen in URLs)  policy status unknown from code.

---

## 5. Authentication System

⚠️ **CRITICAL FINDING:** The portal does NOT use Supabase Auth. It uses a **custom SHA-256 client-side hash** stored in `localStorage`.

- `lib/crypto.ts`: Uses `WebCrypto.subtle.digest('SHA-256', password + hardcoded_salt)` for hashing
- `quickHashSync()`: Uses a 32-bit djb2-like hash (not cryptographic!) for synchronous operations
- The hardcoded salt `'digihust_prod_salt_2026_sec_master'` is **committed in source code**
- Hashed passwords stored in the `public.users` table `password_hash` column
- Default credential seeded in SQL: `DigiHust@2026` (SHA-256 hash committed in `schema.sql`)
- Auth state persisted to `localStorage`: `digihust_portal_is_authenticated`, `digihust_portal_current_user`
- `isAuthenticated` flag read from localStorage → **can be trivially forged**
- OTP reset flow stores reset payload in `sessionStorage` keyed by email

---

## 6. Forms and Upload Paths

| Form | Location | Uploads | Backend Validation |
|------|----------|---------|------------------|
| Contact / Quote | `/contact` → `Contact.tsx` | Yes  PDF brief to Supabase Storage | ❌ Client-only |
| Newsletter signup | Footer (`Footer.tsx`) | No | ❌ localStorage only |
| Apply form | `/apply` → `Apply.tsx` | Unknown | Unknown |
| CMS image upload | `/portal/cms` → `SiteContentManager.tsx` | Yes  images to Supabase Storage | ❌ Client-only |
| Avatar upload | PeopleDirectory | Yes  to Supabase Storage `avatars` bucket | ❌ Client-only |
| PDF template | PdfTemplateEditorModal | No (PDF generated client-side) | N/A |

---

## 7. Third-Party Services

| Service | Purpose | Credentials in Code? |
|---------|---------|---------------------|
| Supabase | DB, Auth (not used), Storage, Realtime | VITE_ (anon key only) |
| EmailJS | Password reset OTP, contact notification emails | VITE_ (public key) |
| CallMeBot | WhatsApp notifications (optional) | process.env (server-side) |
| Twilio | WhatsApp (optional fallback) | process.env (server-side) |
| @splinetool/react-spline | 3D scene rendering | None |
| framer-motion | Animations | None |
| pdf-lib | Certificate PDF generation | None |
| qrcode / qrcode.react | QR codes for certificates | None |

---

## 8. API Endpoints

| Endpoint | File | Method | Auth Check | CORS | Risk |
|----------|------|--------|-----------|------|------|
| `POST /api/send-whatsapp` | `api/send-whatsapp.js` | POST/GET/OPTIONS | ❌ None | `*` wildcard | **HIGH**  unauthenticated, public |
| `GET /api/verify-email` | `api/verify-email.js` | GET/POST/OPTIONS | ❌ None | `*` wildcard | **MEDIUM**  email oracle, abuse |

---

## 9. Git / Source Control Findings

- `.gitignore` correctly excludes `.env` and `.env.*`
- No `.git` folder exposed in `public/`  
- **`.env.example` contains REAL production keys**  not placeholders (finding for S1/S2)
- Large number of patch `.cjs` files in root: `patch.cjs`, `patch_about.cjs`, etc.  likely historical one-off scripts, should be cleaned up
- `payout_calculator.html` in root  standalone HTML with unknown content

---

## 10. Exposed File Risk Assessment

Probing these paths must return 404 (not index.html content leaking info):
`/.env`, `/.git/HEAD`, `/package.json`, `/vercel.json`, `/src/main.tsx`, `/*.map`, `/supabase/`, `/scripts/prerender.js`

Current Vercel rewrite: `/((?!api/).*)` → `/index.html`  all non-API paths serve index.html or prerendered HTML, meaning `/package.json` would serve React app (acceptable but not ideal).

---

## 11. Missing / Incomplete Items (Pre-Audit Baseline)

- No `build.sourcemap` explicitly set to `false` in `vite.config.js`
- No DOMPurify  blog/CMS rich text not sanitized
- CSP is in **Report-Only** mode (not enforcing)
- No rate limiting on `/api/` functions
- CORS on both API functions is `Access-Control-Allow-Origin: *`
- No `X-Robots-Tag: noindex` header on private routes
- `robots.txt` in `dist/` has duplicate/malformed entries (two `User-agent: *` blocks)
- Sitemap `lastmod` is always "today"  not real modification time
- Sitemap includes no portfolio detail pages or blog posts
- `.env.example` has real production values, not placeholders
