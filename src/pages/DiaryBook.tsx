// src/pages/DiaryBook.tsx
import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  hasDiaryPin,
  setDiaryPin,
  verifyDiaryPin,
  getDiaryPinHint,
} from '../diary/diaryPin';

import Layout from '../components/Layout';
import AvatarStage from '../components/AvatarStage';
import { BONUS_INDEX } from '../bonus/bonusIndex';
import { useProfile } from '../profile/useProfile';
import type { BonusProgressSnapshot } from '../bonus/bonusUnlock';
import { shouldBypassAll } from '../gating/entitlements';
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


// ✅ unlocked = bypass (AMY-DEV) OR chapter done OR clicked (bonusSeen)
function isEntryUnlocked(entry: DiaryEntry, progress: BonusProgressSnapshot): boolean {
  if (shouldBypassAll()) return true;
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
  const location = useLocation();
  const state = location.state as LocationState | null;
  const isModal = Boolean((state as any)?.backgroundLocation);
  const { profile } = useProfile();
  const progress = useBonusProgressFromProfile();

  const { diaryId: diaryIdParam } = useParams<{ diaryId: string }>();
  const diaryId = safeDiaryId(diaryIdParam);

  const entryParam = useMemo(() => parseQuery(location.search).get('entry') ?? '', [location.search]);

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
      hideFooter={isModal}
    >
      <div className="max-w-3xl mx-auto px-4 pt-4">

        {/* HERO (book cover vibe) */}
        <div className={['mt-4 rounded-3xl border bg-white shadow-sm overflow-hidden', style.border].join(' ')}>
          <div className="p-5 sm:p-6 flex items-center gap-4">
            <div className={['w-24 h-32 rounded-2xl border overflow-hidden', style.border].join(' ')}>
              {diaryId === 'diary_me' ? (
                <AvatarStage
                  key={`${profile.avatarBaseId}-${profile.equipment?.featured ?? ''}-${profile.equipment?.background ?? ''}-${profile.equipment?.effect ?? ''}`}
                  avatarBaseId={profile.avatarBaseId}
                  equipment={profile.equipment}
                  width={96}
                  height={128}
                  withBackdrop={false}
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

  const { unlockedEntries, entryParam, heroImage, styleBorder } = props;

  return (
    <div className={['mt-6 rounded-[28px] border bg-white shadow-sm overflow-hidden', styleBorder].join(' ')}>
      <div className="relative p-5 sm:p-6" style={{ minHeight: 340 }}>
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
        'rounded-3xl border bg-white/75 p-4 sm:p-5 scroll-mt-24 overflow-hidden',
        accent.border,
        highlight ? `ring-2 ${accent.ring}` : '',
      ].join(' ')}
    >
      {/* Kopfzeile: Datum-Badge links, Sticker rechts — Text darunter auf voller Breite */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className={['inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold shrink-0', accent.marker].join(' ')}>
          {entry.decor?.moodEmoji ?? '📌'}
          <span className="ml-2">{dateLabel || entryLabel}</span>
        </span>
        <div className="flex items-center gap-1 pointer-events-none">
          {autoStickers.slice(0, 2).map((sid, idx) => (
            <img
              key={`${entry.entryId}-${sid}-${idx}`}
              src={stickerSrc(sid, 256)}
              alt=""
              className={['w-12 h-12', idx === 1 ? 'rotate-[8deg]' : '-rotate-[4deg]'].join(' ')}
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {(() => {
        const title = entry.titleKey ? t(entry.titleKey, { defaultValue: '' }).trim() : '';
        return title ? <div className="mt-3 text-sm font-extrabold text-slate-900">{title}</div> : null;
      })()}

      <div className="mt-3 text-xl leading-8 text-slate-900 diary-hand whitespace-pre-wrap">
        {body}
      </div>
    </article>
  );
}


// -------------------- MY DIARY --------------------

function getDailyPrompt(prompts: string[]): string {
  if (!prompts.length) return '';
  const d = new Date();
  return prompts[(d.getDate() + d.getMonth() * 3) % prompts.length];
}

// -------------------- PIN wrapper --------------------
function MyDiaryWithPin() {
  const { t } = useTranslation('bonus');

  const [hasPin, setHasPin] = useState(() => hasDiaryPin());
  const [unlocked, setUnlocked] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);

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
    if (ok) { setHasPin(true); setShowPinSetup(false); }
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

  // Optional PIN setup (user chose to protect diary from inside)
  if (!hasPin && showPinSetup) {
    return (
      <div className="mt-6 rounded-[28px] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-purple-50 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-5">
            <span className="text-3xl shrink-0">🔒</span>
            <div>
              <div className="text-base font-extrabold text-slate-900">
                {t('diaries.pin.setupTitle', { defaultValue: 'Tagebuch schützen' })}
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {t('diaries.pin.setupBody', { defaultValue: 'Leg einen PIN fest, damit nur du dein Tagebuch lesen kannst.' })}
              </p>
            </div>
          </div>

          <div className="space-y-3">
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
                className="mt-1 w-full rounded-xl border border-violet-200 px-4 py-3 text-[16px] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white"
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
                className="mt-1 w-full rounded-xl border border-violet-200 px-4 py-3 text-[16px] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white"
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
                className="mt-1 w-full rounded-xl border border-violet-200 px-4 py-3 text-[16px] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white"
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
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {t('diaries.pin.setupButton', { defaultValue: 'PIN festlegen →' })}
            </button>
            <button
              type="button"
              onClick={() => setShowPinSetup(false)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t('diaries.pin.skipButton', { defaultValue: 'Jetzt ohne PIN weiter' })}
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            {t('diaries.pin.parentNote', { defaultValue: 'Vergessen? Eltern können den PIN im Elternbereich zurücksetzen – deine Einträge bleiben dabei erhalten.' })}
          </p>
        </div>
      </div>
    );
  }

  // No PIN or already unlocked → show diary directly
  if (!hasPin || unlocked) {
    return <MyDiarySection hasPin={hasPin} onRequestPinSetup={() => setShowPinSetup(true)} />;
  }

  // Has PIN but locked — show unlock screen
  return (
    <div className="mt-6 rounded-[28px] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-purple-50 shadow-sm overflow-hidden">
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
          className="mt-5 w-full rounded-xl border border-violet-200 px-4 py-3 text-center text-lg font-bold tracking-widest outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white"
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
          className="mt-4 w-full rounded-xl bg-violet-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {t('diaries.pin.unlockButton', { defaultValue: 'Öffnen →' })}
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
                {t('diaries.pin.forgotHint', { defaultValue: 'Vergessen? Bitte deine Eltern, den PIN im Elternbereich zurückzusetzen. Deine Einträge bleiben erhalten.' })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------- diary_me content --------------------
function MyDiarySection({ hasPin, onRequestPinSetup }: { hasPin: boolean; onRequestPinSetup: () => void }) {
  const { t } = useTranslation('bonus');
  const { updateProfile } = useProfile();
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const [entries, setEntries] = useState<MeEntry[]>(() =>
    loadMeDiary().sort((a, b) => b.createdAt - a.createdAt)
  );
  const [text, setText] = useState('');
  const [draftStickers, setDraftStickers] = useState<DiaryStickerId[]>([]);
  const [draftStickerPos, setDraftStickerPos] = useState<Record<string, { xPx: number; yPx: number; rot: number; size: number }>>({});
  const paperRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<'write' | 'view'>(() => entries.length > 0 ? 'view' : 'write');
  const [showPinBanner, setShowPinBanner] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(entries[0]?.id ?? null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  const dailyPromptList = t('diaries.me.dailyPrompts', { returnObjects: true }) as string[];
  const dailyPrompt = useMemo(
    () => getDailyPrompt(Array.isArray(dailyPromptList) ? dailyPromptList : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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

  function toggleDraftSticker(sid: DiaryStickerId) {
    setDraftStickers((prev) => {
      if (prev.includes(sid)) {
        setDraftStickerPos((p) => { const n = { ...p }; delete n[sid]; return n; });
        return prev.filter((s) => s !== sid);
      }
      // Assign a default position spread across the right side of the paper
      const idx = prev.length;
      const defaultPositions = [
        { xPx: 240, yPx: 70, rot: -8, size: 100 },
        { xPx: 235, yPx: 210, rot: 10, size: 95 },
        { xPx: 245, yPx: 340, rot: -5, size: 100 },
      ];
      const pos = defaultPositions[idx] ?? { xPx: 230 + idx * 10, yPx: 80 + idx * 120, rot: (idx % 2 === 0 ? -6 : 8), size: 100 };
      setDraftStickerPos((p) => ({ ...p, [sid]: pos }));
      return [...prev, sid];
    });
  }

  function createEntry() {
    const trimmed = text.trim();
    if (!trimmed) return;

    const stickers: MeSticker[] = draftStickers.slice(0, 3).map((stickerId) => {
      const pos = draftStickerPos[stickerId] ?? { xPx: 235, yPx: 120, rot: -6, size: 100 };
      return { id: uid('stk'), stickerId, ...pos };
    });

    const e: MeEntry = { id: uid('me'), createdAt: Date.now(), text: trimmed, stickers };
    const next = [e, ...entries];
    setEntries(next);
    setActiveEntryId(e.id);
    setText('');
    setDraftStickers([]);
    setDraftStickerPos({});
    setMode('view');

    if (!hasPin && entries.length === 0) {
      setTimeout(() => setShowPinBanner(true), 400);
    }
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
    setSelectedStickerId(s.id);
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

  function deleteEntry(id: string) {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    if (activeEntryId === id) {
      if (next.length > 0) { setActiveEntryId(next[0].id); setMode('view'); }
      else { setActiveEntryId(null); setMode('write'); }
    }
    setDeletingEntryId(null);
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
    <div className="mt-6 space-y-4 overflow-x-hidden">

      {/* ── PIN-SCHUTZ-BANNER ── */}
      {showPinBanner && !hasPin && (
        <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-purple-50 p-4 flex items-start gap-3 shadow-sm">
          <span className="text-2xl shrink-0 mt-0.5">🔒</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-extrabold text-violet-900">
              {t('diaries.pin.bannerTitle', { defaultValue: 'Tagebuch schützen?' })}
            </div>
            <p className="mt-1 text-xs text-violet-800 leading-relaxed">
              {t('diaries.pin.bannerBody', { defaultValue: 'Andere Personen, die dieses Gerät nutzen, könnten deine Einträge lesen. Mit einem PIN gehört dein Tagebuch wirklich nur dir.' })}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => { setShowPinBanner(false); onRequestPinSetup(); }}
                className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-violet-700 transition-colors">
                {t('diaries.pin.bannerYes', { defaultValue: 'Ja, PIN festlegen →' })}
              </button>
              <button type="button" onClick={() => setShowPinBanner(false)}
                className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-violet-50 transition-colors">
                {t('diaries.pin.bannerSkip', { defaultValue: 'Später' })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SEITEN-LEISTE (horizontal, oben) ── */}
      {entries.length > 0 && (
        <div className="overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
            <button type="button" onClick={() => { setMode('write'); setText(''); setDraftStickers([]); setDraftStickerPos({}); setSelectedStickerId(null); }}
              className={['shrink-0 rounded-2xl border px-4 py-3 text-sm font-semibold transition flex flex-col items-center justify-center gap-1 w-[100px]',
                mode === 'write' ? 'border-violet-300 bg-violet-50 text-violet-700' : 'border-dashed border-violet-200 text-violet-600 hover:bg-violet-50 bg-white'].join(' ')}>
              <span className="text-xl">✏️</span>
              <span>{t('diaries.me.newPage', { defaultValue: 'Neue Seite' })}</span>
            </button>
            {entries.map((e) => (
              <div key={e.id} className={['shrink-0 rounded-2xl border transition overflow-hidden',
                e.id === activeEntryId && mode === 'view' ? 'border-violet-300 bg-violet-50' : 'border-slate-200 bg-white'].join(' ')}>
                <button type="button"
                  onClick={() => { setActiveEntryId(e.id); setMode('view'); setDeletingEntryId(null); setEditingEntryId(null); }}
                  className="flex flex-col items-start p-2.5 w-[120px]">
                  <div className="text-[10px] font-bold text-slate-400">{formatDate(e.createdAt)}</div>
                  <div className="mt-1 text-xs text-slate-700 line-clamp-2 diary-hand leading-snug">{e.text}</div>
                  {e.stickers.length > 0 && (
                    <div className="mt-1.5 flex gap-0.5">
                      {e.stickers.slice(0, 3).map(s => (
                        <img key={s.id} src={stickerSrc(s.stickerId, 256)} alt="" className="w-5 h-5" />
                      ))}
                    </div>
                  )}
                </button>
                {deletingEntryId === e.id ? (
                  <div className="flex items-center gap-1 px-2 pb-2">
                    <button type="button" onClick={() => deleteEntry(e.id)}
                      className="rounded-lg bg-red-500 px-2 py-1 text-[10px] font-extrabold text-white hover:bg-red-600">
                      {t('diaries.me.deleteYes', { defaultValue: 'Ja, löschen' })}
                    </button>
                    <button type="button" onClick={() => setDeletingEntryId(null)}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50">
                      {t('diaries.me.deleteNo', { defaultValue: 'Nein' })}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end px-2 pb-1.5">
                    <button type="button" onClick={() => setDeletingEntryId(e.id)} aria-label="Seite löschen"
                      className="text-slate-300 hover:text-red-400 transition-colors text-sm leading-none">🗑</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HAUPTBEREICH: SCHREIBEN oder CANVAS ── */}
      <div className="rounded-3xl border border-violet-100 overflow-hidden shadow-sm w-full min-w-0">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 bg-violet-50 border-b border-violet-100">
          <span className="text-xl" aria-hidden>{mode === 'write' ? '✏️' : '📄'}</span>
          <div className="text-sm font-extrabold text-violet-900">
            {mode === 'write'
              ? t('diaries.me.writeTitle', { defaultValue: 'Neue Seite' })
              : formatDate(activeEntry?.createdAt ?? Date.now())}
          </div>
          {mode === 'view' && activeEntry && editingEntryId !== activeEntry.id && (
            <button type="button" onClick={() => startEditing(activeEntry)}
              className="ml-2 rounded-xl border border-violet-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-violet-50">
              {t('diaries.me.editButton', { defaultValue: 'Bearbeiten' })}
            </button>
          )}
          <div className="ml-auto text-xs text-violet-400 font-semibold">
            {mode === 'write'
              ? new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })
              : null}
          </div>
        </div>

        {mode === 'write' ? (
          <>
            {/* Liniertes Papier */}
            <div ref={paperRef} className="relative" onClick={() => setSelectedStickerId(null)} style={{
              backgroundImage: `linear-gradient(to right, rgba(139,92,246,0.25) 1px, transparent 1px),repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(15,23,42,0.07) 31px, rgba(15,23,42,0.07) 32px),linear-gradient(180deg, rgba(255,253,255,1), rgba(255,255,255,1))`,
              backgroundSize: '1px 100%, 100% 32px, 100% 100%',
              backgroundPosition: '52px 0, 0 8px, 0 0',
              backgroundRepeat: 'no-repeat, repeat, no-repeat',
            }}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={dailyPrompt}
                rows={6}
                className="w-full bg-transparent pl-[68px] pr-4 py-2 text-xl diary-hand text-slate-900 outline-none resize-none placeholder:text-slate-300"
                style={{ lineHeight: '32px' }}
              />
              {/* Live-Sticker auf dem Papier — sofort verschiebbar */}
              {draftStickers.length > 0 && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {draftStickers.map((sid) => {
                    const pos = draftStickerPos[sid];
                    if (!pos) return null;
                    const fakeSticker: MeSticker = { id: sid, stickerId: sid, ...pos };
                    return (
                      <StickerDraggable
                        key={sid}
                        sticker={fakeSticker}
                        canvasRef={paperRef}
                        selected={selectedStickerId === sid}
                        onSelect={() => setSelectedStickerId(sid)}
                        onMove={(xPx, yPx) => setDraftStickerPos((p) => ({ ...p, [sid]: { ...p[sid], xPx, yPx } }))}
                        onResize={(size) => setDraftStickerPos((p) => ({ ...p, [sid]: { ...p[sid], size } }))}
                        onRemove={() => { toggleDraftSticker(sid); setSelectedStickerId(null); }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sticker-Auswahl */}
            <div className="px-4 pt-3 pb-2 border-t border-slate-100 bg-white">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wide mb-2">
                {t('diaries.me.stickerLabel', { defaultValue: 'Sticker auf deine Seite kleben:' })}
              </div>
              <div className="flex flex-wrap gap-1">
                {DIARY_STICKERS.map((sid) => (
                  <button key={sid} type="button" onClick={() => toggleDraftSticker(sid)}
                    aria-label={sid} aria-pressed={draftStickers.includes(sid)}
                    className={['rounded-xl p-0.5 transition-all duration-150',
                      draftStickers.includes(sid) ? 'ring-2 ring-violet-400 bg-violet-50 scale-110' : 'hover:scale-105 hover:bg-slate-50'].join(' ')}>
                    <img src={stickerSrc(sid, 256)} alt={sid} className="w-10 h-10" loading="lazy" />
                  </button>
                ))}
              </div>
              {draftStickers.length > 0 && (
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="font-semibold text-violet-700">{t('diaries.me.stickerCount', { defaultValue: '{{count}} Sticker auf der Seite', count: draftStickers.length })}</span>
                  <button type="button" onClick={() => { setDraftStickers([]); setDraftStickerPos({}); }} className="text-slate-400 hover:text-red-500 transition-colors">
                    {t('diaries.me.stickerRemoveAll', { defaultValue: 'Alle entfernen' })}
                  </button>
                </div>
              )}
            </div>

            {/* Speichern */}
            <div className="px-5 py-4 bg-white border-t border-slate-100">
              <button type="button" onClick={createEntry} disabled={!text.trim()}
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {t('diaries.me.save', { defaultValue: 'Seite speichern ✓' })}
              </button>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                {t('diaries.me.localOnly', { defaultValue: 'Wird nur auf diesem Gerät gespeichert.' })}
              </p>
            </div>
          </>
        ) : (
          /* ── CANVAS-MODUS ── */
          activeEntry ? (
            <div className="p-4 sm:p-5">
              {/* Sticker-Picker direkt über Canvas */}
              <div className="flex flex-wrap gap-1 mb-3">
                {DIARY_STICKERS.map((sid) => (
                  <button key={sid} type="button" onClick={() => addSticker(sid)}
                    className="transition-transform hover:scale-110 active:scale-95" aria-label={sid}>
                    <img src={stickerSrc(sid, 256)} alt={sid} className="w-10 h-10" loading="lazy" />
                  </button>
                ))}
              </div>

              {/* Canvas */}
              <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,250,240,1),rgba(255,255,255,1))] overflow-hidden">
                <div ref={canvasRef}
                  className={['relative p-5 sm:p-6', editingEntryId === activeEntry.id ? '' : 'touch-none'].join(' ')}
                  style={{ minHeight: 340 }}>
                  <div className="relative z-0">
                    {editingEntryId === activeEntry.id ? (
                      <>
                        <textarea value={editText} onChange={(e) => setEditText(e.target.value)}
                          className="w-full min-h-[140px] rounded-xl border border-slate-200 bg-white p-3 text-base leading-relaxed outline-none focus:ring-2 focus:ring-[var(--color-teal-200)] resize-none" />
                        <div className="mt-2 flex gap-2">
                          <button type="button" onClick={saveEdit} className="rounded-xl bg-[var(--color-teal-600)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-teal-700)]">{t('diaries.me.editSave', { defaultValue: 'Speichern' })}</button>
                          <button type="button" onClick={cancelEdit} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">{t('diaries.me.editCancel', { defaultValue: 'Abbrechen' })}</button>
                        </div>
                      </>
                    ) : (
                      <div className="text-xl leading-8 text-slate-900 diary-hand whitespace-pre-wrap">{activeEntry.text}</div>
                    )}
                  </div>
                  <div className={['absolute inset-0 z-10', editingEntryId === activeEntry.id ? 'pointer-events-none' : 'pointer-events-auto'].join(' ')}
                    onClick={() => setSelectedStickerId(null)}>
                    {activeEntry.stickers.map((s) => (
                      <StickerDraggable key={s.id} sticker={s} canvasRef={canvasRef}
                        selected={s.id === selectedStickerId}
                        onSelect={() => setSelectedStickerId(s.id)}
                        onMove={(xPx, yPx) => updateSticker(s.id, { xPx, yPx })}
                        onResize={(size) => updateSticker(s.id, { size })}
                        onRemove={() => { removeSticker(s.id); setSelectedStickerId(null); }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                {t('diaries.me.dragHint', { defaultValue: 'Sticker verschieben: einfach ziehen. Größe ändern: zwei Finger zusammen- oder auseinanderziehen. Entfernen: antippen, dann ✕.' })}
              </div>
            </div>
          ) : null
        )}
      </div>


      {/* ── PIN-HINWEIS ── */}
      {!hasPin && entries.length > 0 && !showPinBanner && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 leading-relaxed">
          <span className="font-semibold">{t('diaries.me.pinHintNote', { defaultValue: 'Hinweis:' })}</span>{' '}
          {t('diaries.me.pinHintBody', { defaultValue: 'Du kannst auch einen PIN hinzufügen.' })}{' '}
          <button type="button" onClick={onRequestPinSetup}
            className="font-semibold underline text-violet-700 hover:text-violet-900">
            {t('diaries.me.pinSetupLink', { defaultValue: 'Jetzt mit PIN schützen →' })}
          </button>
        </div>
      )}
    </div>
  );
}

function StickerDraggable(props: {
  sticker: MeSticker;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  selected: boolean;
  onSelect: () => void;
  onMove: (xPx: number, yPx: number) => void;
  onResize: (size: number) => void;
  onRemove: () => void;
}) {
  const { sticker, canvasRef, selected, onSelect, onMove, onResize, onRemove } = props;
  const divRef = useRef<HTMLDivElement>(null);

  const drag = useRef({
    // primary pointer / drag
    down: false,
    pid: -1,
    startX: 0,
    startY: 0,
    baseXPx: sticker.xPx,
    baseYPx: sticker.yPx,
    nextXPx: sticker.xPx,
    nextYPx: sticker.yPx,
    raf: 0 as ReturnType<typeof requestAnimationFrame> | 0,
    hasMoved: false,
    // secondary pointer / pinch
    pid2: -1,
    p2X: 0,
    p2Y: 0,
    pinchStartDist: 0,
    pinchBaseSize: sticker.size,
    nextSize: sticker.size,
  });

  useEffect(() => {
    if (!drag.current.down) {
      drag.current.baseXPx = sticker.xPx;
      drag.current.baseYPx = sticker.yPx;
      drag.current.nextXPx = sticker.xPx;
      drag.current.nextYPx = sticker.yPx;
    }
    drag.current.nextSize = sticker.size;
    drag.current.pinchBaseSize = sticker.size;
  }, [sticker.xPx, sticker.yPx, sticker.size]);

  const clampPx = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  function scheduleRaf() {
    if (!drag.current.raf) {
      drag.current.raf = requestAnimationFrame(() => {
        drag.current.raf = 0;
        const el = divRef.current;
        if (!el) return;
        el.style.left = `${drag.current.nextXPx}px`;
        el.style.top = `${drag.current.nextYPx}px`;
        el.style.width = `${drag.current.nextSize}px`;
        el.style.height = `${drag.current.nextSize}px`;
      });
    }
  }

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
        willChange: 'left, top, width, height',
        zIndex: selected ? 20 : undefined,
      }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Second finger → start pinch
        if (drag.current.down && drag.current.pid !== -1) {
          drag.current.pid2 = e.pointerId;
          drag.current.p2X = e.clientX;
          drag.current.p2Y = e.clientY;
          const dx = e.clientX - drag.current.startX;
          const dy = e.clientY - drag.current.startY;
          drag.current.pinchStartDist = Math.hypot(dx, dy) || 1;
          drag.current.pinchBaseSize = drag.current.nextSize;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          return;
        }

        // First finger → drag
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
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Pinch move (second pointer)
        if (drag.current.pid2 === e.pointerId) {
          drag.current.p2X = e.clientX;
          drag.current.p2Y = e.clientY;
          const dx = drag.current.p2X - drag.current.startX;
          const dy = drag.current.p2Y - drag.current.startY;
          const dist = Math.hypot(dx, dy) || 1;
          const scale = dist / drag.current.pinchStartDist;
          drag.current.nextSize = clampPx(drag.current.pinchBaseSize * scale, 40, 240);
          scheduleRaf();
          return;
        }

        // Drag move (first pointer)
        if (!drag.current.down || drag.current.pid !== e.pointerId) return;

        const r = canvas.getBoundingClientRect();
        const dx = e.clientX - drag.current.startX;
        const dy = e.clientY - drag.current.startY;

        if (Math.abs(dx) + Math.abs(dy) > 6) drag.current.hasMoved = true;

        const half = drag.current.nextSize / 2;
        const rawX = drag.current.baseXPx + dx;
        const rawY = drag.current.baseYPx + dy;
        drag.current.nextXPx = clampPx(rawX, half + 8, r.width - half - 8);
        drag.current.nextYPx = clampPx(rawY, half + 8, r.height - half - 8);

        scheduleRaf();
      }}
      onPointerUp={(e) => {
        // Second finger lifted → commit size
        if (drag.current.pid2 === e.pointerId) {
          onResize(Math.round(drag.current.nextSize));
          drag.current.pid2 = -1;
          try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
          return;
        }

        // First finger lifted → commit position or select
        if (drag.current.down && drag.current.pid === e.pointerId) {
          if (drag.current.hasMoved) {
            onMove(drag.current.nextXPx, drag.current.nextYPx);
          } else if (drag.current.pid2 === -1) {
            onSelect();
          }
        }
        drag.current.down = false;
        drag.current.pid = -1;
        try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
      }}
      onPointerCancel={() => {
        if (drag.current.down) onMove(drag.current.nextXPx, drag.current.nextYPx);
        if (drag.current.pid2 !== -1) onResize(Math.round(drag.current.nextSize));
        drag.current.down = false;
        drag.current.pid = -1;
        drag.current.pid2 = -1;
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