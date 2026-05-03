// src/progress/storySnapshots.ts

import type { Message } from '../common/types';
import type { StoryPhase, UserProfile } from '../profile/types';

export type StorySnapshotScope = {
  seasonId: string;
  episodeId: string;
  courseId: string;
};

export type StorySnapshot = {
  displayedMessages: Message[];
  chapter: number;
  currentMessageIndex: number;
  phase: StoryPhase;
  attemptByQuestion: Record<string, number>;
  updatedAt?: number;
};

function latestStorySnapshotSessionKey(scope: StorySnapshotScope): string {
  return `story-latest-snap-${scope.seasonId}-${scope.episodeId}-${scope.courseId}`;
}

function storyScrollSessionKey(scope: StorySnapshotScope): string {
  return `story-scroll-${scope.seasonId}-${scope.episodeId}-${scope.courseId}`;
}

export function buildStoryTranscriptKey(
  seasonId: string,
  episodeId: string,
  chapterIndex0: number
): string {
  const c = String(chapterIndex0 + 1).padStart(2, '0');
  return `${seasonId}:${episodeId}:c${c}`;
}

export function saveLatestStorySnapshotToSession(
  scope: StorySnapshotScope,
  snapshot: StorySnapshot
): void {
  try {
    sessionStorage.setItem(
      latestStorySnapshotSessionKey(scope),
      JSON.stringify({
        ...snapshot,
        updatedAt: Date.now(),
      })
    );
  } catch {
    // ignore
  }
}

export function loadLatestStorySnapshotFromSession(
  scope: StorySnapshotScope
): StorySnapshot | null {
  try {
    const raw = sessionStorage.getItem(latestStorySnapshotSessionKey(scope));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.displayedMessages)) return null;

    return {
      displayedMessages: parsed.displayedMessages,
      chapter: Number(parsed.chapter ?? 0),
      currentMessageIndex: Number(parsed.currentMessageIndex ?? 0),
      phase: (parsed.phase ?? 'playing') as StoryPhase,
      attemptByQuestion: parsed.attemptByQuestion ?? {},
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

export function saveStoryScrollToSession(
  scope: StorySnapshotScope,
  scrollTop: number
): void {
  try {
    sessionStorage.setItem(storyScrollSessionKey(scope), String(scrollTop));
  } catch {
    // ignore
  }
}

export function loadStoryScrollFromSession(
  scope: StorySnapshotScope
): number | null {
  try {
    const raw = sessionStorage.getItem(storyScrollSessionKey(scope));
    if (!raw) return null;

    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function pickLatestTranscriptSnapshotFromProfile(
  profile: UserProfile,
  seasonId: string,
  episodeId: string
): StorySnapshot | null {
  const prefix = `${seasonId}:${episodeId}:c`;
  const all = profile.storyTranscripts ?? {};

  const candidates = Object.entries(all)
    .filter(([key, value]) => {
      return key.startsWith(prefix) && Array.isArray(value?.displayedMessages) && value.displayedMessages.length > 0;
    })
    .sort((a, b) => {
      const aTs = Number(a[1]?.updatedAt ?? 0);
      const bTs = Number(b[1]?.updatedAt ?? 0);
      return bTs - aTs;
    });

  const snap = candidates[0]?.[1];
  if (!snap) return null;

  return {
    displayedMessages: snap.displayedMessages ?? [],
    chapter: Number(snap.chapter ?? 0),
    currentMessageIndex: Number(snap.currentMessageIndex ?? 0),
    phase: (snap.phase ?? 'playing') as StoryPhase,
    attemptByQuestion: snap.attemptByQuestion ?? {},
    updatedAt: snap.updatedAt,
  };
}

export function applyTranscriptSnapshotToProfile(
  profile: UserProfile,
  key: string,
  snapshot: StorySnapshot
): UserProfile {
  return {
    ...profile,
    storyTranscripts: {
      ...(profile.storyTranscripts ?? {}),
      [key]: {
        displayedMessages: snapshot.displayedMessages,
        chapter: snapshot.chapter,
        currentMessageIndex: snapshot.currentMessageIndex,
        phase: snapshot.phase,
        attemptByQuestion: snapshot.attemptByQuestion,
        updatedAt: Date.now(),
      },
    },
    updatedAt: Date.now(),
  };
}