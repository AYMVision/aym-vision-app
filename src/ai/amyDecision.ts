// /src/ai/amyDecision.ts
import type { AmyQuestionType } from './amyQuestionType';

export type AmyDecisionMode =
  | 'encourage'
  | 'motivate'
  | 'retry'
  | 'tip-key'
  | 'tip-full';

export type AmyDecisionResult = {
  mode: AmyDecisionMode;
  action: 'UNLOCK' | 'RETRY';
  questionType: AmyQuestionType;
  attemptCount: number; // ✅ für stufenweise Texte in amyReply
  label: 'A' | 'B' | 'C' | 'UNSICHER';
};

type DecideParams = {
  label: 'A' | 'B' | 'C' | 'UNSICHER';
  attemptCount: number; // ✅ Startwert 1 (wie in Story.tsx)
  questionType: AmyQuestionType;
};

export function decideAmyFlow({
  label,
  attemptCount,
  questionType,
}: DecideParams): AmyDecisionResult {
  // 🟢 A = reflektiert → sofort weiter
  if (label === 'A') {
    return { mode: 'encourage', action: 'UNLOCK', questionType, attemptCount, label };
  }

  // 🟡 B = kurz, aber passend → weiter
  if (label === 'B') {
    return { mode: 'motivate', action: 'UNLOCK', questionType, attemptCount, label };
  }

  // 🔴 C = Quatsch / nicht sinnvoll
  if (label === 'C') {
    // erster Versuch: nur ruhig um echte Antwort bitten
    if (attemptCount <= 1) {
      return { mode: 'retry', action: 'RETRY', questionType, attemptCount, label };
    }

    // ab Versuch 2 wie UNSICHER behandeln (stufenweise)
    if (attemptCount === 2) {
      return { mode: 'tip-key', action: 'RETRY', questionType, attemptCount, label };
    }
    return { mode: 'tip-full', action: 'RETRY', questionType, attemptCount, label };
  }

  // ❓ UNSICHER stufenweise
  if (label === 'UNSICHER') {
    if (attemptCount === 1) {
      return { mode: 'tip-key', action: 'RETRY', questionType, attemptCount, label };
    }
    // attempt 2: weiterhin key, aber anders formuliert (macht amyReply über attemptCount)
    if (attemptCount === 2) {
      return { mode: 'tip-key', action: 'RETRY', questionType, attemptCount, label };
    }
    // attempt >=3: voller Tipp
    return { mode: 'tip-full', action: 'RETRY', questionType, attemptCount, label };
  }

  return { mode: 'retry', action: 'RETRY', questionType, attemptCount, label };
}
