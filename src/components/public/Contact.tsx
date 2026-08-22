import React, { useState } from 'react';
import { ArrowRight, Paperclip, CheckCircle } from 'lucide-react';

const SERVICES = [
  'Website / Web App',
  'Graphic Design',
  'Branding & Identity',
  'AI & Automation',
  'Digital Marketing',
  'Cybersecurity',
  'Data & Analytics',
  'Other',
];

const BUDGETS = [
  'Under $500',
  '$500 – $1,000',
  '$1,000 – $3,000',
  '$3,000 – $7,500',
  '$7,500 – $20,000',
  '$20,000+',
  'Not sure yet',
];

const DEADLINES = [
  'ASAP (within 2 weeks)',
  '1 month',
  '2–3 months',
  'Flexible / no deadline',
];

interface FormState {
  name: string;
  email: string;
  company: string;
  services: string[];
  description: string;
  budget: string;
  deadline: string;
  file: File | null;
}

export const Contact: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: '', email: '', company: '', services: [],
    description: '', budget: '', deadline: '', file: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const toggleService = (s: string) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(s) ? prev.services.filter(x => x !== s) : [...prev.services, s],
    }));
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email is required';
    if (form.services.length === 0) errs.services = 'Please select at least one service';
    if (!form.description.trim()) errs.description = 'Please describe your project';
    if (!form.budget) errs.budget = 'Please select a budget range';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-16 min-h-screen bg-[#071e26] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#1a7a8c]/20 border-2 border-[#1a7a8c] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#bde0fe]" />
          </div>
          <h2 className="font-display font-extrabold text-4xl text-white mb-4">We got it.</h2>
          <p className="text-slate-300 mb-3">
            Thanks, <strong className="text-white">{form.name}</strong>. Your project brief has been submitted.
          </p>
          <p className="text-slate-400 text-sm mb-10">
            Someone from DigiHust will review it and get back to you at <strong className="text-white">{form.email}</strong> within 24 hours.
          </p>
          <button onClick={() => { setSubmitted(false); setForm({ name:'',email:'',company:'',services:[],description:'',budget:'',deadline:'',file:null }); }}
            className="text-sm font-bold text-[#bde0fe] hover:underline">
            Submit another project →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">

      {/* Header */}
      <div className="bg-[#071e26] py-20 px-6 lg:px-8 border-b border-[#1e4a5d]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-4">Let's Talk</p>
          <h1 className="font-display font-extrabold text-5xl text-white mb-5">Get a Quote</h1>
          <p className="text-lg text-slate-300 max-w-xl">
            Tell us about your project. The more detail the better — but a rough idea is enough to start a conversation.
          </p>
        </div>
      </div>

      {/* Form + Info */}
      <div className="bg-white py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Left: Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-4">What to expect</h3>
              <ul className="space-y-3">
                {[
                  'We review your brief within 24 hours',
                  'We send a scoped proposal with pricing and timeline',
                  'One onboarding call to align on details',
                  'Work begins within 48 hours of confirmation',
                ].map(item => (
                  <li key={item} className="flex items-start space-x-3 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-[#1a7a8c]/10 border border-[#1a7a8c]/30 text-[#1a7a8c] flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h3 className="font-display font-bold text-lg text-gray-900 mb-3">Prefer a quick message?</h3>
              <p className="text-sm text-gray-500 mb-4">
                You can also reach us directly through our social links in the footer, or email us at:
              </p>
              <p className="text-sm font-bold text-[#1a7a8c]">contact@digihust.com</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-7">

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input type="text" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7a8c]/40 focus:border-[#1a7a8c] transition-colors ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="Muhammad Bilal" />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input type="email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7a8c]/40 focus:border-[#1a7a8c] transition-colors ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="you@company.com" />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                  Company / Brand Name <span className="text-gray-400 font-normal normal-case text-xs">(optional)</span>
                </label>
                <input type="text" value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7a8c]/40 focus:border-[#1a7a8c] transition-colors"
                  placeholder="Acme Corp (or leave blank if personal project)" />
              </div>

              {/* Services */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-3">
                  What do you need? <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map(s => (
                    <button key={s} type="button"
                      onClick={() => toggleService(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        form.services.includes(s)
                          ? 'border-[#1a7a8c] bg-[#1a7a8c]/10 text-[#1a7a8c]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
                {errors.services && <p className="text-xs text-red-400 mt-2">{errors.services}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                  Tell us about your project <span className="text-red-400">*</span>
                </label>
                <textarea value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7a8c]/40 focus:border-[#1a7a8c] transition-colors resize-none ${errors.description ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Describe what you need done. Include any context about your business, goals, existing assets, or technical requirements..." />
                {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
              </div>

              {/* Budget + Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                    Budget Range <span className="text-red-400">*</span>
                  </label>
                  <select value={form.budget}
                    onChange={e => setForm({ ...form, budget: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7a8c]/40 focus:border-[#1a7a8c] transition-colors ${errors.budget ? 'border-red-300' : 'border-gray-200'}`}>
                    <option value="">Select a range</option>
                    {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.budget && <p className="text-xs text-red-400 mt-1">{errors.budget}</p>}
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                    Deadline / Timeline
                  </label>
                  <select value={form.deadline}
                    onChange={e => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7a8c]/40 focus:border-[#1a7a8c] transition-colors">
                    <option value="">Select timeline</option>
                    {DEADLINES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* File Attach */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">
                  Attach a File <span className="text-gray-400 font-normal normal-case text-xs">(optional — brief, wireframe, reference, etc.)</span>
                </label>
                <label className="flex items-center space-x-3 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1a7a8c]/40 cursor-pointer transition-colors">
                  <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-400">
                    {form.file ? form.file.name : 'Click to attach a file (PDF, DOC, PNG, ZIP — max 10MB)'}
                  </span>
                  <input type="file" className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.zip"
                    onChange={e => setForm({ ...form, file: e.target.files?.[0] || null })} />
                </label>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button type="submit"
                  className="flex items-center space-x-2 px-9 py-4 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-extrabold text-base shadow-md transition-all">
                  <span>Submit Your Project Brief</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-400 mt-3">
                  We'll review and respond within 24 hours. No commitment required.
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>

    </div>
  );
};
