// src/ai/reply/amyOwlReply.ts
// Shared types + sanitizing for Owl replies (Xenova + fallback)
import type { TipRelationV2 } from './tipRelationMap';


export type OwlReplyInput = {
  lang: string;
  mode: 'encourage' | 'motivate' | 'retry';
  questionType: string;
  attemptCount: number;
  relation: TipRelationV2; // <- wichtig!
  keyIdea: string;

  // ✅ NEW: sicherer Spiegel-Hinweis (kurz, ohne Links/Handles)
  mirrorHint?: string;
};

export type OwlReplyOutput = {
  line1: string;
  line2?: string;
};

function cleanLine(s: string) {
  return String(s ?? '')
    .replace(/[\n\r]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sanitizeOwlReply(draft: OwlReplyOutput | null): OwlReplyOutput | null {
  if (!draft || typeof draft.line1 !== 'string') return null;

  const line1 = cleanLine(draft.line1);
  const line2 = draft.line2 ? cleanLine(draft.line2) : undefined;

  // sehr konservativ: keine Links/Handles
  const bad = (x: string) => x.includes('http') || x.includes('www.') || x.includes('@');

  if (!line1 || bad(line1)) return null;
  if (line2 && bad(line2)) return null;

  // kurz halten (mobile)
  const clamp = (x: string, max: number) => (x.length > max ? x.slice(0, max - 1) + '…' : x);

  return {
    line1: clamp(line1, 160),
    line2: line2 ? clamp(line2, 160) : undefined,
  };
}

export function toAmyText(safe: OwlReplyOutput): string {
  const a = cleanLine(safe.line1);
  const b = safe.line2 ? cleanLine(safe.line2) : '';
  return b ? `${a} ${b}` : a;
}

// optional: falls du das woanders noch nutzt
export function shortenKeyIdea(s: string, maxWords = 8) {
  const t = cleanLine(s);
  const w = t.split(' ').filter(Boolean);
  if (w.length <= maxWords) return t;
  return w.slice(0, maxWords).join(' ') + '…';
}
