// src/notifications/reminderService.ts
// Zentrale Logik für Erinnerungen:
//   - 'full'       → tägliche Push-Notification + Badge (Android PWA, Desktop Chrome)
//   - 'badge-only' → nur App-Icon-Badge (iOS 16.4+ PWA)
//   - 'none'       → nicht unterstützt

import { saveSettings } from '../settings/appSettings'

export type ReminderCapability = 'full' | 'badge-only' | 'none'

const SYNC_TAG = 'daily-amic-reminder'
const SYNC_INTERVAL = 20 * 60 * 60 * 1000 // 20h (Browser rundet auf eigenes Minimum)

// ---------------------------------------------------------------------------
// Capability Detection
// ---------------------------------------------------------------------------

export function getReminderCapability(): ReminderCapability {
  if (typeof window === 'undefined') return 'none'

  const hasNotification = 'Notification' in window
  const hasPeriodicSync = 'serviceWorker' in navigator && 'PeriodicSyncManager' in window
  const hasBadge = 'setAppBadge' in navigator

  if (hasNotification && hasPeriodicSync) return 'full'
  if (hasBadge) return 'badge-only'
  return 'none'
}

// ---------------------------------------------------------------------------
// Hint Text (plattformabhängig)
// ---------------------------------------------------------------------------

export function getReminderHint(enabled: boolean): string {
  const cap = getReminderCapability()

  if (cap === 'none') {
    return 'Erinnerungen werden auf diesem Gerät nicht unterstützt.'
  }
  if (!enabled) {
    return cap === 'full'
      ? 'Tägliche Benachrichtigung und App-Icon-Hinweis deaktiviert.'
      : 'App-Icon-Hinweis deaktiviert.'
  }
  return cap === 'full'
    ? 'Du bekommst täglich eine Benachrichtigung, wenn ein neuer Amic wartet.'
    : 'Das App-Icon zeigt dir an, wenn ein neuer Amic wartet.'
}

// ---------------------------------------------------------------------------
// Enable / Disable
// ---------------------------------------------------------------------------

/** Aktiviert Erinnerungen — gibt true zurück wenn erfolgreich */
export async function enableReminders(): Promise<boolean> {
  const cap = getReminderCapability()
  if (cap === 'none') return false

  // Notification Permission anfragen (nur für 'full')
  if (cap === 'full') {
    if (Notification.permission === 'denied') return false
    if (Notification.permission === 'default') {
      const result = await Notification.requestPermission()
      if (result !== 'granted') return false
    }
  }

  // Periodic Background Sync registrieren
  if (cap === 'full') {
    try {
      const reg = await navigator.serviceWorker.ready
      if ('periodicSync' in reg) {
        const status = await navigator.permissions.query({
          name: 'periodic-background-sync' as PermissionName,
        })
        if (status.state === 'granted') {
          await (reg as any).periodicSync.register(SYNC_TAG, {
            minInterval: SYNC_INTERVAL,
          })
        }
      }
    } catch {
      // periodicSync nicht verfügbar oder abgelehnt → Badge reicht als Fallback
    }
  }

  saveSettings({ remindersEnabled: true })
  return true
}

/** Deaktiviert Erinnerungen vollständig */
export async function disableReminders(): Promise<void> {
  try {
    const reg = await navigator.serviceWorker.ready
    if ('periodicSync' in reg) {
      await (reg as any).periodicSync.unregister(SYNC_TAG)
    }
  } catch {
    // ignore
  }

  clearAmicBadge()
  saveSettings({ remindersEnabled: false })
}

// ---------------------------------------------------------------------------
// Badge API
// ---------------------------------------------------------------------------

/** Nach Kapitelabschluss: Badge setzen */
export function setAmicBadge(): void {
  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(1).catch(() => {})
  }
}

/** Beim App-Öffnen: Badge entfernen */
export function clearAmicBadge(): void {
  if ('clearAppBadge' in navigator) {
    navigator.clearAppBadge().catch(() => {})
  }
}
