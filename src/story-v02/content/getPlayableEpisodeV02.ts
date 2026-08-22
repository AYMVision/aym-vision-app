// src/story-v02/content/getPlayableEpisodeV02.ts

import type { StoryEpisodeV02 } from '../types/storyTypes';
import { getMaterial } from '../../shop/materialCache';

type Lang = 'de' | 'en';

const AVAILABLE: Record<Lang, readonly string[]> = {
  de: ['s1e01', 's1e02', 's1e03', 's1e04', 's1e05'],
  en: ['s1e01', 's1e02', 's1e03', 's1e04', 's1e05'],
};

export function isEpisodeAvailable(courseId: string, lang: Lang): boolean {
  return (AVAILABLE[lang] ?? []).includes(courseId);
}

/**
 * Lädt eine Episode — zuerst vom Backend (wenn profileId vorhanden),
 * dann Fallback auf statische Dateien im Bundle (für Tests ohne Backend).
 */
export async function getPlayableEpisodeV02(
  courseId: string,
  lang: Lang,
  profileId?: string,
): Promise<StoryEpisodeV02 | null> {
  // ── Backend (D6 / Production) ────────────────────────────────────────────
  if (profileId) {
    try {
      const material = await getMaterial(courseId, profileId);
      if (material) {
        const bundle = material.payload as Record<string, string>;
        const encoded = bundle[lang];
        if (encoded) {
          return JSON.parse(atob(encoded)) as StoryEpisodeV02;
        }
      }
    } catch {
      // Backend nicht erreichbar — Fallback auf statische Dateien
    }
  }

  // ── Statische Dateien (Dev / solange TS-Dateien noch im Bundle sind) ────
  try {
    if (lang === 'de') {
      switch (courseId) {
        case 's1e01': return (await import('./de/s1e01.de')).default;
        case 's1e02': return (await import('./de/s1e02.de')).default;
        case 's1e03': return (await import('./de/s1e03.de')).default;
        case 's1e04': return (await import('./de/s1e04.de')).default;
        case 's1e05': return (await import('./de/s1e05.de')).default;
        default: return null;
      }
    }
    if (lang === 'en') {
      switch (courseId) {
        case 's1e01': return (await import('./en/s1e01.en')).default;
        case 's1e02': return (await import('./en/s1e02.en')).default;
        case 's1e03': return (await import('./en/s1e03.en')).default;
        case 's1e04': return (await import('./en/s1e04.en')).default;
        case 's1e05': return (await import('./en/s1e05.en')).default;
        default: return null;
      }
    }
    return null;
  } catch {
    return null;
  }
}
