// src/diary/diaryPin.ts
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
  return Boolean(localStorage.getItem(KEY_HASH));
}

/** Setzt den Tagebuch-PIN. Mindestens 4 Zeichen. */
export async function setDiaryPin(pin: string, hint = ''): Promise<boolean> {
  const p = String(pin ?? '').trim();
  if (p.length < 4) return false;
  const h = await sha256Hex(p);
  localStorage.setItem(KEY_HASH, h);
  if (hint.trim()) {
    localStorage.setItem(KEY_HINT, hint.trim());
  } else {
    localStorage.removeItem(KEY_HINT);
  }
  return true;
}

export async function verifyDiaryPin(pin: string): Promise<boolean> {
  const stored = localStorage.getItem(KEY_HASH);
  if (!stored) return false;
  const h = await sha256Hex(String(pin ?? '').trim());
  return h === stored;
}

export function getDiaryPinHint(): string | null {
  return localStorage.getItem(KEY_HINT);
}

/** Wird vom Elternbereich aufgerufen – löscht PIN + Hint, Einträge bleiben erhalten. */
export function resetDiaryPin(): void {
  localStorage.removeItem(KEY_HASH);
  localStorage.removeItem(KEY_HINT);
}
