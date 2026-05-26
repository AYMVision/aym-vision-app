// src/components/LandscapeOverlay.tsx
// Zeigt einen freundlichen Hinweis wenn das Gerät im Querformat ist.
// Funktioniert rein per CSS-Media-Query — kein JS, kein State.

import { useTranslation } from 'react-i18next';

export default function LandscapeOverlay() {
  const { t } = useTranslation('common');
  return (
    <>
      <style>{`
        .landscape-overlay {
          display: none;
        }
        @media (orientation: landscape) and (max-height: 500px) {
          .landscape-overlay {
            display: flex;
          }
        }
      `}</style>

      <div
        className="landscape-overlay fixed inset-0 z-[9999] flex-col items-center justify-center gap-4 bg-white px-8 text-center"
        aria-live="polite"
      >
        <div
          style={{
            fontSize: '4rem',
            animation: 'landscape-rotate 2s ease-in-out infinite',
          }}
        >
          📱
        </div>

        <style>{`
          @keyframes landscape-rotate {
            0%, 100% { transform: rotate(0deg); }
            40%       { transform: rotate(90deg); }
            60%       { transform: rotate(90deg); }
          }
        `}</style>

        <p
          style={{
            fontSize: '1.125rem',
            fontWeight: 800,
            color: '#293333',
            lineHeight: 1.4,
          }}
        >
          {t('landscape.title')}
        </p>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#64748b',
          }}
        >
          {t('landscape.hint')}
        </p>
      </div>
    </>
  );
}
