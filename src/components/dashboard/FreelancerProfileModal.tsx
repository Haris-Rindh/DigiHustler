import React from 'react';
import { User } from '../../types';
import { X, Award, DollarSign, Star, CheckCircle, Briefcase, GraduationCap } from 'lucide-react';

interface Props {
  user: User;
  onClose: () => void;
}

export const FreelancerProfileModal: React.FC<Props> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 p-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-heading)]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="text-center space-y-3 pt-2">
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-24 h-24 rounded-2xl object-cover mx-auto ring-4 ring-cyan-500/30 shadow-xl"
          />
          <div>
            <h2 className="font-display font-extrabold text-2xl text-[var(--text-heading)]">{user.name}</h2>
            <p className="text-xs text-cyan-400 font-semibold">{user.title}</p>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{user.digiskillBatch || 'Digiskill Certified'}</span>
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-emerald-300" />
              <span>{user.rating} / 5.0 Rating</span>
            </span>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-xs text-[var(--text-body)] text-center mt-4 bg-[var(--bg-subtle)] p-3 rounded-2xl border border-white/5 leading-relaxed">
            "{user.bio}"
          </p>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
            <Briefcase className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Projects</span>
            <p className="font-display font-extrabold text-lg text-[var(--text-heading)] mt-0.5">{user.completedProjectsCount}</p>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
            <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">On-Time SLA</span>
            <p className="font-display font-extrabold text-lg text-emerald-400 mt-0.5">{user.onTimeDeliveryPct || 99}%</p>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
            <Award className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Status</span>
            <p className="font-display font-extrabold text-lg text-[var(--text-heading)] mt-0.5 capitalize">{user.status.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Skill Tags */}
        <div>
          <h4 className="text-xs font-bold text-[var(--text-body)] uppercase tracking-wider mb-2">Specialties & Tags</h4>
          <div className="flex flex-wrap gap-1.5">
            {user.specialties.map((spec, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-body)] border border-[var(--border-subtle)]">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle)]/20 text-xs font-bold text-[var(--text-heading)]"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
