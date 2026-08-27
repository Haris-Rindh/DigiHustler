import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
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
        ? '45 Days Track' 
        : '8 Months (Full Retainer)'
  );

  const signatoryName = certificate.signatoryName || 'Mahad Abbas';
  const signatoryTitle = certificate.signatoryTitle || 'Founder & CEO';

  // Format date to e.g. "September 01, 2026"
  const formattedDate = (() => {
    try {
      const d = new Date(certificate.issuedDate);
      return d.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
    } catch {
      return certificate.issuedDate || 'September 01, 2026';
    }
  })();

  const evaluationList = certificate.evaluationCriteria || [
    'Quality of work',
    'Meeting deadlines',
    'Communication & teamwork',
    'Problem-solving',
    'Ability to follow client requirements'
  ];

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white text-slate-800 shadow-2xl rounded-none overflow-hidden print:shadow-none print:max-w-none print:w-full border border-slate-200 print:border-none relative font-sans min-h-[1100px] flex flex-col justify-between p-0">
      
      {/* ── TOP-LEFT ANGLED CORNER GEOMETRY (MATCHING PDF) ── */}
      <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none z-0 overflow-hidden">
        {/* Layer 1: Light Cyan */}
        <div 
          className="absolute -top-12 -left-12 w-44 h-44 bg-[#20A4F3] rotate-[-25deg] transform origin-bottom-right opacity-90"
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        />
        {/* Layer 2: Deep Teal */}
        <div 
          className="absolute -top-6 -left-6 w-36 h-36 bg-[#1F7A8C] rotate-[-15deg] transform origin-bottom-right"
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        />
        {/* Layer 3: Dark Navy */}
        <div 
          className="absolute top-0 left-0 w-28 h-28 bg-[#022B3A]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        />
      </div>

      {/* ── BOTTOM-RIGHT ANGLED CORNER GEOMETRY (MATCHING PDF) ── */}
      <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none z-0 overflow-hidden">
        {/* Layer 1: Light Cyan Accent */}
        <div 
          className="absolute -bottom-12 -right-12 w-44 h-44 bg-[#20A4F3] rotate-[-25deg] transform origin-top-left opacity-90"
          style={{ clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }}
        />
        {/* Layer 2: Deep Teal */}
        <div 
          className="absolute -bottom-6 -right-6 w-36 h-36 bg-[#1F7A8C] rotate-[-15deg] transform origin-top-left"
          style={{ clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }}
        />
        {/* Layer 3: Dark Navy */}
        <div 
          className="absolute bottom-0 right-0 w-28 h-28 bg-[#022B3A]"
          style={{ clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }}
        />
      </div>

      {/* ── BACKGROUND WATERMARK PATTERN (MATCHING PDF) ── */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none opacity-[0.08] select-none flex flex-wrap gap-16 p-10 justify-around items-center overflow-hidden rotate-[-35deg] scale-125 z-0"
      >
        {Array.from({ length: 42 }).map((_, i) => (
          <span key={i} className="font-display font-black text-2xl tracking-widest text-[#1F7A8C]">
            digiHust
          </span>
        ))}
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="p-10 sm:p-14 md:p-16 relative z-10 flex flex-col justify-between flex-grow">
        
        {/* Header Block: Logo & Title */}
        <div>
          <div className="flex flex-col items-center justify-center text-center pt-2 pb-6">
            
            {/* Geometric DH Monogram Icon */}
            <div className="w-16 h-16 flex items-center justify-center mb-1">
              <svg viewBox="0 0 100 100" className="w-14 h-14 text-[#1F7A8C] fill-current">
                <path d="M18 16 H44 C60 16 72 28 72 44 C72 60 60 72 44 72 H18 Z M32 30 V58 H43 C51 58 58 51 58 44 C58 37 51 30 43 30 Z" fill="#022B3A" />
                <path d="M56 28 H82 V84 H68 V62 H56 V50 H68 V40 H56 Z" fill="#1F7A8C" />
              </svg>
            </div>

            {/* DigiHust Brand Name */}
            <h1 className="font-display font-black text-2xl tracking-tight text-[#1F7A8C]">
              DigiHust
            </h1>

            {/* Document Title */}
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#022B3A] mt-2 tracking-tight">
              {title}
            </h2>
          </div>

          {/* Recipient & Date Grid */}
          <div className="flex justify-between items-start pt-6 pb-4 text-sm">
            {/* Left Recipient */}
            <div>
              <span className="font-bold text-slate-900 block text-xs mb-1">To :</span>
              <p className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">{certificate.memberName}</p>
              <p className="text-slate-700 font-medium text-xs mt-0.5">{certificate.roleTitle}</p>
              <p className="text-slate-600 font-medium text-xs mt-0.5">
                {isOfferLetter ? `Internship Duration: ${duration}` : `Duration: ${duration}`}
              </p>
              <p className="font-mono text-[11px] text-[#1F7A8C] font-semibold mt-1">
                Member ID: {certificate.memberDghId}
              </p>
            </div>

            {/* Right Date */}
            <div className="text-right">
              <span className="font-bold text-slate-900 block text-xs mb-1">Date:</span>
              <p className="font-bold text-xs sm:text-sm text-slate-800">{formattedDate}</p>
            </div>
          </div>

          {/* Formal Body */}
          <div className="mt-6 space-y-4 text-[13px] sm:text-[14px] leading-relaxed text-slate-800">
            
            <p className="font-bold text-slate-900">
              Dear {certificate.memberName},
            </p>

            {/* Paragraph 1 */}
            <p>
              We are pleased to offer you a <strong>{duration}</strong> internship at DigiHust as a{' '}
              <strong className="text-slate-900">{certificate.roleTitle}</strong>. This period will serve as both a learning opportunity and a practical evaluation for potential inclusion in our core team.
            </p>

            {/* Evaluation Criteria Checklist */}
            <div>
              <p className="font-semibold text-slate-900 mb-1.5">
                During the internship, you will work on assigned trial projects and will be evaluated on:
              </p>
              <ul className="space-y-1 pl-5">
                {evaluationList.map((crit, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 flex-shrink-0" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Paragraph 2: Revenue Split */}
            <p>
              Successful interns may be selected for the DigiHust core team and assigned real client projects. Compensation will be project-based, with independent project contributors generally receiving{' '}
              <strong className="text-slate-900">{certificate.stipendTerms || '65–70% of the project budget, according to DigiHust\'s revenue-sharing policy'}</strong>.
            </p>

            {/* Paragraph 3: Terms & Placement */}
            <p>
              This internship does not guarantee permanent placement. Continued collaboration will be based on performance, reliability, professionalism, and project requirements.
            </p>
            
            <p className="font-medium text-slate-900">
              We look forward to having you on board.
            </p>
          </div>
        </div>

        {/* ── FOOTER & SIGNATORY SECTION (MATCHING PDF) ── */}
        <div className="mt-10 pt-6">
          <div className="flex flex-row justify-between items-end gap-4">
            
            {/* Left Column: Contact Pill Icons + Unique Scannable QR Code */}
            <div className="space-y-3">
              {/* Unique Vector QR Code with Digital Audit Token */}
              <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50 border border-slate-200/80 shadow-sm w-fit">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                  <QRCodeSVG
                    value={fullVerificationUrl}
                    size={64}
                    level="H"
                    includeMargin={false}
                    fgColor="#022B3A"
                    bgColor="#FFFFFF"
                  />
                </div>
                <div className="text-[10px] font-mono leading-tight">
                  <span className="font-bold text-[#022B3A] block">DIGITAL AUDIT QR</span>
                  <span className="text-slate-500 block truncate max-w-[130px]">{certificate.id}</span>
                  <span className="text-emerald-600 font-bold block mt-0.5">✓ Scan to Verify Online</span>
                </div>
              </div>

              {/* Contact Info Pills */}
              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-[#1F7A8C] text-white flex items-center justify-center flex-shrink-0">
                    <Phone className="w-3 h-3" />
                  </div>
                  <span>{certificate.contactPhone || '+92 300 1234567'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-[#1F7A8C] text-white flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3 h-3" />
                  </div>
                  <span>{certificate.contactEmail || 'contact@digihust.com'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-[#1F7A8C] text-white flex items-center justify-center flex-shrink-0">
                    <Globe className="w-3 h-3" />
                  </div>
                  <span>www.digihust.com</span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-[#1F7A8C] text-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <span>{certificate.contactAddress || 'Islamabad / Global Remote Operations'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Signatory Signature Block */}
            <div className="text-right pb-2">
              <span className="text-xs text-slate-600 block mb-1">Best Regards,</span>
              
              {/* Cursive Signature Script */}
              <div className="font-serif italic font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-wider my-0.5 font-['Caveat',_cursive,_serif]">
                {signatoryName}
              </div>

              <p className="font-bold text-sm text-slate-900">{signatoryName}</p>
              <p className="text-xs text-slate-600 font-medium">{signatoryTitle}</p>
              <p className="text-xs font-bold text-[#1F7A8C]">DigiHust</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
