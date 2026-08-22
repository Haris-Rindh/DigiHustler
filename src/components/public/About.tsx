import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="pt-16">

      {/* Header */}
      <div className="bg-[#071e26] py-20 px-6 lg:px-8 border-b border-[#1e4a5d]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-4">About Us</p>
          <h1 className="font-display font-extrabold text-5xl text-white mb-5">The DigiHust Story</h1>
          <p className="text-lg text-slate-300 max-w-xl">
            Where we came from, why we exist, and what we're building.
          </p>
        </div>
      </div>

      {/* THE PROBLEM */}
      <div className="bg-white py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-extrabold text-red-400 uppercase tracking-widest mb-3">The Problem</p>
            <h2 className="font-display font-extrabold text-4xl text-gray-900 mb-6">A lot of talent. Not enough opportunity.</h2>
            <p className="text-base text-gray-500 leading-relaxed mb-4">
              Pakistan produces thousands of skilled digital professionals every year — through Digiskill and programs like it. These people can build websites, design brands, automate workflows, run campaigns, and protect systems.
            </p>
            <p className="text-base text-gray-500 leading-relaxed mb-4">
              But skilled doesn't always mean employed. The problem isn't lack of ability — it's that individual freelancers struggle to find and close clients consistently. They get stuck in the race to the bottom on platform rates. They work in isolation. They can't compete against established agencies.
            </p>
            <p className="text-base text-gray-500 leading-relaxed">
              At the same time, businesses that need digital work often don't know how to find the right person, verify their skills, or manage five separate freelancers across a single project.
            </p>
          </div>
          <div className="space-y-6">
            {[
              { num: '1000+', label: 'Digiskill graduates produced annually in Pakistan', sub: 'Many without a clear path to earning internationally' },
              { num: '73%', label: 'Businesses prefer a single point of contact', sub: 'Not managing multiple freelancer relationships' },
              { num: '5x', label: 'More likely to finish a project on time', sub: 'When managed under one coordinated structure' },
            ].map(stat => (
              <div key={stat.num} className="border border-gray-100 rounded-2xl p-6">
                <p className="font-display font-extrabold text-4xl text-[#1a7a8c] mb-1">{stat.num}</p>
                <p className="font-semibold text-gray-900 mb-1">{stat.label}</p>
                <p className="text-sm text-gray-400">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THE SOLUTION */}
      <div className="bg-[#071e26] py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">The Solution</p>
            <h2 className="font-display font-extrabold text-4xl text-white mb-6">DigiHust: the structure between talent and opportunity.</h2>
            <p className="text-base text-slate-300 leading-relaxed mb-4">
              DigiHust was founded by a small group inside the Digiskill community with one goal: create a professional entity that brings clients to the talent — rather than forcing each individual to do it alone.
            </p>
            <p className="text-base text-slate-300 leading-relaxed mb-4">
              Instead of each freelancer hunting their own clients, DigiHust finds and manages client relationships centrally. When a project comes in, we identify what skills it needs, assemble the right team from our talent network, and deliver a complete solution under one professional brand.
            </p>
            <p className="text-base text-slate-300 leading-relaxed">
              For clients, this means one point of contact, one professional company, and coordinated delivery. For our team, it means consistent work, fair compensation, and a structure that lets them focus on the craft — not the hustle.
            </p>
          </div>
          <div className="space-y-5">
            {[
              { title: 'Centralized client acquisition', desc: 'DigiHust finds clients and routes work through the team — no individual has to prospect alone.' },
              { title: 'Skill-matched project teams', desc: 'Every project gets the specific skills it needs — not a generalist trying to do everything.' },
              { title: 'Managed delivery structure', desc: 'A clear chain from management → leader → specialist keeps every project accountable and on track.' },
              { title: 'Fair, transparent payouts', desc: 'All revenue is split according to contribution — tracked, calculated, and distributed correctly.' },
            ].map(item => (
              <div key={item.title} className="flex items-start space-x-4 p-5 rounded-xl border border-[#1e4a5d] bg-[#0d2833]">
                <span className="w-6 h-6 rounded-full bg-[#1a7a8c]/20 border border-[#1a7a8c]/40 text-[#bde0fe] flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">✓</span>
                <div>
                  <p className="font-bold text-white text-sm mb-1">{item.title}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THE VISION */}
      <div className="bg-white py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">The Vision</p>
          <h2 className="font-display font-extrabold text-4xl text-gray-900 mb-6">
            A sustainable, self-funded digital ecosystem built on Pakistani talent.
          </h2>
          <p className="text-base text-gray-500 leading-relaxed mb-6 max-w-2xl mx-auto">
            DigiHust is not a side project. It is the beginning of a structure where skilled digital professionals can build real careers without depending on unpredictable platforms, race-to-bottom rates, or the luck of an individual referral.
          </p>
          <p className="text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
            As the community grows, so does the range of what we can offer. The immediate goal is to deliver excellent digital work for clients who need it. The long-term goal is to become one of the most capable distributed digital teams in the region.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-16 px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-extrabold text-3xl text-gray-900 mb-10 text-center">How We Operate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { word: 'Hustle', desc: 'We don\'t wait for work to come to us. We go find it, close it, and deliver it.' },
              { word: 'Create', desc: 'We make things of genuine quality — not content-farm output, not rushed deliverables.' },
              { word: 'Deliver', desc: 'We finish what we start. Promises made are promises kept, with documentation and support.' },
            ].map(val => (
              <div key={val.word} className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <h3 className="font-display font-extrabold text-3xl text-[#1a7a8c] mb-3">{val.word}.</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#071e26] py-20 px-6 lg:px-8 text-center border-t border-[#1e4a5d]">
        <h2 className="font-display font-extrabold text-3xl text-white mb-4">Work with us.</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Whatever your digital challenge, we have people who can handle it.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-bold shadow-lg transition-all">
            <span>Get a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/team"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl border border-[#1e4a5d] hover:border-[#1a7a8c] text-slate-300 font-bold transition-all">
            <span>Meet the Team</span>
          </Link>
        </div>
      </div>

    </div>
  );
};
