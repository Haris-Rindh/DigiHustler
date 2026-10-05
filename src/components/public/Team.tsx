import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, X, UserCheck, Star, Pin, Award } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { useApp } from '../../context/AppContext';
import { realtimeSync } from '../../lib/realtimeSync';
import { handleCardSpotlightMove, handleCardSpotlightLeave } from '../../lib/cardSpotlight';
import { FounderBrainsShowcase } from './FounderBrainsShowcase';

export type TeamTier = 'executive' | 'specialist' | 'intern';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  tier: TeamTier;
  category: 'Development' | 'Creative' | 'AI & Data' | 'Marketing' | 'Cybersecurity';
  bio: string;
  skills: string[];
  img: string;
  email?: string;
  phone?: string;
  digiskillBatch?: string;
  rating?: number;
  completedProjectsCount?: number;
  isCeoMaster?: boolean;
}

const CATS = ['All', 'Development', 'Creative', 'AI & Data', 'Marketing', 'Cybersecurity'] as const;

export const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'Development':
      return {
        text: 'text-cyan-700 dark:text-cyan-300',
        bg: 'bg-cyan-500/10 dark:bg-cyan-400/15',
        border: 'border-cyan-500/30',
        glow: '#22D3EE',
      };
    case 'Creative':
      return {
        text: 'text-purple-700 dark:text-purple-300',
        bg: 'bg-purple-500/10 dark:bg-purple-400/15',
        border: 'border-purple-500/30',
        glow: '#C084FC',
      };
    case 'AI & Data':
      return {
        text: 'text-sky-700 dark:text-sky-300',
        bg: 'bg-sky-500/10 dark:bg-sky-400/15',
        border: 'border-sky-500/30',
        glow: '#38BDF8',
      };
    case 'Marketing':
      return {
        text: 'text-amber-700 dark:text-amber-300',
        bg: 'bg-amber-500/10 dark:bg-amber-400/15',
        border: 'border-amber-500/30',
        glow: '#FBBF24',
      };
    case 'Cybersecurity':
      return {
        text: 'text-rose-700 dark:text-rose-300',
        bg: 'bg-rose-500/10 dark:bg-rose-400/15',
        border: 'border-rose-500/30',
        glow: '#FB7185',
      };
    default:
      return {
        text: 'text-[var(--brand-teal)] dark:text-cyan-300',
        bg: 'bg-[var(--brand-teal-subtle)]',
        border: 'border-[var(--brand-teal)]/30',
        glow: '#22A0B4',
      };
  }
};

const CAT_COLORS: Record<string, string> = {
  Development: '#1F7A8C',
  Creative: '#8B5CF6',
  'AI & Data': '#0284C7',
  Marketing: '#D97706',
  Cybersecurity: '#E11D48',
};

