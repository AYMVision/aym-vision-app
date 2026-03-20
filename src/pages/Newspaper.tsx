// src/pages/Newspaper.tsx
// Schülerzeitung (Blog/Magazin): modern, vielseitig, kindgerecht.
// Features: Hero + Stats + Themen-Kacheln + Neu-Scroller + Feed.
// Daten: BONUS_INDEX (category === 'newspaper'), Unlock via isBonusUnlocked, Seen via bonusSeen.
// Content: Titel/Description kommen bevorzugt aus Markdown-Frontmatter (bodySrc.<lang>.md), Fallbacks ok.
// i18n: Namespace 'bonus' nur für UI-Texte.

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { assetUrl } from '../common/assetUrl';

import { useProfile } from '../profile/useProfile';
import { BONUS_INDEX, type BonusItem } from '../bonus/bonusIndex';
import { isBonusUnlocked, type BonusProgressSnapshot } from '../bonus/bonusUnlock';
import { loadSeenBonusIds } from '../bonus/bonusSeen';
import { parseFrontmatter } from '../bonus/mdFrontmatter';

type LocationState = { backTo?: string } | null;

function normalizeLang(lang: string | undefined): 'de' | 'en' {
  const l = (lang ?? 'de').toLowerCase();
  return l.startsWith('en') ? 'en' : 'de';
}

/** ✅ Fixed 7 Topics (IDs) */
const TOPICS = [
  'infoCheck',
  'teamTalk',
  'create',
  'safe',
  'solve',
  'reflect',
  'fair',
] as const;

type TopicId = (typeof TOPICS)[number];

/** ✅ Topic Icon Map (nie wieder 🏷️) */
function topicIcon(topicId: string) {
  const map: Record<string, string> = {
    infoCheck: '🕵️',
    teamTalk: '🤝',
    create: '🎨',
    safe: '🛡️',
    solve: '🧩',
    reflect: '🔍',
    fair: '⚖️',
  };
  return map[topicId] ?? '📰';
}

/** ✅ Emoji fallback: coverImage > mediaType > first topic > 📰 */
function pickFallbackEmoji(item: BonusItem) {
  if (item.mediaType === 'audio') return '🎧';
  if (item.mediaType === 'link') return '🔗';

  const firstTopic = (item.topicTags ?? [])[0];
  if (firstTopic) return topicIcon(firstTopic);

  return '📰';
}

function useBonusProgressFromProfile(): BonusProgressSnapshot {
  const { profile } = useProfile();

  const completed = profile.progress?.completedChapters ?? {};
  const seen = new Set<string>();

  // completedChapters Keys: "s1:s1e01:c01" => "s1e01c01"
  for (const [key, done] of Object.entries(completed)) {
    if (!done) continue;
    const parts = key.split(':');
    if (parts.length !== 3) continue;

    const episodeId = parts[1];
    const match = /^c(\d{2})$/.exec(parts[2]);
    if (!match) continue;

    seen.add(`${episodeId}c${match[1]}`);
  }

  // Optional: aktuelles Kapitel als "gesehen"
  const cur = profile.progress?.current;
  if (cur?.episodeId && typeof cur.chapterIndex === 'number') {
    const c = String(cur.chapterIndex).padStart(2, '0');
    seen.add(`${cur.episodeId}c${c}`);
  }

  return { seenChapterIds: Array.from(seen) };
}

function mediaIcon(item: BonusItem) {
  if (item.mediaType === 'audio') return '🎧';
  if (item.mediaType === 'link') return '🔗';
  return '📰';
}

function formatLabel(t: (k: string, o?: any) => string, item: BonusItem) {
  return t(`newspaper.format.${item.mediaType}`, { defaultValue: item.mediaType });
}

function prettyTopic(t: (k: string, o?: any) => string, topicId: string) {
  return t(`newspaper.topics.${topicId}`, { defaultValue: topicId });
}

