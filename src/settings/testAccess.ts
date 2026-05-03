// src/settings/testAccess.ts

const TEST_ACCESS_KEY = 'aym-test-access';

export function hasTestAccess(): boolean {
  try {
    return localStorage.getItem(TEST_ACCESS_KEY) === '1';
  } catch {
    return false;
  }
}

export function grantTestAccess() {
  try {
    localStorage.setItem(TEST_ACCESS_KEY, '1');
  } catch {
    // ignore
  }
}

export function clearTestAccess() {
  try {
    localStorage.removeItem(TEST_ACCESS_KEY);
  } catch {
    // ignore
  }
}

export function canOpenTestSettings(): boolean {
  return import.meta.env.DEV || hasTestAccess();
}