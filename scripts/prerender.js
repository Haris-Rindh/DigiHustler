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
    title: 'DigiHust — Digital Services Handled by Specialized Talent',
    description: 'One company, coordinated specialist talent. DigiHust delivers web engineering, design systems, AI automation and cybersecurity under one roof.',
    h1: 'Your Digital Work. Handled by Skilled People.',
    summary: 'From custom web development and UI/UX design to AI automations, growth marketing, and cybersecurity — DigiHust unites verified specialists into unified project squads.',
  },
  {
    path: '/services',
    title: 'Digital Services & Capabilities — DigiHust',
    description: 'Explore DigiHust full suite of capabilities: Full-Stack Web Development, UI/UX Design, AI Automation, Digital Marketing, Cybersecurity, and Business Intelligence.',
    h1: 'Services Built for Execution.',
    summary: 'Six specialized domains — delivered as one cohesive digital engine: Web Engineering, Design Systems, AI Automations, Growth Marketing, Cybersecurity, and BI Dashboards.',
  },
  {
    path: '/services/saas-mvp-development',
    title: 'Hire Dedicated SaaS & Web App Engineering Squads | DigiHust',
    description: 'Build and scale production-grade SaaS MVPs and custom web applications. Coordinated full-stack engineering squads delivering React, Next.js, Node.js, and cloud architectures under managed SLAs for US, UK, EU, and Gulf founders.',
    h1: 'Build Your SaaS MVP & Web Platform With a Managed Engineering Squad.',
    summary: 'Full-stack engineering squad—frontend engineers, backend architects, DevOps, and QA testers—governed by strict milestone SLAs and single-point accountability.',
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
    path: '/portfolio',
    title: 'Our Work & Case Studies — DigiHust',
    description: 'Explore DigiHust portfolio of delivered projects across full-stack development, brand identity systems, AI automation, and business intelligence.',
    h1: 'Selected Work & Case Studies.',
    summary: 'Proven digital solutions engineered by specialized squads: Real-Estate Marketplace, Automotive EV Brand, Hospital BI Dashboard, FinTech Trading Console, and Autonomous Logistics Bots.',
  },
  {
    path: '/how-it-works',
    title: 'How It Works & Project Methodology — DigiHust',
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
    title: 'About DigiHust — Our Origin, Mission & Team Model',
    description: 'Learn how DigiHust was founded inside the Digiskill ecosystem to bridge Pakistani digital talent with international client opportunities under one managed entity.',
    h1: 'The DigiHust Mission.',
    summary: 'Founded inside Pakistans Digiskill community to replace isolated freelance bidding with managed, world-class project delivery under the motto: Hustle. Create. Deliver.',
  },
  {
    path: '/team',
    title: 'Our Team & Domain Specialists — DigiHust',
    description: 'Meet the specialized talent behind DigiHust: Full-stack software engineers, UI/UX designers, AI practitioners, growth leads, and cybersecurity auditors.',
    h1: 'Meet the Talent.',
    summary: 'Verified specialists in Web Engineering, UI/UX Design, AI Workflows, Technical SEO, and Cybersecurity.',
  },
  {
    path: '/contact',
    title: 'Get a Scoped Quote & Project Proposal — DigiHust',
    description: 'Submit your digital project scope to DigiHust. Receive a transparent milestone quote, technical architecture review, and timeline proposal within 24 hours.',
    h1: 'Lets Build Something Great.',
    summary: 'Direct client project intake for web apps, brand systems, AI automations, and growth infrastructure with rapid 24-hour proposal turnaround.',
  },
  {
    path: '/blog',
    title: 'Knowledge Base & Technical Insights — DigiHust',
    description: 'Actionable technical articles and engineering deep dives on Web Architecture, Technical SEO, AI Automation, and Cybersecurity by DigiHust specialists.',
    h1: 'Insights & Knowledge Hub.',
    summary: 'Technical guides, architectural blueprints, and digital growth strategies authored directly by DigiHust domain leads.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — DigiHust',
    description: 'DigiHust commitment to data protection, client intellectual property confidentiality, and GDPR compliance.',
    h1: 'Privacy Policy',
    summary: 'Strict confidentiality, Non-Disclosure Agreement (NDA) compliance, and secure handling of client project briefs.',
  },
  {
    path: '/terms',
    title: 'Terms of Service — DigiHust',
    description: 'Terms and conditions governing client service delivery, milestone payments, intellectual property ownership, and warranties.',
    h1: 'Terms of Service',
    summary: 'Contractual terms governing project sprints, 100% intellectual property transfer upon milestone settlement, and post-launch warranties.',
  },
  {
    path: '/editorial-policy',
    title: 'Editorial Policy & Publishing Standards — DigiHust',
    description: 'Our editorial principles, author attribution standards, fact-checking methodology, and correction process for DigiHust technical insights.',
    h1: 'Editorial Policy',
    summary: 'Editorial principles, named domain author attribution, fact-checking methodology, and transparent technical correction procedures.',
  },
  // Case Studies
  {
    path: '/portfolio/real-estate-marketplace-portal',
    title: 'Real-Estate Marketplace Portal & Agent CRM — Case Study | DigiHust',
    description: 'A high-throughput property listing and agent management platform with sub-second geospatial search and +140% conversion growth for Estates Direct UK.',
    h1: 'Real-Estate Marketplace Portal & Agent CRM',
    summary: 'Next.js, Node.js, PostgreSQL with PostGIS for sub-second spatial queries, achieving 780ms average page loads and +140% lead growth.',
  },
  {
    path: '/portfolio/automotive-brand-identity',
    title: 'Automotive Brand Identity & 3D Motion Launch — Case Study | DigiHust',
    description: 'Complete brand redesign, comprehensive design system, and 3D motion advertisement teasers generating 2.4M impressions for Veloce Motors.',
    h1: 'Automotive Brand Identity & 3D Motion Launch',
    summary: 'Complete brand guidelines, Cinema 4D/After Effects motion ads, and Figma design system for European EV performance startup.',
  },
  {
    path: '/portfolio/hospital-bi-dashboard',
    title: 'Hospital Executive BI & Revenue Analytics Suite — Case Study | DigiHust',
    description: 'Centralized disparate clinical and financial SQL databases into an executive PowerBI dashboard saving 12+ hours weekly for Titan Healthcare.',
    h1: 'Hospital Executive BI & Revenue Analytics Suite',
    summary: 'Automated Python ETL pipelines, SQL analytics warehouse, and interactive PowerBI dashboard for 35+ regional hospital department heads.',
  },
  {
    path: '/portfolio/saas-fintech-trading-console',
    title: 'Enterprise FinTech Trading Console — Case Study | DigiHust',
    description: 'A sub-millisecond market execution dashboard engineered with virtualized tables, WebSocket pipelines, and zero-latency order book rendering.',
    h1: 'Enterprise FinTech High-Throughput Trading Console',
    summary: 'Virtualized React rendering pipeline handling 2,000+ price ticks per second with steady 60 FPS under peak market load.',
  },
  {
    path: '/portfolio/ai-logistics-customer-bot',
    title: 'Autonomous Logistics Customer Support AI Agent — Case Study | DigiHust',
    description: 'Custom OpenAI-powered agent communicating over WhatsApp Business API resolving 78% of inquiries autonomously for LogiXpress.',
    h1: 'Autonomous Logistics Customer Support AI Agent',
    summary: 'OpenAI GPT-4o function-calling integrated with WhatsApp Business API and ERP tracking database, dropping response times from 4 hours to < 6s.',
  },
  {
    path: '/portfolio/ecommerce-luxury-brand',
    title: 'Luxury Goods Brand System & Mobile E-Commerce Store — Case Study | DigiHust',
    description: 'Complete luxury visual identity, custom high-conversion Shopify storefront, and iOS mobile mockup suite generating $280K in 30 days.',
    h1: 'Luxury Goods Brand System & Mobile E-Commerce Store',
    summary: 'High-speed custom Shopify storefront and luxury brand identity resulting in $280K revenue in first 30 days.',
  },
  // Blog Posts
  {
    path: '/blog/how-to-architect-nextjs-for-ai-crawlers',
    title: 'Architecting Modern Web Apps for AI Search Engines & LLM Crawlers — DigiHust Insights',
    description: 'Why traditional client-side SPAs fail against non-JS AI agents (GPTBot, ClaudeBot, Perplexity), and how static pre-rendering bridges the semantic gap.',
    h1: 'Architecting Modern Web Apps for AI Search Engines & LLM Crawlers',
    summary: 'Technical guide on pre-rendering marketing routes, structuring /llms.txt files, and embedding JSON-LD for AI search discoverability.',
  },
  {
    path: '/blog/demystifying-ai-automations-n8n-vs-custom-python',
    title: 'Automating Business Workflows: n8n vs. Custom Python LLM Microservices — DigiHust Insights',
    description: 'A pragmatic framework for deciding when to use visual workflow tools versus specialized Python function-calling pipelines for enterprise operations.',
    h1: 'Automating Business Workflows: n8n vs. Custom Python LLM Microservices',
    summary: 'Comparing visual workflow orchestrators with bespoke FastAPI microservices for enterprise automation.',
  },
  {
    path: '/blog/owasp-top-10-web-security-checklist-for-startups',
    title: 'The Essential OWASP Web Application Security & Hardening Checklist — DigiHust Insights',
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

  // Inject 3D cube loader splash inside #root per Item 16 & 25a (eliminating raw unstyled text flash)
  const rootContent = `
    <div id="root">
      <div id="app-boot-splash" style="display:flex;min-height:100vh;align-items:center;justify-content:center;background:var(--bg-page,#022B3A);">
        <div class="cube-loader-wrapper" role="status" aria-label="Loading DigiHust">
          <div class="cube-loader">
            <div class="cube-side cube-front"></div>
            <div class="cube-side cube-back"></div>
            <div class="cube-side cube-right"></div>
            <div class="cube-side cube-left"></div>
            <div class="cube-side cube-top"></div>
            <div class="cube-side cube-bottom"></div>
          </div>
          <div class="cube-shadow"></div>
          <span style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">Loading DigiHust...</span>
        </div>
      </div>
    </div>
  `;

  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, rootContent.trim());

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


// Generate Sitemap
console.log('Generating sitemap.xml...');
const sitemapUrl = process.env.VITE_SITE_URL || 'https://www.digihust.tech';
let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

routes.forEach((route) => {
  const isHome = route.path === '/';
  const priority = isHome ? '1.0' : route.path.startsWith('/services') ? '0.9' : '0.8';
  const loc = `${sitemapUrl}${isHome ? '' : route.path}`;
  sitemapContent += `  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>\n`;
});

sitemapContent += `</urlset>`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf-8');
console.log('sitemap.xml successfully generated!');

// Generate Robots.txt
console.log('Generating robots.txt...');
const robotsContent = `User-agent: *
Allow: /

# Private Routes
Disallow: /portal/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /project/track/

Sitemap: ${sitemapUrl}/sitemap.xml
`;
fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsContent, 'utf-8');
console.log('robots.txt successfully generated!');


