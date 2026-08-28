import emailjs from '@emailjs/browser';
import { Lead } from '../types';

export interface NotificationResult {
  clientNotified: boolean;
  managementNotified: boolean;
  whatsappQuickLink: string;
}

export const notificationService = {
  /**
   * Generates a direct WhatsApp click-to-chat URL for management to instantly reply to a lead.
   */
  generateWhatsAppReplyUrl(lead: Lead, managementPhone: string = '923206806396'): string {
    const cleanPhone = managementPhone.replace(/[^0-9]/g, '');
    const message = `*🚨 New DigiHust Client Lead Received!*\n\n` +
      `*Client:* ${lead.clientName}\n` +
      `*Email:* ${lead.email}\n` +
      (lead.companyName ? `*Company:* ${lead.companyName}\n` : '') +
      `*Budget:* ${lead.budgetRange}\n` +
      `*Timeline:* ${lead.timeline}\n` +
      `*Domain:* ${lead.targetGroupId.toUpperCase()}\n\n` +
      `*Scope:* ${lead.scopeDescription}\n\n` +
      `_Action: Respond within 1-2 hours for high ticket conversion._`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  },

  /**
   * Generates direct WhatsApp outreach link for the client if client provided phone or for direct email response.
   */
  generateDirectClientWhatsAppUrl(clientPhone: string, clientName: string): string {
    const cleanPhone = clientPhone.replace(/[^0-9]/g, '');
    const message = `Hello ${clientName}, thank you for reaching out to DigiHust regarding your project scope. Our engineering squad is reviewing your requirements. What time is best for a quick 15-minute alignment call?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  },

  /**
   * Dispatches automated lead email notifications directly to digihust@gmail.com via EmailJS
   */
  async dispatchLeadEmail(leadData: {
    name: string;
    email: string;
    company?: string;
    services: string[];
    budget: string;
    timeline: string;
    description: string;
  }): Promise<boolean> {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

    // 1. Primary: EmailJS SDK (Zero-block, direct connection to your Gmail)
    if (serviceId && templateId && publicKey) {
      try {
        const emailParams = {
          client_name: leadData.name,
          client_email: leadData.email,
          company: leadData.company || 'Not Specified',
          services: Array.isArray(leadData.services) ? leadData.services.join(', ') : leadData.services,
          budget: leadData.budget,
          timeline: leadData.timeline,
          project_description: leadData.description,
          submitted_at: new Date().toLocaleString(),
          to_email: 'digihust@gmail.com'
        };

        const res = await emailjs.send(serviceId, templateId, emailParams, publicKey);
        if (res.status === 200) {
          return true;
        }
      } catch (err) {
        console.warn('EmailJS delivery warning:', err);
      }
    }

    // 2. Secondary Fallback: Direct FormSubmit.co Dispatcher
    try {
      const formData = new FormData();
      formData.append('_subject', `🚨 New DigiHust Project Lead: ${leadData.name} (${leadData.budget})`);
      formData.append('_replyto', leadData.email);
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');
      formData.append('Client Name', leadData.name);
      formData.append('Client Email', leadData.email);
      formData.append('Company', leadData.company || 'Not Specified');
      formData.append('Services Required', Array.isArray(leadData.services) ? leadData.services.join(', ') : leadData.services);
      formData.append('Budget Range', leadData.budget);
      formData.append('Target Timeline', leadData.timeline);
      formData.append('Project Scope & Description', leadData.description);
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
