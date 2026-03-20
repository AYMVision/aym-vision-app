// src/ai/core/fetchPatch.ts
import { env } from '@xenova/transformers';

const BASE = import.meta.env.BASE_URL || '/';

function isInteresting(url: string) {
  return url.includes('/models/') || url.includes('/wasm/');
}


function looksLikeHtml(textHead: string) {
  const low = textHead.trim().toLowerCase();
  return low.startsWith('<!doctype') || low.startsWith('<html') || low.startsWith('<head');
}

function patchFetchOnce() {
  if (!import.meta.env.DEV) return;
  if ((globalThis as any).__aymFetchPatched) return;
  (globalThis as any).__aymFetchPatched = true;

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
    const ct = (res.headers.get('content-type') || '').toLowerCase();

    if (isInteresting(url)) {
      // immer loggen, damit wir sehen WAS Xenova wirklich lädt
      console.log('[fetch]', res.status, ct, url);

      // HTML-Detektor, unabhängig vom Content-Type
      const head = await res.clone().text().then(t => t.slice(0, 160)).catch(() => '');
      if (looksLikeHtml(head)) {
        console.error('❌ HTML STATT ASSET:', url);
        console.error('head:', head);
      }
    }

    return res;
  };

  // ✅ global fetch patch
  globalThis.fetch = wrapped;

  // ✅ Xenova env.fetch patch (TypeScript kennt env.fetch oft nicht)
  (env as any).fetch = wrapped;
  (env as any).logLevel = 'error';
(env as any).debug = false;


  console.log('[aym] DEV fetch patch active (global + env.fetch)', 'BASE=', BASE);
}

// sofort patchen (so früh wie möglich)
patchFetchOnce();
