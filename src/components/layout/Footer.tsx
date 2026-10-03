import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Linkedin, Github, Facebook, Instagram, Twitter, Mail, AtSign } from 'lucide-react';
import logoImg from '../../assets/logo.png';

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
    <footer className="bg-[var(--bg-page)] border-t border-[var(--border-subtle)] pt-16 pb-10 px-6 lg:px-8 relative overflow-hidden" aria-label="Site Footer">
      {/* Subtle top ambient border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* Top Grid (Balanced 4-column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-10 pb-12 border-b border-[var(--border-subtle)]">

          {/* Brand Column (Spans 2 columns) */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-2.5 group">
              <img 
                src={logoImg} 
                alt="DigiHust Logo" 
                className="h-8 sm:h-9 w-auto max-w-[42px] object-contain group-hover:scale-105 group-hover:-translate-y-0.5 transition-all duration-200 ease-out drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.75)]" 
              />
              <span className="font-display font-extrabold text-xl text-[var(--text-heading)] group-hover:text-[var(--brand-teal)] transition-colors duration-200">
                DigiHust
              </span>
            </Link>
            <p className="text-xs font-extrabold text-[var(--text-heading)] uppercase tracking-widest">
              Hustle. Create. Deliver.
            </p>
            <p className="text-sm text-[var(--text-muted)] max-w-sm leading-relaxed">
              One company. Specialized digital talent. Providing end-to-end web engineering, brand identity, AI workflows, and cybersecurity.
            </p>
            
            {/* Social Vector Icons with Instant Buttery Hover & Footstep Shadows */}
            <div className="flex flex-wrap gap-3 pt-3">
              {SOCIAL_LINKS.map((s) => {
                const IconComponent = s.icon;
                return (
                  <div key={s.label} className="relative group">
                    {/* Footstep ground shadow that expands and blurs as the icon lifts up */}
                    <span 
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1.5 rounded-[100%] blur-[2.5px] opacity-0 group-hover:opacity-100 group-hover:w-8 group-hover:h-2.5 group-hover:scale-125 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
                      style={{ 
                        backgroundColor: s.glowColor,
                        boxShadow: `0 4px 14px ${s.glowColor}`
                      }}
                    />

                    {/* Interactive Button */}
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.label}
                      aria-label={s.label}
                      className="relative w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] hover:bg-[var(--brand-teal-subtle)] flex items-center justify-center transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-sm cursor-pointer group-hover:-translate-y-1.5 group-hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-95 z-10"
                    >
                      {/* Inner Icon that floats up and casts a distinct drop shadow */}
                      <IconComponent 
                        className="w-4 h-4 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1 group-hover:scale-120 group-hover:drop-shadow-[0_5px_7px_rgba(0,0,0,0.35)]" 
                        style={{ color: s.color }}
                      />
                    </a>
                  </div>
                );
              })}
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
                  <Link 
                    to={s.href} 
                    className="hover:text-[var(--text-heading)] hover:translate-x-1 transition-all duration-180 ease-out inline-flex items-center space-x-1 group"
                  >
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
                { label: 'Selected Work', href: '/portfolio' },
                { label: 'How We Work', href: '/how-it-works' },
                { label: 'Our Story', href: '/about' },
                { label: 'Meet the Team', href: '/team' },
                { label: 'Knowledge Hub', href: '/blog' },
                { label: 'Careers', href: '/careers' },
                { label: 'Get a Quote', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="hover:text-[var(--text-heading)] hover:translate-x-1 transition-all duration-180 ease-out inline-block"
                  >
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
            <Link to="/privacy" className="hover:text-[var(--text-heading)] hover:underline transition-colors duration-180">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-[var(--text-heading)] hover:underline transition-colors duration-180">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
