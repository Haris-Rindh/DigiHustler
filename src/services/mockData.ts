import { Group, User, Lead, Project, Payout, Applicant, GlobalAdminSettings } from '../types';

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
  // Founding Management
  {
    id: 'usr-mgmt-1',
    name: 'Haris Asad',
    email: 'management@digihust.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    role: 'management',
    title: 'Managing Director & Founder',
    specialties: ['Ecosystem Management', 'Business Strategy', 'Financial Allocations'],
    completedProjectsCount: 48,
    totalEarnings: 38400,
    rating: 5.0,
    digiskillBatch: 'Founding Member',
    status: 'active'
  },
  
  // Group Leaders
  {
    id: 'usr-ldr-tech',
    name: 'Zubair Ahmed',
    email: 'zubair.tech@digihust.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    role: 'group_leader',
    groupId: 'tech',
    title: 'Lead Architect & Tech Dept Head',
    specialties: ['Full Stack Architecture', 'Node.js', 'React', 'DevOps'],
    bio: 'Digiskill Batch 12 Top Graduate with 6+ years of full stack commercial engineering experience.',
    hourlyRate: 45,
    completedProjectsCount: 29,
    totalEarnings: 18200,
    rating: 4.9,
    digiskillBatch: 'DS-Batch 12',
    status: 'active'
  },
  {
    id: 'usr-ldr-creative',
    name: 'Ayesha Khan',
    email: 'ayesha.design@digihust.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    role: 'group_leader',
    groupId: 'creative',
    title: 'Creative Director & UI Specialist',
    specialties: ['UI/UX Design', 'Design Systems', 'Motion Graphics'],
    bio: 'Passionate UI/UX lead transforming complex briefs into stunning pixel-perfect interfaces.',
    hourlyRate: 40,
    completedProjectsCount: 34,
    totalEarnings: 21500,
    rating: 5.0,
    digiskillBatch: 'DS-Batch 10',
    status: 'active'
  },
  {
    id: 'usr-ldr-data',
    name: 'Dr. Hamza Ali',
    email: 'hamza.ai@digihust.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    role: 'group_leader',
    groupId: 'data',
    title: 'Head of AI & Data Science',
    specialties: ['Machine Learning', 'Python', 'PowerBI', 'Data Pipelines'],
    bio: 'Specialist in custom LLM deployments and automated business intelligence dashboards.',
    hourlyRate: 50,
    completedProjectsCount: 19,
    totalEarnings: 16800,
    rating: 4.9,
    digiskillBatch: 'DS-Batch 11',
    status: 'available'
  },
  {
    id: 'usr-ldr-growth',
    name: 'Bilal Farooq',
    email: 'bilal.growth@digihust.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    role: 'group_leader',
    groupId: 'growth',
    title: 'Growth & Client Acquisition Lead',
    specialties: ['High-Ticket Sales', 'B2B Cold Outreach', 'Lead Sourcing'],
    bio: 'Generated over $120k+ in outbound client pipelines through automated multichannel outreach.',
    hourlyRate: 35,
    completedProjectsCount: 42,
    totalEarnings: 24300,
    rating: 4.8,
    digiskillBatch: 'DS-Batch 09',
    status: 'active'
  },

  // Freelancers
  {
    id: 'usr-fl-tech-1',
    name: 'Usman Tariq',
    email: 'usman.dev@digihust.com',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    role: 'freelancer',
    groupId: 'tech',
    title: 'Frontend React & Tailwind Developer',
    specialties: ['React.js', 'TypeScript', 'Tailwind CSS', 'Vite'],
    bio: 'Digiskill Web Dev certified with hands-on expertise building responsive web apps.',
    hourlyRate: 25,
    completedProjectsCount: 15,
    totalEarnings: 7400,
    rating: 4.85,
    digiskillBatch: 'DS-Batch 14',
    status: 'available'
  },
  {
    id: 'usr-fl-tech-2',
    name: 'Sana Malik',
    email: 'sana.backend@digihust.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    role: 'freelancer',
    groupId: 'tech',
    title: 'Backend Node.js & Database Engineer',
    specialties: ['Node.js', 'PostgreSQL', 'Supabase', 'REST APIs'],
    bio: 'Dedicated backend developer focused on scalable APIs, authentication and DB performance.',
    hourlyRate: 30,
    completedProjectsCount: 12,
    totalEarnings: 6900,
    rating: 4.9,
    digiskillBatch: 'DS-Batch 15',
    status: 'busy'
  },
  {
    id: 'usr-fl-creative-1',
    name: 'Fahad Rehman',
    email: 'fahad.video@digihust.com',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    role: 'freelancer',
    groupId: 'creative',
    title: 'Senior Motion Graphic & Video Editor',
    specialties: ['Premiere Pro', 'After Effects', 'Color Grading', 'Reels/Shorts'],
    bio: 'Creating viral marketing videos and high-converting visual assets for client campaigns.',
    hourlyRate: 28,
    completedProjectsCount: 22,
    totalEarnings: 9800,
    rating: 4.95,
    digiskillBatch: 'DS-Batch 13',
    status: 'available'
  },
  {
    id: 'usr-fl-growth-1',
    name: 'Taimoor Shah',
    email: 'taimoor.leadgen@digihust.com',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    role: 'freelancer',
    groupId: 'growth',
    title: 'Lead Generation Specialist (Hunter)',
    specialties: ['LinkedIn Sales Navigator', 'Cold Emailing', 'Apollo.io', 'Client Prospecting'],
    bio: 'Digiskill Lead Generation specialist responsible for closing high-ticket US/UK client leads.',
    hourlyRate: 20,
    completedProjectsCount: 31,
    totalEarnings: 11200,
    rating: 4.88,
    digiskillBatch: 'DS-Batch 14',
    status: 'available'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    title: 'SaaS Platform Redesign & React Portal',
    clientName: 'Apex Financial Technologies LLC',
    clientCompany: 'Apex FinTech US',
    clientEmail: 'contact@apexfintech.io',
    submittedByUserId: 'usr-fl-growth-1',
    submittedByUserName: 'Taimoor Shah (Lead Generator)',
    brief: 'Client needs a complete modernization of their financial dashboard built in React, styled with Tailwind, and wired to REST APIs.',
    budgetEstimate: 3500,
    suggestedGroupId: 'tech',
    status: 'new_lead',
    createdAt: '2026-08-20T14:30:00Z'
  },
  {
    id: 'lead-102',
    title: 'Brand Identity & Mobile App UX Suite',
    clientName: 'Nexus E-Commerce',
    clientCompany: 'Nexus Global',
    clientEmail: 'marketing@nexusglobal.store',
    submittedByUserId: 'usr-ldr-growth',
    submittedByUserName: 'Bilal Farooq (Growth Leader)',
    brief: 'Full branding design system, Figma UI/UX prototypes for iOS app, and video marketing promo teasers.',
    budgetEstimate: 2400,
    suggestedGroupId: 'creative',
    status: 'under_review',
    createdAt: '2026-08-21T09:15:00Z'
  },
  {
    id: 'lead-103',
    title: 'Automated AI Customer Service Bot',
    clientName: 'LogiXpress Logistics',
    clientEmail: 'ops@logixpress.com',
    submittedByUserId: 'usr-fl-growth-1',
    submittedByUserName: 'Taimoor Shah (Lead Generator)',
    brief: 'Custom OpenAI/Python automation bot to parse tracking emails, answer WhatsApp inquiries, and update database records.',
    budgetEstimate: 1800,
    suggestedGroupId: 'data',
    status: 'new_lead',
    createdAt: '2026-08-22T11:00:00Z'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-501',
    leadId: 'lead-099',
    title: 'Real-Estate Marketplace Web App',
    clientName: 'Estates Direct UK',
    clientEmail: 'projects@estatesdirect.uk',
    groupId: 'tech',
    assignedLeaderId: 'usr-ldr-tech',
    assignedLeaderName: 'Zubair Ahmed',
    brief: 'Full-stack property listing portal with interactive map filtering, user accounts, and agent dashboards.',
    totalValue: 2800,
    externalFee: 50,
    netRevenue: 2750,
    isLeadGenIndependent: true,
    leadGenUserPct: 15,
    splitManagementPct: 20,
    splitLeaderPct: 10,
    splitFreelancerPct: 55,
    assignments: [
      {
        freelancerId: 'usr-fl-tech-1',
        freelancerName: 'Usman Tariq',
        roleTitle: 'Lead Frontend Developer',
        sharePct: 60
      },
      {
        freelancerId: 'usr-fl-tech-2',
        freelancerName: 'Sana Malik',
        roleTitle: 'Backend API Developer',
        sharePct: 40
      }
    ],
    status: 'in_progress',
    deliverables: [
      {
        id: 'del-1',
        title: 'Figma Component Library & API Spec',
        linkUrl: 'https://figma.com/file/sample-estate-spec',
        submittedByUserId: 'usr-fl-tech-1',
        submittedByUserName: 'Usman Tariq',
        submittedAt: '2026-08-18T16:00:00Z',
        status: 'approved',
        notes: 'Client reviewed and approved initial UI layouts.'
      }
    ],
    comments: [
      {
        id: 'c-1',
        userId: 'usr-ldr-tech',
        userName: 'Zubair Ahmed',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        userRole: 'group_leader',
        text: 'Usman and Sana, please ensure the map filtering component is optimized for mobile views.',
        timestamp: '2026-08-19T10:15:00Z'
      },
      {
        id: 'c-2',
        userId: 'usr-fl-tech-1',
        userName: 'Usman Tariq',
        userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
        userRole: 'freelancer',
        text: 'Understood! I will use Leaflet JS with touch gesture support.',
        timestamp: '2026-08-19T11:00:00Z'
      }
    ],
    createdAt: '2026-08-15T08:00:00Z'
  },
  {
    id: 'proj-502',
    leadId: 'lead-098',
    title: 'Corporate Rebranding & Motion Ads',
    clientName: 'Veloce Motors',
    clientEmail: 'brand@velocemotors.de',
    groupId: 'creative',
    assignedLeaderId: 'usr-ldr-creative',
    assignedLeaderName: 'Ayesha Khan',
    brief: 'High-end vector logo design, brand guidelines PDF, and 3x 30s 3D motion graphic ad teasers.',
    totalValue: 2000,
    externalFee: 0,
    netRevenue: 2000,
    isLeadGenIndependent: false,
    leadGenUserPct: 0,
    splitManagementPct: 22.5,
    splitLeaderPct: 7.5,
    splitFreelancerPct: 70,
    assignments: [
      {
        freelancerId: 'usr-fl-creative-1',
        freelancerName: 'Fahad Rehman',
        roleTitle: 'Motion Graphic Specialist',
        sharePct: 100
      }
    ],
    status: 'completed',
    deliverables: [
      {
        id: 'del-2',
        title: 'Final Brand Guidelines & 4K Render Package',
        linkUrl: 'https://drive.google.com/sample-brand-pkg',
        submittedByUserId: 'usr-fl-creative-1',
        submittedByUserName: 'Fahad Rehman',
        submittedAt: '2026-08-21T18:00:00Z',
        status: 'approved',
        notes: 'Client sign-off achieved. Ready for final payout disbursement.'
      }
    ],
    comments: [],
    createdAt: '2026-08-10T12:00:00Z',
    completedAt: '2026-08-21T18:00:00Z'
  },
  {
    id: 'proj-503',
    leadId: 'lead-095',
    title: 'Executive Sales BI & PowerBI Integration',
    clientName: 'Titan Healthcare Systems',
    clientEmail: 'tech@titanhealth.com',
    groupId: 'data',
    assignedLeaderId: 'usr-ldr-data',
    assignedLeaderName: 'Dr. Hamza Ali',
    brief: 'Integration of hospital SQL databases into unified PowerBI executive dashboard with automated email reports.',
    totalValue: 3200,
    externalFee: 50,
    netRevenue: 3150,
    isLeadGenIndependent: true,
    leadGenUserPct: 15,
    splitManagementPct: 20,
    splitLeaderPct: 10,
    splitFreelancerPct: 55,
    assignments: [
      {
        freelancerId: 'usr-ldr-data',
        freelancerName: 'Dr. Hamza Ali',
        roleTitle: 'Lead BI Architect',
        sharePct: 100
      }
    ],
    status: 'paid',
    deliverables: [],
    comments: [],
    createdAt: '2026-08-01T09:00:00Z',
    completedAt: '2026-08-12T14:00:00Z',
    paidAt: '2026-08-13T10:00:00Z'
  }
];

