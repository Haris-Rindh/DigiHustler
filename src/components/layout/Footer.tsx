import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Linkedin, Github, Facebook, Instagram, Mail } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--bg-page)] border-t border-[var(--border-subtle)] pt-16 pb-10 px-6 lg:px-8 relative overflow-hidden" aria-label="Site Footer">
      {/* Subtle top ambient border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* Top Grid (Balanced 4-column layout without System & Portals) */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-10 pb-12 border-b border-[var(--border-subtle)]">

          {/* Brand Column (Spans 2 columns) */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <img 
                src={logoImg} 
                alt="DigiHust Logo" 
                className="h-8 sm:h-9 w-auto max-w-[42px] object-contain group-hover:scale-105 transition-all drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.75)]" 
              />
              <span className="font-display font-extrabold text-xl text-[var(--text-heading)] group-hover:text-[var(--brand-teal)] transition-colors">
                DigiHust
              </span>
            </Link>
            <p className="text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest">
              Hustle. Create. Deliver.
            </p>
            <p className="text-sm text-[var(--text-muted)] max-w-sm leading-relaxed">
              One company. Specialized digital talent. Providing end-to-end web engineering, brand identity, AI workflows, and cybersecurity.
            </p>
            
            {/* Social Vector Icons */}
            <div className="flex items-center space-x-2.5 pt-2">
              {[
                { label: 'LinkedIn', icon: <Linkedin className="w-4 h-4 text-[#0A66C2] group-hover:scale-110 transition-transform duration-150" />, href: 'https://www.linkedin.com/company/digihust/' },
                { label: 'GitHub', icon: <Github className="w-4 h-4 text-[var(--text-heading)] group-hover:scale-110 transition-transform duration-150" />, href: 'https://github.com/digihust' },
                { label: 'Facebook', icon: <Facebook className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform duration-150" />, href: 'https://www.facebook.com/share/p/1EubKwa3Ce/' },
                { label: 'Email Inquiries', icon: <Mail className="w-4 h-4 text-[var(--brand-teal)] group-hover:scale-110 transition-transform duration-150" />, href: 'mailto:contact@digihust.com' },
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
                  className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] hover:bg-[var(--brand-teal-subtle)] flex items-center justify-center transition-all duration-150 shadow-sm group"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Capabilities */}
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
            <Link to="/portal/login" className="hover:text-[var(--text-heading)] transition-colors">Team Login</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
