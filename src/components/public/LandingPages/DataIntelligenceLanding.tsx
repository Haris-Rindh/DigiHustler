import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Database, LineChart, Workflow, Cpu, Zap, 
  PieChart, Server, CheckCircle2, ArrowRight, BarChart2
} from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';

export const DataIntelligenceLanding: React.FC = () => {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="Business Intelligence, ETL & Executive Dashboards | DigiHust"
        description="Transform raw databases into real-time business intelligence with custom Python ETL pipelines, SQL warehouses, and interactive PowerBI and Tableau executive dashboards."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Business Intelligence & Data Intelligence',
          provider: {
            '@type': 'Organization',
            name: 'DigiHust',
            url: 'https://www.digihust.tech'
          },
          areaServed: 'Global',
          description: 'Custom ETL data pipelines, PowerBI executive suites, SQL data warehouses, and automated operational analytics.',
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
            <span>Data Engineering & Business Intelligence Squad</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] leading-tight tracking-tight"
          >
            Transform Disparate Data <br className="hidden sm:block" />
            <span className="text-[var(--brand-teal)]">Into Actionable Executive Intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[var(--text-body)] max-w-3xl mx-auto leading-relaxed"
          >
            Stop making strategic decisions based on stale spreadsheets. DigiHust engineers automated Python ETL pipelines, centralized SQL data warehouses, and real-time PowerBI dashboards that give leadership crystal-clear operational visibility.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/contact?service=BI%20%26%20Data%20Intelligence"
              className="flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <span>Scope Your BI Architecture</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/portfolio/hospital-bi-dashboard"
              className="px-8 py-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] font-bold text-sm transition-all"
            >
              <span>View Titan Healthcare Case Study</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest">Data Architecture</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)]">End-to-End Analytics & Pipeline Engineering</h2>
          <p className="text-sm text-[var(--text-body)]">Engineered for sub-second query performance and seamless cross-platform syncing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Server className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Automated ETL & Warehousing",
              desc: "Consolidate fragmented SQL, PostgreSQL, CRM, and Stripe databases into an optimized data warehouse with zero manual intervention.",
              bullets: ["Python & Airflow ETL pipelines", "PostgreSQL / Snowflake optimization", "Automated daily reconciliation"]
            },
            {
              icon: <BarChart2 className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Executive PowerBI & Tableau Suites",
              desc: "Interactive dashboards tailored for C-suite and department heads with drill-down metrics, revenue forecasting, and cohort retention.",
              bullets: ["Custom PowerBI DAX modeling", "Interactive cross-filtering", "Mobile responsive viewports"]
            },
            {
              icon: <Workflow className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Predictive Telemetry & Alerts",
              desc: "Automated operational anomaly detection, Slack/email KPI threshold alerts, and machine-learning churn predictions.",
              bullets: ["Automated threshold triggers", "Daily executive digest emails", "Predictive churn & LTV modeling"]
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

      {/* Results & Performance Metrics */}
      <section className="py-16 px-6 lg:px-8 border-y border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { metric: '12+ hrs', label: 'Saved Weekly on Reporting' },
            { metric: '<800ms', label: 'Average Dashboard Query Speed' },
            { metric: '100%', label: 'Data Accuracy Reconciliation' },
            { metric: 'Single', label: 'Unified Source of Truth' },
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
          Unlock the Power of Your Data
        </h2>
        <p className="text-sm text-[var(--text-body)] max-w-xl mx-auto leading-relaxed">
          Ready to eliminate manual reporting and gain real-time visibility across your company? Request a tailored BI architecture consultation.
        </p>
        <Link
          to="/contact?service=BI%20%26%20Data%20Intelligence"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <span>Request a Data Proposal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