export const INITIAL_PAYOUTS: Payout[] = [
  {
    id: 'pay-1001',
    projectId: 'proj-503',
    projectTitle: 'Executive Sales BI & PowerBI Integration',
    userId: 'usr-fl-growth-1',
    userName: 'Taimoor Shah',
    userRole: 'freelancer',
    groupName: 'Growth & Client Acquisition',
    roleDescription: 'Lead Generator Cut (15%)',
    amount: 472.50,
    sharePct: 15,
    paidAt: '2026-08-13T10:00:00Z'
  },
  {
    id: 'pay-1002',
    projectId: 'proj-503',
    projectTitle: 'Executive Sales BI & PowerBI Integration',
    userId: 'usr-mgmt-1',
    userName: 'Haris Asad',
    userRole: 'management',
    groupName: 'Founding Management',
    roleDescription: 'Management Cut (20%)',
    amount: 630.00,
    sharePct: 20,
    paidAt: '2026-08-13T10:00:00Z'
  },
  {
    id: 'pay-1003',
    projectId: 'proj-503',
    projectTitle: 'Executive Sales BI & PowerBI Integration',
    userId: 'usr-ldr-data',
    userName: 'Dr. Hamza Ali',
    userRole: 'group_leader',
    groupName: 'Data, AI & Automation',
    roleDescription: 'Group Leader Cut (10%)',
    amount: 315.00,
    sharePct: 10,
    paidAt: '2026-08-13T10:00:00Z'
  },
  {
    id: 'pay-1004',
    projectId: 'proj-503',
    projectTitle: 'Executive Sales BI & PowerBI Integration',
    userId: 'usr-ldr-data',
    userName: 'Dr. Hamza Ali',
    userRole: 'freelancer',
    groupName: 'Data, AI & Automation',
    roleDescription: 'Lead BI Execution Share (55%)',
    amount: 1732.50,
    sharePct: 55,
    paidAt: '2026-08-13T10:00:00Z'
  }
];

