import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox, Search, Filter, MessageSquare, Mail, Calendar, ArrowRight,
  CheckCircle2, Clock, AlertCircle, Trash2, ExternalLink, Paperclip,
  Building, DollarSign, Shield, ChevronDown, ChevronUp, Copy, Check,
  Briefcase, Sparkles, RefreshCw, X, Phone, Settings, Zap, Send, Key, HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Lead, GroupId, PipelineStage } from '../../types';
import { notificationService } from '../../lib/notificationService';
import { dbService } from '../../lib/dbService';

export const InboundLeadsManager: React.FC = () => {
  const { 
    leads, 
    groups, 
    users, 
    currentUser, 
    updateLeadStatus, 
    deleteLead, 
    reviewLeadToProject, 
    showToast,
    siteContent,
    updateSiteContent
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSquad, setFilterSquad] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest_budget'>('newest');
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Phone Prompt Modal for leads without an existing phone number
  const [phonePromptLead, setPhonePromptLead] = useState<Lead | null>(null);
  const [manualPhoneInput, setManualPhoneInput] = useState<string>('');

  // Email action dropdown state
  const [activeEmailDropdownLeadId, setActiveEmailDropdownLeadId] = useState<string | null>(null);

  // WhatsApp Gateway Configuration & Live Tester state
  const [showGatewayConfig, setShowGatewayConfig] = useState<boolean>(false);
  const [callmebotKey, setCallmebotKey] = useState<string>(() => {
    return siteContent?.callmebotApiKey || (typeof localStorage !== 'undefined' ? (localStorage.getItem('dgh_callmebot_api_key') || '') : '');
  });
  const [customWebhook, setCustomWebhook] = useState<string>(() => {
    return siteContent?.whatsappWebhookUrl || (typeof localStorage !== 'undefined' ? (localStorage.getItem('dgh_whatsapp_webhook') || '') : '');
  });

  // Keep state in sync if siteContent changes
  useEffect(() => {
    if (siteContent?.callmebotApiKey && !callmebotKey) {
      setCallmebotKey(siteContent.callmebotApiKey);
    }
    if (siteContent?.whatsappWebhookUrl && !customWebhook) {
      setCustomWebhook(siteContent.whatsappWebhookUrl);
    }
  }, [siteContent?.callmebotApiKey, siteContent?.whatsappWebhookUrl]);
  const [testStatus, setTestStatus] = useState<{ loading: boolean; message?: string; success?: boolean } | null>(null);

  // Conversion Modal State
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
  const [targetSquad, setTargetSquad] = useState<GroupId>('tech');
  const [assignedLeaderId, setAssignedLeaderId] = useState<string>('');
  const [totalBudget, setTotalBudget] = useState<number>(3000);
  const [externalCosts, setExternalCosts] = useState<number>(0);
  const [splitMgmt, setSplitMgmt] = useState<number>(20);
  const [splitLeader, setSplitLeader] = useState<number>(10);
  const [splitFreelancer, setSplitFreelancer] = useState<number>(70);

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Helper to normalize status
  const getNormalizedStatus = (status: string): 'new_lead' | 'under_review' | 'assigned' | 'completed' => {
    if (status === 'new_lead' || status === 'new' || status === 'lead') return 'new_lead';
    if (status === 'under_review' || status === 'review') return 'under_review';
    if (status === 'assigned' || status === 'in_progress') return 'assigned';
    if (status === 'completed' || status === 'paid') return 'completed';
    return 'new_lead';
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter(l => getNormalizedStatus(l.status) === 'new_lead').length;
    const reviewCount = leads.filter(l => getNormalizedStatus(l.status) === 'under_review').length;
    const assignedCount = leads.filter(l => getNormalizedStatus(l.status) === 'assigned').length;
    const completedCount = leads.filter(l => getNormalizedStatus(l.status) === 'completed').length;
    const totalEstimatedValue = leads.reduce((acc, l) => acc + (l.budgetEstimate || 0), 0);

    return { total, newCount, reviewCount, assignedCount, completedCount, totalEstimatedValue };
  }, [leads]);

  // Filter & Search Logic
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const normStatus = getNormalizedStatus(lead.status);

      // Status Filter
      if (filterStatus !== 'all' && normStatus !== filterStatus) {
        return false;
      }

      // Squad Filter
      const leadSquad = lead.suggestedGroupId || lead.groupId || lead.targetGroupId;
      if (filterSquad !== 'all' && leadSquad !== filterSquad) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const clientName = (lead.clientName || '').toLowerCase();
        const clientEmail = (lead.clientEmail || lead.email || '').toLowerCase();
        const company = (lead.clientCompany || lead.companyName || '').toLowerCase();
        const brief = (lead.brief || lead.scopeDescription || '').toLowerCase();
        const title = (lead.title || '').toLowerCase();
        if (!clientName.includes(q) && !clientEmail.includes(q) && !company.includes(q) && !brief.includes(q) && !title.includes(q)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      if (sortBy === 'highest_budget') {
        return (b.budgetEstimate || 0) - (a.budgetEstimate || 0);
      }
      return 0;
    });
  }, [leads, filterStatus, filterSquad, searchQuery, sortBy]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const extractPhoneFromBrief = (brief?: string): string => {
    if (!brief) return '';
    const match = brief.match(/Client Phone \/ WhatsApp:\s*([^\n\r]+)/i) || 
                  brief.match(/Phone:\s*([^\n\r]+)/i);
    return match ? match[1].trim() : '';
  };

  const getEffectiveLeadPhone = (lead: Lead): string => {
    return lead.clientPhone || lead.phone || extractPhoneFromBrief(lead.brief) || '';
  };

  const handleWhatsAppClient = (lead: Lead) => {
    const clientName = lead.clientName || 'Client';
    const phone = getEffectiveLeadPhone(lead);
    const waGreeting = `Hello ${clientName},\n\nThis is ${currentUser?.name || 'DigiHust Operations'} from DigiHust Executive Leadership. We received your project inquiry for "${lead.title || 'Digital Solution'}" and would love to coordinate your project discovery alignment.\n\nWhen would you be available for a brief 15-minute alignment call?`;

    if (phone && phone.trim()) {
      const cleanDigits = phone.replace(/[^0-9]/g, '');
      if (cleanDigits.length >= 7) {
        const url = `https://api.whatsapp.com/send?phone=${cleanDigits}&text=${encodeURIComponent(waGreeting)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        showToast(`Opening WhatsApp chat with ${clientName}`, 'success', 'WhatsApp Launched');
        return;
      }
    }

    setPhonePromptLead(lead);
    setManualPhoneInput('');
  };

  const handleEmailClient = (lead: Lead, provider: 'gmail' | 'mailto' = 'gmail') => {
    const clientEmail = lead.clientEmail || lead.email;
    if (!clientEmail) {
      showToast('No email address found for this lead.', 'error', 'Missing Email');
      return;
    }
    const clientName = lead.clientName || 'Client';
    const subject = `DigiHust Discovery: Next Steps for ${lead.title || 'Your Project'}`;
    const body = `Hello ${clientName},\n\nThank you for reaching out to DigiHust regarding "${lead.title || 'your digital project'}". We have reviewed your initial specifications and are excited about the opportunity to partner with you.\n\nWe would love to schedule a brief 15-minute discovery call to align on milestones, technical requirements, and target timeline.\n\nPlease let us know what time works best for you this week.\n\nBest regards,\n${currentUser?.name || 'DigiHust Operations Team'}\nDigiHust Executive Leadership\nhttps://www.digihust.tech`;

    if (provider === 'gmail') {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(clientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      showToast(`Opening Gmail compose for ${clientEmail}`, 'success', 'Gmail Launched');
    } else {
      const mailtoUrl = `mailto:${clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
      showToast(`Launching desktop email client`, 'info', 'Mail Launched');
    }
    setActiveEmailDropdownLeadId(null);
  };

  const handleCopyEmailDraft = (lead: Lead) => {
    const clientName = lead.clientName || 'Client';
    const draft = `Subject: DigiHust Discovery: Next Steps for ${lead.title || 'Your Project'}\n\nHello ${clientName},\n\nThank you for reaching out to DigiHust regarding "${lead.title || 'your digital project'}". We have reviewed your initial specifications and are excited about the opportunity to partner with you.\n\nWe would love to schedule a brief 15-minute discovery call to align on milestones, technical requirements, and target timeline.\n\nPlease let us know what time works best for you this week.\n\nBest regards,\n${currentUser?.name || 'DigiHust Operations Team'}\nDigiHust Executive Leadership\nhttps://www.digihust.tech`;
    navigator.clipboard.writeText(draft);
    showToast('Email draft template copied to clipboard!', 'success', 'Draft Copied');
    setActiveEmailDropdownLeadId(null);
  };

  const handleSaveManualPhoneAndLaunch = () => {
    if (!phonePromptLead) return;
    const trimmed = manualPhoneInput.trim();
    const cleanDigits = trimmed.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 7) {
      showToast('Please enter a valid phone number with country code (e.g. +92 322 6806396).', 'error', 'Invalid Phone');
      return;
    }

    dbService.updateLead(phonePromptLead.id, { clientPhone: trimmed, phone: trimmed });
    phonePromptLead.clientPhone = trimmed;
    phonePromptLead.phone = trimmed;

    const clientName = phonePromptLead.clientName || 'Client';
    const waGreeting = `Hello ${clientName},\n\nThis is ${currentUser?.name || 'DigiHust Operations'} from DigiHust Executive Leadership. We received your project inquiry for "${phonePromptLead.title || 'Digital Solution'}" and would love to coordinate your project discovery alignment.\n\nWhen would you be available for a brief 15-minute alignment call?`;
    const url = `https://api.whatsapp.com/send?phone=${cleanDigits}&text=${encodeURIComponent(waGreeting)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast(`Phone saved and WhatsApp launched for ${clientName}`, 'success', 'Connected');
    setPhonePromptLead(null);
  };

  const handleSaveGatewaySettings = async () => {
    const trimmedKey = callmebotKey.trim();
    const trimmedWebhook = customWebhook.trim();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('dgh_callmebot_api_key', trimmedKey);
      localStorage.setItem('dgh_whatsapp_webhook', trimmedWebhook);
    }
    if (siteContent) {
      await updateSiteContent({
        ...siteContent,
        callmebotApiKey: trimmedKey,
        whatsappWebhookUrl: trimmedWebhook,
      });
    }
    showToast('WhatsApp gateway credentials saved to database & active for all public forms.', 'success', 'Settings Saved');
  };

  const handleTestWhatsAppDispatch = async () => {
    setTestStatus({ loading: true, message: 'Dispatching test notification to DigiHust Leadership WhatsApp numbers (+923226806396 / +923206806396)...' });
    try {
      const res = await notificationService.dispatchLeadWhatsApp({
        name: currentUser?.name || 'DigiHust Executive',
        email: currentUser?.email || 'digihust@gmail.com',
        services: ['Test WhatsApp Alert Gateway'],
        description: 'Automated gateway connectivity test from DigiHust Management Portal',
        isTest: true,
        callmebotApiKey: callmebotKey.trim() || undefined,
        webhookUrl: customWebhook.trim() || undefined,
      });

      if (res.success) {
        setTestStatus({
          loading: false,
          success: true,
          message: '✓ Test WhatsApp alert dispatched successfully! Check WhatsApp on +923226806396 / +923206806396.',
        });
        showToast('Test WhatsApp alert dispatched!', 'success', 'WhatsApp Gateway');
      } else {
        setTestStatus({
          loading: false,
          success: false,
          message: res.details || 'Delivery unconfirmed. Please verify CallMeBot API key or Webhook URL below.',
        });
        showToast('WhatsApp alert delivery unconfirmed', 'warning', 'Gateway Notice');
      }
    } catch (err: any) {
      setTestStatus({
        loading: false,
        success: false,
        message: err?.message || 'Failed to dispatch test notification.',
      });
    }
  };

  const openConvertModal = (lead: Lead) => {
    setConvertingLead(lead);
    const initialSquad: GroupId = (lead.suggestedGroupId || lead.groupId || lead.targetGroupId || 'tech') as GroupId;
    setTargetSquad(initialSquad);

    const squadLeader = users.find(u => u.groupId === initialSquad && (u.role === 'group_leader' || u.roleTier === 'group_leader'));
    setAssignedLeaderId(squadLeader ? squadLeader.id : users[0]?.id || '');
    setTotalBudget(lead.budgetEstimate || 3000);
    setExternalCosts(0);
    setSplitMgmt(20);
    setSplitLeader(10);
    setSplitFreelancer(70);
  };

  const handleConfirmConvert = () => {
    if (!convertingLead) return;
    reviewLeadToProject(
      convertingLead.id,
      targetSquad,
      assignedLeaderId,
      totalBudget,
      externalCosts,
      false,
      0,
      splitMgmt,
      splitLeader,
      splitFreelancer
    );
    setConvertingLead(null);
  };

  const renderStatusBadge = (rawStatus: string, leadId: string) => {
    const status = getNormalizedStatus(rawStatus);

    const config = {
      new_lead: {
        label: 'New Intake',
        color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
        dot: 'bg-cyan-500 animate-pulse'
      },
      under_review: {
        label: 'Under Review',
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        dot: 'bg-amber-500'
      },
      assigned: {
        label: 'Converted to Sprint',
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-500'
      },
      completed: {
        label: 'Completed / Archived',
        color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
        dot: 'bg-purple-500'
      }
    }[status];

    return (
      <div className="relative inline-block">
        <select
          value={status}
          onChange={(e) => updateLeadStatus(leadId, e.target.value as PipelineStage)}
          className={`appearance-none pl-6 pr-8 py-1 rounded-full text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] transition-all ${config.color}`}
        >
          <option value="new_lead" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">New Intake</option>
          <option value="under_review" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Under Review</option>
          <option value="assigned" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Converted to Sprint</option>
          <option value="completed" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Completed / Archived</option>
        </select>
        <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${config.dot} pointer-events-none`} />
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-60 pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* ── HEADER & KPI CARDS ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[var(--brand-teal)] mb-1">
              <Inbox className="w-4 h-4" />
              <span>DigiHust Leadership Operations</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-heading)]">
              Client Inquiries & Project Intakes
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              Live inbound scopes received from the public intake form, automatically synchronized with WhatsApp and Email.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {callmebotKey.trim() || customWebhook.trim() ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>WhatsApp Gateway Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>WhatsApp: Gateway Key Needed</span>
              </span>
            )}
            <button
              onClick={() => setShowGatewayConfig(!showGatewayConfig)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-xs font-bold text-[var(--text-heading)] bg-[var(--bg-page)] hover:bg-[var(--bg-subtle)] transition-all cursor-pointer shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{showGatewayConfig ? 'Hide Gateway Setup' : 'WhatsApp Gateway & Tester'}</span>
            </button>
          </div>
        </div>

        {/* ── WHATSAPP ALERT GATEWAY & LIVE TESTER ACCORDION ── */}
        <AnimatePresence>
          {showGatewayConfig && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 pb-6 border-b border-[var(--border-subtle)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-display font-extrabold text-sm sm:text-base text-[var(--text-heading)] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <span>Executive WhatsApp Automation Gateway</span>
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Direct automated alerts dispatched on submission to DigiHust numbers: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">+923226806396</strong> & <strong className="text-emerald-600 dark:text-emerald-400 font-mono">+923206806396</strong>.
                  </p>
                </div>
                <button
                  onClick={handleTestWhatsAppDispatch}
                  disabled={testStatus?.loading}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Send className={`w-3.5 h-3.5 ${testStatus?.loading ? 'animate-spin' : ''}`} />
                  <span>{testStatus?.loading ? 'Dispatching Test...' : 'Send Live Test Alert to WhatsApp'}</span>
                </button>
              </div>

              {testStatus && (
                <div className={`p-3.5 rounded-2xl text-xs font-medium border flex items-start space-x-2.5 ${
                  testStatus.success 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300' 
                    : testStatus.loading
                    ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-300'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300'
                }`}>
                  {testStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : testStatus.loading ? (
                    <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{testStatus.message}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Method 1: CallMeBot Free WhatsApp API */}
                <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-extrabold text-[var(--text-heading)] flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                      <span>Method 1: Free CallMeBot Personal API</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href="https://wa.me/34623786449?text=I%20allow%20callmebot%20to%20send%20me%20messages"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>Bot #1</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span className="text-[10px] text-[var(--text-muted)]">·</span>
                      <a
                        href="https://wa.me/34911061462?text=I%20allow%20callmebot%20to%20send%20me%20messages"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>Bot #2</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    Receive free WhatsApp alerts directly to your phone. To activate: Send <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-[10px]">I allow callmebot to send me messages</code> to <strong>+34 623 78 64 49</strong> or <strong>+34 911 06 14 62</strong> on WhatsApp, then paste the returned 6-digit API key below and click Save.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={callmebotKey}
                      onChange={(e) => setCallmebotKey(e.target.value)}
                      placeholder="Enter CallMeBot API Key (e.g. 123456)"
                      className="flex-1 px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-heading)] font-mono focus:outline-none focus:border-[var(--brand-teal)]"
                    />
                    <button
                      onClick={handleSaveGatewaySettings}
                      className="px-3.5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Method 2: Custom Webhook Gateway */}
                <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-3">
                  <span className="text-xs font-extrabold text-[var(--text-heading)] flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                    <span>Method 2: Custom Webhook / n8n / Zapier / UltraMsg</span>
                  </span>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    Forward new client inquiry payloads directly to your custom webhook URL, Telegram bot, or Green-API / UltraMsg instance.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customWebhook}
                      onChange={(e) => setCustomWebhook(e.target.value)}
                      placeholder="https://your-webhook-url.example.com/lead-alerts"
                      className="flex-1 px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-heading)] font-mono focus:outline-none focus:border-[var(--brand-teal)]"
                    />
                    <button
                      onClick={handleSaveGatewaySettings}
                      className="px-3.5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)]">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Total Inbound</span>
            <div className="font-display font-black text-2xl text-[var(--text-heading)]">{stats.total}</div>
            <span className="text-[10px] text-[var(--text-muted)]">All-time intakes</span>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
            <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-1">New Leads</span>
            <div className="font-display font-black text-2xl text-cyan-600 dark:text-cyan-400">{stats.newCount}</div>
            <span className="text-[10px] text-[var(--text-muted)]">Requires review</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">In Review</span>
            <div className="font-display font-black text-2xl text-amber-600 dark:text-amber-400">{stats.reviewCount}</div>
            <span className="text-[10px] text-[var(--text-muted)]">Discovery active</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">Converted</span>
            <div className="font-display font-black text-2xl text-emerald-600 dark:text-emerald-400">{stats.assignedCount}</div>
            <span className="text-[10px] text-[var(--text-muted)]">Active sprints</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-[var(--brand-teal)] uppercase tracking-wider block mb-1">Pipeline Value</span>
            <div className="font-display font-black text-xl text-[var(--brand-teal)] truncate">
              ${stats.totalEstimatedValue.toLocaleString()}
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">Approx USD</span>
          </div>
        </div>
      </div>

      {/* ── TOOLBAR: SEARCH & FILTERS ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
            {[
              { id: 'all', label: 'All Inquiries', count: stats.total },
              { id: 'new_lead', label: 'New', count: stats.newCount },
              { id: 'under_review', label: 'In Review', count: stats.reviewCount },
              { id: 'assigned', label: 'Converted', count: stats.assignedCount },
              { id: 'completed', label: 'Completed', count: stats.completedCount },
            ].map((tab) => {
              const active = filterStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[var(--brand-teal)] text-white shadow-md'
                      : 'bg-[var(--bg-page)] hover:bg-[var(--bg-subtle)] text-[var(--text-body)] border border-[var(--border-subtle)]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${active ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-[var(--text-muted)]'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search client, email, scope..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={filterSquad}
              onChange={(e) => setFilterSquad(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
            >
              <option value="all">All Divisions</option>
              <option value="tech">Tech & Engineering</option>
              <option value="creative">Creative & Design</option>
              <option value="data">AI & Automation</option>
              <option value="growth">Growth & Marketing</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest_budget">Highest Budget</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── INBOUND LEADS LIST ── */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-3">
            <Inbox className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
            <h3 className="font-display font-bold text-lg text-[var(--text-heading)]">No Inquiries Found</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              {searchQuery || filterStatus !== 'all' || filterSquad !== 'all'
                ? 'No client inquiries match your active search or filter criteria.'
                : 'There are currently no inbound project inquiries. Submissions from the public Contact page will appear here instantly.'}
            </p>
            {(searchQuery || filterStatus !== 'all' || filterSquad !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setFilterSquad('all');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold hover:bg-[var(--brand-teal-hover)] transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const isExpanded = expandedLeadId === lead.id;
            const normStatus = getNormalizedStatus(lead.status);
            const clientName = lead.clientName || 'Anonymous Client';
            const clientEmail = lead.clientEmail || lead.email || '';
            const company = lead.clientCompany || lead.companyName || '';
            const budgetDisplay = lead.budgetRange || (lead.budgetEstimate ? `$${lead.budgetEstimate.toLocaleString()}` : 'Flexible');
            const currency = lead.currency || 'USD';
            const timeline = lead.timeline || 'Flexible';
            const fullScope = lead.brief || lead.scopeDescription || '';
            const attachmentUrl = lead.attachmentUrl;
            const attachmentName = lead.attachmentName || 'Attached Document';
            const squadId = lead.suggestedGroupId || lead.groupId || lead.targetGroupId || 'tech';
            const squadObj = groups.find(g => g.id === squadId);
            const clientPhone = getEffectiveLeadPhone(lead);

            return (
              <motion.div
                key={lead.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border transition-all duration-200 ${
                  normStatus === 'new_lead'
                    ? 'border-cyan-500/40 shadow-[0_8px_30px_rgba(31,122,140,0.06)]'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                }`}
              >
                {/* Top Row: Client Info & Status Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/30 flex items-center justify-center font-display font-extrabold text-base text-[var(--brand-teal)] shrink-0">
                      {clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                          {clientName}
                        </h4>
                        {company && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--text-muted)] bg-[var(--bg-page)] px-2 py-0.5 rounded-lg border border-[var(--border-subtle)]">
                            <Building className="w-3 h-3 text-[var(--brand-teal)]" />
                            <span>{company}</span>
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <p className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-[var(--brand-teal)]" />
                          <span>{clientEmail}</span>
                          <button
                            onClick={() => handleCopyEmail(clientEmail)}
                            className="hover:text-[var(--brand-teal)] transition-colors cursor-pointer"
                            title="Copy Email"
                          >
                            {copiedEmail === clientEmail ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </p>
                        {clientPhone && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
                            <Phone className="w-3 h-3" />
                            <span>{clientPhone}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {renderStatusBadge(lead.status, lead.id)}
                  </div>
                </div>

                {/* Middle Row: Key Inquiry Specifications */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                  <div className="p-3 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-0.5">Budget</span>
                    <span className="font-extrabold text-xs text-[var(--text-heading)] flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{budgetDisplay}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-0.5">Timeline</span>
                    <span className="font-extrabold text-xs text-[var(--text-heading)] flex items-center gap-1 truncate">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{timeline}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-0.5">Target Division</span>
                    <span className="font-extrabold text-xs text-[var(--brand-teal)] flex items-center gap-1 truncate">
                      <Shield className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{squadObj?.name.split('&')[0] || squadId.toUpperCase()}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-0.5">Attachment</span>
                    {attachmentUrl ? (
                      <a
                        href={attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-extrabold text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 truncate"
                      >
                        <Paperclip className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{attachmentName}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)] font-medium">None Attached</span>
                    )}
                  </div>
                </div>

                {/* Project Brief Scope Preview */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs text-[var(--text-body)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
                      Project Scope & Description
                    </span>
                    <button
                      onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                      className="text-[11px] font-bold text-[var(--brand-teal)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Collapse Scope' : 'Read Full Scope'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className={`whitespace-pre-line leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {fullScope || 'No detailed scope provided.'}
                  </p>
                </div>

                {/* Bottom Row: Executive Action Triggers */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-[var(--border-subtle)]">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* WhatsApp Client: direct launch with fallback modal */}
                    <button
                      onClick={() => handleWhatsAppClient(lead)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      title={clientPhone ? `Start WhatsApp conversation with ${clientPhone}` : 'Connect with client on WhatsApp'}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Client</span>
                      {clientPhone && (
                        <span className="hidden sm:inline-block text-[10px] bg-emerald-700/60 px-1.5 py-0.2 rounded-md font-mono">
                          {clientPhone}
                        </span>
                      )}
                    </button>

                    {/* Email Client: launches Gmail Web compose in new tab with pre-drafted discovery alignment email */}
                    <div className="relative">
                      <div className="inline-flex rounded-xl shadow-sm">
                        <button
                          onClick={() => handleEmailClient(lead, 'gmail')}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-l-xl border border-r-0 border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] bg-[var(--bg-page)] hover:bg-[var(--bg-subtle)] text-xs font-bold transition-all cursor-pointer"
                          title="Open Gmail Web Compose with pre-drafted discovery email"
                        >
                          <Mail className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                          <span>Email Client</span>
                        </button>
                        <button
                          onClick={() => setActiveEmailDropdownLeadId(activeEmailDropdownLeadId === lead.id ? null : lead.id)}
                          className="px-2 py-1.5 rounded-r-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] bg-[var(--bg-page)] hover:bg-[var(--bg-subtle)] text-xs transition-all cursor-pointer"
                          title="More email options"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Email Client Options Dropdown */}
                      {activeEmailDropdownLeadId === lead.id && (
                        <div className="absolute left-0 mt-1.5 w-60 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                          <button
                            onClick={() => handleEmailClient(lead, 'gmail')}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-heading)] hover:bg-[var(--bg-page)] flex items-center justify-between cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-rose-500" />
                              <span>Open in Gmail Web</span>
                            </span>
                            <span className="text-[10px] font-mono text-[var(--brand-teal)] font-bold">1-Click</span>
                          </button>
                          <button
                            onClick={() => handleEmailClient(lead, 'mailto')}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-heading)] hover:bg-[var(--bg-page)] flex items-center gap-2 cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                            <span>Default Mail App (mailto:)</span>
                          </button>
                          <button
                            onClick={() => handleCopyEmailDraft(lead)}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-heading)] hover:bg-[var(--bg-page)] flex items-center gap-2 cursor-pointer border-t border-[var(--border-subtle)] mt-1 pt-1.5"
                          >
                            <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                            <span>Copy Discovery Draft Template</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {normStatus !== 'assigned' && normStatus !== 'completed' && (
                      <button
                        onClick={() => openConvertModal(lead)}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Convert to Project / Sprint</span>
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteConfirmId(lead.id)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ── CONVERT LEAD TO PROJECT / SPRINT MODAL ── */}
      <AnimatePresence>
        {convertingLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/30 flex items-center justify-center text-[var(--brand-teal)]">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-xl text-[var(--text-heading)]">
                      Convert to Managed Project
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Launch active sprint delivery for {convertingLead.clientName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setConvertingLead(null)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-heading)] p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-heading)] mb-1">
                    Assign Delivery Squad
                  </label>
                  <select
                    value={targetSquad}
                    onChange={(e) => {
                      const newG = e.target.value as GroupId;
                      setTargetSquad(newG);
                      const leader = users.find(u => u.groupId === newG && (u.role === 'group_leader' || u.roleTier === 'group_leader'));
                      if (leader) setAssignedLeaderId(leader.id);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] font-semibold"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-heading)] mb-1">
                    Assigned Technical / Squad Leader
                  </label>
                  <select
                    value={assignedLeaderId}
                    onChange={(e) => setAssignedLeaderId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] font-semibold"
                  >
                    {users
                      .filter(u => u.groupId === targetSquad)
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.title})
                        </option>
                      ))}
                    {users
                      .filter(u => u.groupId !== targetSquad)
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.title} - {u.groupId?.toUpperCase()})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-heading)] mb-1">
                      Total Project Budget (USD)
                    </label>
                    <input
                      type="number"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-heading)] mb-1">
                      External Costs / Deposit (USD)
                    </label>
                    <input
                      type="number"
                      value={externalCosts}
                      onChange={(e) => setExternalCosts(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] font-semibold"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-3">
                  <span className="text-xs font-extrabold text-[var(--text-heading)] block">
                    DigiHust Revenue Split Policy
                  </span>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase">Management</span>
                      <span className="font-extrabold text-sm text-[var(--brand-teal)]">{splitMgmt}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase">Squad Lead</span>
                      <span className="font-extrabold text-sm text-cyan-600 dark:text-cyan-400">{splitLeader}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase">Specialists</span>
                      <span className="font-extrabold text-sm text-emerald-500">{splitFreelancer}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => setConvertingLead(null)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-page)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmConvert}
                  className="px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Launch Sprint in Workspace</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-6 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">
                Delete Client Inquiry?
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Are you sure you want to delete this lead from the pipeline ledger? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-page)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteLead(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── PHONE PROMPT MODAL (FOR LEADS WITHOUT PHONE) ── */}
      <AnimatePresence>
        {phonePromptLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                      WhatsApp Client Chat
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Connect with {phonePromptLead.clientName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPhonePromptLead(null)}
                  className="p-1 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-page)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[var(--text-body)]">
                <p>
                  No phone number was recorded on this lead inquiry. Enter the client's phone or WhatsApp number below to launch the direct chat:
                </p>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-heading)] mb-1">
                    Client Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={manualPhoneInput}
                      onChange={(e) => setManualPhoneInput(e.target.value)}
                      placeholder="e.g. +92 322 6806396 or +1 415 555 2671"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-heading)] bg-[var(--bg-page)] focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Pre-Written Greeting</span>
                    <button
                      onClick={() => {
                        const clientName = phonePromptLead.clientName || 'Client';
                        const waGreeting = `Hello ${clientName},\n\nThis is ${currentUser?.name || 'DigiHust Operations'} from DigiHust Executive Leadership. We received your project inquiry for "${phonePromptLead.title || 'Digital Solution'}" and would love to coordinate your project discovery alignment.\n\nWhen would you be available for a brief 15-minute alignment call?`;
                        navigator.clipboard.writeText(waGreeting);
                        showToast('Greeting message copied to clipboard!', 'success', 'Copied');
                      }}
                      className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      <span>Copy Text</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-3 italic">
                    "Hello {phonePromptLead.clientName}, This is DigiHust Executive Leadership. We received your project inquiry..."
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => setPhonePromptLead(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-page)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveManualPhoneAndLaunch}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Start WhatsApp Chat</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
