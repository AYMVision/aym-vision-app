import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../profile/useProfile';
import { getEpisodeMeta } from '../content/contentIndex';
import { assetUrl } from '../common/assetUrl';

export default function ProfileProgressCard({
  compact = false,
  noCard = false,
}: {
  compact?: boolean;
  noCard?: boolean;
}) {
  const { profile } = useProfile();
  const { t } = useTranslation(['profile', 'stories']);

  const cur = profile.progress?.current;

  const outerClass = noCard ? '' : compact ? '' : 'mt-6';
  const cardClass = noCard
    ? ''
    : compact
    ? 'rounded-2xl border border-black/5 bg-slate-50 p-3 h-full'
    : 'rounded-2xl border border-black/5 bg-white shadow-sm p-4 h-full';

  const wrap = (inner: React.ReactNode) => {
    if (noCard) return <div className="h-full">{inner}</div>;
    return (
      <div className={outerClass}>
        <div className={cardClass}>{inner}</div>
      </div>
    );
  };

  if (!cur) {
    return wrap(
      <>
        <div className="text-sm text-slate-500">
          {t('profile:progress.title', { defaultValue: 'Dein Fortschritt' })}
        </div>
        <div className="mt-3 text-sm font-semibold text-anthracite-900">
          {t('profile:progress.empty', { defaultValue: 'Starte deine erste Folge ✨' })}
        </div>

        {!compact && (
          <div className="mt-5">
            <Link
              to="/stories"
              className="text-xs px-3 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t('profile:progress.openStories', { defaultValue: 'Zur Story →' })}
            </Link>
          </div>
        )}
      </>
    );
  }

  const ep = getEpisodeMeta(cur.episodeId);

  if (!ep) {
    return wrap(
      <>
        <div className="text-xs font-semibold text-amber-800">
          {t('profile:progress.debugTitle', { defaultValue: 'Dein Fortschritt (Debug)' })}
        </div>
        <div className="mt-1 text-sm font-semibold text-amber-900">
          {t('profile:progress.debugMissingEpisode', {
            defaultValue: 'Folge-Metadaten nicht gefunden',
          })}
        </div>
        <div className="mt-1 text-xs text-amber-800">
          episodeId: <span className="font-mono">{cur.episodeId}</span>
        </div>
        <div className="mt-1 text-xs text-amber-700">
          {t('profile:progress.debugHint', {
            defaultValue: 'Tipp: Prüfe, ob getEpisodeMeta() diese ID kennt.',
          })}
        </div>
      </>
    );
  }

  const total = ep.chapterCount;

  const completed = useMemo(() => {
    let c = 0;
    for (let i = 1; i <= total; i++) {
      const id = String(i).padStart(2, '0');
      const key = `${cur.seasonId}:${cur.episodeId}:c${id}`;
      if (profile.progress?.completedChapters?.[key]) c++;
    }
    return c;
  }, [profile.progress?.completedChapters, cur.seasonId, cur.episodeId, total]);

  const currentShown = Math.min(cur.chapterIndex, total);
  const remaining = Math.max(0, total - completed);

  const teaser =
    remaining === 0
      ? t('profile:progress.doneTeaser', { defaultValue: 'Wow! Folge geschafft 🎉' })
      : remaining === 1
      ? t('profile:progress.oneLeft', { defaultValue: 'Noch 1 Chapter bis zum Sticker ✨' })
      : t('profile:progress.manyLeft', {
          defaultValue: 'Noch {{count}} Chapter bis zum Sticker',
          count: remaining,
        });

  return wrap(
    <>
      <div className="flex items-center gap-3">
        <img
          src={assetUrl(ep.coverImage)}
          alt=""
          className={
            compact
              ? 'w-30 h-30 rounded-2xl object-cover border border-slate-200'
              : 'w-30 h-30 rounded-2xl object-cover border border-slate-200'
          }
        />

        <div className="min-w-0 flex-1">
          <div className="text-sm text-slate-500">
            {t('profile:progress.title', { defaultValue: 'Dein Fortschritt' })}
          </div>
         <div className="text-sm font-semibold text-anthracite-900 truncate">
  {t(ep.titleKey, { defaultValue: ep.episodeId })}
</div>

          <div className="mt-1 flex items-center justify-between">
            <div className="text-xs text-slate-600">
              {t('profile:progress.chapterLabel', { defaultValue: 'Chapter' })}
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              {currentShown}
              <span className="text-xs font-semibold text-slate-500"> / {total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar value={completed} total={total} />
        <div className="mt-2 text-xs text-slate-500">{teaser}</div>
      </div>

      {!compact && (
        <div className="mt-5">
          <Link
            to={`/stories/${cur.episodeId}`}
            className="text-xs px-3 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('profile:progress.continue', { defaultValue: 'Weiterlesen →' })}
          </Link>
        </div>
      )}
    </>
  );
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
      <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
    </div>
  );
}