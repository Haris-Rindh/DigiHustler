export type UserRole = 'management' | 'group_leader' | 'freelancer';

export type UserRoleTier = 'ceo' | 'manager' | 'group_leader' | 'member';

export type GroupId = 'tech' | 'creative' | 'data' | 'growth';

export type UserStatus = 'active' | 'inactive' | 'on_leave' | 'suspended' | 'pending_onboarding';

export interface StatusChangeLog {
  timestamp: string;
  from: UserStatus;
  to: UserStatus;
  reason: string;
  changedBy: string;
}

export interface InternalNote {
  id: string;
  timestamp: string;
  authorId: string;
  authorName: string;
  text: string;
}

export interface DocumentAttachment {
  id: string;
  name: string;
  type: 'contract' | 'id_verification' | 'portfolio' | 'other';
  url: string;
  uploadedAt: string;
}

export interface SplitOverride {
  managementPct?: number;
  leaderPct?: number;
  freelancerPct?: number;
}

export interface User {
  id: string;
  memberId?: string; // DGH2600001 format
  name: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  role: UserRole;
  roleTier?: UserRoleTier; // 4-tier access: ceo | manager | group_leader | member
  groupId?: GroupId;
  title: string;
  specialties: string[];
  bio?: string;
  hourlyRate?: number;
  completedProjectsCount: number;
  totalEarnings: number;
  rating: number;
  digiskillBatch?: string;
  status: UserStatus;
  joinedAt?: string;
  joinYear?: number;
  onTimeDeliveryPct?: number;
  csatScore?: number;
  splitOverride?: SplitOverride;
  statusHistory?: StatusChangeLog[];
  notes?: InternalNote[];
  documents?: DocumentAttachment[];
  credentialsSentAt?: string | null;
  forcePasswordChange?: boolean;
  passwordHash?: string;
}

export interface Group {
  id: GroupId;
  name: string;
  description: string;
  leaderId: string;
  iconName: string;
  specialties: string[];
  memberCount: number;
  color: string;
}

export type PipelineStage = 
  | 'new_lead' 
  | 'under_review' 
  | 'assigned' 
  | 'in_progress' 
  | 'completed' 
  | 'paid';

export interface Lead {
  id: string;
  title: string;
  clientName: string;
  clientCompany?: string;
  clientEmail: string;
  submittedByUserId: string;
  submittedByUserName: string;
  brief: string;
  budgetEstimate: number;
  suggestedGroupId: GroupId;
  status: PipelineStage;
  createdAt: string;
}

export interface ProjectAssignment {
  freelancerId: string;
  freelancerName: string;
  roleTitle: string;
  sharePct: number;
  amountCalculated?: number;
}

export interface Deliverable {
  id: string;
  title: string;
  fileUrl?: string;
  linkUrl?: string;
  submittedByUserId: string;
  submittedByUserName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'revision_requested';
  notes?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole | UserRoleTier;
  text: string;
  timestamp: string;
}

export interface Project {
  id: string;
  leadId: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  groupId: GroupId;
  assignedLeaderId: string;
  assignedLeaderName: string;
  brief: string;
  totalValue: number;
  externalFee: number;
  netRevenue: number;
  
  // Financial splits
  isLeadGenIndependent: boolean;
  leadGenUserPct: number;
  splitManagementPct: number;
  splitLeaderPct: number;
  splitFreelancerPct: number;
  
  // Team assignment
  assignments: ProjectAssignment[];
  
  // Execution tracking
  status: PipelineStage;
  deliverables: Deliverable[];
  comments: Comment[];
  createdAt: string;
  completedAt?: string;
  paidAt?: string;
}

export interface Payout {
  id: string;
  projectId: string;
  projectTitle: string;
  userId: string;
  userName: string;
  userRole: UserRole | UserRoleTier;
  groupName: string;
  roleDescription: string;
  amount: number;
  sharePct: number;
  paidAt: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredGroupId: GroupId;
  specialties: string[];
  digiskillId: string;
  digiskillCourse: string;
  portfolioUrl: string;
  experienceYears: number;
  bio: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'more_info_requested';
  rejectionReason?: string;
  followUpNotes?: string;
}

export interface GlobalAdminSettings {
  defaultManagementPct: number;
  defaultLeaderPct: number;
  defaultFreelancerPct: number;
  defaultLeadGenPct: number;
  payoutCurrency: string;
  autoApproveLeads: boolean;
}

// ── NEW PORTAL & ASSIGNMENT TYPES ─────────────────────────────────────────────

export interface SanitizedBrief {
  title: string;
  scope: string;
  deliverables: string[];
  deadline: string;
  referenceFiles?: string[];
}

export interface SubTask {
  id: string;
  title: string;
  assignedMemberId: string;
  assignedMemberName: string;
  status: 'todo' | 'in_progress' | 'completed';
  dueDate?: string;
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  isCompleted: boolean;
}

export interface Assignment {
  id: string;
  projectId: string;
  // Full client record (CEO & Manager only)
  clientName?: string;
  clientEmail?: string;
  clientCompany?: string;
  totalBudget?: number;
  // Sanitized view (All assigned roles)
  assignedLeaderId: string;
  assignedLeaderName: string;
  assignedMemberIds: string[];
  squad: GroupId;
  status: PipelineStage;
  sanitizedBrief: SanitizedBrief;
  subTasks: SubTask[];
  milestones: Milestone[];
  deliverables: Deliverable[];
  comments: Comment[];
  createdBy: string;
  createdAt: string;
}

// ── CERTIFICATES & QR VERIFICATION TYPES ─────────────────────────────────────

export type CertificateType = 'offer_letter' | 'experience_certificate';
export type CertificateStatus = 'valid' | 'revoked';

export interface Certificate {
  id: string; // UUID token for unguessable public URL
  memberId: string;
  memberName: string;
  memberDghId: string;
  type: CertificateType;
  roleTitle: string;
  startDate: string;
  endDate?: string;
  issuedDate: string;
  status: CertificateStatus;
  clientName: string; // Real client name
  projectDetails: string; // Real project details
  issuedBy: string;
  qrCodeUrl?: string;
  revocationReason?: string;
}

// ── ANNOUNCEMENTS TYPES ──────────────────────────────────────────────────────

export type AnnouncementScope = 'global' | 'group';

export interface Announcement {
  id: string;
  scope: AnnouncementScope;
  groupId?: GroupId;
  title: string;
  body: string;
  postedBy: string;
  postedByName: string;
  postedByRole: UserRoleTier;
  postedAt: string;
  expiresAt?: string;
}

export interface IdCounter {
  lastNumber: number;
}
