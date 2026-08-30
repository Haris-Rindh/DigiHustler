import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  UserPlus,
  Download,
  MoreHorizontal,
  Star,
  Shield,
  Layers,
  CheckSquare,
  Square,
  ArrowUpDown,
  Mail,
  Phone,
  AlertCircle,
  Sparkles,
  Trash2,
  Pin,
  PinOff,
  Crown,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { User, GroupId, UserRole, UserStatus } from '../../../types';
import { realtimeSync } from '../../../lib/realtimeSync';

interface PeopleDirectoryProps {
  onSelectUser: (user: User) => void;
  onOpenQuickInvite: () => void;
}

export const PeopleDirectory: React.FC<PeopleDirectoryProps> = ({
  onSelectUser,
  onOpenQuickInvite,
}) => {
  const { users, groups, currentUser, currentTier, deleteUserAccount, showToast } = useApp();

  const isManagement = currentTier === 'ceo' || currentTier === 'manager' || currentUser.role === 'management';
  const isLeader = currentTier === 'group_leader' || currentUser.role === 'group_leader';

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [squadFilter, setSquadFilter] = useState<string>(isLeader && currentUser.groupId ? currentUser.groupId : 'all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'earnings' | 'projects' | 'rating' | 'joined'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Pinned Member IDs (Saved in Local Storage & Live Synced)
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('digihust_pinned_members');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const unsub = realtimeSync.subscribe((payload) => {
      if (payload.type === 'PINNED_UPDATED' && Array.isArray(payload.data)) {
        setPinnedIds(payload.data);
      }
    });
    return unsub;
  }, []);

  const togglePinUser = (userId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPinnedIds((prev) => {
      const isPinned = prev.includes(userId);
      const updated = isPinned ? prev.filter((id) => id !== userId) : [...prev, userId];
      try {
        localStorage.setItem('digihust_pinned_members', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save pinned members:', err);
      }
      realtimeSync.broadcast('PINNED_UPDATED', updated);
      showToast(isPinned ? 'Member unpinned.' : 'Member pinned to top.', 'info');
      return updated;
    });
  };

  // Helper to check CEO & Co-founders (Permanent Top Tier)
  const isCeoOrFounder = (u: User) => {
    if (u.isCeoMaster || u.roleTier === 'ceo') return true;
    const t = (u.title || '').toLowerCase();
    const r = (u.role || '').toLowerCase();
    return t.includes('ceo') || t.includes('founder') || t.includes('co-founder') || r.includes('ceo');
  };

  // Selected row IDs for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusModal, setBulkStatusModal] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<UserStatus>('active');
  const [bulkReason, setBulkReason] = useState('');
  const [bulkSquadModal, setBulkSquadModal] = useState(false);
  const [bulkSquad, setBulkSquad] = useState<GroupId>('tech');

  // Filtered and Sorted Users (CEO & Co-Founders first, then Pinned, then sorted)
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Permission scoping: Leader can only view own squad
      if (isLeader && currentUser.groupId && u.groupId !== currentUser.groupId) {
        return false;
      }

      // Search match
      const term = searchTerm.toLowerCase();
      const matchSearch =
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.memberId && u.memberId.toLowerCase().includes(term)) ||
        u.title.toLowerCase().includes(term) ||
        u.specialties.some((s) => s.toLowerCase().includes(term));

      if (!matchSearch) return false;

      // Role filter
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;

      // Squad filter
      if (squadFilter !== 'all' && u.groupId !== squadFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;

      return true;
    }).sort((a, b) => {
      // 1. Leadership always top priority
      const aLeader = isCeoOrFounder(a);
      const bLeader = isCeoOrFounder(b);
      if (aLeader && !bLeader) return -1;
      if (!aLeader && bLeader) return 1;

      // 2. Pinned members next (in exact chronological order they were pinned)
      const aPinnedIdx = pinnedIds.indexOf(a.id);
      const bPinnedIdx = pinnedIds.indexOf(b.id);
      if (aPinnedIdx !== -1 && bPinnedIdx === -1) return -1;
      if (aPinnedIdx === -1 && bPinnedIdx !== -1) return 1;
      if (aPinnedIdx !== -1 && bPinnedIdx !== -1) return aPinnedIdx - bPinnedIdx;

      // 3. Chosen field sorting
      let valA: any = (a.name || '').toLowerCase();
      let valB: any = (b.name || '').toLowerCase();

      if (sortField === 'earnings') {
        valA = a.totalEarnings;
        valB = b.totalEarnings;
      } else if (sortField === 'projects') {
        valA = a.completedProjectsCount;
        valB = b.completedProjectsCount;
      } else if (sortField === 'rating') {
        valA = a.rating;
        valB = b.rating;
      } else if (sortField === 'joined') {
        valA = a.joinedAt || '';
        valB = b.joinedAt || '';
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [users, searchTerm, roleFilter, squadFilter, statusFilter, sortField, sortAsc, isLeader, currentUser, pinnedIds]);

  // Bulk Actions
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map((u) => u.id));
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkStatusApply = () => {
    if (!bulkReason.trim()) {
      showToast('A reason is required for bulk status audit logging.', 'warning');
      return;
    }
    bulkUpdateStatus(selectedIds, bulkStatus, bulkReason, currentUser.name);
    setBulkStatusModal(false);
    setSelectedIds([]);
    setBulkReason('');
    showToast('Member statuses updated.', 'success');
  };

  const handleBulkSquadApply = () => {
    bulkReassignSquad(selectedIds, bulkSquad);
    setBulkSquadModal(false);
    setSelectedIds([]);
    showToast('Squad reassignment complete.', 'success');
  };

  const exportToCSV = () => {
    const targetUsers = selectedIds.length > 0
      ? users.filter((u) => selectedIds.includes(u.id))
      : filteredUsers;

    const headers = ['ID', 'Name', 'Email', 'Role', 'Squad', 'Status', 'Specialties', 'Earnings', 'Rating'];
    const rows = targetUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.role,
      u.groupId || 'None',
      u.status,
      `"${u.specialties.join(', ')}"`,
      u.totalEarnings,
      u.rating,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `digihust_people_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (st: UserStatus) => {
    switch (st) {
      case 'active':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Active</span>;
      case 'on_leave':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">On Leave</span>;
      case 'suspended':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Suspended</span>;
      case 'pending_onboarding':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Pending Onboarding</span>;
      case 'inactive':
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-[var(--text-body)] border border-slate-500/30">Inactive</span>;
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Search & Action Bar */}
      <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-xl">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, role, or skill..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-body)] text-xs font-semibold focus:outline-none focus:border-[var(--brand-teal)]"
          >
            <option value="all">All Roles</option>
            <option value="management">Management</option>
            <option value="group_leader">Group Leaders</option>
            <option value="freelancer">Freelancers</option>
            <option value="intern">Interns</option>
          </select>

          {/* Squad Filter (Scoped if Leader) */}
          {!isLeader && (
            <select
              value={squadFilter}
              onChange={(e) => setSquadFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-body)] text-xs font-semibold focus:outline-none focus:border-[var(--brand-teal)]"
            >
              <option value="all">All Squads</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-body)] text-xs font-semibold focus:outline-none focus:border-[var(--brand-teal)]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="suspended">Suspended</option>
            <option value="pending_onboarding">Pending Onboarding</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] hover:bg-[var(--bg-subtle)] text-[var(--text-body)] text-xs font-bold transition-colors"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Quick Invite (Management Only) */}
          {isManagement && (
            <button
              onClick={onOpenQuickInvite}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md shadow-md transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite Talent</span>
            </button>
          )}
        </div>
      </div>

      {/* Bulk Action Strip (When records are selected) */}
      {selectedIds.length > 0 && isManagement && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-2xl bg-[var(--brand-teal)]/20 border border-[var(--brand-teal)]/40 flex flex-wrap items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center space-x-2 text-[var(--text-heading)] font-bold">
            <CheckSquare className="w-4 h-4" />
            <span>{selectedIds.length} person records selected</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setBulkStatusModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] font-bold"
            >
              Bulk Change Status
            </button>
            <button
              onClick={() => setBulkSquadModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] font-bold"
            >
              Bulk Reassign Squad
            </button>
            <button
              onClick={exportToCSV}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] font-bold"
            >
              Export Selected
            </button>
          </div>
        </motion.div>
      )}

      {/* People Table */}
      <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-muted)] font-bold uppercase tracking-wider text-[10px]">
                {isManagement && (
                  <th className="p-4 w-10 text-center">
                    <button onClick={toggleSelectAll}>
                      {selectedIds.length === filteredUsers.length && filteredUsers.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-[var(--brand-teal)]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                  </th>
                )}
                <th
                  onClick={() => {
                    setSortField('name');
                    setSortAsc(!sortAsc);
                  }}
                  className="p-4 cursor-pointer hover:text-[var(--text-heading)]"
                >
                  <span className="flex items-center gap-1">
                    <span>Name & Title</span>
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  </span>
                </th>
                <th className="p-4">Role</th>
                <th className="p-4">Squad</th>
                <th className="p-4">Status</th>
                <th className="p-4">Skills</th>
                <th
                  onClick={() => {
                    setSortField('projects');
                    setSortAsc(!sortAsc);
                  }}
                  className="p-4 cursor-pointer hover:text-[var(--text-heading)] text-center"
                >
                  <span className="flex items-center justify-center gap-1">
                    <span>Projects</span>
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  </span>
                </th>
                <th
                  onClick={() => {
                    setSortField('rating');
                    setSortAsc(!sortAsc);
                  }}
                  className="p-4 cursor-pointer hover:text-[var(--text-heading)] text-center"
                >
                  <span className="flex items-center justify-center gap-1">
                    <span>Rating</span>
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  </span>
                </th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e4a5d]/60 text-[var(--text-body)]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[var(--text-muted)]">
                    No matching persons found in the directory.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((person) => {
                  const group = groups.find((g) => g.id === person.groupId);
                  const isSelected = selectedIds.includes(person.id);

                  return (
                    <tr
                      key={person.id}
                      onClick={() => onSelectUser(person)}
                      className={`hover:bg-[var(--brand-teal)]/10 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[var(--brand-teal)]/15' : ''
                      }`}
                    >
                      {isManagement && (
                        <td
                          className="p-4 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectUser(person.id);
                          }}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[var(--brand-teal)]" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600" />
                          )}
                        </td>
                      )}

                      {/* Name & Avatar */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative shrink-0">
                            <img
                              src={person.avatarUrl}
                              alt={person.name}
                              className="w-9 h-9 rounded-xl object-cover ring-1 ring-[var(--border-subtle)]"
                            />
                            {isCeoOrFounder(person) && (
                              <span className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-amber-400 text-slate-950 shadow">
                                <Crown className="w-2.5 h-2.5 fill-current" />
                              </span>
                            )}
                            {!isCeoOrFounder(person) && pinnedIds.includes(person.id) && (
                              <span className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-[var(--brand-teal)] text-white shadow">
                                <Pin className="w-2.5 h-2.5 fill-current" />
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="font-bold text-[var(--text-heading)] text-sm">{person.name}</p>
                              {isCeoOrFounder(person) && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-400/15 text-amber-500 border border-amber-400/30 text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5">
                                  <Crown className="w-2.5 h-2.5" /> Leadership
                                </span>
                              )}
                              {!isCeoOrFounder(person) && pinnedIds.includes(person.id) && (
                                <span className="px-1.5 py-0.2 rounded bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--brand-teal)]/30 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-0.5">
                                  <Pin className="w-2.5 h-2.5 fill-current" /> Pinned
                                </span>
                              )}
                              {person.memberId && (
                                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
                                  {person.memberId}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[var(--text-muted)]">{person.title}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-body)] uppercase tracking-wide">
                          {person.role.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Squad */}
                      <td className="p-4">
                        {group ? (
                          <span className="text-xs font-semibold text-[var(--text-heading)]">
                            {group.name}
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--text-dim)]">Executive</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">{getStatusBadge(person.status)}</td>

                      {/* Skills */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {person.specialties.slice(0, 2).map((s) => (
                            <span
                              key={s}
                              className="px-1.5 py-0.5 rounded bg-[var(--bg-page)] text-[var(--text-body)] text-[10px] border border-[var(--border-subtle)]"
                            >
                              {s}
                            </span>
                          ))}
                          {person.specialties.length > 2 && (
                            <span className="text-[10px] text-[var(--text-dim)] font-bold">
                              +{person.specialties.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Completed Projects */}
                      <td className="p-4 text-center font-bold text-[var(--text-heading)]">
                        {person.completedProjectsCount || 0}
                      </td>

                      {/* Rating */}
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
                          <Star className="w-3 h-3 fill-emerald-400" />
                          <span>{person.rating}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Pin/Unpin Button for Management (Non-leadership members) */}
                          {isManagement && !isCeoOrFounder(person) && (
                            <button
                              onClick={(e) => togglePinUser(person.id, e)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                pinnedIds.includes(person.id)
                                  ? 'bg-[var(--brand-teal)] text-white border-[var(--brand-teal)]'
                                  : 'bg-[var(--bg-subtle)] hover:bg-[var(--bg-page)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                              }`}
                              title={pinnedIds.includes(person.id) ? 'Unpin member' : 'Pin member to top of directory'}
                            >
                              {pinnedIds.includes(person.id) ? (
                                <PinOff className="w-3.5 h-3.5" />
                              ) : (
                                <Pin className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => onSelectUser(person)}
                            className="px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-body)] hover:text-[var(--text-heading)] transition-colors cursor-pointer"
                            title={`View & edit ${person.name}'s profile`}
                          >
                            Profile
                          </button>
                          {isManagement && person.id !== currentUser.id && (
                            <button
                              onClick={() => {
                                if (confirm(`Permanently remove ${person.name} (${person.title || person.role}) from the platform database and website team roster?`)) {
                                  deleteUserAccount(person.id);
                                }
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                              title={`Remove ${person.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Status Modal */}
      {bulkStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-[var(--text-heading)]">Bulk Status Transition</h3>
            <p className="text-xs text-[var(--text-body)]">
              Update status for {selectedIds.length} selected person records.
            </p>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">New Status</label>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as UserStatus)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs"
              >
                <option value="active">Active & Available</option>
                <option value="on_leave">On Leave</option>
                <option value="suspended">Suspended</option>
                <option value="pending_onboarding">Pending Onboarding</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Audit Reason *</label>
              <textarea
                required
                rows={2}
                value={bulkReason}
                onChange={(e) => setBulkReason(e.target.value)}
                placeholder="e.g. Annual squad review re-certification."
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setBulkStatusModal(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-body)]"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkStatusApply}
                className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white font-bold text-xs"
              >
                Apply Bulk Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Squad Modal */}
      {bulkSquadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-[var(--text-heading)]">Bulk Squad Reassignment</h3>
            <p className="text-xs text-[var(--text-body)]">
              Reassign {selectedIds.length} selected persons to a new squad.
            </p>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Target Squad</label>
              <select
                value={bulkSquad}
                onChange={(e) => setBulkSquad(e.target.value as GroupId)}
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
                onClick={() => setBulkSquadModal(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-body)]"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSquadApply}
                className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white font-bold text-xs"
              >
                Apply Squad Move
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
