import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Code2,
  Calendar,
  Building2,
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

export interface CaseStudyData {
  slug: string;
  category: string;
  title: string;
  client: string;
  clientIndustry: string;
  timeline: string;
  summary: string;
  heroImage: string;
  statHighlight: string;
  challenge: string;
  architectureDetails: string[];
  solution: string;
  deliverables: string[];
  metrics: { value: string; label: string; sub: string }[];
  tags: string[];
  clientQuote?: { quote: string; author: string; role: string };
}

export const CASE_STUDIES: Record<string, CaseStudyData> = {
  'real-estate-marketplace-portal': {
    slug: 'real-estate-marketplace-portal',
    category: 'Web Development',
    title: 'Real-Estate Marketplace Portal & Agent CRM',
    client: 'Estates Direct UK',
    clientIndustry: 'PropTech / Real Estate',
    timeline: '6 Weeks Sprint',
    statHighlight: '+140% Conversion Growth',
    summary: 'A high-throughput property listing and agent management platform with sub-second geospatial search, real-time lead dispatching, and automated viewing scheduling.',
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    challenge: 'Estates Direct operated on a fragile legacy CMS where property queries exceeded 5 seconds. Database indexing on 40,000+ UK listings repeatedly crashed during peak hours, causing 35% bounce rates and missed valuation inquiries.',
    architectureDetails: [
      'Engineered a Next.js / React headless storefront deployed across global edge nodes.',
      'PostgreSQL with PostGIS extensions enabling sub-80ms radius and polygon map queries.',
      'Automated WebSocket lead broadcast notifying nearest regional agents in < 3 seconds.',
      'Redis cache layer handling 100,000+ daily property detail lookups with zero DB bottleneck.',
    ],
    solution: 'DigiHust assembled a 4-person engineering squad (Lead Full-Stack Architect, UI/UX Designer, PostgreSQL DBA, QA Engineer). We rebuilt the entire platform in 6 agile sprints, migrating 40,000+ active property listings with zero data loss or downtime.',
    deliverables: [
      'Full-Stack Next.js React Web Application',
      'Agent Mobile-Responsive CRM Dashboard',
      'PostgreSQL + PostGIS Geospatial Engine',
      'Automated SMS & Email Lead Routing Pipeline',
      'Complete CI/CD Deployment & Monitoring Suite',
    ],
    metrics: [
      { value: '780ms', label: 'Average Page Load', sub: 'Down from 5.4s on legacy system' },
      { value: '+140%', label: 'Valuation Leads', sub: 'Within 90 days of launch' },
      { value: '100%', label: 'Uptime Reliability', sub: 'Zero outage events during peak seasons' },
    ],
    tags: ['React', 'Next.js', 'PostgreSQL', 'PostGIS', 'Tailwind CSS', 'Node.js', 'AWS'],
    clientQuote: {
      quote: 'DigiHust took our fragmented, crashing property portal and transformed it into the fastest real estate search platform in our regional market.',
      author: 'David Sterling',
      role: 'Managing Director, Estates Direct UK',
    },
  },
  'automotive-brand-identity': {
    slug: 'automotive-brand-identity',
    category: 'Creative & Branding',
    title: 'Automotive Brand Identity & 3D Motion Launch',
    client: 'Veloce Motors DE',
    clientIndustry: 'Automotive / EV Mobility',
    timeline: '4 Weeks Sprint',
    statHighlight: '2.4M Organic Impressions',
    summary: 'A futuristic brand system, comprehensive design tokens, and a suite of 3D motion advertisement teasers for an innovative European electric performance manufacturer.',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    challenge: 'Veloce Motors required an uncompromising visual identity and motion language to differentiate their new electric performance vehicles from legacy German automotive incumbents.',
    architectureDetails: [
      'Precision vector logo mark with geometric optical balance for hardware and digital badging.',
      'Comprehensive 120-page brand guidelines detailing typography, palette, and vehicle UI.',
      'Cinema 4D and After Effects pipeline rendering 4K 60FPS motion teaser advertisements.',
      'Figma design system containing 250+ responsive components for web and mobile touchpoints.',
    ],
    solution: 'Our creative squad delivered the full brand architecture in 4 weeks, producing 3x 30-second 3D promotional motion ads that generated over 2.4 million organic launch impressions.',
    deliverables: [
      'Primary, Secondary & Monogram Logo Vectors',
      '120-Page Comprehensive Brand Guidelines PDF',
      '3x 4K 3D Motion Video Advertisement Sequences',
      'Complete Figma Web & Mobile Design System',
      'Exhibition & Investor Pitch Deck Collateral',
    ],
    metrics: [
      { value: '2.4M', label: 'Launch Impressions', sub: 'Across digital video channels' },
      { value: '120+', label: 'Design Tokens', sub: 'Implemented into vehicle UI' },
      { value: '4 Weeks', label: 'Concept to Delivery', sub: 'Ahead of scheduled auto expo' },
    ],
    tags: ['Brand Identity', 'UI/UX', 'Figma', 'After Effects', 'Cinema 4D', 'Motion Design'],
    clientQuote: {
      quote: 'The visual identity and 3D trailers produced by DigiHust established our brand presence as an immediate serious contender at the Frankfurt Mobility Expo.',
      author: 'Markus Vogel',
      role: 'Chief Brand Officer, Veloce Motors',
    },
  },
  'hospital-bi-dashboard': {
    slug: 'hospital-bi-dashboard',
    category: 'AI & Data Solutions',
    title: 'Hospital Executive BI & Revenue Analytics Suite',
    client: 'Titan Healthcare Systems',
    clientIndustry: 'Healthcare / Hospital Operations',
    timeline: '5 Weeks Sprint',
    statHighlight: '12+ Hours Saved / Week',
    summary: 'Centralized disparate clinical and financial SQL databases into an executive PowerBI intelligence dashboard with automated alerting and KPI compliance reporting.',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    challenge: 'Hospital leadership spent over 12 hours every week manually gathering data across 6 different departmental database silos, causing delayed financial decisions and billing bottlenecks.',
    architectureDetails: [
      'Automated Python ETL scripts extracting, transforming, and validating daily records.',
      'Unified SQL data warehouse with strict role-based HIPAA access controls.',
      'PowerBI executive dashboard with live drill-down by department, doctor, and procedure.',
      'Automated Monday morning PDF executive brief dispatch to 35 hospital department leads.',
    ],
    solution: 'Our AI & Data squad built automated ETL pipelines and an interactive PowerBI command center, eliminating manual spreadsheet compilation completely.',
    deliverables: [
      'Automated Python Data Pipeline (ETL)',
      'Centralized SQL Analytics Warehouse',
      'Interactive Multi-Department PowerBI Suite',
      'Automated KPI Email & Alerting Engine',
      'Technical Admin & Compliance Documentation',
    ],
    metrics: [
      { value: '12+ Hrs', label: 'Admin Time Saved', sub: 'Every single week per executive' },
      { value: '35+', label: 'Active Department Leads', sub: 'Accessing daily real-time metrics' },
      { value: '99.9%', label: 'Reporting Accuracy', sub: 'Eliminated manual human error' },
    ],
    tags: ['PowerBI', 'Python', 'SQL', 'ETL Pipelines', 'Data Analytics', 'Healthcare'],
    clientQuote: {
      quote: 'We now have instantaneous clarity across our entire clinical operations and revenue cycle without spending half our week wrestling with spreadsheets.',
      author: 'Dr. Elena Rostova',
      role: 'Chief Operating Officer, Titan Healthcare',
    },
  },
  'saas-fintech-trading-console': {
    slug: 'saas-fintech-trading-console',
    category: 'Web Development',
    title: 'Enterprise FinTech High-Throughput Trading Console',
    client: 'Apex FinTech US',
    clientIndustry: 'Financial Technology / Trading',
    timeline: '8 Weeks Sprint',
    statHighlight: 'Steady 60 FPS under Load',
    summary: 'A sub-millisecond market execution dashboard engineered with virtualized tables, WebSocket pipelines, and zero-latency order book rendering.',
    heroImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    challenge: 'High market volatility created frame drops and input lag on legacy interfaces, frustrating institutional traders executing large block trades.',
    architectureDetails: [
      'Virtualized React rendering pipeline capable of handling 2,000+ live price updates per second.',
      'Multiplexed WebSockets with binary serialization for lightning-fast order book feeds.',
      'Custom dark-mode high-contrast trading UI built with WCAG AA compliance.',
    ],
    solution: 'DigiHust deployed a dedicated frontend engineering squad to construct an ultra-optimized React TypeScript trading engine with zero UI stutter.',
    deliverables: [
      'High-Throughput React Trading Console',
      'Binary WebSocket Feed Client',
      'Interactive Charting & Technical Indicator Suite',
      'Unit & Performance Benchmark Suite',
    ],
    metrics: [
      { value: '60 FPS', label: 'Steady Frame Rate', sub: 'Even during extreme market volatility' },
      { value: '-40%', label: 'Order Execution Errors', sub: 'Due to clearer UI verification' },
      { value: '200+', label: 'Institutional Accounts', sub: 'Migrated successfully' },
    ],
    tags: ['React', 'TypeScript', 'WebSockets', 'Tailwind', 'High Throughput', 'FinTech'],
  },
  'ai-logistics-customer-bot': {
    slug: 'ai-logistics-customer-bot',
    category: 'AI & Automation',
    title: 'Autonomous Logistics Customer Support AI Agent',
    client: 'LogiXpress Logistics',
    clientIndustry: 'Supply Chain & Freight Logistics',
    timeline: '3 Weeks Sprint',
    statHighlight: '78% Autonomous Resolution',
    summary: 'Custom OpenAI-powered agent communicating over WhatsApp Business API and email to resolve cargo tracking, customs questions, and scheduling.',
    heroImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&q=80',
    challenge: 'Customer support staff were overwhelmed with 800+ repetitive tracking status inquiries daily, resulting in 4-hour response delays.',
    architectureDetails: [
      'OpenAI GPT-4o function calling integrated into central ERP & tracking databases.',
      'Dual WhatsApp Business API and email webhook pipeline.',
      'Human-in-the-loop escalation trigger for complex customs disputes.',
    ],
    solution: 'Our AI squad built a production-ready autonomous agent that queries tracking databases in real-time and answers multi-lingual inquiries in seconds.',
    deliverables: [
      'Custom Autonomous AI Assistant',
      'WhatsApp Business API Gateway',
      'ERP Database Search Connectors',
      'Admin Monitoring & Analytics Console',
    ],
    metrics: [
      { value: '78%', label: 'Inquiries Resolved', sub: 'With zero human intervention' },
      { value: '< 6 Sec', label: 'Average Response Time', sub: 'Down from 4 hours previously' },
      { value: '4.8 / 5.0', label: 'Customer CSAT', sub: 'Across 15,000+ conversations' },
    ],
    tags: ['OpenAI', 'Python', 'WhatsApp API', 'Automation', 'FastAPI', 'Logistics'],
  },
  'ecommerce-luxury-brand': {
    slug: 'ecommerce-luxury-brand',
    category: 'Creative & UI/UX',
    title: 'Luxury Goods Brand System & Mobile E-Commerce Store',
    client: 'Nexus Global Goods',
    clientIndustry: 'E-Commerce / Luxury Retail',
    timeline: '4 Weeks Sprint',
    statHighlight: '$280K Revenue in 30 Days',
    summary: 'Complete luxury visual identity, custom high-conversion Shopify storefront, and interactive iOS mobile mockup suite.',
    heroImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    challenge: 'A growing luxury lifestyle brand lacked a cohesive visual identity across their online store, social channels, and product packaging.',
    architectureDetails: [
      'Bespoke luxury brand identity with custom typography and packaging foil guidelines.',
      'High-speed Shopify storefront with custom Liquid templates and 1-click checkout.',
      'Interactive Figma iOS app prototype tested on 50+ target luxury consumers.',
    ],
    solution: 'Delivered an end-to-end brand and digital storefront system that drove $280K in verified revenue within the first 30 days of launch.',
    deliverables: [
      'Brand Identity System & Vector Assets',
      'Custom Shopify Storefront Theme',
      'Interactive iOS Figma App Prototype',
      'Social Media Ad & Campaign Templates',
    ],
    metrics: [
      { value: '$280K', label: 'First 30 Days Revenue', sub: 'Exceeded forecast by 45%' },
      { value: '-28%', label: 'Mobile Drop-Off', sub: 'Through streamlined 1-click flow' },
      { value: '4.9★', label: 'Brand Rating', sub: 'Across 400+ verified customer reviews' },
    ],
    tags: ['UI/UX', 'Figma', 'Brand Identity', 'Shopify', 'Mobile Design', 'E-Commerce'],
  },
};

