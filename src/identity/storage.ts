import { generateIdentity, type AymIdentity } from './keys';
import { pStorage } from '../profile/profileStorage';

const KEY = 'aym_identity';

export type StoredIdentity = AymIdentity & {
  backupConfirmedAt: number | null;
  createdAt: number;
};

export function loadIdentity(): StoredIdentity | null {
  try {
    const raw = pStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredIdentity;
  } catch {
    return null;
  }
}

function persistIdentity(id: StoredIdentity): StoredIdentity {
  pStorage.setItem(KEY, JSON.stringify(id));
  return id;
}

export async function ensureIdentity(): Promise<StoredIdentity> {
  const existing = loadIdentity();
  if (existing?.publicKeyHex) return existing;

  // Migration: altes geräteweites aym_identity → pStorage des aktiven Profils
  try {
    const legacyRaw = localStorage.getItem(KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw) as StoredIdentity;
      if (legacy?.publicKeyHex) {
        persistIdentity(legacy);
        localStorage.removeItem(KEY);
        return legacy;
      }
    }
  } catch { /* ignore */ }

  const generated = await generateIdentity();
  return persistIdentity({ ...generated, backupConfirmedAt: null, createdAt: Date.now() });
}

export function markBackupConfirmed(): StoredIdentity {
  const existing = loadIdentity();
  if (!existing) throw new Error('No identity to confirm');
  return persistIdentity({ ...existing, backupConfirmedAt: Date.now() });
}

export function saveRestoredIdentity(identity: AymIdentity): StoredIdentity {
  const stored: StoredIdentity = { ...identity, backupConfirmedAt: Date.now(), createdAt: Date.now() };
  return persistIdentity(stored);
}
