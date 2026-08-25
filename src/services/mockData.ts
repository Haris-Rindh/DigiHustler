import { Group, User, Lead, Project, Payout, Applicant, GlobalAdminSettings, Assignment, Certificate, Announcement } from '../types';

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'tech',
    name: 'Technology & Development',
    description: 'Custom Web Applications, Mobile Apps, Backend Systems & Cybersecurity Architecture.',
    leaderId: 'usr-ldr-tech',
    iconName: 'Code',
    specialties: ['Web Development', 'Full-Stack React', 'Node.js', 'Python & Django', 'Mobile Apps', 'Cybersecurity'],
    memberCount: 14,
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'creative',
    name: 'Creative & Design',
    description: 'Brand Identity, UI/UX Design, 3D Graphics, Motion Video Editing & Visual Content.',
    leaderId: 'usr-ldr-creative',
    iconName: 'Palette',
    specialties: ['UI/UX Design', 'Graphic Design', 'Figma', 'Video Editing', '3D Animation', 'Brand Strategy'],
    memberCount: 18,
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'data',
    name: 'Data, AI & Automation',
    description: 'Data Engineering, BI Dashboards, Machine Learning Models, and Automated Workflow Pipelines.',
    leaderId: 'usr-ldr-data',
    iconName: 'Cpu',
    specialties: ['Data Analytics', 'Business Intelligence', 'AI/ML Engineering', 'PowerBI', 'n8n/Zapier Automation'],
    memberCount: 11,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'growth',
    name: 'Growth & Client Acquisition',
    description: 'Outbound Client Sourcing, Cold Email Hunting, SEO, Social Media Marketing & Sales Closers.',
    leaderId: 'usr-ldr-growth',
    iconName: 'TrendingUp',
    specialties: ['Lead Generation', 'Client Hunting', 'Cold Email Marketing', 'SEO', 'Sales Funnels', 'PPC Advertising'],
    memberCount: 22,
    color: 'from-amber-500 to-orange-600'
  }
];