export const CaseStudyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? CASE_STUDIES[slug] : undefined;

  if (!study) {
    return <Navigate to="/work" replace />;
  }

  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: study.title,
    headline: study.title,
    description: study.summary,
    image: study.heroImage,
    creator: {
      '@type': 'Organization',
      name: 'DigiHust',
      url: 'https://digihust.com',
    },
    client: {
      '@type': 'Organization',
      name: study.client,
    },
  };

  return (
    <div className="pt-16">
      <SEOHead
        title={`${study.title} — Case Study | DigiHust`}
        description={study.summary}
        ogImage={study.heroImage}
        canonical={`https://digihust.com/work/${study.slug}`}
        schema={creativeWorkSchema}
      />

      {/* Header Banner */}
      <section className="bg-[var(--color-bg)] py-16 sm:py-20 px-6 lg:px-8 border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/work"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[var(--color-text-primary)] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Case Studies</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs font-extrabold text-[var(--color-accent)] uppercase tracking-widest block mb-2">
                {study.category} · {study.clientIndustry}
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight">
                {study.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
                {study.summary}
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 bg-[var(--color-surface)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
                  <Building2 className="w-4 h-4 text-[var(--color-accent)]" />
                  <strong className="text-white font-bold">{study.client}</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-[var(--color-surface)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
                  <Calendar className="w-4 h-4 text-[#0ea5e9]" />
                  <span>{study.timeline}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-[var(--color-accent-fill)]/20 text-[var(--color-text-primary)] px-3 py-1.5 rounded-lg border border-[var(--color-accent)]/40 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{study.statHighlight}</span>
                </span>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl text-center">
              <h3 className="font-bold text-white text-base mb-2">Need Similar Execution?</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Our specialized squads can architect, design, and build custom solutions for your industry.
              </p>
              <Link
                to="/contact"
                className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-[var(--color-accent-fill)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Request Project Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image Showcase */}
      <section className="bg-[var(--color-bg)] pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="aspect-[21/9] rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-2xl relative">
            <img
              src={study.heroImage}
              alt={study.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="bg-white py-12 px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {study.metrics.map((m) => (
            <div key={m.label} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/70 text-center sm:text-left">
              <p className="font-display font-black text-3xl sm:text-4xl text-[var(--color-accent)] mb-1">{m.value}</p>
              <p className="text-sm font-bold text-gray-900 mb-0.5">{m.label}</p>
              <p className="text-xs text-gray-500">{m.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Narrative (Challenge & Solution) */}
      <section className="bg-white py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            {/* The Challenge */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-3">
                <Layers className="w-4 h-4" />
                <span>The Core Challenge</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 mb-4">
                Diagnosing the Bottleneck
              </h2>
              <p className="text-base text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-200">
                {study.challenge}
              </p>
            </div>

            {/* Architectural Engineering */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-black text-[var(--color-accent)] uppercase tracking-widest mb-3">
                <Code2 className="w-4 h-4" />
                <span>Technical Architecture</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 mb-4">
                Engineered for Scale
              </h2>
              <div className="space-y-3">
                {study.architectureDetails.map((detail) => (
                  <div key={detail} className="flex items-start space-x-3 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Solution & Delivery */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-black text-emerald-600 uppercase tracking-widest mb-3">
                <Zap className="w-4 h-4" />
                <span>The DigiHust Squad Execution</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 mb-4">
                Results Delivered
              </h2>
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                {study.solution}
              </p>
            </div>

            {/* Client Testimonial if available */}
            {study.clientQuote && (
              <div className="p-8 rounded-3xl bg-[var(--color-bg)] text-white border border-[var(--color-border)] relative overflow-hidden shadow-xl">
                <p className="font-display text-lg sm:text-xl text-slate-200 italic leading-relaxed mb-6">
                  "{study.clientQuote.quote}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent-fill)] flex items-center justify-center font-bold text-white text-sm">
                    {study.clientQuote.author[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{study.clientQuote.author}</h4>
                    <p className="text-xs text-[var(--color-text-primary)]">{study.clientQuote.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Tech stack & Deliverables */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />
                <span>Scope Deliverables</span>
              </h3>
              <ul className="space-y-2.5">
                {study.deliverables.map((item) => (
                  <li key={item} className="flex items-start space-x-2.5 text-xs text-gray-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-fill)] mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">
                Technologies Utilized
              </h3>
              <div className="flex flex-wrap gap-2">
                {study.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 font-semibold shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[var(--color-bg)] py-20 px-6 lg:px-8 text-center border-t border-[var(--color-border)]">
        <h2 className="font-display font-extrabold text-3xl text-white mb-4">
          Ready to Build Your Success Story?
        </h2>
        <p className="text-slate-300 mb-8 max-w-md mx-auto">
          Contact our team with your specifications to receive a scoped estimate and timeline.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--color-accent-fill)] hover:bg-[var(--color-accent-hover)] text-white font-bold shadow-lg transition-all"
        >
          <span>Start a Project</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
