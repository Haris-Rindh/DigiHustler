import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Shield, UserCheck, RefreshCw, CheckCircle2, XCircle, Info, DollarSign } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, applicants, updateGlobalSettings, approveApplicant, resetToDefaultData } = useApp();

  const [mgmtPct, setMgmtPct] = useState(settings.defaultManagementPct);
  const [ldrPct, setLdrPct] = useState(settings.defaultLeaderPct);
  const [flPct, setFlPct] = useState(settings.defaultFreelancerPct);
  const [lgPct, setLgPct] = useState(settings.defaultLeadGenPct);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const pendingApplicants = applicants.filter(a => a.status === 'pending');

  const handleSaveSettings = (e: React.FormEvent) => {
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
      defaultLeadGenPct: lgPct
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
            Founding Management Controls
          </span>
          <h1 className="font-display font-extrabold text-3xl text-white mt-1">Platform Admin Settings</h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Configure global default split ranges, review incoming Digiskill applicant memberships, and manage platform parameters.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all state back to original demo seed data?')) {
              resetToDefaultData();
              alert('Platform reset to original default state!');
            }
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-xs font-bold transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Global Split Settings Form */}
        <form onSubmit={handleSaveSettings} className="glass-card p-6 rounded-3xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              <span>Global Default Split Percentages</span>
            </h3>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Auto-fills on New Projects</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            DigiHust baseline ranges: Management takes 20–25%, Group Leader takes 5–10%, and Freelancers take ~70%. Individual project splits can still be customized.
          </p>

          <div className="space-y-4">
            <div>
              <label className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Default Management Cut %</span>
                <span className="text-purple-400 font-bold">{mgmtPct}%</span>
              </label>
              <input 
                type="range"
                min="15"
                max="30"
                step="0.5"
                value={mgmtPct}
                onChange={(e) => setMgmtPct(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Default Group Leader Cut %</span>
                <span className="text-cyan-400 font-bold">{ldrPct}%</span>
              </label>
              <input 
                type="range"
                min="5"
                max="15"
                step="0.5"
                value={ldrPct}
                onChange={(e) => setLdrPct(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <label className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Default Freelancer Pool %</span>
                <span className="text-emerald-400 font-bold">{flPct}%</span>
              </label>
              <input 
                type="range"
                min="50"
                max="80"
                step="0.5"
                value={flPct}
                onChange={(e) => setFlPct(parseFloat(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>

            <div>
              <label className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Default Independent Lead Generator Bonus %</span>
                <span className="text-amber-400 font-bold">{lgPct}%</span>
              </label>
              <input 
                type="range"
                min="10"
                max="20"
                step="1"
                value={lgPct}
                onChange={(e) => setLgPct(parseFloat(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Sum check: <strong className={Math.abs(mgmtPct + ldrPct + flPct - 100) < 0.1 ? 'text-emerald-400' : 'text-rose-400'}>{mgmtPct + ldrPct + flPct}%</strong></span>
            </span>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20"
            >
              {savedSuccess ? 'Saved Successfully!' : 'Save Default Rules'}
            </button>
          </div>
        </form>

        {/* Digiskill Applicant Approval Center */}
        <div className="glass-card p-6 rounded-3xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-400" />
              <span>Digiskill Applicant Approval Center</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              {pendingApplicants.length} Pending
            </span>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {pendingApplicants.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs bg-white/5 rounded-2xl border border-white/5">
                No pending Digiskill applicants requiring review.
              </div>
            ) : (
              pendingApplicants.map(app => (
                <div key={app.id} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{app.name}</h4>
                      <p className="text-xs text-cyan-400">{app.digiskillCourse} • {app.digiskillId}</p>
                    </div>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      Pref: {app.preferredGroupId}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 italic">"{app.bio}"</p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <a 
                      href={app.portfolioUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-cyan-400 font-semibold hover:underline"
                    >
                      Portfolio Link
                    </a>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => approveApplicant(app.id, 'freelancer')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold border border-emerald-500/30"
                      >
                        Approve Freelancer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
