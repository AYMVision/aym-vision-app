// src/story/engine/storyAdvance.ts

import { getNextChapterGateState } from '../../gating/storyGateHelpers';

type CourseLike = {
  script: Array<unknown>;
};

export type StoryAdvanceDecision =
  | {
      type: 'finish_episode';
      gateDebug: string;
    }
  | {
      type: 'structural_block';
      gateDebug: string;
      shouldShowLockedHint: false;
    }
  | {
      type: 'time_block';
      gateDebug: string;
      shouldShowLockedHint: boolean;
      blockedReason?: 'daily_limit';
    }
  | {
      type: 'advance';
      gateDebug: string;
      nextChapterIndex0: number;
    };

export function decideNextStoryStep(args: {
  courseId?: string;
  course: CourseLike | null;
  currentChapterIndex0: number;
  bypassAll?: boolean;
}): StoryAdvanceDecision {
  const gateState = getNextChapterGateState({
    courseId: args.courseId,
    course: args.course,
    currentChapterIndex0: args.currentChapterIndex0,
    bypassAll: args.bypassAll ?? false,
  });

  const current = args.currentChapterIndex0;
  const next = gateState.nextChapterIndex0;

  if (!gateState.hasNext) {
    return {
      type: 'finish_episode',
      gateDebug: `no-next | current=${current} | next=${next}`,
    };
  }

  if (!gateState.structuralAllowed) {
    return {
      type: 'structural_block',
      gateDebug:
        `structural-block | current=${current} | next=${next} | ` +
        `highestPlayable=${gateState.highestPlayableChapterIndex0} | ` +
        `nextCompleted=${String(gateState.nextAlreadyCompleted)}`,
      shouldShowLockedHint: false,
    };
  }

  if (!gateState.timeAllowed) {
    return {
      type: 'time_block',
      gateDebug: `time-block | reason=${gateState.blockedReason} | current=${current} | next=${next}`,
      shouldShowLockedHint: gateState.shouldShowLockedHint,
      blockedReason: gateState.blockedReason === 'daily_limit' ? gateState.blockedReason : undefined,
    };
  }

  return {
    type: 'advance',
    gateDebug: `advance | current=${current} | next=${next}`,
    nextChapterIndex0: next,
  };
}