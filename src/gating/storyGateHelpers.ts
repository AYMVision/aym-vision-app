import { canStartChapter, canStartNextNewChapterToday } from './gateEngine';
import { getProgress, hasCompletedChapter } from '../progress/storyProgress';
import { shouldBypassAll } from './entitlements';

type CourseLike = {
  script: Array<unknown>;
};

export type NextChapterGateState = {
  currentChapterIndex0: number;
  nextChapterIndex0: number;
  hasNext: boolean;

  highestPlayableChapterIndex0: number;

  structuralAllowed: boolean;
  nextAlreadyCompleted: boolean;

  timeAllowed: boolean;
  blockedReason?: 'need_previous' | 'daily_limit';

  shouldShowLockedHint: boolean;
};

export function getHighestPlayableChapterIndex0(courseId?: string): number {
  if (!courseId) return 0;

  const p = getProgress(courseId);
  if (!p) return 0;

  const raw = Number(p.unlockedEpisode ?? 1);

  if (!Number.isFinite(raw) || raw <= 1) return 0;

  return Math.max(0, raw - 1);
}

export function getNextChapterGateState(args: {
  courseId?: string;
  course: CourseLike | null;
  currentChapterIndex0: number;
  bypassAll?: boolean;
}): NextChapterGateState {
const {
  courseId,
  course,
  currentChapterIndex0,
  bypassAll = false,
} = args;

const entitlementBypass = shouldBypassAll(courseId);
const effectiveBypass = bypassAll || entitlementBypass;

  const nextChapterIndex0 = currentChapterIndex0 + 1;
  const hasNext = !!course && typeof course.script[nextChapterIndex0] !== 'undefined';
  const highestPlayableChapterIndex0 = getHighestPlayableChapterIndex0(courseId);

  if (!courseId || !course || !hasNext) {
    return {
      currentChapterIndex0,
      nextChapterIndex0,
      hasNext: false,
      highestPlayableChapterIndex0,
      structuralAllowed: false,
      nextAlreadyCompleted: false,
      timeAllowed: false,
      shouldShowLockedHint: false,
    };
  }

  const nextAlreadyCompleted = hasCompletedChapter(courseId, nextChapterIndex0);

  const structuralGate = canStartChapter({
    episodeId: courseId,
    chapterIndex0: nextChapterIndex0,
    highestPlayableChapterIndex0,
    isAlreadyCompleted: nextAlreadyCompleted,
    bypassAll: effectiveBypass,
  });

  if (!structuralGate.allowed) {
    return {
      currentChapterIndex0,
      nextChapterIndex0,
      hasNext: true,
      highestPlayableChapterIndex0,
      structuralAllowed: false,
      nextAlreadyCompleted,
      timeAllowed: false,
      blockedReason: structuralGate.reason,
      shouldShowLockedHint: false,
    };
  }

  if (nextAlreadyCompleted) {
    return {
      currentChapterIndex0,
      nextChapterIndex0,
      hasNext: true,
      highestPlayableChapterIndex0,
      structuralAllowed: true,
      nextAlreadyCompleted: true,
      timeAllowed: true,
      shouldShowLockedHint: false,
    };
  }

  const timeGate = canStartNextNewChapterToday({
    bypassAll: effectiveBypass,
  });

  if (!timeGate.allowed) {
    const shouldShowLockedHint = timeGate.reason === 'daily_limit';

    return {
      currentChapterIndex0,
      nextChapterIndex0,
      hasNext: true,
      highestPlayableChapterIndex0,
      structuralAllowed: true,
      nextAlreadyCompleted: false,
      timeAllowed: false,
      blockedReason: timeGate.reason,
      shouldShowLockedHint,
    };
  }

  return {
    currentChapterIndex0,
    nextChapterIndex0,
    hasNext: true,
    highestPlayableChapterIndex0,
    structuralAllowed: true,
    nextAlreadyCompleted: false,
    timeAllowed: true,
    shouldShowLockedHint: false,
  };
}