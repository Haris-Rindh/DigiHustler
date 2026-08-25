import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { LANGUAGES, LanguageCode, LanguageOption } from '../../lib/i18n';

export const LanguageSelector: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('digihust_lang') as LanguageCode | null;
    return saved || 'en';
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('digihust_lang', currentLang);
    const active = LANGUAGES.find((l) => l.code === currentLang);
    if (active) {
      document.documentElement.dir = active.dir;
      document.documentElement.lang = active.code;
    }
  }, [currentLang]);

  const activeOption = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-[#1e4a5d] bg-[#0d2833]/80 hover:border-[#1a7a8c] text-xs font-bold text-slate-200 transition-colors"
        aria-label="Select Language"
      >
        <span>{activeOption.flag}</span>
        <span className="uppercase text-[10px]">{activeOption.code}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#0d2833] border border-[#1e4a5d] shadow-2xl p-1.5 z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setCurrentLang(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors ${
                lang.code === currentLang
                  ? 'bg-[#1a7a8c] text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
