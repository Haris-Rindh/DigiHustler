import React, { useState } from 'react';
import { 
  FileText, Image as ImageIcon, Sparkles, Check, RotateCcw, 
  Plus, Trash2, Eye, Layout, Star, Briefcase, Users, Layers, ExternalLink 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SiteContent, SiteCaseStudy, SiteTestimonial, SiteServiceItem, SiteTeamMember } from '../../types';
import { PERMISSIONS } from '../../lib/permissions';

export const SiteContentManager: React.FC = () => {
  const { siteContent, updateSiteContent, resetSiteContent, currentTier } = useApp();
  const [activeTab, setActiveTab] = useState<'hero' | 'caseStudies' | 'testimonials' | 'services' | 'team' | 'images'>('hero');
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Local draft state
  const [heroDraft, setHeroDraft] = useState(siteContent.hero);
  const [caseStudiesDraft, setCaseStudiesDraft] = useState(siteContent.caseStudies);
  const [testimonialsDraft, setTestimonialsDraft] = useState(siteContent.testimonials);
  const [servicesDraft, setServicesDraft] = useState(siteContent.services);
  const [teamDraft, setTeamDraft] = useState(siteContent.teamMembers);
  const [customImagesDraft, setCustomImagesDraft] = useState(siteContent.customImages || {});

  const canEdit = PERMISSIONS.canEditWebsiteContent(currentTier);

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent('hero', heroDraft);
    triggerSaved();
  };

  const handleSaveCaseStudies = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent('caseStudies', caseStudiesDraft);
    triggerSaved();
  };

  const handleSaveTestimonials = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent('testimonials', testimonialsDraft);
    triggerSaved();
  };

  const handleSaveServices = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent('services', servicesDraft);
    triggerSaved();
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent('teamMembers', teamDraft);
    triggerSaved();
  };

  const handleSaveImages = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent('customImages', customImagesDraft);
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleResetAll = () => {
    if (confirm('Are you sure you want to reset all website text and image assets back to default branding?')) {
      resetSiteContent();
      triggerSaved();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--brand-teal)] uppercase tracking-wider mb-1">
            <Layout className="w-3.5 h-3.5" />
            <span>Executive Content Management</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)]">
            Website CMS & Visual Asset Studio
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-body)]">
            Modify live public website headlines, dummy copy, case study metrics, testimonials, and image assets.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-xs font-bold text-[var(--text-heading)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-all cursor-pointer shadow-sm"
          >
            <Eye className="w-4 h-4 text-[var(--brand-teal)]" />
            <span>Preview Public Site</span>
            <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
          </a>

          {canEdit && (
            <button
              onClick={handleResetAll}
              className="flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          )}
        </div>
      </div>

      {savedFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Website content updated and published live successfully!</span>
          </span>
          <span className="text-[10px] uppercase font-mono">Live In LocalStorage</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-1.5 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto">
        {[
          { id: 'hero' as const, label: 'Hero & Headlines', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'caseStudies' as const, label: 'Case Studies & Metrics', icon: <Briefcase className="w-3.5 h-3.5" /> },
          { id: 'testimonials' as const, label: 'Testimonials', icon: <Star className="w-3.5 h-3.5" /> },
          { id: 'services' as const, label: 'Services & Squads', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'team' as const, label: 'Team Profiles', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'images' as const, label: 'All Image URLs', icon: <ImageIcon className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── TAB 1: HERO & HEADLINES ── */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHero} className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">
              Hero Section & Top Headlines
            </h3>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Save Hero Changes
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Top Pill Badge Text
              </label>
              <input
                type="text"
                value={heroDraft.badgeText}
                onChange={(e) => setHeroDraft({ ...heroDraft, badgeText: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Hero Image Preview URL
              </label>
              <input
                type="url"
                value={heroDraft.heroImage}
                onChange={(e) => setHeroDraft({ ...heroDraft, heroImage: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Headline Line 1
              </label>
              <input
                type="text"
                value={heroDraft.headlineLine1}
                onChange={(e) => setHeroDraft({ ...heroDraft, headlineLine1: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Headline Highlighted (Gradient)
              </label>
              <input
                type="text"
                value={heroDraft.headlineHighlight}
                onChange={(e) => setHeroDraft({ ...heroDraft, headlineHighlight: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none font-bold text-[var(--brand-teal)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Headline Line 2
              </label>
              <input
                type="text"
                value={heroDraft.headlineLine2}
                onChange={(e) => setHeroDraft({ ...heroDraft, headlineLine2: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Sub-Headline Description
            </label>
            <textarea
              value={heroDraft.subheadline}
              onChange={(e) => setHeroDraft({ ...heroDraft, subheadline: e.target.value })}
              rows={3}
              className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Primary CTA Text
              </label>
              <input
                type="text"
                value={heroDraft.ctaPrimaryText}
                onChange={(e) => setHeroDraft({ ...heroDraft, ctaPrimaryText: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Secondary CTA Text
              </label>
              <input
                type="text"
                value={heroDraft.ctaSecondaryText}
                onChange={(e) => setHeroDraft({ ...heroDraft, ctaSecondaryText: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Metric Value
              </label>
              <input
                type="text"
                value={heroDraft.metricsBadgeValue}
                onChange={(e) => setHeroDraft({ ...heroDraft, metricsBadgeValue: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Metric Label
              </label>
              <input
                type="text"
                value={heroDraft.metricsBadgeLabel}
                onChange={(e) => setHeroDraft({ ...heroDraft, metricsBadgeLabel: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}

      {/* ── TAB 2: CASE STUDIES & METRICS ── */}
      {activeTab === 'caseStudies' && (
        <form onSubmit={handleSaveCaseStudies} className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
              Portfolio Projects & Measurable Impacts
            </h3>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Save Case Studies
            </button>
          </div>

          <div className="space-y-6">
            {caseStudiesDraft.map((cs, index) => (
              <div key={cs.id} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-teal)]">
                    Case Study #{index + 1}: {cs.slug}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">{cs.category}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={cs.title}
                      onChange={(e) => {
                        const updated = [...caseStudiesDraft];
                        updated[index].title = e.target.value;
                        setCaseStudiesDraft(updated);
                      }}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Client Organization
                    </label>
                    <input
                      type="text"
                      value={cs.client}
                      onChange={(e) => {
                        const updated = [...caseStudiesDraft];
                        updated[index].client = e.target.value;
                        setCaseStudiesDraft(updated);
                      }}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Featured Image URL
                    </label>
                    <input
                      type="url"
                      value={cs.imageUrl}
                      onChange={(e) => {
                        const updated = [...caseStudiesDraft];
                        updated[index].imageUrl = e.target.value;
                        setCaseStudiesDraft(updated);
                      }}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Impact Metric Value (e.g. +140%)
                    </label>
                    <input
                      type="text"
                      value={cs.impactMetric}
                      onChange={(e) => {
                        const updated = [...caseStudiesDraft];
                        updated[index].impactMetric = e.target.value;
                        setCaseStudiesDraft(updated);
                      }}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Impact Metric Label
                    </label>
                    <input
                      type="text"
                      value={cs.impactLabel}
                      onChange={(e) => {
                        const updated = [...caseStudiesDraft];
                        updated[index].impactLabel = e.target.value;
                        setCaseStudiesDraft(updated);
                      }}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Summary & Results Description
                  </label>
                  <textarea
                    value={cs.summary}
                    onChange={(e) => {
                      const updated = [...caseStudiesDraft];
                      updated[index].summary = e.target.value;
                      setCaseStudiesDraft(updated);
                    }}
                    rows={2}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      )}

      {/* ── TAB 3: CLIENT TESTIMONIALS ── */}
      {activeTab === 'testimonials' && (
        <form onSubmit={handleSaveTestimonials} className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
              Client Testimonials & Executive Quotes
            </h3>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Save Testimonials
            </button>
          </div>

          <div className="space-y-4">
            {testimonialsDraft.map((t, index) => (
              <div key={t.id} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Client Full Name
                    </label>
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => {
                        const updated = [...testimonialsDraft];
                        updated[index].name = e.target.value;
                        setTestimonialsDraft(updated);
                      }}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Designation & Company
                    </label>
                    <input
                      type="text"
                      value={`${t.role} · ${t.company}`}
                      onChange={(e) => {
                        const parts = e.target.value.split('·');
                        const updated = [...testimonialsDraft];
                        updated[index].role = parts[0]?.trim() || '';
                        updated[index].company = parts[1]?.trim() || '';
                        setTestimonialsDraft(updated);
                      }}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Avatar Photo URL
                    </label>
                    <input
                      type="url"
                      value={t.avatarUrl}
                      onChange={(e) => {
                        const updated = [...testimonialsDraft];
                        updated[index].avatarUrl = e.target.value;
                        setTestimonialsDraft(updated);
                      }}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Testimonial Quote Content
                  </label>
                  <textarea
                    value={t.quote}
                    onChange={(e) => {
                      const updated = [...testimonialsDraft];
                      updated[index].quote = e.target.value;
                      setTestimonialsDraft(updated);
                    }}
                    rows={2}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      )}

      {/* ── TAB 4: SERVICES & SQUADS ── */}
      {activeTab === 'services' && (
        <form onSubmit={handleSaveServices} className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
              Core Capabilities & Squad Specifications
            </h3>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Save Services
            </button>
          </div>

          <div className="space-y-4">
            {servicesDraft.map((s, index) => (
              <div key={s.id} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => {
                        const updated = [...servicesDraft];
                        updated[index].title = e.target.value;
                        setServicesDraft(updated);
                      }}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Tagline / Stack Summary
                    </label>
                    <input
                      type="text"
                      value={s.tagline}
                      onChange={(e) => {
                        const updated = [...servicesDraft];
                        updated[index].tagline = e.target.value;
                        setServicesDraft(updated);
                      }}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Detailed Scope Description
                  </label>
                  <textarea
                    value={s.description}
                    onChange={(e) => {
                      const updated = [...servicesDraft];
                      updated[index].description = e.target.value;
                      setServicesDraft(updated);
                    }}
                    rows={2}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      )}

      {/* ── TAB 5: ALL IMAGE ASSET OVERRIDES ── */}
      {activeTab === 'images' && (
        <form onSubmit={handleSaveImages} className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
              Centralized Image Asset Overrides
            </h3>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Save All Image Assets
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(customImagesDraft).map(([key, url]) => (
              <div key={key} className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-teal)]">
                    {key}
                  </span>
                </div>
                <div className="w-full h-36 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] overflow-hidden flex items-center justify-center">
                  <img src={url} alt={key} className="w-full h-full object-cover" />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setCustomImagesDraft({
                      ...customImagesDraft,
                      [key]: e.target.value
                    });
                  }}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none font-mono"
                />
              </div>
            ))}
          </div>
        </form>
      )}

    </div>
  );
};
