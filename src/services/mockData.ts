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
  {
    "id": "usr-1788088620952",
    "memberId": "DGH2600156",
    "name": "Abdul Raffy",
    "email": "abdulraffy0428@gmail.com",
    "phone": "+923457252529",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788088620952.png?t=1788241575800",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "data",
    "title": "Artificial Intelligence Engineer",
    "bio": "Hi, Raffy here I am currently a 4th year student of Ai, and pursuing my journey in Ai Engineering and web development.",
    "specialties": [
      "Artificial Intelligence"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-30T11:17:01.779316+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788119130873",
    "memberId": "DGH2600166",
    "name": "Waliha Idrees",
    "email": "walihaidrees0987@gmail.com",
    "phone": "+923176497197",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788119130873.png?t=1788253088287",
    "role": "freelancer",
    "roleTier": "freelancer",
    "isCeoMaster": false,
    "groupId": "creative",
    "title": "Graphic Designer",
    "bio": "I am Waliha, a creative Graphic Designer with 4 years of experience delivering modern and eye-catching designs. I focus on building strong visual identities through logos, branding, social media graphics, and marketing materials",
    "specialties": [
      "Graphic Design",
      "Video Editing"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-30T19:45:31.376996+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788091129048",
    "memberId": "DGH2600164",
    "name": "Fiza Shoaib",
    "email": "fiza.ai.official@gmail.com",
    "phone": "+923207733112",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788091129048.jpg?t=1788202106880",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "data",
    "title": "UI/UX Designer & AI Engineer",
    "bio": "AI & Machine Learning Engineer | AI Chatbot & Agent Developer | UI/UX Designer | Building intelligent, scalable & user-focused digital solutions.",
    "specialties": [
      "UI/UX Design",
      "Artificiail Intelligence"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-30T11:58:49.434634+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788019490206",
    "memberId": "DGH2600148",
    "name": "Muhammad Haseeb",
    "email": "digihust.muhammadhaseeb.official@gmail.com",
    "phone": "+923029504131",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788019490206.jpeg?t=1788310223059",
    "role": "management",
    "roleTier": "manager",
    "isCeoMaster": false,
    "groupId": "growth",
    "title": "Co-founder",
    "bio": "I help businesses and busy professionals optimize workflows through data-driven Virtual Assistance, B2B Lead Generation, and targeted Web Research. Skilled in Python and Generative AI, I automate repetitive tasks, manage operations, and deliver precise results—helping you scale faster with less effort.",
    "specialties": [
      "Lead Generation",
      "Management",
      "Cyber Security",
      "AI and Automation"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Founding Member",
    "status": "active",
    "joinedAt": "2026-08-29T16:04:47.665541+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788086854546",
    "memberId": "DGH2600150",
    "name": "Muhammad Ammar",
    "email": "ammarmaan64@gmail.com",
    "phone": "+923325400771",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788086854546.jpg?t=1788285469759",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "tech",
    "title": "Full-Stack Developer",
    "bio": "Full-stack developer turning complex business problems into intuitive, high-performance web applications. Expert in React, Node.js, and cloud deployment.",
    "specialties": [
      "Web Dev"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-30T10:47:45.126+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788091246859",
    "memberId": "DGH2600165",
    "name": "Aniqah Rasheed Daniah",
    "email": "digiskillsaniqah@gmail.com",
    "phone": "+923370349221",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788091246859.jpg?t=1788256800623",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "data",
    "title": "AI  & App developer",
    "bio": "Building foundational skills in AI and cross-platform mobile app development. Currently learning how to build intelligent systems using Python—covering core concepts like data analysis, machine learning algorithms, neural networks, and data visualization. Alongside AI, also learning mobile development with Flutter and Dart to create responsive Android and iOS applications with state management, API integration, and Firebase backend services. Eager to apply my growing skills to write clean code and develop practical, real-world solutions.",
    "specialties": [
      "Artificial Intelligence",
      "Data Analysis",
      "Python"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-30T12:00:47.523757+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-ceo-1",
    "memberId": "CEOOFDGH01",
    "name": "Mahad Abbas",
    "email": "digihust@gmail.com",
    "phone": "+92 320 6806396",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-ceo-1.png?t=1788198288702",
    "role": "management",
    "roleTier": "ceo",
    "isCeoMaster": true,
    "groupId": "tech",
    "title": "Founder & CEO",
    "bio": "",
    "specialties": [
      "Executive Strategy",
      "Global Delivery Governance",
      "Enterprise Accounts"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Founding Member",
    "status": "active",
    "joinedAt": "2026-08-28T19:53:05.198542+00:00",
    "joinYear": 2024,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788087453096",
    "memberId": "DGH2600152",
    "name": "Zain Ullah",
    "email": "admindigiskillszainullah@gmail.com",
    "phone": "+923191021850",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788087453096.jpg?t=1788255099563",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "tech",
    "title": "WordPress Developer + App Developer",
    "bio": "As an App and WordPress developer I am passionate about building modern, user-friendly mobile apps and responsive websites.\nSkilled in Flutter, UI/UX, and WordPress, with a focus on clean design, smooth performance, and practical digital solutions.",
    "specialties": [
      "Wordpress",
      "Flutter"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-30T10:57:33.719618+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788257187073",
    "memberId": "DGH2600170",
    "name": "Muhammad Waleed Tahir",
    "email": "waleedrao06@gmail.com",
    "phone": "+923066769711",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788257187073.jfif?t=1788285595341",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "data",
    "title": "AI Engineer",
    "bio": "AI & Machine Learning Engineer | PyTorch, TensorFlow & LLMs\n\n",
    "specialties": [
      "Artificial Intelligence",
      "Python Programming"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-09-01T10:06:26.680514+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788090818390",
    "memberId": "DGH2600161",
    "name": "Faiza Hanif ",
    "email": "faizaraj1711@gmail.com",
    "phone": "+923112464003",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788090818390.png?t=1788257103432",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "tech",
    "title": "Wordpress Developer & Lead Generators",
    "bio": "WordPress Developer & Lead Generation Intern\n\nIT student with an interest in WordPress development and web technologies. Currently gaining practical experience in building and improving WordPress websites, while developing skills in lead generation and client outreach. Eager to learn, contribute to projects, and grow professionally in the tech industry.",
    "specialties": [
      "Wordpress",
      "Lead Generation"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-30T11:53:39.795935+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788088690236",
    "memberId": "DGH2600157",
    "name": "Ambreen",
    "email": "sweetyspecialstone143@gmail.com",
    "phone": "+923360560211",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788088690236.png?t=1788220768882",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "creative",
    "title": "Graphic Designer & Video Editor",
    "bio": "I’m Ambreen, a passionate Graphic Designer and Video Editor with a strong interest in creative design, visual storytelling, and digital content creation. I specialize in creating engaging social media designs, branding materials, logos, promotional graphics, and short-form videos.",
    "specialties": [
      "Graphic Design",
      "Video Editing"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-30T11:18:10.680588+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788087922584",
    "memberId": "DGH2600153",
    "name": "Misbah Ishaq",
    "email": "digiskills.misbafazal@gmail.com",
    "phone": "+923305233786",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788087922584.jpg?t=1788267941217",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "creative",
    "title": "Designer, Video Editor & Digital Marketer",
    "bio": "Creative and skilled Designer, Video Editor, and Digital Marketer with experience in creating engaging visual content, editing professional videos, designing graphics, and promoting brands through digital marketing. Passionate about delivering high-quality, creative, and effective digital solutions.",
    "specialties": [
      "Graphic Design",
      "Video Editing",
      "Digital Marketing"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-30T11:05:23.390082+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788194826439",
    "memberId": "DGH2600168",
    "name": "Muhammad Owais",
    "email": "raoowais559@gmail.com",
    "phone": "+923136399244",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788194826439.jpg?t=1788201933603",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "tech",
    "title": "Wordpress & Web Developer",
    "bio": "Specialist in WordPress and Web Development",
    "specialties": [
      "App Development",
      "Full-stack Development",
      "Wordpress",
      "Programming"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-31T16:47:06.945137+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788194896419",
    "memberId": "DGH2600169",
    "name": "Talha Abbas",
    "email": "talhaabaass@gmail.com",
    "phone": "+923284334815",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788194896419.jpg?t=1788262879098",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "tech",
    "title": "Full Stack Web & Mobile Appliction Developer",
    "bio": "I am a creative and motivated Full Stack Web Developer with a passion for building modern, scalable, and high-performance web applications. I specialize in Laravel, PHP, Vue.js, JavaScript, MySQL, REST APIs, WordPress, Shopify, and SaaS development. I enjoy creating clean, user-friendly, and secure digital solutions while continuously improving my skills and exploring new web technologies. I am passionate about turning ideas into reliable websites, eCommerce platforms, and custom web applications that deliver real business value.",
    "specialties": [
      "Front-end Development"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-31T16:48:16.663834+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788257654124",
    "memberId": "DGH2600171",
    "name": "Fiza Yousaf",
    "email": "fizayousaf801@gmail.com",
    "phone": "+923208701783",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788257654124.png?t=1788259484650",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "creative",
    "title": "Graphic Designer & Video Editor",
    "bio": "Graphic Designer | Branding & Visual Identity\nI create clean, creative & purposeful designs that help brands stand out.\n🎨 Logos • Social Media • Posters • Brand Identity\n💡 Turning ideas into impactful visuals\n📩 Open to creative collaborations",
    "specialties": [
      "Graphic Design",
      "Video Editing",
      "UI/UX Design"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-09-01T10:14:16.884246+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788088212299",
    "memberId": "DGH2600155",
    "name": "Muhammad Haris ",
    "email": "2025csf005@multanust.edu.pk",
    "phone": "+923452054911",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788088212299.jpg?t=1788202594543",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "tech",
    "title": "Front-end  Developer",
    "bio": "Specialist in Frontend Development.",
    "specialties": [
      "Front-end Development"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-30T11:10:12.787008+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788087043508",
    "memberId": "DGH2600151",
    "name": "Rimsha Ishaq",
    "email": "irimsha77@gmail.com",
    "phone": "+923254710020",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788087043508.jpg?t=1788268718617",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "tech",
    "title": "Web Developer",
    "bio": "",
    "specialties": [
      "Web Development"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-30T10:50:44.35571+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788091047185",
    "memberId": "DGH2600163",
    "name": "Faiza Aslam ",
    "email": "aslamfaiza768@gmail.com",
    "phone": "+923017708946",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788091047185.webp?t=1788265531505",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "tech",
    "title": "Wordpress Developer",
    "bio": "WordPress Developer | Elementor & Custom Themes\n\nI build fast, responsive, and SEO-friendly WordPress websites. Experienced in custom themes, Elementor, WooCommerce, and plugin customization. Focused on clean design and results that convert.\n\n",
    "specialties": [
      "Wordpress"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-30T11:57:27.585315+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1788088747320",
    "memberId": "DGH2600158",
    "name": "Absaar Farooq",
    "email": "smartabsar768@gmail.com",
    "phone": "+923126588514",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788088747320.jpg?t=1788205325040",
    "role": "intern",
    "roleTier": "intern",
    "isCeoMaster": false,
    "groupId": "tech",
    "title": "Front-end Developer",
    "bio": "Front-End Developer skilled in HTML, CSS, JavaScript, and responsive web development, focused on building clean, user-friendly, and modern web interfaces.",
    "specialties": [
      "Front-end Development"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-30T11:19:07.816046+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
  },
  {
    "id": "usr-1787949460689",
    "memberId": "DGH2600149",
    "name": "Muhammad Haris Asad Khan",
    "email": "haris.rindh.pk@gmail.com",
    "phone": "+92 303 7368528",
    "avatarUrl": "https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1787949460689.jpg?t=1788194526158",
    "role": "freelancer",
    "roleTier": "member",
    "isCeoMaster": false,
    "groupId": "tech",
    "title": "Full-Stack Developer",
    "bio": "Full-Stack Engineer passionate about building complete, resilient digital products from the ground up. Combining sleek, accessible client-side interfaces with reliable, distributed backend systems and REST/GraphQL APIs, I turn complex business requirements into fast, scalable applications. Whether tuning SQL queries, managing cloud deployments, or polishing pixel-perfect UIs, I focus on system reliability, clean code, and measurable performance.",
    "specialties": [
      "Digital Services"
    ],
    "completedProjectsCount": 0,
    "totalEarnings": 0,
    "rating": 5,
    "digiskillBatch": "Batch 05 Graduate",
    "status": "active",
    "joinedAt": "2026-08-28T20:38:02.870149+00:00",
    "joinYear": 2026,
    "onTimeDeliveryPct": 100,
    "csatScore": 5,
    "forcePasswordChange": false,
    "notes": [],
    "statusHistory": [],
    "documents": []
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
      title: 'Top 5% Vetted Trained & Tested by DigiHust Specialists',
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
      slug: 'web-mobile-engineering',
      order: 1,
      groupId: 'tech',
      title: 'Web & Mobile Engineering',
      tagline: 'Custom React · Next.js · Node.js · Scalable Backend',
      description: 'Production-ready full-stack applications built with modern architectures, microservices, and extreme performance benchmarks.',
      shortDescription: 'Production-ready full-stack applications built with modern architectures, microservices, and extreme performance benchmarks.',
      features: ['Single Page Applications', 'Enterprise APIs', 'Database Optimization', 'Mobile App Development'],
      color: '#1F7A8C',
      icon: 'terminal',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      size: 'large',
      patternVariant: 'dotted-grid',
      linkTarget: '/contact?service=web-engineering'
    },
    {
      id: 's-creative',
      slug: 'ui-ux-brand-systems',
      order: 2,
      groupId: 'creative',
      title: 'UI/UX & 3D Brand Systems',
      tagline: 'Design Systems · 3D Motion · Commercial Visuals',
      description: 'Distinctive brand identities, Figma component libraries, and Cinema 4D animation suites that elevate digital perception.',
      shortDescription: 'Distinctive brand identities, Figma component libraries, and Cinema 4D animation suites that elevate digital perception.',
      features: ['Figma Design Systems', '3D Product Rendering', 'Brand Guidelines', 'Interactive Prototypes'],
      color: '#022B3A',
      icon: 'layers',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      size: 'medium',
      patternVariant: 'concentric-rings',
      linkTarget: '/contact?service=creative-design'
    },
    {
      id: 's-data',
      slug: 'ai-workflows-bi',
      order: 3,
      groupId: 'data',
      title: 'AI Workflows & Business Intelligence',
      tagline: 'PowerBI · Python ETL · OpenAI Workflows',
      description: 'Intelligent automation pipelines, autonomous agent workflows, and executive analytics dashboards that drive operational speed.',
      shortDescription: 'Intelligent automation pipelines, autonomous agent workflows, and executive analytics dashboards that drive operational speed.',
      features: ['Automated ETL Pipelines', 'AI Customer Bots', 'Executive Dashboards', 'n8n Workflow Automations'],
      color: '#1F7A8C',
      icon: 'sparkles',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
      size: 'small',
      patternVariant: 'mesh-gradient',
      linkTarget: '/contact?service=ai-automation'
    },
    {
      id: 's-graphics',
      slug: 'graphic-design-video-editing',
      order: 4,
      groupId: 'creative',
      title: 'Graphic Design & Video Editing',
      tagline: 'Brand Visuals · Motion Graphics · Video Production · Social Kits',
      description: 'High-impact commercial graphic design, vector brand assets, custom packaging, and cinematic short-form video editing that elevate brand awareness and social media engagement across digital channels.',
      shortDescription: 'High-impact commercial graphic design, vector brand assets, custom packaging, and cinematic short-form video editing that elevate brand awareness.',
      features: ['Commercial Visuals', 'Motion Graphics', 'Video Editing', 'Brand Assets'],
      color: '#022B3A',
      icon: 'film',
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
      size: 'small',
      patternVariant: 'flowing-waves',
      linkTarget: '/contact?service=graphic-design'
    },
    {
      id: 's-marketing',
      slug: 'digital-marketing-seo',
      order: 5,
      groupId: 'growth',
      title: 'Digital Marketing & SEO',
      tagline: 'Search Optimization · Google/Meta Ads · B2B Outreach',
      description: 'Data-driven marketing and technical search engine optimization that place your brand in front of high-intent buyers, drive organic conversions, and scale revenue funnels through targeted multichannel campaigns.',
      shortDescription: 'Data-driven marketing and technical search engine optimization that place your brand in front of high-intent buyers and drive organic conversions.',
      features: ['Technical SEO Audits', 'Google Ads', 'Meta Ads', 'B2B Sales Funnels'],
      color: '#1F7A8C',
      icon: 'trending-up',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      size: 'small',
      patternVariant: 'isometric-grid',
      linkTarget: '/contact?service=digital-marketing'
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
      avatarUrl: 'https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-ceo-1.png?t=1788198288702',
      tags: ['Strategy', 'Enterprise Deals', 'Executive']
    },
    {
      id: 'tm-2',
      name: 'Muhammad Haseeb',
      role: 'Co-Founder & Director of Operations',
      squad: 'Executive Leadership',
      bio: 'Orchestrating operational excellence, client delivery pipelines, and production architecture across all DigiHust squads.',
      avatarUrl: 'https://ptvchzbzokyumeizsuge.supabase.co/storage/v1/object/public/avatars/usr-1788019490206.jpeg?t=1788310223059',
      tags: ['Operations', 'Architecture', 'Executive']
    }
  ],
  pinnedMemberIds: ['usr-1787949460689', 'usr-1788088620952', 'usr-1788119130873'],
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
