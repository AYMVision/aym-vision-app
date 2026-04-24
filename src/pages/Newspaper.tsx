// src/pages/Newspaper.tsx
// Schülerzeitung (Bonusbereich für Kinder)
// Neu aufgebaut:
// - bunter Hero mit echtem Bild
// - "Für dich freigeschaltet" direkt unter Hero
// - Sonderrubrik "Aktuelle Nachrichten"
// - Themen + Suche + Formatfilter in EINER Kachel
// - kleinere Kacheln / kompakterer Feed
// - Unlock / Neu / Gelesen / Gesperrt klar sichtbar

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { assetUrl } from '../common/assetUrl';
import { cn } from '../common/utils';
import SmartImage from '../components/SmartImage';

import { useProfile } from '../profile/useProfile';
import MiniAudioPlayer from '../components/MiniAudioPlayer';
import { BONUS_INDEX, type BonusItem } from '../bonus/bonusIndex';
import { isBonusUnlocked, type BonusProgressSnapshot } from '../bonus/bonusUnlock';
import { loadSeenBonusIds } from '../bonus/bonusSeen';
import { parseFrontmatter } from '../bonus/mdFrontmatter';

type LocationState = { backTo?: string } | null;

function normalizeLang(lang: string | undefined): 'de' | 'en' {
  const l = (lang ?? 'de').toLowerCase();
  return l.startsWith('en') ? 'en' : 'de';
}

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

  for (const [key, done] of Object.entries(completed)) {
    if (!done) continue;
    const parts = key.split(':');
    if (parts.length !== 3) continue;

    const episodeId = parts[1];
    const match = /^c(\d{2})$/.exec(parts[2]);
    if (!match) continue;

    seen.add(`${episodeId}c${match[1]}`);
  }

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

function chipStyle(active: boolean) {
  return active
    ? 'bg-[var(--color-teal-600)] text-white border-[var(--color-teal-600)]'
    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
}

