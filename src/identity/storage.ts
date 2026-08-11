import { generateIdentity, type AymIdentity } from './keys';

const KEY = 'aym_identity';

export type StoredIdentity = AymIdentity & {
  backupConfirmedAt: number | null;
  createdAt: number;
};

export function loadIdentity(): StoredIdentity | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredIdentity;
  } catch {
    return null;
  }
}

function persistIdentity(id: StoredIdentity): StoredIdentity {
  localStorage.setItem(KEY, JSON.stringify(id));
  return id;
}

export async function ensureIdentity(): Promise<StoredIdentity> {
  const existing = loadIdentity();
  if (existing?.publicKeyHex) return existing;
  const generated = await generateIdentity();
  return persistIdentity({ ...generated, backupConfirmedAt: null, createdAt: Date.now() });
}

export function markBackupConfirmed(): StoredIdentity {
  const existing = loadIdentity();
  if (!existing) throw new Error('No identity to confirm');
  return persistIdentity({ ...existing, backupConfirmedAt: Date.now() });
}
