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
  CheckCircle2,
  Sparkles,
  Zap,
  Layers,
  Users2,
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { InteractiveCanvas } from '../ui/InteractiveCanvas';

// ── Service categories ──────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Development',
    summary: 'Websites · Web Apps · APIs · Full Stack',
    description: 'Fast, scalable, and responsive digital products built with React, Next.js, Node.js, and modern cloud architecture.',
    tags: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    color: '#1a7a8c',
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Creative & UI/UX',
    summary: 'Brand Identity · UI/UX · Figma · Motion',
    description: 'Visual identities and user-friendly interfaces designed to elevate brand authority and convert visitors into customers.',
    tags: ['Brand Identity', 'UI/UX Design', 'Figma', 'Motion'],
    color: '#8b5cf6',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'AI & Automation',
    summary: 'LLM Solutions · Chatbots · n8n · Workflows',
    description: 'Integrating customized AI models, workflow automations, and intelligent bots to eliminate repetitive business overhead.',
    tags: ['OpenAI', 'Python', 'n8n', 'Zapier'],
    color: '#0ea5e9',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Marketing & SEO',
    summary: 'Search Optimization · Ads · Content Growth',
    description: 'Targeted search engine optimization, performance ad campaigns, and authoritative content strategies that drive revenue.',
    tags: ['Technical SEO', 'Google Ads', 'Meta Ads', 'Copywriting'],
    color: '#f59e0b',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Cybersecurity',
    summary: 'Security Audits · Pen Testing · Hardening',
    description: 'Comprehensive vulnerability assessments, penetration testing, and security hardening for web applications and cloud servers.',
    tags: ['Pen Testing', 'OWASP Audit', 'Cloud Security'],
    color: '#ef4444',
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: 'Data Intelligence',
    summary: 'PowerBI · ETL · Analytics · Automation',
    description: 'Converting siloed data into actionable executive dashboards, automated reporting, and structured business insights.',
    tags: ['PowerBI', 'Data Pipelines', 'SQL', 'Analytics'],
    color: '#10b981',
  },
];

// ── Process steps ───────────────────────────────────────────────────────────
const STEPS = [
  {
    num: '01',
    title: 'Tell Us What You Need',
    desc: 'Submit your requirements via our structured quote intake. Whether you have a full functional specification or a preliminary concept, we refine the scope together.',
    icon: <Zap className="w-5 h-5 text-[#bde0fe]" />,
  },
  {
    num: '02',
    title: 'We Build the Right Team',
    desc: 'DigiHust identifies the exact disciplines needed and assembles verified Digiskill specialists under a single accountable lead. No generalist guesswork.',
    icon: <Users2 className="w-5 h-5 text-[#1a7a8c]" />,
  },
  {
    num: '03',
    title: 'We Create & Iterate',
    desc: 'Your project progresses through clear sprint milestones with live staging previews, code reviews, and transparent check-ins throughout development.',
    icon: <Layers className="w-5 h-5 text-amber-400" />,
  },
  {
    num: '04',
    title: 'We Deliver & Support',
    desc: 'You receive production-grade code, asset packages, documentation, and a dedicated post-launch support window for complete confidence.',
    icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
  },
];

// ── Portfolio previews ──────────────────────────────────────────────────────
const WORK_PREVIEWS = [
  {
    category: 'Web Development',
    title: 'Real-Estate Marketplace Portal',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    stat: '+140% Conversion Rate',
  },
  {
    category: 'Creative & Branding',
    title: 'Automotive Brand Identity & Motion Ads',
    tags: ['Brand Identity', 'After Effects', '3D Animation'],
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    stat: 'Complete 3D Ad Suite',
  },
  {
    category: 'AI & Data',
    title: 'Executive Sales BI Dashboard',
    tags: ['PowerBI', 'Python', 'Automated ETL'],
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    stat: '12+ Hours Saved/Week',
  },
];

