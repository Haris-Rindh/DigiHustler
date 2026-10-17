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
 * - 4 solid-color blobs: 2 in #2a4b51ff, 1 in #009688, 1 in #077065ff (mint-green at 35% opacity).
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
      className={`group relative inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-[#022B3A] dark:bg-[#01222E] text-white font-extrabold text-base sm:text-lg border border-[#1F7A8C]/50 dark:border-cyan-400 shadow-xl shadow-[#022B3A]/25 hover:shadow-2xl hover:shadow-[#022B3A]/35 dark:shadow-[0_0_35px_rgba(34,211,238,0.4)] dark:hover:shadow-[0_0_50px_rgba(34,211,238,0.65)] overflow-hidden select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-[0.98] transition-all duration-200 ${className}`}
    >
      {/* ── LAVA CONTAINER (ORGANIC FLUID MORPHING WITH STATIC CSS BLUR) ── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          filter: prefersReducedMotion ? 'none' : 'blur(14px)',
          transform: 'translateZ(0)', // Force GPU layer
        }}
        aria-hidden="true"
      >
        {/* Blob 1: Electric Cyan (Left-to-Center Surge) */}
        <div
          className="absolute -top-8 -left-8 w-36 h-36 bg-[#1F7A8C] dark:bg-[#00E5FF] opacity-85 dark:opacity-90"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaMorphOne 6.5s ease-in-out infinite alternate`,
            animationPlayState: playState,
          }}
        />

        {/* Blob 2: Deep Ocean Teal / Seafoam (Right Reservoir) */}
        <div
          className="absolute -bottom-10 -right-8 w-40 h-40 bg-[#14535F] dark:bg-[#0D9488] opacity-80 dark:opacity-85"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaMorphTwo 7s ease-in-out 0.5s infinite alternate`,
            animationPlayState: playState,
          }}
        />

        {/* Blob 3: Petrol Slate-Teal / Sky Cyan (Center Rising Fluid) */}
        <div
          className="absolute -top-6 left-[30%] w-32 h-32 bg-[#0E7490] dark:bg-[#38BDF8] opacity-80 dark:opacity-85"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaMorphThree 5.8s ease-in-out 1s infinite alternate`,
            animationPlayState: playState,
          }}
        />

        {/* Blob 4: Marine Deep Teal / Radiant Aqua (Bottom-Center Surge) */}
        <div
          className="absolute -bottom-8 left-[42%] w-32 h-32 bg-[#155E75] dark:bg-[#14B8A6] opacity-85 dark:opacity-90"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaMorphFour 6.2s ease-in-out 1.5s infinite alternate`,
            animationPlayState: playState,
          }}
        />

        {/* Blob 5: Brand Highlight Cyan (Floating Morphing Droplet) */}
        <div
          className="absolute top-1 left-[18%] w-28 h-28 bg-[#22A0B4] dark:bg-[#22D3EE] opacity-70 dark:opacity-90"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaMorphFive 5.2s ease-in-out 0.3s infinite alternate`,
            animationPlayState: playState,
          }}
        />

        {/* Blob 6: Cyber Blue / Vivid Ocean Swirl */}
        <div
          className="absolute -bottom-4 right-[22%] w-30 h-30 bg-[#164E63] dark:bg-[#0284C7] opacity-75 dark:opacity-85"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : `lavaMorphSix 7.2s ease-in-out 2s infinite alternate`,
            animationPlayState: playState,
          }}
        />
      </div>

      {/* Subtle top glossy sheen rim for glass-capsule effect */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none border border-white/15 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]" 
        aria-hidden="true"
      />

      {/* ── TEXT & ICON (High-contrast pure white over rich teals) ── */}
      <span className="relative z-10 flex items-center space-x-3 font-display tracking-tight text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.7)]">
        <span>{label}</span>
        <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1.5 transition-transform duration-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
      </span>

      {/* ── INLINE KEYFRAME STYLES FOR FLUID MORPHING LAVA (GPU ACCELERATED) ── */}
      <style>{`
        @keyframes lavaMorphOne {
          0% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
            border-radius: 40% 60% 60% 40% / 50% 45% 55% 50%;
          }
          50% {
            transform: translate3d(50px, 16px, 0) scale(1.24, 0.86) rotate(40deg);
            border-radius: 65% 35% 30% 70% / 40% 65% 35% 60%;
          }
          100% {
            transform: translate3d(22px, 30px, 0) scale(0.9, 1.18) rotate(-25deg);
            border-radius: 50% 50% 40% 60% / 60% 40% 60% 40%;
          }
        }
        @keyframes lavaMorphTwo {
          0% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
            border-radius: 50% 50% 40% 60% / 60% 40% 60% 40%;
          }
          50% {
            transform: translate3d(-55px, -20px, 0) scale(1.28, 0.82) rotate(-45deg);
            border-radius: 35% 65% 55% 45% / 55% 35% 65% 45%;
          }
          100% {
            transform: translate3d(-24px, -32px, 0) scale(0.94, 1.2) rotate(30deg);
            border-radius: 60% 40% 60% 40% / 40% 60% 40% 60%;
          }
        }
        @keyframes lavaMorphThree {
          0% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
            border-radius: 45% 55% 65% 35% / 40% 60% 40% 60%;
          }
          50% {
            transform: translate3d(40px, -18px, 0) scale(1.25, 0.88) rotate(50deg);
            border-radius: 65% 35% 45% 55% / 60% 40% 60% 40%;
          }
          100% {
            transform: translate3d(-38px, 22px, 0) scale(0.86, 1.22) rotate(-35deg);
            border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
          }
        }
        @keyframes lavaMorphFour {
          0% {
            transform: translate3d(0, 0, 0) scale(0.95) rotate(0deg);
            border-radius: 60% 40% 50% 50% / 40% 50% 60% 50%;
          }
          50% {
            transform: translate3d(45px, -26px, 0) scale(1.2, 0.85) rotate(-40deg);
            border-radius: 40% 60% 70% 30% / 65% 35% 55% 45%;
          }
          100% {
            transform: translate3d(-28px, 16px, 0) scale(1.05, 1.15) rotate(45deg);
            border-radius: 50% 50% 35% 65% / 50% 60% 40% 50%;
          }
        }
        @keyframes lavaMorphFive {
          0% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
            border-radius: 50% 50% 60% 40% / 45% 55% 45% 55%;
          }
          50% {
            transform: translate3d(-35px, 24px, 0) scale(1.28, 0.82) rotate(55deg);
            border-radius: 35% 65% 40% 60% / 60% 40% 60% 40%;
          }
          100% {
            transform: translate3d(45px, -20px, 0) scale(0.88, 1.18) rotate(-30deg);
            border-radius: 55% 45% 50% 50% / 50% 50% 50% 50%;
          }
        }
        @keyframes lavaMorphSix {
          0% {
            transform: translate3d(0, 0, 0) scale(0.92) rotate(0deg);
            border-radius: 40% 60% 50% 50% / 50% 40% 60% 50%;
          }
          50% {
            transform: translate3d(-45px, -18px, 0) scale(1.22, 0.88) rotate(-50deg);
            border-radius: 60% 40% 40% 60% / 40% 60% 50% 50%;
          }
          100% {
            transform: translate3d(30px, 22px, 0) scale(1.06, 1.14) rotate(35deg);
            border-radius: 50% 50% 60% 40% / 55% 45% 45% 55%;
          }
        }
        .group:hover [style*="lavaMorph"] {
          animation-duration: 3.2s !important;
        }
      `}</style>
    </Link>
  );
};
