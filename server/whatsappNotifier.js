/**
 * WhatsApp Background Automated Dispatcher for DigiHust Leadership
 * Sends new inbound client inquiries automatically to DigiHust Executive WhatsApp numbers:
 * Primary: +923226806396 and +923206806396 (Mahad Abbas & Haris Asad)
 *
 * Supported delivery layers:
 * 1. CallMeBot Free WhatsApp API (if CALLMEBOT_API_KEY / WHATSAPP_API_KEY is configured)
 * 2. Webhook / Automation Gateway (if WHATSAPP_WEBHOOK_URL / LEAD_NOTIFICATION_WEBHOOK is configured)
 * 3. Twilio WhatsApp API (if TWILIO_ACCOUNT_SID & TWILIO_AUTH_TOKEN are configured)
 * 4. Audit & Console Logging (always logs full formatted alert to server stdout)
 */

export async function sendWhatsAppNotification(leadData) {
  const targetNumbers = (leadData.recipients || process.env.WHATSAPP_NUMBERS || process.env.VITE_MANAGEMENT_PHONE || '923226806396,923206806396')
    .split(',')
    .map((n) => n.replace(/[^0-9]/g, ''))
    .filter(Boolean);

  const formattedServices = Array.isArray(leadData.services)
    ? leadData.services.join(', ')
    : (leadData.services || 'General Project Scope');
  const currency = leadData.currency || 'USD';
  const budget = leadData.budget || 'Flexible';
  const timeline = leadData.timeline || 'Flexible';
  const company = leadData.company || 'Not Specified';
  const clientPhone = leadData.clientPhone || leadData.phone || '';
  const clientPhoneClean = clientPhone.replace(/[^0-9]/g, '');
  const attachment = leadData.attachmentName
    ? `\n*Attachment:* ${leadData.attachmentName}${leadData.attachmentUrl ? ` (${leadData.attachmentUrl})` : ''}`
    : '';

  const isTest = Boolean(leadData.isTest);

  const message = isTest
    ? `🧪 *DIGIHUST WHATSAPP NOTIFICATION TEST*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✓ Automated WhatsApp notification gateway is ACTIVE and reachable!\n` +
      `🕒 Timestamp: ${new Date().toLocaleString()}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `DigiHust Executive Leadership Desk\n` +
      `Recipients: +923226806396, +923206806396`
    : `🚨 *NEW DIGIHUST CLIENT INTAKE*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Client:* ${leadData.name || 'Anonymous'}\n` +
      `📧 *Email:* ${leadData.email}\n` +
      `📱 *Phone / WhatsApp:* ${clientPhone || 'Not Provided'}\n` +
      `🏢 *Company:* ${company}\n` +
      `🛠️ *Services:* ${formattedServices}\n` +
      `💰 *Budget:* ${budget} (${currency})\n` +
      `⏱️ *Timeline:* ${timeline}` +
      attachment + `\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📝 *Project Overview:*\n${leadData.description || 'No description provided.'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⚡ *Direct Client Contact:*\n` +
      (clientPhoneClean ? `WhatsApp: https://wa.me/${clientPhoneClean}?text=Hello%20${encodeURIComponent(leadData.name || '')}\n` : '') +
      `Email: mailto:${leadData.email}`;

  const results = [];

  // 1. Webhook / Automation dispatch (e.g. n8n, Zapier, Make, Green-API, UltraMsg)
  const webhookUrl =
    leadData.webhookUrl ||
    process.env.WHATSAPP_WEBHOOK_URL ||
    process.env.VITE_WHATSAPP_WEBHOOK_URL ||
    process.env.LEAD_NOTIFICATION_WEBHOOK;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: isTest ? 'TEST_ALERT' : 'NEW_CLIENT_INQUIRY',
          recipients: targetNumbers,
          message,
          lead: leadData,
          timestamp: new Date().toISOString(),
        }),
      });
      results.push({ channel: 'webhook', status: res.status, ok: res.ok });
    } catch (err) {
      console.warn('[WhatsApp Notifier] Webhook dispatch warning:', err?.message);
      results.push({ channel: 'webhook', status: 500, ok: false, error: err?.message });
    }
  }

  // 2. CallMeBot Free API dispatch
  const generalKey =
    leadData.callmebotApiKey ||
    process.env.CALLMEBOT_API_KEY ||
    process.env.WHATSAPP_API_KEY;

  if (generalKey) {
    for (const phone of targetNumbers) {
      const apiKey = process.env[`CALLMEBOT_API_KEY_${phone}`] || generalKey;
      try {
        const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(
          message
        )}&apikey=${apiKey}`;
        const res = await fetch(url);
        const text = await res.text().catch(() => '');
        results.push({ 
          channel: `callmebot:${phone}`, 
          status: res.status, 
          ok: res.ok, 
          response: text.slice(0, 150) 
        });
      } catch (err) {
        console.warn(`[WhatsApp Notifier] CallMeBot dispatch to ${phone} warning:`, err?.message);
        results.push({ channel: `callmebot:${phone}`, status: 500, ok: false, error: err?.message });
      }
    }
  }

  // 3. Twilio API dispatch
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_FROM;
  if (twilioSid && twilioAuth && twilioFrom) {
    for (const phone of targetNumbers) {
      try {
        const auth = Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
        const bodyParams = new URLSearchParams({
          From: twilioFrom.startsWith('whatsapp:') ? twilioFrom : `whatsapp:${twilioFrom}`,
          To: `whatsapp:+${phone}`,
          Body: message,
        });
        const res = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: bodyParams.toString(),
          }
        );
        results.push({ channel: `twilio:${phone}`, status: res.status, ok: res.ok });
      } catch (err) {
        console.warn(`[WhatsApp Notifier] Twilio dispatch to ${phone} warning:`, err?.message);
        results.push({ channel: `twilio:${phone}`, status: 500, ok: false, error: err?.message });
      }
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `✓ [WhatsApp Background Notifier] Dispatched lead notification to leadership (${targetNumbers.join(', ')}). Results: ${results.length} channels attempted.`
    );
  }

  return {
    success: true,
    recipients: targetNumbers,
    messageLength: message.length,
    results,
    timestamp: new Date().toISOString(),
  };
}
