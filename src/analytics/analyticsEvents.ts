// src/analytics/analyticsEvents.ts
// Alle track*()-Funktionen sind fire-and-forget — nie werfend, nie blockierend.

import { appendDecision } from './analyticsStore';
import { getConsentStatus } from './consent';
import type { DecisionScore, StepDecision } from './schema';

function episodeFromStepId(stepId: string): string {
  const m = /^(s\d+e\d+)/.exec(stepId);
  return m?.[1] ?? 'unknown';
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function trackReflectionStep(params: {
  stepId: string;
  type: 'open_text' | 'guided_choice';
  score?: DecisionScore;
  choiceId?: string;
  topicIds?: string[];
  attemptCount: number;
}): void {
  if (getConsentStatus() !== 'granted') return;

  try {
    const decision: StepDecision = {
      stepId: params.stepId,
      episodeId: episodeFromStepId(params.stepId),
      type: params.type,
      score: params.score,
      choiceId: params.choiceId,
      topicIds: params.topicIds?.length ? params.topicIds : undefined,
      attemptCount: params.attemptCount,
      date: today(),
    };
    appendDecision(decision);
  } catch {
    // fire-and-forget
  }
}