// ── Team previews ───────────────────────────────────────────────────────────
const TEAM_PREVIEWS = [
  {
    name: 'Zubair Ahmed',
    role: 'Lead Architect',
    tags: ['Full Stack', 'React', 'Node.js', 'DevOps'],
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Ayesha Khan',
    role: 'Creative Director',
    tags: ['UI/UX', 'Figma', 'Motion Graphics'],
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Dr. Hamza Ali',
    role: 'Head of AI & Data',
    tags: ['ML', 'Python', 'PowerBI', 'LLMs'],
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Bilal Farooq',
    role: 'Growth & Outreach Lead',
    tags: ['B2B Sales', 'Cold Email', 'Digital Marketing'],
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
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

      {/* ── SECTION 1: HERO (Interactive Canvas + Motion) ── */}
      <section className="relative min-h-[92vh] flex items-center px-6 lg:px-8 bg-[#071e26] border-b border-[#1e4a5d]/50">
        {/* Interactive Canvas Background */}
        <InteractiveCanvas particleCount={50} className="absolute inset-0 pointer-events-none opacity-60" />

        {/* Ambient radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#1a7a8c]/15 via-[#0ea5e9]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full py-28 lg:py-36 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            {/* Trust Pill */}
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#1e4a5d] bg-[#0d2833]/80 backdrop-blur-md text-[#bde0fe] text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#1a7a8c] animate-pulse" />
              <span>Coordinated Specialized Talent</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-6"
            >
              Your Digital Work.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bde0fe] via-[#8ecae6] to-[#1a7a8c]">
                Handled by Skilled People.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10"
            >
              From custom web development and UI/UX design to AI automations, growth marketing, and cybersecurity — DigiHust unites verified specialists into unified project squads.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/contact"
                  className="flex items-center space-x-2.5 px-8 py-4 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-bold text-base shadow-xl shadow-[#1a7a8c]/25 transition-colors"
                >
                  <span>Get a Scoped Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/services"
                  className="flex items-center space-x-2 px-8 py-4 rounded-xl border border-[#1e4a5d] hover:border-[#1a7a8c] text-slate-200 font-bold text-base bg-[#0d2833]/60 hover:bg-[#1a7a8c]/15 transition-all"
                >
                  <span>Explore Capabilities</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Skill tags strip */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-slate-400"
            >
              {['Web Engineering', 'Design Systems', 'AI Automations', 'Growth Marketing', 'Cybersecurity', 'BI Dashboards'].map((t, i) => (
                <React.Fragment key={t}>
                  {i > 0 && <span className="text-[#1e4a5d] hidden sm:inline">·</span>}
                  <span className="hover:text-[#bde0fe] transition-colors">{t}</span>
                </React.Fragment>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── METRICS STRIP ── */}
      <section className="bg-[#0d2833] border-b border-[#1e4a5d] py-10 px-6 lg:px-8">
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
              <p className="font-display font-black text-3xl sm:text-4xl text-[#bde0fe] mb-1">{item.metric}</p>
              <p className="text-sm font-bold text-white mb-0.5">{item.label}</p>
              <p className="text-xs text-slate-400">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: SERVICES OVERVIEW (Light mood contrast) ── */}
      <section className="bg-white py-24 px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">Core Capabilities</p>
              <h2 className="font-display font-extrabold text-4xl text-gray-900 mb-2">One Company. Every Digital Need.</h2>
              <p className="text-base text-gray-500 max-w-xl">
                Instead of hiring and managing 5 separate freelance silos, DigiHust executes your complete vision under one unified scope.
              </p>
            </div>
            <Link to="/services" className="inline-flex items-center space-x-1.5 text-sm font-bold text-[#1a7a8c] hover:underline">
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
                className="group border border-gray-100 rounded-2xl p-7 hover:border-[#1a7a8c]/40 hover:shadow-xl transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white shadow-md"
                    style={{ backgroundColor: svc.color }}
                  >
                    {svc.icon}
                  </div>
                  <h3 className="font-display font-extrabold text-xl text-gray-900 mb-1">{svc.title}</h3>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{svc.summary}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">{svc.description}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {svc.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 border border-gray-100 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/services"
                    className="inline-flex items-center space-x-1 text-sm font-bold text-[#1a7a8c] group-hover:translate-x-1 transition-transform"
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

      {/* ── SECTION 3: WHY DIGIHUST (Visual Model Diagram) ── */}
      <section className="bg-[#071e26] py-24 px-6 lg:px-8 border-t border-[#1e4a5d]/60 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">The Model Advantage</p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-6 leading-tight">
                A Managed Digital Company — Not a Random Freelancer Roll.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed mb-6">
                Directly managing five independent freelancers means five separate negotiations, misaligned timelines, blame-shifting, and inconsistent quality.
              </p>
              <p className="text-base text-slate-300 leading-relaxed mb-8">
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
                    <CheckCircle2 className="w-5 h-5 text-[#1a7a8c] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-300">{point}</p>
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
              className="flex flex-col items-center select-none bg-[#0d2833] p-8 rounded-3xl border border-[#1e4a5d] shadow-2xl"
            >
              {/* Client Box */}
              <div className="w-48 py-3 px-6 rounded-xl bg-white text-gray-900 text-center font-bold text-sm shadow-md">
                Client Organization
              </div>
              <div className="w-px h-6 bg-[#1e4a5d]" />

              {/* DigiHust Core */}
              <div className="w-64 py-4 px-6 rounded-2xl bg-gradient-to-br from-[#1a7a8c] to-[#0d5966] text-white text-center font-extrabold text-base shadow-xl border border-[#1a7a8c]">
                DigiHust Management
                <p className="text-[10px] font-normal text-[#bde0fe] mt-0.5 tracking-wider uppercase">
                  Single Accountable Entity
                </p>
              </div>
              <div className="w-px h-6 bg-[#1e4a5d]" />

              {/* Specialized Squads */}
              <div className="grid grid-cols-3 gap-3 w-full">
                {[
                  ['Engineering', '#1a7a8c'],
                  ['Design & UX', '#8b5cf6'],
                  ['AI & Data', '#0ea5e9'],
                ].map(([label, col]) => (
                  <div
                    key={label}
                    className="py-2.5 px-2 rounded-xl border text-center text-xs font-bold"
                    style={{ borderColor: col + '60', color: col, backgroundColor: col + '15' }}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 w-2/3 mt-3">
                {[
                  ['Growth / SEO', '#f59e0b'],
                  ['Cybersecurity', '#ef4444'],
                ].map(([label, col]) => (
                  <div
                    key={label}
                    className="py-2.5 px-2 rounded-xl border text-center text-xs font-bold"
                    style={{ borderColor: col + '60', color: col, backgroundColor: col + '15' }}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="w-px h-6 bg-[#1e4a5d] mt-3" />

              {/* Final Delivered Output */}
              <div className="w-60 py-3.5 px-6 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-center font-bold text-sm shadow-inner">
                ✓ Unified Delivered Solution
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: HOW IT WORKS (4 Step Process) ── */}
      <section className="bg-white py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">Structured Execution</p>
            <h2 className="font-display font-extrabold text-4xl text-gray-900 mb-4">How We Work</h2>
            <p className="text-base text-gray-500">
              Four streamlined steps from your initial requirement to a tested, production-ready deliverable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="relative p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-lg hover:border-gray-200 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-black text-2xl text-[#1a7a8c]">{step.num}</span>
                  <div className="p-2 rounded-xl bg-white shadow-sm border border-gray-100">{step.icon}</div>
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/how-it-works"
              className="inline-flex items-center space-x-2 text-sm font-bold text-[#1a7a8c] hover:underline"
            >
              <span>Read detailed process & common questions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: SELECTED WORK ── */}
      <section className="bg-[#071e26] py-24 px-6 lg:px-8 border-t border-[#1e4a5d]/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">Case Studies</p>
              <h2 className="font-display font-extrabold text-4xl text-white">Selected Work</h2>
            </div>
            <Link
              to="/work"
              className="inline-flex items-center space-x-2 text-sm font-bold text-[#bde0fe] hover:underline"
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
                className="group border border-[#1e4a5d] rounded-2xl overflow-hidden bg-[#0d2833] hover:border-[#1a7a8c] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={project.img}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#071e26]/90 backdrop-blur-sm border border-[#1e4a5d] text-[10px] font-bold text-[#bde0fe]">
                      {project.stat}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[11px] font-bold text-[#1a7a8c] uppercase tracking-wider mb-1">
                      {project.category}
                    </p>
                    <h3 className="font-display font-bold text-lg text-white mb-3 group-hover:text-[#bde0fe] transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#071e26] text-slate-400 border border-[#1e4a5d]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <Link
                    to="/work"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-[#bde0fe] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Inspect Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: MEET THE TALENT ── */}
      <section className="bg-white py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">Domain Leads</p>
            <h2 className="font-display font-extrabold text-4xl text-gray-900 mb-4">Meet the Talent</h2>
            <p className="text-base text-gray-500">
              Verified specialists with defined capabilities and deep execution track records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_PREVIEWS.map((member) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group border border-gray-100 rounded-2xl p-6 hover:border-[#1a7a8c]/30 hover:shadow-lg transition-all text-center bg-white"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 ring-2 ring-gray-100 group-hover:ring-[#1a7a8c]/30 transition-all"
                />
                <h3 className="font-bold text-base text-gray-900 mb-0.5">{member.name}</h3>
                <p className="text-xs font-semibold text-[#1a7a8c] mb-3">{member.role}</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {member.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-gray-50 text-gray-500 border border-gray-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/team"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl border border-gray-200 hover:border-[#1a7a8c] text-gray-700 hover:text-[#1a7a8c] font-bold text-sm transition-all"
            >
              <span>Explore all team members</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: CALL TO ACTION ── */}
      <section className="bg-[#071e26] py-24 px-6 lg:px-8 border-t border-[#1e4a5d] text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">
              Have a Project in Mind?
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
              Submit your project scope today. We will review requirements and deliver a structured pricing proposal within 24 hours.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                to="/contact"
                className="inline-flex items-center space-x-3 px-10 py-5 rounded-2xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-extrabold text-lg shadow-2xl shadow-[#1a7a8c]/30 transition-all"
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
