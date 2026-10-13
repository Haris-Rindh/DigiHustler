import React from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * HeroWaves
 *
 * Replaces the heavy InteractiveCanvas particle simulation with 3 elegant,
 * flowing SVG wave paths behind the hero banner per Item 9.
 *
 * Characteristics:
 * - 3 organic bezier wave paths spanning the hero container.
 * - Semi-transparent brand teal / cyan strokes with subtle gradient fills.
 * - Runs pure GPU-accelerated SVG animations; respects prefers-reduced-motion.
 * - Flawless presentation in both light and dark modes.
 */

interface HeroWavesProps {
  className?: string;
}

export const HeroWaves: React.FC<HeroWavesProps> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full object-cover opacity-60 dark:opacity-40"
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Subtle linear gradients for soft depth */}
          <linearGradient id="hero-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1F7A8C" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#22A0B4" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#022B3A" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="hero-wave-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.08" />
            <stop offset="60%" stopColor="#1F7A8C" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#022B3A" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="hero-wave-grad-3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#2EC4B6" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#1F7A8C" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* ── WAVE PATH 1: Broad flowing lower wave ── */}
        <path
          d="M-100,520 C240,420 540,640 920,530 C1220,440 1420,580 1560,540 L1560,820 L-100,820 Z"
          fill="url(#hero-wave-grad-1)"
          stroke="#1F7A8C"
          strokeWidth="1.5"
          strokeOpacity="0.35"
          className={shouldReduceMotion ? '' : 'animate-hero-wave-slow'}
        />

        {/* ── WAVE PATH 2: Mid-level undulating wave ── */}
        <path
          d="M-80,360 C260,490 620,310 1020,420 C1320,500 1480,390 1560,410 L1560,820 L-80,820 Z"
          fill="url(#hero-wave-grad-2)"
          stroke="#00B4D8"
          strokeWidth="1.2"
          strokeOpacity="0.3"
          strokeDasharray="6 4"
          className={shouldReduceMotion ? '' : 'animate-hero-wave-mid'}
        />

        {/* ── WAVE PATH 3: High delicate crest wave ── */}
        <path
          d="M-50,220 C320,340 710,180 1140,290 C1380,350 1500,280 1560,300 L1560,820 L-50,820 Z"
          fill="url(#hero-wave-grad-3)"
          stroke="#2EC4B6"
          strokeWidth="1"
          strokeOpacity="0.25"
          className={shouldReduceMotion ? '' : 'animate-hero-wave-fast'}
        />
      </svg>

      <style>{`
        @keyframes heroWaveSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-18px, 12px, 0);
          }
        }
        @keyframes heroWaveMid {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(24px, -14px, 0);
          }
        }
        @keyframes heroWaveFast {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-15px, -8px, 0);
          }
        }
        .animate-hero-wave-slow {
          animation: heroWaveSlow 18s ease-in-out infinite;
        }
        .animate-hero-wave-mid {
          animation: heroWaveMid 14s ease-in-out infinite;
        }
        .animate-hero-wave-fast {
          animation: heroWaveFast 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
