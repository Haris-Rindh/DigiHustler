import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, CheckCircle2, Clock, Mail } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

export const MaintenancePage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 min-h-[85vh] flex items-center justify-center px-6 lg:px-8 bg-[#071e26] relative overflow-hidden">
      <SEOHead
        title="Scheduled System Maintenance"
        description="DigiHust platform is currently undergoing a scheduled architectural upgrade. We will return shortly."
      />

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[#0d2833] border border-[#1a7a8c]/40 shadow-2xl mb-8"
        >
          <Wrench className="w-12 h-12 text-[#bde0fe] animate-spin" style={{ animationDuration: '8s' }} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-xs font-black text-[#1a7a8c] uppercase tracking-widest mb-3"
        >
          Scheduled Architecture Upgrade
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-display font-extrabold text-4xl sm:text-6xl text-white mb-6 leading-tight"
        >
          Upgrading Our Infrastructure.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-base sm:text-lg text-slate-300 max-w-lg mx-auto leading-relaxed mb-10"
        >
          We are currently deploying performance optimizations and real-time ledger pipeline upgrades. Systems are expected to be fully restored within the maintenance window.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-10 text-left"
        >
          <div className="p-4 rounded-xl bg-[#0d2833] border border-[#1e4a5d]">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#bde0fe] mb-1">
              <Clock className="w-4 h-4 text-[#1a7a8c]" />
              <span>Estimated Window</span>
            </div>
            <p className="text-sm font-extrabold text-white">~30 Minutes</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0d2833] border border-[#1e4a5d]">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Data Integrity</span>
            </div>
            <p className="text-sm font-extrabold text-white">100% Secured</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="p-4 rounded-xl bg-[#0d2833] border border-[#1e4a5d] inline-flex items-center space-x-3 text-xs text-slate-400"
        >
          <Mail className="w-4 h-4 text-[#bde0fe]" />
          <span>Need urgent client coordination? Reach us at <a href="mailto:urgent@digihust.com" className="text-[#bde0fe] font-bold underline">urgent@digihust.com</a></span>
        </motion.div>
      </div>
    </div>
  );
};
