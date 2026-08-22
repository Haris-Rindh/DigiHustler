import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GroupId, User } from '../../types';
import { Users, Code, Palette, Cpu, TrendingUp, Star, Award, DollarSign, ExternalLink, Search } from 'lucide-react';
import { FreelancerProfileModal } from './FreelancerProfileModal';

export const RosterView: React.FC = () => {
  const { groups, users } = useApp();

  const [activeGroupId, setActiveGroupId] = useState<GroupId>('tech');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0];
  const groupLeader = users.find(u => u.id === activeGroup.leaderId) || users.find(u => u.groupId === activeGroupId && u.role === 'group_leader');
  const groupFreelancers = users.filter(u => u.groupId === activeGroupId && u.role === 'freelancer');

  const filteredFreelancers = groupFreelancers.filter(f => {
    return f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-widest">
            Community Roster
          </span>
          <h1 className="font-display font-extrabold text-3xl text-white mt-1">Department Group Rosters</h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Browse specialized talent pools across DigiHust's 4 organizational divisions. Every member is a verified Digiskill graduate.
          </p>
        </div>

        {/* Group Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {groups.map(g => (
            <button
              key={g.id}
              onClick={() => setActiveGroupId(g.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeGroupId === g.id 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/20' 
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{g.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Group Leader Spotlight Header */}
      {groupLeader && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img 
              src={groupLeader.avatarUrl} 
              alt={groupLeader.name} 
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-cyan-500/30 shadow-xl" 
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  Group Leader Spotlight
                </span>
                <span className="text-xs text-slate-400">{groupLeader.digiskillBatch}</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl text-white mt-0.5">{groupLeader.name}</h2>
              <p className="text-xs text-cyan-400 font-semibold">{groupLeader.title}</p>
              <p className="text-xs text-slate-300 mt-2 max-w-xl">{groupLeader.bio}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Projects Led</span>
              <p className="font-display font-extrabold text-xl text-white mt-1">{groupLeader.completedProjectsCount}</p>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Rating</span>
              <p className="font-display font-extrabold text-xl text-emerald-400 mt-1 flex items-center justify-center gap-0.5">
                <Star className="w-4 h-4 fill-emerald-400" />
                <span>{groupLeader.rating}</span>
              </p>
            </div>
            <button
              onClick={() => setSelectedUser(groupLeader)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/10"
            >
              Full Profile
            </button>
          </div>
        </div>
      )}

      {/* Freelancers List Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-extrabold text-xl text-white">Group Member Freelancers ({groupFreelancers.length})</h3>
          <p className="text-xs text-slate-400">Available specialists ready for project assignment</p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text"
            placeholder="Search by name or skill tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Freelancers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFreelancers.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white/5 rounded-3xl border border-white/10 text-slate-400 text-xs">
            No freelancers in this group match your search criteria.
          </div>
        ) : (
          filteredFreelancers.map(fl => (
            <div 
              key={fl.id}
              onClick={() => setSelectedUser(fl)}
              className="glass-card glass-card-hover p-5 rounded-3xl space-y-4 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={fl.avatarUrl} alt={fl.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10" />
                  <div>
                    <h4 className="font-bold text-sm text-white hover:text-cyan-300 transition-colors">{fl.name}</h4>
                    <p className="text-xs text-cyan-400 font-medium">{fl.title}</p>
                    <span className="text-[10px] text-slate-400">{fl.digiskillBatch}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  "{fl.bio || 'Verified Digiskill graduate specialized in client delivery.'}"
                </p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1">
                  {fl.specialties.map((spec, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Metrics */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-emerald-400" />
                  <span>{fl.rating}</span>
                </span>
                <span className="text-slate-400">{fl.completedProjectsCount} projects done</span>
                <span className="text-cyan-400 font-bold">${fl.hourlyRate || 25}/hr</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Freelancer Profile Modal */}
      {selectedUser && (
        <FreelancerProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

    </div>
  );
};
