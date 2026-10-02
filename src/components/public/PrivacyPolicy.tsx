import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock, Eye, Server, RefreshCw } from 'lucide-react';
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

      <section className="bg-[var(--bg-surface)] py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)] relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-teal)] to-transparent opacity-20" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center space-x-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--brand-teal)] transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-5 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] flex items-center justify-center shadow-lg border border-[var(--brand-teal)]/30">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-display font-black text-[var(--text-heading)] tracking-tight">Privacy Policy</h1>
              <p className="text-[var(--brand-teal)] font-bold mt-2 uppercase tracking-widest text-xs">Data Protection & Confidentiality</p>
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
                At DigiHust, accessible from www.digihust.tech, one of our main priorities is the privacy of our visitors and clients. This Privacy Policy document contains types of information that is collected and recorded by DigiHust and how we use it.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-subtle)]">
                  <Eye className="w-8 h-8 text-[var(--brand-teal)] mb-4" />
                  <h3 className="text-xl font-bold text-[var(--text-heading)] mb-2">Transparency</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">We clearly state what data we collect and ensure you understand exactly how it is utilized to improve your digital delivery experience.</p>
                </div>
                <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-subtle)]">
                  <Lock className="w-8 h-8 text-[var(--brand-teal)] mb-4" />
                  <h3 className="text-xl font-bold text-[var(--text-heading)] mb-2">Military-Grade Security</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">Client IP, project briefs, and credentials are encrypted. We treat your proprietary data with the highest level of confidentiality.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4 flex items-center gap-3">
                <Server className="w-6 h-6 text-[var(--brand-teal)]" />
                1. Information We Collect
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--text-muted)] mb-10">
                <li><strong className="text-[var(--text-body)]">Account & Project Data:</strong> Name, email address, phone number, company name, and project briefs when you register for the DigiHust Portal or request a quote.</li>
                <li><strong className="text-[var(--text-body)]">Communications:</strong> Contents of messages, attachments, or emails you send us.</li>
                <li><strong className="text-[var(--text-body)]">Automated Data (Log Files):</strong> Standard log files including IP addresses, browser type, ISP, date/time stamp, referring/exit pages. These are not linked to any information that is personally identifiable.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4 flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-[var(--brand-teal)]" />
                2. How We Use Your Information
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                We use the information we collect in various ways, including to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--text-muted)] mb-10">
                <li>Provide, operate, and maintain our website and the DigiHust Portal.</li>
                <li>Improve, personalize, and expand our digital services and AI automated workflows.</li>
                <li>Understand and analyze how you use our website to optimize UI/UX.</li>
                <li>Develop new products, services, features, and functionality.</li>
                <li>Communicate with you directly for customer service, updates, and project delivery milestones.</li>
                <li>Find and prevent fraud and conduct cybersecurity audits.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">3. Client Intellectual Property (IP) & NDAs</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-10">
                DigiHust handles highly sensitive business strategies, source code, and design assets. We default to strict confidentiality. We do not share, sell, or rent your proprietary business information to third parties. Custom Non-Disclosure Agreements (NDAs) are available upon request before any project scoping begins.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">4. Cookies and Web Beacons</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-10">
                Like any other website, DigiHust uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
              </p>

              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">5. Third-Party Privacy Policies</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-10">
                DigiHust's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers (such as Google Analytics or LinkedIn Ads) for more detailed information.
              </p>

              <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-page)] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-teal)] rounded-full blur-[80px] opacity-20 pointer-events-none" />
                <h2 className="text-xl font-bold text-[var(--text-heading)] mb-3">Questions about your data?</h2>
                <p className="text-[var(--text-muted)] leading-relaxed mb-6">
                  If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact our legal and security compliance team.
                </p>
                <a href="mailto:digihust@gmail.com" className="inline-flex items-center space-x-2 bg-[var(--brand-teal)] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[var(--brand-teal-hover)] transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>digihust@gmail.com</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
