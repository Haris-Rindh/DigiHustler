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
  // Client Records
  canViewFullClientRecord: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  
  // Assignments
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
  canViewCompanyFinancialOverview: (tier: UserRoleTier) => tier === 'ceo',
  canManageSplitConfig: (tier: UserRoleTier) => tier === 'ceo',
  canManageManagers: (tier: UserRoleTier) => tier === 'ceo',
  
  // Certificates
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
