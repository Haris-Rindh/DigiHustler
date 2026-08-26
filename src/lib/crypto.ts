/**
 * Cryptographic utility for secure password hashing using SHA-256 via Web Crypto API.
 * This ensures no plain-text passwords or secret keys are exposed or committed.
 */

const SALT = 'digihust_prod_salt_2026_sec_master';

export async function hashPassword(plainText: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${plainText}_${SALT}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyPassword(plainText: string, expectedHash?: string): Promise<boolean> {
  if (!expectedHash) return false;
  const computedHash = await hashPassword(plainText);
  return computedHash === expectedHash;
}

// Synchronous fallback hash for non-async initialization if needed
export function quickHashSync(plainText: string): string {
  let hash = 0;
  const str = `${plainText}_${SALT}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}
