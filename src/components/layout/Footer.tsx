import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#071e26] border-t border-[#1e4a5d] pt-16 pb-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-[#1e4a5d]">

          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a7a8c] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M2 8h8M2 12h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-display font-extrabold text-xl text-white">DigiHust</span>
            </div>
            <p className="text-sm font-semibold text-[#bde0fe] uppercase tracking-widest">Hustle. Create. Deliver.</p>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Digital services for businesses, creators, startups and individuals. One company. Multiple digital skills.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              {[
                { label: 'LinkedIn', icon: 'in', href: '#' },
                { label: 'Instagram', icon: 'ig', href: '#' },
                { label: 'Facebook', icon: 'fb', href: '#' },
                { label: 'GitHub', icon: 'gh', href: '#' },
              ].map(s => (
                <a key={s.label} href={s.href} title={s.label}
                  className="w-9 h-9 rounded-lg bg-[#0d2833] border border-[#1e4a5d] hover:border-[#1a7a8c] hover:bg-[#1a7a8c]/20 flex items-center justify-center text-[10px] font-black text-slate-400 hover:text-[#bde0fe] transition-all uppercase">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-widest">Services</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {['Web Development', 'Graphic Design', 'AI & Automation', 'Digital Marketing', 'Cybersecurity', 'Digital Solutions'].map(s => (
                <li key={s}>
                  <Link to="/services" className="hover:text-[#bde0fe] transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-widest">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {[
                { label: 'Work', href: '/work' },
                { label: 'About DigiHust', href: '/about' },
                { label: 'How We Work', href: '/how-it-works' },
                { label: 'Our Team', href: '/team' },
                { label: 'Contact', href: '/contact' },
                { label: 'Client Portal →', href: '/dashboard' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-[#bde0fe] transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <p>© 2026 DigiHust. All rights reserved.</p>
          <p>Built on Digiskill talent. Delivered professionally.</p>
        </div>

      </div>
    </footer>
  );
};
