// src/ai/lang/getAmyPhrases.ts
import { AMY_PHRASES_DE } from './de/amyPhrases.de';
import { AMY_PHRASES_EN } from './en/amyPhrases.en';

export type AmyPhrases = typeof AMY_PHRASES_DE;

export type AmyLang = 'de' | 'en';

function normalizeLang(lang: unknown): AmyLang {
  const l = String(lang ?? 'de').toLowerCase();
  return l.startsWith('en') ? 'en' : 'de';
}

export function getAmyPhrases(lang: AmyLang | string): AmyPhrases {
  const l = normalizeLang(lang);

  // ✅ EN vorhanden -> nutzen, sonst auf DE fallen
  if (l === 'en') return AMY_PHRASES_EN as unknown as AmyPhrases;

  return AMY_PHRASES_DE;
}
