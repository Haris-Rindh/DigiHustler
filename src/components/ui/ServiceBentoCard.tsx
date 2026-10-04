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
const SQUAD_THEMES: Record<string, { accent: string; glow: string; label: string; roster: string; defaultTech: string[] }> = {
  tech: {
    accent: '#00E5FF',
    glow: 'rgba(0, 229, 255, 0.25)',
    label: 'ENGINEERING SQUAD',
    roster: '1 Principal Architect · 2 Full-Stack Engineers · 1 DevOps Lead',
    defaultTech: ['React & Next.js', 'Enterprise APIs', 'PostgreSQL', 'Docker Cloud'],
  },
  creative: {
    accent: '#C084FC',
    glow: 'rgba(192, 132, 252, 0.25)',
    label: 'CREATIVE & 3D SQUAD',
    roster: '1 Creative Director · 2 Design System Artists · 1 UI/UX Lead',
    defaultTech: ['Figma Design Systems', '3D Motion Assets', 'Cinema 4D', 'Component Kits'],
  },
  data: {
    accent: '#34D399',
    glow: 'rgba(52, 211, 153, 0.25)',
    label: 'AI & AUTOMATION SQUAD',
    roster: '1 AI Solutions Architect · 2 Python / Automation Engineers',
    defaultTech: ['Custom LLM Agents', 'Python ETL', 'n8n Automations', 'PowerBI Dashboards'],
  },
  growth: {
    accent: '#FBBF24',
    glow: 'rgba(251, 191, 36, 0.25)',
    label: 'GROWTH & SEO SQUAD',
    roster: '1 Growth Strategist · 2 Technical SEO Specialists',
    defaultTech: ['Technical SEO Audits', 'Google & Meta Ads', 'High-Intent Funnels', 'Analytics'],
  },
  cybersecurity: {
    accent: '#FB7185',
    glow: 'rgba(251, 113, 133, 0.25)',
    label: 'SECURITY & AUDITING SQUAD',
    roster: '1 Lead Security Researcher · 1 OWASP Penetration Tester',
    defaultTech: ['Penetration Testing', 'OWASP Hardening', 'Vulnerability Audits', 'SOC2 Prep'],
  },
};

