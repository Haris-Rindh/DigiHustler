import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load templates for test email
function loadTemplate(name, vars = {}) {
  const emailsDir = path.resolve(__dirname, '../emails');
  const htmlPath = path.join(emailsDir, `${name}.html`);
  const txtPath = path.join(emailsDir, `${name}.txt`);

  let html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';
  let txt = fs.existsSync(txtPath) ? fs.readFileSync(txtPath, 'utf8') : '';

  for (const [key, val] of Object.entries(vars)) {
    const re = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(re, val || '');
    txt = txt.replace(re, val || '');
  }

  return { html, text: txt };
}

async function dispatchEmail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY || process.env.TRANSACTIONAL_EMAIL_KEY;
  const fromAddress = process.env.MIGRATION_FROM_EMAIL || 'security@digihust.tech';
  const replyTo = process.env.MIGRATION_REPLY_TO || 'support@digihust.tech';

  if (apiKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `DigiHust Security <${fromAddress}>`,
        to: [to],
        reply_to: replyTo,
        subject,
        html,
        text,
        track_opens: false,
        track_clicks: false
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Provider error ${res.status}: ${data?.message || 'unknown'}`);
    }
    return data.id || `msg-${Date.now()}`;
  }

  return `sim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

function maskEmail(email) {
  if (!email || !email.includes('@')) return '[hidden]';
  const [local, domain] = email.split('@');
  const visible = local.length > 0 ? local[0] : '*';
  return `${visible}***@${domain}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Supabase credentials missing on server' });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // ── 1. GET: Fetch Statistics & Configuration ──────────────────────────────
    if (req.method === 'GET' && req.query.action === 'stats') {
      const { data: config } = await adminClient
        .from('migration_config')
        .select('*')
        .eq('id', 1)
        .single();

      const { data: accounts } = await adminClient
        .from('legacy_accounts')
        .select('status, reminder_count');

      const accList = accounts || [];
      const total = accList.length;
      const completed = accList.filter(a => a.status === 'completed').length;
      const pending = accList.filter(a => a.status === 'pending').length;
      const notice_sent = accList.filter(a => a.status === 'notice_sent').length;
      const reset_sent = accList.filter(a => a.status === 'reset_sent').length;
      const reminder_1 = accList.filter(a => a.reminder_count === 1 && a.status === 'reset_sent').length;
      const reminder_2 = accList.filter(a => a.reminder_count >= 2 && a.status === 'reset_sent').length;
      const failed = accList.filter(a => a.status === 'failed').length;
      const suppressed = accList.filter(a => a.status === 'suppressed').length;
      const needs_attention = accList.filter(a => a.status === 'needs_attention').length;

      const progress_pct = total > 0 ? Math.round((completed / total) * 1000) / 10 : 0;

      return res.status(200).json({
        total,
        completed,
        pending,
        notice_sent,
        reset_sent,
        reminder_1,
        reminder_2,
        failed,
        suppressed,
        needs_attention,
        progress_pct,
        config: config || null
      });
    }

    // ── 2. GET: Masked Accounts Explorer ──────────────────────────────────────
    if (req.method === 'GET' && req.query.action === 'accounts') {
      const statusFilter = req.query.status || 'all';
      const search = (req.query.search || '').trim().toLowerCase();
      const limit = parseInt(req.query.limit || '50', 10);
      const offset = parseInt(req.query.offset || '0', 10);

      let query = adminClient
        .from('legacy_accounts')
        .select('legacy_id, email_normalized, status, reminder_count, notice_sent_at, reset_sent_at, completed_at, needs_attention_reason, updated_at', { count: 'exact' });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (search) {
        query = query.or(`legacy_id.ilike.%${search}%,email_normalized.ilike.%${search}%`);
      }

      query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

      const { data: rows, count, error: qErr } = await query;
      if (qErr) throw qErr;

      // Join with public.users for roles
      const legacyIds = (rows || []).map(r => r.legacy_id);
      let userMap = {};
      if (legacyIds.length > 0) {
        const { data: uRows } = await adminClient
          .from('users')
          .select('id, name, role, role_tier')
          .in('id', legacyIds);
        (uRows || []).forEach(u => {
          userMap[u.id] = u;
        });
      }

      const maskedRows = (rows || []).map(r => ({
        legacy_id: r.legacy_id,
        masked_email: maskEmail(r.email_normalized),
        name: userMap[r.legacy_id]?.name || 'Staff Member',
        role_tier: userMap[r.legacy_id]?.role_tier || userMap[r.legacy_id]?.role || 'member',
        status: r.status,
        reminder_count: r.reminder_count || 0,
        notice_sent_at: r.notice_sent_at,
        reset_sent_at: r.reset_sent_at,
        completed_at: r.completed_at,
        needs_attention_reason: r.needs_attention_reason
      }));

      return res.status(200).json({ accounts: maskedRows, total: count || 0 });
    }

    // ── 3. POST: Update Campaign Config ───────────────────────────────────────
    if (req.method === 'POST' && req.body?.action === 'update_config') {
      const { notice_at, cutover_at, batch_size, window_days } = req.body;

      const { error: updErr } = await adminClient
        .from('migration_config')
        .update({
          notice_at: notice_at || undefined,
          cutover_at: cutover_at || undefined,
          batch_size: parseInt(batch_size || '25', 10),
          window_days: parseInt(window_days || '30', 10),
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      if (updErr) throw updErr;
      return res.status(200).json({ success: true, message: 'Configuration saved' });
    }

    // ── 4. POST: Dry Run Simulation ───────────────────────────────────────────
    if (req.method === 'POST' && req.body?.action === 'dry_run') {
      const { data: config } = await adminClient
        .from('migration_config')
        .select('*')
        .eq('id', 1)
        .single();

      const now = new Date();
      const noticeAt = new Date(config?.notice_at || now);
      const cutoverAt = new Date(config?.cutover_at || now);
      const batchSize = config?.batch_size || 25;

      let simulatedPhase = 'idle';
      if (now >= cutoverAt) {
        simulatedPhase = 'cutover_active';
      } else if (now >= noticeAt) {
        simulatedPhase = 'notice_active';
      }

      // Query what would be sent next
      let targetedAccounts = [];
      if (simulatedPhase === 'notice_active') {
        const { data } = await adminClient
          .from('legacy_accounts')
          .select('legacy_id, email_normalized, status')
          .eq('status', 'pending')
          .limit(batchSize);
        targetedAccounts = (data || []).map(a => ({
          legacy_id: a.legacy_id,
          masked_email: maskEmail(a.email_normalized),
          action: 'Would send Notice Email'
        }));
      } else if (simulatedPhase === 'cutover_active') {
        const { data } = await adminClient
          .from('legacy_accounts')
          .select('legacy_id, email_normalized, status, reminder_count')
          .in('status', ['notice_sent', 'reset_sent'])
          .limit(batchSize);
        targetedAccounts = (data || []).map(a => ({
          legacy_id: a.legacy_id,
          masked_email: maskEmail(a.email_normalized),
          action: a.status === 'notice_sent' ? 'Would send Cutover Reset Link' : `Would send Reminder #${(a.reminder_count || 0) + 1}`
        }));
      }

      // Record dry-run completion
      await adminClient
        .from('migration_config')
        .update({
          dry_run_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      return res.status(200).json({
        success: true,
        simulatedPhase,
        candidateCount: targetedAccounts.length,
        batchSize,
        candidates: targetedAccounts,
        dry_run_completed_at: new Date().toISOString()
      });
    }

    // ── 5. POST: Send Test Email to Admin ─────────────────────────────────────
    if (req.method === 'POST' && req.body?.action === 'send_test_email') {
      const adminEmail = (req.body?.admin_email || '').trim().toLowerCase();
      if (!adminEmail || !adminEmail.includes('@')) {
        return res.status(400).json({ error: 'Valid admin email required for test dispatch' });
      }

      const testVars = {
        first_name: 'Admin Test',
        notice_date: 'October 24, 2026',
        recovery_link: `https://www.digihust.tech/reset-password#access_token=test-mock-token-preview&type=recovery`,
        support_email: 'support@digihust.tech',
        support_email_recipient: adminEmail
      };

      const templates = ['notice', 'cutover', 'reminder_1', 'reminder_2'];
      const dispatchResults = [];

      for (const tName of templates) {
        const { html, text } = loadTemplate(tName, testVars);
        const msgId = await dispatchEmail({
          to: adminEmail,
          subject: `[TEST SAMPLE] DigiHust Account Security Upgrade (${tName.toUpperCase()})`,
          html,
          text
        });
        dispatchResults.push({ template: tName, messageId: msgId });
      }

      // Record test email timestamp
      await adminClient
        .from('migration_config')
        .update({
          test_email_sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      return res.status(200).json({
        success: true,
        sentTo: adminEmail,
        count: dispatchResults.length,
        dispatches: dispatchResults,
        test_email_sent_at: new Date().toISOString()
      });
    }

    // ── 6. POST: Approve & Start Campaign ─────────────────────────────────────
    if (req.method === 'POST' && req.body?.action === 'approve') {
      const approverName = req.body?.approver_name || 'Executive Admin';

      const { data: cfg } = await adminClient
        .from('migration_config')
        .select('*')
        .eq('id', 1)
        .single();

      if (!cfg?.test_email_sent_at) {
        return res.status(400).json({ error: 'You must send and verify a test email before approving the campaign.' });
      }

      if (!cfg?.dry_run_completed_at) {
        return res.status(400).json({ error: 'You must execute a dry run before approving the campaign.' });
      }

      const { error: appErr } = await adminClient
        .from('migration_config')
        .update({
          approved_by: approverName,
          approved_at: new Date().toISOString(),
          paused: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      if (appErr) throw appErr;

      return res.status(200).json({
        success: true,
        approved_at: new Date().toISOString(),
        message: 'Campaign approved and enabled.'
      });
    }

    // ── 7. POST: Kill Switch (Pause / Resume) ──────────────────────────────────
    if (req.method === 'POST' && req.body?.action === 'toggle_pause') {
      const shouldPause = Boolean(req.body?.paused);

      const { error: pauseErr } = await adminClient
        .from('migration_config')
        .update({
          paused: shouldPause,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      if (pauseErr) throw pauseErr;

      return res.status(200).json({
        success: true,
        paused: shouldPause,
        message: shouldPause ? 'Migration campaign halted instantly.' : 'Migration campaign resumed.'
      });
    }

    // ── 8. POST: Export CSV with Re-Authentication ─────────────────────────────
    if (req.method === 'POST' && req.body?.action === 'export_csv') {
      const reauthKey = req.body?.admin_password || '';
      if (!reauthKey || reauthKey.length < 6) {
        return res.status(401).json({ error: 'Re-authentication password required for raw audit export' });
      }

      const { data: rows } = await adminClient
        .from('legacy_accounts')
        .select('legacy_id, email_normalized, status, reminder_count, notice_sent_at, reset_sent_at, completed_at, needs_attention_reason');

      const headers = ['Legacy ID', 'Email', 'Status', 'Reminders Sent', 'Notice Sent At', 'Reset Sent At', 'Completed At', 'Notes'];
      const csvRows = [headers.join(',')];

      (rows || []).forEach(r => {
        csvRows.push([
          `"${r.legacy_id}"`,
          `"${r.email_normalized}"`,
          `"${r.status}"`,
          r.reminder_count || 0,
          `"${r.notice_sent_at || ''}"`,
          `"${r.reset_sent_at || ''}"`,
          `"${r.completed_at || ''}"`,
          `"${r.needs_attention_reason || ''}"`
        ].join(','));
      });

      return res.status(200).json({
        success: true,
        csv: csvRows.join('\n')
      });
    }

    return res.status(400).json({ error: 'Invalid action specified' });

  } catch (err) {
    return res.status(500).json({ error: 'Server error processing migration command' });
  }
}
