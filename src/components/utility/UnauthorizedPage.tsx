import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, ArrowRight, UserCheck } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 min-h-[85vh] flex items-center justify-center px-6 lg:px-8 bg-[var(--color-bg)] relative overflow-hidden">
      <SEOHead
        title="401 — Authentication Required"
        description="Please authenticate with your DigiHust credentials to access this internal portal workspace."
      />

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-accent)]/40 shadow-2xl mb-8"
        >
          <KeyRound className="w-12 h-12 text-[var(--color-text-primary)]" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-xs font-black text-[var(--color-accent)] uppercase tracking-widest mb-3"
        >
          Error 401 · Credentials Required
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-display font-extrabold text-4xl sm:text-6xl text-white mb-6 leading-tight"
        >
          Authentication Required.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-base sm:text-lg text-slate-300 max-w-lg mx-auto leading-relaxed mb-10"
        >
          This workspace is protected for DigiHust clients and team members. Please verify your session identity or access the internal portal switcher.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <Link
            to="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-[var(--color-accent-fill)] hover:bg-[var(--color-accent-hover)] text-white font-bold shadow-lg transition-all"
          >
            <UserCheck className="w-4 h-4" />
            <span>Launch Client Portal</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)] text-slate-200 font-bold hover:bg-[var(--color-accent-fill)]/10 transition-all"
          >
            <span>Explore Public Site</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