// ── GENERATIVE SVG CIRCUITRY PATTERNS ────────────────────────────────────────
const GenerativePattern: React.FC<{ variant?: string; accent: string; isHovered: boolean }> = ({
  variant,
  accent,
  isHovered,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const v = variant || 'dotted-grid';

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

    case 'isometric-grid':
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`bento-iso-${accent}`} width="30" height="52" patternUnits="userSpaceOnUse">
                <path d="M15,0 L30,8.6 L30,26 L15,34.6 L0,26 L0,8.6 Z" fill="none" stroke={accent} strokeWidth="0.8" />
                <path d="M15,34.6 L15,52" fill="none" stroke={accent} strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#bento-iso-${accent})`} />
          </svg>
        </div>
      );

    case 'dotted-grid':
    default:
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`bento-dots-${accent}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill={accent} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#bento-dots-${accent})`} />
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

  // Determine Squad Domain Theme
  const themeKey = (service.groupId || '').toLowerCase();
  const theme = SQUAD_THEMES[themeKey] || {
    accent: '#22A0B4',
    glow: 'rgba(34, 160, 180, 0.25)',
    label: 'SPECIALIZED SQUAD',
    roster: '1 Squad Director · 2 Domain Specialists · 1 QA Lead',
    defaultTech: ['Specialized Architecture', 'Enterprise Code', 'Production Ready'],
  };

  const visibleTech = (service.features && service.features.length > 0)
    ? service.features
    : theme.defaultTech;

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
    `/contact?service=${encodeURIComponent(service.slug || service.id)}`;

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
        onPointerMove={handlePointerMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handlePointerLeave}
        onFocus={() => setIsHovered(true)}
        onBlur={(e) => {
          if (!cardRef.current?.contains(e.relatedTarget as Node)) {
            setIsHovered(false);
          }
        }}
        data-cursor="view"
        className="w-full h-full relative rounded-3xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/70 bg-[var(--bg-surface)] backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group p-6 sm:p-7 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
        style={{
          background: `radial-gradient(420px circle at var(--mx, -999px) var(--my, -999px), ${theme.glow}, transparent 75%), var(--bg-surface)`,
        }}
      >
        {/* Generative Circuitry/Grid Backdrop */}
        <GenerativePattern variant={service.patternVariant} accent={theme.accent} isHovered={isHovered} />

        {/* Top Glow Accent Bar */}
        <div
          className="absolute top-0 left-6 right-6 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
          }}
        />

        {/* ── CARD HEADER: Squad Monospace Code + SLA Indicator + Glowing Icon Hub ── */}
        <div className="relative z-10 flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Squad Category Badge */}
            <span
              className="text-[10px] sm:text-[11px] font-mono font-black tracking-wider uppercase px-2.5 py-1 rounded-md border"
              style={{
                borderColor: `${theme.accent}40`,
                backgroundColor: `${theme.accent}12`,
                color: theme.accent,
              }}
            >
              // {theme.label}
            </span>

            {/* Live SLA Badge */}
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34D399]" />
              <span>SLA GUARANTEED</span>
            </span>
          </div>

          {/* Futuristic Glowing Icon Hub */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md group-hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-page)',
              border: `1.5px solid ${theme.accent}60`,
              boxShadow: isHovered ? `0 0 20px -2px ${theme.accent}60` : 'none',
              color: theme.accent,
            }}
          >
            {getServiceIcon(service.icon, 'w-6 h-6 stroke-[2.2]')}
          </div>
        </div>

        {/* ── CARD BODY: Numeral, Headline, Tagline & Description ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center my-2">
          <div className="flex items-baseline gap-3 mb-1">
            <span
              className="font-display font-black text-3xl sm:text-4xl tracking-tighter transition-colors select-none"
              style={{
                WebkitTextStroke: `1.5px ${theme.accent}80`,
                color: 'transparent',
              }}
            >
              {numeral}
            </span>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[var(--text-heading)] leading-tight">
              {service.title}
            </h3>
          </div>

          {/* Tagline */}
          <p className="text-xs font-mono font-semibold tracking-wide text-[var(--brand-teal)] mb-2.5">
            {service.tagline}
          </p>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed mb-4 line-clamp-2">
            {service.description}
          </p>

          {/* ── DIRECTLY VISIBLE TECH STACK & DELIVERABLE CHIPS ── */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
            {visibleTech.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="text-[10px] sm:text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg bg-[var(--bg-page)]/80 border border-[var(--border-subtle)] text-[var(--text-heading)] shadow-sm flex items-center gap-1"
              >
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.accent }} />
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── EXPANDABLE QUICK-SPECS DRAWER ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="relative z-10 pt-3 pb-3 border-t border-[var(--border-subtle)] overflow-hidden"
            >
              <div className="space-y-2 text-xs text-[var(--text-body)]">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono font-bold text-[var(--text-heading)]">Dedicated Roster:</span>
                  <span>{theme.roster}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono font-bold text-[var(--text-heading)]">SLA Turnaround:</span>
                  <span>14–21 Day Sprint Deployments · Zero Runaway Scope</span>
                </div>
                <div className="pt-1">
                  <p className="font-mono text-[10px] uppercase font-bold text-[var(--text-dim)] mb-1">
                    Deliverables Included:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {visibleTech.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CARD FOOTER ACTIONS ── */}
        <div className="relative z-10 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
          {/* Primary Action Button */}
          <Link
            to={targetLink}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl btn-brand-futuristic text-white text-xs font-bold shadow-md transition-all group/btn"
          >
            <span>SCOPE SQUAD</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>

          {/* Quick Specs Toggle Button */}
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex items-center space-x-1.5 text-[11px] font-mono font-bold text-[var(--text-dim)] hover:text-[var(--text-heading)] px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
          >
            <span>{isOpen ? 'COLLAPSE' : 'SPECS & ROSTER'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
