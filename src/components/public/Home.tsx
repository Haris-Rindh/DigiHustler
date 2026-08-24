import React, { useState, useRef } from 'react';
import {
  ArrowRight, ChevronRight, Code, Palette, Cpu, TrendingUp, Shield,
  Database, CheckCircle, Paperclip, Plus, Minus, Star,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: <Code className="w-5 h-5" />,
    title: 'Development',
    desc: 'Websites, web apps, mobile, backend — built to scale and perform.',
    tags: ['React', 'Next.js', 'Node.js', 'TypeScript'],
    color: '#1a7a8c',
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: 'Creative & Design',
    desc: 'Brand identity, UI/UX, motion graphics, and social content.',
    tags: ['Figma', 'Brand Identity', 'Motion', 'Adobe'],
    color: '#8b5cf6',
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'AI & Automation',
    desc: 'AI chatbots, workflow automation, OpenAI integrations.',
    tags: ['OpenAI', 'Python', 'n8n', 'LangChain'],
    color: '#0ea5e9',
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Digital Marketing',
    desc: 'SEO, paid media, social strategy, email campaigns.',
    tags: ['SEO', 'Google Ads', 'Content', 'Analytics'],
    color: '#f59e0b',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Cybersecurity',
    desc: 'Pen testing, security audits, and compliance advisory.',
    tags: ['Pen Testing', 'OWASP', 'Audit', 'Compliance'],
    color: '#ef4444',
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: 'Digital Solutions',
    desc: 'Data analytics, PowerBI dashboards, virtual assistance.',
    tags: ['PowerBI', 'SQL', 'Data Analysis', 'BI'],
    color: '#10b981',
  },
];

const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Tell Us What You Need',
    desc: 'Submit your project through our quote form. As detailed or brief as you like — we clarify everything together.',
  },
  {
    num: '02',
    title: 'We Build the Right Team',
    desc: 'DigiHust identifies what skills your project needs and assembles a specialist team precisely matched to it.',
  },
  {
    num: '03',
    title: 'We Create',
    desc: 'Your team works with clear milestones and regular updates. Revision rounds are built in to every scope.',
  },
  {
    num: '04',
    title: 'We Deliver',
    desc: 'You receive completed, documented work — with a walkthrough, full files, and a post-delivery support window.',
  },
];

