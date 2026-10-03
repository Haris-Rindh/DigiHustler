import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { SiteServiceItem } from '../../types';
import { getServiceIcon } from '../../lib/serviceIcons';

interface ServiceBentoCardProps {
  service: SiteServiceItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

// ── PURE CSS/SVG GENERATIVE PATTERNS (Brand Teal Palette) ───────────────────
const GenerativePattern: React.FC<{ variant?: string; isHovered: boolean }> = ({
  variant,
  isHovered,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const v = variant || 'dotted-grid';

  const baseStyle: React.CSSProperties = {
    transition: shouldReduceMotion ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: isHovered && !shouldReduceMotion ? 'scale(1.05)' : 'scale(1)',
  };

  switch (v) {
    // 1. Dotted grid with radial fade
    case 'dotted-grid':
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bento-dots" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill="#1F7A8C" />
              </pattern>
              <radialGradient id="fade-mask" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1F7A8C" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1F7A8C" stopOpacity="0.05" />
              </radialGradient>
              <mask id="dots-mask">
                <rect width="100%" height="100%" fill="url(#fade-mask)" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#bento-dots)" mask="url(#dots-mask)" />
          </svg>
        </div>
      );

    // 2. Concentric rings / orbit lines
    case 'concentric-rings':
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-35 overflow-hidden">
          <svg className="w-[140%] h-[140%] -top-[20%] -left-[20%] absolute" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <circle cx="280" cy="120" r="45" fill="none" stroke="#1F7A8C" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="280" cy="120" r="90" fill="none" stroke="#1F7A8C" strokeWidth="1.2" opacity="0.6" />
            <circle cx="280" cy="120" r="145" fill="none" stroke="#1F7A8C" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="280" cy="120" r="210" fill="none" stroke="#1F7A8C" strokeWidth="1.2" opacity="0.4" />
            <circle cx="280" cy="120" r="280" fill="none" stroke="#1F7A8C" strokeWidth="1" opacity="0.25" />
          </svg>
        </div>
      );

    // 3. Diagonal hatch lines
    case 'diagonal-hatch':
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bento-hatch" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="16" stroke="#1F7A8C" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bento-hatch)" />
          </svg>
        </div>
      );

