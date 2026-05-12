// src/pages/TransferPage.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  decodeTransferPayload,
  buildPreview,
  applyTransferPayload,
  type TransferPreview,
} from '../common/transferLink';

function PreviewRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

export default function TransferPage() {
  const { data } = useParams<{ data: string }>();
  const navigate = useNavigate();

  const [step, setStep] = useState<'preview' | 'confirm' | 'done'>('preview');
  const [error, setError] = useState<string | null>(null);

  if (!data) {
    return (
      <Layout backPath="/" hideFooter>
        <div className="mx-auto max-w-xl px-4 py-12 text-center">
          <p className="text-slate-600">Kein Transfer-Link erkannt.</p>
        </div>
      </Layout>
    );
  }

  const decoded = decodeTransferPayload(data);

  if (!decoded.ok) {
    return (
      <Layout backPath="/" hideFooter>
        <div className="mx-auto max-w-xl px-4 py-12">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-bold text-red-800">Ungültiger Transfer-Link</h1>
            <p className="mt-2 text-sm text-red-700">{decoded.error}</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Zur Startseite
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const preview: TransferPreview = buildPreview(decoded.payload);
  const exportDate = new Date(preview.exportedAt).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  function handleApply() {
    try {
      applyTransferPayload(decoded.payload);
      setStep('done');
      setTimeout(() => window.location.replace(window.location.origin + window.location.pathname + '#/'), 1800);
    } catch {
      setError('Beim Importieren ist ein Fehler aufgetreten. Bitte versuche es erneut.');
    }
  }

  if (step === 'done') {
    return (
      <Layout backPath="/" hideFooter>
        <div className="mx-auto max-w-xl px-4 py-12 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-emerald-800">Übertragen!</h1>
          <p className="mt-2 text-sm text-slate-600">Dein Spielstand wurde erfolgreich übernommen. Die App wird neu geladen …</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout backPath="/" hideFooter>
      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Spielstand übertragen</h1>
          <p className="mt-2 text-sm text-slate-600">
            Du möchtest deinen Spielstand auf dieses Gerät übertragen. Überprüfe die Daten unten und bestätige dann den Import.
          </p>
        </div>

        {/* Preview card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <div>
              <div className="text-sm font-semibold text-slate-900">Spielstand vom {exportDate}</div>
              <div className="text-xs text-slate-500">Enthält folgende Daten:</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-1">
            <PreviewRow label="Abgeschlossene Kapitel" value={preview.chaptersCompleted} />
            <PreviewRow label="Abgeschlossene Episoden" value={preview.episodesCompleted} />
            <PreviewRow label="Sticker verdient" value={preview.stickersEarned} />
            <PreviewRow label="Münzen" value={preview.coins} />
            {preview.hasItemResponses && (
              <PreviewRow label="Story-Entscheidungen" value="enthalten" />
            )}
            {preview.hasBonusData && (
              <PreviewRow label="Bonus-Fortschritt" value="enthalten" />
            )}
          </div>

          <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800 leading-relaxed">
            <strong>Nicht enthalten:</strong> persönliche Texte (Tagebuch, Chat-Namen, Sammelkarte), KI-Antworten und Eltern-Einstellungen – diese bleiben auf dem Quell-Gerät.
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 'preview' && (
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => setStep('confirm')}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Spielstand jetzt übernehmen →
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Abbrechen
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-900">
              Bestehende Daten auf diesem Gerät werden überschrieben.
            </p>
            <p className="mt-1 text-sm text-amber-800">
              Wenn du hier schon Fortschritte hattest, die nicht im Link enthalten sind, gehen sie verloren. Bist du sicher?
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleApply}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Ja, übertragen
              </button>
              <button
                type="button"
                onClick={() => setStep('preview')}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Zurück
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
