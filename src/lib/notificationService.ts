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
   * Dispatches automated lead email notifications directly to digihust@gmail.com
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
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';
    
    if (!accessKey) {
      console.info('Tip: Add VITE_WEB3FORMS_ACCESS_KEY to .env for instant email alerts to digihust@gmail.com.');
      return false;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `🚨 New DigiHust Project Lead: ${leadData.name} (${leadData.budget})`,
          from_name: 'DigiHust Portal Lead System',
          name: leadData.name,
          email: leadData.email,
          company: leadData.company || 'N/A',
          services: leadData.services.join(', '),
          budget: leadData.budget,
          timeline: leadData.timeline,
          message: `New client brief submitted on DigiHust:\n\nClient Name: ${leadData.name}\nEmail: ${leadData.email}\nCompany: ${leadData.company || 'N/A'}\nServices Requested: ${leadData.services.join(', ')}\nBudget Range: ${leadData.budget}\nTarget Timeline: ${leadData.timeline}\n\nProject Scope:\n${leadData.description}\n\n--- View and manage in Executive Portal at /portal/leads ---`
        })
      });
      return response.ok;
    } catch (err) {
      console.warn('Direct email dispatch notice:', err);
      return false;
    }
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
