// src/pages/NewspaperArticle.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { assetUrl } from '../common/assetUrl';

import { useProfile } from '../profile/useProfile';
import { BONUS_INDEX, type BonusItem } from '../bonus/bonusIndex';
import { isBonusUnlocked, type BonusProgressSnapshot } from '../bonus/bonusUnlock';
import { unlockBonusById } from '../bonus/unlockBonusById';
import { parseFrontmatter } from '../bonus/mdFrontmatter';
import { ArticleBody } from '../bonus/ArticleBody';

type LocationState = { backTo?: string; backgroundLocation?: unknown } | null;

function normalizeLang(lang: string | undefined) {
  const l = (lang ?? 'de').toLowerCase();
  return l.startsWith('en') ? 'en' : 'de';
}

function useBonusProgressFromProfile(): BonusProgressSnapshot {
  const { profile } = useProfile();

  const completed = profile.progress?.completedChapters ?? {};
  const seen = new Set<string>();

  for (const [key, done] of Object.entries(completed)) {
    if (!done) continue;
    const parts = key.split(':');
    if (parts.length !== 3) continue;

    const episodeId = parts[1];
    const match = /^c(\d{2})$/.exec(parts[2]);
    if (!match) continue;

    seen.add(`${episodeId}c${match[1]}`);
  }

  return { seenChapterIds: Array.from(seen) };
}

export default function NewspaperArticle() {
  const { t, i18n } = useTranslation('bonus');
  const lang = normalizeLang(i18n.resolvedLanguage ?? i18n.language);

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = (location.state ?? null) as LocationState;
  const isModal = Boolean(state?.backgroundLocation);

  const progress = useBonusProgressFromProfile();

  const [bodyText, setBodyText] = useState<string | null>(null);
  const [bodyError, setBodyError] = useState(false);
  const [meta, setMeta] = useState<{
  title?: string;
  description?: string;
  author?: string;
  date?: string;
} | null>(null);

  const item = useMemo(() => {
    if (!id) return null;
    return BONUS_INDEX.find((x) => x.bonusId === id && x.category === 'newspaper') ?? null;
  }, [id]);

  const unlocked = item ? isBonusUnlocked(item, progress) : false;

  useEffect(() => {
    if (!item || !unlocked) return;
    unlockBonusById(item.bonusId);
  }, [item, unlocked]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setBodyError(false);
      setBodyText(null);
      setMeta(null);

      if (!item || !unlocked) return;
      if (!item.bodySrc) return;

      const urlLang = assetUrl(`${item.bodySrc}.${lang}.md`);
      const urlPlain = assetUrl(`${item.bodySrc}.md`);

      try {
        let res = await fetch(urlLang);
        if (!res.ok) res = await fetch(urlPlain);
        if (!res.ok) throw new Error();

        const text = await res.text();
        const parsed = parseFrontmatter(text);

        if (cancelled) return;

        setMeta(parsed.meta ?? null);
        setBodyText((parsed.body ?? '').trim());
      } catch {
        if (!cancelled) setBodyError(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [item, unlocked, lang]);

  if (!item) {
    return (
      <Layout backPath="/newspaper">
        <div className="max-w-3xl mx-auto px-4 mt-10 text-sm text-slate-600">
          Artikel nicht gefunden.
        </div>
      </Layout>
    );
  }

  return (
    <Layout backPath={state?.backTo ?? '/newspaper'} hideHeader={isModal}>
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-6">

        {/* LOCK */}
        {!unlocked && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 mb-4">
            🔒 Lies weiter in der Story, um das freizuschalten.
          </div>
        )}
        {unlocked && item.coverImage ? (
  <div className="mb-5 overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm">
    <img
      src={assetUrl(item.coverImage)}
      alt=""
      className="w-full h-auto max-h-[280px] object-cover"
      loading="lazy"
      decoding="async"
    />
  </div>
) : null}
{/* ARTICLE BODY */}
{unlocked && (
  <div className="rounded-[32px] bg-white/90 backdrop-blur shadow-sm px-4 sm:px-6 py-5 border border-black/5">
    {bodyError ? (
      <div className="text-slate-700">Der Artikel kommt bald ✨</div>
    ) : bodyText ? (
      <ArticleBody text={bodyText} />
    ) : (
      <div className="text-slate-600">Lädt…</div>
    )}
  </div>
)}

        {/* BACK */}
        <div className="mt-8">
          <Link
            to="/newspaper"
            className="inline-flex px-4 py-2 rounded-2xl border border-slate-200 bg-white text-sm font-bold hover:bg-slate-50"
          >
            ← Zurück
          </Link>
        </div>

      </div>
    </Layout>
  );
}