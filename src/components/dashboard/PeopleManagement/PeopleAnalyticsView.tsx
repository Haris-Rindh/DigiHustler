import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Star, Award, CheckCircle2, DollarSign, Clock, Shield } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { User } from '../../../types';

interface PeopleAnalyticsViewProps {
  onSelectUser: (user: User) => void;
}

export const PeopleAnalyticsView: React.FC<PeopleAnalyticsViewProps> = ({ onSelectUser }) => {
  const { users, applicants, groups, projects, payouts } = useApp();

  const totalHeadcount = users.length;
  const activeCount = users.filter((u) => u.status === 'active').length;
  const pendingOnboardingCount = users.filter((u) => u.status === 'pending_onboarding').length;
  const onLeaveCount = users.filter((u) => u.status === 'on_leave').length;

  const totalPaidOut = payouts.reduce((acc, p) => acc + p.amount, 0);
  const avgRating = (users.reduce((acc, u) => acc + u.rating, 0) / (users.length || 1)).toFixed(2);
  const approvedApplicants = applicants.filter((a) => a.status === 'approved').length;
  const conversionRate = ((approvedApplicants / (applicants.length || 1)) * 100).toFixed(1);

  // Top performers
  const topSpecialists = [...users].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Total Talent Pool</span>
          <p className="font-display font-extrabold text-3xl text-[var(--text-heading)] mt-1">{totalHeadcount}</p>
          <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)] mt-2">
            <span className="text-emerald-400 font-bold">{activeCount} Active</span>
            <span>·</span>
            <span>{onLeaveCount} Leave</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Average CSAT Rating</span>
          <p className="font-display font-extrabold text-3xl text-emerald-400 mt-1 flex items-center gap-1">
            <Star className="w-6 h-6 fill-emerald-400" />
            <span>{avgRating}</span>
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-2">Across 120+ client reviews</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Applicant Conversion</span>
          <p className="font-display font-extrabold text-3xl text-[var(--text-heading)] mt-1">{conversionRate}%</p>
          <p className="text-xs text-[var(--text-muted)] mt-2">{approvedApplicants} approved to date</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">On-Time Milestone Delivery</span>
          <p className="font-display font-extrabold text-3xl text-cyan-400 mt-1">99.4%</p>
          <p className="text-xs text-[var(--text-muted)] mt-2">Verified quality SLA benchmark</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Squad Headcount Distribution */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl space-y-4">
          <h3 className="font-display font-bold text-lg text-[var(--text-heading)]">Squad Headcount Distribution</h3>
          <div className="space-y-3 pt-2">
            {groups.map((g) => {
              const count = users.filter((u) => u.groupId === g.id).length;
              const pct = ((count / (totalHeadcount || 1)) * 100).toFixed(0);

              return (
                <div key={g.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-[var(--text-body)]">
                    <span>{g.name}</span>
                    <span className="text-[var(--text-heading)]">{count} members ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--bg-page)] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#022B3A] via-[#1F7A8C] to-[#E1E5F2] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Community Performers */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl space-y-4">
          <h3 className="font-display font-bold text-lg text-[var(--text-heading)]">Top Rated Specialists</h3>
          <div className="space-y-3 pt-2">
            {topSpecialists.map((specialist, idx) => (
              <div
                key={specialist.id}
                onClick={() => onSelectUser(specialist)}
                className="p-3 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-xl bg-[var(--brand-teal)]/20 text-[var(--text-heading)] font-extrabold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </div>
                  <img
                    src={specialist.avatarUrl}
                    alt={specialist.name}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#1e4a5d]"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-[var(--text-heading)]">{specialist.name}</h4>
                    <p className="text-[10px] text-[var(--text-muted)]">{specialist.title}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-xs text-amber-400 flex items-center justify-end gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{specialist.rating || 5.0}</span>
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {specialist.completedProjectsCount} projects
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
