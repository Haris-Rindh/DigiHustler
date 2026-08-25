import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-16">
      <SEOHead
        title="Privacy Policy — DigiHust"
        description="DigiHust's commitment to data protection, client intellectual property confidentiality, and GDPR compliance."
        canonical="https://digihust.com/privacy"
      />

      <section className="bg-[var(--bg-page)] py-16 sm:py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-[var(--text-heading)] hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <span className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest block mb-2">
            Legal & Compliance
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[var(--text-heading)] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[var(--text-body)] text-sm">Last updated: August 25, 2026</p>
        </div>
      </section>

      <section className="bg-[var(--bg-page)] py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-[var(--text-body)] leading-relaxed text-sm sm:text-base">
          <div>
            <h2 className="font-display font-bold text-2xl text-[var(--text-heading)] mb-3">1. Information We Collect</h2>
            <p>
              When you submit a project inquiry or contact DigiHust via our quote portal, we collect your full name, work email address, company name, project specifications, target budget, and any uploaded project brief documents.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-[var(--text-heading)] mb-3">2. How We Use Project Information</h2>
            <p>
              The information submitted is used exclusively for evaluating technical project feasibility, assembling appropriate specialized engineering squads, and preparing structured milestone proposals. We do not sell, rent, or monetize client project information to any third parties.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-[var(--text-heading)] mb-3">3. Non-Disclosure & Confidentiality (NDA)</h2>
            <p>
              All proprietary business logic, design assets, and architectural documents shared with DigiHust are treated with strict confidentiality. Full Non-Disclosure Agreements (NDAs) are executed prior to commencing project sprints.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-[var(--text-heading)] mb-3">4. Cookies & Analytics</h2>
            <p>
              We use minimal essential cookies to analyze website performance, track Core Web Vitals, and maintain user preferences. You can adjust your cookie settings at any time via the cookie consent banner.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-[var(--text-heading)] mb-3">5. Contact Us</h2>
            <p>
              If you have any questions regarding our privacy practices or data policies, please reach out to our legal team at <a href="mailto:privacy@digihust.com" className="text-[var(--brand-teal)] font-bold underline">privacy@digihust.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
