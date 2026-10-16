import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('Dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const templatePath = path.join(distDir, 'index.html');
const templateHtml = fs.readFileSync(templatePath, 'utf-8');

const routes = [
  {
    path: '/',
    title: 'DigiHust  Digital Services Handled by Specialized Talent',
    description: 'One company, coordinated specialist talent. DigiHust delivers web engineering, design systems, AI automation and cybersecurity under one roof.',
    h1: 'Your Digital Work. Handled by Skilled People.',
    summary: 'From custom web development and UI/UX design to AI automations, growth marketing, and cybersecurity  DigiHust unites verified specialists into unified project squads.',
  },
  {
    path: '/services',
    title: 'Digital Services & Capabilities  DigiHust',
    description: 'Explore DigiHust full suite of capabilities: Full-Stack Web Development, UI/UX Design, AI Automation, Digital Marketing, Cybersecurity, and Business Intelligence.',
    h1: 'Services Built for Execution.',
    summary: 'Six specialized domains  delivered as one cohesive digital engine: Web Engineering, Design Systems, AI Automations, Growth Marketing, Cybersecurity, and BI Dashboards.',
  },
  {
    path: '/services/saas-mvp-development',
    title: 'Hire Dedicated SaaS & Web App Engineering Squads | DigiHust',
    description: 'Build and scale production-grade SaaS MVPs and custom web applications. Coordinated full-stack engineering squads delivering React, Next.js, Node.js, and cloud architectures under managed SLAs for US, UK, EU, and Gulf founders.',
    h1: 'Build Your SaaS MVP & Web Platform With a Managed Engineering Squad.',
    summary: 'Full-stack engineering squadfrontend engineers, backend architects, DevOps, and QA testersgoverned by strict milestone SLAs and single-point accountability.',
  },
  {
    path: '/services/ai-workflow-automation',
    title: 'AI Workflow Automation & Custom LLM Engineering | DigiHust',
    description: 'Deploy enterprise AI agents, OpenAI integrations, n8n automated workflows, and intelligent data extraction pipelines. Eliminate repetitive operational overhead with DigiHust AI engineering squad.',
    h1: 'Scale Your Business Operations With Custom AI & Autonomous Workflows.',
    summary: 'Custom LLM agents, multi-step n8n pipelines, and automated CRM triggers tailored to enterprise workflows.',
  },
  {
    path: '/services/brand-identity-design-system',
    title: 'Brand Identity & High-Converting UI/UX Design Systems | DigiHust',
    description: 'Transform your digital presence with enterprise brand identity systems, Figma design tokens, responsive UI/UX prototypes, and 3D motion graphics created by DigiHust Creative Squad.',
    h1: 'Establish Visual Authority With World-Class Brand & UI/UX Systems.',
    summary: 'Complete typography & vector logo guidelines, comprehensive Figma component token libraries, and 3D motion trailers.',
  },
  {
    path: '/services/digital-marketing-seo',
    title: 'Growth Marketing & Technical SEO Services | DigiHust',
    description: 'Drive high-intent organic traffic, scale paid ad conversions, and dominate search rankings. Dedicated growth marketing and technical SEO squads with managed milestone SLAs.',
    h1: 'Accelerate Revenue & Acquisition With High-Performance Marketing & SEO.',
    summary: 'Technical SEO audits, Core Web Vitals optimization, programmatic content acquisition, and high-ROAS paid media buying.',
  },
  {
    path: '/services/cybersecurity-audit',
    title: 'Cybersecurity Audits & Penetration Testing | DigiHust',
    description: 'Protect your web applications, APIs, and cloud infrastructure with offensive penetration testing, OWASP vulnerability assessments, and cloud security hardening.',
    h1: 'Fortify Your Digital Assets With Rigorous Audits & Penetration Testing.',
    summary: 'Black-box and white-box web app penetration testing, OWASP Top 10 auditing, cloud infrastructure hardening, and signed clean audit certificates.',
  },
  {
    path: '/services/data-intelligence-analytics',
    title: 'Business Intelligence, ETL & Executive Dashboards | DigiHust',
    description: 'Transform raw databases into real-time business intelligence with custom Python ETL pipelines, SQL warehouses, and interactive PowerBI and Tableau executive dashboards.',
    h1: 'Transform Disparate Data Into Actionable Executive Intelligence.',
    summary: 'Automated Python ETL data pipelines, centralized SQL data warehouses, and interactive PowerBI executive analytics suites.',
  },
  {
    path: '/portfolio',
    title: 'Our Work & Case Studies  DigiHust',
    description: 'Explore DigiHust portfolio of delivered projects across full-stack development, brand identity systems, AI automation, and business intelligence.',
    h1: 'Selected Work & Case Studies.',
    summary: 'Proven digital solutions engineered by specialized squads: Real-Estate Marketplace, Automotive EV Brand, Hospital BI Dashboard, FinTech Trading Console, and Autonomous Logistics Bots.',
  },
  {
    path: '/how-it-works',
    title: 'How It Works & Project Methodology  DigiHust',
    description: 'Learn about DigiHust structured 4-step process: Intake & Scoping, Specialist Squad Assembly, Sprint Execution, and Production Handover.',
    h1: 'How DigiHust Works.',
    summary: 'A disciplined 4-step delivery methodology with single contract accountability, milestone staging reviews, and verified Digiskill domain specialists.',
  },
  {
    path: '/careers',
    title: 'Careers at DigiHust | Join our Digital Squad',
    description: 'Join DigiHust and work on cutting-edge Web Development, AI Automation, and Design Systems. See our open positions.',
    h1: 'Build the future of digital with DigiHust.',
    summary: 'We are a collective of engineers, designers, and strategists delivering high-impact solutions for international clients.',
  },
  {
    path: '/about',
    title: 'About DigiHust  Our Origin, Mission & Team Model',
    description: 'Learn how DigiHust was founded inside the Digiskill ecosystem to bridge Pakistani digital talent with international client opportunities under one managed entity.',
    h1: 'The DigiHust Mission.',
    summary: 'Founded inside Pakistans Digiskill community to replace isolated freelance bidding with managed, world-class project delivery under the motto: Hustle. Create. Deliver.',
  },
  {
    path: '/team',
    title: 'Our Team & Domain Specialists  DigiHust',
    description: 'Meet the specialized talent behind DigiHust: Full-stack software engineers, UI/UX designers, AI practitioners, growth leads, and cybersecurity auditors.',
    h1: 'Meet the Talent.',
    summary: 'Verified specialists in Web Engineering, UI/UX Design, AI Workflows, Technical SEO, and Cybersecurity.',
  },
  {
    path: '/contact',
    title: 'Get a Scoped Quote & Project Proposal  DigiHust',
    description: 'Submit your digital project scope to DigiHust. Receive a transparent milestone quote, technical architecture review, and timeline proposal within 24 hours.',
    h1: 'Lets Build Something Great.',
    summary: 'Direct client project intake for web apps, brand systems, AI automations, and growth infrastructure with rapid 24-hour proposal turnaround.',
  },
  {
    path: '/blog',
    title: 'Knowledge Base & Technical Insights  DigiHust',
    description: 'Actionable technical articles and engineering deep dives on Web Architecture, Technical SEO, AI Automation, and Cybersecurity by DigiHust specialists.',
    h1: 'Insights & Knowledge Hub.',
    summary: 'Technical guides, architectural blueprints, and digital growth strategies authored directly by DigiHust domain leads.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy  DigiHust',
    description: 'DigiHust commitment to data protection, client intellectual property confidentiality, and GDPR compliance.',
    h1: 'Privacy Policy',
    summary: 'Strict confidentiality, Non-Disclosure Agreement (NDA) compliance, and secure handling of client project briefs.',
  },
  {
    path: '/terms',
    title: 'Terms of Service  DigiHust',
    description: 'Terms and conditions governing client service delivery, milestone payments, intellectual property ownership, and warranties.',
    h1: 'Terms of Service',
    summary: 'Contractual terms governing project sprints, 100% intellectual property transfer upon milestone settlement, and post-launch warranties.',
  },
  {
    path: '/editorial-policy',
    title: 'Editorial Policy & Publishing Standards  DigiHust',
    description: 'Our editorial principles, author attribution standards, fact-checking methodology, and correction process for DigiHust technical insights.',
    h1: 'Editorial Policy',
    summary: 'Editorial principles, named domain author attribution, fact-checking methodology, and transparent technical correction procedures.',
  },
  // Case Studies
  {
    path: '/portfolio/real-estate-marketplace-portal',
    title: 'Real-Estate Marketplace Portal & Agent CRM  Case Study | DigiHust',
    description: 'A high-throughput property listing and agent management platform with sub-second geospatial search and +140% conversion growth for Estates Direct UK.',
    h1: 'Real-Estate Marketplace Portal & Agent CRM',
    summary: 'Next.js, Node.js, PostgreSQL with PostGIS for sub-second spatial queries, achieving 780ms average page loads and +140% lead growth.',
  },
  {
    path: '/portfolio/automotive-brand-identity',
    title: 'Automotive Brand Identity & 3D Motion Launch  Case Study | DigiHust',
    description: 'Complete brand redesign, comprehensive design system, and 3D motion advertisement teasers generating 2.4M impressions for Veloce Motors.',
    h1: 'Automotive Brand Identity & 3D Motion Launch',
    summary: 'Complete brand guidelines, Cinema 4D/After Effects motion ads, and Figma design system for European EV performance startup.',
  },
  {
    path: '/portfolio/hospital-bi-dashboard',
    title: 'Hospital Executive BI & Revenue Analytics Suite  Case Study | DigiHust',
    description: 'Centralized disparate clinical and financial SQL databases into an executive PowerBI dashboard saving 12+ hours weekly for Titan Healthcare.',
    h1: 'Hospital Executive BI & Revenue Analytics Suite',
    summary: 'Automated Python ETL pipelines, SQL analytics warehouse, and interactive PowerBI dashboard for 35+ regional hospital department heads.',
  },
  {
    path: '/portfolio/saas-fintech-trading-console',
    title: 'Enterprise FinTech Trading Console  Case Study | DigiHust',
    description: 'A sub-millisecond market execution dashboard engineered with virtualized tables, WebSocket pipelines, and zero-latency order book rendering.',
    h1: 'Enterprise FinTech High-Throughput Trading Console',
    summary: 'Virtualized React rendering pipeline handling 2,000+ price ticks per second with steady 60 FPS under peak market load.',
  },
  {
    path: '/portfolio/ai-logistics-customer-bot',
    title: 'Autonomous Logistics Customer Support AI Agent  Case Study | DigiHust',
    description: 'Custom OpenAI-powered agent communicating over WhatsApp Business API resolving 78% of inquiries autonomously for LogiXpress.',
    h1: 'Autonomous Logistics Customer Support AI Agent',
    summary: 'OpenAI GPT-4o function-calling integrated with WhatsApp Business API and ERP tracking database, dropping response times from 4 hours to < 6s.',
  },
  {
    path: '/portfolio/ecommerce-luxury-brand',
    title: 'Luxury Goods Brand System & Mobile E-Commerce Store  Case Study | DigiHust',
    description: 'Complete luxury visual identity, custom high-conversion Shopify storefront, and iOS mobile mockup suite generating $280K in 30 days.',
    h1: 'Luxury Goods Brand System & Mobile E-Commerce Store',
    summary: 'High-speed custom Shopify storefront and luxury brand identity resulting in $280K revenue in first 30 days.',
  },
  // Blog Posts
  {
    path: '/blog/how-to-architect-nextjs-for-ai-crawlers',
    title: 'Architecting Modern Web Apps for AI Search Engines & LLM Crawlers  DigiHust Insights',
    description: 'Why traditional client-side SPAs fail against non-JS AI agents (GPTBot, ClaudeBot, Perplexity), and how static pre-rendering bridges the semantic gap.',
    h1: 'Architecting Modern Web Apps for AI Search Engines & LLM Crawlers',
    summary: 'Technical guide on pre-rendering marketing routes, structuring /llms.txt files, and embedding JSON-LD for AI search discoverability.',
  },
  {
    path: '/blog/demystifying-ai-automations-n8n-vs-custom-python',
    title: 'Automating Business Workflows: n8n vs. Custom Python LLM Microservices  DigiHust Insights',
    description: 'A pragmatic framework for deciding when to use visual workflow tools versus specialized Python function-calling pipelines for enterprise operations.',
    h1: 'Automating Business Workflows: n8n vs. Custom Python LLM Microservices',
    summary: 'Comparing visual workflow orchestrators with bespoke FastAPI microservices for enterprise automation.',
  },
  {
    path: '/blog/owasp-top-10-web-security-checklist-for-startups',
    title: 'The Essential OWASP Web Application Security & Hardening Checklist  DigiHust Insights',
    description: 'Protecting your digital infrastructure against injection, broken access controls, and data exposure before production deployment.',
    h1: 'The Essential OWASP Web Application Security & Hardening Checklist',
    summary: 'A developer-centric security audit checklist covering headers, authentication, SQL/NoSQL injection, and cloud hardening.',
  },
];

console.log('Generating pre-rendered static HTML for AI crawlers & SEO...');

routes.forEach((route) => {
  let html = templateHtml;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);

  // Replace Meta Description
  html = html.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${route.description}" />`
  );

  // Add Canonical link & OpenGraph tags in head
  const baseUrl = process.env.VITE_SITE_URL || 'https://www.digihust.tech';
  const canonicalUrl = `${baseUrl}${route.path === '/' ? '/' : route.path}`;
  const headInjection = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="${route.ogType || 'website'}" />
    <meta property="og:site_name" content="DigiHust" />
    <meta property="og:image" content="${baseUrl}/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="DigiHust - Digital Services Handled by Specialized Talent" />
    <meta name="twitter:image" content="${baseUrl}/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title}" />
    
    <meta name="twitter:description" content="${route.description}" />
    <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'DigiHust',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/og-image.jpg`,
    description: route.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PK'
    },
    founder: [
      {
        '@type': 'Person',
        name: 'Mahad Abbas',
        jobTitle: 'Founder & CEO'
      },
      {
        '@type': 'Person',
        name: 'Muhammad Haseeb',
        jobTitle: 'Co-Founder'
      }
    ]
  })}</script>${route.path === '/' ? `\n    <script type="application/ld+json">{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What does DigiHust do?", "acceptedAnswer": {"@type": "Answer", "text": "DigiHust is a managed digital services company delivering end-to-end solutions across five core disciplines: Web Engineering, Creative & UI/UX Design, AI & Workflow Automation, Growth Marketing & SEO, and Cybersecurity. Instead of leaving clients to coordinate disconnected contractors, we assemble dedicated specialist squads under unified technical leadership."}}, {"@type": "Question", "name": "How does DigiHust differ from hiring independent freelancers?", "acceptedAnswer": {"@type": "Answer", "text": "Managing separate freelancers means multiple negotiations, misaligned schedules, blame-shifting, and unpredictable quality. DigiHust operates as a single accountable agency partner. You receive a dedicated point of contact, synchronized sprint milestones, unified delivery, and strict service-level agreements (SLAs) for the entire project lifecycle."}}, {"@type": "Question", "name": "How fast does a project proposal arrive?", "acceptedAnswer": {"@type": "Answer", "text": "We review your project requirements and deliver a calibrated scope breakdown, architectural recommendation, and transparent milestone quote within 24 hours of your intake submission."}}, {"@type": "Question", "name": "Who does the work on client projects?", "acceptedAnswer": {"@type": "Answer", "text": "All work is completed by verified domain specialists trained and vetted through Pakistan's Digiskill ecosystem and DigiHust's internal technical benchmarks. Each squad member is matched specifically to your technical stack, whether React, Next.js, Python AI pipelines, Figma design systems, or security auditing."}}, {"@type": "Question", "name": "How does DigiHust handle quality assurance?", "acceptedAnswer": {"@type": "Answer", "text": "Every deliverable undergoes multi-stage internal review before reaching your team. Senior technical architects verify code quality, performance metrics, and security compliance to ensure all work meets production standards prior to milestone sign-off."}}, {"@type": "Question", "name": "What does the Quality & Milestone Guarantee cover?", "acceptedAnswer": {"@type": "Answer", "text": "We provide a 100% Quality & Milestone Guarantee. Projects are divided into transparent staging sprints with agreed-upon acceptance criteria. Client feedback is integrated into each review, and you maintain complete visibility over deliverables before milestones are accepted."}}, {"@type": "Question", "name": "How do contracts, communication, and invoicing work?", "acceptedAnswer": {"@type": "Answer", "text": "You work under a single legal contract and receive a single consolidated invoice, regardless of how many disciplines are involved in your build. One dedicated project manager handles communication, timeline tracking, and squad coordination from kickoff to final handover."}}]}</script>` : ''}
  `;

  html = html.replace('</head>', `${headInjection}\n  </head>`);

  // Ensure 3D isometric boxes loader splash per Uiverse.io by Nawsome
  // templateHtml from Vite build already contains #app-boot-splash outside #root. Only inject if missing.
  if (!html.includes('id="app-boot-splash"')) {
    const rootContent = `
    <!-- Seamless Full-Bleed Boot Splash Overlay -->
    <div id="app-boot-splash" role="status" aria-label="Loading DigiHust">
      <div class="boxes-loader-wrapper">
        <!-- Ambient Lighting Stage -->
        <div class="boxes-ambient-stage" aria-hidden="true"></div>

        <!-- From Uiverse.io by Nawsome -->
        <div class="boxes" style="position:relative;z-index:10;">
          <div class="box">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="box">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="box">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="box">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <!-- Brand Title -->
        <div style="margin-top:48px;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;z-index:10;">
          <span style="font-family:'Outfit',sans-serif;font-weight:800;font-size:22px;letter-spacing:-0.02em;color:var(--loader-text);">
            Digi<span style="color:var(--loader-accent);">Hust</span>
          </span>
          <p style="font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:700;color:var(--loader-accent);letter-spacing:0.25em;text-transform:uppercase;margin-top:4px;">
            Loading Experience
          </p>
        </div>

        <!-- Progress Track -->
        <div class="loader-progress-track" aria-hidden="true" style="position:relative;z-index:10;">
          <div class="loader-progress-bar"></div>
        </div>

        <span style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">Loading DigiHust...</span>
      </div>
    </div>
    <div id="root"></div>`;
    html = html.replace(/<div id="root">\s*<\/div>/, rootContent.trim());
  }

  // Save to dist/
  if (route.path === '/') {
    fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf-8');
  } else {
    const routeClean = route.path.replace(/^\//, '');
    const targetDir = path.join(distDir, routeClean);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');
    // Also save flat .html for servers that serve clean paths
    fs.writeFileSync(path.join(distDir, `${routeClean}.html`), html, 'utf-8');
  }
});

console.log(`Successfully pre-rendered ${routes.length} static HTML pages in dist/!`);

// ── JSON-LD XSS escape helper (S6) ────────────────────────────────────────────
// Escapes </script> sequences that could break out of <script> tags
function safeJsonLd(obj) {
  return JSON.stringify(obj).replace(/<\/script>/gi, '<\\/script>').replace(/</g, '\\u003c');
}

// ── Fix JSON-LD in already-written HTML files ─────────────────────────────────
// Walk dist/ and escape any existing JSON-LD blocks for safety
const allHtmlFiles = [];
function walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(fullPath);
    else if (entry.name.endsWith('.html')) allHtmlFiles.push(fullPath);
  }
}
walkDir(distDir);
for (const f of allHtmlFiles) {
  let content = fs.readFileSync(f, 'utf-8');
  // Escape </script> inside ld+json blocks
  content = content.replace(
    /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/gi,
    (_, open, body, close) => open + body.replace(/<\/script>/gi, '<\\/script>') + close
  );
  fs.writeFileSync(f, content, 'utf-8');
}

// ── Sitemap (E1) ──────────────────────────────────────────────────────────────
console.log('Generating sitemap.xml...');
const sitemapUrl = process.env.VITE_SITE_URL || 'https://www.digihust.tech';

// Assign realistic lastmod dates by content type (not "today" for everything)
// Blog posts and portfolio pages get a specific date; structural pages get a recent date
const BUILD_DATE = new Date().toISOString().split('T')[0]; // today for structural pages

// Only index public, non-private routes
const SITEMAP_EXCLUSIONS = new Set([
  '/verify', '/cert', '/verify/cert',
  '/project/track',
  '/portal', '/portal/login', '/portal/dashboard', '/portal/assignments',
  '/portal/roster', '/portal/people', '/portal/directory', '/portal/announcements',
  '/portal/certificates', '/portal/cms',
  '/dashboard', '/ledger', '/roster', '/admin',
  '/404', '/500', '/403', '/401', '/maintenance', '/offline',
  '/apply', // thank-you / utility
]);

function isExcluded(routePath) {
  for (const excl of SITEMAP_EXCLUSIONS) {
    if (routePath === excl || routePath.startsWith(excl + '/')) return true;
  }
  return false;
}

function getLastmod(routePath) {
  // Blog posts  set a specific publish date
  if (routePath === '/blog/how-to-architect-nextjs-for-ai-crawlers') return '2026-09-15';
  if (routePath === '/blog/demystifying-ai-automations-n8n-vs-custom-python') return '2026-09-22';
  if (routePath === '/blog/owasp-top-10-web-security-checklist-for-startups') return '2026-10-01';
  // Portfolio case studies  relatively stable content
  if (routePath.startsWith('/portfolio/')) return '2026-09-01';
  // Service pages update occasionally
  if (routePath.startsWith('/services/')) return '2026-10-10';
  // Core marketing pages
  return BUILD_DATE;
}

function getPriority(routePath) {
  if (routePath === '/') return '1.0';
  if (routePath.startsWith('/services/') && routePath !== '/services') return '0.9';
  if (routePath === '/services' || routePath === '/contact') return '0.9';
  if (routePath.startsWith('/portfolio/') && routePath !== '/portfolio') return '0.8';
  if (routePath.startsWith('/blog/') && routePath !== '/blog') return '0.7';
  return '0.8';
}

let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

routes.forEach((route) => {
  if (isExcluded(route.path)) return;
  const loc = `${sitemapUrl}${route.path === '/' ? '' : route.path}`;
  const lastmod = getLastmod(route.path);
  const priority = getPriority(route.path);
  sitemapContent += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${route.path === '/' ? 'daily' : route.path.startsWith('/blog') ? 'monthly' : 'weekly'}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
});

sitemapContent += `</urlset>`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf-8');
console.log('sitemap.xml successfully generated!');

// ── Robots.txt (E2) ───────────────────────────────────────────────────────────
console.log('Generating robots.txt...');
const robotsContent = `User-agent: *
Allow: /
Disallow: /portal/
Disallow: /admin/
Disallow: /admin
Disallow: /dashboard/
Disallow: /dashboard
Disallow: /ledger/
Disallow: /ledger
Disallow: /roster/
Disallow: /roster
Disallow: /project/track/
Disallow: /api/

# AI & LLM crawlers  allowed (see /llms.txt)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${sitemapUrl}/sitemap.xml
`;
fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsContent, 'utf-8');
console.log('robots.txt successfully generated!');
