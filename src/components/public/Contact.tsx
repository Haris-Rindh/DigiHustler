import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  MessageSquare,
  Sparkles,
  Paperclip,
  Check,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { useApp } from '../../context/AppContext';
import { GroupId } from '../../types';
import { notificationService } from '../../lib/notificationService';

const SERVICES = [
  'Website / Full-Stack App',
  'UI/UX & Brand Identity',
  'AI & Workflow Automation',
  'Digital Marketing & SEO',
  'Cybersecurity Audit',
  'BI & Data Intelligence',
  'Other Custom Scope',
];

const BUDGETS = [
  'Under $1,000',
  '$1,000 – $3,000',
  '$3,000 – $7,500',
  '$7,500 – $15,000',
  '$15,000+',
  'Flexible / Not Sure',
];

const TIMELINES = [
  'Urgent (Under 2 Weeks)',
  '1 Month',
  '1 – 3 Months',
  '3+ Months / Ongoing Retainer',
  'Flexible',
];

export const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    services: ['Website / Full-Stack App'],
    description: '',
    budget: '$1,000 – $3,000',
    timeline: '1 Month',
    file: null as File | null,
    honeypot: '', // anti-spam field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (svc: string) => {
    setForm((prev) => {
      const exists = prev.services.includes(svc);
      if (exists && prev.services.length === 1) return prev; // keep at least 1
      const updated = exists
        ? prev.services.filter((s) => s !== svc)
        : [...prev.services, svc];
      return { ...prev, services: updated };
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Please provide your name or organization lead';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please provide a valid work email address';
    }
    if (!form.description.trim() || form.description.length < 20) {
      errs.description = 'Please provide at least 20 characters describing your project goals';
    }
    if (form.services.length === 0) {
      errs.services = 'Please select at least one capability';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const { submitLead, siteContent } = useApp();
  const [whatsappLink, setWhatsappLink] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return; // silent bot rejection
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const budgetMap: Record<string, number> = {
        'Under $1,000': 800,
        '$1,000 – $3,000': 2000,
        '$3,000 – $7,500': 5000,
        '$7,500 – $15,000': 10000,
        '$15,000+': 20000,
        'Flexible / Not Sure': 3000,
      };
      const groupMap: Record<string, GroupId> = {
        'Website / Full-Stack App': 'tech',
        'UI/UX & Brand Identity': 'creative',
        'AI & Workflow Automation': 'data',
        'Digital Marketing & SEO': 'growth',
        'Cybersecurity Audit': 'tech',
        'BI & Data Intelligence': 'data',
        'Other Custom Scope': 'tech',
      };

      const targetGroupId: GroupId = groupMap[form.services[0]] || 'tech';
      const rawBudget = budgetMap[form.budget] || 3000;

      const newLeadData = {
        title: `${form.company || form.name} — ${form.services[0]}`,
        clientName: form.name,
        clientCompany: form.company || undefined,
        clientEmail: form.email,
        brief: `${form.description}\n\nServices: ${form.services.join(', ')}\nTimeline: ${form.timeline}\nBudget: ${form.budget}`,
        budgetEstimate: rawBudget,
        suggestedGroupId: targetGroupId,
      };

      submitLead(newLeadData);

      // Automated direct email dispatch to digihust@gmail.com via EmailJS
      await notificationService.dispatchLeadEmail(form);

      // Generate direct WhatsApp click-to-chat URL for management
      const cleanPhone = (siteContent?.contact?.whatsapp || '+923206806396').replace(/[^0-9]/g, '');
      const waMsg = `*🚨 New DigiHust Project Proposal*\n\n` +
        `*Name:* ${form.name}\n` +
        `*Email:* ${form.email}\n` +
        (form.company ? `*Company:* ${form.company}\n` : '') +
        `*Services:* ${form.services.join(', ')}\n` +
        `*Budget:* ${form.budget}\n` +
        `*Timeline:* ${form.timeline}\n\n` +
        `*Project Scope:* ${form.description}`;
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;
      setWhatsappLink(waUrl);

    } catch (err) {
      console.error('Contact form submission error:', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };


  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="Get a Quote & Start a Project — DigiHust"
        description="Submit your digital project scope for web development, UI/UX, AI automation, or cybersecurity. Receive a clear structured proposal within 24 hours."
      />

      {/* ── HEADER INTRO ── */}
      <section className="py-14 sm:py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">
              Project Intake & Scoping
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] mb-5">
              Let’s Scope Your Solution.
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-body)] max-w-2xl mx-auto leading-relaxed">
              Tell us what you want to build or solve. Our management team reviews your requirements and responds with a detailed scope and timeline proposal within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT (GRID: INFO + FORM) ── */}
      <section className="py-16 sm:py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          
          {/* Left: Expectations, Process & Contact Info */}
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6">
              <h3 className="font-display font-bold text-xl text-[var(--text-heading)]">What Happens Next?</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Requirements Review', desc: 'A Group Leader assesses technical specifications and capacity.' },
                  { step: '2', title: 'Scoped Proposal', desc: 'You receive transparent milestone pricing and squad assembly plan.' },
                  { step: '3', title: 'Kickoff Sprint', desc: 'Work begins with live staging previews and dedicated PM check-ins.' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-3.5">
                    <div className="w-7 h-7 rounded-xl bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-[var(--brand-teal)]/30">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-heading)]">{item.title}</h4>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

              {/* Direct Contact Card */}
            <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-4">
              <h3 className="font-display font-bold text-lg text-[var(--text-heading)]">Direct Inquiries</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Prefer to email directly or have an RFP document ready?
              </p>
              <div className="space-y-3 text-xs pt-1">
                <div className="flex items-center space-x-3 text-[var(--text-body)]">
                  <Mail className="w-4 h-4 text-[var(--brand-teal)]" />
                  <a href={`mailto:${siteContent?.contact?.email || 'contact@digihust.com'}`} className="font-semibold text-[var(--text-heading)] hover:text-[var(--brand-teal)] transition-colors">
                    {siteContent?.contact?.email || 'contact@digihust.com'}
                  </a>
                </div>
                {siteContent?.contact?.phone && (
                  <div className="flex items-center space-x-3 text-[var(--text-body)]">
                    <Phone className="w-4 h-4 text-[var(--brand-teal)]" />
                    <span>{siteContent.contact.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3 text-[var(--text-body)]">
                  <MapPin className="w-4 h-4 text-[var(--brand-teal)]" />
                  <span>{siteContent?.contact?.address || 'Islamabad / Global Remote Squads'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Intake Form with Animated States */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-10 sm:p-14 rounded-3xl bg-[var(--bg-surface)] text-[var(--text-heading)] border border-[var(--border-subtle)] text-center shadow-xl space-y-6"
                >
                  <div className="w-20 h-20 rounded-3xl bg-[var(--brand-teal-subtle)] border-2 border-[var(--brand-teal)] flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-[var(--brand-teal)]" />
                  </div>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)]">
                    Proposal Request Received!
                  </h2>
                  <p className="text-[var(--text-body)] max-w-md mx-auto leading-relaxed text-sm sm:text-base">
                    Thank you, <strong className="text-[var(--text-heading)] font-bold">{form.name}</strong>. Our management leads will review your requirements for{' '}
                    <span className="text-[var(--brand-teal)] font-semibold">{form.services.join(', ')}</span> and reach out to{' '}
                    <strong className="text-[var(--text-heading)] font-bold">{form.email}</strong> within 24 hours.
                  </p>

                  {whatsappLink && (
                    <div className="pt-2 space-y-3 max-w-md mx-auto">
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-2.5 w-full px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>Send Brief on WhatsApp to CEO (+92 320 6806396)</span>
                      </a>
                      <p className="text-xs text-[var(--text-muted)]">
                        Prefer instant response? Click above to forward your brief directly to our CEO on WhatsApp!
                      </p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-[var(--border-subtle)]">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({
                          name: '',
                          email: '',
                          company: '',
                          services: ['Website / Full-Stack App'],
                          description: '',
                          budget: '$1,000 – $3,000',
                          timeline: '1 Month',
                          file: null,
                          honeypot: '',
                        });
                      }}
                      className="text-xs font-bold text-[var(--brand-teal)] hover:underline"
                    >
                      Submit Another Project Scope →
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-7 p-8 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm"
                >
                  {/* Anti-spam honeypot (hidden from real users) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website_hp">Leave this field blank</label>
                    <input
                      id="website_hp"
                      type="text"
                      name="website_hp"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.honeypot}
                      onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                    />
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest mb-2">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-xl border text-sm text-[var(--text-heading)] bg-[var(--bg-page)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]/40 focus:border-[var(--brand-teal)] transition-colors ${
                          errors.name ? 'border-red-400' : 'border-[var(--border-subtle)]'
                        }`}
                        placeholder="e.g. Sarah Jenkins"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 font-semibold mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest mb-2">
                        Work Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-xl border text-sm text-[var(--text-heading)] bg-[var(--bg-page)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]/40 focus:border-[var(--brand-teal)] transition-colors ${
                          errors.email ? 'border-red-400' : 'border-[var(--border-subtle)]'
                        }`}
                        placeholder="you@company.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 font-semibold mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest mb-2">
                      Company / Organization Name{' '}
                      <span className="text-[var(--text-muted)] font-normal normal-case text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-subtle)] text-sm text-[var(--text-heading)] bg-[var(--bg-page)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]/40 focus:border-[var(--brand-teal)] transition-colors"
                      placeholder="e.g. Acme Innovations Ltd."
                    />
                  </div>

                  {/* Required Services (Multi-Select Pills) */}
                  <div>
                    <label className="block text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest mb-3">
                      Required Capabilities <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SERVICES.map((s) => {
                        const selected = form.services.includes(s);
                        return (
                          <motion.button
                            key={s}
                            type="button"
                            onClick={() => toggleService(s)}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                              selected
                                ? 'bg-[var(--brand-teal)] text-white border-[var(--brand-teal)] shadow-md'
                                : 'bg-[var(--bg-page)] text-[var(--text-body)] border-[var(--border-subtle)] hover:border-[var(--brand-teal)]'
                            }`}
                          >
                            {s}
                          </motion.button>
                        );
                      })}
                    </div>
                    {errors.services && (
                      <p className="text-xs text-red-500 font-semibold mt-2">{errors.services}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest mb-2">
                      Project Overview & Objectives <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm text-[var(--text-heading)] bg-[var(--bg-page)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]/40 focus:border-[var(--brand-teal)] transition-colors resize-none ${
                        errors.description ? 'border-red-400' : 'border-[var(--border-subtle)]'
                      }`}
                      placeholder="Tell us what you are looking to build or solve. Include target audience, desired features, deadlines, or existing tech stack..."
                    />
                    {errors.description && (
                      <p className="text-xs text-red-500 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.description}</span>
                      </p>
                    )}
                  </div>

                  {/* Budget & Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest mb-2">
                        Target Budget Range
                      </label>
                      <select
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-subtle)] text-sm text-[var(--text-heading)] bg-[var(--bg-page)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]/40 focus:border-[var(--brand-teal)]"
                      >
                        {BUDGETS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest mb-2">
                        Target Completion Window
                      </label>
                      <select
                        value={form.timeline}
                        onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-subtle)] text-sm text-[var(--text-heading)] bg-[var(--bg-page)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]/40 focus:border-[var(--brand-teal)]"
                      >
                        {TIMELINES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* File Attachment */}
                  <div>
                    <label className="block text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest mb-2">
                      Attach Architecture / Brief Document{' '}
                      <span className="text-[var(--text-muted)] font-normal normal-case text-xs">(PDF, ZIP, PNG, DOCX — Max 15MB)</span>
                    </label>
                    <label className="flex items-center space-x-3 px-4 py-3.5 rounded-xl border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--brand-teal)] cursor-pointer bg-[var(--bg-page)] transition-colors">
                      <Paperclip className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-[var(--text-muted)] truncate">
                        {form.file ? form.file.name : 'Click to select an attachment or drag here'}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.png,.jpg,.zip"
                        onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                      />
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-10 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-extrabold text-base shadow-md transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Transmitting Scope...' : 'Submit Project Scope'}</span>
                    </motion.button>
                    <p className="text-xs text-[var(--text-muted)] mt-3 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Zero commitment required. Proposal returned in 24 hours.</span>
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};
