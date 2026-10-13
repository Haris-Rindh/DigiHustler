import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import foundersDuoImg from '../../assets/founders_duo.png';

export interface FounderBrainsShowcaseProps {
  onSelectMahad?: () => void;
  onSelectHaseeb?: () => void;
  dataHero?: boolean;
}

export const FounderBrainsShowcase: React.FC<FounderBrainsShowcaseProps> = ({
  onSelectMahad,
  onSelectHaseeb,
  dataHero = false,
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
      data-hero={dataHero ? 'true' : undefined}
      className="bg-[#F4F9F8] dark:bg-[#031E28] pt-8 sm:pt-10 md:pt-12 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 border-b border-[#9BD8CB]/40 dark:border-cyan-900/40 relative overflow-hidden select-none transition-colors duration-300"
    >
      {/* ── SECTION HEADING (Prominent Executive Header) ── */}
      <div className="max-w-4xl mx-auto text-center mb-3 sm:mb-4 md:mb-5 px-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D7F2EB] dark:bg-cyan-950/80 border border-[#9BD8CB] dark:border-cyan-500/40 text-[11px] font-extrabold text-[#158376] dark:text-cyan-300 uppercase tracking-widest mb-2.5">
          <span>Executive Leadership</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#111827] dark:text-white tracking-tight">
          The Founder's Desk Of{' '}
          <span className="text-[#158376] dark:text-[var(--brand-teal)]">DigiHust</span>
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto mt-2">
          Directing engineering vision, product strategy, and digital delivery.
        </p>
      </div>

      {/* ── DESKTOP & TABLET STAGE (>= 768px) ── */}
      <div className="hidden md:flex relative max-w-6xl mx-auto items-end justify-center min-h-[400px] lg:min-h-[440px] px-2 sm:px-4">
        {/* Soft Mint Semicircle (Circle Cut in Half) Backdrop - Light Mode */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[420px] md:w-[480px] lg:w-[540px] h-[210px] md:h-[240px] lg:h-[270px] rounded-t-full rounded-b-none pointer-events-none z-0 transition-colors duration-300 border-t border-x border-b-0 border-[#9BD8CB]/80 shadow-[0_-12px_45px_rgba(188,231,222,0.55)]"
          style={{
            backgroundColor: '#C5EDE4',
          }}
        />
        {/* Dark Mode Semicircle Backdrop */}
        <div
          className="hidden dark:block absolute left-1/2 -translate-x-1/2 bottom-0 w-[420px] md:w-[480px] lg:w-[540px] h-[210px] md:h-[240px] lg:h-[270px] rounded-t-full rounded-b-none pointer-events-none z-0 border-t border-x border-b-0 border-cyan-400/40 shadow-[0_-14px_50px_rgba(6,182,212,0.22)]"
          style={{
            backgroundColor: 'rgba(9, 61, 77, 0.9)',
          }}
        />

        {/* Flex Row with Physical Gaps: Left Card + Gap + Duo Photo + Gap + Right Card */}
        <div className="relative z-10 flex items-end justify-center w-full gap-4 md:gap-6 lg:gap-8 xl:gap-12">
          {/* 1. LEFT CARD: MAHAD ABBAS (Positioned on the UP side where pointed) */}
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
            className={`w-[190px] md:w-[210px] lg:w-[240px] shrink-0 self-start mt-4 md:mt-6 lg:mt-8 rounded-2xl bg-white/95 dark:bg-[#073547] border border-[#9BD8CB]/70 dark:border-cyan-400/30 shadow-[0_12px_28px_rgba(21,131,118,0.08)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.5)] p-4 lg:p-5 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              onSelectMahad ? 'cursor-pointer group' : ''
            }`}
            title={onSelectMahad ? 'Click to view Mahad Abbas credentials' : undefined}
          >
            {/* Name in Bold Geometric Sans (Outfit) */}
            <h3 className="font-display font-bold text-lg lg:text-xl text-[#111827] dark:text-white leading-tight select-none tracking-tight group-hover:text-[#158376] dark:group-hover:text-cyan-400 transition-colors">
              Mahad Abbas
            </h3>

            {/* Designation in Sora 700 */}
            <p style={{ fontFamily: 'Sora, sans-serif' }} className="font-bold text-[11px] lg:text-xs text-[#1F7A8C] dark:text-cyan-300 uppercase tracking-wider mt-1.5 select-none">
              Founder &amp; CEO
            </p>
          </motion.div>

          {/* 2. CENTER PHOTO: FOUNDERS DUO (Complete image, close to heading) */}
          <div className="relative shrink-0 flex items-end justify-center self-end">
            <motion.img
              src={foundersDuoImg}
              alt="Mahad Abbas and Muhammad Haseeb - DigiHust Executive Leadership"
              className="w-[320px] md:w-[380px] lg:w-[430px] h-auto object-contain object-bottom select-none drop-shadow-md pointer-events-none"
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

          {/* 3. RIGHT CARD: MUHAMMAD HASEEB (Positioned on the UP side where pointed) */}
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
            className={`w-[190px] md:w-[210px] lg:w-[240px] shrink-0 self-start mt-4 md:mt-6 lg:mt-8 rounded-2xl bg-white/95 dark:bg-[#073547] border border-[#9BD8CB]/70 dark:border-cyan-400/30 shadow-[0_12px_28px_rgba(21,131,118,0.08)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.5)] p-4 lg:p-5 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              onSelectHaseeb ? 'cursor-pointer group' : ''
            }`}
            title={onSelectHaseeb ? 'Click to view Muhammad Haseeb credentials' : undefined}
          >
            {/* Name in Bold Geometric Sans (Outfit) */}
            <h3 className="font-display font-bold text-lg lg:text-xl text-[#111827] dark:text-white leading-tight select-none tracking-tight group-hover:text-[#158376] dark:group-hover:text-cyan-400 transition-colors">
              Muhammad Haseeb
            </h3>

            {/* Designation in Sora 700 */}
            <p style={{ fontFamily: 'Sora, sans-serif' }} className="font-bold text-[11px] lg:text-xs text-[#1F7A8C] dark:text-cyan-300 uppercase tracking-wider mt-1.5 select-none">
              Co - Founder
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── MOBILE RESPONSIVE LAYOUT (< 768px) ── */}
      <div className="md:hidden flex flex-col items-center">
        {/* Photo Stage with Prominent Semicircle (Circle Cut in Half) */}
        <div className="relative w-full max-w-[320px] aspect-[1024/934] flex items-end justify-center mb-4">
          {/* Mint Semicircle Backdrop - Mobile */}
          <div
            className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[280px] sm:w-[320px] h-[140px] sm:h-[160px] rounded-t-full rounded-b-none pointer-events-none z-0 border-t border-x border-b-0 border-[#9BD8CB]/80 shadow-[0_-10px_35px_rgba(188,231,222,0.5)]"
            style={{ backgroundColor: '#C5EDE4' }}
          />
          <div
            className="hidden dark:block absolute left-1/2 bottom-0 -translate-x-1/2 w-[280px] sm:w-[320px] h-[140px] sm:h-[160px] rounded-t-full rounded-b-none pointer-events-none z-0 border-t border-x border-b-0 border-cyan-400/40 shadow-[0_-10px_35px_rgba(6,182,212,0.2)]"
            style={{ backgroundColor: 'rgba(9, 61, 77, 0.9)' }}
          />
          <img
            src={foundersDuoImg}
            alt="Mahad Abbas and Muhammad Haseeb"
            className="w-[260px] sm:w-[290px] h-auto object-contain object-bottom select-none drop-shadow-sm pointer-events-none z-10"
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
        <div className="w-full max-w-sm sm:max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3.5 px-4 pb-4">
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
            className={`rounded-2xl bg-white/95 dark:bg-[#073547] border border-[#9BD8CB]/70 dark:border-cyan-400/30 shadow-[0_8px_20px_rgba(21,131,118,0.06)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] p-4 text-left transition-all active:scale-[0.98] ${
              onSelectMahad ? 'cursor-pointer' : ''
            }`}
            title={onSelectMahad ? 'Click to view Mahad Abbas credentials' : undefined}
          >
            <h3 className="font-display font-bold text-lg text-[#111827] dark:text-white leading-tight select-none tracking-tight">
              Mahad Abbas
            </h3>
            <p style={{ fontFamily: 'Sora, sans-serif' }} className="font-bold text-[10px] text-[#1F7A8C] dark:text-cyan-300 uppercase tracking-wider mt-1 select-none">
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
            className={`rounded-2xl bg-white/95 dark:bg-[#073547] border border-[#9BD8CB]/70 dark:border-cyan-400/30 shadow-[0_8px_20px_rgba(21,131,118,0.06)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] p-4 text-left transition-all active:scale-[0.98] ${
              onSelectHaseeb ? 'cursor-pointer' : ''
            }`}
            title={onSelectHaseeb ? 'Click to view Muhammad Haseeb credentials' : undefined}
          >
            <h3 className="font-display font-bold text-lg text-[#111827] dark:text-white leading-tight select-none tracking-tight">
              Muhammad Haseeb
            </h3>
            <p style={{ fontFamily: 'Sora, sans-serif' }} className="font-bold text-[10px] text-[#1F7A8C] dark:text-cyan-300 uppercase tracking-wider mt-1 select-none">
              Co - Founder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
