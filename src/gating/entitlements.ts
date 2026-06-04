// src/gating/entitlements.ts

export type Entitlements = {
  bypassAll?: boolean;
  bypassUntil?: string;             // YYYY-MM-DD — bypasses ALL gates (paywall + daily)
  unlockAllEpisodes?: boolean;      // bypasses paywall only, daily pacing stays
  unlockedEpisodes?: string[];
  unlockedEpisodesUntil?: Record<string, string>; // { 's1e01': 'YYYY-MM-DD' } — bypass all gates, time-limited per episode
};

const ENTITLEMENTS_KEY = 'aym-entitlements';

function todayKeyLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getEntitlements(): Entitlements {
  try {
    const raw = localStorage.getItem(ENTITLEMENTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Entitlements;
  } catch {
    return {};
  }
}

export function setEntitlements(data: Entitlements) {
  try {
    localStorage.setItem(ENTITLEMENTS_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

export function clearEntitlements() {
  try {
    localStorage.removeItem(ENTITLEMENTS_KEY);
  } catch {
    // ignore storage errors
  }
}

export function isBypassAllActive(): boolean {
  const e = getEntitlements();
  return e.bypassAll === true;
}

export function isBypassUntilActive(): boolean {
  const e = getEntitlements();
  if (!e.bypassUntil) return false;

  return todayKeyLocal() <= e.bypassUntil;
}

export function isEpisodeUnlockedByEntitlement(courseId?: string): boolean {
  if (!courseId) return false;

  const e = getEntitlements();
  return (e.unlockedEpisodes ?? []).includes(courseId);
}

export function isEpisodeUnlockedUntilActive(courseId?: string): boolean {
  if (!courseId) return false;

  const e = getEntitlements();
  const until = e.unlockedEpisodesUntil?.[courseId];
  if (!until) return false;

  return todayKeyLocal() <= until;
}

export function isAllEpisodesUnlocked(): boolean {
  const e = getEntitlements();
  return e.unlockAllEpisodes === true;
}

export function setUnlockAllEpisodes(active: boolean) {
  const current = getEntitlements();
  setEntitlements({ ...current, unlockAllEpisodes: active });
}

/** Full bypass — paywall AND daily gate */
export function shouldBypassAll(courseId?: string): boolean {
  return (
    isBypassAllActive() ||
    isBypassUntilActive() ||
    isEpisodeUnlockedByEntitlement(courseId) ||
    isEpisodeUnlockedUntilActive(courseId)
  );
}

/** Paywall bypass only — daily pacing stays intact */
export function shouldBypassPaywall(courseId?: string): boolean {
  return shouldBypassAll(courseId) || isAllEpisodesUnlocked();
}

export function setBypassAll(active: boolean) {
  const current = getEntitlements();

  setEntitlements({
    ...current,
    bypassAll: active,
  });
}

export function setBypassUntil(dateYmd?: string) {
  const current = getEntitlements();
  const next: Entitlements = { ...current };

  if (dateYmd && dateYmd.trim()) {
    next.bypassUntil = dateYmd.trim();
  } else {
    delete next.bypassUntil;
  }

  setEntitlements(next);
}

export function unlockEpisode(courseId: string) {
  const normalized = courseId.trim();
  if (!normalized) return;

  const current = getEntitlements();
  const unlocked = new Set(current.unlockedEpisodes ?? []);
  unlocked.add(normalized);

  setEntitlements({
    ...current,
    unlockedEpisodes: Array.from(unlocked),
  });
}

export function removeUnlockedEpisode(courseId: string) {
  const normalized = courseId.trim();
  if (!normalized) return;

  const current = getEntitlements();
  const unlocked = new Set(current.unlockedEpisodes ?? []);
  unlocked.delete(normalized);

  setEntitlements({
    ...current,
    unlockedEpisodes: Array.from(unlocked),
  });
}

export function unlockEpisodeUntil(courseId: string, date: string) {
  const normalized = courseId.trim();
  const dateTrimmed = date.trim();
  if (!normalized || !dateTrimmed) return;

  const current = getEntitlements();
  setEntitlements({
    ...current,
    unlockedEpisodesUntil: {
      ...current.unlockedEpisodesUntil,
      [normalized]: dateTrimmed,
    },
  });
}

export function resetEntitlements() {
  clearEntitlements();
}