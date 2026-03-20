// src/profile/storage.ts

import type { Equipment, Inventory, ItemSlot, UserProfile } from './types';
import { createDefaultProfile } from './defaultProfile';

const STORAGE_KEY = 'aym_user_profile';

const ALL_SLOTS: ItemSlot[] = [
  'head',
  'face',
  'top',
  'bottom',
  'feet',
  'background',
  'effect',
];

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function toNumber(v: unknown, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeAvatarId(raw: unknown, fallback: string) {
  if (typeof raw !== 'string') return fallback;
  const id = raw.trim();
  if (!id) return fallback;

  if (id === 'kid_1') return 'kid_01';
  if (id === 'kid_2') return 'kid_02';
  if (id === 'kid_3') return 'kid_03';

  return id;
}

function normalizeProfile(raw: unknown): UserProfile {
  const base = createDefaultProfile();
  const p = isObject(raw) ? raw : {};

  const walletRaw = isObject(p.wallet) ? p.wallet : {};
  const wallet = {
    coins: toNumber(walletRaw.coins, base.wallet.coins),
    totalEarned: toNumber(walletRaw.totalEarned, base.wallet.totalEarned),
    totalSpent: toNumber(walletRaw.totalSpent, base.wallet.totalSpent),
  };

  const invRaw = isObject(p.inventory) ? p.inventory : {};
  const inventory = Object.fromEntries(
    ALL_SLOTS.map((slot) => {
      const list = invRaw[slot];
      return [
        slot,
        Array.isArray(list)
          ? list.filter((x) => typeof x === 'string')
          : base.inventory[slot],
      ];
    })
  ) as Inventory;

  const eqRaw = isObject(p.equipment) ? p.equipment : {};
  const equipment = Object.fromEntries(
    ALL_SLOTS.map((slot) => {
      const v = eqRaw[slot];
      return [slot, typeof v === 'string' ? v : null];
    })
  ) as Equipment;

  const progRaw = isObject(p.progress) ? p.progress : {};

  const currentRaw = isObject(progRaw.current) ? progRaw.current : null;
  const weeklyRaw = isObject(progRaw.weeklyStreak) ? progRaw.weeklyStreak : {};
  const themePointsRaw = isObject(progRaw.themePoints) ? progRaw.themePoints : {};

  const progress = {
    completedChapters: isObject(progRaw.completedChapters)
      ? (progRaw.completedChapters as Record<string, true>)
      : base.progress.completedChapters,

    completedEpisodes: isObject(progRaw.completedEpisodes)
      ? (progRaw.completedEpisodes as Record<string, true>)
      : base.progress.completedEpisodes,

    earnedStickers: isObject(progRaw.earnedStickers)
      ? (progRaw.earnedStickers as Record<string, true>)
      : base.progress.earnedStickers,

    earnedBadges: isObject(progRaw.earnedBadges)
      ? (progRaw.earnedBadges as Record<string, true>)
      : base.progress.earnedBadges,

    current: currentRaw
      ? {
          seasonId: String(currentRaw.seasonId ?? 's1'),
          episodeId: String(currentRaw.episodeId ?? ''),
          courseId: String(currentRaw.courseId ?? currentRaw.episodeId ?? ''),
          chapterIndex: toNumber(currentRaw.chapterIndex, 1),
          updatedAt: toNumber(currentRaw.updatedAt, base.updatedAt),
        }
      : base.progress.current,

    weeklyStreak: {
      ...base.progress.weeklyStreak,
      lastActiveDay:
        typeof weeklyRaw.lastActiveDay === 'string'
          ? weeklyRaw.lastActiveDay
          : base.progress.weeklyStreak?.lastActiveDay ?? '',
      currentStreak: toNumber(
        weeklyRaw.currentStreak,
        base.progress.weeklyStreak?.currentStreak ?? 0
      ),
      longestStreak: toNumber(
        weeklyRaw.longestStreak,
        base.progress.weeklyStreak?.longestStreak ?? 0
      ),
      completedWeeks: toNumber(
        weeklyRaw.completedWeeks,
        base.progress.weeklyStreak?.completedWeeks ?? 0
      ),
    },

    themePoints: {
      ...base.progress.themePoints,
      'info-check': toNumber(
        themePointsRaw['info-check'],
        base.progress.themePoints?.['info-check'] ?? 0
      ),
      'talk-act': toNumber(
        themePointsRaw['talk-act'],
        base.progress.themePoints?.['talk-act'] ?? 0
      ),
      'creative': toNumber(
        themePointsRaw['creative'],
        base.progress.themePoints?.['creative'] ?? 0
      ),
      'safe-online': toNumber(
        themePointsRaw['safe-online'],
        base.progress.themePoints?.['safe-online'] ?? 0
      ),
      'problem-solving': toNumber(
        themePointsRaw['problem-solving'],
        base.progress.themePoints?.['problem-solving'] ?? 0
      ),
      'reflect-understand': toNumber(
        themePointsRaw['reflect-understand'],
        base.progress.themePoints?.['reflect-understand'] ?? 0
      ),
      'fairness': toNumber(
        themePointsRaw['fairness'],
        base.progress.themePoints?.['fairness'] ?? 0
      ),
    },
  };

  const version = Math.max(toNumber(p.version, base.version), base.version);

  return {
    ...base,
    ...p,
    version,
    avatarBaseId: normalizeAvatarId(p.avatarBaseId, base.avatarBaseId),
    wallet,
    inventory,
    equipment,
    progress,
    createdAt: toNumber(p.createdAt, base.createdAt),
    updatedAt: toNumber(p.updatedAt, base.updatedAt),
    storyTranscripts: isObject(p.storyTranscripts)
      ? (p.storyTranscripts as UserProfile['storyTranscripts'])
      : base.storyTranscripts,
  };
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProfile();
    return normalizeProfile(JSON.parse(raw));
  } catch {
    return createDefaultProfile();
  }
}

export function saveProfile(profile: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}