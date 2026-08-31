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
  const { groups, quickInviteUser, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState<UserRole>('freelancer');
  const [groupId, setGroupId] = useState<GroupId>('tech');
  const [specialtiesStr, setSpecialtiesStr] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(30);
  const [status, setStatus] = useState<UserStatus>('active');
  const [hasSplitOverride, setHasSplitOverride] = useState(false);
  const [mgmtSplit, setMgmtSplit] = useState(15);
  const [ldrSplit, setLdrSplit] = useState(25);
  const [flSplit, setFlSplit] = useState(60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !title.trim()) {
      showToast('Please fill out all required fields (Name, Email, Job Title).', 'warning');
      return;
    }

    const specialties = specialtiesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const mappedTier = (role === 'management' ? 'manager' : (role === 'group_leader' ? 'group_leader' : (role === 'intern' ? 'intern' : 'member')));

    quickInviteUser({
      name,
      email,
      phone,
      title,
      role,
      roleTier: mappedTier,
      groupId,
      specialties: specialties.length > 0 ? specialties : ['Full-Stack Engineering'],
      hourlyRate,
      status,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1F7A8C&color=fff`,
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
          className="relative w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-page)] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#022B3A] via-[#1F7A8C] to-[#E1E5F2] flex items-center justify-center text-[var(--text-heading)] shadow-md">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">
                  Direct Talent Onboarding
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Add verified domain specialists directly to the DigiHust roster
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-body)] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Zaid Haroon"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs focus:outline-none focus:border-[var(--brand-teal)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-body)] uppercase tracking-wider mb-1.5">
                  Work Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. zaid.dev@digihust.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs focus:outline-none focus:border-[var(--brand-teal)]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-body)] uppercase tracking-wider mb-1.5">
                  Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs focus:outline-none focus:border-[var(--brand-teal)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-body)] uppercase tracking-wider mb-1.5">
                  Professional Title *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior AI Automation Engineer"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs focus:outline-none focus:border-[var(--brand-teal)]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-body)] uppercase tracking-wider mb-1.5">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs focus:outline-none focus:border-[var(--brand-teal)]"
                >
                  <option value="freelancer">Freelancer / Specialist</option>
                  <option value="intern">Intern Specialist</option>
                  <option value="group_leader">Group Leader</option>
                  <option value="management">Management Core</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-body)] uppercase tracking-wider mb-1.5">
                  Assigned Squad
                </label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value as GroupId)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs focus:outline-none focus:border-[var(--brand-teal)]"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-body)] uppercase tracking-wider mb-1.5">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs focus:outline-none focus:border-[var(--brand-teal)]"
                >
                  <option value="pending_onboarding">Pending Onboarding</option>
                  <option value="active">Active & Available</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-body)] uppercase tracking-wider mb-1.5">
                Skills & Specialties (comma separated)
              </label>
              <input
                type="text"
                value={specialtiesStr}
                onChange={(e) => setSpecialtiesStr(e.target.value)}
                placeholder="e.g. Next.js, Python, n8n, Tailwind, PostgreSQL"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs focus:outline-none focus:border-[var(--brand-teal)]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)] text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-lg shadow-md transition-all"
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
