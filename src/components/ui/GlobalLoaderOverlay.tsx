import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { BoxesLoader } from './BoxesLoader';

/**
 * Global Loader Overlay
 * - Initial Page Boot / Refresh: Coordinates seamless dismissal of the static HTML boot splash
 *   (preserving continuous 3D box animation with zero flicker, restart, or theme flashes).
 * - Intra-site Route Navigation: Renders the 3D isometric boxes loader overlay for ~550ms + 250ms fade-out.
 * Respects prefers-reduced-motion.
 */
export const GlobalLoaderOverlay: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const isFirstMount = useRef(true);
  const prevPathname = useRef(location.pathname);

  // Check for reduced motion preference
  const isReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Initial Page Boot / Refresh Coordination
  useEffect(() => {
    const targetDuration = isReducedMotion ? 250 : 1600;
    const startTime = (window as unknown as { __DIGIHUST_BOOT_TIME__?: number }).__DIGIHUST_BOOT_TIME__ || Date.now();
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, targetDuration - elapsed);

    const timer = setTimeout(() => {
      const dismiss = (window as unknown as { __dismissBootSplash?: () => void }).__dismissBootSplash;
      if (typeof dismiss === 'function') {
        dismiss();
      }
    }, remaining);

    return () => clearTimeout(timer);
  }, [isReducedMotion]);

  // 2. Intra-site Route Navigation Timing
  useEffect(() => {
    // Skip on first mount (handled seamlessly by the boot splash)
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevPathname.current = location.pathname;
      return;
    }

    // Only trigger when pathname actually changes
    if (prevPathname.current === location.pathname) return;
    prevPathname.current = location.pathname;

    const navDuration = isReducedMotion ? 180 : 550;
    const fadeDuration = isReducedMotion ? 120 : 250;

    setIsVisible(true);
    setIsFadingOut(false);

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setIsFadingOut(false);
      }, fadeDuration);
      return () => clearTimeout(hideTimer);
    }, navDuration);

    return () => clearTimeout(timer);
  }, [location.pathname, isReducedMotion]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-label="Loading DigiHust"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[var(--bg-page)] transition-opacity duration-300 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      <BoxesLoader
        size={48}
        showBrandText
        showProgress
        subtitle="Navigating"
      />
      <span className="sr-only">Loading DigiHust...</span>
    </div>
  );
};
