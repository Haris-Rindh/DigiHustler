import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GroupId } from '../../types';
import { Shield, CheckCircle2, Send, GraduationCap, Link2, FileText, User } from 'lucide-react';

export const Apply: React.FC = () => {
  const { groups, submitApplication } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredGroupId, setPreferredGroupId] = useState<GroupId>('tech');
  const [digiskillId, setDigiskillId] = useState('');
  const [digiskillCourse, setDigiskillCourse] = useState('Web Development');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [experienceYears, setExperienceYears] = useState(2);
  const [specialtiesText, setSpecialtiesText] = useState('React, Tailwind, Node.js');
  const [bio, setBio] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !digiskillId) return;

    submitApplication({
      name,
      email,
      phone,
      preferredGroupId,
      digiskillId,
      digiskillCourse,
      portfolioUrl,
      experienceYears,
      specialties: specialtiesText.split(',').map(s => s.trim()).filter(Boolean),
      bio
    });

    setSubmitted(true);
  };

  return (
    <div className="pt-16 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12 space-y-8">
      
      <div className="text-center space-y-3">
        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest">
          Join the Ecosystem
        </span>
        <h1 className="font-display font-extrabold text-4xl text-[var(--text-heading)]">Apply to DigiHust Community</h1>
        <p className="text-xs text-[var(--text-muted)] max-w-lg mx-auto">
          Exclusive membership for verified Digiskill graduates. Get assigned to high-ticket client projects routed through department group leaders.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-3xl text-center space-y-4 border border-emerald-500/30 bg-[var(--bg-surface)] shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--text-heading)]">Application Received!</h2>
          <p className="text-xs text-[var(--text-body)] max-w-md mx-auto leading-relaxed">
            Thank you, {name}! Your Digiskill credentials (<strong>{digiskillId}</strong>) have been submitted to Founding Management for review. You can test your approval live in the Admin Settings tab.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-heading)] font-bold text-xs hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)] transition-colors bg-[var(--bg-page)]"
          >
            Submit Another Application
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl space-y-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Full Name *</label>
              <input 
                type="text" 
                required
                placeholder="Usman Tariq"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-teal)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Email Address *</label>
              <input 
                type="email" 
                required
                placeholder="usman@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-teal)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Digiskill Batch / Reg ID *</label>
              <input 
                type="text" 
                required
                placeholder="DS-Batch 15 (ID: 98421)"
                value={digiskillId}
                onChange={(e) => setDigiskillId(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-teal)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Digiskill Primary Course</label>
              <input 
                type="text" 
                placeholder="Web Development / Graphic Design"
                value={digiskillCourse}
                onChange={(e) => setDigiskillCourse(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-teal)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Target Department Group *</label>
              <select
                value={preferredGroupId}
                onChange={(e) => setPreferredGroupId(e.target.value as GroupId)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-teal)]"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Portfolio / GitHub / Behance URL</label>
              <input 
                type="url" 
                placeholder="https://github.com/your-username"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-teal)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Specialties & Tags (Comma Separated)</label>
            <input 
              type="text" 
              placeholder="React, TypeScript, Tailwind CSS, Figma"
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-teal)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-body)] mb-1">Brief Bio & Work Experience Summary</label>
            <textarea 
              rows={3}
              placeholder="Tell Management about your key strengths and previous client projects..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-teal)]"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Membership Application</span>
          </button>

        </form>
      )}

      </div>
    </div>
  );
};
