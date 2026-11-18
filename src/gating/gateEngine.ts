// src/gating/gateEngine.ts
import { pStorage } from '../profile/profileStorage';
import { loadSettings } from '../settings/appSettings';

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


const DAILY_KEY = 'aym-gate-last-completed-ts';
const FAST_GATE_KEY = 'aym_fast_gate';

export function isFastGateActive(): boolean {
  try {
    return pStorage.getItem(FAST_GATE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setFastGateActive(active: boolean): void {
  try {
    if (active) {
      pStorage.setItem(FAST_GATE_KEY, 'true');
    } else {
      pStorage.removeItem(FAST_GATE_KEY);
    }
  } catch {
    // ignore
  }
}

export function hasCompletedNewChapterToday(): boolean {
  try {
    const raw = pStorage.getItem(DAILY_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;

    if (isFastGateActive()) {
      return Date.now() - ts < 30_000;
    }

    const d = new Date(ts);
    const completionDateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return completionDateKey === todayKeyLocal();
  } catch {
    return false;
  }
}

export function recordNewChapterCompletion(args?: {
  episodeId?: string;
  chapterIndex0?: number;
}): void {
  void args;
  try {
    pStorage.setItem(DAILY_KEY, String(Date.now()));
    incrementWeeklyCounter();
  } catch {
    // ignore storage errors
  }
}

const WEEKLY_KEY = 'aym-gate-weekly';

function getISOWeekKey(): string {
  const now = new Date();
  const temp = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dow = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dow);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((temp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${temp.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function getWeeklyCompletionCount(): number {
  try {
    const raw = pStorage.getItem(WEEKLY_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { weekKey: string; count: number };
    return parsed.weekKey === getISOWeekKey() ? (parsed.count ?? 0) : 0;
  } catch {
    return 0;
  }
}

function incrementWeeklyCounter(): void {
  try {
    const thisWeek = getISOWeekKey();
    const current = getWeeklyCompletionCount();
    pStorage.setItem(WEEKLY_KEY, JSON.stringify({ weekKey: thisWeek, count: current + 1 }));
  } catch {}
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

  const { dailyLockEnabled, unlockPerWeek } = loadSettings();

  if (dailyLockEnabled !== false && hasCompletedNewChapterToday()) {
    return { allowed: false, reason: 'daily_limit', mode: 'blocked' };
  }

  if (unlockPerWeek > 0 && getWeeklyCompletionCount() >= unlockPerWeek) {
    return { allowed: false, reason: 'weekly_limit', mode: 'blocked' };
  }

  return { allowed: true, reason: 'ok', mode: 'play' };
}