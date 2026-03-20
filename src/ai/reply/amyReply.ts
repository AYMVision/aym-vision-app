// src/ai/reply/amyReply.ts
// Legacy-Wrapper (v1 API) -> v2 Reply Composer (Bausteine-only, i18n).
// Ziel: alte Imports nicht brechen, aber keine Texte/Randomness mehr hier.

import type { AmyDecisionResult } from '../core/amyDecision';
import type { ContentFlags } from '../core/contentFlags';

import { buildAmyReplyV2 } from './amyReplyV2';
import type { TipRelationV2 } from './tipRelationMap';
import { toTipRelationV2 } from './tipRelationMap';

type RelationFine = 'copied' | 'partial' | 'off-topic-meaningful' | 'off-topic';

function mapRelation(rel: RelationFine): TipRelationV2 {
  return toTipRelationV2(rel);
}


// Public API (legacy signature)
export function buildAmyReply(
  decision: AmyDecisionResult,
  tipText: string,
  keyIdea: string,
  relation: RelationFine,
  opts?: {
    lang?: 'de' | 'en';
    userAnswer?: string;
    questionText?: string;
    contentFlags?: ContentFlags;
  }
): string {
  const lang: 'de' | 'en' = opts?.lang ?? 'de';
  const tipRelation = mapRelation(relation);
  

  const userAnswer = opts?.userAnswer ?? '';
  const questionText = opts?.questionText ?? '';

  const contentFlags: ContentFlags =
    opts?.contentFlags ??
    ({
      selfHarm: false,
      sexualContent: false,
      violenceThreat: false,
      bullyingApproval: false,
      hateOrDegrading: false,
      misinformationIntent: false,
      illegalHarmIntent: false,
    } satisfies ContentFlags);

  return buildAmyReplyV2({
    lang,
    decision,
    userAnswer,
    tipRelation,
    keyIdea: keyIdea ?? '',
    questionText,
    contentFlags,
  });
}
