# DigiHust Environment Variables — Reference

> **Security classification:** Internal. Do not share publicly.

## Variable Inventory

| Variable | Prefix | Location | Visibility | Purpose |
|----------|--------|----------|-----------|---------|
| `VITE_SUPABASE_URL` | `VITE_` | `.env` / Vercel | **Public** (in browser bundle) | Supabase project REST endpoint |
| `VITE_SUPABASE_ANON_KEY` | `VITE_` | `.env` / Vercel | **Public** (in browser bundle) | Supabase anonymous JWT — safe ONLY if RLS is correct |
| `VITE_EMAILJS_SERVICE_ID` | `VITE_` | `.env` / Vercel | **Public** | EmailJS service ID for contact/OTP emails |
| `VITE_EMAILJS_PUBLIC_KEY` | `VITE_` | `.env` / Vercel | **Public** | EmailJS SDK public key |
| `VITE_EMAILJS_CONTACT_TEMPLATE_ID` | `VITE_` | `.env` / Vercel | **Public** | EmailJS template for contact form |
| `VITE_EMAILJS_RESET_TEMPLATE_ID` | `VITE_` | `.env` / Vercel | **Public** | EmailJS template for OTP password reset |
| `VITE_SITE_URL` | `VITE_` | `.env` / Vercel | **Public** | Canonical URL for prerender and SEO |
| `CALLMEBOT_API_KEY` | none | Vercel dashboard only | **Server-side secret** | WhatsApp notifications via CallMeBot |
| `WHATSAPP_NUMBERS` | none | Vercel dashboard only | **Server-side secret** | Comma-separated target WhatsApp numbers |
| `WHATSAPP_WEBHOOK_URL` | none | Vercel dashboard only | **Server-side secret** | Automation webhook (n8n/Zapier etc.) |
| `TWILIO_ACCOUNT_SID` | none | Vercel dashboard only | **Server-side secret** | Twilio account identifier |
| `TWILIO_AUTH_TOKEN` | none | Vercel dashboard only | **Server-side secret** | Twilio auth token — treat as password |
| `TWILIO_WHATSAPP_FROM` | none | Vercel dashboard only | **Server-side secret** | Twilio WhatsApp sender number |

## Rules

1. **VITE_ prefix = ships to every visitor's browser.** Never use `VITE_` for secrets.
2. The Supabase **anon key** is safe with `VITE_` ONLY because it is a JWT with `role: anon` and Supabase Row Level Security strictly limits what `anon` can do. If RLS is misconfigured, the anon key becomes a master key.
3. The Supabase **service_role key** MUST NEVER appear in source code or Vercel environment variables with `VITE_`. It belongs only in secure server-side Supabase Edge Functions.
4. Local development: copy `.env.example` → `.env.local`. The `.env` file is git-ignored but `.env.example` is committed and must contain only placeholders.
5. Production secrets rotate via the Vercel dashboard → Settings → Environment Variables. Never paste in chat or code reviews.
6. Verify no secrets in dist: `grep -r "eyJ" dist/assets/` (Supabase JWT pattern) should return only the anon key, never a service_role key.

## Audit Status

- ✅ No `service_role` key found anywhere in source
- ✅ No Twilio credentials found in source (correctly server-side only)  
- ⚠️ **FIXED:** `.env.example` previously contained real production anon key and EmailJS keys — replaced with placeholders
- ✅ Server-side vars (`TWILIO_*`, `CALLMEBOT_*`, `WHATSAPP_*`) have no `VITE_` prefix
