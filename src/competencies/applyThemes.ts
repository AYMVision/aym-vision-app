// src/competencies/applyThemes.ts
import type { UserProfile } from '../profile/types';
import type { ThemeId } from './themeMeta';

export function applyThemeRewards(
  profile: UserProfile,
  themes: ThemeId[]
): UserProfile {
  if (!themes.length) return profile;

  const prevPoints = profile.progress?.themePoints ?? {};

  const nextPoints = { ...prevPoints };

  for (const theme of themes) {
    nextPoints[theme] = (nextPoints[theme] ?? 0) + 1;
  }

  return {
    ...profile,
    progress: {
      ...profile.progress,
      themePoints: nextPoints,
    },
    updatedAt: Date.now(),
  };
}