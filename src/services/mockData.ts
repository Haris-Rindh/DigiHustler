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
  // ── 1. CEO / ROOT MASTER CONTROLLER (Sole Administrator) ──
  {
    id: 'usr-ceo-1',
    memberId: 'DGH2400001',
    name: 'Mahad Abbas',
    email: 'digihust@gmail.com',
    phone: '+92 320 6806396',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    role: 'management',
    roleTier: 'ceo',
    isCeoMaster: true,
    title: 'Founder & CEO',
    specialties: ['Executive Strategy', 'Global Split Governance', 'Enterprise Accounts'],
    completedProjectsCount: 0,
    totalEarnings: 0,
    rating: 5.0,
    digiskillBatch: 'Founding Member',
    status: 'active',
    joinedAt: '2024-01-15',
    joinYear: 2024,
    onTimeDeliveryPct: 100,
    csatScore: 5.0,
    credentialsSentAt: '2024-01-15T10:00:00Z',
    forcePasswordChange: false,
    passwordHash: quickHashSync('DigiHust@2026'),
    notes: [
      { id: 'n-1', timestamp: '2024-01-15T10:00:00Z', authorId: 'usr-ceo-1', authorName: 'System', text: 'CEO root master account with company-wide administrative control.' }
    ],
    statusHistory: [],
    documents: []
  }
];

export const INITIAL_LEADS: Lead[] = [];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_ASSIGNMENTS: Assignment[] = [];

export const INITIAL_CERTIFICATES: Certificate[] = [];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-welcome',
    scope: 'global',
    title: 'Welcome to DigiHust Portal',
    body: 'Welcome to the DigiHust enterprise platform. Manage specialized squads, client intake, and verified digital delivery from this central console.',
    content: 'Welcome to the DigiHust enterprise platform. Manage specialized squads, client intake, and verified digital delivery from this central console.',
    postedBy: 'usr-ceo-1',
    postedByName: 'Mahad Abbas',
    postedByRole: 'ceo',
    postedAt: new Date().toISOString()
  }
];

export const INITIAL_PAYOUTS: Payout[] = [];

export const INITIAL_APPLICANTS: Applicant[] = [];

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
  caseStudies: [],
  testimonials: [],
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
      name: 'Mahad Abbas',
      role: 'Founder & CEO',
      squad: 'Executive Leadership',
      bio: 'Leading strategic direction, enterprise client partnerships, and company-wide delivery governance at DigiHust.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      tags: ['Strategy', 'Enterprise Deals', 'Executive']
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
    email: 'digihust@gmail.com',
    phone: '+92 320 6806396',
    address: 'Islamabad, Pakistan',
    whatsapp: '+92 320 6806396',
    calendlyUrl: 'https://calendly.com/digihust/discovery',
    linkedin: 'https://www.linkedin.com/company/digihust/',
    github: 'https://github.com/digihust',
    facebook: 'https://www.facebook.com/share/p/1EubKwa3Ce/',
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
      contactEmail: 'digihust@gmail.com',
      contactPhone: '+92 320 6806396',
      contactAddress: 'Islamabad, Pakistan',
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
      contactEmail: 'digihust@gmail.com',
      contactPhone: '+92 320 6806396',
      contactAddress: 'Islamabad, Pakistan',
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
      contactEmail: 'digihust@gmail.com',
      contactPhone: '+92 320 6806396',
      contactAddress: 'Islamabad, Pakistan',
      createdAt: '2026-08-20'
    }
  ],
  blogPosts: [
    {
      id: 'blog-1',
      slug: 'how-to-architect-nextjs-for-ai-crawlers',
      title: 'Architecting Modern Web Apps for AI Search Engines & LLM Crawlers',
      excerpt: 'Why traditional client-side SPAs fail against non-JS AI search engines (GPTBot, ClaudeBot, Perplexity), and how static pre-rendering bridges the semantic discovery gap.',
      content: `In the modern web landscape, search is rapidly transitioning from traditional keyword indexing to deep semantic synthesis powered by LLMs (Large Language Models) such as ChatGPT, Perplexity, Claude, and Gemini.

### The Challenge with Client-Side Rendering
Traditional Single Page Applications (SPAs) load an empty HTML shell and rely on client-side JavaScript execution to fetch and render content. While major search engines like Googlebot have partial JS rendering capabilities, most AI crawlers (like GPTBot, ClaudeBot, and CCBot) bypass heavy JS execution entirely to conserve compute.

### The DigiHust Pre-rendering Solution
By implementing static HTML generation and pre-rendering at build time, every technical insight, case study, and public showcase is instantly readable by all bots with 100% semantic clarity, boosting organic discoverability and citation authority.`,
      category: 'Engineering',
      readTime: '6 min read',
      publishedAt: '2026-08-24',
      author: 'Haris Asad',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      tags: ['Architecture', 'SEO', 'AI Crawlers']
    },
    {
      id: 'blog-2',
      slug: 'demystifying-ai-automations-n8n-vs-custom-python',
      title: 'Automating Business Workflows: n8n vs. Custom Python LLM Microservices',
      excerpt: 'A pragmatic framework for deciding when to use visual workflow tools versus specialized Python function-calling pipelines for enterprise operations.',
      content: `Enterprise operations are racing to incorporate intelligent automations into their CRM, support, and lead nurturing pipelines. But technical decision-makers face a recurring dilemma: Should we build with visual orchestration tools like n8n/Make, or develop tailored Python microservices?

### When to Choose n8n
- **Rapid Prototyping**: Connect standard SaaS APIs (HubSpot, Slack, PostgreSQL) in hours.
- **Low-Code Maintenance**: Transparent node workflows that non-engineers can visually inspect.

### When to Choose Custom Python LLM Services
- **Complex RAG & Vector Embeddings**: Dynamic chunking, hybrid search, and multi-step reasoning agents.
- **Strict Latency & Token Budget Constraints**: Granular token optimization and custom schema validation.`,
      category: 'AI & Automations',
      readTime: '8 min read',
      publishedAt: '2026-08-18',
      author: 'AI Engineering Lead',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      tags: ['n8n', 'Python', 'Automation']
    },
    {
      id: 'blog-3',
      slug: 'owasp-top-10-web-security-checklist-for-startups',
      title: 'The Essential OWASP Web Application Security & Hardening Checklist',
      excerpt: 'Protecting your digital infrastructure against injection, broken access controls, and data exposure before production deployment.',
      content: `Security is not an afterthought—it must be architected from day zero. Startups moving fast often overlook basic security hygiene, leaving their infrastructure vulnerable to credential stuffing, broken object-level authorization, and unprotected secrets.

### Core Hardening Pillars
1. **Zero-Trust Access Control**: Enforce strict server-side authorization checks on every state mutation.
2. **Environment Variable Sanitization**: Never commit raw API keys or database connection strings to client bundles.
3. **Automated Audit Logging**: Log high-privilege actions (password resets, role elevations, ledger payouts) with immutable timestamps and actor IDs.`,
      category: 'Cybersecurity',
      readTime: '7 min read',
      publishedAt: '2026-08-10',
      author: 'Cybersecurity Lead',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      tags: ['Security', 'OWASP', 'Compliance']
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
