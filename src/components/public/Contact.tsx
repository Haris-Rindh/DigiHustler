import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Paperclip,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

const SERVICES = [
  'Website / Full-Stack App',
  'UI/UX & Brand Identity',
  'AI & Automation Workflows',
  'Digital Marketing & SEO',
  'Cybersecurity & Audit',
  'PowerBI & Data Intelligence',
  'Other / Custom Scope',
];

const BUDGETS = [
  'Under $1,000',
  '$1,000 – $3,000',
  '$3,000 – $7,500',
  '$7,500 – $15,000',
  '$15,000+',
  'Flexible / Not Sure Yet',
];

const TIMELINES = [
  'Immediate (Within 2 Weeks)',
  '1 Month',
  '2 – 3 Months',
  'Flexible Timeline',
];

interface FormState {
  name: string;
  email: string;
  company: string;
  services: string[];
  description: string;
  budget: string;
  timeline: string;
  file: File | null;
  honeypot: string; // Anti-spam trap
}

export const Contact: React.FC = () => {
  const [form, setForm] = useState<FormState>({
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

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const toggleService = (s: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter((x) => x !== s)
        : [...prev.services, s],
    }));
  };

  const validate = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    // Honeypot check: If filled, silently abort or flag
    if (form.honeypot) {
      errs.name = 'Automated bot submission detected.';
      return errs;
    }

    if (!form.name.trim()) errs.name = 'Please provide your full name.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please provide a valid work email.';
    }
    if (form.services.length === 0) {
      errs.services = 'Please select at least one required capability.';
    }
    if (!form.description.trim() || form.description.trim().length < 15) {
      errs.description = 'Please describe your project scope (minimum 15 characters).';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    // Simulate swift serverless submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="pt-16">
      <SEOHead
        title="Get a Scoped Quote & Project Proposal — DigiHust"
        description="Submit your digital project scope to DigiHust. Receive a transparent milestone quote, technical architecture review, and timeline proposal within 24 hours."
      />

      {/* Header */}
      <section className="bg-[#071e26] py-20 px-6 lg:px-8 border-b border-[#1e4a5d]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">
              Direct Project Intake
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-5">
              Let's Build Something Great.
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Tell us about your project or digital challenge. We will evaluate technical requirements and deliver a scoped proposal within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form & Guarantee Body */}
      <section className="bg-white py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Left: What to expect & Trust metrics */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-gray-900 mb-6">
                What Happens Next?
              </h2>
              <div className="space-y-4">
                {[
                  {
                    step: '1',
                    title: 'Discovery & Scope Review',
                    desc: 'Our lead management team reviews your requirements within 24 hours.',
                  },
                  {
                    step: '2',
                    title: 'Architecture & Quote',
                    desc: 'You receive a detailed milestone breakdown, tech recommendations, and fixed pricing.',
                  },
                  {
                    step: '3',
                    title: 'Squad Kickoff',
                    desc: 'Upon confirmation, our verified domain squad begins sprint execution.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-3.5">
                    <div className="w-7 h-7 rounded-xl bg-[#1a7a8c] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#1a7a8c] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Our Delivery Guarantee</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                All projects are backed by single-contract accountability, verified Digiskill domain leads, NDA IP protection, and structured milestone sign-offs.
              </p>
            </div>

            <div className="pt-2 text-xs text-gray-500">
              <p className="font-bold text-gray-700 mb-1">Direct inquiries via email:</p>
              <a href="mailto:contact@digihust.com" className="text-[#1a7a8c] font-bold text-sm hover:underline">
                contact@digihust.com
              </a>
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
                  className="p-10 sm:p-14 rounded-3xl bg-[#071e26] text-white border border-[#1e4a5d] text-center shadow-2xl space-y-6"
                >
                  <div className="w-20 h-20 rounded-3xl bg-[#1a7a8c]/20 border-2 border-[#1a7a8c] flex items-center justify-center mx-auto shadow-xl">
                    <CheckCircle2 className="w-10 h-10 text-[#bde0fe]" />
                  </div>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                    Proposal Request Received!
                  </h2>
                  <p className="text-slate-300 max-w-md mx-auto leading-relaxed text-sm sm:text-base">
                    Thank you, <strong className="text-white font-bold">{form.name}</strong>. Our management leads will review your requirements for{' '}
                    <span className="text-[#bde0fe] font-semibold">{form.services.join(', ')}</span> and reach out to{' '}
                    <strong className="text-white font-bold">{form.email}</strong> within 24 hours.
                  </p>

                  <div className="pt-6 border-t border-[#1e4a5d]">
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
                        });
                      }}
                      className="text-xs font-bold text-[#bde0fe] hover:underline"
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
                  className="space-y-7"
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
                      <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-xl border text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7a8c]/40 focus:border-[#1a7a8c] transition-colors ${
                          errors.name ? 'border-red-400' : 'border-gray-200'
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
                      <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                        Work Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-xl border text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7a8c]/40 focus:border-[#1a7a8c] transition-colors ${
                          errors.email ? 'border-red-400' : 'border-gray-200'
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
                    <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                      Company / Organization Name{' '}
                      <span className="text-gray-400 font-normal normal-case text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7a8c]/40 focus:border-[#1a7a8c] transition-colors"
                      placeholder="e.g. Acme Innovations Ltd."
                    />
                  </div>

                  {/* Required Services (Multi-Select Pills) */}
                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-3">
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
                                ? 'bg-[#1a7a8c] text-white border-[#1a7a8c] shadow-md shadow-[#1a7a8c]/20'
                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
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
                    <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                      Project Overview & Objectives <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7a8c]/40 focus:border-[#1a7a8c] transition-colors resize-none ${
                        errors.description ? 'border-red-400' : 'border-gray-200'
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
                      <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                        Target Budget Range
                      </label>
                      <select
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7a8c]/40 focus:border-[#1a7a8c]"
                      >
                        {BUDGETS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                        Target Completion Window
                      </label>
                      <select
                        value={form.timeline}
                        onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7a8c]/40 focus:border-[#1a7a8c]"
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
                    <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                      Attach Architecture / Brief Document{' '}
                      <span className="text-gray-400 font-normal normal-case text-xs">(PDF, ZIP, PNG, DOCX — Max 15MB)</span>
                    </label>
                    <label className="flex items-center space-x-3 px-4 py-3.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1a7a8c]/50 cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-colors">
                      <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-500 truncate">
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
                      className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-10 py-4 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-extrabold text-base shadow-lg shadow-[#1a7a8c]/25 transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Transmitting Scope...' : 'Submit Project Scope'}</span>
                    </motion.button>
                    <p className="text-xs text-gray-400 mt-3 flex items-center space-x-1">
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
