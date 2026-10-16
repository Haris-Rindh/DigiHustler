import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// ── In-memory Rate Limiting (per serverless instance) ─────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_ATTEMPTS_PER_MIN = 5;

function isRateLimited(key) {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count++;
  rateLimitMap.set(key, entry);
  return entry.count > MAX_ATTEMPTS_PER_MIN;
}

// ── Password Policy Checker ──────────────────────────────────────────────────
const COMMON_BLOCKLIST = new Set([
  'password', 'password123', 'admin', 'admin123', 'digihust', 'digihust123',
  '123456', '12345678', '123456789', 'qwerty', 'welcome', 'letmein'
]);
const KNOWN_DEFAULT_PASSWORD = 'DigiHust@2026';

function validatePasswordPolicy(password) {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 12) return false;
  if (password === KNOWN_DEFAULT_PASSWORD) return false;
  if (COMMON_BLOCKLIST.has(password.toLowerCase().trim())) return false;
  return true;
}

// ── Timing-Safe Legacy Hash Verifier ─────────────────────────────────────────
const SALT = 'digihust_prod_salt_2026_sec_master';

function timingSafeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyLegacyPassword(plainText, expectedHash) {
  if (!plainText || !expectedHash) return false;

  // 1. Salted SHA-256 (hashPassword)
  const saltedSha256 = crypto.createHash('sha256').update(`${plainText}_${SALT}`).digest('hex');
  if (timingSafeCompare(saltedSha256, expectedHash)) return true;

  // 2. Synchronous djb2 quickHashSync
  let djbHash = 0;
  const str = `${plainText}_${SALT}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    djbHash = ((djbHash << 5) - djbHash) + char;
    djbHash |= 0;
  }
  const djbFormatted = `hash_${Math.abs(djbHash).toString(16)}`;
  if (timingSafeCompare(djbFormatted, expectedHash)) return true;

  // 3. Unsalted raw SHA-256
  const rawSha256 = crypto.createHash('sha256').update(plainText).digest('hex');
  if (timingSafeCompare(rawSha256, expectedHash)) return true;

  return false;
}

// ── Allowed Origins for CORS ─────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://www.digihust.tech',
  'https://digihust.tech',
  'https://digihust.vercel.app'
];

export default async function handler(req, res) {
  const origin = req.headers['origin'] || '';
  if (ALLOWED_ORIGINS.includes(origin) || origin === '') {
    res.setHeader('Access-Control-Allow-Origin', origin || 'https://www.digihust.tech');
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'false');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const rawEmail = (req.body?.email || '').toString().trim().toLowerCase();
  const password = (req.body?.password || '').toString();
  const newPassword = req.body?.newPassword ? req.body.newPassword.toString() : null;

  // Generic anti-enumeration response helper
  const genericAuthFailure = () => res.status(401).json({
    success: false,
    error: 'Email or password is incorrect.'
  });

  // Rate Limiting by IP and Email
  if (isRateLimited(`ip:${ip}`) || (rawEmail && isRateLimited(`email:${rawEmail}`))) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ success: false, error: 'Too many login attempts. Please wait 1 minute.' });
  }

  if (!rawEmail || !password) {
    return genericAuthFailure();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ success: false, error: 'Authentication service temporarily unavailable' });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // 1. Query public.users for user metadata & legacy hash (supports email or member ID)
    const { data: userRow } = await adminClient
      .from('users')
      .select('id, name, email, role, role_tier, member_id, password_hash')
      .or(`email.ilike.${rawEmail},member_id.ilike.${rawEmail}`)
      .maybeSingle();

    if (!userRow) {
      // Non-existent user: generic response to prevent user enumeration
      return genericAuthFailure();
    }

    const normalizedEmail = (userRow.email || rawEmail).trim().toLowerCase();

    // 2. Query legacy_accounts table for migration status
    const { data: legacyAcc } = await adminClient
      .from('legacy_accounts')
      .select('legacy_id, status, auth_user_id, failed_attempts')
      .or(`legacy_id.eq.${userRow.id},email_normalized.eq.${normalizedEmail}`)
      .maybeSingle();

    // If account has already completed migration, signal client to use native Supabase Auth
    if (legacyAcc && legacyAcc.status === 'completed') {
      return res.status(200).json({
        success: false,
        status: 'already_migrated',
        email: normalizedEmail,
        message: 'Account already upgraded. Please sign in with your Supabase Auth password.'
      });
    }

    if (!userRow.password_hash) {
      // User has no legacy password set
      return genericAuthFailure();
    }

    // 3. Timing-safe verification of legacy password
    const isPasswordValid = verifyLegacyPassword(password, userRow.password_hash);
    if (!isPasswordValid) {
      // Increment failed attempts in legacy_accounts
      if (legacyAcc) {
        await adminClient
          .from('legacy_accounts')
          .update({ failed_attempts: (legacyAcc.failed_attempts || 0) + 1, updated_at: new Date().toISOString() })
          .eq('legacy_id', legacyAcc.legacy_id);
      }
      return genericAuthFailure();
    }

    // 4. Password validation against new policy
    let finalPassword = password;
    const currentMeetsPolicy = validatePasswordPolicy(password);

    if (!currentMeetsPolicy) {
      if (!newPassword) {
        // Prompt client to provide a new secure password
        return res.status(200).json({
          success: true,
          status: 'requires_new_password',
          message: 'Your account requires an updated password of at least 12 characters to meet our security standard.'
        });
      }

      // Validate user's chosen new password
      if (!validatePasswordPolicy(newPassword)) {
        return res.status(400).json({
          success: false,
          error: 'New password must be at least 12 characters and not be a common or default password.'
        });
      }
      finalPassword = newPassword;
    }

    // 5. Create or update user in Supabase Auth
    let authUser = null;
    const { data: existingAuth } = await adminClient.auth.admin.listUsers();
    const existing = existingAuth?.users?.find(u => u.email?.toLowerCase() === rawEmail);

    if (existing) {
      // Update password for existing Auth stub
      const { data: updated, error: updateErr } = await adminClient.auth.admin.updateUserById(existing.id, {
        password: finalPassword,
        email_confirm: true,
        user_metadata: { name: userRow.name, member_id: userRow.member_id },
        app_metadata: { role_tier: userRow.role_tier || 'member' }
      });
      if (updateErr) throw updateErr;
      authUser = updated.user;
    } else {
      // Create fresh user in Supabase Auth
      const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
        email: rawEmail,
        password: finalPassword,
        email_confirm: true,
        user_metadata: { name: userRow.name, member_id: userRow.member_id },
        app_metadata: {
          role_tier: userRow.role_tier || 'member',
          is_admin: ['ceo', 'manager'].includes(userRow.role_tier)
        }
      });
      if (createErr) throw createErr;
      authUser = created.user;
    }

    // 6. Update legacy_accounts status = 'completed'
    await adminClient
      .from('legacy_accounts')
      .upsert({
        legacy_id: userRow.id,
        email_normalized: rawEmail,
        auth_user_id: authUser.id,
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    // 7. Update public.users linkage & clear legacy password hash
    await adminClient
      .from('users')
      .update({
        auth_user_id: authUser.id,
        password_hash: null, // Wipe legacy hash upon successful migration!
        is_first_login: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userRow.id);

    // 8. Role assignments in user_roles table
    await adminClient
      .from('user_roles')
      .upsert({
        user_id: authUser.id,
        role_tier: userRow.role_tier || 'member'
      }, { onConflict: 'user_id' });

    const isStaffOrAdmin = ['ceo', 'manager'].includes(userRow.role_tier);

    return res.status(200).json({
      success: true,
      status: 'migrated',
      email: normalizedEmail,
      authUserId: authUser.id,
      requires_mfa_setup: isStaffOrAdmin,
      message: 'Account successfully upgraded to modern security authentication.'
    });

  } catch (err) {
    // Return generic error without leaking database or execution details
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred during account migration. Please try again.'
    });
  }
}
