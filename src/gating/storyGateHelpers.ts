import { canStartChapter, canStartNextNewChapterToday } from './gateEngine';
import { getProgress, hasCompletedChapter } from '../progress/storyProgress';
import { shouldBypassAll, shouldBypassPaywall } from './entitlements';
import { isPaywallChapter } from './demoConfig';

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

  isPaywallGated: boolean;
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

// Full bypass: paywall + daily gate (bypassAll/bypassUntil codes)
const effectiveBypassAll = bypassAll || shouldBypassAll(courseId);
// Paywall-only bypass: structural gate only, daily pacing stays (ownership / beta codes)
const paywallBypass = bypassAll || shouldBypassPaywall(courseId);

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
      isPaywallGated: false,
      shouldShowLockedHint: false,
    };
  }

  // Paywall gate: chapter is beyond the free demo and user hasn't purchased
  if (isPaywallChapter(courseId, nextChapterIndex0) && !paywallBypass) {
    return {
      currentChapterIndex0,
      nextChapterIndex0,
      hasNext: true,
      highestPlayableChapterIndex0,
      structuralAllowed: false,
      nextAlreadyCompleted: false,
      timeAllowed: false,
      isPaywallGated: true,
      shouldShowLockedHint: false,
    };
  }

  const nextAlreadyCompleted = hasCompletedChapter(courseId, nextChapterIndex0);

  const structuralGate = canStartChapter({
    episodeId: courseId,
    chapterIndex0: nextChapterIndex0,
    highestPlayableChapterIndex0,
    isAlreadyCompleted: nextAlreadyCompleted,
    bypassAll: paywallBypass,
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
      isPaywallGated: false,
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
      isPaywallGated: false,
      shouldShowLockedHint: false,
    };
  }

  const timeGate = canStartNextNewChapterToday({
    bypassAll: effectiveBypassAll,
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
      isPaywallGated: false,
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
    isPaywallGated: false,
    shouldShowLockedHint: false,
  };
}
