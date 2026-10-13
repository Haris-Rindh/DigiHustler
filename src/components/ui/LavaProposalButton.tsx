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
      className={`group relative inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-[#022B3A] text-white font-extrabold text-base sm:text-lg border border-[#022B3A]/40 dark:border-[#22A0B4]/50 shadow-xl dark:shadow-[0_0_28px_rgba(34,160,180,0.22)] overflow-hidden select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.98] transition-all duration-150 ${className}`}
    >
      {/* ── LAVA CONTAINER (STATIC CSS BLUR, CLIPPED INSIDE BUTTON) ── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          filter: prefersReducedMotion ? 'none' : 'blur(14px)',
          transform: 'translateZ(0)', // Force GPU layer
        }}
        aria-hidden="true"
      >
        {/* Blob 1: Deep Teal */}
        <div
          className="absolute -top-4 -left-6 w-28 h-28 rounded-full bg-[#1F7A8C] opacity-80"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaDriftOne 9s ease-in-out infinite alternate`,
            animationPlayState: playState,
          }}
        />

        {/* Blob 2: Vibrant Teal / Cyan */}
        <div
          className="absolute -bottom-6 -right-4 w-32 h-32 rounded-full bg-[#009688] opacity-75"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaDriftTwo 8s ease-in-out 1s infinite alternate`,
            animationPlayState: playState,
          }}
        />

        {/* Blob 3: Center-Drifting Mid Teal */}
        <div
          className="absolute top-1 left-1/3 w-24 h-24 rounded-full bg-[#1F7A8C] opacity-70"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaDriftThree 11s ease-in-out 2s infinite alternate`,
            animationPlayState: playState,
          }}
        />

        {/* Blob 4: Mint Accent at 35% opacity (Strictly kept away from high brightness to guarantee >= 4.5:1 text contrast) */}
        <div
          className="absolute -bottom-4 left-1/4 w-20 h-20 rounded-full bg-[#2EC4B6] opacity-35"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaDriftFour 7s ease-in-out 0.5s infinite alternate`,
            animationPlayState: playState,
          }}
        />
      </div>

      {/* ── TEXT & ICON (Sits securely above blobs with solid contrast >= 4.5:1) ── */}
      <span className="relative z-10 flex items-center space-x-3 font-display tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
        <span>{label}</span>
        <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1.5 transition-transform duration-200" />
      </span>

      {/* ── INLINE KEYFRAME STYLES FOR BLOBS (GPU TRANSFORMS ONLY) ── */}
      <style>{`
        @keyframes lavaDriftOne {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(35px, 12px, 0) scale(1.15);
          }
          100% {
            transform: translate3d(15px, 24px, 0) scale(0.95);
          }
        }
        @keyframes lavaDriftTwo {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-30px, -15px, 0) scale(1.1);
          }
          100% {
            transform: translate3d(-10px, -28px, 0) scale(1);
          }
        }
        @keyframes lavaDriftThree {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(20px, -10px, 0) scale(1.2);
          }
          100% {
            transform: translate3d(-25px, 15px, 0) scale(0.9);
          }
        }
        @keyframes lavaDriftFour {
          0% {
            transform: translate3d(0, 0, 0) scale(0.95);
          }
          50% {
            transform: translate3d(25px, -18px, 0) scale(1.1);
          }
          100% {
            transform: translate3d(-15px, 10px, 0) scale(1);
          }
        }
        .group:hover [style*="lavaDrift"] {
          animation-duration: 4.5s !important;
        }
      `}</style>
    </Link>
  );
};
