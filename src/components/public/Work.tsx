import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, X, CheckCircle2, Layers, ExternalLink } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { useApp } from '../../context/AppContext';
import { handleCardSpotlightMove, handleCardSpotlightLeave } from '../../lib/cardSpotlight';

export interface Project {
  id: string;
  category: string;
  filterCat: string;
  title: string;
  client: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  tags: string[];
  img: string;
  projectUrl?: string;
}

export const getProjectLiveUrl = (project: { projectUrl?: string; title?: string }) => {
  if (project.projectUrl && project.projectUrl.trim() !== '') {
    return project.projectUrl;
  }
  const t = (project.title || '').toLowerCase();
  if (t.includes('mashaallah')) return 'https://mashaallahbangles.com';
  if (t.includes('nawaz')) return 'https://alnawazindustries.com';
  if (t.includes('spoon')) return 'https://therusticspoon.com';
  if (t.includes('real-estate') || t.includes('estate')) return 'https://estatesdirect.demo';
  if (t.includes('automotive') || t.includes('veloce')) return 'https://veloce-motors.demo';
  if (t.includes('hospital') || t.includes('titan')) return 'https://titan-bi.demo';
  if (t.includes('fintech') || t.includes('apex')) return 'https://apex-trading.demo';
  if (t.includes('logistics') || t.includes('logixpress')) return 'https://logixpress-ai.demo';
  if (t.includes('ecommerce') || t.includes('nexus')) return 'https://nexus-goods.demo';
  return 'https://github.com/DigiHust-Official';
};

