import React, { useState } from 'react';
import { 
  Users, Mail, Shield, Send, CheckCircle2, AlertCircle, Plus, 
  FileSpreadsheet, Sparkles, Filter, Search, UserCheck, Key, Lock, History, ShieldCheck, Settings 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User as UserType, UserRoleTier, GroupId } from '../../types';
import { PERMISSIONS } from '../../lib/permissions';
import { BulkImportModal } from './BulkImportModal';
import { RoleManagementModal } from './RoleManagementModal';

export const PeopleDirectoryView: React.FC = () => {
  const { users, groups, currentTier, currentUser, sendBatchCredentials, auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSquad, setSelectedSquad] = useState<string>('all');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [credentialModalOpen, setCredentialModalOpen] = useState(false);
  const [auditLogModalOpen, setAuditLogModalOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<UserType | null>(null);
  const [dispatchResult, setDispatchResult] = useState<{ count: number; memberNames: string[] } | null>(null);

  // Determine which users are visible based on 4-Tier Access Matrix:
  // - CEO & Manager: All users
  // - Group Leader: Members in own squad
  // - Member: Self only
  const visibleUsers = users.filter((u) => {
    if (currentTier === 'ceo' || currentTier === 'manager') return true;
    if (currentTier === 'group_leader') return u.groupId === currentUser.groupId;
    return u.id === currentUser.id;
  });

  const filteredUsers = visibleUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.memberId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSquad = selectedSquad === 'all' || u.groupId === selectedSquad;
    return matchesSearch && matchesSquad;
  });

  // Calculate members pending credential dispatch
  const pendingCredentialsMembers = users.filter(u => u.credentialsSentAt === null || u.credentialsSentAt === undefined);

  const handleSendCredentialsConfirm = () => {
    const result = sendBatchCredentials();
    setDispatchResult(result);
  };

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
              : `Manage permanent DGH identities, roles, and automated credential dispatch.`}
          </p>
        </div>

        {/* Action Buttons (CEO & Manager only) */}
        {PERMISSIONS.canSendCredentials(currentTier) && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {PERMISSIONS.canViewAuditLogs(currentTier) && (
              <button
                onClick={() => setAuditLogModalOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 text-xs font-bold transition-all cursor-pointer"
              >
                <History className="w-4 h-4" />
                <span>Audit Logs ({auditLogs.length})</span>
              </button>
            )}

            <button
              onClick={() => setIsImportOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-xs font-bold text-[var(--text-heading)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[var(--brand-teal)]" />
              <span>Import Excel</span>
            </button>

            <button
              onClick={() => {
                setDispatchResult(null);
                setCredentialModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer relative"
            >
              <Key className="w-4 h-4" />
              <span>Send Credentials</span>
              {pendingCredentialsMembers.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white text-[var(--brand-teal)] text-[10px] font-black">
                  {pendingCredentialsMembers.length}
                </span>
              )}
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
          const hasCredentials = u.credentialsSentAt !== null && u.credentialsSentAt !== undefined;

          return (
            <div
              key={u.id}
              className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/40 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img src={u.avatarUrl} alt={u.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[var(--border-subtle)]" />
                    <div>
                      <h3 className="font-bold text-sm text-[var(--text-heading)]">{u.name}</h3>
                      <p className="text-[11px] font-mono text-[var(--brand-teal)] font-bold">{u.memberId || 'DGH2600000'}</p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-[var(--bg-page)] text-[var(--text-heading)] border border-[var(--border-subtle)]">
                    {u.roleTier || u.role}
                  </span>
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

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5">
                  {hasCredentials ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Credentials Active
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Key className="w-3.5 h-3.5" /> Credentials Pending
                    </span>
                  )}
                </div>

                {PERMISSIONS.canDistributeRoles(currentTier) && (
                  <button
                    onClick={() => setSelectedUserForRole(u)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/30 text-[var(--brand-teal)] hover:bg-[var(--brand-teal)] hover:text-white text-[10px] font-bold transition-all cursor-pointer"
                  >
                    <Shield className="w-3 h-3" />
                    <span>Manage Role</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Distribution Modal (CEO Authority) */}
      {selectedUserForRole && (
        <RoleManagementModal
          user={selectedUserForRole}
          onClose={() => setSelectedUserForRole(null)}
        />
      )}

      {/* Security Audit Logs Modal */}
      {auditLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">
                    Executive Security & Role Audit Trail
                  </h3>
                </div>
                <button
                  onClick={() => setAuditLogModalOpen(false)}
                  className="p-1 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                >
                  ✕
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2 font-mono text-xs pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-purple-400 uppercase tracking-wider">{log.action}</span>
                      <span className="text-[var(--text-muted)]">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-[var(--text-heading)] font-sans text-xs">{log.details}</p>
                    <div className="text-[10px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]">
                      Actor: {log.actorName} ({log.actorRole.toUpperCase()})
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end">
              <button
                onClick={() => setAuditLogModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold cursor-pointer"
              >
                Close Audit Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Send Credentials Modal */}
      {credentialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/40 flex items-center justify-center text-[var(--brand-teal)] mb-4">
              <Key className="w-6 h-6" />
            </div>

            <h3 className="font-display font-extrabold text-xl text-[var(--text-heading)] mb-2">
              Dispatch Member Credentials
            </h3>

            {dispatchResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>Successfully dispatched login credentials to {dispatchResult.count} new members!</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 text-xs text-[var(--text-muted)] bg-[var(--bg-page)] p-3 rounded-2xl border border-[var(--border-subtle)] font-mono">
                  {dispatchResult.memberNames.map((name, i) => (
                    <div key={i}>✓ {name}</div>
                  ))}
                </div>
                <button
                  onClick={() => setCredentialModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-[var(--text-body)] leading-relaxed mb-4">
                  {pendingCredentialsMembers.length > 0 ? (
                    <>
                      <strong className="text-[var(--text-heading)]">{pendingCredentialsMembers.length} members</strong> currently have not received login credentials. Pressing dispatch will securely generate temporary passwords, email portal access instructions, and stamp their records.
                    </>
                  ) : (
                    <>
                      All registered members currently have active credentials dispatched. No pending accounts were found.
                    </>
                  )}
                </p>

                {pendingCredentialsMembers.length > 0 && (
                  <div className="max-h-36 overflow-y-auto space-y-1 text-xs bg-[var(--bg-page)] p-3 rounded-2xl border border-[var(--border-subtle)] mb-5 font-mono">
                    {pendingCredentialsMembers.map((m) => (
                      <div key={m.id} className="flex items-center justify-between text-[var(--text-heading)]">
                        <span>{m.name}</span>
                        <span className="text-[var(--brand-teal)]">{m.memberId}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => setCredentialModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendCredentialsConfirm}
                    disabled={pendingCredentialsMembers.length === 0}
                    className="px-6 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    Dispatch to {pendingCredentialsMembers.length} Members
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {isImportOpen && (
        <BulkImportModal onClose={() => setIsImportOpen(false)} />
      )}

    </div>
  );
};
