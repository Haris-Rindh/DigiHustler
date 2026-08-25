import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GroupId } from '../../types';
import { X, PlusCircle, Building2, User, Mail, DollarSign, FileText, Target } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const NewLeadModal: React.FC<Props> = ({ onClose }) => {
  const { groups, submitLead } = useApp();

  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [brief, setBrief] = useState('');
  const [budgetEstimate, setBudgetEstimate] = useState(2500);
  const [suggestedGroupId, setSuggestedGroupId] = useState<GroupId>('tech');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientName || !clientEmail || !brief) return;

    submitLead({
      title,
      clientName,
      clientCompany,
      clientEmail,
      brief,
      budgetEstimate,
      suggestedGroupId
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-xl text-[var(--text-heading)]">Capture New Client Lead</h2>
              <p className="text-xs text-[var(--text-muted)]">Step 1 in DigiHust workflow: Submit lead for Management Review</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Project Title / Goal *</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
              <input 
                type="text"
                required
                placeholder="e.g. E-Commerce Redesign & Mobile App"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Client Contact Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                <input 
                  type="text"
                  required
                  placeholder="John Smith"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Client Company (Optional)</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                <input 
                  type="text"
                  placeholder="Apex Global Ltd."
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Client Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                <input 
                  type="email"
                  required
                  placeholder="client@company.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Estimated Budget ($ USD) *</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                <input 
                  type="number"
                  required
                  min="100"
                  step="50"
                  value={budgetEstimate}
                  onChange={(e) => setBudgetEstimate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Target Department Group *</label>
            <div className="relative">
              <Target className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
              <select
                value={suggestedGroupId}
                onChange={(e) => setSuggestedGroupId(e.target.value as GroupId)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Client Brief & Scope Overview *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe deliverables, key requirements, tech stack or design preferences..."
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle)] text-xs font-semibold text-[var(--text-body)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all"
            >
              Submit Lead for Review
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
