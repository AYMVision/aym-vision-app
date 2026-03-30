// src/pages/Cards.tsx
// Sammelkarten-Album (aus Bonus-Characters extrahiert)
// Regeln: i18n (Namespace 'bonus'), Unlock via isBonusUnlocked, Seen via bonusSeen.

import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { assetUrl } from '../common/assetUrl';


import { useProfile } from '../profile/useProfile';
import { CHARACTERS } from '../content/characters';

import { BONUS_INDEX, type BonusItem } from '../bonus/bonusIndex';
import { isBonusUnlocked, sortBonus, type BonusProgressSnapshot } from '../bonus/bonusUnlock';
import { getCharacterCardState } from '../bonus/bonusCards';
import { loadSeenBonusIds } from '../bonus/bonusSeen';


type LocationState = { backTo?: string } | null;

function useBonusProgressFromProfile(): BonusProgressSnapshot {
  const { profile } = useProfile();

  const completed = profile.progress?.completedChapters ?? {};
  const seen = new Set<string>();

  // completedChapters Keys: "s1:s1e01:c01" => "s1e01c01"
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
}

function CharacterCardTile({
  item,
  unlocked,
  opened,
  onOpen,
}: {
  item: BonusItem;
  unlocked: boolean;
  opened: boolean;
  onOpen: (bonusId: string) => void;
}) {
  const { t } = useTranslation('bonus');
  const state = getCharacterCardState({ item, unlocked, opened });
  const isMyCard = item.bonusId === 'my-card';

// ✅ CharacterId kommt aus BonusItem.characterId (bonusId ist z.B. "char-chioma")
const characterId = item.characterId as keyof typeof CHARACTERS | undefined;
const character = characterId ? (CHARACTERS as any)[characterId] ?? null : null;




const isLocked = isMyCard ? false : state === 'unknown';
const isNew = isMyCard ? false : state === 'unlocked';
const isCollected = isMyCard ? true : state === 'collected';

  // ✅ Name immer anzeigen
 const displayName = isMyCard
  ? t('charactersUi.myCard.title', { defaultValue: 'Meine Karte' })
  : character?.name ?? (characterId ?? item.bonusId);



  const PALETTES = [
    { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800' },
    { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', badge: 'bg-rose-100 text-rose-800' },
    { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-900', badge: 'bg-sky-100 text-sky-800' },
    { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-800' },
    { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900', badge: 'bg-violet-100 text-violet-800' },
    { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', badge: 'bg-orange-100 text-orange-800' },
  ] as const;

  const idx =
    typeof characterId === 'string'
      ? Array.from(characterId).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % PALETTES.length
      : 0;

  const theme = character?.mainTheme ?? PALETTES[idx];

  const cardBg = isLocked ? 'bg-white' : theme.bg;
  const cardBorder = isLocked ? 'border-slate-200' : theme.border;
  const textColor = isLocked ? 'text-slate-700' : theme.text;

  return (
    <button
      type="button"
      onClick={() => {
        if (isLocked) return;
        onOpen(item.bonusId);
      }}
      disabled={isLocked}
      className={[
        'relative rounded-2xl border p-4 transition shadow-sm text-left',
        'active:scale-[0.99]',
        cardBg,
        cardBorder,
        isLocked ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md',
      ].join(' ')}
    >
      <div className="absolute right-3 top-3 flex items-center gap-2">
        {isLocked && (
          <span className="text-lg" aria-label={t('locked', { defaultValue: 'Gesperrt' })}>
            🔒
          </span>
        )}

        {isNew && (
          <span className={['text-[11px] font-extrabold px-2 py-1 rounded-full', theme.badge].join(' ')}>
            ✨ {t('charactersUi.new', { defaultValue: 'NEU' })}
          </span>
        )}

        {isCollected && (
          <span className={['text-[11px] font-extrabold px-2 py-1 rounded-full', theme.badge].join(' ')}>
            ⭐ {t('charactersUi.collectedShort', { defaultValue: 'GESAMMELT' })}
          </span>
        )}
      </div>

      <div
        className={[
          'rounded-2xl border p-3',
          isCollected ? 'bg-white/70 border-black/10' : 'bg-white/40 border-black/5',
        ].join(' ')}
      >
        <div className="flex items-center gap-3">
          <div
            className={[
              'w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm',
              isLocked ? 'bg-slate-50 border-black/5' : 'bg-white/70 border-black/10',
            ].join(' ')}
          >
            
{isMyCard ? (
  <span className="text-2xl">🪪</span>
) : isLocked ? (
  <span className="text-2xl">❓</span>
) : (
  (() => {
    const portrait = (character as any)?.card?.portrait as string | undefined;

    return portrait ? (
      <img
        alt=""
        src={assetUrl(portrait)}
        className="w-full h-full object-cover rounded-2xl"
        loading="lazy"
        decoding="async"
      />
    ) : (
      <span className="text-2xl">🙂</span>
    );
  })()
)}


          </div>

          <div className="min-w-0 flex-1">
            <div className={['font-extrabold tracking-tight truncate', textColor].join(' ')}>
              {displayName}
            </div>

{isMyCard ? (
  <div className="mt-1 text-xs text-slate-700/80">
    {t('charactersUi.myCard.hint', { defaultValue: 'Hier kannst du deine eigene Karte gestalten.' })}
  </div>
) : isLocked ? (
  <div className="mt-1 text-xs text-slate-600/80">
    {t('charactersUi.lockedHint', { defaultValue: 'Wird später freigeschaltet.' })}
  </div>
) : isNew ? (
  <div className="mt-1 text-xs text-slate-700 line-clamp-2">
    {t('charactersUi.tapToOpen', { defaultValue: 'Tippe, um die Karte zu öffnen!' })}
  </div>
) : (
  <div className="mt-1 text-xs text-slate-700/80">
    {t('charactersUi.viewHint', { defaultValue: 'Schon geöffnet – du kannst sie ansehen.' })}
  </div>
)}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-[11px] font-semibold text-slate-700/80">
            {t('charactersUi.card', { defaultValue: 'Charakterkarte' })}
          </div>

          <div className="text-[11px] font-extrabold text-slate-900">
{isMyCard ? (
  <span>{t('charactersUi.myCard.edit', { defaultValue: 'Bearbeiten →' })}</span>
) : isLocked ? (
  <span className="text-slate-500">{t('charactersUi.locked', { defaultValue: 'Gesperrt' })}</span>
) : isNew ? (
  <span>{t('charactersUi.openNow', { defaultValue: 'Öffnen →' })}</span>
) : (
  <span>{t('charactersUi.view', { defaultValue: 'Ansehen →' })}</span>
)}
          </div>
        </div>
      </div>

      {isCollected && (
        <div className="absolute left-3 top-3 text-sm" aria-hidden>
          ✨
        </div>
      )}
    </button>
  );
}

function CardsHero() {
  const { t } = useTranslation('bonus');

  return (
    <section className="relative mt-4 sm:mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-200 via-rose-100 to-amber-100 px-4 py-5 shadow-md border border-white/40">
      <div className="pointer-events-none absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
      <div className="pointer-events-none absolute top-6 right-4 w-20 h-20 rounded-full bg-yellow-300/30 blur-xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 w-24 h-24 rounded-full bg-pink-300/20 blur-xl" />

      <div className="relative">
        <div className="text-xs font-extrabold text-slate-700">
          {t('cards.kicker', { defaultValue: 'Bonuswelt' })}
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          🎴 {t('cards.title', { defaultValue: 'Sammelkarten' })}
        </h1>

        <p className="mt-1 text-sm text-slate-800 max-w-md">
          {t('cards.subtitle', {
            defaultValue: 'Schalte neue Karten frei und entdecke die Figuren aus der Story.',
          })}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70">🎴 Sammeln</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70">✨ Neu entdecken</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70">👀 Öffnen</span>
        </div>
      </div>
    </section>
  );
}

export default function Cards() {
  const { t } = useTranslation('bonus');
  const location = useLocation();
  const navigate = useNavigate();

const [cardToast, setCardToast] =
  useState<null | { bonusId: string; title: string; subtitle?: string }>(null);

function openCardModal(bonusId: string) {
  navigate(`/cards/${bonusId}`, {
    state: {
      backgroundLocation: location,
      backTo: location.pathname + location.search + location.hash,
      autoOpen: true,
    },
  });
}




  const state = (location.state ?? null) as LocationState;

  const progress = useBonusProgressFromProfile();

  // ✅ nur lesen – Seen wird in CardDetail gesetzt
  const [seenBonusIds] = useState<string[]>(() => loadSeenBonusIds());

function openBonus(bonusId: string) {
  if (bonusId === 'my-card') {
    navigate('/cards/my-card', {
      state: { backTo: state?.backTo ?? '/cards' },
    });
    return;
  }

  navigate(`/cards/${bonusId}`, {
    state: { backTo: state?.backTo ?? '/cards' },
  });
}

const items = useMemo(() => {
  const base = sortBonus(BONUS_INDEX.filter((i) => i.category === 'characters'));

  const myCardItem: BonusItem = {
    bonusId: 'my-card',
    category: 'characters',
    mediaType: 'text',
    released: true,
    order: -999,
    titleKey: '',
    descriptionKey: '',
  };

  return [myCardItem, ...base];
}, []);

  return (
    <Layout title={t('cards.title', { defaultValue: 'Sammelkarten' })} backPath={state?.backTo ?? '/bonus'}>
      <div className="max-w-3xl mx-auto px-4">
  
<CardsHero />

        <div className="mt-4 rounded-3xl border border-black/5 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between px-2">
            <div className="text-xs font-extrabold text-slate-700">
              {t('charactersUi.collectionTitle', { defaultValue: '🎴 Sammelkarten' })}
            </div>
            <div className="text-xs text-slate-600">
              {t('charactersUi.collectionHint', { defaultValue: 'Tippe auf eine freigeschaltete Karte, um sie zu öffnen.' })}
            </div>
          </div>

          <div className="relative rounded-2xl bg-white/60 p-2 overflow-hidden">
            <div className="pointer-events-none absolute -top-6 -left-6 w-20 h-20 rounded-full bg-amber-200/30" />
            <div className="pointer-events-none absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-sky-200/30" />
            <div className="pointer-events-none absolute top-8 right-10 w-16 h-16 rounded-full bg-rose-200/25" />

<div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
{items.map((item) => {
  const unlocked =
    item.characterId === 'amy' ? true : isBonusUnlocked(item, progress);

  const opened = seenBonusIds.includes(item.bonusId);

  return (
    <CharacterCardTile
      key={item.bonusId}
      item={item}
      unlocked={unlocked}
      opened={opened}
      onOpen={openBonus}
    />
  );
})}
</div>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </Layout>
  );
}
