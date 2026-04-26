// src/analytics/consent.ts
import { ANALYTICS_CONSENT_KEY, type ConsentStatus } from './schema';

export function getConsentStatus(): ConsentStatus {
  try {
    const val = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    if (val === 'granted') return 'granted';
    if (val === 'denied') return 'denied';
  } catch {
    // ignore
  }
  return 'unknown';
}

export function setConsent(granted: boolean): void {
  try {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, granted ? 'granted' : 'denied');
  } catch {
    // ignore
  }
}
