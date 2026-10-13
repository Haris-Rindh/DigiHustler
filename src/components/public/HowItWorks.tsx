import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Code2,
  Terminal,
  Cloud,
  Database,
  Cpu,
  Workflow,
  Palette,
  CheckSquare,
  Shield,
  BarChart3,
  ShoppingBag,
  Smartphone,
  Wrench,
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { useApp } from '../../context/AppContext';
import { TechLogo } from './TechLogo';

const TOOL_CATEGORIES = [
  {
    category: 'Web Frameworks',
    icon: Code2,
    tools: ['React', 'Next.js', 'Vue', 'Tailwind CSS', 'Vite'],
  },
  {
    category: 'Languages',
    icon: Terminal,
    tools: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML5/CSS3'],
  },
  {
    category: 'Cloud & Hosting',
    icon: Cloud,
    tools: ['AWS', 'Vercel', 'Docker', 'Supabase', 'Cloudflare'],
  },
  {
    category: 'Databases',
    icon: Database,
    tools: ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase DB', 'SQLite'],
  },
  {
    category: 'AI & Machine Learning',
    icon: Cpu,
    tools: ['OpenAI API', 'Claude API', 'Custom LLMs', 'Hugging Face', 'LangChain'],
  },
  {
    category: 'Automation & Integrations',
    icon: Workflow,
    tools: ['n8n', 'Zapier', 'Webhooks', 'REST APIs', 'Python Scripts'],
  },
  {
    category: 'UI/UX & 3D Design',
    icon: Palette,
    tools: ['Figma', 'Cinema 4D', 'Blender', 'Adobe CC', 'Framer'],
  },
  {
    category: 'Testing & QA',
    icon: CheckSquare,
    tools: ['Playwright', 'Jest', 'Vitest', 'Cypress', 'Lighthouse'],
  },
  {
    category: 'Cybersecurity',
    icon: Shield,
    tools: ['OWASP Standards', 'Penetration Testing', 'SSL/TLS', 'Dependency Auditing'],
  },
  {
    category: 'Analytics & BI',
    icon: BarChart3,
    tools: ['PowerBI', 'GA4', 'Mixpanel', 'Custom Dashboards'],
  },
  {
    category: 'CMS & E-commerce',
    icon: ShoppingBag,
    tools: ['Headless CMS', 'WordPress', 'Shopify', 'Stripe'],
  },
  {
    category: 'Mobile & Cross-Platform',
    icon: Smartphone,
    tools: ['React Native', 'Flutter', 'PWA'],
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Requirement Intake & Scoping',
    detail: 'Submit your requirements via our quote portal. We schedule a 20-minute discovery session to define technical architecture, deliverables, timeline constraints, and success criteria.',
    points: [
      'Comprehensive functional specifications review',
      'Target user persona and performance metrics alignment',
      'Tech stack and infrastructure evaluation',
      'Fixed scope proposal with milestone breakdown',
    ],
  },
  {
    num: '02',
    title: 'Specialized Squad Assembly',
    detail: "DigiHust's management architects the project team, assigning domain-verified Digiskill specialists under a single accountable lead. You get specialists, not generalists.",
    points: [
      'Single lead point of contact assigned to your project',
      'Engineers, UI/UX designers, and QA matched to requirements',
      'Direct oversight and sprint tracking by management',
      'Clear NDA and IP assignment signed upfront',
    ],
  },
  {
    num: '03',
    title: 'Sprint Execution & Live Previews',
    detail: 'We build in transparent weekly sprints. You receive staging preview links, regular progress updates, and structured feedback milestones so there are zero surprises.',
    points: [
      'Structured weekly milestone delivery checkpoints',
      'Private staging environments to review live progress',
      'Included revision rounds on all UI and logic scopes',
      'Comprehensive automated and manual QA passes',
    ],
  },
  {
    num: '04',
    title: 'Production Handover & Support',
    detail: "We deploy to your live production infrastructure, hand over 100% of source code and assets, provide documentation, and initiate your post-launch support window.",
    points: [
      'Complete Git repository and asset ownership transfer',
      'Architecture diagrams and developer documentation',
      'Dedicated post-launch warranty and bug-fix window',
      'Optional ongoing retainer or continuous feature squad',
    ],
  },
];

const FAQS = [
  {
    q: 'How does working with DigiHust differ from hiring freelancers on Upwork or Fiverr?',
    a: 'On freelancer marketplaces, you bear 100% of the burden of vetting, coordinating, and managing multiple disparate freelancers. If one drops out or writes buggy code, the project stalls. With DigiHust, you contract with a single company that guarantees delivery, enforces quality standards, and manages the entire team internally.',
  },
  {
    q: 'Who owns the intellectual property (IP) and source code?',
    a: 'You do. Upon project completion and milestone settlement, 100% of source code, vector design assets, databases, and deployment keys are transferred directly to your organization with complete IP ownership.',
  },
  {
    q: 'What is the typical project turnaround time?',
    a: 'Landing pages and brand identity kits typically take 1–2 weeks. Full-stack web applications and AI automations range between 3–8 weeks depending on complexity. We establish fixed milestone dates before contract signing.',
  },
  {
    q: 'How are project scopes and milestones structured?',
    a: 'We work on structured milestone deliverables and agile sprint scopes. You review and approve each milestone as verified features are demonstrated on live staging environments.',
  },
  {
    q: 'Can DigiHust handle ongoing maintenance after launch?',
    a: 'Yes. We offer monthly maintenance, server monitoring, security patching, and ongoing feature development squads.',
  },
];

