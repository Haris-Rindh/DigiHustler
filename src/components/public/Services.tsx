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
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { useApp } from '../../context/AppContext';
import { ServiceCard } from '../ui/ServiceCard';
import { DEFAULT_SITE_CONTENT } from '../../services/mockData';
import { SiteServiceItem } from '../../types';

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
    siteContent?.services && siteContent.services.length > 0
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
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                    idx === currentSlideIndex
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
            <p className="text-base sm:text-lg text-[var(--text-body)] max-w-2xl leading-relaxed mb-8">
              Specialized domain squads delivered as one cohesive digital engine. Select any capability domain or expand specs to inspect dedicated rosters.
            </p>

            {/* Capability Filter Tabs (No Numbers) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 pb-1">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl font-sans font-semibold text-sm tracking-normal transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                      isSelected
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

      {/* ── BENTO GRID: AUTONOMOUS SQUAD PODS (Restored Bento Cards) ── */}
      <section className="bg-[var(--bg-page)] py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: shouldReduceMotion ? 0 : 0.06,
                },
              },
            }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
          >
            {filteredServices.map((svc, index) => (
              <ServiceCard
                key={svc.id || svc.slug || index}
                service={{
                  title: svc.title,
                  description: svc.description,
                  summary: svc.tagline,
                  tags: svc.features || (svc as any).deliverables || [],
                  icon: svc.icon,
                  imageUrl: svc.imageUrl,
                  linkTarget: svc.linkTarget || `/contact?service=${encodeURIComponent(svc.title)}`,
                }}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SECTION: SQUAD ORCHESTRATION ARCHITECTURE (Item 10b Clean Stepper) ── */}
      <section className="bg-[var(--bg-page)] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-[var(--border-subtle)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <span className="text-xs font-sans font-extrabold uppercase tracking-widest text-[var(--brand-teal)] mb-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/30">
              <Zap className="w-3.5 h-3.5" />
              <span>CO-ORDINATED DELIVERY MODEL</span>
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mt-2 mb-4">
              How One Managed Contract Powers Multiple Specialized Squads
            </h2>
            <p className="font-sans text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
              No freelancer chaos. No disconnected contractors. DigiHust delivers cross-functional squads under one accountable technical director.
            </p>
          </div>

          {/* Clean 4-step Stepper with 40px numbered circle and 1px desktop connector line */}
          <div className="relative">
            {/* 1px Connector line between steps on desktop */}
            <div
              className="hidden lg:block absolute top-5 left-[12%] right-[12%] h-[1px] bg-[var(--border-subtle)] z-0"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {[
                {
                  num: '01',
                  title: 'Technical Scoping & Squad Assembly',
                  desc: 'We decompose your product requirements, assemble verified specialists from our roster, and create an immutable milestone roadmap.',
                  tag: 'Architect Audit',
                },
                {
                  num: '02',
                  title: 'Parallel Sprint Execution',
                  desc: 'Frontend, backend, 3D design, and automation squads work concurrently with synchronized daily CI/CD staging builds.',
                  tag: 'Parallel Builds',
                },
                {
                  num: '03',
                  title: 'Security Hardening & QA Audit',
                  desc: 'Every milestone undergoes OWASP vulnerability scanning, automated test suites, and cross-browser performance benchmarking.',
                  tag: 'Enterprise QA',
                },
                {
                  num: '04',
                  title: 'Clean Handover & SLA Assurance',
                  desc: 'Full production deployment, complete source code & design system repository transfer, backed by our 30-day post-launch warranty.',
                  tag: '100% SLA Backed',
                },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/60 transition-all duration-200 shadow-sm hover:shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: 40px numbered circle + Tag */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-full bg-[#1F7A8C] text-white font-display font-bold text-sm flex items-center justify-center shadow-md">
                        {p.num}
                      </div>
                      <span className="text-[11px] font-sans font-semibold tracking-wide text-[var(--brand-teal)] bg-[var(--brand-teal-subtle)] px-2.5 py-0.5 rounded-full border border-[var(--brand-teal)]/30">
                        {p.tag}
                      </span>
                    </div>

                    {/* Step Title in Outfit (font-display) */}
                    <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-heading)] mb-2 group-hover:text-[var(--brand-teal)] transition-colors">
                      {p.title}
                    </h3>

                    {/* Description in Plus Jakarta Sans (font-sans) */}
                    <p className="font-sans text-xs sm:text-[13px] text-[var(--text-body)] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
