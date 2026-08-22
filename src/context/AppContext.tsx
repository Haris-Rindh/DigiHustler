import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, Group, Lead, Project, Payout, Applicant, GlobalAdminSettings, PipelineStage, Deliverable, Comment, ProjectAssignment, GroupId 
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
  
  // Actions
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
  submitApplication: (applicantData: Omit<Applicant, 'id' | 'appliedAt' | 'status'>) => void;
  approveApplicant: (applicantId: string, role: 'freelancer' | 'group_leader') => void;
  updateGlobalSettings: (newSettings: GlobalAdminSettings) => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'digihust_app_state_v1';

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

  // Switch Active User Role
  const switchRole = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  // Submit Lead
  const submitLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'status' | 'submittedByUserId' | 'submittedByUserName'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now().toString().slice(-4)}`,
      submittedByUserId: currentUser.id,
      submittedByUserName: `${currentUser.name} (${currentUser.title})`,
      status: 'new_lead',
      createdAt: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
  };

  // Review Lead -> Convert to Project
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

    const netRevenue = Math.max(0, totalValue - externalFee);
    const leaderUser = users.find(u => u.id === assignedLeaderId);

    const newProject: Project = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      leadId: lead.id,
      title: lead.title,
      clientName: lead.clientName,
      clientEmail: lead.clientEmail,
      groupId: groupId,
      assignedLeaderId: assignedLeaderId,
      assignedLeaderName: leaderUser ? leaderUser.name : 'Group Leader',
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
      comments: [],
      createdAt: new Date().toISOString()
    };

    // Update lead status
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'assigned' } : l));
    // Add project
    setProjects(prev => [newProject, ...prev]);
  };

  // Assign Freelancer Team
  const assignProjectTeam = (projectId: string, assignments: ProjectAssignment[]) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          assignments: assignments,
          status: p.status === 'assigned' ? 'in_progress' : p.status
        };
      }
      return p;
    }));
  };

  // Update Pipeline Status
  const updateProjectStatus = (projectId: string, newStatus: PipelineStage) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updated: Project = { ...p, status: newStatus };
        if (newStatus === 'completed' && !p.completedAt) {
          updated.completedAt = new Date().toISOString();
        }
        return updated;
      }
      return p;
    }));
  };

  // Add Deliverable
  const addDeliverable = (projectId: string, title: string, linkUrl?: string, notes?: string) => {
    const newDeliverable: Deliverable = {
      id: `del-${Date.now().toString().slice(-4)}`,
      title: title,
      linkUrl: linkUrl,
      submittedByUserId: currentUser.id,
      submittedByUserName: currentUser.name,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      notes: notes
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          deliverables: [newDeliverable, ...p.deliverables]
        };
      }
      return p;
    }));
  };

  // Add In-Project Comment
  const addComment = (projectId: string, text: string) => {
    const newComment: Comment = {
      id: `comm-${Date.now().toString().slice(-4)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      userRole: currentUser.role,
      text: text,
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

  // Release Payouts & Calculate Cuts
  const releaseProjectPayout = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    const net = proj.netRevenue;
    const nowIso = new Date().toISOString();
    const newPayouts: Payout[] = [];

    let remainingNet = net;

    // 1. Lead Generator Cut (if independent)
    const leadObj = leads.find(l => l.id === proj.leadId);
    let lgUser = users.find(u => u.id === leadObj?.submittedByUserId);
    if (!lgUser) {
      lgUser = users.find(u => u.groupId === 'growth' && u.role === 'freelancer') || users[0];
    }

    if (proj.isLeadGenIndependent && proj.leadGenUserPct > 0) {
      const lgAmount = net * (proj.leadGenUserPct / 100);
      newPayouts.push({
        id: `pay-${Date.now()}-lg`,
        projectId: proj.id,
        projectTitle: proj.title,
        userId: lgUser.id,
        userName: lgUser.name,
        userRole: lgUser.role,
        groupName: 'Growth & Client Acquisition',
        roleDescription: `Lead Generator Bonus (${proj.leadGenUserPct}%)`,
        amount: lgAmount,
        sharePct: proj.leadGenUserPct,
        paidAt: nowIso
      });
    }

    // 2. Management Cut
    const mgmtUser = users.find(u => u.role === 'management') || users[0];
    const mgmtAmount = net * (proj.splitManagementPct / 100);
    newPayouts.push({
      id: `pay-${Date.now()}-mgmt`,
      projectId: proj.id,
      projectTitle: proj.title,
      userId: mgmtUser.id,
      userName: mgmtUser.name,
      userRole: 'management',
      groupName: 'Founding Management',
      roleDescription: `Management Core Share (${proj.splitManagementPct}%)`,
      amount: mgmtAmount,
      sharePct: proj.splitManagementPct,
      paidAt: nowIso
    });

    // 3. Group Leader Cut
    const leaderUser = users.find(u => u.id === proj.assignedLeaderId) || users.find(u => u.groupId === proj.groupId && u.role === 'group_leader') || users[0];
    const leaderAmount = net * (proj.splitLeaderPct / 100);
    newPayouts.push({
      id: `pay-${Date.now()}-ldr`,
      projectId: proj.id,
      projectTitle: proj.title,
      userId: leaderUser.id,
      userName: leaderUser.name,
      userRole: 'group_leader',
      groupName: groups.find(g => g.id === proj.groupId)?.name || 'Department Group',
      roleDescription: `Group Leader Cut (${proj.splitLeaderPct}%)`,
      amount: leaderAmount,
      sharePct: proj.splitLeaderPct,
      paidAt: nowIso
    });

    // 4. Freelancer Pool Cut
    const totalFlPoolAmount = net * (proj.splitFreelancerPct / 100);

    if (proj.assignments.length > 0) {
      proj.assignments.forEach((assignment, index) => {
        const flUser = users.find(u => u.id === assignment.freelancerId) || { name: assignment.freelancerName, id: assignment.freelancerId };
        const flAmount = totalFlPoolAmount * (assignment.sharePct / 100);
        newPayouts.push({
          id: `pay-${Date.now()}-fl-${index}`,
          projectId: proj.id,
          projectTitle: proj.title,
          userId: assignment.freelancerId,
          userName: assignment.freelancerName,
          userRole: 'freelancer',
          groupName: groups.find(g => g.id === proj.groupId)?.name || 'Department Group',
          roleDescription: `${assignment.roleTitle} (${assignment.sharePct}% of Pool)`,
          amount: flAmount,
          sharePct: (proj.splitFreelancerPct * (assignment.sharePct / 100)),
          paidAt: nowIso
        });
      });
    } else {
      // Default to Leader as sole executor if team was not assigned
      newPayouts.push({
        id: `pay-${Date.now()}-fl-default`,
        projectId: proj.id,
        projectTitle: proj.title,
        userId: leaderUser.id,
        userName: leaderUser.name,
        userRole: 'freelancer',
        groupName: groups.find(g => g.id === proj.groupId)?.name || 'Department Group',
        roleDescription: `Execution Pool (${proj.splitFreelancerPct}%)`,
        amount: totalFlPoolAmount,
        sharePct: proj.splitFreelancerPct,
        paidAt: nowIso
      });
    }

    // Add payouts and update project status to 'paid'
    setPayouts(prev => [...newPayouts, ...prev]);
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'paid', paidAt: nowIso } : p));

    // Update user earnings
    setUsers(prev => prev.map(u => {
      const userPayouts = newPayouts.filter(pay => pay.userId === u.id);
      if (userPayouts.length > 0) {
        const addedEarnings = userPayouts.reduce((sum, item) => sum + item.amount, 0);
        return {
          ...u,
          totalEarnings: u.totalEarnings + addedEarnings,
          completedProjectsCount: u.completedProjectsCount + 1
        };
      }
      return u;
    }));
  };

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

  // Approve Applicant into Roster
  const approveApplicant = (applicantId: string, role: 'freelancer' | 'group_leader') => {
    const app = applicants.find(a => a.id === applicantId);
    if (!app) return;

    const newUser: User = {
      id: `usr-app-${Date.now().toString().slice(-4)}`,
      name: app.name,
      email: app.email,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250`,
      role: role,
      groupId: app.preferredGroupId,
      title: `${app.digiskillCourse} Specialist`,
      specialties: app.specialties,
      bio: app.bio,
      hourlyRate: 25,
      completedProjectsCount: 0,
      totalEarnings: 0,
      rating: 5.0,
      digiskillBatch: app.digiskillId,
      status: 'available'
    };

    setUsers(prev => [...prev, newUser]);
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: 'approved' } : a));
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
        submitApplication,
        approveApplicant,
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
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