function topicCardStyle(i: number) {
  const styles = [
    'from-amber-100 via-white to-amber-50 border-amber-200',
    'from-sky-100 via-white to-sky-50 border-sky-200',
    'from-rose-100 via-white to-rose-50 border-rose-200',
    'from-emerald-100 via-white to-emerald-50 border-emerald-200',
    'from-violet-100 via-white to-violet-50 border-violet-200',
    'from-orange-100 via-white to-orange-50 border-orange-200',
  ];
  return styles[i % styles.length];
}

function chipStyle(active: boolean) {
  return active
    ? 'bg-slate-900 text-white border-slate-900'
    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
}

type ArticleMetaLite = { title?: string; description?: string };

function useArticleMetaMap(items: BonusItem[], lang: 'de' | 'en') {
  const [map, setMap] = useState<Record<string, ArticleMetaLite>>({});

  useEffect(() => {
    let alive = true;

    const missing = items.filter((it) => !!it.bodySrc && !map[it.bonusId]);
    if (missing.length === 0) return;

    async function run() {
      const next: Record<string, ArticleMetaLite> = {};

      await Promise.all(
        missing.map(async (it) => {
          try {
            const url = `/${it.bodySrc}.${lang}.md`;
            const res = await fetch(url);
            if (!res.ok) return;
            const text = await res.text();
            const fm = parseFrontmatter(text);
            next[it.bonusId] = {
              title: fm.meta.title,
              description: fm.meta.description,
            };
          } catch {
            // ignore
          }
        })
      );

      if (!alive) return;
      if (Object.keys(next).length === 0) return;

      setMap((prev) => ({ ...prev, ...next }));
    }

    run();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, lang]);

  return map;
}

function resolveTitleDesc(
  t: (k: string, o?: any) => string,
  item: BonusItem,
  metaById: Record<string, ArticleMetaLite>
) {
  const meta = metaById[item.bonusId];
  const title =
    meta?.title ??
    (item.titleKey ? t(item.titleKey, { defaultValue: item.bonusId }) : item.bonusId);

  const desc =
    meta?.description ??
    (item.descriptionKey ? t(item.descriptionKey, { defaultValue: '' }) : '');

  return { title, desc };
}

