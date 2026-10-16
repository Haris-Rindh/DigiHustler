import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Verify webhook signature (e.g. Svix for Resend / HMAC-SHA256)
function verifyWebhookSignature(payload, signatureHeader, secret) {
  if (!secret || !signatureHeader) return true; // Fail-permissive if no signing secret configured in dev

  try {
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const provided = signatureHeader.replace(/^sha256=/, '');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
  } catch (_) {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.EMAIL_WEBHOOK_SECRET;
  const signature = req.headers['svix-signature'] || req.headers['x-webhook-signature'] || '';

  let rawBody = req.body;
  if (typeof rawBody !== 'string') {
    rawBody = JSON.stringify(rawBody);
  }

  if (secret && !verifyWebhookSignature(rawBody, signature, secret)) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  let event = {};
  try {
    event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (_) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(200).json({ received: true });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  // Extract event type and recipient email
  const eventType = event.type || event.event || '';
  const recipientEmail = (event.data?.to?.[0] || event.recipient || event.email || '').toLowerCase().trim();

  // Handle Bounces and Complaints (mark account as suppressed)
  if (['email.bounced', 'email.complained', 'bounce', 'spam_complaint'].includes(eventType) && recipientEmail) {
    await adminClient
      .from('legacy_accounts')
      .update({
        status: 'suppressed',
        last_error_code: eventType,
        updated_at: new Date().toISOString()
      })
      .eq('email_normalized', recipientEmail);
  }

  return res.status(200).json({ received: true });
}
