import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    name: 'Zubair Ahmed',
    role: 'Lead Full-Stack Architect',
    bio: 'Builds scalable web applications with React, Node.js, and cloud infrastructure. Leads the development team.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'DevOps'],
    category: 'Development',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Ayesha Khan',
    role: 'Creative Director',
    bio: 'Leads brand identity and UI/UX projects from strategy to final design. Known for clean, intentional visual systems.',
    skills: ['UI/UX', 'Figma', 'Branding', 'Motion Graphics', 'Adobe Suite'],
    category: 'Creative',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Dr. Hamza Ali',
    role: 'Head of AI & Data Intelligence',
    bio: 'Builds AI-powered automation systems, machine learning models, and enterprise BI dashboards.',
    skills: ['Python', 'ML', 'LLMs', 'PowerBI', 'SQL'],
    category: 'AI & Data',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Bilal Farooq',
    role: 'Digital Growth Lead',
    bio: 'Drives client acquisition and manages growth campaigns. Specializes in B2B outreach, cold email, and paid media.',
    skills: ['B2B Sales', 'Cold Email', 'PPC', 'SEO', 'Analytics'],
    category: 'Marketing',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Fatima Malik',
    role: 'Frontend Developer',
    bio: 'Pixel-perfect frontend builds. Specializes in responsive React apps with strong UX focus and accessibility.',
    skills: ['React', 'Tailwind CSS', 'Next.js', 'Framer Motion'],
    category: 'Development',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Usman Tariq',
    role: 'Security & Infrastructure Lead',
    bio: 'Identifies vulnerabilities and implements security architecture for web applications, APIs, and networks.',
    skills: ['Pen Testing', 'OWASP', 'Network Security', 'Compliance', 'Kali Linux'],
    category: 'Cybersecurity',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Sana Rizvi',
    role: 'Content & Marketing Strategist',
    bio: 'Develops content strategies, social media plans, and brand voice guides for digital-first businesses.',
    skills: ['Content Strategy', 'Copywriting', 'Social Media', 'SEO Writing', 'Email'],
    category: 'Marketing',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Omar Siddiqui',
    role: 'Graphic Designer & Motion Artist',
    bio: 'Creates polished visual content — social graphics, video edits, ads, and 3D motion sequences.',
    skills: ['Graphic Design', 'After Effects', '3D', 'Video Editing', 'Premiere Pro'],
    category: 'Creative',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
  },
];

const CATS = ['All', 'Development', 'Creative', 'AI & Data', 'Marketing', 'Cybersecurity'];

const CAT_COLORS: Record<string, string> = {
  Development: '#1a7a8c',
  Creative: '#8b5cf6',
  'AI & Data': '#0ea5e9',
  Marketing: '#f59e0b',
  Cybersecurity: '#ef4444',
};

export const Team: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const displayed = filter === 'All' ? TEAM_MEMBERS : TEAM_MEMBERS.filter(m => m.category === filter);

  return (
    <div className="pt-16">

      {/* Header */}
      <div className="bg-[#071e26] py-20 px-6 lg:px-8 border-b border-[#1e4a5d]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-4">The People Behind the Work</p>
          <h1 className="font-display font-extrabold text-5xl text-white mb-5">Meet the Talent</h1>
          <p className="text-lg text-slate-300 max-w-xl">
            Trained, verified digital professionals — each with a defined specialty and a track record of delivery.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center space-x-1 py-4 overflow-x-auto">
            {CATS.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === cat ? 'bg-[#1a7a8c] text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="bg-white py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayed.map(member => (
              <div key={member.name}
                className="group border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-[#1a7a8c]/20 transition-all">
                <div className="flex items-start space-x-4 mb-4">
                  <img src={member.img} alt={member.name}
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-gray-100 group-hover:ring-[#1a7a8c]/30 transition-all flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-gray-900 leading-tight">{member.name}</h3>
                    <p className="text-xs font-semibold mt-0.5"
                      style={{ color: CAT_COLORS[member.category] || '#1a7a8c' }}>
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-lg bg-gray-50 text-gray-400 border border-gray-100 font-medium">{s}</span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-block text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide"
                    style={{ color: CAT_COLORS[member.category] || '#1a7a8c', backgroundColor: (CAT_COLORS[member.category] || '#1a7a8c') + '15' }}>
                    {member.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Talent Model Note */}
      <div className="bg-gray-50 py-16 px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-display font-extrabold text-2xl text-gray-900 mb-4">How the talent works</h3>
          <p className="text-base text-gray-500 leading-relaxed mb-6">
            Every DigiHust team member is sourced and trained through Digiskill — Pakistan&apos;s professional digital skills program. They aren&apos;t random freelancers. They&apos;re verified specialists organized under DigiHust&apos;s management structure to deliver professional-grade results.
          </p>
          <p className="text-sm text-gray-400">
            When your project starts, the right subset of this team is assembled — no unnecessary people, no overlap, no wasted budget.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#071e26] py-20 px-6 lg:px-8 text-center border-t border-[#1e4a5d]">
        <h2 className="font-display font-extrabold text-3xl text-white mb-4">Have a project for our team?</h2>
        <p className="text-slate-400 mb-8">Tell us what you need and we'll match the right people to it.</p>
        <Link to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-bold shadow-lg transition-all">
          <span>Start a Project</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
