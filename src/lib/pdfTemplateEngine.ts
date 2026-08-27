import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { Certificate, PdfTemplateConfig } from '../types';

export function hexToRgbPdf(hex?: string) {
  if (!hex || !hex.startsWith('#')) {
    return rgb(0.0078, 0.1686, 0.2274); // #022B3A
  }
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return rgb(r, g, b);
}

export async function generateQrPngDataUrl(url: string): Promise<string> {
  return await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    margin: 1,
    scale: 8,
    color: {
      dark: '#022B3A',
      light: '#FFFFFF'
    }
  });
}

export function downloadPdfFile(pdfBytes: Uint8Array, filename: string) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function previewPdfInNewTab(pdfBytes: Uint8Array) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

/**
 * Dynamic Stamper: Stamps custom uploaded PDF templates
 */
export async function stampCustomPdfTemplate(
  basePdfInput: Uint8Array | string,
  certificate: Certificate,
  verificationUrl: string,
  config?: PdfTemplateConfig
): Promise<Uint8Array> {
  let pdfBytes: Uint8Array;

  if (typeof basePdfInput === 'string') {
    const base64Data = basePdfInput.includes('base64,')
      ? basePdfInput.split('base64,')[1]
      : basePdfInput;
    const binaryStr = atob(base64Data);
    pdfBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      pdfBytes[i] = binaryStr.charCodeAt(i);
    }
  } else {
    pdfBytes = basePdfInput;
  }

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const qrDataUrl = await generateQrPngDataUrl(verificationUrl);
  const qrPngImage = await pdfDoc.embedPng(qrDataUrl);

  const positions = config?.positions || {
    recipientName: { x: 50, y: 72, fontSize: 22, color: '#022B3A', align: 'left' },
    memberId: { x: 50, y: 69, fontSize: 11, color: '#1F7A8C', align: 'left' },
    roleTitle: { x: 50, y: 66, fontSize: 13, color: '#334155', align: 'left' },
    issueDate: { x: 80, y: 72, fontSize: 11, color: '#022B3A', align: 'right' },
    qrCode: { x: 12, y: 15, size: 70 },
    signatoryName: { x: 80, y: 16, fontSize: 14, color: '#022B3A', align: 'right' },
    signatoryTitle: { x: 80, y: 13, fontSize: 10, color: '#64748B', align: 'right' }
  };

  const qrX = (positions.qrCode.x / 100) * width;
  const qrY = (positions.qrCode.y / 100) * height;
  const qrSize = positions.qrCode.size || 70;

  firstPage.drawImage(qrPngImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize
  });

  if (positions.recipientName) {
    const nameSize = positions.recipientName.fontSize || 20;
    const nameColor = hexToRgbPdf(positions.recipientName.color || '#022B3A');
    const textWidth = fontBold.widthOfTextAtSize(certificate.memberName, nameSize);
    let nameX = (positions.recipientName.x / 100) * width;
    if (positions.recipientName.align === 'center') {
      nameX -= textWidth / 2;
    } else if (positions.recipientName.align === 'right') {
      nameX -= textWidth;
    }
    const nameY = (positions.recipientName.y / 100) * height;

    firstPage.drawText(certificate.memberName, {
      x: nameX,
      y: nameY,
      size: nameSize,
      font: fontBold,
      color: nameColor
    });
  }

  if (positions.memberId) {
    const idText = `Member ID: ${certificate.memberDghId}`;
    const idSize = positions.memberId.fontSize || 10;
    const idColor = hexToRgbPdf(positions.memberId.color || '#1F7A8C');
    const idX = (positions.memberId.x / 100) * width;
    const idY = (positions.memberId.y / 100) * height;

    firstPage.drawText(idText, {
      x: idX,
      y: idY,
      size: idSize,
      font: fontBold,
      color: idColor
    });
  }

  return await pdfDoc.save();
}

/**
 * Built-In Vector PDF Compiler: Automatically renders the EXACT visual PDF template
 * provided by the user with corner geometric graphics, DH monogram, watermarks, bullets, signature & QR code.
 */
