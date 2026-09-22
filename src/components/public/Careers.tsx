import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { useApp } from '../../context/AppContext';

export const Careers: React.FC = () => {
  const { siteContent } = useApp();

  // Extract career data from CMS if available, otherwise fallback
  const careersData = siteContent?.careers || {
    noPositionsMessage: "We're always looking for exceptional talent, but we don't have any open positions right now. Check back soon!",
    openPositions: []
  };

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="Careers at DigiHust | Join our Digital Squad"
        description="Join DigiHust and work on cutting-edge Web Development, AI Automation, and Design Systems. See our open positions."
      />

      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)] overflow-hidden bg-gradient-to-b from-[var(--bg-subtle)] to-[var(--bg-page)]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/40 text-[var(--brand-teal)] text-xs font-bold uppercase tracking-wider mx-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Our Mission</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] leading-tight tracking-tight"
          >
            Build the future of digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-teal)] to-blue-500">with DigiHust.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed"
          >
            We are a collective of engineers, designers, and strategists delivering high-impact solutions for international clients.
          </motion.p>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {careersData.openPositions && careersData.openPositions.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[var(--text-heading)]">Open Roles</h2>
              <div className="grid grid-cols-1 gap-4">
                {careersData.openPositions.map((job: any, index: number) => (
                  <div key={index} className="p-6 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-[var(--text-heading)]">{job.title}</h3>
                      <p className="text-sm text-[var(--text-muted)] mt-1">{job.department} · {job.location}</p>
                    </div>
                    <button className="px-5 py-2.5 rounded-xl bg-[var(--text-heading)] text-[var(--bg-page)] text-sm font-bold flex items-center justify-center space-x-2 hover:bg-[var(--brand-teal)] transition-colors">
                      <span>Apply Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16 px-6 rounded-3xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-heading)] mb-3">No open positions currently available</h3>
              <p className="text-[var(--text-muted)] max-w-lg mx-auto">
                {careersData.noPositionsMessage}
              </p>

              <div className="mt-8 pt-8 border-t border-[var(--border-subtle)]">
                <p className="text-sm text-[var(--text-muted)]">
                  Think you'd be a great fit anyway? Send your resume to <a href="mailto:digihust@gmail.com" className="text-[var(--brand-teal)] hover:underline font-medium">digihust@gmail.com</a>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};
