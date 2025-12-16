import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // Wichtig für GitHub Pages (Repo-Pages + PR-Previews)
  base: '/aym-vision-app/',
  plugins: [react(), tailwindcss()],
});
