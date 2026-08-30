import React, { useState } from 'react';
import { 
  Bell, Plus, Shield, MessageSquare, Megaphone, Trash2, Calendar, 
  User, Check, X, Bold, Italic, List, Heading, Code, AlertTriangle, 
  Info, Sparkles, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Announcement, AnnouncementScope, GroupId } from '../../types';
import { PERMISSIONS } from '../../lib/permissions';

export const AnnouncementsFeed: React.FC = () => {
  const { announcements, currentTier, currentUser, groups, postAnnouncement, deleteAnnouncement, showToast } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'global' | 'group'>('all');
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [scope, setScope] = useState<AnnouncementScope>('global');
  const [targetGroupId, setTargetGroupId] = useState<GroupId>('tech');

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-xs text-[var(--text-muted)]">Loading announcements...</p>
      </div>
    );
  }

  const canPostGlobal = PERMISSIONS.canPostGlobalAnnouncement(currentTier);
  const canPostGroup = PERMISSIONS.canPostGroupAnnouncement(currentTier, currentUser.groupId);
  const canPostAny = canPostGlobal || canPostGroup;

  const visibleAnnouncements = (announcements || []).filter((ann) => {
    if (!ann) return false;
    if (ann.scope === 'global') return true;
    if (currentTier === 'ceo' || currentTier === 'manager') return true;
    return ann.groupId === currentUser.groupId;
  }).filter((ann) => {
    if (selectedFilter === 'global') return ann.scope === 'global';
    if (selectedFilter === 'group') return ann.scope === 'group';
    return true;
  });

  const insertFormatting = (prefix: string, suffix: string = '') => {
    setBody((prev) => prev + `${prefix}${suffix}`);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      showToast('Please enter both title and announcement body.', 'warning');
      return;
    }

    postAnnouncement({
      scope,
      groupId: scope === 'group' ? targetGroupId : undefined,
      title,
      body,
    });

    setTitle('');
    setBody('');
    setPostModalOpen(false);
    showToast('Announcement broadcasted successfully!', 'success');
  };

  const renderRichBody = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-2 text-xs sm:text-sm text-[var(--text-body)] leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-sm text-[var(--text-heading)] pt-2 pb-1 border-b border-[var(--border-subtle)]">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-display font-extrabold text-base text-[var(--text-heading)] pt-3 pb-1 border-b border-[var(--border-subtle)]">
                {line.replace('## ', '')}
              </h3>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-teal)] flex-shrink-0 mt-0.5" />
                <span>{line.replace(/^[-\*]\s+/, '')}</span>
              </div>
            );
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote key={idx} className="pl-3 border-l-2 border-[var(--brand-teal)] italic text-[var(--text-heading)] bg-[var(--bg-page)] py-1.5 rounded-r-xl">
                {line.replace('> ', '')}
              </blockquote>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }
          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
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
            Official operational updates, sprint guidelines, and squad directives with rich formatting.
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
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : 'bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border-[var(--border-subtle)]'
                    }`}>
                      {ann.scope === 'global' ? 'Company-Wide' : `${squadObj?.name || 'Squad'} Directive`}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(ann.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => {
                        if (confirm('Permanently delete this broadcast?')) {
                          deleteAnnouncement(ann.id);
                          showToast('Announcement deleted from broadcast network.', 'info');
                        }
                      }}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Broadcast"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)] mb-3">
                  {ann.title}
                </h3>

                <div className="bg-[var(--bg-page)] p-4 rounded-2xl border border-[var(--border-subtle)] mb-4">
                  {renderRichBody(ann.body)}
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                  <User className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                  <span>Broadcasted by: <strong className="text-[var(--text-heading)]">{ann.postedByName || 'Executive Leadership'}</strong></span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Post Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">
                Broadcast Announcement
              </h3>
              <button
                onClick={() => setPostModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-heading)] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        scope === 'global'
                          ? 'bg-[var(--brand-teal)] text-white border-[var(--brand-teal)] shadow-sm'
                          : 'bg-[var(--bg-page)] border-[var(--border-subtle)] text-[var(--text-heading)]'
                      }`}
                    >
                      Global (All Staff)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setScope('group')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
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
                  placeholder="e.g. Sprint Release & Production Standards"
                  required
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Message Content & Formatting
                  </label>
                  {/* Formatting Toolbar */}
                  <div className="flex items-center space-x-1 bg-[var(--bg-page)] px-2 py-1 rounded-lg border border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={() => insertFormatting('**Bold Text**')}
                      title="Bold"
                      className="p-1 hover:bg-[var(--bg-surface)] rounded text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*Italic Text*')}
                      title="Italic"
                      className="p-1 hover:bg-[var(--bg-surface)] rounded text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n### Section Heading\n')}
                      title="Heading"
                      className="p-1 hover:bg-[var(--bg-surface)] rounded text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                    >
                      <Heading className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n- Key item or deliverable\n')}
                      title="Bullet List"
                      className="p-1 hover:bg-[var(--bg-surface)] rounded text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n> Important notice\n')}
                      title="Quote Block"
                      className="p-1 hover:bg-[var(--bg-surface)] rounded text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your broadcast message... (Use formatting buttons or markdown syntax)"
                  rows={5}
                  required
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none font-mono leading-relaxed"
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
