import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Search, Target, Megaphone, BarChart3, 
  ArrowRight, CheckCircle2, Globe, Share2, Zap, Award
} from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';

export const DigitalMarketingLanding: React.FC = () => {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="Growth Marketing & Technical SEO Services | DigiHust"
        description="Drive high-intent organic traffic, scale paid ad conversions, and dominate search rankings. Dedicated growth marketing and technical SEO squads with managed milestone SLAs."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Growth Marketing & Technical SEO',
          provider: {
            '@type': 'Organization',
            name: 'DigiHust',
            url: 'https://www.digihust.tech'
          },
          areaServed: 'Global',
          description: 'Data-driven search engine optimization, programmatic content strategies, and high-converting paid ad campaigns.',
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
            <span>Performance Growth & Technical Acquisition Squad</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] leading-tight tracking-tight"
          >
            Accelerate Revenue & Acquisition <br className="hidden sm:block" />
            <span className="text-[var(--brand-teal)]">With High-Performance Marketing & SEO.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[var(--text-body)] max-w-3xl mx-auto leading-relaxed"
          >
            Move beyond guesswork marketing. DigiHust deploys technical SEO architects, PPC media buyers, and conversion copywriters under unified sprint leadership to build sustainable, scalable inbound revenue funnels.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/contact?service=Digital%20Marketing%20%26%20SEO"
              className="flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <span>Scope Your Growth Strategy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/portfolio"
              className="px-8 py-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] font-bold text-sm transition-all"
            >
              <span>Explore Marketing Case Studies</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Growth Capabilities Grid */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest">Growth Engine</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)]">Full-Funnel Acquisition Capabilities</h2>
          <p className="text-sm text-[var(--text-body)]">Engineered for organic dominance, algorithmic resilience, and verifiable ROAS.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Search className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Technical & Programmatic SEO",
              desc: "Deep Core Web Vitals optimization, semantic schema architectures, internal link graphs, and indexing strategies that secure top-tier organic visibility.",
              bullets: ["Core Web Vitals & speed audits", "Schema markup & AI search readiness", "Zero-footprint backlink acquisition"]
            },
            {
              icon: <Target className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "High-ROAS Paid Campaigns",
              desc: "Multi-channel media buying across Google Search, Meta, and LinkedIn with continuous A/B creative testing and server-side conversion tracking.",
              bullets: ["Granular audience segmentation", "Server-side CAPI event tracking", "High-converting ad copy & visuals"]
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "B2B Outbound & Inbound Funnels",
              desc: "Cold email deliverability infrastructure, technical thought-leadership content, and landing page conversion rate optimization (CRO).",
              bullets: ["Dedicated domain email warmup", "High-converting landing pages", "Automated CRM lead routing"]
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

      {/* Metrics & Results Proof */}
      <section className="py-16 px-6 lg:px-8 border-y border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { metric: '+240%', label: 'Avg. Organic Traffic Lift' },
            { metric: '4.2x', label: 'Average Campaign ROAS' },
            { metric: '<24h', label: 'Campaign Launch Velocity' },
            { metric: '100%', label: 'Attribution Transparency' },
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
          Ready to Scale Your Acquisition Engine?
        </h2>
        <p className="text-sm text-[var(--text-body)] max-w-xl mx-auto leading-relaxed">
          Get a comprehensive marketing audit, tailored keyword roadmap, and milestone-backed growth sprint designed for your business.
        </p>
        <Link
          to="/contact?service=Digital%20Marketing%20%26%20SEO"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <span>Request a Growth Proposal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
