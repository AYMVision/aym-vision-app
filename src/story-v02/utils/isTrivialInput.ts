// src/story-v02/utils/isTrivialInput.ts

const TRIVIAL_PHRASES = new Set([
  'nichts',
  'keine ahnung',
  'keine idee',
  'k.a.',
  'ka',
  'weiß nicht',
  'weiss nicht',
  'egal',
  'nein',
  'nö',
  'noe',
  'hmm',
  'hm',
  'keine',
  'nope',
  'pff',
  '???',
  '...',
  '–',
  '-',
  '--',
  '---',
]);

/**
 * Returns true if the input is semantically empty or a non-answer.
 * Used in bypass mode to show a gentle nudge instead of accepting trivial input.
 */
export function isTrivialInput(text: string): boolean {
  const t = text.trim().toLowerCase();

  // Empty or whitespace-only
  if (t.length === 0) return true;

  // Very short (single char or 2 chars like "ok", "ja", "nö")
  if (t.length <= 2) return true;

  // Only punctuation / symbols / whitespace — no actual letters
  if (/^[^a-zA-ZäöüÄÖÜß]+$/.test(t)) return true;

  // Known non-answer phrases
  return TRIVIAL_PHRASES.has(t);
}