export const PROJECTS: Project[] = [
  {
    id: 'real-estate-portal',
    category: 'Web Development',
    filterCat: 'Development',
    title: 'Real-Estate Marketplace Portal',
    client: 'Estates Direct UK',
    description: 'High-performance property listing and agent management platform with interactive geospatial search and instant inquiry routing.',
    challenge: 'Legacy WordPress backend suffering from 5+ second load times and unscalable database indexing across 40,000+ UK property listings.',
    solution: 'Re-engineered from scratch with Next.js, Node.js, PostgreSQL with PostGIS for sub-second spatial queries, and real-time agent leads.',
    results: [
      'Sub-800ms page load speeds across all search filters',
      '+140% organic inbound lead conversion rate in 90 days',
      'Zero downtime migration of 40,000+ active listings',
    ],
    tags: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'PostGIS', 'AWS'],
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    projectUrl: 'https://estatesdirect.demo',
  },
  {
    id: 'automotive-brand',
    category: 'Creative & Branding',
    filterCat: 'Creative',
    title: 'Automotive Brand Identity & 3D Motion Ads',
    client: 'Veloce Motors DE',
    description: 'Complete brand redesign, comprehensive design system, and a suite of 3D motion advertisement teasers for digital launch.',
    challenge: 'A modern electric performance startup needed a visual identity that felt aggressive, premium, and distinct from legacy competitors.',
    solution: 'Engineered a modern typographic identity system, Figma design system, and three 30-second 4K 3D motion trailers in Cinema 4D & After Effects.',
    results: [
      'Generated 2.4M organic impressions across initial social launch',
      'Complete 120-page brand guidelines and vector assets delivered',
      'Adopted across digital, print, and in-vehicle UI touchpoints',
    ],
    tags: ['Brand Identity', 'Figma', 'After Effects', '3D Animation', 'Motion Design'],
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    projectUrl: 'https://veloce-motors.demo',
  },
  {
    id: 'hospital-bi-dashboard',
    category: 'AI & Data Solutions',
    filterCat: 'AI & Data',
    title: 'Executive Sales BI & Analytics Suite',
    client: 'Titan Healthcare Systems',
    description: 'Integrated fragmented hospital SQL data stores into a unified executive PowerBI dashboard with automated weekly KPI reports.',
    challenge: 'Executive leadership spent 12+ manual hours weekly compiling disparate spreadsheets with inconsistent financial figures.',
    solution: 'Engineered automated Python ETL pipelines syncing multiple SQL databases directly into an interactive PowerBI executive console.',
    results: [
      'Saved 12+ administrative hours every single week',
      'Real-time automated alerting for revenue metric anomalies',
      'Adopted by 35+ regional hospital department heads',
    ],
    tags: ['PowerBI', 'SQL', 'Python', 'ETL Pipelines', 'Data Automation'],
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    projectUrl: 'https://titan-bi.demo',
  },
  {
    id: 'saas-fintech-redesign',
    category: 'Web Development',
    filterCat: 'Development',
    title: 'Enterprise FinTech Trading Console',
    client: 'Apex FinTech US',
    description: 'Complete architectural redesign of a high-throughput financial trading console for enterprise institutional traders.',
    challenge: 'Dense financial data tables causing heavy browser lag and frame drops during live market volatility spikes.',
    solution: 'Rebuilt using virtualized React tables, WebSocket state managers, and dark-mode high-contrast UI components.',
    results: [
      'Maintained steady 60 FPS even under 1,000+ live tick events/sec',
      '40% reduction in user operational execution errors',
      'Successfully deployed across 200+ enterprise broker accounts',
    ],
    tags: ['React', 'TypeScript', 'WebSockets', 'Tailwind', 'High Throughput'],
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    projectUrl: 'https://apex-trading.demo',
  },
  {
    id: 'ai-logistics-bot',
    category: 'AI Solutions & Automation',
    filterCat: 'AI & Data',
    title: 'Autonomous Logistics Customer Support AI',
    client: 'LogiXpress Logistics',
    description: 'Custom OpenAI & Python automation system resolving tracking inquiries over WhatsApp and email without human staff.',
    challenge: 'Customer service department overwhelmed with 800+ repetitive tracking status inquiries every day.',
    solution: 'Deployed an autonomous OpenAI agent integrated with WhatsApp Business API and the central ERP database.',
    results: [
      '78% of incoming inquiries resolved instantly without human intervention',
      'Average response time dropped from 4 hours to under 6 seconds',
      'Customer satisfaction rating increased to 4.8 / 5.0',
    ],
    tags: ['OpenAI', 'Python', 'WhatsApp API', 'Automation', 'FastAPI'],
    img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80',
    projectUrl: 'https://logixpress-ai.demo',
  },
  {
    id: 'ecommerce-brand-kit',
    category: 'Creative & UI/UX',
    filterCat: 'Creative',
    title: 'E-Commerce Brand & Mobile UI Kit',
    client: 'Nexus Global Goods',
    description: 'Comprehensive branding system, responsive Shopify theme design, and iOS application UI mockups.',
    challenge: 'Expanding brand needed a coherent, luxury identity across mobile, packaging, and web storefront.',
    solution: 'Designed comprehensive visual design system, custom Shopify liquid templates, and Figma mobile app prototype.',
    results: [
      'Shopify storefront launch generated $280K in first 30 days',
      'Mobile checkout drop-off decreased by 28%',
      'Complete vector asset and packaging design package delivered',
    ],
    tags: ['UI/UX', 'Figma', 'Brand Identity', 'Shopify', 'Mobile Design'],
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    projectUrl: 'https://nexus-goods.demo',
  },
];

const FILTER_CATS = ['All', 'Development', 'Creative', 'AI & Data'];

