import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox, Search, Filter, MessageSquare, Mail, Calendar, ArrowRight,
  CheckCircle2, Clock, AlertCircle, Trash2, ExternalLink, Paperclip,
  Building, DollarSign, Shield, ChevronDown, ChevronUp, Copy, Check,
  Briefcase, Sparkles, RefreshCw, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Lead, GroupId, PipelineStage } from '../../types';

export const InboundLeadsManager: React.FC = () => {
  const { leads, groups, users, currentUser, updateLeadStatus, deleteLead, reviewLeadToProject } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSquad, setFilterSquad] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest_budget'>('newest');
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

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

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>WhatsApp & Email Sync Live</span>
            </span>
          </div>
        </div>

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

            // WhatsApp message generator for CEO/Co-Founder direct reach
            const waGreeting = encodeURIComponent(
              `Hello ${clientName},\n\nThis is ${currentUser?.name || 'DigiHust Operations'} from DigiHust Executive Leadership. We received your project inquiry for "${lead.title || 'Digital Solution'}" and would love to coordinate your project discovery alignment.\n\nWhen would you be available for a brief 15-minute alignment call?`
            );
            const waLink = `https://wa.me/?text=${waGreeting}`;

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
                      <p className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1.5 mt-0.5">
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
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Client</span>
                    </a>

                    <a
                      href={`mailto:${clientEmail}?subject=${encodeURIComponent(`DigiHust Discovery: Next Steps for ${lead.title || 'Your Project'}`)}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] bg-[var(--bg-page)] hover:bg-[var(--bg-subtle)] text-xs font-bold transition-all cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                      <span>Email Client</span>
                    </a>
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

    </div>
  );
};
