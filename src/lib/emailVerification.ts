/**
 * Comprehensive Email Validation & Existence Verification Service
 * DigiHust Platform
 *
 * Verifies:
 * 1. Email Format & Syntax (RFC 5322 compliance, no illegal characters)
 * 2. Provider-Specific Rules (Gmail 6-30 char limit, dot placement, Yahoo/Outlook rules)
 * 3. Typo Detection & Domain Corrections (e.g. gmai.com -> gmail.com)
 * 4. Disposable / Temporary Email Domain Blocklist
 * 5. Domain MX DNS Records (via Google DoH & Cloudflare DoH)
 * 6. Live Mailbox Existence on the Internet (SMTP handshake on Port 25 via /api/verify-email)
 */

export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'yopmail.com',
  'trashmail.com',
  'trashmail.net',
  'sharklasers.com',
  'dispostable.com',
  'getairmail.com',
  'mohmal.com',
  'fakeinbox.com',
  'temp-mail.org',
  'tempail.com',
  'burnermail.io',
  'crazymailing.com',
  'maildrop.cc',
  'inboxkitten.com',
  'mytemp.email',
  'generator.email',
  'emailfake.com',
  'byom.de',
  'fakemailgenerator.com',
  'tempmailaddress.com',
  'discard.email',
  'dropmail.me',
  'nada.ltd',
  'getnada.com',
  'minuteinbox.com',
  'fakemail.net',
]);

const DOMAIN_TYPO_MAP: Record<string, string> = {
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmeil.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmaik.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yhaoo.com': 'yahoo.com',
  'yaho.co': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotamail.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'icluod.com': 'icloud.com',
  'iclod.com': 'icloud.com',
};

export interface EmailFormatCheckResult {
  isValid: boolean;
  error?: string;
  domain?: string;
  username?: string;
  suggestion?: string;
}

export interface EmailExistenceResult {
  exists: boolean;
  message?: string;
  reason?: string;
  code?: number;
}

/**
 * Validates email formatting, syntax, provider constraints, and typo detection.
 */
export const validateEmailFormat = (email: string): EmailFormatCheckResult => {
  const trimmed = (email || '').trim();

  if (!trimmed) {
    return { isValid: false, error: 'Please provide your email address' };
  }

  // General RFC compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid work email address (e.g. name@company.com)',
    };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Invalid email address structure.' };
  }

  const username = parts[0];
  const domain = parts[1].toLowerCase().trim();

  // Basic domain format check
  if (!domain.includes('.') || domain.endsWith('.')) {
    return { isValid: false, error: 'Email domain must have a valid extension (e.g. .com, .org, .net)' };
  }

  // Typo detection for prominent mail providers
  if (DOMAIN_TYPO_MAP[domain]) {
    const suggestedDomain = DOMAIN_TYPO_MAP[domain];
    return {
      isValid: false,
      error: `Did you mean @${suggestedDomain}? Please double-check your email spelling.`,
      suggestion: `${username}@${suggestedDomain}`,
    };
  }

  // Disposable email check
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: 'Disposable or temporary email addresses are not accepted. Please provide a genuine email.',
    };
  }

  // Provider-specific syntax checks:
  // 1. Google / Gmail
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    // Google usernames must be 6 to 30 characters
    if (username.length < 6) {
      return {
        isValid: false,
        error: 'Google accounts must have an email username of at least 6 characters.',
      };
    }
    if (username.length > 30) {
      return {
        isValid: false,
        error: 'Google accounts cannot have an email username exceeding 30 characters.',
      };
    }
    // Google only allows letters (a-z), numbers (0-9), and periods (.) in primary username
    if (!/^[a-zA-Z0-9.]+$/.test(username)) {
      return {
        isValid: false,
        error: 'Gmail addresses can only contain letters, numbers, and periods (no special symbols).',
      };
    }
    // Cannot have consecutive periods
    if (username.includes('..')) {
      return {
        isValid: false,
        error: 'Gmail addresses cannot contain consecutive periods (..).',
      };
    }
    // Cannot start or end with a period
    if (username.startsWith('.') || username.endsWith('.')) {
      return {
        isValid: false,
        error: 'Gmail addresses cannot start or end with a period.',
      };
    }
  }

  // 2. Yahoo
  if (domain === 'yahoo.com' || domain === 'ymail.com') {
    if (username.length < 4 || username.length > 32) {
      return {
        isValid: false,
        error: 'Yahoo email usernames must be between 4 and 32 characters long.',
      };
    }
    if (!/^[a-zA-Z][a-zA-Z0-9._]*$/.test(username)) {
      return {
        isValid: false,
        error: 'Yahoo email addresses must start with a letter.',
      };
    }
  }

  // 3. Microsoft / Outlook / Hotmail
  if (['outlook.com', 'hotmail.com', 'live.com'].includes(domain)) {
    if (username.startsWith('.') || username.endsWith('.')) {
      return {
        isValid: false,
        error: 'Microsoft email addresses cannot start or end with a period.',
      };
    }
  }

  return {
    isValid: true,
    domain,
    username,
  };
};

