import React, { useState } from 'react';
import { 
  FileUp, Sliders, Eye, Download, Check, X, QrCode, 
  Layers, Sparkles, AlertCircle, FileText, Image as ImageIcon 
} from 'lucide-react';
import { CertificateTemplate, PdfTemplateConfig } from '../../types';
import { stampCustomPdfTemplate, downloadPdfFile } from '../../lib/pdfTemplateEngine';

interface PdfTemplateEditorModalProps {
  onClose: () => void;
  onSave: (templateData: Omit<CertificateTemplate, 'id' | 'createdAt'>) => void;
}

export const PdfTemplateEditorModal: React.FC<PdfTemplateEditorModalProps> = ({
  onClose,
  onSave
}) => {
  const [templateName, setTemplateName] = useState('Custom Graphic Certificate');
  const [docTitle, setDocTitle] = useState('Certificate of Achievement');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [uploadedPdfBase64, setUploadedPdfBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);

  // Dynamic Coordinates State (percentages 0-100 from left, and 0-100 from bottom in PDF coordinates)
  const [nameX, setNameX] = useState<number>(50);
  const [nameY, setNameY] = useState<number>(55);
  const [nameSize, setNameSize] = useState<number>(24);
  const [nameColor, setNameColor] = useState<string>('#022B3A');
  const [nameAlign, setNameAlign] = useState<'left' | 'center' | 'right'>('center');

  const [idX, setIdX] = useState<number>(50);
  const [idY, setIdY] = useState<number>(50);
  const [idSize, setIdSize] = useState<number>(11);

  const [roleX, setRoleX] = useState<number>(50);
  const [roleY, setRoleY] = useState<number>(44);
  const [roleSize, setRoleSize] = useState<number>(14);

  const [dateX, setDateX] = useState<number>(25);
  const [dateY, setDateY] = useState<number>(18);

  const [qrX, setQrX] = useState<number>(50);
  const [qrY, setQrY] = useState<number>(16);
  const [qrSize, setQrSize] = useState<number>(65);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedPdfBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleTestDownload = async () => {
    if (!uploadedPdfBase64) {
      alert('Please upload a PDF graphic template first.');
      return;
    }

    setIsGeneratingTest(true);
    try {
      const dummyCert = {
        id: 'test-qr-audit-token-2026',
        memberId: 'usr-demo-1',
        memberName: 'Muhammad Ammar',
        memberDghId: 'DGH2600105',
        type: 'custom',
        roleTitle: 'Lead Full-Stack Developer',
        startDate: '2026-01-10',
        issuedDate: new Date().toISOString().split('T')[0],
        status: 'valid' as const,
        clientName: 'DigiHust Enterprise Squad',
        projectDetails: 'Executed production cloud systems with sub-second performance.',
        issuedBy: 'Mahad Abbas, Founder & CEO'
      };

      const pdfConfig: PdfTemplateConfig = {
        orientation,
        backgroundPdfBase64: uploadedPdfBase64,
        positions: {
          recipientName: { x: nameX, y: nameY, fontSize: nameSize, color: nameColor, align: nameAlign },
          memberId: { x: idX, y: idY, fontSize: idSize, color: '#1F7A8C', align: nameAlign },
          roleTitle: { x: roleX, y: roleY, fontSize: roleSize, color: '#334155', align: nameAlign },
          issueDate: { x: dateX, y: dateY, fontSize: 10, color: '#022B3A', align: 'center' },
          qrCode: { x: qrX, y: qrY, size: qrSize }
        }
      };

      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://digihust.com';
      const stampedPdf = await stampCustomPdfTemplate(
        uploadedPdfBase64,
        dummyCert,
        `${origin}/verify/${dummyCert.id}`,
        pdfConfig
      );

      downloadPdfFile(stampedPdf, `Test_${templateName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to stamp PDF template. Ensure the uploaded file is a valid PDF.');
    } finally {
      setIsGeneratingTest(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedPdfBase64) {
      alert('Please upload a PDF template file.');
      return;
    }

    const pdfConfig: PdfTemplateConfig = {
      orientation,
      backgroundPdfBase64: uploadedPdfBase64,
      positions: {
        recipientName: { x: nameX, y: nameY, fontSize: nameSize, color: nameColor, align: nameAlign },
        memberId: { x: idX, y: idY, fontSize: idSize, color: '#1F7A8C', align: nameAlign },
        roleTitle: { x: roleX, y: roleY, fontSize: roleSize, color: '#334155', align: nameAlign },
        issueDate: { x: dateX, y: dateY, fontSize: 10, color: '#022B3A', align: 'center' },
        qrCode: { x: qrX, y: qrY, size: qrSize }
      }
    };

    onSave({
      name: templateName,
      type: 'custom',
      documentTitle: docTitle,
      introParagraph: 'This certifies that {{memberName}} (ID: {{memberDghId}}) has completed their milestones as {{roleTitle}}.',
      signatoryName: 'Mahad Abbas',
      signatoryTitle: 'Founder & CEO',
      watermarkText: 'DigiHust',
      pdfConfig
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center space-x-2.5">
            <FileUp className="w-5 h-5 text-[var(--brand-teal)]" />
            <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">
              Upload Graphic PDF Certificate Template
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-heading)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* File Upload Box */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--brand-teal)] bg-[var(--bg-page)] text-center transition-colors">
            <input
              type="file"
              accept=".pdf"
              id="pdfTemplateInput"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="pdfTemplateInput" className="cursor-pointer block space-y-2">
              <FileUp className="w-8 h-8 text-[var(--brand-teal)] mx-auto" />
              <p className="font-bold text-sm text-[var(--text-heading)]">
                {fileName ? `Selected: ${fileName}` : 'Click to Upload Your Designed PDF Template'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Upload your graphic certificate created in Canva, Illustrator, or Figma (.pdf format).
              </p>
            </label>
          </div>

          {/* Template Info & Orientation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Template Name</label>
              <input
                type="text"
                required
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Document Header Title</label>
              <input
                type="text"
                required
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Page Orientation</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
              >
                <option value="portrait">Portrait (Vertical)</option>
                <option value="landscape">Landscape (Horizontal)</option>
              </select>
            </div>
          </div>

          {/* Visual Placement Sliders */}
          <div className="p-5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-heading)] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                <span>Placeholder Position Coordinates (% from bottom-left)</span>
              </h4>
              <span className="text-[10px] text-[var(--text-muted)]">PDF Coordinate Space</span>
            </div>

            {/* Recipient Name Coordinates */}
            <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex justify-between text-xs font-bold text-[var(--text-heading)]">
                <span>Member Name Position</span>
                <span className="text-[var(--brand-teal)]">X: {nameX}% · Y: {nameY}% · Size: {nameSize}pt</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-[var(--text-muted)]">Horizontal X (0-100%)</label>
                  <input type="range" min="5" max="95" value={nameX} onChange={(e) => setNameX(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)]">Vertical Y (0-100%)</label>
                  <input type="range" min="10" max="90" value={nameY} onChange={(e) => setNameY(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)]">Font Size ({nameSize}pt)</label>
                  <input type="range" min="14" max="42" value={nameSize} onChange={(e) => setNameSize(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)]">Alignment</label>
                  <select value={nameAlign} onChange={(e) => setNameAlign(e.target.value as any)} className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-1 text-xs">
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Unique QR Code Coordinates */}
            <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex justify-between text-xs font-bold text-[var(--text-heading)]">
                <span className="flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                  <span>Unique QR Code Position & Size</span>
                </span>
                <span className="text-[var(--brand-teal)]">X: {qrX}% · Y: {qrY}% · Size: {qrSize}pt</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-[var(--text-muted)]">QR Horizontal X (0-100%)</label>
                  <input type="range" min="5" max="95" value={qrX} onChange={(e) => setQrX(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)]">QR Vertical Y (0-100%)</label>
                  <input type="range" min="5" max="90" value={qrY} onChange={(e) => setQrY(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)]">QR Size ({qrSize}pt)</label>
                  <input type="range" min="40" max="120" value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))} className="w-full" />
                </div>
              </div>
            </div>

            {/* Role & Date Coordinates */}
            <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[var(--text-heading)] mb-1">
                    <span>Role Title Y-Axis</span>
                    <span className="text-[var(--brand-teal)]">{roleY}%</span>
                  </div>
                  <input type="range" min="10" max="80" value={roleY} onChange={(e) => setRoleY(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-[var(--text-heading)] mb-1">
                    <span>Date X / Y Axis</span>
                    <span className="text-[var(--brand-teal)]">X: {dateX}% · Y: {dateY}%</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="range" min="5" max="90" value={dateX} onChange={(e) => setDateX(Number(e.target.value))} className="w-full" />
                    <input type="range" min="5" max="90" value={dateY} onChange={(e) => setDateY(Number(e.target.value))} className="w-full" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Modal Action Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              disabled={!uploadedPdfBase64 || isGeneratingTest}
              onClick={handleTestDownload}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-[var(--brand-teal)] text-[var(--brand-teal)] hover:bg-[var(--brand-teal-subtle)] text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingTest ? 'Generating Test...' : 'Test Download Sample PDF'}</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!uploadedPdfBase64}
                className="px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all disabled:opacity-40 cursor-pointer"
              >
                Save Graphic PDF Template
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
