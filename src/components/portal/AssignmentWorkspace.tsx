import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, CheckCircle2, Clock, Plus, FileText, Send, User, Check, 
  AlertCircle, Shield, ExternalLink, MessageSquare, ChevronRight, Lock, 
  Calendar, Layers, Paperclip, CheckSquare, Sparkles, Trash2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Assignment, PipelineStage, GroupId } from '../../types';
import { PERMISSIONS, sanitizeAssignmentForUser } from '../../lib/permissions';

export const AssignmentWorkspace: React.FC = () => {
  const { 
    currentUser, currentTier, assignments, users, groups, leads,
    createAssignment, deleteAssignment, updateAssignmentStatus, addSubTask, toggleSubTask,
    addMilestone, toggleMilestone, addAssignmentDeliverable, addAssignmentComment, showToast 
  } = useApp();

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(assignments[0]?.id || '');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [selectedMemberForTask, setSelectedMemberForTask] = useState('');
  const [newSubTaskDueDate, setNewSubTaskDueDate] = useState('');
  const [deliverableTitle, setDeliverableTitle] = useState('');
  const [deliverableLink, setDeliverableLink] = useState('');
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [commentText, setCommentText] = useState('');

  // Form state for creating assignment (CEO/Manager)
  const [newTitle, setNewTitle] = useState('');
  const [newSquad, setNewSquad] = useState<GroupId>('tech');
  const [newLeaderId, setNewLeaderId] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newScope, setNewScope] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientCompany, setNewClientCompany] = useState('');
  const [newTotalBudget, setNewTotalBudget] = useState<number>(3500);

  // Filter assignments based on 4-Tier Access Matrix:
  // - CEO & Manager: All assignments
  // - Leader: Assignments where they are assignedLeaderId or squad matches
  // - Member: Assignments where they are inside assignedMemberIds
  const visibleAssignments = assignments.filter((asgn) => {
    if (currentTier === 'ceo' || currentTier === 'manager') return true;
    if (currentTier === 'group_leader') return asgn.assignedLeaderId === currentUser.id || asgn.squad === currentUser.groupId;
    return asgn.assignedMemberIds.includes(currentUser.id);
  });

  const activeRawAssignment = visibleAssignments.find(a => a.id === selectedAssignmentId) || visibleAssignments[0];
  const activeAssignment = activeRawAssignment ? sanitizeAssignmentForUser(activeRawAssignment, currentUser) : null;

  const isAssignedLeader = activeRawAssignment?.assignedLeaderId === currentUser.id;
  const canManageSubtasks = PERMISSIONS.canManageProjectSubtasks(currentTier, isAssignedLeader);
  const canViewClientInfo = PERMISSIONS.canViewFullClientRecord(currentTier);

  // Candidate members for squad
  const squadMembers = users.filter(u => u.groupId === newSquad && u.role === 'freelancer');
  const squadLeaders = users.filter(u => u.groupId === newSquad && u.role === 'group_leader');

  const handleCreateAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLeaderId) return;

    const leader = users.find(u => u.id === newLeaderId);

    createAssignment({
      projectId: `proj-${Date.now()}`,
      clientName: newClientName || 'Private Client',
      clientEmail: newClientEmail || 'client@domain.com',
      clientCompany: newClientCompany || 'Enterprise Client',
      totalBudget: newTotalBudget,
      assignedLeaderId: newLeaderId,
      assignedLeaderName: leader ? leader.name : 'Squad Leader',
      assignedMemberIds: selectedMembers,
      squad: newSquad,
      status: 'assigned',
      sanitizedBrief: {
        title: newTitle,
        scope: newScope || 'Execute sprint milestones according to design tokens and architecture specifications.',
        deliverables: ['Core Implementation', 'Staging QA Review', 'Final Handover Documentation'],
        deadline: newDeadline || '2026-09-30',
        referenceFiles: ['Architecture_Brief.pdf', 'Design_Tokens.md']
      },
      createdBy: currentUser.name
    });

    setCreateModalOpen(false);
  };

  const handleAddSubTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTaskTitle.trim() || !activeAssignment || !selectedMemberForTask) return;
    addSubTask(activeAssignment.id, newSubTaskTitle, selectedMemberForTask, newSubTaskDueDate);
    setNewSubTaskTitle('');
    setNewSubTaskDueDate('');
  };

  const handleAddDeliverableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverableTitle.trim() || !activeAssignment) return;
    addAssignmentDeliverable(activeAssignment.id, deliverableTitle, deliverableLink, deliverableNotes);
    setDeliverableTitle('');
    setDeliverableLink('');
    setDeliverableNotes('');
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeAssignment) return;
    addAssignmentComment(activeAssignment.id, commentText);
    setCommentText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--brand-teal)] uppercase tracking-wider mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Coordinated Squad Delivery</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)]">
            Project Assignments & Briefs
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-body)]">
            {canViewClientInfo
              ? 'Executive project scope, client contract parameters, and squad team assignments.'
              : 'Sanitized project briefs, squad sub-tasks, deliverables, and milestone progress.'}
          </p>
        </div>

        {PERMISSIONS.canCreateAssignment(currentTier) && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Assignment</span>
          </button>
        )}
      </div>

      {/* Main Workspace Layout */}
      {visibleAssignments.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <Briefcase className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="font-bold text-base text-[var(--text-heading)] mb-1">No Active Assignments</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            You do not currently have any active project assignments allocated to your account.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Assignment Selector Cards */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-1">
              Active Projects ({visibleAssignments.length})
            </div>

            {visibleAssignments.map((asgn) => {
              const isSelected = asgn.id === activeAssignment?.id;
              const squadObj = groups.find(g => g.id === asgn.squad);

              return (
                <div
                  key={asgn.id}
                  onClick={() => setSelectedAssignmentId(asgn.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--bg-surface)] border-[var(--brand-teal)] shadow-lg ring-1 ring-[var(--brand-teal)]/30'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/40 hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
                      {squadObj?.name.split('&')[0] || asgn.squad.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                      {asgn.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[var(--text-heading)] mb-1.5 line-clamp-1">
                    {asgn.sanitizedBrief.title}
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">
                    {asgn.sanitizedBrief.scope}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                    <span>Lead: {asgn.assignedLeaderName}</span>
                    <span>Due: {asgn.sanitizedBrief.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Assignment View */}
          {activeAssignment && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Sanitized Project Brief Card */}
              <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 shadow-xl">
                
                {/* Top Status & Confidentiality Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-[var(--border-subtle)]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-teal)] block mb-1">
                      Project Specification #{activeAssignment.id}
                    </span>
                    <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[var(--text-heading)]">
                      {activeAssignment.sanitizedBrief.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    {canViewClientInfo ? (
                      <div className="p-2.5 px-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs">
                        <div className="font-bold flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Client: {activeAssignment.clientName} ({activeAssignment.clientCompany})</span>
                        </div>
                        <div className="text-[10px] opacity-80 mt-0.5">Budget: ${activeAssignment.totalBudget} · {activeAssignment.clientEmail}</div>
                      </div>
                    ) : (
                      <div className="p-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Sanitized Brief (Client Protected)</span>
                      </div>
                    )}

                    {PERMISSIONS.canCreateAssignment(currentTier) && (
                      <button
                        onClick={() => {
                          if (confirm(`Permanently delete assignment #${activeAssignment.id} (${activeAssignment.sanitizedBrief.title}) from the database?`)) {
                            deleteAssignment(activeAssignment.id);
                          }
                        }}
                        className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                        title="Delete Assignment from Database"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Scope & Deliverables */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                      Scope of Work
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed bg-[var(--bg-page)] p-4 rounded-2xl border border-[var(--border-subtle)]">
                      {activeAssignment.sanitizedBrief.scope}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                        Key Deliverables
                      </h4>
                      <ul className="space-y-1.5">
                        {activeAssignment.sanitizedBrief.deliverables.map((del, i) => (
                          <li key={i} className="text-xs text-[var(--text-body)] flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-teal)] flex-shrink-0" />
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                        Assigned Squad Team
                      </h4>
                      <div className="space-y-1 text-xs">
                        <p className="text-[var(--text-heading)] font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span>Squad Lead: {activeAssignment.assignedLeaderName}</span>
                        </p>
                        {activeAssignment.assignedMemberIds.map((mId) => {
                          const mUser = users.find(u => u.id === mId);
                          return (
                            <p key={mId} className="text-[var(--text-muted)] flex items-center gap-1.5 pl-3.5">
                              <span>• {mUser ? mUser.name : mId} ({mUser?.title})</span>
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-Tasks Breakdown (Managed by Group Leader) */}
                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                      <span>Sprint Sub-Tasks</span>
                    </h4>
                    <span className="text-[10px] font-mono text-[var(--brand-teal)]">
                      {activeAssignment.subTasks.filter(st => st.status === 'completed').length} / {activeAssignment.subTasks.length} Completed
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {activeAssignment.subTasks.length === 0 ? (
                      <p className="text-xs text-[var(--text-muted)] italic">No sub-tasks assigned yet.</p>
                    ) : (
                      activeAssignment.subTasks.map((st) => (
                        <div
                          key={st.id}
                          onClick={() => toggleSubTask(activeAssignment.id, st.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                            st.status === 'completed'
                              ? 'bg-emerald-500/5 border-emerald-500/30 text-[var(--text-muted)]'
                              : 'bg-[var(--bg-page)] border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)]'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              st.status === 'completed'
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-[var(--border-subtle)]'
                            }`}>
                              {st.status === 'completed' && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={`text-xs font-semibold ${st.status === 'completed' ? 'line-through opacity-70' : ''}`}>
                              {st.title}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3 text-[10px] text-[var(--text-muted)]">
                            <span className="font-medium text-[var(--brand-teal)]">{st.assignedMemberName}</span>
                            {st.dueDate && <span>Due {st.dueDate}</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Sub-Task Form (Leader / Manager / CEO) */}
                  {canManageSubtasks && (
                    <form onSubmit={handleAddSubTaskSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2">
                      <input
                        type="text"
                        value={newSubTaskTitle}
                        onChange={(e) => setNewSubTaskTitle(e.target.value)}
                        placeholder="New sub-task specification..."
                        className="sm:col-span-6 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                      />
                      <select
                        value={selectedMemberForTask}
                        onChange={(e) => setSelectedMemberForTask(e.target.value)}
                        required
                        className="sm:col-span-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                      >
                        <option value="">Assign To...</option>
                        {activeAssignment.assignedMemberIds.map((mId) => {
                          const u = users.find(user => user.id === mId);
                          return <option key={mId} value={mId}>{u?.name || mId}</option>;
                        })}
                      </select>
                      <button
                        type="submit"
                        className="sm:col-span-3 px-3 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-xs shadow transition-all cursor-pointer"
                      >
                        + Add Subtask
                      </button>
                    </form>
                  )}
                </div>

                {/* Deliverable Submissions */}
                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                    <span>Deliverables & Staging Links</span>
                  </h4>

                  <div className="space-y-2 mb-4">
                    {activeAssignment.deliverables.map((del) => (
                      <div key={del.id} className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-[var(--text-heading)]">{del.title}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">
                            Submitted by {del.submittedByUserName} · {del.notes}
                          </div>
                        </div>
                        {del.linkUrl && (
                          <a
                            href={del.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-xs text-[var(--brand-teal)] hover:underline font-bold"
                          >
                            <span>Open Staging</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Submit Deliverable Form */}
                  <form onSubmit={handleAddDeliverableSubmit} className="space-y-2 bg-[var(--bg-page)] p-3.5 rounded-2xl border border-[var(--border-subtle)]">
                    <div className="text-[11px] font-bold text-[var(--text-heading)]">Submit Sprint Deliverable</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={deliverableTitle}
                        onChange={(e) => setDeliverableTitle(e.target.value)}
                        placeholder="Deliverable Title (e.g. Next.js Staging v1.2)"
                        required
                        className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                      />
                      <input
                        type="url"
                        value={deliverableLink}
                        onChange={(e) => setDeliverableLink(e.target.value)}
                        placeholder="Staging URL or GitHub PR Link"
                        className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      value={deliverableNotes}
                      onChange={(e) => setDeliverableNotes(e.target.value)}
                      placeholder="Notes for Leader / QA verification..."
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow transition-all cursor-pointer"
                    >
                      Upload Deliverable for QA
                    </button>
                  </form>
                </div>

                {/* Team Comment Thread */}
                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                    <span>Squad Discussion</span>
                  </h4>

                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {activeAssignment.comments.map((c) => (
                      <div key={c.id} className="flex items-start space-x-3 p-3 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)]">
                        <img src={c.userAvatar} alt={c.userName} className="w-7 h-7 rounded-full object-cover" />
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[var(--text-heading)]">{c.userName}</span>
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[var(--text-body)] leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddCommentSubmit} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a message to your squad..."
                      className="flex-1 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="p-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white shadow transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* Create Assignment Modal (CEO / Manager) */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-extrabold text-xl text-[var(--text-heading)] mb-1">
              Create New Project Assignment
            </h3>
            <p className="text-xs text-[var(--text-body)] mb-5">
              Assign responsible Squad Leader and specific domain specialists. A sanitized brief will be automatically dispatched to assigned members.
            </p>

            <form onSubmit={handleCreateAssignmentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. High-Speed UK Real Estate Web Platform"
                  required
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                />
              </div>

              {/* Client Info (Confidential) */}
              <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-3">
                <div className="text-[11px] font-bold text-purple-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Confidential Client Record (CEO & Manager only)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Client Contact Name"
                    className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newClientCompany}
                    onChange={(e) => setNewClientCompany(e.target.value)}
                    placeholder="Client Company"
                    className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                  <input
                    type="number"
                    value={newTotalBudget}
                    onChange={(e) => setNewTotalBudget(Number(e.target.value))}
                    placeholder="Total Budget ($)"
                    className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Select Squad Department
                  </label>
                  <select
                    value={newSquad}
                    onChange={(e) => setNewSquad(e.target.value as GroupId)}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Assign Squad Leader
                  </label>
                  <select
                    value={newLeaderId}
                    onChange={(e) => setNewLeaderId(e.target.value)}
                    required
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  >
                    <option value="">Select Squad Leader...</option>
                    {squadLeaders.map((ldr) => (
                      <option key={ldr.id} value={ldr.id}>{ldr.name} ({ldr.title})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Assign Specific Members (Multi-Select)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-[var(--bg-page)] rounded-2xl border border-[var(--border-subtle)]">
                  {squadMembers.map((m) => {
                    const isSelected = selectedMembers.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedMembers(selectedMembers.filter(id => id !== m.id));
                          } else {
                            setSelectedMembers([...selectedMembers, m.id]);
                          }
                        }}
                        className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[var(--brand-teal)] text-white border-[var(--brand-teal)]'
                            : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-heading)]'
                        }`}
                      >
                        <span className="truncate">{m.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 ml-1 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Sanitized Scope of Work (Visible to Team)
                </label>
                <textarea
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                  placeholder="Detail exact technical requirements, design guidelines, and deliverable format..."
                  rows={3}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Dispatch Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
