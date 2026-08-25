import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { User, GroupId, UserRole, UserStatus } from '../../../types';

interface PeopleDirectoryProps {
  onSelectUser: (user: User) => void;
  onOpenQuickInvite: () => void;
}

export const PeopleDirectory: React.FC<PeopleDirectoryProps> = ({
  onSelectUser,
  onOpenQuickInvite,
}) => {
  const { users, groups, currentUser, bulkUpdateStatus, bulkReassignSquad } = useApp();

  const isManagement = currentUser.role === 'management';
  const isLeader = currentUser.role === 'group_leader';

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [squadFilter, setSquadFilter] = useState<string>(isLeader && currentUser.groupId ? currentUser.groupId : 'all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'earnings' | 'projects' | 'rating' | 'joined'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Selected row IDs for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusModal, setBulkStatusModal] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<UserStatus>('active');
  const [bulkReason, setBulkReason] = useState('');
  const [bulkSquadModal, setBulkSquadModal] = useState(false);
  const [bulkSquad, setBulkSquad] = useState<GroupId>('tech');

  // Filtered and Sorted Users
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
      let valA: any = a.name.toLowerCase();
      let valB: any = b.name.toLowerCase();

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
  }, [users, searchTerm, roleFilter, squadFilter, statusFilter, sortField, sortAsc, isLeader, currentUser]);

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
      alert('A reason is required for bulk status audit logging.');
      return;
    }
    bulkUpdateStatus(selectedIds, bulkStatus, bulkReason, currentUser.name);
    setBulkStatusModal(false);
    setSelectedIds([]);
    setBulkReason('');
  };

  const handleBulkSquadApply = () => {
    bulkReassignSquad(selectedIds, bulkSquad);
    setBulkSquadModal(false);
    setSelectedIds([]);
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
          <table className="w-full text-left border-collapse text-xs">
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
                    setSortField('earnings');
                    setSortAsc(!sortAsc);
                  }}
                  className="p-4 cursor-pointer hover:text-[var(--text-heading)] text-right"
                >
                  <span className="flex items-center justify-end gap-1">
                    <span>Total Earned</span>
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
                          <img
                            src={person.avatarUrl}
                            alt={person.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#1e4a5d]"
                          />
                          <div>
                            <p className="font-bold text-[var(--text-heading)] text-sm">{person.name}</p>
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

                      {/* Total Earned */}
                      <td className="p-4 text-right font-extrabold text-[var(--text-heading)]">
                        ${person.totalEarnings.toLocaleString()}
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
                        <button
                          onClick={() => onSelectUser(person)}
                          className="px-3 py-1 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-body)] transition-colors"
                        >
                          Profile
                        </button>
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
