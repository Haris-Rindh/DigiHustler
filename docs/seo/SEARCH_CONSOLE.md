# Google Search Console & Bing Webmaster — Setup Guide

## Step 1: Google Search Console

### Option A: Domain Property (recommended — covers all subdomains)
1. Go to https://search.google.com/search-console → **Add Property**
2. Select **Domain** → enter `digihust.tech`
3. Copy the TXT record (e.g., `google-site-verification=xxxxxxxxxx`)
4. Add it to your domain's DNS at your registrar (not Vercel)
5. Click **Verify** (DNS propagation can take 24h)

### Option B: URL Prefix Property (simpler)
1. Go to https://search.google.com/search-console → **Add Property**
2. Select **URL Prefix** → enter `https://www.digihust.tech`
3. Choose **HTML tag** verification
4. Copy the meta tag: `<meta name="google-site-verification" content="TOKEN_HERE" />`
5. Add to `scripts/prerender.js` inside the `headInjection` string (before `</head>`)
6. Rebuild (`npm run build`) and deploy to Vercel
7. Return to GSC and click **Verify**

### Post-Verification Actions
1. **Submit Sitemap:** Sitemaps → Add → `https://www.digihust.tech/sitemap.xml` → Submit
2. **Request Indexing** for key pages (right-click in URL Inspection → Request Indexing):
   - `https://www.digihust.tech/`
   - `https://www.digihust.tech/services`
   - `https://www.digihust.tech/contact`
   - `https://www.digihust.tech/portfolio`
3. **Enable Reports:** Core Web Vitals, Page Experience, Enhancements

---

## Step 2: Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters
2. Click **Import from Google Search Console** (fastest path)
3. Sign in with your Google account → it imports verified properties + sitemap
4. Alternatively: manual add with BingSiteAuth.xml or meta tag

---

## Step 3: After Verification

- Monitor Core Web Vitals report weekly (target: all pages "Good")
- Check Coverage report for crawl errors
- Review Search Results report for impressions and clicks on key pages
- Set email alerts for coverage issues

---

## Verification Token Storage

When the owner provides the GSC meta tag token, add to `scripts/prerender.js`:

```js
// In the headInjection string, add:
<meta name="google-site-verification" content="OWNER_PROVIDES_TOKEN_HERE" />
```

Then rebuild and deploy.
