import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

interface TeamMember {
  name: string;
  role: string;
  category: 'Development' | 'Creative' | 'AI & Data' | 'Marketing' | 'Cybersecurity';
  bio: string;
  skills: string[];
  img: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Zubair Ahmed',
    role: 'Lead Full-Stack Architect',
    category: 'Development',
    bio: 'Specializes in high-throughput React/Next.js platforms, cloud infrastructure, and robust API microservices.',
    skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Ayesha Khan',
    role: 'Creative & UI/UX Director',
    category: 'Creative',
    bio: 'Designs sophisticated brand systems, responsive Figma UI prototypes, and high-conversion landing experiences.',
    skills: ['UI/UX', 'Figma', 'Brand Systems', 'Motion Design', 'Design Systems'],
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Dr. Hamza Ali',
    role: 'Head of AI & Data Intelligence',
    category: 'AI & Data',
    bio: 'Deploys customized OpenAI / LLM integrations, Python ETL pipelines, and executive PowerBI dashboard architectures.',
    skills: ['Python', 'LLMs', 'PowerBI', 'n8n Automations', 'SQL Pipelines'],
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Bilal Farooq',
    role: 'Growth & Outreach Lead',
    category: 'Marketing',
    bio: 'Drives technical SEO strategies, paid acquisition campaigns, and B2B cold email client acquisition infrastructure.',
    skills: ['B2B Sales', 'Cold Email', 'Technical SEO', 'Google Ads', 'Analytics'],
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Fatima Malik',
    role: 'Senior Frontend Engineer',
    category: 'Development',
    bio: 'Builds pixel-perfect, accessible web interfaces with Tailwind CSS, Framer Motion animations, and React.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'WCAG A11y'],
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Usman Tariq',
    role: 'Security & Cloud Engineer',
    category: 'Cybersecurity',
    bio: 'Performs web application vulnerability assessments, OWASP penetration testing, and AWS security hardening.',
    skills: ['Pen Testing', 'OWASP Audit', 'Network Security', 'Linux Hardening'],
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Sana Rizvi',
    role: 'Content & Brand Strategist',
    category: 'Marketing',
    bio: 'Develops conversion-oriented copywriting, brand messaging guidelines, and search-optimized content libraries.',
    skills: ['Copywriting', 'Content Strategy', 'Brand Messaging', 'SEO Writing'],
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Omar Siddiqui',
    role: 'Motion Graphics & 3D Designer',
    category: 'Creative',
    bio: 'Creates 3D product visualizations, social video advertisements, and After Effects motion assets.',
    skills: ['After Effects', 'Cinema 4D', '3D Visuals', 'Video Editing'],
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
  },
];

const CATS = ['All', 'Development', 'Creative', 'AI & Data', 'Marketing', 'Cybersecurity'] as const;

const CAT_COLORS: Record<string, string> = {
  Development: '#1a7a8c',
  Creative: '#8b5cf6',
  'AI & Data': '#0ea5e9',
  Marketing: '#f59e0b',
  Cybersecurity: '#ef4444',
};

export const Team: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');

  const displayed = filter === 'All'
    ? TEAM_MEMBERS
    : TEAM_MEMBERS.filter((m) => m.category === filter);

  return (
    <div className="pt-16">
      <SEOHead
        title="Our Team & Domain Specialists — DigiHust"
        description="Meet the specialized talent behind DigiHust: Full-stack software engineers, UI/UX designers, AI practitioners, growth leads, and cybersecurity auditors."
      />

      {/* Header */}
      <section className="bg-[#071e26] py-20 px-6 lg:px-8 border-b border-[#1e4a5d]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">
              Domain Specialists
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-5">
              Meet the Talent.
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Every DigiHust squad member is a verified professional with specialized technical skills, trained and vetted through Pakistan's Digiskill ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 overflow-x-auto">
            {CATS.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`relative px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                    active ? 'text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="teamCategoryPill"
                      className="absolute inset-0 bg-[#1a7a8c] rounded-xl shadow-md"
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

      {/* Team Grid */}
      <section className="bg-white py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {displayed.map((member) => (
                <motion.div
                  key={member.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -4 }}
                  className="group border border-gray-200/80 rounded-2xl p-6 bg-white hover:shadow-xl hover:border-[#1a7a8c]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:ring-[#1a7a8c]/40 transition-all flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h2 className="font-bold text-base text-gray-900 leading-tight truncate">
                          {member.name}
                        </h2>
                        <p
                          className="text-xs font-bold mt-1 truncate"
                          style={{ color: CAT_COLORS[member.category] || '#1a7a8c' }}
                        >
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {member.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {member.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-100 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                      style={{
                        color: CAT_COLORS[member.category] || '#1a7a8c',
                        backgroundColor: (CAT_COLORS[member.category] || '#1a7a8c') + '15',
                      }}
                    >
                      {member.category}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Talent Assembly Info */}
      <section className="bg-gray-50 py-16 px-6 lg:px-8 border-t border-gray-200/70 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex p-3 rounded-2xl bg-white border border-gray-200 shadow-sm mb-4">
            <ShieldCheck className="w-6 h-6 text-[#1a7a8c]" />
          </div>
          <h3 className="font-display font-extrabold text-2xl text-gray-900 mb-3">
            How Talent is Assembled for Your Project
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xl mx-auto mb-6">
            When you submit a project, our management team selects the specific domain leads and contributors required for your exact scope. No filler resources, no learning on your dime.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 text-sm font-bold text-[#1a7a8c] hover:underline"
          >
            <span>Have our team review your project scope</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
