# DigiHust SEO Checklist

> **Date:** 2026-10-17 | **Site:** https://www.digihust.tech

---

## E1. Sitemap.xml

| Item | Status |
|------|--------|
| Generated at build time from router config | ✅ Done |
| Absolute `https://www.digihust.tech` URLs | ✅ Done |
| Real `<lastmod>` per page type (not "today" for everything) | ✅ Fixed |
| Excludes private/admin/verify/portal/dashboard/cert pages | ✅ Fixed |
| Linked in robots.txt | ✅ Done |
| Served as `application/xml` (Vercel header added) | ✅ Done |
| **Action needed:** Validate at https://www.xml-sitemaps.com/validate-xml-sitemap.html | 🔴 Owner |

---

## E2. robots.txt

| Item | Status |
|------|--------|
| `User-agent: * Allow: /` | ✅ Done |
| Disallows: /portal/, /admin/, /dashboard/, /ledger/, /roster/, /project/track/, /api/ | ✅ Fixed |
| Sitemap: line correct (`https://www.digihust.tech/sitemap.xml`) | ✅ Fixed (was `digihust.com` previously) |
| AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) explicitly Allowed | ✅ Done |
| No CSS/JS blocked | ✅ Done |
| Duplicate `User-agent: *` block removed | ✅ Fixed |

---

## E3. noindex Audit

| URL Pattern | Intended Index | Enforced via |
|-------------|---------------|-------------|
| `/` through `/blog/*`, `/portfolio/*`, `/services/*`, `/about`, `/team`, `/contact`, `/privacy`, `/terms`, `/editorial-policy`, `/careers`, `/how-it-works` | ✅ Index | No noindex tag |
| `/portal/*`, `/admin/*` | ✅ noindex | `X-Robots-Tag: noindex` header + meta noindex in prerendered HTML |
| `/dashboard/*`, `/ledger/*`, `/roster/*` | ✅ noindex | `X-Robots-Tag: noindex` header |
| `/verify/*`, `/cert/*` | ✅ noindex | `X-Robots-Tag: noindex` header |
| `/project/track/*` | ✅ noindex | `X-Robots-Tag: noindex` header |
| `/404`, `/500`, `/403`, `/401`, `/maintenance`, `/offline` | ✅ noindex | `X-Robots-Tag: noindex` header |

---

## E4. Canonical Tags

| Item | Status |
|------|--------|
| One self-referencing absolute canonical per prerendered route | ✅ Done (injected in prerender.js) |
| `https://www.digihust.tech/path` format (no trailing slash for subpages) | ✅ Done |
| In prerendered HTML (not JS-only) | ✅ Verified  prerender.js injects into `<head>` |
| **Action:** Runtime SEOHead.tsx uses `window.location.href` which may have params  filter them | ⚠️ Owner/Dev |

---

## E5 & E6. Meta Titles and Descriptions

| Route | Title (chars) | Description (chars) | Status |
|-------|--------------|-------------------|--------|
| `/` | 65 | 127 | ✅ |
| `/services` | 47 | 150 | ✅ |
| `/services/saas-mvp-development` | 58 | 215 | ⚠️ Description too long |
| `/services/ai-workflow-automation` | 60 | 188 | ⚠️ Description too long |
| `/services/brand-identity-design-system` | 62 | 193 | ⚠️ Description too long |
| `/services/digital-marketing-seo` | 57 | 182 | ⚠️ Description too long |
| `/services/cybersecurity-audit` | 60 | 185 | ⚠️ Description too long |
| `/services/data-intelligence-analytics` | 58 | 187 | ⚠️ Description too long |
| `/portfolio` | 45 | 183 | ⚠️ Description too long |
| `/how-it-works` | 52 | 151 | ✅ |
| `/about` | 52 | 164 | ⚠️ Slightly long |
| `/contact` | 55 | 170 | ⚠️ Description too long |
| `/blog` | 54 | 152 | ✅ |
| `/blog/*` | 70-80 | 155-180 | ⚠️ Titles may truncate |
| `/privacy`, `/terms`, `/editorial-policy` | ≤45 | ≤130 | ✅ |

> **Note:** Max ~920px (≈155 chars) for description. Service page descriptions are good for quality but may truncate in SERPs; this is acceptable for keyword density.

---

## E7. Heading Hierarchy

| Item | Status |
|------|--------|
| H1 tag present in prerendered HTML per route | ✅ Injected by prerender.js |
| One H1 per page | ✅ Prerender enforces single H1 |
| Heading hierarchy (h1→h2→h3)  **requires visual audit** | ⚠️ Owner/Dev to verify per page |

