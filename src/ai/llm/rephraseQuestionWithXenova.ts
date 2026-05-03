import { getTextGenPipeline } from './modelRegistry';
import { buildRephraseQuestionPrompt } from './rephrasePrompt';

export async function rephraseQuestionWithXenova(input: {
  lang: 'de' | 'en';
  questionText: string;
}): Promise<string | null> {
  const prompt = buildRephraseQuestionPrompt({
    lang: input.lang,
    questionText: input.questionText,
  });

  const pipe = await getTextGenPipeline();

  const out = await pipe(prompt, {
    max_new_tokens: 80,
    do_sample: false,
  });

  const raw = Array.isArray(out) ? out?.[0]?.generated_text : (out as any)?.generated_text;
  const text = String(raw ?? '').trim();

  // Falls das Modell prompt+output zusammen ausgibt:
  const cleaned = text.includes(prompt)
    ? text.slice(text.indexOf(prompt) + prompt.length).trim()
    : text.trim();

  console.log('[rephrase xenova] raw head:', text.slice(0, 140));
  console.log('[rephrase xenova] cleaned head:', cleaned.slice(0, 140));

  // HTML/404 Schutz
  const head = cleaned.slice(0, 40).toLowerCase();
  if (head.startsWith('<!doctype') || head.startsWith('<html')) return null;

  const q = postCleanQuestion(cleaned);

  if (!q) return null;
  if (q.length > 140) return q.slice(0, 139) + '…';

  // muss eine Frage sein
  if (!q.endsWith('?')) return null;

  // keine Links/Handles
  if (q.includes('http') || q.includes('www.') || q.includes('@')) return null;

  // simple “nonsense/repetition” guard
  if (looksRepeaty(q)) return null;

  return q;
}

function postCleanQuestion(s: string): string {
  let t = String(s ?? '').trim();
  if (!t) return '';

  // Prefixe entfernen
  t = t.replace(/^AUSGABE:\s*/i, '').replace(/^OUTPUT:\s*/i, '').trim();

  // Quotes außen weg
  t = t.replace(/^["'„“”]+/, '').replace(/["'„“”]+$/, '').trim();

  // Eine Zeile
  t = t.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();

  // Nur ersten Satz behalten
  t = t.split(/[.!…]/)[0]?.trim() ?? '';

  // Fragezeichen am Ende behalten/setzen (aber nur wenn es wie Frage klingt)
  if (t && !t.endsWith('?')) {
    // wenn schon ein ? irgendwo drin ist, bis dahin schneiden
    const idx = t.indexOf('?');
    if (idx >= 0) t = t.slice(0, idx + 1).trim();
  }

  // Start groß
  if (t && /^[a-zäöü]/.test(t)) t = t.charAt(0).toUpperCase() + t.slice(1);

  return t;
}

function looksRepeaty(t: string): boolean {
  const low = t.toLowerCase();
  const words = low.split(/\s+/).filter(Boolean);
  if (words.length < 3) return false;
  const unique = new Set(words);
  return unique.size / words.length < 0.55; // sehr grob
}
