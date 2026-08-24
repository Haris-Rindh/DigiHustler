import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isInternal = ['/dashboard', '/ledger', '/roster', '/admin'].some(p => location.pathname.startsWith(p));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  if (isInternal) {
    // Minimal internal navbar — import and render the old internal navbar
    return <InternalNavbar />;
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#071e26]/98 shadow-lg shadow-black/30 border-b border-[#1e4a5d]' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#1a7a8c] flex items-center justify-center shadow">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h8M2 12h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-[#bde0fe] transition-colors">DigiHust</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-[#bde0fe] bg-[#1a7a8c]/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center space-x-3">
          <Link
            to="/contact"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white text-sm font-bold transition-colors shadow-md"
          >
            <span>Get a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0d2833] border-b border-[#1e4a5d] px-6 py-4 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? 'text-[#bde0fe] bg-[#1a7a8c]/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setMobileOpen(false)}
            className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-[#1a7a8c] text-white text-sm font-bold mt-2"
          >
            <span>Get a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </header>
  );
};

// ─── Internal Navbar (lightweight, for /dashboard etc.) ───────────────────────
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, DollarSign, Users, Settings, PlusCircle, Calculator, ChevronDown, UserCheck, Shield } from 'lucide-react';
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
      <nav className="sticky top-0 z-40 bg-[#071e26]/98 border-b border-[#1e4a5d] px-4 lg:px-8 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#1a7a8c] flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-lg text-white">DigiHust</span>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#bde0fe]/15 text-[#bde0fe] border border-[#bde0fe]/30 ml-1">Internal</span>
            </Link>
            <div className="hidden md:flex items-center space-x-1 pl-4 border-l border-[#1e4a5d]">
              {[
                { href: '/dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" />, label: 'Pipeline' },
                { href: '/ledger', icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />, label: 'Ledger' },
                { href: '/roster', icon: <Users className="w-3.5 h-3.5 text-[#bde0fe]" />, label: 'Rosters' },
              ].map(item => (
                <Link key={item.href} to={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname === item.href ? 'bg-[#1a7a8c] text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                  {item.icon}<span>{item.label}</span>
                </Link>
              ))}
              {currentUser.role === 'management' && (
                <Link to="/admin"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname === '/admin' ? 'bg-[#1a7a8c] text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                  <Settings className="w-3.5 h-3.5 text-amber-400" /><span>Admin</span>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsCalcOpen(true)} className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0d2833] border border-[#1e4a5d] hover:border-[#1a7a8c] text-xs font-semibold text-[#bde0fe] transition-colors">
              <Calculator className="w-3.5 h-3.5 text-[#1a7a8c]" /><span>Split Calc</span>
            </button>
            <button onClick={() => setIsLeadOpen(true)} className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#1a7a8c] hover:bg-[#156575] text-xs font-bold text-white shadow transition-colors">
              <PlusCircle className="w-4 h-4" /><span>Submit Lead</span>
            </button>
            <div className="relative">
              <button onClick={() => setShowRoleDropdown(!showRoleDropdown)} className="flex items-center space-x-2 p-1.5 pl-3 rounded-xl bg-[#0d2833] border border-[#1e4a5d] hover:border-[#1a7a8c] transition-colors">
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
                    {users.map(u => (
                      <button key={u.id} onClick={() => { switchRole(u.id); setShowRoleDropdown(false); }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${u.id === currentUser.id ? 'bg-[#1a7a8c]/20 border border-[#1a7a8c]/40' : 'hover:bg-white/5'}`}>
                        <div className="flex items-center space-x-2.5">
                          <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-1">{u.name}{u.id === currentUser.id && <UserCheck className="w-3 h-3 text-[#bde0fe]" />}</p>
                            <p className="text-[10px] text-slate-400">{u.title}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-[#071e26] text-[#bde0fe] border border-[#1e4a5d]">{u.role.replace('_', ' ')}</span>
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