export const Work: React.FC = () => {
  const { siteContent } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const rawCaseStudies = siteContent?.caseStudies || [];

  const projectsList: Project[] = (rawCaseStudies && rawCaseStudies.length > 0)
    ? rawCaseStudies.map((cs) => ({
        id: cs.slug || cs.id,
        category: cs.category || 'Web Development',
        filterCat: cs.category?.includes('Design') || cs.category?.includes('Brand') ? 'Creative' : cs.category?.includes('AI') ? 'AI & Data' : 'Development',
        title: cs.title,
        client: cs.client,
        description: cs.summary,
        challenge: cs.challenge || 'Client required modernized architecture and streamlined conversion funnels.',
        solution: cs.solution || 'Engineered customized full-stack solution with enterprise performance guarantees.',
        results: [cs.impactMetric ? `${cs.impactMetric} ${cs.impactLabel}` : '100% On-Time Delivery'],
        tags: cs.tags || ['React', 'Full Stack'],
        img: cs.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
        projectUrl: getProjectLiveUrl(cs),
      }))
    : PROJECTS;

  const filtered = activeFilter === 'All'
    ? projectsList
    : projectsList.filter((p) => p.filterCat === activeFilter || p.category === activeFilter);

  return (
    <div className="pt-16">
      <SEOHead
        title="Our Work & Case Studies | DigiHust"
        description="Explore DigiHust's portfolio of delivered projects across full-stack development, brand identity systems, AI automation, and business intelligence."
      />

      {/* Header */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">
              Proven Delivery
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] mb-5">
              Selected Work & Case Studies.
            </h1>
            <p className="text-lg text-[var(--text-body)] max-w-2xl leading-relaxed">
              Explore real solutions engineered by our specialized squads | from enterprise web portals to autonomous AI assistants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs with Framer Motion layoutId */}
      <section className="bg-[var(--bg-page)] border-b border-[var(--border-subtle)] relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 overflow-x-auto">
            {FILTER_CATS.map((cat) => {
              const active = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`relative px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                    active ? 'text-white' : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="workCategoryPill"
                      className="absolute inset-0 bg-[var(--brand-teal)] rounded-xl shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="bg-[var(--bg-page)] py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filtered.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
              <AnimatePresence>
                {filtered.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedProject(project)}
                    onPointerMove={handleCardSpotlightMove}
                    onPointerLeave={handleCardSpotlightLeave}
                    data-cursor="view"
                    className="group premium-card overflow-hidden cursor-pointer flex flex-col h-auto select-none"
                  >
                    {/* Nested gallery hardware frame (luxury bezel + subtle inset) */}
                    <div className="p-2.5 sm:p-3 pb-0 flex-shrink-0">
                      <div className="w-full aspect-[16/10] overflow-hidden bg-[var(--bg-subtle)] relative premium-card-nested-img">
                        <img
                          src={project.img}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* Floating Frosted Client Badge */}
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full glass-pill text-[10px] font-bold text-white shadow-sm flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{project.client}</span>
                        </div>

                        {/* Floating Category Pill */}
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-[9px] font-mono font-bold text-white/90 border border-white/10 uppercase tracking-wider">
                          {project.category}
                        </div>
                      </div>
                    </div>

                    {/* Refined padding text area */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col relative z-[2]">
                      <div className="mb-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--brand-teal)]/30 text-[11px] font-extrabold uppercase tracking-wider">
                          {project.category}
                        </span>
                      </div>
                      <h2 className="font-display font-bold text-base sm:text-[1.125rem] text-[var(--text-heading)] leading-[1.3] mb-2 line-clamp-2 min-h-[2.6rem] group-hover:text-[var(--brand-teal)] transition-colors duration-200">
                        {project.title}
                      </h2>
                      <p className="text-xs sm:text-[13px] text-[var(--text-body)] leading-relaxed mb-3 line-clamp-2 min-h-[2.4rem]">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {project.tags?.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-heading)] border border-[var(--border-subtle)] font-medium group-hover:border-[var(--brand-teal)]/20 transition-colors"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom-pinned footer row */}
                    <div className="mt-auto px-4 sm:px-5 py-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs sm:text-[13px] font-bold text-[var(--brand-teal)] relative z-[2]">
                      <span className="flex items-center space-x-1.5">
                        <span>Inspect Case Study</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                      </span>
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline font-bold px-2 py-0.5 rounded-md hover:bg-emerald-500/10 transition-colors"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="p-12 sm:p-16 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-4 shadow-sm max-w-2xl mx-auto my-8">
              <div className="w-14 h-14 rounded-2xl bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] flex items-center justify-center mx-auto border border-[var(--brand-teal)]/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-[var(--text-heading)]">
                Custom Client Solutions & NDA Deliverables
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed">
                DigiHust delivers web engineering, brand identity systems, and AI automation for international clients under strict confidentiality agreements. Add case studies directly via the Live CMS Studio or request our confidential portfolio PDF.
              </p>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-xs shadow-lg transition-all"
                >
                  <span>Request Custom Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedProject(null); }}
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
                    <Sparkles className="w-4 h-4" />
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
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
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

      {/* Bottom CTA */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8 border-t border-[var(--border-subtle)] text-center">
        <h2 className="font-display font-extrabold text-3xl text-[var(--text-heading)] mb-4">
          Ready to Build Your Digital Solution?
        </h2>
        <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">
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
