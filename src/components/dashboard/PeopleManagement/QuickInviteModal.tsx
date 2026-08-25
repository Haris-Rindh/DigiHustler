import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Shield, Sparkles, Mail, User as UserIcon, Phone, Briefcase, DollarSign } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { GroupId, UserRole, UserStatus } from '../../../types';

interface QuickInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickInviteModal: React.FC<QuickInviteModalProps> = ({ isOpen, onClose }) => {
  const { groups, quickInviteUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState<UserRole>('freelancer');
  const [groupId, setGroupId] = useState<GroupId>('tech');
  const [specialtiesStr, setSpecialtiesStr] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(30);
  const [status, setStatus] = useState<UserStatus>('pending_onboarding');
  const [hasSplitOverride, setHasSplitOverride] = useState(false);
  const [mgmtSplit, setMgmtSplit] = useState(15);
  const [ldrSplit, setLdrSplit] = useState(25);
  const [flSplit, setFlSplit] = useState(60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !title.trim()) {
      alert('Please fill out all required fields (Name, Email, Job Title).');
      return;
    }

    const specialties = specialtiesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    quickInviteUser({
      name,
      email,
      phone,
      title,
      role,
      groupId,
      specialties: specialties.length > 0 ? specialties : ['Full-Stack Engineering'],
      hourlyRate,
      status,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250`,
      splitOverride: hasSplitOverride
        ? { managementPct: mgmtSplit, leaderPct: ldrSplit, freelancerPct: flSplit }
        : undefined,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0d2833] border border-[#1e4a5d] rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#1e4a5d] bg-[#071e26] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1a7a8c] to-[#0ea5e9] flex items-center justify-center text-white shadow-md">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-white">
                  Direct Talent Onboarding
                </h3>
                <p className="text-xs text-slate-400">
                  Add verified domain specialists directly to the DigiHust roster
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Zaid Haroon"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs focus:outline-none focus:border-[#1a7a8c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Work Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. zaid.dev@digihust.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs focus:outline-none focus:border-[#1a7a8c]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs focus:outline-none focus:border-[#1a7a8c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Professional Title *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior AI Automation Engineer"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs focus:outline-none focus:border-[#1a7a8c]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs focus:outline-none focus:border-[#1a7a8c]"
                >
                  <option value="freelancer">Freelancer / Specialist</option>
                  <option value="group_leader">Group Leader</option>
                  <option value="management">Management Core</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Assigned Squad
                </label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value as GroupId)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs focus:outline-none focus:border-[#1a7a8c]"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs focus:outline-none focus:border-[#1a7a8c]"
                >
                  <option value="pending_onboarding">Pending Onboarding</option>
                  <option value="active">Active & Available</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Skills & Specialties (comma separated)
              </label>
              <input
                type="text"
                value={specialtiesStr}
                onChange={(e) => setSpecialtiesStr(e.target.value)}
                placeholder="e.g. Next.js, Python, n8n, Tailwind, PostgreSQL"
                className="w-full px-4 py-2.5 rounded-xl bg-[#071e26] border border-[#1e4a5d] text-white text-xs focus:outline-none focus:border-[#1a7a8c]"
              />
            </div>

            {/* Optional Custom Split Override */}
            <div className="p-4 rounded-2xl bg-[#071e26]/80 border border-[#1e4a5d] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-[#1a7a8c]" />
                  <span className="text-xs font-bold text-white">Custom Per-Person Split Override</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSplitOverride}
                    onChange={(e) => setHasSplitOverride(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1a7a8c]"></div>
                </label>
              </div>

              {hasSplitOverride && (
                <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Mgmt %</label>
                    <input
                      type="number"
                      value={mgmtSplit}
                      onChange={(e) => setMgmtSplit(Number(e.target.value))}
                      className="w-full text-center py-1.5 rounded-lg bg-[#0d2833] border border-[#1e4a5d] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Leader %</label>
                    <input
                      type="number"
                      value={ldrSplit}
                      onChange={(e) => setLdrSplit(Number(e.target.value))}
                      className="w-full text-center py-1.5 rounded-lg bg-[#0d2833] border border-[#1e4a5d] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Talent %</label>
                    <input
                      type="number"
                      value={flSplit}
                      onChange={(e) => setFlSplit(Number(e.target.value))}
                      className="w-full text-center py-1.5 rounded-lg bg-[#0d2833] border border-[#1e4a5d] text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1e4a5d]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#1e4a5d] text-slate-300 hover:text-white hover:bg-white/5 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white text-xs font-bold shadow-lg shadow-[#1a7a8c]/25 transition-all"
              >
                Add to Roster
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
