import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code, CheckCircle2, ArrowRight, ShieldCheck, Zap, Server, Database, 
  Layers, Lock, Sparkles, Terminal, Globe, Award 
} from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';

export const SaasDevelopmentLanding: React.FC = () => {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="Hire Dedicated SaaS & Web App Engineering Squads | DigiHust"
        description="Build and scale production-grade SaaS MVPs and custom web applications. Coordinated full-stack engineering squads delivering React, Next.js, Node.js, and cloud architectures under managed SLAs for US, UK, EU, and Gulf founders."
      />

      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)] overflow-hidden bg-gradient-to-b from-[var(--bg-subtle)] to-[var(--bg-page)]">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/40 text-[var(--brand-teal)] text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Tech Squads for Startups & Scale-ups</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] leading-tight tracking-tight"
          >
            Build Your SaaS MVP & Web Platform <br className="hidden sm:block" />
            <span className="text-[var(--brand-teal)]">With a Managed Engineering Squad.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[var(--text-body)] max-w-3xl mx-auto leading-relaxed"
          >
            Stop juggling fragmented freelancers. DigiHust assigns a pre-vetted full-stack engineering squad—frontend engineers, backend architects, DevOps, and QA testers—governed by strict milestone SLAs and single-point accountability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/contact"
              className="flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-sm shadow-lg transition-all"
            >
              <span>Scope Your SaaS Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/work"
              className="px-8 py-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] font-bold text-sm transition-all"
            >
              <span>Explore Architecture Case Studies</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Matrix */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest">Enterprise Architecture</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)]">Modern, Scalable Full-Stack Engineering</h2>
          <p className="text-sm text-[var(--text-body)]">We deploy production-tested stacks optimized for sub-second response times, zero-downtime deployments, and ISO-grade security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Terminal className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Frontend Engineering",
              desc: "React 18+, Next.js App Router, TypeScript, Tailwind CSS, high-performance state management, and accessible responsive UI.",
              bullets: ["Sub-second Core Web Vitals", "SSR & Edge Rendering", "Micro-frontend modularity"]
            },
            {
              icon: <Server className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Backend & API Architecture",
              desc: "Node.js, Express, Python FastAPI, REST & GraphQL endpoints, background job queues, and WebSocket streams.",
              bullets: ["Stripe & LemonSqueezy billing", "JWT & OAuth2 authentication", "Webhook dispatch engines"]
            },
            {
              icon: <Database className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Cloud & Database Systems",
              desc: "PostgreSQL, MongoDB, Redis caching, Supabase, AWS infrastructure, Docker containers, and CI/CD automated deployment.",
              bullets: ["Automated daily backups", "Zero-downtime migrations", "Scalable cloud cluster setup"]
            }
          ].map((card, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 hover:border-[var(--brand-teal)]/50 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-teal-subtle)] flex items-center justify-center">
                {card.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--text-heading)]">{card.title}</h3>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">{card.desc}</p>
              <ul className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                {card.bullets.map((b, i) => (
                  <li key={i} className="flex items-center space-x-2 text-xs text-[var(--text-heading)] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Engagement Packages */}
      <section className="py-20 px-6 lg:px-8 bg-[var(--bg-subtle)] border-y border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest">Transparent SaaS Packages</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)]">Sprint Delivery Options</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "SaaS MVP Sprint",
                timeline: "4–6 Weeks Delivery",
                desc: "Ideal for early-stage founders launching an initial validated version to secure angel or seed backing.",
                features: [
                  "Full-stack React/Next.js + Node.js application",
                  "User Authentication, Roles & RBAC",
                  "Stripe subscription billing & checkout",
                  "Admin metrics & management console",
                  "100% IP ownership & GitHub repo transfer"
                ]
              },
              {
                title: "Full Product Build",
                timeline: "8–12 Weeks Delivery",
                popular: true,
                desc: "Comprehensive production platform for scale-ups requiring high concurrency, multi-tenant databases, and integrations.",
                features: [
                  "Multi-tenant SaaS architecture (PostgreSQL/Supabase)",
                  "Custom REST & Webhook APIs for 3rd-party integrations",
                  "Complete design system & interactive component library",
                  "End-to-end automated testing & security audit",
                  "Dedicated PM with daily Slack/WhatsApp standups"
                ]
              },
              {
                title: "Dedicated Squad Retainer",
                timeline: "Monthly Dedicated Capacity",
                desc: "Full engineering pod (Lead Architect, 2 Full-Stack Devs, QA) operating as your continuous outsourced tech department.",
                features: [
                  "Guaranteed weekly sprint capacity (160+ hours)",
                  "Feature roadmap backlog management & sprint planning",
                  "Sub-2-hour emergency SLA & cloud monitoring",
                  "Regular performance optimizations & refactoring",
                  "Seamless scale-up / scale-down flexibility"
                ]
              }
            ].map((pkg, idx) => (
              <Link 
                key={idx} 
                to="/contact"
                className={`group p-8 rounded-3xl bg-[var(--bg-surface)] border ${
                  pkg.popular ? 'border-[var(--brand-teal)] ring-2 ring-[var(--brand-teal)]/30' : 'border-[var(--border-subtle)]'
                } space-y-6 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:border-[var(--brand-teal)] hover:-translate-y-2 transition-all duration-200 ease-out relative cursor-pointer block select-none`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--brand-teal)] text-white text-[10px] font-black uppercase tracking-widest shadow-md">
                    Most Popular
                  </span>
                )}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-extrabold text-2xl text-[var(--text-heading)] group-hover:text-[var(--brand-teal)] transition-colors duration-150">{pkg.title}</h3>
                    <p className="text-xs font-mono text-[var(--brand-teal)] font-bold mt-1">{pkg.timeline}</p>
                  </div>
                  <p className="text-xs text-[var(--text-body)] leading-relaxed">{pkg.desc}</p>
                  <ul className="space-y-2.5 pt-2 border-t border-[var(--border-subtle)]">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-[var(--text-heading)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-teal)] flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={`w-full py-3 rounded-xl text-center font-bold text-xs shadow transition-all duration-150 ${
                    pkg.popular
                      ? 'bg-[var(--brand-teal)] text-white group-hover:bg-[var(--brand-teal-hover)]'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-heading)] group-hover:bg-[var(--brand-teal)] group-hover:text-white border border-[var(--border-subtle)]'
                  }`}
                >
                  Request Proposal for Scope
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)]">
          Ready to Build Your Platform with DigiHust?
        </h2>
        <p className="text-sm text-[var(--text-body)] max-w-xl mx-auto leading-relaxed">
          Submit your product specifications or wireframes today. We will review your technical requirements and deliver a structured milestone proposal within 24 hours.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-sm shadow-xl transition-all"
        >
          <span>Start Your Project Intake</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
