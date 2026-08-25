import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { LANGUAGES, LanguageOption } from '../../lib/i18n';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, activeOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--brand-teal)] text-xs font-bold text-[var(--text-heading)] transition-all shadow-sm cursor-pointer"
        aria-label={`Current language: ${activeOption.label}. Click to switch.`}
        aria-expanded={isOpen}
      >
        <span className="text-sm">{activeOption.flag}</span>
        <span className="uppercase text-[11px] font-extrabold tracking-wide">{activeOption.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider border-b border-[var(--border-subtle)] mb-1">
            Select Language
          </div>
          {LANGUAGES.map((lang: LanguageOption) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                lang.code === language
                  ? 'bg-[var(--brand-teal)] text-white font-bold shadow-sm'
                  : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {lang.code === language && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
