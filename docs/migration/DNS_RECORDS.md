# Transactional Email Infrastructure & DNS Authentication Guide

**Domain:** `digihust.tech`  
**From Sender:** `DigiHust Security <security@digihust.tech>`  
**Reply-To:** `support@digihust.tech`  
**Recommended Providers:** Resend (Primary), Brevo, or Postmark  

---

## 1. Required DNS Records for `digihust.tech`

Add the following DNS records to your DNS manager (Cloudflare, Namecheap, GoDaddy, or Vercel DNS):

### A. SPF (Sender Policy Framework)
Authorizes the transactional email server to send emails on behalf of `digihust.tech`.

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **TXT** | `@` (or `digihust.tech`) | `v=spf1 include:amazonses.com include:resend.com ~all` | Auto / 3600 |

*Note: If you already have an existing SPF record (e.g. for Google Workspace or Zoho), append `include:resend.com` before `~all`. Never publish more than one TXT SPF record per domain.*

---

### B. DKIM (DomainKeys Identified Mail)
Cryptographically signs every outbound message with a private key. The receiver uses the public key in your DNS to verify the message was not modified in transit.

#### Primary Resend DKIM Key
| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `resend._domainkey` | `dkim.resend.com.` | Auto / 3600 |
| **CNAME** | `resend2._domainkey` | `dkim2.resend.com.` | Auto / 3600 |

*(Exact CNAME tokens are generated inside your Resend Dashboard > Domains > `digihust.tech`)*

---

### C. DMARC (Domain-based Message Authentication, Reporting & Conformance)
Guarantees anti-spoofing policy enforcement and protects domain reputation against phishing.

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **TXT** | `_dmarc` (or `_dmarc.digihust.tech`) | `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc@digihust.tech; aspf=s; adkim=s` | Auto / 3600 |

**Policy Explanation:**
- `p=reject`: Instructs Gmail, Outlook, and Yahoo to reject outright any message that fails SPF/DKIM alignment.
- `pct=100`: Applies strict enforcement to 100% of outbound traffic.
- `aspf=s` / `adkim=s`: Strict SPF and DKIM alignment mode.
- `rua=mailto:dmarc@digihust.tech`: Aggregate reports sent to your dedicated DMARC inbox.

---

### D. Custom Return-Path / Mail From (Bounces)
Ensures bounce notifications return to a dedicated subdomain rather than cluttering your main root domain.

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **MX** | `bounces` (or `bounces.digihust.tech`) | `feedback-smtp.us-east-1.amazonses.com` (Priority 10) | Auto / 3600 |
| **TXT** | `bounces` (or `bounces.digihust.tech`) | `v=spf1 include:amazonses.com ~all` | Auto / 3600 |

---

## 2. Deliverability Best Practices Configured

1. **Click Tracking OFF (`track_clicks: false`)**  
   Security and password reset links must **never** be rewritten through third-party redirect proxies (e.g., `click.resend.com` or `links.sendgrid.com`). Rewritten links trigger browser phishing warnings and enterprise spam filters.
2. **Open Tracking OFF (`track_opens: false`)**  
   Tracking pixels (1x1 invisible images) are blocked by Apple Mail Privacy Protection and often flag emails as unsolicited telemetry.
3. **Dual MIME Part (HTML + Plain-Text)**  
   Every automated dispatch generates both a responsive transactional HTML email and an RFC-compliant plain text alternative (`text/plain`).
4. **No Marketing Unsubscribe Headers**  
   These are strictly authenticated transactional notifications (security notices and password reset links). Transactional notices must not carry marketing unsubscribe links that could suppress critical security communications.

---

## 3. Webhook Endpoint for Bounce & Complaint Suppression

To protect domain reputation, configure the provider webhook in the dashboard:

- **Webhook URL:** `https://www.digihust.tech/api/email-webhook`
- **Events to Subscribe:**
  - `email.bounced` / `bounce`
  - `email.complained` / `complaint`
- **Webhook Secret:** Stored in environment variable `EMAIL_WEBHOOK_SECRET`.
- **Action:** Automatically marks the account in `legacy_accounts` as `status: 'suppressed'` to permanently cease outbound dispatches to invalid inboxes.

---

## 4. Verification Check Commands

Run the following commands in your shell to verify DNS propagation before cutover:

```bash
# Check SPF
nslookup -type=TXT digihust.tech

# Check DMARC
nslookup -type=TXT _dmarc.digihust.tech

# Check DKIM
nslookup -type=CNAME resend._domainkey.digihust.tech
```
