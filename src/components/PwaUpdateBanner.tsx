// src/components/PwaUpdateBanner.tsx
// Zeigt ein Banner wenn eine neue App-Version wartet.
// Die updateSW-Funktion kommt von virtual:pwa-register und sendet
// erst skipWaiting an den SW, bevor die Seite neu geladen wird.

interface Props {
  onUpdate: () => void;
  onDismiss: () => void;
}

export default function PwaUpdateBanner({ onUpdate, onDismiss }: Props) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm
                    rounded-2xl border border-[var(--color-teal-200)] bg-white shadow-xl px-4 py-3
                    flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-900 leading-snug">
          Neue Version verfügbar
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          Jetzt aktualisieren für die neuesten Inhalte.
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1"
        >
          Später
        </button>
        <button
          type="button"
          onClick={onUpdate}
          className="text-xs font-semibold rounded-xl px-3 py-1.5
                     bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
        >
          Aktualisieren
        </button>
      </div>
    </div>
  );
}
