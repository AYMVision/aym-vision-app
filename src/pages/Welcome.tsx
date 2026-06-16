// src/pages/Welcome.tsx
import React, { useMemo, useRef, useState } from 'react';
import Layout from '../components/Layout';
import BetaBanner from '../components/BetaBanner';
import PwaTransferBanner from '../components/PwaTransferBanner';
import { TransferStaleBanner } from '../components/TransferStaleWarning';
import { assetUrl } from '../common/assetUrl';
import SmartImage from '../components/SmartImage';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProgress, getCompletedChapterCount } from '../progress/storyProgress';
import { getStoryCards } from '../content/contentIndex';
import { isEpisodeAvailable } from '../story-v02/content/getPlayableEpisodeV02';
import { useProfile } from '../profile/useProfile';
import { shouldBypassAll } from '../gating/entitlements';
import { shouldSkipOnboarding } from '../common/firstRun';
import { loadStore } from '../analytics/analyticsStore';
import { BONUS_INDEX } from '../bonus/bonusIndex';
import { loadSeenBonusIds } from '../bonus/bonusSeen';
import { isBonusUnlocked, isCharacterUnlockedByProgress } from '../bonus/bonusUnlock';
import type { BonusProgressSnapshot } from '../bonus/bonusUnlock';
import { CHARACTERS } from '../content/characters';

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm font-semibold bg-white/80 border border-white/60 text-[var(--color-teal-900)] backdrop-blur">
      {children}
    </span>
  );
}

