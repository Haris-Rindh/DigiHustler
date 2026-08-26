import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, X, CheckCircle2, Layers } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

interface Project {
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
}

const PROJECTS: Project[] = [
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
  },
];

const FILTER_CATS = ['All', 'Development', 'Creative', 'AI & Data'];

export const Work: React.FC = () => {
  const { siteContent } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projectsList: Project[] = (siteContent?.caseStudies && siteContent.caseStudies.length > 0)
    ? siteContent.caseStudies.map((cs) => ({
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
        img: cs.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
      }))
    : PROJECTS;

  const filtered = activeFilter === 'All'
    ? projectsList
    : projectsList.filter((p) => p.filterCat === activeFilter || p.category === activeFilter);

  return (
    <div className="pt-16">
      <SEOHead
        title="Our Work & Case Studies — DigiHust"
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
              Explore real solutions engineered by our specialized squads — from enterprise web portals to autonomous AI assistants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs with Framer Motion layoutId */}
      <section className="bg-[var(--bg-page)] border-b border-[var(--border-subtle)] sticky top-16 z-30 shadow-sm">
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
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedProject(project)}
                  className="group border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[var(--brand-teal)]/40 transition-all cursor-pointer bg-[var(--bg-surface)] flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video overflow-hidden bg-[var(--bg-subtle)] relative">
                      <img
                        src={project.img}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[var(--bg-page)]/85 backdrop-blur-sm text-[10px] font-bold text-[var(--text-heading)] border border-[var(--border-subtle)]">
                        {project.client}
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-[11px] font-bold text-[var(--brand-teal)] uppercase tracking-wider mb-1">
                        {project.category}
                      </p>
                      <h2 className="font-display font-bold text-xl text-[var(--text-heading)] mb-3 group-hover:text-[var(--brand-teal)] transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-sm text-[var(--text-body)] leading-relaxed mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {project.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-body)] border border-[var(--border-subtle)] font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-bold text-[var(--brand-teal)]">
                    <span>Inspect Full Case Study</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white relative shadow-2xl overflow-hidden my-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-body)] hover:text-white transition-colors"
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    Key Outcomes & Metrics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedProject.results.map((res) => (
                      <div
                        key={res}
                        className="p-3.5 rounded-xl bg-[var(--bg-page)] border border-emerald-500/30 text-xs font-semibold text-[var(--text-body)] flex items-start space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
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
                <Link
                  to="/contact"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-xs shadow transition-all"
                >
                  <span>Build a Similar Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
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
