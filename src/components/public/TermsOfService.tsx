import React from 'react';
import { motion } from 'framer-motion';
import { Scale, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../seo/SEOHead';

export const TermsOfService: React.FC = () => {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="Terms of Service | DigiHust"
        description="Legal terms, conditions, and project delivery policies for DigiHust digital services."
        canonical="https://www.digihust.tech/terms"
      />

      <section className="bg-[var(--bg-surface)] py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)] relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-teal)] to-transparent opacity-20" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center space-x-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--brand-teal)] transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-5 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] flex items-center justify-center shadow-lg border border-[var(--brand-teal)]/30">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-display font-black text-[var(--text-heading)] tracking-tight">Terms of Service</h1>
              <p className="text-[var(--brand-teal)] font-bold mt-2 uppercase tracking-widest text-xs">Agreements & Conditions</p>
            </div>
          </div>
          <p className="text-[var(--text-muted)] text-sm font-mono bg-[var(--bg-page)] inline-block px-3 py-1 rounded-md border border-[var(--border-subtle)]">Last updated: October 2026</p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            <div className="prose prose-invert prose-teal max-w-none">
              <p className="text-lg leading-relaxed text-[var(--text-body)] mb-10 border-l-4 border-[var(--brand-teal)] pl-6 bg-[var(--bg-surface)] py-4 pr-4 rounded-r-xl">
                These terms and conditions outline the rules and regulations for the use of DigiHust's Website and Digital Delivery Services, located at www.digihust.tech.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4 flex items-center gap-3">
                <FileText className="w-6 h-6 text-[var(--brand-teal)]" />
                1. Acceptance of Terms
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-10">
                By accessing this website and utilizing our services, we assume you accept these terms and conditions in full. Do not continue to use DigiHust if you do not agree to take all of the terms and conditions stated on this page.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[var(--brand-teal)]" />
                2. Project Delivery & Scope
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                DigiHust provides specialized talent for digital projects (Web Development, Creative Design, AI Automation, Cybersecurity, Marketing). 
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--text-muted)] mb-10">
                <li>All project deliverables, timelines, and budgets will be strictly outlined in a custom Statement of Work (SOW) or proposal before development begins.</li>
                <li>Changes to the scope of work after project initiation may result in timeline extensions and additional billing via Change Orders.</li>
                <li>We guarantee milestone-based delivery. Invoices are attached to tangible project milestones.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">3. Intellectual Property Rights</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-10">
                Upon final payment, full intellectual property rights for the specific deliverable (codebase, design assets, infrastructure) are transferred to the client. DigiHust retains the right to use non-confidential project outcomes as portfolio case studies unless explicitly forbidden by a prior NDA. DigiHust also retains ownership of underlying proprietary libraries or boilerplates used to accelerate development, granting the client a perpetual license to use them.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">4. Revisions and Maintenance</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-10">
                Each project phase includes a specific number of revision rounds as defined in the SOW. Post-launch bug fixes are covered for a standard 30-day warranty period. Ongoing maintenance, feature additions, or security patching requires an active Retainer or Maintenance Agreement.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">5. Payment Terms</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-10">
                Unless otherwise specified, projects require a 50% upfront deposit to secure the development squad. Remaining payments are tied to milestone sign-offs. Late payments exceeding 14 days may result in an immediate pause of all development and infrastructure services.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">6. Limitation of Liability</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-10">
                In no event shall DigiHust, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website or our software solutions beyond the total sum paid for the specific service module in question. DigiHust shall not be held liable for indirect, consequential, or special liability arising out of your use of our digital products.
              </p>

            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
