import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Code,
  Palette,
  Cpu,
  TrendingUp,
  Shield,
  Database,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Zap,
  Layers,
  Users2,
  Orbit,
  Star,
  Quote,
  Building,
  Check,
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { InteractiveCanvas } from '../ui/InteractiveCanvas';
import RadialOrbitalTimeline, { defaultServicesTimelineData } from '../ui/radial-orbital-timeline';

// ── Service categories ──────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Development',
    summary: 'Websites · Web Apps · APIs · Full Stack',
    description: 'Fast, scalable, and responsive digital products built with React, Next.js, Node.js, and modern cloud architecture.',
    tags: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    color: '#1F7A8C',
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Creative & UI/UX',
    summary: 'Brand Identity · UI/UX · Figma · Motion',
    description: 'Visual identities and user-friendly interfaces designed to elevate brand authority and convert visitors into customers.',
    tags: ['Brand Identity', 'UI/UX Design', 'Figma', 'Motion'],
    color: '#1F7A8C',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'AI & Automation',
    summary: 'LLM Solutions · Chatbots · n8n · Workflows',
    description: 'Integrating customized AI models, workflow automations, and intelligent bots to eliminate repetitive business overhead.',
    tags: ['OpenAI', 'Python', 'n8n', 'Zapier'],
    color: '#1F7A8C',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Marketing & SEO',
    summary: 'Search Optimization · Ads · Content Growth',
    description: 'Targeted search engine optimization, performance ad campaigns, and authoritative content strategies that drive revenue.',
    tags: ['Technical SEO', 'Google Ads', 'Meta Ads', 'Copywriting'],
    color: '#B08D57',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Cybersecurity',
    summary: 'Security Audits · Pen Testing · Hardening',
    description: 'Comprehensive vulnerability assessments, penetration testing, and security hardening for web applications and cloud servers.',
    tags: ['Pen Testing', 'OWASP Audit', 'Cloud Security'],
    color: '#A85C4A',
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: 'Data Intelligence',
    summary: 'PowerBI · ETL · Analytics · Automation',
    description: 'Converting siloed data into actionable executive dashboards, automated reporting, and structured business insights.',
    tags: ['PowerBI', 'Data Pipelines', 'SQL', 'Analytics'],
    color: '#1F7A8C',
  },
];

// ── Process steps ───────────────────────────────────────────────────────────
const STEPS = [
  {
    num: '01',
    title: 'Tell Us What You Need',
    desc: 'Submit your requirements via our structured quote intake. Whether you have a full functional specification or a preliminary concept, we refine the scope together.',
    icon: <Zap className="w-5 h-5 text-[var(--brand-teal)]" />,
  },
  {
    num: '02',
    title: 'We Build the Right Team',
    desc: 'DigiHust identifies the exact disciplines needed and assembles verified Digiskill specialists under a single accountable lead. No generalist guesswork.',
    icon: <Users2 className="w-5 h-5 text-[var(--brand-teal)]" />,
  },
  {
    num: '03',
    title: 'We Create & Iterate',
    desc: 'Your project progresses through clear sprint milestones with live staging previews, code reviews, and transparent check-ins throughout development.',
    icon: <Layers className="w-5 h-5 text-[var(--color-status-warning)]" />,
  },
  {
    num: '04',
    title: 'We Deliver & Support',
    desc: 'You receive production-grade code, asset packages, documentation, and a dedicated post-launch support window for complete confidence.',
    icon: <Sparkles className="w-5 h-5 text-[var(--brand-teal)]" />,
  },
];

// ── Portfolio previews ──────────────────────────────────────────────────────
const WORK_PREVIEWS = [
  {
    slug: 'real-estate-marketplace-portal',
    category: 'Web Development',
    title: 'Real-Estate Marketplace Portal',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    stat: '+140% Conversion Rate',
  },
  {
    slug: 'automotive-brand-identity',
    category: 'Creative & Branding',
    title: 'Automotive Brand Identity & Motion Ads',
    tags: ['Brand Identity', 'After Effects', '3D Animation'],
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    stat: 'Complete 3D Ad Suite',
  },
  {
    slug: 'hospital-bi-dashboard',
    category: 'AI & Data',
    title: 'Executive Sales BI Dashboard',
    tags: ['PowerBI', 'Python', 'Automated ETL'],
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    stat: '12+ Hours Saved/Week',
  },
];

