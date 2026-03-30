import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { useProfile } from '../profile/useProfile';
import { CONTENT_INDEX } from '../content/contentIndex';
import { loadSeenStickers, markStickerSeen } from '../progress/stickerSeen';
import { assetUrl } from '../common/assetUrl';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import SmartImage, { type SrcCandidate } from '../components/SmartImage';
import { SPECIAL_STICKERS, SPECIAL_BADGES } from '../progress/rewardCatalog';

type TabKey = 'episodes' | 'seasons';

type EpisodeMeta = {
  seasonId: string;
  episodeId: string;
  titleKey: string;
  img: string; // e.stickerImage
};

type SeasonMeta = {
  seasonId: string;
  title: string;
  img: string; // s.badgeImage
};

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


/**
 * Builds simple -512/-1024 candidates from a given path:
 * - If you pass "...-512.webp" it will try "...-512.avif" and "...-1024.avif/webp"
 * - If pattern not found, it will just use fallback.
 */
function buildCandidates(src: string): { avif?: SrcCandidate[]; webp?: SrcCandidate[]; fallback: string } {
  const url = toPublicUrl(src);

  // Wenn src leer ist, geben wir fallback leer zurück — Tile zeigt dann 🎁
  if (!src?.trim()) return { fallback: '' };

  if (isAbsoluteish(src) && !src.includes('/media/')) {
    return { fallback: url };
  }

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

function AlbumHero({
  title,
  subtitle,
  progressText,
}: {
  title: string;
  subtitle: string;
  progressText: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-200 via-yellow-100 to-orange-100 px-4 py-5 shadow-md border border-white/40">
      <div className="pointer-events-none absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
      <div className="pointer-events-none absolute top-6 right-4 w-20 h-20 rounded-full bg-yellow-300/30 blur-xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 w-24 h-24 rounded-full bg-orange-300/20 blur-xl" />

      <div className="relative">
        <div className="text-xs font-extrabold text-slate-700">
          Bonuswelt
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          ⭐ {title}
        </h1>

        <p className="mt-1 text-sm text-slate-800 max-w-md">
          {subtitle}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70">
            ⭐ Sammeln
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70">
            🏆 Freischalten
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70">
            {progressText}
          </span>
        </div>
      </div>
    </section>
  );
}

export default function StickerAlbum() {
  const { profile } = useProfile();
  const [tab, setTab] = useState<TabKey>('episodes');

  const earnedStickers = profile.progress?.earnedStickers ?? {};
  const earnedBadges = profile.progress?.earnedBadges ?? {};
  const specialStickers = SPECIAL_STICKERS;
const specialBadges = SPECIAL_BADGES;
  const [seen, setSeen] = useState<Record<string, true>>(() => loadSeenStickers());

  const location = useLocation();
  type StickerAlbumLocationState = {
  backTo?: string;
} | null;

const state = (location.state as StickerAlbumLocationState) ?? null;
  const backTo = state?.backTo ?? '/profile';

  const { t: tStories } = useTranslation('stories');

  // Seasons meta (for selector + badges)
const seasons = useMemo<SeasonMeta[]>(() => {
  return CONTENT_INDEX.map((s) => ({
    seasonId: s.seasonId,
    title: s.seasonTitle,
    img: s.badgeImage ?? '', // kann leer sein, ist ok
  }));
}, []);

const seasonsWithBadge = useMemo(() => {
  return seasons.filter((s) => Boolean(s.img?.trim()));
}, [seasons]);

  // Default season = first season in index
  const [seasonId, setSeasonId] = useState<string>(''); // start leer

useEffect(() => {
  if (!seasonId && seasons.length > 0) {
    setSeasonId(seasons[0].seasonId);
  }
}, [seasonId, seasons]);


  // Episodes for current season only
  const seasonEpisodes = useMemo<EpisodeMeta[]>(() => {
    const season = CONTENT_INDEX.find((s) => s.seasonId === seasonId);
    if (!season) return [];
    return season.episodes.map((e) => ({
      seasonId: e.seasonId,
      episodeId: e.episodeId,
      titleKey: e.titleKey,
      img: e.stickerImage,
    }));
  }, [seasonId]);

  // Global episodes (for overall progress card + "next drop" global)
  const allEpisodes = useMemo<EpisodeMeta[]>(() => {
    const out: EpisodeMeta[] = [];
    for (const s of CONTENT_INDEX) {
      for (const e of s.episodes) {
        out.push({
          seasonId: e.seasonId,
          episodeId: e.episodeId,
          titleKey: e.titleKey,
          img: e.stickerImage,
        });
      }
    }
    return out;
  }, []);

  // -----------------------------
  // Progress (gaming-style)
  // -----------------------------
const totalEpisodeStickers = allEpisodes.length;
const unlockedEpisodeStickers = allEpisodes.reduce(
  (acc, e) => acc + (earnedStickers[episodeKey(e.seasonId, e.episodeId)] ? 1 : 0),
  0
);

const totalSeasonBadges = seasonsWithBadge.length;
const unlockedSeasonBadges = seasonsWithBadge.reduce(
  (acc, s) => acc + (earnedBadges[s.seasonId] ? 1 : 0),
  0
);

const totalSpecialStickers = specialStickers.length;
const unlockedSpecialStickers = specialStickers.reduce(
  (acc, s) => acc + (earnedStickers[s.id] ? 1 : 0),
  0
);

const totalSpecialBadges = specialBadges.length;
const unlockedSpecialBadges = specialBadges.reduce(
  (acc, b) => acc + (earnedBadges[b.id] ? 1 : 0),
  0
);

const totalVisibleStickers = totalEpisodeStickers + totalSpecialStickers;
const unlockedVisibleStickers = unlockedEpisodeStickers + unlockedSpecialStickers;

const totalVisibleBadges = totalSeasonBadges + totalSpecialBadges;
const unlockedVisibleBadges = unlockedSeasonBadges + unlockedSpecialBadges;

const totalCollectibles = totalVisibleStickers + totalVisibleBadges;
const unlockedCollectibles = unlockedVisibleStickers + unlockedVisibleBadges;

const progressPct =
  totalCollectibles > 0
    ? Math.round((unlockedCollectibles / totalCollectibles) * 100)
    : 0;



  // Season progress
  const totalSeasonStickers = seasonEpisodes.length;
  const unlockedSeasonStickers = seasonEpisodes.reduce((acc, e) => acc + (earnedStickers[episodeKey(e.seasonId, e.episodeId)] ? 1 : 0), 0);
  const seasonPct = totalSeasonStickers > 0 ? Math.round((unlockedSeasonStickers / totalSeasonStickers) * 100) : 0;

  // “Next drop” in current season (first locked in that season)
  const nextLockedInSeason = seasonEpisodes.find((e) => !earnedStickers[episodeKey(e.seasonId, e.episodeId)]);

  return (
    <Layout hideFooter>
      <div className="w-full max-w-2xl px-4 py-8">

        <AlbumHero
  title={tStories('album.title', { defaultValue: 'Sticker-Album' })}
  subtitle={tStories('album.subtitle', {
    defaultValue: 'Sammle Sticker & Badges – dein Fortschritt bleibt auf deinem Gerät.',
  })}
  progressText={`${unlockedCollectibles}/${totalCollectibles}`}
/>

{/* Topbar */}
<div className="mt-4 mb-4 flex items-center justify-end gap-3">
</div>

        {/* Gaming Header Card */}
        <div className="rounded-3xl border border-black/5 bg-white shadow-sm p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl">
              🏆
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900">
                  {tStories('album.progressTitle', { defaultValue: 'Sammler-Fortschritt' })}
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {unlockedCollectibles}/{totalCollectibles} · {progressPct}%
                </div>
              </div>

              <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-2 rounded-full bg-slate-900" style={{ width: `${progressPct}%` }} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <div className="text-xs text-slate-600">{tStories('album.episodes', { defaultValue: 'Sticker' })}</div>
                  <div className="text-lg font-bold text-slate-900">
  {unlockedVisibleStickers}/{totalVisibleStickers}
</div>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <div className="text-xs text-slate-600">{tStories('album.seasons', { defaultValue: 'Badges' })}</div>
                  <div className="text-lg font-bold text-slate-900">
  {unlockedVisibleBadges}/{totalVisibleBadges}
</div>
                </div>
              </div>

              {tab === 'episodes' && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-600">
                      {tStories('album.seasonProgress', { defaultValue: 'Fortschritt in dieser Staffel' })}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {seasonId.toUpperCase()} · {unlockedSeasonStickers}/{totalSeasonStickers} · {seasonPct}%
                    </div>
                  </div>

                  {nextLockedInSeason && (
                    <div className="shrink-0 text-right">
                      <div className="text-xs text-slate-600">
                        {tStories('album.nextDrop', { defaultValue: 'Nächster Sticker' })}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 max-w-[160px] truncate">
                        {tStories(nextLockedInSeason.titleKey, { defaultValue: nextLockedInSeason.episodeId })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-black/5 bg-white shadow-sm p-5">
  <div className="flex items-center justify-between gap-3 mb-4">
    <div className="text-sm font-semibold text-slate-900">
      {tStories('album.specialRewards', { defaultValue: 'Besondere Belohnungen' })}
    </div>
    <div className="text-xs text-slate-600">
      {unlockedSpecialStickers + unlockedSpecialBadges}/{specialStickers.length + specialBadges.length}
    </div>
  </div>

  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
    {specialStickers.map((s) => (
      <StickerTile
        key={s.id}
        id={s.id}
        title={s.title}
        img={s.image}
        earned={!!earnedStickers[s.id]}
        seen={!!seen[s.id]}
        onSeen={(id) => {
          markStickerSeen(id);
          setSeen((prev) => ({ ...prev, [id]: true }));
        }}
        tStories={tStories}
        isSpecial
      />
    ))}

    {specialBadges.map((b) => (
      <StickerTile
        key={b.id}
        id={b.id}
        title={b.title}
        img={b.image}
        earned={!!earnedBadges[b.id]}
        seen={true}
        onSeen={() => {}}
        badge
        tStories={tStories}
        isSpecial
      />
    ))}
  </div>
</div>

        {/* Tabs */}
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-white/70 border border-slate-200 p-2">
          <button
            type="button"
            onClick={() => setTab('episodes')}
            className={
              'py-2 rounded-xl text-sm font-semibold transition ' +
              (tab === 'episodes'
                ? 'bg-white shadow-sm border border-slate-200 text-slate-900'
                : 'text-slate-600 hover:text-slate-900')
            }
          >
            {tStories('album.tabEpisodes', { defaultValue: 'Folgen' })}
          </button>

          <button
            type="button"
            onClick={() => setTab('seasons')}
            className={
              'py-2 rounded-xl text-sm font-semibold transition ' +
              (tab === 'seasons'
                ? 'bg-white shadow-sm border border-slate-200 text-slate-900'
                : 'text-slate-600 hover:text-slate-900')
            }
          >
            {tStories('album.tabSeasons', { defaultValue: 'Staffeln' })}
          </button>
        </div>


        {/* ✅ Album Panel: full width + no single sticker cards */}
        {tab === 'episodes' && (
          <div className="mt-4 rounded-3xl border border-black/5 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="text-sm font-semibold text-slate-900">
                {tStories('album.albumView', { defaultValue: 'Album' })}
              </div>
              <div className="text-xs text-slate-600">
                {unlockedSeasonStickers}/{totalSeasonStickers} · {seasonPct}%
              </div>
            </div>

            {/* Sticker "on page" (no tile frame) */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-x-3 gap-y-4">
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
      onSeen={(id) => {
        markStickerSeen(id);
        setSeen((prev) => ({ ...prev, [id]: true }));
      }}
      tStories={tStories}
    />
  );
})}
            </div>
          </div>
        )}

        {/* Staffel Switch */}
<div className="mt-4 flex flex-wrap gap-2">
  {seasons.map((s) => {
    const active = s.seasonId === seasonId;
    return (
      <button
        key={s.seasonId}
        type="button"
        onClick={() => setSeasonId(s.seasonId)}
        className={[
          'px-3 py-2 rounded-xl text-sm font-semibold border transition',
          active
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300',
        ].join(' ')}
      >
        {s.title}
      </button>
    );
  })}
</div>


        {/* Seasons tab stays as grid tiles (badges are fine as tiles) */}
        {tab === 'seasons' && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
            {seasons.map((s) => (
              <StickerTile
                key={s.seasonId}
                id={s.seasonId}
                title={s.title}
                img={s.img}
                earned={!!earnedBadges[s.seasonId]}
                seen={true}
                onSeen={() => {}}
                badge
                tStories={tStories}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

/**
 * ✅ Album-style sticker: no outer card, looks like sticker on paper.
 * Locked: sticker is visible as teaser (very faint), no lock circle.
 */
function StickerOnPage({
  id,
  title,
  img,
  earned,
  seen,
  onSeen,
  tStories,
}: {
  id: string;
  title: string;
  img: string;
  earned: boolean;
  seen: boolean;
  onSeen: (id: string) => void;
  tStories: (key: string, opts?: any) => string;
}) {
  const isNew = earned && !seen;
  const locked = !earned;

  const giftClass = locked
  ? 'opacity-[0.12] grayscale saturate-0'
  : 'opacity-[0.22] grayscale saturate-0';


  const [reveal, setReveal] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (!isNew) return;

    setReveal(false);
    const t1 = window.setTimeout(() => setReveal(true), 80);
    const t2 = window.setTimeout(() => onSeen(id), 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isNew, id, onSeen]);

  // wichtig: wenn img wechselt, Error-Status zurücksetzen
  useEffect(() => {
    setImgFailed(false);
  }, [img]);

  const hasImg = Boolean(img?.trim());
  const candidates = buildCandidates(img);

  // 🎁 wenn kein Bild oder Laden fehlgeschlagen
  const showGift = !hasImg || imgFailed;

  return (
    <div className="min-w-0">
      <div className="relative w-full aspect-square flex items-center justify-center">
        {showGift ? (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className={[
                'text-5xl select-none transition-transform duration-200',
                'active:scale-95 md:hover:scale-105',
                giftClass,
              ].join(' ')}
              aria-label={tStories('album.comingSoon', { defaultValue: 'Kommt bald' })}
              title={tStories('album.comingSoon', { defaultValue: 'Kommt bald' })}
            >
              🎁
            </div>
          </div>
        ) : (
          <div className="relative w-full aspect-square flex items-center justify-center">
  <div className="w-[92%] h-[92%] flex items-center justify-center">
          <SmartImage
            alt={title}
            className={[
              'relative w-full h-full object-contain p-1 transition duration-700',
              locked ? 'opacity-[0.12] grayscale saturate-0' : 'opacity-100',
              isNew && !reveal ? 'grayscale scale-90 opacity-75' : '',
              isNew && reveal ? 'scale-100 opacity-100' : '',
              isNew && reveal ? 'animate-[pop_700ms_cubic-bezier(0.2,1,0.2,1)]' : '',
            ].join(' ')}
            sizes="(min-width: 640px) 120px, 20vw"
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

        {/* ✅ LOCK OVERLAY: immer wenn locked – unabhängig vom Bild */}
        {locked && (
          <div className="absolute bottom-1 right-1 text-sm opacity-50 pointer-events-none" aria-hidden="true">
            🔒
          </div>
        )}

        {isNew && (
          <div className="absolute top-1 left-1 px-2 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] font-semibold text-emerald-800">
            {tStories('album.new', { defaultValue: 'Neu' })} ✨
          </div>
        )}
      </div>

      <style>{`
        @keyframes pop {
          0% { transform: scale(0.92) rotate(-2deg); }
          55% { transform: scale(1.06) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}



// Your existing tile (used for seasons tab)
function StickerTile({
  id,
  title,
  img,
  earned,
  seen,
  onSeen,
  badge = false,
  tStories,
  isNext = false,
  isSpecial = false,
}: {
  id: string;
  title: string;
  img: string;
  earned: boolean;
  seen: boolean;
  onSeen: (id: string) => void;
  badge?: boolean;
  tStories: (key: string, opts?: any) => string;
  isNext?: boolean;
  isSpecial?: boolean;
}) {
  const isNew = earned && !seen;
  const locked = !earned;

  const [reveal, setReveal] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (!isNew) return;

    setReveal(false);
    const t1 = window.setTimeout(() => setReveal(true), 80);
    const t2 = window.setTimeout(() => onSeen(id), 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isNew, id, onSeen]);

  // ✅ Reset error state if img changes
  useEffect(() => {
    setImgFailed(false);
  }, [img]);

  const hasImg = Boolean(img?.trim());
  const candidates = buildCandidates(img);

  // Emoji-Priorität: ✨ > 🎁 (next/fehlend) > 🔒
  const placeholderEmoji = isSpecial ? '✨' : (isNext || !hasImg || imgFailed) ? '🎁' : '🔒';

  // ✅ Show emoji if missing image or load failed
  const showEmoji = !hasImg || imgFailed;

  return (
    <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-2">
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden flex items-center justify-center">
        {/* ✅ transparent: kein grauer Hintergrund */}
        {/* optional: <div className="absolute inset-0 bg-white" /> */}

        {showEmoji ? (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className={[
                'text-5xl select-none transition-transform duration-200',
                // Gaming feel: kleiner Hover/Tap "pop"
                'active:scale-95 md:hover:scale-105',
                locked ? 'opacity-80' : 'opacity-90',
              ].join(' ')}
              title={placeholderEmoji}
            >
              {placeholderEmoji}
            </div>
          </div>
        ) : (
          <SmartImage
            alt={title}
            className={[
              'w-full h-full object-contain p-2 transition-all duration-700',
              locked ? 'opacity-[0.12] grayscale saturate-0' : 'opacity-100',
              isNew && !reveal ? 'grayscale scale-75 opacity-80' : '',
              isNew && reveal ? 'scale-100 opacity-100' : '',
              isNew && reveal ? 'animate-[pop_700ms_cubic-bezier(0.2,1,0.2,1)]' : '',
            ].join(' ')}
            sizes="(min-width: 640px) 120px, 33vw"
            avif={candidates.avif}
            webp={candidates.webp}
            fallback={candidates.fallback}
            // ✅ wenn Bild nicht lädt → wir switchen auf 🎁
            onError={() => setImgFailed(true)}
            loading="lazy"
            decoding="async"
          />
        )}

        {/* ✅ Dezent: kein Kreis, nur ein kleines Schloss bei locked */}
        {locked && (
          <div className="absolute bottom-2 right-2 text-sm opacity-50 pointer-events-none" aria-hidden="true">
            🔒
          </div>
        )}

        {/* ✅ Neu */}
        {isNew && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
            {tStories('album.new', { defaultValue: 'Neu' })} ✨
          </div>
        )}

        {/* ✅ Badge */}
        {badge && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] font-semibold text-indigo-800">
            {tStories('album.badge', { defaultValue: 'Badge' })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pop {
          0% { transform: scale(0.92) rotate(-2deg); }
          55% { transform: scale(1.06) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

