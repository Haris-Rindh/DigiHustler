import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, QrCode, Download, 
  Printer, ArrowLeft, Building2, Calendar, Award, Check, ExternalLink,
  FileText, Share2, Copy
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../context/AppContext';
import { SEOHead } from '../seo/SEOHead';
import { CertificatePrintView } from '../ui/CertificatePrintView';
import { 
  generateBuiltInCertificatePdf, 
  stampCustomPdfTemplate, 
  downloadPdfFile 
} from '../../lib/pdfTemplateEngine';

export const CertificateVerification: React.FC = () => {
  const { certId } = useParams<{ certId: string }>();
  const { certificates } = useApp();

  const [viewMode, setViewMode] = useState<'letterhead' | 'registry'>('letterhead');
  const [copiedLink, setCopiedLink] = useState(false);

  const certificate = certificates.find(c => c.id === certId) || certificates[0];
  const isValid = certificate?.status === 'valid';

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://digihust.com';
  const currentUrl = `${origin}/verify/${certificate?.id || ''}`;

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (!certificate) return;
    setIsDownloadingPdf(true);
    try {
      const pdfConfig = certificate.pdfConfig;
      let pdfBytes: Uint8Array;
      if (pdfConfig?.backgroundPdfBase64) {
        pdfBytes = await stampCustomPdfTemplate(pdfConfig.backgroundPdfBase64, certificate, currentUrl, pdfConfig);
      } else {
        pdfBytes = await generateBuiltInCertificatePdf(certificate, currentUrl);
      }

      const safeName = `${certificate.memberName.replace(/\s+/g, '_')}_${(certificate.documentTitle || certificate.type).replace(/\s+/g, '_')}`;
      downloadPdfFile(pdfBytes, safeName);
    } catch (err) {
      console.error(err);
      alert('Error generating PDF document.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // LinkedIn Certification Link Builder
  const getLinkedInCertUrl = () => {
    if (!certificate) return '#';
    const params = new URLSearchParams({
      startTask: 'CERTIFICATION_NAME',
      name: `${certificate.type === 'offer_letter' ? 'Internship Offer & Verification' : 'Experience Certificate'} — ${certificate.roleTitle}`,
      organizationName: 'DigiHust',
      issueYear: new Date(certificate.issuedDate).getFullYear().toString(),
      issueMonth: (new Date(certificate.issuedDate).getMonth() + 1).toString(),
      certUrl: currentUrl,
      certId: certificate.id
    });
    return `https://www.linkedin.com/profile/add?${params.toString()}`;
  };

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-[var(--text-heading)]">Certificate Record Not Found</h2>
          <p className="text-xs text-[var(--text-muted)]">
            The verification token does not match any active credential in the DigiHust Registry.
          </p>
          <Link to="/" className="inline-block px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-bold">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between pt-20">
      <SEOHead
        title={`Certificate Verification: ${certificate.memberName} (${certificate.memberDghId}) — DigiHust`}
        description={`Official DigiHust Digital Credential & Verification Registry for ${certificate.memberName}.`}
      />

      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
          <Link
            to="/"
            className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--brand-teal)] transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>DigiHust Public Registry</span>
          </Link>

          {/* Mode Switcher + Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs">
              <button
                onClick={() => setViewMode('letterhead')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'letterhead'
                    ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                }`}
              >
                Official Letterhead
              </button>
              <button
                onClick={() => setViewMode('registry')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'registry'
                    ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                }`}
              >
                Registry Card
              </button>
            </div>

            {/* LinkedIn Share */}
            <a
              href={getLinkedInCertUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Add to LinkedIn</span>
            </a>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-xs font-bold text-[var(--text-heading)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--brand-teal)]" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            {/* Download Stamped PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingPdf ? 'Compiling PDF...' : 'Download Stamped PDF'}</span>
            </button>

            {/* Print View Button */}
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-heading)] text-xs font-bold shadow-sm transition-all cursor-pointer hover:bg-[var(--bg-subtle)]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print View</span>
            </button>
          </div>
        </div>

        {/* ── MODE 1: OFFICIAL LETTERHEAD (MATCHING TEMPLATE) ── */}
        {viewMode === 'letterhead' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <CertificatePrintView certificate={certificate} verificationUrl={currentUrl} />
          </motion.div>
        )}

        {/* ── MODE 2: INTERACTIVE DIGITAL REGISTRY CARD ── */}
        {viewMode === 'registry' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--bg-surface)] border-2 border-[var(--border-subtle)] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#022B3A] via-[#1F7A8C] to-[#20A4F3]" />

            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 mb-8 border-b border-[var(--border-subtle)]">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#022B3A] via-[#1F7A8C] to-[#20A4F3] flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-display font-black text-2xl text-[var(--text-heading)] tracking-tight">
                    DigiHust
                  </h1>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--brand-teal)]">
                    Verified Digital Credential
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="self-start sm:self-auto">
                {isValid ? (
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-wider uppercase shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>VALID CREDENTIAL</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black tracking-wider uppercase shadow-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>REVOKED CREDENTIAL</span>
                  </div>
                )}
              </div>
            </div>

            {/* Certificate Details */}
            <div className="space-y-6">
              <div className="text-center py-4">
                <p className="text-xs uppercase font-extrabold tracking-widest text-[var(--text-muted)] mb-2">
                  This Official Record Certifies That
                </p>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-heading)] mb-2">
                  {certificate.memberName}
                </h2>
                <p className="text-sm font-mono text-[var(--brand-teal)] font-bold">
                  Member ID: {certificate.memberDghId}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-0.5">
                      Designation / Role Title
                    </span>
                    <span className="font-bold text-sm text-[var(--text-heading)]">{certificate.roleTitle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-0.5">
                      Duration / Engagement Period
                    </span>
                    <span className="font-bold text-sm text-[var(--text-heading)]">
                      {certificate.durationText || `${certificate.startDate} ${certificate.endDate ? `to ${certificate.endDate}` : '(Current)'}`}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-1">
                    Squad Assignment / Client Reference
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-[var(--brand-teal)]">{certificate.clientName}</span>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-1">
                    Project Scope & Verified Contributions
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed">
                    {certificate.projectDetails}
                  </p>
                </div>
              </div>

              {/* Bottom Verification Footer with Scannable QR */}
              <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                
                <div className="flex items-center space-x-3.5">
                  <div className="p-2 rounded-2xl bg-white border-2 border-[var(--border-subtle)] shadow-sm">
                    <QRCodeSVG
                      value={currentUrl}
                      size={64}
                      level="H"
                      includeMargin={false}
                      fgColor="#022B3A"
                      bgColor="#FFFFFF"
                    />
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono">
                    <span className="block text-[var(--text-heading)] font-bold">DIGITAL AUDIT TOKEN</span>
                    <span className="block truncate max-w-[180px]">{certificate.id}</span>
                    <span className="text-emerald-400 font-bold">✓ Unique Scannable Token Verified</span>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-0.5">
                    Authorized Signatory
                  </span>
                  <span className="font-bold text-[var(--text-heading)] block">{certificate.signatoryName || certificate.issuedBy}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">Issued Date: {certificate.issuedDate}</span>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* Audit Disclaimer */}
        <div className="text-center text-xs text-[var(--text-muted)] space-y-1 print:hidden">
          <p>
            DigiHust Digital Verification Engine · Every generated certificate has a unique cryptographically linked QR token.
          </p>
          <p className="text-[11px] opacity-75">
            For authentication queries, contact <span className="font-mono text-[var(--brand-teal)]">{certificate.contactEmail || 'verify@digihust.com'}</span>
          </p>
        </div>

      </div>
    </div>
  );
};
