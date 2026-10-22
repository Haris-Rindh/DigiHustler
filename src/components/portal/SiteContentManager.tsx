import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Image as ImageIcon, Check, RotateCcw, 
  Plus, Trash2, Eye, Layout, Star, Briefcase, Users, Layers, ExternalLink,
  DollarSign, HelpCircle, Info, PhoneCall, ChevronRight, X, ShieldAlert, CheckCircle2,
  Mail, Download, Upload, Loader2, Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  SiteContent, SiteCaseStudy, SiteTestimonial, SiteServiceItem, 
  SiteTeamMember, SitePackage, SiteFAQ, SiteValueProp, SiteBlogPost, GroupId 
} from '../../types';
import { DEFAULT_SITE_CONTENT } from '../../services/mockData';
import { PERMISSIONS } from '../../lib/permissions';
import { AVAILABLE_SERVICE_ICONS, getServiceIcon } from '../../lib/serviceIcons';
import { dbService } from '../../lib/dbService';
import { compressAvatarFile } from '../../lib/utils';
import { formatImageUrl, handleImageError } from '../../lib/imageUrlHelper';

const SERVICE_PATTERN_OPTIONS = [
  { id: 'dotted-grid', label: 'Dotted Grid' },
  { id: 'concentric-rings', label: 'Concentric Rings' },
  { id: 'diagonal-hatch', label: 'Diagonal Hatch' },
  { id: 'flowing-waves', label: 'Flowing Waves' },
  { id: 'mesh-gradient', label: 'Mesh Gradient' },
  { id: 'isometric-grid', label: 'Isometric Grid' },
] as const;

const SERVICE_SIZE_OPTIONS = [
  { id: 'large', label: 'Large (7 cols / Row 1)' },
  { id: 'medium', label: 'Medium (5 cols / Row 1)' },
  { id: 'small', label: 'Small (4 cols / Row 2)' },
] as const;

