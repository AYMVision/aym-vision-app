// src/ai/reply/selectors.ts
import type { AmyQuestionType } from '../core/amyQuestionType';

export type TipRelationKey = 'aligned' | 'generic' | 'off-topic';

export function pickFromPool(seed: string, arr: string[]): string {
  if (!arr?.length) return '';
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const idx = Math.abs(h) % arr.length;
  return arr[idx] ?? '';
}

export function selectMirrorLine(params: {
  lang: 'de' | 'en';
  qt: AmyQuestionType;
  seed: string;
  mirrorBankByType: Record<string, string[]>;
}): string {
  const arr = params.mirrorBankByType?.[params.qt] ?? params.mirrorBankByType?.GENERAL ?? [];
  return pickFromPool(params.seed + '|mirror|' + params.qt, arr).trim();
}

export function selectClarifyLine(params: {
  lang: 'de' | 'en';
  qt: AmyQuestionType;
  seed: string;
  clarifyBankByType: Record<string, string[]>;
}): string {
  const arr = params.clarifyBankByType?.[params.qt] ?? params.clarifyBankByType?.GENERAL ?? [];
  return pickFromPool(params.seed + '|clarify|' + params.qt, arr).trim();
}