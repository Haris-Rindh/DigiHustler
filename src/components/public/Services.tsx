import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Code,
  Palette,
  Cpu,
  TrendingUp,
  Shield,
  Database,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { useApp } from '../../context/AppContext';

// Import Slideshow Images
import slide1 from '../../assets/slideshow 1.avif';
import slide2 from '../../assets/slideshow 2.jpg';
import slide3 from '../../assets/slideshow 3.jpg';
import slide4 from '../../assets/slideshow 4.jpg';
import slide5 from '../../assets/slideshow 5.jpg';
import slide6 from '../../assets/slideshow 6.jpg';

const SLIDESHOW_ITEMS = [
  {
    id: 'development',
    image: slide1,
    badge: 'Engineering & Development',
    title: 'Full-Stack Web & Scalable App Architecture',
    tagline: 'High-performance Next.js & React platforms, custom APIs, and cloud infrastructure.',
    serviceTargetId: 'development'
  },
  {
    id: 'creative',
    image: slide2,
    badge: 'UI/UX & Brand Design',
    title: 'Visual Identity Systems & Product Experiences',
    tagline: 'Distinctive brand systems, Figma prototypes, and high-conversion UX designs.',
    serviceTargetId: 'creative'
  },
  {
    id: 'ai-automation',
    image: slide3,
    badge: 'AI & Workflow Automation',
    title: 'Custom LLM Agents & Operational Automations',
    tagline: 'Eliminating manual bottlenecks with custom AI chatbots, ETL pipelines, and API integrations.',
    serviceTargetId: 'ai-automation'
  },
  {
    id: 'marketing',
    image: slide4,
    badge: 'Search Engine Optimization',
    title: 'Data-Driven Growth & Targeted Outreach',
    tagline: 'Technical SEO audits, high-intent Google/Meta PPC, and targeted B2B lead pipelines.',
    serviceTargetId: 'marketing'
  },
  {
    id: 'cybersecurity',
    image: slide5,
    badge: 'Cybersecurity & Auditing',
    title: 'Penetration Testing & System Hardening',
    tagline: 'Systematic vulnerability assessments, OWASP hardening, and infrastructure protection.',
    serviceTargetId: 'cybersecurity'
  },
  {
    id: 'data-solutions',
    image: slide6,
    badge: 'Data Intelligence & BI',
    title: 'Executive Dashboards & Automated Analytics',
    tagline: 'PowerBI dashboards, SQL optimization, and automated executive intelligence suites.',
    serviceTargetId: 'data-solutions'
  },
];

