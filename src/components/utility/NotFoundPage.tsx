import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowRight, Search, HelpCircle, Compass } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 min-h-[85vh] flex items-center justify-center px-6 lg:px-8 bg-[var(--bg-page)] relative overflow-hidden">
      <SEOHead
        title="404 — Page Not Found"
        description="The page or digital asset you are looking for has moved or does not exist on DigiHust."
      />

      {/* Decorative gradient sphere */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--brand-teal)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl mb-8"
        >
          <Compass className="w-12 h-12 text-[var(--text-heading)] animate-pulse" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-xs font-black text-[var(--brand-teal)] uppercase tracking-widest mb-3"
        >
          Error 404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-display font-extrabold text-4xl sm:text-6xl text-white mb-6 leading-tight"
        >
          Lost in Digital Space.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-base sm:text-lg text-[var(--text-body)] max-w-lg mx-auto leading-relaxed mb-10"
        >
          The page or route you were looking for doesn't exist, may have been relocated, or is currently under architectural refactoring.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold shadow-lg transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/services"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-body)] font-bold hover:bg-[var(--brand-teal)]/10 transition-all"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Quick links directory */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="pt-8 border-t border-[var(--border-subtle)]/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-[var(--text-muted)]"
        >
          {[
            { label: 'Our Work', href: '/work' },
            { label: 'How We Work', href: '/how-it-works' },
            { label: 'Our Team', href: '/team' },
            { label: 'Get a Quote', href: '/contact' },
          ].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] hover:text-[var(--text-heading)] transition-all"
            >
              {item.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