export const Team: React.FC = () => {
  const { siteContent, users } = useApp();
  const [filter, setFilter] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Real Pinned Member IDs directly from Supabase-backed siteContent
  const pinnedIds: string[] = useMemo(() => {
    return siteContent?.pinnedMemberIds || ['usr-1787949460689', 'usr-1788088620952', 'usr-1788119130873'];
  }, [siteContent?.pinnedMemberIds]);

  useEffect(() => {
    const unsub = realtimeSync.subscribe((_payload) => {
      // Real-time synchronization triggers re-render via Context
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

  // Helper to identify CEO & Co-founders (Permanent Executive Tier)
  const isCeoOrFounder = (u: any) => {
    if (u.id === 'usr-ceo-1' || u.isCeoMaster || u.roleTier === 'ceo') return true;
    const t = (u.title || '').toLowerCase();
    const r = (u.role || '').toLowerCase();
    return t.includes('ceo') || t.includes('founder') || t.includes('co-founder') || r.includes('ceo');
  };

  // Map real team members from Supabase with their original roles, titles, and bios
  const teamMembers: TeamMember[] = useMemo(() => {
    if (!users || users.length === 0) return [];

    return users
      .filter((u) => u && u.status === 'active')
      .map((u) => {
        const isExec = isCeoOrFounder(u);
        const t = (u.title || '').trim();
        const r = (u.role || '').toLowerCase();

        // Categorize into real roles from Supabase: Executive, Specialist, or Intern
        const isIntern = !isExec && (r === 'intern' || u.roleTier === 'intern');
        const tier: TeamTier = isExec ? 'executive' : isIntern ? 'intern' : 'specialist';

        // Functional Category from user's groupId or title
        let category: TeamMember['category'] = 'Development';
        if (
          u.groupId === 'creative' ||
          t.toLowerCase().includes('design') ||
          t.toLowerCase().includes('brand') ||
          t.toLowerCase().includes('video') ||
          t.toLowerCase().includes('graphic') ||
          t.toLowerCase().includes('editor') ||
          t.toLowerCase().includes('creative')
        ) {
          category = 'Creative';
        } else if (
          u.groupId === 'data' ||
          t.toLowerCase().includes('ai') ||
          t.toLowerCase().includes('data') ||
          t.toLowerCase().includes('intelligence') ||
          t.toLowerCase().includes('analyst') ||
          t.toLowerCase().includes('machine learning')
        ) {
          category = 'AI & Data';
        } else if (
          u.groupId === 'growth' ||
          t.toLowerCase().includes('market') ||
          t.toLowerCase().includes('lead generator') ||
          t.toLowerCase().includes('growth') ||
          t.toLowerCase().includes('sales')
        ) {
          category = 'Marketing';
        } else if (t.toLowerCase().includes('security') || t.toLowerCase().includes('pen test')) {
          category = 'Cybersecurity';
        }

        // Original role title directly from Supabase record
        const role = t || (isExec ? 'Executive Leader' : isIntern ? 'Intern' : 'Specialist');

        // Original bio from Supabase record
        let bio = (u.bio || '').trim();
        if (!bio) {
          if (u.id === 'usr-ceo-1' || t.toLowerCase().includes('ceo') || (t.toLowerCase().includes('founder') && !t.toLowerCase().includes('co-founder'))) {
            bio = 'Founder & CEO of DigiHust. Leading strategic direction, enterprise client partnerships, and company-wide delivery governance at DigiHust.';
          } else if (t.toLowerCase().includes('co-founder') || u.id === 'usr-1788019490206') {
            bio = 'Passionate about building scalable digital solutions and driving business growth. Co-founder with experience in managing operations, client outreach, and digital strategy.';
          } else if (u.specialties && u.specialties.length > 0) {
            bio = `Specialist in ${u.specialties.join(', ')}.`;
          } else {
            bio = `Specialist in ${category} at DigiHust.`;
          }
        }

        // Authentic avatar URL from Supabase Storage with clean fallback
        const img = u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=1F7A8C&color=fff`;

        return {
          id: u.id,
          name: u.name.trim(),
          role,
          tier,
          category,
          bio,
          skills: u.specialties && u.specialties.length > 0 ? u.specialties : ['Digital Delivery'],
          img,
          email: u.email,
          phone: u.phone,
          digiskillBatch: u.digiskillBatch || (isExec ? 'Founding Member' : 'Batch 05 Graduate'),
          rating: u.rating || 5.0,
          completedProjectsCount: u.completedProjectsCount || 0,
          isCeoMaster: u.isCeoMaster,
        };
      });
  }, [users, pinnedIds]);

  // Sort helper: PINNED MEMBERS ALWAYS REMAIN ON TOP OF THEIR SECTION / CATEGORY
  const sortWithPinnedFirst = (list: TeamMember[]) => {
    return [...list].sort((a, b) => {
      const aPinned = pinnedIds.indexOf(a.id);
      const bPinned = pinnedIds.indexOf(b.id);
      if (aPinned !== -1 && bPinned === -1) return -1;
      if (aPinned === -1 && bPinned !== -1) return 1;
      if (aPinned !== -1 && bPinned !== -1) return aPinned - bPinned;
      return a.name.localeCompare(b.name);
    });
  };

  // Filter members by category
  const matchCat = (m: TeamMember) => filter === 'All' || m.category === filter;

  // Split into real role tiers with pinned members strictly on top
  const executives = teamMembers.filter((m) => m.tier === 'executive');

  const specialists = sortWithPinnedFirst(teamMembers.filter((m) => m.tier === 'specialist'));
  const filteredSpecialists = sortWithPinnedFirst(specialists.filter(matchCat));

  const interns = sortWithPinnedFirst(teamMembers.filter((m) => m.tier === 'intern'));
  const filteredInterns = sortWithPinnedFirst(interns.filter(matchCat));

  // Executive members instances (CEO and Co-Founder)
  const ceoMember = executives.find((m) => m.isCeoMaster || m.role.toLowerCase().includes('ceo') || m.id === 'usr-ceo-1') || executives[0];
  const coFounderMember = executives.find((m) => (m.role.toLowerCase().includes('co-founder') || m.role.toLowerCase().includes('cofounder') || m.id === 'usr-1788019490206') && m.id !== ceoMember?.id) || executives[1];

  return (
    <div className="pt-16">
      <SEOHead
        title="Our Team & Leadership | DigiHust"
        description="Meet our real executive leadership, domain specialists, and interns driving digital delivery at DigiHust."
      />

      {/* Header Section */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3 flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Team & Original Roles</span>
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] mb-5">
              Meet the Minds Behind DigiHust.
            </h1>
            <p className="text-lg text-[var(--text-body)] max-w-2xl leading-relaxed">
              Explore our core team: from executive leadership to specialized engineers, designers, and emerging talent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Section Navbar - Natural & Responsive (No awkward freezing or gap on scroll) */}
      <section className="bg-[var(--bg-page)] border-b border-[var(--border-subtle)] relative z-10">
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

      {/* ── 1. TIER 1: EXECUTIVE LEADERSHIP ("Meet the Brains Behind DigiHust") ── */}
      {filter === 'All' && (
        <FounderBrainsShowcase
          onSelectMahad={() => ceoMember && setSelectedMember(ceoMember)}
          onSelectHaseeb={() => coFounderMember && setSelectedMember(coFounderMember)}
        />
      )}

      {/* ── 2. TIER 2: DOMAIN SPECIALISTS (PINNED MEMBERS ALWAYS ON TOP) ── */}
      {filteredSpecialists.length > 0 && (
        <section className="bg-[var(--bg-page)] py-16 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-1.5 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Domain Specialists</span>
                </p>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)]">
                  Specialists & Engineers
                </h3>
                <p className="text-sm text-[var(--text-body)] mt-1">
                  Experienced specialists driving production web architecture, UI/UX design, and client sprints.
                </p>
              </div>
              <span className="text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-subtle)] px-3 py-1.5 rounded-full border border-[var(--border-subtle)] self-start sm:self-auto">
                {filteredSpecialists.length} Specialists Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
              {filteredSpecialists.map((member) => {
                const isPinned = pinnedIds.includes(member.id);
                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedMember(member);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    data-cursor="view"
                    onPointerMove={handleCardSpotlightMove}
                    onPointerLeave={handleCardSpotlightLeave}
                    className={`group premium-card p-6 flex flex-col justify-between cursor-pointer select-none overflow-hidden relative ${
                      isPinned
                        ? 'border-[var(--brand-teal)]/70 ring-2 ring-[var(--brand-teal)]/25 shadow-lg'
                        : ''
                    }`}
                  >
                    {/* Ambient Category-Colored Halo */}
                    <div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-15 pointer-events-none group-hover:opacity-35 transition-opacity duration-300"
                      style={{ backgroundColor: getCategoryStyles(member.category).glow }}
                    />

                    <div className="relative z-[2]">
                      {/* Pinned Badge */}
                      {isPinned && (
                        <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-extrabold uppercase tracking-wider mb-3">
                          <Pin className="w-2.5 h-2.5 fill-amber-500" />
                          <span>Pinned Member</span>
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex items-start space-x-3.5 mb-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={member.img}
                            alt={member.name}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-[var(--brand-teal)]/50 transition-all"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-base text-[var(--text-heading)] leading-snug break-words group-hover:text-[var(--brand-teal)] transition-colors">
                            {member.name}
                          </h4>
                          <p className={`text-xs font-bold mt-1 leading-normal break-words ${getCategoryStyles(member.category).text}`}>
                            {member.role}
                          </p>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed mb-4 line-clamp-3 sm:line-clamp-4">
                        {member.bio}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {member.skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-body)] border border-[var(--border-subtle)] font-medium truncate max-w-[140px] group-hover:border-[var(--brand-teal)]/20 transition-colors"
                          >
                            {s}
                          </span>
                        ))}
                        {member.skills.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)] font-semibold">
                            +{member.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between mt-auto relative z-[2]">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                        style={{
                          color: CAT_COLORS[member.category] || '#1a7a8c',
                          backgroundColor: (CAT_COLORS[member.category] || '#1a7a8c') + '18',
                        }}
                      >
                        {member.category}
                      </span>
                      
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-[var(--brand-teal)] group-hover:translate-x-1 transition-transform">
                        <span className="text-[11px]">View Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. TIER 3: INTERNS (PINNED MEMBERS ALWAYS ON TOP) ── */}
      {filteredInterns.length > 0 && (
        <section className="bg-[var(--bg-subtle)] py-16 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold text-amber-500 uppercase tracking-widest mb-1.5 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>DigiSkills Ecosystem</span>
                </p>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)]">
                  Interns & Apprentices
                </h3>
                <p className="text-sm text-[var(--text-body)] mt-1">
                  Active interns and graduates contributing to sprints across web, AI, design, and marketing.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 self-start sm:self-auto">
                {filteredInterns.length} Interns Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
              {filteredInterns.map((intern) => {
                const isPinned = pinnedIds.includes(intern.id);
                return (
                  <div
                    key={intern.id}
                    onClick={() => setSelectedMember(intern)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedMember(intern);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    data-cursor="view"
                    onPointerMove={handleCardSpotlightMove}
                    onPointerLeave={handleCardSpotlightLeave}
                    className={`group premium-card p-5 flex flex-col justify-between cursor-pointer select-none overflow-hidden relative ${
                      isPinned
                        ? 'border-amber-400/80 ring-2 ring-amber-400/25 shadow-lg'
                        : ''
                    }`}
                  >
                    {/* Ambient Amber Halo */}
                    <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-15 pointer-events-none group-hover:opacity-35 transition-opacity duration-300 bg-amber-400" />

                    <div className="relative z-[2]">
                      {/* Pinned Badge */}
                      {isPinned && (
                        <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-extrabold uppercase tracking-wider mb-3">
                          <Pin className="w-2.5 h-2.5 fill-amber-500" />
                          <span>Pinned Member</span>
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex items-start space-x-3 mb-3.5">
                        <div className="relative flex-shrink-0">
                          <img
                            src={intern.img}
                            alt={intern.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400/20 group-hover:ring-amber-400/50 transition-all"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider mb-1">
                            Intern
                          </span>
                          <h4 className="font-bold text-sm text-[var(--text-heading)] leading-snug break-words group-hover:text-amber-500 transition-colors">
                            {intern.name}
                          </h4>
                          <p className="text-[11px] font-semibold text-[var(--text-muted)] truncate">
                            {intern.role}
                          </p>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-[var(--text-body)] leading-relaxed mb-3.5 line-clamp-3">
                        {intern.bio}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1 mb-3.5">
                        {intern.skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-[9px] px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-body)] border border-[var(--border-subtle)] font-medium group-hover:border-amber-400/20 transition-colors"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between mt-auto relative z-[2]">
                      <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wide">
                        {intern.category}
                      </span>
                      <span className="text-[11px] font-bold text-amber-500 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                        <span>View Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${getCategoryStyles(selectedMember.category).text} ${getCategoryStyles(selectedMember.category).bg} ${getCategoryStyles(selectedMember.category).border}`}>
                        {selectedMember.category}
                      </span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {selectedMember.tier === 'executive'
                            ? 'Executive Leadership'
                            : selectedMember.tier === 'intern'
                            ? 'Intern'
                            : 'Specialist'}
                        </span>
                      </span>
                    </div>

                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)] leading-tight">
                      {selectedMember.name}
                    </h2>
                    <p className={`text-sm font-bold mt-1 ${getCategoryStyles(selectedMember.category).text}`}>
                      {selectedMember.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body / Full Biography and Details */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <div>
                  <h3 className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-wider mb-2.5">
                    Profile & Background
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed whitespace-pre-line">
                    {selectedMember.bio}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-wider mb-3">
                    Specialties & Skills
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
                    <strong className="text-[var(--text-heading)] font-bold">Verified Member:</strong> Direct team contributor operating under DigiHust delivery standards and service level agreements.
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
                  <span>Request Project</span>
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
