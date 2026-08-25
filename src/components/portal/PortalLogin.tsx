import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Lock, User as UserIcon, Bell, Sparkles, Key, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRoleTier } from '../../types';
import { SEOHead } from '../seo/SEOHead';

export const PortalLogin: React.FC = () => {
  const { loginWithMemberId, switchTier, announcements, requestPasswordReset } = useApp();
  const navigate = useNavigate();

  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // Filter Global announcements visible before login
  const globalAnnouncements = announcements.filter(a => a.scope === 'global');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId.trim()) {
      setErrorMessage('Please enter your Member ID (e.g. DGH2600101)');
      return;
    }
    const res = loginWithMemberId(memberId, password);
    if (res.success) {
      navigate('/portal/dashboard');
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleQuickTierLogin = (tier: UserRoleTier) => {
    switchTier(tier);
    navigate('/portal/dashboard');
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    const res = requestPasswordReset(resetEmail);
    setResetFeedback(res);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] flex flex-col justify-between pt-12 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEOHead
        title="Staff Portal Login — DigiHust"
        description="Internal access portal for DigiHust CEO, Managers, Group Leaders, and Specialists."
      />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--brand-teal)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#022B3A] via-[#1F7A8C] to-[#E1E5F2] flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display font-extrabold text-xl text-[var(--text-heading)] tracking-tight">DigiHust</span>
            <span className="ml-2 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
              Staff Portal
            </span>
          </div>
        </div>
        <a
          href="/"
          className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--brand-teal)] transition-colors flex items-center gap-1"
        >
          ← Return to Public Website
        </a>
      </div>

      {/* Main Grid: Login Box + Pre-Login Global Announcements Feed */}
      <div className="max-w-6xl mx-auto w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-10 shadow-2xl relative"
          >
            <div className="mb-6">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)] mb-2">
                Sign In to Portal
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-body)]">
                Enter your permanent DigiHust Member ID (<span className="font-mono text-[var(--brand-teal)]">DGH...</span>) to access your squad workspace.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Member ID
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="e.g. DGH2600101"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-heading)] font-mono focus:border-[var(--brand-teal)] focus:outline-none transition-all placeholder:text-[var(--text-muted)]/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetModalOpen(true);
                      setResetFeedback(null);
                    }}
                    className="text-xs text-[var(--brand-teal)] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none transition-all placeholder:text-[var(--text-muted)]/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-sm shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer mt-2"
              >
                <span>Authorize & Enter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Role Switcher */}
            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
              <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                Quick Role Preview (Demo Evaluation):
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { tier: 'ceo' as UserRoleTier, label: 'CEO / Founder', id: 'DGH2400001', color: 'border-purple-500/40 text-purple-400' },
                  { tier: 'manager' as UserRoleTier, label: 'Manager / Ops', id: 'DGH2500002', color: 'border-blue-500/40 text-blue-400' },
                  { tier: 'group_leader' as UserRoleTier, label: 'Tech Squad Lead', id: 'DGH2500003', color: 'border-cyan-500/40 text-cyan-400' },
                  { tier: 'member' as UserRoleTier, label: 'Member Specialist', id: 'DGH2600101', color: 'border-emerald-500/40 text-emerald-400' },
                ].map((item) => (
                  <button
                    key={item.tier}
                    type="button"
                    onClick={() => handleQuickTierLogin(item.tier)}
                    className="p-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-[var(--text-heading)] group-hover:text-[var(--brand-teal)]">{item.label}</div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">{item.id}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Pre-Login Global Announcements Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-6 space-y-4"
          >
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[var(--brand-teal)]" />
                  <h2 className="font-display font-bold text-sm text-[var(--text-heading)]">
                    Company-Wide Broadcasts
                  </h2>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-muted)] uppercase">
                  Public Feed
                </span>
              </div>

              {globalAnnouncements.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] italic">No active public announcements at this time.</p>
              ) : (
                <div className="space-y-4">
                  {globalAnnouncements.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/40 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide text-[var(--brand-teal)]">
                          {ann.postedByRole.toUpperCase()} NOTICE
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {new Date(ann.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-[var(--text-heading)] mb-1">
                        {ann.title}
                      </h3>
                      <p className="text-xs text-[var(--text-body)] leading-relaxed">
                        {ann.body}
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                        <span>Issued by: {ann.postedByName}</span>
                        <span className="text-[var(--brand-teal)] font-semibold">Verified Broadcast</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/30 text-xs text-[var(--text-heading)] flex items-start space-x-3">
              <Key className="w-4 h-4 text-[var(--brand-teal)] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-[var(--brand-teal)] mb-0.5">Need Portal Credentials?</strong>
                Credentials are automatically dispatched by Management to all verified specialists upon squad induction.
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Forgot Password Self-Service Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)] mb-2">
              Self-Service Password Reset
            </h3>
            <p className="text-xs text-[var(--text-body)] mb-5">
              Enter your registered email address. A secure one-time reset link will be dispatched automatically.
            </p>

            {resetFeedback && (
              <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                resetFeedback.success
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}>
                {resetFeedback.success ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{resetFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your.email@digihust.com"
                required
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer copyright */}
      <div className="max-w-6xl mx-auto w-full text-center text-xs text-[var(--text-muted)] pt-6 border-t border-[var(--border-subtle)]">
        DigiHust Internal Management System · Authorized Staff Access Only
      </div>
    </div>
  );
};
