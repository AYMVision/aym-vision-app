// src/components/PwaTransferBanner.tsx
// Shown on Welcome page in standalone PWA mode when no progress exists yet.
// Lets users scan a QR code or paste a transfer link to restore their game progress.

import { useEffect, useRef, useState } from 'react';
import { usePwaContext } from '../common/usePwaContext';
import {
  decodeTransferPayload,
  buildPreview,
  applyTransferPayload,
  type TransferPayload,
  type TransferPreview,
} from '../common/transferLink';

type Mode = 'idle' | 'scan' | 'paste';
type Step = 'input' | 'preview' | 'confirm' | 'applying' | 'done' | 'error';

function extractTransferData(input: string): string {
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

export default function PwaTransferBanner() {
  const { showTransferHint, dismiss } = usePwaContext();

  const [mode, setMode] = useState<Mode>('idle');
  const [step, setStep] = useState<Step>('input');
  const [pasteValue, setPasteValue] = useState('');
  const [preview, setPreview] = useState<TransferPreview | null>(null);
  const [payload, setPayload] = useState<TransferPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<unknown>(null);

  // Cleanup QR scanner on unmount or mode change
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  useEffect(() => {
    if (mode !== 'scan') stopScanner();
  }, [mode]);

  function stopScanner() {
    if (scannerRef.current) {
      (scannerRef.current as { stop: () => void; destroy: () => void }).stop();
      (scannerRef.current as { stop: () => void; destroy: () => void }).destroy();
      scannerRef.current = null;
    }
  }

  async function startScanner() {
    if (!videoRef.current) return;
    try {
      const QrScanner = (await import('qr-scanner')).default;
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          stopScanner();
          handleRawInput(result.data);
        },
        {
          preferredCamera: 'environment',
          highlightScanRegion: true,
          highlightCodeOutline: true,
        },
      );
      scannerRef.current = scanner;
      await scanner.start();
    } catch {
      setError('Kamera konnte nicht gestartet werden. Bitte erlaube den Kamerazugriff oder nutze den Link-Option.');
      setStep('error');
    }
  }

  useEffect(() => {
    if (mode === 'scan' && step === 'input') {
      startScanner();
    }
  }, [mode, step]);

  function handleRawInput(raw: string) {
    const data = extractTransferData(raw);
    const result = decodeTransferPayload(data);

    if (!result.ok) {
      const isMnemonicError = result.error.includes('Identität');
      setError(
        isMnemonicError
          ? 'Der Link ist verschlüsselt und kann nur auf dem Gerät geöffnet werden, auf dem er erstellt wurde. Tipp: Öffne den Link direkt im Browser-Tab (nicht in der App).'
          : `Ungültiger Link: ${result.error}`,
      );
      setStep('error');
      return;
    }

    setPayload(result.payload);
    setPreview(buildPreview(result.payload));
    setStep('preview');
  }

  function handlePasteSubmit() {
    if (!pasteValue.trim()) return;
    handleRawInput(pasteValue.trim());
  }

  function handleApply() {
    if (!payload) return;
    setStep('applying');
    try {
      applyTransferPayload(payload);
      setStep('done');
      setTimeout(() => {
        window.location.replace(window.location.origin + window.location.pathname + '#/');
      }, 1800);
    } catch {
      setError('Beim Importieren ist ein Fehler aufgetreten. Bitte versuche es erneut.');
      setStep('error');
    }
  }

  function reset() {
    stopScanner();
    setMode('idle');
    setStep('input');
    setPasteValue('');
    setPreview(null);
    setPayload(null);
    setError(null);
  }

  if (!showTransferHint) return null;

  // ── Done ──
  if (step === 'done') {
    return (
      <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-5 shadow-sm text-center">
        <div className="text-3xl mb-2">✅</div>
        <p className="text-sm font-bold text-emerald-800">Spielstand übernommen!</p>
        <p className="text-xs text-emerald-700 mt-1">Die App wird neu geladen …</p>
      </div>
    );
  }

  // ── Preview / Confirm / Applying ──
  if (step === 'preview' || step === 'confirm' || step === 'applying') {
    const exportDate = preview
      ? new Date(preview.exportedAt).toLocaleString('de-DE', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
      : '';

    return (
      <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📦</span>
          <div>
            <p className="text-sm font-bold text-sky-900">Spielstand gefunden</p>
            <p className="text-xs text-sky-700">Erstellt am {exportDate}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white px-3 py-1 mb-3">
          {preview && (
            <>
              <PreviewRow label="Abgeschlossene Kapitel" value={preview.chaptersCompleted} />
              <PreviewRow label="Episoden" value={preview.episodesCompleted} />
              <PreviewRow label="Sticker" value={preview.stickersEarned} />
              <PreviewRow label="Münzen" value={preview.coins} />
            </>
          )}
        </div>

        {step === 'confirm' && (
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 mb-3 text-xs text-amber-800 leading-relaxed">
            Vorhandene Daten auf diesem Gerät werden überschrieben. Bist du sicher?
          </div>
        )}

        {step === 'applying' ? (
          <p className="text-sm text-sky-700 text-center py-2">Wird übertragen …</p>
        ) : step === 'confirm' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800"
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
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep('confirm')}
              className="flex-1 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800"
            >
              Spielstand übernehmen →
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Abbrechen
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Error ──
  if (step === 'error') {
    return (
      <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-rose-800 mb-1">Übertragung fehlgeschlagen</p>
            <p className="text-xs text-rose-700 leading-relaxed">{error}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={reset}
                className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800"
              >
                Erneut versuchen
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
              >
                Überspringen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── QR Scanner ──
  if (mode === 'scan') {
    return (
      <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-sky-900">📷 QR-Code scannen</p>
          <button type="button" onClick={reset} className="text-sky-400 hover:text-sky-600 text-lg leading-none">✕</button>
        </div>
        <div className="relative w-full overflow-hidden rounded-xl bg-black aspect-square max-h-56">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
        </div>
        <p className="text-xs text-sky-700 mt-2 text-center leading-snug">
          Halte die Kamera auf den QR-Code aus dem Elternbereich des alten Geräts.
        </p>
      </div>
    );
  }

  // ── Paste Link ──
  if (mode === 'paste') {
    return (
      <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-sky-900">📋 Transfer-Link einfügen</p>
          <button type="button" onClick={reset} className="text-sky-400 hover:text-sky-600 text-lg leading-none">✕</button>
        </div>
        <textarea
          value={pasteValue}
          onChange={e => setPasteValue(e.target.value)}
          placeholder="https://amysurfwing.de/#/transfer/..."
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none leading-relaxed"
        />
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handlePasteSubmit}
            disabled={!pasteValue.trim()}
            className="flex-1 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-40"
          >
            Spielstand laden →
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Zurück
          </button>
        </div>
      </div>
    );
  }

  // ── Idle: Main Banner ──
  return (
    <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0 mt-0.5">🔗</span>
          <div>
            <div className="text-sm font-bold text-sky-900">Schon im Browser gespielt?</div>
            <p className="mt-0.5 text-sm text-sky-800 leading-relaxed">
              Übertrage deinen Spielstand direkt hierher.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setMode('scan'); setStep('input'); }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
              >
                📷 QR-Code scannen
              </button>
              <button
                type="button"
                onClick={() => { setMode('paste'); setStep('input'); }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50"
              >
                📋 Link einfügen
              </button>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="mt-3 text-xs text-sky-500 hover:text-sky-700 underline underline-offset-2"
            >
              Neu starten (kein Transfer)
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Schließen"
          className="shrink-0 text-sky-400 hover:text-sky-600 text-lg leading-none mt-0.5"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
