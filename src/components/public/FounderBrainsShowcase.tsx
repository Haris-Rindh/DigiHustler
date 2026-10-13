import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { User } from 'lucide-react';
import foundersDuoImg from '../../assets/founders_duo.png';

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

  // IntersectionObserver to trigger entrance animation once
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
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  return (
    <section
      ref={containerRef}
      className="bg-[var(--bg-page)] pt-12 sm:pt-16 md:pt-20 pb-0 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-subtle)] relative overflow-hidden select-none"
    >
      {/* ── SECTION HEADING ── */}
      <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-10 px-4">
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#111827] dark:text-white tracking-tight">
          Meet the Brains Behind{' '}
          <span className="text-[#158376] dark:text-[var(--brand-teal)]">DigiHust</span>
        </h2>
      </div>

      {/* ── DESKTOP & TABLET STAGE (>= 768px) ── */}
      <div className="hidden md:flex relative max-w-6xl mx-auto items-end justify-center min-h-[460px] lg:min-h-[520px] px-2 sm:px-4">
        {/* Soft Mint Circle Backdrop - Prominently visible in light mode */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-6 lg:bottom-8 w-[380px] md:w-[440px] lg:w-[490px] aspect-square rounded-full pointer-events-none z-0 transition-colors duration-300 border border-[#9BD8CB]/70 shadow-[0_0_50px_rgba(188,231,222,0.45)]"
          style={{
            backgroundColor: '#C5EDE4',
          }}
        />
        {/* Dark Mode Circle Backdrop */}
        <div
          className="hidden dark:block absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-6 lg:bottom-8 w-[380px] md:w-[440px] lg:w-[490px] aspect-square rounded-full pointer-events-none z-0 border border-cyan-400/30 shadow-[0_0_60px_rgba(6,182,212,0.15)]"
          style={{
            backgroundColor: 'rgba(9, 61, 77, 0.85)',
          }}
        />

        {/* Flex Row with Physical Gaps: Left Card + Gap + Duo Photo + Gap + Right Card */}
        <div className="relative z-10 flex items-end justify-center w-full gap-4 md:gap-6 lg:gap-8 xl:gap-12">
          {/* 1. LEFT CARD: MAHAD ABBAS (Physical gap, never hidden behind photo) */}
          <motion.div
            onClick={onSelectMahad}
            role={onSelectMahad ? 'button' : undefined}
            tabIndex={onSelectMahad ? 0 : undefined}
            onKeyDown={(e) => {
              if (onSelectMahad && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onSelectMahad();
              }
            }}
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            animate={isEntered || shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.15, ease: 'easeOut' }}
            className={`w-[220px] md:w-[240px] lg:w-[270px] shrink-0 mb-16 md:mb-20 lg:mb-24 rounded-2xl bg-[#E9EAE8] dark:bg-[var(--bg-surface)] border border-white/80 dark:border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.45)] p-4 lg:p-5 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              onSelectMahad ? 'cursor-pointer group' : ''
            }`}
            title={onSelectMahad ? 'Click to view Mahad Abbas credentials' : undefined}
          >
            {/* User Badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-full bg-[#C5EDE4] dark:bg-emerald-950/70 border border-[#9BD8CB]/80 dark:border-emerald-400/30 flex items-center justify-center">
                <User className="w-4 h-4 text-[#158376] fill-[#158376] dark:text-cyan-400 dark:fill-cyan-400" />
              </div>
              {/* Hand-drawn SVG loop arrow pointing towards founder */}
              <svg className="w-12 h-8 text-[#158376] dark:text-cyan-400 opacity-80" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M10,25 C30,10 40,35 55,20 C62,12 70,18 75,30" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M68,28 L75,30 L76,22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Handwritten Signature in Mrs Saint Delafield */}
            <div style={{ fontFamily: '"Mrs Saint Delafield", cursive' }} className="text-3xl sm:text-4xl text-[#158376] dark:text-cyan-400 select-none leading-tight mb-0.5">
              Mahad Abbas
            </div>

            {/* Name in Bold Geometric Sans (Outfit) */}
            <h3 className="font-display font-bold text-lg lg:text-xl text-[#111827] dark:text-white leading-tight select-none tracking-tight group-hover:text-[#158376] dark:group-hover:text-cyan-400 transition-colors">
              Mahad Abbas
            </h3>

            {/* Designation in Sora 700 */}
            <p style={{ fontFamily: 'Sora, sans-serif' }} className="font-bold text-[11px] lg:text-xs text-[#1F7A8C] dark:text-cyan-300 uppercase tracking-wider mt-1 select-none">
              Founder &amp; CEO
            </p>
          </motion.div>

          {/* 2. CENTER PHOTO: FOUNDERS DUO */}
          <div className="relative shrink-0 flex items-end justify-center">
            <motion.img
              src={foundersDuoImg}
              alt="Mahad Abbas and Muhammad Haseeb - DigiHust Executive Leadership"
              className="w-[310px] md:w-[360px] lg:w-[410px] h-auto object-contain object-bottom select-none drop-shadow-md pointer-events-none"
              loading="eager"
              decoding="async"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              animate={isEntered || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />

            {/* Interactive clickable zones over the founders */}
            <div className="absolute inset-0 flex z-30 pointer-events-auto">
              <div
                onClick={onSelectMahad}
                className={`w-1/2 h-full ${onSelectMahad ? 'cursor-pointer' : ''}`}
                title="Click to view Mahad Abbas credentials"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (onSelectMahad && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelectMahad();
                  }
                }}
              />
              <div
                onClick={onSelectHaseeb}
                className={`w-1/2 h-full ${onSelectHaseeb ? 'cursor-pointer' : ''}`}
                title="Click to view Muhammad Haseeb credentials"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (onSelectHaseeb && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelectHaseeb();
                  }
                }}
              />
            </div>
          </div>

          {/* 3. RIGHT CARD: MUHAMMAD HASEEB (Physical gap, never hidden behind photo) */}
          <motion.div
            onClick={onSelectHaseeb}
            role={onSelectHaseeb ? 'button' : undefined}
            tabIndex={onSelectHaseeb ? 0 : undefined}
            onKeyDown={(e) => {
              if (onSelectHaseeb && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onSelectHaseeb();
              }
            }}
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            animate={isEntered || shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
            className={`w-[220px] md:w-[240px] lg:w-[270px] shrink-0 mb-16 md:mb-20 lg:mb-24 rounded-2xl bg-[#E9EAE8] dark:bg-[var(--bg-surface)] border border-white/80 dark:border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.45)] p-4 lg:p-5 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              onSelectHaseeb ? 'cursor-pointer group' : ''
            }`}
            title={onSelectHaseeb ? 'Click to view Muhammad Haseeb credentials' : undefined}
          >
            {/* User Badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-full bg-[#C5EDE4] dark:bg-emerald-950/70 border border-[#9BD8CB]/80 dark:border-emerald-400/30 flex items-center justify-center">
                <User className="w-4 h-4 text-[#158376] fill-[#158376] dark:text-cyan-400 dark:fill-cyan-400" />
              </div>
              {/* Hand-drawn SVG loop arrow pointing left towards founder */}
              <svg className="w-12 h-8 text-[#158376] dark:text-cyan-400 opacity-80 scale-x-[-1]" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M10,25 C30,10 40,35 55,20 C62,12 70,18 75,30" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M68,28 L75,30 L76,22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Handwritten Signature in Mrs Saint Delafield */}
            <div style={{ fontFamily: '"Mrs Saint Delafield", cursive' }} className="text-3xl sm:text-4xl text-[#158376] dark:text-cyan-400 select-none leading-tight mb-0.5">
              Muhammad Haseeb
            </div>

            {/* Name in Bold Geometric Sans (Outfit) */}
            <h3 className="font-display font-bold text-lg lg:text-xl text-[#111827] dark:text-white leading-tight select-none tracking-tight group-hover:text-[#158376] dark:group-hover:text-cyan-400 transition-colors">
              Muhammad Haseeb
            </h3>

            {/* Designation in Sora 700 */}
            <p style={{ fontFamily: 'Sora, sans-serif' }} className="font-bold text-[11px] lg:text-xs text-[#1F7A8C] dark:text-cyan-300 uppercase tracking-wider mt-1 select-none">
              Co - Founder
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── MOBILE RESPONSIVE LAYOUT (< 768px) ── */}
      <div className="md:hidden flex flex-col items-center">
        {/* Photo Stage with Prominent Mint Circle */}
        <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-end justify-center mb-6">
          {/* Mint Circle Backdrop */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] w-[240px] sm:w-[270px] aspect-square rounded-full pointer-events-none z-0 border border-[#9BD8CB]/70 shadow-[0_0_40px_rgba(188,231,222,0.4)]"
            style={{ backgroundColor: '#C5EDE4' }}
          />
          <div
            className="hidden dark:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] w-[240px] sm:w-[270px] aspect-square rounded-full pointer-events-none z-0 border border-cyan-400/30 shadow-[0_0_40px_rgba(6,182,212,0.15)]"
            style={{ backgroundColor: 'rgba(9, 61, 77, 0.85)' }}
          />
          <img
            src={foundersDuoImg}
            alt="Mahad Abbas and Muhammad Haseeb"
            className="w-[240px] sm:w-[270px] h-auto object-contain object-bottom select-none drop-shadow-sm pointer-events-none z-10"
            loading="eager"
            decoding="async"
          />
          {/* Click zones on mobile photo */}
          <div className="absolute inset-0 flex z-20">
            <div
              onClick={onSelectMahad}
              className={`w-1/2 h-full ${onSelectMahad ? 'cursor-pointer active:scale-95' : ''}`}
              title="Click to view Mahad Abbas credentials"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (onSelectMahad && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelectMahad();
                }
              }}
            />
            <div
              onClick={onSelectHaseeb}
              className={`w-1/2 h-full ${onSelectHaseeb ? 'cursor-pointer active:scale-95' : ''}`}
              title="Click to view Muhammad Haseeb credentials"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (onSelectHaseeb && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelectHaseeb();
                }
              }}
            />
          </div>
        </div>

        {/* Mobile Cards Stack */}
        <div className="w-full max-w-sm sm:max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3.5 px-4 pb-10">
          {/* Left Card: Mahad */}
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
            className={`rounded-2xl bg-[#E9EAE8] dark:bg-[var(--bg-surface)] border border-white/80 dark:border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] p-4 text-left transition-all active:scale-[0.98] ${
              onSelectMahad ? 'cursor-pointer' : ''
            }`}
            title={onSelectMahad ? 'Click to view Mahad Abbas credentials' : undefined}
          >
            <div className="w-7 h-7 rounded-full bg-[#C5EDE4] dark:bg-emerald-950/70 border border-[#9BD8CB]/80 dark:border-emerald-400/30 flex items-center justify-center mb-1.5">
              <User className="w-3.5 h-3.5 text-[#158376] fill-[#158376] dark:text-cyan-400 dark:fill-cyan-400" />
            </div>
            <div style={{ fontFamily: '"Mrs Saint Delafield", cursive' }} className="text-2xl text-[#158376] dark:text-cyan-400 select-none leading-none mb-0.5">
              Mahad Abbas
            </div>
            <h3 className="font-display font-bold text-lg text-[#111827] dark:text-white leading-tight select-none tracking-tight">
              Mahad Abbas
            </h3>
            <p style={{ fontFamily: 'Sora, sans-serif' }} className="font-bold text-[10px] text-[#1F7A8C] dark:text-cyan-300 uppercase tracking-wider mt-0.5 select-none">
              Founder &amp; CEO
            </p>
          </div>

          {/* Right Card: Haseeb */}
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
            className={`rounded-2xl bg-[#E9EAE8] dark:bg-[var(--bg-surface)] border border-white/80 dark:border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] p-4 text-left transition-all active:scale-[0.98] ${
              onSelectHaseeb ? 'cursor-pointer' : ''
            }`}
            title={onSelectHaseeb ? 'Click to view Muhammad Haseeb credentials' : undefined}
          >
            <div className="w-7 h-7 rounded-full bg-[#C5EDE4] dark:bg-emerald-950/70 border border-[#9BD8CB]/80 dark:border-emerald-400/30 flex items-center justify-center mb-1.5">
              <User className="w-3.5 h-3.5 text-[#158376] fill-[#158376] dark:text-cyan-400 dark:fill-cyan-400" />
            </div>
            <div style={{ fontFamily: '"Mrs Saint Delafield", cursive' }} className="text-2xl text-[#158376] dark:text-cyan-400 select-none leading-none mb-0.5">
              Muhammad Haseeb
            </div>
            <h3 className="font-display font-bold text-lg text-[#111827] dark:text-white leading-tight select-none tracking-tight">
              Muhammad Haseeb
            </h3>
            <p style={{ fontFamily: 'Sora, sans-serif' }} className="font-bold text-[10px] text-[#1F7A8C] dark:text-cyan-300 uppercase tracking-wider mt-0.5 select-none">
              Co - Founder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
