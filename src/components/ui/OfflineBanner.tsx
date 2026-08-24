import React, { useState, useEffect } from 'react';
import { WifiOff, RotateCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-black px-4 py-2 text-xs md:text-sm font-bold flex items-center justify-between shadow-lg"
      >
        <div className="flex items-center space-x-2.5 mx-auto">
          <WifiOff className="w-4 h-4 animate-bounce" />
          <span>You appear to be offline. Some live interactions and form submissions may be paused.</span>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center space-x-1 underline hover:opacity-80 ml-2"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-black/10 rounded"
          aria-label="Dismiss offline warning"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