function Panel({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
      {kicker ? (
        <div className="text-xs font-semibold text-[var(--color-teal-600)]">{kicker}</div>
      ) : null}
      <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
        {title}
      </h2>
      <div className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}


function EmmaTeaserVideo() {
  const { t } = useTranslation('welcome');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleSound() {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next && v.paused) v.play();
    setMuted(next);
  }

  return (
    <div className="mt-6 lg:hidden">
      {/* Nur Mobile */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-black"
        style={{ aspectRatio: '9/16' }}>
        <video
          ref={videoRef}
          src={assetUrl('media/ui/brand/emma_12_jahre_alt_web.mp4')}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Ton-Button unten rechts im Video */}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted
            ? t('teaser.soundOn', { defaultValue: 'Ton einschalten' })
            : t('teaser.soundOff', { defaultValue: 'Ton ausschalten' })
          }
          className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-2 hover:bg-black/80 transition-colors"
        >
          {muted ? '🔇' : '🔊'}
          <span>{muted
            ? t('teaser.soundOn', { defaultValue: 'Ton ein' })
            : t('teaser.soundOff', { defaultValue: 'Ton aus' })
          }</span>
        </button>
      </div>
    </div>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
const { t, i18n } = useTranslation(['welcome', 'stories', 'common', 'bonus']);
const { t: tStories } = useTranslation('stories');
const { t: tCommon } = useTranslation('common');
const { t: tBonus } = useTranslation('bonus');
  const lang = (i18n.resolvedLanguage ?? i18n.language).startsWith('en') ? 'en' : 'de';
  const { profile } = useProfile();

  const cardsInOrder = useMemo(() => getStoryCards(), []);
  const cardsForUI = cardsInOrder;

  const playableById = useMemo(() => {
    const m: Record<string, boolean> = {};
    for (const c of cardsForUI) {
      m[c.id] = isEpisodeAvailable(c.id, lang);
    }
    return m;
  }, [cardsForUI, lang]);

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

  // Einmal berechnen — ändert sich nie innerhalb einer Session
  const [isFirstTime] = useState(() => !shouldSkipOnboarding());

  // Personalisierte Begrüßung
  const greeting = (() => {
    const name = profile.chatName?.trim();
    const hour = new Date().getHours();
    const timeGreet = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Hallo' : 'Guten Abend';

    // Rückkehr nach Pause: letzte Aktivität > 3 Tage
    const lastSeenStr = loadStore().meta?.lastSeen ?? '';
    const lastSeenDate = lastSeenStr ? new Date(lastSeenStr).getTime() : 0;
    const daysSince = lastSeenDate ? (Date.now() - lastSeenDate) / (1000 * 60 * 60 * 24) : 0;
    if (!isFirstTime && daysSince > 3) {
      return name
        ? `Willkommen zurück, ${name}! Mia hat auf dich gewartet.`
        : 'Willkommen zurück! Mia hat auf dich gewartet.';
    }

    if (!isFirstTime) {
      return name
        ? `${timeGreet}, ${name}! Amy hat schon auf dich gewartet.`
        : `${timeGreet}! Amy hat schon auf dich gewartet.`;
    }

    return 'Hallo! Ich bin Amy. Ich freue mich auf dich.';
  })();

  // BonusProgressSnapshot aus Profil (identisch zu Cards.tsx)
  const bonusProgress = useMemo<BonusProgressSnapshot>(() => {
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
  }, [profile]);

  // Nur abgeschlossene Kapitel — für Charakterfreischaltung (kein current-Chapter)
  const completedChapterProgress = useMemo<BonusProgressSnapshot>(() => {
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
  }, [profile]);

  // Charakterkreise (alle außer Amy — freigeschaltete klickbar, gesperrte gedimmt)
  const charCircles = useMemo(() => {
    if (isFirstTime) return [];
    const seenIds = new Set(loadSeenBonusIds());
    return BONUS_INDEX
      .filter((item) => item.category === 'characters')
      .map((item) => {
        const charId = item.characterId as keyof typeof CHARACTERS | undefined;
        const char = charId ? CHARACTERS[charId] : undefined;
        if (!char?.card?.portrait) return null;
        const unlocked = isCharacterUnlockedByProgress(item, completedChapterProgress);
        return {
          bonusId: item.bonusId,
          name: char.name,
          portrait: char.card.portrait,
          isNew: unlocked && !seenIds.has(item.bonusId),
          unlocked,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [isFirstTime, bonusProgress]);

  // Tägliche Content-Kachel (rotiert einmal pro Tag, nur freigeschaltete Inhalte)
  const dailyContentCard = useMemo(() => {
    if (isFirstTime) return null;
    const seenIds = new Set(loadSeenBonusIds());

    type CardCandidate = {
      path: string;
      portrait: string;
      label: string;
      title: string;
      accent: string;
    };

    const candidates: CardCandidate[] = [];

    // 1. Neuester ungelesener Zeitungsartikel (freigeschaltet)
    const unreadPaper = BONUS_INDEX
      .filter((item) =>
        item.category === 'newspaper' &&
        item.released &&
        isBonusUnlocked(item, bonusProgress) &&
        !seenIds.has(item.bonusId)
      )
      .sort((a, b) => b.order - a.order)[0];
    if (unreadPaper) {
      candidates.push({
        path: `/newspaper/${unreadPaper.bonusId}`,
        portrait: 'media/story/characters/chioma-256.webp',
        label: 'Chioma · Schülerzeitung',
        title: unreadPaper.titleKey
          ? tBonus(unreadPaper.titleKey.replace(/^bonus:/, ''))
          : 'Neues aus der Schülerzeitung',
        accent: 'bg-rose-400',
      });
    }

    // 2. Ungelesenes Tagebuch (freigeschaltet)
    const unreadDiary = BONUS_INDEX
      .filter((item) =>
        item.category === 'diaries' &&
        item.released &&
        isBonusUnlocked(item, bonusProgress) &&
        !seenIds.has(item.bonusId)
      )[0];
    if (unreadDiary) {
      const diaryCharId = unreadDiary.bonusId.replace('diary_', '');
      const diaryChar = (CHARACTERS as Record<string, { name: string }>)[diaryCharId];
      const diaryName = diaryChar?.name ?? 'Yasmin';
      candidates.push({
        path: `/diaries/${unreadDiary.bonusId}`,
        portrait: unreadDiary.coverImage ?? 'media/story/characters/yasmin-256.webp',
        label: `${diaryName} · Tagebuch`,
        title: 'Schau rein – ein neuer Tagebucheintrag wartet auf dich.',
        accent: 'bg-violet-400',
      });
    }

    // 3. Neu freigeschaltete Charakterkarte (noch nicht gesehen)
    const newChar = BONUS_INDEX
      .filter((item) =>
        item.category === 'characters' &&
        isBonusUnlocked(item, bonusProgress) &&
        !seenIds.has(item.bonusId)
      )[0];
    if (newChar) {
      const charId = newChar.characterId as keyof typeof CHARACTERS | undefined;
      const char = charId ? CHARACTERS[charId] : undefined;
      if (char?.card?.portrait) {
        candidates.push({
          path: `/cards/${newChar.bonusId}`,
          portrait: char.card.portrait,
          label: `${char.name} · Sammelkarte`,
          title: `${char.name}s Karte ist neu freigeschaltet!`,
          accent: 'bg-amber-400',
        });
      }
    }

    if (candidates.length === 0) return null;

    // Tagesbasierte Rotation — jeden Tag dieselbe Karte, morgen eine andere
    const today = new Date();
    const day = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return candidates[day % candidates.length];
  }, [isFirstTime, bonusProgress, tBonus]);

  return (
    <Layout>
      <BetaBanner />
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <PwaTransferBanner />
        <TransferStaleBanner />
{/* HERO */}
<section className="relative overflow-hidden rounded-3xl border border-white/50 shadow-lg bg-white">
  
  {/* Hintergrund-Verlauf (sehr subtil) */}
  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-teal-50)] via-white to-white" />

  {/* Grüner Glow NUR oben links */}
  <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[var(--color-teal-200)]/30 blur-2xl" />



  <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch">
    {/* TEXT */}
<div className="lg:col-span-7 p-6 pb-2 sm:p-10 lg:pr-10 flex flex-col justify-center">
      {/* Personalisierte Begrüßung */}
      <div className="flex items-center gap-2 mb-3">
        <img
          src={assetUrl('media/story/characters/amy-256.webp')}
          alt="Amy"
          className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0 border-2 border-teal-100"
        />
        <span className="text-sm font-semibold text-[var(--color-teal-700)]">
          {greeting}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
        {t('hero.title')}
      </h1>

      <p className="mt-3 text-sm sm:text-base text-slate-800 leading-relaxed">
        {t('hero.lead')}
      </p>
      <p className="mt-2 text-sm sm:text-base text-slate-800 leading-relaxed">
        {t('hero.leadEmphasis')}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge>🎓 {t('hero.badgeAge', { defaultValue: 'Für Kinder ab 9 Jahren' })}</Badge>
        <Badge>⏱️ {t('hero.badgeTime', { defaultValue: '5 min täglich' })}</Badge>
        <Badge>🦉 {t('hero.badgeAmy', { defaultValue: 'Chat-Story & mehr' })}</Badge>
        <Badge>🧪 {t('hero.badgeBeta', { defaultValue: 'Beta' })}</Badge>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {isFirstTime ? (
          /* Erstbesuch: primärer Button + Eltern-Link */
          <>
            <Link
              to="/start"
              className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
            >
              {t('hero.introCta')}
            </Link>
            <Link
              to="/parents"
              className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </>
        ) : (
          /* Wiederkehrende Nutzer: zwei Buttons wie bisher */
          <>
            <Link
              to="/stories"
              className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
            >
              {t('hero.ctaPrimary')}
            </Link>

            {currentCard ? (
              <Link
                to={currentCard.storyEngine === 'v2' ? `/stories-v02/${currentCard.id}` : `/stories/${currentCard.id}`}
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
              >
                {hasStarted
                  ? t('hero.ctaContinue', { defaultValue: 'Weiterlesen →' })
                  : t('hero.ctaStart', { defaultValue: 'Story starten →' })}
              </Link>
            ) : (
              <Link
                to="/parents"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
              >
                {t('hero.ctaSecondary')}
              </Link>
            )}
          </>
        )}
      </div>

      <p className="mt10 text-xs text-slate-500">
      </p>
    </div>

    {/* MEDIA */}
<div className="lg:col-span-5 relative -mt-6 sm:mt-0 min-h-[380px] sm:min-h-[440px] lg:min-h-[420px] overflow-hidden">
      <video
         className="absolute inset-0 w-full h-full object-contain scale-85"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/ui/Kids_surfen_smart-poster.jpg"
      >
        <source src="/media/ui/Kids_surfen_smart.mp4" type="video/mp4" />
      </video>

      {/* sanfter Übergang zur Textseite */}

      {/* NBank Siegel — rechts unten im Hero */}
      <div className="absolute bottom-4 right-4 z-10">
        <a
          href="https://www.nbank.de"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-90 hover:opacity-100 transition-opacity block"
          aria-label="NBank Gründungsstipendium"
        >
          <img
            src={assetUrl('media/ui/Siegel_Gründungsstipendium_Start-up_2024.png')}
            alt="Gründungsstipendium Start-up 2025/2026 – NBank"
            className="h-20 w-auto drop-shadow-sm"
            loading="lazy"
          />
        </a>
      </div>

    </div>
  </div>
</section>

        {/* ── MARKETING VIDEO — nur für Erstbesucher ── */}
        {isFirstTime && <EmmaTeaserVideo />}

        {/* WAS IST AMY SURFWING — nur für Erstbesucher */}
        {isFirstTime && (
          <div className="mt-6 sm:mt-8">
            <Panel title={t('about.whatTitle')}>
              <p>{t('about.whatBody1')}</p>
              <p className="mt-2">{t('about.whatBody2')}</p>

              <div className="mt-5 font-semibold text-slate-900">
                {t('about.uspTitle')}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(['0', '1', '2', '3', '4', '5'] as const).map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 text-slate-700"
                  >
                    {t(`about.principles.${k}`)}
                  </span>
                ))}
              </div>

              <div className="mt-5">
                <Link
                  to="/parents"
                  className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
                >
                  {t('about.ctaParents')}
                </Link>
              </div>
            </Panel>
          </div>
        )}

        {/* CONTINUE / START */}
        <div className="mt-6 sm:mt-8">
          {noAvailableStories ? (
            <Panel
              kicker={tStories('comingSoon.kicker', { defaultValue: "Bald geht's los" })}
              title={tStories('comingSoon.title', { defaultValue: 'Neue Stories kommen bald ✨' })}
            >
              <p className="text-sm text-slate-700">
                {tStories('comingSoon.text', {
                  defaultValue: 'Im Moment ist noch keine Story freigeschaltet. Schau bald wieder vorbei!',
                })}
              </p>
            </Panel>
          ) : isFirstTime ? (
            <Panel kicker={t('hero.introKicker')} title={t('episodes.s1e01.title', { ns: 'stories', defaultValue: 'Wirbel am Wasserfall' })}>
              <div className="mt-2 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-4">
                  <div className="aspect-[16/10] max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <SmartImage
                      fallback={assetUrl('media/story/episodes/s1e01/s1e01-512.webp')}
                      alt={t('episodes.s1e01.title', { ns: 'stories', defaultValue: 'Wirbel am Wasserfall' })}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-500">{t('hero.introLabel')}</div>
                    <div className="mt-1 text-lg font-extrabold text-slate-900 leading-snug">
                      {t('episodes.s1e01.title', { ns: 'stories', defaultValue: 'Wirbel am Wasserfall' })}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {t('episodes.s1e01.description', { ns: 'stories', defaultValue: '' })}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-slate-500">{t('hero.introHint')}</div>
                    <Link
                      to="/start"
                      className="mt-3 w-full inline-flex items-center justify-center gap-2.5 rounded-2xl px-5 py-3 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
                    >
                      <img
                        src={assetUrl('media/story/characters/yasmin-256.webp')}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover object-top border border-white/40"
                      />
                      Los geht's →
                    </Link>
                  </div>
                </div>
              </div>
            </Panel>
          ) : currentCard ? (
            <Panel
              kicker={
                hasStarted
                  ? tStories('continue.kicker', { defaultValue: 'Weiterlesen' })
                  : tStories('start.kicker', { defaultValue: 'Jetzt starten' })
              }
              title={
                hasStarted
                  ? tStories('continue.title', { defaultValue: 'Mach da weiter, wo du aufgehört hast' })
                  : tStories('start.title', { defaultValue: 'Eine Woche kostenfrei' })
              }
            >
              <div className="mt-2 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-4">
                  <div className="aspect-[16/10] max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <SmartImage
                      fallback={assetUrl(currentCard.cover?.trim() ? currentCard.cover : 'media/ui/locked-1024.webp')}
                      alt={tStories('continue.imageAlt', { defaultValue: 'Aktuelle Story' })}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-500">
                      {hasStarted
                        ? tStories('continue.label', { defaultValue: 'Aktuell' })
                        : tStories('start.label', { defaultValue: 'Neu für dich' })}
                    </div>

<div className="mt-1 text-lg font-extrabold text-slate-900 leading-snug">
  {t(currentCard.titleKey, { ns: 'stories', defaultValue: currentCard.titleKey })}
</div>

<div className="mt-1 text-sm text-slate-600">
  {t(currentCard.descriptionKey, { ns: 'stories', defaultValue: currentCard.descriptionKey })}
</div>
                  </div>

                  <div className="mt-4">
                    {hasStarted ? (
                      <>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <span>{tStories('continue.progress', { defaultValue: 'Fortschritt' })}</span>
                          <span>{currentPct}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-[#0084ff]"
                            style={{ width: `${currentPct}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-xs font-semibold text-slate-500">
                        {tStories('start.hint', { defaultValue: 'Keine Anmeldung nötig – einfach loslegen.' })}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => navigate(currentCard.storyEngine === 'v2' ? `/stories-v02/${currentCard.id}` : `/stories/${currentCard.id}`)}
                      className="mt-4 w-full inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
                    >
                      {hasStarted
                        ? tStories('continue.cta', { defaultValue: 'Weiterlesen →' })
                        : tStories('start.cta', { defaultValue: 'Jetzt starten →' })}
                    </button>
                  </div>
                </div>
              </div>
            </Panel>
          ) : null}
        </div>

        {/* Story-Circles: alle Charaktere, gesperrte gedimmt */}
        {charCircles.length > 0 && (
          <div className="mt-4">
            <div
              className="flex gap-3 overflow-x-auto pb-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
            >
              {charCircles.map(({ bonusId, name, portrait, isNew, unlocked }) => {
                const inner = (
                  <>
                    <div
                      className={`w-14 h-14 rounded-full p-0.5 ${
                        !unlocked
                          ? 'ring-1 ring-slate-200'
                          : isNew
                          ? 'ring-2 ring-[var(--color-teal-500)] ring-offset-1'
                          : 'ring-1 ring-slate-300'
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <img
                          src={assetUrl(portrait)}
                          alt={name}
                          className={`w-full h-full rounded-full object-cover object-top ${
                            unlocked ? '' : 'opacity-60'
                          }`}
                        />
                        </div>
                    </div>
                    <span className={`text-[10px] font-medium text-center max-w-[56px] truncate ${unlocked ? 'text-slate-500' : 'text-slate-300'}`}>
                      {name}
                    </span>
                  </>
                );
                return unlocked ? (
                  <Link
                    key={bonusId}
                    to={`/cards/${bonusId}`}
                    className="flex flex-col items-center gap-1 flex-shrink-0"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={bonusId} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-default">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tägliche Content-Kachel: rotiert zwischen Zeitung, Tagebuch, Sammelkarte */}
        {dailyContentCard && (
          <div className="mt-3">
            <Link
              to={dailyContentCard.path}
              className="relative flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Farbiger Akzentstreifen links */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${dailyContentCard.accent}`} />
              <img
                src={assetUrl(dailyContentCard.portrait)}
                alt=""
                className="w-16 h-16 rounded-full object-cover object-top border-2 border-white shadow-sm flex-shrink-0"
              />
              <div className="flex-1 min-w-0 pl-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-white bg-rose-500 rounded-full px-2 py-0.5 leading-tight">
                    NEU
                  </span>
                  <span className="text-xs text-slate-400">{dailyContentCard.label}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {dailyContentCard.title}
                </p>
                <p className="mt-1.5 text-xs font-semibold text-[var(--color-teal-600)]">
                  Jetzt lesen →
                </p>
              </div>
            </Link>
          </div>
        )}

      </div>
    </Layout>
  );
}