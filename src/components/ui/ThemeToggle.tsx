import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/* 
 * Theme Toggle Switch Component
 * Based on https://uiverse.io/lenin55/fast-chicken-43 (MIT License)
 * Designed with a 44x24px track and 200ms smooth sliding knob
 */

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <div className={`inline-flex items-center min-h-[44px] ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={toggleTheme}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A8C] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-page)] ${
          isDark ? 'bg-[#1F7A8C]' : 'bg-[#CBD5E1] dark:bg-slate-700'
        }`}
      >
        <span className="sr-only">Toggle dark mode</span>
        <span
          className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ${
            isDark ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        >
          {isDark ? (
            <Moon className="w-3 h-3 text-[#1F7A8C] fill-[#1F7A8C]" aria-hidden="true" />
          ) : (
            <Sun className="w-3 h-3 text-amber-500 fill-amber-500" aria-hidden="true" />
          )}
        </span>
      </button>
    </div>
  );
};
