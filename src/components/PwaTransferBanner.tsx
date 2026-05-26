// src/components/PwaTransferBanner.tsx
// Shown on Welcome page in standalone PWA mode when no progress exists yet.

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePwaContext } from '../common/usePwaContext';

export default function PwaTransferBanner() {
  const { t } = useTranslation('common');
  const { showTransferHint, dismiss } = usePwaContext();

  if (!showTransferHint) return null;

  return (
    <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0 mt-0.5">🔗</span>
          <div>
            <div className="text-sm font-bold text-sky-900">
              Schon im Browser gespielt?
            </div>
            <p className="mt-0.5 text-sm text-sky-800 leading-relaxed">
              Übertrage deinen Spielstand mit einem Transfer-Link hierher.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/adult-settings"
                state={{ openSection: 'protection' }}
                onClick={dismiss}
                className="inline-flex items-center justify-center rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
              >
                Spielstand übertragen →
              </Link>
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50"
              >
                Neu starten
              </button>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t('close', { defaultValue: 'Schließen' })}
          className="shrink-0 text-sky-400 hover:text-sky-600 text-lg leading-none mt-0.5"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
