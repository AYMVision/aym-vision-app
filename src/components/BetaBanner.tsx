// src/components/BetaBanner.tsx
import React, { useState } from 'react';

const DISMISSED_KEY = 'aym_beta_banner_dismissed';

export default function BetaBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISSED_KEY) === '1';
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  function dismiss() {
    try {
      localStorage.setItem(DISMISSED_KEY, '1');
    } catch {}
    setDismissed(true);
  }

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3">
        <span className="text-xs font-bold text-amber-700 shrink-0">🧪 Beta</span>
        <p className="text-xs text-amber-800 flex-1 leading-snug">
          Du testest eine frühe Version von Amy's Surfwing – dein Feedback hilft uns weiter.
        </p>
        <a
          href="mailto:hello@amysurfwing.de?subject=Feedback%20Beta"
          className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors"
        >
          Feedback schreiben →
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Schließen"
          className="shrink-0 text-amber-500 hover:text-amber-700 transition-colors p-1"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
