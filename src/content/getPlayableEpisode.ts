// src/content/getPlayableEpisode.ts

import { CONTENT_INDEX, type EpisodeMeta } from './contentIndex';
import type { Course } from '../common/types';

import s1e01_de from './courses/de/s1e01_de';
import s1e01_en from './courses/en/s1e01_en';

import s1e02_de from './courses/de/s1e02_de';
import s1e02_en from './courses/en/s1e02_en';

type Lang = 'de' | 'en';

type PlayableEpisode = EpisodeMeta & {
  script: Course['script'];
  epilogue?: Course['epilogue'];
};

const COURSE_MAP: Record<Lang, Record<string, Course>> = {
  de: {
    s1e01: s1e01_de,
    s1e02: s1e02_de,
  },
  en: {
    s1e01: s1e01_en,
    s1e02: s1e02_en,
  },
};

export function getPlayableEpisode(
  courseId: string,
  lang: Lang
): PlayableEpisode | null {
  const meta =
    CONTENT_INDEX.flatMap((s) => s.episodes)
      .find((e) => e.courseId === courseId) ?? null;

  const course = COURSE_MAP[lang]?.[courseId] ?? null;

  if (!meta || !course) return null;

  return {
    ...meta,
    script: course.script,
    epilogue: course.epilogue ?? [],
  };
}
