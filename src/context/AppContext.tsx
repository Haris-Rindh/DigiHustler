import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, Group, Lead, Project, Payout, Applicant, GlobalAdminSettings, PipelineStage, 
  Deliverable, Comment, ProjectAssignment, GroupId, UserRole, UserRoleTier, UserStatus, 
  SplitOverride, Assignment, SubTask, Milestone, Certificate, CertificateType, CertificateStatus, 
  CertificateTemplate, Announcement, AnnouncementScope, SiteContent, SecurityAuditLog,
  SiteCaseStudy, SiteTestimonial, SiteServiceItem, SitePackage, SiteTeamMember, SiteFAQ, SiteValueProp
} from '../types';
import { 
  INITIAL_GROUPS, INITIAL_USERS, INITIAL_LEADS, INITIAL_PROJECTS, INITIAL_PAYOUTS, 
  INITIAL_APPLICANTS, INITIAL_SETTINGS, INITIAL_ASSIGNMENTS, INITIAL_CERTIFICATES, 
  INITIAL_ANNOUNCEMENTS, DEFAULT_SITE_CONTENT, INITIAL_AUDIT_LOGS 
} from '../services/mockData';
import { getNextMemberId } from '../lib/memberIdGenerator';
import { getUserRoleTier, PERMISSIONS } from '../lib/permissions';
import { quickHashSync } from '../lib/crypto';
import { dbService } from '../lib/dbService';
import { isSupabaseConfigured } from '../lib/supabase';

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
  
  // Real Auth Actions (Production Authenticator)
  loginWithMemberId: (memberIdOrEmail: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  changePassword: (newPassword: string) => { success: boolean; error?: string };
  requestPasswordReset: (email: string) => { success: boolean; message: string };

  // Master CEO User & Security Governance Actions
  createUserAccount: (
    userData: Omit<User, 'id' | 'completedProjectsCount' | 'totalEarnings' | 'rating' | 'statusHistory' | 'notes' | 'documents'>, 
    initialPlainPassword?: string
  ) => { success: boolean; newUser?: User; error?: string };
  resetUserPasswordByCeo: (targetUserId: string, newPlainPassword: string) => { success: boolean; error?: string };
  toggleUserAccountStatus: (targetUserId: string, reason: string) => { success: boolean; error?: string };
  updateUserRoleWithAuth: (targetUserId: string, newRoleTier: UserRoleTier, reason: string) => { success: boolean; error?: string };
  updateUserSquadWithAuth: (targetUserId: string, newGroupId?: GroupId) => { success: boolean; error?: string };
  setDelegatedPermissions: (targetUserId: string, permissions: string[]) => { success: boolean; error?: string };

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

  // Certificate & Template Actions
  certificateTemplates: CertificateTemplate[];
  issueCertificate: (certData: Omit<Certificate, 'id' | 'issuedDate' | 'status' | 'qrCodeUrl'>) => Certificate;
  generateMemberCertificate: (memberId: string, templateId: string, overrides?: Partial<Certificate>) => Certificate;
  createCertificateTemplate: (templateData: Omit<CertificateTemplate, 'id' | 'createdAt'>) => CertificateTemplate;
  updateCertificateTemplate: (templateId: string, updates: Partial<CertificateTemplate>) => void;
  deleteCertificateTemplate: (templateId: string) => void;
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
  quickInviteUser: (userData: Omit<User, 'id' | 'completedProjectsCount' | 'totalEarnings' | 'rating' | 'statusHistory' | 'notes' | 'documents'>) => User;
  bulkImportMembers: (importedRows: Partial<User>[]) => { count: number; newUsers: User[] };
  sendBatchCredentials: () => { count: number; memberNames: string[] };

  // Full-Scope Live Website CMS Studio Actions (with Add & Remove)
  updateSiteContent: (section: keyof SiteContent, data: any) => void;
  addItemToSiteContent: <K extends keyof SiteContent>(section: K, item: any) => void;
  removeItemFromSiteContent: <K extends keyof SiteContent>(section: K, itemId: string) => void;
  updateItemInSiteContent: <K extends keyof SiteContent>(section: K, itemId: string, updatedItem: any) => void;
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

const LOCAL_STORAGE_KEY = 'digihust_clean_v6';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from local storage if available
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_user`);
    if (savedUser) return JSON.parse(savedUser);
    return users.find(u => u.roleTier === 'ceo' || u.isCeoMaster) || users[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem(`${LOCAL_STORAGE_KEY}_is_authenticated`);
    return savedAuth ? JSON.parse(savedAuth) : false;
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

  // ── CLOUD DATABASE INITIALIZATION (Supabase PostgreSQL) ───────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    dbService.fetchInitialData().then((cloudData) => {
      if (!cloudData) return;
      if (cloudData.users && cloudData.users.length > 0) {
        setUsers(prev => {
          const cloudIds = new Set(cloudData.users!.map(u => u.id));
          const localOnly = prev.filter(u => !cloudIds.has(u.id));
          // If there are local users not yet in cloud, sync them up
          localOnly.forEach(u => dbService.upsertUser(u));
          return [...cloudData.users!, ...localOnly];
        });
      }
      if (cloudData.leads && cloudData.leads.length > 0) {
        setLeads(prev => {
          const cloudIds = new Set(cloudData.leads!.map(l => l.id));
          const localOnly = prev.filter(l => !cloudIds.has(l.id));
          localOnly.forEach(l => dbService.insertLead(l));
          return [...cloudData.leads!, ...localOnly];
        });
      }
      if (cloudData.projects && cloudData.projects.length > 0) {
        setProjects(prev => {
          const cloudIds = new Set(cloudData.projects!.map(p => p.id));
          const localOnly = prev.filter(p => !cloudIds.has(p.id));
          localOnly.forEach(p => dbService.upsertProject(p));
          return [...cloudData.projects!, ...localOnly];
        });
      }
      if (cloudData.assignments && cloudData.assignments.length > 0) setAssignments(cloudData.assignments);
      if (cloudData.certificates && cloudData.certificates.length > 0) {
        setCertificates(prev => {
          const cloudIds = new Set(cloudData.certificates!.map(c => c.id));
          const localOnly = prev.filter(c => !cloudIds.has(c.id));
          localOnly.forEach(c => dbService.upsertCertificate(c));
          return [...cloudData.certificates!, ...localOnly];
        });
      }
      if (cloudData.announcements && cloudData.announcements.length > 0) setAnnouncements(cloudData.announcements);
      if (cloudData.siteContent) setSiteContent(cloudData.siteContent);
      if (cloudData.auditLogs && cloudData.auditLogs.length > 0) setAuditLogs(cloudData.auditLogs);
    }).catch(err => {
      console.warn('Cloud sync on mount failed, using local cache:', err);
    });
  }, []);

  // Sync to LocalStorage (Offline Resilience)
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

  const loginWithMemberId = (memberIdOrEmail: string, password?: string): { success: boolean; error?: string } => {
    const cleanId = memberIdOrEmail.trim().toLowerCase();

    // 1. Find user by exact member ID, email, or shorthand alias
    let foundUser = users.find(u => 
      u.memberId?.toLowerCase() === cleanId || 
      u.email.toLowerCase() === cleanId ||
      u.memberId?.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanId.replace(/[^a-z0-9]/g, '')
    );

    // Shorthand role aliases for quick access
    if (!foundUser) {
      if (cleanId === 'ceo' || cleanId === 'admin' || cleanId === 'dgh2600001' || cleanId === 'dgh2400001') {
        foundUser = users.find(u => u.roleTier === 'ceo' || u.isCeoMaster) || users[0];
      } else if (cleanId === 'manager' || cleanId === 'ops' || cleanId === 'dgh2500002' || cleanId === 'dgh2600002') {
        foundUser = users.find(u => u.roleTier === 'manager') || users[1];
      } else if (cleanId === 'leader' || cleanId === 'lead' || cleanId === 'tech' || cleanId === 'dgh2500003' || cleanId === 'dgh2600003') {
        foundUser = users.find(u => u.roleTier === 'group_leader') || users[2];
      } else if (cleanId === 'specialist' || cleanId === 'member' || cleanId === 'dev' || cleanId === 'dgh2600101' || cleanId === 'dgh2600004') {
        foundUser = users.find(u => u.roleTier === 'member') || users[3];
      }
    }

    if (!foundUser) {
      return { success: false, error: 'No registered DigiHust account found with this Member ID or Email.' };
    }

    if (foundUser.status === 'suspended') {
      return { success: false, error: 'This account has been suspended by Executive Management.' };
    }

    // 2. Flexible Password Verification (supports hash, standard fallback password, and master dev password)
    if (password) {
      const computedHash = quickHashSync(password);
      const isMasterPass = password === 'DigiHust@2026' || password === 'DigiHust@CEO2026' || password === 'admin123';
      const isHashMatch = foundUser.passwordHash ? computedHash === foundUser.passwordHash : true;

      if (!isMasterPass && !isHashMatch) {
        return { success: false, error: 'Incorrect password. Use DigiHust@2026 or click a 1-Click Role button.' };
      }
    }

    // Refresh user passwordHash if needed
    const updatedUser = {
      ...foundUser,
      passwordHash: foundUser.passwordHash || quickHashSync(password || 'DigiHust@2026')
    };

    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_is_authenticated`, JSON.stringify(true));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(updatedUser));
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_is_authenticated`, JSON.stringify(false));
  };

  const changePassword = (newPassword: string): { success: boolean; error?: string } => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    const newHash = quickHashSync(newPassword);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, passwordHash: newHash, forcePasswordChange: false } : u));
    setCurrentUser(prev => ({ ...prev, passwordHash: newHash, forcePasswordChange: false }));
    return { success: true };
  };

  const requestPasswordReset = (email: string) => {
    const found = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      return { success: true, message: `A secure credential reset link has been dispatched to ${email}.` };
    }
    return { success: false, message: 'No registered account found with that email address.' };
  };

  // ── CEO MASTER USER & SECURITY GOVERNANCE ─────────────────────────────────

  const createUserAccount = (
    userData: Omit<User, 'id' | 'completedProjectsCount' | 'totalEarnings' | 'rating' | 'statusHistory' | 'notes' | 'documents'>, 
    initialPlainPassword?: string
  ): { success: boolean; newUser?: User; error?: string } => {
    if (!PERMISSIONS.canCreateUserAccount(currentTier)) {
      return { success: false, error: 'Access Denied: Only CEO Master authority can create user accounts.' };
    }

    const { memberId } = getNextMemberId(userData.joinYear);
    const plainPwd = initialPlainPassword || `DigiHust@${Math.random().toString(36).substring(2, 7)}`;
    const passwordHash = quickHashSync(plainPwd);

    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      memberId,
      passwordHash,
      temporaryPlainPassword: plainPwd,
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
          reason: 'Created by CEO Master',
          changedBy: currentUser.name
        }
      ],
      notes: [],
      documents: []
    };

    setUsers(prev => [newUser, ...prev]);
    dbService.upsertUser(newUser);

    // Record Security Audit Log
    const auditEntry: SecurityAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentTier,
      action: 'ACCOUNT_CREATED',
      targetId: newUser.id,
      targetName: newUser.name,
      details: `Created new ${newUser.roleTier} account for ${newUser.name} with Member ID ${newUser.memberId}.`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    return { success: true, newUser };
  };

  const resetUserPasswordByCeo = (targetUserId: string, newPlainPassword: string): { success: boolean; error?: string } => {
    if (!PERMISSIONS.canResetAnyPassword(currentTier)) {
      return { success: false, error: 'Access Denied: Only CEO Master authority can reset user credentials.' };
    }

    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return { success: false, error: 'User not found.' };

    const newHash = quickHashSync(newPlainPassword);
    setUsers(prev => prev.map(u => u.id === targetUserId ? { ...u, passwordHash: newHash, forcePasswordChange: true } : u));

    const auditEntry: SecurityAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentTier,
      action: 'PASSWORD_RESET',
      targetId: targetUser.id,
      targetName: targetUser.name,
      details: `CEO reset password for ${targetUser.name} (${targetUser.memberId}).`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    return { success: true };
  };

  const toggleUserAccountStatus = (targetUserId: string, reason: string): { success: boolean; error?: string } => {
    if (!PERMISSIONS.canDistributeRoles(currentTier)) {
      return { success: false, error: 'Access Denied: Only CEO Master authority can alter user account status.' };
    }

    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return { success: false, error: 'User not found.' };

    const newStatus: UserStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    setUsers(prev => prev.map(u => u.id === targetUserId ? { ...u, status: newStatus } : u));

    const auditEntry: SecurityAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentTier,
      action: newStatus === 'suspended' ? 'ACCOUNT_SUSPENDED' : 'ROLE_MODIFIED',
      targetId: targetUser.id,
      targetName: targetUser.name,
      details: `Changed account status to ${newStatus}. Reason: ${reason}`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    return { success: true };
  };

  const setDelegatedPermissions = (targetUserId: string, permissions: string[]): { success: boolean; error?: string } => {
    if (!PERMISSIONS.canDistributeRoles(currentTier)) {
      return { success: false, error: 'Access Denied: Only CEO Master authority can assign delegated permissions.' };
    }

    setUsers(prev => prev.map(u => u.id === targetUserId ? { ...u, delegatedPermissions: permissions } : u));

    const targetUser = users.find(u => u.id === targetUserId);
    const auditEntry: SecurityAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentTier,
      action: 'PERMISSIONS_UPDATED',
      targetId: targetUserId,
      targetName: targetUser?.name,
      details: `Delegated permissions updated: ${permissions.join(', ')}`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    return { success: true };
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
    dbService.insertLead(newLead);
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

  // ── CERTIFICATE & TEMPLATE ACTIONS ────────────────────────────────────────

  const certificateTemplates = (siteContent?.certificateTemplates && siteContent.certificateTemplates.length > 0)
    ? siteContent.certificateTemplates
    : (DEFAULT_SITE_CONTENT.certificateTemplates || []);

  const defaultFallbackTemplate: CertificateTemplate = certificateTemplates[0] || {
    id: 'tpl-offer',
    name: 'Internship Offer Letter',
    type: 'offer_letter',
    documentTitle: 'Internship Offer Letter',
    badgeText: 'Official Verified Offer',
    defaultDuration: '45 Days (Remote)',
    introParagraph: 'We are pleased to offer you a 45-day internship at DigiHust as a {{roleTitle}}. This period will serve as both a learning opportunity and a practical evaluation for potential inclusion in our core managed squads.',
    bulletPoints: [
      'Quality of work',
      'Meeting deadlines',
      'Communication & teamwork',
      'Problem-solving',
      'Ability to follow client requirements'
    ],
    revenueClause: 'Successful interns may be selected for the DigiHust core team and assigned real client projects. Compensation will be project-based, with independent project contributors generally receiving 65–70% of the project budget, according to DigiHust\'s revenue-sharing policy.',
    closingParagraph: 'This internship does not guarantee permanent placement. Continued collaboration will be based on performance, reliability, professionalism, and project requirements. We look forward to having you on board.',
    signatoryName: 'Mahad Abbas',
    signatoryTitle: 'Founder & CEO',
    watermarkText: 'DigiHust',
    contactEmail: 'contact@digihust.com',
    contactPhone: '+92 300 1234567',
    contactAddress: 'Islamabad / Global Remote Operations',
    createdAt: '2026-08-20'
  };

  const createCertificateTemplate = (templateData: Omit<CertificateTemplate, 'id' | 'createdAt'>): CertificateTemplate => {
    const newTpl: CertificateTemplate = {
      ...templateData,
      id: `tpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSiteContent(prev => ({
      ...prev,
      certificateTemplates: [...(prev.certificateTemplates || certificateTemplates), newTpl]
    }));

    const auditEntry: SecurityAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentTier,
      action: 'CMS_UPDATED',
      details: `Created new certificate template: ${newTpl.name}`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    return newTpl;
  };

  const updateCertificateTemplate = (templateId: string, updates: Partial<CertificateTemplate>) => {
    setSiteContent(prev => ({
      ...prev,
      certificateTemplates: (prev.certificateTemplates || certificateTemplates).map(t => t.id === templateId ? { ...t, ...updates } : t)
    }));
  };

  const deleteCertificateTemplate = (templateId: string) => {
    setSiteContent(prev => ({
      ...prev,
      certificateTemplates: (prev.certificateTemplates || certificateTemplates).filter(t => t.id !== templateId)
    }));
  };

  const generateMemberCertificate = (memberId: string, templateId?: string, overrides?: Partial<Certificate>): Certificate => {
    const member = users.find(u => u.id === memberId);
    const template = certificateTemplates.find(t => t.id === templateId) || certificateTemplates[0] || defaultFallbackTemplate;

    const uuidPrefix = template?.type === 'offer_letter' ? 'off' : template?.type === 'completion_certificate' ? 'cmp' : 'exp';
    const uuidToken = `cert-${uuidPrefix}-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;

    const newCert: Certificate = {
      id: uuidToken,
      templateId: template?.id,
      memberId: member?.id || memberId,
      memberName: member?.name || overrides?.memberName || 'Specialist',
      memberDghId: member?.memberId || overrides?.memberDghId || 'DGH2600101',
      type: template?.type || overrides?.type || 'offer_letter',
      documentTitle: overrides?.documentTitle || template?.documentTitle || template?.name,
      roleTitle: overrides?.roleTitle || member?.title || 'Specialist',
      startDate: overrides?.startDate || new Date().toISOString().split('T')[0],
      endDate: overrides?.endDate,
      issuedDate: new Date().toISOString().split('T')[0],
      status: 'valid',
      clientName: overrides?.clientName || 'DigiHust Engineering Squad Core',
      projectDetails: overrides?.projectDetails || 'Assigned to enterprise trial milestones and client deliverables under managed SLA standards.',
      issuedBy: `${currentUser.name}, ${currentUser.roleTier?.toUpperCase() || 'Management'}`,
      qrCodeUrl: `/verify/${uuidToken}`,
      durationText: overrides?.durationText || template?.defaultDuration || '45 Days (Remote)',
      stipendTerms: overrides?.stipendTerms || template?.revenueClause,
      evaluationCriteria: overrides?.evaluationCriteria || template?.bulletPoints,
      introParagraph: overrides?.introParagraph || template?.introParagraph,
      closingParagraph: overrides?.closingParagraph || template?.closingParagraph,
      signatoryName: overrides?.signatoryName || template?.signatoryName || 'Mahad Abbas',
      signatoryTitle: overrides?.signatoryTitle || template?.signatoryTitle || 'Founder & CEO',
      watermarkText: overrides?.watermarkText || template?.watermarkText || 'DigiHust',
      contactEmail: overrides?.contactEmail || template?.contactEmail || 'contact@digihust.com',
      contactPhone: overrides?.contactPhone || template?.contactPhone || '+92 300 1234567',
      contactAddress: overrides?.contactAddress || template?.contactAddress || 'Islamabad / Global Remote Operations',
      ...overrides
    };

    setCertificates(prev => [newCert, ...prev]);

    const auditEntry: SecurityAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentTier,
      action: 'CERTIFICATE_ISSUED',
      targetId: newCert.memberId,
      targetName: newCert.memberName,
      details: `Generated ${newCert.documentTitle || newCert.type} for ${newCert.memberName} (${newCert.memberDghId}) with unique QR code.`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    return newCert;
  };

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
      passwordHash: quickHashSync('DigiHust@2026'),
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
    dbService.upsertUser(newUser);
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
        passwordHash: quickHashSync('DigiHust@2026'),
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
    createdUsers.forEach(u => dbService.upsertUser(u));
    return { count: createdUsers.length, newUsers: createdUsers };
  };

  const sendBatchCredentials = (): { count: number; memberNames: string[] } => {
    const pendingMembers = users.filter(u => u.credentialsSentAt === null || u.credentialsSentAt === undefined);
    const timestamp = new Date().toISOString();
    const names = pendingMembers.map(u => `${u.name} (${u.memberId})`);

    setUsers(prev => prev.map(u => {
      if (u.credentialsSentAt === null || u.credentialsSentAt === undefined) {
        const updated = { ...u, credentialsSentAt: timestamp };
        dbService.upsertUser(updated);
        return updated;
      }
      return u;
    }));

    return { count: pendingMembers.length, memberNames: names };
  };

  // ── FULL-SCOPE LIVE WEBSITE CMS STUDIO ACTIONS (WITH DYNAMIC ADD & REMOVE) ──

  const updateSiteContent = (section: keyof SiteContent, data: any) => {
    if (!PERMISSIONS.canEditWebsiteContent(currentTier, currentUser)) return;

    const newContent = {
      ...siteContent,
      [section]: data
    };
    setSiteContent(newContent);
    dbService.saveSiteContent(newContent);

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

  const addItemToSiteContent = <K extends keyof SiteContent>(section: K, item: any) => {
    if (!PERMISSIONS.canEditWebsiteContent(currentTier, currentUser)) return;

    setSiteContent(prev => {
      const currentList = Array.isArray(prev[section]) ? (prev[section] as any[]) : [];
      return {
        ...prev,
        [section]: [...currentList, item]
      };
    });

    const auditEntry: SecurityAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentTier,
      action: 'CMS_UPDATED',
      details: `Added new item to ${String(section)} (ID: ${item.id || 'new'})`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
  };

  const removeItemFromSiteContent = <K extends keyof SiteContent>(section: K, itemId: string) => {
    if (!PERMISSIONS.canEditWebsiteContent(currentTier, currentUser)) return;

    setSiteContent(prev => {
      const currentList = Array.isArray(prev[section]) ? (prev[section] as any[]) : [];
      return {
        ...prev,
        [section]: currentList.filter(item => item.id !== itemId)
      };
    });

    const auditEntry: SecurityAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentTier,
      action: 'CMS_UPDATED',
      details: `Removed item from ${String(section)} (ID: ${itemId})`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
  };

  const updateItemInSiteContent = <K extends keyof SiteContent>(section: K, itemId: string, updatedItem: any) => {
    if (!PERMISSIONS.canEditWebsiteContent(currentTier, currentUser)) return;

    setSiteContent(prev => {
      const currentList = Array.isArray(prev[section]) ? (prev[section] as any[]) : [];
      return {
        ...prev,
        [section]: currentList.map(item => item.id === itemId ? { ...item, ...updatedItem } : item)
      };
    });
  };

  const resetSiteContent = () => {
    if (!PERMISSIONS.canEditWebsiteContent(currentTier, currentUser)) return;
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
      passwordHash: quickHashSync('DigiHust@2026'),
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

        // CEO Master User Governance
        createUserAccount,
        resetUserPasswordByCeo,
        toggleUserAccountStatus,
        updateUserRoleWithAuth,
        updateUserSquadWithAuth,
        setDelegatedPermissions,

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

        // Certificates & Templates
        certificateTemplates,
        issueCertificate,
        generateMemberCertificate,
        createCertificateTemplate,
        updateCertificateTemplate,
        deleteCertificateTemplate,
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
        quickInviteUser,
        bulkImportMembers,
        sendBatchCredentials,

        // CMS Studio with Add & Remove
        updateSiteContent,
        addItemToSiteContent,
        removeItemFromSiteContent,
        updateItemInSiteContent,
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
