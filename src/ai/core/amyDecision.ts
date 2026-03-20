// src/ai/core/amyDecision.ts
// Ziel-Spezifikation v2: Eine einzige Instanz entscheidet Gate + Mode.
// Priorität: Safety > Normverletzung > Label > Ton.

import type { AmyQuestionType } from './amyQuestionType';
import type { ContentFlags } from './contentFlags';
import { isCriticalSafety, isNormViolation } from './contentFlags';
import type { AmyLabel } from './amyAI';

export type AmyAction = 'UNLOCK' | 'RETRY' | 'ADULT_GATE' | 'SILENT_LOCK';

export type MiniTipType =
  | 'focus_question'
  | 'example_from_story'
  | 'personal_feeling'
  | 'simple_rephrase'
  | 'none';

export type AmyDecisionMode =
  | 'encourage'
  | 'motivate'
  | 'retry'
  | 'mini-tip'
  | 'adult-gate'
  | 'silent-lock'
  | 'norm-stop';

export type AmyDecisionResult = {
  mode: AmyDecisionMode;
  action: AmyAction;
  mustReAnswer: boolean;

  questionType: AmyQuestionType;
  attemptCount: number; // 0-basiert (bisherige Versuche vor diesem Run)
  label: AmyLabel;

  miniTipType: MiniTipType;
  offlineHint: boolean; // UI: Erwachsenenhinweisblock anzeigen
};

type DecideParams = {
  label: AmyLabel;
  attemptCount: number; // 0,1,2...
  questionType: AmyQuestionType;
  flags: ContentFlags;
};

function pickMiniTipType(label: 'C' | 'UNSICHER', attemptCount: number, qt: AmyQuestionType): MiniTipType {
  // konservativ & einfach:
  // 1. Versuch: Fokus, 2. Versuch: FEELING -> Gefühl; UNSICHER -> rephrase
  if (attemptCount <= 0) return 'focus_question';
  if (qt === 'FEELING') return 'personal_feeling';
  return label === 'UNSICHER' ? 'simple_rephrase' : 'focus_question';
}

export function decideAmyFlowV2({
  label,
  attemptCount,
  questionType,
  flags,
}: DecideParams): AmyDecisionResult {
  const a = Math.max(0, Number(attemptCount ?? 0));

  // 1) Critical Safety override
  if (isCriticalSafety(flags)) {
    return {
      mode: 'adult-gate',
      action: 'ADULT_GATE',
      mustReAnswer: false,
      questionType,
      attemptCount: a,
      label,
      miniTipType: 'none',
      offlineHint: true,
    };
  }

// 2) Normverletzung: IMMER zuerst norm-stop, dann ggf. silent-lock
if (isNormViolation(flags)) {
  // 0 oder 1 => norm-stop + retry
  if (a <= 1) {
    return {
      mode: 'norm-stop',
      action: 'RETRY',
      mustReAnswer: true,
      questionType,
      attemptCount: a,
      label,
      miniTipType: 'simple_rephrase',
      offlineHint: false,
    };
  }

  // ab 2 => silent-lock (runAmy zeigt dann adultHint)
  return {
    mode: 'silent-lock',
    action: 'SILENT_LOCK',
    mustReAnswer: true,
    questionType,
    attemptCount: a,
    label,
    miniTipType: 'none',
    offlineHint: true,
  };
}


  // 3) Normalfall: Labels
  if (label === 'A') {
    return {
      mode: 'encourage',
      action: 'UNLOCK',
      mustReAnswer: false,
      questionType,
      attemptCount: a,
      label,
      miniTipType: 'none',
      offlineHint: false,
    };
  }

  if (label === 'B') {
    return {
      mode: 'motivate',
      action: 'UNLOCK',
      mustReAnswer: false,
      questionType,
      attemptCount: a,
      label,
      miniTipType: 'none',
      offlineHint: false,
    };
  }

  // C oder UNSICHER
  if (a <= 1) {
    return {
      mode: 'retry',
      action: 'RETRY',
      mustReAnswer: true,
      questionType,
      attemptCount: a,
      label,
      miniTipType: pickMiniTipType(label, a, questionType),
      offlineHint: false,
    };
  }

  // ab 2: SILENT_LOCK
  return {
    mode: 'silent-lock',
    action: 'SILENT_LOCK',
    mustReAnswer: true,
    questionType,
    attemptCount: a,
    label,
    miniTipType: 'none',
    offlineHint: true, // UI zeigt Adult-Hinweisblock
  };
}
