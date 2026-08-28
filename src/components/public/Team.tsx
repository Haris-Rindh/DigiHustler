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

const CATS = ['All', 'Development', 'Creative', 'AI & Data', 'Marketing', 'Cybersecurity'] as const;

const CAT_COLORS: Record<string, string> = {
  Development: '#1F7A8C',
  Creative: '#1F7A8C',
  'AI & Data': '#1F7A8C',
  Marketing: '#B08D57',
  Cybersecurity: '#A85C4A',
};

import { useApp } from '../../context/AppContext';

export const Team: React.FC = () => {
  const { siteContent } = useApp();
  const [filter, setFilter] = useState<string>('All');

  const rawTeam = siteContent?.teamMembers || [];

  const teamList = rawTeam.map(tm => ({
    name: tm.name,
    role: tm.role,
    category: tm.squad?.includes('Design') || tm.squad?.includes('Creative') 
      ? 'Creative' 
      : tm.squad?.includes('AI') || tm.squad?.includes('Data') 
      ? 'AI & Data' 
      : tm.squad?.includes('Growth') || tm.squad?.includes('Marketing')
      ? 'Marketing'
      : tm.squad?.includes('Security')
      ? 'Cybersecurity'
      : 'Development',
    bio: tm.bio,
    skills: tm.tags || ['Executive Strategy', 'Management'],
    img: tm.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(tm.name)}&background=1F7A8C&color=fff`
  }));

  const displayed = filter === 'All'
    ? teamList
    : teamList.filter((m) => m.category === filter || filter === 'All');

  return (
    <div className="pt-16">
      <SEOHead
        title="Our Team & Domain Specialists — DigiHust"
        description="Meet the specialized talent behind DigiHust: Full-stack software engineers, UI/UX designers, AI practitioners, growth leads, and cybersecurity auditors."
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
              Domain Specialists
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] mb-5">
              Meet the Talent.
            </h1>
            <p className="text-lg text-[var(--text-body)] max-w-2xl leading-relaxed">
              Every DigiHust squad member is a verified professional with specialized technical skills, trained and vetted through Pakistan's Digiskill ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-[var(--bg-page)] border-b border-[var(--border-subtle)] sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 overflow-x-auto">
            {CATS.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`relative px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                    active ? 'text-white' : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="teamCategoryPill"
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

      {/* Team Grid */}
      <section className="bg-[var(--bg-page)] py-16 px-6 lg:px-8">
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
                  className="group border border-[var(--border-subtle)] rounded-2xl p-6 bg-[var(--bg-surface)] hover:shadow-xl hover:border-[var(--brand-teal)]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:ring-[var(--brand-teal)]/40 transition-all flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h2 className="font-bold text-base text-[var(--text-heading)] leading-tight truncate">
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

                    <p className="text-sm text-[var(--text-body)] leading-relaxed mb-4">
                      {member.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {member.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-body)] border border-[var(--border-subtle)] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
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
      <section className="bg-[var(--bg-subtle)] py-16 px-6 lg:px-8 border-t border-[var(--border-subtle)]/70 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm mb-4">
            <ShieldCheck className="w-6 h-6 text-[var(--brand-teal)]" />
          </div>
          <h3 className="font-display font-extrabold text-2xl text-[var(--text-heading)] mb-3">
            How Talent is Assembled for Your Project
          </h3>
          <p className="text-sm text-[var(--text-body)] leading-relaxed max-w-xl mx-auto mb-6">
            When you submit a project, our management team selects the specific domain leads and contributors required for your exact scope. No filler resources, no learning on your dime.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 text-sm font-bold text-[var(--brand-teal)] hover:underline"
          >
            <span>Have our team review your project scope</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
