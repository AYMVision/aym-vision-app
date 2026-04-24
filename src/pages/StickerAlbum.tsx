// src/pages/StickerAlbum.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { TFunction } from 'i18next';
import Layout from '../components/Layout';
import { useProfile } from '../profile/useProfile';
import { CONTENT_INDEX } from '../content/contentIndex';
import { loadSeenStickers, markStickerSeen } from '../progress/stickerSeen';
import { assetUrl } from '../common/assetUrl';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import SmartImage, { type SrcCandidate } from '../components/SmartImage';
import {
  MILESTONE_STICKERS,
  STREAK_STICKERS,
  THEME_STICKERS,
  type StickerDef,
} from '../progress/rewardCatalog';
import { THEME_META, THEME_ORDER } from '../competencies/themeMeta';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function isAbsoluteish(v?: string) {
  if (!v) return false;
  return v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/') || v.startsWith('data:');
}

function toPublicUrl(path: string) {
  return isAbsoluteish(path) ? path : assetUrl(path);
}

function episodeKey(seasonId: string, episodeId: string) {
  return `${seasonId}:${episodeId}`;
}

function buildCandidates(src: string): { avif?: SrcCandidate[]; webp?: SrcCandidate[]; fallback: string } {
  const url = toPublicUrl(src);
  if (!src?.trim()) return { fallback: '' };
  if (isAbsoluteish(src) && !src.includes('/media/')) return { fallback: url };

  const raw = src;
  const has512 = raw.includes('-512.');
  const has1024 = raw.includes('-1024.');
  const mk = (p: string) => toPublicUrl(p);

  if (has1024) {
    const base = raw.replace(/-1024\.(webp|avif|png|jpg|jpeg)$/i, '');
    return {
      avif: [{ src: mk(`${base}-512.avif`), w: 512 }, { src: mk(`${base}-1024.avif`), w: 1024 }],
      webp: [{ src: mk(`${base}-512.webp`), w: 512 }, { src: mk(`${base}-1024.webp`), w: 1024 }],
      fallback: mk(`${base}-1024.webp`),
    };
  }
  if (has512) {
    const base = raw.replace(/-512\.(webp|avif|png|jpg|jpeg)$/i, '');
    return {
      avif: [{ src: mk(`${base}-512.avif`), w: 512 }, { src: mk(`${base}-1024.avif`), w: 1024 }],
      webp: [{ src: mk(`${base}-512.webp`), w: 512 }, { src: mk(`${base}-1024.webp`), w: 1024 }],
      fallback: mk(`${base}-512.webp`),
    };
  }
  return { fallback: url };
}

function stickerTitle(t: TFunction, sticker: StickerDef) {
  if (sticker.titleKey) {
    return t(sticker.titleKey, { ns: 'stickers', defaultValue: sticker.title ?? sticker.id });
  }
  return sticker.title ?? sticker.id;
}

