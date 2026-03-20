// src/pages/Welcome.tsx
import React, { useMemo } from 'react';
import Layout from '../components/Layout';
import SmartImage from '../components/SmartImage';
import { assetUrl } from '../common/assetUrl';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProgress, getCompletedChapterCount } from '../progress/storyProgress';
import { getStoryCards } from '../content/contentIndex';
import { getPlayableEpisode } from '../content/getPlayableEpisode';
import { useProfile } from '../profile/useProfile';
import { shouldBypassAll } from '../gating/entitlements';

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

function EntryCard({
  kicker,
  title,
  body,
  cta,
  to,
}: {
  kicker: string;
  title: string;
  body: string;
  cta: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="text-xs font-semibold text-[var(--color-teal-600)]">{kicker}</div>
      <div className="mt-2 text-lg font-bold text-slate-900 leading-snug">{title}</div>
      <p className="mt-3 text-sm text-slate-700 leading-relaxed">{body}</p>
      <div className="mt-5 font-semibold text-[var(--color-teal-700)]">{cta}</div>
    </Link>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
const { t, i18n } = useTranslation(['welcome', 'stories']);
const { t: tStories } = useTranslation('stories');
  const lang = (i18n.resolvedLanguage ?? i18n.language).startsWith('en') ? 'en' : 'de';
  const { profile } = useProfile();

  const cardsInOrder = useMemo(() => getStoryCards(), []);
  const cardsForUI = cardsInOrder;

  const playableById = useMemo(() => {
    const m: Record<string, boolean> = {};
    for (const c of cardsForUI) {
      m[c.id] = Boolean(getPlayableEpisode(c.id, lang));
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

  return (
    <Layout>
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* HERO */}
{/* HERO */}
<section className="relative overflow-hidden rounded-3xl border border-white/50 shadow-lg">
  <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[var(--color-teal-50)]" />
  <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[var(--color-teal-200)]/30 blur-2xl" />
  <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[var(--color-teal-300)]/20 blur-2xl" />

  <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch">
    {/* TEXT */}
    <div className="lg:col-span-6 p-6 sm:p-10 lg:pr-6 flex flex-col justify-center">
      <div className="text-xs sm:text-sm font-semibold text-[var(--color-teal-700)]">
        {t('hero.kicker')}
      </div>

      <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
        {t('hero.title')}
      </h1>

      <p className="mt-5 text-sm sm:text-base text-slate-800 leading-relaxed">
        {t('hero.lead')}
      </p>

      <p className="mt-4 text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
        {t('hero.leadEmphasis')}
      </p>

      <p className="mt-5 text-sm sm:text-base text-slate-800 leading-relaxed">
        {t('hero.leadEmphasis2')}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/stories"
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
        >
          {t('hero.ctaPrimary')}
        </Link>

        <Link
          to="/concept"
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
        >
          {t('hero.ctaSecondary')}
        </Link>
      </div>
    </div>

    {/* MEDIA */}
    <div className="lg:col-span-6 relative min-h-[280px] sm:min-h-[340px] lg:min-h-[420px]">
      <video
        className="absolute inset-0 w-full h-full object-cover object-[center_40%] lg:object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/ui/Kids_surfen_smart-poster.jpg"
      >
        <source src="/media/ui/Kids_surfen_smart.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/10 to-transparent lg:from-transparent lg:via-transparent lg:to-transparent pointer-events-none" />
    </div>
  </div>
</section>

        {/* WAS IST AMY SURFWING */}
        <div className="mt-6 sm:mt-8">
          <Panel title={t('about.whatTitle')}>
            <p>{t('about.whatBody')}</p>

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

        {/* CONTINUE / START */}
        <div className="mt-6 sm:mt-8">
          {noAvailableStories ? (
            <Panel
              kicker={tStories('comingSoon.kicker', { defaultValue: 'Bald geht’s los' })}
              title={tStories('comingSoon.title', { defaultValue: 'Neue Stories kommen bald ✨' })}
            >
              <p className="text-sm text-slate-700">
                {tStories('comingSoon.text', {
                  defaultValue: 'Im Moment ist noch keine Story freigeschaltet. Schau bald wieder vorbei!',
                })}
              </p>
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
                    <img
                      src={assetUrl(currentCard.cover?.trim() ? currentCard.cover : 'media/ui/locked-1024.webp')}
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
                      onClick={() => navigate(`/stories/${currentCard.id}`)}
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

        {/* EINSTIEG */}
        <div className="mt-6 sm:mt-8">
          <Panel kicker={t('entries.kicker')} title={t('entries.title')}>
            <p>{t('entries.body')}</p>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
              <EntryCard
                kicker={t('entries.cards.0.kicker')}
                title={t('entries.cards.0.title')}
                body={t('entries.cards.0.body')}
                cta={t('entries.cards.0.cta')}
                to="/parents"
              />

              <EntryCard
                kicker={t('entries.cards.1.kicker')}
                title={t('entries.cards.1.title')}
                body={t('entries.cards.1.body')}
                cta={t('entries.cards.1.cta')}
                to="/concept"
              />

              <EntryCard
                kicker={t('entries.cards.2.kicker')}
                title={t('entries.cards.2.title')}
                body={t('entries.cards.2.body')}
                cta={t('entries.cards.2.cta')}
                to="/stories"
              />
            </div>
          </Panel>
        </div>
      </div>
    </Layout>
  );
}