// src/ai/core/amyAI.ts
import type { AmyQuestionType } from './amyQuestionType';

export type AmyLabel = 'A' | 'B' | 'C' | 'UNSICHER';

// --------------------
// Patterns (exakt wie dein ai.json)
// --------------------
const UNSICHER_PATTERNS = [
  "weiss nicht",
  "weiss ich nicht",
  "ich weiss nicht",
  "weiss net",
  "keine ahnung",
  "kein plan",
  "keinen plan",
  "bin mir nicht sicher",
  "ich versteh das nicht",
  "ich verstehe das nicht",
  "versteh ich nicht",
  "verstehe ich nicht",
  "ich versteh die frage nicht",
  "ich verstehe die frage nicht",
  "ich check das nicht",
  "check ich nicht",
  "ich kapier das nicht",
  "kapier ich nicht",
  "was meinst du",
  "was meinst du damit",
  "kannst du das erklaeren",
  "kannst du das erklären"
];

const C_PATTERNS = [
  "asdf",
  "qwer",
  "lorem",
  "test",
  "spam",
  "egal",
  "keine lust",
  "bock nicht",
  "nervt",
  "whatever",
  "lol"
];

const ACTION_STEP_KEYWORDS = [
  "pruefen",
  "prüfen",
  "checken",
  "check",
  "quelle",
  "datum",
  "vergleichen",
  "andere seiten",
  "gegencheck",
  "nicht weiterleiten",
  "nicht teilen",
  "nicht posten",
  "nicht schicken",
  "nicht weiter schicken",
  "nicht weiterschicken",
  "nicht weiter senden",
  "nicht weitersenden",
  "nicht weiter teilen",
  "nicht weiterposten",
  "nachfragen",
  "fragen",
  "ruhig",
  "sachlich",
  "melden",
  "report",
  "admin",
  "lehrkraft",
  "lehrer",
  "lehrerin",
  "eltern",
  "informieren",
  "hilfe",
  "blockieren"
];

const FEELING_MARKERS = [
  "traurig",
  "verletzt",
  "wut",
  "wuetend",
  "wütend",
  "angst",
  "aengstlich",
  "ängstlich",
  "einsam",
  "allein",
  "peinlich",
  "schaem",
  "schäm",
  "unwohl",
  "unsicher",
  "mies",
  "tut weh",
  "weh",
  "fertig",
  "ueberfordert",
  "überfordert",
  "keiner mag",
  "ausgeschlossen",
  "ignoriert"
];

// --------------------
// Regex (bleibt Logik)
// --------------------
const UNSICHER_REGEX: RegExp[] = [
  /\bweiss\b[\s\S]{0,20}\bnicht\b/i,
  /\bweiß\b[\s\S]{0,20}\bnicht\b/i,

  /\bkeine\b[\s\S]{0,10}\bahnung\b/i,
  /\bkein(en|e)?\b[\s\S]{0,10}\bplan\b/i,
  /\bkeine\b[\s\S]{0,6}\bidee\b/i,
  /\bh(ae|ä|a)\b/i,

  /\b(kann|koennte|konnte)\b[\s\S]{0,20}\bnicht\b[\s\S]{0,10}\bsagen\b/i,

  /\b(versteh|verstehe|check|kapi(er|r))\b[\s\S]{0,30}\bnicht\b/i,
  /\bka\b/i,
  /\bkp\b/i,
  /\bidk\b/i
];

// --------------------
// Helpers
// --------------------
function normalize(t: string) {
  return (t ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(t: string) {
  return normalize(t).split(' ').filter(Boolean).length;
}

function isEmojiOnlyOrGibberish(raw: string) {
  const s = normalize(raw);
  if (!s) return true;

  const hasLetters = /[a-z]/i.test(s);
  if (!hasLetters && s.length <= 6) return true;
  if (s.length < 3) return true;

  return false;
}

function looksMeaningfulShort(raw: string) {
  const s = normalize(raw);
  const ok = [
    'respekt',
    'privat',
    'freundlich',
    'blockieren',
    'melden',
    'hilfe',
    'eltern',
    'lehrer',
    'stop',
    'nein'
  ];
  return ok.some((w) => s.includes(w));
}

function hasReasonMarker(raw: string) {
  const t = normalize(raw);
  return (
    t.includes('weil') ||
    t.includes('deshalb') ||
    t.includes('dadurch') ||
    t.includes('damit') ||
    t.includes('because') ||
    t.includes('therefore')
  );
}

function looksCompleteAnswer(raw: string) {
  return hasReasonMarker(raw);
}

function hasFeelingMarker(raw: string) {
  const s = normalize(raw);
  return FEELING_MARKERS.some((m) => s.includes(normalize(m)));
}

function countActionSteps(raw: string) {
  const s = normalize(raw);
  if (!s) return 0;

  const hits = new Set<string>();
  for (const k of ACTION_STEP_KEYWORDS) {
    const kn = normalize(k);
    if (kn && s.includes(kn)) hits.add(kn);
  }
  return hits.size;
}

function isBackQuestion(raw: string) {
  const s = normalize(raw);
  if (!s) return true;

  if (raw.trim().endsWith('?')) return true;

  const markers = [
    'hae',
    'hä',
    'wie jetzt',
    'was meinst',
    'was meinst du damit',
    'kannst du das erklaeren',
    'kannst du das erklären',
    'welche frage'
  ];
  if (markers.some((m) => s.includes(normalize(m)))) return true;

  const startsWhy =
    s.startsWith('warum') || s.startsWith('wieso') || s.startsWith('weshalb');
  if (startsWhy && s.length < 60) return true;

  return false;
}

function isUnsicher(raw: string) {
  const s = normalize(raw);
  if (!s) return true;

  for (const p of UNSICHER_PATTERNS) {
    const pn = normalize(p);
    if (pn && s.includes(pn)) return true;
  }

  for (const r of UNSICHER_REGEX) {
    if (r.test(s)) return true;
  }

  return false;
}

// --------------------
// Classifier
// --------------------
export class AmyAI {
  async classifyAnswer(
    text: string,
    ctx?: { questionType?: AmyQuestionType }
  ): Promise<AmyLabel> {
    const raw = text ?? '';
    const t = normalize(raw);
    const qt = ctx?.questionType;

    console.log('[AmyAI.classifyAnswer]', { qt, tLen: t.length, wc: wordCount(raw), raw });

    if (isEmojiOnlyOrGibberish(raw)) return 'C';

    if (isUnsicher(raw)) return 'UNSICHER';

    if (qt === 'ACTION') {
      const steps = countActionSteps(raw);
      if (steps === 0) return 'C';
      if (steps >= 3) return 'A';
      return 'B';
    }

    if (qt === 'FEELING') {
      if (!hasFeelingMarker(raw)) return 'C';
    }

    if (isBackQuestion(raw)) return 'UNSICHER';

    if (C_PATTERNS.some((p) => t.includes(normalize(p)))) return 'C';

    if (looksCompleteAnswer(raw)) return 'A';

    if (t.length < 35 && looksMeaningfulShort(raw)) return 'B';

    if (t.length >= 70) return 'A';
    if (t.length >= 20) return 'B';

    return 'C';
  }
}
