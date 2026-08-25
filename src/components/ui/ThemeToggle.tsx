import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
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
      className={`relative inline-flex items-center h-9 w-16 p-1 rounded-full border transition-colors cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#1a7a8c] ${
        isDark
          ? 'bg-[#071e26] border-[#1e4a5d]'
          : 'bg-[#e5eff2] border-[#cbdfe6]'
      } ${className}`}
    >
      {/* Background Micro-stars for dark / Sunburst for light */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none overflow-hidden rounded-full">
        {isDark ? (
          <>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-[9px] text-amber-200 ml-1"
            >
              ★
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.4, scale: 0.8 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-[7px] text-[#bde0fe] mr-1"
            >
              ✦
            </motion.span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/40 ml-1.5 animate-pulse" />
            <span className="w-1 h-1 rounded-full bg-sky-400/40 mr-1.5" />
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
        className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors ${
          isDark
            ? 'bg-gradient-to-br from-[#1a7a8c] to-[#0ea5e9] text-white ml-auto'
            : 'bg-gradient-to-br from-amber-400 to-orange-400 text-slate-900 mr-auto'
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
            <Sun className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
};
