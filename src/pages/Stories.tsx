// src/pages/Stories.tsx
import React, { useMemo, useRef, useState, useEffect } from 'react';
import Layout from '../components/Layout';
import BetaBanner from '../components/BetaBanner';
import CourseCard from '../components/CourseCard';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../common/utils';
import { getProgress, getCompletedChapterCount } from '../progress/storyProgress';
import { assetUrl } from '../common/assetUrl';
import SmartImage from '../components/SmartImage';

import { getStoryCards, CONTENT_INDEX } from '../content/contentIndex';
import { isEpisodeAvailable } from '../story-v02/content/getPlayableEpisodeV02';
import { useProfile } from '../profile/useProfile'; // ✅ NEW
import { shouldBypassAll } from '../gating/entitlements';
import NewAmicBanner from '../components/NewAmicBanner';
import { loadNextAmicInfo } from '../notifications/amicNotif';
import { loadSettings } from '../settings/appSettings';
import { loadStore } from '../analytics/analyticsStore';
import { BETA_ACTIVE, isBetaTester, isBetaPartialDismissed, markBetaPartialDismissed } from '../beta/betaConfig';
import { shareOrDownloadAnalytics } from '../analytics/analyticsExport';

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


const INFO_TILE_COLORS = [
  { bg: 'bg-teal-50',   border: 'border-teal-200',   bar: 'bg-teal-300'   },
  { bg: 'bg-violet-50', border: 'border-violet-200', bar: 'bg-violet-300' },
  { bg: 'bg-amber-50',  border: 'border-amber-200',  bar: 'bg-amber-300'  },
  { bg: 'bg-sky-50',    border: 'border-sky-200',    bar: 'bg-sky-300'    },
  { bg: 'bg-rose-50',   border: 'border-rose-200',   bar: 'bg-rose-300'   },
];

function InfoTile({ title, text, colorIdx = 0 }: { title: string; text: string; colorIdx?: number }) {
  const c = INFO_TILE_COLORS[colorIdx % INFO_TILE_COLORS.length];
  return (
    <div className={`h-full rounded-2xl border ${c.border} ${c.bg} p-4 sm:p-5 shadow-sm flex flex-col`}>
      <div className="font-extrabold text-slate-900 leading-snug">{title}</div>
      <div className="mt-2 text-sm text-slate-700 leading-snug flex-1">{text}</div>
      <div className={`mt-3 h-1 w-10 rounded-full ${c.bar}`} />
    </div>
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
    return Boolean(el.closest('button, a, input, textarea, select, label'));
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex gap-3 overflow-x-auto pb-2',
        'snap-x snap-mandatory',
        'items-stretch',
        'touch-pan-x select-none',
        '[&::-webkit-scrollbar]:hidden',
        className
      )}
      onPointerDown={(e) => {
        const el = ref.current;
        if (!el) return;

        // ✅ wenn user auf Button/Link klickt: NICHT drag-gen
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

        // ✅ Drag erst ab Threshold werten (sonst “tap” = scroll = click kaputt)
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
        // dragged bleibt kurz true, damit click nach drag nicht “durchgeht”
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
        // ✅ wenn es ein Drag war: Clicks danach blocken
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

function InfoBottomSheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const { t } = useTranslation('common');
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartY.current === null) return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (dy > 80) onClose();
    touchStartY.current = null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className="w-full bg-white rounded-t-3xl shadow-2xl flex flex-col"
        style={{ maxHeight: '85dvh' }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>
        {/* Sheet header */}
        <div className="flex items-center justify-between px-5 py-2 flex-shrink-0 border-b border-slate-100">
          <div className="text-sm font-semibold text-slate-700">Amy Surfwing</div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close', { defaultValue: 'Schließen' })}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600 text-sm"
          >
            ✕
          </button>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-4 py-4 space-y-4 pb-10">
          {children}
        </div>
      </div>
    </div>
  );
}

const SURVEY_URL =
  'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__tVBf5hUQlM2V0k0OFdWMEQzNVhaUVhSNzU2STdBSC4u';

