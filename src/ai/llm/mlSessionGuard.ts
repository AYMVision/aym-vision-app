const DISABLED_KEY = 'aym_ml_disabled_session';
const FAIL_COUNT_KEY = 'aym_ml_fail_count';
const MAX_FAILS = 3;

// ------------------------------------------------
// Status prüfen
// ------------------------------------------------

export function isMlDisabledForSession(): boolean {
  try {
    return sessionStorage.getItem(DISABLED_KEY) === '1';
  } catch {
    return false;
  }
}

// ------------------------------------------------
// Nur bei echten harten Fehlern deaktivieren
// ------------------------------------------------

export function disableMlForSession(reason?: string) {
  try {
    sessionStorage.setItem(DISABLED_KEY, '1');
  } catch {
    // ignore
  }

  if (reason) {
    console.warn('[ML] disabled for session:', reason);
  }
}

// ------------------------------------------------
// Fehler registrieren (robust)
// ------------------------------------------------

export function registerMlFailure(reason?: string) {
  try {
    const current = Number(sessionStorage.getItem(FAIL_COUNT_KEY) ?? '0');
    const next = current + 1;
    sessionStorage.setItem(FAIL_COUNT_KEY, String(next));

    console.warn(`[ML] failure ${next}/${MAX_FAILS}`, reason);

    if (next >= MAX_FAILS) {
      disableMlForSession(`Too many ML failures (${next})`);
    }
  } catch {
    // ignore
  }
}

// ------------------------------------------------
// Optional: Reset (für Dev)
// ------------------------------------------------

export function resetMlForSession() {
  try {
    sessionStorage.removeItem(DISABLED_KEY);
    sessionStorage.removeItem(FAIL_COUNT_KEY);
  } catch {
    // ignore
  }
}
