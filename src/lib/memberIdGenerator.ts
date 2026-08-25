/**
 * DigiHust Member ID Scheme Generator
 * Format: DGH + last two digits of join year + 5-digit continuous lifetime sequence (e.g. DGH2600147)
 * The sequence is a single continuous counter for the organization's lifetime (does not reset each year).
 */

const ID_COUNTER_STORAGE_KEY = 'digihust_lifetime_id_counter';

export function getNextMemberId(joinYear?: number): { memberId: string; newCounter: number } {
  const currentYear = joinYear || new Date().getFullYear();
  const yearDigits = String(currentYear).slice(-2);

  // Retrieve current atomic counter from localStorage
  const savedCounter = localStorage.getItem(ID_COUNTER_STORAGE_KEY);
  const currentCounter = savedCounter ? parseInt(savedCounter, 10) : 146; // Defaults to starting point

  const nextCounter = currentCounter + 1;
  localStorage.setItem(ID_COUNTER_STORAGE_KEY, String(nextCounter));

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
