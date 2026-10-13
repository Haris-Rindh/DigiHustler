import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useReducedMotion, type Variants } from 'framer-motion';
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
  Zap,
  Layers,
  Users2,
  Orbit,
  Star,
  Quote,
  Building,
  Check,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Code2,
  Search,
  X,
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { HeroWaves } from '../ui/HeroWaves';
import { ServiceCard } from '../ui/ServiceCard';
import { ProjectCard } from '../ui/ProjectCard';
import { LavaProposalButton } from '../ui/LavaProposalButton';
import RadialOrbitalTimeline, { defaultServicesTimelineData } from '../ui/radial-orbital-timeline';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Project, getProjectLiveUrl, PROJECTS } from './Work';
import { getServiceIcon } from '../../lib/serviceIcons';
import { handleCardSpotlightMove, handleCardSpotlightLeave } from '../../lib/cardSpotlight';
import { GenerativePattern } from '../ui/ServiceBentoCard';

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

// ── Frequently Asked Questions (Native details/summary for SEO text ratio) ──
const HOME_FAQ_ITEMS = [
  {
    question: 'What does DigiHust do?',
    answer:
      'DigiHust is a managed digital services company delivering end-to-end solutions across five core disciplines: Web Engineering, Creative & UI/UX Design, AI & Workflow Automation, Growth Marketing & SEO, and Cybersecurity. Instead of leaving clients to coordinate disconnected contractors, we assemble dedicated specialist squads under unified technical leadership.',
  },
  {
    question: 'How does DigiHust differ from hiring independent freelancers?',
    answer:
      'Managing separate freelancers means multiple negotiations, misaligned schedules, blame-shifting, and unpredictable quality. DigiHust operates as a single accountable agency partner. You receive a dedicated point of contact, synchronized sprint milestones, unified delivery, and strict service-level agreements (SLAs) for the entire project lifecycle.',
  },
  {
    question: 'How fast does a project proposal arrive?',
    answer:
      'We review your project requirements and deliver a calibrated scope breakdown, architectural recommendation, and transparent milestone quote within 24 hours of your intake submission.',
  },
  {
    question: 'Who does the work on client projects?',
    answer:
      "All work is completed by verified domain specialists trained and vetted through Pakistan's Digiskill ecosystem and DigiHust's internal technical benchmarks. Each squad member is matched specifically to your technical stack, whether React, Next.js, Python AI pipelines, Figma design systems, or security auditing.",
  },
  {
    question: 'How does DigiHust handle quality assurance?',
    answer:
      'Every deliverable undergoes multi-stage internal review before reaching your team. Senior technical architects verify code quality, performance metrics, and security compliance to ensure all work meets production standards prior to milestone sign-off.',
  },
  {
    question: 'What does the Quality & Milestone Guarantee cover?',
    answer:
      'We provide a 100% Quality & Milestone Guarantee. Projects are divided into transparent staging sprints with agreed-upon acceptance criteria. Client feedback is integrated into each review, and you maintain complete visibility over deliverables before milestones are accepted.',
  },
  {
    question: 'How do contracts, communication, and invoicing work?',
    answer:
      'You work under a single legal contract and receive a single consolidated invoice, regardless of how many disciplines are involved in your build. One dedicated project manager handles communication, timeline tracking, and squad coordination from kickoff to final handover.',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const { siteContent } = useApp();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const modelDiagramRef = useRef<HTMLDivElement>(null);
  const isModelInView = useInView(modelDiagramRef, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  const diagramContainerVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: 0,
      },
    },
  };

  const diagramNodeVariants: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.35,
        ease: 'easeOut',
      },
    },
  };

  const squadGroupVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const hero = siteContent?.hero;
  const rawCaseStudies = siteContent?.caseStudies || [];
  const featuredProjects: Project[] = (rawCaseStudies && rawCaseStudies.length > 0)
    ? rawCaseStudies.slice(0, 3).map((cs) => ({
        id: cs.slug || cs.id,
        category: cs.category || 'Web Development',
        filterCat: cs.category?.includes('Design') || cs.category?.includes('Brand') ? 'Creative' : cs.category?.includes('AI') ? 'AI & Data' : 'Development',
        title: cs.title,
        client: cs.client || 'Enterprise Client',
        description: cs.summary || 'Custom engineered digital solution delivered by DigiHust specialized squads.',
        challenge: cs.challenge || 'Client required modernized architecture, scalable infrastructure, and optimized acquisition funnels.',
        solution: cs.solution || 'DigiHust assembled a dedicated cross-functional squad to engineer an end-to-end custom application with enterprise SLA guarantees.',
        results: cs.impactMetric ? [`${cs.impactMetric} ${cs.impactLabel || 'Uplift'}`] : ['+140% Conversion Rate', 'Sub-800ms Latency', '100% On-Time Delivery'],
        tags: cs.tags && cs.tags.length > 0 ? cs.tags : ['React', 'Full Stack', 'Cloud'],
        img: cs.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
        projectUrl: getProjectLiveUrl(cs),
      }))
    : PROJECTS.slice(0, 3);

  const testimonials = (siteContent?.testimonials && siteContent.testimonials.length > 0)
    ? siteContent.testimonials
    : TESTIMONIALS;
  const valueProps = siteContent?.valueProps || [];
  const SERVICE_PALETTE = ['#1F7A8C', '#8B5CF6', '#0284C7', '#D97706', '#E11D48', '#059669'];
  const servicesList = (siteContent?.services && siteContent.services.length > 0)
    ? siteContent.services.map((s, idx) => ({
        icon: s.icon ? getServiceIcon(s.icon, 'w-6 h-6') : (SERVICES[idx]?.icon || null),
        title: s.title,
        summary: s.tagline || 'Specialized Domain Squad',
        description: s.description,
        tags: s.features || ['Specialized Delivery'],
        color: (s.color && s.color !== '#1F7A8C') ? s.color : SERVICE_PALETTE[idx % SERVICE_PALETTE.length],
        imageUrl: s.imageUrl,
        patternVariant: s.patternVariant,
        slug: s.slug || s.id,
        linkTarget: s.linkTarget,
      }))
    : SERVICES;

  return (
    <div className="overflow-hidden">
      <SEOHead
        title="DigiHust | Digital Services Handled by Specialized Talent"
        description="One company, coordinated specialist talent. DigiHust delivers web engineering, design systems, AI automation and cybersecurity under one roof."
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'DigiHust',
            url: 'https://www.digihust.tech',
            logo: 'https://www.digihust.tech/logo.png',
            image: 'https://www.digihust.tech/og-image.jpg',
            description:
              'One company, coordinated specialist talent. DigiHust delivers web engineering, design systems, AI automation and cybersecurity under one roof.',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'PK',
            },
            founder: [
              {
                '@type': 'Person',
                name: 'Mahad Abbas',
                jobTitle: 'Founder & CEO',
              },
              {
                '@type': 'Person',
                name: 'Muhammad Haseeb',
                jobTitle: 'Co-Founder',
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: HOME_FAQ_ITEMS.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          },
        ]}
      />

      {/* ── SECTION 1: COMPACT FULL-VIEWPORT HERO (Responsive on all screen sizes) ── */}
      <section data-hero="true" className="relative lg:min-h-[calc(100dvh-4rem)] lg:max-h-[860px] flex flex-col justify-between px-4 sm:px-6 lg:px-8 border-b border-[var(--border-subtle)] overflow-hidden pt-24 sm:pt-26 lg:pt-20 pb-8 lg:pb-8 bg-[var(--bg-page)]">
        {/* 3 Flowing SVG wave paths behind hero per Item 9 */}
        <HeroWaves />

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
                    className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl btn-brand-futuristic text-white font-bold text-xs sm:text-sm shadow-md transition-all"
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
                className="h-full"
              >
                <ServiceCard service={svc} />
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
              ref={modelDiagramRef}
              initial="hidden"
              animate={isModelInView ? 'visible' : 'hidden'}
              variants={diagramContainerVariants}
              className="relative flex flex-col items-center select-none bg-[var(--bg-surface)] p-5 sm:p-6 w-full max-w-md mx-auto h-auto rounded-3xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden group"
            >
              {/* Ambient radial glow inside container */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[var(--brand-teal)]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Status Header Pill */}
              <motion.div
                variants={diagramNodeVariants}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/30 text-[10px] font-bold text-[var(--brand-teal)] uppercase tracking-wider mb-3 relative z-10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-teal)] animate-ping" />
                <span>Coordinated Delivery Architecture</span>
              </motion.div>

              {/* Client Box */}
              <motion.div
                variants={diagramNodeVariants}
                whileHover={{ scale: 1.03, y: -2 }}
                className="w-48 sm:w-52 py-2 px-4 rounded-xl bg-[var(--bg-page)] text-[var(--text-heading)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] shadow-sm text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors relative z-10"
              >
                <Building className="w-4 h-4 text-[var(--brand-teal)]" />
                <span>Client Organization</span>
              </motion.div>

              {/* Animated Vertical Flow Connector 1 */}
              <motion.div
                variants={diagramNodeVariants}
                className="relative w-0.5 h-5 bg-[var(--border-subtle)] my-0.5 overflow-hidden"
              >
                <motion.div
                  animate={shouldReduceMotion ? {} : { y: [-10, 22] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-full h-2.5 bg-gradient-to-b from-transparent via-[var(--brand-teal)] to-transparent"
                />
              </motion.div>

              {/* DigiHust Core Management Hub */}
              <motion.div
                variants={diagramNodeVariants}
                whileHover={{ scale: 1.03, y: -2 }}
                className="relative w-64 sm:w-72 py-2.5 px-4 rounded-xl bg-gradient-to-br from-[#022B3A] to-[#1F7A8C] text-white text-center font-extrabold text-sm sm:text-base shadow-lg shadow-[#1F7A8C]/20 border border-[#1F7A8C]/60 cursor-pointer overflow-hidden group z-10"
              >
                {/* Shimmer sweep effect */}
                {!shouldReduceMotion && (
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none"
                  />
                )}
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>DigiHust Management</span>
                </div>
                <p className="text-[10px] font-medium text-[#E1E5F2] mt-0.5 tracking-wider uppercase relative z-10">
                  Single Accountable Entity · SLA Guaranteed
                </p>
              </motion.div>

              {/* Animated Vertical Flow Connector 2 */}
              <motion.div
                variants={diagramNodeVariants}
                className="relative w-0.5 h-5 bg-[var(--border-subtle)] my-0.5 overflow-hidden"
              >
                <motion.div
                  animate={shouldReduceMotion ? {} : { y: [-10, 22] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-full h-2.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
                />
              </motion.div>

              {/* Specialized Squads Grid */}
              <motion.div variants={squadGroupVariants} className="w-full flex flex-col items-center relative z-10">
                <div className="grid grid-cols-3 gap-2 w-full">
                  {[
                    { label: 'Engineering', icon: <Code2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />, border: 'hover:border-cyan-500/60' },
                    { label: 'Design & UX', icon: <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />, border: 'hover:border-purple-500/60' },
                    { label: 'AI & Data', icon: <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />, border: 'hover:border-amber-500/60' },
                  ].map((squad) => (
                    <motion.div
                      key={squad.label}
                      variants={diagramNodeVariants}
                      whileHover={{ scale: 1.04, y: -1 }}
                      className={`py-1.5 px-1 sm:px-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-heading)] text-center text-[11px] sm:text-xs font-bold shadow-sm cursor-pointer flex flex-col items-center justify-center gap-1 transition-all ${squad.border} hover:bg-[var(--bg-subtle)]`}
                    >
                      {squad.icon}
                      <span className="truncate max-w-full">{squad.label}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 w-3/4 sm:w-2/3 mt-2">
                  {[
                    { label: 'Growth / SEO', icon: <Search className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />, border: 'hover:border-emerald-500/60' },
                    { label: 'Cybersecurity', icon: <Shield className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />, border: 'hover:border-rose-500/60' },
                  ].map((squad) => (
                    <motion.div
                      key={squad.label}
                      variants={diagramNodeVariants}
                      whileHover={{ scale: 1.04, y: -1 }}
                      className={`py-1.5 px-1 sm:px-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-heading)] text-center text-[11px] sm:text-xs font-bold shadow-sm cursor-pointer flex flex-col items-center justify-center gap-1 transition-all ${squad.border} hover:bg-[var(--bg-subtle)]`}
                    >
                      {squad.icon}
                      <span className="truncate max-w-full">{squad.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Animated Vertical Flow Connector 3 */}
              <motion.div
                variants={diagramNodeVariants}
                className="relative w-0.5 h-5 bg-[var(--border-subtle)] my-0.5 overflow-hidden"
              >
                <motion.div
                  animate={shouldReduceMotion ? {} : { y: [-10, 22] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-full h-2.5 bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
                />
              </motion.div>

              {/* Final Delivered Output */}
              <motion.div
                variants={diagramNodeVariants}
                whileHover={{ scale: 1.03, y: -2 }}
                className="relative w-56 sm:w-64 py-2 px-4 rounded-xl bg-[var(--bg-page)] border-2 border-[var(--brand-teal)] text-[var(--brand-teal)] dark:text-cyan-300 text-center font-bold text-xs sm:text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 z-10 group"
              >
                {!shouldReduceMotion && (
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 2px 10px -2px rgba(31, 122, 140, 0.15)',
                        '0 4px 18px -2px rgba(31, 122, 140, 0.35)',
                        '0 2px 10px -2px rgba(31, 122, 140, 0.15)',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-xl pointer-events-none"
                  />
                )}
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[var(--brand-teal)] text-white flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0">
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span>Unified Delivered Solution</span>
              </motion.div>
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
              to="/portfolio"
              className="inline-flex items-center space-x-2 text-sm font-bold text-[var(--brand-teal)] hover:underline"
            >
              <span>{t('work_view_all')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {featuredProjects.map((project) => (
              <motion.div
                key={project.id || project.title}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <ProjectCard
                  project={project}
                  onInspect={(p) => setSelectedProject(p as any)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CLIENT FEEDBACK (Item 4 Redesign) ── */}
      <section className="py-24 px-6 lg:px-8 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">
              {t('testimonials_tag')}
            </p>
            <div className="inline-block relative">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mb-3">
                {t('testimonials_heading')}
              </h2>
              <div className="w-16 h-[2px] bg-[var(--brand-teal)] mx-auto mb-4" />
            </div>
            <p className="text-[var(--text-body)] text-sm">
              {t('testimonials_sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pt-4 items-stretch">
            {testimonials.slice(0, 3).map((tItem: any, idx: number) => {
              const isMiddle = idx === 1;
              const initials = (tItem.name || 'DH')
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <figure
                  key={tItem.id || tItem.name || idx}
                  className={`relative rounded-[20px] shadow-md p-7 pt-12 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl select-none ${
                    isMiddle
                      ? 'bg-[#E3EFF3] dark:bg-[#0c4458] text-[var(--text-body)] dark:text-white border border-[#1F7A8C]/35 dark:border-[#22A0B4]/40 shadow-lg'
                      : 'bg-[var(--bg-surface)] text-[var(--text-body)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {/* Overlapping 72px Circular Avatar (-top-9) with 4px surface-colored ring */}
                  <div className="absolute -top-9 left-7">
                    {tItem.avatarUrl || tItem.avatar ? (
                      <img
                        src={tItem.avatarUrl || tItem.avatar}
                        alt={tItem.name}
                        width={72}
                        height={72}
                        loading="lazy"
                        decoding="async"
                        className={`w-[72px] h-[72px] rounded-full object-cover ring-4 ${
                          isMiddle ? 'ring-[#E3EFF3] dark:ring-[#0c4458]' : 'ring-[var(--bg-surface)]'
                        } shadow-md`}
                      />
                    ) : (
                      <div
                        className={`w-[72px] h-[72px] rounded-full flex items-center justify-center font-display font-bold text-lg ring-4 ${
                          isMiddle
                            ? 'bg-[#1F7A8C] text-white ring-[#E3EFF3] dark:ring-[#0c4458]'
                            : 'bg-[#1F7A8C]/15 text-[#1F7A8C] ring-[var(--bg-surface)]'
                        } shadow-md`}
                      >
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* Body with Accent Quote Glyph */}
                  <div>
                    {/* Brand Accent Quote Glyph in Outfit */}
                    <div
                      className={`font-display font-extrabold leading-none mb-3 select-none ${
                        isMiddle
                          ? 'text-[#1F7A8C] dark:text-cyan-300 text-5xl sm:text-6xl'
                          : 'text-[var(--brand-teal)] text-4xl sm:text-5xl'
                      }`}
                      aria-hidden="true"
                    >
                      &ldquo;
                    </div>

                    <blockquote
                      className={`font-sans text-[15px] sm:text-[16px] leading-[1.6] mb-6 ${
                        isMiddle ? 'text-[var(--text-body)] dark:text-white/90' : 'text-[var(--text-body)]'
                      }`}
                    >
                      &ldquo;{tItem.quote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Figcaption with semibold name and muted role */}
                  <figcaption
                    className={`pt-4 border-t ${
                      isMiddle ? 'border-[#1F7A8C]/20 dark:border-white/15' : 'border-[var(--border-subtle)]'
                    }`}
                  >
                    <div className={`font-semibold text-sm ${isMiddle ? 'text-[var(--text-heading)] dark:text-white' : 'text-[var(--text-heading)]'}`}>
                      {tItem.name}
                    </div>
                    <div className={`text-xs ${isMiddle ? 'text-[var(--text-muted)] dark:text-white/70' : 'text-[var(--text-muted)]'}`}>
                      {tItem.role}{tItem.company ? `, ${tItem.company}` : ''}
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FREQUENTLY ASKED QUESTIONS ── */}
      <section className="py-24 px-6 lg:px-8 border-t border-[var(--border-subtle)] bg-[var(--bg-page)] relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">
              Clear Answers
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--text-body)] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Everything you need to know about our coordinated specialist squads, milestone guarantees, and project delivery.
            </p>
          </div>

          <div className="space-y-4">
            {HOME_FAQ_ITEMS.map((item, idx) => (
              <details
                key={idx}
                className="group p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/40 transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-display font-bold text-base sm:text-lg text-[var(--text-heading)] focus:outline-none">
                  <span>{item.question}</span>
                  <ChevronDown className="w-5 h-5 text-[var(--brand-teal)] transition-transform duration-200 group-open:rotate-180 shrink-0 ml-4" />
                </summary>
                <p className="mt-4 text-sm sm:text-base text-[var(--text-body)] leading-relaxed border-t border-[var(--border-subtle)] pt-4">
                  {item.answer}
                </p>
              </details>
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
              {t('cta_heading')}
            </h2>
            <p className="text-lg text-[var(--text-body)] mb-10 max-w-xl mx-auto">
              {t('cta_sub')}
            </p>
            <div className="inline-block">
              <LavaProposalButton label={t('btn_start_proposal')} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProject(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-[var(--text-body)] relative shadow-2xl my-8"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-body)] hover:text-[var(--text-heading)] transition-colors cursor-pointer"
                aria-label="Close Case Study Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pr-12 mb-6">
                <span className="text-xs font-bold text-[var(--brand-teal)] uppercase tracking-wider">
                  {selectedProject.category} · {selectedProject.client}
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)] mt-1">
                  {selectedProject.title}
                </h3>
              </div>

              <div className="aspect-video rounded-2xl overflow-hidden mb-6 border border-[var(--border-subtle)]">
                <img
                  src={selectedProject.img}
                  alt={selectedProject.title}
                  width={800}
                  height={450}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-heading)] mb-2 flex items-center space-x-1.5">
                    <Layers className="w-4 h-4" />
                    <span>The Challenge</span>
                  </h4>
                  <p className="text-[var(--text-body)] leading-relaxed bg-[var(--bg-page)] p-4 rounded-xl border border-[var(--border-subtle)]">
                    {selectedProject.challenge}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-teal)] mb-2 flex items-center space-x-1.5">
                    <span>The DigiHust Solution</span>
                  </h4>
                  <p className="text-[var(--text-body)] leading-relaxed bg-[var(--bg-page)] p-4 rounded-xl border border-[var(--border-subtle)]">
                    {selectedProject.solution}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
                    Key Outcomes & Metrics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedProject.results.map((res) => (
                      <div
                        key={res}
                        className="p-3.5 rounded-xl bg-[var(--bg-page)] border border-emerald-500/30 text-xs font-semibold text-[var(--text-body)] flex items-start space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2.5 py-1 rounded-md bg-[var(--bg-page)] text-[var(--text-body)] border border-[var(--border-subtle)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <a
                    href={getProjectLiveUrl(selectedProject)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#1F7A8C] hover:bg-[#1A6877] text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                  </a>
                  <Link
                    to={`/contact?project=${encodeURIComponent(selectedProject.title)}&service=${encodeURIComponent(selectedProject.category)}`}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-xs shadow transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Build a Similar Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
