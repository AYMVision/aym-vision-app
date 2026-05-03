// src/analytics/analyticsStore.ts
// Lesen/Schreiben der Analytics-Daten in localStorage.
// Fire-and-forget: keine Funktion wirft, keine Funktion blockiert die UI.

import {
  ANALYTICS_STORE_KEY,
  ANALYTICS_SCHEMA_VERSION,
  ANALYTICS_MAX_DECISIONS,
  type AnalyticsStore,
  type StepDecision,
} from './schema';

function generatePseudoId(): string {
  const a = Math.random().toString(36).slice(2, 9);
  const b = Math.random().toString(36).slice(2, 9);
  return `${a}${b}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function currentLang(): string {
  try {
    return document.documentElement.lang?.slice(0, 2) || 'de';
  } catch {
    return 'de';
  }
}

function appVersion(): string {
  try {
    return (import.meta as any).env?.VITE_APP_VERSION ?? '1.0';
  } catch {
    return '1.0';
  }
}

export function loadStore(): AnalyticsStore {
  try {
    const raw = localStorage.getItem(ANALYTICS_STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AnalyticsStore;
      if (parsed?.schemaVersion === ANALYTICS_SCHEMA_VERSION) return parsed;
    }
  } catch {
    // ignore — storage unavailable or corrupt
  }

  return {
    schemaVersion: ANALYTICS_SCHEMA_VERSION,
    meta: {
      pseudoId: generatePseudoId(),
      appVersion: appVersion(),
      lang: currentLang(),
      firstSeen: today(),
      lastSeen: today(),
    },
    decisions: [],
  };
}

function saveStore(store: AnalyticsStore): void {
  try {
    localStorage.setItem(ANALYTICS_STORE_KEY, JSON.stringify(store));
  } catch {
    // ignore — storage full or unavailable
  }
}

export function appendDecision(decision: StepDecision): void {
  try {
    const store = loadStore();
    store.meta.lastSeen = today();
    store.meta.lang = currentLang();
    store.meta.appVersion = appVersion();

    if (store.decisions.length >= ANALYTICS_MAX_DECISIONS) {
      store.decisions = store.decisions.slice(-(ANALYTICS_MAX_DECISIONS - 1));
    }
    store.decisions.push(decision);
    saveStore(store);
  } catch {
    // fire-and-forget
  }
}

export function clearAnalytics(): void {
  try {
    localStorage.removeItem(ANALYTICS_STORE_KEY);
  } catch {
    // ignore
  }
}

export function getDecisionCount(): number {
  try {
    return loadStore().decisions.length;
  } catch {
    return 0;
  }
}
