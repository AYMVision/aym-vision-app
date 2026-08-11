// src/common/transferLink.ts
import LZString from 'lz-string';
import { gcm } from '@noble/ciphers/aes.js';
import { randomBytes } from '@noble/ciphers/webcrypto';
import { pStorage } from '../profile/profileStorage';
import { deriveLinkEncryptionKey } from '../identity/keys';

export const TRANSFER_SCHEMA_VERSION = 1;

const PROFILE_KEY = 'aym_user_profile';

// Full localStorage keys included as-is in the transfer
const FULL_TRANSFER_KEYS = [
  'aym_seen_bonus_v1',
  'aym_bonus_markers_v1',
  'aym_story_v02_item_responses',
  'aym_story_v02_challenge_status',
  'aym_story_v02_topic_seen',
  'aym_seen_stickers_v1',
  'aym_article_read_v1',
  'aym_article_reactions_v1',
] as const;

// Excluded from profile: chatName, myCard, storyTranscripts (personal / privacy-relevant)
function extractTransferableProfile(raw: unknown): object | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const p = raw as Record<string, unknown>;
  const progress = p.progress as Record<string, unknown> | undefined;

  return {
    avatarBaseId: p.avatarBaseId,
    soundEnabled: p.soundEnabled,
    wallet: p.wallet,
    inventory: p.inventory,
    equipment: p.equipment,
    progress: progress
      ? {
          completedChapters: progress.completedChapters,
          completedEpisodes: progress.completedEpisodes,
          earnedStickers: progress.earnedStickers,
          earnedStickersAt: progress.earnedStickersAt,
          earnedBadges: progress.earnedBadges,
          themePoints: progress.themePoints,
          weeklyStreak: progress.weeklyStreak,
          current: progress.current,
          activity: progress.activity,
          diary: progress.diary,
        }
      : undefined,
  };
}

export type TransferPayload = {
  v: number;
  exportedAt: number;
  profile?: object;
  keys: Record<string, unknown>;
};

export function buildTransferPayload(): TransferPayload {
  const keys: Record<string, unknown> = {};

  for (const key of FULL_TRANSFER_KEYS) {
    const raw = pStorage.getItem(key);
    if (raw !== null) {
      try {
        keys[key] = JSON.parse(raw);
      } catch {
        keys[key] = raw;
      }
    }
  }

  const profileRaw = pStorage.getItem(PROFILE_KEY);
  let profile: object | undefined;
  if (profileRaw) {
    try {
      profile = extractTransferableProfile(JSON.parse(profileRaw));
    } catch {
      // ignore malformed profile
    }
  }

  return { v: TRANSFER_SCHEMA_VERSION, exportedAt: Date.now(), profile, keys };
}

export function encodeTransferPayload(payload: TransferPayload): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(payload));
}

export type DecodeResult =
  | { ok: true; payload: TransferPayload }
  | { ok: false; error: string };

export function decodeTransferPayload(encoded: string, mnemonic?: string): DecodeResult {
  try {
    if (encoded.startsWith('v2:')) {
      const rawB64 = encoded.slice(3).replace(/-/g, '+').replace(/_/g, '/');
      const rawBin = Uint8Array.from(atob(rawB64), c => c.charCodeAt(0));
      const iv = rawBin.slice(0, 12);
      const ciphertext = rawBin.slice(12);
      const resolvedMnemonic = mnemonic ?? (
        (() => {
          try { return JSON.parse(localStorage.getItem('aym_identity') ?? '').mnemonic as string; } catch { return null; }
        })()
      );
      if (!resolvedMnemonic) return { ok: false, error: 'Verschlüsselter Link: Bitte zuerst Identität wiederherstellen.' };
      const key = deriveLinkEncryptionKey(resolvedMnemonic);
      const plaintext = gcm(key, iv).decrypt(ciphertext);
      const json = new TextDecoder().decode(plaintext);
      const parsed = JSON.parse(json) as TransferPayload;
      if (typeof parsed.v !== 'number') return { ok: false, error: 'Ungültiges Transfer-Format.' };
      if (parsed.v !== TRANSFER_SCHEMA_VERSION) {
        return { ok: false, error: `Inkompatible Version (erwartet ${TRANSFER_SCHEMA_VERSION}, erhalten ${parsed.v}).` };
      }
      return { ok: true, payload: parsed };
    }

    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return { ok: false, error: 'Ungültiger Transfer-Link (Entschlüsselung fehlgeschlagen).' };
    const parsed = JSON.parse(json) as TransferPayload;
    if (typeof parsed.v !== 'number') return { ok: false, error: 'Ungültiges Transfer-Format.' };
    if (parsed.v !== TRANSFER_SCHEMA_VERSION) {
      return { ok: false, error: `Inkompatible Version (erwartet ${TRANSFER_SCHEMA_VERSION}, erhalten ${parsed.v}).` };
    }
    return { ok: true, payload: parsed };
  } catch {
    return { ok: false, error: 'Ungültiger Transfer-Link.' };
  }
}

