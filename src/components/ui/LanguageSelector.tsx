import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe, Languages } from 'lucide-react';
import { LANGUAGES, LanguageOption } from '../../lib/i18n';
import { useLanguage } from '../../context/LanguageContext';

export const FlagIcon: React.FC<{ code: string; className?: string }> = ({ code, className = "w-4 h-3" }) => {
  switch (code) {
    case 'en':
      return (
        <svg viewBox="0 0 60 30" className={`${className} rounded-[2px] shadow-sm flex-shrink-0`}>
          <clipPath id="s_flag"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
          <clipPath id="t_flag"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
          <g clipPath="url(#s_flag)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t_flag)" stroke="#C8102E" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
          </g>
        </svg>
      );
    case 'de':
      return (
        <svg viewBox="0 0 5 3" className={`${className} rounded-[2px] shadow-sm flex-shrink-0`}>
          <rect width="5" height="3" y="0" x="0" fill="#000"/>
          <rect width="5" height="2" y="1" x="0" fill="#D00"/>
          <rect width="5" height="1" y="2" x="0" fill="#FFCE00"/>
        </svg>
      );
    case 'ar':
      return (
        <svg viewBox="0 0 12 6" className={`${className} rounded-[2px] shadow-sm flex-shrink-0`}>
          <rect width="12" height="2" fill="#00732f"/>
          <rect y="2" width="12" height="2" fill="#ffffff"/>
          <rect y="4" width="12" height="2" fill="#000000"/>
          <path d="M 0,0 4,3 0,6 Z" fill="#ff0000"/>
        </svg>
      );
    case 'es':
      return (
        <svg viewBox="0 0 3 2" className={`${className} rounded-[2px] shadow-sm flex-shrink-0`}>
          <rect width="3" height="2" fill="#c60b1e"/>
          <rect width="3" height="1" y="0.5" fill="#ffc400"/>
        </svg>
      );
    default:
      return <Globe className="w-3.5 h-3.5 text-[var(--brand-teal)]" />;
  }
};

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
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--brand-teal)] text-xs font-bold text-[var(--text-heading)] transition-all duration-150 shadow-sm cursor-pointer select-none group"
        aria-label={`Current language: ${activeOption.label}. Click to switch.`}
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-[var(--brand-teal)] flex-shrink-0 group-hover:scale-110 transition-transform duration-150" />
        <FlagIcon code={activeOption.code} />
        <span className="uppercase text-[11px] font-extrabold tracking-wide">{activeOption.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-150 ${isOpen ? 'rotate-180 text-[var(--brand-teal)]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider border-b border-[var(--border-subtle)] mb-1 flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
            <span>Select Language</span>
          </div>
          {LANGUAGES.map((lang: LanguageOption) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all duration-150 cursor-pointer ${
                lang.code === language
                  ? 'bg-[var(--brand-teal)] text-white font-bold shadow-sm'
                  : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FlagIcon code={lang.code} className="w-4 h-3" />
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
