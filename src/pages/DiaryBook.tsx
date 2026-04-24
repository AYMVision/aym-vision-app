// src/pages/DiaryBook.tsx
import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  hasDiaryPin,
  setDiaryPin,
  verifyDiaryPin,
  getDiaryPinHint,
} from '../diary/diaryPin';

import Layout from '../components/Layout';
import { BONUS_INDEX } from '../bonus/bonusIndex';
import { useProfile } from '../profile/useProfile';
import type { BonusProgressSnapshot } from '../bonus/bonusUnlock';
import { DIARY_ENTRIES, type DiaryId, type DiaryEntry } from '../bonus/diaryEntries';
import { isBonusSeen, markBonusSeen } from '../bonus/bonusSeen';
import { CHARACTERS, type CharacterEx } from '../content/characters';
import { assetUrl } from '../common/assetUrl';

type LocationState = { backTo?: string; backgroundLocation?: unknown } | null;

function useBonusProgressFromProfile(): BonusProgressSnapshot {
  const { profile } = useProfile();
  const completed = profile.progress?.completedChapters ?? {};
  return { seenChapterIds: Object.keys(completed) };
}

// -------------------- Stickers --------------------
const DIARY_STICKERS = ['angry', 'broken_heart', 'cloud', 'crying', 'drama', 'grin', 'laugh', 'love', 'offline', 'rainbow', 'stars', 'sun', 'thinking', 'ugh'] as const;
type DiaryStickerId = typeof DIARY_STICKERS[number];

function stickerSrc(id: DiaryStickerId, size: 256 | 512 = 256) {
  return assetUrl(`media/stickers/diary/${id}-${size}.webp`);
}

function pickAutoStickers(text: string): DiaryStickerId[] {
  const t = (text ?? '').toLowerCase();

  const scored: { id: DiaryStickerId; score: number }[] = DIARY_STICKERS.map((id) => ({ id, score: 0 }));
  const bump = (id: DiaryStickerId, n: number) => {
    const s = scored.find((x) => x.id === id);
    if (s) s.score += n;
  };

  if (t.includes('offline') || t.includes('flugmodus') || t.includes('kein netz')) bump('offline', 3);
  if (t.includes('wütend') || t.includes('angry') || t.includes('sauer')) bump('angry', 3);
  if (t.includes('wein') || t.includes('cry') || t.includes('traurig') || t.includes('tränen')) bump('crying', 3);
  if (t.includes('herz') || t.includes('love') || t.includes('broken')) bump('broken_heart', 3);
  if (t.includes('drama') || t.includes('streit') || t.includes('stress')) bump('drama', 2);
  if (t.includes('denke') || t.includes('think') || t.includes('überleg')) bump('thinking', 2);
  if (t.includes('ugh') || t.includes('boah') || t.includes('nerv')) bump('ugh', 2);
  if (t.includes('stern') || t.includes('stars') || t.includes('glitzer') || t.includes('wow')) bump('stars', 2);

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((x) => x.score > 0).slice(0, 2).map((x) => x.id);
  return top.length ? top : ['thinking', 'stars'];
}

function stickerLayout(seed: string) {
  // deterministic positions (no flicker)
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;

  const f = (min: number, max: number) => min + ((h % 1000) / 1000) * (max - min);

  return [
    { left: f(14, 30), top: f(22, 34), rot: -10 },
    { left: f(70, 86), top: f(62, 80), rot: 10 },
  ];
}

function todayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// -------------------- Unlock helpers --------------------
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


// ✅ unlocked = chapter done OR clicked (bonusSeen)
function isEntryUnlocked(entry: DiaryEntry, progress: BonusProgressSnapshot): boolean {
  const ids = normalizeChapterIdMaybe(entry.unlock.afterChapterId);
  const byChapter = ids.some((id) => progress.seenChapterIds.includes(id));
  return byChapter || isBonusSeen(entry.bonusId);
}

function safeDiaryId(v: string | undefined): DiaryId | null {
  if (v === 'diary_mia' || v === 'diary_yasmin' || v === 'diary_jonas' || v === 'diary_me') return v as DiaryId;
  return null;
}

function getDiaryMeta(diaryId: DiaryId) {
  const item = BONUS_INDEX.find((b) => b.category === 'diaries' && b.bonusId === diaryId);
  return item ?? null;
}

function diaryCharacterId(diaryId: DiaryId): keyof typeof CHARACTERS | null {
  if (diaryId === 'diary_mia') return 'mia';
  if (diaryId === 'diary_yasmin') return 'yasmin';
  if (diaryId === 'diary_jonas') return 'jonas';
  return null;
}

function parseQuery(search: string) {
  return new URLSearchParams(search);
}

