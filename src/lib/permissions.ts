import { User, UserRoleTier, Assignment, SanitizedBrief } from '../types';

export function getUserRoleTier(user: User): UserRoleTier {
  if (user.roleTier) return user.roleTier;
  // Fallback map from legacy role
  if (user.role === 'management') {
    if (user.title.toLowerCase().includes('ceo') || user.title.toLowerCase().includes('founder') || user.isCeoMaster) {
      return 'ceo';
    }
    return 'manager';
  }
  if (user.role === 'group_leader') return 'group_leader';
  return 'member';
}

export const PERMISSIONS = {
  // Executive Root Master Governance (CEO Exclusive)
  isCeoMaster: (user: User) => user.roleTier === 'ceo' || user.isCeoMaster === true,
  canDistributeRoles: (tier: UserRoleTier) => tier === 'ceo',
  canReassignSquad: (tier: UserRoleTier) => tier === 'ceo',
  canManageManagers: (tier: UserRoleTier) => tier === 'ceo',
  canViewAuditLogs: (tier: UserRoleTier) => tier === 'ceo',
  canManageSplitConfig: (tier: UserRoleTier) => tier === 'ceo',
  canViewCompanyFinancialOverview: (tier: UserRoleTier) => tier === 'ceo',
  canResetAnyPassword: (tier: UserRoleTier) => tier === 'ceo',
  canCreateUserAccount: (tier: UserRoleTier) => tier === 'ceo',
  canDeleteUserAccount: (tier: UserRoleTier) => tier === 'ceo',

  // Live Website CMS (CEO Master, Manager, or explicitly delegated staff)
  canEditWebsiteContent: (tier: UserRoleTier, user?: User) => 
    tier === 'ceo' || tier === 'manager' || (user?.delegatedPermissions?.includes('cms_editor') ?? false),
  canPublishLiveChanges: (tier: UserRoleTier, user?: User) => 
    tier === 'ceo' || tier === 'manager' || (user?.delegatedPermissions?.includes('cms_editor') ?? false),

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
  canImportMembers: (tier: UserRoleTier) => tier === 'ceo',
  canSendCredentials: (tier: UserRoleTier) => tier === 'ceo',
  canReviewApplicants: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  
  // Announcements
  canPostGlobalAnnouncement: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  canPostGroupAnnouncement: (tier: UserRoleTier, userGroupId?: string, targetGroupId?: string) => 
    tier === 'ceo' || tier === 'manager' || (tier === 'group_leader' && userGroupId === targetGroupId),
  
  // Financials & Payouts
  canViewAllPayouts: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  canReleasePayouts: (tier: UserRoleTier) => tier === 'ceo',
  
  // Digital Certificates & Credentials
  canIssueCertificate: (tier: UserRoleTier) => tier === 'ceo' || tier === 'manager',
  canRevokeCertificate: (tier: UserRoleTier) => tier === 'ceo',
};

/**
 * Route protection validator
 */
export function canAccessPortalRoute(tier: UserRoleTier, route: string, user?: User): boolean {
  if (tier === 'ceo') return true;

  if (route.startsWith('/portal/cms')) {
    return PERMISSIONS.canEditWebsiteContent(tier, user);
  }
  if (route.startsWith('/portal/settings')) {
    return tier === 'ceo';
  }
  if (route.startsWith('/portal/certificates')) {
    return tier === 'ceo' || tier === 'manager';
  }
  if (route.startsWith('/portal/roster')) {
    return tier !== 'member';
  }

  return true;
}

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
