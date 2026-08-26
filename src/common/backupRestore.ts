// src/common/backupRestore.ts
import LZString from 'lz-string';
import { gcm } from '@noble/ciphers/aes.js';
import { randomBytes } from '@noble/ciphers/utils.js';
import { deriveBackupEncryptionKey } from '../identity/keys';

const BACKUP_VERSION = 2;

// Excluded from backup: session state, device-bound hashes
const EXCLUDED_PREFIXES = [
  'aym_parent_pass_hash',
  'aym_parent_unlock_until',
  'aym_diary_pin_hash',
  'aym_ml_',
];

function isExcluded(key: string): boolean {
  return EXCLUDED_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function isAymKey(key: string): boolean {
  return key.startsWith('aym_') || key.startsWith('aym-');
}

type AymBackupV1 = {
  version: 1;
  exportedAt: string;
  data: Record<string, string>;
};

type AymBackupV2 = {
  version: 2;
  exportedAt: string;
  payload: string; // "v2:<base64url>"
};

export type ImportResult =
  | { ok: true; restoredKeys: number }
  | { ok: false; error: string };

export function exportBackup(mnemonic: string): void {
  const data: Record<string, string> = {};

  for (const key of Object.keys(localStorage)) {
    if (isAymKey(key) && !isExcluded(key)) {
      const value = localStorage.getItem(key);
      if (value !== null) data[key] = value;
    }
  }

  const compressed = LZString.compressToUint8Array(JSON.stringify(data));
  const encKey = deriveBackupEncryptionKey(mnemonic);
  const iv = randomBytes(12);
  const ciphertext = gcm(encKey, iv).encrypt(compressed);
  const combined = new Uint8Array(iv.length + ciphertext.length);
  combined.set(iv);
  combined.set(ciphertext, iv.length);
  const b64url = btoa(String.fromCharCode(...combined))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const backup: AymBackupV2 = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    payload: `v2:${b64url}`,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aym-backup-${date}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

function restoreKeys(data: Record<string, string>): ImportResult {
  let restoredKeys = 0;
  for (const [key, value] of Object.entries(data)) {
    if (isAymKey(key) && !isExcluded(key) && typeof value === 'string') {
      localStorage.setItem(key, value);
      restoredKeys++;
    }
  }
  return { ok: true, restoredKeys };
}

function findMnemonicInStorage(): string | null {
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.endsWith('__aym_identity')) {
        const parsed = JSON.parse(localStorage.getItem(key) ?? '{}');
        if (typeof parsed.mnemonic === 'string') return parsed.mnemonic;
      }
    }
  } catch { /* */ }
  return null;
}

export function importBackup(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const raw = e.target?.result;
        if (typeof raw !== 'string') {
          resolve({ ok: false, error: 'Datei konnte nicht gelesen werden.' });
          return;
        }

        const parsed = JSON.parse(raw) as unknown;

        if (!parsed || typeof parsed !== 'object' || !('version' in parsed)) {
          resolve({ ok: false, error: 'Ungültiges Backup-Format.' });
          return;
        }

        const version = (parsed as { version: unknown }).version;

        // Legacy v1: plain JSON
        if (version === 1) {
          const v1 = parsed as AymBackupV1;
          if (!v1.data || typeof v1.data !== 'object') {
            resolve({ ok: false, error: 'Backup enthält keine Daten.' });
            return;
          }
          resolve(restoreKeys(v1.data));
          return;
        }

        // Current v2: AES-GCM encrypted
        if (version === 2) {
          const v2 = parsed as AymBackupV2;
          if (typeof v2.payload !== 'string' || !v2.payload.startsWith('v2:')) {
            resolve({ ok: false, error: 'Ungültiges Backup-Format.' });
            return;
          }

          const mnemonic = findMnemonicInStorage();
          if (!mnemonic) {
            resolve({
              ok: false,
              error:
                'Geschützte Sicherungsdatei: Bitte zuerst die 24 Sicherungswörter auf diesem Gerät eingeben (unter "Aus 24 Wörtern wiederherstellen"), dann die Datei erneut auswählen.',
            });
            return;
          }

          try {
            const rawB64 = v2.payload.slice(3).replace(/-/g, '+').replace(/_/g, '/');
            const rawBin = Uint8Array.from(atob(rawB64), c => c.charCodeAt(0));
            const iv = rawBin.slice(0, 12);
            const ciphertext = rawBin.slice(12);
            const encKey = deriveBackupEncryptionKey(mnemonic);
            const plaintext = gcm(encKey, iv).decrypt(ciphertext);
            const json = LZString.decompressFromUint8Array(plaintext);
            if (!json) throw new Error('decompression failed');
            const data = JSON.parse(json) as Record<string, string>;
            resolve(restoreKeys(data));
          } catch {
            resolve({
              ok: false,
              error:
                'Sicherungsdatei konnte nicht entschlüsselt werden. Bitte prüfe, ob die richtigen 24 Wörter für dieses Profil eingegeben wurden.',
            });
          }
          return;
        }

        resolve({ ok: false, error: `Unbekannte Backup-Version (${String(version)}).` });
      } catch {
        resolve({ ok: false, error: 'Die Datei konnte nicht verarbeitet werden.' });
      }
    };

    reader.onerror = () => {
      resolve({ ok: false, error: 'Lesefehler beim Öffnen der Datei.' });
    };

    reader.readAsText(file);
  });
}
