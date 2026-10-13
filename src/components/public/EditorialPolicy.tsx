import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileCheck, Users, Mail, ArrowRight } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

export const EditorialPolicy: React.FC = () => {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="Editorial Policy & Publishing Standards | DigiHust"
        description="Our editorial principles, author attribution standards, fact-checking methodology, and correction process for DigiHust technical insights."
      />

      <section data-hero="true" className="bg-[var(--bg-subtle)] py-16 sm:py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">
            Publishing Standards & Ethics
          </p>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-heading)] mb-4">
            Editorial Policy
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-body)] max-w-2xl leading-relaxed">
            DigiHust is committed to technical accuracy, original analysis, and transparent author attribution across all published insights.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section 1: Authorship & Attribution */}
          <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center space-x-3 text-[var(--brand-teal)]">
              <Users className="w-5 h-5" />
              <h2 className="font-display font-bold text-xl text-[var(--text-heading)]">
                1. Authorship & Technical Attribution
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-body)]">
              Every article and technical guide published on the DigiHust Knowledge Hub is authored or reviewed by identified domain specialists—including software engineers, UI/UX architects, AI practitioners, and security auditors. We do not publish anonymous or unverified technical claims.
            </p>
          </div>

          {/* Section 2: Fact-Checking & Accuracy */}
          <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center space-x-3 text-[var(--brand-teal)]">
              <FileCheck className="w-5 h-5" />
              <h2 className="font-display font-bold text-xl text-[var(--text-heading)]">
                2. Technical Verification & Code Standards
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-body)]">
              Code snippets, architectural recommendations, and security practices are reviewed against current industry standards (such as OWASP guidelines, WCAG accessibility benchmarks, and official framework specifications) prior to publication. Articles reflect real project execution experience.
            </p>
          </div>

          {/* Section 3: Corrections & Inquiries */}
          <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center space-x-3 text-[var(--brand-teal)]">
              <Mail className="w-5 h-5" />
              <h2 className="font-display font-bold text-xl text-[var(--text-heading)]">
                3. Corrections & Feedback Procedure
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-body)]">
              If you identify a technical inaccuracy, broken reference, or outdated guideline in any of our articles, please submit a correction notice through our{' '}
              <Link to="/contact" className="text-[var(--brand-teal)] font-semibold hover:underline">
                contact page
              </Link>
              . Our technical leads review correction requests promptly and update articles with clear modification timestamps.
            </p>
          </div>

          {/* Draft Notice */}
          <div className="p-5 rounded-2xl bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/30 text-xs text-[var(--text-heading)] flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-[var(--brand-teal)] shrink-0" />
              <span>DRAFT FOR OWNER REVIEW — Governed by DigiHust Technical Standards.</span>
            </div>
            <Link to="/contact" className="font-bold text-[var(--brand-teal)] hover:underline flex items-center gap-1 shrink-0">
              <span>Contact Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
