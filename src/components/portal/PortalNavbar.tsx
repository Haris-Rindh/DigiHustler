import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, LayoutDashboard, Briefcase, Users, Award, DollarSign, Bell, Settings, 
  LogOut, ChevronDown, Sparkles, Menu, X, Key, Check, AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSelector } from '../ui/LanguageSelector';
import { UserRoleTier } from '../../types';
import { PERMISSIONS } from '../../lib/permissions';

export const PortalNavbar: React.FC = () => {
  const { currentUser, currentTier, logout, changePassword } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [pwdFeedback, setPwdFeedback] = useState<{ success?: boolean; error?: string } | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/portal/login');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = changePassword(newPassword);
    setPwdFeedback(res);
    if (res.success) {
      setTimeout(() => {
        setChangePwdOpen(false);
        setNewPassword('');
        setPwdFeedback(null);
      }, 1200);
    }
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
    { label: 'Site CMS', href: '/portal/cms', icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />, show: PERMISSIONS.canEditWebsiteContent(currentTier, currentUser) },
    { label: 'Split Settings', href: '/portal/settings', icon: <Settings className="w-3.5 h-3.5 text-amber-400" />, show: currentTier === 'ceo' },
  ].filter(i => i.show);

  const getTierBadge = (tier: UserRoleTier) => {
    switch (tier) {
      case 'ceo':
        return { label: 'CEO MASTER', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
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

        {/* Right Side: Language, Theme & User Profile */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <LanguageSelector />
          <ThemeToggle />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
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

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3">
                
                {/* Active Member Bio Header */}
                <div className="p-3 bg-[var(--bg-page)] rounded-2xl border border-[var(--border-subtle)]">
                  <div className="flex items-center space-x-3">
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-[var(--text-heading)]">{currentUser.name}</h4>
                      <p className="text-[11px] font-mono text-[var(--brand-teal)]">{currentUser.memberId}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{currentUser.title}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Controls */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setChangePwdOpen(true);
                    }}
                    className="w-full flex items-center space-x-2 p-2.5 rounded-xl text-xs font-semibold text-[var(--text-body)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-heading)] transition-all cursor-pointer"
                  >
                    <Key className="w-4 h-4 text-[var(--brand-teal)]" />
                    <span>Change Password</span>
                  </button>

                  <a
                    href="/"
                    className="w-full flex items-center space-x-2 p-2.5 rounded-xl text-xs font-semibold text-[var(--text-body)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-heading)] transition-all"
                  >
                    <Shield className="w-4 h-4 text-[var(--brand-teal)]" />
                    <span>Public Website</span>
                  </a>
                </div>

                {/* Sign Out Button */}
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all cursor-pointer"
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

      {/* Change Password Modal */}
      {changePwdOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)] mb-1">
              Update Account Password
            </h3>
            <p className="text-xs text-[var(--text-body)] mb-4">
              Enter a new secure password (minimum 6 characters) for <span className="font-mono text-[var(--brand-teal)]">{currentUser.memberId}</span>.
            </p>

            {pwdFeedback && (
              <div className={`mb-4 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                pwdFeedback.success
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}>
                {pwdFeedback.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{pwdFeedback.success ? 'Password successfully updated!' : pwdFeedback.error}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setChangePwdOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};
