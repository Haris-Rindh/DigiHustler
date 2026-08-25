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
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-emerald-300 uppercase tracking-widest">
            Financial Ledger Engine
          </span>
          <h1 className="font-display font-extrabold text-3xl text-[var(--text-heading)] mt-1">Itemized Payout & Revenue Ledger</h1>
          <p className="text-xs text-[var(--text-muted)] max-w-2xl mt-1">
            Historical audit log tracking exact percentage splits and financial distributions across Management, Group Leaders, Lead Generators, and Freelancer Pools.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-xs font-bold text-[var(--brand-teal)] transition-all shadow"
        >
          <Download className="w-4 h-4 text-[var(--brand-teal)]" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Cumulative Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl breeze-card">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Total Net Disbursed</span>
          <p className="font-display font-extrabold text-3xl text-[var(--text-heading)] mt-2">${totalDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="text-xs text-[var(--brand-teal)] mt-1 block">100% of Completed Revenue</span>
        </div>

        <div className="p-5 rounded-2xl breeze-card">
          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">Management Share</span>
          <p className="font-display font-extrabold text-3xl text-purple-400 mt-2">${mgmtDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="text-xs text-[var(--text-muted)] mt-1 block">Founding Management Cut</span>
        </div>

        <div className="p-5 rounded-2xl breeze-card">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--brand-teal)]">Group Leaders Share</span>
          <p className="font-display font-extrabold text-3xl text-[var(--brand-teal)] mt-2">${ldrDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="text-xs text-[var(--text-muted)] mt-1 block">Department Leaders Pool</span>
        </div>

        <div className="p-5 rounded-2xl breeze-card">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">Freelancer Pool Share</span>
          <p className="font-display font-extrabold text-3xl text-emerald-400 mt-2">${flDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="text-xs text-[var(--text-muted)] mt-1 block">Execution Team & Hunters</span>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 breeze-card p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
          <input 
            type="text"
            placeholder="Search by recipient, project title, or group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--brand-teal)]"
          />
        </div>

        <div className="flex items-center space-x-1 bg-[var(--bg-page)] p-1 rounded-xl border border-[var(--border-subtle)] text-xs w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-[var(--text-muted)] ml-2" />
          <button 
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${roleFilter === 'all' ? 'bg-[var(--brand-teal)] text-white font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
          >
            All Roles
          </button>
          <button 
            onClick={() => setRoleFilter('management')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${roleFilter === 'management' ? 'bg-purple-600 text-white font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
          >
            Management
          </button>
          <button 
            onClick={() => setRoleFilter('group_leader')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${roleFilter === 'group_leader' ? 'bg-[var(--brand-teal)] text-white font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
          >
            Leaders
          </button>
          <button 
            onClick={() => setRoleFilter('freelancer')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${roleFilter === 'freelancer' ? 'bg-emerald-600 text-white font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
          >
            Freelancers
          </button>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="breeze-card rounded-2xl border border-[var(--border-subtle)] overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-surface)] text-[var(--text-muted)] text-xs border-b border-[var(--border-subtle)] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Recipient</th>
                <th className="py-3.5 px-4 font-semibold">Role & Group</th>
                <th className="py-3.5 px-4 font-semibold">Project Title</th>
                <th className="py-3.5 px-4 font-semibold">Allocation Details</th>
                <th className="py-3.5 px-4 font-semibold text-right">Disbursed Amount</th>
                <th className="py-3.5 px-4 font-semibold text-right">Date Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-breeze-border text-xs text-[var(--text-body)]">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[var(--text-dim)]">
                    No payout ledger entries match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map(p => (
                  <tr key={p.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {p.userName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-[var(--bg-page)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
                          {p.userRole.replace('_', ' ')}
                        </span>
                        <span className="text-[var(--text-muted)] text-[11px] truncate max-w-[140px]">{p.groupName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[var(--text-body)] max-w-xs truncate">
                      {p.projectTitle}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)]">
                      {p.roleDescription}
                    </td>
                    <td className="py-3.5 px-4 font-display font-extrabold text-right text-emerald-400 text-sm">
                      ${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[var(--text-muted)]">
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
