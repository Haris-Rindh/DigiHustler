import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Palette, CheckCircle2, ArrowRight, Layout, Sparkles, 
  Layers, Eye, Smartphone, Box, ShieldCheck 
} from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';

export const DesignSystemLanding: React.FC = () => {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="Brand Identity & High-Converting UI/UX Design Systems | DigiHust"
        description="Transform your digital presence with enterprise brand identity systems, Figma design tokens, responsive UI/UX prototypes, and 3D motion graphics created by DigiHust's Creative Squad."
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
            <span>Creative Direction & Production Design Systems</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] leading-tight tracking-tight"
          >
            Establish Visual Authority <br className="hidden sm:block" />
            <span className="text-[var(--brand-teal)]">With World-Class Brand & UI/UX Systems.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[var(--text-body)] max-w-3xl mx-auto leading-relaxed"
          >
            From complete typography & vector logo guidelines to comprehensive Figma component token libraries and 3D motion trailers—DigiHust crafts digital experiences that command premium market positioning.
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
              <span>Scope Your Design Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/work"
              className="px-8 py-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] font-bold text-sm transition-all"
            >
              <span>View Brand Case Studies</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Deliverables Grid */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest">Creative Capabilities</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)]">Comprehensive Brand & Product Design</h2>
          <p className="text-sm text-[var(--text-body)]">Engineered in Figma, Illustrator, and After Effects for immediate developer handoff.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Palette className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Brand Identity & Guidelines",
              desc: "Complete visual identity, vector logo suite, typography hierarchy, color theory, and 50+ page brand book.",
              bullets: ["Primary & secondary logo marks", "Social kit & presentation decks", "Full commercial vector licensing"]
            },
            {
              icon: <Layout className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "Figma UI/UX & Design Systems",
              desc: "Pixel-perfect web and mobile wireframes, auto-layout responsive components, and interactive prototypes.",
              bullets: ["Design tokens & variables", "Developer-ready Tailwind handoff", "WCAG AAA accessible contrast"]
            },
            {
              icon: <Box className="w-6 h-6 text-[var(--brand-teal)]" />,
              title: "3D Assets & Motion Graphics",
              desc: "Cinema 4D product renders, After Effects animated teasers, and SVG micro-interactions for modern web platforms.",
              bullets: ["4K promotional video teasers", "Lottie animated UI micro-interactions", "Realistic 3D device mockups"]
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
          Elevate Your Brand with DigiHust
        </h2>
        <p className="text-sm text-[var(--text-body)] max-w-xl mx-auto leading-relaxed">
          Ready to revamp your website interface or build an iconic brand identity? Request a custom proposal today.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-sm shadow-xl transition-all"
        >
          <span>Start Your Creative Project</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
