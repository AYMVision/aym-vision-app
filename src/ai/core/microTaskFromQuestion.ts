// src/ai/core/microTaskFromQuestion.ts
import type { TFunction } from 'i18next';
import type { AmyQuestionType } from './amyQuestionType';

type Params = {
  lang: 'de' | 'en';
  questionText: string; // bleibt drin, falls du später doch wieder nutzen willst
  questionType: AmyQuestionType;
};

export function microTaskFromQuestion(params: Params, t: TFunction): string {
  const { questionType } = params;

  // ✅ de/en NICHT in den Key packen – Sprache regelt i18next automatisch
  const base = `amy:microTaskFromQuestion`;

  const text =
    (t(`${base}.fallback.${questionType}`, { defaultValue: '' }) as string) ||
    (t(`${base}.fallback.GENERAL`, { defaultValue: '' }) as string);

  return String(text ?? '').trim();
}

