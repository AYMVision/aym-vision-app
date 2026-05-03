// src/progress/themeStickerEngine.ts
// Prüft nach jedem Chapter ob neue Themen-Sticker freigeschaltet werden.
// Wird von progressEngine.ts aufgerufen nach applyThemeRewards.

import type { UserProfile } from '../profile/types';
import type { ThemeId } from '../competencies/themeMeta';
import { THEME_ORDER } from '../competencies/themeMeta';
import { THEME_STICKER_THRESHOLDS } from './rewardCatalog';
import { getThemeStickerThreshold } from './rewardCatalog';

function themeStickerIdForLevel(themeId: ThemeId, level: 1 | 2 | 3): string {
  return `theme-${themeId}-${level}`;
}

/**
 * Prüft für alle Themen ob durch die aktuellen themePoints eine neue
 * Sticker-Schwelle erreicht wurde. Schreibt neue Sticker in earnedStickers.
 *
 * Gibt das aktualisierte Profil + die neu vergebenen Sticker-IDs zurück.
 */
export function applyThemeStickerRewards(profile: UserProfile): {
  profile: UserProfile;
  newThemeStickerIds: string[];
} {
  const themePoints = profile.progress?.themePoints ?? {};
  const earnedStickers = profile.progress?.earnedStickers ?? {};
  const earnedStickersAt = profile.progress?.earnedStickersAt ?? {};

  const newIds: string[] = [];
  let updatedStickers = { ...earnedStickers };
  let updatedStickersAt = { ...earnedStickersAt };

  for (const themeId of THEME_ORDER) {
    const points = themePoints[themeId] ?? 0;

    for (const levelStr of ['1', '2', '3'] as const) {
      const level = Number(levelStr) as 1 | 2 | 3;
      const threshold = getThemeStickerThreshold(themeId, level);
      const stickerId = themeStickerIdForLevel(themeId, level);

      if (points >= threshold && !updatedStickers[stickerId]) {
        const now = Date.now();
        updatedStickers[stickerId] = true;
        updatedStickersAt[stickerId] = now;
        newIds.push(stickerId);
      }
    }
  }

  if (newIds.length === 0) {
    return { profile, newThemeStickerIds: [] };
  }

  return {
    profile: {
      ...profile,
      progress: {
        ...profile.progress,
        earnedStickers: updatedStickers,
        earnedStickersAt: updatedStickersAt,
      },
      updatedAt: Date.now(),
    },
    newThemeStickerIds: newIds,
  };
}
