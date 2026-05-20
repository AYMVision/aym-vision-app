import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amysurfwing.de',
  base: '/blog',
  integrations: [
    sitemap(), // generiert automatisch /sitemap-index.xml
  ],
});
