// src/pages/NewspaperArticle.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { assetUrl } from '../common/assetUrl';

import { useProfile } from '../profile/useProfile';
import { BONUS_INDEX, type BonusItem } from '../bonus/bonusIndex';
import { isBonusUnlocked, type BonusProgressSnapshot } from '../bonus/bonusUnlock';
import { markBonusSeen } from '../bonus/bonusSeen';
import { parseFrontmatter } from '../bonus/mdFrontmatter';
import { ArticleReader } from '../bonus/ArticleReader';
import MiniAudioPlayer from '../components/MiniAudioPlayer';

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
  const navigate = useNavigate();
  const state = (location.state ?? null) as LocationState;
  const isModal = Boolean(state?.backgroundLocation);

  const backPath = state?.backTo ?? '/newspaper';

  function goBack() {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) {
      navigate(-1);
    } else {
      navigate(backPath);
    }
  }

  const progress = useBonusProgressFromProfile();

  const [bodyText, setBodyText] = useState<string | null>(null);
  const [bodyError, setBodyError] = useState(false);
  const [meta, setMeta] = useState<{
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  aiTranslated?: boolean;
} | null>(null);

  const item = useMemo(() => {
    if (!id) return null;
    return BONUS_INDEX.find((x) => x.bonusId === id && x.category === 'newspaper') ?? null;
  }, [id]);

  // currentNews articles (chioma-news-*, current-news-*, weekly-news-*) are always free
  const isCurrentNewsItem = (bonusId: string) =>
    bonusId.includes('current-news') || bonusId.includes('chioma-news') || bonusId.includes('weekly-news');
  const unlocked = item
    ? isCurrentNewsItem(item.bonusId) || item.freeForAll || isBonusUnlocked(item, progress)
    : false;

  useEffect(() => {
    if (!isModal) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [id, isModal]);

  useEffect(() => {
    if (!item || !unlocked) return;
    markBonusSeen(item.bonusId);
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
      const urlDeFallback = lang !== 'de' ? assetUrl(`${item.bodySrc}.de.md`) : null;
      const urlPlain = assetUrl(`${item.bodySrc}.md`);

      try {
        let res = await fetch(urlLang);
        if (!res.ok && urlDeFallback) res = await fetch(urlDeFallback);
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
      <Layout backPath="/newspaper" hideFooter>
        <div className="max-w-3xl mx-auto px-4 mt-10 text-sm text-slate-600">
          Artikel nicht gefunden.
        </div>
      </Layout>
    );
  }

  if (!item.bodySrc && !item.audioSrc) {
    return (
      <Layout backPath={state?.backTo ?? '/newspaper'} hideHeader={isModal} hideFooter>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            Dieser Artikel ist noch nicht verfügbar.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout backPath={isModal ? undefined : backPath} hideHeader={isModal} hideFooter>
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
{/* AUDIO PLAYER */}
{unlocked && item.audioSrc ? (
  <div className="mb-5 rounded-[28px] border border-slate-200 bg-white shadow-sm p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="text-xs font-extrabold text-slate-500">🎧 {t('newspaper.audioListen')}</div>
      {lang === 'en' && (
        <div className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5">
          🇩🇪 {t('newspaper.audioDeOnly', { defaultValue: 'Audio in German only' })}
        </div>
      )}
    </div>
    <MiniAudioPlayer src={assetUrl(item.audioSrc)} />
  </div>
) : null}

{/* ARTICLE BODY — nur wenn bodySrc vorhanden und kein Ladefehler */}
{unlocked && item.bodySrc && !bodyError && (
  <div className="rounded-[32px] bg-white/90 backdrop-blur shadow-sm px-4 sm:px-6 py-5 border border-black/5">
    {meta?.aiTranslated && (
      <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 rounded-full px-3 py-1 mb-4">
        <span>🤖</span>
        <span>{t('newspaper.aiTranslated', { defaultValue: 'AI-translated · May contain errors' })}</span>
      </div>
    )}
    {bodyText === null ? (
      <div className="text-slate-600">{t('newspaper.loading')}</div>
    ) : bodyText ? (
      <ArticleReader text={bodyText} bonusId={item.bonusId} requireAudioConfirm={!!item.audioSrc} author={meta?.author} givesCoins={!!item.unlockedBy} />
    ) : (
      <ArticleReader text={meta?.description ?? ''} bonusId={item.bonusId} requireAudioConfirm={!!item.audioSrc} author={meta?.author} givesCoins={!!item.unlockedBy} />
    )}
  </div>
)}

        {/* ── CLOSE (bottom) ── */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={goBack}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
          >
            ← {t('cards.backToCards', { defaultValue: 'Zurück' })}
          </button>
        </div>
        <div className="h-6" />
      </div>
    </Layout>
  );
}