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
import AvatarHeadImage from '../components/AvatarHeadImage';

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

/**
 * ✅ Unlock-Fix: Unterstützt beide Chapter-ID-Formate:
 * - alt: "s1e01c01"
 * - neu: "s1:s1e01:c01" (dein applyChapterReward)
 */
function normalizeChapterIdMaybe(id: string): string[] {
  const raw = String(id || '').trim();
  if (!raw) return [];

  // If already new style, keep it
  if (raw.includes(':')) return [raw];

  // Parse old style: s1e01c01
  // season=1, ep=01, ch=01 -> s1:s1e01:c01
  const m = raw.match(/^s(\d+)e(\d{1,2})c(\d{1,2})$/i);
  if (!m) return [raw];

  const season = `s${Number(m[1])}`;
  const epNum = String(Number(m[2])).padStart(2, '0');
  const chNum = String(Number(m[3])).padStart(2, '0');
  const episodeId = `${season}e${epNum}`;
  const normalized = `${season}:${episodeId}:c${chNum}`;

  // return both so either can match
  return [raw, normalized];
}

function isDiaryUnlocked(item: DiaryBookItem, progress: BonusProgressSnapshot): boolean {
  if (item.bonusId === 'diary_me') return true;

  // base unlock
  const byRule = isBonusUnlocked(item, progress);

  // ✅ seen also unlocks (optional, feels right)
  const bySeen = isBonusSeen(item.bonusId);

  // ✅ chapter-id normalization safety net
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
    return { spine: 'bg-rose-300', shadow: 'shadow-rose-200/40', title: 'text-rose-950', chip: 'bg-rose-100 text-rose-900' };
  }
  if (bonusId === 'diary_mia') {
    return { spine: 'bg-amber-300', shadow: 'shadow-amber-200/40', title: 'text-amber-950', chip: 'bg-amber-100 text-amber-900' };
  }
  if (bonusId === 'diary_jonas') {
    return { spine: 'bg-sky-300', shadow: 'shadow-sky-200/40', title: 'text-sky-950', chip: 'bg-sky-100 text-sky-900' };
  }
  return { spine: 'bg-[var(--color-teal-300)]', shadow: 'shadow-[var(--color-teal-200)]/40', title: 'text-[var(--color-teal-950)]', chip: 'bg-[var(--color-teal-100)] text-[var(--color-teal-900)]' };
}

function BookCard(props: {
  title: string;
  desc: string;
  locked: boolean;
  tone: ReturnType<typeof toneForDiary>;
  coverNode: React.ReactNode;
  ctaLabel: string;
  to: string;
  onOpen?: () => void;
}) {
  const { title, desc, locked, tone, coverNode, ctaLabel, to, onOpen } = props;

  return (
    <Link
      to={locked ? '#' : to}
      onClick={(e) => {
        if (locked) {
          e.preventDefault();
          return;
        }
        onOpen?.();
      }}
      aria-disabled={locked}
      className={[
        'group block',
        locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      ].join(' ')}
    >
      <div
        className={[
          'relative rounded-[30px] overflow-hidden border border-black/10 bg-white',
          'shadow-sm',
          !locked ? `hover:shadow-md transition-shadow ${tone.shadow}` : '',
        ].join(' ')}
      >
        {/* Spine */}
        <div className={['absolute left-0 top-0 bottom-0 w-10', tone.spine].join(' ')} />
        {/* Spine highlight */}
        <div aria-hidden className="absolute left-2 top-5 bottom-5 w-1 rounded-full bg-white/35" />
        {/* Pages edge */}
        <div aria-hidden className="absolute right-0 top-0 bottom-0 w-3 bg-white/80" />

        {/* Cover */}
        <div className="ml-10 mr-3 p-4">
          <div
            className={[
              'relative rounded-2xl overflow-hidden border border-black/10 bg-slate-50',
              'shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',
              !locked ? 'group-hover:scale-[1.01] transition-transform' : '',
            ].join(' ')}
          >
            <div className="aspect-[3/4] w-full">{coverNode}</div>
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-white/10 to-transparent" />
          </div>

          {/* Meta */}
          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className={['text-base sm:text-lg font-extrabold leading-snug truncate', tone.title].join(' ')}>
                {locked ? `🔒 ${title}` : title}
              </div>
              <div className="mt-1 text-sm text-slate-700 line-clamp-2">{desc}</div>
            </div>
            <div className="shrink-0 text-xs font-bold text-slate-500">
              {ctaLabel}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className={['inline-flex items-center rounded-full px-3 py-1 text-xs font-bold', tone.chip].join(' ')}>
              📔 {locked ? 'Noch geheim' : 'Öffnen'}
            </span>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white border border-black/5 text-slate-700">
              ✨ privat
            </span>
          </div>
        </div>

        {/* Tilt */}
        {!locked ? (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-black/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : null}
      </div>
    </Link>
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
      coverImage: '', // we render avatar headshot
      released: true,
      order: 59,
    };
  }, []);

  const booksAll = useMemo(() => [myDiary, ...storyBooks], [myDiary, storyBooks]);

  return (
    <Layout
      title={t('diaries.title', { defaultValue: 'Geheime Tagebücher' })}
      backPath={state?.backTo ?? '/profile'}
      hideHeader={isModal}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="mt-4 rounded-3xl border border-black/5 bg-white p-5 sm:p-6 shadow-sm">
          <div className="text-sm sm:text-base text-slate-700">
            {t('diaries.subtitle', {
              defaultValue: 'Gedanken, Gefühle und Dinge, die man nicht einfach in den Chat schreibt.',
            })}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {booksAll.map((item) => {
            const tone = toneForDiary(item.bonusId);

            const title = item.titleKey
              ? t(item.titleKey, { defaultValue: t('diaries.fallbackTitle', { defaultValue: 'Tagebuch' }) })
              : t('diaries.fallbackTitle', { defaultValue: 'Tagebuch' });

            const desc = item.descriptionKey
              ? t(item.descriptionKey, { defaultValue: t('diaries.fallbackDesc', { defaultValue: 'Eine neue Seite…' }) })
              : t('diaries.fallbackDesc', { defaultValue: 'Eine neue Seite…' });

            const locked = !isDiaryUnlocked(item, progress);

            const coverNode =
              item.bonusId === 'diary_me' ? (
                <div className="w-full h-full flex items-center justify-center bg-[var(--color-teal-50)]">
                  <AvatarHeadImage
                    id={profile.avatarBaseId}
                    size={160}
                    alt={title}
                    className="rounded-2xl border border-white/70 bg-white shadow-sm"
                  />
                </div>
              ) : item.coverImage ? (
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

            return (
              <BookCard
                key={item.bonusId}
                title={title}
                desc={desc}
                locked={locked}
                tone={tone}
                coverNode={coverNode}
                ctaLabel={locked ? t('diaries.locked', { defaultValue: '🔒 Noch geheim' }) : t('diaries.open', { defaultValue: 'Öffnen →' })}
                to={`/diaries/${item.bonusId}`}
                onOpen={() => markBonusSeen(item.bonusId)}
              />
            );
          })}
        </div>

        <div className="h-10" />
      </div>
    </Layout>
  );
}