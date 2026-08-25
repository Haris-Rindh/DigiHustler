import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Code,
  Palette,
  Cpu,
  TrendingUp,
  Shield,
  Database,
  ChevronDown,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

const SERVICES = [
  {
    id: 'development',
    icon: <Code className="w-7 h-7" />,
    title: 'Web & App Development',
    headline: 'Websites · React/Next.js Apps · Backend APIs · DevOps',
    description: 'We build responsive, robust digital platforms engineered for performance, clean codebase architecture, and seamless scalability.',
    offerings: [
      'Custom Responsive Websites & Landing Pages',
      'Full-Stack React & Next.js Web Applications',
      'Node.js / Python REST & GraphQL APIs',
      'E-Commerce & Payment Gateway Integration',
      'Database Architecture (PostgreSQL, MongoDB, Redis)',
      'CI/CD Pipelines, Docker, & Cloud Deployment',
    ],
    tags: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'AWS', 'PostgreSQL'],
    color: '#1F7A8C',
    bgLight: 'bg-[var(--bg-surface)]',
  },
  {
    id: 'creative',
    icon: <Palette className="w-7 h-7" />,
    title: 'Creative & UI/UX Design',
    headline: 'Brand Systems · UI/UX · Figma Prototypes · Motion Graphics',
    description: 'We craft distinctive visual brand identities and user experiences that captivate attention and communicate trust.',
    offerings: [
      'Complete Brand Identity & Logo Systems',
      'Figma Web & Mobile UI/UX Prototyping',
      'Design Systems & Component Libraries',
      '3D Visuals & After Effects Motion Graphics',
      'Social Media Creative & Ad Kits',
      'Investor Pitch Decks & Marketing Collateral',
    ],
    tags: ['Figma', 'Adobe Suite', 'After Effects', 'UI/UX', 'Brand Strategy', 'Motion Design'],
    color: '#1F7A8C',
    bgLight: 'bg-[var(--bg-surface)]',
  },
  {
    id: 'ai-automation',
    icon: <Cpu className="w-7 h-7" />,
    title: 'AI Solutions & Automation',
    headline: 'OpenAI Integrations · Custom Chatbots · Workflow Automation',
    description: 'We deploy customized AI systems and end-to-end workflow automations that eliminate manual bottlenecks and scale operations.',
    offerings: [
      'Custom LLM & OpenAI Assistant Integrations',
      'Automated Customer Service AI Chatbots',
      'Workflow Automation (n8n, Zapier, Make.com)',
      'Intelligent Document & Data Processing Pipelines',
      'AI-Powered Content & Lead Generation Bots',
      'Custom Python ETL & Scraping Scripts',
    ],
    tags: ['OpenAI', 'Python', 'n8n', 'Zapier', 'LangChain', 'Automated APIs'],
    color: '#1F7A8C',
    bgLight: 'bg-[var(--bg-surface)]',
  },
  {
    id: 'marketing',
    icon: <TrendingUp className="w-7 h-7" />,
    title: 'Digital Marketing & SEO',
    headline: 'Search Optimization · Google/Meta Ads · B2B Outreach',
    description: 'Data-driven marketing and technical search engine optimization that place your brand in front of high-intent buyers.',
    offerings: [
      'Comprehensive Technical & On-Page SEO Audits',
      'High-ROI Google Ads & Meta PPC Campaigns',
      'B2B Cold Email Infrastructure & Lead Lists',
      'Conversion Rate Optimization (CRO)',
      'SEO Content Writing & Keyword Strategy',
      'Performance Analytics & GA4 Tracking Setup',
    ],
    tags: ['Technical SEO', 'Google Ads', 'Meta Ads', 'B2B Sales', 'GA4', 'Content Strategy'],
    color: '#B08D57',
    bgLight: 'bg-[var(--bg-surface)]',
  },
  {
    id: 'cybersecurity',
    icon: <Shield className="w-7 h-7" />,
    title: 'Cybersecurity & Auditing',
    headline: 'Penetration Testing · Web Security Audits · OWASP Hardening',
    description: 'We safeguard your digital assets, infrastructure, and user data through systematic penetration testing and vulnerability auditing.',
    offerings: [
      'Web Application Penetration Testing',
      'OWASP Top 10 Vulnerability Assessments',
      'Server & Cloud Security Hardening',
      'API Security Testing & Authentication Review',
      'Data Protection & Compliance Advisory',
      'Security Incident Response Planning',
    ],
    tags: ['Pen Testing', 'OWASP', 'Vulnerability Assessment', 'API Security', 'Compliance'],
    color: '#A85C4A',
    bgLight: 'bg-[var(--bg-surface)]',
  },
  {
    id: 'data-solutions',
    icon: <Database className="w-7 h-7" />,
    title: 'Data Intelligence & BI',
    headline: 'PowerBI Dashboards · SQL Reporting · Virtual Support',
    description: 'Transforming disparate data points into dynamic executive intelligence dashboards and automated reporting suites.',
    offerings: [
      'PowerBI & Looker Executive Dashboard Builds',
      'Database Modeling & SQL Query Optimization',
      'Automated Excel & Email Reporting Suites',
      'Lead Scraping & Market Research Reports',
      'CRM System Setup & Data Migration',
      'Specialized Virtual Technical Assistance',
    ],
    tags: ['PowerBI', 'SQL', 'Data Analytics', 'Excel Automation', 'BI Reporting'],
    color: '#1F7A8C',
    bgLight: 'bg-[var(--bg-surface)]',
  },
];

