// src/ai/llm/initXenova.ts
// Lazily initialises @xenova/transformers env — called once before first pipeline use.
// Do NOT import this at module top-level in main.tsx or any eagerly-loaded file.

let _ready: Promise<void> | null = null;

export function ensureXenovaReady(): Promise<void> {
  if (_ready) return _ready;
  _ready = (async () => {
    const { env } = await import('@xenova/transformers');
    const BASE = import.meta.env.BASE_URL || '/';

    env.allowRemoteModels = false;
    env.localModelPath = `${BASE}models/`;
    env.backends.onnx.wasm.wasmPaths = `${BASE}wasm/`;
    env.backends.onnx.wasm.numThreads = 1;

    if (import.meta.env.DEV) {
      applyDevFetchPatch(env, BASE);
    }
  })();
  return _ready;
}

function applyDevFetchPatch(env: any, BASE: string) {
  if ((globalThis as any).__aymFetchPatched) return;
  (globalThis as any).__aymFetchPatched = true;

  function isInteresting(url: string) {
    return url.includes('/models/') || url.includes('/wasm/');
  }
  function looksLikeHtml(textHead: string) {
    const low = textHead.trim().toLowerCase();
    return low.startsWith('<!doctype') || low.startsWith('<html') || low.startsWith('<head');
  }

  const orig = globalThis.fetch.bind(globalThis) as typeof fetch;
  const wrapped: typeof fetch = async (...args) => {
    const [input] = args;
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : (input as Request).url;
    const res = await orig(...args);
    if (isInteresting(url)) {
      console.log('[fetch]', res.status, url);
      const head = await res.clone().text().then(t => t.slice(0, 160)).catch(() => '');
      if (looksLikeHtml(head)) console.error('❌ HTML STATT ASSET:', url);
    }
    return res;
  };

  globalThis.fetch = wrapped;
  env.fetch = wrapped;
  env.logLevel = 'error';
  env.debug = false;
  console.log('[aym] DEV fetch patch active', 'BASE=', BASE);
}
