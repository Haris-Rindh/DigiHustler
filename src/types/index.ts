export type UserRole = 'management' | 'group_leader' | 'freelancer' | 'intern';

export type UserRoleTier = 'ceo' | 'manager' | 'group_leader' | 'member' | 'intern';

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
  isCeoMaster?: boolean;
  delegatedPermissions?: string[];
  temporaryPlainPassword?: string;
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
  assignedAt: string;
}

export interface Deliverable {
  id: string;
  title: string;
  linkUrl?: string;
  submittedByUserId: string;
  submittedByUserName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'changes_requested';
  notes?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: string;
  text: string;
  timestamp: string;
}

export interface Project {
  id: string;
  leadId?: string;
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
  isLeadGenIndependent: boolean;
  leadGenUserPct: number;
  splitManagementPct: number;
  splitLeaderPct: number;
  splitFreelancerPct: number;
  assignments: ProjectAssignment[];
  status: PipelineStage;
  deliverables: Deliverable[];
  comments: Comment[];
  createdAt: string;
  completedAt?: string;
  paidAt?: string;
  trackingToken?: string;
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
  portfolioUrl?: string;
  digiskillId?: string;
  yearsOfExperience?: number;
  bio: string;
  appliedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'more_info_requested';
  rejectionReason?: string;
  followUpNotes?: string;
}

export interface GlobalAdminSettings {
  defaultManagementSplitPct: number;
  defaultLeaderSplitPct: number;
  defaultFreelancerSplitPct: number;
  autoApproveLeads: boolean;
  payoutHoldDays: number;
  allowIndependentLeadGen: boolean;
  defaultLeadGenPct: number;
  minFreelancersPerProject: number;
  maxActiveProjectsPerFreelancer: number;
}

// ── INTERNAL PORTAL & ASSIGNMENT WORKSPACE TYPES ─────────────────────────────

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

export interface SanitizedBrief {
  title: string;
  scope: string;
  deliverables: string[];
  deadline: string;
  referenceFiles?: string[];
}

export interface Assignment {
  id: string;
  projectId?: string;
  // Full Client Record (CEO & Manager only)
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

export type CertificateType = 'offer_letter' | 'completion_certificate' | 'experience_certificate' | string;
export type CertificateStatus = 'valid' | 'revoked';

export interface PdfFieldPosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  fontSize?: number;
  color?: string; // hex color e.g. '#022B3A'
  align?: 'left' | 'center' | 'right';
}

export interface PdfTemplateConfig {
  orientation: 'portrait' | 'landscape';
  backgroundPdfBase64?: string; // base64 or data URL of the user's custom PDF template
  backgroundImageUrl?: string; // high-res PNG/JPG template image
  positions: {
    recipientName: PdfFieldPosition;
    memberId?: PdfFieldPosition;
    roleTitle?: PdfFieldPosition;
    duration?: PdfFieldPosition;
    issueDate?: PdfFieldPosition;
    qrCode: { x: number; y: number; size: number };
    signatoryName?: PdfFieldPosition;
    signatoryTitle?: PdfFieldPosition;
  };
}

export interface CertificateTemplate {
  id: string;
  name: string; // e.g. "Internship Offer Letter", "Certificate of Completion", "Experience Certificate"
  type: CertificateType;
  documentTitle: string; // e.g. "Internship Offer Letter", "Certificate of Completion"
  badgeText?: string; // e.g. "Official Verified", "Honorary Award"
  defaultDuration?: string; // e.g. "45 Days (Remote)"
  introParagraph: string; // supports {{memberName}}, {{roleTitle}}, {{duration}}, {{memberId}}
  bulletPoints?: string[]; // criteria / key milestones
  revenueClause?: string; // e.g. "65–70% of project budget..."
  closingParagraph?: string;
  signatoryName: string; // e.g. "Mahad Abbas"
  signatoryTitle: string; // e.g. "Founder & CEO"
  watermarkText?: string; // e.g. "DigiHust"
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  pdfConfig?: PdfTemplateConfig;
  createdAt?: string;
}

