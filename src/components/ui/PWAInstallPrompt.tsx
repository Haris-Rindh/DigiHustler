import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user already dismissed install in current session
    const isDismissed = sessionStorage.getItem('digihust_pwa_dismissed');
    if (isDismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a pleasant 3-second delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setShowPrompt(false);
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      sessionStorage.setItem('digihust_pwa_dismissed', 'true');
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('digihust_pwa_dismissed', 'true');
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className="fixed bottom-4 left-4 z-50 p-4 rounded-2xl bg-[#0d2833]/95 backdrop-blur-md border border-[#1a7a8c] shadow-2xl text-white max-w-sm flex items-center justify-between gap-3.5"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a7a8c] to-[#0ea5e9] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white flex items-center gap-1">
              <span>Install DigiHust App</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </h4>
            <p className="text-[11px] text-slate-300">Fast, offline-ready desktop & mobile portal</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-lg bg-[#1a7a8c] hover:bg-[#156575] text-white font-bold text-xs shadow transition-colors"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Dismiss PWA prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
