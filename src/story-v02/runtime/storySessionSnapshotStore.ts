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

    sessionStorage.setItem(sessionKey(scope), JSON.stringify(full));
  } catch {
    // ignore
  }
}

export function loadStorySessionSnapshot(
  scope: StorySessionScope
): StorySessionSnapshot | null {
  try {
    const raw = sessionStorage.getItem(sessionKey(scope));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transcript)) return null;

    return parsed as StorySessionSnapshot;
  } catch {
    return null;
  }
}

export function clearStorySessionSnapshot(scope: StorySessionScope): void {
  try {
    sessionStorage.removeItem(sessionKey(scope));
  } catch {
    // ignore
  }
}