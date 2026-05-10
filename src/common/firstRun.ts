// src/common/firstRun.ts
// Tracks whether the user has completed the onboarding flow.

const KEY = 'aym_first_run_done';

export function isFirstRunDone(): boolean {
  try {
    return localStorage.getItem(KEY) === 'true';
  } catch {
    return false;
  }
}

export function markFirstRunDone(): void {
  try {
    localStorage.setItem(KEY, 'true');
  } catch {
    // ignore
  }
}

/**
 * Returns true if the user should skip onboarding.
 * Existing users (already have story progress in localStorage) are treated as done,
 * even if they never set the flag — prevents beta users from getting onboarding on update.
 */
export function shouldSkipOnboarding(): boolean {
  if (isFirstRunDone()) return true;

  // Check if any story progress exists → user was here before
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('aym_story_progress_')) {
        markFirstRunDone(); // backfill the flag
        return true;
      }
    }
  } catch {
    // ignore
  }

  return false;
}
