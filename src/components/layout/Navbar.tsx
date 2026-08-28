import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSelector } from '../ui/LanguageSelector';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';

import { PortalNavbar } from '../portal/PortalNavbar';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isPortalLogin = location.pathname === '/portal/login';
  const isPortal = location.pathname.startsWith('/portal') || ['/dashboard', '/ledger', '/roster', '/admin'].some(p => location.pathname.startsWith(p));
  const isVerify = location.pathname.startsWith('/verify') || location.pathname.startsWith('/cert');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: t('nav_services'), href: '/services' },
    { label: t('nav_work'), href: '/work' },
    { label: t('nav_how_it_works'), href: '/how-it-works' },
    { label: t('nav_about'), href: '/about' },
    { label: t('nav_team'), href: '/team' },
    { label: t('nav_blog'), href: '/blog' },
    { label: t('nav_contact'), href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  if (isPortalLogin) {
    return null;
  }

  if (isPortal) {
    return <PortalNavbar />;
  }

  if (isVerify) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--bg-page)]/90 backdrop-blur-md shadow-md border-b border-[var(--border-subtle)] py-0'
          : 'bg-transparent py-2'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main Navigation">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#022B3A] via-[#1F7A8C] to-[#E1E5F2] flex items-center justify-center shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h8M2 12h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.div>
          <span className="font-display font-extrabold text-xl tracking-tight text-[var(--text-heading)] group-hover:text-[var(--brand-teal)] transition-colors">
            DigiHust
          </span>
        </Link>

        {/* Desktop Nav with Animated Pill */}
        <div className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 relative">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-2.5 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                  active ? 'text-[var(--brand-teal)] font-bold' : 'text-[var(--text-body)] hover:text-[var(--text-heading)]'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/40 rounded-xl"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* CTA, Language & Theme Controls */}
        <div className="hidden lg:flex items-center space-x-3">
          <LanguageSelector />
          <ThemeToggle />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/contact"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-sm font-bold shadow-md transition-colors"
            >
              <span>{t('btn_get_quote')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl text-[var(--text-heading)] hover:bg-[var(--bg-subtle)] transition-colors"
          aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu with Framer Motion */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-[var(--bg-surface)] backdrop-blur-lg border-b border-[var(--border-subtle)] px-6 py-5 space-y-2 overflow-hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'text-[var(--brand-teal)] font-bold bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/40'
                    : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-3 pb-1 px-1 border-t border-[var(--border-subtle)]">
              <span className="text-xs font-bold text-[var(--text-muted)]">{t('preferences')}</span>
              <div className="flex items-center space-x-2">
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </div>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center space-x-2 px-4 py-3.5 rounded-xl bg-[var(--brand-teal)] text-white text-sm font-bold mt-3 shadow-md"
            >
              <span>{t('btn_get_quote')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

