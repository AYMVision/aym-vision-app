// src/ai/llm/xenovaUnlockRewriteRenderer.ts
import { getTextGenPipeline, warmupTextGen } from './modelRegistry';
import { buildUnlockRewritePrompt } from './unlockRewritePrompt';
import { registerMlFailure } from './mlSessionGuard';

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('LLM timeout')), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch((e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}

function extractJsonObject(text: string): any | null {
  const t = String(text ?? '').trim();
  if (!t) return null;

  try {
    return JSON.parse(t);
  } catch {
    const start = t.indexOf('{');
    const end = t.lastIndexOf('}');
    if (start >= 0 && end > start) {
      const maybe = t.slice(start, end + 1);
      try {
        return JSON.parse(maybe);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function sanitizeUnlockText(s: string): string | null {
  let t = String(s ?? '').replace(/\s+/g, ' ').trim();
  if (!t) return null;

  if (t.length > 320) return null;
  if (t.includes('http') || t.includes('www.') || t.includes('@')) return null;
  if (t.includes('?')) return null;

  const low = t.toLowerCase();
  if (low.includes('meinst du') || low.includes('do you mean')) return null;
  if (low.includes('ich habe verstanden') || low.includes('i understand')) return null;

  return t;
}

export async function rewriteUnlockWithXenova(args: {
  lang: 'de' | 'en';
  baseReply: string;
  questionText: string;
  userAnswer: string;
  questionType: string;
}): Promise<string | undefined> {
  const base = (args.baseReply ?? '').trim();
  if (!base) return undefined;

  try {
    warmupTextGen().catch(() => {});

    const prompt = buildUnlockRewritePrompt({
      lang: args.lang,
      baseReply: base,
      questionText: args.questionText ?? '',
      userAnswer: args.userAnswer ?? '',
      questionType: args.questionType ?? 'GENERAL',
    });

    const pipe = await getTextGenPipeline();

    const generation = pipe(prompt, {
      max_new_tokens: 80,
      do_sample: false,
    });

    const out = await withTimeout(generation, 2500);

    const raw = Array.isArray(out) ? out?.[0]?.generated_text : (out as any)?.generated_text;
    const text = String(raw ?? '');

    const cleaned = text.includes(prompt)
      ? text.slice(text.indexOf(prompt) + prompt.length).trim()
      : text.trim();

    const head = cleaned.slice(0, 40).toLowerCase();
    if (head.startsWith('<!doctype') || head.startsWith('<html')) return undefined;

    const obj = extractJsonObject(cleaned);
    const candidate = obj?.text ? String(obj.text) : '';

    const safe = sanitizeUnlockText(candidate);
    if (!safe) return undefined;

    return safe;
  } catch (e: any) {
    const msg = String(e?.message ?? e);

    // Nur harte Fehler zählen (Model/Pipeline)
    if (msg.toLowerCase().includes('pipeline') || msg.toLowerCase().includes('model')) {
      registerMlFailure(msg);
    } else {
      console.warn('[ML] soft failure (unlock rewrite):', msg);
    }

    return undefined;
  }
}
