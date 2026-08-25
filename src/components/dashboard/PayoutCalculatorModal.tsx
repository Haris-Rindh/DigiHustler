import React, { useState } from 'react';
import { X, Calculator, Copy, Check, Info } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const PayoutCalculatorModal: React.FC<Props> = ({ onClose }) => {
  const [gross, setGross] = useState(2000);
  const [fee, setFee] = useState(0);
  const [lgSource, setLgSource] = useState<'independent' | 'management'>('independent');
  const [lgPct, setLgPct] = useState(15);
  const [mgmtPct, setMgmtPct] = useState(20);
  const [ldrPct, setLdrPct] = useState(10);
  const [deptStructure, setDeptStructure] = useState<'single' | 'multi'>('single');
  const [d1Weight, setD1Weight] = useState(60);
  const [teamModel, setTeamModel] = useState<'solo' | 'group'>('solo');
  const [copied, setCopied] = useState(false);

  const net = Math.max(0, gross - fee);
  let lgPayout = lgSource === 'independent' ? net * (lgPct / 100) : 0;
  let effectiveMgmtPct = lgSource === 'independent' ? mgmtPct : mgmtPct + lgPct;
  let mgmtPayout = net * (effectiveMgmtPct / 100);
  let totalLdrPayout = net * (ldrPct / 100);
  let flPoolPayout = net - (lgPayout + mgmtPayout + totalLdrPayout);

  const d2Weight = 100 - d1Weight;

  const copySummaryText = () => {
    const summary = `📌 DIGIHUST PROJECT FINANCIAL BREAKDOWN
Gross Project Revenue: $${gross.toLocaleString()}
Net Revenue: $${net.toLocaleString()}
- Lead Generator: $${Math.round(lgPayout).toLocaleString()} (${lgSource === 'independent' ? lgPct + '%' : 'Absorbed by Management'})
- Management Cut: $${Math.round(mgmtPayout).toLocaleString()} (${effectiveMgmtPct}%)
- Leader(s) Cut: $${Math.round(totalLdrPayout).toLocaleString()} (${ldrPct}%)
- Freelancer Pool: $${Math.round(flPoolPayout).toLocaleString()} (${((flPoolPayout / (net || 1)) * 100).toFixed(1)}%)
Generated via DigiHust Financial Architecture.`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal)] flex items-center justify-center text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-xl text-[var(--text-heading)]">DigiHust Revenue Split Engine</h2>
              <p className="text-xs text-[var(--text-muted)]">Interactive financial calculator matching baseline community percentage rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Controls Column */}
          <div className="space-y-5 bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-subtle)]">
            <h3 className="text-sm font-bold text-[var(--text-heading)] uppercase tracking-wider text-[var(--brand-teal)] flex items-center gap-1.5">
              <span>⚙️ Input Project Parameters</span>
            </h3>

            <div>
              <label className="flex justify-between text-xs font-semibold text-[var(--text-body)] mb-1">
                <span>Gross Project Revenue ($)</span>
                <span className="text-[var(--brand-teal)] font-bold">${gross.toLocaleString()}</span>
              </label>
              <input 
                type="number" 
                value={gross} 
                onChange={(e) => setGross(parseFloat(e.target.value) || 0)} 
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-white text-sm focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>

            <div>
              <label className="flex justify-between text-xs font-semibold text-[var(--text-body)] mb-1">
                <span>Transaction / Payment Fee ($)</span>
                <span className="text-[var(--brand-teal)] font-bold">${fee.toLocaleString()}</span>
              </label>
              <input 
                type="number" 
                value={fee} 
                onChange={(e) => setFee(parseFloat(e.target.value) || 0)} 
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-white text-sm focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>

            {/* Lead Gen Source Toggle */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-body)] mb-1.5 block">Lead Generator Origin</label>
              <div className="grid grid-cols-2 gap-2 bg-[var(--bg-page)] p-1 rounded-xl border border-[var(--border-subtle)]">
                <button 
                  type="button" 
                  onClick={() => setLgSource('independent')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${lgSource === 'independent' ? 'bg-[var(--brand-teal)] text-white shadow' : 'text-[var(--text-muted)] hover:text-white'}`}
                >
                  Independent Member
                </button>
                <button 
                  type="button" 
                  onClick={() => setLgSource('management')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${lgSource === 'management' ? 'bg-purple-600 text-white shadow' : 'text-[var(--text-muted)] hover:text-white'}`}
                >
                  Management Sourced
                </button>
              </div>
            </div>

            {lgSource === 'independent' && (
              <div>
                <label className="flex justify-between text-xs font-semibold text-[var(--text-body)] mb-1">
                  <span>Lead Generator Cut %</span>
                  <span className="text-amber-400 font-bold">{lgPct}%</span>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="20" 
                  value={lgPct} 
                  onChange={(e) => setLgPct(parseFloat(e.target.value))} 
                  className="w-full accent-amber-400"
                />
              </div>
            )}

            {/* Management Split */}
            <div>
              <label className="flex justify-between text-xs font-semibold text-[var(--text-body)] mb-1">
                <span>Management Cut % (Baseline 20–25%)</span>
                <span className="text-purple-400 font-bold">{mgmtPct}%</span>
              </label>
              <input 
                type="range" 
                min="20" 
                max="25" 
                value={mgmtPct} 
                onChange={(e) => setMgmtPct(parseFloat(e.target.value))} 
                className="w-full accent-purple-500"
              />
            </div>

            {/* Group Leader Split */}
            <div>
              <label className="flex justify-between text-xs font-semibold text-[var(--text-body)] mb-1">
                <span>Group Leader Cut % (Baseline 5–10%)</span>
                <span className="text-[var(--brand-teal)] font-bold">{ldrPct}%</span>
              </label>
              <input 
                type="range" 
                min="5" 
                max="10" 
                value={ldrPct} 
                onChange={(e) => setLdrPct(parseFloat(e.target.value))} 
                className="w-full accent-breeze-teal"
              />
            </div>

            {/* Structure Toggle */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-body)] mb-1.5 block">Department Structure</label>
              <div className="grid grid-cols-2 gap-2 bg-[var(--bg-page)] p-1 rounded-xl border border-[var(--border-subtle)]">
                <button 
                  type="button" 
                  onClick={() => setDeptStructure('single')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${deptStructure === 'single' ? 'bg-[var(--brand-teal)] text-white shadow' : 'text-[var(--text-muted)] hover:text-white'}`}
                >
                  Single Group
                </button>
                <button 
                  type="button" 
                  onClick={() => setDeptStructure('multi')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${deptStructure === 'multi' ? 'bg-indigo-600 text-white shadow' : 'text-[var(--text-muted)] hover:text-white'}`}
                >
                  Cross-Departmental
                </button>
              </div>
            </div>

            {deptStructure === 'multi' && (
              <div className="p-3 bg-[var(--bg-page)] rounded-xl border border-indigo-500/30 space-y-2">
                <span className="text-xs font-bold text-indigo-300 block">Cross-Group Split Weight</span>
                <label className="flex justify-between text-[11px] text-[var(--text-body)]">
                  <span>Group 1 Weight: <strong className="text-[var(--brand-teal)]">{d1Weight}%</strong></span>
                  <span>Group 2 Weight: <strong className="text-purple-400">{d2Weight}%</strong></span>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="90" 
                  value={d1Weight} 
                  onChange={(e) => setD1Weight(parseFloat(e.target.value))} 
                  className="w-full accent-indigo-400"
                />
              </div>
            )}

            {/* Team Model */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-body)] mb-1.5 block">Execution Team Model</label>
              <div className="grid grid-cols-2 gap-2 bg-[var(--bg-page)] p-1 rounded-xl border border-[var(--border-subtle)]">
                <button 
                  type="button" 
                  onClick={() => setTeamModel('solo')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${teamModel === 'solo' ? 'bg-emerald-600 text-white shadow' : 'text-[var(--text-muted)] hover:text-white'}`}
                >
                  Solo Freelancer
                </button>
                <button 
                  type="button" 
                  onClick={() => setTeamModel('group')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${teamModel === 'group' ? 'bg-emerald-600 text-white shadow' : 'text-[var(--text-muted)] hover:text-white'}`}
                >
                  Multi-Freelancer Team
                </button>
              </div>
            </div>

          </div>

          {/* Results Summary Column */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-heading)] uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span>📊 Calculated Payout Cuts</span>
              </h3>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border-l-4 border-l-amber-500 border border-[var(--border-subtle)]">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Lead Generator</p>
                  <p className="font-display font-extrabold text-xl text-[var(--text-heading)] mt-1">${Math.round(lgPayout).toLocaleString()}</p>
                  <p className="text-[10px] text-amber-400 mt-0.5">{lgSource === 'independent' ? `${lgPct}% of Net` : '0% (Absorbed)'}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border-l-4 border-l-purple-500 border border-[var(--border-subtle)]">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Management</p>
                  <p className="font-display font-extrabold text-xl text-[var(--text-heading)] mt-1">${Math.round(mgmtPayout).toLocaleString()}</p>
                  <p className="text-[10px] text-purple-400 mt-0.5">{effectiveMgmtPct}% of Net</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border-l-4 border-l-breeze-teal border border-[var(--border-subtle)]">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Group Leader(s)</p>
                  <p className="font-display font-extrabold text-xl text-[var(--text-heading)] mt-1">${Math.round(totalLdrPayout).toLocaleString()}</p>
                  <p className="text-[10px] text-[var(--brand-teal)] mt-0.5">{ldrPct}% of Net</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border-l-4 border-l-emerald-500 border border-[var(--border-subtle)]">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Freelancer Pool</p>
                  <p className="font-display font-extrabold text-xl text-[var(--text-heading)] mt-1">${Math.round(flPoolPayout).toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">{((flPoolPayout / (net || 1)) * 100).toFixed(1)}% of Net</p>
                </div>
              </div>

              {/* Revenue Share Visualizer Bar */}
              <div>
                <span className="text-[11px] font-semibold text-[var(--text-muted)] mb-1 block">Distribution Visualizer</span>
                <div className="h-3 rounded-full bg-[var(--bg-page)] overflow-hidden flex border border-[var(--border-subtle)]">
                  {lgSource === 'independent' && (
                    <div style={{ width: `${(lgPayout / (net || 1)) * 100}%` }} className="h-full bg-amber-500" title="Lead Generator" />
                  )}
                  <div style={{ width: `${(mgmtPayout / (net || 1)) * 100}%` }} className="h-full bg-purple-500" title="Management" />
                  <div style={{ width: `${(totalLdrPayout / (net || 1)) * 100}%` }} className="h-full bg-[var(--brand-teal)]" title="Group Leader" />
                  <div style={{ width: `${(flPoolPayout / (net || 1)) * 100}%` }} className="h-full bg-emerald-500" title="Freelancer Pool" />
                </div>
              </div>

              {/* Itemized Table */}
              <div>
                <span className="text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 block">Itemized Stakeholder Ledger</span>
                <div className="bg-[var(--bg-page)] rounded-xl border border-[var(--border-subtle)] overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--bg-surface)] text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                        <th className="py-2 px-3 font-semibold">Stakeholder</th>
                        <th className="py-2 px-3 font-semibold">Type</th>
                        <th className="py-2 px-3 font-semibold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-breeze-border text-[var(--text-body)]">
                      <tr>
                        <td className="py-2 px-3 font-medium">Lead Generator</td>
                        <td className="py-2 px-3 text-[10px] text-amber-400">{lgSource === 'independent' ? 'Independent Member' : 'Management Absorbed'}</td>
                        <td className="py-2 px-3 font-bold text-right text-amber-400">${Math.round(lgPayout).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">Founding Management</td>
                        <td className="py-2 px-3 text-[10px] text-purple-400">Core Infrastructure & Ops</td>
                        <td className="py-2 px-3 font-bold text-right text-purple-400">${Math.round(mgmtPayout).toLocaleString()}</td>
                      </tr>
                      {deptStructure === 'single' ? (
                        <tr>
                          <td className="py-2 px-3 font-medium">Group Leader</td>
                          <td className="py-2 px-3 text-[10px] text-[var(--brand-teal)]">Primary Department Head</td>
                          <td className="py-2 px-3 font-bold text-right text-[var(--brand-teal)]">${Math.round(totalLdrPayout).toLocaleString()}</td>
                        </tr>
                      ) : (
                        <>
                          <tr>
                            <td className="py-2 px-3 font-medium">Group 1 Leader</td>
                            <td className="py-2 px-3 text-[10px] text-[var(--brand-teal)]">Dept 1 ({d1Weight}%)</td>
                            <td className="py-2 px-3 font-bold text-right text-[var(--brand-teal)]">${Math.round(totalLdrPayout * (d1Weight / 100)).toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-medium">Group 2 Leader</td>
                            <td className="py-2 px-3 text-[10px] text-[var(--brand-teal)]">Dept 2 ({d2Weight}%)</td>
                            <td className="py-2 px-3 font-bold text-right text-[var(--brand-teal)]">${Math.round(totalLdrPayout * (d2Weight / 100)).toLocaleString()}</td>
                          </tr>
                        </>
                      )}
                      {teamModel === 'solo' ? (
                        <tr>
                          <td className="py-2 px-3 font-medium">Solo Freelancer</td>
                          <td className="py-2 px-3 text-[10px] text-emerald-400">Single Executor</td>
                          <td className="py-2 px-3 font-bold text-right text-emerald-400">${Math.round(flPoolPayout).toLocaleString()}</td>
                        </tr>
                      ) : (
                        <>
                          <tr>
                            <td className="py-2 px-3 font-medium">Lead Freelancer</td>
                            <td className="py-2 px-3 text-[10px] text-emerald-400">Architect + Bonus (55%)</td>
                            <td className="py-2 px-3 font-bold text-right text-emerald-400">${Math.round(flPoolPayout * 0.55).toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-medium">Specialist Freelancer</td>
                            <td className="py-2 px-3 text-[10px] text-emerald-400">Team Execution (45%)</td>
                            <td className="py-2 px-3 font-bold text-right text-emerald-400">${Math.round(flPoolPayout * 0.45).toLocaleString()}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                <span>Validation: Splits sum to 100% of Net</span>
              </span>
              <button 
                onClick={copySummaryText}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal)]-hover text-xs font-bold text-white transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
