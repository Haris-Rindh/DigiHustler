import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Target, Zap, Rocket } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

import { useApp } from '../../context/AppContext';

export const About: React.FC = () => {
  const { siteContent } = useApp();
  const aboutData = siteContent?.about;

  return (
    <div className="pt-16">
      <SEOHead
        title="About DigiHust — Our Origin, Mission & Team Model"
        description="Learn how DigiHust was founded inside the Digiskill ecosystem to bridge Pakistani digital talent with international client opportunities under one managed entity."
      />

      {/* Header */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">
              The Story & Mission
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] mb-5">
              The DigiHust Mission.
            </h1>
            <p className="text-lg text-[var(--text-body)] max-w-2xl leading-relaxed">
              {aboutData?.mission || "Founded inside Pakistan's Digiskill community to replace isolated freelance hustling with managed, world-class project delivery."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-extrabold text-rose-500 uppercase tracking-widest mb-3">
              The Market Dilemma
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mb-6 leading-tight">
              Exceptional Talent. Broken Freelance Marketplaces.
            </h2>
            <p className="text-base text-[var(--text-body)] leading-relaxed mb-4">
              Pakistan produces thousands of skilled software engineers, brand designers, and AI practitioners every year. Yet, on traditional gig marketplaces, individual freelancers are trapped in races to the bottom on price, working in isolated silos without project management support.
            </p>
            <p className="text-base text-[var(--text-body)] leading-relaxed">
              Simultaneously, international companies waste dozens of hours vetting unverified profiles, struggling through communication barriers, and trying to orchestrate multiple uncoordinated freelancers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {[
              {
                stat: '10,000+',
                title: 'Digiskill Graduates Sourced',
                sub: 'Vetted domain specialists ready for enterprise delivery',
              },
              {
                stat: '78%',
                title: 'Client Time Saved',
                sub: 'By interacting with one lead rather than five disparate freelancers',
              },
              {
                stat: '100%',
                title: 'Accountability Guaranteed',
                sub: 'Under single SLA contract with dedicated quality checkpoints',
              },
            ].map((s) => (
              <div
                key={s.title}
                className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] hover:shadow-md transition-all flex items-start space-x-5"
              >
                <div className="font-display font-black text-3xl sm:text-4xl text-[var(--brand-teal)] flex-shrink-0">
                  {s.stat}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-heading)] text-base mb-1">{s.title}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{s.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8 border-y border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">
              The DigiHust Architecture
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mb-6 leading-tight">
              A Sustainable Bridge Between Talent & Enterprise Demand.
            </h2>
            <p className="text-base text-[var(--text-body)] leading-relaxed mb-4">
              DigiHust operates as a centralized management and delivery engine. We acquire clients centrally, architect technical solutions, and route development directly to specialized squads.
            </p>
            <p className="text-base text-[var(--text-body)] leading-relaxed">
              Clients receive agency-grade reliability, transparent communication, and structured delivery. Our specialists receive continuous growth, mentorship, and a collaborative team environment.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {[
              {
                icon: <Target className="w-5 h-5 text-[var(--text-heading)]" />,
                title: 'Centralized Client Scoping',
                desc: 'Single point of contact, professional scoping, and dedicated sprint management.',
              },
              {
                icon: <Zap className="w-5 h-5 text-amber-400" />,
                title: 'Specialized Squads, Not Generalists',
                desc: 'Every project receives domain specialists matched to their exact tech requirements.',
              },
              {
                icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
                title: 'Verified Quality Standards',
                desc: 'Structured code reviews, strict staging QA passes, and verifiable credentials.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-start space-x-4"
              >
                <div className="p-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-heading)] text-base mb-1">{item.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Values (Hustle. Create. Deliver.) */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">
            Core Principles
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)] mb-12">
            How We Operate Every Day
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                word: 'Hustle',
                tag: 'Proactive Drive',
                desc: 'We do not wait for solutions to appear. We actively diagnose, prototype, and build with relentless urgency.',
              },
              {
                word: 'Create',
                tag: 'Craft & Precision',
                desc: 'We build with clean architectural discipline, intentional UI design, and production-grade maintainability.',
              },
              {
                word: 'Deliver',
                tag: 'Accountability',
                desc: 'Promises made are promises delivered. Every milestone is rigorously tested before client sign-off.',
              },
            ].map((val) => (
              <motion.div
                key={val.word}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:shadow-xl hover:border-[var(--brand-teal)]/40 transition-all"
              >
                <span className="text-xs font-bold text-[var(--brand-teal)] uppercase tracking-wider">
                  {val.tag}
                </span>
                <h3 className="font-display font-black text-3xl text-[var(--text-heading)] my-2">
                  {val.word}.
                </h3>
                <p className="text-sm text-[var(--text-body)] leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--bg-page)] py-20 px-6 lg:px-8 text-center border-t border-[var(--border-subtle)]">
        <h2 className="font-display font-extrabold text-3xl text-[var(--text-heading)] mb-4">
          Partner with DigiHust
        </h2>
        <p className="text-[var(--text-body)] mb-8 max-w-md mx-auto">
          Whether you need a dedicated development squad or a complete brand overhaul, we are ready.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold shadow-lg transition-all"
        >
          <span>Get a Scoped Quote</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
