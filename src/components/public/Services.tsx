import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Palette, Cpu, TrendingUp, Shield, Database, ChevronRight } from 'lucide-react';

const SERVICES = [
  {
    icon: <Code className="w-7 h-7" />,
    title: 'Development',
    headline: 'Websites · Web Apps · Frontend · Backend',
    description: 'We build digital products that are fast, scalable, and maintainable — from simple landing pages to full enterprise web applications.',
    offerings: [
      'Custom Website Design & Development',
      'React & Next.js Web Applications',
      'Backend API & Database Architecture',
      'Mobile-Responsive Builds',
      'E-Commerce Platforms',
      'Maintenance & Ongoing Support',
    ],
    tags: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'Mobile Apps'],
    color: '#1a7a8c',
    bg: 'bg-[#1a7a8c]/10',
  },
  {
    icon: <Palette className="w-7 h-7" />,
    title: 'Creative & Design',
    headline: 'Graphic Design · UI/UX · Branding · Social Media Design',
    description: 'We design visual identities and interfaces that make your brand memorable and your product intuitive to use.',
    offerings: [
      'Brand Identity & Logo Design',
      'UI/UX Design & Prototyping',
      'Social Media Visual Content',
      'Video Editing & Motion Graphics',
      'Pitch Deck & Presentation Design',
      'Print & Marketing Materials',
    ],
    tags: ['Figma', 'Adobe Suite', 'Branding', 'Motion', '3D Design'],
    color: '#8b5cf6',
    bg: 'bg-purple-500/10',
  },
  {
    icon: <Cpu className="w-7 h-7" />,
    title: 'AI & Automation',
    headline: 'AI Solutions · Chatbots · Automation · AI Integration',
    description: 'We integrate AI tools, automate repetitive workflows, and build intelligent systems that save your team significant time.',
    offerings: [
      'Custom AI Chatbot Development',
      'Business Process Automation',
      'OpenAI / LLM Integration',
      'Workflow Automation (n8n, Zapier, Make)',
      'AI-Powered Data Processing',
      'Intelligent Reporting Systems',
    ],
    tags: ['OpenAI', 'Python', 'n8n', 'Zapier', 'LangChain', 'APIs'],
    color: '#0ea5e9',
    bg: 'bg-sky-500/10',
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    title: 'Marketing',
    headline: 'Social Media · Content · SEO · Digital Marketing',
    description: 'We grow your online presence through targeted digital strategies, content creation, and data-driven campaign management.',
    offerings: [
      'Social Media Management & Strategy',
      'SEO & Content Marketing',
      'PPC / Google Ads Campaigns',
      'Email Marketing Sequences',
      'Copywriting & Brand Voice',
      'Analytics & Reporting',
    ],
    tags: ['SEO', 'Google Ads', 'Meta Ads', 'Content', 'Email', 'Analytics'],
    color: '#f59e0b',
    bg: 'bg-amber-500/10',
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: 'Cybersecurity',
    headline: 'Security Assessment · Web Security · Security Solutions',
    description: 'We protect your digital assets through thorough security audits, vulnerability testing, and practical security implementation.',
    offerings: [
      'Penetration Testing',
      'Web Application Security Audit',
      'Vulnerability Assessment',
      'Security Policy & Compliance',
      'Data Protection Advisory',
      'Incident Response Planning',
    ],
    tags: ['Pen Testing', 'OWASP', 'Network Security', 'Compliance', 'Audit'],
    color: '#ef4444',
    bg: 'bg-red-500/10',
  },
  {
    icon: <Database className="w-7 h-7" />,
    title: 'Digital Solutions',
    headline: 'Data · Virtual Assistance · Specialized Services',
    description: 'From data analytics and business intelligence to virtual assistance — we handle the specialized digital work your business needs.',
    offerings: [
      'Data Analytics & Business Intelligence',
      'PowerBI Dashboard Development',
      'Virtual Assistance & Admin Support',
      'Lead Research & List Building',
      'CRM Setup & Management',
      'Technical Documentation',
    ],
    tags: ['PowerBI', 'Excel', 'SQL', 'Data Analysis', 'CRM', 'VA'],
    color: '#10b981',
    bg: 'bg-emerald-500/10',
  },
];

export const Services: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="pt-16">

      {/* Header */}
      <div className="bg-[#071e26] py-20 px-6 lg:px-8 border-b border-[#1e4a5d]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-4">What We Do</p>
          <h1 className="font-display font-extrabold text-5xl text-white mb-5">Our Services</h1>
          <p className="text-lg text-slate-300 max-w-xl">
            Six core digital capabilities — all under one professional relationship. No vendor juggling.
          </p>
        </div>
      </div>

      {/* Service Cards */}
      <div className="bg-white py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {SERVICES.map((svc, i) => (
            <div key={svc.title}
              className={`border border-gray-100 rounded-2xl overflow-hidden transition-all ${active === svc.title ? 'shadow-xl border-[#1a7a8c]/20' : 'hover:shadow-md hover:border-gray-200'}`}>
              {/* Card Header — always visible */}
              <button
                onClick={() => setActive(active === svc.title ? null : svc.title)}
                className="w-full text-left px-8 py-7 flex items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: svc.color }}>
                    {svc.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-display font-extrabold text-2xl text-gray-900">{svc.title}</h2>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{svc.headline}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 max-w-2xl">{svc.description}</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-300 flex-shrink-0 transition-transform ${active === svc.title ? 'rotate-90' : ''}`} />
              </button>

              {/* Expanded Detail */}
              {active === svc.title && (
                <div className={`px-8 pb-8 ${svc.bg} border-t border-gray-100`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: svc.color }}>What's Included</h4>
                      <ul className="space-y-2">
                        {svc.offerings.map(o => (
                          <li key={o} className="flex items-start space-x-3 text-sm text-gray-700">
                            <span className="mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[9px] font-black text-white"
                              style={{ backgroundColor: svc.color, borderColor: svc.color }}>✓</span>
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">Tech & Tools</h4>
                      <div className="flex flex-wrap gap-2">
                        {svc.tags.map(t => (
                          <span key={t} className="text-xs px-3 py-1.5 rounded-lg bg-white text-gray-600 border border-gray-200 font-medium">{t}</span>
                        ))}
                      </div>
                      <div className="mt-8">
                        <Link to="/contact"
                          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow"
                          style={{ backgroundColor: svc.color }}>
                          <span>Get a Quote for {svc.title}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#071e26] py-20 px-6 lg:px-8 border-t border-[#1e4a5d] text-center">
        <h2 className="font-display font-extrabold text-3xl text-white mb-4">Not sure which service you need?</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Tell us about your project and we'll figure out the right approach together.</p>
        <Link to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-bold shadow-lg transition-all">
          <span>Start a Conversation</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
