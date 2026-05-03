// src/ai/reply/tipRelationMap.ts
// Map: feinere Relation -> v2 Tone Relation

import type { AnswerTipRelation } from '../core/answerRelation';

export type TipRelationV2 = 'aligned' | 'generic' | 'off-topic';

export function toTipRelationV2(rel: AnswerTipRelation): TipRelationV2 {
  if (rel === 'copied') return 'aligned';
  if (rel === 'partial') return 'generic';
  if (rel === 'off-topic-meaningful') return 'off-topic';
  return 'off-topic';
}
