import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // Wichtig: relative Pfade, damit es unter
  // - aymvision.org/
  // - aymvision.github.io/aym-vision-app/
  // - .../pr-preview/pr-1/
  // überall funktioniert
  base: './',
  plugins: [react(), tailwindcss()],
});
