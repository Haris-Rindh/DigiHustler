import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

export const TermsOfService: React.FC = () => {
  return (
    <div className="pt-16">
      <SEOHead
        title="Terms of Service — DigiHust"
        description="Terms and conditions governing client service delivery, milestone payments, intellectual property ownership, and warranties."
        canonical="https://digihust.com/terms"
      />

      <section className="bg-[var(--color-bg)] py-16 sm:py-20 px-6 lg:px-8 border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-[var(--color-text-primary)] hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <span className="text-xs font-extrabold text-[var(--color-accent)] uppercase tracking-widest block mb-2">
            Contractual Framework
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-300 text-sm">Last updated: August 25, 2026</p>
        </div>
      </section>

      <section className="bg-white py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
          <div>
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">1. Scope of Engagement</h2>
            <p>
              DigiHust provides digital engineering, creative design, AI automation, and cybersecurity auditing services under formal Statement of Work (SOW) agreements. Each project outlines specific deliverables, milestones, acceptance criteria, and timelines.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">2. Intellectual Property (IP) Transfer</h2>
            <p>
              Upon full settlement of milestone payments, 100% of custom source code, vector design files, databases, and digital assets created specifically for the client are irrevocably assigned and transferred to the client.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">3. Milestone Acceptance & QA</h2>
            <p>
              Clients are provided private staging environments to review sprint deliverables. Following written milestone approval, payments are processed and the next project sprint is initiated.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">4. Post-Launch Warranty & Support</h2>
            <p>
              All production code delivered by DigiHust includes a standard 30-day bug-fix and remediation warranty covering any defects deviating from the agreed functional specifications.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">5. Inquiries & Legal Notices</h2>
            <p>
              For legal inquiries or corporate contracts, contact our legal counsel at <a href="mailto:legal@digihust.com" className="text-[var(--color-accent)] font-bold underline">legal@digihust.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
