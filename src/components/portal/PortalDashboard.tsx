import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, Users, Briefcase, Award, Bell, CheckCircle2, 
  ArrowRight, Shield, Layers, TrendingUp, Clock, PlusCircle, 
  CheckSquare, FileText, Lock, Key, AlertCircle, Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ForcePasswordReset } from './ForcePasswordReset';
import { PERMISSIONS } from '../../lib/permissions';

export const PortalDashboard: React.FC = () => {
  const { currentUser, currentTier, users, groups, projects, assignments, announcements, payouts, leads } = useApp();

  // If the user must change password on first login
  if (currentUser.forcePasswordChange) {
    return <ForcePasswordReset />;
  }

  // Filter assignments based on 4-Tier Access Matrix
  const visibleAssignments = assignments.filter((asgn) => {
    if (currentTier === 'ceo' || currentTier === 'manager') return true;
    if (currentTier === 'group_leader') return asgn.assignedLeaderId === currentUser.id || asgn.squad === currentUser.groupId;
    return asgn.assignedMemberIds.includes(currentUser.id);
  });

  // Calculate Metrics based on tier
  const totalGrossRevenue = projects.reduce((acc, p) => acc + p.totalValue, 0);
  const totalPlatformReserve = payouts.filter(p => p.userRole === 'management').reduce((acc, p) => acc + p.amount, 0);
  const myEarnings = payouts.filter(p => p.userId === currentUser.id).reduce((acc, p) => acc + p.amount, 0);
  const activeAssignmentsCount = visibleAssignments.filter(a => a.status === 'in_progress' || a.status === 'assigned').length;
  const pendingLeadsCount = leads.filter(l => l.status === 'new_lead' || l.status === 'under_review').length;

  const mySubTasks = visibleAssignments.flatMap(a => a.subTasks.filter(st => st.assignedMemberId === currentUser.id));
  const myCompletedTasks = mySubTasks.filter(st => st.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-teal)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[var(--brand-teal)] shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[var(--brand-teal)] bg-[var(--brand-teal-subtle)] px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)]">
                {currentUser.memberId || 'DGH2600001'}
              </span>
              <span className="text-xs uppercase font-extrabold text-[var(--text-muted)]">
                {currentTier.toUpperCase()} LEVEL
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)]">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-body)]">
              {currentUser.title} · {currentUser.digiskillBatch || 'Verified Specialist'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <Link
            to="/portal/assignments"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all"
          >
            <Briefcase className="w-4 h-4" />
            <span>View Assignments</span>
          </Link>
          <Link
            to="/portal/announcements"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-xs font-bold text-[var(--text-heading)] bg-[var(--bg-page)] hover:bg-[var(--bg-subtle)] transition-all"
          >
            <Bell className="w-4 h-4" />
            <span>Broadcasts</span>
          </Link>
        </div>
      </div>

      {/* Tier-Specific Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1 */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-md">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {currentTier === 'ceo' ? 'Gross Revenue' : currentTier === 'manager' ? 'Pipeline Volume' : 'Personal Earnings'}
            </span>
            <DollarSign className="w-4 h-4 text-[var(--brand-teal)]" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-[var(--text-heading)] mb-1">
            ${currentTier === 'ceo' ? totalGrossRevenue.toLocaleString() : currentTier === 'manager' ? totalGrossRevenue.toLocaleString() : myEarnings.toLocaleString()}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            {currentTier === 'ceo' ? 'Company-wide gross receipts' : currentTier === 'manager' ? 'Total scoped project pipeline' : 'Completed milestone disbursements'}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-md">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Sprints</span>
            <Briefcase className="w-4 h-4 text-[var(--brand-teal)]" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-[var(--text-heading)] mb-1">
            {activeAssignmentsCount}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            {currentTier === 'member' ? 'Your active project assignments' : 'Coordinated squad deliveries'}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-md">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {currentTier === 'ceo' || currentTier === 'manager' ? 'Lead Intake' : 'Sprint Tasks'}
            </span>
            <Layers className="w-4 h-4 text-[var(--brand-teal)]" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-[var(--text-heading)] mb-1">
            {currentTier === 'ceo' || currentTier === 'manager' ? pendingLeadsCount : `${myCompletedTasks}/${mySubTasks.length}`}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            {currentTier === 'ceo' || currentTier === 'manager' ? 'New leads pending scoping' : 'Sub-tasks completed in active sprints'}
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-md">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {currentTier === 'ceo' || currentTier === 'manager' ? 'Verified Staff' : 'SLA Quality'}
            </span>
            <Award className="w-4 h-4 text-[var(--brand-teal)]" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-[var(--text-heading)] mb-1">
            {currentTier === 'ceo' || currentTier === 'manager' ? users.length : '100%'}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            {currentTier === 'ceo' || currentTier === 'manager' ? 'Active DGH member identities' : 'On-time milestone delivery score'}
          </p>
        </div>

      </div>

      {/* Two Column Section: Active Assignments + Broadcasts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Active Assignments Preview */}
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
            {visibleAssignments.map((asgn) => {
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
                    <span>Lead: <strong className="text-[var(--text-heading)]">{asgn.assignedLeaderName}</strong></span>
                    <span className="text-[var(--brand-teal)] font-semibold flex items-center gap-1">
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column: Latest Broadcasts */}
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
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[var(--brand-teal)] bg-[var(--brand-teal-subtle)] px-2 py-0.5 rounded">
                    {ann.scope.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {new Date(ann.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h5 className="font-bold text-xs text-[var(--text-heading)]">{ann.title}</h5>
                <p className="text-[11px] text-[var(--text-body)] line-clamp-2 leading-relaxed">
                  {ann.body}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
