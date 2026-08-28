import { 
  Group, User, Lead, Project, Payout, Applicant, GlobalAdminSettings, Assignment, 
  Certificate, Announcement, SiteContent, SecurityAuditLog 
} from '../types';
import { quickHashSync } from '../lib/crypto';

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
    name: 'Data Intelligence & AI',
    description: 'PowerBI Dashboards, ETL Pipelines, Custom LLM Bots & Intelligent Business Automations.',
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
  // ── 1. CEO / ROOT MASTER CONTROLLER ──
  {
    id: 'usr-ceo-1',
    memberId: 'DGH2400001',
    name: 'Haris Asad',
    email: 'ceo@digihust.com',
    phone: '+92 300 1234567',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    role: 'management',
    roleTier: 'ceo',
    isCeoMaster: true,
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
    passwordHash: quickHashSync('DigiHust@2026'),
    notes: [
      { id: 'n-1', timestamp: '2024-01-15T10:00:00Z', authorId: 'usr-ceo-1', authorName: 'System', text: 'CEO root master account with company-wide administrative control.' }
    ],
    statusHistory: [],
    documents: []
  },

  // ── 2. OPERATIONS MANAGER ──
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
    passwordHash: quickHashSync('DigiHust@2026'),
    notes: [],
    statusHistory: [],
    documents: []
  },

  // ── 3. GROUP LEADER (Tech Squad) ──
  {
    id: 'usr-ldr-tech',
    memberId: 'DGH2500003',
    name: 'Zubair Ahmed',
    email: 'zubair.tech@digihust.com',
    phone: '+92 302 9876543',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    role: 'group_leader',
    roleTier: 'group_leader',
    groupId: 'tech',
    title: 'Tech Squad Leader & Solutions Architect',
    specialties: ['React', 'Node.js', 'PostgreSQL', 'Architecture Design'],
    hourlyRate: 35,
    completedProjectsCount: 24,
    totalEarnings: 18600,
    rating: 4.9,
    digiskillBatch: 'Batch 08',
    status: 'active',
    joinedAt: '2025-03-10',
    joinYear: 2025,
    onTimeDeliveryPct: 96,
    csatScore: 4.88,
    credentialsSentAt: '2025-03-10T10:00:00Z',
    forcePasswordChange: false,
    passwordHash: quickHashSync('DigiHust@2026'),
    notes: [],
    statusHistory: [],
    documents: []
  },

  // ── 4. MEMBER SPECIALIST ──
  {
    id: 'usr-dev-1',
    memberId: 'DGH2600101',
    name: 'Bilal Farooq',
    email: 'bilal.farooq@digihust.com',
    phone: '+92 333 4455667',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    role: 'freelancer',
    roleTier: 'member',
    groupId: 'tech',
    title: 'Senior Frontend Developer',
    specialties: ['React', 'Tailwind CSS', 'TypeScript', 'Next.js'],
    hourlyRate: 25,
    completedProjectsCount: 16,
    totalEarnings: 8200,
    rating: 4.85,
    digiskillBatch: 'Batch 11',
    status: 'active',
    joinedAt: '2026-01-10',
    joinYear: 2026,
    onTimeDeliveryPct: 95,
    csatScore: 4.8,
    credentialsSentAt: '2026-01-10T12:00:00Z',
    forcePasswordChange: false,
    passwordHash: quickHashSync('DigiHust@2026'),
    notes: [],
    statusHistory: [],
    documents: []
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-001',
    clientName: 'David Sterling',
    clientEmail: 'david@estatesdirect.co.uk',
    clientCompany: 'Estates Direct UK',
    groupId: 'tech',
    title: 'UK Real Estate Portal Architecture',
    budget: 4500,
    brief: 'High-speed geospatial property listings portal with integrated agent CRM and sub-second filtering.',
    submittedByUserId: 'usr-dev-1',
    submittedByUserName: 'Bilal Farooq',
    status: 'assigned',
    createdAt: '2026-08-20T14:30:00Z'
  },
  {
    id: 'lead-002',
    clientName: 'Markus Vogel',
    clientEmail: 'markus@velocemotors.de',
    clientCompany: 'Veloce Motors DE',
    groupId: 'creative',
    title: 'Automotive Brand Launch & 3D Teaser Ads',
    budget: 6200,
    brief: 'High-end 3D product renders and commercial motion trailer for European EV reveal.',
    submittedByUserId: 'usr-mgmt-1',
    submittedByUserName: 'Sarah Tariq',
    status: 'in_progress',
    createdAt: '2026-08-22T09:15:00Z'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    leadId: 'lead-001',
    title: 'UK Real Estate Portal Architecture',
    clientName: 'Estates Direct UK',
    clientEmail: 'david@estatesdirect.co.uk',
    clientCompany: 'Estates Direct UK',
    groupId: 'tech',
    assignedLeaderId: 'usr-ldr-tech',
    assignedLeaderName: 'Zubair Ahmed',
    brief: 'High-speed geospatial property listings portal with integrated agent CRM and sub-second filtering.',
    totalValue: 4500,
    externalFee: 0,
    netRevenue: 4500,
    isLeadGenIndependent: false,
    leadGenUserPct: 0,
    splitManagementPct: 20,
    splitLeaderPct: 20,
    splitFreelancerPct: 60,
    assignments: [
      {
        freelancerId: 'usr-dev-1',
        freelancerName: 'Bilal Farooq',
        roleTitle: 'Lead Frontend Engineer',
        sharePct: 60
      }
    ],
    status: 'completed',
    deliverables: [
      {
        id: 'del-01',
        title: 'Next.js Frontend Architecture & Filter Engine',
        linkUrl: 'https://staging.estatesdirect.co.uk',
        submittedByUserId: 'usr-dev-1',
        submittedByUserName: 'Bilal Farooq',
        submittedAt: '2026-08-24T16:00:00Z',
        status: 'approved',
        notes: 'Includes PostgreSQL spatial queries and Tailwind components.'
      }
    ],
    comments: [],
    createdAt: '2026-08-20T15:00:00Z',
    completedAt: '2026-08-25T17:00:00Z'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asgn-001',
    projectId: 'proj-001',
    clientName: 'Estates Direct UK',
    clientEmail: 'david@estatesdirect.co.uk',
    clientCompany: 'Estates Direct UK',
    totalBudget: 4500,
    assignedLeaderId: 'usr-ldr-tech',
    assignedLeaderName: 'Zubair Ahmed',
    assignedMemberIds: ['usr-dev-1'],
    squad: 'tech',
    status: 'completed',
    sanitizedBrief: {
      title: 'UK Real Estate Portal Architecture',
      scope: 'Develop high-speed geospatial property listings portal with sub-second listings search, interactive map clustering, and agent dashboard.',
      deliverables: ['Next.js 14 App Router Front-End', 'PostgreSQL Geo-indexed DB', 'Tailwind Component Library'],
      deadline: '2026-08-25'
    },
    subTasks: [
      {
        id: 'st-01',
        title: 'Implement Mapbox geospatial search and property filters',
        assignedMemberId: 'usr-dev-1',
        assignedMemberName: 'Bilal Farooq',
        status: 'completed',
        dueDate: '2026-08-23'
      }
    ],
    milestones: [
      {
        id: 'm-01',
        title: 'Core UI & Geospatial API Complete',
        targetDate: '2026-08-23',
        isCompleted: true
      }
    ],
    deliverables: [],
    comments: [],
    createdBy: 'usr-mgmt-1',
    createdAt: '2026-08-20T15:00:00Z'
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-off-ammar-2026',
    memberId: 'usr-dev-ammar',
    memberName: 'Muhammad Ammar',
    memberDghId: 'DGH2600105',
    type: 'offer_letter',
    roleTitle: 'Full-Stack Developer',
    startDate: '2026-09-01',
    issuedDate: '2026-09-01',
    status: 'valid',
    clientName: 'DigiHust Engineering Squad Core',
    projectDetails: 'Assigned to enterprise trial projects including responsive Next.js platforms, API microservices, and database architecture.',
    issuedBy: 'Mahad Abbas, Founder & CEO',
    qrCodeUrl: '/verify/cert-off-ammar-2026',
    durationText: '45 Days (Remote)',
    stipendTerms: '65–70% of the project budget, according to DigiHust\'s revenue-sharing policy',
    evaluationCriteria: [
      'Quality of work',
      'Meeting deadlines',
      'Communication & teamwork',
      'Problem-solving',
      'Ability to follow client requirements'
    ],
    signatoryName: 'Mahad Abbas',
    signatoryTitle: 'Founder & CEO',
    contactEmail: 'contact@digihust.com',
    contactPhone: '+92 300 1234567',
    contactAddress: 'Islamabad / Global Remote Operations'
  },
  {
    id: 'cert-exp-8812a-2026',
    memberId: 'usr-dev-1',
    memberName: 'Bilal Farooq',
    memberDghId: 'DGH2600101',
    type: 'experience_certificate',
    roleTitle: 'Senior Frontend Engineer',
    startDate: '2026-01-10',
    endDate: '2026-08-25',
    issuedDate: '2026-08-25',
    status: 'valid',
    clientName: 'Estates Direct UK',
    projectDetails: 'Architected high-speed geospatial real-estate portal with Next.js 14, Tailwind CSS, and responsive PostGIS mapping.',
    issuedBy: 'Mahad Abbas, Founder & CEO',
    qrCodeUrl: '/verify/cert-exp-8812a-2026',
    durationText: '8 Months (Full Retainer)',
    signatoryName: 'Mahad Abbas',
    signatoryTitle: 'Founder & CEO',
    contactEmail: 'contact@digihust.com',
    contactPhone: '+92 300 1234567',
    contactAddress: 'Islamabad / Global Remote Operations'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    scope: 'global',
    title: 'Q3 Enterprise Delivery Milestones & Split Distribution',
    content: 'All squad leaders are requested to review stage approvals before Friday 18:00 UTC for automated batch payout releases.',
    postedBy: 'usr-ceo-1',
    postedByName: 'Haris Asad',
    postedByRole: 'ceo',
    postedAt: '2026-08-25T12:00:00Z'
  }
];

