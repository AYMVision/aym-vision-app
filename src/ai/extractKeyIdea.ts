import './transformersConfig';

// src/ai/extractKeyIdea.ts
// Hybrid: local ML (Embeddings-Ranking) -> Fallback Heuristik
let _embedder: any | null = null;

function splitSentences(text: string): string[] {
  return String(text ?? '')
    .split(/[\n.!?]+/g)
    .map((s) => s.trim())
    .filter((s) => s.length >= 12);
}

function clamp(s: string, max = 110) {
  const t = s.trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

// ✅ NEU: “Kernaussage kurz machen” (kein Lösungssatz)
function toShortIdea(s: string, maxWords = 12) {
  const cleaned = String(s ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(Boolean);
  if (words.length <= maxWords) return cleaned;
  return words.slice(0, maxWords).join(' ') + '…';
}

function heuristicKeyIdea(tipText: string): string {
  const raw = String(tipText ?? '').trim();
  if (!raw) return '';

  const sentences = splitSentences(raw);
  const base = sentences.length ? sentences[0] : raw;

  // lieber kurz als “zu viel Lösung”
  return clamp(toShortIdea(base, 12), 110);
}

/**
 * Optionaler KI-Teil:
 * - Sentence embeddings im Browser
 * - Ranking: welcher Satz repräsentiert den Tipp am besten?
 */
async function mlKeyIdea(tipText: string): Promise<string | null> {
  const raw = String(tipText ?? '').trim();
  if (!raw) return '';

  const sentences = splitSentences(raw);
  if (sentences.length === 0) return clamp(toShortIdea(raw, 12), 110);

  if (!_embedder) {
    const { pipeline } = await import('@xenova/transformers');
    _embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  const docEmb = await _embedder(raw, { pooling: 'mean', normalize: true });

  let best = sentences[0];
  let bestScore = -Infinity;

  for (const s of sentences) {
    const emb = await _embedder(s, { pooling: 'mean', normalize: true });

    const v1 = docEmb.data as number[];
    const v2 = emb.data as number[];

    let dot = 0;
    const n = Math.min(v1.length, v2.length);
    for (let i = 0; i < n; i++) dot += v1[i] * v2[i];

    if (dot > bestScore) {
      bestScore = dot;
      best = s;
    }
  }

  // ✅ nach ML-Ranking trotzdem kurz machen
  return clamp(toShortIdea(best, 12), 110);
}

export async function extractKeyIdea(tipText: string, opts?: { useML?: boolean }) {
  const useML = opts?.useML ?? true;

  if (useML) {
    try {
      const r = await mlKeyIdea(tipText);
      if (r) return r;
    } catch {
      // ML nicht verfügbar -> fallback
    }
  }

  return heuristicKeyIdea(tipText);
}
