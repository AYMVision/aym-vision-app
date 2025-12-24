// /src/ai/amyQuestionType.ts
export type AmyQuestionType = 'FEELING' | 'ACTION' | 'PERSPECTIVE' | 'CHALLENGE' | 'GENERAL';

type DetectParams = {
  questionText?: string; // die Frage selbst
  tipText?: string;      // optional: der Tipp
};

export function detectQuestionType({ questionText = '', tipText = '' }: DetectParams): AmyQuestionType {
  const q = normalize(questionText);
  const t = normalize(tipText);
  const text = `${q} ${t}`.trim();

  if (!text) return 'GENERAL';

  // 1) Gefühl
  if (
    includesAny(text, [
      'wie fühlst du',
      'wie würdest du dich fühlen',
      'wie geht es dir',
      'wie wäre das für dich',
      'wie findest du es',
      'welches gefühl',
      'was fühlst du',
      'erschrocken',
      'angst',
      'unsicher',
      'peinlich',
      'unwohl',
    ])
  ) {
    return 'FEELING';
  }

  // 2) Handlung
  if (
    includesAny(text, [
      'was würdest du machen',
      'was machst du',
      'wie würdest du reagieren',
      'wie reagierst du',
      'was tust du',
      'was würdest du tun',
      'was kannst du tun',
      'was sollte man tun',
    ])
  ) {
    return 'ACTION';
  }

  // 3) Perspektive / Warum
  if (
    includesAny(text, [
      'warum glaubst du',
      'warum meinst du',
      'warum vertrauen',
      'was denkst du warum',
      'wieso',
      'weshalb',
      'wie erklärst du',
      'was bedeutet',
    ])
  ) {
    return 'PERSPECTIVE';
  }

  // 4) Challenge / Experiment
  if (
    includesAny(text, [
      'challenge',
      'versuch mal',
      'probier mal',
      'deine aufgabe',
      'nimm dir vor',
      'mach diese woche',
      'bis zum nächsten mal',
      'übung',
    ])
  ) {
    return 'CHALLENGE';
  }

  return 'GENERAL';
}

function normalize(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[“”„"]/g, '"')
    .trim();
}

function includesAny(text: string, needles: string[]) {
  return needles.some((n) => text.includes(n));
}
