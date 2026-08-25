import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Building2,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  clientIndustry: string;
  timeline: string;
  category: string;
  summary: string;
  challenge: string;
  solution: string;
  architectureDetails: string[];
  metrics: { value: string; label: string; sub: string }[];
  deliverables: string[];
  tags: string[];
  heroImage: string;
  statHighlight: string;
  clientQuote?: { quote: string; author: string; role: string };
}

const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'real-estate-marketplace-portal',
    title: 'Modernizing Regional Real-Estate Discovery & Agent Portals',
    client: 'Estates Direct UK',
    clientIndustry: 'Property Technology',
    timeline: '8 Weeks (Sprint Delivery)',
    category: 'Web Development',
    summary:
      'Replacing an antiquated WordPress architecture with a high-performance React & Node.js application, resulting in a 140% conversion surge and sub-second page loads.',
    challenge:
      'Estates Direct operated on a fragile monolithic codebase with 6+ second load times on mobile devices. Heavy traffic during listing drop hours regularly overwhelmed their SQL database, causing checkout drop-offs and listing sync failures.',
    solution:
      'DigiHust assembled a 4-person engineering squad (Lead Architect, Frontend Specialist, Backend Engineer, and QA Lead). We decoupled the frontend into a static-optimized React application backed by cached Node.js microservices and PostgreSQL with full-text search indexing.',
    architectureDetails: [
      'React SPA with Tailwind CSS design tokens and server-rendered meta tags.',
      'Containerized Node.js REST API with automated Redis caching for rapid listing queries.',
      'PostgreSQL database optimized with spatial indexing for geo-location property discovery.',
      'Automated CI/CD staging pipelines allowing client stakeholder approvals prior to production deploy.',
    ],
    metrics: [
      { value: '+140%', label: 'Listing Inquiry Conversions', sub: 'Measured over 90 days post-launch' },
      { value: '0.6s', label: 'Average Page Load Time', sub: 'Down from 6.4s on 4G networks' },
      { value: '99.98%', label: 'Platform Availability', sub: 'Zero outage events during peak campaigns' },
    ],
    deliverables: [
      'Production React Web App & Admin Console',
      'Automated Lead Notification System (Email + WhatsApp API)',
      'Agent Portal for Self-Serve Property Uploads',
      'Technical Architecture & Database Schema Documentation',
    ],
    tags: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Tailwind CSS', 'Docker'],
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    statHighlight: '+140% Conversion Uplift',
    clientQuote: {
      quote:
        'DigiHust transformed our slow property portal into the fastest listing discovery engine in our market. Working with a coordinated squad rather than individual freelancers was an absolute game changer.',
      author: 'David Sterling',
      role: 'Managing Director, Estates Direct UK',
    },
  },
  {
    slug: 'automotive-brand-identity',
    title: 'Brand Transformation & 3D Interactive Campaign for EV Innovator',
    client: 'Veloce Motors DE',
    clientIndustry: 'Automotive & Clean Energy',
    timeline: '6 Weeks',
    category: 'Creative & Branding',
    summary:
      'Establishing an authoritative brand system, 3D motion assets, and interactive European launch presence for a next-generation electric vehicle manufacturer.',
    challenge:
      'Veloce Motors required an international brand overhaul ahead of their Series A fundraising and European roadshow. Their existing collateral failed to convey their cutting-edge engineering prowess.',
    solution:
      'Our UI/UX & Creative squad developed an end-to-end design system in Figma, complete with 3D product motion sequences rendered in Cinema 4D and interactive WebGL showroom prototypes.',
    architectureDetails: [
      'Figma Design System with 120+ structured components and dark-first palette tokens.',
      'Cinema 4D / After Effects promotional trailers rendered in 4K resolution.',
      'Interactive 3D vehicle configurator built using Three.js and Framer Motion.',
      'Brand guidelines handbook specifying typography, spatial rules, and voice tone.',
    ],
    metrics: [
      { value: '€4.2M', label: 'Series A Capital Raised', sub: 'Presented during investor roadshow' },
      { value: '3.4x', label: 'Visitor Time-on-Site', sub: 'Driven by interactive 3D configurator' },
      { value: '100%', label: 'Brand Asset Coverage', sub: 'From digital UI to physical exhibition banners' },
    ],
    deliverables: [
      'Complete Brand Identity & Vector Asset Suite',
      'Interactive 3D Web Prototype (Three.js)',
      'High-Definition Motion Video Teasers',
      'Comprehensive Brand Guidelines PDF',
    ],
    tags: ['Brand Identity', 'UI/UX Design', 'Three.js', 'Cinema 4D', 'After Effects', 'Figma'],
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    statHighlight: 'Complete 3D Ad Suite',
    clientQuote: {
      quote:
        'The brand identity and 3D trailers produced by DigiHust established our electric vehicle startup as an immediate serious contender across Europe.',
      author: 'Markus Vogel',
      role: 'Chief Brand Officer, Veloce Motors DE',
    },
  },
  {
    slug: 'hospital-bi-dashboard',
    title: 'Automated Operations & Financial BI Intelligence Dashboard',
    client: 'Titan Healthcare Group',
    clientIndustry: 'Healthcare & Enterprise Analytics',
    timeline: '4 Weeks',
    category: 'AI & Data Intelligence',
    summary:
      'Unifying fragmented operational logs from 14 clinic locations into an automated, real-time PowerBI dashboard and predictive resource allocation engine.',
    challenge:
      'Hospital directors spent 12+ manual hours every Monday compiling disconnected Excel spreadsheets from separate clinical departments to determine staffing, inventory, and bed capacity.',
    solution:
      'Our Data Intelligence squad built automated Python ETL extraction pipelines feeding into a structured data warehouse, connected to interactive PowerBI executive consoles.',
    architectureDetails: [
      'Automated Python ETL scripts extracting data hourly from clinic EHR APIs.',
      'Secure PostgreSQL analytical warehouse with HIPAA-compliant data masking.',
      'Role-based PowerBI executive reporting dashboards with daily automated email snapshots.',
      'Anomaly detection alerts flagging medication inventory shortfalls before stockouts occur.',
    ],
    metrics: [
      { value: '12h+', label: 'Executive Time Saved / Week', sub: 'Eliminated manual spreadsheet compilation' },
      { value: '100%', label: 'Real-Time Visibility', sub: 'Updated automatically every 60 minutes' },
      { value: '0', label: 'Compliance Infractions', sub: 'Strictly audited access controls' },
    ],
    deliverables: [
      'Interactive PowerBI Dashboard Suite',
      'Automated Data Ingestion Pipelines (Python / SQL)',
      'Role-Based Staff Access Controls',
      'Data Dictionary & Executive Training Workshop',
    ],
    tags: ['PowerBI', 'Python', 'SQL', 'Data Pipelines', 'ETL', 'HIPAA Hardening'],
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    statHighlight: '12+ Hours Saved / Wk',
    clientQuote: {
      quote:
        'We went from manual Excel chaos to instant executive clarity across 14 clinics. The ROI on this project was realized in the first month alone.',
      author: 'Dr. Alistair Vance',
      role: 'Chief Medical Officer, Titan Healthcare',
    },
  },
];

