import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RotateCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

export const OfflinePage: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<'offline' | 'online'>(navigator.onLine ? 'online' : 'offline');

  const checkConnection = () => {
    setChecking(true);
    setTimeout(() => {
      if (navigator.onLine) {
        setStatus('online');
        window.location.href = '/';
      } else {
        setStatus('offline');
      }
      setChecking(false);
    }, 1000);
  };

  return (
    <div className="pt-24 pb-20 min-h-[85vh] flex items-center justify-center px-6 lg:px-8 bg-[var(--bg-page)] relative overflow-hidden">
      <SEOHead
        title="Offline — Network Connection Lost"
        description="Your internet connection appears to be offline. Reconnect to browse DigiHust."
      />

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[var(--bg-surface)] border border-amber-500/40 shadow-2xl mb-8"
        >
          <WifiOff className="w-12 h-12 text-amber-400" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3"
        >
          Connection Interrupted
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-display font-extrabold text-4xl sm:text-6xl text-white mb-6 leading-tight"
        >
          You Are Currently Offline.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-base sm:text-lg text-[var(--text-body)] max-w-lg mx-auto leading-relaxed mb-10"
        >
          We couldn't reach the network. Please check your Wi-Fi, mobile data, or router connection and try again.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <button
            onClick={checkConnection}
            disabled={checking}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold shadow-lg transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Testing Connection...' : 'Test Connection Again'}</span>
          </button>
        </motion.div>

        {status === 'online' ? (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 inline-flex items-center space-x-2 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="w-4 h-4" />
            <span>Connection restored! Redirecting...</span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] inline-flex items-center space-x-2 text-xs text-[var(--text-muted)]">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Cached project brief drafts remain safe in your local browser storage.</span>
          </div>
        )}
      </div>
    </div>
  );
};
