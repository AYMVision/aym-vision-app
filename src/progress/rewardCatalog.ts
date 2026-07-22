// src/progress/rewardCatalog.ts
// Single Source of Truth für alle Sticker, Milestones und Themen-Sticker.
// Badges existieren nicht mehr als eigenes System — Streak-Belohnungen sind Sticker.

import type { ThemeId } from '../competencies/themeMeta';
import { THEME_ORDER } from '../competencies/themeMeta';

// ─── TYPEN ────────────────────────────────────────────────────────────────────

export type StickerCategory = 'episode' | 'milestone' | 'theme' | 'streak';

export type StickerDef = {
  id: string;
  title?: string;      // fallback / backward compat
  titleKey?: string;   // i18n key
  image: string;
  category: StickerCategory;
  // Nur für Themen-Sticker:
  themeId?: ThemeId;
  themeLevel?: 1 | 2 | 3;
  themeThreshold?: number; // Punkte-Schwelle zum Freischalten
};

// ─── EPISODE-STICKER ──────────────────────────────────────────────────────────
// ID-Format: 's1:s1e01' (identisch mit episodeKey in progressEngine)

export const EPISODE_STICKERS: StickerDef[] = [
  {
    id: 's1:s1e01',
    titleKey: 'episodes.s1e01',
    title: 'Episode 1 abgeschlossen',
    image: 'media/stickers/episodes/s1e01-512.webp',
    category: 'episode',
  },
  {
    id: 's1:s1e02',
    titleKey: 'episodes.s1e02',
    title: 'Episode 2 abgeschlossen',
    image: 'media/stickers/episodes/s1e02-512.webp',
    category: 'episode',
  },
  {
    id: 's1:s1e03',
    titleKey: 'episodes.s1e03',
    title: 'Episode 3 abgeschlossen',
    image: 'media/stickers/episodes/s1e03-512.webp',
    category: 'episode',
  },
  {
    id: 's1:s1e04',
    titleKey: 'episodes.s1e04',
    title: 'Episode 4 abgeschlossen',
    image: 'media/stickers/episodes/s1e04-512.webp',
    category: 'episode',
  },
  {
    id: 's1:s1e05',
    titleKey: 'episodes.s1e05',
    title: 'Episode 5 abgeschlossen',
    image: 'media/stickers/episodes/s1e05-512.webp',
    category: 'episode',
  },
  {
    id: 's1:s1e07',
    titleKey: 'episodes.s1e07',
    title: 'Episode 7 abgeschlossen',
    image: 'media/stickers/episodes/s1e07-512.webp',
    category: 'episode',
  },
  {
    id: 's1:s1e08',
    titleKey: 'episodes.s1e08',
    title: 'Episode 8 abgeschlossen',
    image: 'media/stickers/episodes/s1e08-512.webp',
    category: 'episode',
  },
];

// ─── MEILENSTEIN-STICKER ──────────────────────────────────────────────────────

export const MILESTONE_STICKERS: StickerDef[] = [

  {
    id: 'starter-first-5',
    // ID beibehalten: bereits in bestehenden Profilen als earned gespeichert
    titleKey: 'milestones.firstFive',
    title: 'Mega. Du hast die ersten 5 Tage erfolgreich gemeistert!',
    image: 'media/stickers/milestones/starter-first-5-512.webp',
    category: 'milestone',
  },
   {
    id: 'milestone-10-chapters',
    titleKey: 'milestones.tenChapters',
    title: '10 Kapitel geschafft!',
    image: 'media/stickers/milestones/chapters-10-512.webp',
    category: 'milestone',
  },
  {
    id: 'milestone-first-season',
    titleKey: 'milestones.firstSeason',
    title: 'Erste Staffel abgeschlossen!',
    image: 'media/stickers/milestones/first-season-512.webp',
    category: 'milestone',
  },
  {
    id: 'milestone-10-stickers',
    titleKey: 'milestones.tenStickers',
    title: '10 Sticker gesammelt!',
    image: 'media/stickers/milestones/stickers-10-512.webp',
    category: 'milestone',
  },
  {
    id: 'milestone-25-stickers',
    titleKey: 'milestones.twentyFiveStickers',
    title: '25 Sticker gesammelt!',
    image: 'media/stickers/milestones/stickers-25-512.webp',
    category: 'milestone',
  },
  {
    id: 'milestone-50-stickers',
    titleKey: 'milestones.fiftyStickers',
    title: '50 Sticker gesammelt!',
    image: 'media/stickers/milestones/stickers-50-512.webp',
    category: 'milestone',
  },
  {
    id: 'milestone-first-theme-sticker',
    titleKey: 'milestones.firstThemeSticker',
    title: 'Erster Themen-Sticker!',
    image: 'media/stickers/milestones/theme-first-512.webp',
    category: 'milestone',
  },
  {
    id: 'milestone-all-themes-once',
    titleKey: 'milestones.allThemesOnce',
    title: 'In jedem Thema den ersten Sticker gesammelt!',
    image: 'media/stickers/milestones/themes-all-once-512.webp',
    category: 'milestone',
  },
    {
    id: 'milestone-diary-10-days',
    titleKey: 'milestones.diaryTenDays',
    title: '10 Tage Tagebuch genutzt!',
    image: 'media/stickers/milestones/diary-10days-512.webp',
    category: 'milestone',
  },
  {
    id: 'milestone-played-30-days',
    titleKey: 'milestones.playedThirtyDays',
    title: '30 Tage insgesamt gespielt!',
    image: 'media/stickers/milestones/played-30days-512.webp',
    category: 'milestone',
  },
  {
    id: 'milestone-friendbook-entry',
    titleKey: 'milestones.friendbookEntry',
    title: 'Mein Freundebucheintrag geschrieben!',
    image: 'media/stickers/milestones/friendbook-entry-512.webp',
    category: 'milestone',
  },
];

