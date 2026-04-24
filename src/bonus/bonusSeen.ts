// src/bonus/bonusSeen.ts
// "Gesehen" = User hat den Artikel/die Karte geöffnet und gelesen.
// "Freigeschaltet" = Story hat den Marker gesetzt (unlockBonusById).
// Diese beiden Zustände sind bewusst getrennt:
//   - aym_seen_bonus_v1   → User hat geklickt/gelesen
//   - aym_bonus_markers_v1 → Story hat freigeschaltet (Marker)

const KEY = 'aym_seen_bonus_v1';
const MARKER_KEY = 'aym_bonus_markers_v1';

// ---------------------------------------------------------------------------
// Marker-Freischaltungen (story-seitig, unabhängig vom "gelesen"-Status)
// ---------------------------------------------------------------------------

export function loadUnlockedMarkers(): Set<string> {
  try {
    const raw = localStorage.getItem(MARKER_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []);
  } catch {
    return new Set();
  }
}

export function markBonusUnlocked(bonusId: string): boolean {
  if (!bonusId) return false;
  const current = loadUnlockedMarkers();
  if (current.has(bonusId)) return false;
  current.add(bonusId);
  try {
    localStorage.setItem(MARKER_KEY, JSON.stringify(Array.from(current)));
  } catch {
    // ignore
  }
  return true;
}

export function isBonusMarkerUnlocked(bonusId: string): boolean {
  return loadUnlockedMarkers().has(bonusId);
}

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
