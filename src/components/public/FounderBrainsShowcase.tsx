import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import mahadImg from '../../assets/mahad_transparent.png';
import haseebImg from '../../assets/haseeb_transparent.png';

export interface FounderBrainsShowcaseProps {
  onSelectMahad?: () => void;
  onSelectHaseeb?: () => void;
}

export const FounderBrainsShowcase: React.FC<FounderBrainsShowcaseProps> = ({
  onSelectMahad,
  onSelectHaseeb,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [isTabHidden, setIsTabHidden] = useState<boolean>(false);

  // 1. IntersectionObserver to trigger animation sequence once at threshold 0.3
  useEffect(() => {
    if (shouldReduceMotion) {
      setIsEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  // 2. Tab visibility listener to pause idle nudge loop when backgrounded
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <section
      ref={containerRef}
      className="bg-[var(--bg-page)] pt-12 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-subtle)] relative overflow-hidden select-none"
    >
      {/* ── SECTION HEADING (Typo Fixed: "Meet the Brains Behind DigiHust") ── */}
      <div className="max-w-7xl mx-auto text-center mb-8 sm:mb-14">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-heading)] tracking-tight">
          Meet the Brains Behind{' '}
          <span className="text-[var(--brand-teal)]">DigiHust</span>
        </h2>
      </div>

      {/* ── MAIN STAGE ── */}
      <div className="max-w-6xl mx-auto relative">
        {/* ========================================================================= */}
        {/* ── DESKTOP & TABLET LAYOUT (>= 768px) ── */}
        {/* ========================================================================= */}
        <div className="hidden md:flex relative items-center justify-between min-h-[460px] lg:min-h-[520px]">
          {/* 1. LEFT FOUNDER LABEL: MAHAD ABBAS (Signature + Bold Designation) */}
          <div
            onClick={onSelectMahad}
            role={onSelectMahad ? 'button' : undefined}
            tabIndex={onSelectMahad ? 0 : undefined}
            onKeyDown={(e) => {
              if (onSelectMahad && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onSelectMahad();
              }
            }}
            className={`w-[230px] lg:w-[270px] flex flex-col items-start z-20 pl-2 select-none ${
              onSelectMahad ? 'cursor-pointer group' : ''
            }`}
            title={onSelectMahad ? 'Click to view Mahad Abbas credentials' : undefined}
          >
            <div className={isEntered && !shouldReduceMotion ? 'founder-float-mahad' : ''}>
              {/* Handwritten Signature Name */}
              <motion.h3
                initial={shouldReduceMotion ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
                animate={isEntered || shouldReduceMotion ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="font-signature text-[clamp(2.4rem,4.5vw,3.75rem)] text-[#022B3A] dark:text-cyan-200 leading-none select-none tracking-normal whitespace-nowrap group-hover:text-[var(--brand-teal)] transition-colors"
                style={{ transform: 'rotate(-4deg)', transformOrigin: 'bottom left' }}
              >
                Mahad Abbas
              </motion.h3>

              {/* Bold Designation */}
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                animate={isEntered || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.25, delay: shouldReduceMotion ? 0 : 0.7, ease: 'easeOut' }}
                className="font-designation text-xs lg:text-[13px] tracking-[0.12em] uppercase font-bold text-[var(--text-muted)] mt-1.5 select-none"
              >
                Founder &amp; CEO{' '}
                <span className="text-[var(--brand-teal)] font-bold">of DigiHust</span>
              </motion.p>
            </div>
          </div>

          {/* 2. CENTER STAGE: Soft Mint Circle + Both Transparent Cutout Photos */}
          <div className="relative flex-1 flex items-end justify-center h-[420px] sm:h-[460px] lg:h-[500px]">
            {/* Soft Mint Circle Behind Founders */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[400px] lg:w-[460px] aspect-square rounded-full pointer-events-none -z-10 shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: 'rgba(216, 243, 220, 0.75)',
              }}
            />

            {/* Dark theme mint circle overlay for strong contrast */}
            <div
              className="hidden dark:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[400px] lg:w-[460px] aspect-square rounded-full pointer-events-none -z-10 shadow-inner"
              style={{
                backgroundColor: 'rgba(19, 58, 72, 0.65)',
                border: '1px solid rgba(34, 160, 180, 0.25)',
              }}
            />

            {/* Photos Container */}
            <div className="relative w-full max-w-[500px] h-full flex items-end justify-center">
              {/* Mahad Abbas (Left side, slightly in front) */}
              <div
                onClick={onSelectMahad}
                className={`absolute left-[6%] sm:left-[10%] bottom-0 w-[50%] sm:w-[52%] max-h-[92%] z-10 flex items-end ${
                  onSelectMahad ? 'cursor-pointer group' : ''
                }`}
                title={onSelectMahad ? 'Click to view Mahad Abbas credentials' : undefined}
              >
                <img
                  src={mahadImg}
                  alt="Mahad Abbas - Founder & CEO of DigiHust"
                  className="w-full h-auto object-contain object-bottom pointer-events-none drop-shadow-md select-none group-hover:scale-[1.015] transition-transform duration-300"
                  loading="eager"
                />
              </div>

              {/* Muhammad Haseeb (Right side, slightly behind) */}
              <div
                onClick={onSelectHaseeb}
                className={`absolute right-[6%] sm:right-[10%] bottom-0 w-[46%] sm:w-[48%] max-h-[88%] z-[5] flex items-end ${
                  onSelectHaseeb ? 'cursor-pointer group' : ''
                }`}
                title={onSelectHaseeb ? 'Click to view Muhammad Haseeb credentials' : undefined}
              >
                <img
                  src={haseebImg}
                  alt="Muhammad Haseeb - Co-Founder of DigiHust"
                  className="w-full h-auto object-contain object-bottom pointer-events-none drop-shadow-sm select-none group-hover:scale-[1.015] transition-transform duration-300"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          {/* 3. RIGHT FOUNDER LABEL: MUHAMMAD HASEEB (Signature + Bold Designation) */}
          <div
            onClick={onSelectHaseeb}
            role={onSelectHaseeb ? 'button' : undefined}
            tabIndex={onSelectHaseeb ? 0 : undefined}
            onKeyDown={(e) => {
              if (onSelectHaseeb && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onSelectHaseeb();
              }
            }}
            className={`w-[230px] lg:w-[270px] flex flex-col items-end text-right z-20 pr-2 select-none ${
              onSelectHaseeb ? 'cursor-pointer group' : ''
            }`}
            title={onSelectHaseeb ? 'Click to view Muhammad Haseeb credentials' : undefined}
          >
            <div className={isEntered && !shouldReduceMotion ? 'founder-float-haseeb' : ''}>
              {/* Handwritten Signature Name */}
              <motion.h3
                initial={shouldReduceMotion ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
                animate={isEntered || shouldReduceMotion ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
                transition={{ duration: 0.7, delay: shouldReduceMotion ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-signature text-[clamp(2.4rem,4.5vw,3.75rem)] text-[#022B3A] dark:text-cyan-200 leading-none select-none tracking-normal whitespace-nowrap group-hover:text-[var(--brand-teal)] transition-colors"
                style={{ transform: 'rotate(3deg)', transformOrigin: 'bottom right' }}
              >
                Muhammad Haseeb
              </motion.h3>

              {/* Bold Designation */}
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                animate={isEntered || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.25, delay: shouldReduceMotion ? 0 : 0.85, ease: 'easeOut' }}
                className="font-designation text-xs lg:text-[13px] tracking-[0.12em] uppercase font-bold text-[var(--text-muted)] mt-1.5 select-none"
              >
                Co-Founder{' '}
                <span className="text-[var(--brand-teal)] font-bold">of DigiHust</span>
              </motion.p>
            </div>
          </div>

          {/* ── 4. DESKTOP SVG HAND-DRAWN LOOP ARROWS (Responsive ViewBox) ── */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 500"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full pointer-events-none z-15 overflow-visible"
          >
            {/* ARROW 1: MAHAD ABBAS (Left Loop Arrow) */}
            <g>
              {/* Main Looping Path */}
              <motion.path
                d="M 230 345 C 270 330, 285 240, 310 200 C 325 170, 355 198, 330 232 C 305 260, 290 190, 330 210 C 358 222, 352 280, 356 312"
                fill="none"
                stroke="var(--brand-teal)"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                animate={isEntered || shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 0.95, ease: 'easeInOut' }}
              />

              {/* Arrowhead (Pops in last 150ms with subtle idle nudge toward Mahad) */}
              <motion.g
                initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                animate={isEntered || shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15, delay: shouldReduceMotion ? 0 : 1.6, ease: 'easeOut' }}
                style={{
                  transformOrigin: '356px 312px',
                  animation: !isTabHidden && isEntered && !shouldReduceMotion ? 'arrowTipNudgeMahad 4s ease-in-out infinite' : 'none',
                }}
              >
                <path
                  d="M 342 304 L 356 312 L 344 321"
                  fill="none"
                  stroke="var(--brand-teal)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>
            </g>

            {/* ARROW 2: MUHAMMAD HASEEB (Right Loop Arrow - Handcrafted Variation) */}
            <g>
              {/* Main Looping Path */}
              <motion.path
                d="M 770 345 C 730 330, 715 235, 692 195 C 675 165, 642 192, 668 228 C 692 258, 710 188, 670 208 C 640 220, 648 280, 644 312"
                fill="none"
                stroke="var(--brand-teal)"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                animate={isEntered || shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 1.1, ease: 'easeInOut' }}
              />

              {/* Arrowhead (Pops in last 150ms with subtle idle nudge toward Haseeb) */}
              <motion.g
                initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                animate={isEntered || shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15, delay: shouldReduceMotion ? 0 : 1.75, ease: 'easeOut' }}
                style={{
                  transformOrigin: '644px 312px',
                  animation: !isTabHidden && isEntered && !shouldReduceMotion ? 'arrowTipNudgeHaseeb 4s ease-in-out infinite' : 'none',
                }}
              >
                <path
                  d="M 658 304 L 644 312 L 656 321"
                  fill="none"
                  stroke="var(--brand-teal)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>
            </g>
          </svg>
        </div>

        {/* ========================================================================= */}
        {/* ── MOBILE RESPONSIVE LAYOUT (< 768px) ── */}
        {/* ========================================================================= */}
        <div className="md:hidden flex flex-col items-center">
          {/* 1. Mobile Photos in Mint Circle (On Top) */}
          <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-end justify-center mb-6">
            {/* Mint Circle */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] aspect-square rounded-full pointer-events-none -z-10 shadow-sm"
              style={{ backgroundColor: 'rgba(216, 243, 220, 0.75)' }}
            />
            <div
              className="hidden dark:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] aspect-square rounded-full pointer-events-none -z-10 border border-cyan-500/20"
              style={{ backgroundColor: 'rgba(19, 58, 72, 0.65)' }}
            />

            {/* Mahad Abbas */}
            <div
              onClick={onSelectMahad}
              className={`absolute left-[8%] bottom-0 w-[48%] max-h-[92%] z-10 flex items-end ${
                onSelectMahad ? 'cursor-pointer active:scale-95' : ''
              }`}
              title={onSelectMahad ? 'Click to view Mahad Abbas credentials' : undefined}
            >
              <img
                src={mahadImg}
                alt="Mahad Abbas"
                className="w-full h-auto object-contain object-bottom pointer-events-none drop-shadow-sm select-none"
              />
            </div>

            {/* Muhammad Haseeb */}
            <div
              onClick={onSelectHaseeb}
              className={`absolute right-[8%] bottom-0 w-[44%] max-h-[88%] z-[5] flex items-end ${
                onSelectHaseeb ? 'cursor-pointer active:scale-95' : ''
              }`}
              title={onSelectHaseeb ? 'Click to view Muhammad Haseeb credentials' : undefined}
            >
              <img
                src={haseebImg}
                alt="Muhammad Haseeb"
                className="w-full h-auto object-contain object-bottom pointer-events-none drop-shadow-xs select-none"
              />
            </div>
          </div>

          {/* 2. Mobile Two-Column Floating Labels with Upward Looping Arrows */}
          <div className="w-full grid grid-cols-2 gap-3 px-2">
            {/* Left Column: Mahad */}
            <div
              onClick={onSelectMahad}
              role={onSelectMahad ? 'button' : undefined}
              tabIndex={onSelectMahad ? 0 : undefined}
              className={`flex flex-col items-center text-center select-none ${
                onSelectMahad ? 'cursor-pointer' : ''
              }`}
              title={onSelectMahad ? 'Click to view Mahad Abbas credentials' : undefined}
            >
              <div className={isEntered && !shouldReduceMotion ? 'founder-float-mahad' : ''}>
                <motion.h3
                  initial={shouldReduceMotion ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
                  animate={isEntered || shouldReduceMotion ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="font-signature text-[2.1rem] text-[#022B3A] dark:text-cyan-200 leading-none select-none"
                  style={{ transform: 'rotate(-4deg)' }}
                >
                  Mahad Abbas
                </motion.h3>

                <motion.p
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                  animate={isEntered || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                  transition={{ duration: 0.25, delay: shouldReduceMotion ? 0 : 0.7, ease: 'easeOut' }}
                  className="font-designation text-[11px] tracking-[0.1em] uppercase font-bold text-[var(--text-muted)] mt-1 select-none"
                >
                  Founder &amp; CEO<br />
                  <span className="text-[var(--brand-teal)]">of DigiHust</span>
                </motion.p>
              </div>

              {/* Mobile Upward Arrow pointing to Mahad */}
              <svg aria-hidden="true" viewBox="0 0 100 60" className="w-16 h-10 mt-1 pointer-events-none">
                <motion.path
                  d="M 50 50 C 40 40, 20 40, 30 25 C 40 10, 55 25, 45 35 C 38 42, 35 15, 35 8"
                  fill="none"
                  stroke="var(--brand-teal)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={isEntered || shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 0.7, delay: 0.95, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M 28 15 L 35 8 L 42 15"
                  fill="none"
                  stroke="var(--brand-teal)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={isEntered || shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.15, delay: 1.6 }}
                />
              </svg>
            </div>

            {/* Right Column: Haseeb */}
            <div
              onClick={onSelectHaseeb}
              role={onSelectHaseeb ? 'button' : undefined}
              tabIndex={onSelectHaseeb ? 0 : undefined}
              className={`flex flex-col items-center text-center select-none ${
                onSelectHaseeb ? 'cursor-pointer' : ''
              }`}
              title={onSelectHaseeb ? 'Click to view Muhammad Haseeb credentials' : undefined}
            >
              <div className={isEntered && !shouldReduceMotion ? 'founder-float-haseeb' : ''}>
                <motion.h3
                  initial={shouldReduceMotion ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
                  animate={isEntered || shouldReduceMotion ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="font-signature text-[2.1rem] text-[#022B3A] dark:text-cyan-200 leading-none select-none"
                  style={{ transform: 'rotate(3deg)' }}
                >
                  Muhammad Haseeb
                </motion.h3>

                <motion.p
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                  animate={isEntered || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                  transition={{ duration: 0.25, delay: shouldReduceMotion ? 0 : 0.85, ease: 'easeOut' }}
                  className="font-designation text-[11px] tracking-[0.1em] uppercase font-bold text-[var(--text-muted)] mt-1 select-none"
                >
                  Co-Founder<br />
                  <span className="text-[var(--brand-teal)]">of DigiHust</span>
                </motion.p>
              </div>

              {/* Mobile Upward Arrow pointing to Haseeb */}
              <svg aria-hidden="true" viewBox="0 0 100 60" className="w-16 h-10 mt-1 pointer-events-none">
                <motion.path
                  d="M 50 50 C 60 40, 80 40, 70 25 C 60 10, 45 25, 55 35 C 62 42, 65 15, 65 8"
                  fill="none"
                  stroke="var(--brand-teal)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={isEntered || shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 0.7, delay: 1.1, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M 58 15 L 65 8 L 72 15"
                  fill="none"
                  stroke="var(--brand-teal)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={isEntered || shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.15, delay: 1.75 }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ── ACTION BAR: CONSULTATION & CREDENTIALS ── */}
        <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4 relative z-20">
          <Link
            to="/contact?service=Executive%20Strategy&project=Mahad%20Abbas"
            className="px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
          >
            <span>Consultation with Mahad</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/contact?service=Operations%20Strategy&project=Muhammad%20Haseeb"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
          >
            <span>Discuss Operations with Haseeb</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
