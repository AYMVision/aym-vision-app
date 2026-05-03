// src/common/backupRestore.ts

const BACKUP_VERSION = 1;

// Keys that should NOT be included in a backup (security / session-only)
// Diary PIN hash is device-bound by design (same as parent passcode) — excluded from backup.
// Diary entries (aym_diary_me_v1) ARE included — the content belongs to the child.
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

export type AymBackup = {
  version: number;
  exportedAt: string; // ISO string
  data: Record<string, string>; // raw localStorage values
};

export function exportBackup(): void {
  const data: Record<string, string> = {};

  for (const key of Object.keys(localStorage)) {
    if (isAymKey(key) && !isExcluded(key)) {
      const value = localStorage.getItem(key);
      if (value !== null) data[key] = value;
    }
  }

  const backup: AymBackup = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
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

export type ImportResult =
  | { ok: true; restoredKeys: number }
  | { ok: false; error: string };

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

        if (
          !parsed ||
          typeof parsed !== 'object' ||
          !('version' in parsed) ||
          !('data' in parsed)
        ) {
          resolve({ ok: false, error: 'Ungültiges Backup-Format.' });
          return;
        }

        const backup = parsed as AymBackup;

        if (backup.version !== BACKUP_VERSION) {
          resolve({
            ok: false,
            error: `Inkompatible Backup-Version (${backup.version}). Erwartet: ${BACKUP_VERSION}.`,
          });
          return;
        }

        if (!backup.data || typeof backup.data !== 'object') {
          resolve({ ok: false, error: 'Backup enthält keine Daten.' });
          return;
        }

        let restoredKeys = 0;

        for (const [key, value] of Object.entries(backup.data)) {
          // Safety: only restore aym_ keys, never overwrite excluded ones
          if (isAymKey(key) && !isExcluded(key) && typeof value === 'string') {
            localStorage.setItem(key, value);
            restoredKeys++;
          }
        }

        resolve({ ok: true, restoredKeys });
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
