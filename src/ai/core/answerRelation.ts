// src/ai/core/answerRelation.ts
import { normalizeText, looksLikeRephrase } from './textUtils';

// Für "Abschreiben" / Ähnlichkeit zur Impuls-Nachricht
export type AnswerTipRelation =
  | 'copied'
  | 'partial'
  | 'off-topic-meaningful'
  | 'off-topic';

// Für "passt zur Frage?" (wichtig für off-topic-Bridge/Steer)
export type AnswerQuestionRelation = 'aligned' | 'generic' | 'off-topic';

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
 * - off-topic-meaningful: sinnvoller Text, aber kaum Bezug zum Impuls
 * - off-topic: sehr wenig Substanz / kaum Inhalt
 */
export function getAnswerTipRelation(answer: string, tipText: string): AnswerTipRelation {
  const a = normalizeText(answer);
  const t = normalizeText(tipText);

  

  if (!a) return 'off-topic';

  // Wenn kein "Tip/Impuls" vorhanden ist, können wir nicht "copied/partial" sauber bewerten.
  if (!t) {
    const meaningful = tokens(a).length >= 4 && a.length >= 20;
    return meaningful ? 'off-topic-meaningful' : 'off-topic';
  }

  // 1) Sehr starke Ähnlichkeit -> copied
  if (looksLikeRephrase(answer, tipText)) return 'copied';

  // 2) Token overlap -> partial
  const overlap = tokenOverlapRatio(answer, tipText);
  if (overlap >= 0.45) return 'partial';

  // 3) Off-topic meaningful vs. off-topic
  const meaningful = tokens(a).length >= 4 && a.length >= 20;
  return meaningful ? 'off-topic-meaningful' : 'off-topic';
}

/**
 * ✅ NEU: Passt die Antwort zur FRAGE?
 * Das ist die Relation, die wir für off-topic-Bridge & Steer verwenden.
 */
export function getAnswerQuestionRelation(answer: string, questionText: string): AnswerQuestionRelation {
  const a = normalizeText(answer);
  const q = normalizeText(questionText);

  if (!a) return 'off-topic';
  if (!q) return 'generic';

  const overlap = tokenOverlapRatio(a, q);

  // Schwellen bewusst moderat (Fragen sind kurz)
  if (overlap >= 0.28) return 'aligned';
  if (overlap >= 0.12) return 'generic';
  return 'off-topic';
}
