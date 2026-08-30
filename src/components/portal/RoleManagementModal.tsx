import React, { useState } from 'react';
import { Shield, ShieldAlert, Check, AlertCircle, User, Users, Lock, History, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User as UserType, UserRoleTier, GroupId } from '../../types';

interface RoleManagementModalProps {
  user: UserType;
  onClose: () => void;
}

export const RoleManagementModal: React.FC<RoleManagementModalProps> = ({ user, onClose }) => {
  const { currentTier, groups, updateUserRoleWithAuth, updateUserSquadWithAuth, auditLogs } = useApp();
  const [selectedTier, setSelectedTier] = useState<UserRoleTier>(user.roleTier || 'member');
  const [selectedSquad, setSelectedSquad] = useState<GroupId | undefined>(user.groupId);
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  if (currentTier !== 'ceo') {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[var(--bg-surface)] border border-rose-500/30 rounded-3xl p-6 max-w-md w-full text-center">
          <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-[var(--text-heading)] mb-1">Access Prohibited</h3>
          <p className="text-xs text-[var(--text-body)] mb-4">
            Only Executive CEO authority can distribute, promote, or alter user roles and permissions.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  const userAuditLogs = (auditLogs || []).filter(log => log.targetId === user.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setFeedback({ success: false, message: 'Please provide a mandatory justification reason for the audit log.' });
      return;
    }

    if (selectedTier !== user.roleTier) {
      const res = updateUserRoleWithAuth(user.id, selectedTier, reason);
      if (!res.success) {
        setFeedback({ success: false, message: res.error || 'Failed to update role tier.' });
        return;
      }
    }

    if (selectedSquad !== user.groupId) {
      const squadRes = updateUserSquadWithAuth(user.id, selectedSquad);
      if (!squadRes.success) {
        setFeedback({ success: false, message: squadRes.error || 'Failed to update squad.' });
        return;
      }
    }

    setFeedback({ success: true, message: `Successfully updated permissions and squad for ${user.name}.` });
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[var(--brand-teal)]">{user.memberId}</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[var(--bg-page)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  Executive Governance
                </span>
              </div>
              <h2 className="font-display font-extrabold text-lg text-[var(--text-heading)]">
                Role & Permission Distribution: {user.name}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-heading)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div className={`mb-4 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            feedback.success
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
          }`}>
            {feedback.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Tier Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Assign Access Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { 
                  tier: 'ceo' as UserRoleTier, 
                  title: 'CEO / Executive', 
                  desc: 'Root governance, team supervision, role management, platform controls.', 
                  color: 'border-purple-500/40 text-purple-400' 
                },
                { 
                  tier: 'manager' as UserRoleTier, 
                  title: 'Operations Manager', 
                  desc: 'Lead intake, team allocation, applicants review, certificate issuing.', 
                  color: 'border-blue-500/40 text-blue-400' 
                },
                { 
                  tier: 'group_leader' as UserRoleTier, 
                  title: 'Squad Group Leader', 
                  desc: 'Sanitized brief execution, sub-task manager, squad announcements.', 
                  color: 'border-cyan-500/40 text-cyan-400' 
                },
                { 
                  tier: 'member' as UserRoleTier, 
                  title: 'Domain Specialist Member', 
                  desc: 'Task execution, staging deliverable submissions, verified credentials.', 
                  color: 'border-emerald-500/40 text-emerald-400' 
                },
                { 
                  tier: 'intern' as UserRoleTier, 
                  title: 'Intern Specialist', 
                  desc: 'Learning tracks, supervised sprint tasks, skill development & mentorship.', 
                  color: 'border-amber-500/40 text-amber-400' 
                },
              ].map((t) => {
                const isSelected = selectedTier === t.tier;
                return (
                  <div
                    key={t.tier}
                    onClick={() => setSelectedTier(t.tier)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[var(--brand-teal-subtle)] border-[var(--brand-teal)] shadow-md ring-1 ring-[var(--brand-teal)]/30'
                        : 'bg-[var(--bg-page)] border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[var(--text-heading)]">{t.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[var(--brand-teal)]" />}
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] leading-tight">{t.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Squad Allocation */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Squad Department Allocation
            </label>
            <select
              value={selectedSquad || ''}
              onChange={(e) => setSelectedSquad((e.target.value as GroupId) || undefined)}
              className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
            >
              <option value="">No Specific Squad (General Staff)</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Mandatory Reason for Audit */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Mandatory Governance Justification (Audit Log)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Promoted to Tech Squad Leader following 6 successful high-load client project deliveries..."
              rows={2}
              required
              className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
            />
          </div>

          {/* User Permission History Audit Log */}
          {userAuditLogs.length > 0 && (
            <div className="pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[var(--text-muted)] mb-2">
                <History className="w-3.5 h-3.5" />
                <span>Historical Permission Audit Log</span>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-1 bg-[var(--bg-page)] p-2.5 rounded-2xl border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-muted)]">
                {userAuditLogs.map((log) => (
                  <div key={log.id} className="pb-1 border-b border-[var(--border-subtle)] last:border-0">
                    <span className="text-[var(--text-heading)] font-semibold">{new Date(log.timestamp).toLocaleDateString()}</span>: {log.details}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Authorize & Apply Role Change
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
