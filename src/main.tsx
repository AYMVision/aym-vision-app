// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import i18n, { ensureNamespace } from './i18n';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onOfflineReady() {
    console.info('[PWA] App ist jetzt offline verfügbar.');
  },
});

async function bootstrap() {
  const lng = (i18n.resolvedLanguage || i18n.language || 'de').split('-')[0];
  await ensureNamespace(lng, 'common');

  const rootEl = document.getElementById('root');
  if (!rootEl) throw new Error('Root element #root not found');

  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrap();