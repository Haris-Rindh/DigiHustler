import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { Certificate, PdfTemplateConfig } from '../types';

/**
 * Converts Hex string (#022B3A) to pdf-lib rgb(r, g, b) normalized 0-1
 */
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

/**
 * Generates a high-resolution QR code PNG Data URL from a verification URL
 */
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

/**
 * Downloads a generated PDF in the user's browser
 */
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

/**
 * Helper to open PDF in a new browser tab for instant print preview
 */
export function previewPdfInNewTab(pdfBytes: Uint8Array) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

/**
 * Dynamic Stamper: Takes any user-uploaded base PDF (Canva/Figma template)
 * and stamps the member's Name, ID, Role, Date, and Unique Scannable QR Code onto it.
 */
export async function stampCustomPdfTemplate(
  basePdfInput: Uint8Array | string,
  certificate: Certificate,
  verificationUrl: string,
  config?: PdfTemplateConfig
): Promise<Uint8Array> {
  let pdfBytes: Uint8Array;

  if (typeof basePdfInput === 'string') {
    // If it's a data URL e.g. "data:application/pdf;base64,..."
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

  // Embed standard fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  // Generate QR Code PNG
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

  // 1. Draw QR Code
  // In PDF coordinates, (0,0) is bottom-left. Percentage X is from left, Percentage Y is from bottom.
  const qrX = (positions.qrCode.x / 100) * width;
  const qrY = (positions.qrCode.y / 100) * height;
  const qrSize = positions.qrCode.size || 70;

  firstPage.drawImage(qrPngImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize
  });

  // 2. Draw Recipient Name
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

  // 3. Draw Member ID
  if (positions.memberId) {
    const idText = `ID: ${certificate.memberDghId}`;
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

  // 4. Draw Role Title
  if (positions.roleTitle) {
    const roleText = certificate.roleTitle;
    const roleSize = positions.roleTitle.fontSize || 12;
    const roleColor = hexToRgbPdf(positions.roleTitle.color || '#334155');
    const roleX = (positions.roleTitle.x / 100) * width;
    const roleY = (positions.roleTitle.y / 100) * height;

    firstPage.drawText(roleText, {
      x: roleX,
      y: roleY,
      size: roleSize,
      font: fontRegular,
      color: roleColor
    });
  }

  // 5. Draw Issue Date
  if (positions.issueDate) {
    const dateText = certificate.issuedDate;
    const dateSize = positions.issueDate.fontSize || 10;
    const dateColor = hexToRgbPdf(positions.issueDate.color || '#022B3A');
    let dateX = (positions.issueDate.x / 100) * width;
    if (positions.issueDate.align === 'right') {
      dateX -= fontRegular.widthOfTextAtSize(dateText, dateSize);
    }
    const dateY = (positions.issueDate.y / 100) * height;

    firstPage.drawText(dateText, {
      x: dateX,
      y: dateY,
      size: dateSize,
      font: fontRegular,
      color: dateColor
    });
  }

  // 6. Draw Signatory Block
  if (positions.signatoryName) {
    const sigName = certificate.signatoryName || 'Mahad Abbas';
    const sigSize = positions.signatoryName.fontSize || 13;
    const sigColor = hexToRgbPdf(positions.signatoryName.color || '#022B3A');
    let sigX = (positions.signatoryName.x / 100) * width;
    if (positions.signatoryName.align === 'right') {
      sigX -= fontBold.widthOfTextAtSize(sigName, sigSize);
    }
    const sigY = (positions.signatoryName.y / 100) * height;

    firstPage.drawText(sigName, {
      x: sigX,
      y: sigY,
      size: sigSize,
      font: fontBold,
      color: sigColor
    });
  }

  return await pdfDoc.save();
}

/**
 * Built-In Vector PDF Compiler: Creates a standalone, ultra-crisp PDF document
 * matching the user's provided DigiHust Offer Letter & Certificate designs from scratch.
 */
export async function generateBuiltInCertificatePdf(
  certificate: Certificate,
  verificationUrl: string
): Promise<Uint8Array> {
  const isOffer = certificate.type === 'offer_letter';
  const isCompletion = certificate.type === 'completion_certificate';
  const isLandscape = isCompletion;

  const pdfDoc = await PDFDocument.create();
  // A4 dimensions: 595.28 x 841.89 pt (Portrait) or 841.89 x 595.28 pt (Landscape)
  const page = pdfDoc.addPage(isLandscape ? [841.89, 595.28] : [595.28, 841.89]);
  const { width, height } = page.getSize();

  // Standard Fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  // Generate QR Code PNG
  const qrDataUrl = await generateQrPngDataUrl(verificationUrl);
  const qrImage = await pdfDoc.embedPng(qrDataUrl);

  const brandNavy = rgb(0.0078, 0.1686, 0.2274); // #022B3A
  const brandTeal = rgb(0.1215, 0.4784, 0.549); // #1F7A8C
  const textDark = rgb(0.0588, 0.0901, 0.1647); // #0F172A
  const textMuted = rgb(0.3921, 0.4549, 0.545); // #64748B

  if (!isLandscape) {
    // ── PORTRAIT LETTERHEAD LAYOUT (MATCHES USER'S PDF) ──

    // Top Accent Bar
    page.drawRectangle({
      x: 0,
      y: height - 10,
      width,
      height: 10,
      color: brandTeal
    });

    // DigiHust Header Logo & Title
    const brandTitle = 'DigiHust';
    const brandTitleWidth = fontBold.widthOfTextAtSize(brandTitle, 26);
    page.drawText(brandTitle, {
      x: (width - brandTitleWidth) / 2,
      y: height - 60,
      size: 26,
      font: fontBold,
      color: brandNavy
    });

    const docTitle = certificate.documentTitle || (isOffer ? 'Internship Offer Letter' : 'Experience Certificate');
    const docTitleWidth = fontBold.widthOfTextAtSize(docTitle, 20);
    page.drawText(docTitle, {
      x: (width - docTitleWidth) / 2,
      y: height - 90,
      size: 20,
      font: fontBold,
      color: textDark
    });

    // Divider
    page.drawLine({
      start: { x: 50, y: height - 110 },
      end: { x: width - 50, y: height - 110 },
      thickness: 1,
      color: rgb(0.88, 0.91, 0.94)
    });

    // Recipient Info
    page.drawText('To:', { x: 50, y: height - 140, size: 10, font: fontBold, color: textMuted });
    page.drawText(certificate.memberName, { x: 50, y: height - 158, size: 16, font: fontBold, color: textDark });
    page.drawText(certificate.roleTitle, { x: 50, y: height - 174, size: 11, font: fontRegular, color: textMuted });
    page.drawText(certificate.durationText || 'Internship Duration: 45 Days (Remote)', { x: 50, y: height - 188, size: 10, font: fontRegular, color: textMuted });
    page.drawText(`Member ID: ${certificate.memberDghId}`, { x: 50, y: height - 202, size: 9, font: fontBold, color: brandTeal });

    // Date
    const dateLabel = 'Date:';
    const dateVal = certificate.issuedDate;
    page.drawText(dateLabel, { x: width - 180, y: height - 140, size: 10, font: fontBold, color: textMuted });
    page.drawText(dateVal, { x: width - 180, y: height - 158, size: 12, font: fontBold, color: textDark });

    // Greeting
    page.drawText(`Dear ${certificate.memberName},`, { x: 50, y: height - 235, size: 13, font: fontBold, color: textDark });

    // Paragraph 1
    const p1 = `We are pleased to offer you a ${certificate.durationText || '45-day'} engagement at DigiHust as a ${certificate.roleTitle}. This period will serve as both a structured learning opportunity and a practical evaluation for potential inclusion in our core managed squads.`;
    drawWrappedText(page, p1, 50, height - 255, width - 100, fontRegular, 10.5, textDark, 15);

    // Bullet Header
    page.drawText('During the engagement, you will work on assigned trial projects and will be evaluated on:', {
      x: 50,
      y: height - 305,
      size: 10.5,
      font: fontBold,
      color: textDark
    });

    // Bullets
    const bullets = certificate.evaluationCriteria || [
      'Quality of work',
      'Meeting deadlines',
      'Communication & teamwork',
      'Problem-solving',
      'Ability to follow client requirements'
    ];

    let currentY = height - 325;
    bullets.forEach((b) => {
      page.drawCircle({ x: 60, y: currentY + 3, size: 2.5, color: brandTeal });
      page.drawText(b, { x: 70, y: currentY, size: 10, font: fontRegular, color: textDark });
      currentY -= 16;
    });

    // Revenue / Compensation Clause
    const revClause = `Successful contributors may be selected for the DigiHust core team and assigned real client projects. Compensation is project-based, with contributors receiving ${certificate.stipendTerms || '65–70% of the project budget, according to DigiHust\'s revenue-sharing policy.'}`;
    drawWrappedText(page, revClause, 50, currentY - 10, width - 100, fontRegular, 10, textDark, 14);

    // Closing terms
    const closing = 'This engagement does not guarantee permanent placement. Continued collaboration will be based on performance, reliability, professionalism, and project requirements. We look forward to having you on board.';
    drawWrappedText(page, closing, 50, currentY - 50, width - 100, fontRegular, 10, textDark, 14);

    // Divider above footer
    page.drawLine({
      start: { x: 50, y: 150 },
      end: { x: width - 50, y: 150 },
      thickness: 1,
      color: rgb(0.88, 0.91, 0.94)
    });

    // Embedded Unique Scannable QR Code (Bottom Left)
    page.drawImage(qrImage, {
      x: 50,
      y: 65,
      width: 70,
      height: 70
    });

    page.drawText('OFFICIAL AUDIT QR', { x: 130, y: 122, size: 9, font: fontBold, color: brandNavy });
    page.drawText(certificate.id, { x: 130, y: 108, size: 8, font: fontRegular, color: textMuted });
    page.drawText('✓ Scan with Phone Camera to Verify', { x: 130, y: 94, size: 8.5, font: fontBold, color: rgb(0.05, 0.6, 0.3) });
    page.drawText('digihust.com/verify', { x: 130, y: 80, size: 8, font: fontRegular, color: textMuted });

    // Signatory Block (Bottom Right)
    page.drawText('Best Regards,', { x: width - 200, y: 125, size: 10, font: fontRegular, color: textMuted });
    page.drawText(certificate.signatoryName || 'Mahad Abbas', { x: width - 200, y: 105, size: 16, font: fontItalic, color: brandNavy });
    page.drawText(certificate.signatoryName || 'Mahad Abbas', { x: width - 200, y: 88, size: 11, font: fontBold, color: textDark });
    page.drawText(certificate.signatoryTitle || 'Founder & CEO', { x: width - 200, y: 76, size: 9, font: fontRegular, color: textMuted });
    page.drawText('DigiHust Management', { x: width - 200, y: 64, size: 9, font: fontBold, color: brandTeal });

    // Agency Footer Contact Info
    page.drawText(`Email: ${certificate.contactEmail || 'contact@digihust.com'}   ·   Web: www.digihust.com   ·   Tel: ${certificate.contactPhone || '+92 300 1234567'}`, {
      x: 50,
      y: 25,
      size: 8,
      font: fontRegular,
      color: textMuted
    });

  } else {
    // ── LANDSCAPE CERTIFICATE OF COMPLETION LAYOUT ──

    // Outer Border
    page.drawRectangle({
      x: 25,
      y: 25,
      width: width - 50,
      height: height - 50,
      borderColor: brandTeal,
      borderWidth: 3,
      color: rgb(0.99, 1, 1)
    });

    // Inner Accent Border
    page.drawRectangle({
      x: 32,
      y: 32,
      width: width - 64,
      height: height - 64,
      borderColor: rgb(0.8, 0.88, 0.92),
      borderWidth: 1
    });

    // Header
    const orgTitle = 'DIGIHUST DIGITAL AGENCY';
    page.drawText(orgTitle, {
      x: (width - fontBold.widthOfTextAtSize(orgTitle, 14)) / 2,
      y: height - 80,
      size: 14,
      font: fontBold,
      color: brandTeal
    });

    const certTitle = certificate.documentTitle || 'CERTIFICATE OF COMPLETION';
    page.drawText(certTitle, {
      x: (width - fontBold.widthOfTextAtSize(certTitle, 28)) / 2,
      y: height - 120,
      size: 28,
      font: fontBold,
      color: brandNavy
    });

    const certTag = 'THIS IS PROUDLY PRESENTED TO';
    page.drawText(certTag, {
      x: (width - fontBold.widthOfTextAtSize(certTag, 10)) / 2,
      y: height - 160,
      size: 10,
      font: fontBold,
      color: textMuted
    });

    // Recipient Name
    const nameText = certificate.memberName;
    page.drawText(nameText, {
      x: (width - fontBold.widthOfTextAtSize(nameText, 32)) / 2,
      y: height - 210,
      size: 32,
      font: fontBold,
      color: brandNavy
    });

    page.drawLine({
      start: { x: 200, y: height - 225 },
      end: { x: width - 200, y: height - 225 },
      thickness: 1.5,
      color: brandTeal
    });

    // Role & Accomplishment Text
    const descText = `For outstanding technical excellence and successful completion of trial sprint deliverables as a ${certificate.roleTitle} (Member ID: ${certificate.memberDghId}) under the DigiHust Managed Squad Delivery Framework.`;
    drawWrappedText(page, descText, 140, height - 260, width - 280, fontRegular, 12, textDark, 18, true, width);

    // QR Code Box on Landscape Certificate
    page.drawImage(qrImage, {
      x: (width - 70) / 2,
      y: 75,
      width: 70,
      height: 70
    });
    const qrSub = 'Scan to Authenticate Online';
    page.drawText(qrSub, {
      x: (width - fontBold.widthOfTextAtSize(qrSub, 8)) / 2,
      y: 60,
      size: 8,
      font: fontBold,
      color: brandTeal
    });

    // Left Signature: Issue Date
    page.drawText('ISSUED DATE', { x: 100, y: 110, size: 9, font: fontBold, color: textMuted });
    page.drawText(certificate.issuedDate, { x: 100, y: 92, size: 12, font: fontBold, color: textDark });
    page.drawLine({ start: { x: 90, y: 85 }, end: { x: 220, y: 85 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });

    // Right Signature: CEO
    page.drawText(certificate.signatoryName || 'Mahad Abbas', { x: width - 220, y: 110, size: 15, font: fontItalic, color: brandNavy });
    page.drawText(certificate.signatoryTitle || 'Founder & CEO', { x: width - 220, y: 92, size: 10, font: fontBold, color: textDark });
    page.drawLine({ start: { x: width - 230, y: 85 }, end: { x: width - 90, y: 85 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
  }

  return await pdfDoc.save();
}

/**
 * Text wrapping helper for PDF pages
 */
function drawWrappedText(
  page: any,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  font: any,
  fontSize: number,
  color: any,
  lineHeight: number,
  center = false,
  pageWidth = 595
) {
  const words = text.split(' ');
  let line = '';
  let y = startY;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth > maxWidth && i > 0) {
      const lineX = center ? (pageWidth - font.widthOfTextAtSize(line.trim(), fontSize)) / 2 : x;
      page.drawText(line.trim(), { x: lineX, y, size: fontSize, font, color });
      line = words[i] + ' ';
      y -= lineHeight;
    } else {
      line = testLine;
    }
  }
  const finalX = center ? (pageWidth - font.widthOfTextAtSize(line.trim(), fontSize)) / 2 : x;
  page.drawText(line.trim(), { x: finalX, y, size: fontSize, font, color });
}
