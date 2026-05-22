// src/components/ChallengeJournal.tsx
// Zeigt alle gesehenen Challenges aus den Stories im Profil.
// Kein Druck, nur Einladung — drei Zustände: offen, angenommen, gemeistert.

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  loadChallengeStatuses,
  updateChallengeDecision,
  markChallengeCompleted,
  type StoredChallengeStatus,
} from '../story-v02/runtime/storyResponseStore';
import { getEpisodeMeta } from '../content/contentIndex';

export default function ChallengeJournal() {
  const { t } = useTranslation(['profile', 'stories']);

  const [challenges, setChallenges] = useState<StoredChallengeStatus[]>(() =>
    loadChallengeStatuses().filter((c) => c.seen)
  );
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  if (challenges.length === 0) return null;

  const completedCount = challenges.filter((c) => c.completed).length;

  function handleAccept(c: StoredChallengeStatus) {
    updateChallengeDecision(c.challengeId, c.courseId, 'accepted');
    setChallenges(loadChallengeStatuses().filter((x) => x.seen));
  }

  function handleComplete(c: StoredChallengeStatus) {
    markChallengeCompleted(c.challengeId, c.courseId);
    setChallenges(loadChallengeStatuses().filter((x) => x.seen));
    setJustCompleted(c.challengeId);
    setTimeout(() => setJustCompleted(null), 3500);
  }

  return (
    <div className="mt-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <div>
            <div className="text-sm font-extrabold text-emerald-900">
              {t('profile:challenges.title', { defaultValue: 'Meine Challenges' })}
            </div>
            <div className="text-xs text-emerald-700 mt-0.5">
              {completedCount > 0
                ? t('profile:challenges.completedCount', {
                    defaultValue: '{{count}} gemeistert ✨',
                    count: completedCount,
                  })
                : t('profile:challenges.subtitle', {
                    defaultValue: 'Dein Abenteuer im echten Leben',
                  })}
            </div>
          </div>
        </div>
      </div>

      {/* Challenge-Karten */}
      <div className="px-3 pb-4 space-y-2">
        {challenges.map((c) => {
          const ep = getEpisodeMeta(c.courseId);
          const episodeLabel = ep
            ? t(ep.titleKey, { ns: 'stories', defaultValue: c.courseId })
            : c.courseId;

          const isCompleted = Boolean(c.completed);
          const isAccepted = c.decision === 'accepted' && !isCompleted;
          const isDeferred = c.decision === 'deferred' && !isCompleted;
          const isOpen = !c.decision && !isCompleted;
          const isJustDone = justCompleted === c.challengeId;

          return (
            <div
              key={c.challengeId}
              className={[
                'rounded-xl border p-3 transition-all',
                isCompleted
                  ? 'bg-emerald-50 border-emerald-200'
                  : isAccepted
                  ? 'bg-white border-emerald-200 shadow-sm'
                  : 'bg-white border-slate-200',
              ].join(' ')}
            >
              {/* Episode-Label */}
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                🎯 {episodeLabel}
              </div>

              {/* Challenge-Text */}
              <div className="text-sm text-slate-800 leading-snug">
                {c.promptText ?? c.challengeId}
              </div>

              {/* Aktionen */}
              <div className="mt-2.5 flex items-center justify-between gap-2">
                {isCompleted ? (
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700">
                    ✨ {t('profile:challenges.stateCompleted', { defaultValue: 'Gemeistert!' })}
                  </span>
                ) : isAccepted ? (
                  <button
                    type="button"
                    onClick={() => handleComplete(c)}
                    className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-emerald-500 active:scale-95 transition-all"
                  >
                    {t('profile:challenges.markDone', { defaultValue: 'Hab\'s gemacht! ✓' })}
                  </button>
                ) : (isDeferred || isOpen) ? (
                  <button
                    type="button"
                    onClick={() => handleAccept(c)}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    {t('profile:challenges.tryNow', { defaultValue: 'Jetzt ausprobieren →' })}
                  </button>
                ) : null}

                {/* Status-Badge rechts */}
                {isAccepted && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {t('profile:challenges.stateAccepted', { defaultValue: 'Angenommen 🌱' })}
                  </span>
                )}
                {(isDeferred || isOpen) && (
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {t('profile:challenges.stateDeferred', { defaultValue: 'Vielleicht später' })}
                  </span>
                )}
              </div>

              {/* Feier-Moment */}
              {isJustDone && (
                <div className="mt-2 rounded-xl bg-emerald-100 border border-emerald-200 px-3 py-2 text-sm font-extrabold text-emerald-800 text-center animate-pulse">
                  🎉 {t('profile:challenges.celebrationText', { defaultValue: 'Wow, du bist großartig!' })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