function getNextThemeStickerInfo(stickers: StickerDef[], themePoints: number) {
  const sorted = [...stickers].sort((a, b) => (a.themeLevel ?? 0) - (b.themeLevel ?? 0));
  const nextSticker = sorted.find(
    (s) => themePoints < (s.themeThreshold ?? Number.POSITIVE_INFINITY)
  );

  if (!nextSticker) {
    return {
      earnedCount: sorted.length,
      nextThreshold: null as number | null,
      remaining: 0,
      pct: 100,
    };
  }

  const earnedCount = sorted.filter(
    (s) => themePoints >= (s.themeThreshold ?? Number.POSITIVE_INFINITY)
  ).length;

  const prevSticker = sorted.find((s) => (s.themeLevel ?? 0) === ((nextSticker.themeLevel ?? 1) - 1));
  const prevThreshold = prevSticker?.themeThreshold ?? 0;
  const nextThreshold = nextSticker.themeThreshold ?? 0;

  const rangeSize = Math.max(1, nextThreshold - prevThreshold);
  const progressInRange = Math.max(0, Math.min(themePoints - prevThreshold, rangeSize));
  const pct = Math.max(0, Math.round((progressInRange / rangeSize) * 100));

  return {
    earnedCount,
    nextThreshold,
    remaining: Math.max(0, nextThreshold - themePoints),
    pct,
  };
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────

function SectionHeader({
  emoji,
  title,
  count,
  total,
}: {
  emoji: string;
  title: string;
  count: number;
  total: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-white border border-white/80 shadow-sm flex items-center justify-center text-xl">
          <span aria-hidden>{emoji}</span>
        </div>
        <div className="text-sm sm:text-base font-extrabold text-slate-900">{title}</div>
      </div>

      <div className="px-3 py-1.5 rounded-full bg-white/90 border border-white shadow-sm text-xs font-bold text-slate-600">
        {count}/{total}
      </div>
    </div>
  );
}

// ─── THEME ROW ────────────────────────────────────────────────────────────────

function ThemeRow({
  themeId,
  stickers,
  themePoints,
  seen,
  onSeen,
}: {
  themeId: string;
  stickers: StickerDef[];
  themePoints: number;
  seen: Record<string, true>;
  onSeen: (id: string) => void;
}) {
  const { t: tThemes } = useTranslation('themes');
  const { t: tStickers } = useTranslation('stickers');
  const meta = THEME_META[themeId as keyof typeof THEME_META];
  if (!meta) return null;

  const sorted = [...stickers].sort((a, b) => (a.themeLevel ?? 0) - (b.themeLevel ?? 0));
  const { earnedCount, nextThreshold, remaining, pct } = getNextThemeStickerInfo(sorted, themePoints);

  return (
    <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white via-slate-50 to-sky-50 shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xl shrink-0">
            <span aria-hidden>{meta.emoji}</span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-slate-900 truncate">
              {tThemes(meta.childLabelKey, { defaultValue: themeId })}
            </div>
            <div className="text-xs text-slate-500">
              {tStickers('album.collected', {
                defaultValue: '{{count}} von 3 Stickern gesammelt',
                count: earnedCount,
              })}
            </div>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-white border border-slate-100 text-[11px] font-bold text-slate-500 shrink-0">
          {earnedCount}/3
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:gap-4 mb-4">
        {sorted.map((s) => {
          const earned = themePoints >= (s.themeThreshold ?? Number.POSITIVE_INFINITY);
          const isNew = earned && !seen[s.id];
          return (
            <ThemeStickerCircle
              key={s.id}
              sticker={s}
              earned={earned}
              isNew={isNew}
              onSeen={onSeen}
            />
          );
        })}
      </div>

      {earnedCount < sorted.length ? (
        <div className="rounded-2xl bg-white/80 border border-slate-100 px-3 py-3">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            {tStickers('album.nextRewardSimple', {
              defaultValue: 'Noch {{count}} bis zum nächsten Sticker',
              count: remaining,
            })}
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-teal-400 via-sky-400 to-violet-400 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-3 py-3 text-xs font-bold text-emerald-700">
          {tStickers('album.allStagesDone', { defaultValue: 'Alle Sticker für dieses Thema geschafft!' })}
        </div>
      )}
    </div>
  );
}

function ThemeStickerCircle({
  sticker,
  earned,
  isNew,
  onSeen,
}: {
  sticker: StickerDef;
  earned: boolean;
  isNew: boolean;
  onSeen: (id: string) => void;
}) {
  const { t } = useTranslation('stickers');
  const [reveal, setReveal] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (!isNew) return;
    setReveal(false);
    const t1 = window.setTimeout(() => setReveal(true), 80);
    const t2 = window.setTimeout(() => onSeen(sticker.id), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isNew, sticker.id, onSeen]);

  useEffect(() => {
    setImgFailed(false);
  }, [sticker.image]);

  const candidates = buildCandidates(sticker.image);
  const title = stickerTitle(t, sticker);

  return (
    <div className="relative flex-1 max-w-[150px]" title={title}>
      <div
        className={[
          'relative aspect-square rounded-3xl border overflow-hidden flex items-center justify-center shadow-sm transition-all duration-300',
          earned
            ? 'border-teal-200 bg-white'
            : 'border-slate-200 bg-slate-100',
        ].join(' ')}
      >
        {!imgFailed && sticker.image ? (
          <SmartImage
            alt={title}
            className={[
              'w-full h-full object-contain p-0 sm:p-0.5 transition duration-700',
              earned ? 'opacity-100' : 'opacity-[0.16] grayscale',
              isNew && !reveal ? 'scale-75 opacity-60' : '',
              isNew && reveal ? 'animate-[pop_700ms_cubic-bezier(0.2,1,0.2,1)]' : '',
            ].join(' ')}
            avif={candidates.avif}
            webp={candidates.webp}
            fallback={candidates.fallback}
            onError={() => setImgFailed(true)}
            loading="lazy"
            decoding="async"
            sizes="(min-width: 640px) 88px, 26vw"
          />
        ) : (
          <span className={['text-3xl', earned ? '' : 'opacity-20'].join(' ')} aria-hidden>
            {earned ? '⭐' : '?'}
          </span>
        )}

        {!earned && (
          <div className="absolute inset-0 bg-white/10" />
        )}
      </div>

      <div
        className={[
          'absolute -bottom-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 rounded-full text-[10px] font-extrabold flex items-center justify-center border-2 shadow-sm',
          earned
            ? 'bg-teal-500 text-white border-white'
            : 'bg-slate-300 text-slate-600 border-white',
        ].join(' ')}
      >
        {sticker.themeLevel}
      </div>

      {isNew && (
        <>
          <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
          <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-emerald-400" />
        </>
      )}
    </div>
  );
}

