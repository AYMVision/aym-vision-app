// src/ai/core/detectUnsicherReason.ts

export type UnsicherReason = 'confused' | 'clarify' | 'empty';

function normalize(t: string) {
  return (t ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    // ? behalten, damit wir echte Rückfragen erkennen können
    .replace(/[^\p{L}\p{N}\s\?]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isEmptyLike(raw: string) {
  const s = (raw ?? '').trim();
  if (!s) return true;

  // nach normalize ohne ? prüfen
  const norm = normalize(s).replace(/\?/g, '').trim();
  if (!norm) return true;
  if (norm.length < 2) return true;

  return false;
}

const CONFUSED_PATTERNS_DE = [
  'weiss nicht',
  'keine ahnung',
  'kp',
  'ka',
  'kein plan',
  'keinen plan',
  'keine idee',
  'ich versteh das nicht',
  'ich verstehe das nicht',
  'versteh ich nicht',
  'ich check das nicht',
  'check ich nicht',
  'ich kapier das nicht',
  'kapier ich nicht',
  'ich versteh die frage nicht',
  'ich verstehe die frage nicht',
];

const CLARIFY_PATTERNS_DE = [
  'was meinst du',
  'wie meinst du',
  'was bedeutet',
  'was heisst',
  'was heisst', // durch normalize wird "heißt" => "heisst"
  'kannst du das erklaeren',
  'kannst du das erklaren', // falls jemand ohne e schreibt
  'kannst du das genauer sagen',
  'kannst du das anders sagen',
  'ich verstehe nicht was du meinst',
  'was genau',
];

const CONFUSED_PATTERNS_EN = [
  "i don't know",
  "i dont know",
  'dont know',
  'no idea',
  "i'm not sure",
  'im not sure',
  "i don't understand",
  'i dont understand',
  "i can't understand",
  'cant understand',
  "i'm confused",
  'im confused',
];

const CLARIFY_PATTERNS_EN = [
  'what do you mean',
  'what exactly',
  'can you explain',
  'can you say it again',
  'can you rephrase',
  'which one do you mean',
  'what do you mean by',
  'how do you mean',
];

export function detectUnsicherReason(input: {
  userAnswer: string;
  questionText?: string; // bleibt drin, damit runAmy-Aufruf unverändert bleiben kann
  lang: 'de' | 'en';
}): UnsicherReason {
  const raw = input.userAnswer ?? '';

  if (isEmptyLike(raw)) return 'empty';

  const t = normalize(raw);
  const isEn = input.lang === 'en';

  const CONFUSED = isEn ? CONFUSED_PATTERNS_EN : CONFUSED_PATTERNS_DE;
  const CLARIFY = isEn ? CLARIFY_PATTERNS_EN : CLARIFY_PATTERNS_DE;

  // echte Rückfrage zuerst
  const hasClarifyPhrase = CLARIFY.some((p) => t.includes(normalize(p)));

  if (hasClarifyPhrase || t.endsWith('?')) {
    // Fragezeichen alleine kann zu viel sein, deshalb zusätzlich Marker prüfen
    // DE: was/wie/genau | EN: what/how/exactly
    const hasMarkers =
      (isEn && (t.includes('what') || t.includes('how') || t.includes('exact'))) ||
      (!isEn && (t.includes('was') || t.includes('wie') || t.includes('genau'))) ||
      hasClarifyPhrase;

    if (hasMarkers) return 'clarify';
  }

  // "confused" Phrasen
  if (CONFUSED.some((p) => t.includes(normalize(p)))) return 'confused';

  // Fallback: wenn’s wie eine Rückfrage wirkt
  if (t.endsWith('?')) return 'clarify';

  return 'confused';
}