const CURATED_SERVICE_IMAGE_PRESETS = [
  { label: 'Web Tech', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'UI/UX 3D', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI & Data', url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Video Studio', url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Growth SEO', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cybersecurity', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80' },
];

const CURATED_PORTFOLIO_IMAGE_PRESETS = [
  { label: 'E-Commerce', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80' },
  { label: 'FinTech / Trading', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Real Estate', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Brand 3D / Motion', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI & Data Bot', url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&q=80' },
  { label: 'BI Analytics', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
];

const CURATED_BLOG_IMAGE_PRESETS = [
  { label: 'Engineering / Code', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI / Automation', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cybersecurity', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cloud Architecture', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Product & Design', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80' },
];

export const SiteContentManager: React.FC = () => {
  const { 
    siteContent, updateSiteContent, addItemToSiteContent, 
    removeItemFromSiteContent, updateItemInSiteContent, 
    resetSiteContent, currentTier, currentUser, showToast, users 
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'hero' | 'valueProps' | 'caseStudies' | 'testimonials' | 'services' | 'packages' | 'team' | 'blog' | 'faqs' | 'about' | 'contact' | 'images' | 'careers' | 'newsletter'
  >('hero');

  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  // Helper to reliably resolve current active contact illustration
  const getResolvedContactIllustration = (content?: SiteContent | null): string => {
    if (!content) return '/contact-illustration.png';
    return (
      (content.customImages?.contactFormImage && content.customImages.contactFormImage !== '/contact-illustration.png' ? content.customImages.contactFormImage : null) ||
      (content.contact?.illustrationUrl && content.contact.illustrationUrl !== '/contact-illustration.png' ? content.contact.illustrationUrl : null) ||
      (content.contact?.formImageUrl && content.contact.formImageUrl !== '/contact-illustration.png' ? content.contact.formImageUrl : null) ||
      (content.contactIllustrationUrl && content.contactIllustrationUrl !== '/contact-illustration.png' ? content.contactIllustrationUrl : null) ||
      content.customImages?.contactFormImage ||
      content.contact?.illustrationUrl ||
      content.contactIllustrationUrl ||
      '/contact-illustration.png'
    );
  };

  // Active drafts with robust default fallbacks
  const safeContent = siteContent || DEFAULT_SITE_CONTENT;
  const [heroDraft, setHeroDraft] = useState(safeContent.hero || DEFAULT_SITE_CONTENT.hero);
  const [howItWorksVideoUrlDraft, setHowItWorksVideoUrlDraft] = useState(safeContent.howItWorksVideoUrl || '');
  const [aboutDraft, setAboutDraft] = useState(safeContent.about || DEFAULT_SITE_CONTENT.about);
  const [contactDraft, setContactDraft] = useState(() => {
    const base = safeContent.contact || DEFAULT_SITE_CONTENT.contact;
    const resolvedIll = getResolvedContactIllustration(safeContent);
    return {
      ...base,
      illustrationUrl: base.illustrationUrl || resolvedIll,
      formImageUrl: base.formImageUrl || resolvedIll,
    };
  });
  const [careersDraft, setCareersDraft] = useState(safeContent.careers || { noPositionsMessage: "We're always looking for exceptional talent, but we don't have any open positions right now. Check back soon!", openPositions: [] });
  const [customImagesDraft, setCustomImagesDraft] = useState(safeContent.customImages || {});

  // Newsletter & Illustration state
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<Array<{ id: string; email: string; created_at: string }>>([]);
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);
  const [newsletterSearch, setNewsletterSearch] = useState('');
  const [isUploadingIllustration, setIsUploadingIllustration] = useState(false);
  const [uploadingTargetId, setUploadingTargetId] = useState<string | null>(null);

  const uploadAssetSafely = async (file: File, folder = 'site-assets'): Promise<string | null> => {
    let finalUrl: string | null = null;
    try {
      finalUrl = await dbService.uploadSiteAsset(file, folder);
    } catch (uploadErr) {
      console.warn('Storage upload error, falling back to local compression:', uploadErr);
    }

    if (!finalUrl) {
      // Fallback to client-side compressed base64 data URL
      try {
        finalUrl = await compressAvatarFile(file, 1200, 0.85);
      } catch (compErr) {
        console.error('Image compression failed:', compErr);
      }
    }

    return finalUrl;
  };

  useEffect(() => {
    if (activeTab === 'newsletter') {
      setIsNewsletterLoading(true);
      dbService.fetchNewsletterSubscribers().then((data) => {
        setNewsletterSubscribers(data);
        setIsNewsletterLoading(false);
      });
    }
  }, [activeTab]);

  // Keep drafts synchronized with latest cloud state
  useEffect(() => {
    if (siteContent?.hero) setHeroDraft(siteContent.hero);
    if (siteContent?.about) setAboutDraft(siteContent.about);
    if (siteContent?.contact) {
      const resolvedIll = getResolvedContactIllustration(siteContent);
      setContactDraft({
        ...siteContent.contact,
        illustrationUrl: siteContent.contact.illustrationUrl || resolvedIll,
        formImageUrl: siteContent.contact.formImageUrl || resolvedIll,
      });
    }
    if (siteContent?.customImages) setCustomImagesDraft(siteContent.customImages);
  }, [siteContent]);

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

  const [showAddBlog, setShowAddBlog] = useState(false);
  const [newBlog, setNewBlog] = useState<Partial<SiteBlogPost>>({
    title: '', slug: '', excerpt: '', content: '', category: 'Engineering',
    author: currentUser?.name || 'Haris Asad', readTime: '6 min read',
    publishedAt: new Date().toISOString().split('T')[0],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    isPublished: true, tags: ['Engineering', 'Architecture']
  });

  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState<Partial<SiteServiceItem>>({
    groupId: 'tech',
    title: '',
    slug: '',
    order: 1,
    size: 'small',
    icon: 'terminal',
    patternVariant: 'dotted-grid',
    tagline: '',
    description: '',
    shortDescription: '',
    linkTarget: '',
    features: ['Scalable Architecture'],
    color: '#1F7A8C',
    imageUrl: ''
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
    showToast(msg, 'success', 'Changes Saved', 4000);
    setTimeout(() => setSavedFeedback(null), 3500);
  };

  // Section Save Handlers
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent('hero', heroDraft);
    updateSiteContent('howItWorksVideoUrl', howItWorksVideoUrlDraft);
    triggerSaved('Hero section updated live!');
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent('about', aboutDraft);
    triggerSaved('Company story & mission updated live!');
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    const illUrl = (contactDraft as any).illustrationUrl || (contactDraft as any).formImageUrl || getResolvedContactIllustration(safeContent);
    const updatedContact = {
      ...contactDraft,
      illustrationUrl: illUrl,
      formImageUrl: illUrl,
    };
    setContactDraft(updatedContact);
    const updatedCustomImages = {
      ...customImagesDraft,
      contactFormImage: illUrl,
    };
    setCustomImagesDraft(updatedCustomImages);

    // Atomically persist all contact illustration properties in one transaction
    updateSiteContent({
      contact: updatedContact,
      contactIllustrationUrl: illUrl,
      customImages: updatedCustomImages,
    } as any);

    triggerSaved('Contact information and illustration updated live!');
  };

  const handleExportNewsletterCsv = () => {
    if (newsletterSubscribers.length === 0) {
      showToast('No subscribers to export.', 'info');
      return;
    }
    const header = 'ID,Email,Subscribed Date\n';
    const rows = newsletterSubscribers.map((s) => `"${s.id}","${s.email}","${s.created_at}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `digihust_newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Subscribers exported to CSV successfully.', 'success');
  };

  const handleIllustrationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingIllustration(true);
    try {
      let finalUrl: string | null = null;
      try {
        finalUrl = await dbService.uploadSiteAsset(file, 'contact');
      } catch (uploadErr) {
        console.warn('Storage upload error, falling back to local compression:', uploadErr);
      }

      if (!finalUrl) {
        // Fallback to client-side compressed base64 data URL
        finalUrl = await compressAvatarFile(file, 900, 0.85);
      }

      if (finalUrl) {
        const updatedContact = {
          ...contactDraft,
          illustrationUrl: finalUrl,
          formImageUrl: finalUrl,
        };
        setContactDraft(updatedContact);
        const updatedCustomImages = {
          ...customImagesDraft,
          contactFormImage: finalUrl,
        };
        setCustomImagesDraft(updatedCustomImages);

        // Atomically persist all contact illustration properties in one transaction
        updateSiteContent({
          contact: updatedContact,
          contactIllustrationUrl: finalUrl,
          customImages: updatedCustomImages,
        } as any);

        showToast('Contact form illustration uploaded and saved live!', 'success');
      } else {
        showToast('Failed to process image file.', 'error');
      }
    } catch (err) {
      console.error('Illustration upload error:', err);
      showToast('Error uploading image.', 'error');
    } finally {
      setIsUploadingIllustration(false);
      e.target.value = '';
    }
  };

  const handleSaveCareers = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent('careers', careersDraft);
    triggerSaved('Careers page updated live!');
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
        projectUrl: newCaseStudy.projectUrl || '',
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
    const generatedSlug = newService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const item: SiteServiceItem = {
      id: `s-${Date.now()}`,
      groupId: (newService.groupId as GroupId) || 'tech',
      title: newService.title,
      slug: newService.slug || generatedSlug,
      order: Number(newService.order) || (siteContent?.services?.length || 0) + 1,
      size: (newService.size as 'large' | 'medium' | 'small') || 'small',
      icon: newService.icon || 'terminal',
      patternVariant: (newService.patternVariant as any) || 'dotted-grid',
      tagline: newService.tagline || '',
      description: newService.description || '',
      shortDescription: newService.shortDescription || newService.description?.slice(0, 160) || '',
      linkTarget: newService.linkTarget || `/contact?service=${encodeURIComponent(newService.slug || generatedSlug)}`,
      features: newService.features || [],
      color: newService.color || '#1F7A8C',
      imageUrl: newService.imageUrl || ''
    };
    addItemToSiteContent('services', item);
    setShowAddService(false);
    setNewService({
      groupId: 'tech',
      title: '',
      slug: '',
      order: (siteContent?.services?.length || 0) + 2,
      size: 'small',
      icon: 'terminal',
      patternVariant: 'dotted-grid',
      tagline: '',
      description: '',
      shortDescription: '',
      linkTarget: '',
      features: ['Scalable Architecture'],
      color: '#1F7A8C',
      imageUrl: ''
    });
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
        roleTier: newTeam.roleTier,
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

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.slug) return;
    const item: SiteBlogPost = {
      id: `blog-${Date.now()}`,
      slug: newBlog.slug.toLowerCase().replace(/\s+/g, '-'),
      title: newBlog.title,
      excerpt: newBlog.excerpt || '',
      content: newBlog.content || '',
      category: newBlog.category || 'Engineering',
      author: newBlog.author || currentUser?.name || 'Haris Asad',
      readTime: newBlog.readTime || '6 min read',
      publishedAt: newBlog.publishedAt || new Date().toISOString().split('T')[0],
      imageUrl: newBlog.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      isPublished: newBlog.isPublished !== false,
      tags: newBlog.tags || ['Engineering']
    };
    addItemToSiteContent('blogPosts', item);
    setShowAddBlog(false);
    setNewBlog({
      title: '', slug: '', excerpt: '', content: '', category: 'Engineering',
      author: currentUser?.name || 'Haris Asad', readTime: '6 min read',
      publishedAt: new Date().toISOString().split('T')[0],
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      isPublished: true, tags: ['Engineering']
    });
    triggerSaved('New Blog post published live!');
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
              const confirmText = window.prompt(
                'DANGER: This action replaces all live website content (services, blogs, case studies, images) with default placeholder templates.\n\nTo confirm, type "RESET" below:'
              );
              if (confirmText === 'RESET') {
                resetSiteContent();
                triggerSaved('Website restored to defaults!');
              } else if (confirmText !== null) {
                showToast('Reset cancelled: verification text did not match.', 'info');
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
          <span className="text-[10px] uppercase">Live In Storage</span>
        </div>
      )}

      {/* Section Guide | helps users understand what each tab does */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] flex flex-wrap gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span><strong className="text-[var(--text-body)]">Live</strong> | changes appear instantly on the public website</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          <span><strong className="text-[var(--text-body)]">Fallback Active</strong> | website uses built-in defaults until you add your own content here</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] inline-block" />
          <span><strong className="text-[var(--text-body)]">Static</strong> | managed by code, not yet connected to CMS</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1.5 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto">
        {[
          { id: 'hero' as const,        label: '1. Hero Section',     icon: null,                                     status: 'live',     tip: 'Controls the main headline, subtext, badge, and stat tokens on the homepage' },
          { id: 'valueProps' as const,  label: '2. Value Props',      icon: <Award className="w-3.5 h-3.5" />,        status: 'live',     tip: 'Key value propositions and advantages on the homepage' },
          { id: 'services' as const,    label: '3. Services',         icon: <Layers className="w-3.5 h-3.5" />,       status: 'live',     tip: 'The capability cards shown on homepage and /services page' },
          { id: 'caseStudies' as const, label: '4. Case Studies',     icon: <Briefcase className="w-3.5 h-3.5" />,    status: 'live',     tip: 'Work/Portfolio section on homepage and /work page' },
          { id: 'testimonials' as const,label: '5. Testimonials',     icon: <Star className="w-3.5 h-3.5" />,         status: 'live',     tip: 'Client reviews shown on homepage' },
          { id: 'team' as const,        label: '6. Team Profiles',    icon: <Users className="w-3.5 h-3.5" />,        status: 'live',     tip: 'Team members shown on the /team page' },
          { id: 'blog' as const,        label: '7. Blog & Insights',  icon: <FileText className="w-3.5 h-3.5" />,     status: 'live',     tip: 'Manage articles and technical guides on /blog and /blog/:slug' },
          { id: 'faqs' as const,        label: '8. FAQs',             icon: <HelpCircle className="w-3.5 h-3.5" />,   status: 'live',     tip: 'Frequently asked questions shown across the platform' },
          { id: 'about' as const,       label: '9. Company Story',    icon: <Info className="w-3.5 h-3.5" />,         status: 'live',     tip: 'Mission, vision, and company story shown on /about page' },
          { id: 'contact' as const,     label: '10. Contact Info',    icon: <PhoneCall className="w-3.5 h-3.5" />,    status: 'live',     tip: 'Email, phone, and address shown on the /contact page sidebar' },
          { id: 'careers' as const,     label: '11. Careers',         icon: <Briefcase className="w-3.5 h-3.5" />,    status: 'live',     tip: 'Manage open positions and messaging on /careers' },
          { id: 'images' as const,      label: '12. Image Studio',    icon: <ImageIcon className="w-3.5 h-3.5" />,    status: 'live',     tip: 'Manage image slot overrides and custom assets' },
          { id: 'newsletter' as const,  label: '13. Newsletter',      icon: <Mail className="w-3.5 h-3.5" />,         status: 'live',     tip: 'View newsletter subscribers and export to CSV' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.tip}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span className={`w-1.5 h-1.5 rounded-full ml-0.5 ${
              tab.status === 'live' ? 'bg-emerald-400' :
              tab.status === 'fallback' ? 'bg-amber-400' : 'bg-[var(--text-muted)]'
            }`} />
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
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => triggerSaved('All value proposition cards saved live!')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Save All Cards</span>
              </button>
              <button
                onClick={() => setShowAddValueProp(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Value Card</span>
              </button>
            </div>
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
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Auto-saved live</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerSaved(`Value card '${vp.title}' saved live!`)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Card</span>
                  </button>
                </div>
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

      
        {/* ── TAB 2: SERVICES ── */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div>
                <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                  Services & Capabilities ({(siteContent.services || []).length})
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Manage the main service offerings shown on the homepage and /services.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerSaved('All service capabilities saved and synced live!')}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save All Services</span>
                </button>
                <button
                  onClick={() => setShowAddService && setShowAddService(true)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {[...(siteContent.services || [])]
                .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
                .map((service) => {
                  const descLength = (service.shortDescription || '').length;
                  return (
                    <div
                      key={service.id}
                      className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm"
                    >
                      {/* Top Bar with Icon preview, Title and Badges */}
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-teal)] shadow-inner">
                            {getServiceIcon(service.icon, 'w-4 h-4')}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[var(--text-heading)] flex items-center gap-2">
                              <span>{service.title}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] font-bold">
                                #{service.order || 1}
                              </span>
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)] font-semibold">
                                {service.size || 'small'}
                              </span>
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                                {service.patternVariant || 'dotted-grid'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove service '${service.title}'?`)) {
                              removeItemFromSiteContent('services', service.id);
                              triggerSaved('Service removed.');
                            }
                          }}
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                          title="Remove service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 2-Column Fields Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                            Service Title
                          </label>
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) =>
                              updateItemInSiteContent('services', service.id, { title: e.target.value })
                            }
                            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                            Slug
                          </label>
                          <input
                            type="text"
                            value={service.slug || ''}
                            placeholder="e.g. web-mobile-engineering"
                            onChange={(e) =>
                              updateItemInSiteContent('services', service.id, { slug: e.target.value })
                            }
                            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                            Grid Order (Number)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={service.order ?? 1}
                            onChange={(e) =>
                              updateItemInSiteContent('services', service.id, {
                                order: Number(e.target.value),
                              })
                            }
                            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                            Tile Size (12-Col Grid)
                          </label>
                          <select
                            value={service.size || 'small'}
                            onChange={(e) =>
                              updateItemInSiteContent('services', service.id, {
                                size: e.target.value as 'large' | 'medium' | 'small',
                              })
                            }
                            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                          >
                            {SERVICE_SIZE_OPTIONS.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1 flex items-center justify-between">
                            <span>Service Icon</span>
                            <span className="text-[10px] text-[var(--brand-teal)] font-normal flex items-center gap-1">
                              Preview: {getServiceIcon(service.icon, 'w-3 h-3')}
                            </span>
                          </label>
                          <select
                            value={service.icon || 'terminal'}
                            onChange={(e) =>
                              updateItemInSiteContent('services', service.id, { icon: e.target.value })
                            }
                            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                          >
                            {AVAILABLE_SERVICE_ICONS.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                            Generative Pattern
                          </label>
                          <select
                            value={service.patternVariant || 'dotted-grid'}
                            onChange={(e) =>
                              updateItemInSiteContent('services', service.id, {
                                patternVariant: e.target.value as any,
                              })
                            }
                            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                          >
                            {SERVICE_PATTERN_OPTIONS.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                            Tagline / Tech Subtitle
                          </label>
                          <input
                            type="text"
                            value={service.tagline || ''}
                            onChange={(e) =>
                              updateItemInSiteContent('services', service.id, { tagline: e.target.value })
                            }
                            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                            Explore Link Target
                          </label>
                          <input
                            type="text"
                            value={service.linkTarget || ''}
                            placeholder="/contact?service=..."
                            onChange={(e) =>
                              updateItemInSiteContent('services', service.id, { linkTarget: e.target.value })
                            }
                            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                          />
                        </div>
                      </div>

                      {/* Service Card Visual Image */}
                      <div className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)]">
                            Service Card Image
                          </label>
                          {service.imageUrl && (
                            <button
                              type="button"
                              onClick={() => updateItemInSiteContent('services', service.id, { imageUrl: '' })}
                              className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                            >
                              Remove Image
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 items-start">
                          {/* Preview thumbnail */}
                          <div className="w-24 h-16 rounded-xl overflow-hidden bg-black/20 border border-[var(--border-subtle)] shrink-0 relative">
                            {service.imageUrl ? (
                              <img
                                src={formatImageUrl(service.imageUrl, 'development')}
                                alt={service.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => handleImageError(e, undefined, 'development')}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--text-muted)] text-center p-1">
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Inputs & Actions */}
                          <div className="flex-1 space-y-2 w-full">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={service.imageUrl || ''}
                                placeholder="Image URL (https://images.unsplash.com/... or /assets/...)"
                                onChange={(e) =>
                                  updateItemInSiteContent('services', service.id, { imageUrl: e.target.value })
                                }
                                className="flex-1 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-heading)]"
                              />
                              <label className="px-3 py-1.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] text-xs font-bold cursor-pointer whitespace-nowrap flex items-center gap-1.5 transition-colors">
                                {uploadingTargetId === service.id ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--brand-teal)]" />
                                    <span>Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Upload</span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploadingTargetId === service.id}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setUploadingTargetId(service.id);
                                      const url = await uploadAssetSafely(file, 'services');
                                      if (url) {
                                        updateItemInSiteContent('services', service.id, { imageUrl: url });
                                        showToast('Service image updated successfully!', 'success');
                                      } else {
                                        showToast('Failed to process image file.', 'error');
                                      }
                                      setUploadingTargetId(null);
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            {/* Preset Buttons */}
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="text-[10px] text-[var(--text-muted)] mr-1">Presets:</span>
                              {CURATED_SERVICE_IMAGE_PRESETS.map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() =>
                                    updateItemInSiteContent('services', service.id, { imageUrl: preset.url })
                                  }
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-page)] hover:bg-[var(--brand-teal-subtle)] text-[var(--text-body)] hover:text-[var(--brand-teal)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Short Description with Character Counter */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)]">
                            Hover Short Description (Max ~160 chars)
                          </label>
                          <span
                            className={`text-[10px] font-semibold ${
                              descLength > 160 ? 'text-amber-400' : 'text-[var(--text-dim)]'
                            }`}
                          >
                            {descLength} / 160 chars
                          </span>
                        </div>
                        <textarea
                          value={service.shortDescription ?? service.description}
                          onChange={(e) =>
                            updateItemInSiteContent('services', service.id, {
                              shortDescription: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-body)]"
                        />
                      </div>

                      {/* Full Scope Description */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
                          Full Scope Description
                        </label>
                        <textarea
                          value={service.description}
                          onChange={(e) =>
                            updateItemInSiteContent('services', service.id, { description: e.target.value })
                          }
                          rows={3}
                          className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-body)]"
                        />
                      </div>

                      {/* Card Save Action Bar */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                        <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Auto-saved live</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => triggerSaved(`Service '${service.title}' saved live!`)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Service</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {showAddService && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <form
                  onSubmit={handleCreateService}
                  className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                    <h3 className="font-bold text-base text-[var(--text-heading)]">Add New Capability Service</h3>
                    <button
                      type="button"
                      onClick={() => setShowAddService(false)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                        Service Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newService.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                          setNewService({ ...newService, title, slug: newService.slug || slug });
                        }}
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                        Slug
                      </label>
                      <input
                        type="text"
                        value={newService.slug || ''}
                        onChange={(e) => setNewService({ ...newService, slug: e.target.value })}
                        placeholder="e.g. web-mobile-engineering"
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                        Grid Order
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={newService.order || 1}
                        onChange={(e) => setNewService({ ...newService, order: Number(e.target.value) })}
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                        Tile Size (12-Col Grid)
                      </label>
                      <select
                        value={newService.size || 'small'}
                        onChange={(e) =>
                          setNewService({ ...newService, size: e.target.value as 'large' | 'medium' | 'small' })
                        }
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                      >
                        {SERVICE_SIZE_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                        Service Icon
                      </label>
                      <select
                        value={newService.icon || 'terminal'}
                        onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                      >
                        {AVAILABLE_SERVICE_ICONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                        Generative Pattern
                      </label>
                      <select
                        value={newService.patternVariant || 'dotted-grid'}
                        onChange={(e) => setNewService({ ...newService, patternVariant: e.target.value as any })}
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                      >
                        {SERVICE_PATTERN_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                        Tagline / Subtitle
                      </label>
                      <input
                        type="text"
                        value={newService.tagline || ''}
                        onChange={(e) => setNewService({ ...newService, tagline: e.target.value })}
                        placeholder="e.g. Custom React · Next.js · Node.js"
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                      />
                    </div>
                  </div>

                  {/* Service Card Visual Image */}
                  <div className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)]">
                        Service Card Image
                      </label>
                      {newService.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setNewService({ ...newService, imageUrl: '' })}
                          className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                        >
                          Clear Image
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-start">
                      {/* Preview thumbnail */}
                      <div className="w-24 h-16 rounded-xl overflow-hidden bg-black/20 border border-[var(--border-subtle)] shrink-0 relative">
                        {newService.imageUrl ? (
                          <img
                            src={formatImageUrl(newService.imageUrl, 'development')}
                            alt="Service preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, undefined, 'development')}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--text-muted)] text-center p-1">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Inputs & Actions */}
                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newService.imageUrl || ''}
                            placeholder="Image URL (https://images.unsplash.com/... or /assets/...)"
                            onChange={(e) => setNewService({ ...newService, imageUrl: e.target.value })}
                            className="flex-1 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-heading)]"
                          />
                          <label className="px-3 py-1.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] text-xs font-bold cursor-pointer whitespace-nowrap flex items-center gap-1.5 transition-colors">
                            {uploadingTargetId === 'new-service' ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--brand-teal)]" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingTargetId === 'new-service'}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setUploadingTargetId('new-service');
                                  const url = await uploadAssetSafely(file, 'services');
                                  if (url) {
                                    setNewService({ ...newService, imageUrl: url });
                                    showToast('Service image uploaded!', 'success');
                                  } else {
                                    showToast('Failed to process image file.', 'error');
                                  }
                                  setUploadingTargetId(null);
                                }
                              }}
                            />
                          </label>
                        </div>

                        {/* Preset Buttons */}
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[10px] text-[var(--text-muted)] mr-1">Presets:</span>
                          {CURATED_SERVICE_IMAGE_PRESETS.map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setNewService({ ...newService, imageUrl: preset.url })}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-page)] hover:bg-[var(--brand-teal-subtle)] text-[var(--text-body)] hover:text-[var(--brand-teal)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)]">
                        Short Description (Hover preview, max ~160 chars)
                      </label>
                      <span className="text-[10px] text-[var(--text-dim)]">
                        {(newService.shortDescription || '').length} / 160 chars
                      </span>
                    </div>
                    <textarea
                      value={newService.shortDescription || ''}
                      onChange={(e) => setNewService({ ...newService, shortDescription: e.target.value })}
                      rows={2}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                      Full Scope Description *
                    </label>
                    <textarea
                      required
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      rows={3}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={() => setShowAddService(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold"
                    >
                      Add Service
                    </button>
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => triggerSaved('All case studies saved live!')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Save All Case Studies</span>
              </button>
              <button
                onClick={() => setShowAddCaseStudy(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Case Study</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {(siteContent.caseStudies || []).map((cs, idx) => {
              const csId = cs.id || cs.slug || `cs-${idx + 1}`;
              return (
                <div key={csId} className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs uppercase text-[var(--brand-teal)]">{cs.slug || `Project #${idx + 1}`}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">ID: {csId}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete case study '${cs.title}'?`)) {
                          removeItemFromSiteContent('caseStudies', csId, idx);
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
                        onChange={(e) => updateItemInSiteContent('caseStudies', csId, { title: e.target.value }, idx)}
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Client Organization</label>
                      <input
                        type="text"
                        value={cs.client}
                        onChange={(e) => updateItemInSiteContent('caseStudies', csId, { client: e.target.value }, idx)}
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Category</label>
                      <input
                        type="text"
                        value={cs.category}
                        onChange={(e) => updateItemInSiteContent('caseStudies', csId, { category: e.target.value }, idx)}
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Impact Metric (e.g. +140%)</label>
                      <input
                        type="text"
                        value={cs.impactMetric || ''}
                        onChange={(e) => updateItemInSiteContent('caseStudies', csId, { impactMetric: e.target.value }, idx)}
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Impact Label</label>
                      <input
                        type="text"
                        value={cs.impactLabel || ''}
                        onChange={(e) => updateItemInSiteContent('caseStudies', csId, { impactLabel: e.target.value }, idx)}
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold uppercase text-[var(--text-muted)]">Live Demo / External Link</label>
                        {cs.projectUrl && (
                          <a
                            href={cs.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[var(--brand-teal)] hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Open link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      <input
                        type="url"
                        placeholder="https://yourprojectdemo.com"
                        value={cs.projectUrl || ''}
                        onChange={(e) => updateItemInSiteContent('caseStudies', csId, { projectUrl: e.target.value }, idx)}
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Case Study Image & Visual Uploader */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)]">
                        Project Cover Image
                      </label>
                      {cs.imageUrl && (
                        <button
                          type="button"
                          onClick={() => updateItemInSiteContent('caseStudies', csId, { imageUrl: '' }, idx)}
                          className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                        >
                          Reset / Clear
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      {/* Live Thumbnail Preview */}
                      <div className="w-32 h-20 sm:w-40 sm:h-24 rounded-xl overflow-hidden bg-black/20 border border-[var(--border-subtle)] shrink-0 relative flex items-center justify-center">
                        {cs.imageUrl ? (
                          <img
                            src={formatImageUrl(cs.imageUrl, cs.category)}
                            alt={cs.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, undefined, cs.category)}
                          />
                        ) : (
                          <div className="text-[10px] text-[var(--text-muted)] text-center p-2">
                            No Image Uploaded
                          </div>
                        )}
                      </div>

                      {/* Image URL & Upload button */}
                      <div className="flex-1 space-y-2.5 w-full">
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="Paste image link from Postimg, Imgur, Drive, Unsplash, etc."
                            value={cs.imageUrl || ''}
                            onChange={(e) => updateItemInSiteContent('caseStudies', csId, { imageUrl: e.target.value }, idx)}
                            className="flex-1 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] font-mono"
                          />
                          <label className="px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow-sm transition-all active:scale-95">
                            {uploadingTargetId === csId ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Image</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingTargetId === csId}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setUploadingTargetId(csId);
                                  const url = await uploadAssetSafely(file, 'portfolio');
                                  if (url) {
                                    updateItemInSiteContent('caseStudies', csId, { imageUrl: url }, idx);
                                    showToast('Case study image uploaded successfully!', 'success');
                                  } else {
                                    showToast('Failed to process image file.', 'error');
                                  }
                                  setUploadingTargetId(null);
                                }
                              }}
                            />
                          </label>
                        </div>

                        {/* Presets Row */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-[var(--text-muted)] mr-1">Presets:</span>
                          {CURATED_PORTFOLIO_IMAGE_PRESETS.map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => updateItemInSiteContent('caseStudies', csId, { imageUrl: preset.url }, idx)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[var(--bg-page)] hover:bg-[var(--bg-surface)] hover:text-[var(--brand-teal)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Summary Description</label>
                    <textarea
                      value={cs.summary}
                      onChange={(e) => updateItemInSiteContent('caseStudies', csId, { summary: e.target.value }, idx)}
                      rows={2}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)]"
                    />
                  </div>

                  {/* Card Save Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                    <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Auto-saved live</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => triggerSaved(`Case Study '${cs.title}' saved live!`)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Case Study</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Case Study Modal */}
          {showAddCaseStudy && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <form onSubmit={handleCreateCaseStudy} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <h3 className="font-bold text-base text-[var(--text-heading)]">Add New Case Study</h3>
                  <button type="button" onClick={() => setShowAddCaseStudy(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Live Demo / External Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newCaseStudy.projectUrl || ''}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, projectUrl: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                  />
                </div>

                {/* Case Study Image Field */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)]">Project Image</label>
                    {newCaseStudy.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setNewCaseStudy({ ...newCaseStudy, imageUrl: '' })}
                        className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="w-28 h-16 rounded-xl overflow-hidden bg-black/20 border border-[var(--border-subtle)] shrink-0 flex items-center justify-center">
                      {newCaseStudy.imageUrl ? (
                        <img
                          src={formatImageUrl(newCaseStudy.imageUrl, newCaseStudy.category)}
                          alt="Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => handleImageError(e, undefined, newCaseStudy.category)}
                        />
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)]">No Image</span>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newCaseStudy.imageUrl || ''}
                          onChange={(e) => setNewCaseStudy({ ...newCaseStudy, imageUrl: e.target.value })}
                          placeholder="Paste image link or upload..."
                          className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--text-heading)]"
                        />
                        <label className="px-3.5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow-sm transition-all active:scale-95">
                          {uploadingTargetId === 'new-case-study' ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingTargetId === 'new-case-study'}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploadingTargetId('new-case-study');
                                const url = await uploadAssetSafely(file, 'portfolio');
                                if (url) {
                                  setNewCaseStudy({ ...newCaseStudy, imageUrl: url });
                                  showToast('Image uploaded successfully!', 'success');
                                } else {
                                  showToast('Failed to process image file.', 'error');
                                }
                                setUploadingTargetId(null);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Presets */}
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[10px] text-[var(--text-muted)] mr-1">Presets:</span>
                        {CURATED_PORTFOLIO_IMAGE_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setNewCaseStudy({ ...newCaseStudy, imageUrl: preset.url })}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[var(--bg-surface)] hover:text-[var(--brand-teal)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => triggerSaved('All client testimonials saved live!')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Save All Testimonials</span>
              </button>
              <button
                onClick={() => setShowAddTestimonial(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {(siteContent.testimonials || []).map((t) => (
              <div key={t.id} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-xs text-[var(--brand-teal)]">{t.name}</span>
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => updateItemInSiteContent('testimonials', t.id, { rating: star })}
                          className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                          title={`Set rating to ${star} stars`}
                        >
                          <Star className={`w-3.5 h-3.5 ${(t.rating || 5) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                      <span className="text-[11px] font-bold text-amber-400 ml-1">({t.rating || 5} Stars)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete testimonial from ${t.name}?`)) {
                        removeItemFromSiteContent('testimonials', t.id);
                        triggerSaved('Testimonial removed.');
                      }
                    }}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
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
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
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
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Avatar Photo URL</label>
                    <input
                      type="url"
                      value={t.avatarUrl}
                      onChange={(e) => updateItemInSiteContent('testimonials', t.id, { avatarUrl: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Quote</label>
                  <textarea
                    value={t.quote}
                    onChange={(e) => updateItemInSiteContent('testimonials', t.id, { quote: e.target.value })}
                    rows={2}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)]"
                  />
                </div>

                {/* Card Save Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Auto-saved live</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerSaved(`Testimonial from '${t.name}' saved live!`)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Testimonial</span>
                  </button>
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
                  <button type="button" onClick={() => setShowAddTestimonial(false)} className="text-[var(--text-muted)] hover:text-[var(--text-heading)]"><X className="w-5 h-5" /></button>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Client Full Name</label>
                  <input
                    type="text"
                    required
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Job Title</label>
                    <input
                      type="text"
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Company</label>
                    <input
                      type="text"
                      value={newTestimonial.company}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Star Rating (1 | 5)</label>
                  <div className="flex items-center space-x-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${(newTestimonial.rating || 5) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-400 ml-2">({newTestimonial.rating || 5} Stars)</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={newTestimonial.avatarUrl}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, avatarUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Quote</label>
                  <textarea
                    required
                    rows={3}
                    value={newTestimonial.quote}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)]"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                  <button type="button" onClick={() => setShowAddTestimonial(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold cursor-pointer">Add Testimonial</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 5: TEAM MEMBERS & SPECIALISTS ── */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div>
              <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                Public Team Specialists & Domain Leads ({(siteContent.teamMembers || []).length})
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Manage the specialist profiles showcased on the public /team directory.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => triggerSaved('All team member profiles saved live!')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Save All Profiles</span>
              </button>
              <button
                onClick={() => setShowAddTeam(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Profile</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(siteContent.teamMembers || []).map((member) => (
              <div key={member.id} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1F7A8C&color=fff`}
                      alt={member.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-[var(--brand-teal)]"
                    />
                    <div>
                      <span className="font-bold text-xs text-[var(--text-heading)] block">{member.name}</span>
                      <span className="text-[10px] text-[var(--brand-teal)] font-semibold uppercase">{member.squad}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Remove team profile '${member.name}' from the public website?`)) {
                        removeItemFromSiteContent('teamMembers', member.id);
                        triggerSaved('Team member profile removed.');
                      }
                    }}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    title="Delete member profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Link Backend User (Optional)</label>
                      <select
                        onChange={(e) => {
                          const selectedUser = users.find(u => u.id === e.target.value);
                          if (selectedUser) {
                            setNewTeam({ 
                              ...newTeam, 
                              name: selectedUser.name,
                              roleTier: selectedUser.roleTier
                            });
                          }
                        }}
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                      >
                        <option value="">-- Select a User --</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.roleTier})</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1">Linking a user will auto-pull their name and Role Tier.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Full Name</label>

                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateItemInSiteContent('teamMembers', member.id, { name: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Role Title</label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => updateItemInSiteContent('teamMembers', member.id, { role: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Squad Category</label>
                    <input
                      type="text"
                      value={member.squad}
                      onChange={(e) => updateItemInSiteContent('teamMembers', member.id, { squad: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Avatar Image URL</label>
                    <input
                      type="url"
                      value={member.avatarUrl}
                      onChange={(e) => updateItemInSiteContent('teamMembers', member.id, { avatarUrl: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Biography</label>
                  <textarea
                    value={member.bio}
                    onChange={(e) => updateItemInSiteContent('teamMembers', member.id, { bio: e.target.value })}
                    rows={2}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-body)]"
                  />
                </div>

                {/* Card Save Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Auto-saved live</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerSaved(`Team profile '${member.name}' saved live!`)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Member</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Team Modal */}
          {showAddTeam && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <form onSubmit={handleCreateTeam} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <h3 className="font-bold text-base text-[var(--text-heading)]">Add Team Member Profile</h3>
                  <button type="button" onClick={() => setShowAddTeam(false)} className="text-[var(--text-muted)] hover:text-[var(--text-heading)]"><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Role Title</label>
                    <input
                      type="text"
                      required
                      value={newTeam.role}
                      onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Squad Name</label>
                    <input
                      type="text"
                      value={newTeam.squad}
                      onChange={(e) => setNewTeam({ ...newTeam, squad: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Avatar Image URL</label>
                    <input
                      type="url"
                      value={newTeam.avatarUrl}
                      onChange={(e) => setNewTeam({ ...newTeam, avatarUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Bio</label>
                  <textarea
                    rows={3}
                    value={newTeam.bio}
                    onChange={(e) => setNewTeam({ ...newTeam, bio: e.target.value })}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)]"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                  <button type="button" onClick={() => setShowAddTeam(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold">Add Profile</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 7: BLOG & TECHNICAL INSIGHTS STUDIO ── */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] gap-4">
            <div>
              <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                Knowledge Hub & Technical Articles ({(siteContent.blogPosts || []).length})
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Publish, edit, and manage articles dynamically visible at /blog and /blog/:slug.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => triggerSaved('All blog posts saved live!')}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Save All Posts</span>
              </button>
              <button
                onClick={() => setShowAddBlog(true)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Blog Post</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {(siteContent.blogPosts || []).length === 0 ? (
              <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-3">
                <FileText className="w-10 h-10 text-[var(--brand-teal)] mx-auto opacity-50" />
                <h4 className="font-bold text-sm text-[var(--text-heading)]">No Custom Blog Posts Yet</h4>
                <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                  Click "Create Blog Post" above to write and publish your first technical article or architectural guide.
                </p>
              </div>
            ) : (
              (siteContent.blogPosts || []).map((post) => (
                <div key={post.id} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
                        {post.category}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">/{post.slug}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">· {post.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-[var(--bg-page)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-heading)] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                        <span>View Article</span>
                      </a>
                      <button
                        onClick={() => {
                          if (confirm(`Permanently delete blog post '${post.title}'?`)) {
                            removeItemFromSiteContent('blogPosts', post.id);
                            triggerSaved('Blog post removed.');
                          }
                        }}
                        className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    <div className="lg:col-span-12 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="lg:col-span-2">
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Article Title</label>
                          <input
                            type="text"
                            value={post.title}
                            onChange={(e) => updateItemInSiteContent('blogPosts', post.id, { title: e.target.value })}
                            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-heading)]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Author Name</label>
                          <input
                            type="text"
                            value={post.author}
                            onChange={(e) => updateItemInSiteContent('blogPosts', post.id, { author: e.target.value })}
                            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Category</label>
                          <input
                            type="text"
                            value={post.category}
                            onChange={(e) => updateItemInSiteContent('blogPosts', post.id, { category: e.target.value })}
                            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                          />
                        </div>
                      </div>

                      {/* Blog Cover Image & Media Bar */}
                      <div className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)]">
                            Article Cover Image
                          </label>
                          {post.imageUrl && (
                            <button
                              type="button"
                              onClick={() => updateItemInSiteContent('blogPosts', post.id, { imageUrl: '' })}
                              className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                            >
                              Reset / Clear
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                          {/* Live preview */}
                          <div className="w-32 h-20 sm:w-40 sm:h-24 rounded-xl overflow-hidden bg-black/20 border border-[var(--border-subtle)] shrink-0 flex items-center justify-center">
                            {post.imageUrl ? (
                              <img
                                src={formatImageUrl(post.imageUrl, post.category)}
                                alt={post.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => handleImageError(e, undefined, post.category)}
                              />
                            ) : (
                              <span className="text-[10px] text-[var(--text-muted)] text-center p-1">No Cover Image</span>
                            )}
                          </div>

                          <div className="flex-1 space-y-2.5 w-full">
                            <div className="flex gap-2">
                              <input
                                type="url"
                                placeholder="Paste image link from Postimg, Imgur, Drive, Unsplash, etc."
                                value={post.imageUrl || ''}
                                onChange={(e) => updateItemInSiteContent('blogPosts', post.id, { imageUrl: e.target.value })}
                                className="flex-1 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] font-mono"
                              />
                              <label className="px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow-sm transition-all active:scale-95">
                                {uploadingTargetId === post.id ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Upload Image</span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploadingTargetId === post.id}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setUploadingTargetId(post.id);
                                      const url = await uploadAssetSafely(file, 'blog');
                                      if (url) {
                                        updateItemInSiteContent('blogPosts', post.id, { imageUrl: url });
                                        showToast('Blog cover image uploaded!', 'success');
                                      } else {
                                        showToast('Failed to process image file.', 'error');
                                      }
                                      setUploadingTargetId(null);
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            {/* Presets */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] text-[var(--text-muted)] mr-1">Presets:</span>
                              {CURATED_BLOG_IMAGE_PRESETS.map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() => updateItemInSiteContent('blogPosts', post.id, { imageUrl: preset.url })}
                                  className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[var(--bg-page)] hover:text-[var(--brand-teal)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Excerpt / Summary</label>
                        <textarea
                          value={post.excerpt}
                          onChange={(e) => updateItemInSiteContent('blogPosts', post.id, { excerpt: e.target.value })}
                          rows={2}
                          className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-body)]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Full Article Body (Markdown supported)</label>
                        <textarea
                          value={post.content || ''}
                          onChange={(e) => updateItemInSiteContent('blogPosts', post.id, { content: e.target.value })}
                          rows={5}
                          placeholder="Write article content using markdown (e.g. ## Heading 2, ### Heading 3, | Bullet item)..."
                          className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-body)] leading-relaxed"
                        />
                      </div>

                      {/* Card Save Action Bar */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                        <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Auto-saved live</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => triggerSaved(`Blog post '${post.title}' saved live!`)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Post</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Blog Post Modal */}
          {showAddBlog && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <form onSubmit={handleCreateBlog} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">Write & Publish New Blog Article</h3>
                    <p className="text-xs text-[var(--text-muted)]">This will be published live to the DigiHust Insights Hub</p>
                  </div>
                  <button type="button" onClick={() => setShowAddBlog(false)} className="text-[var(--text-muted)] hover:text-[var(--text-heading)] p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Post Title *</label>
                    <input
                      type="text"
                      required
                      value={newBlog.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setNewBlog({ ...newBlog, title, slug });
                      }}
                      placeholder="e.g. Building Resilient Microservices with Golang"
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">URL Slug (Auto-Generated) *</label>
                    <input
                      type="text"
                      required
                      value={newBlog.slug}
                      onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                      placeholder="e.g. building-resilient-microservices"
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Category</label>
                    <select
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="AI & Automations">AI & Automations</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Digital Strategy">Digital Strategy</option>
                      <option value="Product & Design">Product & Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Estimated Read Time</label>
                    <input
                      type="text"
                      value={newBlog.readTime}
                      onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })}
                      placeholder="e.g. 6 min read"
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Author Name</label>
                    <input
                      type="text"
                      value={newBlog.author}
                      onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                </div>

                {/* Cover Image Uploader & Presets */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)]">Article Cover Image</label>
                    {newBlog.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setNewBlog({ ...newBlog, imageUrl: '' })}
                        className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="w-28 h-16 rounded-xl overflow-hidden bg-black/20 border border-[var(--border-subtle)] shrink-0 flex items-center justify-center">
                      {newBlog.imageUrl ? (
                        <img
                          src={formatImageUrl(newBlog.imageUrl, newBlog.category)}
                          alt="Cover preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => handleImageError(e, undefined, newBlog.category)}
                        />
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)]">No Image</span>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newBlog.imageUrl || ''}
                          onChange={(e) => setNewBlog({ ...newBlog, imageUrl: e.target.value })}
                          placeholder="Paste image link or upload..."
                          className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--text-heading)]"
                        />
                        <label className="px-3.5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow-sm transition-all active:scale-95">
                          {uploadingTargetId === 'new-blog' ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingTargetId === 'new-blog'}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploadingTargetId('new-blog');
                                const url = await uploadAssetSafely(file, 'blog');
                                if (url) {
                                  setNewBlog({ ...newBlog, imageUrl: url });
                                  showToast('Cover image uploaded successfully!', 'success');
                                } else {
                                  showToast('Failed to process image file.', 'error');
                                }
                                setUploadingTargetId(null);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Presets */}
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[10px] text-[var(--text-muted)] mr-1">Presets:</span>
                        {CURATED_BLOG_IMAGE_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setNewBlog({ ...newBlog, imageUrl: preset.url })}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[var(--bg-surface)] hover:text-[var(--brand-teal)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Excerpt / Summary *</label>
                  <textarea
                    required
                    rows={2}
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                    placeholder="Brief 1-2 sentence overview shown in cards and SEO meta tags..."
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                    Article Full Content (Markdown supported) *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                    placeholder={`### Introduction\nExplain the context here...\n\n### Architectural Approach\nDetail the solution...\n\n- Key Point 1\n- Key Point 2\n\n### Conclusion\nFinal wrap up...`}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] leading-relaxed"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => setShowAddBlog(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Publish Article Live
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 8: FAQS ── */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">Frequently Asked Questions ({(siteContent.faqs || []).length})</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => triggerSaved('All FAQ items synced & saved live!')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Save All FAQs</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddFAQ(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            </div>
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

                {/* Card Save Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Auto-saved live</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerSaved(`FAQ item '${f.question.slice(0, 30)}...' saved live!`)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save FAQ</span>
                  </button>
                </div>
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
            <button type="submit" className="px-5 py-2 rounded-xl bg-[#1F7A8C] hover:bg-[#186473] text-white text-xs font-bold shadow-md cursor-pointer transition-colors">
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
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={contactDraft.linkedin}
                onChange={(e) => setContactDraft({ ...contactDraft, linkedin: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">GitHub URL</label>
              <input
                type="url"
                value={contactDraft.github}
                onChange={(e) => setContactDraft({ ...contactDraft, github: e.target.value })}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          {/* Contact Side Illustration Section */}
          <div className="pt-6 border-t border-[var(--border-subtle)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 className="font-display font-bold text-sm text-[var(--text-heading)]">
                  Contact Form Left Side Illustration / Image
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Upload an image for the left side of the /contact page form or provide an image URL. Automatically synced live.
                </p>
              </div>
              {(((contactDraft as any).illustrationUrl && (contactDraft as any).illustrationUrl !== '/contact-illustration.png') ||
                ((contactDraft as any).formImageUrl && (contactDraft as any).formImageUrl !== '/contact-illustration.png')) && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...contactDraft,
                      illustrationUrl: '/contact-illustration.png',
                      formImageUrl: '/contact-illustration.png',
                    };
                    setContactDraft(updated);
                    const updatedCustomImages = {
                      ...customImagesDraft,
                      contactFormImage: '/contact-illustration.png',
                    };
                    setCustomImagesDraft(updatedCustomImages);
                    updateSiteContent({
                      contact: updated,
                      contactIllustrationUrl: '/contact-illustration.png',
                      customImages: updatedCustomImages,
                    } as any);
                    showToast('Reset to default contact illustration.', 'info');
                  }}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
              {/* Visual Preview */}
              <div className="w-36 h-48 sm:w-40 sm:h-52 rounded-2xl bg-[#E8F5F6] dark:bg-[#032533] border border-[#D5E9EC] dark:border-[#0a3a4d] overflow-hidden flex items-center justify-center p-2 shrink-0 shadow-sm relative group">
                <img
                  src={
                    (contactDraft as any).illustrationUrl ||
                    (contactDraft as any).formImageUrl ||
                    getResolvedContactIllustration(safeContent)
                  }
                  alt="Contact illustration preview"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/contact-illustration.png';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl pointer-events-none">
                  <span className="text-[10px] font-bold text-white px-2 py-1 rounded bg-black/60">Live Preview</span>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 flex-1 w-full">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1.5">
                    Illustration Image URL
                  </label>
                  <input
                    type="text"
                    value={(contactDraft as any).illustrationUrl || (contactDraft as any).formImageUrl || ''}
                    placeholder="/contact-illustration.png or https://images.unsplash.com/..."
                    onChange={(e) => {
                      const val = e.target.value;
                      setContactDraft({
                        ...contactDraft,
                        illustrationUrl: val,
                        formImageUrl: val,
                      } as any);
                    }}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] font-mono"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95">
                    {isUploadingIllustration ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{isUploadingIllustration ? 'Uploading & Optimizing...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIllustrationUpload}
                      disabled={isUploadingIllustration}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-[var(--text-muted)]">
                    Supports PNG, JPG, WebP, SVG. Stored in Cloud Storage with automatic compression.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      
      {/* ── TAB: CAREERS ── */}
      {activeTab === 'careers' && (
        <form onSubmit={handleSaveCareers} className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">Careers Page Content</h3>
            <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer">
              Save Careers Changes
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">No Open Positions Message</label>
            <textarea
              value={careersDraft.noPositionsMessage}
              onChange={(e) => setCareersDraft({ ...careersDraft, noPositionsMessage: e.target.value })}
              rows={3}
              className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)]">Open Positions ({(careersDraft.openPositions || []).length})</label>
              <button
                type="button"
                onClick={() => setCareersDraft({ ...careersDraft, openPositions: [...(careersDraft.openPositions || []), { title: '', department: '', location: '' }] })}
                className="text-xs font-bold text-[var(--brand-teal)] hover:underline"
              >
                + Add Position
              </button>
            </div>
            
            {(careersDraft.openPositions || []).map((pos, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] relative group">
                <button
                  type="button"
                  onClick={() => {
                    const newArr = [...careersDraft.openPositions];
                    newArr.splice(idx, 1);
                    setCareersDraft({ ...careersDraft, openPositions: newArr });
                  }}
                  className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-rose-400"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={pos.title}
                    onChange={(e) => {
                      const newArr = [...careersDraft.openPositions];
                      newArr[idx].title = e.target.value;
                      setCareersDraft({ ...careersDraft, openPositions: newArr });
                    }}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Department (e.g. Engineering)"
                    value={pos.department}
                    onChange={(e) => {
                      const newArr = [...careersDraft.openPositions];
                      newArr[idx].department = e.target.value;
                      setCareersDraft({ ...careersDraft, openPositions: newArr });
                    }}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g. Remote, Lahore)"
                    value={pos.location}
                    onChange={(e) => {
                      const newArr = [...careersDraft.openPositions];
                      newArr[idx].location = e.target.value;
                      setCareersDraft({ ...careersDraft, openPositions: newArr });
                    }}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      )}


      {/* ── TAB 11: IMAGE ASSET STUDIO ── */}
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
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <input
                  type="url"
                  placeholder="Image URL (https://images.unsplash.com/...)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
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
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                  />
                </div>
              ))}
            </div>
          </form>
        </div>
      )}

      {/* ── TAB 10: NEWSLETTER SUBSCRIBERS ── */}
      {activeTab === 'newsletter' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">Newsletter Subscribers</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1F7A8C]/15 text-[#1F7A8C]">
                  {newsletterSubscribers.length} total
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Captured via the website footer newsletter form and synced with Supabase.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleExportNewsletterCsv}
                disabled={newsletterSubscribers.length === 0}
                className="px-4 py-2 rounded-xl bg-[#1F7A8C] hover:bg-[#186473] text-white text-xs font-bold shadow-md flex items-center space-x-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              placeholder="Filter by email address..."
              value={newsletterSearch}
              onChange={(e) => setNewsletterSearch(e.target.value)}
              className="max-w-md w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[#1F7A8C]"
            />
          </div>

          {isNewsletterLoading ? (
            <div className="py-12 flex items-center justify-center space-x-2 text-xs text-[var(--text-muted)]">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--brand-teal)]" />
              <span>Loading subscribers from database...</span>
            </div>
          ) : newsletterSubscribers.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-2xl">
              No newsletter subscribers yet. Submissions from the website footer will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto border border-[var(--border-subtle)] rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-page)] text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-subtle)]">
                  <tr>
                    <th className="py-3 px-4 w-16">#</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Subscribed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {newsletterSubscribers
                    .filter((s) => s.email.toLowerCase().includes(newsletterSearch.toLowerCase()))
                    .map((sub, i) => (
                      <tr key={sub.id || i} className="hover:bg-[var(--bg-subtle)] transition-colors">
                        <td className="py-3 px-4 text-[var(--text-dim)]">{i + 1}</td>
                        <td className="py-3 px-4 font-semibold text-[var(--text-heading)]">{sub.email}</td>
                        <td className="py-3 px-4 text-[var(--text-muted)]">
                          {new Date(sub.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Floating Save Confirmation Notification Bar (always visible even when scrolled down) */}
      <AnimatePresence>
        {savedFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9990] flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-emerald-600 dark:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-2xl border border-emerald-400/30 backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{savedFeedback}</span>
            <span className="ml-2 px-2 py-0.5 rounded-md bg-white/20 text-[10px] uppercase tracking-wider font-extrabold">
              Saved Live
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