// ─── STREAK-STICKER ───────────────────────────────────────────────────────────

export const STREAK_STICKERS: StickerDef[] = [
  {
    id: 'weekly-streak-5',
    // ID beibehalten: bereits in bestehenden Profilen als earnedBadges gespeichert
    titleKey: 'streak.week5',
    title: '5 Tage am Stück dabei!',
    image: 'media/stickers/streaks/streak-5-512.webp',
    category: 'streak',
  },
  {
    id: 'streak-10',
    titleKey: 'streak.week10',
    title: '10 Tage am Stück dabei!',
    image: 'media/stickers/streaks/streak-10-512.webp',
    category: 'streak',
  },
  {
    id: 'streak-20',
    titleKey: 'streak.week20',
    title: '20 Tage am Stück dabei!',
    image: 'media/stickers/streaks/streak-20-512.webp',
    category: 'streak',
  },
];

// ─── THEMEN-STICKER ───────────────────────────────────────────────────────────
// 7 Themen × 3 Stufen = 21 Sticker.
// ID-Format: 'theme-[themeId]-[level]'

export const THEME_STICKER_THRESHOLDS_BY_THEME: Record<ThemeId, Record<1 | 2 | 3, number>> = {
  'talk-act': {
      1: 10,
    2: 20,
    3: 30,
  },
  'reflect-understand': {
    1: 10,
    2: 20,
    3: 30,
  },
  'info-check': {
    1: 10,
    2: 20,
    3: 30,
  },
  'safe-online': {
     1: 10,
    2: 20,
    3: 30,
  },
  'creative': {
    1: 10,
    2: 20,
    3: 30,
  },
  'fairness': {
    1: 10,
    2: 20,
    3: 30,
  },
  'problem-solving': {
    1: 10,
    2: 20,
    3: 30,
  },
};

// Backward-compat / allgemeine Default-Schwellen, falls anderswo noch genutzt
export const THEME_STICKER_THRESHOLDS: Record<1 | 2 | 3, number> = {
  1: 4,
  2: 10,
  3: 18,
};

export function getThemeStickerThreshold(themeId: ThemeId, level: 1 | 2 | 3): number {
  return THEME_STICKER_THRESHOLDS_BY_THEME[themeId][level];
}

export const THEME_STICKERS: StickerDef[] = THEME_ORDER.flatMap((themeId) =>
  ([1, 2, 3] as const).map((level) => ({
    id: `theme-${themeId}-${level}` as string,
    titleKey: `themes.${themeId}.${level}`,
    title: `${themeId} ${level}`,
    image: `media/stickers/themes/${themeId}-${level}-512.webp`,
    category: 'theme' as StickerCategory,
    themeId,
    themeLevel: level,
    themeThreshold: getThemeStickerThreshold(themeId, level),
  }))
);

// ─── GESAMTKATALOG ────────────────────────────────────────────────────────────

export const STICKER_CATALOG: StickerDef[] = [
  ...EPISODE_STICKERS,
  ...MILESTONE_STICKERS,
  ...STREAK_STICKERS,
  ...THEME_STICKERS,
];

export function getStickerById(id: string): StickerDef | undefined {
  return STICKER_CATALOG.find((s) => s.id === id);
}

export function getStickersByCategory(category: StickerCategory): StickerDef[] {
  return STICKER_CATALOG.filter((s) => s.category === category);
}

export function getThemeStickersForTheme(themeId: ThemeId): StickerDef[] {
  return THEME_STICKERS.filter((s) => s.themeId === themeId);
}

// ─── BACKWARD COMPAT ─────────────────────────────────────────────────────────

export type SpecialStickerMeta = { id: string; title?: string; titleKey?: string; image: string };
export type BadgeMeta = { id: string; title?: string; titleKey?: string; image: string };

export const SPECIAL_STICKERS: SpecialStickerMeta[] = MILESTONE_STICKERS;
export const SPECIAL_BADGES: BadgeMeta[] = STREAK_STICKERS;