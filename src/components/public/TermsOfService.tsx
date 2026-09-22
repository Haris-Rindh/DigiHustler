import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../seo/SEOHead';

export const TermsOfService: React.FC = () => {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="Terms of Service | DigiHust"
        description="Terms and conditions governing client service delivery, milestone payments, intellectual property ownership, and warranties."
        canonical="https://www.digihust.tech/terms"
      />

      <section className="bg-[var(--bg-subtle)] py-16 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center space-x-2 text-sm font-semibold text-[var(--brand-teal)] mb-8 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-display font-extrabold text-[var(--text-heading)]">Terms of Service</h1>
          </div>
          <p className="text-[var(--text-muted)] text-lg">Last updated: September 22, 2026</p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-invert prose-teal">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">1. User Responsibilities</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                By accessing or using our services, you agree to comply with and be bound by these Terms. You are responsible for any activity that occurs under your account and for ensuring that all information you provide is accurate and up-to-date.
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed">
                You agree not to use our services for any unlawful purpose or in any way that interrupts, damages, or impairs the functionality of the services we provide.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">2. Intellectual Property</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Upon final payment of milestones, clients receive 100% intellectual property ownership of the custom code, designs, and deliverables produced during the project. DigiHust retains the rights to pre-existing libraries, internal tools, and open-source frameworks utilized to build the solution.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">3. Limitation of Liability</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                In no event shall DigiHust, its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">4. Governing Law</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
              <div className="mt-8 p-6 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                <p className="text-[var(--text-muted)]">
                  For legal inquiries, contact <a href="mailto:digihust@gmail.com" className="text-[var(--brand-teal)] hover:underline font-bold">digihust@gmail.com</a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
