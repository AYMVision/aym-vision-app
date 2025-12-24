// /src/ai/answerRelation.ts
import { normalizeText, looksLikeRephrase } from './textUtils';

export type AnswerTipRelation =
  | 'copied'
  | 'partial'
  | 'off-topic-meaningful'
  | 'off-topic';

function tokens(s: string) {
  const t = normalizeText(s);
  if (!t) return [];
  return t.split(' ').filter((w) => w.length >= 3);
}

function tokenOverlapRatio(a: string, b: string) {
  const A = new Set(tokens(a));
  const B = new Set(tokens(b));
  if (A.size === 0 || B.size === 0) return 0;

  let common = 0;
  for (const w of A) if (B.has(w)) common++;

  return common / Math.max(1, Math.min(A.size, B.size));
}

/**
 * Relation steuert nur Ton/Formulierung, NICHT die Entscheidung.
 * - copied: nahezu gleich / abgeschrieben
 * - partial: deutlich ähnliche Inhalte, aber nicht 1:1
 * - off-topic-meaningful: sinnvoller Text, aber kaum Bezug zum Tipp
 * - off-topic: sehr wenig Substanz / kaum Inhalt
 */
export function getAnswerTipRelation(answer: string, tipText: string): AnswerTipRelation {
  const a = normalizeText(answer);
  const t = normalizeText(tipText);

  if (!a) return 'off-topic';

  // Wenn kein Tipp vorhanden ist, können wir nicht "copied/partial" sauber bewerten.
  if (!t) {
    const meaningful = tokens(a).length >= 4;
    return meaningful ? 'off-topic-meaningful' : 'off-topic';
  }

  // 1) Sehr starke Ähnlichkeit -> copied
  // looksLikeRephrase ist bei dir streng (>=0.7 overlap)
  if (looksLikeRephrase(answer, tipText)) return 'copied';

  // 2) Token overlap -> partial
  const overlap = tokenOverlapRatio(answer, tipText);
  if (overlap >= 0.45) return 'partial';

  // 3) Off-topic meaningful vs. off-topic
  const meaningful = tokens(a).length >= 4 && a.length >= 20;
  return meaningful ? 'off-topic-meaningful' : 'off-topic';
}
