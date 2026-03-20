// src/ai/reply/amyReplyV2.ts

import { getAmyPhrases } from '../lang/getAmyPhrases';
import type { TipRelationV2 } from './tipRelationMap';
import type { ContentFlags } from '../core/contentFlags';
import type { AmyDecisionResult } from '../core/amyDecision';
import { joinClean } from '../core/textUtils';

function hashToIndex(seed: string, mod: number) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % Math.max(1, mod);
}

function pickSeed(seed: string, arr: string[]) {
  if (!arr?.length) return '';
  return arr[hashToIndex(seed, arr.length)];
}

function clamp(s: string, max = 180) {
  const t = (s ?? '').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

function bridgeKey(rel: TipRelationV2): 'aligned' | 'generic' | 'off-topic' {
  if (rel === 'aligned') return 'aligned';
  if (rel === 'generic') return 'generic';
  return 'off-topic';
}

function pickByQuestionType(
  phr: any,
  qt: string,
  key:
    | 'aIntroByType'
    | 'aOutroByType'
    | 'bIntroByType'
    | 'bOutroByType',
  seed: string
) {
  const map = phr?.[key] ?? {};
  const qtKey = String(qt ?? '').toUpperCase();
  const altKey =
    qtKey === 'GENERAL' ? 'GENERIC'
    : qtKey === 'GENERIC' ? 'GENERAL'
    : '';

  const arr =
    (map?.[qtKey] ??
      (altKey ? map?.[altKey] : undefined) ??
      map?.GENERAL ??
      map?.GENERIC ??
      []) as string[];

  return pickSeed(seed + ':' + key + ':' + qtKey, arr);
}

function microTask(phr: any, qt: string, seed: string) {
  const arr = (phr.microTask?.[qt] ?? phr.microTask?.GENERAL ?? []) as string[];
  return pickSeed(seed + ':task:' + qt, arr);
}

export function buildAmyReplyV2(input: {
  lang: 'de' | 'en';
  decision: AmyDecisionResult;
  userAnswer: string;
  tipRelation: TipRelationV2;
  keyIdea: string; // intern
  questionText: string;
  contentFlags: ContentFlags;
  t?: (key: string, opts?: any) => string;
  microTaskOverride?: string;
  rewrite?: { mirror?: string };
}): string {
  const { decision, tipRelation, contentFlags } = input;

  const phr = getAmyPhrases(input.lang);

  const seedBase = `${decision.mode}|${decision.label}|${decision.questionType}|${decision.attemptCount}|${tipRelation}`;
  const qt = String(decision.questionType) as string;

  // Safety
  if (
    decision.action === 'ADULT_GATE' &&
    (contentFlags.selfHarm || contentFlags.sexualContent || contentFlags.violenceThreat)
  ) {
    return clamp(pickSeed(seedBase + ':safety', phr.safety), 220);
  }

  // Adult gate
  if (decision.action === 'ADULT_GATE') {
    return clamp(pickSeed(seedBase + ':adult', phr.adultGate), 220);
  }

  // Normstop
  if (decision.mode === 'norm-stop') {
    const line1 = pickSeed(seedBase + ':norm', phr.normStop);
    const line2 = (input.microTaskOverride?.trim() || microTask(phr, qt, seedBase));
    return clamp(joinClean(line1, line2), 220);
  }

  // Retry / MiniTip
  const isRetryLike =
    decision.mode === 'retry' ||
    decision.mode === 'mini-tip' ||
    (decision as any).mode === 'tip-key' ||
    (decision as any).mode === 'tip-full';

  if (isRetryLike) {
    const retryPool =
      decision.label === 'UNSICHER'
        ? (phr.retryUnsicher ?? phr.retryGeneric)
        : decision.label === 'C'
          ? (phr.retryC ?? phr.retryGeneric)
          : (phr.retryGeneric ?? []);

    const base = pickSeed(seedBase + ':retryBase', retryPool);
    const task = (input.microTaskOverride?.trim() || microTask(phr, qt, seedBase));
    const miniArr = phr.miniTips?.[decision.miniTipType] ?? [];
    const mini = pickSeed(seedBase + ':mini', miniArr);

    const out = joinClean(phr.emojis.owl, base, task, mini);
    return clamp(out, 220);
  }

  // A (encourage) -> Intro + Mirror + Outro + Bridge
  if (decision.mode === 'encourage') {
    const intro = pickByQuestionType(phr, qt, 'aIntroByType', seedBase);
    const outro = pickByQuestionType(phr, qt, 'aOutroByType', seedBase);
    const b = pickSeed(seedBase + ':bridge', phr.bridge[bridgeKey(tipRelation)]);

    const mirror = (input.rewrite?.mirror ?? '').trim(); // kommt aus runAmy (Bank-Selector)

    // Mirror ist optional – wenn leer, lassen wir ihn einfach weg.
    return clamp(joinClean(intro, mirror, outro, b), 220);
  }

  // B (motivate) -> Intro + Mirror + Outro + Bridge
  if (decision.mode === 'motivate') {
    const intro = pickByQuestionType(phr, qt, 'bIntroByType', seedBase);
    const outro = pickByQuestionType(phr, qt, 'bOutroByType', seedBase);
    const b = pickSeed(seedBase + ':bridge', phr.bridge[bridgeKey(tipRelation)]);

    const mirror = (input.rewrite?.mirror ?? '').trim();

    return clamp(joinClean(intro, mirror, outro, b), 220);
  }

  // Fallback
  return clamp(`Okay. ${phr.emojis.owl}`, 120);
}