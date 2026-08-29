import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, LayoutDashboard, Briefcase, Users, Award, DollarSign, Bell, Settings, 
  LogOut, ChevronDown, Sparkles, Menu, X, Key, Check, AlertCircle,
  Layers, ExternalLink, Eye, EyeOff, User, Upload, Camera, RefreshCw, Trash2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSelector } from '../ui/LanguageSelector';
import { UserRoleTier } from '../../types';
import { PERMISSIONS } from '../../lib/permissions';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  show: boolean;
}

export const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
  'https://api.dicebear.com/7.x/bottts/svg?seed=DigiTech',
  'https://api.dicebear.com/7.x/bottts/svg?seed=DigiHustler',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Haris',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
];

export const PortalNavbar: React.FC = () => {
  const { currentUser, currentTier, logout, changePassword, updateUserProfile, showToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Password change state
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [pwdFeedback, setPwdFeedback] = useState<{ success?: boolean; error?: string } | null>(null);

  // Profile & Avatar edit state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileTitle, setProfileTitle] = useState(currentUser.title);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '');
  const [profileBio, setProfileBio] = useState(currentUser.bio || '');

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setShowUserDropdown(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(target)) {
        setShowMoreDropdown(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserDropdown(false);
        setShowMoreDropdown(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close mobile menu & dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowMoreDropdown(false);
    setShowUserDropdown(false);
  }, [location.pathname]);

  // Lock body scroll when modal window is open to avoid page layout disturbances
  useEffect(() => {
    if (editProfileOpen || changePwdOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editProfileOpen, changePwdOpen]);

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

  const canAccessCms = PERMISSIONS.canEditWebsiteContent(currentTier, currentUser);

  // Core Primary Items (Always visible directly in desktop bar)
  const primaryNavItems: NavItem[] = [
    { 
      label: 'Overview', 
      href: '/portal/dashboard', 
      icon: <LayoutDashboard className="w-3.5 h-3.5" />, 
      show: true 
    },
    { 
      label: 'Assignments', 
      href: '/portal/assignments', 
      icon: <Briefcase className="w-3.5 h-3.5" />, 
      show: true 
    },
    { 
      label: currentTier === 'group_leader' ? 'Squad Roster' : 'People Directory', 
      href: '/portal/roster', 
      icon: <Users className="w-3.5 h-3.5" />, 
      show: currentTier !== 'member' 
    },
    { 
      label: 'Announcements', 
      href: '/portal/announcements', 
      icon: <Bell className="w-3.5 h-3.5" />, 
      show: true 
    },
    { 
      label: 'Site CMS', 
      href: '/portal/cms', 
      icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />, 
      show: canAccessCms 
    },
  ].filter(i => i.show);

  // Secondary Items (Compressed into the "More" dropdown on desktop)
  const secondaryNavItems: NavItem[] = [
    { 
      label: 'Payout Ledger', 
      href: '/portal/ledger', 
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />, 
      description: 'Disbursements & financial audit records',
      show: true 
    },
    { 
      label: 'Certificates', 
      href: '/portal/certificates', 
      icon: <Award className="w-4 h-4 text-purple-400" />, 
      description: 'Issue credentials & customize PDF templates',
      show: currentTier === 'ceo' || currentTier === 'manager' 
    },
    { 
      label: 'Site CMS', 
      href: '/portal/cms', 
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />, 
      description: 'Public page copywriting & SEO manager',
      show: canAccessCms 
    },
    { 
      label: 'Split Settings', 
      href: '/portal/settings', 
      icon: <Settings className="w-4 h-4 text-amber-400" />, 
      description: 'Tier commission & squad split controls',
      show: currentTier === 'ceo' 
    },
  ].filter(i => i.show);

  // Check if any secondary link is currently active
  const activeSecondaryItem = secondaryNavItems.find(item => location.pathname === item.href);
  const isSecondaryActive = !!activeSecondaryItem;

  const getTierBadge = (tier: UserRoleTier) => {
    switch (tier) {
      case 'ceo':
        return { label: 'CEO MASTER', shortLabel: 'CEO', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
      case 'manager':
        return { label: 'MANAGER TIER', shortLabel: 'MGR', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
      case 'group_leader':
        return { label: 'SQUAD LEAD', shortLabel: 'LEAD', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' };
      case 'member':
        return { label: 'SPECIALIST', shortLabel: 'SPEC', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    }
  };

  const badge = getTierBadge(currentTier);

  return (
    <nav className="sticky top-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] px-3 sm:px-4 lg:px-8 py-2 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Side: Brand Logo + Tier Indicator + Compressed Nav Bar */}
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-5">
          {/* Logo & Tier */}
          <Link to="/portal/dashboard" className="flex items-center space-x-2 shrink-0 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#022B3A] via-[#1F7A8C] to-[#E1E5F2] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-sm sm:text-base text-[var(--text-heading)]">DigiHust</span>
              <span className={`text-[8px] sm:text-[9px] uppercase font-black px-1.5 sm:px-2 py-0.5 rounded-full border ${badge.color}`}>
                <span className="hidden sm:inline">{badge.label}</span>
                <span className="sm:hidden">{badge.shortLabel}</span>
              </span>
            </div>
          </Link>

          {/* Compressed Desktop Nav Tabs */}
          <div className="hidden md:flex items-center space-x-1 pl-2.5 lg:pl-3 border-l border-[var(--border-subtle)]">
            {primaryNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--brand-teal)] text-white shadow-sm font-bold'
                      : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* "More" Management Dropdown (if there are secondary items) */}
            {secondaryNavItems.length > 0 && (
              <div className="relative" ref={moreDropdownRef}>
                <button
                  onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                  aria-expanded={showMoreDropdown}
                  className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSecondaryActive
                      ? 'bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] border border-[var(--brand-teal)]/40 font-bold'
                      : showMoreDropdown
                      ? 'bg-[var(--bg-subtle)] text-[var(--text-heading)]'
                      : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isSecondaryActive ? activeSecondaryItem?.label : 'More'}</span>
                  <ChevronDown className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 ${showMoreDropdown ? 'rotate-180' : ''}`} />
                  {isSecondaryActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-teal)] animate-pulse" />
                  )}
                </button>

                {/* More Dropdown Menu */}
                {showMoreDropdown && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                    <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] mb-1 flex items-center justify-between">
                      <span>Management & Tools</span>
                      <span className="font-mono text-[9px] text-[var(--brand-teal)]">{secondaryNavItems.length} modules</span>
                    </div>

                    {secondaryNavItems.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setShowMoreDropdown(false)}
                          className={`flex items-start space-x-2.5 p-2 rounded-xl text-xs transition-all ${
                            isActive
                              ? 'bg-[var(--brand-teal)] text-white shadow-sm font-bold'
                              : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                          }`}
                        >
                          <div className={`mt-0.5 shrink-0 ${isActive ? 'text-white' : ''}`}>
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold truncate">{item.label}</div>
                            {item.description && (
                              <div className={`text-[10px] truncate ${isActive ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                                {item.description}
                              </div>
                            )}
                          </div>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white self-center shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Language, Theme & User Profile */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          <div className="hidden sm:flex items-center space-x-1.5">
            <LanguageSelector />
            <ThemeToggle />
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              aria-expanded={showUserDropdown}
              className="flex items-center space-x-2 p-1 sm:p-1.5 pl-1.5 sm:pl-2.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] transition-all cursor-pointer shadow-sm"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-2 ring-[var(--brand-teal)]/30 shrink-0"
              />
              <div className="hidden xl:block text-left max-w-[120px]">
                <div className="text-xs font-bold text-[var(--text-heading)] truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-mono text-[var(--brand-teal)] truncate">
                  {currentUser.memberId}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Content */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3">
                
                {/* Active Member Bio Header */}
                <div className="p-3 bg-[var(--bg-page)] rounded-2xl border border-[var(--border-subtle)]">
                  <div className="flex items-center space-x-3">
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-[var(--brand-teal)]" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[var(--text-heading)] truncate">{currentUser.name}</h4>
                      <p className="text-[11px] font-mono text-[var(--brand-teal)] truncate">{currentUser.memberId}</p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">{currentUser.title}</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Language & Theme toggles inside dropdown for smaller screens */}
                <div className="sm:hidden flex items-center justify-between p-2 bg-[var(--bg-subtle)] rounded-xl">
                  <span className="text-[11px] font-semibold text-[var(--text-muted)]">Preferences:</span>
                  <div className="flex items-center space-x-2">
                    <LanguageSelector />
                    <ThemeToggle />
                  </div>
                </div>

                {/* Profile Controls */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setProfileName(currentUser.name);
                      setProfileTitle(currentUser.title);
                      setProfileAvatarUrl(currentUser.avatarUrl || '');
                      setProfilePhone(currentUser.phone || '');
                      setProfileBio(currentUser.bio || '');
                      setShowUserDropdown(false);
                      setEditProfileOpen(true);
                    }}
                    className="w-full flex items-center space-x-2 p-2.5 rounded-xl text-xs font-semibold text-[var(--text-body)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-heading)] transition-all cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[var(--brand-teal)]" />
                    <span>Edit My Profile & Avatar</span>
                  </button>

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

                  {canAccessCms && (
                    <Link
                      to="/portal/cms"
                      onClick={() => setShowUserDropdown(false)}
                      className="w-full flex items-center space-x-2 p-2.5 rounded-xl text-xs font-semibold text-[var(--text-body)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-heading)] transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Site CMS Studio</span>
                    </Link>
                  )}

                  <a
                    href="/"
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[var(--text-body)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-heading)] transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-[var(--brand-teal)]" />
                      <span>Public Website</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
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
            aria-label="Toggle Portal Navigation Menu"
            className="md:hidden p-1.5 sm:p-2 rounded-xl text-[var(--text-heading)] hover:bg-[var(--bg-subtle)] transition-colors border border-[var(--border-subtle)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[var(--brand-teal)]" />}
          </button>

        </div>

      </div>

      {/* Mobile Portal Navigation Dropdown */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden pt-3 pb-3 border-t border-[var(--border-subtle)] mt-2.5 space-y-3 animate-in slide-in-from-top-2 duration-150 max-h-[80vh] overflow-y-auto">
          
          {/* Primary Navigation Section */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Core Workspace
            </div>
            {primaryNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                      : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Secondary / Management Tools Section */}
          {secondaryNavItems.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1 flex items-center justify-between">
                <span>Management & Tools</span>
                <span className="font-mono text-[9px] text-[var(--brand-teal)]">{badge.label}</span>
              </div>
              {secondaryNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                        : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.description && (
                      <span className={`text-[10px] font-normal truncate max-w-[120px] ${isActive ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                        {item.description.split(' ')[0]}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Preferences & Quick Actions */}
          <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2 px-1">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Preferences</span>
              <div className="flex items-center space-x-2">
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setChangePwdOpen(true);
                }}
                className="flex-1 flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-body)]"
              >
                <Key className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                <span>Password</span>
              </button>

              <a
                href="/"
                className="flex-1 flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-body)]"
              >
                <Shield className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                <span>Website</span>
              </a>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Change Password Modal (Portal to document.body) */}
      {changePwdOpen && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
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
                <div className="relative">
                  <input
                    type={showChangePwd ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangePwd(!showChangePwd)}
                    className="absolute right-3 top-2 text-[var(--text-muted)] hover:text-[var(--text-heading)] p-0.5 rounded cursor-pointer"
                    aria-label={showChangePwd ? 'Hide password' : 'Show password'}
                  >
                    {showChangePwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setChangePwdOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Profile & Avatar Modal (Portal to document.body) */}
      {editProfileOpen && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl max-w-xl w-full shadow-2xl animate-in fade-in zoom-in-95 my-auto max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-page)] shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--brand-teal-subtle)] flex items-center justify-center text-[var(--brand-teal)] border border-[var(--border-subtle)]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base sm:text-lg text-[var(--text-heading)]">
                    Edit Profile & Avatar Picture
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Update your personal profile information and choose your platform avatar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-heading)] p-1.5 rounded-xl hover:bg-[var(--bg-subtle)] cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form
              id="edit-profile-form"
              onSubmit={(e) => {
                e.preventDefault();
                updateUserProfile(currentUser.id, {
                  name: profileName,
                  title: profileTitle,
                  avatarUrl: profileAvatarUrl || currentUser.avatarUrl,
                  phone: profilePhone,
                  bio: profileBio,
                });
                setEditProfileOpen(false);
                showToast('Your profile and avatar picture have been updated!', 'success', 'Profile Saved');
              }}
              className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1"
            >
              {/* Avatar Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--brand-teal)]">
                  1. Choose Your Profile Avatar
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Current Preview */}
                  <div className="relative group">
                    <img
                      src={profileAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName || currentUser.name)}&background=1F7A8C&color=fff&size=256`}
                      alt={profileName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-[var(--brand-teal)]/40 shadow-xl"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Actions: Upload or Use Initials */}
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 3 * 1024 * 1024) {
                            showToast('Please upload an image smaller than 3MB.', 'warning');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setProfileAvatarUrl(event.target.result as string);
                              showToast('Custom photo loaded from device!', 'info');
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Device</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const initialsUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName || currentUser.name)}&background=1F7A8C&color=fff&size=256`;
                          setProfileAvatarUrl(initialsUrl);
                          showToast('Generated clean initials avatar.', 'info');
                        }}
                        className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs font-semibold cursor-pointer transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                        <span>Use Initials</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Upload any JPG/PNG from your phone or PC, select a preset below, or paste an image URL.
                    </p>
                  </div>
                </div>

                {/* Preset Avatars Library */}
                <div>
                  <span className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-2">
                    Or Select from Preset Avatars:
                  </span>
                  <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
                    {PRESET_AVATARS.map((avatar, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setProfileAvatarUrl(avatar);
                        }}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 ${
                          profileAvatarUrl === avatar
                            ? 'border-[var(--brand-teal)] ring-2 ring-[var(--brand-teal)] shadow-md'
                            : 'border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/60'
                        }`}
                      >
                        <img src={avatar} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct Image URL fallback input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                    Direct Image URL
                  </label>
                  <input
                    type="url"
                    value={profileAvatarUrl}
                    onChange={(e) => setProfileAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or any image link"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] font-mono focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Profile Details Section */}
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--brand-teal)]">
                  2. Account Profile Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                      Job Title / Specialty *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileTitle}
                      onChange={(e) => setProfileTitle(e.target.value)}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                    Phone / WhatsApp Contact
                  </label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                    Professional Bio
                  </label>
                  <textarea
                    rows={3}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    placeholder="Brief overview of your experience, domain expertise, and role responsibilities..."
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </form>

            {/* Modal Footer (Sticky) */}
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-5 border-t border-[var(--border-subtle)] bg-[var(--bg-page)] shrink-0">
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-profile-form"
                className="px-6 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                Save Profile
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </nav>
  );
};