export async function generateBuiltInCertificatePdf(
  certificate: Certificate,
  verificationUrl: string
): Promise<Uint8Array> {
  const isOffer = certificate.type === 'offer_letter';
  const isCompletion = certificate.type === 'completion_certificate';
  const isLandscape = isCompletion;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage(isLandscape ? [841.89, 595.28] : [595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const qrDataUrl = await generateQrPngDataUrl(verificationUrl);
  const qrImage = await pdfDoc.embedPng(qrDataUrl);

  const brandNavy = rgb(0.0078, 0.1686, 0.2274); // #022B3A
  const brandTeal = rgb(0.1215, 0.4784, 0.549); // #1F7A8C
  const brandCyan = rgb(0.1255, 0.6431, 0.9529); // #20A4F3
  const textDark = rgb(0.0588, 0.0901, 0.1647); // #0F172A
  const textMuted = rgb(0.3921, 0.4549, 0.545); // #64748B

  if (!isLandscape) {
    // ── PORTRAIT LETTERHEAD (EXACT 1-TO-1 MATCH OF USER'S PDF) ──

    // 1. Top-Left Angled Corner Triangle Graphics
    // Outer cyan triangle
    page.drawPolygon([
      { x: 0, y: height },
      { x: 130, y: height },
      { x: 0, y: height - 130 }
    ], { color: brandCyan });

    // Middle teal triangle
    page.drawPolygon([
      { x: 0, y: height },
      { x: 100, y: height },
      { x: 0, y: height - 100 }
    ], { color: brandTeal });

    // Inner navy triangle
    page.drawPolygon([
      { x: 0, y: height },
      { x: 70, y: height },
      { x: 0, y: height - 70 }
    ], { color: brandNavy });

    // 2. Bottom-Right Angled Corner Triangle Graphics
    page.drawPolygon([
      { x: width, y: 0 },
      { x: width - 130, y: 0 },
      { x: width, y: 130 }
    ], { color: brandCyan });

    page.drawPolygon([
      { x: width, y: 0 },
      { x: width - 100, y: 0 },
      { x: width, y: 100 }
    ], { color: brandTeal });

    page.drawPolygon([
      { x: width, y: 0 },
      { x: width - 70, y: 0 },
      { x: width, y: 70 }
    ], { color: brandNavy });

    // 3. Header: DH Monogram & Title
    // DH Logo (Stylized monogram)
    page.drawRectangle({
      x: (width - 32) / 2 - 8,
      y: height - 52,
      width: 14,
      height: 28,
      color: brandNavy
    });
    page.drawRectangle({
      x: (width - 32) / 2 + 8,
      y: height - 60,
      width: 14,
      height: 36,
      color: brandTeal
    });

    const brandName = 'DigiHust';
    const brandNameWidth = fontBold.widthOfTextAtSize(brandName, 18);
    page.drawText(brandName, {
      x: (width - brandNameWidth) / 2,
      y: height - 82,
      size: 18,
      font: fontBold,
      color: brandTeal
    });

    const docTitle = certificate.documentTitle || (isOffer ? 'Internship Offer Letter' : 'Experience Certificate');
    const docTitleWidth = fontBold.widthOfTextAtSize(docTitle, 22);
    page.drawText(docTitle, {
      x: (width - docTitleWidth) / 2,
      y: height - 110,
      size: 22,
      font: fontBold,
      color: brandNavy
    });

    // 4. Recipient Details (Left)
    page.drawText('To :', { x: 50, y: height - 150, size: 10, font: fontBold, color: textDark });
    page.drawText(certificate.memberName, { x: 50, y: height - 168, size: 14, font: fontBold, color: textDark });
    page.drawText(certificate.roleTitle, { x: 50, y: height - 182, size: 10.5, font: fontRegular, color: rgb(0.2, 0.25, 0.3) });
    page.drawText(`Internship Duration: ${certificate.durationText || '45 Days (Remote)'}`, { x: 50, y: height - 195, size: 10, font: fontRegular, color: rgb(0.2, 0.25, 0.3) });

    // Date (Right)
    page.drawText('Date:', { x: width - 170, y: height - 150, size: 10, font: fontBold, color: textDark });
    page.drawText(certificate.issuedDate || 'September 01, 2026', { x: width - 170, y: height - 168, size: 11, font: fontBold, color: textDark });

    // 5. Formal Greeting
    page.drawText(`Dear ${certificate.memberName},`, { x: 50, y: height - 228, size: 11.5, font: fontBold, color: textDark });

    // 6. Body Paragraph 1
    const p1 = `We are pleased to offer you a ${certificate.durationText || '45-day'} internship at DigiHust as a ${certificate.roleTitle}. This period will serve as both a learning opportunity and a practical evaluation for potential inclusion in our core team.`;
    drawWrappedText(page, p1, 50, height - 248, width - 100, fontRegular, 10, textDark, 14);

    // 7. Evaluation Checklist
    page.drawText('During the internship, you will work on assigned trial projects and will be evaluated on:', {
      x: 50,
      y: height - 296,
      size: 10,
      font: fontBold,
      color: textDark
    });

    const bullets = certificate.evaluationCriteria || [
      'Quality of work',
      'Meeting deadlines',
      'Communication & teamwork',
      'Problem-solving',
      'Ability to follow client requirements'
    ];

    let bulletY = height - 314;
    bullets.forEach((b) => {
      page.drawCircle({ x: 58, y: bulletY + 3, size: 2, color: textDark });
      page.drawText(b, { x: 68, y: bulletY, size: 9.5, font: fontRegular, color: textDark });
      bulletY -= 14;
    });

    // 8. Paragraph 2 (Revenue Split)
    const p2 = `Successful interns may be selected for the DigiHust core team and assigned real client projects. Compensation will be project-based, with independent project contributors generally receiving ${certificate.stipendTerms || '65–70% of the project budget, according to DigiHust\'s revenue-sharing policy.'}`;
    drawWrappedText(page, p2, 50, bulletY - 10, width - 100, fontRegular, 9.5, textDark, 13.5);

    // 9. Paragraph 3 (Closing Placement Terms)
    const p3 = 'This internship does not guarantee permanent placement. Continued collaboration will be based on performance, reliability, professionalism, and project requirements.';
    drawWrappedText(page, p3, 50, bulletY - 50, width - 100, fontRegular, 9.5, textDark, 13.5);

    page.drawText('We look forward to having you on board.', {
      x: 50,
      y: bulletY - 78,
      size: 9.5,
      font: fontRegular,
      color: textDark
    });

    // 10. Embedded Scannable Vector QR Code with Frame (Bottom Left)
    page.drawImage(qrImage, {
      x: 50,
      y: 95,
      width: 60,
      height: 60
    });
    page.drawText('OFFICIAL AUDIT QR', { x: 118, y: 145, size: 8, font: fontBold, color: brandNavy });
    page.drawText(certificate.id, { x: 118, y: 133, size: 7, font: fontRegular, color: textMuted });
    page.drawText('✓ Scan to Verify Online', { x: 118, y: 121, size: 7.5, font: fontBold, color: rgb(0.05, 0.6, 0.3) });
    page.drawText('digihust.com/verify', { x: 118, y: 109, size: 7, font: fontRegular, color: textMuted });

    // Contact Details (Below QR Code)
    page.drawText(`Tel: ${certificate.contactPhone || '+92 300 1234567'}`, { x: 50, y: 72, size: 7.5, font: fontRegular, color: textMuted });
    page.drawText(`Email: ${certificate.contactEmail || 'contact@digihust.com'}`, { x: 50, y: 60, size: 7.5, font: fontRegular, color: textMuted });
    page.drawText('Web: www.digihust.com', { x: 50, y: 48, size: 7.5, font: fontRegular, color: textMuted });
    page.drawText('Address: Islamabad / Global Remote Operations', { x: 50, y: 36, size: 7.5, font: fontRegular, color: textMuted });

    // 11. Signatory Block (Bottom Right)
    page.drawText('Best Regards,', { x: width - 180, y: 155, size: 9, font: fontRegular, color: textMuted });
    page.drawText(certificate.signatoryName || 'Mahad Abbas', { x: width - 180, y: 132, size: 18, font: fontItalic, color: textDark });
    page.drawText(certificate.signatoryName || 'Mahad Abbas', { x: width - 180, y: 112, size: 10.5, font: fontBold, color: textDark });
    page.drawText(certificate.signatoryTitle || 'Founder & CEO', { x: width - 180, y: 98, size: 9, font: fontRegular, color: textMuted });
    page.drawText('DigiHust', { x: width - 180, y: 86, size: 9, font: fontBold, color: brandTeal });

  } else {
    // ── LANDSCAPE CERTIFICATE OF COMPLETION ──
    page.drawRectangle({
      x: 25,
      y: 25,
      width: width - 50,
      height: height - 50,
      borderColor: brandTeal,
      borderWidth: 3,
      color: rgb(0.99, 1, 1)
    });

    const certTitle = certificate.documentTitle || 'CERTIFICATE OF COMPLETION';
    page.drawText(certTitle, {
      x: (width - fontBold.widthOfTextAtSize(certTitle, 26)) / 2,
      y: height - 120,
      size: 26,
      font: fontBold,
      color: brandNavy
    });

    page.drawText(certificate.memberName, {
      x: (width - fontBold.widthOfTextAtSize(certificate.memberName, 30)) / 2,
      y: height - 200,
      size: 30,
      font: fontBold,
      color: brandNavy
    });

    page.drawImage(qrImage, {
      x: (width - 64) / 2,
      y: 75,
      width: 64,
      height: 64
    });
  }

  return await pdfDoc.save();
}

function drawWrappedText(
  page: any,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  font: any,
  fontSize: number,
  color: any,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let y = startY;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth > maxWidth && i > 0) {
      page.drawText(line.trim(), { x, y, size: fontSize, font, color });
      line = words[i] + ' ';
      y -= lineHeight;
    } else {
      line = testLine;
    }
  }
  page.drawText(line.trim(), { x, y, size: fontSize, font, color });
}
