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
  const topEarners = [...users].sort((a, b) => b.totalEarnings - a.totalEarnings).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-[#0d2833] border border-[#1e4a5d] shadow-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Talent Pool</span>
          <p className="font-display font-extrabold text-3xl text-white mt-1">{totalHeadcount}</p>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-2">
            <span className="text-emerald-400 font-bold">{activeCount} Active</span>
            <span>·</span>
            <span>{onLeaveCount} Leave</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0d2833] border border-[#1e4a5d] shadow-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400">Average CSAT Rating</span>
          <p className="font-display font-extrabold text-3xl text-emerald-400 mt-1 flex items-center gap-1">
            <Star className="w-6 h-6 fill-emerald-400" />
            <span>{avgRating}</span>
          </p>
          <p className="text-xs text-slate-400 mt-2">Across 120+ client reviews</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0d2833] border border-[#1e4a5d] shadow-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400">Applicant Conversion</span>
          <p className="font-display font-extrabold text-3xl text-[#bde0fe] mt-1">{conversionRate}%</p>
          <p className="text-xs text-slate-400 mt-2">{approvedApplicants} approved to date</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0d2833] border border-[#1e4a5d] shadow-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Talent Disbursed</span>
          <p className="font-display font-extrabold text-3xl text-cyan-400 mt-1">${totalPaidOut.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-2">100% verified ledger settlement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Squad Headcount Distribution */}
        <div className="p-6 rounded-3xl bg-[#0d2833] border border-[#1e4a5d] shadow-xl space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Squad Headcount Distribution</h3>
          <div className="space-y-3 pt-2">
            {groups.map((g) => {
              const count = users.filter((u) => u.groupId === g.id).length;
              const pct = ((count / (totalHeadcount || 1)) * 100).toFixed(0);

              return (
                <div key={g.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>{g.name}</span>
                    <span className="text-[#bde0fe]">{count} members ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#071e26] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1a7a8c] to-[#0ea5e9] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Community Performers */}
        <div className="p-6 rounded-3xl bg-[#0d2833] border border-[#1e4a5d] shadow-xl space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Top Community Earners</h3>
          <div className="space-y-3 pt-2">
            {topEarners.map((earner, idx) => (
              <div
                key={earner.id}
                onClick={() => onSelectUser(earner)}
                className="p-3 rounded-2xl bg-[#071e26] border border-[#1e4a5d] hover:border-[#1a7a8c] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-xl bg-[#1a7a8c]/20 text-[#bde0fe] font-extrabold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </div>
                  <img
                    src={earner.avatarUrl}
                    alt={earner.name}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#1e4a5d]"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-white">{earner.name}</h4>
                    <p className="text-[10px] text-slate-400">{earner.title}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-xs text-emerald-400 block">
                    ${earner.totalEarnings.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {earner.completedProjectsCount} projects
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
