import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, ShieldCheck, Lock, Key, AlertTriangle, 
  FileCheck, Server, ArrowRight, CheckCircle2, Terminal
} from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';

export const CybersecurityLanding: React.FC = () => {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="Cybersecurity Audits & Penetration Testing | DigiHust"
        description="Protect your web applications, APIs, and cloud infrastructure with offensive penetration testing, OWASP vulnerability assessments, and cloud security hardening."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Cybersecurity & Penetration Testing',
          provider: {
            '@type': 'Organization',
            name: 'DigiHust',
            url: 'https://www.digihust.tech'
          },
          areaServed: 'Global',
          description: 'Comprehensive vulnerability assessments, black-box penetration testing, OWASP compliance, and cloud security architecture.',
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceCurrency: 'USD'
          }
        }}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)] overflow-hidden bg-gradient-to-b from-[var(--bg-subtle)] to-[var(--bg-page)]">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/40 text-[var(--brand-teal)] text-xs font-bold uppercase tracking-wider"
          >
            <span>Offensive & Defensive Security Operations Squad</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] leading-tight tracking-tight"
          >
            Fortify Your Digital Assets <br className="hidden sm:block" />
            <span className="text-[var(--brand-teal)]">With Rigorous Audits & Penetration Testing.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[var(--text-body)] max-w-3xl mx-auto leading-relaxed"
          >
            Uncover and neutralize vulnerabilities before attackers find them. DigiHust delivers comprehensive black-box and white-box pen tests, OWASP compliance audits, and cloud hardening for modern web applications.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/contact?service=Cybersecurity%20Audit"
              className="flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <span>Scope Your Security Audit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/blog/owasp-top-10-web-security-checklist-for-startups"
              className="px-8 py-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] font-bold text-sm transition-all"
            >
              <span>Read Our Security Checklist</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Security Capabilities Grid */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest">Defense Vectors</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)]">Comprehensive Security & Hardening</h2>
          <p className="text-sm text-[var(--text-body)]">From application layer injection testing to cloud IAM policy enforcement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Terminal className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Web App & API Penetration Testing",
              desc: "Simulated adversary attacks evaluating business logic flaws, broken object-level authorization (BOLA), SQL/NoSQL injections, and XSS.",
              bullets: ["OWASP Top 10 systematic testing", "REST & GraphQL API fuzzing", "Authentication & token security"]
            },
            {
              icon: <Server className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Cloud Infrastructure Hardening",
              desc: "Zero-trust network configuration, AWS/GCP/Supabase security policies, database encryption at rest, and firewall rule auditing.",
              bullets: ["Cloud IAM privilege audits", "Automated intrusion alerts", "DDoS mitigation architectures"]
            },
            {
              icon: <FileCheck className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Remediation & Compliance Support",
              desc: "Actionable developer guides, executive risk scoring, and post-fix retesting to certify that every discovered flaw is permanently patched.",
              bullets: ["C-Suite executive risk summary", "Step-by-step code patch guides", "Signed Clean Audit Certificate"]
            }
          ].map((card, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 relative overflow-hidden group hover:border-[var(--brand-teal)]/50 transition-all duration-200">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-teal-subtle)] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                {card.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--text-heading)] group-hover:text-[var(--brand-teal)] transition-colors duration-200">{card.title}</h3>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">{card.desc}</p>
              <ul className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                {card.bullets.map((b, i) => (
                  <li key={i} className="flex items-center space-x-2 text-xs text-[var(--text-heading)] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Security Guarantee Banner */}
      <section className="py-16 px-6 lg:px-8 border-y border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { metric: '100%', label: 'OWASP Top 10 Coverage' },
            { metric: 'Zero', label: 'False Positives Guarantee' },
            { metric: '<48h', label: 'Initial Triage Turnaround' },
            { metric: 'NDA', label: 'Strict Confidentiality Bound' },
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--brand-teal)]">{stat.metric}</div>
              <div className="text-xs sm:text-sm font-semibold text-[var(--text-muted)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)]">
          Secure Your Application Before Production
        </h2>
        <p className="text-sm text-[var(--text-body)] max-w-xl mx-auto leading-relaxed">
          Don't wait for a data breach to audit your security posture. Request a confidential vulnerability assessment today.
        </p>
        <Link
          to="/contact?service=Cybersecurity%20Audit"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <span>Initiate Security Scoping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
