/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

declare const self: ServiceWorkerGlobalScope

// Precache all build assets (injected by VitePWA at build time)
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// SPA navigate fallback
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    denylist: [/^\/api\//, /\.pdf$/i, /^\/blog/],
  })
)

// Cache-first: images, fonts, audio, video, wasm
registerRoute(
  ({ request }) => /\.(?:png|jpg|jpeg|svg|gif|webp|avif|woff2?|mp3|mp4|wasm)$/i.test(request.url),
  new CacheFirst({
    cacheName: 'aym-assets-v1',
    plugins: [
      new ExpirationPlugin({ maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 60 }),
    ],
  })
)

// StaleWhileRevalidate: JS + CSS bundles
registerRoute(
  ({ request }) => /\.(?:js|css)$/i.test(request.url),
  new StaleWhileRevalidate({ cacheName: 'aym-code-v1' })
)

// Daily reminder via Periodic Background Sync (Android PWA / Desktop Chrome)
self.addEventListener('periodicsync', (event: Event) => {
  const e = event as ExtendableEvent & { tag: string }
  if (e.tag === 'daily-amic-reminder') {
    e.waitUntil(
      self.registration.showNotification('Amy wartet auf dich 🦉', {
        body: 'Dein nächstes Amic ist bereit. Mach weiter!',
        icon: '/icon-192.png',
        badge: '/icon-maskable-192.png',
        tag: 'daily-amic',
        renotify: false,
      })
    )
  }
})
