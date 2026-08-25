import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, Group, Lead, Project, Payout, Applicant, GlobalAdminSettings, PipelineStage, Deliverable, Comment, ProjectAssignment, GroupId, UserRole, UserStatus, SplitOverride 
} from '../types';
import { 
  INITIAL_GROUPS, INITIAL_USERS, INITIAL_LEADS, INITIAL_PROJECTS, INITIAL_PAYOUTS, INITIAL_APPLICANTS, INITIAL_SETTINGS 
} from '../services/mockData';

interface AppContextType {
  currentUser: User;
  users: User[];
  groups: Group[];
  leads: Lead[];
  projects: Project[];
  payouts: Payout[];
  applicants: Applicant[];
  settings: GlobalAdminSettings;
  
  // Pipeline & Project Actions
  switchRole: (userId: string) => void;
  submitLead: (leadData: Omit<Lead, 'id' | 'createdAt' | 'status' | 'submittedByUserId' | 'submittedByUserName'>) => void;
  reviewLeadToProject: (
    leadId: string, 
    groupId: GroupId, 
    assignedLeaderId: string,
    totalValue: number, 
    externalFee: number,
    isLeadGenIndependent: boolean,
    leadGenUserPct: number,
    splitMgmtPct: number, 
    splitLeaderPct: number, 
    splitFreelancerPct: number
  ) => void;
  assignProjectTeam: (projectId: string, assignments: ProjectAssignment[]) => void;
  updateProjectStatus: (projectId: string, newStatus: PipelineStage) => void;
  addDeliverable: (projectId: string, title: string, linkUrl?: string, notes?: string) => void;
  addComment: (projectId: string, text: string) => void;
  releaseProjectPayout: (projectId: string) => void;

  // People & Community Management Actions
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  changeUserStatus: (userId: string, newStatus: UserStatus, reason: string, changedBy: string) => void;
  addUserNote: (userId: string, text: string, authorId: string, authorName: string) => void;
  deleteUserNote: (userId: string, noteId: string) => void;
  setUserSplitOverride: (userId: string, splitOverride?: SplitOverride) => void;
  reassignUserSquad: (userId: string, newGroupId?: GroupId) => void;
  changeUserRole: (userId: string, newRole: UserRole) => void;
  quickInviteUser: (userData: Omit<User, 'id' | 'completedProjectsCount' | 'totalEarnings' | 'rating' | 'statusHistory' | 'notes' | 'documents'>) => void;
  bulkUpdateStatus: (userIds: string[], status: UserStatus, reason: string, changedBy: string) => void;
  bulkReassignSquad: (userIds: string[], newGroupId: GroupId) => void;

  // Applicant Workflow Actions
  submitApplication: (applicantData: Omit<Applicant, 'id' | 'appliedAt' | 'status'>) => void;
  approveApplicant: (applicantId: string, role?: UserRole, targetGroupId?: GroupId) => void;
  rejectApplicant: (applicantId: string, reason?: string) => void;
  requestMoreInfoApplicant: (applicantId: string, followUpNotes?: string) => void;

