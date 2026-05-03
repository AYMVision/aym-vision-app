// src/story-v02/runtime/amicSessionStore.ts
// Per-Amic (chapter-scoped) session storage.
// Key: story-v02-amic-{courseId}-{chapterId}
// Each chapter stores its own step position independently.

import type { StorySessionSnapshot } from '../types/storyRuntimeTypes';

function amicKey(courseId: string, chapterId: string): string {
  return `story-v02-amic-${courseId}-${chapterId}`;
}

export function saveAmicSession(
  courseId: string,
  chapterId: string,
  snapshot: Omit<StorySessionSnapshot, 'updatedAt'>
): void {
  try {
    const full: StorySessionSnapshot = { ...snapshot, updatedAt: Date.now() };
    const value = JSON.stringify(full);
    const key = amicKey(courseId, chapterId);
    localStorage.setItem(key, value);
    try { sessionStorage.setItem(key, value); } catch { /* ignore */ }
  } catch { /* ignore */ }
}

export function loadAmicSession(
  courseId: string,
  chapterId: string
): StorySessionSnapshot | null {
  const key = amicKey(courseId, chapterId);
  const sources = [
    () => sessionStorage.getItem(key),
    () => localStorage.getItem(key),
  ];
  for (const getItem of sources) {
    try {
      const raw = getItem();
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.transcript)) continue;
      return parsed as StorySessionSnapshot;
    } catch { /* try next source */ }
  }
  return null;
}

export function clearAmicSession(courseId: string, chapterId: string): void {
  const key = amicKey(courseId, chapterId);
  try { sessionStorage.removeItem(key); } catch { /* ignore */ }
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}