// ─── STICKER GRID (Meilensteine / Streak) ─────────────────────────────────────

function StickerGrid({
  stickers,
  earnedStickers,
  seen,
  onSeen,
}: {
  stickers: StickerDef[];
  earnedStickers: Record<string, boolean>;
  seen: Record<string, true>;
  onSeen: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {stickers.map((s) => (
        <StickerTile
          key={s.id}
          sticker={s}
          earned={!!earnedStickers[s.id]}
          seen={!!seen[s.id]}
          onSeen={onSeen}
        />
      ))}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function StickerAlbum() {
  const { profile } = useProfile();
  const location = useLocation();
  const backTo = (location.state as { backTo?: string } | null)?.backTo;

  const { t: tStories } = useTranslation('stories');

  const earnedStickers = profile.progress?.earnedStickers ?? {};
  const earnedBadges = profile.progress?.earnedBadges ?? {};
  const themePoints = profile.progress?.themePoints ?? {};

  const isEarned = (id: string) => !!earnedStickers[id] || !!earnedBadges[id];

  const [seen, setSeen] = useState<Record<string, true>>(() => loadSeenStickers());

  const handleSeen = useCallback((id: string) => {
    markStickerSeen(id);
    setSeen((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: true };
    });
  }, []);

  const seasons = useMemo(() =>
    CONTENT_INDEX.map((s) => ({
      seasonId: s.seasonId,
      title: s.seasonTitle,
      img: s.badgeImage ?? '',
    })), []);

  const allEpisodes = useMemo(() => {
    return CONTENT_INDEX.flatMap((s) =>
      s.episodes.map((e) => ({
        seasonId: e.seasonId,
        episodeId: e.episodeId,
        titleKey: e.titleKey,
        img: e.stickerImage,
      }))
    );
  }, []);

  const [seasonId, setSeasonId] = useState<string>('');
  useEffect(() => {
    if (!seasonId && seasons.length > 0) setSeasonId(seasons[0].seasonId);
  }, [seasonId, seasons]);

  const seasonEpisodes = useMemo(() => {
    const season = CONTENT_INDEX.find((s) => s.seasonId === seasonId);
    if (!season) return [];
    return season.episodes.map((e) => ({
      seasonId: e.seasonId,
      episodeId: e.episodeId,
      titleKey: e.titleKey,
      img: e.stickerImage,
    }));
  }, [seasonId]);

  const totalEpisodeStickers = allEpisodes.length;
  const unlockedEpisodeStickers = allEpisodes.filter(
    (e) => earnedStickers[episodeKey(e.seasonId, e.episodeId)]
  ).length;

  const totalMilestones = MILESTONE_STICKERS.length;
  const unlockedMilestones = MILESTONE_STICKERS.filter((s) => isEarned(s.id)).length;

  const totalStreaks = STREAK_STICKERS.length;
  const unlockedStreaks = STREAK_STICKERS.filter((s) => isEarned(s.id)).length;

  const totalThemeStickers = THEME_STICKERS.length;
  const unlockedThemeStickers = THEME_STICKERS.filter((s) => isEarned(s.id)).length;

  const totalAll = totalEpisodeStickers + totalMilestones + totalStreaks + totalThemeStickers;
  const unlockedAll = unlockedEpisodeStickers + unlockedMilestones + unlockedStreaks + unlockedThemeStickers;
  const progressPct = totalAll > 0 ? Math.round((unlockedAll / totalAll) * 100) : 0;

  const seasonPct = seasonEpisodes.length > 0
    ? Math.round(
        (seasonEpisodes.filter((e) => earnedStickers[episodeKey(e.seasonId, e.episodeId)]).length
          / seasonEpisodes.length) * 100
      )
    : 0;

  return (
    <Layout hideFooter backPath={backTo}>
      <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-amber-200 via-yellow-100 to-orange-100 px-5 py-6 shadow-md border border-white/40">
          <div className="pointer-events-none absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
          <div className="pointer-events-none absolute top-6 right-4 w-20 h-20 rounded-full bg-yellow-300/30 blur-xl" />
          <div className="text-xs font-extrabold text-slate-700">Bonuswelt</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ⭐ {tStories('album.title', { defaultValue: 'Sticker-Album' })}
          </h1>
          <p className="mt-1.5 text-sm text-slate-800 max-w-md">
            {tStories('album.subtitle', { defaultValue: 'Sammle Sticker für alles was du in der Story erlebst.' })}
          </p>

          <div className="mt-4 rounded-2xl bg-white/75 border border-white px-3 py-3 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-bold text-slate-900">
                {tStories('album.progressTitle', { defaultValue: 'Deine Sammlung' })}
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                {unlockedAll}/{totalAll}
              </div>
            </div>
            <div className="mt-2 h-2.5 w-full rounded-full bg-white overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </section>


        {/* EPISODEN */}
        <section className="rounded-[28px] border border-black/5 bg-gradient-to-br from-white via-slate-50 to-amber-50 shadow-sm p-5">
          <SectionHeader
            emoji="📺"
            title={tStories('album.episodesTitle', { defaultValue: 'Episoden-Sticker' })}
            count={unlockedEpisodeStickers}
            total={totalEpisodeStickers}
          />

          <div className="flex flex-wrap gap-2 mb-4">
            {seasons.map((s) => (
              <button
                key={s.seasonId}
                type="button"
                onClick={() => setSeasonId(s.seasonId)}
                className={[
                  'px-3 py-1.5 rounded-xl text-xs font-semibold border transition',
                  s.seasonId === seasonId
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300',
                ].join(' ')}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className="mb-4 rounded-2xl bg-white/80 border border-slate-100 px-3 py-3">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span>
                {seasonEpisodes.filter((e) => earnedStickers[episodeKey(e.seasonId, e.episodeId)]).length}
                /{seasonEpisodes.length} Folgen geschafft
              </span>
              <span>{seasonPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all" style={{ width: `${seasonPct}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {seasonEpisodes.map((e) => {
              const k = episodeKey(e.seasonId, e.episodeId);
              return (
                <StickerOnPage
                  key={k}
                  id={k}
                  title={tStories(e.titleKey, { defaultValue: e.episodeId })}
                  img={e.img}
                  earned={!!earnedStickers[k]}
                  seen={!!seen[k]}
                  onSeen={handleSeen}
                />
              );
            })}
          </div>
        </section>

        {/* THEMEN */}
        <section className="rounded-[28px] border border-black/5 bg-gradient-to-br from-teal-50 via-sky-50 to-violet-50 shadow-sm p-5">
          <SectionHeader
            emoji="🧠"
            title={tStories('album.themes', { defaultValue: 'Medienkompetenz-Sticker' })}
            count={unlockedThemeStickers}
            total={totalThemeStickers}
          />

          <p className="text-xs text-slate-600 mb-4">
            {tStories('album.themesHint', {
              defaultValue: 'Für jedes Thema kannst du bis zu 3 Sticker sammeln.',
            })}
          </p>

          <div className="space-y-3">
            {THEME_ORDER.map((themeId) => {
              const stickersForTheme = THEME_STICKERS.filter((s) => s.themeId === themeId);
              return (
                <ThemeRow
                  key={themeId}
                  themeId={themeId}
                  stickers={stickersForTheme}
                  themePoints={themePoints[themeId] ?? 0}
                  seen={seen}
                  onSeen={handleSeen}
                />
              );
            })}
          </div>
        </section>


        {/* MEILENSTEINE */}
        <section className="rounded-[28px] border border-black/5 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 shadow-sm p-5">
          <SectionHeader
            emoji="🎯"
            title={tStories('album.milestonesTitle', { defaultValue: 'Meilensteine' })}
            count={unlockedMilestones}
            total={totalMilestones}
          />
          <StickerGrid
            stickers={MILESTONE_STICKERS}
            earnedStickers={Object.fromEntries(MILESTONE_STICKERS.map((s) => [s.id, isEarned(s.id)]))}
            seen={seen}
            onSeen={handleSeen}
          />
        </section>

        {/* STREAK */}
        <section className="rounded-[28px] border border-black/5 bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50 shadow-sm p-5">
          <SectionHeader
            emoji="🔥"
            title={tStories('album.streakTitle', { defaultValue: 'Streak-Belohnungen' })}
            count={unlockedStreaks}
            total={totalStreaks}
          />
          <p className="text-xs text-slate-600 mb-4">
            {tStories('album.streakHint', {
              defaultValue: 'Komm immer wieder zurück und sammle auch diese Sticker.',
            })}
          </p>
          <StickerGrid
            stickers={STREAK_STICKERS}
            earnedStickers={Object.fromEntries(STREAK_STICKERS.map((s) => [s.id, isEarned(s.id)]))}
            seen={seen}
            onSeen={handleSeen}
          />
        </section>
      </div>
    </Layout>
  );
}

// ─── STICKER ON PAGE (Episode-Grid) ───────────────────────────────────────────

function StickerOnPage({
  id,
  title,
  img,
  earned,
  seen,
  onSeen,
}: {
  id: string;
  title: string;
  img: string;
  earned: boolean;
  seen: boolean;
  onSeen: (id: string) => void;
}) {
  const { t } = useTranslation('stickers');
  const isNew = earned && !seen;
  const locked = !earned;
  const [reveal, setReveal] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (!isNew) return;
    setReveal(false);
    const t1 = window.setTimeout(() => setReveal(true), 80);
    const t2 = window.setTimeout(() => onSeen(id), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isNew, id, onSeen]);

  useEffect(() => { setImgFailed(false); }, [img]);

  const hasImg = Boolean(img?.trim());
  const candidates = buildCandidates(img);
  const showGift = !hasImg || imgFailed;

  return (
    <div className="min-w-0">
      <div className="relative w-full aspect-square rounded-3xl border border-white/80 bg-gradient-to-br from-white to-slate-50 flex items-center justify-center shadow-sm overflow-hidden">
        {showGift ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className={['text-5xl select-none', locked ? 'opacity-[0.12] grayscale' : ''].join(' ')}>
              🎁
            </div>
          </div>
        ) : (
          <div className="relative w-full aspect-square flex items-center justify-center">
<div className="relative w-full h-full flex items-center justify-center">
  <SmartImage
    alt={title}
    className={[
      'w-[108%] h-[108%] object-contain p-0 transition duration-700',
      locked ? 'opacity-[0.12] grayscale saturate-0' : 'opacity-100',
      isNew && !reveal ? 'grayscale scale-90 opacity-75' : '',
      isNew && reveal ? 'scale-100 opacity-100 animate-[pop_700ms_cubic-bezier(0.2,1,0.2,1)]' : '',
    ].join(' ')}
    sizes="(min-width: 1024px) 220px, (min-width: 640px) 180px, 42vw"
    avif={candidates.avif}
    webp={candidates.webp}
    fallback={candidates.fallback}
    onError={() => setImgFailed(true)}
    loading="lazy"
    decoding="async"
  />
</div>
          </div>
        )}

        {locked && (
          <div className="absolute bottom-2 right-2 text-sm opacity-50 pointer-events-none" aria-hidden>🔒</div>
        )}
        {isNew && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] font-semibold text-emerald-800">
            {t('album.new', { defaultValue: 'Neu' })} ✨
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STICKER TILE (Meilensteine / Streak) ─────────────────────────────────────

function StickerTile({
  sticker,
  earned,
  seen,
  onSeen,
}: {
  sticker: StickerDef;
  earned: boolean;
  seen: boolean;
  onSeen: (id: string) => void;
}) {
  const { t } = useTranslation('stickers');
  const title = stickerTitle(t, sticker);
  const isNew = earned && !seen;
  const locked = !earned;
  const [reveal, setReveal] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (!isNew) return;
    setReveal(false);
    const t1 = window.setTimeout(() => setReveal(true), 80);
    const t2 = window.setTimeout(() => onSeen(sticker.id), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isNew, sticker.id, onSeen]);

  useEffect(() => { setImgFailed(false); }, [sticker.image]);

  const hasImg = Boolean(sticker.image?.trim());
  const candidates = buildCandidates(sticker.image);
  const showEmoji = !hasImg || imgFailed;

  return (
    <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white via-slate-50 to-sky-50 shadow-sm p-2.5" title={title}>
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden flex items-center justify-center bg-white/70">
        {showEmoji ? (
          <span className={['text-5xl select-none', locked ? 'opacity-20' : ''].join(' ')} aria-hidden>
            {earned ? '⭐' : '?'}
          </span>
        ) : (
          <SmartImage
            alt={title}
            className={[
              'w-full h-full object-contain p-1 transition-all duration-700',
              locked ? 'opacity-[0.12] grayscale saturate-0' : 'opacity-100',
              isNew && !reveal ? 'grayscale scale-75 opacity-80' : '',
              isNew && reveal ? 'scale-100 opacity-100 animate-[pop_700ms_cubic-bezier(0.2,1,0.2,1)]' : '',
            ].join(' ')}
            sizes="(min-width: 640px) 120px, 33vw"
            avif={candidates.avif}
            webp={candidates.webp}
            fallback={candidates.fallback}
            onError={() => setImgFailed(true)}
            loading="lazy"
            decoding="async"
          />
        )}

        {locked && (
          <div className="absolute bottom-2 right-2 text-sm opacity-50 pointer-events-none" aria-hidden>🔒</div>
        )}
        {isNew && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
            {t('album.new', { defaultValue: 'Neu' })} ✨
          </div>
        )}
      </div>

      <div className="mt-2 text-[10px] font-semibold text-slate-600 text-center leading-tight line-clamp-2">
        {title}
      </div>
    </div>
  );
}