export type LanguageCode = 'en' | 'de' | 'ar' | 'es';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇦🇪', dir: 'rtl' },
  { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav
    nav_services: 'Services',
    nav_work: 'Work',
    nav_how_it_works: 'How It Works',
    nav_about: 'About',
    nav_team: 'Team',
    nav_blog: 'Blog',
    nav_contact: 'Contact',
    btn_get_quote: 'Get a Quote',
    portal_text: 'Portal',
    preferences: 'Preferences:',

    // Hero
    hero_trust_pill: 'Coordinated Specialized Talent',
    hero_headline_1: 'Your Digital Work.',
    hero_headline_2: 'Handled by Skilled People.',
    hero_sub: 'From custom web development and UI/UX design to AI automations, growth marketing, and cybersecurity — DigiHust unites verified specialists into unified project squads.',
    btn_scoped_quote: 'Get a Scoped Quote',
    btn_explore_capabilities: 'Explore Capabilities',
    hero_active_squads: 'Active Squads:',
    hero_orbit_instruction: 'Click any orbiting service node or central hub to explore',
    scroll_down: 'Scroll Down',

    // Trust & Metrics
    trust_brands: 'Trusted by Growing Global Brands:',
    metric_delivery: 'On-Time Milestone Delivery',
    metric_delivery_sub: 'Disciplined sprint management',
    metric_talent: 'Verified Domain Specialists',
    metric_talent_sub: 'Trained through Digiskill',
    metric_contact: 'Of Contact Per Project',
    metric_contact_sub: 'No freelancer juggling',
    metric_turnaround: 'Quote Proposal Turnaround',
    metric_turnaround_sub: 'Rapid scope assessment',

    // Services Section
    services_tag: 'Core Capabilities',
    services_heading: 'One Company. Every Digital Need.',
    services_sub: 'Instead of hiring and managing 5 separate freelance silos, DigiHust executes your complete vision under one unified scope.',
    services_view_all: 'View all services in detail',
    services_explore: 'Explore Service',

    // Model Advantage
    model_tag: 'The Model Advantage',
    model_heading: 'A Managed Digital Company — Not a Random Freelancer Roll.',
    model_p1: 'Directly managing five independent freelancers means five separate negotiations, misaligned timelines, blame-shifting, and inconsistent quality.',
    model_p2: 'With DigiHust, you engage one professional entity. We architect the scope, assign verified specialists to their respective domains, and guarantee delivery under a single service-level agreement.',
    model_bullet_1: 'Single contract, single invoice, single accountable point of contact',
    model_bullet_2: 'Domain specialists matched to your precise tech stack',
    model_bullet_3: 'Rigorous internal QA before any deliverable touches your hands',
    model_bullet_4: 'Talent sourced and vetted directly through the Digiskill program',

    // Selected Work
    work_tag: 'Case Studies',
    work_heading: 'Selected Work',
    work_view_all: 'View all portfolio projects',
    work_read_case: 'Read Full Case Study',

    // Testimonials
    testimonials_tag: 'Client Feedback',
    testimonials_heading: 'What Founders Say About DigiHust',
    testimonials_sub: 'Real reviews from international organizations who trusted our managed talent squads.',

    // Pricing
    pricing_tag: 'Transparent Engagements',
    pricing_heading: 'Project Investment Guide',
    pricing_sub: 'Clear scope packages with milestone sign-offs. Custom enterprise scopes quoted within 24 hours.',
    pricing_popular: 'Most Popular',
    btn_request_proposal: 'Request Proposal for Scope',

    // CTA
    cta_heading: 'Have a Project in Mind?',
    cta_sub: 'Submit your project scope today. We will review requirements and deliver a structured pricing proposal within 24 hours.',
    btn_start_proposal: 'Start a Project Proposal',

    // Footer
    footer_tagline: 'Hustle. Create. Deliver.',
    footer_desc: 'One company. Specialized digital talent. Providing end-to-end web engineering, brand identity, AI workflows, and cybersecurity.',
    footer_rights: 'DigiHust. All rights reserved. Sourced on Digiskill talent.',
  },

  de: {
    // Nav
    nav_services: 'Leistungen',
    nav_work: 'Projekte',
    nav_how_it_works: 'Ablauf',
    nav_about: 'Über uns',
    nav_team: 'Team',
    nav_blog: 'Magazin',
    nav_contact: 'Kontakt',
    btn_get_quote: 'Angebot anfordern',
    portal_text: 'Portal',
    preferences: 'Einstellungen:',

    // Hero
    hero_trust_pill: 'Koordinierte Fachteams',
    hero_headline_1: 'Ihre digitalen Projekte.',
    hero_headline_2: 'Von Experten umgesetzt.',
    hero_sub: 'Von moderner Webentwicklung und UI/UX bis hin zu KI-Automatisierungen und Cybersicherheit — DigiHust bündelt verifizierte Experten in agilen Projektteams.',
    btn_scoped_quote: 'Angebot anfragen',
    btn_explore_capabilities: 'Leistungen entdecken',
    hero_active_squads: 'Aktive Teams:',
    hero_orbit_instruction: 'Klicken Sie auf einen Service oder die Mitte zum Erkunden',
    scroll_down: 'Nach unten scrollen',

    // Trust & Metrics
    trust_brands: 'Vertrauen internationaler Wachstumsmarken:',
    metric_delivery: 'Pünktliche Meilenstein-Lieferung',
    metric_delivery_sub: 'Diszipliniertes Sprint-Management',
    metric_talent: 'Geprüfte Fachexperten',
    metric_talent_sub: 'Ausgebildet über Digiskill',
    metric_contact: 'Ansprechpartner pro Projekt',
    metric_contact_sub: 'Kein Freelancer-Chaos',
    metric_turnaround: 'Angebots-Reaktionszeit',
    metric_turnaround_sub: 'Schnelle Scope-Bewertung',

    // Services Section
    services_tag: 'Kernkompetenzen',
    services_heading: 'Ein Unternehmen. Alle digitalen Anforderungen.',
    services_sub: 'Statt 5 einzelne Freelancer zu koordinieren, liefert DigiHust Ihre Vision aus einer Hand.',
    services_view_all: 'Alle Leistungen im Detail',
    services_explore: 'Leistung erkunden',

    // Model Advantage
    model_tag: 'Der Modell-Vorteil',
    model_heading: 'Ein gemanagtes Digitalunternehmen — kein Freelancer-Zufallsspiel.',
    model_p1: 'Das direkte Management von Freelancern führt zu Reibungsverlusten, Verzögerungen und schwankender Qualität.',
    model_p2: 'Bei DigiHust arbeiten Sie mit einem verlässlichen Partner. Wir strukturieren das Projekt und garantieren Spitzenqualität.',
    model_bullet_1: 'Ein Vertrag, eine Rechnung, ein fester Ansprechpartner',
    model_bullet_2: 'Exakt auf Ihren Tech-Stack abgestimmte Spezialisten',
    model_bullet_3: 'Strenge interne Qualitätskontrolle vor jeder Übergabe',
    model_bullet_4: 'Geprüfte Talente direkt aus dem Digiskill-Netzwerk',

    // Selected Work
    work_tag: 'Fallstudien',
    work_heading: 'Ausgewählte Projekte',
    work_view_all: 'Alle Projekte ansehen',
    work_read_case: 'Fallstudie lesen',

    // Testimonials
    testimonials_tag: 'Kundenstimmen',
    testimonials_heading: 'Was Gründer über DigiHust sagen',
    testimonials_sub: 'Echte Bewertungen internationaler Unternehmen, die unseren Teams vertrauen.',

    // Pricing
    pricing_tag: 'Transparente Pakete',
    pricing_heading: 'Projekt-Investitionsleitfaden',
    pricing_sub: 'Klare Leistungspakete mit Meilenstein-Abnahmen. Individuelle Angebote innerhalb von 24 Stunden.',
    pricing_popular: 'Beliebtestes Paket',
    btn_request_proposal: 'Angebot anfordern',

    // CTA
    cta_heading: 'Planen Sie ein neues Projekt?',
    cta_sub: 'Reichen Sie Ihre Projektanforderungen ein. Wir prüfen den Scope und senden Ihnen innerhalb von 24 Stunden ein Angebot.',
    btn_start_proposal: 'Projektvorschlag starten',

    // Footer
    footer_tagline: 'Hustle. Create. Deliver.',
    footer_desc: 'Ein Unternehmen. Spezialisierte Talente für Web Engineering, Brand Identity, KI-Workflows und Cybersicherheit.',
    footer_rights: 'DigiHust. Alle Rechte vorbehalten. Gestützt auf Digiskill-Talente.',
  },

  ar: {
    // Nav
    nav_services: 'الخدمات',
    nav_work: 'أعمالنا',
    nav_how_it_works: 'كيف نعمل',
    nav_about: 'عن الشركة',
    nav_team: 'الفريق',
    nav_blog: 'المدونة',
    nav_contact: 'اتصل بنا',
    btn_get_quote: 'طلب عرض سعر',
    portal_text: 'البوابة',
    preferences: 'التفضيلات:',

    // Hero
    hero_trust_pill: 'فرق متخصصة موحدة',
    hero_headline_1: 'مشاريعك الرقمية.',
    hero_headline_2: 'بأيدي خبراء محترفين.',
    hero_sub: 'من تطوير الويب المتكامل وتصميم الواجهات إلى حلول الذكاء الاصطناعي والأمن السيبراني — نجمع أفضل الكفاءات في فريق واحد.',
    btn_scoped_quote: 'طلب عرض سعر مخصص',
    btn_explore_capabilities: 'استكشف الخدمات',
    hero_active_squads: 'الفرق المتخصصة:',
    hero_orbit_instruction: 'انقر على أي خدمة أو المركز للاستكشاف',
    scroll_down: 'مرر للأسفل',

    // Trust & Metrics
    trust_brands: 'موثوق من علامات تجارية عالمية:',
    metric_delivery: 'تسليم في الموعد المحدد',
    metric_delivery_sub: 'إدارة منظمة للمشاريع',
    metric_talent: 'خبراء متخصصون معتمدون',
    metric_talent_sub: 'مؤهلون عبر Digiskill',
    metric_contact: 'نقطة اتصال واحدة للمشروع',
    metric_contact_sub: 'بدون تشتت بين المستقلين',
    metric_turnaround: 'سرعة تقديم العروض',
    metric_turnaround_sub: 'تقييم شامل خلال 24 ساعة',

    // Services Section
    services_tag: 'الخدمات الأساسية',
    services_heading: 'شركة واحدة. جميع احتياجاتك الرقمية.',
    services_sub: 'بدلاً من إدارة مستقلين متعددين، تتولى DigiHust تنفيذ مشروعك بالكامل تحت إدارة موحدة.',
    services_view_all: 'عرض تفاصيل الخدمات',
    services_explore: 'استكشف الخدمة',

    // Model Advantage
    model_tag: 'ميزة نموذج العمل',
    model_heading: 'شركة رقمية متكاملة — وليست مجرد منصة مستقلين عشوائية.',
    model_p1: 'إدارة المستقلين بشكل منفصل تتسبب في تأخير الجداول الزمنية واختلاف جودة التنفيذ.',
    model_p2: 'مع DigiHust، تتعاقد مع كيان مهني واحد يضمن جودة البرمجيات والتسليم في الموعد المحدد.',
    model_bullet_1: 'عقد واحد، فاتورة واحدة، وجهة اتصال مسؤولة واحدة',
    model_bullet_2: 'فريق متخصص مصمم خصيصاً لاحتياجاتك التقنية',
    model_bullet_3: 'فحص جودة داخلي صارم قبل تسليم أي مرحلة',
    model_bullet_4: 'كفاءات معتمدة ومدربة مباشرة عبر Digiskill',

    // Selected Work
    work_tag: 'دراسات الحالة',
    work_heading: 'أعمال مختارة',
    work_view_all: 'عرض كافة المشاريع',
    work_read_case: 'قراءة دراسة الحالة',

    // Testimonials
    testimonials_tag: 'آراء العملاء',
    testimonials_heading: 'ماذا يقول رواد الأعمال عن DigiHust',
    testimonials_sub: 'تقييمات حقيقية من مؤسسات دولية وثقت بفرقنا الرقمية.',

    // Pricing
    pricing_tag: 'باقات واضحة ومحددة',
    pricing_heading: 'دليل استثمار المشاريع',
    pricing_sub: 'باقات محددة النطاق مع اعتماد عند كل مرحلة. عروض مخصصة خلال 24 ساعة.',
    pricing_popular: 'الباقة الأكثر طلباً',
    btn_request_proposal: 'طلب عرض سعر للمشروع',

    // CTA
    cta_heading: 'هل لديك مشروع ترغب في تنفيذه؟',
    cta_sub: 'أرسل تفاصيل مشروعك اليوم، وسيقوم فريقنا بمراجعتها وتقديم عرض سعر متكامل خلال 24 ساعة.',
    btn_start_proposal: 'ابدأ مشروعك الآن',

    // Footer
    footer_tagline: 'اجتهاد. إبداع. إنجاز.',
    footer_desc: 'شركة رقمية موحدة. كفاءات متخصصة في تطوير الويب، الهوية البصرية، الذكاء الاصطناعي، والأمن السيبراني.',
    footer_rights: 'DigiHust. جميع الحقوق محفوظة.',
  },

  es: {
    // Nav
    nav_services: 'Servicios',
    nav_work: 'Proyectos',
    nav_how_it_works: 'Cómo Trabajamos',
    nav_about: 'Nosotros',
    nav_team: 'Equipo',
    nav_blog: 'Blog',
    nav_contact: 'Contacto',
    btn_get_quote: 'Pedir Presupuesto',
    portal_text: 'Portal',
    preferences: 'Preferencias:',

    // Hero
    hero_trust_pill: 'Talento Especializado Coordinado',
    hero_headline_1: 'Tu Trabajo Digital.',
    hero_headline_2: 'En Manos de Expertos.',
    hero_sub: 'Desde desarrollo web a medida y diseño UI/UX hasta automatizaciones de IA y ciberseguridad — DigiHust une especialistas verificados en un solo equipo.',
    btn_scoped_quote: 'Pedir Presupuesto',
    btn_explore_capabilities: 'Explorar Servicios',
    hero_active_squads: 'Equipos Activos:',
    hero_orbit_instruction: 'Haz clic en cualquier servicio o en el centro para explorar',
    scroll_down: 'Desplazar hacia abajo',

    // Trust & Metrics
    trust_brands: 'Marcas globales que confían en nosotros:',
    metric_delivery: 'Entregas a Tiempo',
    metric_delivery_sub: 'Gestión disciplinada de sprints',
    metric_talent: 'Especialistas Verificados',
    metric_talent_sub: 'Capacitados a través de Digiskill',
    metric_contact: 'Punto de Contacto Único',
    metric_contact_sub: 'Sin malabares de freelancers',
    metric_turnaround: 'Tiempo de Propuesta',
    metric_turnaround_sub: 'Evaluación de alcance en 24h',

    // Services Section
    services_tag: 'Capacidades Principales',
    services_heading: 'Una Empresa. Todas tus Necesidades Digitales.',
    services_sub: 'En lugar de coordinar 5 freelancers independientes, DigiHust ejecuta tu visión completa bajo una sola dirección.',
    services_view_all: 'Ver todos los servicios',
    services_explore: 'Explorar Servicio',

    // Model Advantage
    model_tag: 'La Ventaja del Modelo',
    model_heading: 'Una Empresa Digital Gestionada — Sin el Azar de los Freelancers.',
    model_p1: 'Gestionar múltiples freelancers genera demoras, falta de comunicación y calidad inconsistente.',
    model_p2: 'Con DigiHust, colaboras con una entidad profesional que garantiza entregas de alto nivel bajo un mismo acuerdo de servicio.',
    model_bullet_1: 'Un solo contrato, una factura, un contacto responsable',
    model_bullet_2: 'Especialistas adaptados exactamente a tu stack técnico',
    model_bullet_3: 'Control de calidad exhaustivo antes de cada entrega',
    model_bullet_4: 'Talento verificado directamente del ecosistema Digiskill',

    // Selected Work
    work_tag: 'Casos de Éxito',
    work_heading: 'Proyectos Destacados',
    work_view_all: 'Ver todos los proyectos',
    work_read_case: 'Ver Caso de Estudio',

    // Testimonials
    testimonials_tag: 'Opiniones de Clientes',
    testimonials_heading: 'Lo que Dicen los Fundadores sobre DigiHust',
    testimonials_sub: 'Reseñas reales de organizaciones que confían en nuestros equipos especializados.',

    // Pricing
    pricing_tag: 'Paquetes Transparentes',
    pricing_heading: 'Guía de Inversión en Proyectos',
    pricing_sub: 'Planes claros con aprobaciones por hitos. Propuestas personalizadas en 24 horas.',
    pricing_popular: 'Más Popular',
    btn_request_proposal: 'Solicitar Propuesta',

    // CTA
    cta_heading: '¿Tienes un Proyecto en Mente?',
    cta_sub: 'Envía los detalles de tu proyecto hoy. Revisaremos los requisitos y te entregaremos una propuesta en 24 horas.',
    btn_start_proposal: 'Iniciar Propuesta',

    // Footer
    footer_tagline: 'Hustle. Create. Deliver.',
    footer_desc: 'Una empresa. Talento digital especializado en ingeniería web, identidad de marca, flujos de IA y ciberseguridad.',
    footer_rights: 'DigiHust. Todos los derechos reservados.',
  },
};
