import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Lock, User as UserIcon, Bell, AlertCircle, CheckCircle2, Eye, EyeOff, Mail, Key, RefreshCw, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { SEOHead } from '../seo/SEOHead';
import logoImg from '../../assets/logo.png';

export const PortalLogin: React.FC = () => {
  const { loginWithMemberId, loginWithSupabaseSession, announcements, requestPasswordReset, completePasswordResetWithOtp } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/portal/dashboard';

  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Migration Policy Upgrade State (Choose a New Password modal)
  const [newPasswordModalOpen, setNewPasswordModalOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [targetAccountEmail, setTargetAccountEmail] = useState('');
  const [upgradedPassword, setUpgradedPassword] = useState('');
  const [confirmUpgradedPassword, setConfirmUpgradedPassword] = useState('');
  const [showUpgradedPassword, setShowUpgradedPassword] = useState(false);
  const [upgradedLoading, setUpgradedLoading] = useState(false);
  const [upgradedError, setUpgradedError] = useState('');

  // Filter Global announcements visible before login
  const globalAnnouncements = (announcements || []).filter(a => a.scope === 'global');

  // 2-Step Automated Password Reset State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetStep, setResetStep] = useState<'request' | 'verify' | 'success'>('request');
  const [resetEmail, setResetEmail] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resending code
  React.useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Detect if member arrived via Supabase Password Recovery Email Link
  React.useEffect(() => {
    const hash = window.location.hash || window.location.search;
    if (hash.includes('type=recovery') || hash.includes('access_token')) {
      setResetModalOpen(true);
      setResetStep('verify');
      if (memberId && memberId.includes('@')) {
        setVerifiedEmail(memberId);
      }
    }
  }, [memberId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanIdentifier = memberId.trim();
    if (!cleanIdentifier) {
      setErrorMessage('Please enter your permanent Member ID or registered Email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoggingIn(true);

    try {
      // 1. Call Legacy-Login migration bridge
      const resp = await fetch('/api/legacy-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanIdentifier, password })
      });

      const data = await resp.json().catch(() => null);

      if (resp.status === 429) {
        setErrorMessage('Too many login attempts. Please wait 1 minute before trying again.');
        setIsLoggingIn(false);
        return;
      }

      if (resp.ok && data) {
        // Case A: Password does not meet new >=12 chars policy -> Show in-app upgrade modal
        if (data.status === 'requires_new_password') {
          setTempPassword(password);
          setTargetAccountEmail(data.email || cleanIdentifier);
          setUpgradedPassword('');
          setConfirmUpgradedPassword('');
          setUpgradedError('');
          setNewPasswordModalOpen(true);
          setIsLoggingIn(false);
          return;
        }

        // Case B: Migrated on login successfully!
        if (data.status === 'migrated') {
          const authEmail = data.email || cleanIdentifier;
          if (isSupabaseConfigured && supabase) {
            await supabase.auth.signInWithPassword({ email: authEmail, password });
          }
          loginWithSupabaseSession(authEmail);
          navigate(from, { replace: true });
          return;
        }

        // Case C: Account was already migrated previously
        if (data.status === 'already_migrated') {
          const authEmail = data.email || cleanIdentifier;
          if (isSupabaseConfigured && supabase) {
            const { error: sbErr } = await supabase.auth.signInWithPassword({
              email: authEmail,
              password
            });
            if (!sbErr) {
              loginWithSupabaseSession(authEmail);
              navigate(from, { replace: true });
              return;
            }
          }
          // Fallback to local session check
          const localRes = loginWithMemberId(cleanIdentifier, password);
          if (localRes.success) {
            navigate(from, { replace: true });
            return;
          }
          setErrorMessage('Email or password is incorrect.');
          setIsLoggingIn(false);
          return;
        }
      }

      if (resp.status === 401 || (data && !data.success)) {
        // Dev fallback if running without live backend
        const localRes = loginWithMemberId(cleanIdentifier, password);
        if (localRes.success) {
          navigate(from, { replace: true });
          return;
        }
        setErrorMessage(data?.error || 'Email or password is incorrect.');
        setIsLoggingIn(false);
        return;
      }

      // Default fallback
      const localRes = loginWithMemberId(cleanIdentifier, password);
      if (localRes.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(localRes.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch {
      // In offline / local development where /api/* is not running, fall back seamlessly
      const localRes = loginWithMemberId(cleanIdentifier, password);
      if (localRes.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(localRes.error || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUpgradePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpgradedError('');

    if (upgradedPassword.length < 12) {
      setUpgradedError('Password must be at least 12 characters.');
      return;
    }
    if (upgradedPassword === 'DigiHust@2026') {
      setUpgradedError('Please do not use the default password.');
      return;
    }
    if (upgradedPassword !== confirmUpgradedPassword) {
      setUpgradedError('Passwords do not match. Please re-enter.');
      return;
    }

    setUpgradedLoading(true);
    try {
      const resp = await fetch('/api/legacy-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetAccountEmail,
          password: tempPassword,
          newPassword: upgradedPassword
        })
      });

      const data = await resp.json().catch(() => null);

      if (resp.ok && data?.success) {
        const authEmail = data.email || targetAccountEmail;
        if (isSupabaseConfigured && supabase) {
          await supabase.auth.signInWithPassword({
            email: authEmail,
            password: upgradedPassword
          });
        }
        loginWithSupabaseSession(authEmail);
        setNewPasswordModalOpen(false);
        navigate(from, { replace: true });
      } else {
        setUpgradedError(data?.error || 'Failed to update password. Please try again.');
      }
    } catch {
      setUpgradedError('Network error updating password. Please try again.');
    } finally {
      setUpgradedLoading(false);
    }
  };

  const handleOpenResetModal = () => {
    setResetModalOpen(true);
    setResetStep('request');
    setResetError('');
    setResetOtp('');
    setNewPassword('');
    setConfirmPassword('');
    if (memberId && (memberId.includes('@') || memberId.startsWith('DGH') || memberId.startsWith('CEO'))) {
      setResetEmail(memberId);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    if (!resetEmail.trim()) {
      setResetError('Please enter your registered email address or Member ID.');
      return;
    }

    setResetLoading(true);
    try {
      const res = await requestPasswordReset(resetEmail.trim());
      if (res.success && res.email) {
        setVerifiedEmail(res.email);
        setResetStep('verify');
        setResendTimer(60);
      } else {
        setResetError(res.message || 'No registered account found with that email or Member ID.');
      }
    } catch {
      setResetError('Failed to dispatch recovery code. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || !verifiedEmail) return;
    setResetLoading(true);
    setResetError('');
    try {
      const res = await requestPasswordReset(verifiedEmail);
      if (res.success) {
        setResendTimer(60);
      } else {
        setResetError(res.message);
      }
    } catch {
      setResetError('Failed to resend code.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (!resetOtp.trim() || resetOtp.trim().length !== 6) {
      setResetError('Please enter the valid 6-digit verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match. Please re-enter.');
      return;
    }

    setResetLoading(true);
    try {
      const res = await completePasswordResetWithOtp(verifiedEmail, resetOtp.trim(), newPassword);
      if (res.success) {
        setResetStep('success');
        setPassword('');
        setMemberId(verifiedEmail);
      } else {
        setResetError(res.error || 'Verification failed. The code may be invalid or expired.');
      }
    } catch {
      setResetError('Password reset failed. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] flex flex-col justify-between pt-12 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEOHead
        title="Staff Portal Login | DigiHust"
        description="Internal access portal for DigiHust CEO, Managers, Group Leaders, and Specialists."
      />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--brand-teal)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center space-x-3">
          <img 
            src={logoImg} 
            alt="DigiHust Logo" 
            className="h-9 sm:h-10 w-auto max-w-[44px] object-contain drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.75)]" 
          />
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

      {/* Main Grid: Production Login Box + Pre-Login Global Announcements Feed */}
      <div className="max-w-6xl mx-auto w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Secure Login Card */}
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
                Enter your permanent DigiHust Member ID (<span className="font-mono text-[var(--brand-teal)]">DGH...</span>) or Email to access your workspace.
              </p>
            </div>

            {/* Migration Security Upgrade Banner */}
            <div className="mb-5 p-3.5 rounded-2xl bg-[var(--brand-teal-subtle)] border border-[var(--border-subtle)] flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-[var(--brand-teal)] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                <strong className="text-[var(--text-heading)]">Account Security Upgrade:</strong> We upgraded account security. Sign in with your usual password, or use &ldquo;Forgot password&rdquo; and we&apos;ll email you a link.
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
                  Member ID or Email
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="e.g. DGH1234567 or email"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none transition-all"
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
                    onClick={handleOpenResetModal}
                    className="text-xs text-[var(--brand-teal)] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-heading)] p-0.5 rounded cursor-pointer transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] disabled:opacity-60 text-white font-bold text-sm shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer mt-4"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authorize & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right Column: Pre-Login Global Announcements Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-6 space-y-4"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[var(--brand-teal)]" />
                  <h2 className="font-display font-bold text-sm text-[var(--text-heading)]">
                    Company-Wide Broadcasts
                  </h2>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-muted)] uppercase">
                  Staff Bulletin
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
                          {(ann.postedByRole || 'STAFF').toUpperCase()} NOTICE
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {ann.postedAt ? new Date(ann.postedAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <h3 className="font-bold text-xs text-[var(--text-heading)] mb-1">
                        {ann.title}
                      </h3>
                      <p className="text-xs text-[var(--text-body)] leading-relaxed">
                        {ann.content || ann.body || ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Automated 2-Step Password Reset Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-[var(--brand-teal)]/15 border border-[var(--brand-teal)]/30 flex items-center justify-center text-[var(--brand-teal)]">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                    Self-Service Password Reset
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {resetStep === 'request' && 'Step 1 of 2: Request Security Code'}
                    {resetStep === 'verify' && 'Step 2 of 2: Verify & Set New Password'}
                    {resetStep === 'success' && 'Password Reset Complete'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Display */}
            {resetError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {/* Step 1: Request 6-Digit Code */}
            {resetStep === 'request' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <p className="text-xs text-[var(--text-body)] leading-relaxed">
                  Enter your registered DigiHust email address or Member ID. We will send a secure 6-digit verification code directly to your email inbox.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    Registered Email or Member ID *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="e.g. member@gmail.com or DGH2600150"
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md flex items-center space-x-2 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {resetLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit Code</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Verify OTP & Enter New Password */}
            {resetStep === 'verify' && (
              <form onSubmit={handleVerifyAndReset} className="space-y-4">
                <div className="p-3 rounded-2xl bg-[var(--brand-teal)]/10 border border-[var(--brand-teal)]/20 text-[11px] text-[var(--text-body)]">
                  A 6-digit verification code was sent to <strong className="text-[var(--text-heading)]">{verifiedEmail}</strong>. Code expires in 15 minutes.
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    6-Digit Verification Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-center font-mono text-lg font-extrabold tracking-widest text-[var(--brand-teal)] focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      New Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-[11px] text-[var(--brand-teal)] hover:underline flex items-center space-x-1"
                    >
                      {showNewPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showNewPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    Confirm New Password *
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={resendTimer > 0 || resetLoading}
                    onClick={handleResendOtp}
                    className="text-xs text-[var(--brand-teal)] hover:underline font-semibold disabled:text-[var(--text-muted)] disabled:no-underline cursor-pointer"
                  >
                    {resendTimer > 0 ? `Resend Code in (${resendTimer}s)` : 'Resend Code'}
                  </button>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md flex items-center space-x-2 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {resetLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <span>Update Password</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success Confirmation */}
            {resetStep === 'success' && (
              <div className="text-center space-y-4 py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                    Password Reset Successfully!
                  </h4>
                  <p className="text-xs text-[var(--text-body)] mt-1">
                    Your password has been updated in the cloud. You can now log in to your portal using your new password.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
                >
                  Proceed to Login
                </button>
              </div>
            )}

          </motion.div>
        </div>
      )}

      {/* Modern In-App Password Policy Upgrade Modal (Migrate-On-Login Step) */}
      {newPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--border-subtle)]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--brand-teal)]/15 border border-[var(--brand-teal)]/30 flex items-center justify-center text-[var(--brand-teal)]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                    Update Account Password
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    New Security Policy: 12+ Characters Required
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNewPasswordModalOpen(false)}
                className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-body)] mb-4 leading-relaxed">
              Your existing password does not meet our updated security standard. Please set a new password of at least 12 characters to complete your login and protect your account.
            </p>

            {upgradedError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{upgradedError}</span>
              </div>
            )}

            <form onSubmit={handleUpgradePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  New Secure Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type={showUpgradedPassword ? 'text' : 'password'}
                    required
                    value={upgradedPassword}
                    onChange={(e) => setUpgradedPassword(e.target.value)}
                    placeholder="At least 12 characters"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUpgradedPassword(!showUpgradedPassword)}
                    className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-heading)] p-0.5 rounded cursor-pointer transition-colors"
                  >
                    {showUpgradedPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type={showUpgradedPassword ? 'text' : 'password'}
                    required
                    value={confirmUpgradedPassword}
                    onChange={(e) => setConfirmUpgradedPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Policy Checklist */}
              <div className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-1.5 text-[11px]">
                <div className={`flex items-center gap-2 ${upgradedPassword.length >= 12 ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Minimum 12 characters ({upgradedPassword.length}/12)</span>
                </div>
                <div className={`flex items-center gap-2 ${/[a-z]/.test(upgradedPassword) && /[A-Z]/.test(upgradedPassword) ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Both uppercase and lowercase letters</span>
                </div>
                <div className={`flex items-center gap-2 ${/[0-9]/.test(upgradedPassword) || /[^A-Za-z0-9]/.test(upgradedPassword) ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>At least one number or symbol</span>
                </div>
                <div className={`flex items-center gap-2 ${upgradedPassword && upgradedPassword === confirmUpgradedPassword ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Passwords match</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={upgradedLoading || upgradedPassword.length < 12 || upgradedPassword !== confirmUpgradedPassword}
                className="w-full py-3.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {upgradedLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Upgrading Security...</span>
                  </>
                ) : (
                  <>
                    <span>Save Password & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full text-center text-xs text-[var(--text-muted)] pt-4 border-t border-[var(--border-subtle)]">
        DigiHust Internal Operations Platform · Restricted to Authorized Staff Only
      </div>
    </div>
  );
};
