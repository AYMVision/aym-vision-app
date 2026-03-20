import type { AmyQuestionType } from '../core/amyQuestionType';
import type { TipRelationV2 } from './tipRelationMap';

export function buildAckLine(params: {
  lang: 'de' | 'en';
  questionType: AmyQuestionType;
  tipRelation: TipRelationV2;
}): string {
  const { lang } = params;
  const qt = String(params.questionType ?? 'GENERAL').toUpperCase();
  const rel = params.tipRelation;

  if (lang === 'de') {
    if (rel === 'off-topic') return clamp('Okay — noch nicht ganz zur Frage, aber ich bin bei dir.', 70);
    if (qt.includes('CONFLICT')) return clamp('Das wirkt angespannt — da steckt Druck in der Situation.', 70);
    if (qt.includes('SOCIAL')) return clamp('Da geht’s um Gruppendynamik — das kann stressen.', 70);
    if (qt.includes('PERSPECTIVE')) return clamp('Das ist ein klarer Blick — so wird’s für alle leichter.', 70);
    if (qt.includes('REFLECT')) return clamp('Das fühlt sich nicht leicht an — du bleibst trotzdem dran.', 70);
    if (qt.includes('SOLVE') || qt.includes('CREATE')) return clamp('Das ist ein sinnvoller Ansatz — das bringt Struktur rein.', 70);
    return clamp('Verstanden — das klingt nachvollziehbar.', 70);
  }

  // EN
  if (rel === 'off-topic') return clamp("Okay — not quite the question yet, but I'm with you.", 70);
  if (qt.includes('CONFLICT')) return clamp("That feels tense — there's pressure in this situation.", 70);
  if (qt.includes('SOCIAL')) return clamp("This is about group dynamics — that can be stressful.", 70);
  if (qt.includes('PERSPECTIVE')) return clamp("That's a clear view — it can make things easier for everyone.", 70);
  if (qt.includes('REFLECT')) return clamp("That doesn't feel easy — and you're still sticking with it.", 70);
  if (qt.includes('SOLVE') || qt.includes('CREATE')) return clamp("That's a solid approach — it adds structure.", 70);
  return clamp("Got it — that sounds understandable.", 70);
}

function clamp(s: string, max: number): string {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return t.slice(0, max).trim().replace(/[,\-:;]$/g, '').trim();
}
