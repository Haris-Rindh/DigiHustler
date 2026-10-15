import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Building2,
  FileText,
  Paperclip,
  UploadCloud,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Target,
  Zap,
  Phone,
  MapPin,
  X,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { useApp } from '../../context/AppContext';
import { GroupId } from '../../types';
import { notificationService } from '../../lib/notificationService';
import { dbService } from '../../lib/dbService';

const SERVICES = [
  'Website / Full-Stack App',
  'UI/UX Design & Wireframing',
  'Graphic Design & Brand Identity',
  'AI & Workflow Automation',
  'Lead Generation & Funnel Building',
  'Video Editing & Motion Graphics',
  'Digital Marketing & SEO',
  'Cybersecurity Audit',
  'BI & Data Intelligence',
  'Other Custom Scope',
];

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  ranges: string[];
  approxUsdMultiplier: number;
}

export const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'USD ($)',
    ranges: [
      'Select a range',
      'Under $1,000',
      '$1,000 – $3,000',
      '$3,000 – $7,500',
      '$7,500 – $15,000',
      '$15,000+',
      'Flexible / Undecided',
    ],
    approxUsdMultiplier: 1,
  },
  PKR: {
    code: 'PKR',
    symbol: 'PKR',
    name: 'PKR (Rs)',
    ranges: [
      'Select a range',
      'Under PKR 150,000',
      'PKR 150,000 – PKR 500,000',
      'PKR 500,000 – PKR 1,500,000',
      'PKR 1,500,000 – PKR 3,000,000',
      'PKR 3,000,000+',
      'Flexible / Undecided',
    ],
    approxUsdMultiplier: 0.0036,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'EUR (€)',
    ranges: [
      'Select a range',
      'Under €1,000',
      '€1,000 – €3,000',
      '€3,000 – €7,500',
      '€7,500 – €15,000',
      '€15,000+',
      'Flexible / Undecided',
    ],
    approxUsdMultiplier: 1.08,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'GBP (£)',
    ranges: [
      'Select a range',
      'Under £800',
      '£800 – £2,500',
      '£2,500 – £6,000',
      '£6,000 – £12,000',
      '£12,000+',
      'Flexible / Undecided',
    ],
    approxUsdMultiplier: 1.28,
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'AED (AED)',
    ranges: [
      'Select a range',
      'Under AED 3,500',
      'AED 3,500 – AED 10,000',
      'AED 10,000 – AED 25,000',
      'AED 25,000 – AED 50,000',
      'AED 50,000+',
      'Flexible / Undecided',
    ],
    approxUsdMultiplier: 0.27,
  },
  SAR: {
    code: 'SAR',
    symbol: 'SAR',
    name: 'SAR (SAR)',
    ranges: [
      'Select a range',
      'Under SAR 3,500',
      'SAR 3,500 – SAR 10,000',
      'SAR 10,000 – SAR 25,000',
      'SAR 25,000 – SAR 50,000',
      'SAR 50,000+',
      'Flexible / Undecided',
    ],
    approxUsdMultiplier: 0.27,
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'CAD (C$)',
    ranges: [
      'Select a range',
      'Under C$1,500',
      'C$1,500 – C$4,000',
      'C$4,000 – C$10,000',
      'C$10,000 – C$20,000',
      'C$20,000+',
      'Flexible / Undecided',
    ],
    approxUsdMultiplier: 0.73,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'AUD (A$)',
    ranges: [
      'Select a range',
      'Under A$1,500',
      'A$1,500 – A$4,500',
      'A$4,500 – A$11,000',
      'A$11,000 – A$22,000',
      'A$22,000+',
      'Flexible / Undecided',
    ],
    approxUsdMultiplier: 0.65,
  },
};

const TIMELINE_OPTIONS = [
  'Select a timeframe',
  'Urgent (Under 2 weeks)',
  '1 Month',
  '1 – 3 Months',
  '3 – 6 Months',
  'Flexible',
];

const STAGE_OPTIONS = [
  'New Idea / Exploration',
  'Wireframes / Specs Ready',
  'Existing MVP Needing Scale',
  'Enterprise System Migration',
];

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'dispostable.com',
  'getairmail.com',
  'mohmal.com',
  'fakeinbox.com',
  'temp-mail.org',
  'tempail.com',
  'burnermail.io',
]);

export const validateFullName = (name: string): { isValid: boolean; error?: string } => {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter your full name' };
  }
  if (/\d/.test(trimmed)) {
    return { isValid: false, error: 'Name cannot contain numbers. Only letters are allowed.' };
  }
  // Standard letters (including Latin accented characters like José, Müller), spaces, apostrophes and hyphens
  if (!/^[a-zA-Z\u00C0-\u024F\s'-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Name cannot contain symbols or special characters.' };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 letters' };
  }
  if (trimmed.length > 60) {
    return { isValid: false, error: 'Name cannot exceed 60 characters' };
  }
  return { isValid: true };
};

export const validateEmailFormat = (email: string): { isValid: boolean; error?: string; domain?: string } => {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please provide your work email address' };
  }
  // RFC compliant email format validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid work email (e.g. name@company.com)' };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Invalid email address structure' };
  }

  const domain = parts[1].toLowerCase().trim();
  if (!domain.includes('.') || domain.endsWith('.')) {
    return { isValid: false, error: 'Email domain must have a valid extension (e.g. .com, .org)' };
  }

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { isValid: false, error: 'Disposable or temporary email addresses are not accepted.' };
  }

  return { isValid: true, domain };
};

