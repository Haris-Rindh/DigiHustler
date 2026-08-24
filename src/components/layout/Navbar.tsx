import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

// ─── Public Navbar (Parlo-style) ─────────────────────────────────────────────
export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isInternal = ['/dashboard', '/ledger', '/roster', '/admin'].some(p =>
    location.pathname.startsWith(p)
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (isInternal) return <InternalNavbar />;

  const navLinks = [
    { label: 'Services',     href: '/#services' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Our Work',     href: '/#work' },
    { label: 'Team',         href: '/#team' },
    { label: 'Pricing',      href: '/#pricing' },
    { label: 'FAQs',         href: '/#faqs' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#071e26]/95 backdrop-blur-xl border-b border-[#1e4a5d] shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-8 h-[60px] flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-7 h-7 rounded-lg bg-[#1a7a8c] flex items-center justify-center shadow-sm">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 3.5h12M1 7h8M1 10.5h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-extrabold text-lg tracking-tight text-white group-hover:text-[#bde0fe] transition-colors">
            DigiHust
          </span>
        </Link>

        {/* Desktop nav links — centered */}
        <ul className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-150 font-medium"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right CTAs */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <a
            href="/#contact"
            className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl border border-[#1e4a5d] hover:border-[#1a7a8c]/60 transition-all"
          >
            Contact
          </a>
          {/* Parlo-style animated border button */}
          <a href="/#contact" className="btn-glow">
            <span className="btn-glow-inner">
              Get a Quote
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#071e26]/98 border-b border-[#1e4a5d] px-6 py-5 space-y-1">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-base font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-[#1e4a5d]">
            <a href="/#contact" onClick={() => setMobileOpen(false)} className="btn-glow w-full block text-center">
              <span className="btn-glow-inner justify-center w-full">
                Get a Quote
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

// ─── Internal Navbar (dashboard, ledger, roster, admin) ───────────────────────
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, DollarSign, Users, Settings,
  PlusCircle, Calculator, ChevronDown, UserCheck, Shield,
} from 'lucide-react';
import { PayoutCalculatorModal } from '../dashboard/PayoutCalculatorModal';
import { NewLeadModal } from '../dashboard/NewLeadModal';

const InternalNavbar: React.FC = () => {
  const { currentUser, users, switchRole } = useApp();
  const location = useLocation();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isCalcOpen, setIsCalcOpen]   = useState(false);
  const [isLeadOpen, setIsLeadOpen]   = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[#071e26]/98 border-b border-[#1e4a5d] px-4 lg:px-8 py-3 shadow-md backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1a7a8c] flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-extrabold text-lg text-white">DigiHust</span>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#bde0fe]/15 text-[#bde0fe] border border-[#bde0fe]/30">
                Internal
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1 pl-4 border-l border-[#1e4a5d]">
              {[
                { href: '/dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" />, label: 'Pipeline' },
                { href: '/ledger',    icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />, label: 'Ledger' },
                { href: '/roster',    icon: <Users className="w-3.5 h-3.5 text-[#bde0fe]" />, label: 'Rosters' },
              ].map(item => (
                <Link
                  key={item.href} to={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    location.pathname === item.href
                      ? 'bg-[#1a7a8c] text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}<span>{item.label}</span>
                </Link>
              ))}
              {currentUser.role === 'management' && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    location.pathname === '/admin'
                      ? 'bg-[#1a7a8c] text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" /><span>Admin</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCalcOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d2833] border border-[#1e4a5d] hover:border-[#1a7a8c] text-xs font-semibold text-[#bde0fe] transition-colors"
            >
              <Calculator className="w-3.5 h-3.5 text-[#1a7a8c]" /><span>Split Calc</span>
            </button>
            <button
              onClick={() => setIsLeadOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1a7a8c] hover:bg-[#156575] text-xs font-bold text-white transition-colors"
            >
              <PlusCircle className="w-4 h-4" /><span>Submit Lead</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-[#0d2833] border border-[#1e4a5d] hover:border-[#1a7a8c] transition-colors"
              >
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-[#1a7a8c]/40" />
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-white">{currentUser.name}</div>
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
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => { switchRole(u.id); setShowRoleDropdown(false); }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-[#1a7a8c]/20 border border-[#1a7a8c]/40'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
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
