// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command }) => {
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
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: [
          'favicon.ico',
          'icon-192.png',
          'icon-512.png',
          'icon-maskable-192.png',
          'icon-maskable-512.png',
          'robots.txt',
        ],
        manifest: {
          name: 'Amy Surfwing',
          short_name: 'AMY',
          description: 'Die Lern-App für Medienreife',
          start_url: '/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#ffffff',
          theme_color: '#0f766e',
          lang: 'de',
          icons: [
            { src: '/icon-192.png',          sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icon-512.png',          sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        injectManifest: {
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,pdf,md}'],
        },
      }),
    ],

    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('@xenova/transformers') || id.includes('onnxruntime')) {
              return 'vendor-ai';
            }
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react';
            }
          },
        },
      },
    },

    // gut für wasm assets (lassen wir drin)
    assetsInclude: ['**/*.wasm'],

    // DEV: optional COOP/COEP
    server: enableCOI ? { headers: coiHeaders } : undefined,

    // preview (vite preview): optional COOP/COEP
    preview: enableCOI ? { headers: coiHeaders } : undefined,
  };
});