/**
 * Verifies domain DNS and MX records via DNS-over-HTTPS (DoH).
 */
export const verifyEmailDomainDns = async (domain: string): Promise<{ exists: boolean; message?: string }> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const mxRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`, {
      signal: controller.signal,
      headers: { Accept: 'application/dns-json' },
    });
    clearTimeout(timeout);

    if (mxRes.ok) {
      const data = await mxRes.json();
      if (data.Status === 3) {
        return {
          exists: false,
          message: `The email domain "@${domain}" does not exist on the internet. Please check your spelling.`,
        };
      }
      if (data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0) {
        return { exists: true };
      }
    }

    // Fallback: Check root A record via Cloudflare DoH
    const cfController = new AbortController();
    const cfTimeout = setTimeout(() => cfController.abort(), 3500);
    const cfRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`, {
      signal: cfController.signal,
      headers: { Accept: 'application/dns-json' },
    });
    clearTimeout(cfTimeout);

    if (cfRes.ok) {
      const cfData = await cfRes.json();
      if (cfData.Status === 3) {
        return {
          exists: false,
          message: `The email domain "@${domain}" does not exist on the internet. Please check your spelling.`,
        };
      }
      if (cfData.Status === 0 && Array.isArray(cfData.Answer) && cfData.Answer.length > 0) {
        return { exists: true };
      }
    }

    return {
      exists: false,
      message: `The domain "@${domain}" has no active mail server. Please provide a working email.`,
    };
  } catch (err) {
    console.warn('DNS lookup fallback warning:', err);
    // Fail-open so temporary client DNS interruptions don't prevent submission
    return { exists: true };
  }
};

/**
 * Verifies that the email mailbox physically exists on the internet
 * by performing real-time mailbox check against the mail exchange server.
 */
export const verifyEmailExistence = async (email: string): Promise<EmailExistenceResult> => {
  const trimmed = (email || '').trim();

  // 1. Format check
  const formatCheck = validateEmailFormat(trimmed);
  if (!formatCheck.isValid) {
    return {
      exists: false,
      reason: 'format_invalid',
      message: formatCheck.error,
    };
  }

  // 2. Domain DNS MX check
  if (formatCheck.domain) {
    const dnsResult = await verifyEmailDomainDns(formatCheck.domain);
    if (!dnsResult.exists) {
      return {
        exists: false,
        reason: 'domain_not_found',
        message: dnsResult.message,
      };
    }
  }

  // 3. Mailbox SMTP Handshake via API route (/api/verify-email)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`/api/verify-email?email=${encodeURIComponent(trimmed)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data.exists === false) {
        return {
          exists: false,
          reason: data.reason || 'mailbox_not_found',
          message: data.message || `The email account "${trimmed}" does not exist on the internet. Please check your spelling and retype it.`,
          code: data.code,
        };
      }
      return {
        exists: true,
        message: data.message || 'Email mailbox verified successfully.',
      };
    }
  } catch (err) {
    console.warn('Mailbox verification endpoint warning (failing open):', err);
  }

  // If the serverless endpoint or port 25 times out or is unreachable,
  // we do not block legitimate users if DNS is already confirmed valid.
  return {
    exists: true,
    message: 'Domain and email structure verified.',
  };
};
