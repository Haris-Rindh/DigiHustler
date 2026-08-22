import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';

const PROJECTS = [
  {
    category: 'Web Development',
    title: 'Real-Estate Marketplace Portal',
    description: 'Full-stack property listing portal with interactive map filtering, user accounts, and real-time agent dashboards built for a UK-based client.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Leaflet Maps'],
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    client: 'Estates Direct UK',
  },
  {
    category: 'Creative & Branding',
    title: 'Automotive Brand Identity & Motion Ads',
    description: 'High-end brand identity design system including vector logos, brand guidelines PDF, and 3x 30-second 3D motion advertisement teasers for a European automotive brand.',
    tags: ['Brand Identity', 'Figma', 'After Effects', '3D Animation', 'Motion Design'],
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    client: 'Veloce Motors DE',
  },
  {
    category: 'AI & Data',
    title: 'Executive Sales BI Dashboard',
    description: 'Integration of hospital SQL databases into a unified PowerBI executive dashboard with automated email reporting, saving the client 12+ hours per week in manual reporting.',
    tags: ['PowerBI', 'SQL', 'Python', 'Automated Reports', 'Healthcare'],
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    client: 'Titan Healthcare Systems',
  },
  {
    category: 'Web Development',
    title: 'SaaS Financial Platform Redesign',
    description: 'Complete modernization of a financial dashboard portal — redesigned in React with Tailwind, wired to REST APIs, and optimized for enterprise-scale data visualization.',
    tags: ['React', 'TypeScript', 'REST APIs', 'Financial Dashboard', 'SaaS'],
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    client: 'Apex FinTech US',
  },
  {
    category: 'AI & Automation',
    title: 'AI-Powered Customer Service Bot',
    description: 'Custom OpenAI/Python automation system parsing logistics tracking emails, answering WhatsApp customer inquiries, and updating database records without human intervention.',
    tags: ['OpenAI', 'Python', 'WhatsApp API', 'Automation', 'Logistics'],
    img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80',
    client: 'LogiXpress Logistics',
  },
  {
    category: 'Creative & Design',
    title: 'E-Commerce Brand & Social Media Kit',
    description: 'Complete visual brand system for a global e-commerce business including logo suite, Figma UI design for iOS app, and a full social media content template library.',
    tags: ['Brand Identity', 'UI/UX', 'Figma', 'Social Media Design', 'iOS'],
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    client: 'Nexus Global',
  },
];

const FILTER_CATS = ['All', 'Web Development', 'Creative & Branding', 'AI & Data', 'AI & Automation', 'Creative & Design'];

export const Work: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter || p.category.includes(activeFilter.split('&')[0].trim()));

  return (
    <div className="pt-16">

      {/* Header */}
      <div className="bg-[#071e26] py-20 px-6 lg:px-8 border-b border-[#1e4a5d]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-4">Selected Work</p>
          <h1 className="font-display font-extrabold text-5xl text-white mb-5">Our Work</h1>
          <p className="text-lg text-slate-300 max-w-xl">
            A selection of projects from our team — from web apps and branding to AI systems and data dashboards.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center space-x-1 py-4 overflow-x-auto">
            {['All', 'Web Development', 'Creative & Branding', 'AI & Data', 'AI & Automation', 'Creative & Design'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeFilter === cat
                    ? 'bg-[#1a7a8c] text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="bg-white py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(project => (
              <div key={project.title}
                className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#1a7a8c]/20 transition-all">
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img src={project.img} alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-bold text-[#1a7a8c] uppercase tracking-wider">{project.category}</p>
                    <p className="text-[11px] text-gray-400">{project.client}</p>
                  </div>
                  <h3 className="font-display font-bold text-xl text-gray-900 mb-3 group-hover:text-[#1a7a8c] transition-colors">{project.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tags.map(t => (
                      <span key={t} className="text-[10px] px-2.5 py-1 rounded-lg bg-gray-50 text-gray-500 border border-gray-100">{t}</span>
                    ))}
                  </div>
                  <span className="inline-flex items-center space-x-1.5 text-sm font-bold text-[#1a7a8c]">
                    <span>View Case Study</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#071e26] py-20 px-6 lg:px-8 border-t border-[#1e4a5d] text-center">
        <h2 className="font-display font-extrabold text-3xl text-white mb-4">Want to be our next case study?</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">We'd love to hear about your project.</p>
        <Link to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-bold shadow-lg transition-all">
          <span>Start a Project</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
