import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, LayoutDashboard, Briefcase, Users, Award, DollarSign, Bell, Settings, 
  LogOut, ChevronDown, Sparkles, Check, Menu, X, Layout, Lock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSelector } from '../ui/LanguageSelector';
import { UserRoleTier } from '../../types';

export const PortalNavbar: React.FC = () => {
  const { currentUser, currentTier, switchTier, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/portal/login');
  };

  const navItems = [
    { label: 'Overview', href: '/portal/dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" />, show: true },
    { label: 'Assignments', href: '/portal/assignments', icon: <Briefcase className="w-3.5 h-3.5" />, show: true },
    { 
      label: currentTier === 'group_leader' ? 'Squad Roster' : 'People Directory', 
      href: '/portal/roster', 
      icon: <Users className="w-3.5 h-3.5" />, 
      show: currentTier !== 'member' 
    },
    { label: 'Announcements', href: '/portal/announcements', icon: <Bell className="w-3.5 h-3.5" />, show: true },
    { label: 'Certificates', href: '/portal/certificates', icon: <Award className="w-3.5 h-3.5" />, show: currentTier === 'ceo' || currentTier === 'manager' },
    { label: 'Payout Ledger', href: '/portal/ledger', icon: <DollarSign className="w-3.5 h-3.5" />, show: true },
    { label: 'Site CMS', href: '/portal/cms', icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />, show: currentTier === 'ceo' || currentTier === 'manager' },
    { label: 'Split Settings', href: '/portal/settings', icon: <Settings className="w-3.5 h-3.5 text-amber-400" />, show: currentTier === 'ceo' },
  ].filter(i => i.show);

  const getTierBadge = (tier: UserRoleTier) => {
    switch (tier) {
      case 'ceo':
        return { label: 'CEO TIER', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
      case 'manager':
        return { label: 'MANAGER TIER', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
      case 'group_leader':
        return { label: 'SQUAD LEAD TIER', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' };
      case 'member':
        return { label: 'SPECIALIST TIER', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    }
  };

  const badge = getTierBadge(currentTier);

  return (
    <nav className="sticky top-0 z-40 bg-[var(--bg-surface)] backdrop-blur-md border-b border-[var(--border-subtle)] px-4 lg:px-8 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Side: Brand Logo + Portal Indicator + Tier Navigation */}
        <div className="flex items-center space-x-6">
          <Link to="/portal/dashboard" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#022B3A] via-[#1F7A8C] to-[#E1E5F2] flex items-center justify-center shadow-md">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-base text-[var(--text-heading)]">DigiHust</span>
              <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border ${badge.color}`}>
                {badge.label}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center space-x-1 pl-3 border-l border-[var(--border-subtle)]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  location.pathname === item.href
                    ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                    : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Language, Theme, Role Switcher & User Profile */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <LanguageSelector />
          <ThemeToggle />

          {/* User Profile & Demo Tier Switcher Drawer */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-2 sm:space-x-2.5 p-1.5 pl-2 sm:pl-3 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] transition-all cursor-pointer shadow-sm"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-[var(--brand-teal)]/30"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-[var(--text-heading)] flex items-center gap-1">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-mono text-[var(--brand-teal)]">{currentUser.memberId}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                
                {/* Active Member Bio Header */}
                <div className="p-3 bg-[var(--bg-page)] rounded-2xl border border-[var(--border-subtle)] mb-2">
                  <div className="flex items-center space-x-3">
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-[var(--text-heading)]">{currentUser.name}</h4>
                      <p className="text-[11px] font-mono text-[var(--brand-teal)]">{currentUser.memberId}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{currentUser.title}</p>
                    </div>
                  </div>
                </div>

                {/* Tier Switcher for Demo Evaluation */}
                <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                  Switch Active Access Tier (Demo Preview)
                </div>
                <div className="space-y-1">
                  {[
                    { tier: 'ceo' as UserRoleTier, label: 'CEO / Founder', name: 'Haris Asad', id: 'DGH2400001' },
                    { tier: 'manager' as UserRoleTier, label: 'Operations Manager', name: 'Sarah Tariq', id: 'DGH2500002' },
                    { tier: 'group_leader' as UserRoleTier, label: 'Tech Squad Leader', name: 'Zubair Ahmed', id: 'DGH2500003' },
                    { tier: 'member' as UserRoleTier, label: 'Member Specialist', name: 'Bilal Farooq', id: 'DGH2600101' },
                  ].map((item) => (
                    <button
                      key={item.tier}
                      onClick={() => {
                        switchTier(item.tier);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        currentTier === item.tier
                          ? 'bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/40 font-bold'
                          : 'hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      <div>
                        <p className="text-xs text-[var(--text-heading)]">{item.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{item.label} · <span className="font-mono">{item.id}</span></p>
                      </div>
                      {currentTier === item.tier && <Check className="w-4 h-4 text-[var(--brand-teal)]" />}
                    </button>
                  ))}
                </div>

                {/* Actions Footer */}
                <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between px-1">
                  <a
                    href="/"
                    className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--brand-teal)]"
                  >
                    Public Website
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-[var(--text-heading)] hover:bg-[var(--bg-subtle)] transition-colors"
            aria-label="Toggle Portal Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Portal Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden pt-3 pb-2 border-t border-[var(--border-subtle)] mt-2.5 space-y-1 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                location.pathname === item.href
                  ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                  : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
