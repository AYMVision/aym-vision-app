// src/story-v02/runtime/storySessionSnapshotStore.ts

import type { StorySessionSnapshot } from '../types/storyRuntimeTypes';

export type StorySessionScope = {
  seasonId: string;
  episodeId: string;
  courseId: string;
};

function sessionKey(scope: StorySessionScope) {
  return `story-v02-session-${scope.seasonId}-${scope.episodeId}-${scope.courseId}`;
}

export function saveStorySessionSnapshot(
  scope: StorySessionScope,
  snapshot: Omit<StorySessionSnapshot, 'updatedAt'>
): void {
  try {
    const full: StorySessionSnapshot = {
      ...snapshot,
      updatedAt: Date.now(),
    };
    const value = JSON.stringify(full);
    const key = sessionKey(scope);
    // localStorage: survives iOS tab suspension / memory pressure
    localStorage.setItem(key, value);
    // sessionStorage: fast fallback if localStorage is unavailable
    try { sessionStorage.setItem(key, value); } catch { /* ignore */ }
  } catch {
    // ignore
  }
}

export function loadStorySessionSnapshot(
  scope: StorySessionScope
): StorySessionSnapshot | null {
  const key = sessionKey(scope);

  // Prefer sessionStorage (in-tab, freshest) — fall back to localStorage
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
    } catch {
      // try next source
    }
  }
  return null;
}

export function clearStorySessionSnapshot(scope: StorySessionScope): void {
  const key = sessionKey(scope);
  try { sessionStorage.removeItem(key); } catch { /* ignore */ }
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}