export default function Stories() {
  const CardTile = ({
  tag,
  title,
  text,
  img,
  alt,
  object,
  hClass,
}: {
  tag: string;
  title: string;
  text: string;
  img: string;
  alt: string;
  object: string;
  hClass: string;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full flex flex-col">
    {/* Bild oben — dominanter Header, Tag als Badge oben rechts */}
    <div className="relative overflow-hidden flex-shrink-0">
      <img
        src={assetUrl(img)}
        alt={alt}
        className={`w-full ${hClass} ${object}`}
        loading="lazy"
      />
      <div className="absolute top-2 right-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-600 shadow-sm">
        {tag}
      </div>
    </div>
    {/* Text unten — kompakt */}
    <div className="px-3 py-2 sm:px-4 sm:py-3">
      <div className="font-extrabold text-slate-900 leading-snug text-sm">{title}</div>
      <div className="mt-0.5 text-sm text-slate-500 leading-snug">{text}</div>
    </div>
  </div>
);
  const navigate = useNavigate();
  const { t: tStories, i18n } = useTranslation('stories');
    const { t: tCommon } = useTranslation('common'); // ✅ swipeHint stabil
    const lang = (i18n.resolvedLanguage ?? i18n.language).startsWith('en') ? 'en' : 'de';
  const { profile } = useProfile(); // ✅ NEW

  const [amicBannerInfo] = useState(() => {
    if (!loadSettings().remindersEnabled) return null;
    return loadNextAmicInfo();
  });
  const [amicBannerVisible, setAmicBannerVisible] = useState(Boolean(amicBannerInfo));
  const [infoOpen, setInfoOpen] = useState(false);

  // Survey-Banner: erscheint nach ≥3 Kapiteln + ≥3 Tagen, einmal wegklickbar / snooze 7 Tage
  const [surveyBannerVisible, setSurveyBannerVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (localStorage.getItem('surveyDismissed')) return false;
    const snoozeUntil = localStorage.getItem('surveySnoozeUntil');
    if (snoozeUntil && new Date(snoozeUntil) > new Date()) return false;
    // Kapitelzahl über alle Courses
    const totalCompleted = getStoryCards().reduce(
      (sum, c) => sum + getCompletedChapterCount(c.id), 0
    );
    if (totalCompleted < 3) return false;
    // Tage seit erstem Start
    const firstSeenStr = loadStore().meta?.firstSeen ?? '';
    if (!firstSeenStr) return false;
    const daysSince = (Date.now() - new Date(firstSeenStr).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince >= 3;
  });

  function dismissSurvey() {
    localStorage.setItem('surveyDismissed', '1');
    setSurveyBannerVisible(false);
  }

  function snoozeSurvey() {
    const until = new Date();
    until.setDate(until.getDate() + 7);
    localStorage.setItem('surveySnoozeUntil', until.toISOString().slice(0, 10));
    setSurveyBannerVisible(false);
  }

  // Beta: Partial-Data Banner nach 7 Tagen für Nicht-Abschließer
  const [betaPartialVisible, setBetaPartialVisible] = useState(() => {
    if (!BETA_ACTIVE || !isBetaTester()) return false;
    if (isBetaPartialDismissed()) return false;
    const s1e01Complete = getProgress('s1e01')?.finished ?? false;
    if (s1e01Complete) return false;
    const totalCompleted = getStoryCards().reduce(
      (sum, c) => sum + getCompletedChapterCount(c.id), 0
    );
    if (totalCompleted < 3) return false;
    const firstSeenStr = loadStore().meta?.firstSeen ?? '';
    if (!firstSeenStr) return false;
    const daysSince = (Date.now() - new Date(firstSeenStr).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince >= 7;
  });
  const [betaPartialSendState, setBetaPartialSendState] = useState<'idle' | 'loading' | 'success'>('idle');

  async function handleBetaPartialSend() {
    setBetaPartialSendState('loading');
    await shareOrDownloadAnalytics({
      chaptersCompleted: Object.entries(profile.progress?.completedChapters ?? {})
        .filter(([, v]) => v)
        .map(([k]) => k),
      themePoints: profile.progress?.themePoints ?? {},
    });
    setBetaPartialSendState('success');
    markBetaPartialDismissed();
  }

  function dismissBetaPartial() {
    markBetaPartialDismissed();
    setBetaPartialVisible(false);
  }

  // ✅ Reihenfolge: genau so wie Content Index es liefert
const cardsInOrder = useMemo(() => getStoryCards(), []);
const cardsForUI = cardsInOrder;

    const playableById = useMemo(() => {
    const m: { [key: string]: boolean } = {};
    for (const c of cardsForUI) {
      m[c.id] = isEpisodeAvailable(c.id, lang);
    }
    return m;
  }, [cardsForUI, lang]);

  // ✅ Progress je Story (0..100)
const progressById = cardsForUI.reduce<Record<string, number>>((acc, card) => {
  const p = getProgress(card.id);
  if (!p) {
    acc[card.id] = 0;
    return acc;
  }

  const totalChapters = Math.max(1, card.chaptersTotal ?? 1);
  const completedCount = getCompletedChapterCount(card.id);

  const finishedPct = p.finished ? 100 : Math.floor((completedCount / totalChapters) * 100);
  acc[card.id] = Math.max(0, Math.min(100, finishedPct));
  return acc;
}, {});

function isCourseFinished(courseId: string, chaptersTotal?: number) {
  const p = getProgress(courseId);
  if (!p) return false;
  if (p.finished) return true;

  const total = Math.max(1, chaptersTotal ?? 1);
  const completedCount = getCompletedChapterCount(courseId);
  return completedCount >= total;
}

  // ✅ “Kette”: Story N ist nur spielbar, wenn Story N-1 fertig ist (außer die erste)
function isUnlockedByChain(
  orderedCards: { id: string; chaptersTotal?: number }[],
  courseId: string
) {
  if (shouldBypassAll(courseId)) return true;

  const idx = orderedCards.findIndex((c) => c.id === courseId);
  if (idx <= 0) return true;
  const prev = orderedCards[idx - 1];
  return isCourseFinished(prev.id, prev.chaptersTotal);
}

  // ✅ Continue/Start Auswahl: released + playable
  const availableCards = cardsForUI.filter((c) => {
    const playable = playableById[c.id] ?? false;
    const unlocked = isUnlockedByChain(cardsInOrder, c.id);
    return c.released && playable && unlocked;
  });

  const currentCourseId = profile?.progress?.current?.courseId as string | undefined;

  const currentFromProfile =
    currentCourseId ? availableCards.find((c) => c.id === currentCourseId) : undefined;

  const currentCard =
    currentFromProfile ??
    availableCards.find((c) => {
      const pct = progressById[c.id] ?? 0;
      return pct > 0 && pct < 100;
    }) ??
    availableCards.find((c) => (progressById[c.id] ?? 0) === 0) ??
    availableCards[0];

  const currentPct = currentCard ? (progressById[currentCard.id] ?? 0) : 0;
  const hasStarted = currentPct > 0;
  const noAvailableStories = availableCards.length === 0;

  function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm font-semibold bg-white/80 border border-white/60 text-[var(--color-teal-900)] backdrop-blur">
      {children}
    </span>
  );
}

  

  return (
    <Layout>
      <BetaBanner />
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-3 py-6 sm:py-10 space-y-6">

{/* HERO */}
<section className="relative overflow-hidden rounded-3xl border border-white/50 shadow-lg bg-white">
  
  {/* Hintergrund-Verlauf (sehr subtil) */}
  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-teal-50)] via-white to-white" />

  {/* Grüner Glow NUR oben links */}
  <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[var(--color-teal-200)]/30 blur-2xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* TEXT */}
          <div className="lg:col-span-6 p-6 sm:p-10 lg:pr-6 flex flex-col justify-center">
            <div className="text-xs sm:text-sm font-semibold text-[var(--color-teal-700)]">
              {tStories('hero.kicker', { defaultValue: 'Amy Surfwing' })}
            </div>

            <h1 className="mt-2 text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--color-teal-900)] leading-tight">
              {tStories('hero.title', { defaultValue: 'Amy Surfwing wartet schon ✨' })}
            </h1>

            <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-700 leading-relaxed">
              {tStories('hero.lead', {
                defaultValue:
                  'Tauche ein in die Welt von Amy Surfwing! In jeder Story erlebst du, was Yasmin, Carlos & Co online passiert.',
              })}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>{tStories('hero.badges.0', { defaultValue: '5 min/Tag' })}</Badge>
              <Badge>{tStories('hero.badges.1', { defaultValue: '1 Amic/Tag' })}</Badge>
              <Badge>{tStories('hero.badges.2', { defaultValue: '5/Woche' })}</Badge>
              <Badge>{tStories('hero.badges.3', { defaultValue: 'ab 9 Jahre' })}</Badge>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  if (currentCard) {
                    navigate(currentCard.storyEngine === 'v2' ? `/stories-v02/${currentCard.id}` : `/stories/${currentCard.id}`);
                  } else {
                    document.getElementById('story-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
              >
                {hasStarted
                  ? tStories('hero.ctaContinue', { defaultValue: 'Weiterlesen →' })
                  : tStories('hero.ctaPrimary', { defaultValue: 'Jetzt starten →' })}
              </button>

              <Link
                to="/parents"
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
              >
                {tStories('hero.ctaParents', { defaultValue: 'Für Eltern →' })}
              </Link>
            </div>
          </div>

          {/* MEDIA */}
          <div className="lg:col-span-6 relative min-h-[280px] sm:min-h-[340px] lg:min-h-[420px]">
            <SmartImage
              alt={tStories('hero.imageAlt', { defaultValue: 'Story-Welt: Mia, Finn und Freunde' })}
              className="absolute inset-0 w-full h-full object-cover object-center"
              sizes="(min-width: 1024px) 50vw, 100vw"
              avif={[
                { src: assetUrl('media/ui/stories/stories-hero-512.avif'), w: 512 },
                { src: assetUrl('media/ui/stories/stories-hero-1024.avif'), w: 1024 },
              ]}
              webp={[
                { src: assetUrl('media/ui/stories/stories-hero-512.webp'), w: 512 },
                { src: assetUrl('media/ui/stories/stories-hero-1024.webp'), w: 1024 },
              ]}
              fallback={assetUrl('media/ui/stories/stories-hero-1024.webp')}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* STORY CARDS – direkt unter Hero */}
      {(() => {
        const seasons = CONTENT_INDEX;
        const firstSeason = seasons[0];
        const seasonLabel = firstSeason?.seasonTitle ?? 'Staffel 1';
        const totalEpisodes = cardsForUI.length;

        return (
          <Panel
            kicker={tStories('list.kicker', { defaultValue: 'Amy Surfwing' })}
            title={tStories('list.title', { defaultValue: 'Starte dein Amic' })}
            right={
              <button
                type="button"
                onClick={() => setInfoOpen(true)}
                aria-label="Info zu Amy Surfwing"
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200 transition-colors text-sm font-semibold"
              >
                ⓘ
              </button>
            }
          >
            <div id="story-list" className="scroll-mt-24" />

            {/* Serienkontext */}
            <p className="text-xs text-slate-500 -mt-1">
              📱 Chat-Serie&nbsp;&nbsp;·&nbsp;&nbsp;{seasonLabel}&nbsp;&nbsp;·&nbsp;&nbsp;{totalEpisodes} Folgen
            </p>

            {noAvailableStories ? (
              <p className="mt-3 text-sm text-slate-500">
                {tStories('comingSoon.text', {
                  defaultValue: 'Im Moment ist noch keine Story freigeschaltet. Schau bald wieder vorbei!',
                })}
              </p>
            ) : (
              <>
                {/* Aktuell / Weitermachen – Highlight-Karte */}
                {currentCard && (
                  <div className="mt-4 flex gap-3 items-center bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4">
                    <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img
                        src={assetUrl(currentCard.cover?.trim() ? currentCard.cover : 'media/ui/locked-512.webp')}
                        alt={tStories('continue.imageAlt', { defaultValue: 'Aktuelle Story' })}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[var(--color-teal-600)]">
                        {hasStarted
                          ? tStories('continue.label', { defaultValue: 'Aktuell' })
                          : tStories('start.label', { defaultValue: 'Neu für dich' })}
                      </div>
                      <div className="mt-0.5 font-extrabold text-slate-900 leading-snug truncate">
                        {tStories(currentCard.titleKey)}
                      </div>
                      {hasStarted && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div className="h-1.5 rounded-full bg-[#0084ff]" style={{ width: `${currentPct}%` }} />
                          </div>
                          <span className="text-[11px] text-slate-500 shrink-0">{currentPct}%</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(currentCard.storyEngine === 'v2' ? `/stories-v02/${currentCard.id}` : `/stories/${currentCard.id}`)}
                      className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors text-sm"
                    >
                      {hasStarted ? (
                        tStories('continue.cta', { defaultValue: 'Weiterlesen \u2192' })
                      ) : (
                        <>
                          <img
                            src={assetUrl('media/story/characters/yasmin-256.webp')}
                            alt="Yasmin"
                            className="hidden sm:block w-5 h-5 rounded-full object-cover object-top flex-shrink-0"
                          />
                          <span className="sm:hidden">Los →</span>
                          <span className="hidden sm:inline">{tStories('start.cta', { defaultValue: 'Los geht\'s →' })}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Alle Story-Kacheln */}
                {lang === 'en' && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 rounded-full px-3 py-1">
                    <span>🤖</span>
                    <span>{tStories('overview.aiTranslated', { defaultValue: 'Story translated with AI · May contain errors' })}</span>
                  </div>
                )}
                <div className="mt-4">
                  <SwipeRow className="-mx-4 px-4 lg:mx-0 lg:px-0">
                    {cardsForUI.map((card) => {
                      const playable = playableById[card.id] ?? false;
                      const isReleasedAndPlayable = card.released && playable;
                      const isChainUnlocked = isUnlockedByChain(cardsInOrder, card.id);
                      const locked = !isReleasedAndPlayable || !isChainUnlocked;
                      const coverPath = card.cover?.trim() ? card.cover : 'media/ui/locked-512.webp';
                      const title = locked ? `🔒 ${tStories(card.titleKey)}` : tStories(card.titleKey);
                      const lockedDescription = locked && !isReleasedAndPlayable
                        ? tStories('list.locked.comingSoon', { defaultValue: 'Kommt bald ✨' })
                        : null;
                      const description = lockedDescription ?? tStories(card.descriptionKey);
                      const epNum = parseInt(card.episodeId.replace(/.*e(\d+)$/i, '$1'));
                      const episodeLabel = !isNaN(epNum) ? `E${String(epNum).padStart(2, '0')}` : undefined;
                      return (
                        <div key={card.id} className="snap-start shrink-0 w-[78%] sm:w-[44%] lg:w-[320px]">
                          <CourseCard
                            compact
                            locked={locked}
                            image={assetUrl(coverPath)}
                            title={title}
                            description={description}
                            progressPercent={locked ? 0 : (progressById[card.id] ?? 0)}
                            episodeLabel={episodeLabel}
                            onClick={() => {
                              if (locked) return;
                              navigate(card.storyEngine === 'v2' ? `/stories-v02/${card.id}` : `/stories/${card.id}`);
                            }}
                          />
                        </div>
                      );
                    })}
                  </SwipeRow>
                </div>
              </>
            )}
          </Panel>
        );
      })()}



{/* MEHR VON YASMIN, CARLOS & CO – character-driven world panel */}
{(() => {
  const characterCards = [
    {
      character: 'amy',
      img: 'media/story/characters/amy-512.webp',
      label: 'Amy',
      tag: '💬 Weiterdenken',
      hook: 'Manche Fragen stellt dir niemand. Ich schon.',
      firstPerson: true,
      badgeEmoji: '🎮',
      badgeLabel: 'Story starten',
      to: '/stories',
      accentFrom: 'from-violet-50',
      accentTo: 'to-indigo-50',
      accentBorder: 'border-violet-100',
      accentText: 'text-violet-700',
    },
    {
      character: 'chioma',
      img: 'media/story/characters/chioma-512.webp',
      label: 'Chioma',
      tag: '📰 Zeitung',
      hook: 'Ich will wissen, was wirklich stimmt. Du auch?',
      firstPerson: true,
      badgeEmoji: '📰',
      badgeLabel: 'Schülerzeitung',
      to: '/newspaper',
      accentFrom: 'from-sky-50',
      accentTo: 'to-cyan-50',
      accentBorder: 'border-sky-100',
      accentText: 'text-sky-700',
    },
    {
      character: 'carlos',
      img: 'media/story/characters/carlos-512.webp',
      label: 'Carlos',
      tag: '📚 Lexikon',
      hook: 'Algorithmus. Filterblase. Fake News. Ich erkläre, was wirklich dahintersteckt.',
      firstPerson: true,
      badgeEmoji: '📚',
      badgeLabel: 'Lexikon',
      to: '/lexikon',
      accentFrom: 'from-teal-50',
      accentTo: 'to-emerald-50',
      accentBorder: 'border-teal-100',
      accentText: 'text-teal-700',
    },
    {
      character: 'yasmin',
      img: 'media/story/characters/yasmin-512.webp',
      label: 'Yasmin',
      tag: '📔 Tagebuch',
      hook: 'Was ich aufschreibe, sage ich niemandem. Außer dir.',
      firstPerson: true,
      badgeEmoji: '📔',
      badgeLabel: 'Tagebuch',
      to: '/diaries',
      accentFrom: 'from-amber-50',
      accentTo: 'to-orange-50',
      accentBorder: 'border-amber-100',
      accentText: 'text-amber-700',
    },
    {
      character: 'igor',
      img: 'media/story/characters/igor-512.webp',
      label: 'Igor',
      tag: '🎴 Freundebuch',
      hook: 'Ich hab mehr zu sagen als du denkst. Schau in meine Karte.',
      firstPerson: true,
      badgeEmoji: '🎴',
      badgeLabel: 'Freundebuch',
      to: '/cards',
      accentFrom: 'from-rose-50',
      accentTo: 'to-pink-50',
      accentBorder: 'border-rose-100',
      accentText: 'text-rose-700',
    },
  ];

  return (
    <Panel
      kicker="Story-Welt"
      title="Mehr von Yasmin, Carlos & Co."
    >
      <div className="mt-2">
        {/* Mobile: horizontal swipe */}
        <div className="lg:hidden -mx-4 px-4">
          <SwipeRow>
            {characterCards.map((c) => (
              <div key={c.character} className="snap-start shrink-0 w-[56%] sm:w-[38%]">
                <Link
                  to={c.to}
                  className={`flex flex-col rounded-2xl border ${c.accentBorder} bg-gradient-to-b ${c.accentFrom} via-white ${c.accentTo} shadow-sm overflow-hidden h-full hover:shadow-md transition-shadow`}
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={assetUrl(c.img)}
                      alt={c.label}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-600 shadow-sm">
                      {c.tag}
                    </div>
                  </div>
                  <div className="px-3 py-3 flex flex-col gap-2 flex-1">
                    <p className="text-sm text-slate-700 leading-snug italic flex-1">
                      {c.firstPerson ? `„${c.hook}"` : c.hook}
                    </p>
                    <div className={`inline-flex items-center gap-1 text-xs font-bold ${c.accentText}`}>
                      {c.badgeEmoji} {c.badgeLabel} →
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </SwipeRow>
          <div className="mt-2 text-xs font-semibold text-slate-500">
            {tCommon('swipeHint', { defaultValue: 'Wischen' })}
          </div>
        </div>

        {/* Desktop: 5-column grid */}
        <div className="hidden lg:grid grid-cols-5 gap-4">
          {characterCards.map((c) => (
            <Link
              key={c.character}
              to={c.to}
              className={`flex flex-col rounded-2xl border ${c.accentBorder} bg-gradient-to-b ${c.accentFrom} via-white ${c.accentTo} shadow-sm overflow-hidden hover:shadow-md transition-shadow`}
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src={assetUrl(c.img)}
                  alt={c.label}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-600 shadow-sm">
                  {c.tag}
                </div>
              </div>
              <div className="px-3 py-3 flex flex-col gap-2 flex-1">
                <p className="text-sm text-slate-700 leading-snug italic flex-1">
                  {c.firstPerson ? `„${c.hook}"` : c.hook}
                </p>
                <div className={`inline-flex items-center gap-1 text-xs font-bold ${c.accentText}`}>
                  {c.badgeEmoji} {c.badgeLabel} →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Panel>
  );
})()}






        {/* AMY SURVEY BANNER – erscheint nach ≥3 Kapiteln + ≥3 Tagen */}
        {surveyBannerVisible && (
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-white p-4 sm:p-5 flex items-start gap-3">
            <img
              src={assetUrl('media/story/characters/amy-256.webp')}
              alt="Amy"
              className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0 border-2 border-violet-200"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-violet-700 uppercase tracking-wide">{tStories('survey.amyAsks')}</div>
              <div className="mt-0.5 font-semibold text-slate-900 text-sm">
                {tStories('survey.question')}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {tStories('survey.body')}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={SURVEY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismissSurvey}
                  className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors text-xs"
                >
                  {tStories('survey.cta')}
                </a>
                <button
                  type="button"
                  onClick={snoozeSurvey}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {tStories('survey.snooze')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BETA – Partial-Data Banner (7 days, not finished s1e01) */}
        {betaPartialVisible && (
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-white p-4 flex items-start gap-3">
            <img
              src={assetUrl('media/story/characters/amy-256.webp')}
              alt="Amy"
              className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0 border-2 border-violet-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 font-semibold leading-snug mb-2">
                {tStories('beta.partial.text')}
              </p>
              <div className="flex items-center gap-3">
                {betaPartialSendState === 'idle' && (
                  <button
                    type="button"
                    onClick={handleBetaPartialSend}
                    className="text-xs font-bold text-violet-700 hover:underline"
                  >
                    {tStories('beta.partial.cta')}
                  </button>
                )}
                {betaPartialSendState === 'loading' && (
                  <span className="text-xs text-slate-400">{tStories('beta.completion.sendPreparing')}</span>
                )}
                {betaPartialSendState === 'success' && (
                  <span className="text-xs text-emerald-600 font-semibold">✓</span>
                )}
                <button
                  type="button"
                  onClick={dismissBetaPartial}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  {tStories('beta.partial.dismiss')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SURVEY – Beta-Feedback Banner */}
        <div className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wide">{tStories('survey.betaKicker')}</div>
            <div className="mt-0.5 font-semibold text-slate-900 text-sm sm:text-base">
              {tStories('survey.betaQuestion')}
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-snug">
              {tStories('survey.betaBody')}{' '}
              <span className="text-slate-400">
                {tStories('survey.betaDisclaimer')}
              </span>
            </p>
          </div>
          <a
            href={SURVEY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors text-sm"
          >
            {tStories('survey.cta')}
          </a>
        </div>


      </div>

      {amicBannerVisible && amicBannerInfo && (
        <NewAmicBanner
          info={amicBannerInfo}
          onDismiss={() => setAmicBannerVisible(false)}
        />
      )}

      {/* ⓘ INFO BOTTOM SHEET */}
      {infoOpen && (
        <InfoBottomSheet onClose={() => setInfoOpen(false)}>
          {/* HOW-TO */}
          <Panel
            kicker={tStories('howto.kicker', { defaultValue: 'Kurz erklärt' })}
            title={tStories('howto.title', { defaultValue: 'So nutzt du Amy Surfwing' })}
          >
            <div className="mt-5">
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['1', '2', '3', '4'] as const).map((k, idx) => (
                  <div key={k} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-bold text-slate-400">Step {idx + 1}</div>
                    <div className="mt-1 font-semibold text-slate-900">
                      {tStories(`howto.flow.steps.${k}.title`)}
                    </div>
                    <div className="mt-1 text-sm text-slate-700 leading-snug">
                      {tStories(`howto.flow.steps.${k}.text`)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 font-semibold text-slate-900">
              {tStories('howto.cta', { defaultValue: 'Viel Spaß mit Amy Surfwing! 💬🦉' })}
            </div>
          </Panel>

          {/* GOOD TO KNOW */}
          <Panel
            kicker={tStories('howto.info.kicker', { defaultValue: 'Gut zu wissen' })}
            title={tStories('howto.info.title', { defaultValue: 'Damit du dich gut zurechtfindest' })}
          >
            <div className="mt-2">
              <SwipeRow className="-mx-4 px-4">
                <div className="snap-start shrink-0 w-[78%] sm:w-[44%]">
                  <InfoTile colorIdx={0}
                    title={tStories('howto.info.tiles.order.title', { defaultValue: 'Schritt für Schritt ➡️' })}
                    text={tStories('howto.info.tiles.order.text', { defaultValue: 'Du machst die Kapitel der Reihe nach: erst das nächste, dann geht\u2019s weiter.' })}
                  />
                </div>
                <div className="snap-start shrink-0 w-[78%] sm:w-[44%]">
                  <InfoTile colorIdx={1}
                    title={tStories('howto.info.tiles.reflection.title', { defaultValue: 'Deine Sicht zählt 👁' })}
                    text={tStories('howto.info.tiles.reflection.text', { defaultValue: 'Du formulierst deine eigene Antwort – in deinen Worten. Es geht nicht um richtig oder falsch, sondern darum, deine Gedanken ernst zu nehmen.' })}
                  />
                </div>
                <div className="snap-start shrink-0 w-[78%] sm:w-[44%]">
                  <InfoTile colorIdx={2}
                    title={tStories('howto.info.tiles.retryLock.title', { defaultValue: 'Wenn es nicht passt 🔁' })}
                    text={tStories('howto.info.tiles.retryLock.text', { defaultValue: 'Wenn deine Antwort zu kurz ist oder nicht zur Frage passt, fragt Amy nochmal. Nach 3 Versuchen ist kurz Pause – dann am besten mit Eltern anschauen.' })}
                  />
                </div>
                <div className="snap-start shrink-0 w-[78%] sm:w-[44%]">
                  <InfoTile colorIdx={3}
                    title={tStories('howto.info.tiles.safe.title', { defaultValue: 'Fair & safe ✅' })}
                    text={tStories('howto.info.tiles.safe.text', { defaultValue: 'Beleidigungen, Mobbing oder gefährliche Inhalte gehen nicht. Dann stoppt Amy.' })}
                  />
                </div>
                <div className="snap-start shrink-0 w-[78%] sm:w-[44%]">
                  <InfoTile colorIdx={4}
                    title={tStories('howto.info.tiles.backup.title', { defaultValue: 'Speichern & Backup 💾' })}
                    text={tStories('howto.info.tiles.backup.text', { defaultValue: 'Dein Fortschritt bleibt auf deinem Gerät gespeichert. Wenn du möchtest, kannst du ihn zusätzlich sichern.' })}
                  />
                </div>
                <div className="snap-start shrink-0 w-[78%] sm:w-[44%]">
                  <InfoTile colorIdx={2}
                    title={tStories('howto.info.tiles.coins.title', { defaultValue: 'So bekommst du Coins' })}
                    text={tStories('howto.info.tiles.coins.text', { defaultValue: 'Kapitel spielen → 1 Coin. Episode fertig → +5 Bonus-Coins. 7 Tage am Stück → +2 Extra-Coins ⭐. Mit deinen Coins kannst du im Shop neue Avatar-Looks freischalten.' })}
                  />
                </div>
              </SwipeRow>
            </div>
          </Panel>

          {/* DENKRAUM / TRUST */}
          <Panel
            kicker={tStories('trust.kicker', { defaultValue: 'Vertrauen' })}
            title={tStories('trust.title', { defaultValue: 'Ein sicherer Raum für deine Gedanken' })}
          >
            <p className="text-sm text-slate-700 leading-relaxed">
              {tStories('trust.body', {
                defaultValue:
                  'In Amy Surfwing liest du nicht nur – du denkst mit. Niemand sieht, was du schreibst. Es gibt keine Likes, kein Ranking und keinen Vergleich. Dein Fortschritt bleibt auf deinem Gerät. Hier kannst du in Ruhe überlegen, was du richtig findest – und Schritt für Schritt lernen, selbst gute Entscheidungen zu treffen.',
              })}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Privat 🔒', 'Ohne Ranking 🚫', 'Lokal gespeichert 💾', 'Unterstützende KI 🤝'].map((x, i) => (
                <span key={i} className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
                  {x}
                </span>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">
                {tStories('helpHint.title', { defaultValue: 'Wenn etwas komisch ist…' })}
              </div>
              <p className="mt-1 text-sm text-slate-700">
                {tStories('helpHint.body', {
                  defaultValue: 'Sprich kurz mit einer erwachsenen Person, der du vertraust (z. B. Eltern, Lehrkraft, Schulsozialarbeit).',
                })}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/concept"
                onClick={() => setInfoOpen(false)}
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
              >
                Pädagogisches Konzept →
              </Link>
              <Link
                to="/parents"
                onClick={() => setInfoOpen(false)}
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
              >
                Für Eltern →
              </Link>
            </div>
          </Panel>
        </InfoBottomSheet>
      )}
    </Layout>
  );
}
