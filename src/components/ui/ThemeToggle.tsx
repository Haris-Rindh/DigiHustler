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
      className={`relative inline-flex items-center h-9 w-16 p-1 rounded-full border transition-colors cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${
        isDark
          ? 'bg-[var(--color-surface)] border-[var(--color-border)]'
          : 'bg-[#E1E5F2] border-[var(--color-border)]'
      } ${className}`}
    >
      {/* Background Subtle Indicators */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none overflow-hidden rounded-full">
        {isDark ? (
          <>
            <span className="text-[9px] text-[#B08D57] ml-0.5 opacity-75">★</span>
            <span className="text-[7px] text-[#E1E5F2] mr-0.5 opacity-50">✦</span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57]/40 ml-0.5" />
            <span className="w-1 h-1 rounded-full bg-[#1F7A8C]/30 mr-0.5" />
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
        className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-colors ${
          isDark
            ? 'bg-[#1F7A8C] text-[#EFF1F5] ml-auto'
            : 'bg-[#B08D57] text-[#022B3A] mr-auto'
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
            <Moon className="w-3.5 h-3.5 fill-[#EFF1F5] text-[#EFF1F5]" />
          ) : (
            <Sun className="w-3.5 h-3.5 fill-[#022B3A] text-[#022B3A]" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
};
