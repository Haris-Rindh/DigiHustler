import React, { useState } from 'react';
import { 
  Award, Plus, QrCode, CheckCircle2, AlertTriangle, ExternalLink, 
  RotateCcw, ShieldCheck, FileText, Search, User, Check, X, Printer, Eye, 
  Settings, Layers, Trash2, Edit3, Sparkles, Download, FileUp 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../context/AppContext';
import { Certificate, CertificateType, CertificateTemplate, CertificateStatus } from '../../types';
import { PERMISSIONS } from '../../lib/permissions';
import { CertificatePrintView } from '../ui/CertificatePrintView';
import { PdfTemplateEditorModal } from './PdfTemplateEditorModal';
import { 
  generateBuiltInCertificatePdf, 
  stampCustomPdfTemplate, 
  downloadPdfFile, 
  previewPdfInNewTab 
} from '../../lib/pdfTemplateEngine';

export const CertificateManager: React.FC = () => {
  const { 
    certificates, users, currentTier, currentUser, 
    certificateTemplates, createCertificateTemplate, 
    updateCertificateTemplate, deleteCertificateTemplate,
    generateMemberCertificate, revokeCertificate, restoreCertificate 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'issued' | 'templates'>('issued');
  const [searchQuery, setSearchQuery] = useState('');
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [selectedCertForRevoke, setSelectedCertForRevoke] = useState<Certificate | null>(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Template Studio Modals
  const [createTemplateModalOpen, setCreateTemplateModalOpen] = useState(false);
  const [uploadPdfModalOpen, setUploadPdfModalOpen] = useState(false);

  // New Template Draft
  const [tplName, setTplName] = useState('');
  const [tplType, setTplType] = useState<CertificateType>('offer_letter');
  const [tplDocTitle, setTplDocTitle] = useState('');
  const [tplDuration, setTplDuration] = useState('45 Days (Remote)');
  const [tplIntro, setTplIntro] = useState('');
  const [tplBullets, setTplBullets] = useState<string[]>(['Quality of work', 'Meeting deadlines', 'Communication & teamwork']);
  const [newBulletText, setNewBulletText] = useState('');
  const [tplRevenue, setTplRevenue] = useState('65–70% of the project budget, according to DigiHust\'s revenue-sharing policy.');
  const [tplClosing, setTplClosing] = useState('We look forward to having you on board.');
  const [tplSignatoryName, setTplSignatoryName] = useState('Mahad Abbas');
  const [tplSignatoryTitle, setTplSignatoryTitle] = useState('Founder & CEO');
  const [tplWatermark, setTplWatermark] = useState('DigiHust');

  // Generator Form state
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(certificateTemplates[0]?.id || '');
  const [roleTitle, setRoleTitle] = useState('');
  const [durationText, setDurationText] = useState('45 Days (Remote)');
  const [clientName, setClientName] = useState('DigiHust Engineering Squad Core');
  const [projectDetails, setProjectDetails] = useState('');

  const canIssue = PERMISSIONS.canIssueCertificate(currentTier);

  const filteredCerts = certificates.filter(c => 
    c.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.memberDghId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenIssueModal = () => {
    setSelectedMemberId(users[0]?.id || '');
    const tpl = certificateTemplates?.[0];
    setSelectedTemplateId(tpl?.id || 'tpl-offer');
    setRoleTitle(users[0]?.title || 'Specialist');
    setDurationText(tpl?.defaultDuration || '45 Days (Remote)');
    setIssueModalOpen(true);
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    const tpl = certificateTemplates?.find(t => t.id === selectedTemplateId) || certificateTemplates?.[0];
    const newCert = generateMemberCertificate(selectedMemberId, tpl?.id || 'tpl-offer', {
      roleTitle: roleTitle || 'Specialist',
      durationText: durationText || '45 Days (Remote)',
      clientName: clientName || 'DigiHust Engineering Squad Core',
      projectDetails: projectDetails || undefined,
      pdfConfig: tpl?.pdfConfig
    });

    setIssueModalOpen(false);
    setPreviewCert(newCert);
  };

  const handleDownloadPdf = async (cert: Certificate) => {
    setIsGeneratingPdf(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://digihust.com';
      const verifyUrl = `${origin}/verify/${cert.id}`;

      // Check if certificate has custom PDF graphic template uploaded
      const matchingTpl = certificateTemplates.find(t => t.id === cert.templateId);
      const pdfConfig = cert.pdfConfig || matchingTpl?.pdfConfig;

      let pdfBytes: Uint8Array;
      if (pdfConfig?.backgroundPdfBase64) {
        pdfBytes = await stampCustomPdfTemplate(pdfConfig.backgroundPdfBase64, cert, verifyUrl, pdfConfig);
      } else {
        pdfBytes = await generateBuiltInCertificatePdf(cert, verifyUrl);
      }

      const safeName = `${cert.memberName.replace(/\s+/g, '_')}_${(cert.documentTitle || cert.type).replace(/\s+/g, '_')}`;
      downloadPdfFile(pdfBytes, safeName);
    } catch (err) {
      console.error(err);
      alert('Error generating PDF document. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCreateTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplName || !tplDocTitle) return;

    createCertificateTemplate({
      name: tplName,
      type: tplType,
      documentTitle: tplDocTitle,
      defaultDuration: tplDuration,
      introParagraph: tplIntro || `We hereby issue this official ${tplDocTitle} to {{memberName}} (Member ID: {{memberDghId}}).`,
      bulletPoints: tplBullets,
      revenueClause: tplRevenue,
      closingParagraph: tplClosing,
      signatoryName: tplSignatoryName,
      signatoryTitle: tplSignatoryTitle,
      watermarkText: tplWatermark,
      contactEmail: 'contact@digihust.com',
      contactPhone: '+92 300 1234567',
      contactAddress: 'Islamabad / Global Remote Operations'
    });

    setCreateTemplateModalOpen(false);
    setTplName('');
    setTplDocTitle('');
    setTplIntro('');
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
            Upload custom PDF graphic templates or use built-in layouts to generate verified credentials with unique vector QR codes.
          </p>
        </div>

        {canIssue && (
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setUploadPdfModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-purple-500/40 text-purple-400 hover:bg-purple-500/10 text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <FileUp className="w-4 h-4" />
              <span>Upload PDF Template</span>
            </button>

            <button
              onClick={() => setCreateTemplateModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-xs font-bold text-[var(--text-heading)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-[var(--brand-teal)]" />
              <span>New Type</span>
            </button>

            <button
              onClick={handleOpenIssueModal}
              className="flex items-center space-x-2 px-4.5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Generate for Member</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-[var(--border-subtle)] pb-2">
        <button
          onClick={() => setActiveTab('issued')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'issued'
              ? 'bg-[var(--brand-teal)] text-white shadow-sm'
              : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Issued Registry ({certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'templates'
              ? 'bg-[var(--brand-teal)] text-white shadow-sm'
              : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Certificate Templates ({certificateTemplates.length})</span>
        </button>
      </div>

      {/* ── TAB 1: ISSUED CREDENTIALS REGISTRY ── */}
      {activeTab === 'issued' && (
        <div className="space-y-6">
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

          {/* Certificates Grid */}
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
                          {c.documentTitle || (c.type === 'offer_letter' ? 'Internship Offer' : c.type === 'completion_certificate' ? 'Completion Cert' : 'Experience Cert')}
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
                          size={46}
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
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-1.5">
                    <button
                      onClick={() => handleDownloadPdf(c)}
                      disabled={isGeneratingPdf}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold shadow-sm hover:bg-[var(--brand-teal-hover)] transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isGeneratingPdf ? 'PDF...' : 'Download PDF'}</span>
                    </button>

                    <button
                      onClick={() => setPreviewCert(c)}
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] text-xs font-bold transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                      <span>Print</span>
                    </button>

                    <a
                      href={`/verify/${c.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] text-xs font-bold transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
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
        </div>
      )}

      {/* ── TAB 2: CERTIFICATE TEMPLATE STUDIO ── */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div>
              <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">Configured Letterhead Templates ({certificateTemplates.length})</h3>
              <p className="text-xs text-[var(--text-muted)]">Upload custom graphic PDF templates or customize text, clauses, criteria, and branding.</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setUploadPdfModalOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-purple-500/40 text-purple-400 hover:bg-purple-500/10 text-xs font-bold cursor-pointer"
              >
                <FileUp className="w-4 h-4" />
                <span>Upload PDF Template</span>
              </button>
              <button
                onClick={() => setCreateTemplateModalOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[var(--brand-teal-hover)]"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Type</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificateTemplates.map((tpl) => (
              <div key={tpl.id} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)]">
                      {tpl.pdfConfig?.backgroundPdfBase64 ? 'Custom Graphic PDF' : tpl.type.replace('_', ' ')}
                    </span>
                    {certificateTemplates.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete template '${tpl.name}'?`)) {
                            deleteCertificateTemplate(tpl.id);
                          }
                        }}
                        className="p-1 text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-[var(--text-heading)]">{tpl.name}</h3>
                  <p className="text-xs font-semibold text-[var(--brand-teal)] mt-0.5">{tpl.documentTitle}</p>
                  <p className="text-xs text-[var(--text-body)] mt-2 leading-relaxed line-clamp-3">
                    {tpl.introParagraph}
                  </p>

                  {tpl.bulletPoints && tpl.bulletPoints.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] space-y-1">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Evaluation / Criteria ({tpl.bulletPoints.length}):</span>
                      <ul className="text-xs text-[var(--text-muted)] space-y-0.5 list-disc pl-4 line-clamp-2">
                        {tpl.bulletPoints.slice(0, 2).map((bp, i) => (
                          <li key={i}>{bp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[var(--text-muted)]">Signatory: <strong>{tpl.signatoryName}</strong></span>
                  <button
                    onClick={() => {
                      const sampleCert: Certificate = {
                        id: 'sample-preview-token',
                        templateId: tpl.id,
                        memberId: 'usr-sample',
                        memberName: 'Specialist Candidate',
                        memberDghId: 'DGH2600101',
                        type: tpl.type,
                        documentTitle: tpl.documentTitle,
                        roleTitle: 'Full-Stack Developer',
                        startDate: '2026-09-01',
                        issuedDate: new Date().toISOString().split('T')[0],
                        status: 'valid',
                        clientName: 'DigiHust Core Squad',
                        projectDetails: 'Executed high-performance software modules under managed quality SLAs.',
                        issuedBy: `${tpl.signatoryName}, ${tpl.signatoryTitle}`,
                        durationText: tpl.defaultDuration,
                        stipendTerms: tpl.revenueClause,
                        evaluationCriteria: tpl.bulletPoints,
                        introParagraph: tpl.introParagraph,
                        closingParagraph: tpl.closingParagraph,
                        signatoryName: tpl.signatoryName,
                        signatoryTitle: tpl.signatoryTitle,
                        watermarkText: tpl.watermarkText,
                        contactEmail: tpl.contactEmail,
                        contactPhone: tpl.contactPhone,
                        contactAddress: tpl.contactAddress,
                        pdfConfig: tpl.pdfConfig
                      };
                      setPreviewCert(sampleCert);
                    }}
                    className="flex items-center space-x-1 text-[var(--brand-teal)] font-bold hover:underline cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Test Preview</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── GENERATE FOR MEMBER MODAL ── */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleIssueSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-bold text-base text-[var(--text-heading)]">Generate Certificate / Letterhead</h3>
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
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.memberId}) — {u.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Certificate Template Type</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => {
                    setSelectedTemplateId(e.target.value);
                    const tpl = certificateTemplates.find(t => t.id === e.target.value);
                    if (tpl?.defaultDuration) setDurationText(tpl.defaultDuration);
                  }}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                >
                  {certificateTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
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

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Squad / Scope Reference</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-heading)]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
              <button type="button" onClick={() => setIssueModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)]">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold shadow-md">Generate with Unique QR</button>
            </div>
          </form>
        </div>
      )}

      {/* ── CREATE NEW TEMPLATE TYPE MODAL ── */}
      {createTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateTemplateSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-bold text-base text-[var(--text-heading)]">Add New Certificate Template Type</h3>
              <button type="button" onClick={() => setCreateTemplateModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certificate of Appreciation"
                  value={tplName}
                  onChange={(e) => setTplName(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Document Header Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certificate of Appreciation"
                  value={tplDocTitle}
                  onChange={(e) => setTplDocTitle(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Signatory Name</label>
                <input
                  type="text"
                  value={tplSignatoryName}
                  onChange={(e) => setTplSignatoryName(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Signatory Title</label>
                <input
                  type="text"
                  value={tplSignatoryTitle}
                  onChange={(e) => setTplSignatoryTitle(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                Intro Paragraph (Use <code className="text-[var(--brand-teal)]">{"{{memberName}}"}</code>, <code className="text-[var(--brand-teal)]">{"{{roleTitle}}"}</code>, <code className="text-[var(--brand-teal)]">{"{{duration}}"}</code>)
              </label>
              <textarea
                rows={3}
                placeholder="We are pleased to certify that {{memberName}} has served as {{roleTitle}}..."
                value={tplIntro}
                onChange={(e) => setTplIntro(e.target.value)}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs leading-relaxed"
              />
            </div>

            {/* Bullet Points Management */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)]">Evaluation / Criteria Bullets</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add criteria bullet..."
                  value={newBulletText}
                  onChange={(e) => setNewBulletText(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newBulletText.trim()) {
                      setTplBullets([...tplBullets, newBulletText.trim()]);
                      setNewBulletText('');
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tplBullets.map((bp, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-page)] border border-[var(--border-subtle)]">
                    <span>{bp}</span>
                    <button type="button" onClick={() => setTplBullets(tplBullets.filter((_, i) => i !== idx))} className="text-rose-400">✕</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Closing Paragraph</label>
              <textarea
                rows={2}
                value={tplClosing}
                onChange={(e) => setTplClosing(e.target.value)}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
              <button type="button" onClick={() => setCreateTemplateModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)]">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold">Save Template Type</button>
            </div>
          </form>
        </div>
      )}

      {/* ── UPLOAD PDF TEMPLATE MODAL ── */}
      {uploadPdfModalOpen && (
        <PdfTemplateEditorModal
          onClose={() => setUploadPdfModalOpen(false)}
          onSave={(newTpl) => {
            createCertificateTemplate(newTpl);
          }}
        />
      )}

      {/* ── PREVIEW & PRINT MODAL ── */}
      {previewCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] print:hidden">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[var(--brand-teal)]" />
                <h3 className="font-bold text-lg text-[var(--text-heading)]">
                  Print Preview: {previewCert.memberName} ({previewCert.documentTitle || previewCert.type})
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadPdf(previewCert)}
                  disabled={isGeneratingPdf}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[var(--brand-teal-hover)] disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPdf ? 'Compiling PDF...' : 'Download Stamped PDF'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs font-bold shadow-sm cursor-pointer hover:bg-[var(--bg-subtle)]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print View</span>
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
