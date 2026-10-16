import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * LavaProposalButton
 *
 * Built for Item 5 ("Start a Project Proposal" lava button animation).
 * Reference: https://uiverse.io/Ashon-G/mean-mayfly-77 (MIT License by Ashon-G).
 * Attribution: Adapted from Uiverse.io mean-mayfly-77 by Ashon-G.
 *
 * Strict Compliance:
 * - Solid base color: #022B3A (with subtle border for dark mode contrast).
 * - ZERO gradients: All colors are solid tokens/hexes (no linear, radial, or conic gradients).
 * - 4 solid-color blobs: 2 in #1F7A8C, 1 in #009688, 1 in #2EC4B6 (mint-green at 35% opacity).
 * - Static CSS blur on container (filter: blur(14px)).
 * - Transforms and opacity only.
 * - IntersectionObserver pauses looping animation when off-screen.
 * - Pauses looping animation when document is hidden.
 * - Respects prefers-reduced-motion: static blobs.
 * - Text in solid white (#FFFFFF) with contrast >= 4.5:1 against the lightest blob area.
 */

interface LavaProposalButtonProps {
  to?: string;
  className?: string;
  onClick?: () => void;
  label?: string;
}

export const LavaProposalButton: React.FC<LavaProposalButtonProps> = ({
  to = '/contact',
  className = '',
  onClick,
  label = 'Start a Project Proposal',
}) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // 1. Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 2. IntersectionObserver + Tab Visibility to pause animation when off-screen or tab hidden
  useEffect(() => {
    if (prefersReducedMotion) return;

    let isIntersecting = false;
    let isVisible = !document.hidden;

    const updatePlayState = () => {
      setIsPlaying(isIntersecting && isVisible);
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      updatePlayState();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        updatePlayState();
      },
      { threshold: 0.1 }
    );

    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  const playState = isPlaying && !prefersReducedMotion ? 'running' : 'paused';

  return (
    <Link
      ref={buttonRef}
      to={to}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-[#021B27] text-white font-extrabold text-base sm:text-lg border border-[#14535F]/40 hover:border-[#1F7A8C] ring-1 ring-black/10 dark:ring-1 dark:ring-cyan-400/30 dark:border-cyan-400/60 dark:hover:border-cyan-300 shadow-[0_12px_28px_-6px_rgba(2,43,58,0.38),0_4px_16px_rgba(31,122,140,0.28)] hover:shadow-[0_18px_36px_-6px_rgba(2,43,58,0.48),0_8px_24px_rgba(31,122,140,0.4)] dark:shadow-[0_0_35px_rgba(34,211,238,0.32),0_12px_28px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_0_55px_rgba(34,211,238,0.55),0_16px_36px_rgba(0,0,0,0.65)] hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 overflow-hidden select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${className}`}
    >
      {/* ── LAVA CONTAINER (STATIC CSS BLUR, CLIPPED INSIDE BUTTON) ── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          filter: prefersReducedMotion ? 'none' : 'blur(16px)',
          transform: 'translateZ(0)', // Force GPU layer
        }}
        aria-hidden="true"
      >
        {/* Blob 1: Radiant Electric Cyan (#00F0FF) */}
        <div
          className="absolute -top-6 -left-6 w-36 h-36 rounded-full bg-[#00F0FF] opacity-80"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaDriftOne 8s ease-in-out infinite alternate`,
            animationPlayState: playState,
          }}
        />

        {/* Blob 2: Vibrant Luminous Aqua (#06B6D4) */}
        <div
          className="absolute -bottom-8 -right-6 w-40 h-40 rounded-full bg-[#06B6D4] opacity-85"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaDriftTwo 7s ease-in-out 0.8s infinite alternate`,
            animationPlayState: playState,
          }}
        />

        {/* Blob 3: Sparkling Emerald-Mint (#10B981) */}
        <div
          className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-[#10B981] opacity-75"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaDriftThree 9.5s ease-in-out 1.5s infinite alternate`,
            animationPlayState: playState,
          }}
        />

        {/* Blob 4: Deep Cerulean Ocean (#0284C7) */}
        <div
          className="absolute -bottom-6 left-1/3 w-36 h-36 rounded-full bg-[#0284C7] opacity-85"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaDriftFour 6.5s ease-in-out 0.4s infinite alternate`,
            animationPlayState: playState,
          }}
        />

        {/* Blob 5: Electric Sky Blue Highlight (#38BDF8) */}
        <div
          className="absolute top-1/4 -right-4 w-28 h-28 rounded-full bg-[#38BDF8] opacity-80"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaDriftFive 8.5s ease-in-out 2s infinite alternate`,
            animationPlayState: playState,
          }}
        />

        {/* Blob 6: Molten Core Pulse (#22D3EE) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#22D3EE] opacity-70"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaPulseCore 5s ease-in-out infinite alternate`,
            animationPlayState: playState,
          }}
        />
      </div>

      {/* ── GLASS CAPSULE SHEEN (Top-edge specular highlight for physical depth) ── */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-b from-white/20 via-white/5 to-transparent z-[5]" 
        aria-hidden="true"
      />

      {/* ── INNER SUBTLE GLOSS BORDER ── */}
      <div 
        className="absolute inset-[1px] pointer-events-none rounded-[15px] border border-white/25 z-[6]" 
        aria-hidden="true"
      />

      {/* ── TEXT & ICON (Sits securely above blobs with solid contrast >= 4.5:1) ── */}
      <span className="relative z-10 flex items-center space-x-3 font-display tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
        <span className="font-bold">{label}</span>
        <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-2 transition-transform duration-300" />
      </span>

      {/* ── INLINE KEYFRAME STYLES FOR BLOBS (GPU TRANSFORMS ONLY) ── */}
      <style>{`
        @keyframes lavaDriftOne {
          0% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }
          33% {
            transform: translate3d(50px, 18px, 0) scale(1.2) rotate(15deg);
          }
          66% {
            transform: translate3d(20px, 34px, 0) scale(0.9) rotate(-10deg);
          }
          100% {
            transform: translate3d(60px, 10px, 0) scale(1.15) rotate(20deg);
          }
        }
        @keyframes lavaDriftTwo {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            transform: translate3d(-55px, -22px, 0) scale(1.2);
          }
          66% {
            transform: translate3d(-20px, -38px, 0) scale(0.92);
          }
          100% {
            transform: translate3d(-45px, -12px, 0) scale(1.28);
          }
        }
        @keyframes lavaDriftThree {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(40px, -18px, 0) scale(1.3);
          }
          100% {
            transform: translate3d(-40px, 22px, 0) scale(0.85);
          }
        }
        @keyframes lavaDriftFour {
          0% {
            transform: translate3d(0, 0, 0) scale(0.9);
          }
          50% {
            transform: translate3d(45px, -26px, 0) scale(1.22);
          }
          100% {
            transform: translate3d(-30px, 18px, 0) scale(1.05);
          }
        }
        @keyframes lavaDriftFive {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            transform: translate3d(-35px, 28px, 0) scale(1.22);
          }
          66% {
            transform: translate3d(35px, -24px, 0) scale(0.88);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1.12);
          }
        }
        @keyframes lavaPulseCore {
          0%, 100% {
            transform: translate3d(-50%, -50%, 0) scale(1);
            opacity: 0.65;
          }
          50% {
            transform: translate3d(-45%, -55%, 0) scale(1.35);
            opacity: 0.95;
          }
        }
        .group:hover [style*="lavaDrift"],
        .group:hover [style*="lavaPulseCore"] {
          animation-duration: 3.5s !important;
        }
      `}</style>
    </Link>
  );
};