export const INITIAL_PAYOUTS: Payout[] = [
  {
    id: 'pay-001',
    projectId: 'proj-001',
    projectTitle: 'UK Real Estate Portal Architecture',
    userId: 'usr-ceo-1',
    userName: 'DigiHust Operations',
    userRole: 'management',
    groupName: 'Platform Reserve',
    roleDescription: 'Platform Management & SLA Margin',
    amount: 900,
    sharePct: 20,
    paidAt: '2026-08-25T18:00:00Z'
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
  defaultManagementSplitPct: 20,
  defaultLeaderSplitPct: 20,
  defaultFreelancerSplitPct: 60,
  defaultLeadGenPct: 15,
  autoApproveLeads: false,
  payoutHoldDays: 7,
  allowIndependentLeadGen: true,
  minFreelancersPerProject: 1,
  maxActiveProjectsPerFreelancer: 5
};

// ── FULL DEFAULT EXECUTIVE CMS (LIVE SITE CONTENT) ───────────────────────────
export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    badgeText: 'Verified Sourced Talent · Single Managed Contract',
    headlineLine1: 'Your Digital Work.',
    headlineHighlight: 'Handled by Skilled People.',
    headlineLine2: 'Delivered as One.',
    subheadline: 'One company. Coordinated specialized talent. DigiHust delivers end-to-end web engineering, brand identity, AI workflows, and cybersecurity under one managed roof.',
    ctaPrimaryText: 'Start a Project',
    ctaSecondaryText: 'Explore Squads',
    metricsBadgeValue: '+140%',
    metricsBadgeLabel: 'Average Client Conversion Boost',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  },
  valueProps: [
    {
      id: 'vp-1',
      title: 'Single Accountable Point of Contact',
      description: 'Never juggle multiple disconnected freelancers again. You get one dedicated Project Director managing our specialized squads.',
      badge: 'Accountability'
    },
    {
      id: 'vp-2',
      title: 'Top 5% Vetted DigiSkills Specialists',
      description: 'Every engineer, designer, and automation specialist on your project is skill-verified with proven real-world delivery history.',
      badge: 'Verified Talent'
    },
    {
      id: 'vp-3',
      title: 'Fixed Scopes & Transparent Splits',
      description: 'Guaranteed milestones and clear transparent pricing. Zero surprise invoices or runaway budget scope creep.',
      badge: 'Fixed Pricing'
    },
    {
      id: 'vp-4',
      title: 'Rapid Sprints & Enterprise QA',
      description: 'Production-ready deliverables checked by senior solutions architects before client demonstration.',
      badge: 'SLA Speed'
    }
  ],
  caseStudies: [
    {
      id: 'cs-1',
      slug: 'real-estate-marketplace-portal',
      category: 'Web Development',
      title: 'Real-Estate Marketplace Portal & Agent CRM',
      client: 'Estates Direct UK',
      tags: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      summary: 'High-speed geospatial property portal with sub-second listings search and integrated agent CRM.',
      impactMetric: '+140%',
      impactLabel: 'Conversion Rate Growth',
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      deliverables: ['Next.js Architecture', 'Spatial Database', 'Automated Valuation API'],
      challenge: 'The legacy portal had 6-second search latency and high lead drop-off rates across mobile browsers.',
      solution: 'We engineered an optimized geospatial index and responsive React frontend with sub-second response times.'
    },
    {
      id: 'cs-2',
      slug: 'automotive-brand-identity',
      category: 'Creative & Branding',
      title: 'Automotive Brand Identity & 3D Motion Launch',
      client: 'Veloce Motors DE',
      tags: ['Brand Identity', 'Cinema 4D', '3D Motion', 'After Effects'],
      summary: 'Comprehensive brand architecture, bespoke 3D vehicle renders, and motion teasers generating 2.4M impressions.',
      impactMetric: '2.4M',
      impactLabel: 'Global Launch Impressions',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      deliverables: ['Brand Design System', '3D Commercial Spots', 'Digital Asset Guidelines'],
      challenge: 'Entering a crowded electric vehicle market required immediate premium visual credibility.',
      solution: 'Built a sleek typography system and photorealistic 3D automotive motion assets for international rollout.'
    },
    {
      id: 'cs-3',
      slug: 'hospital-bi-dashboard',
      category: 'AI & Data',
      title: 'Executive Clinical & Revenue BI Dashboard',
      client: 'Titan Healthcare',
      tags: ['PowerBI', 'Python ETL', 'SQL Data Lake'],
      summary: 'Automated data engineering pipeline and interactive PowerBI suite unifying 35+ regional hospitals.',
      impactMetric: '12+ Hrs',
      impactLabel: 'Saved Per Week / Department',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      deliverables: ['Automated Python ETL', 'Executive PowerBI Dashboard', 'HIPAA Hardened Schemas'],
      challenge: 'Hospital executives spent hundreds of manual hours every month stitching fragmented spreadsheet reports.',
      solution: 'Constructed an automated Python data lake syncing clinical and billing data in real-time.'
    }
  ],
  testimonials: [
    {
      id: 't-1',
      quote: 'DigiHust transformed our slow, crashing property platform into the fastest portal in our regional market. Zero headache managing separate freelancers.',
      name: 'David Sterling',
      role: 'Managing Director',
      company: 'Estates Direct UK',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      rating: 5
    },
    {
      id: 't-2',
      quote: 'The 3D promotional trailers and brand system produced by DigiHust established our electric vehicle startup as an immediate serious contender in Europe.',
      name: 'Markus Vogel',
      role: 'Chief Brand Officer',
      company: 'Veloce Motors DE',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      rating: 5
    },
    {
      id: 't-3',
      quote: 'Their AI squad built an automated tracking bot that resolved 78% of our customer tickets within seconds. Our support team can finally focus on VIP accounts.',
      name: 'Sarah Chen',
      role: 'Head of Operations',
      company: 'LogiXpress Global',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      rating: 5
    }
  ],
  services: [
    {
      id: 's-web',
      groupId: 'tech',
      title: 'Web & Mobile Engineering',
      tagline: 'Custom React · Next.js · Node.js · Scalable Backend',
      description: 'Production-ready full-stack applications built with modern architectures, microservices, and extreme performance benchmarks.',
      features: ['Single Page Applications', 'Enterprise APIs', 'Database Optimization', 'Mobile App Development'],
      color: '#1F7A8C'
    },
    {
      id: 's-creative',
      groupId: 'creative',
      title: 'UI/UX & 3D Brand Systems',
      tagline: 'Design Systems · 3D Motion · Commercial Visuals',
      description: 'Distinctive brand identities, Figma component libraries, and Cinema 4D animation suites that elevate digital perception.',
      features: ['Figma Design Systems', '3D Product Rendering', 'Brand Guidelines', 'Interactive Prototypes'],
      color: '#022B3A'
    },
    {
      id: 's-data',
      groupId: 'data',
      title: 'AI Workflows & Business Intelligence',
      tagline: 'PowerBI · Python ETL · OpenAI Workflows',
      description: 'Intelligent automation pipelines, autonomous agent workflows, and executive analytics dashboards that drive operational speed.',
      features: ['Automated ETL Pipelines', 'AI Customer Bots', 'Executive Dashboards', 'n8n Workflow Automations'],
      color: '#1F7A8C'
    }
  ],
  packages: [
    {
      id: 'pkg-1',
      name: 'Sprint Starter',
      price: '$1,200',
      desc: 'Ideal for rapid MVP feature rollouts, brand visual overhauls, or focused landing page conversion sprints.',
      popular: false,
      features: ['Dedicated Specialist Engineer/Designer', '1 Dedicated Squad Lead Reviewer', '2-Week Sprint Delivery', 'Full Source Code & Figma Files', '14-Day Post-Launch SLA Warranty'],
      turnaround: '2 Weeks',
      ctaText: 'Select Starter Sprint'
    },
    {
      id: 'pkg-2',
      name: 'Growth Architecture',
      price: '$3,500',
      desc: 'Full-stack application build, comprehensive design system, or end-to-end AI automation infrastructure.',
      popular: true,
      features: ['Full Cross-Functional Squad (Dev + Design + QA)', 'Dedicated Operations Director Oversight', 'Custom Database & Cloud APIs', 'Weekly Video Sprint Demos', '30-Day Enterprise SLA Support'],
      turnaround: '4 Weeks',
      ctaText: 'Select Growth Sprint'
    },
    {
      id: 'pkg-3',
      name: 'Dedicated Squad Retainer',
      price: '$6,500/mo',
      desc: 'Ongoing fractional squad engineering, continuous product iterations, and proactive security maintenance.',
      popular: false,
      features: ['Continuous Sprint Execution', 'Priority SLA 24h Emergency Response', 'Architect-Level Code Reviews', 'Monthly Strategy Consultation', 'Flexible Resource Allocation'],
      turnaround: 'Monthly Retainer',
      ctaText: 'Hire Dedicated Squad'
    }
  ],
  teamMembers: [
    {
      id: 'tm-1',
      name: 'Haris Asad',
      role: 'Chief Executive Officer',
      squad: 'Executive Leadership',
      bio: 'Leading strategic direction, enterprise partner allocations, and financial architecture.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      tags: ['Strategy', 'Enterprise Deals', 'Executive']
    },
    {
      id: 'tm-2',
      name: 'Sarah Tariq',
      role: 'Operations & QA Lead',
      squad: 'Platform Management',
      bio: 'Overseeing client lead intake, SLA compliance, and cross-squad sprint deliverables.',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
      tags: ['Operations', 'SLA QA', 'Intake Scoping']
    },
    {
      id: 'tm-3',
      name: 'Zubair Ahmed',
      role: 'Tech Squad Leader',
      squad: 'Technology & Development',
      bio: 'Full-Stack software architect specializing in React 18, Next.js, and Node.js microservices.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      tags: ['Full Stack', 'Next.js', 'System Architecture']
    }
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'How is DigiHust different from Upwork or Fiverr?',
      answer: 'On freelance marketplaces, you have to manage disconnected freelancers yourself, risking missed deadlines and mismatched code. At DigiHust, you get a single managed contract with a dedicated Project Director who oversees vetted specialized squads with guaranteed QA deliverables.',
      category: 'General'
    },
    {
      id: 'faq-2',
      question: 'How do you vet and verify specialists?',
      answer: 'All DigiHust specialists undergo multi-stage technical assessments, code quality reviews, and proven delivery track records before being allocated to client projects.',
      category: 'Quality'
    },
    {
      id: 'faq-3',
      question: 'How do payments, milestones, and IP ownership work?',
      answer: 'You pay milestone-by-milestone based on approved deliverables. Upon project completion and final release, 100% of intellectual property, source code, and design assets belong to you.',
      category: 'Billing'
    }
  ],
  about: {
    mission: 'To unify elite specialized digital talent under a single accountable management roof, delivering world-class engineering and creative design to global clients.',
    vision: 'Becoming the world’s most trusted managed digital delivery agency, empowering skilled talent while providing clients zero-headache execution.',
    story: 'DigiHust was founded to solve a fundamental problem in digital services: managing multiple independent freelancers is chaotic, and traditional big-name agencies are slow and exorbitantly expensive. By combining verified talent with rigorous leadership oversight, we deliver top-tier speed and precision.',
    values: [
      { id: 'v-1', title: 'Single Point Accountability', desc: 'We take 100% ownership of project scope, timelines, and final quality.' },
      { id: 'v-2', title: 'Verified Mastery', desc: 'Zero guesswork. Every squad member is proven in their specific domain.' },
      { id: 'v-3', title: 'Radical Transparency', desc: 'Clear fixed scopes, live project tracking, and fair talent split economics.' },
      { id: 'v-4', title: 'Speed & Craftsmanship', desc: 'Rapid sprint cycles without cutting corners on architectural security or visual polish.' }
    ]
  },
  contact: {
    email: 'contact@digihust.com',
    phone: '+1 (800) 555-DIGI',
    address: 'DigiHust Global Digital Agency, Floor 14, Executive Heights',
    whatsapp: '+92 300 1234567',
    calendlyUrl: 'https://calendly.com/digihust/discovery',
    linkedin: 'https://linkedin.com/company/digihust',
    github: 'https://github.com/digihust',
    twitter: 'https://twitter.com/digihust'
  },
  customImages: {
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    aboutImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
  },
  certificateTemplates: [
    {
      id: 'tpl-offer',
      name: 'Internship Offer Letter',
      type: 'offer_letter',
      documentTitle: 'Internship Offer Letter',
      badgeText: 'Official Verified Offer',
      defaultDuration: '45 Days (Remote)',
      introParagraph: 'We are pleased to offer you a {{duration}} internship at DigiHust as a {{roleTitle}}. This period will serve as both a structured learning opportunity and a practical evaluation for potential inclusion in our core managed squads.',
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
    },
    {
      id: 'tpl-completion',
      name: 'Certificate of Completion',
      type: 'completion_certificate',
      documentTitle: 'Certificate of Completion',
      badgeText: 'Verified Completion',
      defaultDuration: '45 Days Internship Track',
      introParagraph: 'This is to certify that {{memberName}} (Member ID: {{memberDghId}}) has successfully completed their tenure and trial milestones as a {{roleTitle}} with DigiHust.',
      bulletPoints: [
        'Demonstrated high code quality and architectural integrity',
        'Consistent on-time sprint deliverable submissions',
        'Proactive team communication and cross-squad collaboration',
        'Successful execution of real client trial milestones'
      ],
      revenueClause: 'Having satisfied all evaluation criteria, the candidate is formally certified for milestone project eligibility under the DigiHust Delivery Network.',
      closingParagraph: 'We commend their dedication, technical mastery, and professional ethics, and wish them continuous success in their career.',
      signatoryName: 'Mahad Abbas',
      signatoryTitle: 'Founder & CEO',
      watermarkText: 'DigiHust',
      contactEmail: 'contact@digihust.com',
      contactPhone: '+92 300 1234567',
      contactAddress: 'Islamabad / Global Remote Operations',
      createdAt: '2026-08-20'
    },
    {
      id: 'tpl-experience',
      name: 'Professional Experience Certificate',
      type: 'experience_certificate',
      documentTitle: 'Experience Certificate',
      badgeText: 'Verified Experience',
      defaultDuration: '8 Months (Full Retainer)',
      introParagraph: 'This official experience letter certifies that {{memberName}} (Member ID: {{memberDghId}}) has served as a {{roleTitle}} at DigiHust from {{startDate}} to {{endDate}}.',
      bulletPoints: [
        'Full-stack system architecture and frontend engineering',
        'Client requirements scoping and agile delivery management',
        'Automated CI/CD workflows and deployment guarantees'
      ],
      closingParagraph: 'During their engagement, they exhibited exemplary professionalism, problem-solving skills, and adherence to enterprise SLA benchmarks. We recommend them with complete confidence.',
      signatoryName: 'Mahad Abbas',
      signatoryTitle: 'Founder & CEO',
      watermarkText: 'DigiHust',
      contactEmail: 'contact@digihust.com',
      contactPhone: '+92 300 1234567',
      contactAddress: 'Islamabad / Global Remote Operations',
      createdAt: '2026-08-20'
    }
  ]
};

// ── INITIAL SECURITY AUDIT LOGS ──────────────────────────────────────────────
export const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'audit-001',
    timestamp: '2026-08-25T18:30:00Z',
    actorId: 'usr-ceo-1',
    actorName: 'Haris Asad (CEO)',
    actorRole: 'ceo',
    action: 'ROLE_MODIFIED',
    targetId: 'usr-dev-1',
    targetName: 'Bilal Farooq',
    details: 'Verified specialist credential profile initialized with Member level permissions.'
  },
  {
    id: 'audit-002',
    timestamp: '2026-08-25T19:00:00Z',
    actorId: 'usr-ceo-1',
    actorName: 'Haris Asad (CEO)',
    actorRole: 'ceo',
    action: 'CMS_UPDATED',
    details: 'Updated global hero conversion metric and headline tokens.'
  }
];
