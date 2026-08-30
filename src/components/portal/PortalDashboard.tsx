import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Briefcase, Award, Bell, CheckCircle2, 
  ArrowRight, Shield, Layers, TrendingUp, Clock, PlusCircle, 
  CheckSquare, FileText, Lock, Key, AlertCircle, Sparkles, UserCheck, UserPlus,
  Mail, MessageSquare, ExternalLink, Calendar, Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ForcePasswordReset } from './ForcePasswordReset';
import { PERMISSIONS } from '../../lib/permissions';
import { User, Certificate } from '../../types';

import { PeopleDirectory } from '../dashboard/PeopleManagement/PeopleDirectory';
import { UserProfileDrawer } from '../dashboard/PeopleManagement/UserProfileDrawer';
import { ApplicantWorkflowQueue } from '../dashboard/PeopleManagement/ApplicantWorkflowQueue';
import { SquadMatrixView } from '../dashboard/PeopleManagement/SquadMatrixView';
import { PeopleAnalyticsView } from '../dashboard/PeopleManagement/PeopleAnalyticsView';
import { QuickInviteModal } from '../dashboard/PeopleManagement/QuickInviteModal';

export const PortalDashboard: React.FC = () => {
  const { 
    currentUser, currentTier, users, groups, projects, assignments, 
    announcements, applicants, leads, certificates 
  } = useApp();

  const isManagement = currentTier === 'ceo' || currentTier === 'manager' || currentUser?.role === 'management';

  // Management Tab State
  const [mgmtTab, setMgmtTab] = useState<'directory' | 'applicants' | 'squads' | 'analytics' | 'sprints'>('directory');
  
  // Staff / Specialist / Intern Tab State
  const [staffTab, setStaffTab] = useState<'my_sprints' | 'my_tasks' | 'my_documents' | 'my_squad' | 'broadcasts'>('my_sprints');
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-xs text-[var(--text-muted)]">Loading workspace...</p>
      </div>
    );
  }

  // If the user must change password on first login
  if (currentUser.forcePasswordChange) {
    return <ForcePasswordReset />;
  }

  const pendingApplicantsCount = (applicants || []).filter((a) => a.status === 'pending').length;

  // Filter assignments based on 4-Tier Access Matrix
  const visibleAssignments = (assignments || []).filter((asgn) => {
    if (!asgn) return false;
    if (isManagement) return true;
    if (currentTier === 'group_leader') return asgn.assignedLeaderId === currentUser.id || asgn.squad === currentUser.groupId;
    return (asgn.assignedMemberIds || []).includes(currentUser.id);
  });

  // Calculate Operational Metrics
  const activeAssignmentsCount = visibleAssignments.filter(a => a.status === 'in_progress' || a.status === 'assigned').length;
  
  // Staff Specific Metrics
  const mySubTasks = visibleAssignments.flatMap(a => 
    (a.subTasks || [])
      .filter(st => st.assignedMemberId === currentUser.id)
      .map(st => ({ ...st, assignmentTitle: a.sanitizedBrief.title, assignmentId: a.id, squad: a.squad, deadline: a.sanitizedBrief.deadline }))
  );
  const myCompletedTasksCount = mySubTasks.filter(st => st.status === 'completed').length;
  const myPendingTasksCount = mySubTasks.filter(st => st.status !== 'completed').length;
  const mySquad = groups.find(g => g.id === currentUser.groupId);
  const myLeader = users.find(u => (u.groupId === currentUser.groupId && u.role === 'group_leader') || u.id === mySquad?.leaderId);
  const myAllCerts = (certificates || []).filter(c => c.memberId === currentUser.id);
  const myReleasedCerts = myAllCerts.filter(c => !c.isLocked);
  const myLockedCerts = myAllCerts.filter(c => c.isLocked);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ── SHARED WELCOME BANNER ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-teal)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1F7A8C&color=fff&size=64`}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[var(--brand-teal)] shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[var(--brand-teal)] bg-[var(--brand-teal-subtle)] px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)]">
                {currentUser.memberId || 'DGH2600001'}
              </span>
              <span className="text-xs uppercase font-extrabold text-[var(--text-muted)]">
                {currentUser.roleTier === 'intern' ? 'INTERN SPECIALIST' : `${currentTier.toUpperCase()} LEVEL`}
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)]">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-body)]">
              {currentUser.title} · {mySquad ? mySquad.name : 'DigiHust Operations'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {isManagement && (
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Talent</span>
            </button>
          )}
          <Link
            to="/portal/assignments"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-xs font-bold text-[var(--text-heading)] bg-[var(--bg-page)] hover:bg-[var(--bg-subtle)] transition-all"
          >
            <Briefcase className="w-4 h-4" />
            <span>Assignments Studio</span>
          </Link>
          <Link
            to="/portal/certificates"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-xs font-bold text-[var(--text-heading)] bg-[var(--bg-page)] hover:bg-[var(--bg-subtle)] transition-all"
          >
            <Award className="w-4 h-4" />
            <span>Credentials Vault</span>
          </Link>
        </div>
      </div>

      {/* ── EXECUTIVE MANAGEMENT VIEW (CEO & MANAGERS) ── */}
      {isManagement ? (
        <>
          {/* Executive Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div 
              onClick={() => setMgmtTab('squads')}
              className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 ease-out cursor-pointer select-none group"
            >
              <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider group-hover:text-[var(--brand-teal)] transition-colors duration-150">Specialist Squads</span>
                <Shield className="w-4 h-4 text-[var(--brand-teal)]" />
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-[var(--text-heading)] mb-1">
                {groups.length} Squads
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Active technical & creative divisions</p>
            </div>

            <div 
              onClick={() => setMgmtTab('sprints')}
              className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 ease-out cursor-pointer select-none group"
            >
              <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider group-hover:text-[var(--brand-teal)] transition-colors duration-150">Active Sprints</span>
                <Briefcase className="w-4 h-4 text-[var(--brand-teal)]" />
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-[var(--text-heading)] mb-1">
                {activeAssignmentsCount}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Coordinated squad deliveries</p>
            </div>

            <div 
              onClick={() => setMgmtTab('applicants')}
              className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 ease-out cursor-pointer select-none group"
            >
              <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider group-hover:text-[var(--brand-teal)] transition-colors duration-150">Applicant Pipeline</span>
                <Layers className="w-4 h-4 text-[var(--brand-teal)]" />
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-[var(--text-heading)] mb-1">
                {pendingApplicantsCount}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Applications pending review</p>
            </div>

            <div 
              onClick={() => setMgmtTab('directory')}
              className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 ease-out cursor-pointer select-none group"
            >
              <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider group-hover:text-[var(--brand-teal)] transition-colors duration-150">Verified Staff</span>
                <Award className="w-4 h-4 text-[var(--brand-teal)]" />
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-[var(--text-heading)] mb-1">
                {users.length}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Active DGH member identities</p>
            </div>
          </div>

          {/* Executive Navigation Tabs */}
          <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-x-auto shadow-sm">
            {[
              { id: 'directory', label: 'People Directory', icon: <Users className="w-4 h-4" /> },
              {
                id: 'applicants',
                label: 'Applicant Queue',
                icon: <UserCheck className="w-4 h-4" />,
                badge: pendingApplicantsCount > 0 ? pendingApplicantsCount : undefined,
              },
              { id: 'squads', label: 'Squad Matrix', icon: <Layers className="w-4 h-4" /> },
              { id: 'analytics', label: 'Analytics & SLA', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'sprints', label: 'Active Sprints & Broadcasts', icon: <Briefcase className="w-4 h-4" /> },
            ].map((tab) => {
              const isActive = mgmtTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMgmtTab(tab.id as any)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeOverviewTab"
                      className="absolute inset-0 bg-[var(--brand-teal)] rounded-xl shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.icon}</span>
                  <span className="relative z-10">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className="relative z-10 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Executive Tab Panels */}
          <div className="min-h-[400px]">
            {mgmtTab === 'directory' && (
              <PeopleDirectory
                onSelectUser={(u) => setSelectedUser(u)}
                onOpenQuickInvite={() => setIsInviteOpen(true)}
              />
            )}

            {mgmtTab === 'applicants' && <ApplicantWorkflowQueue />}

            {mgmtTab === 'squads' && (
              <SquadMatrixView onSelectUser={(u) => setSelectedUser(u)} />
            )}

            {mgmtTab === 'analytics' && (
              <PeopleAnalyticsView onSelectUser={(u) => setSelectedUser(u)} />
            )}

            {mgmtTab === 'sprints' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-base text-[var(--text-heading)] flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[var(--brand-teal)]" />
                      <span>Current Sprint Assignments</span>
                    </h3>
                    <Link to="/portal/assignments" className="text-xs font-bold text-[var(--brand-teal)] hover:underline">
                      View All →
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {visibleAssignments.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                        <Briefcase className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
                        <p className="text-sm font-semibold text-[var(--text-heading)] mb-1">No Active Assignments</p>
                        <p className="text-xs text-[var(--text-muted)]">No active sprint assignments exist.</p>
                      </div>
                    ) : (
                      visibleAssignments.map((asgn) => {
                        const squadObj = groups.find(g => g.id === asgn.squad);
                        return (
                          <Link
                            key={asgn.id}
                            to="/portal/assignments"
                            className="block p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/50 hover:shadow-lg transition-all"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
                                {squadObj?.name.split('&')[0] || asgn.squad.toUpperCase()}
                              </span>
                              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                                Due: {asgn.sanitizedBrief.deadline}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-[var(--text-heading)] mb-1">
                              {asgn.sanitizedBrief.title}
                            </h4>
                            <p className="text-xs text-[var(--text-body)] line-clamp-1 mb-3">
                              {asgn.sanitizedBrief.scope}
                            </p>
                            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                              <span>Lead: <strong className="text-[var(--text-heading)]">{asgn.assignedLeaderName || 'Direct Management'}</strong></span>
                              <span className="text-[var(--brand-teal)] font-semibold flex items-center gap-1">
                                <span>Open Workspace</span>
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-base text-[var(--text-heading)] flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[var(--brand-teal)]" />
                      <span>Latest Announcements</span>
                    </h3>
                    <Link to="/portal/announcements" className="text-xs font-bold text-[var(--brand-teal)] hover:underline">
                      View All →
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {announcements.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                        <Bell className="w-6 h-6 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                        <p className="text-xs text-[var(--text-muted)]">No announcements posted yet.</p>
                      </div>
                    ) : (
                      announcements.slice(0, 3).map((ann) => (
                        <div
                          key={ann.id}
                          className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-wider text-[var(--brand-teal)] bg-[var(--brand-teal-subtle)] px-2 py-0.5 rounded">
                              {(ann.scope || 'global').toUpperCase()}
                            </span>
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                              {ann.postedAt ? new Date(ann.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}
                            </span>
                          </div>
                          <h5 className="font-bold text-xs text-[var(--text-heading)]">{ann.title}</h5>
                          <p className="text-[11px] text-[var(--text-body)] line-clamp-2 leading-relaxed">
                            {ann.content || ann.body || ''}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* ── CONFIDENTIAL SPECIALIST & INTERN PORTAL OVERVIEW ── */
        <>
          {/* Personal Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Metric 1: My Squad */}
            <div 
              onClick={() => setStaffTab('my_squad')}
              className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 ease-out cursor-pointer select-none group"
            >
              <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider group-hover:text-[var(--brand-teal)] transition-colors duration-150">My Squad</span>
                <Shield className="w-4 h-4 text-[var(--brand-teal)]" />
              </div>
              <div className="font-display font-black text-xl sm:text-2xl text-[var(--text-heading)] truncate mb-1" title={mySquad?.name}>
                {mySquad ? mySquad.name.split('&')[0] : 'Operations'}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {mySquad ? `Specialized Domain Division` : 'General Specialist Roster'}
              </p>
            </div>

            {/* Metric 2: Active Sprints */}
            <div 
              onClick={() => setStaffTab('my_projects')}
              className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 ease-out cursor-pointer select-none group"
            >
              <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider group-hover:text-[var(--brand-teal)] transition-colors duration-150">My Projects</span>
                <Briefcase className="w-4 h-4 text-[var(--brand-teal)]" />
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-[var(--text-heading)] mb-1">
                {visibleAssignments.length}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Active sprint engagements</p>
            </div>

            {/* Metric 3: My Sub-Tasks */}
            <div 
              onClick={() => setStaffTab('my_tasks')}
              className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 ease-out cursor-pointer select-none group"
            >
              <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider group-hover:text-[var(--brand-teal)] transition-colors duration-150">Deliverables</span>
                <CheckSquare className="w-4 h-4 text-[var(--brand-teal)]" />
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-[var(--text-heading)] mb-1">
                {myCompletedTasksCount} / {mySubTasks.length}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {myPendingTasksCount === 0 ? 'All current tasks complete!' : `${myPendingTasksCount} tasks in progress`}
              </p>
            </div>

            {/* Metric 4: Verified Documents (Clickable to jump to download tab) */}
            <div 
              onClick={() => setStaffTab('my_documents')}
              className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 ease-out cursor-pointer select-none group"
            >
              <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider group-hover:text-[var(--brand-teal)] transition-colors duration-150">
                  Download Docs
                </span>
                <Award className="w-4 h-4 text-[var(--brand-teal)]" />
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-[var(--text-heading)] mb-1 flex items-center justify-between">
                <span>{myReleasedCerts.length}</span>
                <span className="text-xs text-[var(--brand-teal)] font-bold group-hover:translate-x-0.5 transition-transform duration-150">Download →</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {myReleasedCerts.length > 0 ? `${myReleasedCerts.length} verified PDF(s) ready` : 'Offer letters & certificates'}
              </p>
            </div>

          </div>

          {/* Specialist Navigation Tabs */}
          <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-x-auto shadow-sm">
            {[
              { id: 'my_sprints', label: 'My Current Assignments', icon: <Briefcase className="w-4 h-4" /> },
              {
                id: 'my_tasks',
                label: 'My Action Tasks & Checklist',
                icon: <CheckSquare className="w-4 h-4" />,
                badge: myPendingTasksCount > 0 ? myPendingTasksCount : undefined,
              },
              {
                id: 'my_documents',
                label: 'Download Certificates & Offer Letters',
                icon: <Award className="w-4 h-4" />,
                badge: myReleasedCerts.length > 0 ? myReleasedCerts.length : undefined,
              },
              { id: 'my_squad', label: 'My Squad & Leadership', icon: <Shield className="w-4 h-4" /> },
              { id: 'broadcasts', label: 'Announcements & Directives', icon: <Bell className="w-4 h-4" /> },
            ].map((tab) => {
              const isActive = staffTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStaffTab(tab.id as any)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeStaffTab"
                      className="absolute inset-0 bg-[var(--brand-teal)] rounded-xl shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.icon}</span>
                  <span className="relative z-10">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className="relative z-10 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Specialist Tab Panels */}
          <div className="min-h-[400px]">
            
            {/* Panel 1: My Current Assignments */}
            {staffTab === 'my_sprints' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-[var(--text-heading)] flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[var(--brand-teal)]" />
                    <span>Your Active Project Deliverables</span>
                  </h3>
                  <span className="text-xs text-[var(--text-muted)]">
                    {visibleAssignments.length} Assigned Project(s)
                  </span>
                </div>

                {visibleAssignments.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-3">
                    <Briefcase className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
                    <h4 className="font-bold text-base text-[var(--text-heading)]">No Active Assignments</h4>
                    <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
                      You are currently clear for new sprint cycles. When Management dispatches a new assignment, it will appear here with your task brief and deadlines.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visibleAssignments.map((asgn) => {
                      const squadObj = groups.find(g => g.id === asgn.squad);
                      return (
                        <div
                          key={asgn.id}
                          className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-4 flex flex-col justify-between"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
                                {squadObj?.name || asgn.squad.toUpperCase()}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] bg-[var(--bg-page)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                                Deadline: {asgn.sanitizedBrief.deadline}
                              </span>
                            </div>

                            <h4 className="font-display font-bold text-base text-[var(--text-heading)]">
                              {asgn.sanitizedBrief.title}
                            </h4>
                            <p className="text-xs text-[var(--text-body)] line-clamp-2 leading-relaxed">
                              {asgn.sanitizedBrief.scope}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                            <div className="text-[11px] text-[var(--text-muted)]">
                              Lead: <strong className="text-[var(--text-heading)]">{asgn.assignedLeaderName || 'Direct Management'}</strong>
                            </div>
                            <Link
                              to="/portal/assignments"
                              className="px-3.5 py-1.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                            >
                              <span>Open Brief & Files</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Panel 2: My Action Tasks & Checklist */}
            {staffTab === 'my_tasks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-[var(--text-heading)] flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[var(--brand-teal)]" />
                    <span>Your Sprint Sub-Tasks & Checklists</span>
                  </h3>
                  <span className="text-xs text-[var(--text-muted)]">
                    {myCompletedTasksCount} of {mySubTasks.length} Completed
                  </span>
                </div>

                {mySubTasks.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-[var(--brand-teal)] mx-auto opacity-50" />
                    <h4 className="font-bold text-sm text-[var(--text-heading)]">All Tasks Clear</h4>
                    <p className="text-xs text-[var(--text-muted)]">
                      You have no pending sub-tasks assigned at this moment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {mySubTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                            task.status === 'completed'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-muted)]'
                          }`}>
                            {task.status === 'completed' ? <Check className="w-3.5 h-3.5" /> : null}
                          </div>
                          <div>
                            <div className="font-bold text-xs sm:text-sm text-[var(--text-heading)]">
                              {task.title}
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)]">
                              Project: {task.assignmentTitle} · Due: {task.dueDate || task.deadline}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          task.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Panel 3: Download Offer Letters & Certificates */}
            {staffTab === 'my_documents' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)] flex items-center gap-2">
                      <Award className="w-5 h-5 text-[var(--brand-teal)]" />
                      <span>Download Your Offer Letters & Certificates</span>
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Official credentials verified by DigiHust Management. Download the PDF directly via Google Drive.
                    </p>
                  </div>
                  <Link
                    to="/portal/certificates"
                    className="self-start sm:self-auto text-xs font-bold text-[var(--brand-teal)] hover:underline flex items-center gap-1"
                  >
                    <span>Full Credentials Vault</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {myAllCerts.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-3">
                    <Award className="w-14 h-14 text-[var(--text-muted)] mx-auto opacity-30" />
                    <h4 className="font-display font-bold text-base text-[var(--text-heading)]">
                      No Documents Issued Yet
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
                      Once DigiHust Management generates and releases your official Offer Letter, Internship Certificate, or Experience Document, it will appear here with an instant Google Drive download button.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Released Credentials */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {myReleasedCerts.map((cert) => (
                        <div
                          key={cert.id}
                          className="p-6 rounded-3xl bg-[var(--bg-surface)] border-2 border-emerald-500/30 hover:border-emerald-500/60 shadow-md space-y-4 transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>VERIFIED & RELEASED (🔓)</span>
                              </span>
                              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                                Issued: {cert.issuedDate}
                              </span>
                            </div>

                            <div>
                              <h4 className="font-display font-black text-base text-[var(--text-heading)] mb-1">
                                {cert.documentTitle || cert.type.replace('_', ' ').toUpperCase()}
                              </h4>
                              <p className="text-xs text-[var(--text-body)]">
                                Role: <strong className="text-[var(--text-heading)]">{cert.roleTitle}</strong> · {cert.durationText || 'Verified Period'}
                              </p>
                              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                                Member ID: {cert.memberDghId || currentUser.memberId || 'DGH2600001'}
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
                            {cert.driveUrl ? (
                              <a
                                href={cert.driveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>Download / Open PDF (Google Drive)</span>
                              </a>
                            ) : (
                              <Link
                                to="/portal/certificates"
                                className="w-full text-center px-4 py-2.5 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold shadow-md"
                              >
                                View in Vault
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Locked / Under Review Documents */}
                    {myLockedCerts.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Documents Currently Under Management Review</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {myLockedCerts.map((cert) => (
                            <div
                              key={cert.id}
                              className="p-5 rounded-2xl bg-[var(--bg-page)] border-2 border-amber-500/30 opacity-80 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>LOCKED / UNDER REVIEW</span>
                                </span>
                                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                                  Pending Executive Release
                                </span>
                              </div>
                              <h5 className="font-bold text-sm text-[var(--text-heading)]">
                                {cert.documentTitle || 'Credential Document'}
                              </h5>
                              <p className="text-xs text-[var(--text-muted)]">
                                This document is prepared and will unlock automatically once Executive Management completes final sign-off.
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Panel 4: Squad & Leadership Channel */}
            {staffTab === 'my_squad' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Squad Info */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-2xl bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-lg text-[var(--text-heading)]">
                        {mySquad ? mySquad.name : 'General Squad'}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)]">Your Assigned Operational Domain</p>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-body)] leading-relaxed">
                    {mySquad?.description || 'Collaborate with fellow domain specialists on client deliveries, code architecture, and QA verification.'}
                  </p>

                  <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-2 text-xs">
                    <div className="font-bold text-[var(--text-heading)]">Domain Deliverables:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(mySquad?.specialties || ['Execution', 'Client Deliverables', 'Sprint QA']).map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Squad Leadership Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5">
                  <h4 className="font-display font-bold text-base text-[var(--text-heading)] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[var(--brand-teal)]" />
                    <span>Squad Leadership & Support</span>
                  </h4>

                  {myLeader ? (
                    <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex items-center space-x-3.5">
                      <img
                        src={myLeader.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                        alt={myLeader.name}
                        className="w-11 h-11 rounded-full object-cover border border-[var(--border-subtle)]"
                      />
                      <div>
                        <div className="font-bold text-sm text-[var(--text-heading)]">{myLeader.name}</div>
                        <div className="text-[11px] text-[var(--text-muted)]">{myLeader.title || 'Squad Group Leader'}</div>
                        <span className="text-[9px] font-black uppercase text-[var(--brand-teal)]">Squad Leader</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                      Your squad is currently managed directly by Executive Management.
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-2">
                    <div className="text-xs font-bold text-[var(--text-heading)]">Need Help or Have Questions?</div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      Reach out directly to your squad leader or message executive management for task reassignments or technical blockers.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* Panel 5: Announcements & Directives */}
            {staffTab === 'broadcasts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-[var(--text-heading)] flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[var(--brand-teal)]" />
                    <span>Company Notices & Squad Broadcasts</span>
                  </h3>
                  <Link to="/portal/announcements" className="text-xs font-bold text-[var(--brand-teal)] hover:underline">
                    View All Broadcasts →
                  </Link>
                </div>

                <div className="space-y-3">
                  {announcements.length === 0 ? (
                    <div className="p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                      <Bell className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-[var(--text-muted)]">No active announcements posted.</p>
                    </div>
                  ) : (
                    announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--brand-teal)] bg-[var(--brand-teal-subtle)] px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)]">
                            {(ann.scope || 'global').toUpperCase()}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">
                            {ann.postedAt ? new Date(ann.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[var(--text-heading)]">{ann.title}</h4>
                        <p className="text-xs text-[var(--text-body)] leading-relaxed">
                          {ann.content || ann.body || ''}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </>
      )}

      {/* User Profile Detail Drawer (Management Only) */}
      {isManagement && selectedUser && (
        <UserProfileDrawer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Quick Invite Talent Modal (Management Only) */}
      {isManagement && isInviteOpen && (
        <QuickInviteModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
        />
      )}

    </div>
  );
};