    // 4. Flowing wave lines (inline SVG paths)
    case 'flowing-waves':
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-35 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 500 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,80 C150,140 350,20 500,90"
              fill="none"
              stroke="#1F7A8C"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <path
              d="M0,130 C130,190 320,80 500,150"
              fill="none"
              stroke="#1F7A8C"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <path
              d="M0,180 C180,240 340,130 500,210"
              fill="none"
              stroke="#1F7A8C"
              strokeWidth="1.5"
              opacity="0.4"
            />
          </svg>
        </div>
      );

    // 5. Mesh/aurora gradient blobs
    case 'mesh-gradient':
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-44 h-44 rounded-full bg-[var(--brand-teal)]/30 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#022B3A]/40 blur-3xl" />
        </div>
      );

    // 6. Isometric cube/grid lines
    case 'isometric-grid':
    default:
      return (
        <div style={baseStyle} className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bento-iso" width="30" height="52" patternUnits="userSpaceOnUse">
                <path d="M15,0 L30,8.6 L30,26 L15,34.6 L0,26 L0,8.6 Z" fill="none" stroke="#1F7A8C" strokeWidth="0.8" />
                <path d="M15,34.6 L15,52" fill="none" stroke="#1F7A8C" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bento-iso)" />
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

  // Mouse Spotlight Tracker (Desktop fine-pointer with requestAnimationFrame throttle)
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current || shouldReduceMotion) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // ignore touch pointer moves

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

  // Formatted numeral: 01, 02, 03...
  const numeral = String(index + 1).padStart(2, '0');

  // Active state: triggered by hover, keyboard focus (:focus-within), or mobile touch toggle
  const isActive = isHovered || isOpen;

  // Responsive Bento Col Spans:
  // Default by order: #1 (index 0) = 7 cols; #2 (index 1) = 5 cols; #3,4,5 = 4 cols each
  const size = service.size || (index === 0 ? 'large' : index === 1 ? 'medium' : 'small');
  const colSpanClass =
    size === 'large'
      ? 'lg:col-span-7'
      : size === 'medium'
      ? 'lg:col-span-5'
      : 'lg:col-span-4';

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: shouldReduceMotion ? 0.2 : 0.35,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={`col-span-1 md:col-span-1 ${colSpanClass} h-[210px] sm:h-[230px] lg:h-[260px]`}
    >
      <div
        ref={cardRef}
        tabIndex={0}
        role="region"
        aria-label={`${service.title} service details`}
        aria-expanded={isActive}
        onPointerMove={handlePointerMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handlePointerLeave}
        onFocus={() => setIsHovered(true)}
        onBlur={(e) => {
          if (!cardRef.current?.contains(e.relatedTarget as Node)) {
            setIsHovered(false);
          }
        }}
        onClick={(e) => {
          // On touch screens or small devices, clicking card toggles the details sheet
          if (window.matchMedia('(pointer: coarse)').matches) {
            // If user clicked directly on the explore link, let it navigate
            if ((e.target as HTMLElement).closest('a')) return;
            onToggle();
          }
        }}
        data-cursor="view"
        className="w-full h-full relative rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--brand-teal)]/60 hover:shadow-xl transition-all duration-300 overflow-hidden select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] focus-visible:ring-offset-2 flex flex-col justify-between group"
        style={{
          background:
            'radial-gradient(380px circle at var(--mx, -999px) var(--my, -999px), rgba(31, 122, 140, 0.16), transparent 70%), var(--bg-surface)',
        }}
      >
        {/* Generative Background Pattern */}
        <GenerativePattern variant={service.patternVariant} isHovered={isActive} />

        {/* ── TOP BAR: Large Numeral (Left) + Glass Icon Chip (Right) ── */}
        <div className="relative z-10 flex items-center justify-between p-5 pb-0">
          {/* Outlined Numeral */}
          <span
            className="font-display font-black text-5xl sm:text-6xl tracking-tighter select-none transition-all duration-300"
            style={{
              WebkitTextStroke: isActive
                ? '1.5px rgba(31, 122, 140, 0.75)'
                : '1.5px rgba(31, 122, 140, 0.3)',
              color: 'transparent',
            }}
          >
            {numeral}
          </span>

          {/* Glass Chip Icon */}
          <div className="w-10 h-10 rounded-2xl bg-[var(--bg-page)]/80 backdrop-blur-md border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-teal)] shadow-sm group-hover:scale-105 transition-transform duration-200">
            {getServiceIcon(service.icon, 'w-5 h-5')}
          </div>
        </div>

        {/* ── DEFAULT BOTTOM STATE: Service Name Only ── */}
        <div
          className="relative z-10 p-5 pt-0 transition-transform duration-300 ease-out"
          style={{
            transform: isActive && !shouldReduceMotion ? 'translateY(-6px)' : 'translateY(0)',
          }}
        >
          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[var(--text-heading)] leading-tight max-w-[85%]">
            {service.title}
          </h3>
        </div>

        {/* ── MOBILE TOUCH AFFORDANCE (+) ── */}
        <button
          type="button"
          aria-label={isOpen ? `Close ${service.title} details` : `Open ${service.title} details`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="sm:hidden absolute bottom-4 right-4 w-7 h-7 rounded-full bg-[var(--bg-page)]/90 border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-heading)] shadow-sm z-30 transition-transform duration-200"
          style={{
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* ── HOVER / FOCUS / TAP DETAILS SHEET ── */}
        <div
          className="absolute inset-x-0 bottom-0 p-5 bg-[var(--bg-surface)]/98 backdrop-blur-md border-t border-[var(--border-subtle)] rounded-b-3xl z-20 transition-all duration-300 ease-out flex flex-col justify-between"
          style={{
            transform: isActive
              ? 'translateY(0%)'
              : 'translateY(100%)',
            opacity: isActive ? 1 : 0,
            pointerEvents: isActive ? 'auto' : 'none',
          }}
        >
          <div>
            {/* Tagline / Tech tags (Small caps text) */}
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--brand-teal)] mb-1.5 truncate">
              {service.tagline}
            </p>

            {/* Description clamped to 3 lines */}
            <p className="text-xs text-[var(--text-body)] leading-relaxed mb-3 line-clamp-3">
              {service.description}
            </p>
          </div>

          {/* Explore Service Link */}
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <Link
              to={service.linkTarget || `/contact?service=${encodeURIComponent(service.slug || service.id)}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[var(--brand-teal)] hover:text-[var(--brand-teal-hover)] transition-colors focus-visible:outline-none focus-visible:underline"
            >
              <span>Explore service</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Micro Badge for Domain */}
            <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider">
              SLA Backed
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
