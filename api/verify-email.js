import { verifyMailboxSmtp } from '../server/emailVerifier.js';

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10; // 10 verifications per minute per IP

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
  // CORS – allowlist only
  const origin = req.headers['origin'] || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin === '';
  if (isAllowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'false');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Only GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    res.setHeader('Retry-After', '60');
    res.status(429).json({ exists: true, reason: 'rate_limited' });
    return;
  }

  const rawEmail = (req.query?.email || '').toString().trim();
  const email = rawEmail.replace(/[\x00-\x1F\x7F]/g, '').slice(0, 254);

  if (!email) {
    return res.status(400).json({ exists: false, reason: 'missing_email' });
  }

  // Basic format check before hitting the network
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ exists: false, reason: 'invalid_format', message: 'Invalid email format.' });
  }

  try {
    const result = await verifyMailboxSmtp(email);
    // Return only the fields callers need; strip any internal details
    return res.status(200).json({
      exists: result.exists,
      reason: result.reason,
      message: result.message,
    });
  } catch (error) {
    console.error('[verify-email API] Internal error:', error?.message);
    return res.status(200).json({ exists: true, reason: 'handler_error_fail_open' });
  }
}
