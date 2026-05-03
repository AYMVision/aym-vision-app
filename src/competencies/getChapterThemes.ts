// src/competencies/getChapterThemes.ts
import { getEpisodeMetaByCourseId } from '../content/contentIndex';
import type { ThemeId } from './themeMeta';

export function getChapterThemes(
  courseId: string,
  chapterIndex0: number
): ThemeId[] {
  const meta = getEpisodeMetaByCourseId(courseId);
  if (!meta?.chapterTopicTags) return [];

  const chapterNumber = chapterIndex0 + 1;
  return meta.chapterTopicTags[chapterNumber] ?? [];
}