export const INITIAL_USERS: User[] = [
  // ── 1. CEO / FOUNDER ──
  {
    id: 'usr-ceo-1',
    memberId: 'DGH2400001',
    name: 'Haris Asad',
    email: 'ceo@digihust.com',
    phone: '+92 300 1234567',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    role: 'management',
    roleTier: 'ceo',
    title: 'Chief Executive Officer & Founder',
    specialties: ['Executive Strategy', 'Global Split Governance', 'Enterprise Accounts'],
    completedProjectsCount: 52,
    totalEarnings: 42800,
    rating: 5.0,
    digiskillBatch: 'Founding Member',
    status: 'active',
    joinedAt: '2024-01-15',
    joinYear: 2024,
    onTimeDeliveryPct: 100,
    csatScore: 4.99,
    credentialsSentAt: '2024-01-15T10:00:00Z',
    forcePasswordChange: false,
    notes: [
      { id: 'n-1', timestamp: '2024-01-15T10:00:00Z', authorId: 'usr-ceo-1', authorName: 'System', text: 'CEO root account with company-wide financial control.' }
    ],
    statusHistory: [],
    documents: []
  },

  // ── 2. MANAGER ──
  {
    id: 'usr-mgmt-1',
    memberId: 'DGH2500002',
    name: 'Sarah Tariq',
    email: 'sarah.ops@digihust.com',
    phone: '+92 301 7654321',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    role: 'management',
    roleTier: 'manager',
    title: 'Operations Director & Client Bridge',
    specialties: ['Client Relations', 'Scope Architecture', 'Sprint Delivery'],
    completedProjectsCount: 38,
    totalEarnings: 29400,
    rating: 4.95,
    digiskillBatch: 'Batch 10',
    status: 'active',
    joinedAt: '2025-02-01',
    joinYear: 2025,
    onTimeDeliveryPct: 98,
    csatScore: 4.92,
    credentialsSentAt: '2025-02-01T09:00:00Z',
    forcePasswordChange: false,
    notes: [],
    statusHistory: [],
    documents: []
  },

  // ── 3. GROUP LEADERS ──
  {
    id: 'usr-ldr-tech',
    memberId: 'DGH2500003',
    name: 'Zubair Ahmed',
    email: 'zubair.tech@digihust.com',
    phone: '+92 321 9876543',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    role: 'group_leader',
    roleTier: 'group_leader',
    groupId: 'tech',
    title: 'Tech Squad Lead & Architect',
    specialties: ['Full Stack Architecture', 'Node.js', 'React', 'Cloud Ops'],
    bio: 'Digiskill Batch 12 Top Graduate with 6+ years of full stack commercial engineering experience.',
    hourlyRate: 45,
    completedProjectsCount: 29,
    totalEarnings: 22800,
    rating: 4.92,
    digiskillBatch: 'Batch 12',
    status: 'active',
    joinedAt: '2025-03-10',
    joinYear: 2025,
    onTimeDeliveryPct: 99,
    csatScore: 4.95,
    credentialsSentAt: '2025-03-10T12:00:00Z',
    forcePasswordChange: false,
    notes: [],
    statusHistory: [],
    documents: []
  },
  {
    id: 'usr-ldr-creative',
    memberId: 'DGH2500004',
    name: 'Ayesha Malik',
    email: 'ayesha.design@digihust.com',
    phone: '+92 333 4567890',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    role: 'group_leader',
    roleTier: 'group_leader',
    groupId: 'creative',
    title: 'Creative Squad Lead & Art Director',
    specialties: ['Design Systems', '3D Blender', 'Figma Libraries', 'Motion Ads'],
    bio: 'Award-winning UI/UX designer and Digiskill alumni with international client portfolio.',
    hourlyRate: 40,
    completedProjectsCount: 34,
    totalEarnings: 24600,
    rating: 4.98,
    digiskillBatch: 'Batch 9',
    status: 'active',
    joinedAt: '2025-04-01',
    joinYear: 2025,
    onTimeDeliveryPct: 100,
    csatScore: 4.97,
    credentialsSentAt: '2025-04-01T12:00:00Z',
    forcePasswordChange: false,
    notes: [],
    statusHistory: [],
    documents: []
  },
  {
    id: 'usr-ldr-data',
    memberId: 'DGH2500005',
    name: 'Hamza Khan',
    email: 'hamza.ai@digihust.com',
    phone: '+92 345 6789012',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    role: 'group_leader',
    roleTier: 'group_leader',
    groupId: 'data',
    title: 'AI & Automations Squad Lead',
    specialties: ['LLM Orchestration', 'n8n Pipelines', 'Python', 'PowerBI'],
    bio: 'Specialist in custom business automation bots, web scraping, and PowerBI enterprise dashboards.',
    hourlyRate: 50,
    completedProjectsCount: 22,
    totalEarnings: 19500,
    rating: 4.89,
    digiskillBatch: 'Batch 14',
    status: 'active',
    joinedAt: '2025-06-15',
    joinYear: 2025,
    onTimeDeliveryPct: 96,
    csatScore: 4.88,
    credentialsSentAt: '2025-06-15T12:00:00Z',
    forcePasswordChange: false,
    notes: [],
    statusHistory: [],
    documents: []
  },

  // ── 4. MEMBERS (FREELANCERS & SPECIALISTS) ──
  {
    id: 'usr-dev-1',
    memberId: 'DGH2600101',
    name: 'Bilal Farooq',
    email: 'bilal.f@digihust.com',
    phone: '+92 312 3456789',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    role: 'freelancer',
    roleTier: 'member',
    groupId: 'tech',
    title: 'Senior Frontend & React Specialist',
    specialties: ['React 18', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    bio: 'Digiskill Batch 16 Gold Medalist. Focuses on high-performance interactive SPAs.',
    hourlyRate: 28,
    completedProjectsCount: 16,
    totalEarnings: 11200,
    rating: 4.94,
    digiskillBatch: 'Batch 16',
    status: 'active',
    joinedAt: '2026-01-10',
    joinYear: 2026,
    onTimeDeliveryPct: 100,
    csatScore: 4.96,
    credentialsSentAt: '2026-01-10T14:00:00Z',
    forcePasswordChange: false,
    notes: [],
    statusHistory: [],
    documents: []
  },
  {
    id: 'usr-dev-2',
    memberId: 'DGH2600102',
    name: 'Usman Ali',
    email: 'usman.backend@digihust.com',
    phone: '+92 313 4567890',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    role: 'freelancer',
    roleTier: 'member',
    groupId: 'tech',
    title: 'Backend & Cloud Security Engineer',
    specialties: ['Node.js', 'PostgreSQL', 'Docker', 'API Hardening', 'OWASP Remediation'],
    bio: 'SecOps engineer building scalable microservices and hardened database schemas.',
    hourlyRate: 32,
    completedProjectsCount: 14,
    totalEarnings: 9800,
    rating: 4.88,
    digiskillBatch: 'Batch 15',
    status: 'active',
    joinedAt: '2026-02-05',
    joinYear: 2026,
    onTimeDeliveryPct: 97,
    csatScore: 4.91,
    credentialsSentAt: '2026-02-05T15:00:00Z',
    forcePasswordChange: false,
    notes: [],
    statusHistory: [],
    documents: []
  },
  {
    id: 'usr-des-1',
    memberId: 'DGH2600103',
    name: 'Fatima Noor',
    email: 'fatima.ui@digihust.com',
    phone: '+92 314 5678901',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    role: 'freelancer',
    roleTier: 'member',
    groupId: 'creative',
    title: 'UI/UX & Product Design Specialist',
    specialties: ['Figma Prototyping', 'Design Tokens', 'User Research', 'Mobile App UI'],
    bio: 'Designs seamless user journeys and brand identity design systems for web and mobile.',
    hourlyRate: 25,
    completedProjectsCount: 19,
    totalEarnings: 12400,
    rating: 4.96,
    digiskillBatch: 'Batch 14',
    status: 'active',
    joinedAt: '2026-02-15',
    joinYear: 2026,
    onTimeDeliveryPct: 99,
    csatScore: 4.98,
    credentialsSentAt: '2026-02-15T10:00:00Z',
    forcePasswordChange: false,
    notes: [],
    statusHistory: [],
    documents: []
  },
  {
    id: 'usr-ai-1',
    memberId: 'DGH2600104',
    name: 'Ali Raza',
    email: 'ali.data@digihust.com',
    phone: '+92 315 6789012',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    role: 'freelancer',
    roleTier: 'member',
    groupId: 'data',
    title: 'AI Automation & Python Developer',
    specialties: ['OpenAI API', 'n8n Workflows', 'Python Pandas', 'Web Scraping'],
    bio: 'Constructs automated bots, AI assistants, and scheduled data extraction pipelines.',
    hourlyRate: 30,
    completedProjectsCount: 11,
    totalEarnings: 8200,
    rating: 4.85,
    digiskillBatch: 'Batch 17',
    status: 'active',
    joinedAt: '2026-03-01',
    joinYear: 2026,
    onTimeDeliveryPct: 95,
    csatScore: 4.87,
    credentialsSentAt: null, // Pending credential dispatch
    forcePasswordChange: true,
    notes: [],
    statusHistory: [],
    documents: []
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    title: 'UK Regional Estate Portal Modernization',
    clientName: 'David Sterling',
    clientCompany: 'Estates Direct UK',
    clientEmail: 'd.sterling@estatesdirect.co.uk',
    submittedByUserId: 'usr-ceo-1',
    submittedByUserName: 'Public Form Intake',
    brief: 'High-speed React portal with property filters, valuation calculator, and automated lead routing.',
    budgetEstimate: 4500,
    suggestedGroupId: 'tech',
    status: 'in_progress',
    createdAt: '2026-08-10T14:30:00Z'
  },
  {
    id: 'lead-102',
    title: 'Automotive 3D Motion Brand Assets',
    clientName: 'Markus Vogel',
    clientCompany: 'Veloce Motors DE',
    clientEmail: 'markus@velocemotors.de',
    submittedByUserId: 'usr-ceo-1',
    submittedByUserName: 'Direct Lead',
    brief: 'Complete 3D promotional assets in Blender and Figma design kit for European launch.',
    budgetEstimate: 3800,
    suggestedGroupId: 'creative',
    status: 'assigned',
    createdAt: '2026-08-18T09:15:00Z'
  },
  {
    id: 'lead-103',
    title: 'Logistics AI Customer Support Assistant',
    clientName: 'Sarah Chen',
    clientCompany: 'LogiXpress Global',
    clientEmail: 'schen@logixpress.io',
    submittedByUserId: 'usr-mgmt-1',
    submittedByUserName: 'Outbound Growth',
    brief: 'Autonomous customer tracking bot resolving shipping inquiries via WhatsApp and Web Widget.',
    budgetEstimate: 3200,
    suggestedGroupId: 'data',
    status: 'under_review',
    createdAt: '2026-08-22T16:45:00Z'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    leadId: 'lead-101',
    title: 'UK Real Estate Portal Architecture',
    clientName: 'David Sterling',
    clientEmail: 'd.sterling@estatesdirect.co.uk',
    clientCompany: 'Estates Direct UK',
    groupId: 'tech',
    assignedLeaderId: 'usr-ldr-tech',
    assignedLeaderName: 'Zubair Ahmed',
    brief: 'Modernize legacy real estate portal with full-stack Next.js, PostgreSQL schema, and fast mobile search.',
    totalValue: 4500,
    externalFee: 0,
    netRevenue: 4500,
    isLeadGenIndependent: false,
    leadGenUserPct: 0,
    splitManagementPct: 20,
    splitLeaderPct: 20,
    splitFreelancerPct: 60,
    assignments: [
      { freelancerId: 'usr-dev-1', freelancerName: 'Bilal Farooq', roleTitle: 'Frontend Lead', sharePct: 55, amountCalculated: 1485 },
      { freelancerId: 'usr-dev-2', freelancerName: 'Usman Ali', roleTitle: 'Backend & DB', sharePct: 45, amountCalculated: 1215 }
    ],
    status: 'in_progress',
    deliverables: [
      {
        id: 'del-1',
        title: 'Initial Interactive Prototype & Schema v1.0',
        fileUrl: '#',
        linkUrl: 'https://staging.estatesdirect.digihust.app',
        submittedByUserId: 'usr-dev-1',
        submittedByUserName: 'Bilal Farooq',
        submittedAt: '2026-08-20T18:00:00Z',
        status: 'approved',
        notes: 'Passed initial QA check by Zubair.'
      }
    ],
    comments: [
      {
        id: 'c-1',
        userId: 'usr-ldr-tech',
        userName: 'Zubair Ahmed',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        userRole: 'group_leader',
        text: 'Milestone 1 approved. Proceeding with database index optimizations.',
        timestamp: '2026-08-21T10:00:00Z'
      }
    ],
    createdAt: '2026-08-12T10:00:00Z'
  }
];

// ── NEW PORTAL ASSIGNMENTS (With Sanitized Briefs for Leaders/Members) ──
export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asgn-001',
    projectId: 'proj-001',
    // Full client info (CEO & Manager only)
    clientName: 'David Sterling',
    clientEmail: 'd.sterling@estatesdirect.co.uk',
    clientCompany: 'Estates Direct UK',
    totalBudget: 4500,
    // Sanitized view (Visible to Zubair, Bilal, Usman)
    assignedLeaderId: 'usr-ldr-tech',
    assignedLeaderName: 'Zubair Ahmed',
    assignedMemberIds: ['usr-dev-1', 'usr-dev-2'],
    squad: 'tech',
    status: 'in_progress',
    sanitizedBrief: {
      title: 'High-Speed UK Real Estate Web Platform',
      scope: 'Build responsive Next.js 14 web app, filterable property map, appraisal booking flow, and REST endpoints for property inventory.',
      deliverables: [
        'Interactive Figma-faithful React Frontend',
        'PostgreSQL Database Schema & Migration Scripts',
        'Staging Deployment & Technical Documentation'
      ],
      deadline: '2026-09-15',
      referenceFiles: ['Design_Tokens_v2.pdf', 'Endpoint_Specs.md']
    },
    subTasks: [
      { id: 'st-1', title: 'Implement dynamic map cluster view', assignedMemberId: 'usr-dev-1', assignedMemberName: 'Bilal Farooq', status: 'completed', dueDate: '2026-08-22' },
      { id: 'st-2', title: 'Build property valuation multi-step form', assignedMemberId: 'usr-dev-1', assignedMemberName: 'Bilal Farooq', status: 'in_progress', dueDate: '2026-08-28' },
      { id: 'st-3', title: 'PostgreSQL schema indexing & API endpoints', assignedMemberId: 'usr-dev-2', assignedMemberName: 'Usman Ali', status: 'completed', dueDate: '2026-08-24' },
      { id: 'st-4', title: 'Setup automated CI/CD staging deployment', assignedMemberId: 'usr-dev-2', assignedMemberName: 'Usman Ali', status: 'in_progress', dueDate: '2026-08-30' }
    ],
    milestones: [
      { id: 'm-1', title: 'Sprint 1: Core Architecture & Schema', targetDate: '2026-08-25', isCompleted: true },
      { id: 'm-2', title: 'Sprint 2: Property Search & Valuation Form', targetDate: '2026-09-05', isCompleted: false },
      { id: 'm-3', title: 'Sprint 3: Staging QA & Handover', targetDate: '2026-09-15', isCompleted: false }
    ],
    deliverables: [
      {
        id: 'del-1',
        title: 'Interactive Frontend Prototype v1.0',
        linkUrl: 'https://staging.estatesdirect.digihust.app',
        submittedByUserId: 'usr-dev-1',
        submittedByUserName: 'Bilal Farooq',
        submittedAt: '2026-08-20T18:00:00Z',
        status: 'approved',
        notes: 'Frontend validated on mobile & desktop.'
      }
    ],
    comments: [
      {
        id: 'c-101',
        userId: 'usr-ldr-tech',
        userName: 'Zubair Ahmed',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        userRole: 'group_leader',
        text: 'Great work on the map clustering Bilal. Usman, please ensure API latency is under 120ms.',
        timestamp: '2026-08-22T14:30:00Z'
      },
      {
        id: 'c-102',
        userId: 'usr-dev-2',
        userName: 'Usman Ali',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
        userRole: 'member',
        text: 'Added query caching on Redis; average response time is now 65ms.',
        timestamp: '2026-08-23T09:15:00Z'
      }
    ],
    createdBy: 'usr-mgmt-1',
    createdAt: '2026-08-12T10:00:00Z'
  }
];

