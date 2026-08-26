import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, Group, Lead, Project, Payout, Applicant, GlobalAdminSettings, PipelineStage, 
  Deliverable, Comment, ProjectAssignment, GroupId, UserRole, UserRoleTier, UserStatus, 
  SplitOverride, Assignment, SubTask, Milestone, Certificate, CertificateType, CertificateStatus, 
  Announcement, AnnouncementScope, SiteContent, SecurityAuditLog 
} from '../types';
import { 
  INITIAL_GROUPS, INITIAL_USERS, INITIAL_LEADS, INITIAL_PROJECTS, INITIAL_PAYOUTS, 
  INITIAL_APPLICANTS, INITIAL_SETTINGS, INITIAL_ASSIGNMENTS, INITIAL_CERTIFICATES, 
  INITIAL_ANNOUNCEMENTS, DEFAULT_SITE_CONTENT, INITIAL_AUDIT_LOGS 
} from '../services/mockData';
import { getNextMemberId } from '../lib/memberIdGenerator';
import { getUserRoleTier, PERMISSIONS } from '../lib/permissions';

interface AppContextType {
  // Auth & Session
  isAuthenticated: boolean;
  currentUser: User;
  currentTier: UserRoleTier;
  users: User[];
  groups: Group[];
  leads: Lead[];
  projects: Project[];
  assignments: Assignment[];
  certificates: Certificate[];
  announcements: Announcement[];
  payouts: Payout[];
  applicants: Applicant[];
  settings: GlobalAdminSettings;
  siteContent: SiteContent;
  auditLogs: SecurityAuditLog[];
  
