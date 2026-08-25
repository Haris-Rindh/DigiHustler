import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, GroupId, ProjectAssignment, PipelineStage } from '../../types';
import { 
  X, Shield, DollarSign, Users, CheckCircle2, Upload, MessageSquare, Send, Award, FileText, AlertTriangle, Layers, ArrowRight, UserPlus
} from 'lucide-react';

interface Props {
  project: Project;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<Props> = ({ project, onClose }) => {
  const { 
    currentUser, users, groups, reviewLeadToProject, assignProjectTeam, updateProjectStatus, 
    addDeliverable, addComment, releaseProjectPayout 
  } = useApp();

  const activeGroup = groups.find(g => g.id === project.groupId) || groups[0];
  const groupFreelancers = users.filter(u => u.groupId === project.groupId && u.role === 'freelancer');
  const groupLeaders = users.filter(u => u.groupId === project.groupId && u.role === 'group_leader');

  // Management Review State
  const [mgmtSplit, setMgmtSplit] = useState(project.splitManagementPct || 22.5);
  const [ldrSplit, setLdrSplit] = useState(project.splitLeaderPct || 7.5);
  const [flSplit, setFlSplit] = useState(project.splitFreelancerPct || 70);
  const [lgSplit, setLgSplit] = useState(project.leadGenUserPct || 15);
  const [isLgIndep, setIsLgIndep] = useState(project.isLeadGenIndependent ?? true);
  const [totalVal, setTotalVal] = useState(project.totalValue || 2500);
  const [extFee, setExtFee] = useState(project.externalFee || 0);
  const [selectedLeaderId, setSelectedLeaderId] = useState(project.assignedLeaderId || (groupLeaders[0]?.id ?? ''));

  // Team Assignment State
  const [assignments, setAssignments] = useState<ProjectAssignment[]>(
    project.assignments.length > 0 ? project.assignments : [
      {
        freelancerId: groupFreelancers[0]?.id || '',
        freelancerName: groupFreelancers[0]?.name || 'Unassigned',
        roleTitle: 'Primary Specialist',
        sharePct: 100
      }
    ]
  );

  // Deliverables State
  const [delivTitle, setDelivTitle] = useState('');
  const [delivUrl, setDelivUrl] = useState('');
  const [delivNotes, setDelivNotes] = useState('');

  // Comment State
  const [commentText, setCommentText] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'deliverables' | 'comments'>('overview');

  const totalSplitSum = mgmtSplit + ldrSplit + flSplit;

  // Handle Management Review Conversion
  const handleSaveManagementReview = () => {
    if (Math.abs(totalSplitSum - 100) > 0.1) {
      alert('Management, Leader, and Freelancer splits must sum to exactly 100%.');
      return;
    }

    reviewLeadToProject(
      project.leadId || project.id,
      project.groupId,
      selectedLeaderId,
      totalVal,
      extFee,
      isLgIndep,
      lgSplit,
      mgmtSplit,
      ldrSplit,
      flSplit
    );

    alert('Project financial split and leader assignment confirmed!');
    onClose();
  };

  // Handle Leader Team Assignment
  const handleSaveTeamAssignments = () => {
    const sumShares = assignments.reduce((sum, a) => sum + a.sharePct, 0);
    if (Math.abs(sumShares - 100) > 0.1) {
      alert('Freelancer sub-allocations must sum to 100% of the Freelancer pool.');
      return;
    }

    assignProjectTeam(project.id, assignments);
    alert('Team assignment saved successfully!');
  };

  // Handle Deliverable Submit
  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delivTitle) return;
    addDeliverable(project.id, delivTitle, delivUrl, delivNotes);
    setDelivTitle('');
    setDelivUrl('');
    setDelivNotes('');
  };

  // Handle Comment Submit
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(project.id, commentText);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                project.status === 'new_lead' ? 'bg-amber-500/20 text-amber-300' :
                project.status === 'under_review' ? 'bg-indigo-500/20 text-indigo-300' :
                project.status === 'assigned' ? 'bg-blue-500/20 text-blue-300' :
                project.status === 'in_progress' ? 'bg-cyan-500/20 text-cyan-300' :
                project.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                'bg-purple-500/20 text-purple-300'
              }`}>
                Stage: {project.status.replace('_', ' ')}
              </span>
              <span className="text-xs text-[var(--text-muted)]">• Group: {activeGroup.name}</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[var(--text-heading)] mt-1">{project.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-2 border-b border-[var(--border-subtle)] pb-3 mb-6">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-subtle)]'}`}
          >
            Brief & Financial Split
          </button>
          <button 
            onClick={() => setActiveTab('team')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'team' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-subtle)]'}`}
          >
            Team Assignment ({project.assignments.length})
          </button>
          <button 
            onClick={() => setActiveTab('deliverables')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'deliverables' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-subtle)]'}`}
          >
            Deliverables ({project.deliverables.length})
          </button>
          <button 
            onClick={() => setActiveTab('comments')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'comments' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-subtle)]'}`}
          >
            Team Discussion ({project.comments.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & SPLIT CALCULATOR */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Client & Scope Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--bg-subtle)] p-4 rounded-2xl border border-[var(--border-subtle)]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Client Info</span>
                <p className="text-sm font-bold text-[var(--text-heading)] mt-0.5">{project.clientName}</p>
                <p className="text-xs text-[var(--text-muted)]">{project.clientEmail}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Department Group</span>
                <p className="text-sm font-bold text-cyan-400 mt-0.5">{activeGroup.name}</p>
                <p className="text-xs text-[var(--text-muted)]">Leader: {project.assignedLeaderName}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Gross Budget</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">${project.totalValue?.toLocaleString() || 0} USD</p>
                <p className="text-xs text-[var(--text-muted)]">Net Revenue: ${project.netRevenue?.toLocaleString() || 0}</p>
              </div>
            </div>

            {/* Scope Brief */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-xs font-bold text-[var(--text-body)] uppercase tracking-wider">Project Scope Brief</span>
              <p className="text-sm text-[var(--text-body)] leading-relaxed whitespace-pre-line">{project.brief}</p>
            </div>

            {/* Financial Split Section */}
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  <span>Project Financial Split & Percentage Allocation</span>
                </h3>
                {currentUser.role === 'management' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    Management Control Active
                  </span>
                )}
              </div>

              {currentUser.role === 'management' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-body)] mb-1 block">Gross Total Value ($)</label>
                      <input 
                        type="number" 
                        value={totalVal}
                        onChange={(e) => setTotalVal(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-1.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-body)] mb-1 block">Assign Department Leader</label>
                      <select
                        value={selectedLeaderId}
                        onChange={(e) => setSelectedLeaderId(e.target.value)}
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-1.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                      >
                        {groupLeaders.map(l => (
                          <option key={l.id} value={l.id}>{l.name} ({l.title})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-body)] mb-1 flex justify-between">
                        <span>Management %</span>
                        <span className="text-purple-400 font-bold">{mgmtSplit}%</span>
                      </label>
                      <input 
                        type="range" 
                        min="15" 
                        max="35" 
                        value={mgmtSplit} 
                        onChange={(e) => setMgmtSplit(parseFloat(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--text-body)] mb-1 flex justify-between">
                        <span>Leader %</span>
                        <span className="text-cyan-400 font-bold">{ldrSplit}%</span>
                      </label>
                      <input 
                        type="range" 
                        min="5" 
                        max="15" 
                        value={ldrSplit} 
                        onChange={(e) => setLdrSplit(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--text-body)] mb-1 flex justify-between">
                        <span>Freelancer Pool %</span>
                        <span className="text-emerald-400 font-bold">{flSplit}%</span>
                      </label>
                      <input 
                        type="range" 
                        min="50" 
                        max="80" 
                        value={flSplit} 
                        onChange={(e) => setFlSplit(parseFloat(e.target.value))}
                        className="w-full accent-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-[var(--bg-subtle)] border border-white/5">
                    <span>Total Split Sum: <strong className={Math.abs(totalSplitSum - 100) < 0.1 ? 'text-emerald-400' : 'text-rose-400'}>{totalSplitSum}%</strong></span>
                    <button 
                      onClick={handleSaveManagementReview}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs"
                    >
                      Confirm Split & Route Leader
                    </button>
                  </div>
                </div>
              ) : (
                /* Read-Only Split Breakdown for Non-Management Users */
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <span className="text-[10px] uppercase font-bold text-purple-300">Management Cut</span>
                    <p className="text-lg font-bold text-[var(--text-heading)] mt-1">{project.splitManagementPct}%</p>
                    <p className="text-xs text-purple-400">${Math.round(project.netRevenue * (project.splitManagementPct / 100)).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <span className="text-[10px] uppercase font-bold text-cyan-300">Leader Cut</span>
                    <p className="text-lg font-bold text-[var(--text-heading)] mt-1">{project.splitLeaderPct}%</p>
                    <p className="text-xs text-cyan-400">${Math.round(project.netRevenue * (project.splitLeaderPct / 100)).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] uppercase font-bold text-emerald-300">Freelancer Pool</span>
                    <p className="text-lg font-bold text-[var(--text-heading)] mt-1">{project.splitFreelancerPct}%</p>
                    <p className="text-xs text-emerald-400">${Math.round(project.netRevenue * (project.splitFreelancerPct / 100)).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Payout Trigger Button if Completed */}
            {project.status === 'completed' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[var(--text-heading)] text-sm flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Project Complete & Approved</span>
                  </h4>
                  <p className="text-xs text-[var(--text-body)]">Release payouts according to stored split percentage rules.</p>
                </div>
                <button
                  onClick={() => releaseProjectPayout(project.id)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Disburse Financial Payout
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: TEAM ASSIGNMENTS */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Group Leader Team Assignment Engine</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Assign single freelancer or split the Freelancer Pool among multiple specialists</p>
              </div>

              {(currentUser.role === 'group_leader' || currentUser.role === 'management') && (
                <button
                  onClick={() => setAssignments([
                    ...assignments,
                    {
                      freelancerId: groupFreelancers[0]?.id || '',
                      freelancerName: groupFreelancers[0]?.name || 'Specialist',
                      roleTitle: 'Specialist Developer/Designer',
                      sharePct: 0
                    }
                  ])}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:bg-purple-500/30"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Team Member</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {assignments.map((assignment, index) => (
                <div key={index} className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1 w-full space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Select Roster Member</label>
                    <select
                      value={assignment.freelancerId}
                      onChange={(e) => {
                        const sel = groupFreelancers.find(u => u.id === e.target.value);
                        const updated = [...assignments];
                        updated[index].freelancerId = e.target.value;
                        updated[index].freelancerName = sel ? sel.name : 'Specialist';
                        setAssignments(updated);
                      }}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    >
                      {groupFreelancers.map(f => (
                        <option key={f.id} value={f.id}>{f.name} — {f.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Role Title on Project</label>
                    <input 
                      type="text"
                      value={assignment.roleTitle}
                      onChange={(e) => {
                        const updated = [...assignments];
                        updated[index].roleTitle = e.target.value;
                        setAssignments(updated);
                      }}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="w-32 space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Share of Pool %</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={assignment.sharePct}
                      onChange={(e) => {
                        const updated = [...assignments];
                        updated[index].sharePct = parseFloat(e.target.value) || 0;
                        setAssignments(updated);
                      }}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-white text-center focus:border-cyan-400 focus:outline-none font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>

            {(currentUser.role === 'group_leader' || currentUser.role === 'management') && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                <span className="text-xs text-[var(--text-body)]">
                  Pool Sub-Allocation Total: <strong className={assignments.reduce((sum, a) => sum + a.sharePct, 0) === 100 ? 'text-emerald-400' : 'text-amber-400'}>
                    {assignments.reduce((sum, a) => sum + a.sharePct, 0)}%
                  </strong>
                </span>
                <button
                  onClick={handleSaveTeamAssignments}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20"
                >
                  Save Team Assignments
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DELIVERABLES */}
        {activeTab === 'deliverables' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Project Deliverables & Work Assets</span>
              </h3>
            </div>

            {/* Deliverables List */}
            <div className="space-y-3">
              {project.deliverables.length === 0 ? (
                <div className="p-8 text-center bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs">
                  No deliverables submitted yet for this project.
                </div>
              ) : (
                project.deliverables.map(del => (
                  <div key={del.id} className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-heading)]">{del.title}</h4>
                      <p className="text-xs text-[var(--text-muted)]">Submitted by: {del.submittedByUserName} on {new Date(del.submittedAt).toLocaleDateString()}</p>
                      {del.notes && <p className="text-xs text-[var(--text-body)] mt-1 italic">"{del.notes}"</p>}
                    </div>
                    {del.linkUrl && (
                      <a 
                        href={del.linkUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-xs font-semibold border border-cyan-500/30"
                      >
                        View Asset
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Submit Deliverable Form */}
            <form onSubmit={handleAddDeliverable} className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-3">
              <h4 className="text-xs font-bold text-[var(--text-heading)] uppercase tracking-wider">Submit New Deliverable</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                  type="text"
                  placeholder="Deliverable Title (e.g. Final Figma Prototype)"
                  value={delivTitle}
                  onChange={(e) => setDelivTitle(e.target.value)}
                  className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <input 
                  type="url"
                  placeholder="Asset URL (GitHub / Figma / Google Drive)"
                  value={delivUrl}
                  onChange={(e) => setDelivUrl(e.target.value)}
                  className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <textarea 
                placeholder="Additional notes for leader and management review..."
                rows={2}
                value={delivNotes}
                onChange={(e) => setDelivNotes(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button 
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Upload Deliverable
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: COMMENTS & TEAM DISCUSSION */}
        {activeTab === 'comments' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>In-Project Team Discussion</span>
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {project.comments.length === 0 ? (
                <p className="text-center text-xs text-[var(--text-muted)] py-6">No discussions yet. Start the conversation below!</p>
              ) : (
                project.comments.map(c => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex space-x-3">
                    <img src={c.userAvatar} alt={c.userName} className="w-8 h-8 rounded-full object-cover mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--text-heading)]">{c.userName}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-[var(--text-body)] mt-1">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex space-x-2">
              <input 
                type="text"
                placeholder="Write a message to team members..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button 
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
