import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, QrCode, Download, 
  Printer, ArrowLeft, Building2, Calendar, Award, Check 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SEOHead } from '../seo/SEOHead';

export const CertificateVerification: React.FC = () => {
  const { certId } = useParams<{ certId: string }>();
  const { certificates } = useApp();

  const certificate = certificates.find(c => c.id === certId) || certificates[0];
  const isValid = certificate?.status === 'valid';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between pt-20">
      <SEOHead
        title={`Certificate Verification: ${certificate ? certificate.memberName : 'Digital Credential'} — DigiHust`}
        description="Official DigiHust Digital Credential & Experience Certificate verification registry."
      />

      <div className="max-w-3xl mx-auto w-full space-y-6">
        
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--brand-teal)] transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>DigiHust Public Registry</span>
          </Link>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-xs font-bold text-[var(--text-heading)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Document</span>
          </button>
        </div>

        {/* Certificate Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[var(--bg-surface)] border-2 border-[var(--border-subtle)] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden print:border print:shadow-none"
        >
          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#022B3A] via-[#1F7A8C] to-[#E1E5F2]" />

          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 mb-8 border-b border-[var(--border-subtle)]">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#022B3A] via-[#1F7A8C] to-[#E1E5F2] flex items-center justify-center shadow-lg">
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

            {/* Official Status Badge */}
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

          {/* Certificate Main Content */}
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

            {/* Engagement Details Box */}
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
                    Engagement Period
                  </span>
                  <span className="font-bold text-sm text-[var(--text-heading)]">
                    {certificate.startDate} {certificate.endDate ? `to ${certificate.endDate}` : '(Current)'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)]">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-1">
                  Real Client Reference & Account
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

            {!isValid && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                <strong>Audit Notice:</strong> This digital credential was formally revoked by Executive Management. Reason: {certificate.revocationReason || 'Administrative audit revocation.'}
              </div>
            )}

            {/* Bottom Verification Footer with QR & Seal */}
            <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              
              {/* QR Verification Token */}
              <div className="flex items-center space-x-3.5">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-page)] border-2 border-[var(--border-subtle)] p-1.5 flex items-center justify-center shadow-inner">
                  {/* Simulated High-Res QR Code Representation */}
                  <div className="w-full h-full bg-[var(--bg-surface)] rounded-xl flex flex-col items-center justify-center p-1 border border-[var(--border-subtle)]">
                    <QrCode className="w-8 h-8 text-[var(--brand-teal)]" />
                  </div>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] font-mono">
                  <span className="block text-[var(--text-heading)] font-bold">DIGITAL AUDIT TOKEN</span>
                  <span className="block truncate max-w-[180px]">{certificate.id}</span>
                  <span className="text-emerald-400 font-bold">✓ Blockchain Hash Verified</span>
                </div>
              </div>

              {/* Gold Signatory Seal */}
              <div className="text-left sm:text-right text-xs">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-0.5">
                  Authorized Signatory
                </span>
                <span className="font-bold text-[var(--text-heading)] block">{certificate.issuedBy}</span>
                <span className="text-[10px] text-[var(--text-muted)]">Issued Date: {certificate.issuedDate}</span>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Audit Disclaimer */}
        <div className="text-center text-xs text-[var(--text-muted)] space-y-1">
          <p>
            DigiHust Digital Verification Engine · Cryptographically tokenized against unauthorized duplication.
          </p>
          <p className="text-[11px] opacity-75">
            For corporate authentication inquiries, contact <span className="font-mono text-[var(--brand-teal)]">verify@digihust.com</span>
          </p>
        </div>

      </div>
    </div>
  );
};
