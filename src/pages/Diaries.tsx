// src/pages/Diaries.tsx
import React, { useMemo } from 'react';
import Layout from '../components/Layout';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


import { BONUS_INDEX, type BonusItem } from '../bonus/bonusIndex';
import { useProfile } from '../profile/useProfile';
import { isBonusUnlocked, type BonusProgressSnapshot } from '../bonus/bonusUnlock';
import { isBonusSeen, markBonusSeen } from '../bonus/bonusSeen';
import { assetUrl } from '../common/assetUrl';
import { cn } from '../common/utils';
import AvatarLookCircle from '../components/AvatarLookCircle';
import type { Equipment } from '../profile/types';

type LocationState = { backTo?: string; backgroundLocation?: unknown } | null;

function useBonusProgressFromProfile(): BonusProgressSnapshot {
  const { profile } = useProfile();
  const completed = profile.progress?.completedChapters ?? {};
  return { seenChapterIds: Object.keys(completed) };
}

type DiaryBookItem = BonusItem & { category: 'diaries' };

function isDiaryBookItem(i: BonusItem): i is DiaryBookItem {
  return i.category === 'diaries';
}

function normalizeChapterIdMaybe(id: string): string[] {
  const raw = String(id || '').trim();
  if (!raw) return [];

  if (raw.includes(':')) return [raw];

  const m = raw.match(/^s(\d+)e(\d{1,2})c(\d{1,2})$/i);
  if (!m) return [raw];

  const season = `s${Number(m[1])}`;
  const epNum = String(Number(m[2])).padStart(2, '0');
  const chNum = String(Number(m[3])).padStart(2, '0');
  const episodeId = `${season}e${epNum}`;
  const normalized = `${season}:${episodeId}:c${chNum}`;

  return [raw, normalized];
}

function isDiaryUnlocked(item: DiaryBookItem, progress: BonusProgressSnapshot): boolean {
  if (item.bonusId === 'diary_me') return true;

  const byRule = isBonusUnlocked(item, progress);
  const bySeen = isBonusSeen(item.bonusId);

  const unlock = item.unlockedBy;
  if (unlock?.type === 'chapter') {
    const candidates = normalizeChapterIdMaybe(unlock.id);
    const byChapter = candidates.some((c) => progress.seenChapterIds.includes(c));
    return byRule || bySeen || byChapter;
  }

  return byRule || bySeen;
}