const SERVICES = [
  {
    id: 'development',
    icon: <Code className="w-7 h-7" />,
    title: 'Web & App Development',
    headline: 'Websites · React/Next.js Apps · Backend APIs · DevOps',
    description: 'We build responsive, robust digital platforms engineered for performance, clean codebase architecture, and seamless scalability.',
    offerings: [
      'Custom Responsive Websites & Landing Pages',
      'Full-Stack React & Next.js Web Applications',
      'Node.js / Python REST & GraphQL APIs',
      'E-Commerce & Payment Gateway Integration',
      'Database Architecture (PostgreSQL, MongoDB, Redis)',
      'CI/CD Pipelines, Docker, & Cloud Deployment',
    ],
    tags: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'AWS', 'PostgreSQL'],
    color: '#1F7A8C',
    bgLight: 'bg-[var(--bg-surface)]',
  },
  {
    id: 'creative',
    icon: <Palette className="w-7 h-7" />,
    title: 'Creative & UI/UX Design',
    headline: 'Brand Systems · UI/UX · Figma Prototypes · Motion Graphics',
    description: 'We craft distinctive visual brand identities and user experiences that captivate attention and communicate trust.',
    offerings: [
      'Complete Brand Identity & Logo Systems',
      'Figma Web & Mobile UI/UX Prototyping',
      'Design Systems & Component Libraries',
      '3D Visuals & After Effects Motion Graphics',
      'Social Media Creative & Ad Kits',
      'Investor Pitch Decks & Marketing Collateral',
    ],
    tags: ['Figma', 'Adobe Suite', 'After Effects', 'UI/UX', 'Brand Strategy', 'Motion Design'],
    color: '#1F7A8C',
    bgLight: 'bg-[var(--bg-surface)]',
  },
  {
    id: 'ai-automation',
    icon: <Cpu className="w-7 h-7" />,
    title: 'AI Solutions & Automation',
    headline: 'OpenAI Integrations · Custom Chatbots · Workflow Automation',
    description: 'We deploy customized AI systems and end-to-end workflow automations that eliminate manual bottlenecks and scale operations.',
    offerings: [
      'Custom LLM & OpenAI Assistant Integrations',
      'Automated Customer Service AI Chatbots',
      'Workflow Automation (n8n, Zapier, Make.com)',
      'Intelligent Document & Data Processing Pipelines',
      'AI-Powered Content & Lead Generation Bots',
      'Custom Python ETL & Scraping Scripts',
    ],
    tags: ['OpenAI', 'Python', 'n8n', 'Zapier', 'LangChain', 'Automated APIs'],
    color: '#1F7A8C',
    bgLight: 'bg-[var(--bg-surface)]',
  },
  {
    id: 'marketing',
    icon: <TrendingUp className="w-7 h-7" />,
    title: 'Digital Marketing & SEO',
    headline: 'Search Optimization · Google/Meta Ads · B2B Outreach',
    description: 'Data-driven marketing and technical search engine optimization that place your brand in front of high-intent buyers.',
    offerings: [
      'Comprehensive Technical & On-Page SEO Audits',
      'High-ROI Google Ads & Meta PPC Campaigns',
      'B2B Cold Email Infrastructure & Lead Lists',
      'Conversion Rate Optimization (CRO)',
      'SEO Content Writing & Keyword Strategy',
      'Performance Analytics & GA4 Tracking Setup',
    ],
    tags: ['Technical SEO', 'Google Ads', 'Meta Ads', 'B2B Sales', 'GA4', 'Content Strategy'],
    color: '#B08D57',
    bgLight: 'bg-[var(--bg-surface)]',
  },
  {
    id: 'cybersecurity',
    icon: <Shield className="w-7 h-7" />,
    title: 'Cybersecurity & Auditing',
    headline: 'Penetration Testing · Web Security Audits · OWASP Hardening',
    description: 'We safeguard your digital assets, infrastructure, and user data through systematic penetration testing and vulnerability auditing.',
    offerings: [
      'Web Application Penetration Testing',
      'OWASP Top 10 Vulnerability Assessments',
      'Server & Cloud Security Hardening',
      'API Security Testing & Authentication Review',
      'Data Protection & Compliance Advisory',
      'Security Incident Response Planning',
    ],
    tags: ['Pen Testing', 'OWASP', 'Vulnerability Assessment', 'API Security', 'Compliance'],
    color: '#A85C4A',
    bgLight: 'bg-[var(--bg-surface)]',
  },
  {
    id: 'data-solutions',
    icon: <Database className="w-7 h-7" />,
    title: 'Data Intelligence & BI',
    headline: 'PowerBI Dashboards · SQL Reporting · Virtual Support',
    description: 'Transforming disparate data points into dynamic executive intelligence dashboards and automated reporting suites.',
    offerings: [
      'PowerBI & Looker Executive Dashboard Builds',
      'Database Modeling & SQL Query Optimization',
      'Automated Excel & Email Reporting Suites',
      'Lead Scraping & Market Research Reports',
      'CRM System Setup & Data Migration',
      'Specialized Virtual Technical Assistance',
    ],
    tags: ['PowerBI', 'SQL', 'Data Analytics', 'Excel Automation', 'BI Reporting'],
    color: '#1F7A8C',
    bgLight: 'bg-[var(--bg-surface)]',
  },
];