  // Auth Actions
  loginWithMemberId: (memberId: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  changePassword: (newPassword: string) => void;
  requestPasswordReset: (email: string) => { success: boolean; message: string };
  switchRole: (userId: string) => void;
  switchTier: (tier: UserRoleTier) => void;

  // Pipeline & Project Actions
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

  // Assignment Workspace Actions
  createAssignment: (assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'subTasks' | 'milestones' | 'deliverables' | 'comments'>) => void;
  updateAssignmentStatus: (assignmentId: string, newStatus: PipelineStage) => void;
  addSubTask: (assignmentId: string, title: string, assignedMemberId: string, dueDate?: string) => void;
  toggleSubTask: (assignmentId: string, subTaskId: string) => void;
  addMilestone: (assignmentId: string, title: string, targetDate: string) => void;
  toggleMilestone: (assignmentId: string, milestoneId: string) => void;
  addAssignmentDeliverable: (assignmentId: string, title: string, linkUrl?: string, notes?: string) => void;
  addAssignmentComment: (assignmentId: string, text: string) => void;

  // Certificate Actions
  issueCertificate: (certData: Omit<Certificate, 'id' | 'issuedDate' | 'status' | 'qrCodeUrl'>) => Certificate;
  revokeCertificate: (certId: string, reason?: string) => void;
  restoreCertificate: (certId: string) => void;

  // Announcement Actions
  postAnnouncement: (announcementData: Omit<Announcement, 'id' | 'postedBy' | 'postedByName' | 'postedByRole' | 'postedAt'>) => void;
  deleteAnnouncement: (announcementId: string) => void;

  // People & Community Management Actions
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  changeUserStatus: (userId: string, newStatus: UserStatus, reason: string, changedBy: string) => void;
  addUserNote: (userId: string, text: string, authorId: string, authorName: string) => void;
  deleteUserNote: (userId: string, noteId: string) => void;
  setUserSplitOverride: (userId: string, splitOverride?: SplitOverride) => void;
  reassignUserSquad: (userId: string, newGroupId?: GroupId) => void;
  changeUserRole: (userId: string, newRole: UserRole) => void;
  updateUserRoleWithAuth: (targetUserId: string, newRoleTier: UserRoleTier, reason: string) => { success: boolean; error?: string };
  updateUserSquadWithAuth: (targetUserId: string, newGroupId?: GroupId) => { success: boolean; error?: string };
  quickInviteUser: (userData: Omit<User, 'id' | 'completedProjectsCount' | 'totalEarnings' | 'rating' | 'statusHistory' | 'notes' | 'documents'>) => User;
  bulkImportMembers: (importedRows: Partial<User>[]) => { count: number; newUsers: User[] };
  sendBatchCredentials: () => { count: number; memberNames: string[] };

  // Live Website CMS Actions
  updateSiteContent: (section: keyof SiteContent, data: any) => void;
  resetSiteContent: () => void;

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

const LOCAL_STORAGE_KEY = 'digihust_app_state_v4';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from local storage if available
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_user`);
    if (savedUser) return JSON.parse(savedUser);
    return users.find(u => u.roleTier === 'ceo' || u.role === 'management') || users[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem(`${LOCAL_STORAGE_KEY}_is_authenticated`);
    return savedAuth ? JSON.parse(savedAuth) : true;
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

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_assignments`);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_certificates`);
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_announcements`);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
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

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_site_content`);
    return saved ? JSON.parse(saved) : DEFAULT_SITE_CONTENT;
  });

  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_audit_logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_is_authenticated`, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_leads`, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_projects`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_assignments`, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_certificates`, JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_announcements`, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_payouts`, JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_applicants`, JSON.stringify(applicants));
  }, [applicants]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_site_content`, JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_audit_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Auth Handlers
  const currentTier = getUserRoleTier(currentUser);

  const loginWithMemberId = (memberId: string, _password?: string): { success: boolean; error?: string } => {
    const foundUser = users.find(u => u.memberId?.toUpperCase() === memberId.trim().toUpperCase() || u.email.toLowerCase() === memberId.trim().toLowerCase());
    if (foundUser) {
      setCurrentUser(foundUser);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid Member ID. Example format: DGH2600101' };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const changePassword = (_newPassword: string) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, forcePasswordChange: false } : u));
    setCurrentUser(prev => ({ ...prev, forcePasswordChange: false }));
  };

  const requestPasswordReset = (email: string) => {
    const found = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      return { success: true, message: `Password reset link has been dispatched to ${email}.` };
    }
    return { success: false, message: 'No registered account found with that email address.' };
  };

  const switchRole = (userId: string) => {
    const foundUser = users.find(u => u.id === userId);
    if (foundUser) {
      setCurrentUser(foundUser);
      setIsAuthenticated(true);
    }
  };

  const switchTier = (tier: UserRoleTier) => {
    const foundUser = users.find(u => u.roleTier === tier);
    if (foundUser) {
      setCurrentUser(foundUser);
      setIsAuthenticated(true);
    }
  };

  // Lead Submission
  const submitLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'status' | 'submittedByUserId' | 'submittedByUserName'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      status: settings.autoApproveLeads ? 'under_review' : 'new_lead',
      submittedByUserId: currentUser.id,
      submittedByUserName: currentUser.name,
      createdAt: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
  };

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

    const leader = users.find(u => u.id === assignedLeaderId);
    const netRevenue = totalValue - externalFee;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      leadId: lead.id,
      title: lead.title,
      clientName: lead.clientName,
      clientEmail: lead.clientEmail,
      clientCompany: lead.clientCompany,
      groupId,
      assignedLeaderId,
      assignedLeaderName: leader ? leader.name : 'Assigned Leader',
      brief: lead.brief,
      totalValue,
      externalFee,
      netRevenue,
      isLeadGenIndependent,
      leadGenUserPct,
      splitManagementPct: splitMgmtPct,
      splitLeaderPct: splitLeaderPct,
      splitFreelancerPct: splitFreelancerPct,
      assignments: [],
      status: 'assigned',
      deliverables: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    setProjects(prev => [newProject, ...prev]);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'assigned' } : l));
  };

  const assignProjectTeam = (projectId: string, projectAssignments: ProjectAssignment[]) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          assignments: projectAssignments,
          status: 'in_progress'
        };
      }
      return p;
    }));
  };

  const updateProjectStatus = (projectId: string, newStatus: PipelineStage) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : p.completedAt,
          paidAt: newStatus === 'paid' ? new Date().toISOString() : p.paidAt
        };
      }
      return p;
    }));
  };

  const addDeliverable = (projectId: string, title: string, linkUrl?: string, notes?: string) => {
    const newDeliverable: Deliverable = {
      id: `del-${Date.now()}`,
      title,
      linkUrl,
      submittedByUserId: currentUser.id,
      submittedByUserName: currentUser.name,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      notes
    };

    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, deliverables: [newDeliverable, ...p.deliverables] } : p));
  };

  const addComment = (projectId: string, text: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      userRole: currentUser.roleTier || currentUser.role,
      text,
      timestamp: new Date().toISOString()
    };

    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, comments: [...p.comments, newComment] } : p));
  };

  const releaseProjectPayout = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || project.status === 'paid') return;

    const group = groups.find(g => g.id === project.groupId);
    const groupName = group ? group.name : 'Squad';

    const netRev = project.netRevenue;
    const mgmtAmount = (netRev * project.splitManagementPct) / 100;
    const leaderAmount = (netRev * project.splitLeaderPct) / 100;
    const freelancerPool = (netRev * project.splitFreelancerPct) / 100;

    const newPayouts: Payout[] = [];

    // Management share
    newPayouts.push({
      id: `pay-${Date.now()}-mgmt`,
      projectId: project.id,
      projectTitle: project.title,
      userId: currentUser.id,
      userName: 'DigiHust Operations',
      userRole: 'management',
      groupName: 'Platform Reserve',
      roleDescription: 'Platform Management & SLA Margin',
      amount: Math.round(mgmtAmount),
      sharePct: project.splitManagementPct,
      paidAt: new Date().toISOString()
    });

    // Leader share
    newPayouts.push({
      id: `pay-${Date.now()}-ldr`,
      projectId: project.id,
      projectTitle: project.title,
      userId: project.assignedLeaderId,
      userName: project.assignedLeaderName,
      userRole: 'group_leader',
      groupName,
      roleDescription: 'Squad Lead Oversight & QA',
      amount: Math.round(leaderAmount),
      sharePct: project.splitLeaderPct,
      paidAt: new Date().toISOString()
    });

    // Freelancer/Member shares
    project.assignments.forEach((asgn, i) => {
      const memberAmount = (freelancerPool * asgn.sharePct) / 100;
      newPayouts.push({
        id: `pay-${Date.now()}-mbr-${i}`,
        projectId: project.id,
        projectTitle: project.title,
        userId: asgn.freelancerId,
        userName: asgn.freelancerName,
        userRole: 'freelancer',
        groupName,
        roleDescription: asgn.roleTitle,
        amount: Math.round(memberAmount),
        sharePct: asgn.sharePct,
        paidAt: new Date().toISOString()
      });
    });

    setPayouts(prev => [...newPayouts, ...prev]);
    updateProjectStatus(projectId, 'paid');
  };

  // ── ASSIGNMENT WORKSPACE ACTIONS ───────────────────────────────────────────

  const createAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'subTasks' | 'milestones' | 'deliverables' | 'comments'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `asgn-${Date.now()}`,
      subTasks: [],
      milestones: [],
      deliverables: [],
      comments: [],
      createdAt: new Date().toISOString()
    };
    setAssignments(prev => [newAssignment, ...prev]);
  };

  const updateAssignmentStatus = (assignmentId: string, newStatus: PipelineStage) => {
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: newStatus } : a));
  };

  const addSubTask = (assignmentId: string, title: string, assignedMemberId: string, dueDate?: string) => {
    const member = users.find(u => u.id === assignedMemberId);
    const newSubTask: SubTask = {
      id: `st-${Date.now()}`,
      title,
      assignedMemberId,
      assignedMemberName: member ? member.name : 'Assigned Member',
      status: 'todo',
      dueDate
    };
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, subTasks: [...a.subTasks, newSubTask] } : a));
  };

  const toggleSubTask = (assignmentId: string, subTaskId: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === assignmentId) {
        return {
          ...a,
          subTasks: a.subTasks.map(st => {
            if (st.id === subTaskId) {
              const nextStatus = st.status === 'completed' ? 'in_progress' : 'completed';
              return { ...st, status: nextStatus };
            }
            return st;
          })
        };
      }
      return a;
    }));
  };

  const addMilestone = (assignmentId: string, title: string, targetDate: string) => {
    const newMilestone: Milestone = {
      id: `m-${Date.now()}`,
      title,
      targetDate,
      isCompleted: false
    };
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, milestones: [...a.milestones, newMilestone] } : a));
  };

  const toggleMilestone = (assignmentId: string, milestoneId: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === assignmentId) {
        return {
          ...a,
          milestones: a.milestones.map(m => m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m)
        };
      }
      return a;
    }));
  };

  const addAssignmentDeliverable = (assignmentId: string, title: string, linkUrl?: string, notes?: string) => {
    const newDeliverable: Deliverable = {
      id: `del-${Date.now()}`,
      title,
      linkUrl,
      submittedByUserId: currentUser.id,
      submittedByUserName: currentUser.name,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      notes
    };
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, deliverables: [newDeliverable, ...a.deliverables] } : a));
  };

  const addAssignmentComment = (assignmentId: string, text: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      userRole: currentUser.roleTier || currentUser.role,
      text,
      timestamp: new Date().toISOString()
    };
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, comments: [...a.comments, newComment] } : a));
  };

  // ── CERTIFICATE ACTIONS ───────────────────────────────────────────────────

  const issueCertificate = (certData: Omit<Certificate, 'id' | 'issuedDate' | 'status' | 'qrCodeUrl'>): Certificate => {
    const uuidToken = `cert-${certData.type === 'offer_letter' ? 'off' : 'exp'}-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
    const newCert: Certificate = {
      ...certData,
      id: uuidToken,
      issuedDate: new Date().toISOString().split('T')[0],
      status: 'valid',
      qrCodeUrl: `/verify/${uuidToken}`
    };
    setCertificates(prev => [newCert, ...prev]);

    // Record in Security Audit Logs
    const auditEntry: SecurityAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentTier,
      action: 'CERTIFICATE_ISSUED',
      targetId: certData.memberId,
      targetName: certData.memberName,
      details: `Issued ${certData.type.replace('_', ' ')} to ${certData.memberName} (${certData.memberDghId}) for ${certData.clientName}.`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    return newCert;
  };

  const revokeCertificate = (certId: string, reason?: string) => {
    setCertificates(prev => prev.map(c => c.id === certId ? { ...c, status: 'revoked', revocationReason: reason || 'Revoked by Executive Management' } : c));
    const cert = certificates.find(c => c.id === certId);
    if (cert) {
      const auditEntry: SecurityAuditLog = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentTier,
        action: 'CERTIFICATE_REVOKED',
        targetId: cert.memberId,
        targetName: cert.memberName,
        details: `Revoked certificate ${certId}. Reason: ${reason || 'Executive discretion'}`
      };
      setAuditLogs(prev => [auditEntry, ...prev]);
    }
  };

  const restoreCertificate = (certId: string) => {
    setCertificates(prev => prev.map(c => c.id === certId ? { ...c, status: 'valid', revocationReason: undefined } : c));
  };

  // ── ANNOUNCEMENT ACTIONS ──────────────────────────────────────────────────

  const postAnnouncement = (announcementData: Omit<Announcement, 'id' | 'postedBy' | 'postedByName' | 'postedByRole' | 'postedAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: `ann-${Date.now()}`,
      postedBy: currentUser.id,
      postedByName: currentUser.name,
      postedByRole: currentUser.roleTier || (currentUser.role === 'management' ? 'ceo' : 'group_leader'),
      postedAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const deleteAnnouncement = (announcementId: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
  };

  // ── PEOPLE & COMMUNITY MANAGEMENT ACTIONS (STRICT EXECUTIVE GOVERNANCE) ────

  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  const changeUserStatus = (userId: string, newStatus: UserStatus, reason: string, changedBy: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const log: StatusChangeLog = {
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

  const addUserNote = (userId: string, text: string, authorId: string, authorName: string) => {
    const newNote = { id: `note-${Date.now()}`, timestamp: new Date().toISOString(), authorId, authorName, text };
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, notes: [newNote, ...(u.notes || [])] } : u));
  };

  const deleteUserNote = (userId: string, noteId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, notes: (u.notes || []).filter(n => n.id !== noteId) } : u));
  };

  const setUserSplitOverride = (userId: string, splitOverride?: SplitOverride) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, splitOverride } : u));
  };

  const reassignUserSquad = (userId: string, newGroupId?: GroupId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, groupId: newGroupId } : u));
  };

  const changeUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newTier: UserRoleTier = newRole === 'management' ? 'manager' : newRole === 'group_leader' ? 'group_leader' : 'member';
        return { ...u, role: newRole, roleTier: newTier };
      }
      return u;
    }));
  };

  // Strict Executive Authority: Only CEO can modify Role Tiers with logged audit records
  const updateUserRoleWithAuth = (targetUserId: string, newRoleTier: UserRoleTier, reason: string): { success: boolean; error?: string } => {
    if (!PERMISSIONS.canDistributeRoles(currentTier)) {
      return { success: false, error: 'Access Denied: Only Executive CEO authority can distribute roles.' };
    }

    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return { success: false, error: 'User not found.' };

    const mappedRole: UserRole = (newRoleTier === 'ceo' || newRoleTier === 'manager') ? 'management' : (newRoleTier === 'group_leader' ? 'group_leader' : 'freelancer');

    setUsers(prev => prev.map(u => {
      if (u.id === targetUserId) {
        return { ...u, roleTier: newRoleTier, role: mappedRole };
      }
      return u;
    }));

    // Record Security Audit Log
    const auditEntry: SecurityAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentTier,
      action: 'ROLE_MODIFIED',
      targetId: targetUser.id,
      targetName: targetUser.name,
      details: `Changed role tier from ${targetUser.roleTier || targetUser.role} to ${newRoleTier}. Reason: ${reason}`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    return { success: true };
  };

  const updateUserSquadWithAuth = (targetUserId: string, newGroupId?: GroupId): { success: boolean; error?: string } => {
    if (!PERMISSIONS.canReassignSquad(currentTier)) {
      return { success: false, error: 'Access Denied: Only Executive CEO authority can reassign squads.' };
    }

    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return { success: false, error: 'User not found.' };

    setUsers(prev => prev.map(u => u.id === targetUserId ? { ...u, groupId: newGroupId } : u));

    const auditEntry: SecurityAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentTier,
      action: 'SQUAD_REASSIGNED',
      targetId: targetUser.id,
      targetName: targetUser.name,
      details: `Reassigned squad to ${newGroupId || 'None'}.`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    return { success: true };
  };

  const quickInviteUser = (userData: Omit<User, 'id' | 'completedProjectsCount' | 'totalEarnings' | 'rating' | 'statusHistory' | 'notes' | 'documents'>): User => {
    const { memberId } = getNextMemberId(userData.joinYear);
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      memberId,
      completedProjectsCount: 0,
      totalEarnings: 0,
      rating: 5.0,
      credentialsSentAt: null,
      forcePasswordChange: true,
      statusHistory: [
        {
          timestamp: new Date().toISOString(),
          from: 'pending_onboarding',
          to: userData.status,
          reason: 'Direct Invitation Added',
          changedBy: currentUser.name
        }
      ],
      notes: [],
      documents: []
    };
    setUsers(prev => [newUser, ...prev]);
    return newUser;
  };

  const bulkImportMembers = (importedRows: Partial<User>[]): { count: number; newUsers: User[] } => {
    const createdUsers: User[] = [];

    importedRows.forEach((row) => {
      const { memberId } = getNextMemberId(row.joinYear);
      const roleTier: UserRoleTier = row.roleTier || (row.role === 'management' ? 'manager' : row.role === 'group_leader' ? 'group_leader' : 'member');
      const newUser: User = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        memberId,
        name: row.name || 'Specialist',
        email: row.email || `specialist-${Date.now()}@digihust.com`,
        phone: row.phone || '',
        avatarUrl: row.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
        role: row.role || 'freelancer',
        roleTier,
        groupId: row.groupId || 'tech',
        title: row.title || 'Domain Specialist',
        specialties: row.specialties || ['Digital Delivery'],
        hourlyRate: row.hourlyRate || 25,
        completedProjectsCount: 0,
        totalEarnings: 0,
        rating: 5.0,
        status: 'active',
        joinedAt: new Date().toISOString().split('T')[0],
        joinYear: row.joinYear || new Date().getFullYear(),
        credentialsSentAt: null,
        forcePasswordChange: true,
        statusHistory: [],
        notes: [],
        documents: []
      };
      createdUsers.push(newUser);
    });

    setUsers(prev => [...createdUsers, ...prev]);
    return { count: createdUsers.length, newUsers: createdUsers };
  };

  const sendBatchCredentials = (): { count: number; memberNames: string[] } => {
    const pendingMembers = users.filter(u => u.credentialsSentAt === null || u.credentialsSentAt === undefined);
    const timestamp = new Date().toISOString();
    const names = pendingMembers.map(u => `${u.name} (${u.memberId})`);

    setUsers(prev => prev.map(u => {
      if (u.credentialsSentAt === null || u.credentialsSentAt === undefined) {
        return { ...u, credentialsSentAt: timestamp };
      }
      return u;
    }));

    return { count: pendingMembers.length, memberNames: names };
  };

  // ── LIVE WEBSITE CMS ACTIONS ───────────────────────────────────────────────

  const updateSiteContent = (section: keyof SiteContent, data: any) => {
    if (!PERMISSIONS.canEditWebsiteContent(currentTier)) return;

    setSiteContent(prev => {
      const updated = {
        ...prev,
        [section]: data
      };
      return updated;
    });

    // Record in audit log
    const auditEntry: SecurityAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentTier,
      action: 'CMS_UPDATED',
      details: `Updated website content section: ${String(section)}`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
  };

  const resetSiteContent = () => {
    if (!PERMISSIONS.canEditWebsiteContent(currentTier)) return;
    setSiteContent(DEFAULT_SITE_CONTENT);
  };

  // Applicant Actions
  const submitApplication = (applicantData: Omit<Applicant, 'id' | 'appliedAt' | 'status'>) => {
    const newApplicant: Applicant = {
      ...applicantData,
      id: `app-${Date.now()}`,
      appliedAt: new Date().toISOString(),
      status: 'pending'
    };
    setApplicants(prev => [newApplicant, ...prev]);
  };

  const approveApplicant = (applicantId: string, role: UserRole = 'freelancer', targetGroupId?: GroupId) => {
    const applicant = applicants.find(a => a.id === applicantId);
    if (!applicant) return;

    const { memberId } = getNextMemberId();
    const roleTier: UserRoleTier = role === 'management' ? 'manager' : role === 'group_leader' ? 'group_leader' : 'member';

    const newUser: User = {
      id: `usr-${Date.now()}`,
      memberId,
      name: applicant.name,
      email: applicant.email,
      phone: applicant.phone,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      role,
      roleTier,
      groupId: targetGroupId || applicant.preferredGroupId,
      title: applicant.specialties[0] ? `${applicant.specialties[0]} Specialist` : 'Domain Specialist',
      specialties: applicant.specialties,
      bio: applicant.bio,
      completedProjectsCount: 0,
      totalEarnings: 0,
      rating: 5.0,
      digiskillBatch: applicant.digiskillId,
      status: 'active',
      joinedAt: new Date().toISOString().split('T')[0],
      credentialsSentAt: null,
      forcePasswordChange: true
    };

    setUsers(prev => [newUser, ...prev]);
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: 'approved' } : a));
  };

  const rejectApplicant = (applicantId: string, reason?: string) => {
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: 'rejected', rejectionReason: reason } : a));
  };

  const requestMoreInfoApplicant = (applicantId: string, followUpNotes?: string) => {
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: 'more_info_requested', followUpNotes } : a));
  };

  const updateGlobalSettings = (newSettings: GlobalAdminSettings) => {
    setSettings(newSettings);
  };

  const resetToDefaultData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setIsAuthenticated(true);
    setLeads(INITIAL_LEADS);
    setProjects(INITIAL_PROJECTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setCertificates(INITIAL_CERTIFICATES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setPayouts(INITIAL_PAYOUTS);
    setApplicants(INITIAL_APPLICANTS);
    setSettings(INITIAL_SETTINGS);
    setSiteContent(DEFAULT_SITE_CONTENT);
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        currentTier,
        users,
        groups,
        leads,
        projects,
        assignments,
        certificates,
        announcements,
        payouts,
        applicants,
        settings,
        siteContent,
        auditLogs,

        // Auth
        loginWithMemberId,
        logout,
        changePassword,
        requestPasswordReset,
        switchRole,
        switchTier,

        // Pipeline & Project
        submitLead,
        reviewLeadToProject,
        assignProjectTeam,
        updateProjectStatus,
        addDeliverable,
        addComment,
        releaseProjectPayout,

        // Assignment Workspace
        createAssignment,
        updateAssignmentStatus,
        addSubTask,
        toggleSubTask,
        addMilestone,
        toggleMilestone,
        addAssignmentDeliverable,
        addAssignmentComment,

        // Certificates
        issueCertificate,
        revokeCertificate,
        restoreCertificate,

        // Announcements
        postAnnouncement,
        deleteAnnouncement,

        // People & Roster
        updateUserProfile,
        changeUserStatus,
        addUserNote,
        deleteUserNote,
        setUserSplitOverride,
        reassignUserSquad,
        changeUserRole,
        updateUserRoleWithAuth,
        updateUserSquadWithAuth,
        quickInviteUser,
        bulkImportMembers,
        sendBatchCredentials,

        // CMS
        updateSiteContent,
        resetSiteContent,

        // Applicants
        submitApplication,
        approveApplicant,
        rejectApplicant,
        requestMoreInfoApplicant,

        // Settings
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
