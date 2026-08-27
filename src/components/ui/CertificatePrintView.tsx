import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, Phone, Mail, Globe, MapPin, CheckCircle2, Award } from 'lucide-react';
import { Certificate } from '../../types';

interface CertificatePrintViewProps {
  certificate: Certificate;
  verificationUrl?: string;
}

export const CertificatePrintView: React.FC<CertificatePrintViewProps> = ({
  certificate,
  verificationUrl
}) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://digihust.com';
  const fullVerificationUrl = verificationUrl || `${origin}/verify/${certificate.id}`;

  const isOfferLetter = certificate.type === 'offer_letter';
  const isCompletion = certificate.type === 'completion_certificate';
  const isExperience = certificate.type === 'experience_certificate';

  const title = certificate.documentTitle || (
    isOfferLetter 
      ? 'Internship Offer Letter' 
      : isCompletion 
        ? 'Certificate of Completion' 
        : 'Experience Certificate'
  );

  const duration = certificate.durationText || (
    isOfferLetter 
      ? '45 Days (Remote)' 
      : isCompletion 
        ? '45 Days Internship Track' 
        : '8 Months (Full Retainer)'
  );

  const signatoryName = certificate.signatoryName || 'Mahad Abbas';
  const signatoryTitle = certificate.signatoryTitle || 'Founder & CEO';
  const watermark = certificate.watermarkText || 'DigiHust';

  // Format date to e.g. "September 01, 2026"
  const formattedDate = (() => {
    try {
      const d = new Date(certificate.issuedDate);
      return d.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
    } catch {
      return certificate.issuedDate;
    }
  })();

  // Dynamic Placeholder Interpolation Helper
  const interpolate = (text: string) => {
    return text
      .replace(/{{memberName}}/g, certificate.memberName)
      .replace(/{{memberId}}/g, certificate.memberDghId)
      .replace(/{{roleTitle}}/g, certificate.roleTitle)
      .replace(/{{duration}}/g, duration)
      .replace(/{{startDate}}/g, certificate.startDate)
      .replace(/{{endDate}}/g, certificate.endDate || 'Present')
      .replace(/{{clientName}}/g, certificate.clientName);
  };

  const evaluationList = certificate.evaluationCriteria || [
    'Quality of work',
    'Meeting deadlines',
    'Communication & teamwork',
    'Problem-solving',
    'Ability to follow client requirements'
  ];

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white text-slate-800 shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none print:max-w-none print:w-full border border-slate-200 print:border-none relative">
      
      {/* Background Watermark Pattern */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none opacity-[0.035] select-none flex flex-wrap gap-12 p-8 justify-around items-center overflow-hidden rotate-[-25deg] scale-125 z-0"
      >
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} className="font-display font-black text-2xl tracking-widest text-[#1F7A8C]">
            {watermark}
          </span>
        ))}
      </div>

      {/* Decorative Top Accent Geometry */}
      <div className="relative z-10">
        <div className="h-3 bg-gradient-to-r from-[#022B3A] via-[#1F7A8C] to-[#20A4F3]" />
      </div>

      <div className="p-8 sm:p-14 md:p-16 relative z-10 flex flex-col justify-between min-h-[1050px] font-sans">
        
        {/* Header: DigiHust Logo & Document Title */}
        <div>
          <div className="flex flex-col items-center justify-center text-center pb-6 border-b border-slate-100">
            {/* Geometric DH Logo */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#022B3A] via-[#1F7A8C] to-[#20A4F3] flex items-center justify-center shadow-md mb-2.5">
              <svg viewBox="0 0 100 100" className="w-10 h-10 text-white fill-current">
                <path d="M20 20 H42 C56 20 66 30 66 44 C66 58 56 68 42 68 H20 Z M32 30 V58 H41 C49 58 55 52 55 44 C55 36 49 30 41 30 Z" />
                <path d="M58 32 H80 V80 H68 V60 H58 V50 H68 V42 H58 Z" />
              </svg>
            </div>
            <h1 className="font-display font-black text-3xl tracking-tight text-[#022B3A]">
              DigiHust
            </h1>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-3 tracking-tight">
              {title}
            </h2>
          </div>

          {/* Meta Info Grid: To & Date */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mt-8 pb-6 border-b border-slate-100 text-sm">
            <div>
              <span className="font-bold text-slate-500 block text-xs uppercase tracking-wider mb-1">To:</span>
              <p className="font-extrabold text-lg text-slate-900 leading-snug">{certificate.memberName}</p>
              <p className="text-slate-700 font-medium text-xs mt-0.5">{certificate.roleTitle}</p>
              <p className="text-slate-500 font-medium text-xs mt-0.5">
                {isOfferLetter ? `Internship Duration: ${duration}` : isCompletion ? `Duration: ${duration}` : `Engagement Duration: ${duration}`}
              </p>
              <p className="font-mono text-xs text-[#1F7A8C] font-semibold mt-1">
                Member ID: {certificate.memberDghId}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="font-bold text-slate-500 block text-xs uppercase tracking-wider mb-1">Date:</span>
              <p className="font-extrabold text-sm text-slate-900">{formattedDate}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black uppercase tracking-wider">
                Official Verified
              </span>
            </div>
          </div>

          {/* Letter Body */}
          <div className="mt-8 space-y-4 text-[13.5px] sm:text-[14.5px] leading-relaxed text-slate-700">
            <p className="font-bold text-slate-900 text-base">
              Dear {certificate.memberName},
            </p>

            {/* Custom Intro or Default Templates */}
            {certificate.introParagraph ? (
              <p>{interpolate(certificate.introParagraph)}</p>
            ) : isOfferLetter ? (
              <p>
                We are pleased to offer you a <strong>{duration}</strong> internship at DigiHust as a{' '}
                <strong className="text-slate-900">{certificate.roleTitle}</strong>. This period will serve as both a structured learning opportunity and a practical evaluation for potential inclusion in our core managed squads.
              </p>
            ) : isCompletion ? (
              <p>
                This is to certify that <strong>{certificate.memberName}</strong> (Member ID: <span className="font-mono font-semibold">{certificate.memberDghId}</span>) has successfully completed their tenure and trial milestones as a{' '}
                <strong className="text-slate-900">{certificate.roleTitle}</strong> with DigiHust.
              </p>
            ) : (
              <p>
                This official experience letter certifies that <strong>{certificate.memberName}</strong> (<span className="font-mono font-semibold">{certificate.memberDghId}</span>) has successfully completed their tenure at DigiHust as a{' '}
                <strong className="text-slate-900">{certificate.roleTitle}</strong> from <strong>{certificate.startDate}</strong> {certificate.endDate ? `to ${certificate.endDate}` : 'to Present'}.
              </p>
            )}

            {/* Evaluation Checklist / Milestones */}
            {evaluationList && evaluationList.length > 0 && (
              <>
                <p className="font-semibold text-slate-800 pt-1">
                  {isOfferLetter 
                    ? 'During the internship, you will work on assigned trial projects and will be evaluated on:' 
                    : isCompletion 
                      ? 'Key performance achievements and milestones demonstrated:' 
                      : 'Core areas of technical contribution and execution:'}
                </p>

                <ul className="space-y-1.5 pl-4">
                  {evaluationList.map((crit) => (
                    <li key={crit} className="flex items-center space-x-2 text-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A8C] flex-shrink-0" />
                      <span>{interpolate(crit)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Scope / Revenue Clause */}
            {isOfferLetter && (
              <p className="pt-2">
                Successful interns may be selected for the DigiHust core team and assigned real client projects. Compensation will be project-based, with independent project contributors generally receiving{' '}
                <strong className="text-slate-900">{certificate.stipendTerms || '65–70% of the project budget, according to DigiHust\'s revenue-sharing policy'}</strong>.
              </p>
            )}

            {isExperience && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 my-3">
                <p className="font-bold text-slate-900">Verified Client Account & Project Scope:</p>
                <p className="text-slate-700">{certificate.clientName} — {certificate.projectDetails}</p>
              </div>
            )}

            {/* Closing Paragraph */}
            {certificate.closingParagraph ? (
              <p>{interpolate(certificate.closingParagraph)}</p>
            ) : isOfferLetter ? (
              <p>
                This internship does not guarantee permanent placement. Continued collaboration will be based on performance, reliability, professionalism, and project requirements. We look forward to having you on board.
              </p>
            ) : isCompletion ? (
              <p>
                We commend their dedication, technical mastery, and professional ethics, and wish them continuous success in their career journey.
              </p>
            ) : (
              <p>
                We commend their contributions to the DigiHust delivery ecosystem and recommend them with confidence for future enterprise opportunities.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Section: Signatory Block + Embedded Unique QR Code + Official Contact Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-8">
            
            {/* Unique Scannable Vector QR Code with Audit Frame */}
            <div className="flex items-center space-x-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm">
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                <QRCodeSVG
                  value={fullVerificationUrl}
                  size={76}
                  level="H"
                  includeMargin={false}
                  fgColor="#022B3A"
                  bgColor="#FFFFFF"
                />
              </div>
              <div className="text-[11px] font-mono leading-tight">
                <span className="font-bold text-[#022B3A] block text-xs">DIGITAL AUDIT QR</span>
                <span className="text-slate-500 block truncate max-w-[150px]">{certificate.id}</span>
                <span className="text-emerald-600 font-bold block mt-1">✓ Scan to Verify Online</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">digihust.com/verify</span>
              </div>
            </div>

            {/* Signatory Signature Block */}
            <div className="text-right">
              <span className="text-xs text-slate-500 block mb-1">Best Regards,</span>
              
              {/* Script Cursive Signature */}
              <div className="font-serif italic font-extrabold text-2xl sm:text-3xl text-[#022B3A] tracking-wider my-1 font-['Caveat',_cursive,_serif]">
                {signatoryName}
              </div>

              <p className="font-bold text-sm text-slate-900">{signatoryName}</p>
              <p className="text-xs text-slate-600 font-medium">{signatoryTitle}</p>
              <p className="text-xs font-bold text-[#1F7A8C]">DigiHust Management</p>
            </div>

          </div>

          {/* Official Agency Contact Footer */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-slate-500">
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-[#1F7A8C] flex-shrink-0" />
              <span>{certificate.contactPhone || '+92 300 1234567'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-[#1F7A8C] flex-shrink-0" />
              <span>{certificate.contactEmail || 'contact@digihust.com'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 text-[#1F7A8C] flex-shrink-0" />
              <span>www.digihust.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-[#1F7A8C] flex-shrink-0" />
              <span className="truncate">{certificate.contactAddress || 'Islamabad / Global Remote'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