  // Platform & Settings Actions
  updateGlobalSettings: (newSettings: GlobalAdminSettings) => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'digihust_app_state_v2';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from local storage if available
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_user`);
    if (savedUser) return JSON.parse(savedUser);
    return users.find(u => u.role === 'management') || users[0];
  });

  const [groups] = useState<Group[]>(INITIAL_GROUPS);

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_leads`);
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_projects`);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [payouts, setPayouts] = useState<Payout[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_payouts`);
    return saved ? JSON.parse(saved) : INITIAL_PAYOUTS;
  });

  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_applicants`);
    return saved ? JSON.parse(saved) : INITIAL_APPLICANTS;
  });

  const [settings, setSettings] = useState<GlobalAdminSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Sync state changes to Local Storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_leads`, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_projects`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_payouts`, JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_applicants`, JSON.stringify(applicants));
  }, [applicants]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);

  // Switch Current User / Active Persona
  const switchRole = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  // Submit Lead
  const submitLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'status' | 'submittedByUserId' | 'submittedByUserName'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now().toString().slice(-4)}`,
      status: 'new_lead',
      submittedByUserId: currentUser.id,
      submittedByUserName: `${currentUser.name} (${currentUser.role === 'management' ? 'Management' : currentUser.role === 'group_leader' ? 'Group Leader' : 'Lead Gen Freelancer'})`,
      createdAt: new Date().toISOString(),
    };
    setLeads(prev => [newLead, ...prev]);
  };

  // Convert Lead to Project with Financial Splits
  const reviewLeadToProject = (
    leadId: string, 
    groupId: GroupId, 
    assignedLeaderId: string,
    totalValue: number, 
    externalFee: number,
    isLeadGenIndependent: boolean,
    leadGenUserPct: number,
    splitMgmtPct: number, 
    splitLeaderPct: number, 
    splitFreelancerPct: number
  ) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const leader = users.find(u => u.id === assignedLeaderId) || users.find(u => u.role === 'group_leader' && u.groupId === groupId);
    const netRevenue = totalValue - externalFee;

    const newProject: Project = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      leadId: lead.id,
      title: lead.title,
      clientName: lead.clientName,
      clientEmail: lead.clientEmail,
      groupId: groupId,
      assignedLeaderId: leader ? leader.id : '',
      assignedLeaderName: leader ? leader.name : 'Unassigned',
      brief: lead.brief,
      totalValue: totalValue,
      externalFee: externalFee,
      netRevenue: netRevenue,
      isLeadGenIndependent: isLeadGenIndependent,
      leadGenUserPct: leadGenUserPct,
      splitManagementPct: splitMgmtPct,
      splitLeaderPct: splitLeaderPct,
      splitFreelancerPct: splitFreelancerPct,
      assignments: [],
      status: 'assigned',
      deliverables: [],
      comments: [
        {
          id: `cmt-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatarUrl,
          userRole: currentUser.role,
          text: `Project initiated by ${currentUser.name}. Financial allocation: Net Revenue $${netRevenue.toLocaleString()}.`,
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    };

    setProjects(prev => [newProject, ...prev]);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'assigned' } : l));
  };

  // Assign Team to Project
  const assignProjectTeam = (projectId: string, assignments: ProjectAssignment[]) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          assignments: assignments,
          status: p.status === 'assigned' ? 'in_progress' : p.status,
          comments: [
            ...p.comments,
            {
              id: `cmt-${Date.now()}`,
              userId: currentUser.id,
              userName: currentUser.name,
              userAvatar: currentUser.avatarUrl,
              userRole: currentUser.role,
              text: `Team assigned by ${currentUser.name}: ${assignments.map(a => `${a.freelancerName} (${a.sharePct}%)`).join(', ')}.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return p;
    }));
  };

  // Update Project Kanban Status
  const updateProjectStatus = (projectId: string, newStatus: PipelineStage) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : p.completedAt,
          comments: [
            ...p.comments,
            {
              id: `cmt-${Date.now()}`,
              userId: currentUser.id,
              userName: currentUser.name,
              userAvatar: currentUser.avatarUrl,
              userRole: currentUser.role,
              text: `Status updated to ${newStatus.toUpperCase().replace('_', ' ')} by ${currentUser.name}.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return p;
    }));
  };

  // Add Deliverable
  const addDeliverable = (projectId: string, title: string, linkUrl?: string, notes?: string) => {
    const newDeliverable: Deliverable = {
      id: `deliv-${Date.now()}`,
      title,
      linkUrl,
      notes,
      submittedByUserId: currentUser.id,
      submittedByUserName: currentUser.name,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          deliverables: [...p.deliverables, newDeliverable],
          comments: [
            ...p.comments,
            {
              id: `cmt-${Date.now()}`,
              userId: currentUser.id,
              userName: currentUser.name,
              userAvatar: currentUser.avatarUrl,
              userRole: currentUser.role,
              text: `New deliverable uploaded: "${title}" by ${currentUser.name}.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return p;
    }));
  };

  // Add Comment
  const addComment = (projectId: string, text: string) => {
    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      userRole: currentUser.role,
      text,
      timestamp: new Date().toISOString()
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
  };

  // Release Financial Payouts & Generate Ledger Entries
  const releaseProjectPayout = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || project.status === 'paid') return;

    const netRev = project.netRevenue;
    const group = groups.find(g => g.id === project.groupId);
    const groupName = group ? group.name : 'General';
    const now = new Date().toISOString();

    const createdPayouts: Payout[] = [];

    // 1. Management cut
    const mgmtAmount = Math.round(netRev * (project.splitManagementPct / 100));
    createdPayouts.push({
      id: `pay-${Date.now()}-mgmt`,
      projectId: project.id,
      projectTitle: project.title,
      userId: 'usr-mgmt-1',
      userName: 'Haris Asad',
      userRole: 'management',
      groupName: 'Executive',
      roleDescription: `Management Fee (${project.splitManagementPct}%)`,
      amount: mgmtAmount,
      sharePct: project.splitManagementPct,
      paidAt: now
    });

    // 2. Leader cut
    const leaderAmount = Math.round(netRev * (project.splitLeaderPct / 100));
    createdPayouts.push({
      id: `pay-${Date.now()}-ldr`,
      projectId: project.id,
      projectTitle: project.title,
      userId: project.assignedLeaderId,
      userName: project.assignedLeaderName,
      userRole: 'group_leader',
      groupName: groupName,
      roleDescription: `Group Leader Project Management (${project.splitLeaderPct}%)`,
      amount: leaderAmount,
      sharePct: project.splitLeaderPct,
      paidAt: now
    });

    // 3. Freelancer pool
    const totalFreelancerPool = netRev * (project.splitFreelancerPct / 100);
    project.assignments.forEach((assignment, idx) => {
      const flShare = Math.round(totalFreelancerPool * (assignment.sharePct / 100));
      createdPayouts.push({
        id: `pay-${Date.now()}-fl-${idx}`,
        projectId: project.id,
        projectTitle: project.title,
        userId: assignment.freelancerId,
        userName: assignment.freelancerName,
        userRole: 'freelancer',
        groupName: groupName,
        roleDescription: `${assignment.roleTitle} (${assignment.sharePct}% of pool)`,
        amount: flShare,
        sharePct: Math.round((assignment.sharePct / 100) * project.splitFreelancerPct),
        paidAt: now
      });
    });

    // Append to Payouts Ledger
    setPayouts(prev => [...createdPayouts, ...prev]);

    // Mark project as paid
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'paid', paidAt: now } : p));

    // Update user earnings and stats
    setUsers(prev => prev.map(u => {
      const userPayout = createdPayouts.filter(p => p.userId === u.id);
      if (userPayout.length > 0) {
        const addedEarnings = userPayout.reduce((sum, p) => sum + p.amount, 0);
        return {
          ...u,
          totalEarnings: u.totalEarnings + addedEarnings,
          completedProjectsCount: u.completedProjectsCount + 1
        };
      }
      return u;
    }));
  };

  // ── PEOPLE & COMMUNITY MANAGEMENT ACTIONS ───────────────────────────────

  // Update User Profile Fields
  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  // Change User Status with Reason and Audit Trail
  const changeUserStatus = (userId: string, newStatus: UserStatus, reason: string, changedBy: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const log = {
          timestamp: new Date().toISOString(),
          from: u.status,
          to: newStatus,
          reason,
          changedBy
        };
        return {
          ...u,
          status: newStatus,
          statusHistory: [log, ...(u.statusHistory || [])]
        };
      }
      return u;
    }));
  };

  // Add Internal Admin Note to User
  const addUserNote = (userId: string, text: string, authorId: string, authorName: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      authorId,
      authorName,
      text
    };

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          notes: [newNote, ...(u.notes || [])]
        };
      }
      return u;
    }));
  };

  // Delete Internal Note
  const deleteUserNote = (userId: string, noteId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          notes: (u.notes || []).filter(n => n.id !== noteId)
        };
      }
      return u;
    }));
  };

  // Set Custom Split Override for Individual User
  const setUserSplitOverride = (userId: string, splitOverride?: SplitOverride) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, splitOverride } : u));
  };

  // Reassign User Squad
  const reassignUserSquad = (userId: string, newGroupId?: GroupId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, groupId: newGroupId } : u));
  };

  // Change User Role (Promote / Demote)
  const changeUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  // Quick Invite New Talent Directly
  const quickInviteUser = (userData: Omit<User, 'id' | 'completedProjectsCount' | 'totalEarnings' | 'rating' | 'statusHistory' | 'notes' | 'documents'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-inv-${Date.now().toString().slice(-4)}`,
      completedProjectsCount: 0,
      totalEarnings: 0,
      rating: 5.0,
      joinedAt: new Date().toISOString().split('T')[0],
      status: userData.status || 'pending_onboarding',
      statusHistory: [
        {
          timestamp: new Date().toISOString(),
          from: 'pending_onboarding',
          to: userData.status || 'pending_onboarding',
          reason: 'Direct management invitation.',
          changedBy: currentUser.name
        }
      ],
      notes: [],
      documents: []
    };

    setUsers(prev => [newUser, ...prev]);
  };

  // Bulk Status Change
  const bulkUpdateStatus = (userIds: string[], status: UserStatus, reason: string, changedBy: string) => {
    setUsers(prev => prev.map(u => {
      if (userIds.includes(u.id)) {
        const log = {
          timestamp: new Date().toISOString(),
          from: u.status,
          to: status,
          reason,
          changedBy
        };
        return {
          ...u,
          status,
          statusHistory: [log, ...(u.statusHistory || [])]
        };
      }
      return u;
    }));
  };

  // Bulk Squad Reassignment
  const bulkReassignSquad = (userIds: string[], newGroupId: GroupId) => {
    setUsers(prev => prev.map(u => userIds.includes(u.id) ? { ...u, groupId: newGroupId } : u));
  };

  // ── APPLICANT WORKFLOW ACTIONS ──────────────────────────────────────────

  // Submit Digiskill Application
  const submitApplication = (applicantData: Omit<Applicant, 'id' | 'appliedAt' | 'status'>) => {
    const newApplicant: Applicant = {
      ...applicantData,
      id: `app-${Date.now().toString().slice(-4)}`,
      appliedAt: new Date().toISOString(),
      status: 'pending'
    };
    setApplicants(prev => [newApplicant, ...prev]);
  };

  // Approve Applicant into Roster with Pending Onboarding Status
  const approveApplicant = (applicantId: string, role: UserRole = 'freelancer', targetGroupId?: GroupId) => {
    const app = applicants.find(a => a.id === applicantId);
    if (!app) return;

    const newUser: User = {
      id: `usr-app-${Date.now().toString().slice(-4)}`,
      name: app.name,
      email: app.email,
      phone: app.phone,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250`,
      role: role,
      groupId: targetGroupId || app.preferredGroupId,
      title: `${app.digiskillCourse} Specialist`,
      specialties: app.specialties,
      bio: app.bio,
      hourlyRate: 25,
      completedProjectsCount: 0,
      totalEarnings: 0,
      rating: 5.0,
      digiskillBatch: app.digiskillId,
      status: 'pending_onboarding',
      joinedAt: new Date().toISOString().split('T')[0],
      onTimeDeliveryPct: 100,
      csatScore: 5.0,
      notes: [
        {
          id: `note-${Date.now()}`,
          timestamp: new Date().toISOString(),
          authorId: currentUser.id,
          authorName: currentUser.name,
          text: `Application approved by ${currentUser.name}. Digiskill Batch: ${app.digiskillId}.`
        }
      ],
      statusHistory: [
        {
          timestamp: new Date().toISOString(),
          from: 'pending_onboarding',
          to: 'pending_onboarding',
          reason: 'Application approved by management. Pending identity & contract onboarding.',
          changedBy: currentUser.name
        }
      ],
      documents: []
    };

    setUsers(prev => [newUser, ...prev]);
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: 'approved' } : a));
  };

  // Reject Applicant with Reason
  const rejectApplicant = (applicantId: string, reason: string = 'Profile does not meet current squad requirements.') => {
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: 'rejected', rejectionReason: reason } : a));
  };

  // Request More Info / Follow-up from Applicant
  const requestMoreInfoApplicant = (applicantId: string, followUpNotes: string = 'Portfolio links or updated CV requested.') => {
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: 'more_info_requested', followUpNotes } : a));
  };

  // Update Settings
  const updateGlobalSettings = (newSettings: GlobalAdminSettings) => {
    setSettings(newSettings);
  };

  // Reset Data to Defaults
  const resetToDefaultData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setLeads(INITIAL_LEADS);
    setProjects(INITIAL_PROJECTS);
    setPayouts(INITIAL_PAYOUTS);
    setApplicants(INITIAL_APPLICANTS);
    setSettings(INITIAL_SETTINGS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        groups,
        leads,
        projects,
        payouts,
        applicants,
        settings,
        switchRole,
        submitLead,
        reviewLeadToProject,
        assignProjectTeam,
        updateProjectStatus,
        addDeliverable,
        addComment,
        releaseProjectPayout,
        updateUserProfile,
        changeUserStatus,
        addUserNote,
        deleteUserNote,
        setUserSplitOverride,
        reassignUserSquad,
        changeUserRole,
        quickInviteUser,
        bulkUpdateStatus,
        bulkReassignSquad,
        submitApplication,
        approveApplicant,
        rejectApplicant,
        requestMoreInfoApplicant,
        updateGlobalSettings,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
