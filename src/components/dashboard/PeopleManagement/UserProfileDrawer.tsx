import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Star,
  Award,
  DollarSign,
  Calendar,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  History,
  MessageSquare,
  Tag,
  Lock,
  Upload,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { User, UserRole, UserStatus, GroupId, SplitOverride } from '../../../types';
import { PRESET_AVATARS } from '../../portal/PortalNavbar';
import { compressAvatarFile } from '../../../lib/utils';

interface UserProfileDrawerProps {
  user: User | null;
  onClose: () => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({ user, onClose }) => {
  const {
    currentUser,
    groups,
    projects,
    payouts,
    updateUserProfile,
    changeUserStatus,
    addUserNote,
    deleteUserNote,
    setUserSplitOverride,
    reassignUserSquad,
    changeUserRole,
    deleteUserAccount,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'workload' | 'financials' | 'history' | 'notes' | 'documents'>('overview');

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editHourlyRate, setEditHourlyRate] = useState<number>(0);
  const [editBio, setEditBio] = useState('');
  const [editSpecialties, setEditSpecialties] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const drawerFileInputRef = React.useRef<HTMLInputElement>(null);

  // Status Change State
  const [newStatus, setNewStatus] = useState<UserStatus>('active');
  const [statusReason, setStatusReason] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Role / Squad Promotion Dialog State
  const [newRole, setNewRole] = useState<UserRole>('freelancer');
  const [newGroupId, setNewGroupId] = useState<GroupId>('tech');
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);

  // Note State
  const [noteText, setNoteText] = useState('');

  // Split Override State
  const [hasSplitOverride, setHasSplitOverride] = useState(false);
  const [overrideMgmt, setOverrideMgmt] = useState(15);
  const [overrideLdr, setOverrideLdr] = useState(25);
  const [overrideFl, setOverrideFl] = useState(60);

  if (!user) return null;

  const isManagement = currentUser.role === 'management';
  const isSelf = currentUser.id === user.id;
  const canEdit = isManagement || isSelf;

  // Pull active user projects
  const userProjects = projects.filter(
    (p) => p.assignedLeaderId === user.id || p.assignments.some((a) => a.freelancerId === user.id)
  );

  // Pull ledger payouts
  const userPayouts = payouts.filter((p) => p.userId === user.id);
  const totalEarned = userPayouts.reduce((acc, p) => acc + p.amount, 0) || user.totalEarnings;
  const pendingProjects = userProjects.filter((p) => p.status !== 'paid');

  const startEdit = () => {
    setEditTitle(user.title);
    setEditHourlyRate(user.hourlyRate || 30);
    setEditBio(user.bio || '');
    setEditSpecialties(user.specialties.join(', '));
    setEditPhone(user.phone || '');
    setEditAvatarUrl(user.avatarUrl || '');
    setIsEditing(true);
  };

  const saveEdit = () => {
    updateUserProfile(user.id, {
      title: editTitle,
      hourlyRate: editHourlyRate,
      bio: editBio,
      specialties: editSpecialties.split(',').map((s) => s.trim()).filter(Boolean),
      phone: editPhone,
      avatarUrl: editAvatarUrl || user.avatarUrl,
    });
    setIsEditing(false);
    showToast('Profile details updated successfully!', 'success');
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusReason.trim()) {
      showToast('A reason is required for status transition audits.', 'warning');
      return;
    }
    changeUserStatus(user.id, newStatus, statusReason, currentUser.name);
    setShowStatusModal(false);
    setStatusReason('');
  };

  const handleRoleSquadConfirm = () => {
    changeUserRole(user.id, newRole);
    reassignUserSquad(user.id, newGroupId);
    setShowRoleConfirm(false);
    showToast('Member role and squad updated.', 'success');
  };

  const handleDeleteMember = () => {
    if (confirm(`Are you sure you want to permanently remove ${user.name} from the portal? All assigned records will be updated.`)) {
      deleteUserAccount(user.id);
      onClose();
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addUserNote(user.id, noteText, currentUser.id, currentUser.name);
    setNoteText('');
  };

  const handleSaveSplitOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSplitOverride) {
      setUserSplitOverride(user.id, undefined);
    } else {
      setUserSplitOverride(user.id, {
        managementPct: overrideMgmt,
        leaderPct: overrideLdr,
        freelancerPct: overrideFl,
      });
    }
    alert('Split configuration updated.');
  };

  const getStatusBadge = (st: UserStatus) => {
    switch (st) {
      case 'active':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Active</span>;
      case 'on_leave':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">On Leave</span>;
      case 'suspended':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Suspended</span>;
      case 'pending_onboarding':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Pending Onboarding</span>;
      case 'inactive':
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-500/20 text-[var(--text-body)] border border-slate-500/30">Inactive</span>;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl bg-[var(--bg-page)] border-l border-[var(--border-subtle)] h-full flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header Banner */}
          <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] relative flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-4">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[var(--brand-teal)] shadow-lg flex-shrink-0"
              />
              <div className="flex-1 pr-8">
                <div className="flex items-center space-x-2 mb-1">
                  {user.memberId && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
                      {user.memberId}
                    </span>
                  )}
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-[var(--brand-teal)]/20 text-[var(--text-heading)] border border-[var(--brand-teal)]/40">
                    {user.role.replace('_', ' ')}
                  </span>
                  {getStatusBadge(user.status)}
                </div>
                <h2 className="font-display font-extrabold text-2xl text-[var(--text-heading)]">{user.name}</h2>
                <p className="text-xs text-[var(--text-body)] font-medium">{user.title}</p>
                <div className="flex items-center space-x-4 text-[11px] text-[var(--text-muted)] mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Joined: {user.joinedAt || '2024-06-10'}</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-emerald-400" />
                    <span>{user.rating} CSAT</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Bar for Management */}
            {isManagement && (
              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-[var(--border-subtle)]/60">
                <button
                  onClick={() => {
                    setNewStatus(user.status);
                    setShowStatusModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle)] text-xs font-bold text-[var(--text-body)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                >
                  Change Status
                </button>
                <button
                  onClick={() => {
                    setNewRole(user.role);
                    setNewGroupId(user.groupId || 'tech');
                    setShowRoleConfirm(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle)] text-xs font-bold text-[var(--text-body)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                >
                  Promote / Move Squad
                </button>
                <button
                  onClick={startEdit}
                  className="px-3 py-1.5 rounded-lg bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleDeleteMember}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold text-rose-400 border border-rose-500/30 transition-colors cursor-pointer ml-auto flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Member</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[var(--border-subtle)] px-6 bg-[var(--bg-surface)] overflow-x-auto scrollbar-none flex-shrink-0">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'workload', label: `Workload (${userProjects.length})` },
              { id: 'history', label: `Status Logs (${user.statusHistory?.length || 0})` },
              { id: 'notes', label: `Admin Notes (${user.notes?.length || 0})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-3 px-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                  activeTab === t.id
                    ? 'text-[var(--text-heading)] border-[var(--brand-teal)]'
                    : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-body)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* ── TAB 1: OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4 bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-subtle)]">
                    <h4 className="text-xs font-bold text-[var(--text-heading)] uppercase tracking-wider">Edit Profile Details</h4>
                    <div className="p-3.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-3">
                      <label className="block text-[11px] font-bold text-[var(--brand-teal)] uppercase">Profile Avatar Picture</label>
                      <div className="flex items-center space-x-3">
                        <img
                          src={editAvatarUrl || user.avatarUrl}
                          alt="Avatar Preview"
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-[var(--brand-teal)]/40 shadow"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap gap-2">
                            <input
                              type="file"
                              ref={drawerFileInputRef}
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  showToast('Optimizing and loading photo...', 'info');
                                  const optimizedUrl = await compressAvatarFile(file, 320, 0.85);
                                  setEditAvatarUrl(optimizedUrl);
                                  showToast('Photo optimized & loaded successfully!', 'success');
                                } catch (err) {
                                  console.error('Photo optimization error:', err);
                                  showToast('Failed to load image. Please try another.', 'error');
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => drawerFileInputRef.current?.click()}
                              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-[11px] font-bold cursor-pointer transition-colors"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload Photo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const initialsUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1F7A8C&color=fff&size=256`;
                                setEditAvatarUrl(initialsUrl);
                              }}
                              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-[11px] font-medium cursor-pointer hover:bg-[var(--bg-subtle)]"
                            >
                              <RefreshCw className="w-3 h-3 text-[var(--brand-teal)]" />
                              <span>Use Initials</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Preset Avatar Selection */}
                      <div className="grid grid-cols-6 gap-1.5 pt-1">
                        {PRESET_AVATARS.slice(0, 6).map((avatar, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditAvatarUrl(avatar)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                              editAvatarUrl === avatar ? 'border-[var(--brand-teal)] ring-1 ring-[var(--brand-teal)]' : 'border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/50'
                            }`}
                          >
                            <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>

                      <input
                        type="url"
                        value={editAvatarUrl}
                        onChange={(e) => setEditAvatarUrl(e.target.value)}
                        placeholder="Or paste image URL (https://...)"
                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-[11px] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] mb-1">Job Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] mb-1">Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] mb-1">Skills & Specialties (comma separated)</label>
                      <input
                        type="text"
                        value={editSpecialties}
                        onChange={(e) => setEditSpecialties(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] mb-1">Bio</label>
                      <textarea
                        rows={3}
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs text-[var(--text-body)]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="px-4 py-1.5 rounded-lg bg-[var(--brand-teal)] text-white font-bold text-xs"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Performance Stat Strip */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Client CSAT</span>
                        <p className="font-display font-extrabold text-lg text-amber-400 mt-0.5">
                          {user.rating || 5.0} / 5.0
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">On-Time %</span>
                        <p className="font-display font-extrabold text-lg text-emerald-400 mt-0.5">
                          {user.onTimeDeliveryPct || 98}%
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Projects</span>
                        <p className="font-display font-extrabold text-lg text-purple-400 mt-0.5">
                          {user.completedProjectsCount}
                        </p>
                      </div>
                    </div>

                    {/* Contact & Verification info */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 text-xs">
                      <h4 className="font-bold text-[var(--text-heading)] flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-[var(--brand-teal)]" />
                        <span>Identity & Credentials</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[var(--text-body)]">
                        <div>
                          <span className="text-[var(--text-dim)] block">Email Address:</span>
                          <span className="font-semibold text-[var(--text-heading)]">{user.email}</span>
                        </div>
                        <div>
                          <span className="text-[var(--text-dim)] block">Phone / WhatsApp:</span>
                          <span className="font-semibold text-[var(--text-heading)]">{user.phone || '+92 300 0000000'}</span>
                        </div>
                        <div>
                          <span className="text-[var(--text-dim)] block">Digiskill Certificate:</span>
                          <span className="font-semibold text-[var(--text-heading)]">{user.digiskillBatch || 'Verified Alumnus'}</span>
                        </div>
                        <div>
                          <span className="text-[var(--text-dim)] block">Hourly Rate:</span>
                          <span className="font-semibold text-emerald-400">${user.hourlyRate || 30}/hr</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {user.bio && (
                      <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs">
                        <h4 className="font-bold text-[var(--text-heading)] mb-2">Professional Bio</h4>
                        <p className="text-[var(--text-body)] leading-relaxed">{user.bio}</p>
                      </div>
                    )}

                    {/* Skills Tags */}
                    <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                      <h4 className="text-xs font-bold text-[var(--text-heading)] mb-3 flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-[var(--brand-teal)]" />
                        <span>Verified Digiskill Skillsets</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="px-2.5 py-1 rounded-lg bg-[var(--bg-page)] text-[var(--text-body)] border border-[var(--border-subtle)] text-xs font-semibold"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── TAB 2: ACTIVE WORKLOAD ── */}
            {activeTab === 'workload' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[var(--text-heading)] uppercase tracking-wider">
                    Assigned Projects & Deliverables
                  </h4>
                  <Link to="/dashboard" className="text-xs font-bold text-[var(--text-heading)] hover:underline flex items-center gap-1">
                    <span>Open Kanban Board</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {userProjects.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs">
                    No active kanban projects currently assigned to this member.
                  </div>
                ) : (
                  userProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
                            {p.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h5 className="font-bold text-sm text-[var(--text-heading)] mt-1">{p.title}</h5>
                        <p className="text-xs text-[var(--text-muted)]">Client: {p.clientName}</p>
                      </div>
                      <Link
                        to="/portal/assignments"
                        className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle)] text-xs font-bold text-[var(--text-body)] border border-[var(--border-subtle)] transition-colors"
                      >
                        View Project
                      </Link>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── TAB 3: STATUS & AUDIT HISTORY ── */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[var(--text-heading)] uppercase tracking-wider">
                  Audit Trail & Status Transitions
                </h4>

                {(!user.statusHistory || user.statusHistory.length === 0) ? (
                  <div className="p-6 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs">
                    No status change events logged for this record.
                  </div>
                ) : (
                  <div className="relative border-l-2 border-[var(--border-subtle)] ml-3 pl-4 space-y-4">
                    {user.statusHistory.map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[var(--brand-teal)] border-2 border-[#071e26]" />
                        <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs">
                          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-1">
                            <span className="font-bold text-[var(--text-heading)]">
                              {item.from.replace('_', ' ')} → <span className="text-[var(--text-heading)]">{item.to.replace('_', ' ')}</span>
                            </span>
                            <span>{new Date(item.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-[var(--text-body)] font-medium">"{item.reason}"</p>
                          <p className="text-[10px] text-[var(--text-dim)] mt-1">Authorized by: {item.changedBy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 5: ADMIN NOTES ── */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[var(--text-heading)] uppercase tracking-wider">
                  Internal Management Notes
                </h4>

                {isManagement && (
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add an internal context note or warning..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs focus:outline-none focus:border-[var(--brand-teal)]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-xs"
                    >
                      Post Note
                    </button>
                  </form>
                )}

                {(!user.notes || user.notes.length === 0) ? (
                  <div className="p-6 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs">
                    No admin notes written yet.
                  </div>
                ) : (
                  user.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs flex justify-between items-start gap-3"
                    >
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-bold text-[var(--text-heading)]">{note.authorName}</span>
                          <span className="text-[10px] text-[var(--text-dim)]">
                            {new Date(note.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[var(--text-body)] leading-relaxed">{note.text}</p>
                      </div>
                      {isManagement && (
                        <button
                          onClick={() => deleteUserNote(user.id, note.id)}
                          className="p-1 rounded text-[var(--text-dim)] hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </motion.div>

        {/* Status Transition Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <h3 className="font-bold text-lg text-[var(--text-heading)]">Transition User Status</h3>
              <p className="text-xs text-[var(--text-body)]">
                Updating status to <strong>{newStatus.toUpperCase()}</strong> requires a recorded justification for the audit trail.
              </p>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as UserStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs"
                >
                  <option value="active">Active & Available</option>
                  <option value="on_leave">On Leave</option>
                  <option value="suspended">Suspended (Record Preserved)</option>
                  <option value="pending_onboarding">Pending Onboarding</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Audit Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="e.g. Approved 2-week leave for university exams."
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-body)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStatusSubmit}
                  className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white font-bold text-xs"
                >
                  Confirm Transition
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Role / Squad Promotion Confirmation Dialog */}
        {showRoleConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center space-x-3 text-amber-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-bold text-lg text-[var(--text-heading)]">Reassign Role & Squad</h3>
              </div>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                Promoting or reassigning talent alters their default project management cut and squad reporting hierarchy.
              </p>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Target Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs"
                >
                  <option value="freelancer">Freelancer / Specialist</option>
                  <option value="intern">Intern Specialist</option>
                  <option value="group_leader">Group Leader</option>
                  <option value="management">Management Core</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Target Squad</label>
                <select
                  value={newGroupId}
                  onChange={(e) => setNewGroupId(e.target.value as GroupId)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRoleConfirm(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-body)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRoleSquadConfirm}
                  className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white font-bold text-xs"
                >
                  Apply Role & Squad
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </AnimatePresence>
  );
};
