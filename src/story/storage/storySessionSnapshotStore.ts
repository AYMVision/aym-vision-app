import type { StoryRuntimeSnapshotV2 } from '../engine/storyRuntimeTypes';

export type StorySessionSnapshotScope = {
  seasonId: string;
  episodeId: string;
  courseId: string;
};

function keyFor(scope: StorySessionSnapshotScope) {
  return `story-v02-session-snapshot-${scope.seasonId}-${scope.episodeId}-${scope.courseId}`;
}

export function saveStorySessionSnapshot(
  scope: StorySessionSnapshotScope,
  snapshot: StoryRuntimeSnapshotV2
): void {
  try {
    sessionStorage.setItem(
      keyFor(scope),
      JSON.stringify({
        ...snapshot,
        updatedAt: Date.now(),
      })
    );
  } catch {
    // ignore
  }
}

export function loadStorySessionSnapshot(
  scope: StorySessionSnapshotScope
): StoryRuntimeSnapshotV2 | null {
  try {
    const raw = sessionStorage.getItem(keyFor(scope));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.displayedMessages)) return null;

    return {
      courseId: String(parsed.courseId ?? scope.courseId),
      chapterIndex0: Number(parsed.chapterIndex0 ?? 0),
      stepIndex0: Number(parsed.stepIndex0 ?? 0),
      phase: parsed.phase ?? 'playing_story',
      displayedMessages: parsed.displayedMessages ?? [],
      completedStepIds: parsed.completedStepIds ?? [],
      currentMessageIndexInStep: Number(parsed.currentMessageIndexInStep ?? 0),
      attemptByStepId: parsed.attemptByStepId ?? {},
      updatedAt: Number(parsed.updatedAt ?? Date.now()),
    };
  } catch {
    return null;
  }
}

export function clearStorySessionSnapshot(
  scope: StorySessionSnapshotScope
): void {
  try {
    sessionStorage.removeItem(keyFor(scope));
  } catch {
    // ignore
  }
}