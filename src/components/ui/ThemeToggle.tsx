import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      tabIndex={0}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex items-center h-8 w-15 p-0.5 rounded-full border transition-colors cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] ${
        isDark
          ? 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
          : 'bg-[var(--bg-subtle)] border-[var(--border-subtle)]'
      } ${className}`}
    >
      {/* Background Subtle Track Glows */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none overflow-hidden rounded-full">
        {isDark ? (
          <>
            <span className="text-[8px] text-[var(--brand-teal)] ml-0.5 opacity-60">★</span>
            <span className="text-[6px] text-cyan-300 mr-0.5 opacity-50">✦</span>
          </>
        ) : (
          <>
            <span className="w-1 h-1 rounded-full bg-[var(--brand-teal)]/30 ml-0.5" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-teal)]/40 mr-0.5" />
          </>
        )}
      </div>

      {/* Spring Thumb */}
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
        className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all ${
          isDark
            ? 'bg-[var(--brand-teal)] text-white ml-auto shadow-[0_0_10px_rgba(31,122,140,0.5)]'
            : 'bg-white dark:bg-slate-900 text-[var(--brand-teal)] mr-auto border border-[var(--border-subtle)]'
        }`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 fill-white text-white" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-[var(--brand-teal)] fill-[var(--brand-teal)]/20" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
};
