const KEY = 'aym_seen_stickers_v1';

export function loadSeenStickers(): Record<string, true> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return {};
    const map: Record<string, true> = {};
    for (const id of arr) map[String(id)] = true;
    return map;
  } catch {
    return {};
  }
}

export function markStickerSeen(id: string) {
  try {
    const seen = loadSeenStickers();
    if (seen[id]) return;
    const next = Object.keys({ ...seen, [id]: true });
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}
