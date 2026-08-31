import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, X, ExternalLink, Mail, UserCheck } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { useApp } from '../../context/AppContext';

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

import { realtimeSync } from '../../lib/realtimeSync';

export const Team: React.FC = () => {
  const { siteContent, users } = useApp();
  const [filter, setFilter] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Pinned Member IDs — from SiteContent (Supabase-backed, cross-device)
  const pinnedIds: string[] = siteContent?.pinnedMemberIds || [];

  useEffect(() => {
    const unsub = realtimeSync.subscribe((_payload) => {
      // CMS_UPDATED triggers re-render via siteContent context — nothing extra needed
    });
    return unsub;
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMember(null);
    };
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMember]);

  // Helper to check CEO & Co-founders (Permanent Top Tier)
  const isCeoOrFounder = (u: any) => {
    if (u.isCeoMaster || u.roleTier === 'ceo') return true;
    const t = (u.title || '').toLowerCase();
    const r = (u.role || '').toLowerCase();
    return t.includes('ceo') || t.includes('founder') || t.includes('co-founder') || r.includes('ceo');
  };

  // Live member roster directly driven by portal database and sorted (CEO -> Co-founders -> Pinned in order -> Others)
  const sortedActiveUsers = [...(users || []).filter((u) => u && u.status === 'active')].sort((a, b) => {
    // 1. CEO & Co-founders on top
    const aLeader = isCeoOrFounder(a);
    const bLeader = isCeoOrFounder(b);
    if (aLeader && !bLeader) return -1;
    if (!aLeader && bLeader) return 1;

    // 2. Pinned members in the exact chronological order they were pinned
    const aPinnedIdx = pinnedIds.indexOf(a.id);
    const bPinnedIdx = pinnedIds.indexOf(b.id);
    if (aPinnedIdx !== -1 && bPinnedIdx === -1) return -1;
    if (aPinnedIdx === -1 && bPinnedIdx !== -1) return 1;
    if (aPinnedIdx !== -1 && bPinnedIdx !== -1) return aPinnedIdx - bPinnedIdx;

    return (a.name || '').localeCompare(b.name || '');
  });

  const teamList: TeamMember[] = sortedActiveUsers.map((u) => ({
    name: u.name,
    role: u.title || (u.roleTier === 'ceo' ? 'Founder & CEO' : u.roleTier === 'manager' ? 'Operations Director' : u.roleTier === 'group_leader' ? 'Squad Leader' : 'Domain Specialist'),
    category: (u.groupId === 'creative' || u.title?.toLowerCase().includes('design') || u.title?.toLowerCase().includes('brand')
      ? 'Creative'
      : u.groupId === 'data' || u.title?.toLowerCase().includes('ai') || u.title?.toLowerCase().includes('data')
      ? 'AI & Data'
      : u.groupId === 'growth' || u.title?.toLowerCase().includes('market')
      ? 'Marketing'
      : u.title?.toLowerCase().includes('security')
      ? 'Cybersecurity'
      : 'Development') as 'Development' | 'Creative' | 'AI & Data' | 'Marketing' | 'Cybersecurity',
    bio: u.bio || (u.specialties && u.specialties.length > 0 ? `Specialist in ${u.specialties.join(', ')}.` : 'Verified DigiHust specialist with proven digital delivery track record.'),
    skills: u.specialties && u.specialties.length > 0 ? u.specialties : ['Digital Delivery', 'Verified Talent'],
    img: u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=1F7A8C&color=fff`
  }));

  const displayed = filter === 'All'
    ? teamList
    : teamList.filter((m) => m.category === filter);

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
      <section className="bg-[var(--bg-page)] border-b border-[var(--border-subtle)] sticky top-16 z-30 shadow-sm backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 overflow-x-auto no-scrollbar">
            {CATS.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[var(--brand-teal)] text-white shadow-md shadow-[var(--brand-teal)]/20'
                      : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="bg-[var(--bg-page)] py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {displayed.map((member) => (
              <div
                key={member.name}
                onClick={() => setSelectedMember(member)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedMember(member);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group border border-[var(--border-subtle)] rounded-2xl p-6 bg-[var(--bg-surface)] hover:shadow-xl hover:border-[var(--brand-teal)] transition-all duration-200 ease-out flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]/40 hover:-translate-y-1.5 select-none"
              >
                <div>
                  {/* Top Profile Header */}
                  <div className="flex items-start space-x-3.5 mb-4">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-[var(--brand-teal)]/40 transition-all flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-base text-[var(--text-heading)] leading-snug break-words group-hover:text-[var(--brand-teal)] transition-colors">
                        {member.name}
                      </h2>
                      <p
                        className="text-xs font-bold mt-1 leading-normal break-words"
                        style={{ color: CAT_COLORS[member.category] || '#1a7a8c' }}
                      >
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* 3 to 4 Lines Clamped Description */}
                  <p className="text-sm text-[var(--text-body)] leading-relaxed mb-4 line-clamp-3 sm:line-clamp-4">
                    {member.bio}
                  </p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {member.skills.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-body)] border border-[var(--border-subtle)] font-medium truncate max-w-[140px]"
                      >
                        {s}
                      </span>
                    ))}
                    {member.skills.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)] font-semibold">
                        +{member.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer and Click Prompt */}
                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between mt-auto">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                    style={{
                      color: CAT_COLORS[member.category] || '#1a7a8c',
                      backgroundColor: (CAT_COLORS[member.category] || '#1a7a8c') + '18',
                    }}
                  >
                    {member.category}
                  </span>
                  
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-[var(--brand-teal)] group-hover:translate-x-0.5 transition-transform">
                    <span className="text-[11px]">View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayed.length === 0 && (
            <div className="text-center py-16 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-8">
              <p className="text-base text-[var(--text-muted)]">
                No team specialists found in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Detailed Member Profile Modal Window */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            />

            {/* Modal Card Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl z-10 overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Background Accent */}
              <div className="relative p-6 sm:p-8 border-b border-[var(--border-subtle)] bg-gradient-to-br from-[var(--bg-subtle)] to-[var(--bg-surface)]">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                  aria-label="Close detail modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
                  <img
                    src={selectedMember.img}
                    alt={selectedMember.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-[var(--brand-teal)]/20 shadow-md flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                      <span
                        className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                        style={{
                          color: CAT_COLORS[selectedMember.category] || '#1a7a8c',
                          backgroundColor: (CAT_COLORS[selectedMember.category] || '#1a7a8c') + '20',
                        }}
                      >
                        {selectedMember.category}
                      </span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Specialist</span>
                      </span>
                    </div>

                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)] leading-tight">
                      {selectedMember.name}
                    </h2>
                    <p
                      className="text-sm font-bold mt-1"
                      style={{ color: CAT_COLORS[selectedMember.category] || '#1a7a8c' }}
                    >
                      {selectedMember.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body / Full Biography and Details */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <div>
                  <h3 className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-wider mb-2.5">
                    Full Profile & Background
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed whitespace-pre-line">
                    {selectedMember.bio}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-wider mb-3">
                    Core Specialties & Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-heading)] border border-[var(--border-subtle)] font-semibold shadow-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--brand-teal)]/5 border border-[var(--brand-teal)]/20 flex items-start space-x-3">
                  <UserCheck className="w-5 h-5 text-[var(--brand-teal)] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[var(--text-body)] leading-relaxed">
                    <strong className="text-[var(--text-heading)] font-bold">Vetted & Squad-Ready:</strong> This specialist undergoes continuous performance evaluations, sprint adherence reviews, and deliverable QA under DigiHust SLA governance.
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 sm:p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-[var(--text-body)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                >
                  Close Window
                </button>
                <Link
                  to={`/contact?inquiry=${encodeURIComponent(`Project Scope with ${selectedMember.name} (${selectedMember.role})`)}`}
                  onClick={() => setSelectedMember(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal)]/90 text-white text-sm font-bold shadow-md shadow-[var(--brand-teal)]/20 transition-all cursor-pointer"
                >
                  <span>Request Squad Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