// ── CERTIFICATES & QR VERIFICATION MOCK DATA ──
export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-exp-8f7a2c1e-9b4d', // Unguessable UUID token
    memberId: 'usr-dev-1',
    memberName: 'Bilal Farooq',
    memberDghId: 'DGH2600101',
    type: 'experience_certificate',
    roleTitle: 'Senior Frontend React Engineer',
    startDate: '2026-01-10',
    endDate: '2026-08-25',
    issuedDate: '2026-08-25',
    status: 'valid',
    clientName: 'Estates Direct UK & Veloce Motors',
    projectDetails: 'Spearheaded full-stack React / TypeScript application engineering, delivering 140% conversion gains and sub-second page performance across production deployments.',
    issuedBy: 'Haris Asad, CEO',
    qrCodeUrl: '/verify/cert-exp-8f7a2c1e-9b4d'
  },
  {
    id: 'cert-off-3e1a7d8c-5a2f',
    memberId: 'usr-dev-2',
    memberName: 'Usman Ali',
    memberDghId: 'DGH2600102',
    type: 'offer_letter',
    roleTitle: 'Backend & Cloud Security Engineer',
    startDate: '2026-02-05',
    issuedDate: '2026-02-05',
    status: 'valid',
    clientName: 'DigiHust Technology Squad',
    projectDetails: 'Selected as Core Backend Engineer responsible for REST architecture, PostgreSQL schema design, and OWASP Top 10 security compliance.',
    issuedBy: 'Haris Asad, CEO',
    qrCodeUrl: '/verify/cert-off-3e1a7d8c-5a2f'
  }
];

