// Which episodes have free preview chapters and how many.
// Demo chapters bypass the daily gate; the first non-demo chapter
// requires purchase (shows paywall instead of starting).
export const DEMO_CHAPTERS: Record<string, number> = {
  's1e01': 3,
};

export function isDemoChapter(courseId: string, chapterIndex0: number): boolean {
  const freeCount = DEMO_CHAPTERS[courseId] ?? 0;
  return chapterIndex0 < freeCount;
}

export function isPaywallChapter(courseId: string, chapterIndex0: number): boolean {
  const freeCount = DEMO_CHAPTERS[courseId] ?? 0;
  return freeCount > 0 && chapterIndex0 >= freeCount;
}