export const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: 'app-301',
    name: 'Shahzaib Munir',
    email: 'shahzaib.m@gmail.com',
    phone: '+92 300 1234567',
    preferredGroupId: 'tech',
    specialties: ['React Native', 'Flutter', 'Firebase'],
    digiskillId: 'DS-B16-98421',
    digiskillCourse: 'Mobile App Development',
    portfolioUrl: 'https://github.com/sample-shahzaib',
    experienceYears: 3,
    bio: 'Passionate mobile developer with 4 published Play Store apps looking to take on DigiHust client projects.',
    appliedAt: '2026-08-21T15:20:00Z',
    status: 'pending'
  },
  {
    id: 'app-302',
    name: 'Fatima Zohra',
    email: 'fatima.design@yahoo.com',
    phone: '+92 321 7654321',
    preferredGroupId: 'creative',
    specialties: ['Figma', 'UI Design', 'Illustration'],
    digiskillId: 'DS-B15-11204',
    digiskillCourse: 'Graphic Design & UI',
    portfolioUrl: 'https://behance.net/sample-fatima',
    experienceYears: 2,
    bio: 'Certified Digiskill designer with expertise creating modern design systems and landing page layouts.',
    appliedAt: '2026-08-22T08:10:00Z',
    status: 'pending'
  }
];

export const INITIAL_SETTINGS: GlobalAdminSettings = {
  defaultManagementPct: 22.5,
  defaultLeaderPct: 7.5,
  defaultFreelancerPct: 70,
  defaultLeadGenPct: 15,
  payoutCurrency: 'USD ($)',
  autoApproveLeads: false
};
