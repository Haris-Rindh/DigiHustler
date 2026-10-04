import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, X } from 'lucide-react';

const SESSION_DISMISS_KEY = 'digihust_orbit_beacon_dismissed';

export const FloatingCTA: React.FC = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // Visibility states controlled exclusively via IntersectionObserver & route rules
  const [isHeroInView, setIsHeroInView] = useState<boolean>(true);
  const [isCtaSectionInView, setIsCtaSectionInView] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [hasPwaPrompt, setHasPwaPrompt] = useState<boolean>(false);

  // Beacon UI states
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isQuietSession, setIsQuietSession] = useState<boolean>(false);
  const [isNudging, setIsNudging] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isTabHidden, setIsTabHidden] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Magnetic drift offsets (desktop fine pointer only)
  const [magneticOffset, setMagneticOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLButtonElement>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nudgeCountRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Check if current route is excluded from showing the beacon
  const isExcludedRoute =
    location.pathname === '/contact' ||
    location.pathname === '/quote' ||
    location.pathname.startsWith('/portal') ||
    location.pathname.startsWith('/verify') ||
    location.pathname.startsWith('/cert') ||
    [
      '/dashboard',
      '/ledger',
      '/roster',
      '/admin',
      '/404',
      '/500',
      '/403',
      '/401',
      '/maintenance',
      '/offline',
    ].some((p) => location.pathname.startsWith(p));

  // 1. Session Storage Quiet / Dismissal Check
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(SESSION_DISMISS_KEY);
      if (dismissed === 'true') {
        setIsQuietSession(true);
      }
    } catch {
      // Ignore in restricted environments (e.g. private mode)
    }
  }, []);

  // 2. Tab Visibility Listener (pauses animations when tab is backgrounded)
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // 3. Detect collision with PWA Install Prompt or Mobile Menu
  useEffect(() => {
    const checkFloatingCollisions = () => {
      const pwaEl = document.getElementById('pwa-install-prompt');
      setHasPwaPrompt(!!pwaEl);

      const mobileMenuEl = document.getElementById('mobile-nav-menu');
      setIsMobileMenuOpen(!!mobileMenuEl);
    };

    checkFloatingCollisions();
    const observer = new MutationObserver(checkFloatingCollisions);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // 4. IntersectionObserver on Hero and Bottom CTA Section (NO scroll listeners)
  useEffect(() => {
    if (isExcludedRoute) return;

    setIsHeroInView(true);
    setIsCtaSectionInView(false);

    let heroObserver: IntersectionObserver | null = null;
    let ctaObserver: IntersectionObserver | null = null;

    const setupObservers = () => {
      // Find hero element (first section in main, [data-hero], or first section)
      const heroEl = document.querySelector(
        'main > section:first-of-type, [data-hero], section:first-of-type'
      );
      if (heroEl) {
        heroObserver = new IntersectionObserver(
          ([entry]) => {
            setIsHeroInView(entry.isIntersecting);
          },
          { threshold: 0.08 }
        );
        heroObserver.observe(heroEl);
      } else {
        setIsHeroInView(false);
      }

      // Find bottom CTA section ("Have a Project in Mind?", "Multi-Disciplinary Squad", etc.)
      const allSections = document.querySelectorAll('main > section');
      let targetCtaEl: Element | null = null;

      for (let i = allSections.length - 1; i >= 0; i--) {
        const sec = allSections[i];
        const text = sec.textContent?.toLowerCase() || '';
        if (
          text.includes('project in mind') ||
          text.includes('start a proposal') ||
          text.includes('multi-disciplinary squad') ||
          text.includes('combined scope') ||
          text.includes('ready to build') ||
          text.includes('ready to start') ||
          sec.querySelector('a[href*="/contact"]')
        ) {
          targetCtaEl = sec;
          break;
        }
      }

      if (!targetCtaEl && allSections.length > 1) {
        targetCtaEl = allSections[allSections.length - 1];
      }

      if (targetCtaEl) {
        ctaObserver = new IntersectionObserver(
          ([entry]) => {
            setIsCtaSectionInView(entry.isIntersecting);
          },
          { threshold: 0.12 }
        );
        ctaObserver.observe(targetCtaEl);
      }
    };

    const timer = setTimeout(setupObservers, 100);

    return () => {
      clearTimeout(timer);
      if (heroObserver) heroObserver.disconnect();
      if (ctaObserver) ctaObserver.disconnect();
    };
  }, [location.pathname, isExcludedRoute]);

  // Unified analytics dispatch helper
  const fireTrackingEvent = useCallback(
    (eventName: string, data?: Record<string, any>) => {
      if (typeof window === 'undefined') return;
      try {
        if ((window as any).dataLayer && Array.isArray((window as any).dataLayer)) {
          (window as any).dataLayer.push({
            event: eventName,
            page_path: location.pathname,
            timestamp: new Date().toISOString(),
            ...data,
          });
        }
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', eventName, {
            page_path: location.pathname,
            ...data,
          });
        }
        window.dispatchEvent(
          new CustomEvent(eventName, {
            detail: { page_path: location.pathname, ...data },
          })
        );
      } catch {
        // Fail silently
      }
    },
    [location.pathname]
  );

  // Overall beacon visibility: Always remain on top on EVERY section
  const isVisible = !isExcludedRoute && !isMobileMenuOpen;

  // 5. Attention Nudges: ~8s after appearance, wiggle + "Got a project?" tooltip
  // Repeats at most 3 times, at least 25s apart; ceases upon any user interaction
  useEffect(() => {
    if (!isVisible || hasInteracted || isQuietSession || shouldReduceMotion) return;

    let initialTimer: NodeJS.Timeout | null = null;
    let repeatTimer: NodeJS.Timeout | null = null;
    let tooltipTimer: NodeJS.Timeout | null = null;

    const triggerNudge = () => {
      if (document.hidden || hasInteracted || isQuietSession || shouldReduceMotion) return;
      if (nudgeCountRef.current >= 3) return;

      nudgeCountRef.current += 1;
      setIsNudging(true);
      setShowTooltip(true);

      setTimeout(() => setIsNudging(false), 550);

      // Hide tooltip after 3.5s
      tooltipTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 3500);

      // Schedule next nudge if under 3 total
      if (nudgeCountRef.current < 3) {
        repeatTimer = setTimeout(triggerNudge, 25000);
      }
    };

    initialTimer = setTimeout(triggerNudge, 8000);

    return () => {
      if (initialTimer) clearTimeout(initialTimer);
      if (repeatTimer) clearTimeout(repeatTimer);
      if (tooltipTimer) clearTimeout(tooltipTimer);
    };
  }, [isVisible, hasInteracted, isQuietSession, shouldReduceMotion]);

  // 6. Desktop Magnetic Drift (up to 6px within 80px distance)
  useEffect(() => {
    if (shouldReduceMotion || isExpanded || isTabHidden) {
      setMagneticOffset({ x: 0, y: 0 });
      return;
    }

    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!orbRef.current) return;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      rafIdRef.current = requestAnimationFrame(() => {
        if (!orbRef.current) return;
        const rect = orbRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist < 80) {
          const pull = (1 - dist / 80) * 6;
          const angle = Math.atan2(dy, dx);
          setMagneticOffset({
            x: Math.cos(angle) * pull,
            y: Math.sin(angle) * pull,
          });
        } else {
          setMagneticOffset({ x: 0, y: 0 });
        }
      });
    };

    const handleMouseLeaveWindow = () => {
      setMagneticOffset({ x: 0, y: 0 });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [shouldReduceMotion, isExpanded, isTabHidden]);

  // 7. Outside click collapse listener
  useEffect(() => {
    if (!isExpanded) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [isExpanded]);

  // 8. Escape key listener to close card and return focus to orb
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
        orbRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Desktop hover interactions with 150ms leave grace delay
  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      if (!isExpanded) {
        setIsExpanded(true);
        setHasInteracted(true);
        setShowTooltip(false);
        fireTrackingEvent('beacon_open');
      }
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      leaveTimeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 150);
    }
  };

  // Mobile tap or click toggle
  const handleOrbClick = () => {
    setHasInteracted(true);
    setShowTooltip(false);
    setIsExpanded((prev) => {
      const next = !prev;
      if (next) fireTrackingEvent('beacon_open');
      return next;
    });
  };

  // Card close / dismiss action: collapses card and sets quiet session
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsExpanded(false);
    setHasInteracted(true);
    setShowTooltip(false);
    setIsQuietSession(true);
    try {
      sessionStorage.setItem(SESSION_DISMISS_KEY, 'true');
    } catch {
      // Ignore
    }
    fireTrackingEvent('beacon_dismiss');
    orbRef.current?.focus();
  };

  // Primary action button click
  const handlePrimaryClick = () => {
    setHasInteracted(true);
    setIsExpanded(false);
    fireTrackingEvent('beacon_primary_click');
  };

  // Hire a specialist secondary link click
  const handleHireClick = () => {
    setHasInteracted(true);
    setIsExpanded(false);
    fireTrackingEvent('beacon_hire_click');
  };

  // Determine whether continuous CSS animations should be paused
  const isAnimationPaused = isExpanded || isTabHidden || shouldReduceMotion;

  return (
    <>
      {/* Embedded pure CSS keyframe animations for high performance */}
      <style>{`
        @keyframes orbitBeaconRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes orbitBeaconBreath {
          0%, 100% {
            transform: scale(0.96);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.18);
            opacity: 0.7;
          }
        }
        @keyframes orbitLivePing {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          70%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={containerRef}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            transition={{
              duration: shouldReduceMotion ? 0.15 : 0.35,
              ease: [0.16, 1, 0.3, 1], // Springs in from corner
            }}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              bottom: hasPwaPrompt
                ? 'calc(100px + env(safe-area-inset-bottom, 0px))'
                : undefined,
              willChange: isAnimating ? 'transform, opacity' : 'auto',
            }}
            className={`fixed z-[9990] left-4 sm:left-6 origin-bottom-left transition-[bottom] duration-300 ${
              hasPwaPrompt
                ? ''
                : '[bottom:calc(16px+env(safe-area-inset-bottom,0px))] sm:[bottom:calc(24px+env(safe-area-inset-bottom,0px))]'
            }`}
          >
            {/* ── EXPANDED STATE: MORPHED COMPACT CARD ── */}
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="beacon-expanded-card"
                  id="orbit-beacon-card"
                  role="region"
                  aria-label="Start a project proposal dialog"
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 10 }}
                  transition={{ duration: shouldReduceMotion ? 0.15 : 0.26, ease: [0.16, 1, 0.3, 1] }}
                  className="w-[300px] sm:w-[324px] p-5 rounded-3xl bg-[#022B3A]/98 backdrop-blur-2xl border border-cyan-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(34,160,180,0.35)] text-white origin-bottom-left select-none relative overflow-hidden"
                >
                  {/* Subtle Scanline / Tech grid overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,160,180,0.18),transparent_60%)] pointer-events-none" />

                  {/* Header: Live Badge + Close Button */}
                  <div className="relative z-10 flex items-center justify-between pb-1">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                      <span>// PROPOSAL IN 24 HOURS</span>
                    </span>

                    <button
                      type="button"
                      onClick={handleDismiss}
                      aria-label="Close project dialog"
                      className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Headline */}
                  <div className="relative z-10 mt-3 mb-4">
                    <h3 className="font-display font-extrabold text-xl text-white leading-snug">
                      Have a project in mind?
                    </h3>
                    <p className="text-xs text-cyan-100/75 mt-1 leading-relaxed">
                      Connect with our engineering & design squads for a calibrated scope breakdown.
                    </p>
                  </div>

                  {/* Primary CTA Button */}
                  <div className="relative z-10">
                    <Link
                      to="/contact"
                      onClick={handlePrimaryClick}
                      className="w-full py-3 px-4 rounded-xl btn-brand-futuristic text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg transition-all"
                    >
                      <span>START PROJECT PROPOSAL</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Secondary Link: Hire a Specialist */}
                    <Link
                      to="/contact?type=specialist"
                      onClick={handleHireClick}
                      className="mt-3 text-center text-xs font-mono font-semibold text-cyan-300 hover:text-white transition-colors block focus-visible:outline-none focus-visible:underline"
                    >
                      <span>&gt; BROWSE SPECIALIST ROSTER &rarr;</span>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                /* ── COLLAPSED STATE: MODERN FUTURISTIC CYBER CAPSULE ── */
                <motion.div
                  key="beacon-orb-anchor"
                  initial={false}
                  animate={{
                    x: shouldReduceMotion ? 0 : magneticOffset.x,
                    y: shouldReduceMotion ? 0 : magneticOffset.y,
                  }}
                  transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                  className="relative select-none"
                >
                  {/* Attention Nudge Tooltip */}
                  <AnimatePresence>
                    {showTooltip && !isExpanded && !shouldReduceMotion && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute -top-11 left-0 sm:left-2 bg-[#022B3A] border border-cyan-400 text-cyan-200 text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.4)] pointer-events-none z-30 whitespace-nowrap"
                      >
                        <span>[ INITIATE SCOPE ]</span>
                        <div className="absolute -bottom-1 left-5 w-2 h-2 bg-[#022B3A] border-b border-r border-cyan-400 rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Ambient Futuristic Glow Aura */}
                  {!shouldReduceMotion && (
                    <div
                      style={{
                        animation: 'orbitBeaconBreath 3s ease-in-out infinite',
                        animationPlayState: isAnimationPaused ? 'paused' : 'running',
                      }}
                      className="absolute inset-[-4px] md:inset-[-6px] rounded-2xl bg-cyan-500/25 blur-lg pointer-events-none -z-10"
                    />
                  )}

                  {/* Modern Futuristic Cyber Capsule Button */}
                  <motion.button
                    ref={orbRef}
                    type="button"
                    onClick={handleOrbClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOrbClick();
                      }
                    }}
                    animate={{
                      scale: isNudging && !shouldReduceMotion ? [1, 1.05, 0.98, 1.04, 1] : 1,
                    }}
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                    aria-label="Start a project proposal or hire us"
                    aria-expanded={isExpanded}
                    aria-controls="orbit-beacon-card"
                    aria-haspopup="dialog"
                    style={{
                      background: 'linear-gradient(135deg, rgba(2, 43, 58, 0.96) 0%, rgba(7, 53, 71, 0.94) 100%)',
                    }}
                    className="relative px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-cyan-400/40 hover:border-emerald-400/80 backdrop-blur-2xl flex items-center gap-2.5 sm:gap-3 text-white z-20 cursor-pointer shadow-[0_12px_32px_rgba(2,43,58,0.7),0_0_20px_rgba(34,160,180,0.3)] hover:shadow-[0_16px_40px_rgba(2,43,58,0.8),0_0_28px_rgba(52,211,153,0.45)] transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    {/* Animated Cyber Edge Runner */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 group-hover:opacity-100" />
                    </div>

                    {/* Live Telemetry Beacon Dot */}
                    <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34D399]" />
                    </span>

                    {/* High-Tech Monospace Label & Secondary Text */}
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] sm:text-xs font-mono font-black tracking-[0.14em] text-white uppercase group-hover:text-cyan-300 transition-colors">
                        START A PROJECT
                      </span>
                      <span className="hidden sm:block text-[9px] font-mono tracking-wider text-emerald-400/90 font-medium">
                        24H PROPOSAL &bull; SQUAD READY
                      </span>
                    </div>

                    {/* Micro Futuristic Arrow Vector */}
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center group-hover:bg-emerald-400 group-hover:text-[#022B3A] text-cyan-300 transition-all duration-200 shadow-sm ml-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
