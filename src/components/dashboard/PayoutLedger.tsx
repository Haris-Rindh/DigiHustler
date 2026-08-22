import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { DollarSign, Download, Search, Filter } from 'lucide-react';

export const PayoutLedger: React.FC = () => {
  const { payouts } = useApp();

  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayouts = payouts.filter(p => {
    const matchesRole = roleFilter === 'all' || p.userRole === roleFilter;
    const matchesSearch = 
      p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.groupName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const totalDisbursed = payouts.reduce((sum, p) => sum + p.amount, 0);
  const mgmtDisbursed = payouts.filter(p => p.userRole === 'management').reduce((sum, p) => sum + p.amount, 0);
  const ldrDisbursed = payouts.filter(p => p.userRole === 'group_leader').reduce((sum, p) => sum + p.amount, 0);
  const flDisbursed = payouts.filter(p => p.userRole === 'freelancer').reduce((sum, p) => sum + p.amount, 0);

  const exportCSV = () => {
    const headers = ['Payout ID', 'Project', 'Recipient', 'Role', 'Group', 'Description', 'Amount ($)', 'Paid At'];
    const rows = payouts.map(p => [
      p.id,
      `"${p.projectTitle}"`,
      `"${p.userName}"`,
      p.userRole,
      `"${p.groupName}"`,
      `"${p.roleDescription}"`,
      p.amount.toFixed(2),
      p.paidAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `digihust_payout_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Page Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 breeze-card p-6 rounded-2xl">
        <div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-breeze-surface border border-breeze-border text-emerald-300 uppercase tracking-widest">
            Financial Ledger Engine
          </span>
          <h1 className="font-display font-extrabold text-3xl text-white mt-1">Itemized Payout & Revenue Ledger</h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Historical audit log tracking exact percentage splits and financial distributions across Management, Group Leaders, Lead Generators, and Freelancer Pools.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-breeze-surface border border-breeze-border hover:border-breeze-teal text-xs font-bold text-breeze-sky transition-all shadow"
        >
          <Download className="w-4 h-4 text-breeze-teal" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Cumulative Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl breeze-card">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Net Disbursed</span>
          <p className="font-display font-extrabold text-3xl text-white mt-2">${totalDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="text-xs text-breeze-sky mt-1 block">100% of Completed Revenue</span>
        </div>

        <div className="p-5 rounded-2xl breeze-card">
          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">Management Share</span>
          <p className="font-display font-extrabold text-3xl text-purple-400 mt-2">${mgmtDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="text-xs text-slate-400 mt-1 block">Founding Management Cut</span>
        </div>

        <div className="p-5 rounded-2xl breeze-card">
          <span className="text-[10px] uppercase font-bold tracking-wider text-breeze-sky">Group Leaders Share</span>
          <p className="font-display font-extrabold text-3xl text-breeze-sky mt-2">${ldrDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="text-xs text-slate-400 mt-1 block">Department Leaders Pool</span>
        </div>

        <div className="p-5 rounded-2xl breeze-card">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">Freelancer Pool Share</span>
          <p className="font-display font-extrabold text-3xl text-emerald-400 mt-2">${flDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="text-xs text-slate-400 mt-1 block">Execution Team & Hunters</span>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 breeze-card p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text"
            placeholder="Search by recipient, project title, or group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-breeze-dark border border-breeze-border rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-breeze-teal"
          />
        </div>

        <div className="flex items-center space-x-1 bg-breeze-dark p-1 rounded-xl border border-breeze-border text-xs w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <button 
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${roleFilter === 'all' ? 'bg-breeze-teal text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            All Roles
          </button>
          <button 
            onClick={() => setRoleFilter('management')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${roleFilter === 'management' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Management
          </button>
          <button 
            onClick={() => setRoleFilter('group_leader')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${roleFilter === 'group_leader' ? 'bg-breeze-teal text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Leaders
          </button>
          <button 
            onClick={() => setRoleFilter('freelancer')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${roleFilter === 'freelancer' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Freelancers
          </button>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="breeze-card rounded-2xl border border-breeze-border overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-breeze-surface text-slate-400 text-xs border-b border-breeze-border uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Recipient</th>
                <th className="py-3.5 px-4 font-semibold">Role & Group</th>
                <th className="py-3.5 px-4 font-semibold">Project Title</th>
                <th className="py-3.5 px-4 font-semibold">Allocation Details</th>
                <th className="py-3.5 px-4 font-semibold text-right">Disbursed Amount</th>
                <th className="py-3.5 px-4 font-semibold text-right">Date Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-breeze-border text-xs text-slate-200">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No payout ledger entries match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {p.userName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-breeze-dark text-breeze-sky border border-breeze-border">
                          {p.userRole.replace('_', ' ')}
                        </span>
                        <span className="text-slate-400 text-[11px] truncate max-w-[140px]">{p.groupName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200 max-w-xs truncate">
                      {p.projectTitle}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {p.roleDescription}
                    </td>
                    <td className="py-3.5 px-4 font-display font-extrabold text-right text-emerald-400 text-sm">
                      ${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {new Date(p.paidAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
