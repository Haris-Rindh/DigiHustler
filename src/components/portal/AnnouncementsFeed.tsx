import React, { useState } from 'react';
import { Bell, Plus, Shield, MessageSquare, Megaphone, Trash2, Calendar, User, Check, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Announcement, AnnouncementScope, GroupId } from '../../types';
import { PERMISSIONS } from '../../lib/permissions';

export const AnnouncementsFeed: React.FC = () => {
  const { announcements, currentTier, currentUser, groups, postAnnouncement, deleteAnnouncement } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'global' | 'group'>('all');
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [scope, setScope] = useState<AnnouncementScope>('global');
  const [targetGroupId, setTargetGroupId] = useState<GroupId>('tech');

  const canPostGlobal = PERMISSIONS.canPostGlobalAnnouncement(currentTier);
  const canPostGroup = PERMISSIONS.canPostGroupAnnouncement(currentTier, currentUser.groupId);
  const canPostAny = canPostGlobal || canPostGroup;

  // Filter announcements for current viewer:
  // - Global announcements: visible to everyone
  // - Group announcements: visible if CEO/Manager OR if group matches user's squad
  const visibleAnnouncements = announcements.filter((ann) => {
    if (ann.scope === 'global') return true;
    if (currentTier === 'ceo' || currentTier === 'manager') return true;
    return ann.groupId === currentUser.groupId;
  }).filter((ann) => {
    if (selectedFilter === 'global') return ann.scope === 'global';
    if (selectedFilter === 'group') return ann.scope === 'group';
    return true;
  });

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    postAnnouncement({
      scope,
      groupId: scope === 'group' ? targetGroupId : undefined,
      title,
      body,
    });

    setTitle('');
    setBody('');
    setPostModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--brand-teal)] uppercase tracking-wider mb-1">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Internal Broadcast Network</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)]">
            Company & Squad Announcements
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-body)]">
            Official operational updates, sprint guidelines, and squad directives.
          </p>
        </div>

        {canPostAny && (
          <button
            onClick={() => setPostModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post Announcement</span>
          </button>
        )}
      </div>

      {/* Scope Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[var(--border-subtle)] pb-3">
        {[
          { id: 'all' as const, label: `All Broadcasts (${visibleAnnouncements.length})` },
          { id: 'global' as const, label: 'Company-Wide' },
          { id: 'group' as const, label: 'Squad Specific' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === tab.id
                ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {visibleAnnouncements.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <Bell className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
            <h3 className="font-bold text-sm text-[var(--text-heading)] mb-1">No Announcements Found</h3>
            <p className="text-xs text-[var(--text-muted)]">Check back later for official broadcasts from leadership.</p>
          </div>
        ) : (
          visibleAnnouncements.map((ann) => {
            const squadObj = groups.find(g => g.id === ann.groupId);
            const canDelete = currentTier === 'ceo' || ann.postedBy === currentUser.id;

            return (
              <div
                key={ann.id}
                className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/40 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      ann.scope === 'global'
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    }`}>
                      {ann.scope === 'global' ? 'GLOBAL BROADCAST' : `${squadObj?.name.split('&')[0] || ann.groupId} SQUAD`}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      {new Date(ann.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-1 rounded-lg text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-heading)] mb-2">
                  {ann.title}
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed mb-4">
                  {ann.body}
                </p>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                    <span>Posted by <strong className="text-[var(--text-heading)]">{ann.postedByName}</strong> ({ann.postedByRole.toUpperCase()})</span>
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">Read-Only Notice</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Post Announcement Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-display font-extrabold text-xl text-[var(--text-heading)] mb-1">
              Create Internal Announcement
            </h3>
            <p className="text-xs text-[var(--text-body)] mb-5">
              Broadcast an operational notice or sprint requirement across the staff network.
            </p>

            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Scope & Target Audience
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {canPostGlobal && (
                    <button
                      type="button"
                      onClick={() => setScope('global')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        scope === 'global'
                          ? 'bg-[var(--brand-teal)] text-white border-[var(--brand-teal)] shadow-sm'
                          : 'bg-[var(--bg-page)] border-[var(--border-subtle)] text-[var(--text-heading)]'
                      }`}
                    >
                      Global (Pre-Login Feed)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setScope('group')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      scope === 'group'
                        ? 'bg-[var(--brand-teal)] text-white border-[var(--brand-teal)] shadow-sm'
                        : 'bg-[var(--bg-page)] border-[var(--border-subtle)] text-[var(--text-heading)]'
                    }`}
                  >
                    Specific Squad
                  </button>
                </div>
              </div>

              {scope === 'group' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Select Target Squad
                  </label>
                  <select
                    value={targetGroupId}
                    onChange={(e) => setTargetGroupId(e.target.value as GroupId)}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next.js 15 Migration & Component Architecture"
                  required
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Message Content
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Provide comprehensive details and deadlines..."
                  rows={4}
                  required
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
