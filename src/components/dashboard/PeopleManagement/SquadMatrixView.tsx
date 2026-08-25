import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Award, Code, Palette, Cpu, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Group, User } from '../../../types';

interface SquadMatrixViewProps {
  onSelectUser: (user: User) => void;
}

export const SquadMatrixView: React.FC<SquadMatrixViewProps> = ({ onSelectUser }) => {
  const { groups, users, projects } = useApp();

  const getGroupIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-5 h-5" />;
      case 'Palette':
        return <Palette className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'TrendingUp':
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group) => {
          const leader = users.find((u) => u.id === group.leaderId) || users.find((u) => u.groupId === group.id && u.role === 'group_leader');
          const squadMembers = users.filter((u) => u.groupId === group.id && u.role === 'freelancer');
          const activeProjects = projects.filter((p) => p.groupId === group.id && p.status !== 'paid');

          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl flex flex-col justify-between space-y-6"
            >
              <div>
                {/* Squad Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--brand-teal)]/20 border border-[var(--brand-teal)]/40 flex items-center justify-center text-[var(--text-heading)]">
                      {getGroupIcon(group.iconName)}
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">{group.name}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{group.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Active Projects</span>
                    <span className="font-extrabold text-sm text-cyan-400">{activeProjects.length} Sprints</span>
                  </div>
                </div>

                {/* Group Leader Spotlight */}
                {leader && (
                  <div className="mt-5 p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={leader.avatarUrl}
                        alt={leader.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-[var(--brand-teal)]"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                            Designated Group Leader
                          </span>
                          <span className="text-[11px] text-[var(--text-muted)]">{leader.digiskillBatch}</span>
                        </div>
                        <h4 className="font-bold text-sm text-[var(--text-heading)] mt-0.5">{leader.name}</h4>
                        <p className="text-xs text-[var(--text-body)]">{leader.title}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectUser(leader)}
                      className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle)] text-xs font-bold text-[var(--text-heading)] border border-[var(--border-subtle)] transition-colors"
                    >
                      Inspect
                    </button>
                  </div>
                )}

                {/* Squad Members Roster */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">
                    <span>Squad Specialists ({squadMembers.length})</span>
                    <span>Rating</span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {squadMembers.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => onSelectUser(member)}
                        className="p-2.5 rounded-xl bg-[var(--bg-page)]/60 hover:bg-[var(--bg-page)] border border-[var(--border-subtle)]/50 hover:border-[var(--brand-teal)] flex items-center justify-between cursor-pointer transition-colors text-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-7 h-7 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold text-[var(--text-heading)]">{member.name}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">{member.title}</p>
                          </div>
                        </div>

                        <span className="flex items-center gap-0.5 text-emerald-400 font-bold text-xs">
                          <Star className="w-3 h-3 fill-emerald-400" />
                          <span>{member.rating}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Specialties Strip */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap gap-1.5">
                {group.specialties.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-md bg-[var(--bg-page)] text-[var(--text-body)] text-[10px] border border-[var(--border-subtle)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
