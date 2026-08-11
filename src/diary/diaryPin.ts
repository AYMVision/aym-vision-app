// src/diary/diaryPin.ts
import { pStorage } from '../profile/profileStorage';

const KEY_HASH = 'aym_diary_pin_hash_v1';
const KEY_HINT = 'aym_diary_pin_hint_v1';

function bufToHex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(input: string) {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return bufToHex(hash);
}

export function hasDiaryPin(): boolean {
  return Boolean(pStorage.getItem(KEY_HASH));
}

/** Setzt den Tagebuch-PIN. Mindestens 4 Zeichen. */
export async function setDiaryPin(pin: string, hint = ''): Promise<boolean> {
  const p = String(pin ?? '').trim();
  if (p.length < 4) return false;
  const h = await sha256Hex(p);
  pStorage.setItem(KEY_HASH, h);
  if (hint.trim()) {
    pStorage.setItem(KEY_HINT, hint.trim());
  } else {
    pStorage.removeItem(KEY_HINT);
  }
  return true;
}

export async function verifyDiaryPin(pin: string): Promise<boolean> {
  const stored = pStorage.getItem(KEY_HASH);
  if (!stored) return false;
  const h = await sha256Hex(String(pin ?? '').trim());
  return h === stored;
}

export function getDiaryPinHint(): string | null {
  return pStorage.getItem(KEY_HINT);
}

/** Wird vom Elternbereich aufgerufen – löscht PIN + Hint, Einträge bleiben erhalten. */
export function resetDiaryPin(): void {
  pStorage.removeItem(KEY_HASH);
  pStorage.removeItem(KEY_HINT);
}
