import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Calendar,
  Award,
  BookOpen,
  Filter,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Applicant, GroupId, UserRole } from '../../../types';

export const ApplicantWorkflowQueue: React.FC = () => {
  const { applicants, groups, currentUser, approveApplicant, rejectApplicant, requestMoreInfoApplicant } = useApp();

  const isManagement = currentUser.role === 'management';

  const [filterTab, setFilterTab] = useState<'pending' | 'more_info_requested' | 'approved' | 'rejected' | 'all'>('pending');
  const [rejectModalAppId, setRejectModalAppId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [infoModalAppId, setInfoModalAppId] = useState<string | null>(null);
  const [infoNotes, setInfoNotes] = useState('');

  const filteredApplicants = applicants.filter((a) => {
    if (filterTab === 'all') return true;
    return a.status === filterTab;
  });

  const handleApprove = (id: string, preferredGroupId: GroupId) => {
    approveApplicant(id, 'freelancer', preferredGroupId);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalAppId) return;
    rejectApplicant(rejectModalAppId, rejectReason || 'Profile does not meet current batch requirements.');
    setRejectModalAppId(null);
    setRejectReason('');
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoModalAppId) return;
    requestMoreInfoApplicant(infoModalAppId, infoNotes || 'Updated portfolio repository link requested.');
    setInfoModalAppId(null);
    setInfoNotes('');
  };

  const getStatusBadge = (status: Applicant['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Pending Review</span>;
      case 'more_info_requested':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Follow-up Flagged</span>;
      case 'approved':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Approved to Roster</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Archived / Rejected</span>;
    }
  };

  return (
    <div className="space-y-6">

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'pending', label: 'Pending Review', count: applicants.filter((a) => a.status === 'pending').length },
            { id: 'more_info_requested', label: 'Follow-up Flagged', count: applicants.filter((a) => a.status === 'more_info_requested').length },
            { id: 'approved', label: 'Approved', count: applicants.filter((a) => a.status === 'approved').length },
            { id: 'rejected', label: 'Rejected', count: applicants.filter((a) => a.status === 'rejected').length },
            { id: 'all', label: 'All Applications', count: applicants.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                filterTab === tab.id
                  ? 'bg-[var(--brand-teal)] text-white shadow-md'
                  : 'bg-[var(--bg-page)] text-[var(--text-muted)] hover:text-[var(--text-heading)] border border-[var(--border-subtle)]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-xs text-[var(--text-muted)] font-semibold">
          Showing {filteredApplicants.length} applications
        </span>
      </div>

      {/* Applicant Cards Grid */}
      {filteredApplicants.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs">
          No applicants currently in this review stage.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredApplicants.map((app) => {
            const group = groups.find((g) => g.id === app.preferredGroupId);

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between shadow-xl space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-body)]">
                          {app.digiskillId}
                        </span>
                        {getStatusBadge(app.status)}
                      </div>
                      <h3 className="font-display font-extrabold text-xl text-[var(--text-heading)]">{app.name}</h3>
                      <p className="text-xs text-[var(--text-body)] font-medium">{app.digiskillCourse} Candidate</p>
                    </div>

                    {group && (
                      <span className="text-[11px] font-bold text-[var(--text-heading)] bg-[var(--brand-teal)]/20 px-2.5 py-1 rounded-xl border border-[var(--brand-teal)]/40">
                        {group.name}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-body)] my-3 p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)]">
                    <div>
                      <span className="text-[var(--text-dim)] block text-[10px]">Email:</span>
                      <span className="font-semibold text-[var(--text-heading)]">{app.email}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-dim)] block text-[10px]">Experience:</span>
                      <span className="font-semibold text-[var(--text-heading)]">{app.experienceYears} Years</span>
                    </div>
                  </div>

                  {app.bio && (
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed italic mb-3">
                      "{app.bio}"
                    </p>
                  )}

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {app.specialties.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-[var(--bg-page)] text-[var(--text-body)] text-[10px] border border-[var(--border-subtle)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Portfolio link */}
                  {app.portfolioUrl && (
                    <a
                      href={app.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-bold text-[var(--brand-teal)] hover:underline"
                    >
                      <span>View Portfolio / GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {/* Follow-up / Rejection Context */}
                  {app.status === 'more_info_requested' && app.followUpNotes && (
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 mt-2">
                      <strong>Follow-up Note:</strong> {app.followUpNotes}
                    </div>
                  )}

                  {app.status === 'rejected' && app.rejectionReason && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 mt-2">
                      <strong>Rejection Reason:</strong> {app.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Workflow Actions (Management Only) */}
                {isManagement && app.status !== 'approved' && (
                  <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApprove(app.id, app.preferredGroupId)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => setInfoModalAppId(app.id)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-xs transition-colors flex items-center space-x-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Request Info</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setRejectModalAppId(app.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs transition-colors flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <h3 className="font-bold text-lg text-[var(--text-heading)]">Record Rejection Reason</h3>
            <p className="text-xs text-[var(--text-body)]">
              Provide context for why this application is archived (kept on record for future re-applications).
            </p>

            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Portfolio does not contain live React production samples."
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs focus:outline-none focus:border-[var(--brand-teal)]"
            />

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalAppId(null)}
                className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-body)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Request Info Modal */}
      {infoModalAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <h3 className="font-bold text-lg text-[var(--text-heading)]">Request More Information</h3>
            <p className="text-xs text-[var(--text-body)]">
              Specify what additional portfolio pieces or verification documents are required.
            </p>

            <textarea
              rows={3}
              required
              value={infoNotes}
              onChange={(e) => setInfoNotes(e.target.value)}
              placeholder="e.g. Please provide your live Figma link or GitHub profile."
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs focus:outline-none focus:border-[var(--brand-teal)]"
            />

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setInfoModalAppId(null)}
                className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-body)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInfoSubmit}
                className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold text-xs"
              >
                Flag for Follow-up
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
