import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Cpu, CheckCircle2, ArrowRight, Zap, Bot, Network, 
  Workflow, FileText, Database, Sparkles, LineChart 
} from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';

export const AiAutomationLanding: React.FC = () => {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="AI Workflow Automation & Custom LLM Engineering | DigiHust"
        description="Deploy enterprise AI agents, OpenAI integrations, n8n automated workflows, and intelligent data extraction pipelines. Eliminate repetitive operational overhead with DigiHust's AI engineering squad."
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
            <span>Autonomous AI Systems & Workflow Orchestration</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] leading-tight tracking-tight"
          >
            Scale Your Business Operations <br className="hidden sm:block" />
            <span className="text-[var(--brand-teal)]">With Custom AI & Autonomous Workflows.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[var(--text-body)] max-w-3xl mx-auto leading-relaxed"
          >
            Replace manual bottlenecks with intelligent automation. DigiHust designs, trains, and integrates custom LLM agents, multi-step n8n pipelines, and automated CRM triggers tailored to your enterprise workflows.
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
              <span>Scope Your AI Automation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="px-8 py-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] font-bold text-sm transition-all"
            >
              <span>Explore All Capabilities</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest">Automation Modules</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)]">How We Eliminate Repetitive Overhead</h2>
          <p className="text-sm text-[var(--text-body)]">From customer support automation to automated lead qualification and document extraction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Bot className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Autonomous AI Customer & Sales Agents",
              desc: "Deploy 24/7 AI chat agents connected to your knowledge base, CRM, and calendar for instant qualified booking and Tier-1 support.",
              bullets: ["OpenAI & Anthropic LLM tuning", "Instant vector search & RAG", "Automated Calendly & CRM sync"]
            },
            {
              icon: <Workflow className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Multi-Step Workflow Automations",
              desc: "Connect your disparate SaaS tools (HubSpot, Stripe, Notion, Slack, Airtable) via automated n8n, Make.com, and custom Python microservices.",
              bullets: ["Zero-maintenance n8n hosting", "Complex conditional routing", "Instant error notification hooks"]
            },
            {
              icon: <FileText className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Intelligent Document & Data Pipelines",
              desc: "Automatically extract structured JSON data from PDFs, invoices, emails, and web sources directly into your SQL database or ERP.",
              bullets: ["OCR & Vision AI parsing", "Automated invoice reconciliation", "Continuous web scraper bots"]
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

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)]">
          Ready to Automate Your Business Operations?
        </h2>
        <p className="text-sm text-[var(--text-body)] max-w-xl mx-auto leading-relaxed">
          Tell us about your current manual workflows. We will provide an architecture diagram and automation scope within 24 hours.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-sm shadow-xl transition-all"
        >
          <span>Request Automation Architecture</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