export default function Newspaper() {
  const { t, i18n } = useTranslation('bonus');
  const lang = normalizeLang(i18n.resolvedLanguage ?? i18n.language);

  const location = useLocation();
  const state = (location.state ?? null) as LocationState;

  const progress = useBonusProgressFromProfile();

  const [seenBonusIds, setSeenBonusIds] = useState<string[]>(() => loadSeenBonusIds());
  const [query, setQuery] = useState('');
  const [format, setFormat] = useState<'all' | 'text' | 'audio' | 'link'>('all');
  const [topic, setTopic] = useState<string>('all');

  useEffect(() => {
    setSeenBonusIds(loadSeenBonusIds());
  }, [location.key]);

  const allItems = useMemo(() => {
    return BONUS_INDEX
      .filter((i) => i.category === 'newspaper' && i.released)
      .sort((a, b) => a.order - b.order);
  }, []);

  const metaById = useArticleMetaMap(allItems, lang);

  const unlockedMap = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const it of allItems) m.set(it.bonusId, isBonusUnlocked(it, progress));
    return m;
  }, [allItems, progress]);

  const topicsWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const id of TOPICS) counts[id] = 0;

    for (const it of allItems) {
      for (const tag of it.topicTags ?? []) {
        if (counts[tag] !== undefined) counts[tag] += 1;
      }
    }
    return counts;
  }, [allItems]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allItems.filter((item) => {
      if (format !== 'all' && item.mediaType !== format) return false;
      if (topic !== 'all' && !(item.topicTags ?? []).includes(topic)) return false;

      if (!q) return true;

      const { title, desc } = resolveTitleDesc(t, item, metaById);
      const blob = `${title} ${desc} ${(item.topicTags ?? []).join(' ')} ${item.mediaType}`.toLowerCase();
      return blob.includes(q);
    });
  }, [allItems, format, topic, query, t, metaById]);

  const stats = useMemo(() => {
    let total = 0;
    let unlocked = 0;
    let read = 0;
    let fresh = 0;

    for (const it of allItems) {
      total++;
      const u = unlockedMap.get(it.bonusId) ?? false;
      if (u) unlocked++;
      const s = seenBonusIds.includes(it.bonusId);
      if (s) read++;
      if (u && !s) fresh++;
    }
    return { total, unlocked, read, fresh };
  }, [allItems, unlockedMap, seenBonusIds]);

  const freshUnlocked = useMemo(() => {
    return allItems.filter(
      (it) => (unlockedMap.get(it.bonusId) ?? false) && !seenBonusIds.includes(it.bonusId)
    );
  }, [allItems, unlockedMap, seenBonusIds]);

  const feed = useMemo(() => {
    const rest = [...filteredItems];
    return rest.sort((a, b) => {
      const au = unlockedMap.get(a.bonusId) ? 0 : 1;
      const bu = unlockedMap.get(b.bonusId) ? 0 : 1;
      if (au !== bu) return au - bu;
      return a.order - b.order;
    });
  }, [filteredItems, unlockedMap]);

  return (
    <Layout
      title={t('newspaper.title', { defaultValue: 'Schülerzeitung' })}
      backPath={state?.backTo ?? '/bonus'}
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* HERO */}
        <div className="mt-4 rounded-[28px] border border-black/5 bg-gradient-to-br from-sky-50 via-white to-amber-50 p-5 shadow-sm overflow-hidden relative">
          <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 rounded-full bg-rose-200/30" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-sky-200/30" />
          <div className="pointer-events-none absolute top-10 right-10 w-20 h-20 rounded-full bg-amber-200/25" />

          <div className="relative">
            <div className="text-xs font-extrabold text-slate-700">
              {t('newspaper.kicker', { defaultValue: '📰 Newsroom' })}
            </div>
            <div className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
              {t('newspaper.headline', { defaultValue: 'Unsere Schülerzeitung' })}
            </div>
            <div className="mt-2 text-sm text-slate-700 max-w-2xl">
              {t('newspaper.subtitle', {
                defaultValue: 'Hier findest du Artikel, Audio & Tipps – direkt aus der Story.',
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatPill
                label={t('newspaper.stats.unlocked', { defaultValue: 'Freigeschaltet' })}
                value={`${stats.unlocked}/${stats.total}`}
                kind="emerald"
              />
              <StatPill
                label={t('newspaper.stats.new', { defaultValue: 'Neu' })}
                value={`${stats.fresh}`}
                kind="amber"
              />
              <StatPill
                label={t('newspaper.stats.read', { defaultValue: 'Gelesen' })}
                value={`${stats.read}`}
                kind="sky"
              />
            </div>
          </div>

          {/* Search + Filters */}
          <div className="relative mt-5 rounded-[24px] border border-black/5 bg-white/70 p-3">
            <div className="flex flex-col lg:flex-row gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full lg:flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                placeholder={t('newspaper.searchPlaceholder', { defaultValue: 'Suche…' })}
                aria-label={t('newspaper.searchAria', { defaultValue: 'Artikel suchen' })}
              />

              <div className="flex flex-wrap gap-2">
                {(['all', 'text', 'audio', 'link'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setFormat(k)}
                    className={[
                      'px-3 py-2 rounded-2xl border text-xs font-extrabold transition',
                      chipStyle(format === k),
                    ].join(' ')}
                  >
                    {k === 'all'
                      ? t('newspaper.filters.all', { defaultValue: 'Alle' })
                      : k === 'text'
                      ? t('newspaper.filters.text', { defaultValue: '📰 Text' })
                      : k === 'audio'
                      ? t('newspaper.filters.audio', { defaultValue: '🎧 Audio' })
                      : t('newspaper.filters.link', { defaultValue: '🔗 Link' })}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* THEMEN */}
        <div id="topics" className="mt-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-extrabold text-slate-600">
                {t('newspaper.sections.topicsKicker', { defaultValue: 'Themen' })}
              </div>
              <div className="mt-1 text-lg font-extrabold text-slate-900">
                {t('newspaper.sections.topicsTitle', { defaultValue: 'Wähle ein Thema' })}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {t('newspaper.sections.topicsHint', {
                  defaultValue: 'Tippe auf eine Kachel – dann siehst du passende Beiträge.',
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTopic('all')}
              className="shrink-0 inline-flex px-3 py-2 rounded-2xl border border-slate-200 bg-white text-xs font-extrabold text-slate-800 hover:bg-slate-50"
            >
              {t('newspaper.topics.all', { defaultValue: 'Alle Themen' })}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {TOPICS.map((id, idx) => (
              <button
                key={id}
                type="button"
                onClick={() => setTopic(id)}
                className={[
                  'rounded-3xl border p-3 text-left transition shadow-sm hover:shadow-md active:scale-[0.99]',
                  'bg-gradient-to-br',
                  topicCardStyle(idx),
                  topic === id ? 'ring-2 ring-slate-900/10' : '',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-2xl">{topicIcon(id)}</div>
                  <div className="text-[11px] font-extrabold text-slate-700">
                    {topicsWithCounts[id] ?? 0}
                  </div>
                </div>

                <div className="mt-2 text-xs font-extrabold text-slate-900 line-clamp-2">
                  {prettyTopic(t, id)}
                </div>
              </button>
            ))}
          </div>
        </div>


{/* NEU FREIGESCHALTET (nur wenn es wirklich neue gibt) */}
{freshUnlocked.length > 0 ? (
  <div className="mt-6">
    <div className="flex items-end justify-between gap-3">
      <div>
        <div className="text-xs font-extrabold text-slate-600">
          {t('newspaper.sections.freshKicker', { defaultValue: '✨ Neu freigeschaltet' })}
        </div>
        <div className="mt-1 text-lg font-extrabold text-slate-900">
          {t('newspaper.sections.freshTitle', { defaultValue: 'Öffne deine neuen Beiträge' })}
        </div>
      </div>

      <div className="text-xs font-semibold text-slate-600">
        {t('newspaper.sections.freshHint', { defaultValue: 'Wische nach rechts →' })}
      </div>
    </div>

    <div className="mt-3 flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
      {freshUnlocked.slice(0, 10).map((item, idx) => {
        const unlocked = unlockedMap.get(item.bonusId) ?? false;
        const seen = seenBonusIds.includes(item.bonusId);

        return (
          <MiniScrollerCard
            key={item.bonusId}
            item={item}
            unlocked={unlocked}
            seen={seen}
            tone={idx % 2 === 0 ? 'warm' : 'cool'}
            metaById={metaById}
          />
        );
      })}
    </div>
  </div>
) : null}




        {/* FEED */}
        <div id="feed" className="mt-7">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-extrabold text-slate-600">
                {t('newspaper.sections.feedKicker', { defaultValue: '📰 Feed' })}
              </div>
              <div className="mt-1 text-lg font-extrabold text-slate-900">
                {t('newspaper.sections.feedTitle', { defaultValue: 'Alle Beiträge' })}
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-600">
              {t('newspaper.sections.feedCount', {
                defaultValue: '{{count}} Beiträge',
                count: filteredItems.length,
              })}
            </div>
          </div>

          <div className="mt-3 space-y-4">
            {feed.map((item, idx) => {
              const unlocked = unlockedMap.get(item.bonusId) ?? false;
              const seen = seenBonusIds.includes(item.bonusId);

              return (
                <BlogRowCard
                  key={item.bonusId}
                  item={item}
                  unlocked={unlocked}
                  seen={seen}
                  flip={idx % 2 === 1}
                  metaById={metaById}
                />
              );
            })}
          </div>
        </div>

        <div className="h-10" />
      </div>
    </Layout>
  );
}

/* ---------- UI Pieces ---------- */

function StatPill({
  label,
  value,
  kind,
}: {
  label: string;
  value: string;
  kind: 'emerald' | 'amber' | 'sky';
}) {
  const tone =
    kind === 'emerald'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
      : kind === 'amber'
      ? 'bg-amber-50 border-amber-200 text-amber-900'
      : 'bg-sky-50 border-sky-200 text-sky-900';

  return (
    <div className={['inline-flex items-center gap-2 rounded-2xl border px-3 py-2', tone].join(' ')}>
      <div className="text-xs font-extrabold">{label}</div>
      <div className="text-xs font-extrabold">{value}</div>
    </div>
  );
}

function MiniScrollerCard({
  item,
  unlocked,
  seen,
  tone,
  metaById,
}: {
  item: BonusItem;
  unlocked: boolean;
  seen: boolean;
  tone: 'warm' | 'cool';
  metaById: Record<string, ArticleMetaLite>;
}) {
  const { t } = useTranslation('bonus');
  const [imgFailed, setImgFailed] = useState(false);

  const { title } = resolveTitleDesc(t, item, metaById);

  const locked = !unlocked;

  const bg =
    tone === 'warm'
      ? 'bg-gradient-to-br from-amber-50 via-white to-rose-50 border-amber-200'
      : 'bg-gradient-to-br from-sky-50 via-white to-violet-50 border-sky-200';

  const coverSrc = item.coverImage ? assetUrl(item.coverImage) : '';
  const fallback = pickFallbackEmoji(item);

  const audioHref = item.audioSrc ? assetUrl(item.audioSrc) : '';

  return (
    <Link
      to={unlocked ? `/newspaper/${item.bonusId}` : '/newspaper'}
      state={{ backTo: '/newspaper' }}
      className={[
        'block min-w-[220px] max-w-[220px] rounded-3xl border p-3 shadow-sm hover:shadow-md transition',
        bg,
        locked ? 'opacity-75 cursor-not-allowed' : '',
      ].join(' ')}
      aria-disabled={locked}
      onClick={(e) => {
        if (locked) e.preventDefault();
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-extrabold px-2 py-1 rounded-full border border-black/5 bg-white/70 text-slate-800">
          {mediaIcon(item)}{' '}
          {unlocked
            ? seen
              ? t('newspaper.badge.read', { defaultValue: 'Gelesen' })
              : t('newspaper.badge.new', { defaultValue: 'Neu' })
            : t('newspaper.badge.locked', { defaultValue: 'Gesperrt' })}
        </span>
        <span className="text-lg" aria-hidden>
          {unlocked ? '✨' : '🔒'}
        </span>
      </div>

      <div className="mt-2 w-full h-24 rounded-2xl border border-black/5 bg-white/70 flex items-center justify-center overflow-hidden relative">
        {item.coverImage && !imgFailed ? (
          <img
            src={coverSrc}
            alt=""
            className={['w-full h-full object-cover', locked ? 'opacity-60 blur-[1px]' : ''].join(' ')}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className={['text-3xl', locked ? 'opacity-60' : ''].join(' ')}>
            {fallback}
          </div>
        )}

        {locked && (
          <div className="absolute right-2 top-2 text-lg" aria-hidden>
            🔒
          </div>
        )}
      </div>

      <div className="mt-3 text-sm font-extrabold text-slate-900 line-clamp-2">{title}</div>

      <div className="mt-2">
        {item.mediaType === 'audio' && item.audioSrc && unlocked ? (
          <>
            <audio controls className="w-full">
              <source src={audioHref} />
            </audio>
            <a
              href={audioHref}
              className="mt-2 inline-flex text-xs font-extrabold text-slate-800 hover:underline"
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {t('newspaper.play', { defaultValue: 'Abspielen in neuem Tab →' })}
            </a>
          </>
        ) : (
          <div className="text-xs font-semibold text-slate-700">
            {unlocked
              ? t('newspaper.open', { defaultValue: 'Öffnen →' })
              : t('newspaper.lockHint', { defaultValue: 'Weiterlesen →' })}
          </div>
        )}
      </div>
    </Link>
  );
}

function BlogRowCard({
  item,
  unlocked,
  seen,
  flip,
  metaById,
}: {
  item: BonusItem;
  unlocked: boolean;
  seen: boolean;
  flip: boolean;
  metaById: Record<string, ArticleMetaLite>;
}) {
  const { t } = useTranslation('bonus');
  const [imgFailed, setImgFailed] = useState(false);

  const { title, desc } = resolveTitleDesc(t, item, metaById);

  const locked = !unlocked;

  const coverSrc = item.coverImage ? assetUrl(item.coverImage) : '';
  const fallback = pickFallbackEmoji(item);
  const audioHref = item.audioSrc ? assetUrl(item.audioSrc) : '';

  const badge = !unlocked
    ? `🔒 ${t('newspaper.badge.locked', { defaultValue: 'Gesperrt' })}`
    : seen
    ? `✓ ${t('newspaper.badge.read', { defaultValue: 'Gelesen' })}`
    : `✨ ${t('newspaper.badge.new', { defaultValue: 'Neu' })}`;

  return (
    <div className={['rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden', locked ? 'opacity-80' : ''].join(' ')}>
      <div className={['p-4 flex flex-col sm:flex-row gap-4', flip ? 'sm:flex-row-reverse' : ''].join(' ')}>
        <div className="sm:w-[220px] w-full">
          <div className="w-full h-36 rounded-3xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative">
            {item.coverImage && !imgFailed ? (
              <img
                src={coverSrc}
                alt=""
                className={['w-full h-full object-cover', locked ? 'opacity-60 blur-[1px]' : ''].join(' ')}
                loading="lazy"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className={['text-5xl', locked ? 'opacity-60' : ''].join(' ')}>
                {fallback}
              </div>
            )}

            {locked && (
              <div className="absolute right-3 top-3 text-xl" aria-hidden>
                🔒
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] font-extrabold px-2 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-800">
              {badge}
            </span>

            <span className="text-[11px] font-extrabold px-2 py-1 rounded-full border border-slate-200 bg-white text-slate-800">
              {mediaIcon(item)} {formatLabel(t, item)}
            </span>

            {(item.topicTags ?? []).slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-extrabold px-2 py-1 rounded-full border border-slate-200 bg-white text-slate-700"
              >
                {topicIcon(tag)} {prettyTopic(t, tag)}
              </span>
            ))}
          </div>

          <div className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">{title}</div>
          {desc ? <div className="mt-2 text-sm text-slate-700">{desc}</div> : null}

          <div className="mt-4">
            {item.mediaType === 'audio' && item.audioSrc && unlocked ? (
              <>
                <audio controls className="w-full">
                  <source src={audioHref} />
                </audio>
                <a
                  href={audioHref}
                  className="mt-2 inline-flex text-sm font-extrabold text-slate-900 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('newspaper.play', { defaultValue: 'Abspielen in neuem Tab →' })}
                </a>
              </>
            ) : unlocked ? (
              <Link
                to={`/newspaper/${item.bonusId}`}
                state={{ backTo: '/newspaper' }}
                className="inline-flex text-sm font-extrabold text-slate-900 hover:underline"
              >
                {t('newspaper.readMore', { defaultValue: 'Weiterlesen →' })}
              </Link>
            ) : (
              <div className="text-sm text-slate-700">
                {t('newspaper.lockHint', { defaultValue: 'Lies weiter in der Story, um das freizuschalten.' })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
