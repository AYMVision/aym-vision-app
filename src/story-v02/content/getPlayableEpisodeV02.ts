// src/story-v02/content/getPlayableEpisodeV02.ts

import type { StoryEpisodeV02 } from '../types/storyTypes';

import s1e01De from './de/s1e01.de';
import s1e01En from './en/s1e01.en';
import s1e02De from './de/s1e02.de';
import s1e02En from './en/s1e02.en';
import s1e03De from './de/s1e03.de';
import s1e03En from './en/s1e03.en';
import s1e04De from './de/s1e04.de';
import s1e04En from './en/s1e04.en';
import s1e05De from './de/s1e05.de';
import s1e05En from './en/s1e05.en';
import s1e06De from './de/s1e06.de';
import s1e06En from './en/s1e06.en';

type Lang = 'de' | 'en';

const COURSE_MAP: Record<Lang, Record<string, StoryEpisodeV02>> = {
  de: {
    s1e01: s1e01De,
    s1e02: s1e02De,
    s1e03: s1e03De,
    s1e04: s1e04De,
    s1e05: s1e05De,
    s1e06: s1e06De,
  },
  en: {
    s1e01: s1e01En,
    s1e02: s1e02En,
    s1e03: s1e03En,
    s1e04: s1e04En,
    s1e05: s1e05En,
    s1e06: s1e06En,
  },
};

export function getPlayableEpisodeV02(
  courseId: string,
  lang: Lang
): StoryEpisodeV02 | null {
  return COURSE_MAP[lang]?.[courseId] ?? null;
}