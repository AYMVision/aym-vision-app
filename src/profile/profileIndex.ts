// src/profile/profileIndex.ts
// Verwaltung aller Profile auf dem Gerät: Erstellen, Wechseln, Löschen, PIN, Migration.

import { getActiveProfileId, setActiveProfileId } from './profileStorage';

export type ProfileMeta = {
  id: string;
  displayName: string;
  avatarBaseId: string;
  createdAt: number;
  lastActiveAt: number;
  pinHash?: string; // SHA-256, nur wenn PIN gesetzt
};

const INDEX_KEY = 'aym_profiles_index';
const MIGRATED_KEY = 'aym_profiles_migrated_v1';

// Alle Keys die bei der Migration in das neue Profil-Format übertragen werden
const LEGACY_STATIC_KEYS = [
  'aym_user_profile',
  'aym_seen_bonus_v1',
  'aym_bonus_markers_v1',
  'aym_story_v02_input_responses',
  'aym_story_v02_item_responses',
  'aym_story_v02_reflection_responses',
  'aym_story_v02_challenge_status',
  'aym_story_v02_topic_seen',
  'aym_article_read_v1',
  'aym_article_reactions_v1',
  'aym_seen_stickers_v1',
  'aym_diary_me_v1',
  'aym_diary_pin_hash_v1',
  'aym_diary_pin_hint_v1',
  'aym-gate-last-completed-ts',
  'aym_fast_gate',
  'aym_transfer_last_export_v1',
  'aym_first_run_done',
];

const LEGACY_DYNAMIC_PREFIXES = [
  'aym_story_progress_',
  'story-v02-amic-',
  'story-v02-session-',
];

// Keys die NICHT migriert werden (geräteweit)
const DEVICE_WIDE_PREFIXES = [
  'aym_p_',
  'aym_profiles_',
  'aym_active_profile',
  'aym_profiles_migrated',
  'aym_parent_',
  'aym_beta_',
  'aym-entitlements',
  'aym_pwa_',
  'aym_studio_',
  'aym_app_',
  'aym_test_',
  'aym_first_run',
];

function generateId(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------------------
// Index lesen / schreiben
// ---------------------------------------------------------------------------

export function loadProfilesIndex(): ProfileMeta[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveProfilesIndex(profiles: ProfileMeta[]): void {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(profiles));
  } catch { /* */ }
}

// ---------------------------------------------------------------------------
// Profil-CRUD
// ---------------------------------------------------------------------------

export function createProfile(displayName: string, avatarBaseId = 'kid_01'): ProfileMeta {
  const id = generateId();
  const meta: ProfileMeta = {
    id,
    displayName: displayName.trim() || 'Spieler',
    avatarBaseId,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  };
  const profiles = loadProfilesIndex();
  saveProfilesIndex([...profiles, meta]);
  return meta;
}

export function updateProfileMeta(
  id: string,
  updates: Partial<Omit<ProfileMeta, 'id' | 'createdAt'>>
): void {
  const profiles = loadProfilesIndex();
  const idx = profiles.findIndex((p) => p.id === id);
  if (idx === -1) return;
  profiles[idx] = { ...profiles[idx], ...updates };
  saveProfilesIndex(profiles);
}

export function deleteProfile(id: string): void {
  // Alle profil-gebundenen Keys löschen
  const prefix = `aym_p_${id}__`;
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(prefix)) toRemove.push(k);
  }
  toRemove.forEach((k) => localStorage.removeItem(k));

  // Aus Index entfernen
  const profiles = loadProfilesIndex();
  saveProfilesIndex(profiles.filter((p) => p.id !== id));

  // War dieses Profil aktiv → auf erstes verfügbares wechseln
  if (getActiveProfileId() === id) {
    const remaining = loadProfilesIndex();
    setActiveProfileId(remaining[0]?.id ?? null);
  }
}

export function getProfileMeta(id: string): ProfileMeta | undefined {
  return loadProfilesIndex().find((p) => p.id === id);
}

export function hasMultipleProfiles(): boolean {
  return loadProfilesIndex().length > 1;
}

// ---------------------------------------------------------------------------
// Profil wechseln
// ---------------------------------------------------------------------------

export function switchToProfile(id: string): void {
  setActiveProfileId(id);
  updateProfileMeta(id, { lastActiveAt: Date.now() });
  // Story-Session aus sessionStorage löschen, damit kein Verlauf eines anderen Profils
  // in der aktuellen Tab-Session sichtbar bleibt (sessionStorage ist nicht profil-isoliert).
  try {
    const toRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k?.startsWith('story-v02-')) toRemove.push(k);
    }
    toRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------
// PIN
// ---------------------------------------------------------------------------

export async function setProfilePin(id: string, pin: string): Promise<boolean> {
  const p = String(pin ?? '').trim();
  if (p.length < 4) return false;
  const hash = await sha256Hex(p);
  updateProfileMeta(id, { pinHash: hash });
  return true;
}

export async function verifyProfilePin(id: string, pin: string): Promise<boolean> {
  const meta = getProfileMeta(id);
  if (!meta?.pinHash) return true; // kein PIN gesetzt → immer OK
  const hash = await sha256Hex(String(pin ?? '').trim());
  return hash === meta.pinHash;
}

export function clearProfilePin(id: string): void {
  const profiles = loadProfilesIndex();
  const idx = profiles.findIndex((p) => p.id === id);
  if (idx === -1) return;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pinHash: _, ...rest } = profiles[idx];
  profiles[idx] = rest;
  saveProfilesIndex(profiles);
}

// ---------------------------------------------------------------------------
// Migration: Bestehender Spielstand → erstes Profil
// ---------------------------------------------------------------------------

export function needsMigration(): boolean {
  return loadProfilesIndex().length === 0;
}

/** Einmalige Migration: bestehende Daten → profil-gebundene Keys */
export function migrateToMultiProfile(): ProfileMeta {
  // Name + Avatar aus vorhandenem Profil lesen (falls vorhanden)
  let displayName = '';
  let avatarBaseId = 'kid_01';

  const existingRaw = localStorage.getItem('aym_user_profile');
  if (existingRaw) {
    try {
      const p = JSON.parse(existingRaw);
      if (p.chatName?.trim()) displayName = p.chatName.trim();
      if (p.avatarBaseId?.trim()) avatarBaseId = p.avatarBaseId.trim();
    } catch { /* */ }
  }

  const profile = createProfile(displayName, avatarBaseId);
  const prefix = `aym_p_${profile.id}__`;

  // Alle Legacy-Keys in profil-gebundene Keys kopieren
  const allKeys = Object.keys(localStorage);
  for (const key of allKeys) {
    // Device-wide Keys überspringen
    if (DEVICE_WIDE_PREFIXES.some((p) => key.startsWith(p))) continue;

    if (
      LEGACY_STATIC_KEYS.includes(key) ||
      LEGACY_DYNAMIC_PREFIXES.some((p) => key.startsWith(p))
    ) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        localStorage.setItem(`${prefix}${key}`, value);
      }
    }
  }

  setActiveProfileId(profile.id);
  localStorage.setItem(MIGRATED_KEY, 'true');
  return profile;
}

export function isMigrated(): boolean {
  return localStorage.getItem(MIGRATED_KEY) === 'true';
}
