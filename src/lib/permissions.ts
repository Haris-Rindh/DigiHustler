import { User, UserRoleTier, Assignment, SanitizedBrief } from '../types';

export function getUserRoleTier(user: User): UserRoleTier {
  if (user.roleTier) return user.roleTier;
  // Fallback map from legacy role
  if (user.role === 'management') {
    if (user.title.toLowerCase().includes('ceo') || user.title.toLowerCase().includes('founder')) {
      return 'ceo';
    }
    return 'manager';
  }
  if (user.role === 'group_leader') return 'group_leader';
  return 'member';
}

export const PERMISSIONS = {
  // Executive Role & Governance Authority (Strict CEO root authority)
  canDistributeRoles: (tier: UserRoleTier) => tier === 'ceo',
  canReassignSquad: (tier: UserRoleTier) => tier === 'ceo',
  canManageManagers: (tier: UserRoleTier) => tier === 'ceo',
  canViewAuditLogs: (tier: UserRoleTier) => tier === 'ceo',
  canManageSplitConfig: (tier: UserRoleTier) => tier === 'ceo',
  canViewCompanyFinancialOverview: (tier: UserRoleTier) => tier === 'ceo',

  // Live Website CMS
  canEditWebsiteContent: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  canPublishLiveChanges: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',

  // Client Records & Data Isolation (Strict Privacy Wall)
  canViewFullClientRecord: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  canViewClientBudget: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  canViewClientContact: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  
  // Assignments & Task Delegation
  canCreateAssignment: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  canManageProjectSubtasks: (tier: UserRoleTier, isAssignedLeader: boolean) => 
    tier === 'ceo' || tier === 'manager' || (tier === 'group_leader' && isAssignedLeader),
  
  // People & Roster
  canViewAllPeople: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  canViewSquadRoster: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager' || tier === 'group_leader',
  canImportMembers: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  canSendCredentials: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  canReviewApplicants: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  
  // Announcements
  canPostGlobalAnnouncement: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  canPostGroupAnnouncement: (tier: UserRoleTier, userGroupId?: string, targetGroupId?: string) => 
    tier === 'ceo' || tier === 'manager' || (tier === 'group_leader' && userGroupId === targetGroupId),
  
  // Financials & Payouts
  canViewAllPayouts: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  
  // Digital Certificates & Credentials
  canIssueCertificate: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  canRevokeCertificate: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
};

/**
 * Strips client confidential information (contact, budget, contract terms)
 * and returns only the clean sanitized brief for Leaders and Members.
 */
export function sanitizeAssignmentForUser(assignment: Assignment, user: User): Assignment {
  const tier = getUserRoleTier(user);

  if (tier === 'ceo' || tier === 'manager') {
    return assignment; // Full record
  }

  // Return sanitized record without client details
  return {
    ...assignment,
    clientName: undefined,
    clientEmail: undefined,
    clientCompany: undefined,
    totalBudget: undefined,
  };
}