const WORK = [
  {
    category: 'Web Development',
    title: 'Real-Estate Marketplace Portal',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'Creative & Branding',
    title: 'Automotive Brand Identity & Motion Ads',
    tags: ['Brand Identity', 'Motion Graphics', '3D'],
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'AI & Automation',
    title: 'Executive Sales BI Dashboard',
    tags: ['PowerBI', 'Python', 'SQL'],
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
];

const TEAM = [
  {
    name: 'Zubair Ahmed',
    role: 'Lead Full-Stack Architect',
    tags: ['React', 'Node.js', 'DevOps'],
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    cat: 'Development',
  },
  {
    name: 'Ayesha Khan',
    role: 'Creative Director',
    tags: ['UI/UX', 'Figma', 'Motion'],
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    cat: 'Creative',
  },
  {
    name: 'Dr. Hamza Ali',
    role: 'Head of AI & Data',
    tags: ['ML', 'Python', 'PowerBI'],
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    cat: 'AI & Data',
  },
  {
    name: 'Bilal Farooq',
    role: 'Digital Growth Lead',
    tags: ['B2B Sales', 'PPC', 'SEO'],
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    cat: 'Marketing',
  },
];

const TESTIMONIALS = [
  {
    quote: "DigiHust delivered our real-estate portal two weeks ahead of schedule. The team was professional, responsive, and the code quality was excellent.",
    name: 'Ahmed Karimi',
    role: 'Founder, Estates Direct',
    rating: 5,
  },
  {
    quote: "The brand identity they created for us was exactly what we needed. They understood our market and delivered a complete system we're still using two years later.",
    name: 'Sara Müller',
    role: 'CEO, Veloce Motors',
    rating: 5,
  },
  {
    quote: "Our AI automation system now saves the ops team 15 hours per week. The ROI paid back the project cost in 3 weeks. Incredible work.",
    name: 'Bilal Asghar',
    role: 'Operations Director, LogiXpress',
    rating: 5,
  },
];

const PRICING = [
  {
    name: 'Starter',
    price: 'From $300',
    desc: 'Perfect for individuals and small businesses with a single digital need.',
    features: [
      'Single service scope',
      'Up to 2 revision rounds',
      '1–2 week delivery',
      'File handover + basic docs',
      'Email support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: 'From $800',
    desc: 'Multi-service projects for growing businesses that need coordinated delivery.',
    features: [
      '2–4 service areas combined',
      'Dedicated project lead',
      'Unlimited revision rounds',
      '2–6 week delivery',
      'Full documentation + walkthrough',
      'Priority response within 24h',
    ],
    cta: 'Start a Project',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'Large-scale digital projects with ongoing delivery, full-team allocation, and retainer options.',
    features: [
      'Full team allocation',
      'Ongoing retainer options',
      'Dedicated Slack channel',
      'Weekly progress reports',
      'Post-delivery support period',
      'Custom SLA & NDAs',
    ],
    cta: 'Contact Us',
    highlighted: false,
  },
];

const FAQS = [
  {
    q: 'Do you work with international clients?',
    a: 'Yes. Our team works fully remote and has delivered projects for clients in the UK, US, Europe, and across the Middle East. We communicate in English and adapt to your timezone.',
  },
  {
    q: 'How long does a project typically take?',
    a: 'Simple websites and single-service projects: 1–2 weeks. Multi-service packages: 3–6 weeks. Large-scale enterprise projects are scoped individually. We always give you a timeline estimate before work begins.',
  },
  {
    q: "What if I'm not sure which service I need?",
    a: "No problem. Fill in the Get a Quote form describing your situation and goals. We'll review it and recommend the right approach in our first response — no commitment needed.",
  },
  {
    q: 'What happens if I need changes after delivery?',
    a: "Every project includes revision rounds during delivery. After handover, we offer a post-delivery support window. For ongoing changes, we have retainer arrangements available.",
  },
  {
    q: 'Who actually does the work?',
    a: "Verified Digiskill-trained professionals — not random platform freelancers. Each person is part of the DigiHust talent network with a defined specialty. Your project gets the exact skills it needs, assembled under one managed structure.",
  },
  {
    q: 'Can I see examples of past work first?',
    a: "Yes — scroll up to the 'Our Work' section on this page. You can also contact us and ask for a specific portfolio relevant to your project type.",
  },
];

const MARQUEE_ITEMS = [
  'Real Estate', 'E-Commerce', 'FinTech', 'Logistics', 'Healthcare',
  'SaaS', 'Automotive', 'Education', 'Media & Content', 'Hospitality',
];

const FEATURES = [
  { title: 'One point of contact',        desc: 'No managing five different freelancers. DigiHust coordinates everything for you.' },
  { title: 'Skill-matched teams',         desc: 'Every project gets exactly the specialists it needs — no generalists doing everything.' },
  { title: 'Transparent milestones',      desc: 'Clear delivery dates, regular updates, and revision rounds built in to every project.' },
  { title: 'Digiskill-trained talent',    desc: 'Every team member is trained, verified, and operating within a managed professional structure.' },
  { title: 'Fair pricing',                desc: 'No platform markups or race-to-the-bottom rates. Transparent pricing matched to scope.' },
  { title: 'Post-delivery support',       desc: 'We walk you through the deliverables and stay available after handover.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// PERSPECTIVE GRID COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const PerspectiveGrid: React.FC = () => {
  const COLS = 18;
  const ROWS = 10;
  return (
    <div className="perspective-grid-wrap">
      <div className="perspective-grid-inner" style={{ width: `${COLS * 90}px`, height: `${ROWS * 90}px` }}>
        {Array.from({ length: ROWS }).map((_, row) => (
          <div key={row} className="perspective-grid-row">
            {Array.from({ length: COLS }).map((_, col) => (
              <div key={col} className="perspective-grid-cell" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FAQ ACCORDION
// ─────────────────────────────────────────────────────────────────────────────
const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#1e4a5d] rounded-xl overflow-hidden hover:border-[#1a7a8c]/40 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="font-semibold text-white text-sm pr-4">{q}</span>
        {open
          ? <Minus className="w-4 h-4 text-[#1a7a8c] shrink-0" />
          : <Plus className="w-4 h-4 text-slate-400 shrink-0" />
        }
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT FORM
// ─────────────────────────────────────────────────────────────────────────────
const SERVICES_LIST = ['Website / Web App','Graphic Design','Branding & Identity','AI & Automation','Digital Marketing','Cybersecurity','Data & Analytics','Other'];
const BUDGETS = ['Under $500','$500 – $1,000','$1,000 – $3,000','$3,000 – $7,500','$7,500+','Not sure yet'];

const ContactForm: React.FC = () => {
  const [form, setForm] = useState({ name:'', email:'', company:'', services:[] as string[], description:'', budget:'', file: null as File|null });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  const toggle = (s: string) =>
    setForm(p => ({ ...p, services: p.services.includes(s) ? p.services.filter(x => x!==s) : [...p.services, s] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string,string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.services.length) errs.services = 'Select at least one';
    if (!form.description.trim()) errs.description = 'Required';
    if (!form.budget) errs.budget = 'Required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-full bg-[#1a7a8c]/20 border-2 border-[#1a7a8c] flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-7 h-7 text-[#bde0fe]" />
        </div>
        <h3 className="font-display font-bold text-2xl text-white mb-3">We got it.</h3>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          Thanks <strong className="text-white">{form.name}</strong> — we'll review your brief and get back to you at <strong className="text-white">{form.email}</strong> within 24 hours.
        </p>
        <button onClick={() => { setSubmitted(false); setForm({ name:'',email:'',company:'',services:[],description:'',budget:'',file:null }); }} className="mt-6 text-sm font-bold text-[#bde0fe] hover:underline">
          Submit another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Name <span className="text-red-400">*</span></label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name:e.target.value})}
            placeholder="Your name"
            className={`w-full px-4 py-3 rounded-xl bg-[#0d2833] border text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#1a7a8c] focus:border-[#1a7a8c] transition-colors ${errors.name ? 'border-red-500/60' : 'border-[#1e4a5d]'}`} />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email <span className="text-red-400">*</span></label>
          <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})}
            placeholder="you@company.com"
            className={`w-full px-4 py-3 rounded-xl bg-[#0d2833] border text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#1a7a8c] focus:border-[#1a7a8c] transition-colors ${errors.email ? 'border-red-500/60' : 'border-[#1e4a5d]'}`} />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>
      </div>
      {/* Company */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Company <span className="text-slate-600 font-normal normal-case">(optional)</span></label>
        <input type="text" value={form.company} onChange={e => setForm({...form, company:e.target.value})}
          placeholder="Your company or brand name"
          className="w-full px-4 py-3 rounded-xl bg-[#0d2833] border border-[#1e4a5d] text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#1a7a8c] focus:border-[#1a7a8c] transition-colors" />
      </div>
      {/* Services */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">What do you need? <span className="text-red-400">*</span></label>
        <div className="flex flex-wrap gap-2">
          {SERVICES_LIST.map(s => (
            <button key={s} type="button" onClick={() => toggle(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                form.services.includes(s)
                  ? 'border-[#1a7a8c] bg-[#1a7a8c]/20 text-[#bde0fe]'
                  : 'border-[#1e4a5d] text-slate-400 hover:border-[#1a7a8c]/40 hover:text-slate-200'
              }`}>
              {s}
            </button>
          ))}
        </div>
        {errors.services && <p className="text-xs text-red-400 mt-2">{errors.services}</p>}
      </div>
      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tell us about your project <span className="text-red-400">*</span></label>
        <textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})} rows={4}
          placeholder="Describe what you need done. Include goals, context, and any existing materials..."
          className={`w-full px-4 py-3 rounded-xl bg-[#0d2833] border text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#1a7a8c] focus:border-[#1a7a8c] transition-colors resize-none ${errors.description ? 'border-red-500/60' : 'border-[#1e4a5d]'}`} />
        {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
      </div>
      {/* Budget */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Budget Range <span className="text-red-400">*</span></label>
        <select value={form.budget} onChange={e => setForm({...form, budget:e.target.value})}
          className={`w-full px-4 py-3 rounded-xl bg-[#0d2833] border text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#1a7a8c] focus:border-[#1a7a8c] transition-colors ${errors.budget ? 'border-red-500/60' : 'border-[#1e4a5d]'}`}>
          <option value="">Select a range</option>
          {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        {errors.budget && <p className="text-xs text-red-400 mt-1">{errors.budget}</p>}
      </div>
      {/* File */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Attach a File <span className="text-slate-600 font-normal normal-case">(optional — brief, wireframe, reference)</span></label>
        <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-[#1e4a5d] hover:border-[#1a7a8c]/40 cursor-pointer transition-colors">
          <Paperclip className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="text-sm text-slate-500">{form.file ? form.file.name : 'Click to attach (PDF, DOC, PNG, ZIP — max 10MB)'}</span>
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.zip" onChange={e => setForm({...form, file: e.target.files?.[0]||null})} />
        </label>
      </div>
      {/* Submit */}
      <div>
        <button type="submit" className="btn-glow">
          <span className="btn-glow-inner px-7 py-3 text-sm">
            Submit Project Brief
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
        <p className="text-xs text-slate-600 mt-3">Response within 24 hours. No commitment required.</p>
      </div>
    </form>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
export const Home: React.FC = () => {
  return (
    <div className="relative">

      {/* ── Fixed side border lines (Parlo signature) ── */}
      <div aria-hidden="true" className="pointer-events-none fixed top-0 bottom-0 left-7 z-40 border-l border-[#1e4a5d]" />
      <div aria-hidden="true" className="pointer-events-none fixed top-0 bottom-0 right-7 z-40 border-r border-[#1e4a5d]" />

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen w-full overflow-hidden bg-[#071e26] flex flex-col items-center justify-center pt-16">

        {/* Top glow bloom */}
        <div className="hero-glow-bloom" />
        <div className="hero-glow-mid" />

        {/* 3D perspective grid floor — bottom half */}
        <div className="absolute inset-x-0 bottom-0 h-[52%] z-[1] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-80" style={{ maskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)' }}>
            <PerspectiveGrid />
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1e4a5d] bg-[#0d2833]/80 text-[#bde0fe] text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a8c] animate-pulse" />
            Digital Services · Built on Digiskill Talent
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-[clamp(2.5rem,7vw,5rem)] text-white leading-[1.05] tracking-tight mb-6">
            Your Digital Work.<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #bde0fe 0%, #1a7a8c 60%)' }}>
              Handled by Skilled People.
            </span>
          </h1>

          {/* Sub */}
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            From websites and design to AI, marketing, and cybersecurity — DigiHust brings the right digital specialists together to get your project done.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a href="#contact" className="btn-glow">
              <span className="btn-glow-inner px-7 py-3.5 text-base">
                Start a Project
                <ChevronRight className="w-4 h-4" />
              </span>
            </a>
            <a href="#work"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#1e4a5d] hover:border-[#1a7a8c]/60 text-slate-300 font-bold text-base transition-all hover:text-white hover:bg-[#1a7a8c]/10">
              View Our Work
            </a>
          </div>

          {/* Service icon strip */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: <Code className="w-4 h-4" />,        label: 'Development',  color: '#1a7a8c' },
              { icon: <Palette className="w-4 h-4" />,     label: 'Creative',     color: '#8b5cf6' },
              { icon: <Cpu className="w-4 h-4" />,         label: 'AI & Automation', color: '#0ea5e9' },
              { icon: <TrendingUp className="w-4 h-4" />,  label: 'Marketing',    color: '#f59e0b' },
              { icon: <Shield className="w-4 h-4" />,      label: 'Cybersecurity',color: '#ef4444' },
              { icon: <Database className="w-4 h-4" />,    label: 'Solutions',    color: '#10b981' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0d2833]/80 border border-[#1e4a5d] text-xs font-semibold text-slate-300">
                <span style={{ color: item.color }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Scroll</span>
          <div className="w-px h-8 bg-[#1e4a5d]" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 2 — TRUST STRIP (MARQUEE)
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-[#1e4a5d] bg-[#0d2833] py-5">
        <div className="text-center text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-4">
          Trusted by businesses across industries
        </div>
        <div className="marquee-container">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-8">
                <span className="text-slate-500 font-semibold text-sm whitespace-nowrap">{item}</span>
                <span className="w-1 h-1 rounded-full bg-[#1e4a5d]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 3 — SERVICES
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="services" className="bg-[#071e26] py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-xs font-bold text-[#1a7a8c] uppercase tracking-widest mb-3">What We Do</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white max-w-lg leading-tight">
                One company.<br />Every digital need.
              </h2>
              <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
                Instead of hunting five different freelancers, you come to DigiHust. We handle the rest.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map(svc => (
              <div key={svc.title}
                className="group breeze-card-hover p-7 cursor-pointer">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 text-white"
                  style={{ backgroundColor: svc.color + '25', border: `1px solid ${svc.color}50` }}>
                  <span style={{ color: svc.color }}>{svc.icon}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{svc.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{svc.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {svc.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#071e26] text-slate-500 border border-[#1e4a5d] font-medium">{t}</span>
                  ))}
                </div>
                <a href="#contact" className="inline-flex items-center gap-1 text-xs font-bold text-[#1a7a8c] group-hover:gap-2 transition-all">
                  <span>Get a Quote</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 4 — HOW IT WORKS
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="border-t border-[#1e4a5d] bg-[#0d2833] py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <p className="text-xs font-bold text-[#1a7a8c] uppercase tracking-widest mb-3">The Process</p>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm">Four simple steps from your idea to a delivered digital solution.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.num} className="relative">
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-[calc(100%-0px)] w-full h-px border-t border-dashed border-[#1e4a5d] z-0" style={{ width: 'calc(100% - 52px)', left: '52px' }} />
                )}
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl border border-[#1a7a8c]/50 bg-[#1a7a8c]/10 text-[#bde0fe] font-display font-extrabold text-sm flex items-center justify-center mb-5">
                    {step.num}
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 5 — SELECTED WORK
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="work" className="border-t border-[#1e4a5d] bg-[#071e26] py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold text-[#1a7a8c] uppercase tracking-widest mb-3">Selected Work</p>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white">Our Work</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WORK.map(project => (
              <div key={project.title}
                className="group breeze-card overflow-hidden hover:border-[#1a7a8c]/50 transition-all cursor-pointer">
                <div className="aspect-video overflow-hidden bg-[#0a1a22]">
                  <img src={project.img} alt={project.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500" />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold text-[#1a7a8c] uppercase tracking-wider mb-1">{project.category}</p>
                  <h3 className="font-display font-bold text-lg text-white mb-3 group-hover:text-[#bde0fe] transition-colors">{project.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#071e26] text-slate-500 border border-[#1e4a5d]">{t}</span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#bde0fe]">
                    View Case Study
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 6 — FEATURES / WHY DIGIHUST
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[#1e4a5d] bg-[#0d2833] py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-xs font-bold text-[#1a7a8c] uppercase tracking-widest mb-3">Why DigiHust?</p>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white max-w-lg leading-tight">
              A professional company — not a freelancer marketplace.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="breeze-card p-6 hover:border-[#1a7a8c]/40 transition-all">
                <div className="w-6 h-6 rounded bg-[#1a7a8c]/20 border border-[#1a7a8c]/30 text-[#bde0fe] flex items-center justify-center text-[10px] font-black mb-4">✓</div>
                <h3 className="font-display font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 7 — TEAM
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="team" className="border-t border-[#1e4a5d] bg-[#071e26] py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-xs font-bold text-[#1a7a8c] uppercase tracking-widest mb-3">The People Behind the Work</p>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">Meet the Talent</h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Trained, verified Digiskill professionals — each with a defined specialty.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map(m => (
              <div key={m.name} className="group breeze-card-hover p-6">
                <img src={m.img} alt={m.name}
                  className="w-14 h-14 rounded-xl object-cover mb-4 ring-2 ring-[#1e4a5d] group-hover:ring-[#1a7a8c]/40 transition-all" />
                <h3 className="font-bold text-white text-sm mb-0.5">{m.name}</h3>
                <p className="text-xs text-[#1a7a8c] font-semibold mb-3">{m.role}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#071e26] text-slate-500 border border-[#1e4a5d]">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 8 — TESTIMONIALS
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[#1e4a5d] bg-[#0d2833] py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-xs font-bold text-[#1a7a8c] uppercase tracking-widest mb-3">Client Stories</p>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white">What clients say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="breeze-card p-7 flex flex-col justify-between hover:border-[#1a7a8c]/40 transition-all">
                <div>
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({length: t.rating}).map((_,i) => (
                      <Star key={i} className="w-4 h-4 fill-[#1a7a8c] text-[#1a7a8c]" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 9 — PRICING
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="border-t border-[#1e4a5d] bg-[#071e26] py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-xs font-bold text-[#1a7a8c] uppercase tracking-widest mb-3">Transparent Pricing</p>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">Simple Packages</h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              All pricing is project-scoped. These are starting points — complex projects get a custom quote.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map(plan => (
              <div key={plan.name}
                className={`relative rounded-2xl p-7 flex flex-col border transition-all ${
                  plan.highlighted
                    ? 'bg-[#1a7a8c]/10 border-[#1a7a8c] shadow-lg shadow-[#1a7a8c]/10'
                    : 'bg-[#0d2833] border-[#1e4a5d] hover:border-[#1a7a8c]/40'
                }`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#1a7a8c] text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-display font-bold text-xl text-white mb-1">{plan.name}</h3>
                  <p className="text-2xl font-extrabold text-white mb-2">{plan.price}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{plan.desc}</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="w-4 h-4 rounded bg-[#1a7a8c]/20 border border-[#1a7a8c]/30 text-[#bde0fe] flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact"
                  className={`w-full text-center py-3 rounded-xl text-sm font-bold transition-all ${
                    plan.highlighted
                      ? 'bg-[#1a7a8c] hover:bg-[#156575] text-white'
                      : 'border border-[#1e4a5d] hover:border-[#1a7a8c] text-slate-300 hover:text-white'
                  }`}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 10 — FAQs
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="faqs" className="border-t border-[#1e4a5d] bg-[#0d2833] py-28 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold text-[#1a7a8c] uppercase tracking-widest mb-3">FAQs</p>
            <h2 className="font-display font-extrabold text-4xl text-white">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 11 — CONTACT / GET A QUOTE
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="border-t border-[#1e4a5d] bg-[#071e26] py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Left */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <p className="text-xs font-bold text-[#1a7a8c] uppercase tracking-widest mb-3">Get a Quote</p>
                <h2 className="font-display font-extrabold text-4xl text-white mb-5 leading-tight">
                  Have a project<br />in mind?
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Tell us what you need. The more detail the better — but a rough idea is enough to start.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  'We review your brief within 24 hours',
                  'Detailed proposal with scope + pricing',
                  'One onboarding call to align on details',
                  'Work begins within 48 hours',
                ].map(item => (
                  <div key={item} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="w-5 h-5 rounded bg-[#1a7a8c]/20 border border-[#1a7a8c]/30 text-[#bde0fe] flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5">✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <div className="border-t border-[#1e4a5d] pt-6">
                <p className="text-xs text-slate-500 mb-1">Direct email</p>
                <p className="text-sm font-bold text-[#bde0fe]">contact@digihust.com</p>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3 breeze-card p-8">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
