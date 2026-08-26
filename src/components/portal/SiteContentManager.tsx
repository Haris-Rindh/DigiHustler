import React, { useState } from 'react';
import { 
  FileText, Image as ImageIcon, Sparkles, Check, RotateCcw, 
  Plus, Trash2, Eye, Layout, Star, Briefcase, Users, Layers, ExternalLink,
  DollarSign, HelpCircle, Info, PhoneCall, ChevronRight, X, ShieldAlert, CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  SiteContent, SiteCaseStudy, SiteTestimonial, SiteServiceItem, 
  SiteTeamMember, SitePackage, SiteFAQ, SiteValueProp, GroupId 
} from '../../types';
import { PERMISSIONS } from '../../lib/permissions';

export const SiteContentManager: React.FC = () => {
  const { 
    siteContent, updateSiteContent, addItemToSiteContent, 
    removeItemFromSiteContent, updateItemInSiteContent, 
    resetSiteContent, currentTier, currentUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'hero' | 'valueProps' | 'caseStudies' | 'testimonials' | 'services' | 'packages' | 'team' | 'faqs' | 'about' | 'contact' | 'images'
  >('hero');

  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  // Active drafts
  const [heroDraft, setHeroDraft] = useState(siteContent.hero);
  const [aboutDraft, setAboutDraft] = useState(siteContent.about || { mission: '', vision: '', story: '', values: [] });
  const [contactDraft, setContactDraft] = useState(siteContent.contact || { email: '', phone: '', address: '' });
  const [customImagesDraft, setCustomImagesDraft] = useState(siteContent.customImages || {});

  // New item modal states
  const [showAddCaseStudy, setShowAddCaseStudy] = useState(false);
  const [newCaseStudy, setNewCaseStudy] = useState<Partial<SiteCaseStudy>>({
    title: '', slug: '', category: 'Web Development', client: '', tags: ['React', 'TypeScript'],
    summary: '', impactMetric: '+100%', impactLabel: 'Growth', imageUrl: '', deliverables: ['Production Build']
  });

  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState<Partial<SiteTestimonial>>({
    name: '', role: '', company: '', quote: '', avatarUrl: '', rating: 5
  });

  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState<Partial<SiteServiceItem>>({
    groupId: 'tech', title: '', tagline: '', description: '', features: ['Scalable Architecture'], color: '#1F7A8C'
  });

  const [showAddPackage, setShowAddPackage] = useState(false);
  const [newPackage, setNewPackage] = useState<Partial<SitePackage>>({
    name: '', price: '$2,500', desc: '', popular: false, features: ['Full Source Code', 'SLA Warranty'], turnaround: '2 Weeks', ctaText: 'Select Package'
  });

  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeam, setNewTeam] = useState<Partial<SiteTeamMember>>({
    name: '', role: '', squad: 'Engineering', bio: '', avatarUrl: '', tags: ['Specialist']
  });

  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const [newFAQ, setNewFAQ] = useState<Partial<SiteFAQ>>({
    question: '', answer: '', category: 'General'
  });

  const [showAddValueProp, setShowAddValueProp] = useState(false);
  const [newValueProp, setNewValueProp] = useState<Partial<SiteValueProp>>({
    title: '', description: '', badge: 'Core Advantage'
  });

  const [newImageKey, setNewImageKey] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const canEdit = PERMISSIONS.canEditWebsiteContent(currentTier, currentUser);

  if (!canEdit) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-rose-500/30 shadow-xl max-w-md mx-auto">
          <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h2 className="font-display font-bold text-lg text-[var(--text-heading)] mb-1">Restricted Access</h2>
          <p className="text-xs text-[var(--text-body)] mb-4">
            Only Executive CEO authority (or users with delegated CMS permissions) can access the Live Website CMS Studio.
          </p>
          <a
            href="/portal/dashboard"
            className="px-4 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const triggerSaved = (msg: string = 'Changes published live successfully!') => {
    setSavedFeedback(msg);
    setTimeout(() => setSavedFeedback(null), 2500);
  };

  // Section Save Handlers
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent('hero', heroDraft);
    triggerSaved('Hero section updated live!');
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent('about', aboutDraft);
    triggerSaved('Company story & mission updated live!');
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent('contact', contactDraft);
    triggerSaved('Contact information and social links updated live!');
  };

  const handleSaveCustomImages = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent('customImages', customImagesDraft);
    triggerSaved('Image asset URLs updated live!');
  };

  // Create Handlers
  const handleCreateCaseStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseStudy.title || !newCaseStudy.slug) return;
    const item: SiteCaseStudy = {
      id: `cs-${Date.now()}`,
      slug: newCaseStudy.slug.toLowerCase().replace(/\s+/g, '-'),
      category: newCaseStudy.category || 'Web Development',
      title: newCaseStudy.title,
      client: newCaseStudy.client || 'Enterprise Partner',
      tags: newCaseStudy.tags || ['React'],
      summary: newCaseStudy.summary || '',
      impactMetric: newCaseStudy.impactMetric || '+100%',
      impactLabel: newCaseStudy.impactLabel || 'Conversion Growth',
      imageUrl: newCaseStudy.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      deliverables: newCaseStudy.deliverables || ['Full Architecture']
    };
    addItemToSiteContent('caseStudies', item);
    setShowAddCaseStudy(false);
    setNewCaseStudy({ title: '', slug: '', category: 'Web Development', client: '', tags: ['React'], summary: '', impactMetric: '+100%', impactLabel: 'Growth', imageUrl: '', deliverables: [] });
    triggerSaved('New Case Study added!');
  };

  const handleCreateTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.quote) return;
    const item: SiteTestimonial = {
      id: `t-${Date.now()}`,
      name: newTestimonial.name,
      role: newTestimonial.role || 'Executive',
      company: newTestimonial.company || 'Enterprise',
      quote: newTestimonial.quote,
      avatarUrl: newTestimonial.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      rating: newTestimonial.rating || 5
    };
    addItemToSiteContent('testimonials', item);
    setShowAddTestimonial(false);
    setNewTestimonial({ name: '', role: '', company: '', quote: '', avatarUrl: '', rating: 5 });
    triggerSaved('New Testimonial added!');
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title) return;
    const item: SiteServiceItem = {
      id: `s-${Date.now()}`,
      groupId: (newService.groupId as GroupId) || 'tech',
      title: newService.title,
      tagline: newService.tagline || '',
      description: newService.description || '',
      features: newService.features || [],
      color: newService.color || '#1F7A8C'
    };
    addItemToSiteContent('services', item);
    setShowAddService(false);
    setNewService({ groupId: 'tech', title: '', tagline: '', description: '', features: [], color: '#1F7A8C' });
    triggerSaved('New Capability Service added!');
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackage.name || !newPackage.price) return;
    const item: SitePackage = {
      id: `pkg-${Date.now()}`,
      name: newPackage.name,
      price: newPackage.price,
      desc: newPackage.desc || '',
      popular: newPackage.popular || false,
      features: newPackage.features || [],
      turnaround: newPackage.turnaround || '2 Weeks',
      ctaText: newPackage.ctaText || 'Get Started'
    };
    addItemToSiteContent('packages', item);
    setShowAddPackage(false);
    setNewPackage({ name: '', price: '', desc: '', popular: false, features: [], turnaround: '', ctaText: '' });
    triggerSaved('New Pricing Package added!');
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name) return;
    const item: SiteTeamMember = {
      id: `tm-${Date.now()}`,
      name: newTeam.name,
      role: newTeam.role || 'Specialist',
      squad: newTeam.squad || 'Engineering',
      bio: newTeam.bio || '',
      avatarUrl: newTeam.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      tags: newTeam.tags || []
    };
    addItemToSiteContent('teamMembers', item);
    setShowAddTeam(false);
    setNewTeam({ name: '', role: '', squad: 'Engineering', bio: '', avatarUrl: '', tags: [] });
    triggerSaved('New Team Profile added!');
  };

  const handleCreateFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFAQ.question || !newFAQ.answer) return;
    const item: SiteFAQ = {
      id: `faq-${Date.now()}`,
      question: newFAQ.question,
      answer: newFAQ.answer,
      category: newFAQ.category || 'General'
    };
    addItemToSiteContent('faqs', item);
    setShowAddFAQ(false);
    setNewFAQ({ question: '', answer: '', category: 'General' });
    triggerSaved('New FAQ added!');
  };

  const handleCreateValueProp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValueProp.title) return;
    const item: SiteValueProp = {
      id: `vp-${Date.now()}`,
      title: newValueProp.title,
      description: newValueProp.description || '',
      badge: newValueProp.badge || 'Advantage'
    };
    addItemToSiteContent('valueProps', item);
    setShowAddValueProp(false);
    setNewValueProp({ title: '', description: '', badge: '' });
    triggerSaved('New Value Proposition card added!');
  };

  const handleAddCustomImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageKey.trim() || !newImageUrl.trim()) return;
    const updated = {
      ...customImagesDraft,
      [newImageKey.trim()]: newImageUrl.trim()
    };
    setCustomImagesDraft(updated);
    updateSiteContent('customImages', updated);
    setNewImageKey('');
    setNewImageUrl('');
    triggerSaved(`Added custom image slot '${newImageKey}'!`);
  };

  const handleRemoveCustomImage = (key: string) => {
    if (confirm(`Remove image slot '${key}'?`)) {
      const updated = { ...customImagesDraft };
      delete updated[key];
      setCustomImagesDraft(updated);
      updateSiteContent('customImages', updated);
      triggerSaved(`Removed image slot '${key}'!`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--brand-teal)] uppercase tracking-wider mb-1">
            <Layout className="w-3.5 h-3.5" />
            <span>Master Executive CMS Studio</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)]">
            Live Website Content & Asset Studio
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-body)]">
            Full dynamic control over all 10 areas of the public site with instant add, edit, and delete capabilities.
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

          <button
            onClick={() => {
              if (confirm('Reset entire website content back to default company branding?')) {
                resetSiteContent();
                triggerSaved('Website restored to defaults!');
              }
            }}
            className="flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {savedFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{savedFeedback}</span>
          </span>
          <span className="text-[10px] uppercase font-mono">Live In Storage</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-1.5 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto">
        {[
          { id: 'hero' as const, label: 'Hero & Pitch', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'valueProps' as const, label: 'Value Props (Why Us)', icon: <Layout className="w-3.5 h-3.5" /> },
          { id: 'caseStudies' as const, label: 'Case Studies', icon: <Briefcase className="w-3.5 h-3.5" /> },
          { id: 'testimonials' as const, label: 'Testimonials', icon: <Star className="w-3.5 h-3.5" /> },
          { id: 'services' as const, label: 'Services & Squads', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'packages' as const, label: 'Pricing Packages', icon: <DollarSign className="w-3.5 h-3.5" /> },
          { id: 'team' as const, label: 'Team Profiles', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'faqs' as const, label: 'FAQs', icon: <HelpCircle className="w-3.5 h-3.5" /> },
          { id: 'about' as const, label: 'Company Story', icon: <Info className="w-3.5 h-3.5" /> },
          { id: 'contact' as const, label: 'Contact & Socials', icon: <PhoneCall className="w-3.5 h-3.5" /> },
          { id: 'images' as const, label: 'Image Asset Studio', icon: <ImageIcon className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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

      {/* ── TAB 1: HERO & PITCH ── */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHero} className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">Hero Section Headlines & Conversion Tokens</h3>
            <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer">
              Save Hero Changes
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Top Pill Badge Text</label>
              <input
                type="text"
                value={heroDraft.badgeText}
                onChange={(e) => setHeroDraft({ ...heroDraft, badgeText: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Hero Image Preview URL</label>
              <input
                type="url"
                value={heroDraft.heroImage}
                onChange={(e) => setHeroDraft({ ...heroDraft, heroImage: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Headline Line 1</label>
              <input
                type="text"
                value={heroDraft.headlineLine1}
                onChange={(e) => setHeroDraft({ ...heroDraft, headlineLine1: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Headline Highlighted Gradient</label>
              <input
                type="text"
                value={heroDraft.headlineHighlight}
                onChange={(e) => setHeroDraft({ ...heroDraft, headlineHighlight: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none font-bold text-[var(--brand-teal)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Headline Line 2</label>
              <input
                type="text"
                value={heroDraft.headlineLine2}
                onChange={(e) => setHeroDraft({ ...heroDraft, headlineLine2: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Sub-Headline Pitch</label>
            <textarea
              value={heroDraft.subheadline}
              onChange={(e) => setHeroDraft({ ...heroDraft, subheadline: e.target.value })}
              rows={3}
              className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Primary CTA Label</label>
              <input
                type="text"
                value={heroDraft.ctaPrimaryText}
                onChange={(e) => setHeroDraft({ ...heroDraft, ctaPrimaryText: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Secondary CTA Label</label>
              <input
                type="text"
                value={heroDraft.ctaSecondaryText}
                onChange={(e) => setHeroDraft({ ...heroDraft, ctaSecondaryText: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Metric Value</label>
              <input
                type="text"
                value={heroDraft.metricsBadgeValue}
                onChange={(e) => setHeroDraft({ ...heroDraft, metricsBadgeValue: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Metric Label</label>
              <input
                type="text"
                value={heroDraft.metricsBadgeLabel}
                onChange={(e) => setHeroDraft({ ...heroDraft, metricsBadgeLabel: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}

      {/* ── TAB 2: VALUE PROPOSITIONS (WHY US) ── */}
      {activeTab === 'valueProps' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">Value Proposition Cards ("Why DigiHust")</h3>
            <button
              onClick={() => setShowAddValueProp(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Value Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(siteContent.valueProps || []).map((vp) => (
              <div key={vp.id} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)]">
                    {vp.badge || 'Advantage'}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete '${vp.title}'?`)) {
                        removeItemFromSiteContent('valueProps', vp.id);
                        triggerSaved('Value card deleted.');
                      }
                    }}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={vp.title}
                  onChange={(e) => updateItemInSiteContent('valueProps', vp.id, { title: e.target.value })}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                />
                <textarea
                  value={vp.description}
                  onChange={(e) => updateItemInSiteContent('valueProps', vp.id, { description: e.target.value })}
                  rows={2}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-body)] focus:border-[var(--brand-teal)] focus:outline-none"
                />
              </div>
            ))}
          </div>

          {/* Add Value Prop Modal */}
          {showAddValueProp && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <form onSubmit={handleCreateValueProp} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <h3 className="font-bold text-base text-[var(--text-heading)]">Add Value Proposition Card</h3>
                  <button type="button" onClick={() => setShowAddValueProp(false)}><X className="w-5 h-5" /></button>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={newValueProp.badge}
                    onChange={(e) => setNewValueProp({ ...newValueProp, badge: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newValueProp.title}
                    onChange={(e) => setNewValueProp({ ...newValueProp, title: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={newValueProp.description}
                    onChange={(e) => setNewValueProp({ ...newValueProp, description: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)]"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2 border-t border-[var(--border-subtle)]">
                  <button type="button" onClick={() => setShowAddValueProp(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)]">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold">Add Card</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: CASE STUDIES & PROJECTS ── */}
      {activeTab === 'caseStudies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">Portfolio Projects & Case Studies ({(siteContent.caseStudies || []).length})</h3>
            <button
              onClick={() => setShowAddCaseStudy(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Case Study</span>
            </button>
          </div>

          <div className="space-y-6">
            {(siteContent.caseStudies || []).map((cs) => (
              <div key={cs.id} className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs uppercase text-[var(--brand-teal)]">{cs.slug}</span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">ID: {cs.id}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete case study '${cs.title}'?`)) {
                        removeItemFromSiteContent('caseStudies', cs.id);
                        triggerSaved('Case Study removed.');
                      }
                    }}
                    className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Project Title</label>
                    <input
                      type="text"
                      value={cs.title}
                      onChange={(e) => updateItemInSiteContent('caseStudies', cs.id, { title: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Client Organization</label>
                    <input
                      type="text"
                      value={cs.client}
                      onChange={(e) => updateItemInSiteContent('caseStudies', cs.id, { client: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Category</label>
                    <input
                      type="text"
                      value={cs.category}
                      onChange={(e) => updateItemInSiteContent('caseStudies', cs.id, { category: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Impact Metric (e.g. +140%)</label>
                    <input
                      type="text"
                      value={cs.impactMetric}
                      onChange={(e) => updateItemInSiteContent('caseStudies', cs.id, { impactMetric: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Impact Label</label>
                    <input
                      type="text"
                      value={cs.impactLabel}
                      onChange={(e) => updateItemInSiteContent('caseStudies', cs.id, { impactLabel: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Image URL</label>
                    <input
                      type="url"
                      value={cs.imageUrl}
                      onChange={(e) => updateItemInSiteContent('caseStudies', cs.id, { imageUrl: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Summary Description</label>
                  <textarea
                    value={cs.summary}
                    onChange={(e) => updateItemInSiteContent('caseStudies', cs.id, { summary: e.target.value })}
                    rows={2}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Case Study Modal */}
          {showAddCaseStudy && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <form onSubmit={handleCreateCaseStudy} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <h3 className="font-bold text-base text-[var(--text-heading)]">Add New Case Study</h3>
                  <button type="button" onClick={() => setShowAddCaseStudy(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newCaseStudy.title}
                      onChange={(e) => setNewCaseStudy({ ...newCaseStudy, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Slug URL</label>
                    <input
                      type="text"
                      required
                      value={newCaseStudy.slug}
                      onChange={(e) => setNewCaseStudy({ ...newCaseStudy, slug: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Client Name</label>
                    <input
                      type="text"
                      required
                      value={newCaseStudy.client}
                      onChange={(e) => setNewCaseStudy({ ...newCaseStudy, client: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Category</label>
                    <input
                      type="text"
                      value={newCaseStudy.category}
                      onChange={(e) => setNewCaseStudy({ ...newCaseStudy, category: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newCaseStudy.imageUrl}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Impact Metric</label>
                    <input
                      type="text"
                      value={newCaseStudy.impactMetric}
                      onChange={(e) => setNewCaseStudy({ ...newCaseStudy, impactMetric: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Impact Label</label>
                    <input
                      type="text"
                      value={newCaseStudy.impactLabel}
                      onChange={(e) => setNewCaseStudy({ ...newCaseStudy, impactLabel: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Summary</label>
                  <textarea
                    rows={2}
                    value={newCaseStudy.summary}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, summary: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                  <button type="button" onClick={() => setShowAddCaseStudy(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)]">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold">Create Case Study</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: CLIENT TESTIMONIALS ── */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">Client Testimonials ({(siteContent.testimonials || []).length})</h3>
            <button
              onClick={() => setShowAddTestimonial(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div className="space-y-4">
            {(siteContent.testimonials || []).map((t) => (
              <div key={t.id} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--brand-teal)]">{t.name}</span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete testimonial from ${t.name}?`)) {
                        removeItemFromSiteContent('testimonials', t.id);
                        triggerSaved('Testimonial removed.');
                      }
                    }}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Author Name</label>
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => updateItemInSiteContent('testimonials', t.id, { name: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Role & Company</label>
                    <input
                      type="text"
                      value={`${t.role} · ${t.company}`}
                      onChange={(e) => {
                        const parts = e.target.value.split('·');
                        updateItemInSiteContent('testimonials', t.id, { role: parts[0]?.trim() || '', company: parts[1]?.trim() || '' });
                      }}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Avatar Photo URL</label>
                    <input
                      type="url"
                      value={t.avatarUrl}
                      onChange={(e) => updateItemInSiteContent('testimonials', t.id, { avatarUrl: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Quote</label>
                  <textarea
                    value={t.quote}
                    onChange={(e) => updateItemInSiteContent('testimonials', t.id, { quote: e.target.value })}
                    rows={2}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Testimonial Modal */}
          {showAddTestimonial && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <form onSubmit={handleCreateTestimonial} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <h3 className="font-bold text-base text-[var(--text-heading)]">Add Testimonial</h3>
                  <button type="button" onClick={() => setShowAddTestimonial(false)}><X className="w-5 h-5" /></button>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Client Full Name</label>
                  <input
                    type="text"
                    required
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Job Title</label>
                    <input
                      type="text"
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Company</label>
                    <input
                      type="text"
                      value={newTestimonial.company}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={newTestimonial.avatarUrl}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, avatarUrl: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Quote</label>
                  <textarea
                    required
                    rows={3}
                    value={newTestimonial.quote}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                  <button type="button" onClick={() => setShowAddTestimonial(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)]">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold">Add Testimonial</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 5: PRICING PACKAGES ── */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">Investment & Pricing Packages ({(siteContent.packages || []).length})</h3>
            <button
              onClick={() => setShowAddPackage(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(siteContent.packages || []).map((pkg) => (
              <div key={pkg.id} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[var(--text-heading)]">{pkg.name}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete package '${pkg.name}'?`)) {
                          removeItemFromSiteContent('packages', pkg.id);
                          triggerSaved('Package deleted.');
                        }
                      }}
                      className="p-1 text-[var(--text-muted)] hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={pkg.price}
                    onChange={(e) => updateItemInSiteContent('packages', pkg.id, { price: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-sm font-black text-[var(--brand-teal)]"
                  />
                  <textarea
                    value={pkg.desc}
                    onChange={(e) => updateItemInSiteContent('packages', pkg.id, { desc: e.target.value })}
                    rows={2}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-body)]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Package Modal */}
          {showAddPackage && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <form onSubmit={handleCreatePackage} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <h3 className="font-bold text-base text-[var(--text-heading)]">Add Pricing Package</h3>
                  <button type="button" onClick={() => setShowAddPackage(false)}><X className="w-5 h-5" /></button>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Package Name</label>
                  <input
                    type="text"
                    required
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Price String</label>
                  <input
                    type="text"
                    required
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newPackage.desc}
                    onChange={(e) => setNewPackage({ ...newPackage, desc: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                  <button type="button" onClick={() => setShowAddPackage(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)]">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold">Add Package</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 6: FAQS ── */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">Frequently Asked Questions ({(siteContent.faqs || []).length})</h3>
            <button
              onClick={() => setShowAddFAQ(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {(siteContent.faqs || []).map((f) => (
              <div key={f.id} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--brand-teal)] uppercase tracking-wider">{f.category || 'General'}</span>
                  <button
                    onClick={() => {
                      if (confirm('Delete this FAQ item?')) {
                        removeItemFromSiteContent('faqs', f.id);
                        triggerSaved('FAQ removed.');
                      }
                    }}
                    className="p-1 text-[var(--text-muted)] hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={f.question}
                  onChange={(e) => updateItemInSiteContent('faqs', f.id, { question: e.target.value })}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-heading)]"
                />
                <textarea
                  value={f.answer}
                  onChange={(e) => updateItemInSiteContent('faqs', f.id, { answer: e.target.value })}
                  rows={3}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-body)]"
                />
              </div>
            ))}
          </div>

          {/* Add FAQ Modal */}
          {showAddFAQ && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <form onSubmit={handleCreateFAQ} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <h3 className="font-bold text-base text-[var(--text-heading)]">Add FAQ Item</h3>
                  <button type="button" onClick={() => setShowAddFAQ(false)}><X className="w-5 h-5" /></button>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Question</label>
                  <input
                    type="text"
                    required
                    value={newFAQ.question}
                    onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Answer</label>
                  <textarea
                    required
                    rows={3}
                    value={newFAQ.answer}
                    onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                  <button type="button" onClick={() => setShowAddFAQ(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)]">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold">Add FAQ</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 7: COMPANY STORY & ABOUT ── */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">Company Story, Mission & Core Values</h3>
            <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer">
              Save Story Changes
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Company Mission</label>
              <textarea
                value={aboutDraft.mission}
                onChange={(e) => setAboutDraft({ ...aboutDraft, mission: e.target.value })}
                rows={3}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Company Vision</label>
              <textarea
                value={aboutDraft.vision}
                onChange={(e) => setAboutDraft({ ...aboutDraft, vision: e.target.value })}
                rows={3}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Founding Story Paragraph</label>
            <textarea
              value={aboutDraft.story}
              onChange={(e) => setAboutDraft({ ...aboutDraft, story: e.target.value })}
              rows={4}
              className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs leading-relaxed"
            />
          </div>
        </form>
      )}

      {/* ── TAB 8: CONTACT & SOCIALS ── */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveContact} className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">Global Contact Information & Social Handles</h3>
            <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer">
              Save Contact Details
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Official Email</label>
              <input
                type="email"
                value={contactDraft.email}
                onChange={(e) => setContactDraft({ ...contactDraft, email: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Phone Number</label>
              <input
                type="text"
                value={contactDraft.phone}
                onChange={(e) => setContactDraft({ ...contactDraft, phone: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">WhatsApp Direct</label>
              <input
                type="text"
                value={contactDraft.whatsapp}
                onChange={(e) => setContactDraft({ ...contactDraft, whatsapp: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Calendly Booking Link</label>
              <input
                type="url"
                value={contactDraft.calendlyUrl}
                onChange={(e) => setContactDraft({ ...contactDraft, calendlyUrl: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={contactDraft.linkedin}
                onChange={(e) => setContactDraft({ ...contactDraft, linkedin: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">GitHub URL</label>
              <input
                type="url"
                value={contactDraft.github}
                onChange={(e) => setContactDraft({ ...contactDraft, github: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>
        </form>
      )}

      {/* ── TAB 9: IMAGE ASSET STUDIO ── */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          <form onSubmit={handleAddCustomImage} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
            <h3 className="font-bold text-sm text-[var(--text-heading)]">Add New Image Slot</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Slot Key (e.g. founderSignature)"
                  value={newImageKey}
                  onChange={(e) => setNewImageKey(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <input
                  type="url"
                  placeholder="Image URL (https://images.unsplash.com/...)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                >
                  Add Slot
                </button>
              </div>
            </div>
          </form>

          <form onSubmit={handleSaveCustomImages} className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">Active Image Asset Overrides</h3>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save All Images
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(customImagesDraft).map(([key, url]) => (
                <div key={key} className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-teal)]">{key}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomImage(key)}
                      className="p-1 text-[var(--text-muted)] hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-full h-36 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] overflow-hidden flex items-center justify-center">
                    <img src={url} alt={key} className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setCustomImagesDraft({ ...customImagesDraft, [key]: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] font-mono"
                  />
                </div>
              ))}
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
