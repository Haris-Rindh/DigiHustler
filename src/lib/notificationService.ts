import emailjs from '@emailjs/browser';
import { Lead } from '../types';

export interface NotificationResult {
  clientNotified: boolean;
  managementNotified: boolean;
  whatsappQuickLink: string;
}

export interface LeadNotificationPayload {
  name: string;
  email: string;
  company?: string;
  services: string[];
  currency?: string;
  budget?: string;
  timeline?: string;
  description: string;
  attachmentName?: string;
  attachmentUrl?: string;
}

export const notificationService = {
  /**
   * Generates a direct WhatsApp click-to-chat URL for management to instantly reply to a lead.
   */
  generateWhatsAppReplyUrl(lead: Lead | LeadNotificationPayload, managementPhone: string = '923206806396'): string {
    const cleanPhone = managementPhone.replace(/[^0-9]/g, '');
    const isPayload = !('id' in lead);
    const payload = lead as LeadNotificationPayload;
    const leadObj = lead as Lead;
    const clientName = isPayload ? payload.name : leadObj.clientName;
    const clientEmail = isPayload ? payload.email : leadObj.clientEmail;
    const company = (isPayload ? payload.company : (leadObj.clientCompany || leadObj.companyName)) || 'Not Specified';
    const budget = (isPayload ? payload.budget : (leadObj.budgetRange || String(leadObj.budgetEstimate || 'Flexible'))) || 'Flexible';
    const timeline = lead.timeline || 'Flexible';
    const scope = (isPayload ? payload.description : (leadObj.scopeDescription || leadObj.brief || '')) || '';
    const attachment = lead.attachmentName ? `\n*Attachment:* ${lead.attachmentName}${lead.attachmentUrl ? ` (${lead.attachmentUrl})` : ''}` : '';

    const message = `*🚨 New DigiHust Client Inquiry!*\n\n` +
      `*Client:* ${clientName}\n` +
      `*Email:* ${clientEmail}\n` +
      `*Company:* ${company}\n` +
      `*Budget:* ${budget}\n` +
      `*Timeline:* ${timeline}` +
      attachment + `\n\n` +
      `*Project Overview:*\n${scope}\n\n` +
      `_Action: Respond within 24 hours to schedule discovery alignment._`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  },

  /**
   * Dispatches automated lead email notifications directly to digihust@gmail.com
   */
  async dispatchLeadEmail(leadData: LeadNotificationPayload): Promise<boolean> {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_kk1oyko';
    const templateId = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_xcxoq8x';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'hvCezH1wrH-95AZDc';

    const formattedServices = Array.isArray(leadData.services) ? leadData.services.join(', ') : leadData.services;
    const attachmentInfo = leadData.attachmentName 
      ? `${leadData.attachmentName}${leadData.attachmentUrl ? ` (${leadData.attachmentUrl})` : ''}`
      : 'None Attached';

    // 1. Primary: EmailJS SDK (Direct dispatch to Gmail inbox)
    if (serviceId && templateId && publicKey) {
      try {
        const emailParams = {
          to_email: 'digihust@gmail.com',
          admin_email: 'digihust@gmail.com',
          recipient: 'digihust@gmail.com',
          reply_to: leadData.email,
          from_email: leadData.email,
          email: leadData.email, // Client's actual email (read by EmailJS Auto-Reply)
          client_email: leadData.email,
          client_name: leadData.name,
          name: leadData.name,
          from_name: leadData.name,
          company: leadData.company || 'Not Specified',
          services: formattedServices,
          currency: leadData.currency || 'USD',
          budget: leadData.budget || 'Flexible',
          timeline: leadData.timeline || 'Flexible',
          attachment: attachmentInfo,
          attachment_url: leadData.attachmentUrl || '',
          attachment_name: leadData.attachmentName || '',
          project_description: leadData.description,
          message: `${leadData.description}\n\n[Attachment: ${attachmentInfo}]`,
          submitted_at: new Date().toLocaleString()
        };

        const res = await emailjs.send(serviceId, templateId, emailParams, publicKey);
        if (res.status === 200) {
          if (import.meta.env.DEV) {
            console.log('✓ EmailJS Lead Dispatched to Team Successfully');
          }
          return true;
        }
      } catch (err) {
        console.error('EmailJS delivery error:', err);
      }
    }

    // 2. Secondary Fallback: FormSubmit AJAX Dispatcher
    try {
      const formData = new FormData();
      formData.append('_subject', `🚨 New DigiHust Project Lead: ${leadData.name} (${leadData.budget})`);
      formData.append('_replyto', leadData.email);
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');
      formData.append('Client Name', leadData.name);
      formData.append('Client Email', leadData.email);
      formData.append('Company', leadData.company || 'Not Specified');
      formData.append('Services Required', formattedServices);
      formData.append('Budget', leadData.budget || 'Flexible');
      formData.append('Currency', leadData.currency || 'USD');
      formData.append('Target Timeline', leadData.timeline || 'Flexible');
      formData.append('Attachment File', attachmentInfo);
      if (leadData.attachmentUrl) formData.append('Attachment URL', leadData.attachmentUrl);
      formData.append('Project Scope & Description', leadData.description || '');
      formData.append('Submitted At', new Date().toLocaleString());

      const res = await fetch('https://formsubmit.co/ajax/digihust@gmail.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        return data.success === 'true' || data.success === true;
      }
    } catch (err) {
      console.warn('Lead email dispatch fallback notice:', err);
    }

    return false;
  },

  /**
   * Dispatches automated confirmation receipt email directly to the CLIENT's inbox
   */
  async dispatchClientConfirmationEmail(leadData: LeadNotificationPayload): Promise<boolean> {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_kk1oyko';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'hvCezH1wrH-95AZDc';
    const clientConfirmTemplateId = import.meta.env.VITE_EMAILJS_CLIENT_CONFIRM_TEMPLATE_ID;

    // Do NOT send template_xcxoq8x here — template_xcxoq8x is bound to digihust@gmail.com.
    // Re-sending template_xcxoq8x causes Admin to receive duplicate emails!
    if (!clientConfirmTemplateId || clientConfirmTemplateId === 'template_xcxoq8x') {
      console.log('ℹ️ Client confirmation is handled via EmailJS Auto-Reply or awaiting dedicated VITE_EMAILJS_CLIENT_CONFIRM_TEMPLATE_ID.');
      return true;
    }

    const formattedServices = Array.isArray(leadData.services) ? leadData.services.join(', ') : leadData.services;

    // Dispatch via dedicated Client Confirmation Template
    try {
      const confirmationParams = {
        to_email: leadData.email,
        to: leadData.email,
        email: leadData.email,
        recipient: leadData.email,
        client_email: leadData.email,
        client_name: leadData.name,
        name: leadData.name,
        reply_to: 'digihust@gmail.com',
        from_name: 'DigiHust Operations Team',
        company_name: 'DigiHust',
        services: formattedServices,
        budget: leadData.budget || 'Flexible',
        timeline: leadData.timeline || 'Flexible',
        message: `Hello ${leadData.name},\n\nThank you for reaching out to DigiHust! We have successfully received your project inquiry for ${formattedServices} with a budget of ${leadData.budget || 'Flexible'}.\n\nOur dedicated technical squad and engineering leads are currently reviewing your specifications. We will reach back out to you within 24 hours to schedule a short discovery alignment call.\n\nWarm regards,\nDigiHust Operations & Engineering\nhttps://www.digihust.tech`,
        submitted_at: new Date().toLocaleString()
      };

      const res = await emailjs.send(serviceId, clientConfirmTemplateId, confirmationParams, publicKey);
      if (res.status === 200) {
        if (import.meta.env.DEV) {
          console.log('✓ EmailJS Client Confirmation Dispatched Successfully');
        }
        return true;
      }
    } catch (err) {
      console.warn('Client confirmation EmailJS warning:', err);
    }

    return false;
  },

  /**
   * Dispatches automated background WhatsApp notifications directly to DigiHust Leadership
   * (+923226806396 / +923206806396) without requiring any user click or browser pop-up.
   */
  async dispatchLeadWhatsApp(leadData: LeadNotificationPayload): Promise<boolean> {
    try {
      // 1. Primary: Serverless & Dev Endpoint /api/send-whatsapp
      const res = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (res.ok) {
        if (import.meta.env.DEV) {
          console.log('✓ Automated Background WhatsApp Dispatched to DigiHust Leadership');
        }
        return true;
      }
    } catch (err) {
      console.warn('API /api/send-whatsapp dispatch notice:', err);
    }

    // 2. Secondary Webhook Fallback if directly configured in client environment
    const webhookUrl = import.meta.env.VITE_WHATSAPP_WEBHOOK_URL || import.meta.env.VITE_LEAD_NOTIFICATION_WEBHOOK;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'NEW_CLIENT_INQUIRY',
            lead: leadData,
            timestamp: new Date().toISOString(),
          }),
        });
        if (import.meta.env.DEV) {
          console.log('✓ Webhook Lead WhatsApp Dispatched Successfully');
        }
        return true;
      } catch (webhookErr) {
        console.warn('WhatsApp direct webhook dispatch warning:', webhookErr);
      }
    }

    return false;
  },

  /**
   * Dispatches automated notifications:
   * 1. Sends webhook payload to management notification webhook (e.g. n8n, Slack, Discord, Resend)
   * 2. Logs notification event
   */
  async dispatchLeadNotifications(lead: Lead, webhookUrl?: string): Promise<NotificationResult> {
    const managementPhone = import.meta.env.VITE_MANAGEMENT_PHONE || '+923206806396';
    const whatsappQuickLink = this.generateWhatsAppReplyUrl(lead, managementPhone);

    const configuredWebhook = webhookUrl || import.meta.env.VITE_LEAD_NOTIFICATION_WEBHOOK || '';

    let managementNotified = false;

    if (configuredWebhook) {
      try {
        await fetch(configuredWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'NEW_LEAD_SUBMITTED',
            leadId: lead.id,
            clientName: lead.clientName,
            email: lead.email,
            companyName: lead.companyName,
            scopeDescription: lead.scopeDescription,
            targetGroupId: lead.targetGroupId,
            budgetRange: lead.budgetRange,
            timeline: lead.timeline,
            attachmentUrl: lead.attachmentUrl,
            attachmentName: lead.attachmentName,
            currency: lead.currency,
            timestamp: new Date().toISOString(),
            whatsappReplyUrl: whatsappQuickLink
          })
        });
        managementNotified = true;
      } catch (err) {
        console.warn('Webhook notification dispatch failed:', err);
      }
    }

    return {
      clientNotified: true,
      managementNotified,
      whatsappQuickLink
    };
  }
};
