import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ServerCrash, RotateCw, Mail, Home } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

export const ServerErrorPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 min-h-[85vh] flex items-center justify-center px-6 lg:px-8 bg-[var(--bg-page)] relative overflow-hidden">
      <SEOHead
        title="500 — Internal Server Issue"
        description="We encountered an unexpected digital processing issue. Our engineering team has been notified."
      />

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[var(--bg-surface)] border border-rose-500/30 shadow-2xl mb-8"
        >
          <ServerCrash className="w-12 h-12 text-rose-400" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-xs font-black text-rose-400 uppercase tracking-widest mb-3"
        >
          Error 500 · Server Anomaly
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-display font-extrabold text-4xl sm:text-6xl text-white mb-6 leading-tight"
        >
          Something Went Wrong On Our End.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-base sm:text-lg text-[var(--text-body)] max-w-lg mx-auto leading-relaxed mb-10"
        >
          Our services experienced an unexpected processing error. Your input has not been lost, but you may need to reload or try again shortly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold shadow-lg transition-all"
          >
            <RotateCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-body)] font-bold hover:bg-[var(--brand-teal)]/10 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] inline-flex items-center space-x-3 text-xs text-[var(--text-muted)]"
        >
          <Mail className="w-4 h-4 text-[var(--text-heading)]" />
          <span>If this persists, alert us directly at <a href="mailto:support@digihust.com" className="text-[var(--text-heading)] font-bold underline">support@digihust.com</a></span>
        </motion.div>
      </div>
    </div>
  );
};
