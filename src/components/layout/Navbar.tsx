import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSelector } from '../ui/LanguageSelector';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isInternal = ['/dashboard', '/ledger', '/roster', '/admin'].some(p => location.pathname.startsWith(p));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  if (isInternal) {
    return <InternalNavbar />;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#071e26]/90 backdrop-blur-md shadow-lg shadow-black/20 border-b border-[#1e4a5d]/80 py-0'
          : 'bg-transparent py-2'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main Navigation">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1a7a8c] to-[#0ea5e9] flex items-center justify-center shadow-md shadow-[#1a7a8c]/20"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h8M2 12h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.div>
          <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-[#bde0fe] transition-colors">
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
                  active ? 'text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-[#1a7a8c]/25 border border-[#1a7a8c]/50 rounded-xl"
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
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white text-sm font-bold shadow-md shadow-[#1a7a8c]/20 transition-colors"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
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
            className="lg:hidden bg-[#0d2833]/98 backdrop-blur-lg border-b border-[#1e4a5d] px-6 py-5 space-y-2 overflow-hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'text-white bg-[#1a7a8c]/30 border border-[#1a7a8c]/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-3 pb-1 px-1 border-t border-[#1e4a5d]/60">
              <span className="text-xs font-bold text-slate-400">Preferences:</span>
              <div className="flex items-center space-x-2">
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </div>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center space-x-2 px-4 py-3.5 rounded-xl bg-[#1a7a8c] text-white text-sm font-bold mt-3 shadow-lg"
            >
              <span>Get a Quote</span>
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
  const { currentUser, users, switchRole } = useApp();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[#071e26]/98 backdrop-blur-md border-b border-[#1e4a5d] px-4 lg:px-8 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#1a7a8c] flex items-center justify-center shadow">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-lg text-white">DigiHust</span>
              <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#bde0fe]/15 text-[#bde0fe] border border-[#bde0fe]/30 ml-1">
                Portal
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-1 pl-4 border-l border-[#1e4a5d]">
              {[
                { href: '/dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" />, label: 'Pipeline' },
                { href: '/ledger', icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />, label: 'Ledger' },
                { href: '/roster', icon: <Users className="w-3.5 h-3.5 text-[#bde0fe]" />, label: 'Rosters' },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    location.pathname === item.href
                      ? 'bg-[#1a7a8c] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
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
                      ? 'bg-[#1a7a8c] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCalcOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0d2833] border border-[#1e4a5d] hover:border-[#1a7a8c] text-xs font-semibold text-[#bde0fe] transition-colors"
            >
              <Calculator className="w-3.5 h-3.5 text-[#1a7a8c]" />
              <span>Split Calc</span>
            </button>
            <button
              onClick={() => setIsLeadOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#1a7a8c] hover:bg-[#156575] text-xs font-bold text-white shadow transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Lead</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2 p-1.5 pl-3 rounded-xl bg-[#0d2833] border border-[#1e4a5d] hover:border-[#1a7a8c] transition-colors"
              >
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-[#1a7a8c]/40" />
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[100px]">{currentUser.title}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0d2833] border border-[#1e4a5d] shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-[#1e4a5d] mb-1">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#bde0fe]">Switch Active Role</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchRole(u.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                          u.id === currentUser.id ? 'bg-[#1a7a8c]/20 border border-[#1a7a8c]/40' : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-1">
                              {u.name}
                              {u.id === currentUser.id && <UserCheck className="w-3 h-3 text-[#bde0fe]" />}
                            </p>
                            <p className="text-[10px] text-slate-400">{u.title}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-[#071e26] text-[#bde0fe] border border-[#1e4a5d]">
                          {u.role.replace('_', ' ')}
                        </span>
                      </button>
                    ))}
                  </div>
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
