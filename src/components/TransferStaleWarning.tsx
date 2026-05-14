// src/components/TransferStaleWarning.tsx
// Shown in Profile when: PWA mode + transfer link is stale (>5 days) or never created.

import { Link } from 'react-router-dom';
import { getLastTransferExportTime } from '../common/transferLink';
import { isStandalonePwa, isPwaFirstLaunch } from '../common/usePwaContext';

const STALE_DAYS = 5;
const MS_PER_DAY = 86_400_000;

export default function TransferStaleWarning() {
  if (!isStandalonePwa()) return null;

  const lastExport = getLastTransferExportTime();
  const now = Date.now();

  const isStale = lastExport === null || now - lastExport > STALE_DAYS * MS_PER_DAY;
  if (!isStale) return null;

  const daysAgo = lastExport ? Math.floor((now - lastExport) / MS_PER_DAY) : null;

  return (
    <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0">⚠️</span>
        <div>
          <div className="text-sm font-bold text-amber-900">
            Spielstand nicht gesichert
          </div>
          <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">
            {daysAgo === null
              ? 'Du hast noch keinen Transfer-Link erstellt. Auf iPhone/iPad können Daten nach 7 Tagen Inaktivität gelöscht werden.'
              : `Dein letzter Transfer-Link ist ${daysAgo} Tage alt. Erstelle einen neuen, um deinen Spielstand zu sichern.`}
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Öffne unten "Spielstand sichern & übertragen" und erstelle einen neuen Link.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Compact version for use in the Welcome page banner area (PWA mode, has progress) */
export function TransferStaleBanner() {
  if (!isStandalonePwa()) return null;
  if (isPwaFirstLaunch()) return null;

  const lastExport = getLastTransferExportTime();
  const now = Date.now();
  const isStale = lastExport === null || now - lastExport > STALE_DAYS * MS_PER_DAY;
  if (!isStale) return null;

  return (
    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-lg shrink-0">⚠️</span>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-amber-900">
            Spielstand sichern —{' '}
          </span>
          <span className="text-sm text-amber-800">
            {lastExport === null ? 'noch kein Transfer-Link erstellt.' : 'Transfer-Link veraltet.'}
          </span>
        </div>
        <Link
          to="/profile"
          className="shrink-0 rounded-xl bg-amber-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-800"
        >
          Sichern →
        </Link>
      </div>
    </div>
  );
}
