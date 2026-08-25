import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('digihust_cookie_consent');
    if (!consent) {
      // Delay prompt slightly for better user experience
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('digihust_cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('digihust_cookie_consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-2xl bg-[var(--bg-surface)]/98 backdrop-blur-md border border-[var(--border-subtle)] shadow-2xl text-white text-xs space-y-3"
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-[var(--brand-teal)]/20 border border-[var(--brand-teal)]/40 text-[var(--text-heading)] flex-shrink-0">
            <Cookie className="w-5 h-5 text-[var(--text-heading)]" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[var(--text-heading)]">Privacy & Cookie Preferences</h4>
            <p className="text-[var(--text-body)] leading-relaxed">
              We use minimal essential cookies to analyze site traffic, monitor Core Web Vitals, and preserve your preferences. Learn more in our{' '}
              <Link to="/privacy" className="text-[var(--text-heading)] font-bold underline">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-[var(--border-subtle)]">
          <button
            onClick={handleDecline}
            className="px-3.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-body)] hover:text-white hover:bg-[var(--bg-subtle)] font-semibold transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 rounded-lg bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold transition-colors shadow-sm"
          >
            Accept All
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
