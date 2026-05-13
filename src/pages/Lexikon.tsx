// src/pages/Lexikon.tsx
// Carlos' Tech-Lexikon — erklärt Begriffe aus der digitalen Welt.

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { getLexikonEntries } from '../lexikon/lexikonIndex';
import type { LexikonEntry } from '../lexikon/lexikonTypes';

function LexikonTermCard({ entry, onClick }: { entry: LexikonEntry; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-start gap-3"
    >
      <span className="text-2xl mt-0.5">📖</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-anthracite-900 text-base">{entry.title}</p>
        <p className="text-sm text-slate-500 mt-0.5 line-clamp-2 leading-snug">{entry.teaser}</p>
      </div>
      <span className="text-slate-400 text-lg mt-1">›</span>
    </button>
  );
}

function LexikonTermModal({ entry, onClose }: { entry: LexikonEntry; onClose: () => void }) {
  const { t } = useTranslation('lexikon');

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        <div className="px-5 pb-8 pt-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1 block">
                {t('modal.label')}
              </span>
              <h2 className="text-2xl font-bold text-anthracite-900">{entry.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl leading-none mt-1 shrink-0"
              aria-label={t('modal.closeAria')}
            >
              ✕
            </button>
          </div>

          {/* Teaser */}
          <p className="text-base font-medium text-teal-700 bg-teal-50 rounded-xl px-4 py-3 mb-4 leading-snug">
            {entry.teaser}
          </p>

          {/* Body */}
          <p className="text-base text-slate-700 leading-relaxed mb-4">{entry.body}</p>

          {/* Did you know */}
          {entry.didYouKnow && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">
                {t('modal.didYouKnow')}
              </p>
              <p className="text-sm text-amber-900 leading-snug">{entry.didYouKnow}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Lexikon() {
  const { t } = useTranslation('lexikon');
  const entries = getLexikonEntries();
  const [search, setSearch] = useState('');
  const [openEntry, setOpenEntry] = useState<LexikonEntry | null>(null);

  const filtered = entries.filter(e => {
    const q = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.teaser.toLowerCase().includes(q)
    );
  });

  return (
    <Layout title={t('title')}>
      <div className="max-w-lg mx-auto px-4 pt-4 pb-28">
        {/* Hero */}
        <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white px-5 py-5 mb-5 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📚</span>
            <div>
              <h1 className="text-xl font-bold leading-tight">{t('title')}</h1>
              <p className="text-sm text-teal-100 mt-0.5">{t('subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
            🔍
          </span>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Begriff suchen…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-base text-anthracite-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Entries */}
        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <p className="text-center text-slate-400 py-8 text-sm">Kein Begriff gefunden.</p>
          )}
          {filtered.map(entry => (
            <LexikonTermCard
              key={entry.id}
              entry={entry}
              onClick={() => setOpenEntry(entry)}
            />
          ))}
        </div>
      </div>

      {openEntry && (
        <LexikonTermModal entry={openEntry} onClose={() => setOpenEntry(null)} />
      )}
    </Layout>
  );
}

export { LexikonTermModal };
