import LZString from 'lz-string';
import type { StudioStory } from './studioTypes';

const DRAFT_KEY = 'aym_studio_draft';

export function encodeStory(story: StudioStory): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(story));
}

export function decodeStory(encoded: string): StudioStory | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = JSON.parse(json) as StudioStory;
    if (parsed.v !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDraft(story: StudioStory): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(story));
  } catch { /* ignore */ }
}

export function loadDraft(): StudioStory | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudioStory;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch { /* ignore */ }
}
