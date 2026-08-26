import { aymFetch } from '../identity/handshake';
import { unlockEpisodePaywallOnly, setBypassUntil } from '../gating/entitlements';
import { loadIdentity } from '../identity/storage';
import { deriveBackendProfileId } from '../identity/keys';
import { getActiveProfileId } from '../profile/profileStorage';

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

export async function refreshOwnership(): Promise<string[]> {
  const identity = loadIdentity();
  const activeProfileId = getActiveProfileId();
  if (!identity || !activeProfileId) return [];

  const backendProfileId = deriveBackendProfileId(identity.mnemonic);

  try {
    const path = `/api/v1/extension/aym-vision/content?profileId=${encodeURIComponent(backendProfileId)}`;
    const res = await aymFetch(path);
    if (res.status === 404) return [];
    if (!res.ok) return readCached(activeProfileId);
    const raw = await res.json() as { contentId: string }[];
    const owned = Array.isArray(raw) ? raw.map(item => item.contentId) : [];
    for (const contentId of owned) {
      if (contentId === 's1-full') {
        unlockEpisodePaywallOnly('s1');
        setBypassUntil('2026-10-31');
      } else {
        unlockEpisodePaywallOnly(contentId);
      }
    }
    localStorage.setItem(cacheKey(activeProfileId), JSON.stringify(owned));
    return owned;
  } catch {
    return readCached(activeProfileId);
  }
}

export function isOwnedLocally(profileId: string, contentId: string): boolean {
  return readCached(profileId).includes(contentId);
}

/** True if the season (e.g. 's1') or any of its episodes (e.g. 's1e01') or full-access variant (e.g. 's1-full') is owned. */
export function isSeasonOwnedLocally(profileId: string, season: string): boolean {
  const cached = readCached(profileId);
  return cached.some(id => id === season || id.startsWith(season + 'e') || id.startsWith(season + '-'));
}