export interface Certificate {
  id: string; // UUID token for unguessable public URL
  templateId?: string;
  memberId: string;
  memberName: string;
  memberDghId: string;
  type: CertificateType;
  customTypeName?: string;
  documentTitle?: string;
  roleTitle: string;
  startDate?: string;
  endDate?: string;
  issuedDate: string;
  status: CertificateStatus;
  isLocked?: boolean; // true = locked by Management, false = released to member portal
  releasedAt?: string;
  driveUrl?: string; // Google Drive PDF or download link
  clientName?: string; // Real client name / DigiHust authority
  projectDetails?: string; // Real project details
  issuedBy?: string;
  qrCodeUrl?: string;
  revocationReason?: string;
  durationText?: string; // e.g. "45 Days (Remote)"
  notes?: string;
  stipendTerms?: string;
  evaluationCriteria?: string[];
  introParagraph?: string;
  closingParagraph?: string;
  signatoryName?: string; // e.g. "Mahad Abbas"
  signatoryTitle?: string; // e.g. "Founder & CEO"
  watermarkText?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  pdfConfig?: PdfTemplateConfig;
}

// ── ANNOUNCEMENTS TYPES ──────────────────────────────────────────────────────

export type AnnouncementScope = 'global' | 'group';

export interface Announcement {
  id: string;
  scope: AnnouncementScope;
  groupId?: GroupId;
  title: string;
  body?: string;
  content?: string;
  postedBy?: string;
  postedByName?: string;
  postedByRole?: UserRoleTier;
  postedAt: string;
  expiresAt?: string;
}

export interface IdCounter {
  lastNumber: number;
}

// ── EXECUTIVE CMS (LIVE SITE CONTENT) TYPES ──────────────────────────────────

export interface SiteHeroContent {
  badgeText: string;
  headlineLine1: string;
  headlineHighlight: string;
  headlineLine2: string;
  subheadline: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  metricsBadgeValue: string;
  metricsBadgeLabel: string;
  heroImage: string;
}

export interface SiteValueProp {
  id: string;
  title: string;
  description: string;
  badge?: string;
  iconName?: string;
}

export interface SiteCaseStudy {
  id: string;
  slug: string;
  category: string;
  title: string;
  client: string;
  tags: string[];
  summary: string;
  impactMetric: string;
  impactLabel: string;
  imageUrl: string;
  deliverables: string[];
  challenge?: string;
  solution?: string;
}

export interface SiteTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  rating: number;
}

export interface SiteServiceItem {
  id: string;
  groupId: GroupId;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  color: string;
  iconName?: string;
}

export interface SitePackage {
  id: string;
  name: string;
  price: string;
  desc: string;
  popular: boolean;
  features: string[];
  turnaround?: string;
  ctaText?: string;
}

export interface SiteTeamMember {
  id: string;
  name: string;
  role: string;
  squad: string;
  bio: string;
  avatarUrl: string;
  tags: string[];
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface SiteFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface SiteAboutContent {
  mission: string;
  vision: string;
  story: string;
  values: { id: string; title: string; desc: string }[];
}

export interface SiteContactContent {
  email: string;
  phone: string;
  address: string;
  whatsapp?: string;
  calendlyUrl?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface SiteBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorAvatar?: string;
  readTime: string;
  publishedAt: string;
  imageUrl: string;
  isPublished?: boolean;
  tags?: string[];
}

export interface SiteContent {
  hero: SiteHeroContent;
  valueProps: SiteValueProp[];
  caseStudies: SiteCaseStudy[];
  testimonials: SiteTestimonial[];
  services: SiteServiceItem[];
  packages: SitePackage[];
  teamMembers: SiteTeamMember[];
  faqs: SiteFAQ[];
  about: SiteAboutContent;
  contact: SiteContactContent;
  customImages: Record<string, string>;
  certificateTemplates?: CertificateTemplate[];
  blogPosts?: SiteBlogPost[];
  // Pinned member IDs in exact order — stored in cloud for cross-device sync
  pinnedMemberIds?: string[];
}

// ── SECURITY & PERMISSION AUDIT LOG TYPES ────────────────────────────────────

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRoleTier;
  action: 
    | 'ROLE_MODIFIED' 
    | 'PERMISSIONS_UPDATED' 
    | 'SQUAD_REASSIGNED' 
    | 'CMS_UPDATED' 
    | 'CREDENTIALS_DISPATCHED' 
    | 'PASSWORD_RESET' 
    | 'ACCOUNT_CREATED' 
    | 'ACCOUNT_SUSPENDED' 
    | 'CERTIFICATE_ISSUED' 
    | 'CERTIFICATE_REVOKED';
  targetId?: string;
  targetName?: string;
  details: string;
}
