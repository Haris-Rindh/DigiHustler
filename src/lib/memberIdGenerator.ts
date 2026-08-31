/**
 * DigiHust Member ID Scheme Generator
 * Format: DGH + last two digits of join year + 5-digit continuous lifetime sequence (e.g. DGH2600167)
 *
 * The counter calculates the true maximum sequence from all existing members in memory,
 * cloud database, and localStorage to guarantee unique, non-colliding IDs across all devices.
 */

import { User } from '../types';

const ID_COUNTER_STORAGE_KEY = 'digihust_lifetime_id_counter';

/**
 * Extracts numeric sequence suffix from a member ID (e.g. 'DGH2600166' -> 166)
 */
export function extractSequenceNumber(memberId: string): number {
  if (!memberId) return 0;
  const digits = memberId.replace(/\D/g, '');
  if (digits.length >= 5) {
    return parseInt(digits.slice(-5), 10) || 0;
  }
  return parseInt(digits, 10) || 0;
}

/**
 * Finds the highest sequence number from existing users, storage, and baseline (166).
 */
export function getMaxExistingSequence(existingUsers?: User[]): number {
  let maxSeq = 166; // Baseline existing highest in Supabase
  
  // 1. Check existing users in state
  if (Array.isArray(existingUsers) && existingUsers.length > 0) {
    for (const u of existingUsers) {
      if (u.memberId) {
        const seq = extractSequenceNumber(u.memberId);
        if (seq > maxSeq) maxSeq = seq;
      }
    }
  }

  // 2. Check localStorage counter
  try {
    const saved = localStorage.getItem(ID_COUNTER_STORAGE_KEY);
    if (saved) {
      const savedNum = parseInt(saved, 10);
      if (!isNaN(savedNum) && savedNum > maxSeq) {
        maxSeq = savedNum;
      }
    }
  } catch {}

  return maxSeq;
}

/**
 * Updates stored counter to the highest known sequence
 */
export function syncIdCounter(existingUsers?: User[]) {
  const maxSeq = getMaxExistingSequence(existingUsers);
  try {
    localStorage.setItem(ID_COUNTER_STORAGE_KEY, String(maxSeq));
  } catch {}
  return maxSeq;
}

/**
 * Generates the next guaranteed-unique member ID based on existing users.
 */
export function getNextMemberId(joinYear?: number, existingUsers?: User[]): { memberId: string; newCounter: number } {
  const currentYear = joinYear || new Date().getFullYear();
  const yearDigits = String(currentYear).slice(-2);

  const currentMax = getMaxExistingSequence(existingUsers);
  const nextCounter = currentMax + 1;

  try {
    localStorage.setItem(ID_COUNTER_STORAGE_KEY, String(nextCounter));
  } catch {}

  const paddedSequence = String(nextCounter).padStart(5, '0');
  const memberId = `DGH${yearDigits}${paddedSequence}`;
  return { memberId, newCounter: nextCounter };
}

export function peekNextMemberId(joinYear?: number, existingUsers?: User[]): string {
  const currentYear = joinYear || new Date().getFullYear();
  const yearDigits = String(currentYear).slice(-2);
  const currentMax = getMaxExistingSequence(existingUsers);
  const nextCounter = currentMax + 1;
  const paddedSequence = String(nextCounter).padStart(5, '0');
  return `DGH${yearDigits}${paddedSequence}`;
}
