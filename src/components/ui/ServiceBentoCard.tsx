import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronDown, Zap, ShieldCheck } from 'lucide-react';
import { SiteServiceItem } from '../../types';
import { getServiceIcon } from '../../lib/serviceIcons';

interface ServiceBentoCardProps {
  service: SiteServiceItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

// ── SQUAD DOMAIN METRICS & THEMES ──────────────────────────────────────────
export const SQUAD_THEMES: Record<string, { accent: string; glow: string; label: string; roster: string; defaultTech: string[] }> = {
  tech: {
    accent: '#00B4D8',
    glow: 'rgba(0, 180, 216, 0.25)',
    label: 'ENGINEERING SQUAD',
    roster: '1 Principal Architect · 2 Full-Stack Engineers · 1 DevOps Lead',
    defaultTech: ['React & Next.js', 'Enterprise APIs', 'PostgreSQL', 'Docker Cloud'],
  },
  creative: {
    accent: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.25)',
    label: 'CREATIVE & 3D SQUAD',
    roster: '1 Creative Director · 2 Design System Artists · 1 UI/UX Lead',
    defaultTech: ['Figma Design Systems', '3D Motion Assets', 'Cinema 4D', 'Component Kits'],
  },
  data: {
    accent: '#10B981',
    glow: 'rgba(16, 185, 129, 0.25)',
    label: 'AI & AUTOMATION SQUAD',
    roster: '1 AI Solutions Architect · 2 Python / Automation Engineers',
    defaultTech: ['Custom LLM Agents', 'Python ETL', 'n8n Automations', 'PowerBI Dashboards'],
  },
  growth: {
    accent: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.25)',
    label: 'GROWTH & SEO SQUAD',
    roster: '1 Growth Strategist · 2 Technical SEO Specialists',
    defaultTech: ['Technical SEO Audits', 'Google & Meta Ads', 'High-Intent Funnels', 'Analytics'],
  },
  cybersecurity: {
    accent: '#F43F5E',
    glow: 'rgba(244, 63, 94, 0.25)',
    label: 'SECURITY & AUDITING SQUAD',
    roster: '1 Lead Security Researcher · 1 OWASP Penetration Tester',
    defaultTech: ['Penetration Testing', 'OWASP Hardening', 'Vulnerability Audits', 'SOC2 Prep'],
  },
};

// ── GENERATIVE SVG CIRCUITRY PATTERNS ────────────────────────────────────────
export const GenerativePattern: React.FC<{ variant?: string; accent: string; isHovered: boolean }> = ({
  variant,
  accent,
  isHovered,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const v = variant || 'dotted-grid';
  const cleanId = accent.replace(/[^a-zA-Z0-9]/g, '');

  const baseStyle: React.CSSProperties = {
    transition: shouldReduceMotion ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: isHovered && !shouldReduceMotion ? 'scale(1.05)' : 'scale(1)',
  };

  switch (v) {
    case 'concentric-rings':
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
          <svg className="w-[140%] h-[140%] -top-[20%] -left-[20%] absolute" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <circle cx="280" cy="120" r="45" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="280" cy="120" r="90" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.6" />
            <circle cx="280" cy="120" r="145" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="280" cy="120" r="210" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.4" />
          </svg>
        </div>
      );

    case 'flowing-waves':
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 500 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,80 C150,140 350,20 500,90" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.6" />
            <path d="M0,130 C130,190 320,80 500,150" fill="none" stroke={accent} strokeWidth="1.2" strokeDasharray="4 4" />
            <path d="M0,180 C180,240 340,130 500,210" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.4" />
          </svg>
        </div>
      );

    case 'diagonal-hatch':
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`bento-hatch-${cleanId}`} width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="16" stroke={accent} strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#bento-hatch-${cleanId})`} />
          </svg>
        </div>
      );

    case 'mesh-gradient':
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-44 h-44 rounded-full blur-2xl" style={{ backgroundColor: `${accent}40` }} />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#022B3A]/40 blur-3xl" />
        </div>
      );

    case 'isometric-grid':
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`bento-iso-${cleanId}`} width="30" height="52" patternUnits="userSpaceOnUse">
                <path d="M15,0 L30,8.6 L30,26 L15,34.6 L0,26 L0,8.6 Z" fill="none" stroke={accent} strokeWidth="0.8" />
                <path d="M15,34.6 L15,52" fill="none" stroke={accent} strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#bento-iso-${cleanId})`} />
          </svg>
        </div>
      );

    case 'dotted-grid':
    default:
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`bento-dots-${cleanId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill={accent} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#bento-dots-${cleanId})`} />
          </svg>
        </div>
      );
  }
};