function accentForDiary(diaryId: DiaryId) {
  if (diaryId === 'diary_yasmin') return { ring: 'ring-rose-200', chip: 'bg-rose-100 text-rose-900', border: 'border-rose-200' };
  if (diaryId === 'diary_mia') return { ring: 'ring-amber-200', chip: 'bg-amber-100 text-amber-900', border: 'border-amber-200' };
  if (diaryId === 'diary_jonas') return { ring: 'ring-sky-200', chip: 'bg-sky-100 text-sky-900', border: 'border-sky-200' };
  return { ring: 'ring-[var(--color-teal-200)]', chip: 'bg-[var(--color-teal-100)] text-[var(--color-teal-900)]', border: 'border-[var(--color-teal-200)]' };
}

// -------------------- diary_me storage + canvas --------------------
type MeSticker = { id: string; stickerId: DiaryStickerId; xPx: number; yPx: number; rot: number; size: number };
type MeEntry = { id: string; createdAt: number; text: string; stickers: MeSticker[] };

const ME_KEY = 'aym_diary_me_v1';

function loadMeDiary(): MeEntry[] {
  try {
    const raw = localStorage.getItem(ME_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean);
  } catch {
    return [];
  }
}

function saveMeDiary(entries: MeEntry[]) {
  try {
    localStorage.setItem(ME_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

function uid(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(ts: number) {
  try {
    return new Intl.DateTimeFormat('de-DE', { year: 'numeric', month: 'long', day: '2-digit' }).format(ts);
  } catch {
    return new Date(ts).toLocaleDateString();
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function DiaryBook() {
  const { t } = useTranslation('bonus');
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const isModal = Boolean((state as any)?.backgroundLocation);
  const backTo = state?.backTo;

  const { profile } = useProfile();
  const progress = useBonusProgressFromProfile();

  const { diaryId: diaryIdParam } = useParams<{ diaryId: string }>();
  const diaryId = safeDiaryId(diaryIdParam);

  const entryParam = useMemo(() => parseQuery(location.search).get('entry') ?? '', [location.search]);
  const listRef = useRef<HTMLDivElement | null>(null);

  const meta = useMemo(() => (diaryId ? getDiaryMeta(diaryId) : null), [diaryId]);

  const entries = useMemo(() => {
    if (!diaryId || diaryId === 'diary_me') return [];
    return [...(DIARY_ENTRIES[diaryId] ?? [])].sort((a, b) => a.order - b.order);
  }, [diaryId]);

const unlockedEntries = useMemo(() => {
  if (!diaryId || diaryId === 'diary_me') return [];

  return entries.filter((e) => {
    if (e.entryId === entryParam) return true;
    return isEntryUnlocked(e, progress);
  });
}, [entries, progress, diaryId, entryParam]);

  useEffect(() => {
    if (!entryParam) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    const getScrollContainer = (el: HTMLElement): HTMLElement | null => {
      let parent = el.parentElement;
      while (parent) {
        const { overflow, overflowY } = getComputedStyle(parent);
        if (/auto|scroll/.test(overflow + overflowY)) return parent;
        parent = parent.parentElement;
      }
      return null;
    };

    const doScroll = () => {
      const el = document.getElementById(`entry-${entryParam}`);
      if (!el) return;
      const headerOffset = isModal ? 12 : 88;
      const container = isModal ? getScrollContainer(el) : null;
      if (container) {
        const top =
          el.getBoundingClientRect().top -
          container.getBoundingClientRect().top -
          headerOffset +
          container.scrollTop;
        container.scrollTo({ top, left: 0, behavior: 'smooth' });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, left: 0, behavior: 'smooth' });
      }
    };

    // Defer one tick so the entry elements are painted before we measure.
    const id = setTimeout(doScroll, 0);
    return () => clearTimeout(id);
  }, [entryParam, unlockedEntries.length, isModal]);

  useEffect(() => {
  if (!diaryId || !entryParam) return;

  const entry = (DIARY_ENTRIES[diaryId] ?? []).find((e) => e.entryId === entryParam);
  if (entry?.bonusId) {
    markBonusSeen(entry.bonusId);
  }
}, [diaryId, entryParam]);

  useEffect(() => {
    if (diaryId) markBonusSeen(diaryId);
  }, [diaryId]);

  if (!diaryId) {
    return (
      <Layout title={t('diaries.title', { defaultValue: 'Tagebücher' })} backPath={state?.backTo ?? '/profile'}>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="rounded-2xl border bg-white p-4 text-sm">
            {t('diaries.unknownDiary', { defaultValue: 'Dieses Tagebuch gibt es nicht.' })}
          </div>
          <div className="mt-4">
            <Link className="text-sm font-semibold underline" to="/diaries">
              {t('diaries.backToList', { defaultValue: 'Zurück zur Übersicht' })}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const style = accentForDiary(diaryId);

  const bookTitle =
    diaryId === 'diary_me'
      ? t('diaries.books.me.title', { defaultValue: 'Mein Tagebuch' })
      : meta?.titleKey
      ? t(meta.titleKey, { defaultValue: t('diaries.fallbackTitle', { defaultValue: 'Tagebuch' }) })
      : t('diaries.fallbackTitle', { defaultValue: 'Tagebuch' });

  const characterId = diaryCharacterId(diaryId);
  const character = characterId ? (CHARACTERS[characterId] as CharacterEx | undefined) : undefined;
  const heroImage = character?.card?.portrait ?? null;

  return (
    <Layout
      title={isModal ? undefined : bookTitle}
      backPath={isModal ? undefined : (state?.backTo ?? '/diaries')}
      hideHeader={isModal}
    >
      <div className="max-w-3xl mx-auto px-4 pt-4">
        {isModal ? (
          <div className="mt-4 flex items-center justify-between">
{backTo ? (
  <button
    type="button"
    onClick={() => navigate(-1)}
    className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--color-teal-900)]"
  >
    ← {t('diaries.backToStory', { defaultValue: 'Zurück zur Story' })}
  </button>
) : null}

<button
  type="button"
  onClick={() =>
    navigate('/diaries', {
      state: { backgroundLocation: (state as any)?.backgroundLocation, backTo },
    })
  }
  className="text-sm font-semibold text-slate-700 underline"
>
  {t('diaries.backToList', { defaultValue: 'Zur Übersicht' })}
</button>
          </div>
        ) : null}

        {/* HERO (book cover vibe) */}
        <div className={['mt-4 rounded-3xl border bg-white shadow-sm overflow-hidden', style.border].join(' ')}>
          <div className="p-5 sm:p-6 flex items-center gap-4">
            <div className={['w-24 h-32 rounded-2xl border bg-slate-50 overflow-hidden', style.border].join(' ')}>
              {diaryId === 'diary_me' ? (
                <img
                  src={assetUrl(`media/avatars/full/${(profile.avatarBaseId?.trim() || 'default').toLowerCase()}-384.webp`)}
                  alt={bookTitle}
                  className="w-full h-full object-cover object-top"
                />
              ) : heroImage ? (
                <img src={assetUrl(heroImage)} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-xl font-black text-slate-500">{bookTitle.slice(0, 1).toUpperCase()}</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-base font-extrabold text-slate-900 truncate">{bookTitle}</div>

              <div className="mt-1 text-sm text-slate-600">
                {diaryId === 'diary_me'
                  ? t('diaries.me.subtitle', { defaultValue: 'Dein privates Tagebuch: schreiben, Sticker kleben, später wieder lesen.' })
                  : t('diaries.bookSubtitle', {
                      defaultValue: 'Neue Seiten werden in der Story freigeschaltet – du kannst sie hier jederzeit nachlesen.',
                    })}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className={['inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold', style.chip].join(' ')}>
                  📖 {t('diaries.bookTag', { defaultValue: 'Tagebuch' })}
                </span>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white border border-black/5 text-slate-700">
                  ✨ {t('diaries.bookTag2', { defaultValue: 'privat & sicher auf deinem Gerät' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {diaryId === 'diary_me' ? (
          <MyDiaryWithPin />
        ) : (
          <StoryDiarySection
            diaryId={diaryId}
            unlockedEntries={unlockedEntries}
            entryParam={entryParam}
            heroImage={heroImage}
            styleBorder={style.border}
            isModal={isModal}
            backTo={state?.backTo}
          />
        )}

        <div className="h-10" />
      </div>
    </Layout>
  );
}

function StoryDiarySection(props: {
  diaryId: DiaryId;
  unlockedEntries: DiaryEntry[];
  entryParam: string;
  heroImage: string | null;
  styleBorder: string;
  isModal: boolean;
  backTo?: string;
}) {
  const { t } = useTranslation('bonus');
  const navigate = useNavigate();

  const { unlockedEntries, entryParam, heroImage, styleBorder, backTo } = props;

  return (
    <div className={['mt-6 rounded-[28px] border bg-white shadow-sm overflow-hidden', styleBorder].join(' ')}>
      <div className="relative p-5 sm:p-6 touch-none" style={{ minHeight: 340 }}>
        {/* paper bg */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.95]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(15,23,42,0.08), rgba(15,23,42,0.08)),
              repeating-linear-gradient(
                to bottom,
                rgba(15,23,42,0.06),
                rgba(15,23,42,0.06) 1px,
                transparent 1px,
                transparent 28px
              ),
              linear-gradient(180deg, rgba(255,250,240,1), rgba(255,255,255,1))
            `,
            backgroundSize: '2px 100%, 100% 28px, 100% 100%',
            backgroundPosition: '46px 0, 0 0, 0 0',
            backgroundRepeat: 'no-repeat, repeat, no-repeat',
          }}
        />

        <div className="relative space-y-6">
          {unlockedEntries.length === 0 ? (
            <div className="rounded-3xl border bg-white/75 p-5">
              <div className="text-sm font-extrabold text-slate-900">
                {t('diaries.noEntriesYet', { defaultValue: 'Noch keine Einträge freigeschaltet.' })}
              </div>
              <div className="mt-1 text-sm text-slate-700">
                {t('diaries.noEntriesHint', { defaultValue: 'Spiel in der Story weiter – dann tauchen hier neue Seiten auf.' })}
              </div>
            </div>
          ) : (
            unlockedEntries.map((e) => (
              <DiaryEntryBlock
                key={e.entryId}
                diaryId={props.diaryId}
                entry={e}
                heroImage={heroImage}
                highlight={entryParam === e.entryId}
              />
            ))
          )}

          <div className="pt-2 flex items-center justify-between">
{backTo ? (
  <button
    type="button"
    onClick={() => navigate(-1)}
    className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--color-teal-900)]"
  >
    ← {t('diaries.backToStory', { defaultValue: 'Zurück zur Story' })}
  </button>
) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiaryEntryBlock(props: {
  diaryId: DiaryId;
  entry: DiaryEntry;
  heroImage: string | null;
  highlight: boolean;
}) {
  const { t } = useTranslation('bonus');
  const { entry, highlight } = props;

  const dateLabel = entry.dateKey ? t(entry.dateKey, { defaultValue: '' }).trim() : '';
  const entryLabel = t('diaries.entryLabel', { defaultValue: 'Eintrag' });

  // ✅ Fix: body first, then auto stickers
  const body = t(entry.bodyKey, { defaultValue: '' });
  const autoStickers = pickAutoStickers(body);

  const accent =
    entry.decor?.accent === 'amber'
      ? { border: 'border-amber-200', marker: 'bg-amber-100 text-amber-900', ring: 'ring-amber-200' }
      : entry.decor?.accent === 'sky'
      ? { border: 'border-sky-200', marker: 'bg-sky-100 text-sky-900', ring: 'ring-sky-200' }
      : entry.decor?.accent === 'violet'
      ? { border: 'border-violet-200', marker: 'bg-violet-100 text-violet-900', ring: 'ring-violet-200' }
      : { border: 'border-rose-200', marker: 'bg-rose-100 text-rose-900', ring: 'ring-rose-200' };

  return (
    <article
      id={`entry-${entry.entryId}`}
className={[
  'relative rounded-3xl border bg-white/75 p-4 sm:p-5 scroll-mt-24 overflow-hidden',
  'pr-[150px]',          // ✅ rechts Platz für Sticker-Spalte
  'min-h-[220px]',       // optional: damit Sticker nicht zu eng
  accent.border,
  highlight ? `ring-2 ${accent.ring}` : '',
].join(' ')}
    >
      {/* ✅ Big stickers, distributed */}
{/* ✅ Sticker-Spalte rechts (niemals über Text) */}
<div className="absolute right-4 top-4 bottom-4 w-[120px] flex flex-col gap-3 items-center justify-start pointer-events-none">
  {autoStickers.slice(0, 2).map((sid, idx) => (
    <img
      key={`${entry.entryId}-${sid}-${idx}`}
      src={stickerSrc(sid, 256)}
      alt=""
      className={idx === 0 ? 'w-24 h-24' : 'w-24 h-24 rotate-[8deg]'}
      loading="lazy"
    />
  ))}
</div>

      <div className="flex items-start gap-3">
        <span className={['inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold', accent.marker].join(' ')}>
          {entry.decor?.moodEmoji ?? '📌'}
          <span className="ml-2">{dateLabel || entryLabel}</span>
        </span>
      </div>

      {(() => {
        const title = entry.titleKey ? t(entry.titleKey, { defaultValue: '' }).trim() : '';
        return title ? <div className="mt-3 text-sm font-extrabold text-slate-900">{title}</div> : null;
      })()}

      <div className="mt-3 text-[18px] leading-8 text-slate-900 diary-hand whitespace-pre-wrap">
        {body}
      </div>
    </article>
  );
}

// -------------------- Mini Canvas Preview --------------------
function MiniEntryPreview({ entry }: { entry: MeEntry }) {
  return (
    <div className="shrink-0 w-[80px] h-[100px] relative overflow-hidden rounded-xl bg-[linear-gradient(180deg,rgba(255,250,240,1),rgba(255,255,255,1))] border border-slate-100">
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{ width: 320, transform: 'scale(0.25)', transformOrigin: 'top left', padding: '12px', minHeight: 400 }}
      >
        <div className="text-[18px] leading-8 text-slate-900 diary-hand whitespace-pre-wrap">
          {entry.text}
        </div>
        {entry.stickers.map((s) => (
          <img
            key={s.id}
            src={stickerSrc(s.stickerId, 256)}
            alt=""
            style={{
              position: 'absolute',
              left: s.xPx,
              top: s.yPx,
              width: s.size,
              height: s.size,
              transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// -------------------- MY DIARY --------------------
// -------------------- PIN wrapper --------------------
function MyDiaryWithPin() {
  const { t } = useTranslation('bonus');

  const [hasPin] = useState(() => hasDiaryPin());
  const [unlocked, setUnlocked] = useState(false);

  // setup
  const [setupPin, setSetupPin] = useState('');
  const [setupPinRepeat, setSetupPinRepeat] = useState('');
  const [setupHint, setSetupHint] = useState('');
  const [setupError, setSetupError] = useState('');
  const [setupBusy, setSetupBusy] = useState(false);

  // unlock
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinBusy, setPinBusy] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const hint = getDiaryPinHint();

  const handleSetup = useCallback(async () => {
    const p1 = setupPin.trim();
    const p2 = setupPinRepeat.trim();
    if (p1.length < 4) {
      setSetupError(t('diaries.pin.errorTooShort', { defaultValue: 'Bitte mindestens 4 Zeichen.' }));
      return;
    }
    if (p1 !== p2) {
      setSetupError(t('diaries.pin.errorMismatch', { defaultValue: 'Die beiden PINs stimmen nicht überein.' }));
      return;
    }
    setSetupBusy(true);
    setSetupError('');
    const ok = await setDiaryPin(p1, setupHint);
    setSetupBusy(false);
    if (ok) setUnlocked(true);
  }, [setupPin, setupPinRepeat, setupHint, t]);

  const handleUnlock = useCallback(async () => {
    const p = pinInput.trim();
    if (!p) return;
    setPinBusy(true);
    setPinError('');
    const ok = await verifyDiaryPin(p);
    setPinBusy(false);
    if (ok) {
      setUnlocked(true);
    } else {
      setPinError(t('diaries.pin.errorWrong', { defaultValue: 'Falscher PIN. Versuch es nochmal.' }));
      setPinInput('');
    }
  }, [pinInput, t]);

  if (unlocked || !hasPin) {
    if (!hasPin && !unlocked) {
      // First time: show PIN setup screen
      return (
        <div className="mt-6 rounded-[28px] border border-[var(--color-teal-200)] bg-white shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="text-base font-extrabold text-slate-900">
              {t('diaries.pin.setupTitle', { defaultValue: '🔒 Tagebuch schützen' })}
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {t('diaries.pin.setupBody', {
                defaultValue: 'Leg einen PIN fest, damit nur du dein Tagebuch lesen kannst. Wenn du ihn vergisst, können deine Eltern ihn zurücksetzen.',
              })}
            </p>

            <div className="mt-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  {t('diaries.pin.pinLabel', { defaultValue: 'Dein PIN (mind. 4 Zeichen)' })}
                </label>
                <input
                  type="password"
                  value={setupPin}
                  onChange={(e) => setSetupPin(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSetup()}
                  placeholder="····"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-400)] focus:ring-2 focus:ring-[var(--color-teal-100)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  {t('diaries.pin.pinRepeatLabel', { defaultValue: 'PIN nochmal eingeben' })}
                </label>
                <input
                  type="password"
                  value={setupPinRepeat}
                  onChange={(e) => setSetupPinRepeat(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSetup()}
                  placeholder="····"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-400)] focus:ring-2 focus:ring-[var(--color-teal-100)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">
                  {t('diaries.pin.hintLabel', { defaultValue: 'Hinweis (optional, falls du ihn vergisst)' })}
                </label>
                <input
                  type="text"
                  value={setupHint}
                  onChange={(e) => setSetupHint(e.target.value)}
                  placeholder={t('diaries.pin.hintPlaceholder', { defaultValue: 'z.B. mein Lieblingstier' })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-400)] focus:ring-2 focus:ring-[var(--color-teal-100)]"
                />
              </div>
            </div>

            {setupError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {setupError}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSetup}
                disabled={setupBusy}
                className="rounded-xl bg-[var(--color-teal-600)] px-5 py-3 text-sm font-extrabold text-white hover:bg-[var(--color-teal-700)] disabled:opacity-60"
              >
                {t('diaries.pin.setupButton', { defaultValue: 'PIN festlegen & Tagebuch öffnen' })}
              </button>
              <button
                type="button"
                onClick={() => setUnlocked(true)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t('diaries.pin.skipButton', { defaultValue: 'Jetzt ohne PIN öffnen' })}
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              {t('diaries.pin.parentNote', {
                defaultValue: 'Vergessen? Eltern können den PIN im Elternbereich zurücksetzen – deine Einträge bleiben dabei erhalten.',
              })}
            </p>
          </div>
        </div>
      );
    }
    // Unlocked or no pin ever set
    return <MyDiarySection />;
  }

  // Locked: show PIN entry
  return (
    <div className="mt-6 rounded-[28px] border border-[var(--color-teal-200)] bg-white shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 max-w-sm mx-auto text-center">
        <div className="text-4xl mb-3">🔒</div>
        <div className="text-base font-extrabold text-slate-900">
          {t('diaries.pin.lockedTitle', { defaultValue: 'Dein Tagebuch ist geschützt' })}
        </div>
        <p className="mt-1 text-sm text-slate-600">
          {t('diaries.pin.lockedBody', { defaultValue: 'Gib deinen PIN ein, um weiterzumachen.' })}
        </p>

        <input
          type="password"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
          placeholder="····"
          autoFocus
          className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-lg font-bold tracking-widest outline-none focus:border-[var(--color-teal-400)] focus:ring-2 focus:ring-[var(--color-teal-100)]"
        />

        {pinError && (
          <div className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {pinError}
          </div>
        )}

        <button
          type="button"
          onClick={handleUnlock}
          disabled={pinBusy || !pinInput.trim()}
          className="mt-4 w-full rounded-xl bg-[var(--color-teal-600)] px-5 py-3 text-sm font-extrabold text-white hover:bg-[var(--color-teal-700)] disabled:opacity-60"
        >
          {t('diaries.pin.unlockButton', { defaultValue: 'Öffnen' })}
        </button>

        <div className="mt-4">
          {!showHint ? (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              {t('diaries.pin.forgotLink', { defaultValue: 'PIN vergessen?' })}
            </button>
          ) : (
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600 text-left">
              {hint ? (
                <>
                  <span className="font-semibold">{t('diaries.pin.hintTitle', { defaultValue: 'Dein Hinweis:' })}</span>{' '}
                  {hint}
                  <br />
                </>
              ) : null}
              <span className="mt-1 block">
                {t('diaries.pin.forgotHint', {
                  defaultValue: 'Vergessen? Bitte deine Eltern, den PIN im Elternbereich zurückzusetzen. Deine Einträge bleiben erhalten.',
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------- diary_me content --------------------
function MyDiarySection() {
  const { t } = useTranslation('bonus');
  const { updateProfile } = useProfile();
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const [entries, setEntries] = useState<MeEntry[]>(() =>
    loadMeDiary().sort((a, b) => b.createdAt - a.createdAt)
  );
  const [text, setText] = useState('');
  const [activeEntryId, setActiveEntryId] = useState<string | null>(entries[0]?.id ?? null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const activeEntry = useMemo(() => entries.find((e) => e.id === activeEntryId) ?? null, [entries, activeEntryId]);

  useEffect(() => {
    saveMeDiary(entries);
  }, [entries]);

    useEffect(() => {
    const today = todayStr();

    updateProfile((prev) => {
      const currentDiary = prev.progress?.diary ?? {
        usedDays: 0,
        lastUsedDay: '',
      };

      if (currentDiary.lastUsedDay === today) {
        return prev;
      }

      return {
        ...prev,
        progress: {
          ...prev.progress,
          diary: {
            usedDays: currentDiary.usedDays + 1,
            lastUsedDay: today,
          },
        },
        updatedAt: Date.now(),
      };
    });
  }, [updateProfile]);

  function createEntry() {
    const trimmed = text.trim();
    if (!trimmed) return;

    const e: MeEntry = {
      id: uid('me'),
      createdAt: Date.now(),
      text: trimmed,
      stickers: [],
    };

    const next = [e, ...entries];
    setEntries(next);
    setActiveEntryId(e.id);
    setText('');
  }

  function addSticker(sid: DiaryStickerId) {
    if (!activeEntry) return;

    const s: MeSticker = {
      id: uid('stk'),
      stickerId: sid,
      xPx: 220,
      yPx: 120,
      rot: (Math.random() * 16 - 8),
      size: 120,
    };

    setEntries((prev) =>
      prev.map((e) => (e.id === activeEntry.id ? { ...e, stickers: [...e.stickers, s] } : e))
    );
  }

  function updateSticker(stickerId: string, patch: Partial<MeSticker>) {
    if (!activeEntry) return;
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== activeEntry.id) return e;
        return {
          ...e,
          stickers: e.stickers.map((s) => (s.id === stickerId ? { ...s, ...patch } : s)),
        };
      })
    );
  }

  function removeSticker(stickerId: string) {
    if (!activeEntry) return;
    setEntries((prev) =>
      prev.map((e) => (e.id === activeEntry.id ? { ...e, stickers: e.stickers.filter((s) => s.id !== stickerId) } : e))
    );
  }

  function startEditing(entry: MeEntry) {
    setEditingEntryId(entry.id);
    setEditText(entry.text);
  }

  function saveEdit() {
    if (!editingEntryId) return;
    const trimmed = editText.trim();
    if (!trimmed) return;
    setEntries((prev) => prev.map((e) => (e.id === editingEntryId ? { ...e, text: trimmed } : e)));
    setEditingEntryId(null);
    setEditText('');
  }

  function cancelEdit() {
    setEditingEntryId(null);
    setEditText('');
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Create */}
      <div className="rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="text-sm font-extrabold text-slate-900">
            {t('diaries.me.writeTitle', { defaultValue: 'Neue Seite schreiben' })}
          </div>
          <div className="mt-2 text-sm text-slate-600">
            {t('diaries.me.writeHint', { defaultValue: 'Schreib einfach drauflos. Danach kannst du Sticker draufkleben.' })}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('diaries.me.placeholder', { defaultValue: 'Heute war…' })}
            className="mt-4 w-full min-h-[140px] rounded-2xl border border-slate-200 bg-white p-4 text-base leading-relaxed outline-none focus:ring-2 focus:ring-[var(--color-teal-200)]"
          />

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={createEntry}
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
            >
              {t('diaries.me.save', { defaultValue: 'Seite speichern' })}
            </button>
            <div className="text-xs text-slate-500">
              {t('diaries.me.localOnly', { defaultValue: 'Wird nur auf diesem Gerät gespeichert.' })}
            </div>
          </div>
        </div>
      </div>

      {/* List + Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="text-sm font-extrabold text-slate-900">
                {t('diaries.me.pagesTitle', { defaultValue: 'Deine Seiten' })}
              </div>

              {entries.length === 0 ? (
                <div className="mt-3 text-sm text-slate-600">
                  {t('diaries.me.noPages', { defaultValue: 'Noch keine Einträge. Schreib deine erste Seite oben.' })}
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {entries.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setActiveEntryId(e.id)}
                      className={[
                        'w-full text-left rounded-2xl border p-3 transition',
                        e.id === activeEntryId
                          ? 'border-[var(--color-teal-300)] bg-[var(--color-teal-50)]'
                          : 'border-slate-200 bg-white hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <div className="flex gap-3 items-start">
                        <MiniEntryPreview entry={e} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-500">{formatDate(e.createdAt)}</div>
                          <div className="mt-1 text-sm font-semibold text-slate-900 line-clamp-3 diary-hand">
                            {e.text}
                          </div>
                          {e.stickers.length > 0 && (
                            <div className="mt-2 text-xs text-slate-400">{e.stickers.length} Sticker</div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-extrabold text-slate-900">
                  {t('diaries.me.canvasTitle', { defaultValue: 'Sticker & Seite' })}
                </div>
                <div className="flex items-center gap-2">
                  {activeEntry ? (
                    <div className="text-xs font-bold text-slate-500">{formatDate(activeEntry.createdAt)}</div>
                  ) : null}
                  {activeEntry && editingEntryId !== activeEntry.id ? (
                    <button
                      type="button"
                      onClick={() => startEditing(activeEntry)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Bearbeiten
                    </button>
                  ) : null}
                </div>
              </div>

              {!activeEntry ? (
                <div className="mt-4 text-sm text-slate-600">
                  {t('diaries.me.pickPage', { defaultValue: 'Wähle links eine Seite aus.' })}
                </div>
              ) : (
                <>
                  {/* Sticker Picker */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {DIARY_STICKERS.map((sid) => (
                      <button
                        key={sid}
                        type="button"
                        onClick={() => addSticker(sid)}
                        className="transition-transform hover:scale-110 active:scale-95"
                        aria-label={sid}
                      >
                        <img src={stickerSrc(sid, 256)} alt={sid} className="w-10 h-10" />
                      </button>
                    ))}
                  </div>

                  {/* Canvas */}
                  <div className="mt-4 rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,250,240,1),rgba(255,255,255,1))] overflow-hidden">
                    <div ref={canvasRef} className={['relative p-5 sm:p-6', editingEntryId === activeEntry.id ? '' : 'touch-none'].join(' ')} style={{ minHeight: 340 }}>
                      {/* Text */}
                      <div className="relative z-0">
                        {editingEntryId === activeEntry.id ? (
                          <>
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full min-h-[140px] rounded-xl border border-slate-200 bg-white p-3 text-base leading-relaxed outline-none focus:ring-2 focus:ring-[var(--color-teal-200)] resize-none"
                            />
                            <div className="mt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={saveEdit}
                                className="rounded-xl bg-[var(--color-teal-600)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-teal-700)]"
                              >
                                Speichern
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                Abbrechen
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-[18px] leading-8 text-slate-900 diary-hand whitespace-pre-wrap">
                            {activeEntry.text}
                          </div>
                        )}
                      </div>

                      {/* Stickers layer */}
                      <div
                        className={['absolute inset-0 z-10', editingEntryId === activeEntry.id ? 'pointer-events-none' : 'pointer-events-auto'].join(' ')}
                        onClick={() => setSelectedStickerId(null)}
                      >
                        {activeEntry.stickers.map((s) => (
                          <StickerDraggable
                            key={s.id}
                            sticker={s}
                            canvasRef={canvasRef}
                            selected={s.id === selectedStickerId}
                            onSelect={() => setSelectedStickerId(s.id)}
                            onMove={(xPx, yPx) => updateSticker(s.id, { xPx, yPx })}
                            onRemove={() => { removeSticker(s.id); setSelectedStickerId(null); }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    {t('diaries.me.dragHint', { defaultValue: 'Sticker antippen zum Auswählen, dann ✕ zum Entfernen.' })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StickerDraggable(props: {
  sticker: MeSticker;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  selected: boolean;
  onSelect: () => void;
  onMove: (xPx: number, yPx: number) => void;
  onRemove: () => void;
}) {
  const { sticker, canvasRef, selected, onSelect, onMove, onRemove } = props;
  const divRef = useRef<HTMLDivElement>(null);

  const drag = useRef({
    down: false,
    pid: -1,
    startX: 0,
    startY: 0,
    baseXPx: sticker.xPx,
    baseYPx: sticker.yPx,
    raf: 0 as any,
    nextXPx: sticker.xPx,
    nextYPx: sticker.yPx,
    hasMoved: false,
  });

  useEffect(() => {
    if (!drag.current.down) {
      drag.current.baseXPx = sticker.xPx;
      drag.current.baseYPx = sticker.yPx;
      drag.current.nextXPx = sticker.xPx;
      drag.current.nextYPx = sticker.yPx;
    }
  }, [sticker.xPx, sticker.yPx]);

  const clampPx = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  return (
    <div
      ref={divRef}
      className="absolute pointer-events-auto select-none"
      style={{
        left: sticker.xPx,
        top: sticker.yPx,
        width: sticker.size,
        height: sticker.size,
        transform: `translate(-50%, -50%) rotate(${sticker.rot}deg)`,
        touchAction: 'none',
        willChange: 'left, top',
        zIndex: selected ? 20 : undefined,
      }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();

        const canvas = canvasRef.current;
        if (!canvas) return;

        drag.current.down = true;
        drag.current.pid = e.pointerId;
        drag.current.startX = e.clientX;
        drag.current.startY = e.clientY;
        drag.current.baseXPx = sticker.xPx;
        drag.current.baseYPx = sticker.yPx;
        drag.current.nextXPx = sticker.xPx;
        drag.current.nextYPx = sticker.yPx;
        drag.current.hasMoved = false;

        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current.down || drag.current.pid !== e.pointerId) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const r = canvas.getBoundingClientRect();
        const dx = e.clientX - drag.current.startX;
        const dy = e.clientY - drag.current.startY;

        if (Math.abs(dx) + Math.abs(dy) > 6) drag.current.hasMoved = true;

        const rawX = drag.current.baseXPx + dx;
        const rawY = drag.current.baseYPx + dy;

        const half = sticker.size / 2;
        const xPx = clampPx(rawX, half + 8, r.width - half - 8);
        const yPx = clampPx(rawY, half + 8, r.height - half - 8);

        drag.current.nextXPx = xPx;
        drag.current.nextYPx = yPx;

        if (!drag.current.raf) {
          drag.current.raf = requestAnimationFrame(() => {
            drag.current.raf = 0;
            const el = divRef.current;
            if (el) {
              el.style.left = `${drag.current.nextXPx}px`;
              el.style.top = `${drag.current.nextYPx}px`;
            }
          });
        }
      }}
      onPointerUp={(e) => {
        if (drag.current.down && drag.current.pid === e.pointerId) {
          if (drag.current.hasMoved) {
            onMove(drag.current.nextXPx, drag.current.nextYPx);
          } else {
            onSelect();
          }
        }
        drag.current.down = false;
        drag.current.pid = -1;
        try {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }}
      onPointerCancel={() => {
        if (drag.current.down) {
          onMove(drag.current.nextXPx, drag.current.nextYPx);
        }
        drag.current.down = false;
        drag.current.pid = -1;
      }}
    >
      <img
        src={stickerSrc(sticker.stickerId, 256)}
        alt=""
        className={['w-full h-full pointer-events-none transition-[filter]', selected ? 'drop-shadow-[0_0_6px_rgba(0,0,0,0.35)]' : ''].join(' ')}
        draggable={false}
      />

      {selected && (
        <button
          type="button"
          aria-label="Sticker entfernen"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs shadow-md hover:bg-red-600 transition-colors"
          style={{ transform: `rotate(${-sticker.rot}deg)` }}
        >
          ✕
        </button>
      )}
    </div>
  );
}