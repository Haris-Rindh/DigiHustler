const fs = require('fs');
const path = require('path');
let content = fs.readFileSync('scripts/prerender.js', 'utf8');

// 1. Replace baseUrl
content = content.replace(
  "const baseUrl = process.env.VITE_SITE_URL || '';",
  "const baseUrl = process.env.VITE_SITE_URL || 'https://www.digihust.tech';"
);

// 2. Add JSON-LD
const schemaInjection = `
    <meta name="twitter:description" content="\${route.description}" />
    <script type="application/ld+json">\${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'DigiHust',
      url: baseUrl,
      logo: \`\${baseUrl}/favicon.svg\`,
      image: \`\${baseUrl}/assets/slideshow 1-BsO_jRxb.avif\`,
      description: route.description,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'PK'
      }
    })}</script>
  \`;`;

content = content.replace(
  /<meta name="twitter:description" content="\$\{route\.description\}" \/>[\s\S]*?`;/,
  schemaInjection
);

// 3. Append Sitemap & Robots if not already there
if (!content.includes('sitemap.xml successfully generated!')) {
  content += `\n
// Generate Sitemap
console.log('Generating sitemap.xml...');
const sitemapUrl = process.env.VITE_SITE_URL || 'https://www.digihust.tech';
let sitemapContent = \`<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n\`;

routes.forEach((route) => {
  const isHome = route.path === '/';
  const priority = isHome ? '1.0' : route.path.startsWith('/services') ? '0.9' : '0.8';
  const loc = \`\${sitemapUrl}\${isHome ? '' : route.path}\`;
  sitemapContent += \`  <url>
    <loc>\${loc}</loc>
    <lastmod>\${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>\${priority}</priority>
  </url>\\n\`;
});

sitemapContent += \`</urlset>\`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf-8');
console.log('sitemap.xml successfully generated!');

// Generate Robots.txt
console.log('Generating robots.txt...');
const robotsContent = \`User-agent: *
Allow: /

# Private Routes
Disallow: /portal/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /project/track/

Sitemap: \${sitemapUrl}/sitemap.xml
\`;
fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsContent, 'utf-8');
console.log('robots.txt successfully generated!');
`;
}

fs.writeFileSync('scripts/prerender.js', content, 'utf8');
