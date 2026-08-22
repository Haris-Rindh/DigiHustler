import React from 'react';
import { useApp } from '../../context/AppContext';
import { Code, Palette, Cpu, TrendingUp, Star, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Groups: React.FC = () => {
  const { groups, users } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest">
          Organizational Flowchart
        </span>
        <h1 className="font-display font-extrabold text-4xl text-white">Groups & Department Structure</h1>
        <p className="text-xs text-slate-400">
          DigiHust is divided into 4 specialized divisions. Every project is routed down to a specific Group Leader and their verified roster.
        </p>
      </div>

      {/* 4 Group Cards Detailed */}
      <div className="space-y-10">
        {groups.map(group => {
          const leader = users.find(u => u.id === group.leaderId) || users.find(u => u.groupId === group.id && u.role === 'group_leader');
          const freelancers = users.filter(u => u.groupId === group.id && u.role === 'freelancer');

          return (
            <div key={group.id} className="glass-card p-8 rounded-3xl space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${group.color} flex items-center justify-center text-white shadow-xl`}>
                    {group.id === 'tech' && <Code className="w-7 h-7" />}
                    {group.id === 'creative' && <Palette className="w-7 h-7" />}
                    {group.id === 'data' && <Cpu className="w-7 h-7" />}
                    {group.id === 'growth' && <TrendingUp className="w-7 h-7" />}
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-2xl text-white">{group.name}</h2>
                    <p className="text-xs text-slate-400">{group.description}</p>
                  </div>
                </div>

                <Link
                  to="/roster"
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 text-xs font-bold text-cyan-300 transition-all flex items-center space-x-1"
                >
                  <span>View Full Group Roster</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Leader Spotlight */}
              {leader && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex items-center space-x-4">
                  <img src={leader.avatarUrl} alt={leader.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-cyan-500/30" />
                  <div className="flex-1">
                    <span className="text-[9px] uppercase font-bold text-cyan-400">Department Leader</span>
                    <h4 className="font-bold text-sm text-white">{leader.name}</h4>
                    <p className="text-xs text-slate-400">{leader.title} • {leader.digiskillBatch}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 justify-end">
                      <Star className="w-3.5 h-3.5 fill-emerald-400" />
                      <span>{leader.rating}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{leader.completedProjectsCount} projects led</span>
                  </div>
                </div>
              )}

              {/* Skill Tags */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Group Specialties & Technical Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {group.specialties.map((spec, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-xl bg-white/5 text-slate-200 border border-white/10 font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
