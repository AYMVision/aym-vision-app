// src/pages/StoryEpisodeOverview.tsx
// Übersicht aller Amics einer Episode — Einstiegspunkt vor dem Story-Player.

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { getEpisodeMetaByCourseId } from '../content/contentIndex';
import { getPlayableEpisodeV02 } from '../story-v02/content/getPlayableEpisodeV02';
import { hasCompletedChapter, getCompletedChapterCount } from '../progress/storyProgress';
import { getHighestPlayableChapterIndex0 } from '../gating/storyGateHelpers';
import { shouldBypassAll } from '../gating/entitlements';
import { canStartNextNewChapterToday } from '../gating/gateEngine';
import type { StoryChapterV02 } from '../story-v02/types/storyTypes';
import { assetUrl } from '../common/assetUrl';

type Lang = 'de' | 'en';

type ChapterStatus = 'completed' | 'current' | 'time-locked' | 'available' | 'locked';

function chapterStatus(
  chapter: StoryChapterV02,
  courseId: string,
  highestPlayable: number,
  timeGateAllowed: boolean
): ChapterStatus {
  const done = hasCompletedChapter(courseId, chapter.chapterIndex0);
  if (done) return 'completed';
  if (chapter.chapterIndex0 <= highestPlayable) {
    if (chapter.chapterIndex0 === highestPlayable) {
      return timeGateAllowed ? 'current' : 'time-locked';
    }
    return 'available';
  }
  return 'locked';
}

function StatusIcon({ status }: { status: ChapterStatus }) {
  if (status === 'completed') {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-teal-100)] text-[var(--color-teal-700)]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (status === 'current') {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-teal-600)] text-white">
        <svg className="w-4 h-4 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    );
  }
  if (status === 'available') {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500">
        <svg className="w-4 h-4 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    );
  }
  if (status === 'time-locked') {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
        </svg>
      </span>
    );
  }
  // locked
  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path strokeLinecap="round" d="M8 11V7a4 4 0 018 0v4" />
      </svg>
    </span>
  );
}

