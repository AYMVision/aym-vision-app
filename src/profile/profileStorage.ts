// src/profile/profileStorage.ts
// Profile-aware localStorage wrapper.
// Alle profil-gebundenen Keys werden automatisch mit der aktiven Profil-ID prefixed.

const ACTIVE_PROFILE_KEY = 'aym_active_profile';

export function getActiveProfileId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY);
  } catch {
    return null;
  }
}

export function setActiveProfileId(id: string | null): void {
  try {
    if (id) localStorage.setItem(ACTIVE_PROFILE_KEY, id);
    else localStorage.removeItem(ACTIVE_PROFILE_KEY);
  } catch { /* */ }
}

function scopedKey(key: string): string {
  const id = getActiveProfileId();
  if (!id) return key; // Fallback: kein aktives Profil → Key unverändert
  return `aym_p_${id}__${key}`;
}

export const pStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(scopedKey(key));
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(scopedKey(key), value);
    } catch { /* Quota ignorieren */ }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(scopedKey(key));
    } catch { /* */ }
  },
  /** Alle rohen (geprefixten) Keys des aktiven Profils – für Reset / Transfer */
  allScopedKeys(): string[] {
    const id = getActiveProfileId();
    if (!id) return [];
    const prefix = `aym_p_${id}__`;
    const result: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(prefix)) result.push(k);
    }
    return result;
  },
  /** Entfernt das Profil-Prefix von einem bereits geprefixten Key */
  unscopedKey(rawKey: string): string {
    const id = getActiveProfileId();
    if (!id) return rawKey;
    const prefix = `aym_p_${id}__`;
    return rawKey.startsWith(prefix) ? rawKey.slice(prefix.length) : rawKey;
  },
};
