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
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
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
            <h2 className="font-display font-extrabold text-2xl text-white">{user.name}</h2>
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
          <p className="text-xs text-slate-300 text-center mt-4 bg-white/5 p-3 rounded-2xl border border-white/5 leading-relaxed">
            "{user.bio}"
          </p>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 text-center">
            <Briefcase className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Projects</span>
            <p className="font-display font-extrabold text-lg text-white mt-0.5">{user.completedProjectsCount}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 text-center">
            <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Earnings</span>
            <p className="font-display font-extrabold text-lg text-emerald-400 mt-0.5">${user.totalEarnings.toLocaleString()}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 text-center">
            <Award className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Hourly</span>
            <p className="font-display font-extrabold text-lg text-white mt-0.5">${user.hourlyRate || 25}/hr</p>
          </div>
        </div>

        {/* Skill Tags */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Specialties & Tags</h4>
          <div className="flex flex-wrap gap-1.5">
            {user.specialties.map((spec, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-200 border border-white/10">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
