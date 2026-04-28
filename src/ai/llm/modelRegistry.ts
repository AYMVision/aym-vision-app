// src/ai/llm/modelRegistry.ts
import { ensureXenovaReady } from './initXenova';

let _pipe: any | null = null;
let _warming: Promise<void> | null = null;

export const LOCAL_TEXTGEN_MODEL = 'Xenova/flan-t5-small';

export async function getTextGenPipeline() {
  if (_pipe) return _pipe;

  await ensureXenovaReady();
  const { pipeline } = await import('@xenova/transformers');
  _pipe = await pipeline('text2text-generation', LOCAL_TEXTGEN_MODEL);
  return _pipe;
}

export async function warmupTextGen(): Promise<void> {
  if (_warming) return _warming;

  _warming = (async () => {
    try {
      console.log('[xenova] warmup start');
      const pipe = await getTextGenPipeline();
      console.log('[xenova] pipeline ready');

      const out = await pipe('Say exactly: OK', {
  max_new_tokens: 8,
  do_sample: false,
  num_beams: 1,
});
console.log('[xenova] warmup output', out);

const out2 = await pipe('Rewrite in one friendly German sentence: Ich bin genervt.', {
  max_new_tokens: 40,
  do_sample: false,
  num_beams: 1,
});
console.log('[xenova] test output', out2);


      console.log('[xenova] warmup output', out);
    } catch (e: any) {
      console.warn('[xenova] warmup failed', e);
      _warming = null;
      _pipe = null;
      throw e;
    }
  })();

  return _warming;
}
