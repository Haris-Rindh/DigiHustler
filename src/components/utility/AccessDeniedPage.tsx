import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Lock, ArrowRight } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

export const AccessDeniedPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 min-h-[85vh] flex items-center justify-center px-6 lg:px-8 bg-[var(--bg-page)] relative overflow-hidden">
      <SEOHead
        title="403 — Access Denied"
        description="You do not possess the required security permissions to access this internal DigiHust node."
      />

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[var(--bg-surface)] border border-amber-500/40 shadow-2xl mb-8"
        >
          <ShieldAlert className="w-12 h-12 text-amber-400" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3"
        >
          Error 403 · Restricted Area
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-display font-extrabold text-4xl sm:text-6xl text-white mb-6 leading-tight"
        >
          Access Level Insufficient.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-base sm:text-lg text-[var(--text-body)] max-w-lg mx-auto leading-relaxed mb-10"
        >
          This module requires verified internal authorization (Executive Management or Group Leader tier). If you believe this is an error, please verify your session role.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <Link
            to="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold shadow-lg transition-all"
          >
            <Lock className="w-4 h-4" />
            <span>Open Client Portal</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-body)] font-bold hover:bg-[var(--brand-teal)]/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Site</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