function toneForDiary(bonusId: string) {
  if (bonusId === 'diary_yasmin') {
    return {
      bg: 'bg-gradient-to-br from-rose-50 via-white to-pink-50',
      border: 'border-rose-200',
      chip: 'bg-rose-100 text-rose-900',
      title: 'text-rose-950',
      accent: 'bg-rose-300',
      emoji: '💗',
    };
  }
  if (bonusId === 'diary_mia') {
    return {
      bg: 'bg-gradient-to-br from-amber-50 via-white to-yellow-50',
      border: 'border-amber-200',
      chip: 'bg-amber-100 text-amber-900',
      title: 'text-amber-950',
      accent: 'bg-amber-300',
      emoji: '🌟',
    };
  }
  if (bonusId === 'diary_jonas') {
    return {
      bg: 'bg-gradient-to-br from-sky-50 via-white to-cyan-50',
      border: 'border-sky-200',
      chip: 'bg-sky-100 text-sky-900',
      title: 'text-sky-950',
      accent: 'bg-sky-300',
      emoji: '🧠',
    };
  }
  return {
    bg: 'bg-gradient-to-br from-[var(--color-teal-50)] via-white to-emerald-50',
    border: 'border-[var(--color-teal-200)]',
    chip: 'bg-[var(--color-teal-100)] text-[var(--color-teal-900)]',
    title: 'text-[var(--color-teal-950)]',
    accent: 'bg-[var(--color-teal-300)]',
    emoji: '📔',
  };
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

function StoryDiaryTile(props: {
  title: string;
  desc: string;
  locked: boolean;
  to: string;
  onOpen?: () => void;
  tone: ReturnType<typeof toneForDiary>;
  preview: React.ReactNode;
  badgeText: string;
  ctaText: string;
}) {
  const { title, desc, locked, to, onOpen, tone, preview, badgeText, ctaText } = props;

  return (
    <Link
      to={locked ? '#' : to}
      aria-disabled={locked}
      onClick={(e) => {
        if (locked) {
          e.preventDefault();
          return;
        }
        onOpen?.();
      }}
      className={cn('block group', locked ? 'cursor-not-allowed' : 'cursor-pointer')}
    >
      <div
        className={cn(
          'rounded-2xl border shadow-sm overflow-hidden transition',
          tone.bg,
          tone.border,
          locked ? 'opacity-65' : 'hover:shadow-md'
        )}
      >
        <div className={cn('h-2', tone.accent)} />

        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-[76px_1fr] sm:grid-cols-[84px_1fr] gap-3 items-start">
            <div className="rounded-2xl overflow-hidden border border-white/70 bg-white/70 shadow-sm h-[76px] sm:h-[84px] flex items-center justify-center">
              {preview}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn('inline-flex items-center rounded-full px-2 py-1 text-[10px] font-extrabold', tone.chip)}>
                  {badgeText}
                </span>
              </div>

              <div className={cn('mt-2 text-sm sm:text-base font-extrabold tracking-tight line-clamp-2', tone.title)}>
                {locked ? `🔒 ${title}` : title}
              </div>

              <div className="mt-1 text-xs sm:text-sm text-slate-700 line-clamp-2">
                {desc}
              </div>

              <div className="mt-3 text-xs sm:text-sm font-extrabold text-slate-800">
                {ctaText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MyDiaryCard(props: {
  title: string;
  desc: string;
  to: string;
  avatarId: string;
  equipment: Equipment;
  badgeMain: string;
  badgePrivate: string;
  cta: string;
  onOpen?: () => void;
}) {
  const { title, desc, to, avatarId, equipment, badgeMain, badgePrivate, cta, onOpen } = props;

  return (
    <Link
      to={to}
      onClick={() => onOpen?.()}
      className="block group"
    >
      <div className="rounded-3xl border border-[var(--color-teal-200)] bg-gradient-to-br from-[var(--color-teal-50)] via-white to-emerald-50 shadow-md overflow-hidden transition hover:shadow-lg">
        <div className="h-2 bg-[var(--color-teal-300)]" />

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-center">
            <div className="flex justify-center md:justify-start">
              <div className="rounded-3xl border border-white/70 bg-white shadow-sm flex items-center justify-center overflow-hidden">
                <AvatarLookCircle
                  avatarBaseId={avatarId}
                  equipment={equipment}
                  size={120}
                  alt={title}
                  className="rounded-2xl"
                />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold bg-[var(--color-teal-100)] text-[var(--color-teal-900)]">
                  {badgeMain}
                </span>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white border border-black/5 text-slate-700">
                  {badgePrivate}
                </span>
              </div>

              <div className="mt-3 text-xl sm:text-2xl font-extrabold text-[var(--color-teal-950)] leading-tight">
                {title}
              </div>

              <div className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">
                {desc}
              </div>

              <div className="mt-4 inline-flex items-center rounded-2xl px-4 py-2 bg-white border border-slate-200 text-sm font-extrabold text-slate-800 group-hover:bg-slate-50">
                {cta}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function DiariesHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-teal-200)] via-white to-amber-100 px-4 py-5 shadow-md border border-white/40">
      <div className="pointer-events-none absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
      <div className="pointer-events-none absolute top-6 right-4 w-20 h-20 rounded-full bg-yellow-300/25 blur-xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 w-24 h-24 rounded-full bg-teal-300/20 blur-xl" />

      <div className="relative">
        <div className="text-xs font-extrabold text-slate-700">
          Tagebuch
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          📔 {title}
        </h1>

        <p className="mt-1 text-sm text-slate-800 max-w-md">
          {subtitle}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70">🔒 privat</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70">💭 Gedanken</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70">✨ neue Seiten</span>
        </div>
      </div>
    </section>
  );
}

export default function Diaries() {
  const { t } = useTranslation('bonus');
  const location = useLocation();
  const state = location.state as LocationState | null;
  const isModal = Boolean(state?.backgroundLocation);

  const { profile } = useProfile();
  const progress = useBonusProgressFromProfile();

  const storyBooks = useMemo(() => {
    const allowed = new Set(['diary_yasmin', 'diary_mia', 'diary_jonas']);
    return BONUS_INDEX
      .filter(isDiaryBookItem)
      .filter((i) => i.released && allowed.has(i.bonusId))
      .sort((a, b) => a.order - b.order);
  }, []);

  const myDiary = useMemo((): DiaryBookItem => {
    return {
      bonusId: 'diary_me',
      category: 'diaries',
      mediaType: 'text',
      titleKey: 'diaries.books.me.title',
      descriptionKey: 'diaries.books.me.desc',
      coverImage: '',
      released: true,
      order: 59,
    };
  }, []);

  const myDiaryTitle = t(myDiary.titleKey!, {
    defaultValue: t('diaries.fallbackTitle', { defaultValue: 'Tagebuch' }),
  });

  const myDiaryDesc = t(myDiary.descriptionKey!, {
    defaultValue: t('diaries.fallbackDesc', { defaultValue: 'Ein neuer Eintrag…' }),
  });

  return (
    <Layout
      title={t('diaries.title', { defaultValue: 'Geheime Tagebücher' })}
      backPath={state?.backTo ?? '/profile'}
      hideHeader={isModal}
    >
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-3 py-6 sm:py-10 space-y-6 mx-auto">

        <DiariesHero
  title={t('diaries.title', { defaultValue: 'Geheime Tagebücher' })}
  subtitle={t('diaries.subtitle', {
    defaultValue: 'Gedanken, Gefühle und Dinge, die man nicht einfach in den Chat schreibt.',
  })}
/>

        {/* Mein Tagebuch */}
<MyDiaryCard
  title={myDiaryTitle}
  desc={myDiaryDesc}
  to={`/diaries/${myDiary.bonusId}`}
  avatarId={profile.avatarBaseId}
  equipment={profile.equipment}
  badgeMain={t('diaries.my.badgeMain', { defaultValue: '🙋 Dein Bereich' })}
  badgePrivate={t('diaries.my.badgePrivate', { defaultValue: '🔒 privat' })}
  cta={t('diaries.open', { defaultValue: 'Öffnen →' })}
  onOpen={() => markBonusSeen(myDiary.bonusId)}
/>

        {/* Story-Tagebücher */}
        <Panel
          kicker={t('diaries.bookTag', { defaultValue: 'Tagebuch' })}
          title="Tagebücher aus der Story"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {storyBooks.map((item) => {
              const tone = toneForDiary(item.bonusId);

              const title = item.titleKey
                ? t(item.titleKey, {
                    defaultValue: t('diaries.fallbackTitle', { defaultValue: 'Tagebuch' }),
                  })
                : t('diaries.fallbackTitle', { defaultValue: 'Tagebuch' });

              const desc = item.descriptionKey
                ? t(item.descriptionKey, {
                    defaultValue: t('diaries.fallbackDesc', { defaultValue: 'Ein neuer Eintrag…' }),
                  })
                : t('diaries.fallbackDesc', { defaultValue: 'Ein neuer Eintrag…' });

              const locked = !isDiaryUnlocked(item, progress);

              const preview = item.coverImage ? (
                <img
                  src={assetUrl(item.coverImage)}
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-400">
                  {title.slice(0, 1).toUpperCase()}
                </div>
              );

              const badgeText = locked
                ? t('diaries.locked', { defaultValue: '🔒 Noch geheim' })
                : '✨ freigeschaltet';

              const ctaText = locked
                ? t('diaries.locked', { defaultValue: '🔒 Noch geheim' })
                : t('diaries.open', { defaultValue: 'Öffnen →' });

              return (
                <StoryDiaryTile
                  key={item.bonusId}
                  title={title}
                  desc={desc}
                  locked={locked}
                  to={`/diaries/${item.bonusId}`}
                  onOpen={() => markBonusSeen(item.bonusId)}
                  tone={tone}
                  preview={preview}
                  badgeText={badgeText}
                  ctaText={ctaText}
                />
              );
            })}
          </div>
        </Panel>

        <div className="h-6" />
      </div>
    </Layout>
  );
}