// src/common/firstRun.ts
// Tracks whether the active profile has completed onboarding.
// Flag is profile-scoped (via pStorage). Legacy device-wide key is migrated on first read.

import { pStorage } from '../profile/profileStorage';

const KEY = 'aym_first_run_done';

export function isFirstRunDone(): boolean {
  try {
    // 1. Check profil-scoped flag
    if (pStorage.getItem(KEY) === 'true') return true;

    // 2. Legacy migration: device-wide flag from before multi-profile
    if (localStorage.getItem(KEY) === 'true') {
      pStorage.setItem(KEY, 'true');
      localStorage.removeItem(KEY);
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function markFirstRunDone(): void {
  try {
    pStorage.setItem(KEY, 'true');
    // Clean up legacy device-wide key if it still exists
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

/**
 * Returns true if the active profile should skip onboarding.
 * Falls back to checking profil-scoped story-progress keys for existing users
 * who never had the flag set explicitly.
 */
export function shouldSkipOnboarding(): boolean {
  if (isFirstRunDone()) return true;

  // Fallback: profil-scoped story-progress keys → returning user
  try {
    const scopedKeys = pStorage.allScopedKeys();
    const hasProgress = scopedKeys.some((k) => k.includes('aym_story_progress_'));
    if (hasProgress) {
      markFirstRunDone();
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}