export const ServiceBentoCard: React.FC<ServiceBentoCardProps> = ({
  service,
  index,
  isOpen,
  onToggle,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Mouse Spotlight Tracker
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current || shouldReduceMotion) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty('--mx', `${x}px`);
      cardRef.current.style.setProperty('--my', `${y}px`);
    });
  }, [shouldReduceMotion]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--mx', '-999px');
      cardRef.current.style.setProperty('--my', '-999px');
    }
  }, []);

  // Determine Squad Domain Theme
  const themeKey = (service.groupId || '').toLowerCase();
  const theme = SQUAD_THEMES[themeKey] || {
    accent: service.color || '#1F7A8C',
    glow: service.color ? `${service.color}40` : 'rgba(31, 122, 140, 0.25)',
    label: 'SPECIALIZED SQUAD',
    roster: '1 Squad Director · 2 Domain Specialists · 1 QA Lead',
    defaultTech: ['Specialized Architecture', 'Enterprise Code', 'Production Ready'],
  };

  const visibleTech =
    service.features && service.features.length > 0
      ? service.features
      : theme.defaultTech;

  // Formatted numeral: 01, 02, 03...
  const numeral = String(index + 1).padStart(2, '0');

  // Bento Col Span sizing
  const size = service.size || (index === 0 ? 'large' : index === 1 ? 'medium' : 'small');
  const colSpanClass =
    size === 'large'
      ? 'lg:col-span-7'
      : size === 'medium'
      ? 'lg:col-span-5'
      : 'lg:col-span-4';

  const targetLink =
    service.linkTarget ||
    `/contact?services=${encodeURIComponent(service.title)}`;

  const hasImage = Boolean(service.imageUrl && service.imageUrl.trim() !== '');

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: shouldReduceMotion ? 0.2 : 0.4,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={`col-span-1 md:col-span-1 ${colSpanClass} h-full flex flex-col`}
    >
      <div
        ref={cardRef}
        tabIndex={0}
        role="region"
        aria-label={`${service.title} capabilities`}
        onPointerMove={!hasImage ? handlePointerMove : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={!hasImage ? handlePointerLeave : () => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={`w-full h-full relative satin-card overflow-hidden flex flex-col justify-between group p-4 sm:p-5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] transition-all duration-300 ${
          !hasImage ? 'hover:border-[var(--brand-teal)]/70 hover:shadow-xl' : 'hover:border-[var(--brand-teal)]/50'
        }`}
        style={{
          background:
            !hasImage && isHovered
              ? `radial-gradient(420px circle at var(--mx, -999px) var(--my, -999px), ${theme.glow}, transparent 75%), var(--bg-surface)`
              : undefined,
        }}
      >
        <div>
          {/* ── CARD VISUAL HERO / IMAGE BANNER OR GENERATIVE PATTERNS ── */}
          {hasImage ? (
            <div className="relative h-44 sm:h-48 md:h-52 lg:h-56 w-full satin-img-frame mb-3.5 group/img z-10">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 pointer-events-none" />

              {/* Floating Badges on Image */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md backdrop-blur-md border border-white/20 text-white bg-black/60">
                  // {theme.label}
                </span>

                {getServiceIcon(service.icon) && (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 shadow-sm group-hover:scale-105 backdrop-blur-md bg-black/70 border border-white/20 text-white">
                    {getServiceIcon(service.icon, 'w-4 h-4 stroke-[2.2]')}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Generative Circuitry/Grid Backdrop Fallback */}
              <GenerativePattern variant={service.patternVariant} accent={theme.accent} isHovered={isHovered} />

              {/* Top Glow Accent Bar */}
              <div
                className="absolute top-0 left-6 right-6 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
                }}
              />

              {/* ── CARD HEADER: Squad Code + SLA Indicator + Glowing Icon Hub ── */}
              <div className="relative z-10 flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Squad Category Badge with accent colors */}
                  <span
                    className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md border"
                    style={{
                      borderColor: `${theme.accent}40`,
                      backgroundColor: `${theme.accent}12`,
                      color: theme.accent,
                    }}
                  >
                    // {theme.label}
                  </span>

                  {/* Live SLA Badge */}
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34D399]" />
                    <span>SLA GUARANTEED</span>
                  </span>
                </div>

                {/* Glowing Icon Hub */}
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md group-hover:scale-105"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    border: `1.5px solid ${theme.accent}60`,
                    boxShadow: isHovered ? `0 0 18px -2px ${theme.accent}75` : 'none',
                    color: theme.accent,
                  }}
                >
                  {getServiceIcon(service.icon, 'w-5 h-5 stroke-[2.2]')}
                </div>
              </div>
            </>
          )}

          {/* ── CARD ESSENTIALS: Title, Tagline, Description & Tags ── */}
          <div className="relative z-10">
            {hasImage ? (
              <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-heading)] leading-snug mb-1.5 group-hover:text-[var(--brand-teal)] transition-colors">
                {service.title}
              </h3>
            ) : (
              <div className="flex items-baseline gap-2.5 mb-1.5">
                <span
                  className="font-display font-black text-2xl sm:text-3xl tracking-tighter transition-colors select-none"
                  style={{
                    WebkitTextStroke: `1.5px ${theme.accent}80`,
                    color: 'transparent',
                  }}
                >
                  {numeral}
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-heading)] leading-snug group-hover:text-[var(--brand-teal)] transition-colors">
                  {service.title}
                </h3>
              </div>
            )}

            {/* Tagline if card without image */}
            {!hasImage && service.tagline && (
              <p className="text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: theme.accent }}>
                {service.tagline}
              </p>
            )}

            {/* Essential 2-line summary */}
            <p className="text-xs text-[var(--text-body)] leading-relaxed mb-3 line-clamp-2">
              {service.description || service.tagline}
            </p>

            {/* Key Deliverable Tags (Top 3 essentials) */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {visibleTech.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md text-[var(--text-heading)] flex items-center gap-1 ${
                    hasImage ? 'satin-pill' : 'bg-[var(--bg-page)]/80 border border-[var(--border-subtle)] shadow-xs'
                  }`}
                >
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: theme.accent }} />
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── EXPANDABLE QUICK-SPECS DRAWER (Revealed on-demand) ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="relative z-10 py-2.5 mb-2.5 border-t border-[var(--border-subtle)] overflow-hidden"
            >
              <div className="space-y-1.5 text-xs text-[var(--text-body)]">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span className="font-bold text-[var(--text-heading)]">Squad:</span>
                  <span className="truncate">{theme.roster}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-bold text-[var(--text-heading)]">Delivery:</span>
                  <span className="truncate">Sprint milestones · 100% IP ownership</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── COMPACT FOOTER ACTIONS ── */}
        <div className="relative z-10 pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2 mt-auto">
          <Link
            to={targetLink}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg btn-brand-futuristic text-white text-[11px] font-bold transition-all group/btn"
          >
            <span>SCOPE SQUAD</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>

          <button
            type="button"
            onClick={onToggle}
            className="inline-flex items-center space-x-1 text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--text-heading)] px-2 py-1 rounded hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
          >
            <span>{isOpen ? 'COLLAPSE' : 'SPECS'}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