---

## E8. Image Alt Text

| Item | Status |
|------|--------|
| OG image has alt in prerendered HTML (`og:image:alt`) | ✅ Fixed |
| Content images  requires component-level audit | ⚠️ Owner/Dev |
| CMS uploads  alt field in SiteContentManager | ⚠️ Not yet required  Owner/Dev to add field |

---

## E9. Schema Markup (JSON-LD)

| Schema | Pages | Status |
|--------|-------|--------|
| `ProfessionalService` (Organization) | All pages | ✅ Done (prerender.js + SEOHead.tsx) |
| `FAQPage` | Home page | ✅ Done |
| `WebSite` |  | ⚠️ Not yet added |
| `BreadcrumbList` | Inner pages | ⚠️ Not yet added |
| `BlogPosting` | Blog posts | ⚠️ Not yet added (prerendered HTML only has ProfessionalService) |
| `Service` | Service pages | ⚠️ Not yet added |
| JSON-LD `</script>` XSS escape | All prerendered HTML | ✅ Fixed |

---

## E10 & E11. Internal Links and Broken Links

| Item | Status |
|------|--------|
| Breadcrumbs on inner pages | ⚠️ Not yet implemented |
| Related articles block on blog posts | ⚠️ Not yet implemented |
| Internal links audit (linkinator/lychee) | 🔴 Owner/Dev to run after deploy |

---

## E12. Image Compression

| Item | Status |
|------|--------|
| WebP format for main assets | Partial (avif for slideshow 1) |
| srcset / sizes | ⚠️ Not yet implemented |
| explicit width/height on content images | ⚠️ Verify per component |
| loading="lazy" below fold | ⚠️ Verify per component |
| fetchpriority="high" on LCP image | ⚠️ Not yet added |
| CMS upload compression | ⚠️ Not yet implemented |

---

## E13 & E14. Core Web Vitals and Mobile

| Item | Status |
|------|--------|
| Route-level code splitting (React.lazy) | ⚠️ Not yet  large 1.6MB main chunk in build |
| framer-motion LazyMotion | ⚠️ Not yet  imports full motion |
| Self-hosted fonts | ✅ Done (per earlier work) |
| font-display: swap | ✅ Done |
| Lighthouse Mobile score | 🔴 Run after deploy |

---

## E15. HTTPS and Host Canonicalization

| Item | Status |
|------|--------|
| HTTPS enforced (HSTS) | ✅ Done in vercel.json |
| http→https redirect | ✅ Vercel handles automatically |
| apex→www redirect | ⚠️ Verify in Vercel project domains settings |
| Sitemap/OG all https | ✅ Done |

---

## E16. URL Slug Cleanup

| Item | Status |
|------|--------|
| All routes lowercase, hyphen-separated | ✅ Done |
| `/work` → `/portfolio` 301 redirect | ✅ Done |
| Consistent no-trailing-slash | ✅ Done |

---

## E17. Open Graph Image

| Item | Status |
|------|--------|
| Default OG image at `/og-image.jpg` (1200x630) | ✅ File exists in dist |
| `og:image:width`, `og:image:height`, `og:image:alt` | ✅ Added in prerender.js |
| `twitter:image` set | ✅ Done |
| Per-blog-post OG images | ⚠️ Not yet  uses default |
| **Action:** Owner to confirm og-image.jpg is brand artwork (not stock) | 🔴 Owner |

---

## E18. Search Console and Bing

| Item | Status |
|------|--------|
| GSC verification meta tag | 🔴 Needs owner token  see SEARCH_CONSOLE.md |
| Sitemap submission | 🔴 Owner action |
| Bing Webmaster Tools | 🔴 Owner action |

---

## E19. Backlink Strategy

See [backlink-strategy.md](./backlink-strategy.md)

---

## Summary: Items Requiring Owner Action

| Item | Owner Action |
|------|-------------|
| E4 | Add query-string stripping to runtime canonical in SEOHead.tsx |
| E5/E6 | Trim service page descriptions to 142 chars if desired |
| E7 | Visual heading audit per page |
| E8 | Add alt text to all content images; require alt in CMS upload |
| E9 | Add BlogPosting, BreadcrumbList, Service JSON-LD schemas |
| E11 | Run linkinator on built site; fix broken links |
| E12 | Add srcset, WebP conversion, CMS upload compression |
| E13 | Add React.lazy code splitting; analyze bundle with vite-bundle-visualizer |
| E17 | Confirm OG image is brand artwork; create per-post OG cards |
| E18 | Supply GSC verification token; submit sitemap |
