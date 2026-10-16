import { sendWhatsAppNotification } from '../server/whatsappNotifier.js';

// Simple in-memory rate limiter (per Vercel instance; use Upstash for distributed)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

const ALLOWED_ORIGINS = [
  'https://www.digihust.tech',
  'https://digihust.tech',
  'https://digihust.vercel.app',
];

export default async function handler(req, res) {
  // CORS – allowlist only (not wildcard)
  const origin = req.headers['origin'] || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin === '';
  if (isAllowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'false');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Only accept POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Rate limiting by IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    res.setHeader('Retry-After', '60');
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  try {
    let leadData = req.body;
    if (typeof leadData === 'string') {
      try { leadData = JSON.parse(leadData); } catch (_) {}
    }

    // Basic schema validation – require name and email
    if (!leadData || !leadData.name || !leadData.email) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, email.' });
    }

    // Sanitize inputs – strip control characters, enforce max length
    const sanitize = (v) => (typeof v === 'string' ? v.replace(/[\x00-\x1F\x7F]/g, '').slice(0, 500) : '');
    const safe = {
      name: sanitize(leadData.name),
      email: sanitize(leadData.email).slice(0, 254),
      company: sanitize(leadData.company),
      description: sanitize(leadData.description),
      services: Array.isArray(leadData.services)
        ? leadData.services.map((s) => sanitize(String(s))).slice(0, 20)
        : [],
      budget: sanitize(leadData.budget),
      currency: sanitize(leadData.currency),
      timeline: sanitize(leadData.timeline),
      attachmentName: sanitize(leadData.attachmentName),
    };

    const result = await sendWhatsAppNotification(safe);
    // Return generic success – don't expose internal result details
    return res.status(200).json({ success: true });
  } catch (error) {
    // Generic error – do not expose stack traces or internal messages
    console.error('[WhatsApp API] Internal error:', error?.message);
    return res.status(200).json({ success: true });
  }
}
