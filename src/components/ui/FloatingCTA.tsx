import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, X } from 'lucide-react';

const DISMISS_STORAGE_KEY = 'digihust_floating_cta_dismissed';
const DISMISS_DURATION_MS = 60000; // 60 seconds

export const FloatingCTA: React.FC = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const [isHeroInView, setIsHeroInView] = useState<boolean>(true);
  const [isCtaSectionInView, setIsCtaSectionInView] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isNudging, setIsNudging] = useState<boolean>(false);
  const [hasPwaPrompt, setHasPwaPrompt] = useState<boolean>(false);

  // Check if current route is excluded from showing the floating CTA
  const isExcludedRoute = 
    location.pathname === '/contact' ||
    location.pathname.startsWith('/portal') ||
    location.pathname.startsWith('/verify') ||
    location.pathname.startsWith('/cert') ||
    ['/dashboard', '/ledger', '/roster', '/admin', '/404', '/500', '/403', '/401', '/maintenance', '/offline'].some((p) =>
      location.pathname.startsWith(p)
    );

  // 1. Session Storage Dismiss Check & Auto-restore timer
  useEffect(() => {
    try {
      const dismissedTimestamp = sessionStorage.getItem(DISMISS_STORAGE_KEY);
      if (dismissedTimestamp) {
        const elapsed = Date.now() - parseInt(dismissedTimestamp, 10);
        if (elapsed < DISMISS_DURATION_MS) {
          setIsDismissed(true);
          const remaining = DISMISS_DURATION_MS - elapsed;
          const restoreTimer = setTimeout(() => {
            setIsDismissed(false);
            try {
              sessionStorage.removeItem(DISMISS_STORAGE_KEY);
            } catch {
              // ignore
            }
          }, remaining);
          return () => clearTimeout(restoreTimer);
        } else {
          sessionStorage.removeItem(DISMISS_STORAGE_KEY);
        }
      }
    } catch {
      // In case sessionStorage is restricted (e.g. private window)
    }
  }, []);

  // 2. Detect collision with PWA Install Prompt if active at bottom-left
  useEffect(() => {
    const checkPwaPrompt = () => {
      const el = document.getElementById('pwa-install-prompt');
      setHasPwaPrompt(!!el);
    };
    checkPwaPrompt();
    const interval = setInterval(checkPwaPrompt, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. IntersectionObserver on Hero and Bottom CTA Sections
  useEffect(() => {
    if (isExcludedRoute) return;

    // Reset visibility state on route change
    setIsHeroInView(true);
    setIsCtaSectionInView(false);

    let heroObserver: IntersectionObserver | null = null;
    let ctaObserver: IntersectionObserver | null = null;

    const setupObservers = () => {
      // Find the hero element (first section in main, or [data-hero], or first section on page)
      const heroEl = document.querySelector('main > section:first-of-type, [data-hero], section:first-of-type');
      if (heroEl) {
        heroObserver = new IntersectionObserver(
          ([entry]) => {
            setIsHeroInView(entry.isIntersecting);
          },
          { threshold: 0.05 }
        );
        heroObserver.observe(heroEl);
      } else {
        // If no hero section detected, allow CTA to display
        setIsHeroInView(false);
      }

      // Find the bottom CTA section ("Have a Project in Mind?", "Ready to Start", or last section of main)
      const allSections = document.querySelectorAll('main > section');
      let targetCtaEl: Element | null = null;

      for (let i = allSections.length - 1; i >= 0; i--) {
        const sec = allSections[i];
        const text = sec.textContent?.toLowerCase() || '';
        if (
          text.includes('project in mind') ||
          text.includes('start a proposal') ||
          text.includes('build your success story') ||
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
          { threshold: 0.1 }
        );
        ctaObserver.observe(targetCtaEl);
      }
    };

    // Give DOM a frame to settle after route change
    const timeout = setTimeout(setupObservers, 100);

    return () => {
      clearTimeout(timeout);
      if (heroObserver) heroObserver.disconnect();
      if (ctaObserver) ctaObserver.disconnect();
    };
  }, [location.pathname, isExcludedRoute]);

  // 4. Attention Nudge Timer (Tiny wiggle after 8s, repeats every 22s until user interacts)
  useEffect(() => {
    if (isExcludedRoute || hasInteracted || shouldReduceMotion) return;

    let initialTimer: NodeJS.Timeout | null = null;
    let nudgeInterval: NodeJS.Timeout | null = null;

    const triggerNudge = () => {
      if (document.hidden || hasInteracted || shouldReduceMotion) return;
      setIsNudging(true);
      setTimeout(() => setIsNudging(false), 600);
    };

    const startTimers = () => {
      initialTimer = setTimeout(() => {
        triggerNudge();
        nudgeInterval = setInterval(triggerNudge, 22000);
      }, 8000);
    };

    startTimers();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (initialTimer) clearTimeout(initialTimer);
        if (nudgeInterval) clearInterval(nudgeInterval);
      } else if (!hasInteracted && !shouldReduceMotion) {
        startTimers();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (initialTimer) clearTimeout(initialTimer);
      if (nudgeInterval) clearInterval(nudgeInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isExcludedRoute, hasInteracted, shouldReduceMotion]);

  // Handle CTA Click & fire analytics event
  const handleCtaClick = () => {
    setHasInteracted(true);
    if (typeof window !== 'undefined') {
      try {
        if ((window as any).dataLayer && Array.isArray((window as any).dataLayer)) {
          (window as any).dataLayer.push({
            event: 'floating_cta_click',
            page_path: location.pathname,
            timestamp: new Date().toISOString(),
          });
        }
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'floating_cta_click', {
            page_path: location.pathname,
          });
        }
        window.dispatchEvent(
          new CustomEvent('floating_cta_click', {
            detail: { page_path: location.pathname },
          })
        );
      } catch {
        // Safe failover
      }
    }
  };

  // Handle Dismiss action
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDismissed(true);
    setHasInteracted(true);
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString());
    } catch {
      // Safe failover
    }

    // Auto re-show after 60 seconds in the same session
    setTimeout(() => {
      setIsDismissed(false);
      try {
        sessionStorage.removeItem(DISMISS_STORAGE_KEY);
      } catch {
        // Safe failover
      }
    }, DISMISS_DURATION_MS);
  };

  // Determine visibility:
  // Must NOT be an excluded route, NOT dismissed, NOT while hero is in view, and NOT while bottom CTA is in view
  const isVisible = !isExcludedRoute && !isDismissed && !isHeroInView && !isCtaSectionInView;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -24, scale: 0.95 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
            y: isNudging && !shouldReduceMotion ? [0, -4, 0, -4, 0] : 0,
          }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -24, scale: 0.95 }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.4,
            ease: [0.16, 1, 0.3, 1], // 400ms ease-out on entrance
          }}
          whileHover={shouldReduceMotion ? {} : { y: -2 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
          onMouseEnter={() => setHasInteracted(true)}
          onFocus={() => setHasInteracted(true)}
          style={{
            bottom: hasPwaPrompt
              ? 'calc(100px + env(safe-area-inset-bottom, 0px))'
              : undefined,
          }}
          className={`fixed z-35 left-4 sm:left-6 transition-all duration-300 ${
            hasPwaPrompt
              ? ''
              : '[bottom:calc(16px+env(safe-area-inset-bottom,0px))] sm:[bottom:calc(24px+env(safe-area-inset-bottom,0px))]'
          }`}
        >
          <div className="relative group">
            {/* Subtle Idle Pulse Halo (every 5.5s) */}
            {!shouldReduceMotion && (
              <motion.div
                animate={{
                  scale: [1, 1.35, 1.35, 1],
                  opacity: [0.45, 0, 0, 0],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                  times: [0, 0.25, 0.95, 1],
                }}
                className="absolute inset-0 rounded-full bg-[var(--brand-teal)]/40 pointer-events-none -z-10"
              />
            )}

            {/* Pill Container */}
            <div className="inline-flex items-center pl-3.5 pr-2 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#022B3A] via-[#1F7A8C] to-[#1F7A8C] text-white shadow-lg shadow-[#1F7A8C]/25 border border-white/20 hover:border-white/40 hover:shadow-xl hover:shadow-[#1F7A8C]/40 transition-all duration-200 ease-out min-h-[44px] backdrop-blur-md">
              {/* Primary Link Button */}
              <Link
                to="/contact"
                onClick={handleCtaClick}
                aria-label="Start a project with DigiHust"
                className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full pr-1.5"
              >
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-xs sm:text-sm tracking-wide text-white leading-tight flex items-center gap-1.5 whitespace-nowrap">
                    <span>Start a Project</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </span>
                  <span className="hidden sm:block text-[11px] font-medium text-[#E1E5F2] max-h-0 opacity-0 group-hover:max-h-5 group-hover:opacity-100 group-focus-within:max-h-5 group-focus-within:opacity-100 transition-all duration-200 ease-out overflow-hidden whitespace-nowrap">
                    Free proposal in 24 hours
                  </span>
                </div>
              </Link>

              {/* Small Dismiss 'x' Button */}
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss"
                className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white flex-shrink-0 cursor-pointer ml-1"
                title="Dismiss for 60 seconds"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
