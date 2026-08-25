export type UserRole = 'management' | 'group_leader' | 'freelancer';

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
  name: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  role: UserRole;
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
  onTimeDeliveryPct?: number;
  csatScore?: number;
  splitOverride?: SplitOverride;
  statusHistory?: StatusChangeLog[];
  notes?: InternalNote[];
  documents?: DocumentAttachment[];
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
  sharePct: number; // slice of the freelancer pool (e.g. 60% of freelancer pool)
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
  userRole: UserRole;
  text: string;
  timestamp: string;
}

export interface Project {
  id: string;
  leadId: string;
  title: string;
  clientName: string;
  clientEmail: string;
  groupId: GroupId;
  assignedLeaderId: string;
  assignedLeaderName: string;
  brief: string;
  totalValue: number;
  externalFee: number;
  netRevenue: number;
  
  // Financial splits
  isLeadGenIndependent: boolean;
  leadGenUserPct: number; // e.g. 15%
  splitManagementPct: number; // e.g. 20%
  splitLeaderPct: number; // e.g. 10%
  splitFreelancerPct: number; // e.g. 55%
  
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
  userRole: UserRole;
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
