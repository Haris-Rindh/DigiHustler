import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, Clock, FileCheck, ArrowRight, 
  Download, MessageSquare, ExternalLink, Sparkles, Building, 
  Layers, Lock, AlertCircle, HelpCircle
} from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { useApp } from '../../context/AppContext';
import { PipelineStage } from '../../types';

const STAGE_ORDER: { key: PipelineStage; label: string; desc: string }[] = [
  { key: 'lead', label: '1. Scoping & Intake', desc: 'Requirements analysis and squad assembly' },
  { key: 'review', label: '2. Architecture & Plan', desc: 'Milestone breakdown and technical planning' },
  { key: 'assigned', label: '3. Sprint Kickoff', desc: 'Squad assigned to core repository' },
  { key: 'in_progress', label: '4. Active Development', desc: 'Sprint execution, staging builds, and QA' },
  { key: 'completed', label: '5. Final Review & Delivery', desc: 'Production verification and asset transfer' },
  { key: 'paid', label: '6. Completed & Handed Over', desc: 'All deliverables verified and signed off' },
];

export const ClientProjectTracker: React.FC = () => {
  const { trackingToken: paramToken } = useParams<{ trackingToken?: string }>();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get('token');
  const token = paramToken || queryToken || '';

  const { projects, groups } = useApp();

  // Find project by token or matching project ID (safe fallback)
  const project = projects.find(p => 
    (p.trackingToken && p.trackingToken === token) || 
    p.id === token ||
    p.id.replace('proj-', '') === token
  );

  const squad = groups.find(g => g.id === project?.groupId);

  const getStageIndex = (stage: PipelineStage) => {
    const idx = STAGE_ORDER.findIndex(s => s.key === stage);
    return idx === -1 ? 3 : idx;
  };

  const currentStageIndex = project ? getStageIndex(project.status) : 0;
  const progressPercent = Math.round(((currentStageIndex + 1) / STAGE_ORDER.length) * 100);

  if (!project && token) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] flex items-center justify-center px-4">
        <SEOHead title="Project Tracker | DigiHust" description="Live client project tracker." />
        <div className="max-w-md w-full p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--text-heading)]">Invalid Tracking Link</h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            We could not find an active client project matching this tracking token. Please contact your DigiHust Project Manager for an updated tracking link.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] text-white font-bold text-xs shadow"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Demo fallback project if accessed without token for previewing
  const displayProject = project || {
    id: 'proj-demo',
    title: 'Enterprise Web & Mobile Client Application',
    clientName: 'Enterprise Client',
    clientCompany: 'Global Partner Inc.',
    clientEmail: 'client@example.com',
    groupId: 'tech' as const,
    assignedLeaderId: 'usr-1',
    assignedLeaderName: 'Hamza Khan (Technical Director)',
    brief: 'Full-stack platform development with milestone verification and staging deployments.',
    totalValue: 5000,
    externalFee: 0,
    netRevenue: 5000,
    isLeadGenIndependent: false,
    leadGenUserPct: 0,
    splitManagementPct: 20,
    splitLeaderPct: 15,
    splitFreelancerPct: 65,
    assignments: [],
    status: 'in_progress' as PipelineStage,
    deliverables: [
      {
        id: 'del-1',
        title: 'Figma Interactive UI/UX Design System & Prototypes',
        linkUrl: 'https://figma.com',
        submittedByUserId: 'usr-1',
        submittedByUserName: 'Lead Designer',
        submittedAt: '2026-08-20',
        status: 'approved' as const,
        notes: 'Includes mobile & desktop responsive breakpoints.'
      },
      {
        id: 'del-2',
        title: 'Frontend React/Next.js Staging Environment Build',
        linkUrl: 'https://staging.digihust.com',
        submittedByUserId: 'usr-2',
        submittedByUserName: 'Frontend Architect',
        submittedAt: '2026-08-24',
        status: 'approved' as const,
        notes: 'Deployed to Vercel preview staging.'
      },
      {
        id: 'del-3',
        title: 'Backend API Integration & Authentication Database',
        submittedByUserId: 'usr-3',
        submittedByUserName: 'Backend Engineer',
        submittedAt: '2026-08-26',
        status: 'pending' as const,
        notes: 'Under final QA and security vulnerability audit.'
      }
    ],
    comments: [],
    createdAt: '2026-08-15'
  };

  const activeStageIdx = getStageIndex(displayProject.status);
  const activePercent = Math.round(((activeStageIdx + 1) / STAGE_ORDER.length) * 100);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title={`Live Project Tracker: ${displayProject.title} | DigiHust`}
        description="Private live client milestone tracker for DigiHust deliverables."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[var(--brand-teal)] uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Client Delivery Portal (Read-Only)</span>
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)]">
                {displayProject.title}
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Client: <strong className="text-[var(--text-heading)]">{displayProject.clientName}</strong>
                {displayProject.clientCompany && ` · ${displayProject.clientCompany}`}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[var(--brand-teal-subtle)] border border-[var(--brand-teal)]/40 text-[var(--brand-teal)] text-xs font-extrabold uppercase tracking-wide w-fit">
                <span className="w-2 h-2 rounded-full bg-[var(--brand-teal)] animate-pulse" />
                <span>Stage: {STAGE_ORDER[activeStageIdx]?.label}</span>
              </span>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Project Code: {displayProject.id}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[var(--text-heading)]">Sprint Delivery Completion</span>
              <span className="text-[var(--brand-teal)] font-mono text-sm font-extrabold">{activePercent}%</span>
            </div>
            <div className="w-full h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activePercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[var(--brand-teal)] to-cyan-400 rounded-full"
              />
            </div>
          </div>

          {/* Milestone Step Indicator */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
            {STAGE_ORDER.map((stage, idx) => {
              const isPast = idx < activeStageIdx;
              const isCurrent = idx === activeStageIdx;

              return (
                <div
                  key={stage.key}
                  className={`p-3 rounded-2xl border text-xs space-y-1 transition-all ${
                    isCurrent
                      ? 'bg-[var(--brand-teal-subtle)] border-[var(--brand-teal)] ring-1 ring-[var(--brand-teal)]/30 text-[var(--text-heading)] font-bold'
                      : isPast
                      ? 'bg-[var(--bg-page)] border-emerald-500/30 text-emerald-400'
                      : 'bg-[var(--bg-page)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-extrabold text-[11px]">
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-[var(--brand-teal)] animate-ping" />
                    ) : (
                      <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                    )}
                    <span className="truncate">{stage.label}</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-body)] line-clamp-2 leading-tight">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deliverables & Assets Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Deliverables list */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-md space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-[var(--brand-teal)]" />
                  <h2 className="font-display font-bold text-xl text-[var(--text-heading)]">
                    Project Deliverables & Handover Assets
                  </h2>
                </div>
                <span className="text-xs font-mono text-[var(--brand-teal)] font-bold">
                  {displayProject.deliverables?.length || 0} Assets
                </span>
              </div>

              {displayProject.deliverables && displayProject.deliverables.length > 0 ? (
                <div className="space-y-4">
                  {displayProject.deliverables.map((del) => (
                    <div
                      key={del.id}
                      className="p-5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-2 hover:border-[var(--brand-teal)]/40 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className={`w-4 h-4 ${del.status === 'approved' ? 'text-emerald-400' : 'text-amber-400'}`} />
                          <h3 className="font-bold text-sm text-[var(--text-heading)]">{del.title}</h3>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border w-fit ${
                          del.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {del.status === 'approved' ? '✓ Verified & Signed Off' : 'Under Final QA Review'}
                        </span>
                      </div>

                      {del.notes && (
                        <p className="text-xs text-[var(--text-body)] leading-relaxed pl-6">
                          {del.notes}
                        </p>
                      )}

                      {del.linkUrl && (
                        <div className="pl-6 pt-1">
                          <a
                            href={del.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[var(--brand-teal)] hover:underline"
                          >
                            <span>Open Asset / Staging Link</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[var(--text-muted)] space-y-2">
                  <Clock className="w-8 h-8 mx-auto opacity-40 text-[var(--brand-teal)]" />
                  <p>Initial milestone deliverables are currently in staging build compilation.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Squad & Contact Management */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-md space-y-6">
              <h3 className="font-display font-bold text-lg text-[var(--text-heading)]">
                Assigned Squad Management
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-teal)] block">
                    Dedicated Technical Director
                  </span>
                  <p className="font-bold text-sm text-[var(--text-heading)]">{displayProject.assignedLeaderName}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Single accountable point of contact</p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                    Execution SLA Standard
                  </span>
                  <p className="font-bold text-xs text-[var(--text-heading)]">DigiHust Enterprise Managed SLA</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">✓ 100% IP Handover & Milestone Guarantee</p>
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                <a
                  href={`https://wa.me/923001234567?text=${encodeURIComponent(`Hello, I am checking the live project tracker for ${displayProject.title} (${displayProject.id}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Project Manager</span>
                </a>
                <Link
                  to="/contact"
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--brand-teal)] hover:text-white text-[var(--text-heading)] font-bold text-xs border border-[var(--border-subtle)] shadow-sm transition-all"
                >
                  <span>Request Scope Revision</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
