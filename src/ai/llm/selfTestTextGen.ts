import { getTextGenPipeline } from './modelRegistry';

export async function selfTestTextGen() {
  const pipe = await getTextGenPipeline();
  const out = await pipe('Return JSON only: {"line1":"Okay"}', {
    max_new_tokens: 20,
    do_sample: false,
  });
  console.log('[ML selfTest out]', out);
  return out;
}
