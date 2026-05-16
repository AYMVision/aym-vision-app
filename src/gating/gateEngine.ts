// src/gating/gateEngine.ts

type GateReason =
  | 'ok'
  | 'need_previous'
  | 'daily_limit';

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


const DAILY_KEY = 'aym-gate-last-completed-day';

export function getDailyCompletionKey(): string | null {
  try {
    return localStorage.getItem(DAILY_KEY);
  } catch {
    return null;
  }
}

export function hasCompletedNewChapterToday(): boolean {
  return getDailyCompletionKey() === todayKeyLocal();
}

export function recordNewChapterCompletion(args?: {
  episodeId?: string;
  chapterIndex0?: number;
}): void {
  void args;

  const today = todayKeyLocal();

  try {
    localStorage.setItem(DAILY_KEY, today);
  } catch {
    // ignore storage errors
  }
}

export function canStartNextNewChapterToday(opts?: {
  bypassAll?: boolean;
}): GateDecision {
  const bypassAll = opts?.bypassAll ?? false;

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

  return {
    allowed: true,
    reason: 'ok',
    mode: 'play',
  };
}