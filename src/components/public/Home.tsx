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
  Briefcase,
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { InteractiveCanvas } from '../ui/InteractiveCanvas';
import RadialOrbitalTimeline, { defaultServicesTimelineData } from '../ui/radial-orbital-timeline';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

// ── Service categories ──────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Development',
    summary: 'Websites · Web Apps · APIs · Full Stack',
    description: 'Fast, scalable, and responsive digital products built with React, Next.js, Node.js, and modern cloud architecture.',
    tags: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    color: '#1F7A8C', // Brand Teal
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Creative & UI/UX',
    summary: 'Brand Identity · UI/UX · Figma · Motion',
    description: 'Visual identities and user-friendly interfaces designed to elevate brand authority and convert visitors into customers.',
    tags: ['Brand Identity', 'UI/UX Design', 'Figma', 'Motion'],
    color: '#8B5CF6', // Creative Purple
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'AI & Automation',
    summary: 'LLM Solutions · Chatbots · n8n · Workflows',
    description: 'Integrating customized AI models, workflow automations, and intelligent bots to eliminate repetitive business overhead.',
    tags: ['OpenAI', 'Python', 'n8n', 'Zapier'],
    color: '#0284C7', // Cyber Cyan Blue
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Marketing & SEO',
    summary: 'Search Optimization · Ads · Content Growth',
    description: 'Targeted search engine optimization, performance ad campaigns, and authoritative content strategies that drive revenue.',
    tags: ['Technical SEO', 'Google Ads', 'Meta Ads', 'Copywriting'],
    color: '#D97706', // Growth Amber
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Cybersecurity',
    summary: 'Security Audits · Pen Testing · Hardening',
    description: 'Comprehensive vulnerability assessments, penetration testing, and security hardening for web applications and cloud servers.',
    tags: ['Pen Testing', 'OWASP Audit', 'Cloud Security'],
    color: '#E11D48', // Security Crimson Red
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: 'Data Intelligence',
    summary: 'PowerBI · ETL · Analytics · Automation',
    description: 'Converting siloed data into actionable executive dashboards, automated reporting, and structured business insights.',
    tags: ['PowerBI', 'Data Pipelines', 'SQL', 'Analytics'],
    color: '#059669', // Data Emerald Green
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
  const { t } = useLanguage();
  const { siteContent } = useApp();

  const hero = siteContent?.hero;
  const caseStudies = siteContent?.caseStudies || [];
  const testimonials = siteContent?.testimonials || [];
  const valueProps = siteContent?.valueProps || [];
  const SERVICE_PALETTE = ['#1F7A8C', '#8B5CF6', '#0284C7', '#D97706', '#E11D48', '#059669'];
  const servicesList = (siteContent?.services && siteContent.services.length > 0)
    ? siteContent.services.map((s, idx) => ({
        icon: SERVICES[idx]?.icon || <Code className="w-6 h-6" />,
        title: s.title,
        summary: s.tagline || 'Specialized Domain Squad',
        description: s.description,
        tags: s.features || ['Specialized Delivery'],
        color: (s.color && s.color !== '#1F7A8C') ? s.color : SERVICE_PALETTE[idx % SERVICE_PALETTE.length]
      }))
    : SERVICES;

  return (
    <div className="overflow-hidden">
      <SEOHead
        title="DigiHust — Digital Services Handled by Specialized Talent"
        description="One company. Coordinated specialized talent. DigiHust delivers web engineering, design systems, AI automations, and cybersecurity under one managed roof."
      />

      {/* ── SECTION 1: COMPACT FULL-VIEWPORT HERO (Responsive on all screen sizes) ── */}
      <section className="relative lg:min-h-[calc(100dvh-4rem)] lg:max-h-[860px] flex flex-col justify-between px-4 sm:px-6 lg:px-8 border-b border-[var(--border-subtle)] overflow-hidden pt-20 sm:pt-22 lg:pt-16 pb-6 lg:pb-2 bg-[var(--bg-page)]">
        {/* Interactive Canvas Background with high-clarity 3D particles */}
        <InteractiveCanvas particleCount={50} className="absolute inset-0 pointer-events-none opacity-90" />

        {/* Ambient celestial glow for depth */}
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[var(--brand-teal)]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full my-auto py-2 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Column: Headlines & Pitch */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-6 xl:col-span-7"
            >
              {/* Trust Pill */}
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--brand-teal)] text-[11px] font-semibold uppercase tracking-wider mb-3 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--brand-teal)] animate-pulse" />
                <span>{hero?.badgeText || t('hero_trust_pill')}</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-heading)] leading-[1.14] tracking-tight mb-3"
              >
                {hero?.headlineLine1 || t('hero_headline_1')}<br />
                <span className="text-[var(--brand-teal)]">
                  {hero?.headlineHighlight || hero?.headlineLine2 || t('hero_headline_2')}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-xs sm:text-sm lg:text-base text-[var(--text-body)] max-w-lg leading-relaxed mb-5"
              >
                {hero?.subheadline || t('hero_sub')}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact"
                    className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
                  >
                    <span>{hero?.ctaPrimaryText || t('btn_scoped_quote')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/services"
                    className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] font-bold text-xs sm:text-sm bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-all"
                  >
                    <span>{hero?.ctaSecondaryText || t('btn_explore_capabilities')}</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Service tags strip */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold text-[var(--text-muted)]"
              >
                <span className="text-[var(--brand-teal)] flex items-center gap-1 font-bold">
                  <Orbit className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                  {t('hero_active_squads')}
                </span>
                {['Web Engineering', 'Design Systems', 'AI Automations', 'Growth Marketing', 'Cybersecurity', 'BI Dashboards'].map((tName, i) => (
                  <React.Fragment key={tName}>
                    {i > 0 && <span className="text-[var(--border-subtle)] hidden sm:inline">·</span>}
                    <span className="hover:text-[var(--brand-teal)] transition-colors">{tName}</span>
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
              <div className="w-full relative rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] backdrop-blur-sm p-2 shadow-xl min-h-[280px] sm:min-h-[340px]">
                <RadialOrbitalTimeline
                  timelineData={defaultServicesTimelineData}
                  embedded={true}
                  className="w-full"
                />
                
                <div className="text-center pt-1 pb-0.5">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-teal)] animate-ping" />
                    <span>{t('hero_orbit_instruction')}</span>
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Animated Floating Scroll Cue */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="w-full flex flex-col items-center justify-center pt-1 pb-1 relative z-20 scroll-cue"
        >
          <a
            href="#capabilities"
            aria-label="Scroll to core capabilities"
            className="flex flex-col items-center space-y-1 text-xs text-[var(--text-muted)] hover:text-[var(--brand-teal)] transition-colors group cursor-pointer"
          >
            <div className="w-4 h-7 rounded-full border-2 border-[var(--border-subtle)] group-hover:border-[var(--brand-teal)] flex items-start justify-center p-0.5 transition-colors shadow-sm">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-1.5 rounded-full bg-[var(--brand-teal)]"
              />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
              {t('scroll_down')}
            </span>
          </a>
        </motion.div>
      </section>

      {/* ── CLIENT LOGO TRUST STRIP ── */}
      <section className="bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] py-6 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <span className="font-bold uppercase tracking-wider text-[var(--brand-teal)]">{t('trust_brands')}</span>
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
            { metric: '99.4%', label: t('metric_delivery'), sub: t('metric_delivery_sub') },
            { metric: '100%', label: t('metric_talent'), sub: t('metric_talent_sub') },
            { metric: '1 Point', label: t('metric_contact'), sub: t('metric_contact_sub') },
            { metric: '24h', label: t('metric_turnaround'), sub: t('metric_turnaround_sub') },
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
              <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">{t('services_tag')}</p>
              <h2 className="font-display font-extrabold text-4xl text-[var(--text-heading)] mb-2">{t('services_heading')}</h2>
              <p className="text-base text-[var(--text-body)] max-w-xl">
                {t('services_sub')}
              </p>
            </div>
            <Link to="/services" className="inline-flex items-center space-x-1.5 text-sm font-bold text-[var(--brand-teal)] hover:underline">
              <span>{t('services_view_all')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((svc) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="h-full"
              >
                <Link
                  to="/services"
                  className="group border border-[var(--border-subtle)] rounded-2xl p-7 hover:border-[var(--brand-teal)] hover:shadow-xl transition-all duration-200 ease-out bg-[var(--bg-surface)] flex flex-col justify-between h-full cursor-pointer select-none block"
                >
                  <div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white shadow-md group-hover:scale-105 transition-transform duration-200 ease-out"
                      style={{ backgroundColor: svc.color }}
                    >
                      {svc.icon}
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-[var(--text-heading)] mb-1 group-hover:text-[var(--brand-teal)] transition-colors duration-150">
                      {svc.title}
                    </h3>
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">{svc.summary}</p>
                    <p className="text-sm text-[var(--text-body)] leading-relaxed mb-5">{svc.description}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {svc.tags.map((tTag) => (
                        <span key={tTag} className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-body)] border border-[var(--border-subtle)] font-medium">
                          {tTag}
                        </span>
                      ))}
                    </div>
                    <div className="inline-flex items-center space-x-1 text-sm font-bold text-[var(--brand-teal)] group-hover:translate-x-1 transition-transform duration-150">
                      <span>{t('services_explore')}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
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
              <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">{t('model_tag')}</p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mb-6 leading-tight">
                {t('model_heading')}
              </h2>
              <p className="text-base text-[var(--text-body)] leading-relaxed mb-6">
                {t('model_p1')}
              </p>
              <p className="text-base text-[var(--text-body)] leading-relaxed mb-8">
                {t('model_p2')}
              </p>
              <div className="space-y-3.5">
                {[
                  t('model_bullet_1'),
                  t('model_bullet_2'),
                  t('model_bullet_3'),
                  t('model_bullet_4'),
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
              <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">{t('work_tag')}</p>
              <h2 className="font-display font-extrabold text-4xl text-[var(--text-heading)]">{t('work_heading')}</h2>
            </div>
            <Link
              to="/work"
              className="inline-flex items-center space-x-2 text-sm font-bold text-[var(--brand-teal)] hover:underline"
            >
              <span>{t('work_view_all')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {caseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {caseStudies.map((project) => (
                <motion.div
                  key={project.id || project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  data-cursor="view"
                  className="h-full"
                >
                  <Link
                    to={`/work/${project.slug}`}
                    className="group border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-[var(--bg-surface)] hover:border-[var(--brand-teal)] hover:shadow-xl transition-all duration-200 ease-out cursor-pointer flex flex-col justify-between h-full block"
                  >
                    <div>
                      <div className="aspect-video overflow-hidden relative bg-[var(--bg-subtle)]">
                        <img
                          src={project.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 ease-out"
                        />
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[var(--bg-page)]/90 backdrop-blur-sm border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--brand-teal)]">
                          {project.impactMetric} {project.impactLabel}
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-[11px] font-bold text-[var(--brand-teal)] uppercase tracking-wider mb-1">
                          {project.category}
                        </p>
                        <h3 className="font-display font-bold text-lg text-[var(--text-heading)] mb-3 group-hover:text-[var(--brand-teal)] transition-colors duration-150">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tags?.map((tTag) => (
                            <span
                              key={tTag}
                              className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-body)] border border-[var(--border-subtle)] font-medium"
                            >
                              {tTag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <div className="inline-flex items-center space-x-1 text-xs font-bold text-[var(--brand-teal)] group-hover:translate-x-1 transition-transform duration-150">
                        <span>{t('work_read_case')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-4 shadow-sm max-w-2xl mx-auto">
              <Briefcase className="w-10 h-10 text-[var(--brand-teal)] mx-auto opacity-70" />
              <h3 className="font-display font-bold text-xl text-[var(--text-heading)]">
                Enterprise Portfolio & Client Deliverables
              </h3>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                We deliver tailored full-stack web applications, brand identity design systems, and AI automations under strict NDA standards. Add your case studies via the CMS Studio or contact our management team for a customized portfolio walkthrough.
              </p>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-xs shadow transition-all"
                >
                  <span>Request Custom Portfolio Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 5: VERIFIED TESTIMONIALS ── */}
      <section className="py-24 px-6 lg:px-8 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">{t('testimonials_tag')}</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mb-4">
              {t('testimonials_heading')}
            </h2>
            <p className="text-[var(--text-body)] text-sm">
              {t('testimonials_sub')}
            </p>
          </div>

          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((tItem) => (
                <motion.div
                  key={tItem.id || tItem.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between shadow-md"
                >
                  <div>
                    <div className="flex items-center space-x-1 text-[var(--color-status-warning)] mb-4">
                      {[...Array(tItem.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[var(--color-status-warning)]" />
                      ))}
                    </div>
                    <p className="text-xs text-[var(--text-body)] italic leading-relaxed mb-6">
                      "{tItem.quote}"
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 pt-4 border-t border-[var(--border-subtle)]">
                    <img
                      src={tItem.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(tItem.name)}&background=1F7A8C&color=fff`}
                      alt={tItem.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-[var(--text-heading)]">{tItem.name}</h4>
                      <p className="text-[10px] text-[var(--text-muted)]">{tItem.role}, {tItem.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-3xl bg-[var(--bg-  )] border border-[var(--border-subtle)] text-center space-y-3 max-w-xl mx-auto shadow-sm">
              <Shield className="w-8 h-8 text-[var(--brand-teal)] mx-auto opacity-70" />
              <h3 className="font-display font-bold text-lg text-[var(--text-heading)]">
                100% Quality & Milestone Guarantee
              </h3>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                Every project sprint is reviewed and verified by senior architects before delivery. Real client testimonials will appear here once added through your CMS portal.
              </p>
            </div>
          )}
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
              {t('cta_heading')}
            </h2>
            <p className="text-lg text-[var(--text-body)] mb-10 max-w-xl mx-auto">
              {t('cta_sub')}
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                to="/contact"
                className="inline-flex items-center space-x-3 px-10 py-5 rounded-2xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-extrabold text-lg shadow-xl transition-all"
              >
                <span>{t('btn_start_proposal')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
