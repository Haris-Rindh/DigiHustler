import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Linkedin, Github, Facebook, Instagram, Twitter, Mail, AtSign } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { LogoBadge } from '../ui/LogoBadge';
import { LAST_UPDATED, LAST_UPDATED_DISPLAY } from '../../config/siteConfig';

interface SocialLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  glowColor: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/digihust/',
    icon: Linkedin,
    color: '#0A66C2',
    glowColor: 'rgba(10, 102, 194, 0.45)',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/DigiHust-Official',
    icon: Github,
    color: 'var(--text-heading)',
    glowColor: 'rgba(31, 122, 140, 0.4)',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/digihust.tech',
    icon: Facebook,
    color: '#1877F2',
    glowColor: 'rgba(24, 119, 242, 0.45)',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/digi_hust/',
    icon: Instagram,
    color: '#E1306C',
    glowColor: 'rgba(225, 48, 108, 0.45)',
  },
  {
    label: 'Twitter/X',
    href: 'https://x.com/DigiHust',
    icon: Twitter,
    color: '#1DA1F2',
    glowColor: 'rgba(29, 161, 242, 0.45)',
  },
  {
    label: 'Threads',
    href: 'https://www.threads.com/@digi_hust',
    icon: AtSign,
    color: 'var(--text-heading)',
    glowColor: 'rgba(31, 122, 140, 0.4)',
  },
  {
    label: 'Email Inquiries',
    href: 'mailto:digihust@gmail.com',
    icon: Mail,
    color: 'var(--brand-teal)',
    glowColor: 'rgba(31, 122, 140, 0.5)',
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--bg-page)] border-t border-[var(--border-subtle)] pt-8 pb-5 px-6 lg:px-8 relative overflow-hidden" aria-label="Site Footer">
      {/* Subtle top ambient border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* Top Grid (Compact 4-column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 pb-6 border-b border-[var(--border-subtle)]">

          {/* Brand Column (Spans 2 columns) */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/" className="inline-flex items-center group">
                <LogoBadge />
              </Link>
              <span className="text-[10px] font-extrabold text-[var(--brand-teal)] uppercase tracking-widest border-l border-[var(--border-subtle)] pl-3">
                Hustle. Create. Deliver.
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-md leading-relaxed">
              One company. Specialized digital talent. Providing end-to-end web engineering, brand identity, AI workflows, and cybersecurity.
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Founded by <Link to="/team" className="text-[var(--text-heading)] hover:text-[var(--brand-teal)] font-bold transition-colors underline underline-offset-2">Mahad Abbas</Link> & <Link to="/team" className="text-[var(--text-heading)] hover:text-[var(--brand-teal)] font-bold transition-colors underline underline-offset-2">Muhammad Haseeb</Link>.
            </p>
            
            {/* Social Vector Icons (Clean, No Hover Glow) */}
            <div className="flex flex-wrap gap-2 pt-1.5">
              {SOCIAL_LINKS.map((s) => {
                const IconComponent = s.icon;
                return (
                  <div key={s.label} className="relative group">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.label}
                      aria-label={s.label}
                      className="relative w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] hover:bg-[var(--brand-teal-subtle)] flex items-center justify-center transition-all duration-200 cursor-pointer group-hover:-translate-y-0.5 active:translate-y-0 z-10"
                    >
                      <IconComponent 
                        className="w-3.5 h-3.5 transition-transform duration-200" 
                        style={{ color: s.color }}
                      />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-extrabold text-[var(--text-heading)] uppercase tracking-widest">Capabilities</h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
              {[
                { name: 'Web Development', href: '/services' },
                { name: 'Creative & UI/UX', href: '/services' },
                { name: 'AI & Automation', href: '/services' },
                { name: 'Digital Marketing', href: '/services' },
                { name: 'Cybersecurity', href: '/services' },
                { name: 'Data Intelligence', href: '/services' },
              ].map((s) => (
                <li key={s.name}>
                  <Link 
                    to={s.href} 
                    className="hover:text-[var(--text-heading)] hover:translate-x-0.5 transition-all duration-180 ease-out inline-flex items-center space-x-1 group"
                  >
                    <span>{s.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-extrabold text-[var(--text-heading)] uppercase tracking-widest">Company</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
              {[
                { label: 'Selected Work', href: '/portfolio' },
                { label: 'How We Work', href: '/how-it-works' },
                { label: 'Our Story', href: '/about' },
                { label: 'Meet the Team', href: '/team' },
                { label: 'Knowledge Hub', href: '/blog' },
                { label: 'Careers', href: '/careers' },
                { label: 'Get a Quote', href: '/contact' },
                { label: 'Editorial Policy', href: '/editorial-policy' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="hover:text-[var(--text-heading)] hover:translate-x-0.5 transition-all duration-180 ease-out inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-[11px] text-[var(--text-dim)]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
              <span>© {new Date().getFullYear()} DigiHust. All rights reserved. Sourced on Digiskill talent.</span>
            </div>
            <span className="hidden sm:inline">·</span>
            <span>Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED_DISPLAY}</time></span>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/editorial-policy" className="hover:text-[var(--text-heading)] hover:underline transition-colors duration-180">Editorial Policy</Link>
            <span>·</span>
            <Link to="/privacy" className="hover:text-[var(--text-heading)] hover:underline transition-colors duration-180">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-[var(--text-heading)] hover:underline transition-colors duration-180">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
