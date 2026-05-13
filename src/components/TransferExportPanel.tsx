// src/components/TransferExportPanel.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { buildTransferLink } from '../common/transferLink';
import { isStandalonePwa } from '../common/usePwaContext';

type CopyState = 'idle' | 'copied' | 'error';
type ShareState = 'idle' | 'sharing' | 'done' | 'error';

export default function TransferExportPanel() {
  const [link, setLink] = useState<string | null>(null);
  const standalone = isStandalonePwa();
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [shareState, setShareState] = useState<ShareState>('idle');

  const canShare = typeof navigator.share === 'function';

  function handleGenerate() {
    setLink(buildTransferLink());
    setCopyState('idle');
    setShareState('idle');
  }

  async function handleCopy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2500);
    } catch {
      setCopyState('error');
    }
  }

  async function handleShare() {
    if (!link) return;
    setShareState('sharing');
    try {
      await navigator.share({
        title: 'Amy Surfwing – Spielstand',
        text: 'Hier ist dein Transfer-Link, um deinen Spielstand zu übertragen:',
        url: link,
      });
      setShareState('done');
      setTimeout(() => setShareState('idle'), 3000);
    } catch {
      // user cancelled or error — treat as idle
      setShareState('idle');
    }
  }

  return (
    <div className="space-y-5">
      {/* Erklärung */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed">
        <p>
          Mit dem Transfer-Link kannst du deinen Spielstand auf ein anderes Gerät oder zwischen
          Browser und App übertragen. Enthalten sind: Kapitel- & Episodenfortschritt, Sticker,
          Münzen, Avatar, Bonus-Fortschritt, gelesene Artikel und deine Reaktionen darauf.
          Der Link enthält <strong>keine persönlichen Texte</strong> (Tagebuch, Chat-Namen,
          Sammelkarte).
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Der Link bleibt solange gültig, bis du einen neuen erstellst. Er ist nur für dich
          bestimmt und sollte nicht öffentlich geteilt werden.
        </p>
      </div>

      {/* Schritt 1: Erstellen */}
      <div>
        <button
          type="button"
          onClick={handleGenerate}
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          🔗 Transfer-Link erstellen
        </button>
      </div>

      {/* Schritt 2: Link anzeigen + kopieren/teilen */}
      {link && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Dein Transfer-Link
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="break-all text-xs text-slate-600 font-mono leading-relaxed select-all">
              {link}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className={[
                'rounded-xl border px-4 py-2 text-sm font-semibold transition',
                copyState === 'copied'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : copyState === 'error'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100',
              ].join(' ')}
            >
              {copyState === 'copied' ? '✓ Kopiert!' : copyState === 'error' ? 'Fehler' : '📋 Link kopieren'}
            </button>

            {canShare && (
              <button
                type="button"
                onClick={handleShare}
                disabled={shareState === 'sharing'}
                className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-60"
              >
                {shareState === 'sharing'
                  ? 'Wird gesendet …'
                  : shareState === 'done'
                  ? '✓ Gesendet'
                  : '📤 Teilen'}
              </button>
            )}
          </div>

          <div className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2.5 text-xs text-sky-800 leading-relaxed">
            <strong>So nutzt du den Link:</strong> Öffne den Link auf dem anderen Gerät (z.B. per
            AirDrop, WhatsApp oder E-Mail). Dein Spielstand wird dann angezeigt und kann mit einem
            Klick übernommen werden.
          </div>
        </div>
      )}

      {/* iOS storage warning (only in browser, not already in PWA) */}
      {!standalone && (
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-3 text-xs text-amber-800 leading-relaxed">
          <strong>Hinweis für iPhone/iPad:</strong> iOS löscht Daten installierter Web-Apps nach
          ca. 7 Tagen Inaktivität. Erstelle regelmäßig einen neuen Transfer-Link und speichere ihn
          sicher.{' '}
          <Link to="/install" className="font-semibold underline underline-offset-2 hover:text-amber-900">
            App installieren →
          </Link>
        </div>
      )}
    </div>
  );
}