export const verifyEmailDomainDns = async (domain: string): Promise<{ exists: boolean; message?: string }> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const mxRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`, {
      signal: controller.signal,
      headers: { Accept: 'application/dns-json' },
    });
    clearTimeout(timeout);

    if (mxRes.ok) {
      const data = await mxRes.json();
      if (data.Status === 3) {
        return {
          exists: false,
          message: `The email domain "@${domain}" does not exist. Please check your spelling.`,
        };
      }
      if (data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0) {
        return { exists: true };
      }
    }

    // Fallback: Check root A record
    const aController = new AbortController();
    const aTimeout = setTimeout(() => aController.abort(), 3000);
    const aRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, {
      signal: aController.signal,
      headers: { Accept: 'application/dns-json' },
    });
    clearTimeout(aTimeout);

    if (aRes.ok) {
      const aData = await aRes.json();
      if (aData.Status === 3) {
        return {
          exists: false,
          message: `The email domain "@${domain}" does not exist. Please check your spelling.`,
        };
      }
      if (aData.Status === 0 && Array.isArray(aData.Answer) && aData.Answer.length > 0) {
        return { exists: true };
      }
    }

    return {
      exists: false,
      message: `The domain "@${domain}" has no active mail server. Please provide a working email.`,
    };
  } catch (err) {
    console.warn('Email domain check warning:', err);
    return { exists: true };
  }
};

export const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectParam = searchParams.get('project');
  const serviceParam = searchParams.get('service');
  const servicesFlowParam = searchParams.get('services');
  const deliverablesParam = searchParams.get('deliverables');
  const stageParam = searchParams.get('stage');
  const timelineParam = searchParams.get('timeline');

  const [step, setStep] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    description: '',
    budget: '',
    timeline: '',
    services: ['Website / Full-Stack App'],
    stage: 'New Idea / Exploration',
    ndaRequired: false,
    file: null as File | null,
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState<string>('');

  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [budgetMode, setBudgetMode] = useState<'range' | 'custom'>('range');
  const [customBudgetAmount, setCustomBudgetAmount] = useState<string>('');
  const [isValidatingEmail, setIsValidatingEmail] = useState<boolean>(false);

  const { submitLead, siteContent } = useApp();

  const resolvedContactIllustration = (() => {
    const custom = siteContent?.customImages?.contactFormImage;
    const cIllustration = siteContent?.contact?.illustrationUrl;
    const cFormImg = siteContent?.contact?.formImageUrl;
    const directIllustration = siteContent?.contactIllustrationUrl;

    for (const candidate of [custom, cIllustration, cFormImg, directIllustration]) {
      if (candidate && typeof candidate === 'string' && candidate.trim() !== '' && candidate !== '/contact-illustration.png') {
        return candidate;
      }
    }
    return custom || cIllustration || cFormImg || directIllustration || '/contact-illustration.png';
  })();

  const mapServiceToContactOption = useCallback((rawName: string): string => {
    const lower = rawName.toLowerCase();
    if (lower.includes('dev') || lower.includes('web') || lower.includes('app') || lower.includes('engineer')) {
      return 'Website / Full-Stack App';
    }
    if (lower.includes('ui') || lower.includes('ux') || lower.includes('creative') || lower.includes('design') || lower.includes('brand')) {
      return 'UI/UX & Brand Identity';
    }
    if (lower.includes('ai') || lower.includes('auto')) {
      return 'AI & Workflow Automation';
    }
    if (lower.includes('market') || lower.includes('seo') || lower.includes('growth')) {
      return 'Digital Marketing & SEO';
    }
    if (lower.includes('cyber') || lower.includes('sec')) {
      return 'Cybersecurity Audit';
    }
    if (lower.includes('data') || lower.includes('bi') || lower.includes('analytic')) {
      return 'BI & Data Intelligence';
    }
    return rawName;
  }, []);

  useEffect(() => {
    const incomingServicesRaw = servicesFlowParam
      ? servicesFlowParam.split(',').map((s) => s.trim()).filter(Boolean)
      : serviceParam
      ? [serviceParam]
      : [];

    const mappedServices = Array.from(
      new Set(incomingServicesRaw.map(mapServiceToContactOption))
    ).filter((s) => SERVICES.includes(s));

    const deliverablesList = deliverablesParam
      ? deliverablesParam.split(',').map((d) => d.trim()).filter(Boolean)
      : [];

    let mappedTimeline = '';
    if (timelineParam) {
      if (timelineParam.toLowerCase().includes('urgent')) mappedTimeline = 'Urgent (Under 2 weeks)';
      else if (timelineParam.includes('1 Month')) mappedTimeline = '1 Month';
      else if (timelineParam.includes('1 – 3') || timelineParam.includes('1 | 3')) mappedTimeline = '1 – 3 Months';
      else if (timelineParam.includes('3 – 6') || timelineParam.includes('3+')) mappedTimeline = '3 – 6 Months';
      else if (timelineParam.toLowerCase().includes('flexible')) mappedTimeline = 'Flexible';
    }

    if (projectParam || incomingServicesRaw.length > 0 || deliverablesList.length > 0 || stageParam) {
      setForm((prev) => {
        const summaryLines: string[] = [];
        if (projectParam) summaryLines.push(`Referenced Case Study: "${projectParam}"`);
        if (stageParam) summaryLines.push(`Project Stage: ${stageParam}`);
        if (deliverablesList.length > 0) summaryLines.push(`Selected Deliverables: ${deliverablesList.join(', ')}`);

        const autoBrief =
          summaryLines.length > 0
            ? `${summaryLines.join('\n')}\n\nProject Goals & Context:\n`
            : prev.description;

        return {
          ...prev,
          services: mappedServices.length > 0 ? mappedServices : prev.services,
          timeline: mappedTimeline || prev.timeline,
          description: prev.description ? prev.description : autoBrief,
        };
      });
    }
  }, [projectParam, serviceParam, servicesFlowParam, deliverablesParam, stageParam, timelineParam, mapServiceToContactOption]);

  const toggleService = (svc: string) => {
    setForm((prev) => {
      const exists = prev.services.includes(svc);
      if (exists && prev.services.length === 1) return prev;
      const updated = exists ? prev.services.filter((s) => s !== svc) : [...prev.services, svc];
      return { ...prev, services: updated };
    });
  };

  const getEffectiveBudget = useCallback(() => {
    if (budgetMode === 'custom') {
      return customBudgetAmount.trim() ? `${selectedCurrency} ${customBudgetAmount.trim()}` : '';
    }
    return form.budget;
  }, [budgetMode, customBudgetAmount, selectedCurrency, form.budget]);

  const validateStep1Sync = (): { isValid: boolean; domain?: string } => {
    const errs: Record<string, string> = {};

    // 1. Strict Name Validation: Only letters and spaces (reject numbers and symbols)
    const nameCheck = validateFullName(form.name);
    if (!nameCheck.isValid) {
      errs.name = nameCheck.error!;
    }

    // 2. Strict Email Validation: RFC syntax and disposable domain block
    const emailCheck = validateEmailFormat(form.email);
    if (!emailCheck.isValid) {
      errs.email = emailCheck.error!;
    }

    if (!form.description.trim() || form.description.length < 10) {
      errs.description = 'Please provide a brief description (at least 10 characters)';
    }

    if (budgetMode === 'range') {
      if (!form.budget || form.budget === 'Select a range') {
        errs.budget = 'Please select a target budget range';
      }
    } else {
      if (!customBudgetAmount.trim()) {
        errs.budget = 'Please specify your target budget amount';
      }
    }

    if (!form.timeline || form.timeline === 'Select a timeframe') {
      errs.timeline = 'Please select a completion window';
    }

    setErrors(errs);
    return { isValid: Object.keys(errs).length === 0, domain: emailCheck.domain };
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const { isValid, domain } = validateStep1Sync();
      if (!isValid) return;

      // 3. Email Existence / DNS MX verification
      if (domain) {
        setIsValidatingEmail(true);
        const dnsCheck = await verifyEmailDomainDns(domain);
        setIsValidatingEmail(false);
        if (!dnsCheck.exists) {
          setErrors((prev) => ({
            ...prev,
            email: dnsCheck.message || 'This email domain does not exist. Please check your spelling.',
          }));
          return;
        }
      }

      setErrors({});
      setStep(2);
    } else if (step === 2) {
      if (form.services.length === 0) {
        setErrors({ services: 'Please select at least one capability' });
        return;
      }
      setErrors({});
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setErrors({});
      setStep(step - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: 'File size exceeds 15MB limit' }));
        return;
      }
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.file;
        return copy;
      });
      setForm((prev) => ({ ...prev, file }));
    }
  };

  const removeFile = () => {
    setForm((prev) => ({ ...prev, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmitLead = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (form.honeypot) return;

    const { isValid, domain } = validateStep1Sync();
    if (!isValid) {
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    if (domain) {
      const dnsCheck = await verifyEmailDomainDns(domain);
      if (!dnsCheck.exists) {
        setIsSubmitting(false);
        setErrors((prev) => ({
          ...prev,
          email: dnsCheck.message || 'This email domain does not exist. Please check your spelling.',
        }));
        setStep(1);
        return;
      }
    }

    try {
      // 1. Upload attached document to Supabase Storage if present
      let uploadedAttachmentUrl = '';
      let uploadedAttachmentName = '';

      if (form.file) {
        try {
          const uploadRes = await dbService.uploadLeadAttachment(form.file);
          if (uploadRes?.url) {
            uploadedAttachmentUrl = uploadRes.url;
            uploadedAttachmentName = uploadRes.name;
          }
        } catch (uploadErr) {
          console.warn('Lead file upload warning:', uploadErr);
        }
      }

      const effectiveBudget = getEffectiveBudget();

      const groupMap: Record<string, GroupId> = {
        'Website / Full-Stack App': 'tech',
        'UI/UX Design & Wireframing': 'creative',
        'Graphic Design & Brand Identity': 'creative',
        'AI & Workflow Automation': 'data',
        'Lead Generation & Funnel Building': 'growth',
        'Video Editing & Motion Graphics': 'creative',
        'Digital Marketing & SEO': 'growth',
        'Cybersecurity Audit': 'tech',
        'BI & Data Intelligence': 'data',
        'Other Custom Scope': 'tech',
      };

      const targetGroupId: GroupId = groupMap[form.services[0]] || 'tech';
      const currConfig = CURRENCY_CONFIGS[selectedCurrency] || CURRENCY_CONFIGS.USD;
      let rawBudget = 3000;
      if (budgetMode === 'custom') {
        const parsed = parseFloat(customBudgetAmount.replace(/[^0-9.]/g, '')) || 3000;
        rawBudget = Math.round(parsed * currConfig.approxUsdMultiplier);
      } else {
        const budgetMap: Record<string, number> = {
          'Under $1,000': 1000,
          '$1,000 – $3,000': 3000,
          '$3,000 – $7,500': 7500,
          '$7,500 – $15,000': 15000,
          '$15,000+': 25000,
          'Flexible / Undecided': 5000,
        };
        rawBudget = budgetMap[form.budget] || 3000;
      }

      const newLeadData = {
        title: `${form.company || form.name} | ${form.services[0]}`,
        clientName: form.name,
        clientCompany: form.company || undefined,
        clientEmail: form.email,
        brief: `${projectParam ? `[Referenced Case Study: ${projectParam}]\n\n` : ''}${form.description}\n\nServices: ${form.services.join(', ')}\nTimeline: ${form.timeline}\nBudget: ${effectiveBudget} (${selectedCurrency})\nStage: ${form.stage}\nNDA Requested: ${form.ndaRequired ? 'Yes' : 'No'}${uploadedAttachmentUrl ? `\nAttached Document: ${uploadedAttachmentName} (${uploadedAttachmentUrl})` : form.file ? `\nAttached: ${form.file.name}` : ''}`,
        budgetEstimate: rawBudget,
        budgetRange: effectiveBudget,
        timeline: form.timeline,
        currency: selectedCurrency,
        attachmentUrl: uploadedAttachmentUrl,
        attachmentName: uploadedAttachmentName || form.file?.name,
        status: 'new' as const,
        groupId: targetGroupId,
        assignedSpecialistIds: [],
        rating: 5.0,
      };

      await submitLead(newLeadData);

      // 2. Dispatch detailed lead alert to management (digihust@gmail.com)
      try {
        await notificationService.dispatchLeadEmail({
          name: form.name,
          email: form.email,
          company: form.company,
          services: form.services,
          currency: selectedCurrency,
          budget: effectiveBudget,
          timeline: form.timeline,
          description: `${projectParam ? `[Referenced Case Study: ${projectParam}]\n\n` : ''}${form.description}\nStage: ${form.stage}`,
          attachmentName: uploadedAttachmentName || form.file?.name,
          attachmentUrl: uploadedAttachmentUrl,
        });
      } catch (emailErr) {
        console.warn('Contact Form EmailJS dispatch warning:', emailErr);
      }

      // 3. Dispatch confirmation email to client
      try {
        await notificationService.dispatchClientConfirmationEmail({
          name: form.name,
          email: form.email,
          company: form.company,
          services: form.services,
          currency: selectedCurrency,
          budget: effectiveBudget,
          timeline: form.timeline,
          description: form.description,
          attachmentName: uploadedAttachmentName || form.file?.name,
          attachmentUrl: uploadedAttachmentUrl,
        });
      } catch (clientEmailErr) {
        console.warn('Client confirmation email dispatch warning:', clientEmailErr);
      }

      // 4. WhatsApp instant reply link
      const phone = siteContent?.contactPhone || '923226806396';
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(
        `*🚨 New DigiHust Client Intake*\n\n` +
        (projectParam ? `*Referenced Project:* ${projectParam}\n` : '') +
        `*Client:* ${form.name}\n` +
        `*Email:* ${form.email}\n` +
        `*Company:* ${form.company || 'Not Specified'}\n` +
        `*Services:* ${form.services.join(', ')}\n` +
        `*Budget:* ${effectiveBudget} (${selectedCurrency})\n` +
        `*Timeline:* ${form.timeline}\n` +
        (uploadedAttachmentUrl ? `*Document:* ${uploadedAttachmentName} (${uploadedAttachmentUrl})\n` : '') +
        `\n*Project Overview:*\n${form.description}`
      );
      setWhatsappLink(`https://wa.me/${cleanPhone}?text=${msg}`);
    } catch (err) {
      console.warn('Lead submission warning:', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div data-hero="true" className="min-h-screen bg-[#F4F8FA] dark:bg-[var(--bg-page)] text-[var(--text-body)] pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEOHead
        title="Get a Quote & Start a Project | DigiHust"
        description="Submit your digital project scope for web development, UI/UX, AI automation, or cybersecurity. Receive a clear structured proposal within 24 hours."
      />

      {/* Decorative soft wave backdrop in bottom-right corner */}
      <div className="absolute -bottom-16 -right-16 w-96 h-96 pointer-events-none opacity-40 dark:opacity-10 z-0">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M400,200 Q300,150 250,250 T100,300 T0,400 L400,400 Z" fill="#D0EBF0" />
          <path d="M400,120 Q280,180 200,280 T40,380 L400,400 Z" fill="#E2F4F7" opacity="0.6" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* ── HEADING BEFORE THE FORM ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-10 text-center sm:text-left"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest text-[#1F7A8C] dark:text-cyan-400 bg-[#E0F2F5] dark:bg-cyan-950/80 border border-[#CEE9ED] dark:border-cyan-800/40 mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A8C] dark:bg-cyan-400 animate-pulse" />
            <span>Project Intake & Scoping</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#022B3A] dark:text-white tracking-tight mb-3">
            Let&apos;s Build Something Great.
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] dark:text-[var(--text-muted)] max-w-2xl leading-relaxed">
            Share your goals, timeline, and requirements. Our engineering and creative leads review every intake and provide a transparent milestone proposal within 24 hours.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            /* ── SUCCESS STATE CARD ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="p-10 sm:p-14 rounded-[32px] bg-white dark:bg-[var(--bg-surface)] text-[var(--text-heading)] border border-[#E2ECEF] dark:border-[var(--border-subtle)] text-center shadow-[0_16px_50px_rgba(2,43,58,0.08)] space-y-6 max-w-2xl mx-auto"
            >
              <div className="w-20 h-20 rounded-3xl bg-[#E0F2F5] dark:bg-cyan-950/80 border-2 border-[#1F7A8C] dark:border-cyan-500 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-[#1F7A8C] dark:text-cyan-400" />
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#022B3A] dark:text-white">
                Proposal Request Received!
              </h2>
              <p className="text-[var(--text-body)] max-w-md mx-auto leading-relaxed text-sm sm:text-base">
                Thank you, <strong className="text-[#022B3A] dark:text-white font-bold">{form.name}</strong>. A confirmation email has been dispatched to{' '}
                <strong className="text-[#022B3A] dark:text-white font-bold">{form.email}</strong>. Our management and engineering leads will review your requirements for{' '}
                <span className="text-[#1F7A8C] dark:text-cyan-400 font-semibold">{form.services.join(', ')}</span> and reach back out within 24 hours.
              </p>

              {whatsappLink && (
                <div className="pt-2 space-y-3 max-w-md mx-auto">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2.5 w-full px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Connect with Team on WhatsApp</span>
                  </a>
                  <p className="text-xs text-[var(--text-muted)]">
                    Prefer immediate coordination? Forward your project brief directly to our team on WhatsApp.
                  </p>
                </div>
              )}

              <div className="pt-6 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setForm({
                      name: '',
                      email: '',
                      company: '',
                      description: '',
                      budget: '',
                      timeline: '',
                      services: ['Website / Full-Stack App'],
                      stage: 'New Idea / Exploration',
                      ndaRequired: false,
                      file: null,
                      honeypot: '',
                    });
                    setSelectedCurrency('USD');
                    setBudgetMode('range');
                    setCustomBudgetAmount('');
                  }}
                  className="text-xs font-bold text-[#1F7A8C] hover:underline"
                >
                  Submit Another Project Scope →
                </button>
              </div>
            </motion.div>
          ) : (
            /* ── MAIN CARD CONTAINER (2 COLUMNS) ── */
            <motion.div
              key="main-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-[28px] sm:rounded-[32px] bg-white dark:bg-[var(--bg-surface)] border border-[#E2ECEF] dark:border-[var(--border-subtle)] shadow-[0_12px_45px_rgba(2,43,58,0.06)] p-4 sm:p-6 lg:p-7 relative z-10 mb-6"
            >
              {/* Anti-spam honeypot */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.honeypot}
                  onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                {/* ── LEFT COLUMN: ILLUSTRATION BANNER ── */}
                <div className="lg:col-span-4 flex">
                  <div className="w-full rounded-2xl sm:rounded-[22px] overflow-hidden bg-[#E8F5F6] dark:bg-[#032533] border border-[#D5E9EC] dark:border-[#0a3a4d] flex flex-col justify-between relative min-h-[380px] sm:min-h-[460px] lg:min-h-full">
                    <img
                      src={resolvedContactIllustration}
                      alt="Let's build something great"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/contact-illustration.png';
                      }}
                    />
                  </div>
                </div>

                {/* ── RIGHT COLUMN: INTERACTIVE FORM ── */}
                <div className="lg:col-span-8 flex flex-col justify-between py-1 sm:py-2">
                  <div>
                    {/* Step Indicator Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold text-[#1F7A8C] dark:text-cyan-400 bg-[#E0F2F5] dark:bg-cyan-950/80 border border-[#CEE9ED] dark:border-cyan-800/40 w-fit">
                        {step} of 4
                      </span>
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="text-xs font-semibold text-[#64748B] hover:text-[#022B3A] dark:hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back</span>
                        </button>
                      )}
                    </div>

                    {/* Step 1: Tell us about yourself */}
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#022B3A] dark:text-white mt-1 mb-1.5 tracking-tight">
                          Tell us about yourself
                        </h2>
                        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[var(--text-muted)] leading-relaxed mb-6">
                          We'll get back to you with the right team and next steps — usually within 24 hours.
                        </p>

                        <div className="space-y-4">
                          {/* Row 1: Full Name & Work Email Address */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-[#1E293B] dark:text-white mb-1.5">
                                Full Name <span className="text-rose-500">*</span>
                              </label>
                              <div className="relative">
                                <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="text"
                                  value={form.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setForm({ ...form, name: val });
                                    if (/\d/.test(val)) {
                                      setErrors((prev) => ({ ...prev, name: 'Name cannot contain numbers. Only letters are allowed.' }));
                                    } else if (val && !/^[a-zA-Z\u00C0-\u024F\s'-]*$/.test(val)) {
                                      setErrors((prev) => ({ ...prev, name: 'Name cannot contain symbols or special characters.' }));
                                    } else if (errors.name) {
                                      setErrors((prev) => {
                                        const copy = { ...prev };
                                        delete copy.name;
                                        return copy;
                                      });
                                    }
                                  }}
                                  placeholder="e.g. Sarah Jenkins"
                                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[var(--text-heading)] bg-[#F8FAFC]/70 dark:bg-black/20 placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1F7A8C] focus:ring-1 focus:ring-[#1F7A8C] transition-colors ${
                                    errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-[#E2ECEF] dark:border-[var(--border-subtle)]'
                                  }`}
                                />
                              </div>
                              {errors.name && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name}</p>}
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold text-[#1E293B] dark:text-white">
                                  Work Email Address <span className="text-rose-500">*</span>
                                </label>
                                {isValidatingEmail && (
                                  <span className="text-[10px] text-[#1F7A8C] dark:text-cyan-400 font-semibold flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Verifying domain...
                                  </span>
                                )}
                              </div>
                              <div className="relative">
                                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="email"
                                  value={form.email}
                                  onChange={(e) => {
                                    setForm({ ...form, email: e.target.value });
                                    if (errors.email) {
                                      setErrors((prev) => {
                                        const copy = { ...prev };
                                        delete copy.email;
                                        return copy;
                                      });
                                    }
                                  }}
                                  placeholder="you@company.com"
                                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[var(--text-heading)] bg-[#F8FAFC]/70 dark:bg-black/20 placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1F7A8C] focus:ring-1 focus:ring-[#1F7A8C] transition-colors ${
                                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-[#E2ECEF] dark:border-[var(--border-subtle)]'
                                  }`}
                                />
                              </div>
                              {errors.email && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.email}</p>}
                            </div>
                          </div>

                          {/* Row 2: Company / Organization Name */}
                          <div>
                            <label className="block text-xs font-bold text-[#1E293B] dark:text-white mb-1.5">
                              Company / Organization Name <span className="text-[#94A3B8] font-normal">(optional)</span>
                            </label>
                            <div className="relative">
                              <Building2 className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                type="text"
                                value={form.company}
                                onChange={(e) => setForm({ ...form, company: e.target.value })}
                                placeholder="e.g. Acme Innovations Ltd."
                                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2ECEF] dark:border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-heading)] bg-[#F8FAFC]/70 dark:bg-black/20 placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1F7A8C] focus:ring-1 focus:ring-[#1F7A8C] transition-colors"
                              />
                            </div>
                          </div>

                          {/* Row 3: Project Overview */}
                          <div>
                            <label className="block text-xs font-bold text-[#1E293B] dark:text-white mb-1.5">
                              Project Overview <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <FileText className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3 pointer-events-none" />
                              <textarea
                                rows={3}
                                maxLength={500}
                                value={form.description}
                                onChange={(e) => {
                                  setForm({ ...form, description: e.target.value });
                                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                                }}
                                placeholder="Tell us what you are looking to build or solve. Include target audience, desired features, deadlines, or existing tech stack..."
                                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[var(--text-heading)] bg-[#F8FAFC]/70 dark:bg-black/20 placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1F7A8C] focus:ring-1 focus:ring-[#1F7A8C] transition-colors resize-none ${
                                  errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-[#E2ECEF] dark:border-[var(--border-subtle)]'
                                }`}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              {errors.description ? (
                                <p className="text-[11px] text-rose-500 font-medium">{errors.description}</p>
                              ) : <span />}
                              <span className="text-[11px] text-[#94A3B8] font-medium">
                                {form.description.length}/500
                              </span>
                            </div>
                          </div>

                          {/* Row 4: Budget & Timeline Dropdowns */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold text-[#1E293B] dark:text-white">
                                  Target Budget <span className="text-rose-500">*</span>
                                </label>
                                <div className="inline-flex rounded-lg bg-[#EAEFF2] dark:bg-black/40 p-0.5 text-[10px] font-bold">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setBudgetMode('range');
                                      if (errors.budget) setErrors((prev) => { const copy = { ...prev }; delete copy.budget; return copy; });
                                    }}
                                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                      budgetMode === 'range'
                                        ? 'bg-white dark:bg-[#024959] text-[#022B3A] dark:text-white shadow-xs'
                                        : 'text-[#64748B] hover:text-[#022B3A] dark:hover:text-white'
                                    }`}
                                  >
                                    Range
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setBudgetMode('custom');
                                      if (errors.budget) setErrors((prev) => { const copy = { ...prev }; delete copy.budget; return copy; });
                                    }}
                                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                      budgetMode === 'custom'
                                        ? 'bg-white dark:bg-[#024959] text-[#022B3A] dark:text-white shadow-xs'
                                        : 'text-[#64748B] hover:text-[#022B3A] dark:hover:text-white'
                                    }`}
                                  >
                                    Custom
                                  </button>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {/* Currency Selector */}
                                <div className="relative w-28 sm:w-32 shrink-0">
                                  <select
                                    value={selectedCurrency}
                                    onChange={(e) => {
                                      const newCurr = e.target.value;
                                      setSelectedCurrency(newCurr);
                                      setForm((prev) => ({ ...prev, budget: '' }));
                                      if (errors.budget) setErrors((prev) => { const copy = { ...prev }; delete copy.budget; return copy; });
                                    }}
                                    className="w-full appearance-none pl-2.5 pr-7 py-2.5 rounded-xl border border-[#E2ECEF] dark:border-[var(--border-subtle)] text-xs sm:text-sm font-semibold text-[var(--text-heading)] bg-[#F8FAFC]/70 dark:bg-black/20 focus:outline-none focus:border-[#1F7A8C] focus:ring-1 focus:ring-[#1F7A8C] transition-colors"
                                  >
                                    {Object.values(CURRENCY_CONFIGS).map((c) => (
                                      <option key={c.code} value={c.code}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>

                                {/* Range Select OR Custom Budget Input */}
                                <div className="relative flex-1 min-w-0">
                                  {budgetMode === 'range' ? (
                                    <>
                                      <select
                                        value={form.budget}
                                        onChange={(e) => {
                                          setForm({ ...form, budget: e.target.value });
                                          if (errors.budget) setErrors((prev) => { const copy = { ...prev }; delete copy.budget; return copy; });
                                        }}
                                        className={`w-full appearance-none px-3 py-2.5 rounded-xl border text-xs sm:text-sm text-[var(--text-heading)] bg-[#F8FAFC]/70 dark:bg-black/20 focus:outline-none focus:border-[#1F7A8C] focus:ring-1 focus:ring-[#1F7A8C] transition-colors pr-7 truncate ${
                                          errors.budget ? 'border-rose-400' : 'border-[#E2ECEF] dark:border-[var(--border-subtle)]'
                                        }`}
                                      >
                                        {(CURRENCY_CONFIGS[selectedCurrency] || CURRENCY_CONFIGS.USD).ranges.map((opt) => (
                                          <option key={opt} value={opt === 'Select a range' ? '' : opt} disabled={opt === 'Select a range'}>
                                            {opt}
                                          </option>
                                        ))}
                                      </select>
                                      <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </>
                                  ) : (
                                    <input
                                      type="text"
                                      value={customBudgetAmount}
                                      onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9.,]/g, '');
                                        setCustomBudgetAmount(val);
                                        setForm((prev) => ({ ...prev, budget: val ? `${selectedCurrency} ${val}` : '' }));
                                        if (errors.budget) setErrors((prev) => { const copy = { ...prev }; delete copy.budget; return copy; });
                                      }}
                                      placeholder={`e.g. ${selectedCurrency === 'PKR' ? '500,000' : selectedCurrency === 'EUR' ? '3,500' : '5,000'}`}
                                      className={`w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm text-[var(--text-heading)] bg-[#F8FAFC]/70 dark:bg-black/20 placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1F7A8C] focus:ring-1 focus:ring-[#1F7A8C] transition-colors ${
                                        errors.budget ? 'border-rose-400' : 'border-[#E2ECEF] dark:border-[var(--border-subtle)]'
                                      }`}
                                    />
                                  )}
                                </div>
                              </div>
                              {errors.budget && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.budget}</p>}
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-[#1E293B] dark:text-white mb-1.5">
                                Target Completion Window <span className="text-rose-500">*</span>
                              </label>
                              <div className="relative">
                                <select
                                  value={form.timeline}
                                  onChange={(e) => {
                                    setForm({ ...form, timeline: e.target.value });
                                    if (errors.timeline) setErrors((prev) => { const copy = { ...prev }; delete copy.timeline; return copy; });
                                  }}
                                  className={`w-full appearance-none px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[var(--text-heading)] bg-[#F8FAFC]/70 dark:bg-black/20 focus:outline-none focus:border-[#1F7A8C] focus:ring-1 focus:ring-[#1F7A8C] transition-colors pr-9 ${
                                    errors.timeline ? 'border-rose-400' : 'border-[#E2ECEF] dark:border-[var(--border-subtle)]'
                                  }`}
                                >
                                  {TIMELINE_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt === 'Select a timeframe' ? '' : opt} disabled={opt === 'Select a timeframe'}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                              {errors.timeline && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.timeline}</p>}
                            </div>
                          </div>

                          {/* Row 5: Attach a Brief / Document */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-6 h-6 rounded-full bg-[#E0F2F5] dark:bg-cyan-950 text-[#1F7A8C] dark:text-cyan-400 flex items-center justify-center shrink-0">
                                <Paperclip className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-xs font-bold text-[#1E293B] dark:text-white">
                                Attach a Brief / Document <span className="text-[#94A3B8] font-normal">(optional)</span>
                              </span>
                            </div>
                            <p className="text-[11px] text-[#64748B] dark:text-[var(--text-muted)] ml-8 mb-2">
                              Share any reference, wireframes, or files (PDF, ZIP, PNG, DOCX).
                            </p>

                            {form.file ? (
                              <div className="flex items-center justify-between p-3 rounded-xl border border-[#D1E5E8] dark:border-cyan-800 bg-[#E8F5F6]/50 dark:bg-cyan-950/40">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <FileText className="w-4 h-4 text-[#1F7A8C] dark:text-cyan-400 shrink-0" />
                                  <span className="text-xs font-semibold text-[#022B3A] dark:text-white truncate">
                                    {form.file.name}
                                  </span>
                                  <span className="text-[10px] text-[#64748B] font-medium shrink-0">
                                    ({(form.file.size / 1024 / 1024).toFixed(2)} MB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={removeFile}
                                  className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md text-[#64748B] hover:text-rose-500 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-[#CBD5E1] dark:border-slate-700 hover:border-[#1F7A8C] dark:hover:border-cyan-500 rounded-2xl p-5 text-center transition-colors cursor-pointer bg-[#F8FAFC]/50 dark:bg-black/20 group"
                              >
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                  accept=".pdf,.zip,.png,.jpg,.jpeg,.docx"
                                  className="hidden"
                                />
                                <UploadCloud className="w-7 h-7 text-[#1F7A8C] dark:text-cyan-400 mx-auto mb-1.5 group-hover:scale-105 transition-transform" />
                                <p className="text-xs sm:text-sm font-semibold text-[#1E293B] dark:text-white">
                                  Click to upload or drag & drop
                                </p>
                                <p className="text-[11px] text-[#94A3B8] mt-0.5">
                                  PDF, ZIP, PNG, DOCX (Max 15MB)
                                </p>
                              </div>
                            )}
                            {errors.file && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.file}</p>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Select Capabilities */}
                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#022B3A] dark:text-white mt-1 mb-1.5 tracking-tight">
                          Select Squad Capabilities
                        </h2>
                        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[var(--text-muted)] leading-relaxed mb-6">
                          Choose the specialized disciplines and engineering services your solution needs.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                          {SERVICES.map((s) => {
                            const selected = form.services.includes(s);
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => toggleService(s)}
                                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                                  selected
                                    ? 'bg-[#E0F2F5] dark:bg-cyan-950/60 border-[#1F7A8C] dark:border-cyan-500 text-[#022B3A] dark:text-white shadow-xs'
                                    : 'bg-[#F8FAFC]/70 dark:bg-black/20 border-[#E2ECEF] dark:border-[var(--border-subtle)] text-[#1E293B] dark:text-white/80 hover:border-[#1F7A8C]/50'
                                }`}
                              >
                                <span className="text-xs sm:text-sm font-semibold">{s}</span>
                                <div
                                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                    selected
                                      ? 'bg-[#1F7A8C] border-[#1F7A8C] text-white'
                                      : 'border-[#CBD5E1] dark:border-slate-600'
                                  }`}
                                >
                                  {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {errors.services && <p className="text-xs text-rose-500 font-medium mb-3">{errors.services}</p>}
                      </motion.div>
                    )}

                    {/* Step 3: Execution & Milestone Details */}
                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#022B3A] dark:text-white mt-1 mb-1.5 tracking-tight">
                          Execution & Delivery Stage
                        </h2>
                        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[var(--text-muted)] leading-relaxed mb-6">
                          Specify your current product milestone and operational preferences.
                        </p>

                        <div className="space-y-4 mb-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1E293B] dark:text-white mb-2">
                              Current Project Stage
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {STAGE_OPTIONS.map((stg) => (
                                <button
                                  key={stg}
                                  type="button"
                                  onClick={() => setForm({ ...form, stage: stg })}
                                  className={`p-3 rounded-xl border text-xs sm:text-sm font-medium text-left transition-all ${
                                    form.stage === stg
                                      ? 'bg-[#E0F2F5] dark:bg-cyan-950/60 border-[#1F7A8C] dark:border-cyan-500 text-[#022B3A] dark:text-white'
                                      : 'bg-[#F8FAFC]/70 dark:bg-black/20 border-[#E2ECEF] dark:border-[var(--border-subtle)] text-[#64748B] dark:text-slate-300'
                                  }`}
                                >
                                  {stg}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2">
                            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E2ECEF] dark:border-[var(--border-subtle)] bg-[#F8FAFC]/70 dark:bg-black/20 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.ndaRequired}
                                onChange={(e) => setForm({ ...form, ndaRequired: e.target.checked })}
                                className="w-4 h-4 rounded text-[#1F7A8C] focus:ring-[#1F7A8C] border-gray-300"
                              />
                              <div className="text-xs">
                                <span className="font-bold text-[#022B3A] dark:text-white">Mutual NDA Requested</span>
                                <p className="text-[#64748B] dark:text-[var(--text-muted)] mt-0.5">
                                  We provide a standard bilateral non-disclosure agreement prior to architectural discovery.
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Review & Confirm */}
                    {step === 4 && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#022B3A] dark:text-white mt-1 mb-1.5 tracking-tight">
                          Review Your Request
                        </h2>
                        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[var(--text-muted)] leading-relaxed mb-6">
                          Verify your requirements before dispatching to our engineering leads.
                        </p>

                        <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-black/25 border border-[#E2ECEF] dark:border-[var(--border-subtle)] space-y-3 text-xs mb-4">
                          <div className="flex justify-between py-1 border-b border-[#E2ECEF] dark:border-slate-800">
                            <span className="text-[#64748B]">Contact:</span>
                            <span className="font-bold text-[#022B3A] dark:text-white">{form.name} ({form.email})</span>
                          </div>
                          {form.company && (
                            <div className="flex justify-between py-1 border-b border-[#E2ECEF] dark:border-slate-800">
                              <span className="text-[#64748B]">Company:</span>
                              <span className="font-bold text-[#022B3A] dark:text-white">{form.company}</span>
                            </div>
                          )}
                          <div className="flex justify-between py-1 border-b border-[#E2ECEF] dark:border-slate-800">
                            <span className="text-[#64748B]">Services:</span>
                            <span className="font-bold text-[#1F7A8C] dark:text-cyan-400">{form.services.join(', ')}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-[#E2ECEF] dark:border-slate-800">
                            <span className="text-[#64748B]">Budget / Window:</span>
                            <span className="font-bold text-[#022B3A] dark:text-white">
                              {getEffectiveBudget()} ({selectedCurrency}) · {form.timeline}
                            </span>
                          </div>
                          {form.file && (
                            <div className="flex justify-between py-1 border-b border-[#E2ECEF] dark:border-slate-800">
                              <span className="text-[#64748B]">Attachment:</span>
                              <span className="font-bold text-[#022B3A] dark:text-white">{form.file.name}</span>
                            </div>
                          )}
                          <div className="py-1">
                            <span className="text-[#64748B] block mb-1">Overview:</span>
                            <p className="text-[var(--text-body)] leading-relaxed line-clamp-3 bg-white dark:bg-black/30 p-2.5 rounded-lg border border-[#E2ECEF] dark:border-slate-800">
                              {form.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* ── ACTION FOOTER BUTTON ── */}
                  <div className="flex items-center justify-between pt-5 mt-4 border-t border-[#E2ECEF] dark:border-[var(--border-subtle)]">
                    <p className="text-[11px] text-[#64748B] dark:text-[var(--text-muted)] hidden sm:block">
                      100% Milestone Guaranteed · Strict NDA Protected
                    </p>

                    <div className="ml-auto flex items-center gap-3">
                      {step < 4 ? (
                        <button
                          type="button"
                          disabled={isValidatingEmail}
                          onClick={handleNextStep}
                          className="bg-[#024959] hover:bg-[#013540] text-white px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all inline-flex items-center space-x-2 disabled:opacity-60 cursor-pointer"
                        >
                          <span>
                            {isValidatingEmail
                              ? 'Verifying Email...'
                              : step === 1
                              ? 'Next: Project Details'
                              : step === 2
                              ? 'Next: Delivery Stage'
                              : 'Next: Review Scope'}
                          </span>
                          {isValidatingEmail ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleSubmitLead()}
                          className="bg-[#024959] hover:bg-[#013540] text-white px-7 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all inline-flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                        >
                          <span>{isSubmitting ? 'Transmitting Scope...' : 'Submit Proposal Request'}</span>
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BOTTOM INFO CARD (REQUIREMENTS REVIEW, SCOPED PROPOSAL, KICKOFF SPRINT, DIRECT INQUIRIES) ── */}
        <div className="rounded-[24px] sm:rounded-3xl bg-white dark:bg-[var(--bg-surface)] border border-[#E2ECEF] dark:border-[var(--border-subtle)] shadow-[0_10px_30px_rgba(2,43,58,0.04)] p-6 sm:p-7 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Requirements Review */}
            <div className="space-y-1">
              <div className="w-9 h-9 rounded-full bg-[#E0F2F5] dark:bg-cyan-950/80 text-[#1F7A8C] dark:text-cyan-400 flex items-center justify-center shrink-0 mb-3">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#022B3A] dark:text-white">
                Requirements Review
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[var(--text-muted)] leading-relaxed">
                A Group Leader assesses technical specifications and capacity.
              </p>
            </div>

            {/* 2. Scoped Proposal */}
            <div className="space-y-1">
              <div className="w-9 h-9 rounded-full bg-[#E0F2F5] dark:bg-cyan-950/80 text-[#1F7A8C] dark:text-cyan-400 flex items-center justify-center shrink-0 mb-3">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#022B3A] dark:text-white">
                Scoped Proposal
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[var(--text-muted)] leading-relaxed">
                You receive transparent milestone pricing and squad assembly plan.
              </p>
            </div>

            {/* 3. Kickoff Sprint */}
            <div className="space-y-1">
              <div className="w-9 h-9 rounded-full bg-[#E0F2F5] dark:bg-cyan-950/80 text-[#1F7A8C] dark:text-cyan-400 flex items-center justify-center shrink-0 mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#022B3A] dark:text-white">
                Kickoff Sprint
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[var(--text-muted)] leading-relaxed">
                Work begins with live staging previews and dedicated PM check-ins.
              </p>
            </div>

            {/* 4. Direct Inquiries */}
            <div className="space-y-1.5 sm:border-t-0 border-t border-[#E2ECEF] dark:border-slate-800 pt-4 sm:pt-0">
              <div className="w-9 h-9 rounded-full bg-[#E0F2F5] dark:bg-cyan-950/80 text-[#1F7A8C] dark:text-cyan-400 flex items-center justify-center shrink-0 mb-2">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#022B3A] dark:text-white">
                Direct Inquiries
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-[var(--text-muted)] leading-tight mb-2">
                Prefer to email directly or have an RFP document ready?
              </p>
              <div className="space-y-1.5 text-xs">
                <a
                  href="mailto:digihust@gmail.com"
                  className="flex items-center gap-1.5 text-[#1F7A8C] hover:underline font-medium"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0 text-[#94A3B8]" />
                  <span>digihust@gmail.com</span>
                </a>
                <a
                  href="tel:+923226806396"
                  className="flex items-center gap-1.5 text-[#64748B] dark:text-[var(--text-muted)] hover:text-[#1F7A8C] font-medium"
                >
                  <Phone className="w-3.5 h-3.5 shrink-0 text-[#94A3B8]" />
                  <span>+92 322 6806396</span>
                </a>
                <div className="flex items-center gap-1.5 text-[#64748B] dark:text-[var(--text-muted)]">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#94A3B8]" />
                  <span>Islamabad, Pakistan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