export type TransferPreview = {
  exportedAt: number;
  chaptersCompleted: number;
  episodesCompleted: number;
  stickersEarned: number;
  coins: number;
  avatarBaseId?: string;
  hasItemResponses: boolean;
  hasBonusData: boolean;
};

export function buildPreview(payload: TransferPayload): TransferPreview {
  const p = payload.profile as Record<string, unknown> | undefined;
  const progress = p?.progress as Record<string, unknown> | undefined;

  return {
    exportedAt: payload.exportedAt,
    chaptersCompleted: Object.keys((progress?.completedChapters as object) ?? {}).length,
    episodesCompleted: Object.keys((progress?.completedEpisodes as object) ?? {}).length,
    stickersEarned: Object.keys((progress?.earnedStickers as object) ?? {}).length,
    coins: ((p?.wallet as Record<string, number>) ?? {}).coins ?? 0,
    avatarBaseId: p?.avatarBaseId as string | undefined,
    hasItemResponses: !!payload.keys['aym_story_v02_item_responses'],
    hasBonusData: !!payload.keys['aym_seen_bonus_v1'],
  };
}

export function applyTransferPayload(payload: TransferPayload): { applied: number } {
  let applied = 0;

  for (const [key, value] of Object.entries(payload.keys)) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      applied++;
    } catch {
      // storage quota exceeded
    }
  }

  if (payload.profile) {
    const existingRaw = localStorage.getItem(PROFILE_KEY);
    let existing: Record<string, unknown> = {};
    if (existingRaw) {
      try { existing = JSON.parse(existingRaw); } catch { /* */ }
    }

    const incoming = payload.profile as Record<string, unknown>;
    const existingProgress = (existing.progress ?? {}) as Record<string, unknown>;
    const incomingProgress = (incoming.progress ?? {}) as Record<string, unknown>;

    const merged: Record<string, unknown> = {
      ...existing,
      avatarBaseId: incoming.avatarBaseId ?? existing.avatarBaseId,
      soundEnabled: incoming.soundEnabled ?? existing.soundEnabled,
      wallet: incoming.wallet ?? existing.wallet,
      inventory: incoming.inventory ?? existing.inventory,
      equipment: incoming.equipment ?? existing.equipment,
      updatedAt: Date.now(),
      progress: {
        ...existingProgress,
        completedChapters: incomingProgress.completedChapters ?? existingProgress.completedChapters,
        completedEpisodes: incomingProgress.completedEpisodes ?? existingProgress.completedEpisodes,
        earnedStickers: incomingProgress.earnedStickers ?? existingProgress.earnedStickers,
        earnedStickersAt: incomingProgress.earnedStickersAt ?? existingProgress.earnedStickersAt,
        earnedBadges: incomingProgress.earnedBadges ?? existingProgress.earnedBadges,
        themePoints: incomingProgress.themePoints ?? existingProgress.themePoints,
        weeklyStreak: incomingProgress.weeklyStreak ?? existingProgress.weeklyStreak,
        current: incomingProgress.current ?? existingProgress.current,
        activity: incomingProgress.activity ?? existingProgress.activity,
        diary: incomingProgress.diary ?? existingProgress.diary,
      },
    };

    localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
    applied++;
  }

  return { applied };
}

const LAST_EXPORT_KEY = 'aym_transfer_last_export_v1';

export function getLastTransferExportTime(): number | null {
  try {
    const raw = pStorage.getItem(LAST_EXPORT_KEY);
    return raw ? parseInt(raw, 10) : null;
  } catch {
    return null;
  }
}

function markTransferExport(): void {
  try {
    pStorage.setItem(LAST_EXPORT_KEY, String(Date.now()));
  } catch { /* */ }
}

export function buildTransferLink(mnemonic: string): string {
  const payload = buildTransferPayload();
  const json = JSON.stringify(payload);
  const key = deriveLinkEncryptionKey(mnemonic);
  const iv = randomBytes(12);
  const ciphertext = gcm(key, iv).encrypt(new TextEncoder().encode(json));
  const combined = new Uint8Array(iv.length + ciphertext.length);
  combined.set(iv);
  combined.set(ciphertext, iv.length);
  const b64url = btoa(String.fromCharCode(...combined))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const encoded = `v2:${b64url}`;
  markTransferExport();
  const base = window.location.origin + window.location.pathname;
  return `${base}#/transfer/${encoded}`;
}