// ── ANNOUNCEMENTS MOCK DATA ──
export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    scope: 'global',
    title: 'DigiHust Q3 Sprint Cadence & Infrastructure Upgrade',
    body: 'All teams: We have transitioned our deployment infrastructure to multi-region edge nodes. All staging previews are now available under .digihust.app with SSL certificate verification.',
    postedBy: 'usr-ceo-1',
    postedByName: 'Haris Asad',
    postedByRole: 'ceo',
    postedAt: '2026-08-24T10:00:00Z'
  },
  {
    id: 'ann-002',
    scope: 'global',
    title: 'Verified Digital Experience Certificates Available',
    body: 'Staff and specialists with 3+ completed project milestones can now request an official QR-verified Experience Certificate directly via their portal profile.',
    postedBy: 'usr-mgmt-1',
    postedByName: 'Sarah Tariq',
    postedByRole: 'manager',
    postedAt: '2026-08-20T12:30:00Z'
  },
  {
    id: 'ann-003',
    scope: 'group',
    groupId: 'tech',
    title: 'Tech Squad: Next.js 15 Migration Standards',
    body: 'Team: When architecting new client briefs, please utilize React Server Components and Turbopack by default. Refer to Endpoint_Specs.md in the team workspace.',
    postedBy: 'usr-ldr-tech',
    postedByName: 'Zubair Ahmed',
    postedByRole: 'group_leader',
    postedAt: '2026-08-22T16:00:00Z'
  }
];