export default function StoryEpisodeOverview() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('stories');
  const lang: Lang = (i18n.resolvedLanguage ?? i18n.language).startsWith('en') ? 'en' : 'de';

  const episodeMeta = courseId ? getEpisodeMetaByCourseId(courseId) : null;
  const [chapters, setChapters] = useState<StoryChapterV02[] | null>(null);

  useEffect(() => {
    if (!courseId) return;
    getPlayableEpisodeV02(courseId, lang).then((ep) => {
      setChapters(ep?.chapters ?? []);
    });
  }, [courseId, lang]);

  if (!courseId || !episodeMeta) {
    return (
      <Layout>
        <div className="p-6 text-slate-500">{t('overview.notFound', { defaultValue: 'Episode nicht gefunden.' })}</div>
      </Layout>
    );
  }

  const bypass = shouldBypassAll(courseId);
  const highestPlayable = bypass
    ? (chapters?.length ?? 0) - 1
    : getHighestPlayableChapterIndex0(courseId);

  const timeGate = bypass
    ? { allowed: true as const, reason: 'ok' as const, mode: 'bypass' as const }
    : canStartNextNewChapterToday({ maxPerWeek: 5 });
  const timeGateAllowed = timeGate.allowed;

  const completedCount = getCompletedChapterCount(courseId);
  const totalCount = episodeMeta.chapterCount;

  // Aktueller / nächster Amic für den Haupt-CTA
  const currentChapter = chapters?.find(
    (c) => chapterStatus(c, courseId, highestPlayable, timeGateAllowed) === 'current'
  ) ?? null;

  const allDone = completedCount >= totalCount;

  function handleAmicClick(chapter: StoryChapterV02) {
    const s = chapterStatus(chapter, courseId!, highestPlayable, timeGateAllowed);
    if (s === 'locked' || s === 'time-locked') return;
    navigate(`/stories-v02/${courseId}/${chapter.id}`);
  }

  return (
    <Layout>
      <div className="w-full max-w-2xl px-4 sm:px-6 py-6 space-y-5">

        {/* Back */}
        <div>
          <Link
            to="/stories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('overview.back', { defaultValue: 'Alle Storys' })}
          </Link>
        </div>

        {/* Episode-Header */}
        <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="relative h-40 sm:h-70 bg-slate-100">
            <img
              src={assetUrl(episodeMeta.coverImage)}
              alt={t(episodeMeta.titleKey)}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <div className="text-xs font-semibold text-white/80 mb-0.5">
                {t('overview.season', { defaultValue: 'Staffel 1' })}
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                {t(episodeMeta.titleKey)}
              </h1>
            </div>
          </div>

          <div className="px-4 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-slate-600">
                {allDone
                  ? t('overview.allDone', { defaultValue: 'Alle Amics abgeschlossen ✓' })
                  : t('overview.progress', {
                      defaultValue: '{{completed}} von {{total}} Amics',
                      completed: completedCount,
                      total: totalCount,
                    })}
              </div>
              <div className="mt-1.5 h-2 w-40 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-[var(--color-teal-500)] transition-all"
                  style={{ width: `${Math.round((completedCount / Math.max(1, totalCount)) * 100)}%` }}
                />
              </div>
            </div>

            {!allDone && !timeGateAllowed && !currentChapter && (
              <div className="shrink-0 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2 text-right leading-snug">
                {timeGate.reason === 'weekly_limit'
                  ? t('overview.timeLocked.weekly', { defaultValue: 'Ab Montag wieder verfügbar' })
                  : t('overview.timeLocked.daily', { defaultValue: 'Morgen wieder verfügbar' })}
              </div>
            )}
            {currentChapter && !allDone && (
              <button
                type="button"
                onClick={() => navigate(`/stories-v02/${courseId}/${currentChapter.id}`)}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors text-sm"
              >
                {completedCount > 0
                  ? t('overview.ctaContinue', { defaultValue: 'Weiterlesen →' })
                  : t('overview.ctaStart', { defaultValue: 'Starten →' })}
              </button>
            )}
          </div>
        </section>

        {/* Amic-Liste */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
          <div className="px-4 py-3">
            <h2 className="text-sm font-semibold text-[var(--color-teal-900)]">
              {t('overview.listTitle', { defaultValue: 'Deine Amics' })}
            </h2>
          </div>

          {chapters === null ? (
            // Loading skeleton
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              {t('overview.loading', { defaultValue: 'Lade Amics…' })}
            </div>
          ) : chapters.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              {t('overview.noChapters', { defaultValue: 'Keine Amics gefunden.' })}
            </div>
          ) : (
            chapters.map((chapter) => {
              const status = chapterStatus(chapter, courseId, highestPlayable, timeGateAllowed);
              const isClickable = status !== 'locked' && status !== 'time-locked';
              const isCurrent = status === 'current';
              const isTimeLocked = status === 'time-locked';

              return (
                <button
                  key={chapter.id}
                  type="button"
                  disabled={!isClickable}
                  onClick={() => handleAmicClick(chapter)}
                  className={[
                    'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors',
                    isClickable
                      ? 'hover:bg-slate-50 active:bg-slate-100 cursor-pointer'
                      : 'cursor-default opacity-50',
                    isCurrent ? 'bg-[var(--color-teal-50)]' : '',
                  ].join(' ')}
                >
                  {/* Nummer */}
                  <span className="shrink-0 text-xs font-bold text-slate-400 w-6 text-center">
                    {chapter.chapterIndex0 + 1}
                  </span>

                  {/* Titel + Subtitle */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold leading-snug ${isCurrent ? 'text-[var(--color-teal-900)]' : 'text-slate-800'}`}>
                      {chapter.chapterTitle ?? `Amic ${chapter.chapterIndex0 + 1}`}
                      {chapter.chapterSubtitle && (
                        <span className="font-normal text-slate-500"> · {chapter.chapterSubtitle}</span>
                      )}
                    </div>
                    {isCurrent && (
                      <div className="text-xs text-[var(--color-teal-600)] font-medium mt-0.5">
                        {t('overview.currentLabel', { defaultValue: 'Aktuell' })}
                      </div>
                    )}
                    {isTimeLocked && (
                      <div className="text-xs text-amber-600 font-medium mt-0.5">
                        {timeGate.reason === 'weekly_limit'
                          ? t('overview.timeLocked.weekly', { defaultValue: 'Ab Montag wieder verfügbar' })
                          : t('overview.timeLocked.daily', { defaultValue: 'Morgen wieder verfügbar' })}
                      </div>
                    )}
                  </div>

                  {/* Status-Icon */}
                  <StatusIcon status={status} />
                </button>
              );
            })
          )}
        </section>

      </div>
    </Layout>
  );
}