// ── Verified Client Testimonials ────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: 'DigiHust transformed our slow, crashing property platform into the fastest portal in our UK regional market. Zero headache managing separate freelancers.',
    name: 'David Sterling',
    role: 'Managing Director',
    company: 'Estates Direct UK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
  },
  {
    quote: 'The 3D promotional trailers and brand system produced by DigiHust established our electric vehicle startup as an immediate serious contender in Europe.',
    name: 'Markus Vogel',
    role: 'Chief Brand Officer',
    company: 'Veloce Motors DE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    rating: 5,
  },
  {
    quote: 'Their AI squad built an automated tracking bot that resolved 78% of our customer tickets within seconds. Our support team can finally focus on VIP accounts.',
    name: 'Sarah Chen',
    role: 'Head of Operations',
    company: 'LogiXpress Global',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    rating: 5,
  },
];

// ── Pricing & Investment Packages ───────────────────────────────────────────
const PACKAGES = [
  {
    name: 'Startup MVP Sprint',
    price: 'Starting from $1,500',
    desc: 'Perfect for early-stage founders launching an initial product or high-converting landing presence.',
    features: [
      'Custom React / Next.js Web App or Landing',
      'Figma UI/UX Design System & Mobile Responsive',
      'Database Architecture & Contact Lead Routing',
      'On-Page Technical SEO & Analytics Setup',
      '14-Day Post-Launch Support & Warranty',
    ],
    popular: false,
    color: '#1F7A8C',
  },
  {
    name: 'Complete Brand & Digital Suite',
    price: 'Starting from $3,500',
    desc: 'The complete cross-functional package for scaling businesses needing engineering, branding, and automation.',
    features: [
      'Full-Stack Web App with Authentication & CMS',
      'Complete Brand Identity, Logo Suite & Guidelines',
      'Custom AI Workflow or Chatbot Automation',
      'Performance SEO Audit & Growth Architecture',
      '30-Day Post-Launch Warranty & Staging Previews',
    ],
    popular: true,
    color: '#1F7A8C',
  },
  {
    name: 'Dedicated Fractional Squad',
    price: 'Starting from $5,000 / mo',
    desc: 'A dedicated multi-disciplinary team acting as your external CTO, Lead Designer, and AI Automator.',
    features: [
      'Dedicated Engineering Lead + UI/UX + QA Squad',
      'Continuous Sprint Milestones & Weekly Releases',
      'Automated CI/CD, Server Hardening & Backups',
      'Priority 24/7 Slack / Teams Direct Channel',
      'Monthly Retainer with Flexible Scope Shifts',
    ],
    popular: false,
    color: '#1F7A8C',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <SEOHead
        title="DigiHust — Digital Services Handled by Specialized Talent"
        description="One company. Coordinated specialized talent. DigiHust delivers web engineering, design systems, AI automations, and cybersecurity under one managed roof."
      />

      {/* ── SECTION 1: FULL-SCREEN HERO (100dvh + 100vh fallback + Scroll Cue) ── */}
      <section className="relative min-h-screen min-h-[100dvh] min-h-[640px] flex flex-col justify-center px-6 lg:px-8 border-b border-[var(--border-subtle)] overflow-hidden pt-20 lg:pt-24 pb-8 safe-top bg-[var(--bg-page)]">
        {/* Interactive Canvas Background with high-clarity 3D particles */}
        <InteractiveCanvas particleCount={55} className="absolute inset-0 pointer-events-none opacity-90" />

        {/* Ambient celestial glow for depth */}
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[var(--brand-teal)]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full my-auto py-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Headlines & Pitch */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-6 xl:col-span-7"
            >
              {/* Trust Pill */}
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--brand-teal)] text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--brand-teal)] animate-pulse" />
                <span>Coordinated Specialized Talent</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] leading-[1.08] tracking-tight mb-5"
              >
                Your Digital Work.<br />
                <span className="text-[var(--brand-teal)]">
                  Handled by Skilled People.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-[var(--text-body)] max-w-xl leading-relaxed mb-8"
              >
                From custom web development and UI/UX design to AI automations, growth marketing, and cybersecurity — DigiHust unites verified specialists into unified project squads.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact"
                    className="flex items-center space-x-2.5 px-7 py-3.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-sm sm:text-base shadow-md transition-colors"
                  >
                    <span>Get a Scoped Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/services"
                    className="flex items-center space-x-2 px-7 py-3.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] font-bold text-sm sm:text-base bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-all"
                  >
                    <span>Explore Capabilities</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Service tags strip */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-[var(--text-muted)]"
              >
                <span className="text-[var(--brand-teal)] flex items-center gap-1 font-bold">
                  <Orbit className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                  Active Squads:
                </span>
                {['Web Engineering', 'Design Systems', 'AI Automations', 'Growth Marketing', 'Cybersecurity', 'BI Dashboards'].map((t, i) => (
                  <React.Fragment key={t}>
                    {i > 0 && <span className="text-[var(--border-subtle)] hidden sm:inline">·</span>}
                    <span className="hover:text-[var(--brand-teal)] transition-colors">{t}</span>
                  </React.Fragment>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column: Radial Orbital Timeline Component */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              data-cursor="orbit"
              className="lg:col-span-6 xl:col-span-5 relative flex flex-col items-center justify-center"
            >
              <div className="w-full relative rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] backdrop-blur-sm p-2 sm:p-4 shadow-xl">
                <RadialOrbitalTimeline
                  timelineData={defaultServicesTimelineData}
                  embedded={true}
                  className="w-full"
                />
                
                <div className="text-center pt-2 pb-1">
                  <p className="text-[11px] font-bold text-[var(--text-muted)] flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-teal)] animate-ping" />
                    <span>Click any orbiting service node or central hub to explore</span>
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Animated Floating Scroll Cue */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="w-full flex flex-col items-center justify-center pt-4 pb-2 relative z-20 scroll-cue"
        >
          <a
            href="#capabilities"
            aria-label="Scroll to core capabilities"
            className="flex flex-col items-center space-y-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--brand-teal)] transition-colors group cursor-pointer"
          >
            <div className="w-5 h-8 rounded-full border-2 border-[var(--border-subtle)] group-hover:border-[var(--brand-teal)] flex items-start justify-center p-1 transition-colors shadow-sm">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-2 rounded-full bg-[var(--brand-teal)]"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
              Scroll Down
            </span>
          </a>
        </motion.div>
      </section>

      {/* ── CLIENT LOGO TRUST STRIP ── */}
      <section className="bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] py-6 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <span className="font-bold uppercase tracking-wider text-[var(--brand-teal)]">Trusted by Growing Global Brands:</span>
          <div className="flex flex-wrap items-center gap-8 font-display font-extrabold text-sm text-[var(--text-heading)] opacity-85">
            <span>Estates Direct UK</span>
            <span>Veloce Motors</span>
            <span>Titan Healthcare</span>
            <span>Apex FinTech</span>
            <span>LogiXpress Global</span>
          </div>
        </div>
      </section>

      {/* ── METRICS STRIP ── */}
      <section className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] py-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { metric: '99.4%', label: 'On-Time Milestone Delivery', sub: 'Disciplined sprint management' },
            { metric: '100%', label: 'Verified Domain Specialists', sub: 'Trained through Digiskill' },
            { metric: '1 Point', label: 'Of Contact Per Project', sub: 'No freelancer juggling' },
            { metric: '24h', label: 'Quote Proposal Turnaround', sub: 'Rapid scope assessment' },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center sm:text-left"
            >
              <p className="font-display font-black text-3xl sm:text-4xl text-[var(--brand-teal)] mb-1">{item.metric}</p>
              <p className="text-sm font-bold text-[var(--text-heading)] mb-0.5">{item.label}</p>
              <p className="text-xs text-[var(--text-muted)]">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: SERVICES OVERVIEW ── */}
      <section id="capabilities" className="py-24 px-6 lg:px-8 relative bg-[var(--bg-page)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">Core Capabilities</p>
              <h2 className="font-display font-extrabold text-4xl text-[var(--text-heading)] mb-2">One Company. Every Digital Need.</h2>
              <p className="text-base text-[var(--text-body)] max-w-xl">
                Instead of hiring and managing 5 separate freelance silos, DigiHust executes your complete vision under one unified scope.
              </p>
            </div>
            <Link to="/services" className="inline-flex items-center space-x-1.5 text-sm font-bold text-[var(--brand-teal)] hover:underline">
              <span>View all services in detail</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group border border-[var(--border-subtle)] rounded-2xl p-7 hover:border-[var(--brand-teal)] hover:shadow-xl transition-all bg-[var(--bg-surface)] flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white shadow-md"
                    style={{ backgroundColor: svc.color }}
                  >
                    {svc.icon}
                  </div>
                  <h3 className="font-display font-extrabold text-xl text-[var(--text-heading)] mb-1">{svc.title}</h3>
                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">{svc.summary}</p>
                  <p className="text-sm text-[var(--text-body)] leading-relaxed mb-5">{svc.description}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {svc.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-body)] border border-[var(--border-subtle)] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/services"
                    className="inline-flex items-center space-x-1 text-sm font-bold text-[var(--brand-teal)] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore Service</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WHY DIGIHUST ── */}
      <section className="py-24 px-6 lg:px-8 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">The Model Advantage</p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mb-6 leading-tight">
                A Managed Digital Company — Not a Random Freelancer Roll.
              </h2>
              <p className="text-base text-[var(--text-body)] leading-relaxed mb-6">
                Directly managing five independent freelancers means five separate negotiations, misaligned timelines, blame-shifting, and inconsistent quality.
              </p>
              <p className="text-base text-[var(--text-body)] leading-relaxed mb-8">
                With DigiHust, you engage one professional entity. We architect the scope, assign verified specialists to their respective domains, and guarantee delivery under a single service-level agreement.
              </p>
              <div className="space-y-3.5">
                {[
                  'Single contract, single invoice, single accountable point of contact',
                  'Domain specialists matched to your precise tech stack',
                  'Rigorous internal QA before any deliverable touches your hands',
                  'Talent sourced and vetted directly through the Digiskill program',
                ].map((point) => (
                  <div key={point} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-[var(--brand-teal)] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[var(--text-heading)] font-medium">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Interactive Model Architecture Flow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center select-none bg-[var(--bg-surface)] p-8 rounded-3xl border border-[var(--border-subtle)] shadow-xl"
            >
              {/* Client Box */}
              <div className="w-48 py-3 px-6 rounded-xl bg-[var(--bg-page)] text-[var(--text-heading)] border border-[var(--border-subtle)] text-center font-bold text-sm shadow-sm">
                Client Organization
              </div>
              <div className="w-px h-6 bg-[var(--border-subtle)]" />

              {/* DigiHust Core */}
              <div className="w-64 py-4 px-6 rounded-2xl bg-gradient-to-br from-[#022B3A] to-[#1F7A8C] text-white text-center font-extrabold text-base shadow-md border border-[var(--border-subtle)]">
                DigiHust Management
                <p className="text-[10px] font-normal text-[#E1E5F2] mt-0.5 tracking-wider uppercase">
                  Single Accountable Entity
                </p>
              </div>
              <div className="w-px h-6 bg-[var(--border-subtle)]" />

              {/* Specialized Squads */}
              <div className="grid grid-cols-3 gap-3 w-full">
                {['Engineering', 'Design & UX', 'AI & Data'].map((label) => (
                  <div
                    key={label}
                    className="py-2.5 px-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-heading)] text-center text-xs font-bold shadow-sm"
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 w-2/3 mt-3">
                {['Growth / SEO', 'Cybersecurity'].map((label) => (
                  <div
                    key={label}
                    className="py-2.5 px-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-heading)] text-center text-xs font-bold shadow-sm"
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="w-px h-6 bg-[var(--border-subtle)] mt-3" />

              {/* Final Delivered Output */}
              <div className="w-60 py-3.5 px-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--brand-teal)] text-[var(--brand-teal)] text-center font-bold text-sm shadow-sm">
                ✓ Unified Delivered Solution
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: SELECTED WORK ── */}
      <section className="py-24 px-6 lg:px-8 bg-[var(--bg-page)] border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">Case Studies</p>
              <h2 className="font-display font-extrabold text-4xl text-[var(--text-heading)]">Selected Work</h2>
            </div>
            <Link
              to="/work"
              className="inline-flex items-center space-x-2 text-sm font-bold text-[var(--brand-teal)] hover:underline"
            >
              <span>View all portfolio projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WORK_PREVIEWS.map((project) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                data-cursor="view"
                className="group border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-[var(--bg-surface)] hover:border-[var(--brand-teal)] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video overflow-hidden relative bg-slate-100 dark:bg-[var(--bg-surface)]">
                    <img
                      src={project.img}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[var(--bg-page)]/90 backdrop-blur-sm border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--brand-teal)]">
                      {project.stat}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[11px] font-bold text-[var(--brand-teal)] uppercase tracking-wider mb-1">
                      {project.category}
                    </p>
                    <h3 className="font-display font-bold text-lg text-[var(--text-heading)] mb-3 group-hover:text-[var(--brand-teal)] transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-body)] border border-[var(--border-subtle)] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <Link
                    to={`/work/${project.slug}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-[var(--brand-teal)] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: VERIFIED TESTIMONIALS ── */}
      <section className="py-24 px-6 lg:px-8 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">Client Feedback</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mb-4">
              What Founders Say About DigiHust
            </h2>
            <p className="text-[var(--text-body)] text-sm">
              Real reviews from international organizations who trusted our managed talent squads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-center space-x-1 text-[var(--color-status-warning)] mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[var(--color-status-warning)]" />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--text-body)] leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center space-x-3.5 pt-4 border-t border-[var(--border-subtle)]">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--brand-teal)]/40" />
                  <div>
                    <h4 className="font-bold text-[var(--text-heading)] text-sm">{t.name}</h4>
                    <p className="text-xs text-[var(--brand-teal)] font-medium">{t.role}, {t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: TRANSPARENT INVESTMENT / PRICING PACKAGES ── */}
      <section className="py-24 px-6 lg:px-8 bg-[var(--bg-page)] border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">Transparent Engagements</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mb-4">
              Project Investment Guide
            </h2>
            <p className="text-[var(--text-body)] text-sm">
              Clear scope packages with milestone sign-offs. Custom enterprise scopes quoted within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PACKAGES.map((pkg) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className={`rounded-3xl p-8 border flex flex-col justify-between transition-all ${
                  pkg.popular
                    ? 'border-[var(--brand-teal)] bg-[var(--bg-surface)] shadow-2xl ring-2 ring-[var(--brand-teal)]/20 relative'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:shadow-lg'
                }`}
              >
                <div>
                  {pkg.popular && (
                    <span className="inline-block px-3 py-1 rounded-full bg-[var(--brand-teal)] text-white text-[10px] font-black uppercase tracking-wider mb-4">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-display font-bold text-xl text-[var(--text-heading)] mb-1">{pkg.name}</h3>
                  <p className="text-2xl font-black text-[var(--brand-teal)] my-3">{pkg.price}</p>
                  <p className="text-xs text-[var(--text-body)] leading-relaxed mb-6">{pkg.desc}</p>

                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feat) => (
                      <div key={feat} className="flex items-start space-x-2.5 text-xs text-[var(--text-body)] font-medium">
                        <Check className="w-4 h-4 text-[var(--brand-teal)] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/contact"
                  className={`w-full py-3.5 rounded-xl text-center font-bold text-xs sm:text-sm transition-all ${
                    pkg.popular
                      ? 'bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white shadow-md'
                      : 'border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] hover:text-[var(--brand-teal)] bg-[var(--bg-subtle)]'
                  }`}
                >
                  Request Proposal for Scope
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: CALL TO ACTION ── */}
      <section className="py-24 px-6 lg:px-8 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-[var(--text-heading)] mb-4">
              Have a Project in Mind?
            </h2>
            <p className="text-lg text-[var(--text-body)] mb-10 max-w-xl mx-auto">
              Submit your project scope today. We will review requirements and deliver a structured pricing proposal within 24 hours.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                to="/contact"
                className="inline-flex items-center space-x-3 px-10 py-5 rounded-2xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-extrabold text-lg shadow-xl transition-all"
              >
                <span>Start a Project Proposal</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
