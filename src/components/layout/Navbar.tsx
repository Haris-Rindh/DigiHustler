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
        <div className="hidden lg:flex items-center space-x-1 relative">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${
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

// ─── Internal Navbar (Client Portal) ─────────────────────────────────────────
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, DollarSign, Users, Settings, PlusCircle, Calculator, ChevronDown, UserCheck } from 'lucide-react';
import { PayoutCalculatorModal } from '../dashboard/PayoutCalculatorModal';
import { NewLeadModal } from '../dashboard/NewLeadModal';

const InternalNavbar: React.FC = () => {
  const { currentUser, logout } = useApp();
  const { t } = useLanguage();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[var(--bg-surface)] backdrop-blur-md border-b border-[var(--border-subtle)] px-4 lg:px-8 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--brand-teal)] flex items-center justify-center shadow">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-lg text-[var(--text-heading)]">DigiHust</span>
              <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)] ml-1">
                {t('portal_text')}
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-1 pl-4 border-l border-[var(--border-subtle)]">
              {[
                { href: '/dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" />, label: 'Pipeline' },
                { href: '/ledger', icon: <DollarSign className="w-3.5 h-3.5 text-[var(--brand-teal)]" />, label: 'Ledger' },
                { href: '/roster', icon: <Users className="w-3.5 h-3.5" />, label: 'Rosters' },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    location.pathname === item.href
                      ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                      : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              {currentUser.role === 'management' && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    location.pathname === '/admin'
                      ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                      : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 text-[var(--color-status-warning)]" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <ThemeToggle />
            <button
              onClick={() => setIsCalcOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-xs font-semibold text-[var(--text-heading)] transition-colors cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
              <span>Split Calc</span>
            </button>
            <button
              onClick={() => setIsLeadOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-xs font-bold text-white shadow transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Lead</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-1.5 pl-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] transition-colors cursor-pointer"
              >
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-[var(--brand-teal)]/40" />
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-[var(--text-heading)] flex items-center gap-1">{currentUser.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)] truncate max-w-[100px]">{currentUser.memberId || currentUser.title}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-2 z-50">
                  <div className="p-2 border-b border-[var(--border-subtle)] mb-1">
                    <p className="text-xs font-bold text-[var(--text-heading)]">{currentUser.name}</p>
                    <p className="text-[10px] font-mono text-[var(--brand-teal)]">{currentUser.memberId}</p>
                  </div>
                  <Link
                    to="/portal/dashboard"
                    className="block w-full px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]"
                  >
                    Portal Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {isCalcOpen && <PayoutCalculatorModal onClose={() => setIsCalcOpen(false)} />}
      {isLeadOpen && <NewLeadModal onClose={() => setIsLeadOpen(false)} />}
    </>
  );
};
