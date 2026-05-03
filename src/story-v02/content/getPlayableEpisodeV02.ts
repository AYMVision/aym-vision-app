// src/story-v02/content/getPlayableEpisodeV02.ts
// Each episode is loaded on-demand via dynamic import so only the requested
// episode file is included in the active chunk — not all 12 at once.

import type { StoryEpisodeV02 } from '../types/storyTypes';

type Lang = 'de' | 'en';

/** Synchronous availability check — no content loaded. */
const AVAILABLE: Record<Lang, readonly string[]> = {
  de: ['s1e01', 's1e02', 's1e03', 's1e04', 's1e05', 's1e06'],
  en: ['s1e01', 's1e02', 's1e03', 's1e04', 's1e05', 's1e06'],
};

export function isEpisodeAvailable(courseId: string, lang: Lang): boolean {
  return (AVAILABLE[lang] ?? []).includes(courseId);
}

/** Loads episode content lazily. Returns null if not found. */
export async function getPlayableEpisodeV02(
  courseId: string,
  lang: Lang
): Promise<StoryEpisodeV02 | null> {
  try {
    if (lang === 'de') {
      switch (courseId) {
        case 's1e01': return (await import('./de/s1e01.de')).default;
        case 's1e02': return (await import('./de/s1e02.de')).default;
        case 's1e03': return (await import('./de/s1e03.de')).default;
        case 's1e04': return (await import('./de/s1e04.de')).default;
        case 's1e05': return (await import('./de/s1e05.de')).default;
        case 's1e06': return (await import('./de/s1e06.de')).default;
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
        case 's1e06': return (await import('./en/s1e06.en')).default;
        default: return null;
      }
    }
    return null;
  } catch {
    return null;
  }
}
