import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--bg-page)] border-t border-[var(--border-subtle)] pt-16 pb-10 px-6 lg:px-8 relative overflow-hidden" aria-label="Site Footer">
      {/* Subtle top ambient border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10 pb-12 border-b border-[var(--border-subtle)]">

          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#022B3A] via-[#1F7A8C] to-[#E1E5F2] flex items-center justify-center shadow-md">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M2 8h8M2 12h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-display font-extrabold text-xl text-[var(--text-heading)] group-hover:text-[var(--text-heading)] transition-colors">
                DigiHust
              </span>
            </Link>
            <p className="text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest">
              Hustle. Create. Deliver.
            </p>
            <p className="text-sm text-[var(--text-muted)] max-w-sm leading-relaxed">
              One company. Specialized digital talent. Providing end-to-end web engineering, brand identity, AI workflows, and cybersecurity.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center space-x-2.5 pt-2">
              {[
                { label: 'LinkedIn', icon: 'In', href: 'https://linkedin.com' },
                { label: 'GitHub', icon: 'Gh', href: 'https://github.com/Haris-Rindh/DigiHustler' },
                { label: 'Twitter / X', icon: 'X', href: 'https://twitter.com' },
                { label: 'Instagram', icon: 'Ig', href: 'https://instagram.com' },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={s.label}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] hover:bg-[var(--brand-teal)]/20 flex items-center justify-center text-xs font-bold text-[var(--text-body)] hover:text-[var(--text-heading)] transition-colors shadow-sm"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest">Capabilities</h4>
            <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
              {[
                { name: 'Web Development', href: '/services' },
                { name: 'Creative & UI/UX', href: '/services' },
                { name: 'AI & Automation', href: '/services' },
                { name: 'Digital Marketing', href: '/services' },
                { name: 'Cybersecurity', href: '/services' },
                { name: 'Data Intelligence', href: '/services' },
              ].map((s) => (
                <li key={s.name}>
                  <Link to={s.href} className="hover:text-[var(--text-heading)] transition-colors inline-flex items-center space-x-1 group">
                    <span>{s.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest">Company</h4>
            <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
              {[
                { label: 'Selected Work', href: '/work' },
                { label: 'How We Work', href: '/how-it-works' },
                { label: 'Our Story', href: '/about' },
                { label: 'Meet the Team', href: '/team' },
                { label: 'Knowledge Hub', href: '/blog' },
                { label: 'Get a Quote', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-[var(--text-heading)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Utility & Portal */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest">System & Portals</h4>
            <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
              <li>
                <Link to="/dashboard" className="text-[var(--text-heading)] hover:underline font-bold inline-flex items-center space-x-1">
                  <span>Client Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/maintenance" className="hover:text-[var(--text-body)] transition-colors">System Status</Link>
              </li>
              <li>
                <Link to="/404" className="hover:text-[var(--text-body)] transition-colors">404 Diagnostic</Link>
              </li>
              <li>
                <Link to="/offline" className="hover:text-[var(--text-body)] transition-colors">Offline State</Link>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-body)] transition-colors inline-flex items-center space-x-1">
                  <span>Sitemap XML</span>
                  <ArrowUpRight className="w-3 h-3 text-[var(--text-dim)]" />
                </a>
              </li>
              <li>
                <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-body)] transition-colors inline-flex items-center space-x-1">
                  <span>llms.txt (AI Info)</span>
                  <ArrowUpRight className="w-3 h-3 text-[var(--text-dim)]" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-[var(--text-dim)]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[var(--brand-teal)]" />
            <span>© {new Date().getFullYear()} DigiHust. All rights reserved. Sourced on Digiskill talent.</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/privacy" className="hover:text-[var(--text-heading)] transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-[var(--text-heading)] transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link to="/contact" className="text-[var(--text-heading)] hover:underline">Support & Inquiries</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
