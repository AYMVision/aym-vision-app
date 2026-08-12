import { aymFetch } from '../identity/handshake';
import { unlockEpisodePaywallOnly } from '../gating/entitlements';

const OWNED_CONTENT_KEY = 'aym_owned_content';

function cacheKey(profileId: string): string {
  return `aym_p_${profileId}__${OWNED_CONTENT_KEY}`;
}

function readCached(profileId: string): string[] {
  try {
    const raw = localStorage.getItem(cacheKey(profileId));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function refreshOwnership(profileId: string): Promise<string[]> {
  try {
    const path = `/api/v1/aym/content?profileId=${encodeURIComponent(profileId)}`;
    const res = await aymFetch(path);
    if (res.status === 404) return [];
    if (!res.ok) return readCached(profileId);
    const data = await res.json() as { ownedContent: string[]; finishedCourses: string[] };
    const owned = data.ownedContent ?? [];
    for (const contentId of owned) {
      unlockEpisodePaywallOnly(contentId);
    }
    localStorage.setItem(cacheKey(profileId), JSON.stringify(owned));
    return owned;
  } catch {
    return readCached(profileId);
  }
}

export function isOwnedLocally(profileId: string, contentId: string): boolean {
  return readCached(profileId).includes(contentId);
}
