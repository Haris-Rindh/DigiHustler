import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Code2,
  Rocket,
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { useApp } from '../../context/AppContext';
import { ServiceCard } from '../ui/ServiceCard';
import { ServiceFeatureRow } from '../ui/ServiceFeatureRow';
import { DEFAULT_SITE_CONTENT } from '../../services/mockData';
import { SiteServiceItem } from '../../types';

// Import Slideshow Images
import slide1 from '../../assets/slideshow 1.avif';
import slide2 from '../../assets/slideshow 2.jpg';
import slide3 from '../../assets/slideshow 3.jpg';
import slide4 from '../../assets/slideshow 4.jpg';
import slide5 from '../../assets/slideshow 5.jpg';
import slide6 from '../../assets/slideshow 6.jpg';

// Import Delivery Model Step Images
import modelStep1 from '../../assets/model_step_1.png';
import modelStep2 from '../../assets/model_step_2.png';
import modelStep3 from '../../assets/model_step_3.png';
import modelStep4 from '../../assets/model_step_4.png';

const SLIDESHOW_ITEMS = [
  {
    id: 'development',
    image: slide1,
    badge: 'Engineering & Development',
    title: 'Full-Stack Web & Scalable App Architecture',
    tagline: 'High-performance Next.js & React platforms, custom APIs, and cloud infrastructure.',
    serviceTargetId: 'development',
  },
  {
    id: 'creative',
    image: slide2,
    badge: 'UI/UX & Brand Design',
    title: 'Visual Identity Systems & Product Experiences',
    tagline: 'Distinctive brand systems, Figma prototypes, and high-conversion UX designs.',
    serviceTargetId: 'creative',
  },
  {
    id: 'ai-automation',
    image: slide3,
    badge: 'AI & Workflow Automation',
    title: 'Custom LLM Agents & Operational Automations',
    tagline: 'Eliminating manual bottlenecks with custom AI chatbots, ETL pipelines, and API integrations.',
    serviceTargetId: 'ai-automation',
  },
  {
    id: 'marketing',
    image: slide4,
    badge: 'Search Engine Optimization',
    title: 'Data-Driven Growth & Targeted Outreach',
    tagline: 'Technical SEO audits, high-intent Google/Meta PPC, and targeted B2B lead pipelines.',
    serviceTargetId: 'marketing',
  },
  {
    id: 'cybersecurity',
    image: slide5,
    badge: 'Cybersecurity & Auditing',
    title: 'Penetration Testing & System Hardening',
    tagline: 'Systematic vulnerability assessments, OWASP hardening, and infrastructure protection.',
    serviceTargetId: 'cybersecurity',
  },
  {
    id: 'data-solutions',
    image: slide6,
    badge: 'Data Intelligence & BI',
    title: 'Executive Dashboards & Automated Analytics',
    tagline: 'PowerBI dashboards, SQL optimization, and automated executive intelligence suites.',
    serviceTargetId: 'data-solutions',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Capabilities' },
  { id: 'tech', label: 'Engineering & Apps' },
  { id: 'creative', label: 'Design & 3D' },
  { id: 'data', label: 'AI & Automations' },
  { id: 'growth', label: 'Growth & SEO' },
];

export const Services: React.FC = () => {
  const { siteContent } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const [activeTileId, setActiveTileId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const rawServices: SiteServiceItem[] =
    siteContent?.services && siteContent.services.length >= 6
      ? siteContent.services
      : DEFAULT_SITE_CONTENT.services;

  const sortedServices = [...rawServices].sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99)
  );

  const filteredServices = sortedServices.filter((svc) => {
    if (selectedCategory === 'all') return true;
    return (svc.groupId || '').toLowerCase() === selectedCategory.toLowerCase();
  });

  // ── AUTO SLIDER STATE ──
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideDirection] = useState<1>(1);
  const servicesSectionRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDESHOW_ITEMS.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  const handleSelectServiceFromSlide = (targetId: string) => {
    const matched = sortedServices.find(
      (s) => s.id === targetId || s.slug === targetId || s.groupId === targetId
    );
    if (matched) {
      setActiveTileId(matched.id || matched.slug || null);
    }
    if (servicesSectionRef.current) {
      servicesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentSlide = SLIDESHOW_ITEMS[currentSlideIndex];

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="Digital Services & Capabilities | DigiHust"
        description="Explore DigiHust's full range of services: Web Development, UI/UX Design, AI & Automations, Digital Marketing, Cybersecurity, and Data Intelligence."
      />

      {/* ── AUTO IMAGE SLIDER SHOWCASE (AT VERY START) ── */}
      <section data-hero="true" className="bg-[var(--bg-page)] pt-4 sm:pt-6 pb-8 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-subtle)] bg-black/90 group select-none">
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

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Slide Content Overlay */}
            <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-between z-10">
              {/* Top Tag */}
              <div className="flex items-center justify-between">
                <motion.div
                  key={`badge-${currentSlideIndex}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg"
                >
                  <span className="tracking-wide uppercase text-[11px] font-black text-white drop-shadow-md">
                    {currentSlide.badge}
                  </span>
                </motion.div>
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
                    className="inline-flex items-center space-x-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl btn-brand-futuristic text-white text-xs sm:text-sm font-bold shadow-lg transition-all"
                  >
                    <span>Start Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Bottom Progress Bar Indicator */}
            <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-10 flex items-center space-x-1.5 sm:space-x-2 z-20 pointer-events-none">
              {SLIDESHOW_ITEMS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${idx === currentSlideIndex
                      ? 'w-6 sm:w-8 bg-[var(--brand-teal)]'
                      : 'w-2 bg-white/30'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Header Banner & Domain Filter Tabs (Without numbers) */}
      <section ref={servicesSectionRef} className="bg-[var(--bg-page)] pt-14 sm:pt-18 pb-6 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-subtle)]">
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
            <p className="text-base sm:text-lg text-[var(--text-body)] max-w-2xl leading-relaxed mb-4">
              Specialized domain squads delivered as one cohesive digital engine. Select any capability domain or expand specs to inspect dedicated rosters.
            </p>

            {/* Capability Filter Tabs (Hidden per reference design; retained for CMS/future use) */}
            <div className="hidden flex-wrap items-center gap-2 pt-2 pb-1" aria-hidden="true">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl font-sans font-semibold text-sm tracking-normal transition-all duration-200 cursor-pointer flex items-center gap-2 ${isSelected
                        ? 'bg-[var(--brand-teal)] text-white shadow-md border border-cyan-400/50'
                        : 'bg-[var(--bg-surface)] text-[var(--text-body)] hover:text-[var(--text-heading)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/50'
                      }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTIGUOUS CHECKERBOARD SERVICE LISTING (Matching Reference Design) ── */}
      <section className="bg-[var(--bg-page)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto border border-[var(--border-subtle)] bg-[var(--bg-page)] shadow-xs overflow-hidden">
          {sortedServices.map((svc, index) => (
            <ServiceFeatureRow
              key={svc.id || svc.slug || index}
              service={svc}
              index={index}
              isFirst={index === 0}
            />
          ))}
        </div>
      </section>

      {/* ── SECTION: SQUAD ORCHESTRATION ARCHITECTURE (Matching Reference Design) ── */}
      <section className="bg-[var(--bg-page)] py-18 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-[var(--border-subtle)] relative overflow-hidden">
        {/* Soft Ambient Corner Glows & Dots */}
        <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-gradient-to-br from-[#1F7A8C]/10 via-[#1F7A8C]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-gradient-to-tl from-[#1F7A8C]/10 via-[#1F7A8C]/5 to-transparent rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" aria-hidden="true" />
        <div className="absolute bottom-8 left-8 hidden xl:grid grid-cols-6 gap-2.5 opacity-20 pointer-events-none" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--brand-teal)]" />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/60 border border-[#1F7A8C]/35 text-xs font-bold uppercase tracking-widest text-[var(--brand-teal)] mb-4 shadow-xs backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>CO-ORDINATED DELIVERY MODEL</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight text-[var(--text-heading)] mb-4">
              How One Managed Contract Powers<br className="hidden sm:inline" />{' '}
              <span className="text-[var(--brand-teal)]">Multiple Specialized Squads</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-[var(--text-body)] max-w-2xl mx-auto leading-relaxed">
              No freelancer chaos. No disconnected contractors. DigiHust delivers cross-functional squads under one accountable technical director.
            </p>
          </div>

          {/* 2x2 Grid of Illustrated Spec Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7 max-w-6xl mx-auto">
            {[
              {
                num: '01',
                icon: <Code2 className="w-5 h-5 text-[var(--brand-teal)] stroke-[2.2]" />,
                title: 'Technical Scoping & Squad Assembly',
                desc: 'We align on goals, define the scope, and build the right squad for your project.',
                img: modelStep1,
              },
              {
                num: '02',
                icon: <Layers className="w-5 h-5 text-[var(--brand-teal)] stroke-[2.2]" />,
                title: 'Parallel Sprint Execution',
                desc: 'Multiple squads work in sync, delivering faster and more efficiently.',
                img: modelStep2,
              },
              {
                num: '03',
                icon: <ShieldCheck className="w-5 h-5 text-[var(--brand-teal)] stroke-[2.2]" />,
                title: 'Security Hardening & QA Audit',
                desc: 'We run continuous security scans and automated tests to ensure quality and stability.',
                img: modelStep3,
              },
              {
                num: '04',
                icon: <Rocket className="w-5 h-5 text-[var(--brand-teal)] stroke-[2.2]" />,
                title: 'Clean Handover & SLA Assurance',
                desc: 'We deliver complete code, documentation, and support  backed by our 30-day warranty.',
                img: modelStep4,
              },
            ].map((step) => (
              <div
                key={step.num}
                className="rounded-[28px] sm:rounded-[32px] bg-white dark:bg-[#073547] border border-slate-150/80 dark:border-white/10 shadow-[0_4px_24px_rgba(2,43,58,0.04)] dark:shadow-none hover:shadow-xl hover:border-[var(--brand-teal)]/40 transition-all duration-300 p-6 sm:p-7 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 overflow-hidden group select-none"
              >
                {/* Left Column: Specs & Copy */}
                <div className="w-full sm:w-[50%] flex flex-col justify-between shrink-0">
                  <div>
                    {/* Number Badge */}
                    <div className="w-fit px-3 py-0.5 rounded-full bg-[#E0F2F1] dark:bg-[#0b4156] text-[#00796B] dark:text-cyan-300 font-display font-extrabold text-xs tracking-wider mb-3.5">
                      {step.num}
                    </div>

                    {/* Step Icon */}
                    <div className="w-9 h-9 rounded-lg border border-[#1F7A8C]/35 dark:border-cyan-400/35 flex items-center justify-center text-[var(--brand-teal)] mb-3 bg-[#1F7A8C]/5 dark:bg-cyan-400/5">
                      {step.icon}
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-lg sm:text-[19px] lg:text-xl text-[var(--text-heading)] leading-snug mb-2 group-hover:text-[var(--brand-teal)] transition-colors">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans text-xs sm:text-[13px] lg:text-sm text-[var(--text-body)] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Right Column: Organic Illustrated Graphic */}
                <div className="w-full sm:w-[50%] flex items-center justify-center shrink-0">
                  <img
                    src={step.img}
                    alt={step.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full max-w-[220px] sm:max-w-none h-auto object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                  />
                </div>
              </div>
            ))}
          </div>
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
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl btn-brand-futuristic text-white font-bold shadow-lg transition-all"
          >
            <span>Start a Combined Scope</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
