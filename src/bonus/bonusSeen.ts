// src/bonus/bonusSeen.ts
// Single Source of Truth für "gesehen" Bonusitems (Newspaper, Tips, Diaries, Cards-Detail-Views etc.)

const KEY = 'aym_seen_bonus_v1';

export function loadSeenBonusIds(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** idempotent: schreibt nur, wenn noch nicht drin */
export function markBonusSeen(bonusId: string) {
  if (!bonusId) return;

  const current = new Set(loadSeenBonusIds());
  if (current.has(bonusId)) return;

  current.add(bonusId);
  try {
    localStorage.setItem(KEY, JSON.stringify(Array.from(current)));
  } catch {
    // ignore
  }
}

export function isBonusSeen(bonusId: string): boolean {
  return loadSeenBonusIds().includes(bonusId);
}

export function clearSeenBonusIds() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
