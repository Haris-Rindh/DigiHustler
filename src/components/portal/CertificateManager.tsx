import React, { useState } from 'react';
import { 
  Award, Plus, QrCode, CheckCircle2, AlertTriangle, ExternalLink, 
  RotateCcw, ShieldCheck, FileText, Search, User, Check, X 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Certificate, CertificateType, CertificateStatus } from '../../types';
import { PERMISSIONS } from '../../lib/permissions';

export const CertificateManager: React.FC = () => {
  const { certificates, users, currentTier, currentUser, issueCertificate, revokeCertificate, restoreCertificate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [selectedCertForRevoke, setSelectedCertForRevoke] = useState<Certificate | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  // Form state for issuing new cert
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [certType, setCertType] = useState<CertificateType>('experience_certificate');
  const [roleTitle, setRoleTitle] = useState('');
  const [startDate, setStartDate] = useState('2026-01-10');
  const [endDate, setEndDate] = useState('2026-08-25');
  const [clientName, setClientName] = useState('');
  const [projectDetails, setProjectDetails] = useState('');

  const canIssue = PERMISSIONS.canIssueCertificate(currentTier);

  const filteredCerts = certificates.filter(c => 
    c.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.memberDghId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = users.find(u => u.id === selectedMemberId);
    if (!member) return;

    issueCertificate({
      memberId: member.id,
      memberName: member.name,
      memberDghId: member.memberId || 'DGH2600101',
      type: certType,
      roleTitle: roleTitle || member.title,
      startDate,
      endDate: certType === 'experience_certificate' ? endDate : undefined,
      clientName: clientName || 'Enterprise Portfolio Accounts',
      projectDetails: projectDetails || 'Executed complex digital milestones under managed SLA quality standards.',
      issuedBy: `${currentUser.name}, ${currentUser.roleTier?.toUpperCase() || 'Management'}`
    });

    setIssueModalOpen(false);
    setSelectedMemberId('');
    setRoleTitle('');
    setClientName('');
    setProjectDetails('');
  };

  const handleConfirmRevoke = () => {
    if (!selectedCertForRevoke) return;
    revokeCertificate(selectedCertForRevoke.id, revokeReason);
    setRevokeModalOpen(false);
    setSelectedCertForRevoke(null);
    setRevokeReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--brand-teal)] uppercase tracking-wider mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Digital Credential Authority</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)]">
            Offer Letters & Experience Certificates
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-body)]">
            Generate verifiable credentials with embedded QR code tokens and public audit pages.
          </p>
        </div>

        {canIssue && (
          <button
            onClick={() => setIssueModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Certificate</span>
          </button>
        )}
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member, DGH ID, client..."
            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{certificates.filter(c => c.status === 'valid').length} Valid Credentials</span>
          </span>
          <span className="font-bold text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>{certificates.filter(c => c.status === 'revoked').length} Revoked</span>
          </span>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.map((cert) => {
          const isValid = cert.status === 'valid';

          return (
            <div
              key={cert.id}
              className={`p-6 rounded-3xl bg-[var(--bg-surface)] border transition-all flex flex-col justify-between ${
                isValid
                  ? 'border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/50 shadow-md'
                  : 'border-rose-500/30 bg-rose-500/5 shadow-sm'
              }`}
            >
              <div>
                {/* Status & Type Banner */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    cert.type === 'experience_certificate'
                      ? 'bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border-[var(--brand-teal)]/30'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  }`}>
                    {cert.type === 'experience_certificate' ? 'EXPERIENCE CERT' : 'OFFER LETTER'}
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isValid
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {isValid ? 'VALID' : 'REVOKED'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[var(--text-heading)] mb-0.5">
                  {cert.memberName}
                </h3>
                <p className="text-[11px] font-mono text-[var(--brand-teal)] font-bold mb-3">
                  {cert.memberDghId} · {cert.roleTitle}
                </p>

                <div className="space-y-2 mb-4 text-xs bg-[var(--bg-page)] p-3.5 rounded-2xl border border-[var(--border-subtle)]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">
                      Real Client Reference
                    </span>
                    <span className="font-bold text-[var(--text-heading)]">{cert.clientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">
                      Scope / Project Details
                    </span>
                    <p className="text-[11px] text-[var(--text-body)] line-clamp-2 leading-relaxed">
                      {cert.projectDetails}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                    <span>Issued: {cert.issuedDate}</span>
                    <span>Signatory: {cert.issuedBy}</span>
                  </div>
                </div>

                {!isValid && cert.revocationReason && (
                  <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px]">
                    <strong>Revocation Reason:</strong> {cert.revocationReason}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <a
                  href={`/verify/${cert.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-xs font-bold text-[var(--brand-teal)] hover:underline"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Public QR Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {canIssue && (
                  <div>
                    {isValid ? (
                      <button
                        onClick={() => {
                          setSelectedCertForRevoke(cert);
                          setRevokeModalOpen(true);
                        }}
                        className="text-[11px] font-bold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        onClick={() => restoreCertificate(cert.id)}
                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Issue Certificate Modal */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-extrabold text-xl text-[var(--text-heading)] mb-1">
              Issue Official Digital Credential
            </h3>
            <p className="text-xs text-[var(--text-body)] mb-5">
              An unguessable UUID token and public QR verification record will be generated automatically.
            </p>

            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Select Recipient Member
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => {
                    setSelectedMemberId(e.target.value);
                    const m = users.find(u => u.id === e.target.value);
                    if (m) setRoleTitle(m.title);
                  }}
                  required
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                >
                  <option value="">Select Member from Roster...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.memberId}) · {u.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCertType('experience_certificate')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    certType === 'experience_certificate'
                      ? 'bg-[var(--brand-teal)] text-white border-[var(--brand-teal)]'
                      : 'bg-[var(--bg-page)] border-[var(--border-subtle)] text-[var(--text-heading)]'
                  }`}
                >
                  Experience Certificate
                </button>
                <button
                  type="button"
                  onClick={() => setCertType('offer_letter')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    certType === 'offer_letter'
                      ? 'bg-[var(--brand-teal)] text-white border-[var(--brand-teal)]'
                      : 'bg-[var(--bg-page)] border-[var(--border-subtle)] text-[var(--text-heading)]'
                  }`}
                >
                  Offer Letter
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Designation / Role Title
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend React Engineer"
                  required
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                  />
                </div>
                {certType === 'experience_certificate' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      End / Completion Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Real Client Reference Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Estates Direct UK & Veloce Motors"
                  required
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Real Project Details & Scope Accomplished
                </label>
                <textarea
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  placeholder="Summarize key architectural contributions, stack used, and milestone results..."
                  rows={3}
                  required
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Generate & Publish Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revocation Reason Modal */}
      {revokeModalOpen && selectedCertForRevoke && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-display font-extrabold text-lg text-rose-400 mb-1">
              Revoke Digital Certificate
            </h3>
            <p className="text-xs text-[var(--text-body)] mb-4">
              Revoking will immediately flag the public verification page as <strong>Revoked</strong> while preserving the historical audit trail.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Reason for Revocation
              </label>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="e.g. Incomplete project obligations or terms violation..."
                rows={3}
                required
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)] focus:border-rose-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => setRevokeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevoke}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