export const Services: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('development');

  return (
    <div className="pt-16">
      <SEOHead
        title="Digital Services & Capabilities — DigiHust"
        description="Explore DigiHust's full suite of capabilities: Full-Stack Web Development, UI/UX Design, AI Automation, Digital Marketing, Cybersecurity, and Business Intelligence."
      />

      {/* Header Banner */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">
              Full-Spectrum Capabilities
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] mb-5">
              Services Built for Execution.
            </h1>
            <p className="text-lg text-[var(--text-body)] max-w-2xl leading-relaxed">
              Six specialized domains — delivered as one cohesive digital engine. Click any capability below to review included deliverables and technologies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Services List */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {SERVICES.map((svc) => {
            const isExpanded = expandedId === svc.id;

            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isExpanded
                    ? 'border-[var(--brand-teal)]/50 shadow-xl bg-white ring-1 ring-[var(--brand-teal)]/20'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:shadow-md bg-white'
                }`}
              >
                {/* Trigger button */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : svc.id)}
                  className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-6 cursor-pointer"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start sm:items-center gap-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-md"
                      style={{ backgroundColor: svc.color }}
                    >
                      {svc.icon}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="font-display font-extrabold text-2xl text-[var(--text-heading)]">{svc.title}</h2>
                      </div>
                      <p className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wide mb-1">
                        {svc.headline}
                      </p>
                      <p className="text-sm text-[var(--text-body)] max-w-2xl hidden sm:block">
                        {svc.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--border-subtle)] text-[var(--text-muted)] flex-shrink-0 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 bg-[var(--bg-subtle)]' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Expanded Accordion Body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className={`px-6 sm:px-8 pb-8 pt-2 border-t border-[var(--border-subtle)] ${svc.bgLight}`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                        {/* Scope Checklist */}
                        <div>
                          <h3
                            className="text-xs font-black uppercase tracking-widest mb-4 flex items-center space-x-1.5"
                            style={{ color: svc.color }}
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Included Deliverables & Scope</span>
                          </h3>
                          <ul className="space-y-2.5">
                            {svc.offerings.map((offering) => (
                              <li key={offering} className="flex items-start space-x-3 text-sm text-[var(--text-body)]">
                                <CheckCircle2
                                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                                  style={{ color: svc.color }}
                                />
                                <span>{offering}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tech Stack & Action */}
                        <div className="flex flex-col justify-between">
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">
                              Technologies & Frameworks
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {svc.tags.map((t) => (
                                <span
                                  key={t}
                                  className="text-xs px-3 py-1.5 rounded-xl bg-white text-[var(--text-body)] border border-[var(--border-subtle)] font-semibold shadow-sm"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-[var(--border-subtle)]/60">
                            <Link
                              to="/contact"
                              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all hover:opacity-90"
                              style={{ backgroundColor: svc.color }}
                            >
                              <span>Request Proposal for {svc.title}</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8 border-t border-[var(--border-subtle)] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mb-4">
            Need a Multi-Disciplinary Squad?
          </h2>
          <p className="text-[var(--text-body)] mb-8 leading-relaxed">
            Most projects require a combination of engineering, branding, and automation. We combine these disciplines seamlessly into one scope.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold shadow-lg transition-all"
          >
            <span>Start a Combined Scope</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
