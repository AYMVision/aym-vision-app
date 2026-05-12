// src/common/usePwaContext.ts
// Detects PWA standalone mode and first PWA launch.

import { useEffect, useState } from 'react';

const FIRST_LAUNCH_KEY = 'aym_pwa_first_launch_seen_v1';
const HINT_DISMISSED_KEY = 'aym_pwa_transfer_hint_dismissed_v1';

/** Returns true if running as installed PWA (standalone mode). */
export function isStandalonePwa(): boolean {
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS Safari standalone
      (navigator as unknown as { standalone?: boolean }).standalone === true
    );
  } catch {
    return false;
  }
}

/** True if this is the first time the app is opened in standalone mode. */
export function isPwaFirstLaunch(): boolean {
  if (!isStandalonePwa()) return false;
  try {
    return localStorage.getItem(FIRST_LAUNCH_KEY) !== 'true';
  } catch {
    return false;
  }
}

export function markPwaFirstLaunchSeen(): void {
  try {
    localStorage.setItem(FIRST_LAUNCH_KEY, 'true');
  } catch { /* */ }
}

/** Session-level dismissal of the PWA transfer hint. */
export function isPwaTransferHintDismissed(): boolean {
  try {
    return sessionStorage.getItem(HINT_DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function dismissPwaTransferHint(): void {
  try {
    sessionStorage.setItem(HINT_DISMISSED_KEY, 'true');
  } catch { /* */ }
}

type PwaContext = {
  isStandalone: boolean;
  showTransferHint: boolean;
  dismiss: () => void;
};

/**
 * Hook for PWA context detection.
 * showTransferHint: true when standalone + first launch + not dismissed + no existing progress
 */
export function usePwaContext(): PwaContext {
  const standalone = isStandalonePwa();

  function hasExistingProgress(): boolean {
    try {
      const raw = localStorage.getItem('aym_user_profile');
      if (!raw) return false;
      const p = JSON.parse(raw);
      const chapters = p?.progress?.completedChapters ?? {};
      return Object.keys(chapters).length > 0;
    } catch {
      return false;
    }
  }

  const [dismissed, setDismissed] = useState(() => isPwaTransferHintDismissed());

  const showTransferHint =
    standalone &&
    !dismissed &&
    isPwaFirstLaunch() &&
    !hasExistingProgress();

  useEffect(() => {
    if (standalone) markPwaFirstLaunchSeen();
  }, [standalone]);

  function dismiss() {
    dismissPwaTransferHint();
    setDismissed(true);
  }

  return { isStandalone: standalone, showTransferHint, dismiss };
}
