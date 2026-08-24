import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#1e4a5d] bg-[#071e26] pt-16 pb-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-[#1e4a5d]">

          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#1a7a8c] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 3.5h12M1 7h8M1 10.5h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-display font-extrabold text-xl text-white">DigiHust</span>
            </div>
            <p className="text-xs font-bold text-[#bde0fe] uppercase tracking-[0.2em]">Hustle. Create. Deliver.</p>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Digital services for businesses, creators, startups and individuals. One company. Multiple digital skills.
            </p>
            {/* Social */}
            <div className="flex items-center gap-2 pt-1">
              {[
                { label: 'LinkedIn', icon: 'in' },
                { label: 'Instagram', icon: 'ig' },
                { label: 'Facebook', icon: 'fb' },
                { label: 'GitHub', icon: 'gh' },
              ].map(s => (
                <a key={s.label} href="#" title={s.label}
                  className="w-8 h-8 rounded-lg bg-[#0d2833] border border-[#1e4a5d] hover:border-[#1a7a8c] hover:bg-[#1a7a8c]/20 flex items-center justify-center text-[9px] font-black text-slate-500 hover:text-[#bde0fe] transition-all uppercase">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold text-white uppercase tracking-widest">Services</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {['Web Development', 'Graphic Design', 'AI & Automation', 'Digital Marketing', 'Cybersecurity', 'Digital Solutions'].map(s => (
                <li key={s}><a href="#services" className="hover:text-[#bde0fe] transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold text-white uppercase tracking-widest">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {[
                { label: 'Our Work',     href: '#work' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Our Team',     href: '#team' },
                { label: 'Pricing',      href: '#pricing' },
                { label: 'FAQs',         href: '#faqs' },
                { label: 'Get a Quote',  href: '#contact' },
                { label: 'Client Portal →', href: '/dashboard' },
              ].map(l => (
                <li key={l.label}><a href={l.href} className="hover:text-[#bde0fe] transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-600">
          <p>© 2026 DigiHust. All rights reserved.</p>
          <p>Built on Digiskill talent. Delivered professionally.</p>
        </div>

      </div>
    </footer>
  );
};
