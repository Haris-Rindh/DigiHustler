import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCheck,
  Layers,
  DollarSign,
  TrendingUp,
  Shield,
  UserPlus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { User } from '../../../types';
import { PeopleDirectory } from './PeopleDirectory';
import { UserProfileDrawer } from './UserProfileDrawer';
import { ApplicantWorkflowQueue } from './ApplicantWorkflowQueue';
import { SquadMatrixView } from './SquadMatrixView';
import { SplitConfigurationView } from './SplitConfigurationView';
import { PeopleAnalyticsView } from './PeopleAnalyticsView';
import { QuickInviteModal } from './QuickInviteModal';

export const PeopleManagementPanel: React.FC = () => {
  const { currentUser, users, applicants, switchRole, resetToDefaultData } = useApp();

  const isManagement = currentUser.role === 'management';
  const isLeader = currentUser.role === 'group_leader';

  const [activeTab, setActiveTab] = useState<'directory' | 'applicants' | 'squads' | 'splits' | 'analytics'>('directory');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const pendingApplicantsCount = applicants.filter((a) => a.status === 'pending').length;

  const tabs = [
    { id: 'directory', label: 'People Directory', icon: <Users className="w-4 h-4" /> },
    {
      id: 'applicants',
      label: 'Applicant Queue',
      icon: <UserCheck className="w-4 h-4" />,
      badge: pendingApplicantsCount > 0 ? pendingApplicantsCount : undefined,
    },
    { id: 'squads', label: 'Squad Matrix', icon: <Layers className="w-4 h-4" /> },
    ...(isManagement
      ? [
          { id: 'splits', label: 'Split Overrides', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
        ]
      : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">

      {/* Top Banner & Active Persona Switcher */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d2833] border border-[#1e4a5d] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#1a7a8c]/20 text-[#bde0fe] border border-[#1a7a8c]/40 uppercase tracking-widest flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#1a7a8c]" />
              <span>Unified People & Community Admin</span>
            </span>
            <span className="text-xs text-slate-400">
              Role: <strong className="text-white uppercase font-bold">{currentUser.role.replace('_', ' ')}</strong>
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            Community Ecosystem & Talent Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
            Manage domain specialists, applicant review workflows, squad leadership hierarchies, and customized financial split overrides from one unified console.
          </p>
        </div>

        {/* Persona Switcher & Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="p-2 rounded-2xl bg-[#071e26] border border-[#1e4a5d] flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 pl-2">Persona:</span>
            <select
              value={currentUser.id}
              onChange={(e) => switchRole(e.target.value)}
              className="bg-[#0d2833] text-white text-xs font-bold py-1.5 px-3 rounded-xl border border-[#1e4a5d] focus:outline-none focus:border-[#1a7a8c]"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          {isManagement && (
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-[#1a7a8c] hover:bg-[#156575] text-white text-xs font-bold shadow-lg shadow-[#1a7a8c]/25 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Talent</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs with Spring Active Pill */}
      <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-[#0d2833] border border-[#1e4a5d] overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors whitespace-nowrap ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeAdminTab"
                  className="absolute inset-0 bg-[#1a7a8c] rounded-xl shadow-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10">{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="relative z-10 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'directory' && (
          <PeopleDirectory
            onSelectUser={(u) => setSelectedUser(u)}
            onOpenQuickInvite={() => setIsInviteOpen(true)}
          />
        )}

        {activeTab === 'applicants' && <ApplicantWorkflowQueue />}

        {activeTab === 'squads' && (
          <SquadMatrixView onSelectUser={(u) => setSelectedUser(u)} />
        )}

        {activeTab === 'splits' && isManagement && (
          <SplitConfigurationView onSelectUser={(u) => setSelectedUser(u)} />
        )}

        {activeTab === 'analytics' && isManagement && (
          <PeopleAnalyticsView onSelectUser={(u) => setSelectedUser(u)} />
        )}
      </div>

      {/* Individual User Profile Drawer */}
      <UserProfileDrawer
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      {/* Quick Invite Modal */}
      <QuickInviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />

    </div>
  );
};