export const CaseStudyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const study = CASE_STUDIES.find((s) => s.slug === slug) || CASE_STUDIES[0];

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title={`${study.title} — Case Study — DigiHust`}
        description={study.summary}
      />

      {/* Header Banner */}
      <section className="bg-[var(--bg-subtle)] py-14 sm:py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/work"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[var(--brand-teal)] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Case Studies</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest block mb-2">
                {study.category} · {study.clientIndustry}
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-heading)] mb-6 leading-tight">
                {study.title}
              </h1>
              <p className="text-base sm:text-lg text-[var(--text-body)] leading-relaxed mb-6">
                {study.summary}
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5 bg-[var(--bg-surface)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]">
                  <Building2 className="w-4 h-4 text-[var(--brand-teal)]" />
                  <strong className="text-[var(--text-heading)] font-bold">{study.client}</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-[var(--bg-surface)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]">
                  <Calendar className="w-4 h-4 text-[var(--brand-teal)]" />
                  <span>{study.timeline}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-[var(--brand-teal-subtle)] text-[var(--text-heading)] px-3 py-1.5 rounded-lg border border-[var(--brand-teal)]/40 font-bold">
                  <Sparkles className="w-4 h-4 text-[var(--color-status-warning)]" />
                  <span>{study.statHighlight}</span>
                </span>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl text-center">
              <h3 className="font-bold text-[var(--text-heading)] text-base mb-2">Need Similar Execution?</h3>
              <p className="text-xs text-[var(--text-muted)] mb-6 leading-relaxed">
                Our specialized squads can architect, design, and build custom solutions for your industry.
              </p>
              <Link
                to="/contact"
                className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Request Project Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image Showcase */}
      <section className="bg-[var(--bg-page)] py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="aspect-[21/9] rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl relative bg-[var(--bg-subtle)]">
            <img
              src={study.heroImage}
              alt={study.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="bg-[var(--bg-surface)] py-12 px-6 lg:px-8 border-y border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {study.metrics.map((m) => (
            <div key={m.label} className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-center sm:text-left shadow-sm">
              <p className="font-display font-black text-3xl sm:text-4xl text-[var(--brand-teal)] mb-1">{m.value}</p>
              <p className="text-sm font-bold text-[var(--text-heading)] mb-0.5">{m.label}</p>
              <p className="text-xs text-[var(--text-muted)]">{m.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Narrative (Challenge & Solution) */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            {/* The Challenge */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-black text-[var(--color-status-error)] uppercase tracking-widest mb-3">
                <Layers className="w-4 h-4" />
                <span>The Core Challenge</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)] mb-4">
                Diagnosing the Bottleneck
              </h2>
              <p className="text-base text-[var(--text-body)] leading-relaxed bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
                {study.challenge}
              </p>
            </div>

            {/* Architectural Engineering */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-black text-[var(--brand-teal)] uppercase tracking-widest mb-3">
                <Code2 className="w-4 h-4" />
                <span>Technical Architecture</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)] mb-4">
                Engineered for Scale
              </h2>
              <div className="space-y-3">
                {study.architectureDetails.map((detail) => (
                  <div key={detail} className="flex items-start space-x-3 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-[var(--brand-teal)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--text-body)] leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Solution & Delivery */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-black text-[var(--brand-teal)] uppercase tracking-widest mb-3">
                <Zap className="w-4 h-4" />
                <span>The DigiHust Squad Execution</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)] mb-4">
                Results Delivered
              </h2>
              <p className="text-base text-[var(--text-body)] leading-relaxed mb-6">
                {study.solution}
              </p>
            </div>

            {/* Client Testimonial if available */}
            {study.clientQuote && (
              <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] relative overflow-hidden shadow-xl">
                <p className="font-display text-lg sm:text-xl text-[var(--text-heading)] italic leading-relaxed mb-6">
                  "{study.clientQuote.quote}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-teal)] flex items-center justify-center font-bold text-white text-sm">
                    {study.clientQuote.author[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-heading)] text-sm">{study.clientQuote.author}</h4>
                    <p className="text-xs text-[var(--brand-teal)] font-medium">{study.clientQuote.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Tech stack & Deliverables */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
              <h3 className="font-bold text-[var(--text-heading)] text-sm uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[var(--brand-teal)]" />
                <span>Scope Deliverables</span>
              </h3>
              <ul className="space-y-2.5">
                {study.deliverables.map((item) => (
                  <li key={item} className="flex items-start space-x-2.5 text-xs text-[var(--text-body)] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-teal)] mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
              <h3 className="font-bold text-[var(--text-heading)] text-sm uppercase tracking-wider mb-4">
                Technologies Utilized
              </h3>
              <div className="flex flex-wrap gap-2">
                {study.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] font-semibold shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[var(--bg-subtle)] py-20 px-6 lg:px-8 text-center border-t border-[var(--border-subtle)]">
        <h2 className="font-display font-extrabold text-3xl text-[var(--text-heading)] mb-4">
          Ready to Build Your Success Story?
        </h2>
        <p className="text-[var(--text-body)] mb-8 max-w-md mx-auto">
          Contact our team with your specifications to receive a scoped estimate and timeline.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold shadow-lg transition-all"
        >
          <span>Start a Project</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
