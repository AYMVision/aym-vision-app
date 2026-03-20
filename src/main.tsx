// src/main.tsx
import './ai/core/fetchPatch';
import './ai/llm/xenovaEnv';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import i18n, { ensureNamespace } from './i18n'; // ✅ neu
import App from './App';

async function bootstrap() {
  // i18n init wird durch import './i18n' in der Datei i18n selbst gemacht
  // Wir warten kurz, bis die Sprache feststeht:
  const lng = (i18n.resolvedLanguage || i18n.language || 'de').split('-')[0];

  // ✅ mindestens common vorladen, damit Basis-UI nicht leer ist
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