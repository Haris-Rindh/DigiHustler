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
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { User, UserRole, UserStatus, GroupId, SplitOverride } from '../../../types';

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
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'workload' | 'financials' | 'history' | 'notes' | 'documents'>('overview');

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editHourlyRate, setEditHourlyRate] = useState<number>(0);
  const [editBio, setEditBio] = useState('');
  const [editSpecialties, setEditSpecialties] = useState('');
  const [editPhone, setEditPhone] = useState('');

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
    setIsEditing(true);
  };

  const saveEdit = () => {
    updateUserProfile(user.id, {
      title: editTitle,
      hourlyRate: editHourlyRate,
      bio: editBio,
      specialties: editSpecialties.split(',').map((s) => s.trim()).filter(Boolean),
      phone: editPhone,
    });
    setIsEditing(false);
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusReason.trim()) {
      alert('A reason is required for status transition audits.');
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
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">Inactive</span>;
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
          className="relative w-full max-w-2xl bg-[#071e26] border-l border-[#1e4a5d] h-full flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header Banner */}
          <div className="p-6 border-b border-[#1e4a5d] bg-[#0d2833] relative flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-4">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#1a7a8c] shadow-lg flex-shrink-0"
              />
              <div className="flex-1 pr-8">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-[#1a7a8c]/20 text-[#bde0fe] border border-[#1a7a8c]/40">
                    {user.role.replace('_', ' ')}
                  </span>
                  {getStatusBadge(user.status)}
                </div>
                <h2 className="font-display font-extrabold text-2xl text-white">{user.name}</h2>
                <p className="text-xs text-slate-300 font-medium">{user.title}</p>
                <div className="flex items-center space-x-4 text-[11px] text-slate-400 mt-2">
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
              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-[#1e4a5d]/60">
                <button
                  onClick={() => {
                    setNewStatus(user.status);
                    setShowStatusModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 border border-white/10 transition-colors"
                >
                  Change Status
                </button>
                <button
                  onClick={() => {
                    setNewRole(user.role);
                    setNewGroupId(user.groupId || 'tech');
                    setShowRoleConfirm(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 border border-white/10 transition-colors"
                >
                  Promote / Move Squad
                </button>
                <button
                  onClick={startEdit}
                  className="px-3 py-1.5 rounded-lg bg-[#1a7a8c] hover:bg-[#156575] text-xs font-bold text-white shadow-sm transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#1e4a5d] px-6 bg-[#0a2530] overflow-x-auto scrollbar-none flex-shrink-0">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'workload', label: `Workload (${userProjects.length})` },
              { id: 'financials', label: 'Financials & Splits' },
              { id: 'history', label: `Status Logs (${user.statusHistory?.length || 0})` },
              { id: 'notes', label: `Admin Notes (${user.notes?.length || 0})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-3 px-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === t.id
                    ? 'text-[#bde0fe] border-[#1a7a8c]'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
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
                  <div className="space-y-4 bg-[#0d2833] p-5 rounded-2xl border border-[#1e4a5d]">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Edit Profile Details</h4>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Hourly Rate ($/hr)</label>
                      <input
                        type="number"
                        value={editHourlyRate}
                        onChange={(e) => setEditHourlyRate(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Skills & Specialties (comma separated)</label>
                      <input
                        type="text"
                        value={editSpecialties}
                        onChange={(e) => setEditSpecialties(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Bio</label>
                      <textarea
                        rows={3}
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 rounded-lg border border-[#1e4a5d] text-xs text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="px-4 py-1.5 rounded-lg bg-[#1a7a8c] text-white font-bold text-xs"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Performance Stat Strip */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-4 rounded-2xl bg-[#0d2833] border border-[#1e4a5d] text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Total Earned</span>
                        <p className="font-display font-extrabold text-lg text-[#bde0fe] mt-0.5">
                          ${totalEarned.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#0d2833] border border-[#1e4a5d] text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">On-Time %</span>
                        <p className="font-display font-extrabold text-lg text-emerald-400 mt-0.5">
                          {user.onTimeDeliveryPct || 98}%
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#0d2833] border border-[#1e4a5d] text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Projects</span>
                        <p className="font-display font-extrabold text-lg text-purple-400 mt-0.5">
                          {user.completedProjectsCount}
                        </p>
                      </div>
                    </div>

                    {/* Contact & Verification info */}
                    <div className="p-5 rounded-2xl bg-[#0d2833] border border-[#1e4a5d] space-y-3 text-xs">
                      <h4 className="font-bold text-white flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-[#1a7a8c]" />
                        <span>Identity & Credentials</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                        <div>
                          <span className="text-slate-500 block">Email Address:</span>
                          <span className="font-semibold text-white">{user.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Phone / WhatsApp:</span>
                          <span className="font-semibold text-white">{user.phone || '+92 300 0000000'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Digiskill Certificate:</span>
                          <span className="font-semibold text-[#bde0fe]">{user.digiskillBatch || 'Verified Alumnus'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Hourly Rate:</span>
                          <span className="font-semibold text-emerald-400">${user.hourlyRate || 30}/hr</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {user.bio && (
                      <div className="p-5 rounded-2xl bg-[#0d2833] border border-[#1e4a5d] text-xs">
                        <h4 className="font-bold text-white mb-2">Professional Bio</h4>
                        <p className="text-slate-300 leading-relaxed">{user.bio}</p>
                      </div>
                    )}

                    {/* Skills Tags */}
                    <div className="p-5 rounded-2xl bg-[#0d2833] border border-[#1e4a5d]">
                      <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-[#1a7a8c]" />
                        <span>Verified Digiskill Skillsets</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="px-2.5 py-1 rounded-lg bg-[#071e26] text-slate-200 border border-[#1e4a5d] text-xs font-semibold"
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
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Assigned Projects & Deliverables
                  </h4>
                  <Link to="/dashboard" className="text-xs font-bold text-[#bde0fe] hover:underline flex items-center gap-1">
                    <span>Open Kanban Board</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {userProjects.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#0d2833] border border-[#1e4a5d] text-slate-400 text-xs">
                    No active kanban projects currently assigned to this member.
                  </div>
                ) : (
                  userProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-[#0d2833] border border-[#1e4a5d] flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
                            {p.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Net: ${p.netRevenue.toLocaleString()}</span>
                        </div>
                        <h5 className="font-bold text-sm text-white mt-1">{p.title}</h5>
                        <p className="text-xs text-slate-400">Client: {p.clientName}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 border border-white/10 transition-colors"
                      >
                        View Project
                      </Link>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── TAB 3: FINANCIALS & SPLITS ── */}
            {activeTab === 'financials' && (
              <div className="space-y-6">
                <form onSubmit={handleSaveSplitOverride} className="p-5 rounded-2xl bg-[#0d2833] border border-[#1e4a5d] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#1a7a8c]" />
                        <span>Individual Split Override Configuration</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Customize compensation splits for this individual rather than applying global defaults.
                      </p>
                    </div>
                    {isManagement && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasSplitOverride}
                          onChange={(e) => setHasSplitOverride(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1a7a8c]"></div>
                      </label>
                    )}
                  </div>

                  {hasSplitOverride && isManagement && (
                    <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Management Cut %</label>
                        <input
                          type="number"
                          value={overrideMgmt}
                          onChange={(e) => setOverrideMgmt(Number(e.target.value))}
                          className="w-full text-center py-1.5 rounded-lg bg-[#071e26] border border-[#1e4a5d] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Leader Cut %</label>
                        <input
                          type="number"
                          value={overrideLdr}
                          onChange={(e) => setOverrideLdr(Number(e.target.value))}
                          className="w-full text-center py-1.5 rounded-lg bg-[#071e26] border border-[#1e4a5d] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Freelancer Cut %</label>
                        <input
                          type="number"
                          value={overrideFl}
                          onChange={(e) => setOverrideFl(Number(e.target.value))}
                          className="w-full text-center py-1.5 rounded-lg bg-[#071e26] border border-[#1e4a5d] text-white"
                        />
                      </div>
                    </div>
                  )}

                  {isManagement && (
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-xs font-bold text-white transition-colors"
                      >
                        Save Split Configuration
                      </button>
                    </div>
                  )}
                </form>

                {/* Ledger Payout Records */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Ledger Payout History ({userPayouts.length})
                    </h4>
                    <Link to="/ledger" className="text-xs font-bold text-[#bde0fe] hover:underline flex items-center gap-1">
                      <span>Open Platform Ledger</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {userPayouts.length === 0 ? (
                    <div className="p-6 text-center rounded-2xl bg-[#0d2833] border border-[#1e4a5d] text-slate-400 text-xs">
                      No disbursed payouts recorded in ledger yet.
                    </div>
                  ) : (
                    userPayouts.map((payout) => (
                      <div
                        key={payout.id}
                        className="p-4 rounded-2xl bg-[#0d2833] border border-[#1e4a5d] flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{payout.projectTitle}</p>
                          <p className="text-[11px] text-slate-400">{payout.roleDescription}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-emerald-400">+${payout.amount.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-500">{new Date(payout.paidAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 4: STATUS & AUDIT HISTORY ── */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Audit Trail & Status Transitions
                </h4>

                {(!user.statusHistory || user.statusHistory.length === 0) ? (
                  <div className="p-6 text-center rounded-2xl bg-[#0d2833] border border-[#1e4a5d] text-slate-400 text-xs">
                    No status change events logged for this record.
                  </div>
                ) : (
                  <div className="relative border-l-2 border-[#1e4a5d] ml-3 pl-4 space-y-4">
                    {user.statusHistory.map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#1a7a8c] border-2 border-[#071e26]" />
                        <div className="p-3.5 rounded-xl bg-[#0d2833] border border-[#1e4a5d] text-xs">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                            <span className="font-bold text-white">
                              {item.from.replace('_', ' ')} → <span className="text-[#bde0fe]">{item.to.replace('_', ' ')}</span>
                            </span>
                            <span>{new Date(item.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-slate-300 font-medium">"{item.reason}"</p>
                          <p className="text-[10px] text-slate-500 mt-1">Authorized by: {item.changedBy}</p>
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
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Internal Management Notes
                </h4>

                {isManagement && (
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add an internal context note or warning..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#0d2833] border border-[#1e4a5d] text-white text-xs focus:outline-none focus:border-[#1a7a8c]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-bold text-xs"
                    >
                      Post Note
                    </button>
                  </form>
                )}

                {(!user.notes || user.notes.length === 0) ? (
                  <div className="p-6 text-center rounded-2xl bg-[#0d2833] border border-[#1e4a5d] text-slate-400 text-xs">
                    No admin notes written yet.
                  </div>
                ) : (
                  user.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-2xl bg-[#0d2833] border border-[#1e4a5d] text-xs flex justify-between items-start gap-3"
                    >
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-bold text-white">{note.authorName}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(note.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{note.text}</p>
                      </div>
                      {isManagement && (
                        <button
                          onClick={() => deleteUserNote(user.id, note.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400"
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
              className="bg-[#0d2833] border border-[#1e4a5d] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <h3 className="font-bold text-lg text-white">Transition User Status</h3>
              <p className="text-xs text-slate-300">
                Updating status to <strong>{newStatus.toUpperCase()}</strong> requires a recorded justification for the audit trail.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as UserStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs"
                >
                  <option value="active">Active & Available</option>
                  <option value="on_leave">On Leave</option>
                  <option value="suspended">Suspended (Record Preserved)</option>
                  <option value="pending_onboarding">Pending Onboarding</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Audit Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="e.g. Approved 2-week leave for university exams."
                  className="w-full px-3 py-2 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#1e4a5d] text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStatusSubmit}
                  className="px-5 py-2 rounded-xl bg-[#1a7a8c] text-white font-bold text-xs"
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
              className="bg-[#0d2833] border border-[#1e4a5d] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center space-x-3 text-amber-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-bold text-lg text-white">Reassign Role & Squad</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Promoting or reassigning talent alters their default project management cut and squad reporting hierarchy.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Target Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs"
                >
                  <option value="freelancer">Freelancer / Specialist</option>
                  <option value="group_leader">Group Leader</option>
                  <option value="management">Management Core</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Target Squad</label>
                <select
                  value={newGroupId}
                  onChange={(e) => setNewGroupId(e.target.value as GroupId)}
                  className="w-full px-3 py-2 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs"
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
                  className="px-4 py-2 rounded-xl border border-[#1e4a5d] text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRoleSquadConfirm}
                  className="px-5 py-2 rounded-xl bg-[#1a7a8c] text-white font-bold text-xs"
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