type ArticleMetaLite = { title?: string; description?: string; date?: string };

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
            let res = await fetch(`/${it.bodySrc}.${lang}.md`);
            if (!res.ok) res = await fetch(`/${it.bodySrc}.md`);
            if (!res.ok) return;
            const text = await res.text();
            const fm = parseFrontmatter(text);
            next[it.bonusId] = {
              title: fm.meta.title,
              description: fm.meta.description,
              date: fm.meta.date,
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

function isoWeek(dateStr: string): number | null {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  // Thursday of the current week determines the year → ISO 8601
  const thu = new Date(d);
  thu.setDate(d.getDate() + (4 - (d.getDay() || 7)));
  const yearStart = new Date(thu.getFullYear(), 0, 1);
  return Math.ceil(((thu.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function isCurrentNewsItem(item: BonusItem) {
  const id = item.bonusId.toLowerCase();
  return id.includes('current-news') || id.includes('chioma-news') || id.includes('weekly-news');
}

function stateTone(unlocked: boolean, seen: boolean) {
  if (!unlocked) {
    return {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      border: 'border-slate-200',
      label: 'locked',
      emoji: '🔒',
    };
  }
  if (seen) {
    return {
      badge: 'bg-sky-50 text-sky-900 border-sky-200',
      border: 'border-sky-200',
      label: 'read',
      emoji: '✓',
    };
  }
  return {
    badge: 'bg-amber-50 text-amber-900 border-amber-200',
    border: 'border-amber-200',
    label: 'new',
    emoji: '✨',
  };
}

/* ---------- UI Helpers ---------- */

function Panel({
  title,
  kicker,
  right,
  children,
}: {
  title: string;
  kicker?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          {kicker ? (
            <div className="text-xs font-semibold text-[var(--color-teal-600)]">{kicker}</div>
          ) : null}
          <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
            {title}
          </h2>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

function SwipeRow({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const st = useRef({
    down: false,
    dragged: false,
    x: 0,
    left: 0,
    pointerId: -1,
  });

  const isInteractiveTarget = (target: EventTarget | null) => {
    const el = target as HTMLElement | null;
    if (!el) return false;
    return Boolean(el.closest('button, a, input, textarea, select, label, audio'));
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex gap-3 overflow-x-auto pb-2',
        'snap-x snap-mandatory items-stretch',
        'touch-pan-x select-none',
        '[&::-webkit-scrollbar]:hidden',
        className
      )}
      onPointerDown={(e) => {
        const el = ref.current;
        if (!el) return;
        if (isInteractiveTarget(e.target)) return;

        st.current.down = true;
        st.current.dragged = false;
        st.current.x = e.clientX;
        st.current.left = el.scrollLeft;
        st.current.pointerId = e.pointerId;

        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || !st.current.down) return;

        const dx = e.clientX - st.current.x;

        if (!st.current.dragged && Math.abs(dx) > 8) {
          st.current.dragged = true;
        }

        if (st.current.dragged) {
          el.scrollLeft = st.current.left - dx;
        }
      }}
      onPointerUp={() => {
        st.current.down = false;
        st.current.pointerId = -1;
        window.setTimeout(() => {
          st.current.dragged = false;
        }, 0);
      }}
      onPointerCancel={() => {
        st.current.down = false;
        st.current.dragged = false;
        st.current.pointerId = -1;
      }}
      onClickCapture={(e) => {
        if (st.current.dragged) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {children}
    </div>
  );
}

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
    <div className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-2', tone)}>
      <div className="text-xs font-extrabold">{label}</div>
      <div className="text-xs font-extrabold">{value}</div>
    </div>
  );
}

function TopicButton({
  id,
  active,
  count,
  onClick,
}: {
  id: TopicId;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  const { t } = useTranslation('bonus');

  return (
    <button
      type="button"
      onClick={onClick}
className={cn(
  'rounded-2xl border p-2.5 sm:p-3 text-left transition shadow-sm hover:shadow-md active:scale-[0.99]',
  active
    ? 'border-[var(--color-teal-300)] bg-[var(--color-teal-50)] ring-2 ring-[var(--color-teal-100)]'
    : id === 'infoCheck'
      ? 'border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-50 hover:border-sky-300'
      : id === 'teamTalk'
        ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 hover:border-emerald-300'
        : id === 'create'
          ? 'border-rose-200 bg-gradient-to-br from-rose-50 via-white to-pink-50 hover:border-rose-300'
          : id === 'safe'
            ? 'border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 hover:border-violet-300'
            : id === 'solve'
              ? 'border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50 hover:border-amber-300'
              : id === 'reflect'
                ? 'border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-sky-50 hover:border-cyan-300'
                : 'border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 hover:border-orange-300'
)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-lg sm:text-xl">{topicIcon(id)}</div>
        <div className="text-[10px] sm:text-[11px] font-extrabold text-slate-500">{count}</div>
      </div>
      <div className="mt-2 text-[11px] sm:text-[12px] font-extrabold text-slate-900 leading-snug">
        {prettyTopic(t, id)}
      </div>
    </button>
  );
}

function FreshCard({
  item,
  unlocked,
  seen,
  metaById,
}: {
  item: BonusItem;
  unlocked: boolean;
  seen: boolean;
  metaById: Record<string, ArticleMetaLite>;
}) {
  const { t } = useTranslation('bonus');
  const location = useLocation();
  const [imgFailed, setImgFailed] = useState(false);

  const { title } = resolveTitleDesc(t, item, metaById);
  const tone = stateTone(unlocked, seen);
  const coverSrc = item.coverImage ? assetUrl(item.coverImage) : '';
  const fallback = pickFallbackEmoji(item);

  const badgeText = !unlocked
    ? t('newspaper.badge.locked', { defaultValue: 'Gesperrt' })
    : seen
      ? t('newspaper.badge.read', { defaultValue: 'Gelesen' })
      : t('newspaper.badge.new', { defaultValue: 'Neu' });

  return (
    <Link
      to={unlocked ? `/newspaper/${item.bonusId}` : '/newspaper'}
      state={{ backTo: '/newspaper', backgroundLocation: location }}
      className={cn(
        'block snap-start shrink-0 w-[68%] sm:w-[38%] lg:w-[220px]',
        !unlocked && 'cursor-not-allowed'
      )}
      aria-disabled={!unlocked}
      onClick={(e) => {
        if (!unlocked) e.preventDefault();
      }}
    >
<div
  className={cn(
    'h-full rounded-2xl border shadow-sm p-3 flex flex-col',
    tone.border,
    !unlocked && 'opacity-85',
    item.mediaType === 'audio'
      ? 'bg-gradient-to-br from-sky-50 via-white to-violet-50'
      : item.mediaType === 'link'
        ? 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'
        : 'bg-gradient-to-br from-amber-50 via-white to-rose-50'
  )}
>
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-1 text-[10px] font-extrabold border',
              tone.badge
            )}
          >
            {tone.emoji} {badgeText}
          </span>
          <span className="text-sm">{mediaIcon(item)}</span>
        </div>

        <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-24 relative flex items-center justify-center">
          {item.coverImage && !imgFailed ? (
            <img
              src={coverSrc}
              alt=""
              className={cn('w-full h-full object-cover', !unlocked && 'opacity-60 blur-[1px]')}
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className={cn('text-3xl', !unlocked && 'opacity-60')}>{fallback}</div>
          )}
        </div>

        <div className="mt-3 text-sm font-extrabold text-slate-900 leading-snug line-clamp-2">
          {title}
        </div>
      </div>
    </Link>
  );
}

function CurrentNewsCard({
  item,
  metaById,
}: {
  item: BonusItem;
  metaById: Record<string, ArticleMetaLite>;
}) {
  const { t } = useTranslation('bonus');
  const location = useLocation();
  const [imgFailed, setImgFailed] = useState(false);

  const { title, desc } = resolveTitleDesc(t, item, metaById);
  const coverSrc = item.coverImage ? assetUrl(item.coverImage) : '';
  const fallback = pickFallbackEmoji(item);
  const isAudio = item.mediaType === 'audio';
  const audioHref = item.audioSrc ? assetUrl(item.audioSrc) : '';
  const kwNum = metaById[item.bonusId]?.date ? isoWeek(metaById[item.bonusId].date!) : null;

  return (
    <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-amber-50 shadow-sm overflow-hidden hover:shadow-md transition">
      <Link to={`/newspaper/${item.bonusId}`} state={{ backTo: '/newspaper', backgroundLocation: location }} className="block p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="inline-flex items-center rounded-full px-2 py-1 text-[10px] sm:text-[11px] font-extrabold border border-rose-200 bg-white text-rose-700">
            {isAudio ? '🎧' : '📰'} {isAudio
              ? t('newspaper.format.audio', { defaultValue: 'Audio' })
              : t('newspaper.format.text', { defaultValue: 'Text' })}
          </span>
          <span className="inline-flex items-center rounded-full px-2 py-1 text-[10px] sm:text-[11px] font-extrabold border border-amber-200 bg-amber-50 text-amber-900">
            ✨ Für alle frei
          </span>
          <span className="inline-flex items-center rounded-full px-2 py-1 text-[10px] sm:text-[11px] font-extrabold border border-slate-200 bg-white text-slate-700">
            🗞️ Chioma
          </span>
          {kwNum ? (
            <span className="inline-flex items-center rounded-full px-2 py-1 text-[10px] sm:text-[11px] font-extrabold border border-slate-200 bg-white text-slate-500">
              KW {kwNum}
            </span>
          ) : null}
        </div>

        <div className="mt-3 grid grid-cols-[92px_1fr] sm:grid-cols-[120px_1fr] gap-3 sm:gap-4 items-start">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white h-[92px] sm:h-[110px] relative flex items-center justify-center">
            {item.coverImage && !imgFailed ? (
              <img
                src={coverSrc}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className="text-4xl">{fallback}</div>
            )}
          </div>

          <div className="min-w-0">
            <div className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 line-clamp-2">
              {title}
            </div>
            {desc ? (
              <div className="mt-1 text-xs sm:text-sm text-slate-700 line-clamp-3">{desc}</div>
            ) : null}

            {!isAudio ? (
              <div className="mt-3 text-sm font-extrabold text-slate-900">
                {t('newspaper.readMore', { defaultValue: 'Weiterlesen →' })}
              </div>
            ) : null}
          </div>
        </div>
      </Link>

      {isAudio && audioHref ? (
        <div className="px-4 pb-4">
          <div className="max-w-xs rounded-2xl border border-slate-200 bg-white p-3">
            <MiniAudioPlayer src={audioHref} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FeedCard({
  item,
  unlocked,
  seen,
  metaById,
}: {
  item: BonusItem;
  unlocked: boolean;
  seen: boolean;
  metaById: Record<string, ArticleMetaLite>;
}) {
  const { t } = useTranslation('bonus');
  const location = useLocation();
  const [imgFailed, setImgFailed] = useState(false);

  const { title, desc } = resolveTitleDesc(t, item, metaById);
  const tone = stateTone(unlocked, seen);

  const coverSrc = item.coverImage ? assetUrl(item.coverImage) : '';
  const fallback = pickFallbackEmoji(item);
  const audioHref = item.audioSrc ? assetUrl(item.audioSrc) : '';

  const badgeText = !unlocked
    ? t('newspaper.badge.locked', { defaultValue: 'Gesperrt' })
    : seen
      ? t('newspaper.badge.read', { defaultValue: 'Gelesen' })
      : t('newspaper.badge.new', { defaultValue: 'Neu' });

  const CardShell = ({ children }: { children: React.ReactNode }) =>
    unlocked ? (
      <Link to={`/newspaper/${item.bonusId}`} state={{ backTo: '/newspaper', backgroundLocation: location }} className="block">
        {children}
      </Link>
    ) : (
      <div>{children}</div>
    );

  return (
    <CardShell>
<div
  className={cn(
    'rounded-2xl border shadow-sm overflow-hidden transition',
    tone.border,
    unlocked ? 'hover:shadow-md' : 'opacity-85',
    item.mediaType === 'audio'
      ? 'bg-gradient-to-br from-sky-50 via-white to-violet-50'
      : item.mediaType === 'link'
        ? 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'
        : 'bg-gradient-to-br from-amber-50 via-white to-rose-50'
  )}
>
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-[84px_1fr] sm:grid-cols-[104px_1fr] gap-3 items-start">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-[84px] sm:h-[98px] relative flex items-center justify-center">
              {item.coverImage && !imgFailed ? (
                <img
                  src={coverSrc}
                  alt=""
                  className={cn('w-full h-full object-cover', !unlocked && 'opacity-60 blur-[1px]')}
                  loading="lazy"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <div className={cn('text-4xl', !unlocked && 'opacity-60')}>{fallback}</div>
              )}

              {!unlocked ? <div className="absolute inset-0 bg-white/20 pointer-events-none" /> : null}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap gap-2 items-center">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2 py-1 text-[10px] font-extrabold border',
                    tone.badge
                  )}
                >
                  {tone.emoji} {badgeText}
                </span>

                <span className="inline-flex items-center rounded-full px-2 py-1 text-[10px] font-extrabold border border-slate-200 bg-white text-slate-700">
                  {mediaIcon(item)} {formatLabel(t, item)}
                </span>
              </div>

              <div className="mt-2 text-sm font-extrabold tracking-tight text-slate-900 line-clamp-2">
                {title}
              </div>

              {desc ? <div className="mt-1 text-xs text-slate-700 line-clamp-2">{desc}</div> : null}

              <div className="mt-2 flex flex-wrap gap-2">
                {(item.topicTags ?? []).slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold border border-slate-200 bg-slate-50 text-slate-700"
                  >
                    {topicIcon(tag)} {prettyTopic(t, tag)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {item.mediaType === 'audio' && audioHref && unlocked ? (
              <MiniAudioPlayer src={audioHref} />
            ) : unlocked ? (
              <div className="text-sm font-extrabold text-slate-900">
                {t('newspaper.readMore', { defaultValue: 'Weiterlesen →' })}
              </div>
            ) : (
              <div className="text-sm text-slate-700">
                {t('newspaper.lockHint', {
                  defaultValue: 'Lies weiter in der Story, um das freizuschalten.',
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function NewspaperHero({
  title,
  subtitle,
  unlockedText,
  freshText,
  readText,
}: {
  title: string;
  subtitle: string;
  unlockedText: string;
  freshText: string;
  readText: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-200 via-violet-100 to-amber-100 px-4 py-5 shadow-md border border-white/40">
      <div className="pointer-events-none absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
      <div className="pointer-events-none absolute top-6 right-4 w-20 h-20 rounded-full bg-yellow-300/30 blur-xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 w-24 h-24 rounded-full bg-pink-300/20 blur-xl" />

      <div className="relative">
        <div>
          <div className="text-xs font-extrabold text-slate-700">📰 Newsroom</div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {title}
          </h1>

          <p className="mt-1 text-sm text-slate-800 max-w-md">
            {subtitle}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70">
              {unlockedText}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70">
              {freshText}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70">
              {readText}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
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
  for (const it of allItems) {
    m.set(it.bonusId, isCurrentNewsItem(it) ? true : isBonusUnlocked(it, progress));
  }
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

  const currentNewsItems = useMemo(() => {
    return allItems.filter(isCurrentNewsItem);
  }, [allItems]);

  const regularItems = useMemo(() => {
    return allItems.filter((item) => !isCurrentNewsItem(item));
  }, [allItems]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    return regularItems.filter((item) => {
      if (format !== 'all' && item.mediaType !== format) return false;
      if (topic !== 'all' && !(item.topicTags ?? []).includes(topic)) return false;

      if (!q) return true;

      const { title, desc } = resolveTitleDesc(t, item, metaById);
      const blob = `${title} ${desc} ${(item.topicTags ?? []).join(' ')} ${item.mediaType}`.toLowerCase();
      return blob.includes(q);
    });
  }, [regularItems, format, topic, query, t, metaById]);

  const stats = useMemo(() => {
    let total = 0;
    let unlocked = 0;
    let read = 0;
    let fresh = 0;

    for (const it of regularItems) {
      total++;
      const u = unlockedMap.get(it.bonusId) ?? false;
      if (u) unlocked++;
      const s = seenBonusIds.includes(it.bonusId);
      if (s) read++;
      if (u && !s) fresh++;
    }
    return { total, unlocked, read, fresh };
  }, [regularItems, unlockedMap, seenBonusIds]);

  const freshUnlocked = useMemo(() => {
    return regularItems.filter(
      (it) => (unlockedMap.get(it.bonusId) ?? false) && !seenBonusIds.includes(it.bonusId)
    );
  }, [regularItems, unlockedMap, seenBonusIds]);

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
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-3 py-6 sm:py-10 space-y-6 mx-auto">
        <NewspaperHero
  title={t('newspaper.headline', { defaultValue: 'Unsere Schülerzeitung' })}
  subtitle={t('newspaper.subtitle', {
    defaultValue: 'Artikel, Audio & Meinungen aus der Story',
  })}
  unlockedText={`${t('newspaper.stats.unlocked', { defaultValue: 'Freigeschaltet' })}: ${stats.unlocked}/${stats.total}`}
  freshText={`${t('newspaper.stats.new', { defaultValue: 'Neu' })}: ${stats.fresh}`}
  readText={`${t('newspaper.stats.read', { defaultValue: 'Gelesen' })}: ${stats.read}`}
/>


        {/* FRESH UNLOCKED */}
        {freshUnlocked.length > 0 ? (
          <Panel
            kicker={t('newspaper.sections.freshKicker', { defaultValue: '✨ Neu freigeschaltet' })}
            title={t('newspaper.sections.freshTitle', { defaultValue: 'Für dich freigeschaltet' })}
            right={
              <div className="text-xs font-semibold text-slate-500">
                {t('newspaper.sections.freshHint', { defaultValue: 'Wische nach rechts →' })}
              </div>
            }
          >
            <SwipeRow className="-mx-4 px-4 lg:mx-0 lg:px-0">
              {freshUnlocked.slice(0, 10).map((item) => {
                const unlocked = unlockedMap.get(item.bonusId) ?? false;
                const seen = seenBonusIds.includes(item.bonusId);

                return (
                  <FreshCard
                    key={item.bonusId}
                    item={item}
                    unlocked={unlocked}
                    seen={seen}
                    metaById={metaById}
                  />
                );
              })}
            </SwipeRow>
          </Panel>
        ) : null}

        {/* CURRENT NEWS */}
        <Panel
          kicker="🗞️ Aktuelle Nachrichten"
          title="Chiomas aktuelle Themen"
          right={
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold border border-amber-200 bg-amber-50 text-amber-900">
              Für alle frei
            </span>
          }
        >
          <div className="text-sm text-slate-700">
            Einmal pro Woche gibt es hier einen aktuellen Beitrag von Chioma zu Themen, über die gerade viele sprechen.
          </div>

          {currentNewsItems.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentNewsItems.map((item) => (
                <CurrentNewsCard key={item.bonusId} item={item} metaById={metaById} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Hier erscheint bald Chiomas erster aktueller Beitrag.
            </div>
          )}
        </Panel>

        {/* TOPICS + SEARCH + FILTERS */}
        <Panel
          kicker={t('newspaper.sections.topicsKicker', { defaultValue: '🏷️ Themen' })}
          title={t('newspaper.sections.topicsTitle', { defaultValue: 'Such dir dein Thema aus' })}
        >
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-[var(--color-teal-50)] p-4">
            <div className="text-sm text-slate-700">
              {t('newspaper.sections.topicsHint', {
                defaultValue: 'Tippe auf ein Thema oder suche nach Beiträgen.',
              })}
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              <button
                type="button"
                onClick={() => setTopic('all')}
                className={cn(
                  'rounded-2xl border p-2.5 text-left transition shadow-sm hover:shadow-md active:scale-[0.99]',
                  topic === 'all'
                    ? 'border-[var(--color-teal-300)] bg-[var(--color-teal-50)] ring-2 ring-[var(--color-teal-100)]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-lg">🗂️</div>
                  <div className="text-[10px] font-extrabold text-slate-500">{stats.total}</div>
                </div>
                <div className="mt-2 text-[11px] font-extrabold text-slate-900 leading-snug">
                  {t('newspaper.topics.all', { defaultValue: 'Alle Themen' })}
                </div>
              </button>

              {TOPICS.map((id) => (
                <TopicButton
                  key={id}
                  id={id}
                  count={topicsWithCounts[id] ?? 0}
                  active={topic === id}
                  onClick={() => setTopic(id)}
                />
              ))}
            </div>

            <div className="mt-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                placeholder={t('newspaper.searchPlaceholder', { defaultValue: 'Suche…' })}
                aria-label={t('newspaper.searchAria', { defaultValue: 'Artikel suchen' })}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {(['all', 'text', 'audio', 'link'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFormat(k)}
                  className={cn(
                    'px-3 py-2 rounded-2xl border text-xs font-extrabold transition',
                    chipStyle(format === k)
                  )}
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
        </Panel>

        {/* FEED */}
        <Panel
          kicker={t('newspaper.sections.feedKicker', { defaultValue: '📰 Feed' })}
          title={t('newspaper.sections.feedTitle', { defaultValue: 'Alle Beiträge' })}
          right={
            <div className="text-xs font-semibold text-slate-500">
              {t('newspaper.sections.feedCount', {
                defaultValue: '{{count}} Beiträge',
                count: filteredItems.length,
              })}
            </div>
          }
        >
          {feed.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              Keine passenden Beiträge gefunden.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {feed.map((item) => {
                const unlocked = unlockedMap.get(item.bonusId) ?? false;
                const seen = seenBonusIds.includes(item.bonusId);

                return (
                  <FeedCard
                    key={item.bonusId}
                    item={item}
                    unlocked={unlocked}
                    seen={seen}
                    metaById={metaById}
                  />
                );
              })}
            </div>
          )}
        </Panel>

        <div className="h-6" />
      </div>
    </Layout>
  );
}