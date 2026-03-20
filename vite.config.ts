// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve';

  // Optional: Threads nur, wenn du es willst.
  // Starte dann mit: VITE_COI=1 npm run dev
  const enableCOI = isDev && process.env.VITE_COI === '1';

  const coiHeaders = enableCOI
    ? {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      }
    : {};

  return {
    base: isDev ? '/' : './',
    plugins: [react(), tailwindcss()],

    // gut für wasm assets (lassen wir drin)
    assetsInclude: ['**/*.wasm'],

    // DEV: optional COOP/COEP
    server: enableCOI ? { headers: coiHeaders } : undefined,

    // preview (vite preview): optional COOP/COEP
    preview: enableCOI ? { headers: coiHeaders } : undefined,
  };
});
