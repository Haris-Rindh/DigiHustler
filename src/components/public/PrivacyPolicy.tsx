import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../seo/SEOHead';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="Privacy Policy | DigiHust"
        description="DigiHust's commitment to data protection, client intellectual property confidentiality, and privacy standards."
        canonical="https://www.digihust.tech/privacy"
      />

      <section className="bg-[var(--bg-subtle)] py-16 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center space-x-2 text-sm font-semibold text-[var(--brand-teal)] mb-8 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-display font-extrabold text-[var(--text-heading)]">Privacy Policy</h1>
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
              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">1. Data Collection</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                We collect information that you provide directly to us when you request a quote, fill out a form, apply for a job, or communicate with us. The types of personal information we may collect include your name, email address, phone number, company details, and any other information you choose to provide.
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed">
                We also automatically collect certain information about your device and how you interact with our website, including your IP address, browser type, and operating system.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">2. Use of Information</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-[var(--text-muted)]">
                <li>Provide, maintain, and improve our services;</li>
                <li>Process transactions and send related information;</li>
                <li>Respond to your comments, questions, and requests;</li>
                <li>Communicate with you about products, services, and events;</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our website.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">3. Cookies & Tracking</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                We use cookies and similar tracking technologies to track the activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">4. Contact Information</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 p-6 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                <a href="mailto:digihust@gmail.com" className="text-[var(--brand-teal)] hover:underline font-bold text-lg">
                  digihust@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
