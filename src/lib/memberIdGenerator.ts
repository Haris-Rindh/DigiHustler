/**
 * DigiHust Member ID Scheme Generator
 * Format: DGH + last two digits of join year + 5-digit continuous lifetime sequence (e.g. DGH2600147)
 *
 * The counter is derived from the live Supabase user count so all devices always
 * generate unique, non-colliding IDs — no localStorage dependency.
 * For synchronous contexts (where async is not possible), a local fallback
 * uses the localStorage counter as a best-effort approach.
 */

import { dbService } from './dbService';

const ID_COUNTER_STORAGE_KEY = 'digihust_lifetime_id_counter';

/**
 * Async version — derives counter from cloud user count.
 * Use this whenever you can await (preferred, collision-safe).
 */
export async function getNextMemberIdAsync(joinYear?: number): Promise<{ memberId: string; newCounter: number }> {
  const currentYear = joinYear || new Date().getFullYear();
  const yearDigits = String(currentYear).slice(-2);

  // Get user count from Supabase cloud — accurate on all devices
  let cloudCount = 0;
  try {
    cloudCount = await dbService.getCloudUserCount();
  } catch {
    const savedCounter = localStorage.getItem(ID_COUNTER_STORAGE_KEY);
    cloudCount = savedCounter ? parseInt(savedCounter, 10) : 146;
  }

  // Always generate IDs above the baseline of 147
  const nextCounter = Math.max(cloudCount + 1, 147);
  try { localStorage.setItem(ID_COUNTER_STORAGE_KEY, String(nextCounter)); } catch {}

  const paddedSequence = String(nextCounter).padStart(5, '0');
  const memberId = `DGH${yearDigits}${paddedSequence}`;
  return { memberId, newCounter: nextCounter };
}

/**
 * Synchronous version — uses localStorage counter (fallback only).
 * May produce duplicate IDs if used on two devices simultaneously.
 * Prefer getNextMemberIdAsync() when possible.
 */
export function getNextMemberId(joinYear?: number): { memberId: string; newCounter: number } {
  const currentYear = joinYear || new Date().getFullYear();
  const yearDigits = String(currentYear).slice(-2);

  const savedCounter = localStorage.getItem(ID_COUNTER_STORAGE_KEY);
  const currentCounter = savedCounter ? parseInt(savedCounter, 10) : 146;
  const nextCounter = currentCounter + 1;
  try { localStorage.setItem(ID_COUNTER_STORAGE_KEY, String(nextCounter)); } catch {}

  const paddedSequence = String(nextCounter).padStart(5, '0');
  const memberId = `DGH${yearDigits}${paddedSequence}`;
  return { memberId, newCounter: nextCounter };
}

export function peekNextMemberId(joinYear?: number): string {
  const currentYear = joinYear || new Date().getFullYear();
  const yearDigits = String(currentYear).slice(-2);
  const savedCounter = localStorage.getItem(ID_COUNTER_STORAGE_KEY);
  const currentCounter = savedCounter ? parseInt(savedCounter, 10) : 146;
  const nextCounter = currentCounter + 1;
  const paddedSequence = String(nextCounter).padStart(5, '0');
  return `DGH${yearDigits}${paddedSequence}`;
}
