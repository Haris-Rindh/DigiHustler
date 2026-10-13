import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BeaconVisual } from './BeaconVisual';

export const FloatingCTA: React.FC = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // Visibility states controlled exclusively via IntersectionObserver & route rules
  const [isHeroInView, setIsHeroInView] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [hasPwaPrompt, setHasPwaPrompt] = useState<boolean>(false);
  const [footerLift, setFooterLift] = useState<number>(0);

  // Animation pause states
  const [isTabHidden, setIsTabHidden] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isOffscreen, setIsOffscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

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

  // 1. Tab Visibility Listener (pauses animations when tab is backgrounded)
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // 2. Detect collision with PWA Install Prompt or Mobile Menu
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

  // 3. Observers for Hero and Footer (NO scroll listeners)
  useEffect(() => {
    if (isExcludedRoute) return;

    setIsHeroInView(true);
    setFooterLift(0);

    let heroObserver: IntersectionObserver | null = null;
    let footerObserver: IntersectionObserver | null = null;

    const setupObservers = () => {
      // Find hero element via explicit [data-hero] attribute
      const heroEl = document.querySelector('[data-hero]');
      if (heroEl) {
        heroObserver = new IntersectionObserver(
          ([entry]) => {
            setIsHeroInView(entry.isIntersecting);
          },
          { threshold: 0.05 }
        );
        heroObserver.observe(heroEl);
      } else {
        // Page without hero shows beacon from the start
        setIsHeroInView(false);
      }

      // Observe footer to lift beacon so it never overlaps
      const footerEl = document.querySelector('footer');
      if (footerEl) {
        const thresholds = Array.from({ length: 51 }, (_, i) => i * 0.02);
        footerObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setFooterLift(entry.intersectionRect.height + 16);
            } else {
              setFooterLift(0);
            }
          },
          { threshold: thresholds }
        );
        footerObserver.observe(footerEl);
      }
    };

    const timer = setTimeout(setupObservers, 80);

    return () => {
      clearTimeout(timer);
      if (heroObserver) heroObserver.disconnect();
      if (footerObserver) footerObserver.disconnect();
    };
  }, [location.pathname, isExcludedRoute]);

  // 4. Liveness / Offscreen observer on the beacon itself
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOffscreen(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Analytics dispatch helper
  const fireTrackingEvent = useCallback(
    (eventName: string) => {
      if (typeof window === 'undefined') return;
      try {
        if ((window as any).dataLayer && Array.isArray((window as any).dataLayer)) {
          (window as any).dataLayer.push({
            event: eventName,
            page_path: location.pathname,
            timestamp: new Date().toISOString(),
          });
        }
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', eventName, {
            page_path: location.pathname,
          });
        }
      } catch {
        // Fail silently
      }
    },
    [location.pathname]
  );

  // Overall beacon visibility: visible below hero and above footer
  const isVisible = !isHeroInView && !isExcludedRoute && !isMobileMenuOpen;
  const isAnimationPaused = isHovered || isTabHidden || shouldReduceMotion || isOffscreen;

  return (
    <>
      <style>{`
        @keyframes beaconSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={containerRef}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            transition={{
              duration: shouldReduceMotion ? 0.15 : 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              bottom:
                footerLift > 0
                  ? `${footerLift}px`
                  : hasPwaPrompt
                  ? 'calc(100px + env(safe-area-inset-bottom, 0px))'
                  : undefined,
              willChange: 'transform, opacity',
            }}
            className={`fixed z-[9990] right-4 sm:right-6 select-none transition-[bottom] duration-150 ${
              footerLift > 0
                ? ''
                : hasPwaPrompt
                ? ''
                : '[bottom:calc(16px+env(safe-area-inset-bottom,0px))] sm:[bottom:calc(24px+env(safe-area-inset-bottom,0px))]'
            }`}
          >
            <Link
              to="/contact"
              onClick={() => fireTrackingEvent('floating_beacon_click')}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label="Start a project proposal"
              title="Start a project proposal"
              className="group block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A8C] focus-visible:ring-offset-2"
            >
              <div className="relative w-[76px] h-[76px] rounded-full bg-[var(--bg-surface)] border border-[#1F7A8C]/35 hover:border-[#1F7A8C] shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer">
                <BeaconVisual isPaused={isAnimationPaused} />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
