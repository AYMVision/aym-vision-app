import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amysurfwing.de',
  // base: '/blog', // ← einkommentieren wenn der Blog unter amysurfwing.de/blog/ läuft
  integrations: [
    sitemap(), // generiert automatisch /sitemap-index.xml
  ],
});
