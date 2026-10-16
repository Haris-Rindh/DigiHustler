import dns from 'dns';
import net from 'net';

/**
 * Validates whether an email mailbox physically exists on its destination mail server
 * via an RFC-compliant SMTP handshake on port 25.
 *
 * @param {string} email
 * @param {number} timeoutMs
 * @returns {Promise<{ exists: boolean; reason?: string; message?: string; details?: any }>}
 */
export async function verifyMailboxSmtp(email, timeoutMs = 6000) {
  try {
    const trimmed = (email || '').trim().toLowerCase();
    const parts = trimmed.split('@');
    if (parts.length !== 2) {
      return {
        exists: false,
        reason: 'invalid_format',
        message: 'Invalid email address structure.',
      };
    }

    const [user, domain] = parts;

    // 1. Resolve MX records for the domain
    let mxRecords = [];
    try {
      mxRecords = await dns.promises.resolveMx(domain);
    } catch (dnsErr) {
      // If no MX records, check if domain has an A record (some domains accept mail on root A record)
      try {
        const aRecords = await dns.promises.resolve4(domain);
        if (!aRecords || aRecords.length === 0) {
          return {
            exists: false,
            reason: 'no_mail_server',
            message: `The domain "@${domain}" does not exist or has no active mail server.`,
          };
        }
        mxRecords = [{ exchange: domain, priority: 10 }];
      } catch (_) {
        return {
          exists: false,
          reason: 'no_mail_server',
          message: `The domain "@${domain}" does not exist on the internet.`,
        };
      }
    }

    if (!mxRecords || mxRecords.length === 0) {
      return {
        exists: false,
        reason: 'no_mx_records',
        message: `The domain "@${domain}" does not have any mail exchange (MX) servers configured.`,
      };
    }

    mxRecords.sort((a, b) => a.priority - b.priority);
    const mxHost = mxRecords[0].exchange;

    // 2. Perform SMTP Handshake on Port 25
    return await new Promise((resolve) => {
      let resolved = false;
      const finish = (result) => {
        if (resolved) return;
        resolved = true;
        try {
          socket.write('QUIT\r\n');
          socket.end();
        } catch (_) {}
        resolve(result);
      };

      const socket = net.createConnection(25, mxHost);
      let buffer = '';
      let stage = 'WAIT_GREETING';

      socket.setTimeout(timeoutMs);

      socket.on('timeout', () => {
        socket.destroy();
        // Fail-open on network timeout to avoid blocking legitimate users on slow networks
        finish({
          exists: true,
          reason: 'timeout_fail_open',
          message: 'Mail server took too long to respond; proceeding with submission.',
        });
      });

      socket.on('error', (err) => {
        socket.destroy();
        // Fail-open if port 25 is blocked or restricted by host/ISP
        finish({
          exists: true,
          reason: 'socket_error_fail_open',
          details: err.message,
        });
      });

      socket.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\r\n');
        buffer = lines.pop(); // keep last incomplete line in buffer

        for (const line of lines) {
          if (!line) continue;
          const code = parseInt(line.substring(0, 3), 10);
          // Standard SMTP: line is continuation if 4th char is '-' (e.g. 250-something)
          // Line is terminal if 4th char is space or end of code (e.g. 250 OK)
          const isTerminal = line.length === 3 || line.charAt(3) === ' ';
          if (!isTerminal) continue;

          if (stage === 'WAIT_GREETING') {
            if (code === 220) {
              stage = 'WAIT_HELO';
              socket.write('HELO mail.digihust.tech\r\n');
            } else {
              finish({
                exists: true,
                reason: 'greeting_aborted_fail_open',
                code,
              });
            }
          } else if (stage === 'WAIT_HELO') {
            if (code === 250) {
              stage = 'WAIT_MAIL';
              socket.write('MAIL FROM:<verify@digihust.tech>\r\n');
            } else {
              finish({
                exists: true,
                reason: 'helo_rejected_fail_open',
                code,
              });
            }
          } else if (stage === 'WAIT_MAIL') {
            if (code === 250) {
              stage = 'WAIT_RCPT';
              socket.write(`RCPT TO:<${trimmed}>\r\n`);
            } else {
              finish({
                exists: true,
                reason: 'mail_from_rejected_fail_open',
                code,
              });
            }
          } else if (stage === 'WAIT_RCPT') {
            const lowerLine = line.toLowerCase();
            const isNonExistent =
              [550, 551, 552, 553, 554].includes(code) ||
              lowerLine.includes('does not exist') ||
              lowerLine.includes('nosuchuser') ||
              lowerLine.includes('no such user') ||
              lowerLine.includes('user unknown') ||
              lowerLine.includes('user not found') ||
              lowerLine.includes('invalid recipient') ||
              lowerLine.includes('recipient rejected') ||
              lowerLine.includes('undeliverable') ||
              lowerLine.includes('mailbox unavailable');

            if (isNonExistent) {
              finish({
                exists: false,
                code,
                reason: 'mailbox_not_found',
                message: `This email account does not exist on ${domain.includes('gmail') ? 'Google' : domain}. Please check your spelling and retype it.`,
                rawResponse: line,
              });
            } else if (code === 250) {
              finish({
                exists: true,
                code: 250,
                message: 'Mailbox verified and active.',
              });
            } else {
              // 450, 451, 452 (greylisting, rate limit, or security guard) -> fail-open
              finish({
                exists: true,
                code,
                reason: 'greylisted_fail_open',
                message: 'Mailbox check passed.',
              });
            }
          }
        }
      });
    });
  } catch (err) {
    return {
      exists: true,
      reason: 'unexpected_error_fail_open',
      details: err?.message,
    };
  }
}