export const HowItWorks: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { siteContent } = useApp();
  const videoUrl = siteContent?.howItWorksVideoUrl;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <div className="pt-16">
      <SEOHead
        title="How It Works & Project Methodology | DigiHust"
        description="Learn about DigiHust's structured 4-step process: Intake & Scoping, Specialist Squad Assembly, Sprint Execution, and Production Handover."
        schema={faqSchema}
      />

      {/* Header */}
      <section
        data-hero="true"
        className="bg-[var(--bg-page)] py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)]"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">
              Delivery Methodology
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] mb-5">
              How DigiHust Works.
            </h1>
            <p className="text-lg text-[var(--text-body)] max-w-2xl leading-relaxed">
              A disciplined, 4-step process transforming ideas into production-ready digital products with zero guesswork.
            </p>
          </motion.div>
        </div>
      </section>

      
      {videoUrl && (
        <section className="bg-[var(--bg-subtle)] py-16 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-subtle)]"
            >
              <iframe
                src={videoUrl}
                title="How DigiHust Works"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </motion.div>
          </div>
        </section>
      )}
      {/* Process Steps */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.005 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`flex flex-col lg:flex-row items-stretch rounded-3xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 ease-out ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Step Number Sidebar */}
              <div
                className={`lg:w-1/3 p-10 flex flex-col justify-between text-[var(--text-heading)] ${
                  i % 2 === 0 ? 'bg-[var(--bg-page)]' : 'bg-[var(--bg-surface)]'
                }`}
              >
                <div>
                  <span className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest">
                    Phase {step.num}
                  </span>
                  <div className="text-7xl lg:text-8xl font-display font-black text-[var(--brand-teal)]/25 select-none my-2">
                    {step.num}
                  </div>
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)]">
                  {step.title}
                </h2>
              </div>

              {/* Step Description & Checklist */}
              <div className="lg:w-2/3 p-8 sm:p-12 bg-[var(--bg-surface)] flex flex-col justify-center">
                <p className="text-base text-[var(--text-body)] leading-relaxed mb-8">
                  {step.detail}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {step.points.map((pt) => (
                    <div key={pt} className="flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-teal)] flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-[var(--text-body)] font-medium">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Model Comparison Table */}
      <section className="bg-[var(--bg-surface)] py-20 px-6 lg:px-8 border-y border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-extrabold text-3xl text-[var(--text-heading)] mb-3">
              Why DigiHust vs. Freelance Marketplaces
            </h2>
            <p className="text-[var(--text-muted)] text-sm max-w-lg mx-auto">
              How managed team delivery compares to individual freelance contracting.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--text-body)] border-collapse border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-[var(--bg-page)] text-xs uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                  <th className="p-4 sm:p-5">Comparison Metric</th>
                  <th className="p-4 sm:p-5 text-[var(--text-heading)]">DigiHust Managed Model</th>
                  <th className="p-4 sm:p-5 text-[var(--text-dim)]">Individual Freelancers</th>
                </tr> 
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-xs sm:text-sm">
                {[
                  ['Point of Contact', 'Single accountable lead manager', 'You manage 3–6 separate people'],
                  ['Accountability', 'Guaranteed company SLA & backup talent', 'High risk of ghosting or delays'],
                  ['Talent Verification', 'Strictly verified Digiskill domain leads', 'Self-reported marketplace ratings'],
                  ['Quality Assurance', 'Internal pre-handover QA & code review', 'You must QA everything yourself'],
                  ['Billing & Contracts', 'Single consolidated contract & invoices', 'Multiple separate invoices & fees'],
                ].map(([metric, digi, free]) => (
                  <tr key={metric} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-[var(--text-dim)]">{metric}</td>
                    <td className="p-4 sm:p-5 font-semibold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{digi}</span>
                    </td>
                    <td className="p-4 sm:p-5 text-[var(--text-muted)]">{free}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Technologies & Tools Section */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3 flex items-center justify-center space-x-1.5">
              <Wrench className="w-4 h-4" />
              <span>Full-Stack Arsenal</span>
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mb-4">
              Technologies & Tools
            </h2>
            <p className="text-[var(--text-body)] text-base max-w-2xl mx-auto leading-relaxed">
              We leverage modern, industry-standard engineering stacks, frameworks, and workflows to build performant, secure, and production-scalable software.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {TOOL_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.category}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-all duration-200 hover:border-[var(--brand-teal)]/40 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display font-bold text-base text-[var(--text-heading)]">
                        {cat.category}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {cat.tools.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-[var(--bg-page)] text-[var(--text-heading)] border border-[var(--border-subtle)] font-medium transition-all duration-150 hover:border-[var(--brand-teal)]/40 hover:bg-[var(--bg-surface)] hover:shadow-xs group"
                        >
                          <TechLogo name={t} className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-150 group-hover:scale-110" />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-2 flex items-center justify-center space-x-1">
              <HelpCircle className="w-4 h-4" />
              <span>Clarity & Transparency</span>
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={faq.q}
                  className="border border-[var(--border-subtle)] rounded-2xl overflow-hidden transition-all bg-[var(--bg-surface)]"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-[var(--text-heading)] hover:text-[var(--brand-teal)] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--text-dim)] flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[var(--brand-teal)]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[var(--text-body)] leading-relaxed border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8 text-center border-t border-[var(--border-subtle)]">
        <h2 className="font-display font-extrabold text-3xl text-[var(--text-heading)] mb-4">
          Ready to Start Your Project?
        </h2>
        <p className="text-[var(--text-body)] mb-8 max-w-md mx-auto">
          Submit your scope to receive a formal proposal and timeline within 24 hours.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#1F7A8C] hover:bg-[#186473] text-white font-bold shadow-md hover:shadow-lg transition-all"
        >
          <span>Get a Quote</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