export const Services: React.FC = () => {
  const { siteContent } = useApp();
  const servicesList = (siteContent?.services && siteContent.services.length > 0)
    ? siteContent.services.map(s => {
        const fallback = SERVICES.find(fs => fs.id === s.id || fs.id === s.groupId);
        return {
          id: s.id,
          icon: fallback ? fallback.icon : <Code className="w-7 h-7" />,
          title: s.title,
          headline: s.tagline,
          description: s.description,
          offerings: s.features || [],
          tags: s.features || ['Full Stack', 'Cloud'],
          color: s.color || '#1F7A8C',
          bgLight: 'bg-[var(--bg-surface)]'
        };
      })
    : SERVICES;

  const [expandedId, setExpandedId] = useState<string | null>(servicesList[0]?.id || 'development');

  // ── AUTO SLIDER STATE ──
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideDirection] = useState<1>(1);
  const servicesSectionRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDESHOW_ITEMS.length);
  }, []);

  // Automatic Interval
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // changes every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleSelectServiceFromSlide = (targetId: string) => {
    setExpandedId(targetId);
    if (servicesSectionRef.current) {
      servicesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentSlide = SLIDESHOW_ITEMS[currentSlideIndex];

  return (
    <div className="pt-16">
      <SEOHead
        title="Digital Services & Capabilities — DigiHust"
        description="Explore DigiHust's full suite of capabilities: Full-Stack Web Development, UI/UX Design, AI Automation, Digital Marketing, Cybersecurity, and Business Intelligence."
      />

      {/* ── AUTO IMAGE SLIDER SHOWCASE (AT VERY START) ── */}
      <section className="bg-[var(--bg-page)] pt-6 sm:pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          
          <div
            className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-subtle)] bg-black/90 group select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Background Slides with Framer Motion */}
            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
              <motion.div
                key={currentSlideIndex}
                custom={slideDirection}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover object-center"
                  loading={currentSlideIndex === 0 ? 'eager' : 'lazy'}
                />
                
                {/* Advanced Multi-Stop Scrim Gradients for Crisp Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/25" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Slide Content Overlay */}
            <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-between z-10">
              
              {/* Top Tag & Slide Counter */}
              <div className="flex items-center justify-between">
                <motion.div
                  key={`badge-${currentSlideIndex}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                  <span className="tracking-wide uppercase text-[11px] font-extrabold text-[var(--brand-teal)]">
                    {currentSlide.badge}
                  </span>
                </motion.div>

                {/* Progress Indicators / Counter */}
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 text-xs font-mono font-bold">
                  <span className="text-[var(--brand-teal)]">0{currentSlideIndex + 1}</span>
                  <span className="opacity-40">/</span>
                  <span>0{SLIDESHOW_ITEMS.length}</span>
                </div>
              </div>

              {/* Bottom Main Titles & Actions */}
              <div className="max-w-3xl space-y-3 sm:space-y-4">
                <motion.div
                  key={`text-${currentSlideIndex}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  className="space-y-2 sm:space-y-3"
                >
                  <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight sm:leading-none drop-shadow-md">
                    {currentSlide.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-white/85 line-clamp-2 sm:line-clamp-none font-medium leading-relaxed drop-shadow">
                    {currentSlide.tagline}
                  </p>
                </motion.div>

                {/* Interactive CTAs */}
                <motion.div
                  key={`cta-${currentSlideIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex flex-wrap items-center gap-3 pt-1 sm:pt-2"
                >
                  <button
                    onClick={() => handleSelectServiceFromSlide(currentSlide.serviceTargetId)}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs sm:text-sm font-bold shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>Explore Deliverables</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <Link
                    to="/contact"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Start Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>

            </div>

            {/* Bottom Progress Bar Indicator (Purely Automatic) */}
            <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-10 flex items-center space-x-1.5 sm:space-x-2 z-20 pointer-events-none">
              {SLIDESHOW_ITEMS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                    idx === currentSlideIndex
                      ? 'w-6 sm:w-8 bg-[var(--brand-teal)] shadow-md shadow-[var(--brand-teal)]/50'
                      : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Header Banner */}
      <section ref={servicesSectionRef} className="bg-[var(--bg-page)] py-14 sm:py-18 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Full-Spectrum Capabilities</span>
            </p>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-heading)] mb-4">
              Services Built for Execution.
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-body)] max-w-2xl leading-relaxed">
              Six specialized domains — delivered as one cohesive digital engine. Click any capability below to review included deliverables and technologies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Services List */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {servicesList.map((svc) => {
            const isExpanded = expandedId === svc.id;

            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isExpanded
                    ? 'border-[var(--brand-teal)]/50 shadow-xl bg-[var(--bg-surface)] ring-1 ring-[var(--brand-teal)]/20'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:shadow-md bg-[var(--bg-surface)]'
                }`}
              >
                {/* Trigger button */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : svc.id)}
                  className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-6 cursor-pointer"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start sm:items-center gap-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-md"
                      style={{ backgroundColor: svc.color }}
                    >
                      {svc.icon}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="font-display font-extrabold text-2xl text-[var(--text-heading)]">{svc.title}</h2>
                      </div>
                      <p className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wide mb-1">
                        {svc.headline}
                      </p>
                      <p className="text-sm text-[var(--text-body)] max-w-2xl hidden sm:block">
                        {svc.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--border-subtle)] text-[var(--text-muted)] flex-shrink-0 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 bg-[var(--bg-subtle)]' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Expanded Accordion Body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className={`px-6 sm:px-8 pb-8 pt-2 border-t border-[var(--border-subtle)] ${svc.bgLight}`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                        {/* Scope Checklist */}
                        <div>
                          <h3
                            className="text-xs font-black uppercase tracking-widest mb-4 flex items-center space-x-1.5"
                            style={{ color: svc.color }}
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Included Deliverables & Scope</span>
                          </h3>
                          <ul className="space-y-2.5">
                            {svc.offerings.map((offering) => (
                              <li key={offering} className="flex items-start space-x-3 text-sm text-[var(--text-body)]">
                                <CheckCircle2
                                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                                  style={{ color: svc.color }}
                                />
                                <span>{offering}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tech Stack & Action */}
                        <div className="flex flex-col justify-between">
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">
                              Technologies & Frameworks
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {svc.tags.map((t) => (
                                <span
                                  key={t}
                                  className="text-xs px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-body)] border border-[var(--border-subtle)] font-semibold shadow-sm"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-[var(--border-subtle)]/60">
                            <Link
                              to="/contact"
                              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all hover:opacity-90"
                              style={{ backgroundColor: svc.color }}
                            >
                              <span>Request Proposal for {svc.title}</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8 border-t border-[var(--border-subtle)] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mb-4">
            Need a Multi-Disciplinary Squad?
          </h2>
          <p className="text-[var(--text-body)] mb-8 leading-relaxed">
            Most projects require a combination of engineering, branding, and automation. We combine these disciplines seamlessly into one scope.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold shadow-lg transition-all"
          >
            <span>Start a Combined Scope</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
