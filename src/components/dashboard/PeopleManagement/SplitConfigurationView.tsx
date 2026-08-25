import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Shield, Users, RefreshCw, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { User } from '../../../types';

interface SplitConfigurationViewProps {
  onSelectUser: (user: User) => void;
}

export const SplitConfigurationView: React.FC<SplitConfigurationViewProps> = ({ onSelectUser }) => {
  const { settings, users, updateGlobalSettings, setUserSplitOverride } = useApp();

  const [mgmtPct, setMgmtPct] = useState(settings.defaultManagementPct);
  const [ldrPct, setLdrPct] = useState(settings.defaultLeaderPct);
  const [flPct, setFlPct] = useState(settings.defaultFreelancerPct);
  const [lgPct, setLgPct] = useState(settings.defaultLeadGenPct);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const usersWithOverrides = users.filter((u) => u.splitOverride !== undefined);

  const handleSaveGlobal = (e: React.FormEvent) => {
    e.preventDefault();
    if (Math.abs(mgmtPct + ldrPct + flPct - 100) > 0.1) {
      alert('Global default Management, Leader, and Freelancer splits must sum to 100%.');
      return;
    }

    updateGlobalSettings({
      ...settings,
      defaultManagementPct: mgmtPct,
      defaultLeaderPct: ldrPct,
      defaultFreelancerPct: flPct,
      defaultLeadGenPct: lgPct,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const removeOverride = (userId: string) => {
    setUserSplitOverride(userId, undefined);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Global Default Split Settings Form */}
        <form onSubmit={handleSaveGlobal} className="p-6 rounded-3xl bg-[#0d2833] border border-[#1e4a5d] space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1e4a5d] pb-3">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#1a7a8c]" />
              <span>Global Default Split Allocation</span>
            </h3>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Standard Baseline</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            DigiHust standard baseline: Management takes 15–20%, Group Leader takes 20–25%, and Freelancer pool takes ~60%. Automatically auto-fills on newly scoped projects.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Default Management Cut %</span>
                <span className="text-[#bde0fe] font-bold">{mgmtPct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                step="1"
                value={mgmtPct}
                onChange={(e) => setMgmtPct(parseFloat(e.target.value))}
                className="w-full accent-[#1a7a8c]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Default Group Leader Cut %</span>
                <span className="text-cyan-400 font-bold">{ldrPct}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="35"
                step="1"
                value={ldrPct}
                onChange={(e) => setLdrPct(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Default Specialist Freelancer Pool %</span>
                <span className="text-emerald-400 font-bold">{flPct}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="75"
                step="1"
                value={flPct}
                onChange={(e) => setFlPct(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="pt-2 border-t border-[#1e4a5d]/60">
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Independent Lead Gen Commission %</span>
                <span className="text-amber-400 font-bold">{lgPct}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={lgPct}
                onChange={(e) => setLgPct(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs">
              <span className="text-slate-400">Total Core Split: </span>
              <strong className={mgmtPct + ldrPct + flPct === 100 ? 'text-emerald-400 font-extrabold' : 'text-rose-400 font-extrabold'}>
                {mgmtPct + ldrPct + flPct}%
              </strong>
            </div>

            <div className="flex items-center space-x-2">
              {savedSuccess && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-bold text-xs shadow-md transition-colors"
              >
                Save Global Defaults
              </button>
            </div>
          </div>
        </form>

        {/* Individual Split Overrides List */}
        <div className="p-6 rounded-3xl bg-[#0d2833] border border-[#1e4a5d] space-y-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1e4a5d] pb-3">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#bde0fe]" />
                <span>Custom Per-Person Overrides</span>
              </h3>
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                {usersWithOverrides.length} Configured
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed my-3">
              Specialists or senior leads who have contractually negotiated compensation splits that differ from the global baseline.
            </p>

            <div className="space-y-3 mt-4">
              {usersWithOverrides.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#071e26] border border-[#1e4a5d] text-slate-400 text-xs">
                  No individual split overrides configured. All talent uses the global baseline.
                </div>
              ) : (
                usersWithOverrides.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-2xl bg-[#071e26] border border-[#1e4a5d] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-white">{u.name}</h4>
                        <p className="text-[10px] text-slate-400">{u.title}</p>
                        <p className="text-[10px] text-[#bde0fe] font-semibold mt-0.5">
                          Override: {u.splitOverride?.managementPct || mgmtPct}% Mgmt / {u.splitOverride?.leaderPct || ldrPct}% Leader / {u.splitOverride?.freelancerPct || flPct}% Talent
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSelectUser(u)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-bold text-white border border-white/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeOverride(u.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                        title="Reset to Global Default"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Per-person overrides apply when assigning this talent to new project scopes in the Kanban board.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
