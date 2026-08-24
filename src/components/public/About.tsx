import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Target, Zap, Rocket } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

export const About: React.FC = () => {
  return (
    <div className="pt-16">
      <SEOHead
        title="About DigiHust — Our Origin, Mission & Team Model"
        description="Learn how DigiHust was founded inside the Digiskill ecosystem to bridge Pakistani digital talent with international client opportunities under one managed entity."
      />

      {/* Header */}
      <section className="bg-[#071e26] py-20 px-6 lg:px-8 border-b border-[#1e4a5d]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">
              The Story & Mission
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-5">
              The DigiHust Mission.
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Founded inside Pakistan's Digiskill community to replace isolated freelance hustling with managed, world-class project delivery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-white py-20 px-6 lg:px-8">
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
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 mb-6 leading-tight">
              Exceptional Talent. Broken Freelance Marketplaces.
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-4">
              Pakistan produces thousands of skilled software engineers, brand designers, and AI practitioners every year. Yet, on traditional gig marketplaces, individual freelancers are trapped in races to the bottom on price, working in isolated silos without project management support.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
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
                className="p-6 rounded-2xl border border-gray-200 bg-gray-50/70 hover:bg-white hover:shadow-md transition-all flex items-start space-x-5"
              >
                <div className="font-display font-black text-3xl sm:text-4xl text-[#1a7a8c] flex-shrink-0">
                  {s.stat}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">{s.title}</h3>
                  <p className="text-xs text-gray-500">{s.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="bg-[#071e26] py-20 px-6 lg:px-8 border-y border-[#1e4a5d]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">
              The DigiHust Architecture
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-6 leading-tight">
              A Sustainable Bridge Between Talent & Enterprise Demand.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed mb-4">
              DigiHust operates as a centralized management and delivery engine. We acquire clients centrally, architect technical solutions, and route development directly to specialized squads.
            </p>
            <p className="text-base text-slate-300 leading-relaxed">
              Clients receive agency-grade reliability, transparent communication, and structured delivery. Our specialists receive consistent work, fair compensation splits, and a supportive team environment.
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
                icon: <Target className="w-5 h-5 text-[#bde0fe]" />,
                title: 'Centralized Client Acquisition',
                desc: 'Single contract, professional scoping, and dedicated management oversight.',
              },
              {
                icon: <Zap className="w-5 h-5 text-amber-400" />,
                title: 'Specialized Squads, Not Generalists',
                desc: 'Every project receives domain specialists matched to their exact tech requirements.',
              },
              {
                icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
                title: 'Transparent Ledger Payouts',
                desc: 'Fair, contribution-based revenue distribution calculated and recorded on internal ledgers.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-2xl bg-[#0d2833] border border-[#1e4a5d] flex items-start space-x-4"
              >
                <div className="p-2 rounded-xl bg-[#071e26] border border-[#1e4a5d] flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Values (Hustle. Create. Deliver.) */}
      <section className="bg-white py-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">
            Core Principles
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 mb-12">
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
                className="p-8 rounded-3xl border border-gray-200 bg-white hover:shadow-xl hover:border-[#1a7a8c]/40 transition-all"
              >
                <span className="text-xs font-bold text-[#1a7a8c] uppercase tracking-wider">
                  {val.tag}
                </span>
                <h3 className="font-display font-black text-3xl text-gray-900 my-2">
                  {val.word}.
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#071e26] py-20 px-6 lg:px-8 text-center border-t border-[#1e4a5d]">
        <h2 className="font-display font-extrabold text-3xl text-white mb-4">
          Partner with DigiHust
        </h2>
        <p className="text-slate-300 mb-8 max-w-md mx-auto">
          Whether you need a dedicated development squad or a complete brand overhaul, we are ready.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-bold shadow-lg transition-all"
        >
          <span>Get a Scoped Quote</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
