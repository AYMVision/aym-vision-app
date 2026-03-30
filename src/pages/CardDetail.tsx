// src/pages/CardDetail.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout';
import { assetUrl } from '../common/assetUrl';

import { BONUS_INDEX, type BonusItem } from '../bonus/bonusIndex';
import { isBonusUnlocked, type BonusProgressSnapshot } from '../bonus/bonusUnlock';
import { loadSeenBonusIds } from '../bonus/bonusSeen';
import { unlockBonusById } from '../bonus/unlockBonusById';


import { CHARACTERS, type CharacterEx } from '../content/characters';
import { useProfile } from '../profile/useProfile';

import CharacterFriendbookCard from '../components/CharacterFriendbookCard';
import MyCharacterCardEditor from '../components/MyCharacterCardEditor';


type LocationState = { backTo?: string; backgroundLocation?: unknown; autoOpen?: boolean } | null;


type CharacterId = keyof typeof CHARACTERS;

function useBonusProgressFromProfile(): BonusProgressSnapshot {
  const { profile } = useProfile();

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
}

export default function CardDetail() {
  const { t } = useTranslation('bonus');
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? null) as LocationState;
const isModal = Boolean((state as any)?.backgroundLocation);
const autoOpen = Boolean(state?.autoOpen);



  const { bonusId } = useParams<{ bonusId: string }>();
  const isMyCard = bonusId === 'my-card';

  const progress = useBonusProgressFromProfile();
  const [seenBonusIds, setSeenBonusIds] = useState<string[]>(() => loadSeenBonusIds());

  // ✅ Item laden (roh)
  const rawItem = useMemo<BonusItem | null>(() => {
    if (!bonusId) return null;
    return BONUS_INDEX.find((x) => x.bonusId === bonusId) ?? null;
  }, [bonusId]);

  const backPath = (state?.backTo ?? '/cards') as string;
  if (isMyCard) {
  return (
    <Layout backPath={backPath}>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <MyCharacterCardEditor />
      </div>
    </Layout>
  );
}

  // ✅ Typeguard: Character-Karten sind BonusItems mit category='characters'
  // und characterId muss ein gültiger Key in CHARACTERS sein.
  type CharacterCardItem = BonusItem & {
    category: 'characters';
    characterId: CharacterId;
  };

  function isCharacterCardItem(x: BonusItem | null): x is CharacterCardItem {
    if (!x) return false;
    if (x.category !== 'characters') return false;

    const id = x.characterId as CharacterId | undefined;
    return Boolean(id && (id as string) in CHARACTERS);
  }

  

  if (!isCharacterCardItem(rawItem)) {
    return (
<Layout
  title={isModal ? undefined : t('cards.title', { defaultValue: 'Sammelkarten' })}
  backPath={isModal ? undefined : backPath}
  hideHeader={isModal}
>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="font-extrabold text-slate-900">
              {t('cards.notFoundTitle', { defaultValue: 'Karte nicht gefunden' })}
            </div>
            <div className="mt-2 text-sm text-slate-600">
              {t('cards.notFoundBody', {
                defaultValue: 'Diese Sammelkarte existiert nicht (oder ist keine Charakterkarte).',
              })}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ✅ ab hier: item ist garantiert CharacterCardItem
  const item = rawItem;

  // ✅ characterId kommt aus BonusItem.characterId (bonusId ist z.B. "char-chioma")
  const characterId = item.characterId;

  // ✅ TS-sicher: CHARACTERS ist as const, daher cast auf CharacterEx
  const character = CHARACTERS[characterId] as unknown as CharacterEx | undefined;

  const unlocked = isBonusUnlocked(item, progress);
  const opened = seenBonusIds.includes(item.bonusId);

  const name = character?.name ?? String(characterId);

  // Portrait kommt aus CHARACTERS (wenn vorhanden)
const portrait = character?.card?.portrait;
const detailImage = character?.card?.detailImage;
const detailVideo = character?.card?.detailVideo;
const extraImages = character?.card?.extraImages ?? [];



  function openNow() {
    if (!unlocked) return;
    unlockBonusById(item.bonusId);
    setSeenBonusIds(loadSeenBonusIds());
  }

  useEffect(() => {
  if (!autoOpen) return;
  if (!unlocked) return;
  if (opened) return;
  openNow();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [autoOpen, unlocked, opened]);


return (
  <Layout
    title={isModal ? undefined : name}
    backPath={isModal ? undefined : backPath}
    hideHeader={isModal}
  >

      <div className="max-w-3xl mx-auto px-4 py-6">
        {isModal ? (
  <div className="mb-3 flex items-center justify-between">
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="text-sm font-extrabold text-[var(--color-teal-900)]"
    >
      ← {t('cards.backToStory', { defaultValue: 'Zurück zur Story' })}
    </button>

<button
  type="button"
  onClick={() =>
    navigate('/cards', { state: { backgroundLocation: state?.backgroundLocation, backTo: state?.backTo } })
  }
  className="text-sm font-semibold text-slate-700 underline"
>
  {t('cards.backToList', { defaultValue: 'Zur Übersicht' })}
</button>
  </div>
) : null}

        <div className="rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden">
          {/* Portrait: NICHT crop — mit Rand & object-contain */}
          <div className="p-4 sm:p-6">


            {/* Actions / Content */}
            <div className="mt-4">
              {unlocked && !opened ? (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                  <div className="text-sm font-semibold text-amber-900">
                    ✨ {t('charactersUi.tapToOpen', { defaultValue: '' })}
                  </div>

                  <button
                    type="button"
                    onClick={openNow}
                    className="mt-3 w-full rounded-2xl px-4 py-3 font-extrabold bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99]"
                  >
                    🎁 {t('charactersUi.openNow', { defaultValue: '' })}
                  </button>
                </div>
              ) : null}

              {/* After open: show Friendbook card (ALL content inside) */}
              {unlocked && opened ? (
                <div className="mt-4">
<CharacterFriendbookCard
  characterId={characterId}
  coverImage={portrait ?? null}
  detailImage={detailImage ?? null}
  extraImages={extraImages}
  videoSrc={detailVideo ?? null}
  onOpenVideo={
    detailVideo
      ? () => window.open(assetUrl(detailVideo), '_blank', 'noopener,noreferrer')
      : undefined
  }
/>

                </div>
              ) : null}


              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => navigate(backPath)}
                  className="rounded-2xl px-4 py-2 font-semibold border border-slate-200 bg-white hover:bg-slate-50"
                >
                  ← {t('common.back', { defaultValue: '' })}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
