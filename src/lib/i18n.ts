import { create } from 'zustand';

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
    nav_services: 'Services',
    nav_work: 'Work',
    nav_how_it_works: 'How It Works',
    nav_about: 'About',
    nav_team: 'Team',
    nav_blog: 'Blog',
    nav_contact: 'Contact',
    btn_get_quote: 'Get a Quote',
    hero_pill: 'Coordinated Specialized Talent',
    hero_headline_1: 'Your Digital Work.',
    hero_headline_2: 'Handled by Skilled People.',
    hero_sub: 'From custom web development and UI/UX design to AI automations, growth marketing, and cybersecurity — DigiHust unites verified specialists into unified project squads.',
    btn_start_project: 'Start a Project Proposal',
  },
  de: {
    nav_services: 'Leistungen',
    nav_work: 'Projekte',
    nav_how_it_works: 'Ablauf',
    nav_about: 'Über uns',
    nav_team: 'Team',
    nav_blog: 'Magazin',
    nav_contact: 'Kontakt',
    btn_get_quote: 'Angebot anfordern',
    hero_pill: 'Koordinierte Fachteams',
    hero_headline_1: 'Ihre digitalen Projekte.',
    hero_headline_2: 'Von Experten umgesetzt.',
    hero_sub: 'Von moderner Webentwicklung und UI/UX bis hin zu KI-Automatisierungen und Cybersicherheit — DigiHust bündelt verifizierte Experten in agilen Projektteams.',
    btn_start_project: 'Projekt starten',
  },
  ar: {
    nav_services: 'الخدمات',
    nav_work: 'أعمالنا',
    nav_how_it_works: 'كيف نعمل',
    nav_about: 'عن الشركة',
    nav_team: 'الفريق',
    nav_blog: 'المدونة',
    nav_contact: 'اتصل بنا',
    btn_get_quote: 'طلب عرض سعر',
    hero_pill: 'فرق متخصصة موحدة',
    hero_headline_1: 'مشاريعك الرقمية.',
    hero_headline_2: 'بأيدي خبراء محترفين.',
    hero_sub: 'من تطوير الويب المتكامل وتصميم الواجهات إلى حلول الذكاء الاصطناعي والأمن السيبراني — نجمع أفضل الكفاءات في فريق واحد.',
    btn_start_project: 'ابدأ مشروعك الآن',
  },
  es: {
    nav_services: 'Servicios',
    nav_work: 'Proyectos',
    nav_how_it_works: 'Cómo Trabajamos',
    nav_about: 'Nosotros',
    nav_team: 'Equipo',
    nav_blog: 'Blog',
    nav_contact: 'Contacto',
    btn_get_quote: 'Pedir Presupuesto',
    hero_pill: 'Talento Especializado Coordinado',
    hero_headline_1: 'Tu Trabajo Digital.',
    hero_headline_2: 'En Manos de Expertos.',
    hero_sub: 'Desde desarrollo web a medida y diseño UI/UX hasta automatizaciones de IA y ciberseguridad — DigiHust une especialistas verificados en un solo equipo.',
    btn_start_project: 'Iniciar Propuesta',
  },
};
