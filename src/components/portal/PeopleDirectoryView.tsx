import React, { useState } from 'react';
import { 
  Users, Mail, Shield, Send, CheckCircle2, AlertCircle, Plus, 
  FileSpreadsheet, Sparkles, Filter, Search, UserCheck, Key, Lock, 
  ShieldCheck, Settings, UserPlus, Ban, Check, X, Award, Printer, Eye,
  Pin, PinOff, Crown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User as UserType, UserRoleTier, GroupId, Certificate } from '../../types';
import { PERMISSIONS } from '../../lib/permissions';
import { BulkImportModal } from './BulkImportModal';
import { RoleManagementModal } from './RoleManagementModal';
import { CertificatePrintView } from '../ui/CertificatePrintView';
import { 
  generateBuiltInCertificatePdf, 
  stampCustomPdfTemplate, 
  downloadPdfFile 
} from '../../lib/pdfTemplateEngine';

export const PeopleDirectoryView: React.FC = () => {
  const { 
    users, groups, currentTier, currentUser, sendBatchCredentials, 
    auditLogs, createUserAccount, resetUserPasswordByCeo, toggleUserAccountStatus,
    certificateTemplates, generateMemberCertificate, showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSquad, setSelectedSquad] = useState<string>('all');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [credentialModalOpen, setCredentialModalOpen] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  const [resetPwdUser, setResetPwdUser] = useState<UserType | null>(null);
  const [newPlainPwd, setNewPlainPwd] = useState('');
  const [selectedUserForRole, setSelectedUserForRole] = useState<UserType | null>(null);
  const [dispatchResult, setDispatchResult] = useState<{ count: number; memberNames: string[] } | null>(null);

  // Pinned Member IDs (Saved in Local Storage)
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('digihust_pinned_members');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const togglePinUser = (userId: string) => {
    setPinnedIds((prev) => {
      const isPinned = prev.includes(userId);
      const updated = isPinned ? prev.filter((id) => id !== userId) : [...prev, userId];
      try {
        localStorage.setItem('digihust_pinned_members', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save pinned members:', err);
      }
      showToast(isPinned ? 'Member unpinned.' : 'Member pinned to top.', 'info');
      return updated;
    });
  };

  // Helper to check CEO & Co-founders (Permanent Top Tier)
  const isCeoOrFounder = (u: UserType) => {
    if (u.isCeoMaster || u.roleTier === 'ceo') return true;
    const t = (u.title || '').toLowerCase();
    const r = (u.role || '').toLowerCase();
    return t.includes('ceo') || t.includes('founder') || t.includes('co-founder') || r.includes('ceo');
  };

  // Certificate Generator Modal States
  const [certModalUser, setCertModalUser] = useState<UserType | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [customRoleTitle, setCustomRoleTitle] = useState('');
  const [customDuration, setCustomDuration] = useState('');
  const [customClient, setCustomClient] = useState('DigiHust Engineering Squad Core');
  const [generatedCertPreview, setGeneratedCertPreview] = useState<Certificate | null>(null);

  // New Account Draft
  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccRoleTier, setNewAccRoleTier] = useState<UserRoleTier>('member');
  const [newAccSquad, setNewAccSquad] = useState<GroupId>('tech');
  const [newAccTitle, setNewAccTitle] = useState('');
  const [newAccPassword, setNewAccPassword] = useState('');
  const [createFeedback, setCreateFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-xs text-[var(--text-muted)]">Loading directory...</p>
      </div>
    );
  }

  const visibleUsers = (users || []).filter((u) => {
    if (!u) return false;
    if (currentTier === 'ceo' || currentTier === 'manager') return true;
    if (currentTier === 'group_leader') return u.groupId === currentUser?.groupId;
    return u.id === currentUser?.id;
  });

  const query = (searchQuery || '').toLowerCase().trim();

  const filteredUsers = visibleUsers.filter((u) => {
    if (!u) return false;
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const memberId = (u.memberId || '').toLowerCase();
    const title = (u.title || '').toLowerCase();
    const matchesSearch = !query || name.includes(query) || email.includes(query) || memberId.includes(query) || title.includes(query);
    const matchesSquad = selectedSquad === 'all' || u.groupId === selectedSquad;
    return matchesSearch && matchesSquad;
  }).sort((a, b) => {
    if (!a || !b) return 0;
    // 1. Leadership always top priority
    const aLeader = isCeoOrFounder(a);
    const bLeader = isCeoOrFounder(b);
    if (aLeader && !bLeader) return -1;
    if (!aLeader && bLeader) return 1;

    // 2. Pinned members next in exact chronological order
    const aPinnedIdx = pinnedIds.indexOf(a.id);
    const bPinnedIdx = pinnedIds.indexOf(b.id);
    if (aPinnedIdx !== -1 && bPinnedIdx === -1) return -1;
    if (aPinnedIdx === -1 && bPinnedIdx !== -1) return 1;
    if (aPinnedIdx !== -1 && bPinnedIdx !== -1) return aPinnedIdx - bPinnedIdx;

    return (a.name || '').localeCompare(b.name || '');
  });

  const handleOpenCertModal = (user: UserType) => {
    setCertModalUser(user);
    const defaultTpl = certificateTemplates?.[0];
    setSelectedTemplateId(defaultTpl ? defaultTpl.id : 'tpl-offer');
    setCustomRoleTitle(user.title || 'Specialist');
    setCustomDuration(defaultTpl?.defaultDuration || '45 Days (Remote)');
    setCustomClient('DigiHust Engineering Squad Core');
  };

  const handleGenerateCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certModalUser) return;

    try {
      const tpl = certificateTemplates?.find(t => t.id === selectedTemplateId) || certificateTemplates?.[0];
      const cert = generateMemberCertificate(certModalUser.id, tpl?.id || 'tpl-offer', {
        roleTitle: customRoleTitle || certModalUser.title || 'Specialist',
        durationText: customDuration || '45 Days (Remote)',
        clientName: customClient || 'DigiHust Engineering Squad Core',
        documentTitle: tpl?.documentTitle || tpl?.name || 'Internship Offer Letter'
      });

      setCertModalUser(null);
      setGeneratedCertPreview(cert);
    } catch (err) {
      console.error('Failed to generate certificate:', err);
      alert('Failed to generate certificate document. Please try again.');
    }
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName || !newAccEmail) return;

    const mappedRole = (newAccRoleTier === 'ceo' || newAccRoleTier === 'manager') 
      ? 'management' 
      : (newAccRoleTier === 'group_leader' ? 'group_leader' : (newAccRoleTier === 'intern' ? 'intern' : 'freelancer'));

    const res = createUserAccount({
      name: newAccName,
      email: newAccEmail,
      role: mappedRole,
      roleTier: newAccRoleTier,
      groupId: newAccSquad,
      title: newAccTitle || 'Specialist',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      specialties: ['Digital Services'],
      status: 'active',
      joinYear: new Date().getFullYear(),
      joinedAt: new Date().toISOString().split('T')[0]
    }, newAccPassword || undefined);

    if (res.success && res.newUser) {
      setCreateFeedback({ 
        success: true, 
        message: `Account created for ${res.newUser.name}! Member ID: ${res.newUser.memberId}` 
      });
      setTimeout(() => {
        setCreateAccountModalOpen(false);
        setNewAccName('');
        setNewAccEmail('');
        setNewAccTitle('');
        setNewAccPassword('');
        setCreateFeedback(null);
      }, 1500);
    } else {
      setCreateFeedback({ success: false, message: res.error || 'Failed to create account.' });
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPwdUser || !newPlainPwd) return;

    const res = resetUserPasswordByCeo(resetPwdUser.id, newPlainPwd);
    if (res.success) {
      alert(`Password for ${resetPwdUser.name} (${resetPwdUser.memberId}) has been updated.`);
      setResetPwdUser(null);
      setNewPlainPwd('');
    } else {
      alert(res.error || 'Failed to reset password.');
    }
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://digihust.com';

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--brand-teal)] uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Staff & Specialist Ecosystem</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)]">
            {currentTier === 'group_leader' ? 'Squad Roster' : 'People Directory & Credentialing'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-body)]">
            {currentTier === 'group_leader'
              ? `Manage your active squad members, capacity, and assignments.`
              : `Manage permanent DGH identities, password access, roles, and 1-click certificate generation.`}
          </p>
        </div>

        {/* Action Buttons (CEO & Manager only) */}
        {PERMISSIONS.canSendCredentials(currentTier) && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {PERMISSIONS.canCreateUserAccount(currentTier) && (
              <button
                onClick={() => setCreateAccountModalOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Staff Account</span>
              </button>
            )}

            <button
              onClick={() => setIsImportOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-xs font-bold text-[var(--text-heading)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[var(--brand-teal)]" />
              <span>Import Excel</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, DGH ID, title..."
            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
          />
        </div>

        {currentTier !== 'group_leader' && (
          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setSelectedSquad('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSquad === 'all'
                  ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                  : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              All Squads ({visibleUsers.length})
            </button>
            {groups.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedSquad(g.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedSquad === g.id
                    ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                    : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                {g.name.split('&')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((u) => {
          const squadObj = groups.find(g => g.id === u.groupId);
          const isSuspended = u.status === 'suspended';

          return (
            <div
              key={u.id}
              className={`p-6 rounded-3xl bg-[var(--bg-surface)] border transition-all flex flex-col justify-between ${
                isSuspended ? 'border-rose-500/40 opacity-75' : 'border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/40 hover:shadow-xl'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img src={u.avatarUrl} alt={u.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[var(--border-subtle)]" />
                      {isCeoOrFounder(u) && (
                        <span className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-amber-400 text-slate-950 shadow">
                          <Crown className="w-3 h-3 fill-current" />
                        </span>
                      )}
                      {!isCeoOrFounder(u) && pinnedIds.includes(u.id) && (
                        <span className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-[var(--brand-teal)] text-white shadow">
                          <Pin className="w-3 h-3 fill-current" />
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[var(--text-heading)] flex flex-wrap items-center gap-1.5">
                        <span>{u.name}</span>
                        {isCeoOrFounder(u) && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-400/15 text-amber-500 border border-amber-400/30 text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5" /> Leadership
                          </span>
                        )}
                        {!isCeoOrFounder(u) && pinnedIds.includes(u.id) && (
                          <span className="px-1.5 py-0.2 rounded bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--brand-teal)]/30 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-0.5">
                            <Pin className="w-2.5 h-2.5 fill-current" /> Pinned
                          </span>
                        )}
                        {isSuspended && <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-black uppercase">Suspended</span>}
                      </h3>
                      <p className="text-[11px] font-mono text-[var(--brand-teal)] font-bold">{u.memberId || 'DGH2600000'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {(currentTier === 'ceo' || currentTier === 'manager') && !isCeoOrFounder(u) && (
                      <button
                        onClick={() => togglePinUser(u.id)}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                          pinnedIds.includes(u.id)
                            ? 'bg-[var(--brand-teal)] text-white border-[var(--brand-teal)]'
                            : 'bg-[var(--bg-page)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--brand-teal)]'
                        }`}
                        title={pinnedIds.includes(u.id) ? 'Unpin member' : 'Pin member to top of directory'}
                      >
                        {pinnedIds.includes(u.id) ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-[var(--bg-page)] text-[var(--text-heading)] border border-[var(--border-subtle)]">
                      {u.roleTier || u.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-xs">
                  <p className="text-[var(--text-body)] font-medium">{u.title}</p>
                  <p className="text-[var(--text-muted)] text-[11px]">
                    Squad: <strong className="text-[var(--text-heading)]">{squadObj?.name || 'General Core'}</strong>
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {u.specialties?.slice(0, 3).map((spec) => (
                      <span key={spec} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-page)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Controls for CEO & Management */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                {/* 1-Click Generate Certificate / Letter Button */}
                {PERMISSIONS.canIssueCertificate(currentTier) && (
                  <button
                    onClick={() => handleOpenCertModal(u)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[var(--brand-teal)] text-white text-[11px] font-bold shadow-sm hover:bg-[var(--brand-teal-hover)] transition-all cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Generate Cert / Letter</span>
                  </button>
                )}

                {PERMISSIONS.isCeoMaster(currentUser) && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setSelectedUserForRole(u)}
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/30 text-[var(--brand-teal)] hover:bg-[var(--brand-teal)] hover:text-white text-[10px] font-bold transition-all cursor-pointer"
                    >
                      <Shield className="w-3 h-3" />
                      <span>Role</span>
                    </button>

                    <button
                      onClick={() => setResetPwdUser(u)}
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] text-[10px] font-bold transition-all cursor-pointer"
                      title="Reset Password"
                    >
                      <Key className="w-3 h-3 text-amber-400" />
                    </button>

                    <button
                      onClick={() => toggleUserAccountStatus(u.id, 'CEO Discretion')}
                      className={`p-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                        isSuspended ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                      }`}
                      title={isSuspended ? 'Activate Account' : 'Suspend Account'}
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 1-CLICK GENERATE CERTIFICATE MODAL ── */}
      {certModalUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleGenerateCertificateSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[var(--brand-teal)]" />
                <h3 className="font-bold text-base text-[var(--text-heading)]">
                  Generate Certificate for {certModalUser.name}
                </h3>
              </div>
              <button type="button" onClick={() => setCertModalUser(null)}><X className="w-5 h-5" /></button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex items-center space-x-3">
              <img src={certModalUser.avatarUrl} alt={certModalUser.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-bold text-xs text-[var(--text-heading)]">{certModalUser.name}</p>
                <p className="text-[11px] font-mono text-[var(--brand-teal)]">{certModalUser.memberId}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Select Certificate Template</label>
              <select
                required
                value={selectedTemplateId}
                onChange={(e) => {
                  setSelectedTemplateId(e.target.value);
                  const tpl = certificateTemplates.find(t => t.id === e.target.value);
                  if (tpl?.defaultDuration) setCustomDuration(tpl.defaultDuration);
                }}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] font-semibold"
              >
                {certificateTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.documentTitle})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Designation / Role Title</label>
                <input
                  type="text"
                  required
                  value={customRoleTitle}
                  onChange={(e) => setCustomRoleTitle(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Duration Tag</label>
                <input
                  type="text"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  placeholder="e.g. 45 Days (Remote)"
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Squad / Scope Reference</label>
              <input
                type="text"
                value={customClient}
                onChange={(e) => setCustomClient(e.target.value)}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
              <button type="button" onClick={() => setCertModalUser(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)]">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold shadow-md">Generate & Open Preview</button>
            </div>
          </form>
        </div>
      )}

      {/* ── GENERATED CERTIFICATE PREVIEW MODAL ── */}
      {generatedCertPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] print:hidden">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[var(--brand-teal)]" />
                <h3 className="font-bold text-lg text-[var(--text-heading)]">
                  Generated Document: {generatedCertPreview.memberName}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={async () => {
                    if (!generatedCertPreview) return;
                    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://digihust.com';
                    const verifyUrl = `${origin}/verify/${generatedCertPreview.id}`;
                    const matchingTpl = certificateTemplates.find(t => t.id === generatedCertPreview.templateId);
                    const pdfConfig = generatedCertPreview.pdfConfig || matchingTpl?.pdfConfig;

                    let pdfBytes: Uint8Array;
                    if (pdfConfig?.backgroundPdfBase64) {
                      pdfBytes = await stampCustomPdfTemplate(pdfConfig.backgroundPdfBase64, generatedCertPreview, verifyUrl, pdfConfig);
                    } else {
                      pdfBytes = await generateBuiltInCertificatePdf(generatedCertPreview, verifyUrl);
                    }
                    const safeName = `${generatedCertPreview.memberName.replace(/\s+/g, '_')}_${(generatedCertPreview.documentTitle || generatedCertPreview.type).replace(/\s+/g, '_')}`;
                    downloadPdfFile(pdfBytes, safeName);
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[var(--brand-teal-hover)]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Stamped PDF</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs font-bold shadow-sm cursor-pointer hover:bg-[var(--bg-subtle)]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setGeneratedCertPreview(null)}
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Letterhead Render */}
            <div className="flex justify-center bg-slate-100 p-4 sm:p-6 rounded-2xl overflow-x-auto">
              <CertificatePrintView 
                certificate={generatedCertPreview} 
                verificationUrl={generatedCertPreview?.id ? `${origin}/verify/${generatedCertPreview.id}` : undefined} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Account Modal (CEO Authority) */}
      {createAccountModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-[var(--brand-teal)]" />
                <h3 className="font-bold text-base text-[var(--text-heading)]">Create New Staff Account</h3>
              </div>
              <button onClick={() => setCreateAccountModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            {createFeedback && (
              <div className={`mb-4 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                createFeedback.success ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}>
                {createFeedback.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{createFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleCreateAccountSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newAccEmail}
                  onChange={(e) => setNewAccEmail(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Role Tier</label>
                  <select
                    value={newAccRoleTier}
                    onChange={(e) => setNewAccRoleTier(e.target.value as UserRoleTier)}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                  >
                    <option value="member">Member Specialist</option>
                    <option value="intern">Intern Specialist</option>
                    <option value="group_leader">Squad Lead</option>
                    <option value="manager">Operations Manager</option>
                    <option value="ceo">CEO / Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Squad</label>
                  <select
                    value={newAccSquad}
                    onChange={(e) => setNewAccSquad(e.target.value as GroupId)}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                  >
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name.split('&')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Professional Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Architect"
                  value={newAccTitle}
                  onChange={(e) => setNewAccTitle(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Initial Password</label>
                <input
                  type="password"
                  placeholder="Leave blank for auto-generated password"
                  value={newAccPassword}
                  onChange={(e) => setNewAccPassword(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                <button type="button" onClick={() => setCreateAccountModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)]">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal (CEO Authority) */}
      {resetPwdUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleResetPasswordSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-bold text-base text-[var(--text-heading)]">Reset Password for {resetPwdUser.name}</h3>
              <button type="button" onClick={() => setResetPwdUser(null)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Member ID: <strong className="text-[var(--brand-teal)] font-mono">{resetPwdUser.memberId}</strong>
            </p>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPlainPwd}
                onChange={(e) => setNewPlainPwd(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t border-[var(--border-subtle)]">
              <button type="button" onClick={() => setResetPwdUser(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)]">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold">Apply Password</button>
            </div>
          </form>
        </div>
      )}

      {/* Role Distribution Modal (CEO Authority) */}
      {selectedUserForRole && (
        <RoleManagementModal
          user={selectedUserForRole}
          onClose={() => setSelectedUserForRole(null)}
        />
      )}

      {/* Bulk Import Modal */}
      {isImportOpen && (
        <BulkImportModal onClose={() => setIsImportOpen(false)} />
      )}

    </div>
  );
};
