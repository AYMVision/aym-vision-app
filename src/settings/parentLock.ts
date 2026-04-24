// src/settings/parentLock.ts
const KEY_HASH = 'aym_parent_pass_hash_v1';
const KEY_UNLOCK_UNTIL = 'aym_parent_unlock_until_v1';

// Master-Reset-Code — dokumentiert in FAQ und auf der Website
export const MASTER_RESET_CODE = 'AYM-RESET-2025';

function bufToHex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(input: string) {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return bufToHex(hash);
}

export function hasParentPasscode(): boolean {
  return Boolean(localStorage.getItem(KEY_HASH));
}

export async function setParentPasscode(pass: string): Promise<boolean> {
  const p = String(pass ?? '').trim();
  if (p.length < 6) return false;
  const h = await sha256Hex(p);
  localStorage.setItem(KEY_HASH, h);
  return true;
}

export async function verifyParentPasscode(pass: string): Promise<boolean> {
  const stored = localStorage.getItem(KEY_HASH);
  if (!stored) return false;
  const h = await sha256Hex(String(pass ?? '').trim());
  return h === stored;
}

export function setParentUnlockedForMinutes(minutes = 10) {
  const until = Date.now() + minutes * 60 * 1000;
  localStorage.setItem(KEY_UNLOCK_UNTIL, String(until));
}

export function isParentUnlocked(): boolean {
  const raw = localStorage.getItem(KEY_UNLOCK_UNTIL);
  const until = Number(raw ?? 0);
  return Number.isFinite(until) && until > Date.now();
}

export function lockParentNow() {
  localStorage.removeItem(KEY_UNLOCK_UNTIL);
}

export function resetParentPasscode(): void {
  localStorage.removeItem(KEY_HASH);
  localStorage.removeItem(KEY_UNLOCK_UNTIL);
}
