import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load and compile template files
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

// Transactional email dispatch helper (Resend / Brevo / SMTP compatible)
async function dispatchEmail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY || process.env.TRANSACTIONAL_EMAIL_KEY;
  const fromAddress = process.env.MIGRATION_FROM_EMAIL || 'security@digihust.tech';
  const replyTo = process.env.MIGRATION_REPLY_TO || 'support@digihust.tech';

  // If live provider key exists, call Resend transactional API with tracking disabled
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
        // Rule: Tracking OFF to prevent link rewriting that looks like phishing
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

  // Simulated provider ID for test environments
  return `sim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

export default async function handler(req, res) {
  // 1. Authenticate Cron Request via CRON_SECRET header
  const authHeader = req.headers['authorization'] || '';
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}` && req.headers['x-cron-secret'] !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized cron invocation' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Supabase credentials missing' });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // 2. Fetch migration_config singleton
    const { data: config, error: cfgErr } = await adminClient
      .from('migration_config')
      .select('*')
      .eq('id', 1)
      .single();

    if (cfgErr || !config) {
      return res.status(500).json({ error: 'Migration configuration missing' });
    }

    // Check Kill Switch
    if (config.paused) {
      return res.status(200).json({ status: 'paused', message: 'Migration campaign is paused via kill switch.' });
    }

    // Check Approval Status
    if (!config.approved_at) {
      return res.status(200).json({ status: 'unapproved', message: 'Migration has not been approved by owner.' });
    }

    // Check Env Flag Guard
    const isSendEnabled = process.env.MIGRATION_SEND_ENABLED === 'true';

    const now = new Date();
    const noticeAt = new Date(config.notice_at);
    const cutoverAt = new Date(config.cutover_at);
    const windowEnd = new Date(cutoverAt.getTime() + (config.window_days || 30) * 86400000);

    // Stop if campaign window has expired
    if (now > windowEnd) {
      return res.status(200).json({ status: 'window_expired', message: 'Campaign window has elapsed.' });
    }

    // Determine current campaign phase
    let currentPhase = null;
    if (now >= cutoverAt) {
      currentPhase = 'cutover_active';
    } else if (now >= noticeAt) {
      currentPhase = 'notice_active';
    } else {
      return res.status(200).json({ status: 'waiting_for_schedule', notice_at: config.notice_at });
    }

    const batchSize = config.batch_size || 25;
    let processedCount = 0;

    // 3. Process Batch: Notice Phase
    if (currentPhase === 'notice_active') {
      const { data: batch } = await adminClient
        .from('legacy_accounts')
        .select('legacy_id, email_normalized, status')
        .eq('status', 'pending')
        .limit(batchSize);

      if (batch && batch.length > 0) {
        for (const account of batch) {
          // Fetch user first name from public.users
          const { data: u } = await adminClient
            .from('users')
            .select('name')
            .eq('id', account.legacy_id)
            .maybeSingle();

          const firstName = u?.name ? u.name.split(' ')[0] : 'Team Member';
          const templateVars = {
            first_name: firstName,
            notice_date: cutoverAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            support_email: 'support@digihust.tech',
            support_email_recipient: account.email_normalized
          };

          const { html, text } = loadTemplate('notice', templateVars);

          if (isSendEnabled) {
            const msgId = await dispatchEmail({
              to: account.email_normalized,
              subject: `Heads-up: DigiHust account security upgrade on ${templateVars.notice_date}`,
              html,
              text
            });

            await adminClient.from('emails_sent').insert({
              account_id: account.legacy_id,
              template: 'notice',
              provider_message_id: msgId,
              status: 'sent'
            });
          }

          await adminClient
            .from('legacy_accounts')
            .update({
              status: 'notice_sent',
              notice_sent_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('legacy_id', account.legacy_id);

          processedCount++;
        }
      }
    }

    // 4. Process Batch: Cutover & Reminder Phase
    if (currentPhase === 'cutover_active') {
      // Step A: Accounts that need initial cutover reset link
      const { data: cutoverBatch } = await adminClient
        .from('legacy_accounts')
        .select('legacy_id, email_normalized, status')
        .in('status', ['pending', 'notice_sent'])
        .is('reset_sent_at', null)
        .limit(batchSize);

      if (cutoverBatch && cutoverBatch.length > 0) {
        for (const account of cutoverBatch) {
          const { data: u } = await adminClient
            .from('users')
            .select('name')
            .eq('id', account.legacy_id)
            .maybeSingle();

          const firstName = u?.name ? u.name.split(' ')[0] : 'Team Member';

          // Generate one-time recovery link (24h validity for cutover window)
          let resetLink = 'https://www.digihust.tech/portal/login?reset=needed';
          try {
            const { data: linkData } = await adminClient.auth.admin.generateLink({
              type: 'recovery',
              email: account.email_normalized,
              options: {
                redirectTo: 'https://www.digihust.tech/reset-password'
              }
            });
            if (linkData?.properties?.action_link) {
              resetLink = linkData.properties.action_link;
            }
          } catch (_) {}

          const templateVars = {
            first_name: firstName,
            notice_date: cutoverAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            reset_link: resetLink,
            expiry: '24 hours',
            support_email: 'support@digihust.tech',
            support_email_recipient: account.email_normalized
          };

          const { html, text } = loadTemplate('cutover', templateVars);

          if (isSendEnabled) {
            const msgId = await dispatchEmail({
              to: account.email_normalized,
              subject: 'Action needed: set your new DigiHust password',
              html,
              text
            });

            await adminClient.from('emails_sent').insert({
              account_id: account.legacy_id,
              template: 'cutover',
              provider_message_id: msgId,
              status: 'sent'
            });
          }

          await adminClient
            .from('legacy_accounts')
            .update({
              status: 'reset_sent',
              reset_sent_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('legacy_id', account.legacy_id);

          processedCount++;
        }
      }

      // Step B: Scheduled Reminders (cutover + 3 days & cutover + 7 days)
      const daysSinceCutover = (now.getTime() - cutoverAt.getTime()) / 86400000;

      if (processedCount < batchSize && daysSinceCutover >= 3) {
        // Query accounts eligible for Reminder 1 (reminder_count = 0)
        const { data: rem1Batch } = await adminClient
          .from('legacy_accounts')
          .select('legacy_id, email_normalized, reminder_count')
          .eq('status', 'reset_sent')
          .eq('reminder_count', 0)
          .limit(batchSize - processedCount);

        if (rem1Batch && rem1Batch.length > 0) {
          for (const account of rem1Batch) {
            const { data: u } = await adminClient
              .from('users')
              .select('name')
              .eq('id', account.legacy_id)
              .maybeSingle();

            let resetLink = 'https://www.digihust.tech/portal/login?reset=needed';
            try {
              const { data: linkData } = await adminClient.auth.admin.generateLink({
                type: 'recovery',
                email: account.email_normalized,
                options: { redirectTo: 'https://www.digihust.tech/reset-password' }
              });
              if (linkData?.properties?.action_link) resetLink = linkData.properties.action_link;
            } catch (_) {}

            const templateVars = {
              first_name: u?.name ? u.name.split(' ')[0] : 'Team Member',
              reset_link: resetLink,
              expiry: '24 hours',
              support_email: 'support@digihust.tech',
              support_email_recipient: account.email_normalized
            };

            const { html, text } = loadTemplate('reminder_1', templateVars);

            if (isSendEnabled) {
              const msgId = await dispatchEmail({
                to: account.email_normalized,
                subject: 'Reminder: Please set your new DigiHust password',
                html,
                text
              });

              await adminClient.from('emails_sent').insert({
                account_id: account.legacy_id,
                template: 'reminder_1',
                provider_message_id: msgId,
                status: 'sent'
              });
            }

            await adminClient
              .from('legacy_accounts')
              .update({
                reminder_count: 1,
                last_reminder_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('legacy_id', account.legacy_id);

            processedCount++;
          }
        }
      }

      // Step C: Reminder 2 (cutover + 7 days, reminder_count = 1)
      if (processedCount < batchSize && daysSinceCutover >= 7) {
        const { data: rem2Batch } = await adminClient
          .from('legacy_accounts')
          .select('legacy_id, email_normalized, reminder_count')
          .eq('status', 'reset_sent')
          .eq('reminder_count', 1)
          .limit(batchSize - processedCount);

        if (rem2Batch && rem2Batch.length > 0) {
          for (const account of rem2Batch) {
            const { data: u } = await adminClient
              .from('users')
              .select('name')
              .eq('id', account.legacy_id)
              .maybeSingle();

            let resetLink = 'https://www.digihust.tech/portal/login?reset=needed';
            try {
              const { data: linkData } = await adminClient.auth.admin.generateLink({
                type: 'recovery',
                email: account.email_normalized,
                options: { redirectTo: 'https://www.digihust.tech/reset-password' }
              });
              if (linkData?.properties?.action_link) resetLink = linkData.properties.action_link;
            } catch (_) {}

            const templateVars = {
              first_name: u?.name ? u.name.split(' ')[0] : 'Team Member',
              reset_link: resetLink,
              expiry: '24 hours',
              support_email: 'support@digihust.tech',
              support_email_recipient: account.email_normalized
            };

            const { html, text } = loadTemplate('reminder_2', templateVars);

            if (isSendEnabled) {
              const msgId = await dispatchEmail({
                to: account.email_normalized,
                subject: 'Final reminder: update your DigiHust account password',
                html,
                text
              });

              await adminClient.from('emails_sent').insert({
                account_id: account.legacy_id,
                template: 'reminder_2',
                provider_message_id: msgId,
                status: 'sent'
              });
            }

            await adminClient
              .from('legacy_accounts')
              .update({
                reminder_count: 2,
                last_reminder_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('legacy_id', account.legacy_id);

            processedCount++;
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      phase: currentPhase,
      processed: processedCount,
      live_sending_active: isSendEnabled
    });

  } catch (err) {
    return res.status(500).json({ error: 'Migration job tick failed' });
  }
}
