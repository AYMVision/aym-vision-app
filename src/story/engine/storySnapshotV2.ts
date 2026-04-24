import type { Message } from '../../common/types';
import type { StoryPhase } from '../../profile/types';
import type { StoryRuntimePhase, StoryRuntimeSnapshotV2 } from './storyRuntimeTypes';

export type LegacyStorySnapshotLike = {
  displayedMessages: Message[];
  chapter: number;
  currentMessageIndex: number;
  phase: StoryPhase;
  attemptByQuestion: Record<string, number>;
  updatedAt?: number;
};

function mapLegacyPhaseToRuntimePhase(phase: StoryPhase): StoryRuntimePhase {
  switch (phase) {
    case 'playing':
      return 'playing_story';
    case 'awaiting_answer':
      return 'awaiting_legacy_answer';
    case 'resolving':
      return 'resolving_legacy_answer';
    case 'unlocked':
      return 'showing_legacy_reaction';
    case 'finished':
      return 'chapter_finished';
    default:
      return 'playing_story';
  }
}

function mapRuntimePhaseToLegacyPhase(phase: StoryRuntimePhase): StoryPhase {
  switch (phase) {
    case 'playing_story':
      return 'playing';
    case 'awaiting_legacy_answer':
      return 'awaiting_answer';
    case 'resolving_legacy_answer':
      return 'resolving';
    case 'showing_legacy_reaction':
      return 'unlocked';
    case 'chapter_finished':
    case 'episode_finished':
      return 'finished';
    default:
      return 'playing';
  }
}

export function buildRuntimeSnapshotFromLegacy(args: {
  courseId: string;
  legacy: LegacyStorySnapshotLike;
  stepIndex0?: number;
}): StoryRuntimeSnapshotV2 {
  const { courseId, legacy, stepIndex0 = 0 } = args;

  return {
    courseId,
    chapterIndex0: legacy.chapter ?? 0,
    stepIndex0,
    phase: mapLegacyPhaseToRuntimePhase(legacy.phase ?? 'playing'),
    displayedMessages: legacy.displayedMessages ?? [],
    completedStepIds: [],
    currentMessageIndexInStep: legacy.currentMessageIndex ?? 0,
    attemptByStepId: {},
    updatedAt: legacy.updatedAt ?? Date.now(),
  };
}

export function buildLegacyLikeSnapshotFromRuntime(
  snapshot: StoryRuntimeSnapshotV2
): LegacyStorySnapshotLike {
  return {
    displayedMessages: snapshot.displayedMessages,
    chapter: snapshot.chapterIndex0,
    currentMessageIndex: snapshot.currentMessageIndexInStep,
    phase: mapRuntimePhaseToLegacyPhase(snapshot.phase),
    attemptByQuestion: {},
    updatedAt: snapshot.updatedAt ?? Date.now(),
  };
}