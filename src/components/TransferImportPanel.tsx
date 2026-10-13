// src/components/TransferImportPanel.tsx
import { useState } from 'react';
import {
  decodeTransferPayload,
  buildPreview,
  applyTransferPayload,
  type TransferPayload,
  type TransferPreview,
} from '../common/transferLink';

type Step = 'idle' | 'preview' | 'confirm' | 'applying' | 'done' | 'error';

function extractData(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/#\/transfer\/(.+)$/);
  return match ? match[1] : trimmed;
}

function PreviewRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-800">{value}</span>
    </div>
  );
}

export default function TransferImportPanel() {
  const [pasteValue, setPasteValue] = useState('');
  const [step, setStep] = useState<Step>('idle');
  const [preview, setPreview] = useState<TransferPreview | null>(null);
  const [payload, setPayload] = useState<TransferPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!pasteValue.trim()) return;
    const data = extractData(pasteValue.trim());
    const result = decodeTransferPayload(data);
    if (!result.ok) {
      setError(result.error);
      setStep('error');
      return;
    }
    setPayload(result.payload);
    setPreview(buildPreview(result.payload));
    setStep('preview');
  }

  function handleApply() {
    if (!payload) return;
    setStep('applying');
    try {
      applyTransferPayload(payload);
      setStep('done');
      setTimeout(() => {
        window.location.replace(window.location.origin + window.location.pathname + '#/');
      }, 2000);
    } catch {
      setError('Beim Importieren ist ein Fehler aufgetreten. Bitte versuche es erneut.');
      setStep('error');
    }
  }

  function reset() {
    setPasteValue('');
    setStep('idle');
    setPreview(null);
    setPayload(null);
    setError(null);
  }

  if (step === 'done') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-center">
        <div className="text-2xl mb-1">✅</div>
        <p className="text-sm font-bold text-emerald-800">Spielstand übernommen!</p>
        <p className="text-xs text-emerald-700 mt-1">Die App wird neu geladen …</p>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-4">
        <p className="text-sm font-bold text-rose-800 mb-1">Fehler beim Einlösen</p>
        <p className="text-xs text-rose-700 leading-relaxed">{error}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-3 rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (step === 'preview' || step === 'confirm' || step === 'applying') {
    const exportDate = preview
      ? new Date(preview.exportedAt).toLocaleString('de-DE', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
      : '';
    return (
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📦</span>
          <div>
            <p className="text-sm font-bold text-sky-900">Spielstand gefunden</p>
            <p className="text-xs text-sky-700">Erstellt am {exportDate}</p>
          </div>
        </div>

        {preview && (
          <div className="rounded-xl border border-slate-100 bg-white px-3 py-1">
            <PreviewRow label="Abgeschlossene Kapitel" value={preview.chaptersCompleted} />
            <PreviewRow label="Episoden" value={preview.episodesCompleted} />
            <PreviewRow label="Sticker" value={preview.stickersEarned} />
            <PreviewRow label="Münzen" value={preview.coins} />
          </div>
        )}

        {step === 'confirm' && (
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 leading-relaxed">
            Vorhandene Daten auf diesem Gerät werden überschrieben. Bist du sicher?
          </div>
        )}

        {step === 'applying' ? (
          <p className="text-sm text-sky-700 text-center py-1">Wird übertragen …</p>
        ) : step === 'confirm' ? (
          <div className="flex gap-2">
            <button type="button" onClick={handleApply}
              className="flex-1 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800">
              Ja, übertragen
            </button>
            <button type="button" onClick={() => setStep('preview')}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Zurück
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep('confirm')}
              className="flex-1 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800">
              Spielstand übernehmen →
            </button>
            <button type="button" onClick={reset}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Abbrechen
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        value={pasteValue}
        onChange={e => setPasteValue(e.target.value)}
        placeholder="https://www.amysurfwing.de/#/transfer/..."
        rows={3}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none leading-relaxed"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!pasteValue.trim()}
        className="rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-40"
      >
        Spielstand laden →
      </button>
    </div>
  );
}
