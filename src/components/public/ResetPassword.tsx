import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { SEOHead } from '../seo/SEOHead';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // New recovery link request state (for expired links)
  const [requestEmail, setRequestEmail] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage('Database connection unavailable. Please try again shortly.');
      return;
    }

    // Listen for PASSWORD_RECOVERY event
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (session && searchParams.get('type') === 'recovery')) {
        setSessionActive(true);
        setErrorMessage('');
      }
    });

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionActive(true);
      } else {
        // Allow brief timeout for token exchange before assuming expired
        setTimeout(() => {
          setSessionActive((prev) => (prev === null ? false : prev));
        }, 1500);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [searchParams]);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 12) score += 30;
    if (pwd.length >= 16) score += 20;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 20;
    if (/\d/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;
    return Math.min(score, 100);
  };

  const strengthScore = getPasswordStrength(password);
  const isLengthValid = password.length >= 12;
  const isMatch = password === confirmPassword && confirmPassword.length > 0;
  const isCommon = ['password', '123456789012', 'digihust@2026'].includes(password.toLowerCase().trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isLengthValid) {
      setErrorMessage('Password must be at least 12 characters long.');
      return;
    }

    if (isCommon) {
      setErrorMessage('Please choose a unique password that is not easily guessable.');
      return;
    }

    if (!isMatch) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!supabase) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      // Call mark_migration_complete security-definer RPC
      try {
        await supabase.rpc('mark_migration_complete');
      } catch (_) {}

      setSuccess(true);
      setTimeout(() => {
        navigate('/portal/login?upgraded=true');
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password. Please request a new recovery link.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestEmail || !supabase) return;
    setRequestLoading(true);
    try {
      // Generic response to prevent user enumeration
      await supabase.auth.resetPasswordForEmail(requestEmail.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      setRequestSent(true);
    } catch (_) {
      setRequestSent(true); // Always show generic confirmation
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead title="Set New Password | DigiHust Account Security" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-block text-2xl font-black tracking-tight text-[var(--text-heading)]">
            Digi<span className="text-[var(--brand-teal)]">Hust</span>
          </Link>
          <div className="mt-2 flex items-center justify-center space-x-1.5 text-xs text-[var(--text-muted)] font-medium">
            <ShieldCheck className="w-4 h-4 text-[var(--brand-teal)]" />
            <span>Account Security Upgrade</span>
          </div>
        </div>

        <div className="mt-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 shadow-sm">
          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[var(--text-heading)]">Password Updated Successfully</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Your account is upgraded to modern authentication standards. Redirecting to login...
              </p>
              <div className="pt-2">
                <Link
                  to="/portal/login"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[var(--brand-teal)] hover:underline"
                >
                  <span>Go to Login Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : sessionActive === false ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-[var(--text-heading)]">This link has expired or has already been used</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Security links expire after use or 24 hours. Enter your email below to receive a new one.
              </p>

              {requestSent ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                  If an account exists for this email, a new password recovery link has been dispatched.
                </div>
              ) : (
                <form onSubmit={handleRequestNewLink} className="space-y-3 pt-2 text-left">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      required
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={requestLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    {requestLoading ? 'Sending...' : 'Send New Reset Link'}
                  </button>
                </form>
              )}

              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <Link to="/portal/login" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-heading)]">
                  Return to Portal Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-[var(--text-heading)]">Set Your Permanent Password</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Choose a password of at least 12 characters to protect your account deliverables and records.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start space-x-2 text-xs text-rose-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    New Password (min 12 chars) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[var(--brand-teal)] hover:underline flex items-center space-x-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={12}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter at least 12 characters"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-3" />
                </div>

                {/* Password strength meter */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strengthScore < 50
                            ? 'bg-rose-500'
                            : strengthScore < 80
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${strengthScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                      <span>{isLengthValid ? '✓ Meets minimum length' : 'Needs at least 12 characters'}</span>
                      <span className="font-semibold">
                        {strengthScore < 50 ? 'Weak' : strengthScore < 80 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={12}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-3" />
                </div>
                {confirmPassword.length > 0 && (
                  <p className={`text-[10px] mt-1 ${isMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isMatch ? '✓ Passwords match' : 'Passwords do not match'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isLengthValid || !isMatch}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Password...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm &amp; Update Password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