export const INITIAL_PAYOUTS: Payout[] = [
  {
    id: 'pay-001',
    projectId: 'proj-001',
    projectTitle: 'UK Real Estate Portal Architecture',
    userId: 'usr-dev-1',
    userName: 'Bilal Farooq',
    userRole: 'member',
    groupName: 'Technology & Development',
    roleDescription: 'Frontend Lead Specialist',
    amount: 1485,
    sharePct: 55,
    paidAt: '2026-08-21T18:00:00Z'
  },
  {
    id: 'pay-002',
    projectId: 'proj-001',
    projectTitle: 'UK Real Estate Portal Architecture',
    userId: 'usr-dev-2',
    userName: 'Usman Ali',
    userRole: 'member',
    groupName: 'Technology & Development',
    roleDescription: 'Backend & DB Engineer',
    amount: 1215,
    sharePct: 45,
    paidAt: '2026-08-21T18:00:00Z'
  },
  {
    id: 'pay-003',
    projectId: 'proj-001',
    projectTitle: 'UK Real Estate Portal Architecture',
    userId: 'usr-ldr-tech',
    userName: 'Zubair Ahmed',
    userRole: 'group_leader',
    groupName: 'Technology & Development',
    roleDescription: 'Tech Squad Lead Share',
    amount: 900,
    sharePct: 20,
    paidAt: '2026-08-21T18:00:00Z'
  }
];

export const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: 'app-001',
    name: 'Kashif Mehmood',
    email: 'kashif.m@gmail.com',
    phone: '+92 334 1122334',
    preferredGroupId: 'tech',
    specialties: ['React', 'Node.js', 'PostgreSQL'],
    digiskillId: 'DS-2026-8812',
    digiskillCourse: 'Full Stack Web Development',
    portfolioUrl: 'https://github.com/kashif-dev',
    experienceYears: 3,
    bio: 'Passionate full-stack developer with 3 years of commercial React & API design experience.',
    appliedAt: '2026-08-24T11:00:00Z',
    status: 'pending'
  }
];

export const INITIAL_SETTINGS: GlobalAdminSettings = {
  defaultManagementPct: 20,
  defaultLeaderPct: 20,
  defaultFreelancerPct: 60,
  defaultLeadGenPct: 15,
  payoutCurrency: 'USD ($)',
  autoApproveLeads: false
};
