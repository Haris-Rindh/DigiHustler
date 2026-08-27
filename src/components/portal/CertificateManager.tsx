import React, { useState } from 'react';
import { 
  Award, Plus, QrCode, CheckCircle2, AlertTriangle, ExternalLink, 
  RotateCcw, ShieldCheck, FileText, Search, User, Check, X, Printer, Eye 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../context/AppContext';
import { Certificate, CertificateType, CertificateStatus } from '../../types';
import { PERMISSIONS } from '../../lib/permissions';
import { CertificatePrintView } from '../ui/CertificatePrintView';

export const CertificateManager: React.FC = () => {
  const { certificates, users, currentTier, currentUser, issueCertificate, revokeCertificate, restoreCertificate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [selectedCertForRevoke, setSelectedCertForRevoke] = useState<Certificate | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  // Form state for issuing new cert
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [certType, setCertType] = useState<CertificateType>('offer_letter');
  const [roleTitle, setRoleTitle] = useState('');
  const [durationText, setDurationText] = useState('45 Days (Remote)');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [clientName, setClientName] = useState('DigiHust Engineering Squad Core');
  const [projectDetails, setProjectDetails] = useState('Assigned to client deliverables including responsive full-stack applications, API microservices, and database architecture.');
  const [stipendTerms, setStipendTerms] = useState('65–70% of the project budget, according to DigiHust\'s revenue-sharing policy');

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

    const newCert = issueCertificate({
      memberId: member.id,
      memberName: member.name,
      memberDghId: member.memberId || 'DGH2600101',
      type: certType,
      roleTitle: roleTitle || member.title,
      startDate,
      endDate: certType === 'experience_certificate' ? (endDate || undefined) : undefined,
      durationText,
      stipendTerms: certType === 'offer_letter' ? stipendTerms : undefined,
      clientName: clientName || 'DigiHust Engineering Core',
      projectDetails: projectDetails || 'Executed complex digital milestones under managed SLA quality standards.',
      issuedBy: `${currentUser.name}, ${currentUser.roleTier?.toUpperCase() || 'Management'}`,
      signatoryName: 'Mahad Abbas',
      signatoryTitle: 'Founder & CEO',
      contactEmail: 'contact@digihust.com',
      contactPhone: '+92 300 1234567',
      contactAddress: 'Islamabad / Global Remote Operations'
    });

    setIssueModalOpen(false);
    setSelectedMemberId('');
    setRoleTitle('');
    setPreviewCert(newCert);
  };

  const handleConfirmRevoke = () => {
    if (!selectedCertForRevoke) return;
    revokeCertificate(selectedCertForRevoke.id, revokeReason);
    setRevokeModalOpen(false);
    setSelectedCertForRevoke(null);
    setRevokeReason('');
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://digihust.com';

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
            Generate verifiable credentials with embedded unique QR codes and print-ready DigiHust letterheads.
          </p>
        </div>

        {canIssue && (
          <button
            onClick={() => setIssueModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Offer / Certificate</span>
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
            placeholder="Search member, DGH ID, role..."
            className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-4 text-xs font-bold">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>{certificates.filter(c => c.status === 'valid').length} Active & Valid</span>
          </div>
          <div className="flex items-center space-x-1.5 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <span>{certificates.filter(c => c.status === 'revoked').length} Revoked</span>
          </div>
        </div>
      </div>

      {/* Certificates Table & Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.map((c) => {
          const isValid = c.status === 'valid';
          const certUrl = `${origin}/verify/${c.id}`;

          return (
            <div
              key={c.id}
              className={`p-6 rounded-3xl bg-[var(--bg-surface)] border transition-all flex flex-col justify-between ${
                isValid
                  ? 'border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/40 hover:shadow-xl'
                  : 'border-rose-500/40 opacity-75'
              }`}
            >
              <div>
                {/* Card Top Row: Type & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
                      {c.type === 'offer_letter' ? 'Internship Offer' : 'Experience Cert'}
                    </span>
                    <h3 className="font-bold text-base text-[var(--text-heading)] mt-2">{c.memberName}</h3>
                    <p className="text-xs font-mono text-[var(--brand-teal)] font-bold">{c.memberDghId}</p>
                  </div>

                  {/* Scannable Vector QR Code Preview */}
                  <div 
                    onClick={() => setPreviewCert(c)}
                    className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                    title="Click to preview & print"
                  >
                    <QRCodeSVG
                      value={certUrl}
                      size={44}
                      level="M"
                      includeMargin={false}
                      fgColor="#022B3A"
                      bgColor="#FFFFFF"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs mb-4">
                  <p className="text-[var(--text-heading)] font-semibold">{c.roleTitle}</p>
                  <p className="text-[var(--text-muted)] text-[11px]">
                    Issued: {c.issuedDate} · {c.durationText || 'Standard'}
                  </p>
                  <p className="text-[var(--text-muted)] text-[11px] truncate">
                    Scope: <strong className="text-[var(--text-body)]">{c.clientName}</strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewCert(c)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold shadow-sm hover:bg-[var(--brand-teal-hover)] transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Letter</span>
                </button>

                <a
                  href={`/verify/${c.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] text-xs font-bold transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                  <span>Verify URL</span>
                </a>

                {PERMISSIONS.canRevokeCertificate(currentTier) && (
                  isValid ? (
                    <button
                      onClick={() => {
                        setSelectedCertForRevoke(c);
                        setRevokeModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs transition-colors"
                      title="Revoke Credential"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => restoreCertificate(c.id)}
                      className="p-1.5 rounded-xl text-emerald-400 hover:bg-emerald-500/10 text-xs transition-colors"
                      title="Restore Validity"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── PREVIEW & PRINT MODAL ── */}
      {previewCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] print:hidden">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[var(--brand-teal)]" />
                <h3 className="font-bold text-lg text-[var(--text-heading)]">
                  Print Preview: {previewCert.memberName} ({previewCert.type === 'offer_letter' ? 'Internship Offer' : 'Experience Cert'})
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[var(--brand-teal-hover)]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setPreviewCert(null)}
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Letterhead Render */}
            <div className="flex justify-center bg-slate-100 p-4 sm:p-6 rounded-2xl overflow-x-auto">
              <CertificatePrintView certificate={previewCert} verificationUrl={`${origin}/verify/${previewCert.id}`} />
            </div>
          </div>
        </div>
      )}

      {/* ── ISSUE NEW CERTIFICATE MODAL ── */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleIssueSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-bold text-base text-[var(--text-heading)]">Generate Official Letterhead & QR</h3>
              <button type="button" onClick={() => setIssueModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Target Member</label>
              <select
                required
                value={selectedMemberId}
                onChange={(e) => {
                  setSelectedMemberId(e.target.value);
                  const mem = users.find(u => u.id === e.target.value);
                  if (mem) setRoleTitle(mem.title);
                }}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)]"
              >
                <option value="">-- Select Member from Directory --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.memberId}) — {u.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Document Type</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as CertificateType)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                >
                  <option value="offer_letter">Internship Offer Letter</option>
                  <option value="experience_certificate">Experience Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Duration Tag</label>
                <input
                  type="text"
                  value={durationText}
                  onChange={(e) => setDurationText(e.target.value)}
                  placeholder="e.g. 45 Days (Remote)"
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Designation / Role Title</label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Full-Stack Developer"
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)]"
              />
            </div>

            {certType === 'offer_letter' && (
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Revenue-Share / Payout Clause</label>
                <input
                  type="text"
                  value={stipendTerms}
                  onChange={(e) => setStipendTerms(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Squad / Scope Reference</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Project Details</label>
              <textarea
                rows={2}
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-heading)]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
              <button type="button" onClick={() => setIssueModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)]">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold">Issue & Generate QR</button>
            </div>
          </form>
        </div>
      )}

      {/* ── REVOKE MODAL ── */}
      {revokeModalOpen && selectedCertForRevoke && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-[var(--text-heading)]">Revoke Credential Verification</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Are you sure you want to mark the credential for <strong>{selectedCertForRevoke.memberName}</strong> as revoked?
            </p>
            <input
              type="text"
              placeholder="Reason for revocation..."
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)]"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setRevokeModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)]">Cancel</button>
              <button onClick={handleConfirmRevoke} className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold">Confirm Revocation</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
