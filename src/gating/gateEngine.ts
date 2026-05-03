// src/gating/gateEngine.ts

type GateReason =
  | 'ok'
  | 'need_previous'
  | 'daily_limit'
  | 'weekly_limit';

type GateMode = 'play' | 'rewatch' | 'blocked' | 'bypass';

export type GateDecision =
  | {
      allowed: true;
      reason: 'ok';
      mode: 'play' | 'rewatch' | 'bypass';
    }
  | {
      allowed: false;
      reason: Exclude<GateReason, 'ok'>;
      mode: 'blocked';
    };

export type CanStartChapterInput = {
  episodeId: string;
  chapterIndex0: number;

  // höchstes Kapitel, das regulär neu gestartet werden darf
  // Beispiel:
  // 0 => nur c01 neu
  // 1 => bis c02 neu
  // 2 => bis c03 neu
  highestPlayableChapterIndex0: number;

  // bereits abgeschlossen => immer rewatch erlauben
  isAlreadyCompleted: boolean;

  // später für DEV / Codes
  bypassAll?: boolean;
};

export function canStartChapter(input: CanStartChapterInput): GateDecision {
  const {
    chapterIndex0,
    highestPlayableChapterIndex0,
    isAlreadyCompleted,
    bypassAll = false,
  } = input;

  if (bypassAll) {
    return {
      allowed: true,
      reason: 'ok',
      mode: 'bypass',
    };
  }

  // Rewatch immer erlaubt
  if (isAlreadyCompleted) {
    return {
      allowed: true,
      reason: 'ok',
      mode: 'rewatch',
    };
  }

  // Neues Kapitel nur, wenn es das aktuell freigeschaltete ist
  if (chapterIndex0 <= highestPlayableChapterIndex0) {
    return {
      allowed: true,
      reason: 'ok',
      mode: 'play',
    };
  }

  return {
    allowed: false,
    reason: 'need_previous',
    mode: 'blocked',
  };
}

function todayKeyLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isoWeekKeyLocal(): string {
  const date = new Date();
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

const DAILY_KEY = 'aym-gate-last-completed-day';
const WEEK_KEY = 'aym-gate-week-key';
const WEEK_COUNT_KEY = 'aym-gate-week-count';

export function getDailyCompletionKey(): string | null {
  try {
    return localStorage.getItem(DAILY_KEY);
  } catch {
    return null;
  }
}

export function getWeeklyCount(): { weekKey: string; count: number } {
  const currentWeek = isoWeekKeyLocal();

  try {
    const savedWeek = localStorage.getItem(WEEK_KEY);
    const savedCount = Number(localStorage.getItem(WEEK_COUNT_KEY) ?? '0');

    if (savedWeek !== currentWeek) {
      return { weekKey: currentWeek, count: 0 };
    }

    return {
      weekKey: currentWeek,
      count: Number.isFinite(savedCount) ? savedCount : 0,
    };
  } catch {
    return { weekKey: currentWeek, count: 0 };
  }
}

export function hasCompletedNewChapterToday(): boolean {
  return getDailyCompletionKey() === todayKeyLocal();
}

export function hasReachedWeeklyLimit(maxPerWeek = 5): boolean {
  const { count } = getWeeklyCount();
  return count >= maxPerWeek;
}

export function recordNewChapterCompletion(args?: {
  episodeId?: string;
  chapterIndex0?: number;
}): void {
  void args;

  const today = todayKeyLocal();
  const currentWeek = isoWeekKeyLocal();

  try {
    const savedWeek = localStorage.getItem(WEEK_KEY);
    const savedCount = Number(localStorage.getItem(WEEK_COUNT_KEY) ?? '0');

    const nextCount =
      savedWeek === currentWeek
        ? (Number.isFinite(savedCount) ? savedCount : 0) + 1
        : 1;

    localStorage.setItem(DAILY_KEY, today);
    localStorage.setItem(WEEK_KEY, currentWeek);
    localStorage.setItem(WEEK_COUNT_KEY, String(nextCount));
  } catch {
    // ignore storage errors
  }
}

export function canStartNextNewChapterToday(opts?: {
  bypassAll?: boolean;
  maxPerWeek?: number;
}): GateDecision {
  const bypassAll = opts?.bypassAll ?? false;
  const maxPerWeek = opts?.maxPerWeek ?? 5;

  if (bypassAll) {
    return {
      allowed: true,
      reason: 'ok',
      mode: 'bypass',
    };
  }

  if (hasCompletedNewChapterToday()) {
    return {
      allowed: false,
      reason: 'daily_limit',
      mode: 'blocked',
    };
  }

  if (hasReachedWeeklyLimit(maxPerWeek)) {
    return {
      allowed: false,
      reason: 'weekly_limit',
      mode: 'blocked',
    };
  }

  return {
    allowed: true,
    reason: 'ok',
    mode: 'play',
  };
}