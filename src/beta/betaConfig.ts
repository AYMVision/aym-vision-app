// src/beta/betaConfig.ts
// Master switch for the beta test phase.
// Set BETA_ACTIVE = false to deactivate all beta UI.

export const BETA_ACTIVE = true;
export const BETA_END_DATE = '2026-07-31';
export const BETA_END_DATE_DISPLAY = '31. Juli 2026';
export const BETA_CONTACT_EMAIL = 'hello@amysurfwing.de';

const BETA_CODE_KEY = 'aym_beta_code';
const PENDING_BETA_CODE_KEY = 'aym_pending_beta_code';
const BETA_COMPLETION_SHOWN_KEY = 'aym_beta_completion_shown';
const BETA_PARTIAL_DISMISSED_KEY = 'aym_beta_partial_dismissed';

export const BETA_CODES = ['ERSTEWELLE'];

export function isBetaTester(): boolean {
  if (!BETA_ACTIVE) return false;
  try {
    return !!localStorage.getItem(BETA_CODE_KEY);
  } catch {
    return false;
  }
}

export function setBetaCodeApplied(code: string): void {
  try {
    localStorage.setItem(BETA_CODE_KEY, code);
  } catch {
    // ignore
  }
}

export function getPendingBetaCode(): string | null {
  try {
    return localStorage.getItem(PENDING_BETA_CODE_KEY);
  } catch {
    return null;
  }
}

export function setPendingBetaCode(code: string): void {
  try {
    localStorage.setItem(PENDING_BETA_CODE_KEY, code);
  } catch {
    // ignore
  }
}

export function clearPendingBetaCode(): void {
  try {
    localStorage.removeItem(PENDING_BETA_CODE_KEY);
  } catch {
    // ignore
  }
}

export function isBetaCompletionShown(): boolean {
  try {
    return localStorage.getItem(BETA_COMPLETION_SHOWN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markBetaCompletionShown(): void {
  try {
    localStorage.setItem(BETA_COMPLETION_SHOWN_KEY, 'true');
  } catch {
    // ignore
  }
}

export function isBetaPartialDismissed(): boolean {
  try {
    return localStorage.getItem(BETA_PARTIAL_DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markBetaPartialDismissed(): void {
  try {
    localStorage.setItem(BETA_PARTIAL_DISMISSED_KEY, 'true');
  } catch {
    // ignore
  }
}
