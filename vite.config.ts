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
        registerType: 'prompt',       // Update-Prompt statt stillem Auto-Reload
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
        workbox: {
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4 MB (große Sticker-PNGs)
          // Cache-Strategie: Network-first für HTML (immer aktuell), Cache-first für Assets
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            {
              // Bilder & Medien: Cache-first (ändern sich selten)
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|woff2?|mp3|mp4|wasm)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'aym-assets-v1',
                expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 60 }, // 60 Tage
              },
            },
            {
              // JS/CSS: StaleWhileRevalidate (lädt frische Version im Hintergrund)
              urlPattern: /\.(?:js|css)$/i,
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'aym-code-v1' },
            },
          ],
          // Alle Build-Assets precachen (JS, CSS, Fonts)
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
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
