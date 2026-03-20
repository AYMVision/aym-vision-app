// src/pages/Profile.tsx
// Profile page (AYM-Vision Aufräum-Leitfaden):
// - i18n: keine hardcodierten Texte (nur defaultValue sparsam)
// - Assets: nur aus /public via assetUrl(...) oder resolver (keine relativen public-Imports)
// - Type-safety: Location-State typisieren, kein `any`
// - Struktur: sauberes Grid (4 Cards) + Look Preview + Kleiderschrank

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout';
import { useProfile } from '../profile/useProfile';
import AvatarHeadImage from '../components/AvatarHeadImage';
import AvatarStage from '../components/AvatarStage';
import ProfileProgressCard from '../components/ProfileProgressCard';

import type { ItemSlot } from '../profile/types';
import { assetUrl } from '../common/assetUrl';
import { resolveItem } from '../profile/itemAssets';

import ParentGateDialog from '../components/ParentGateDialog';
import { useLongPress } from '../common/useLongPress';
import { SPECIAL_STICKERS, SPECIAL_BADGES } from '../progress/rewardCatalog';
import ProfileThemeCard from '../components/ProfileThemeCard';

function OffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M5 5l14 14" />
    </svg>
  );
}

// ✅ typed location state (kein any)
type ProfileLocationState = {
  backTo?: string;
};

function itemSrc(slot: ItemSlot, id: string) {
  // resolver liefert bereits deploy-sicher (public/media/...) – daher kein assetUrl nötig
  return resolveItem(slot, id, 512);
}

export default function Profile() {
  const { t } = useTranslation('profile');
  const { profile, updateProfile } = useProfile();

  const navigate = useNavigate();
  const [parentGateOpen, setParentGateOpen] = useState(false);

  const lp = useLongPress(() => setParentGateOpen(true), 1200);

  const location = useLocation();
  const state = (location.state ?? null) as ProfileLocationState | null;
  const backTo = state?.backTo ?? '/stories';

  const inventory = profile.inventory;
  const equipment = profile.equipment;
  const earnedStickers = profile.progress?.earnedStickers ?? {};
const earnedBadges = profile.progress?.earnedBadges ?? {};

const latestSpecialSticker = SPECIAL_STICKERS.find((s) => earnedStickers[s.id]);
const latestSpecialBadge = SPECIAL_BADGES.find((b) => earnedBadges[b.id]);

  const [failed, setFailed] = useState<Record<string, true>>({});


  function toggleEquip(slot: ItemSlot, id: string) {
    
    updateProfile((p) => {
      const current = p.equipment[slot] ?? null;

      return {
        ...p,
        equipment: {
          ...p.equipment,
          [slot]: current === id ? null : id,
        },
        updatedAt: Date.now(),
      };
    });
  }

  function SlotSection({
    title,
    slot,
  }: {
    title: string;
    slot: ItemSlot;
  }) {
    const owned = inventory[slot] ?? [];
    const equipped = equipment[slot] ?? null;

    return (
      <div className="mb-5">
        <div className="text-xs font-semibold text-slate-700 mb-2">{title}</div>

        {/* Statuszeile: angezogen / nicht angezogen */}
        <div className="mb-2">
          {equipped ? (
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <span className="font-semibold">
                {t('wardrobe.wearingLabel', { defaultValue: 'Angezogen:' })}
              </span>
              <span className="truncate">{equipped}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <OffIcon />
              {t('wardrobe.notWearing', { defaultValue: 'Nicht angezogen' })}
            </div>
          )}
        </div>

        {/* Owned items */}
        {owned.length === 0 ? (
          <div className="text-xs text-slate-500">
            {t('wardrobe.noneOwned', { defaultValue: 'Noch keine Items freigeschaltet' })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {owned.map((id) => {
              const selected = equipped === id;
              const imgFailed = !!failed[id];

              const label = t('wardrobe.itemLabel', {
                defaultValue: 'Item',
              });

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleEquip(slot, id)}
                  className={
                    'w-16 h-16 rounded-2xl border bg-white flex items-center justify-center overflow-hidden shadow-sm transition ' +
                    (selected
                      ? 'border-slate-900 ring-2 ring-slate-900/10'
                      : 'border-slate-200 hover:border-slate-300')
                  }
                  aria-label={
                    selected
                      ? t('wardrobe.unequipAria', {
                          defaultValue: '{{label}} ausziehen',
                          label,
                        })
                      : t('wardrobe.equipAria', {
                          defaultValue: '{{label}} anziehen',
                          label,
                        })
                  }
                  title={
                    selected
                      ? t('wardrobe.unequipTitle', { defaultValue: 'Klicken zum Ausziehen' })
                      : t('wardrobe.equipTitle', { defaultValue: 'Klicken zum Anziehen' })
                  }
                >
                  {imgFailed ? (
                    <span className="text-2xl opacity-70" aria-hidden="true">
                      🎁
                    </span>
                  ) : (
                    <img
                      src={itemSrc(slot, id)}
                      alt={label}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={() => setFailed((m) => ({ ...m, [id]: true }))}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Layout hideFooter>
      <div className="w-full max-w-xl px-4 py-8">
        {/* Page-Topbar */}
        <div className="mt-2 mb-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-anthracite-950">
            {t('title', { defaultValue: 'Profil' })}
          </h1>

          <Link
            to={backTo}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:bg-slate-50"
            aria-label={t('backAria', { defaultValue: 'Zurück' })}
          >
            ← {t('back', { defaultValue: 'Zurück' })}
          </Link>
        </div>

        {/* Top: 4 Kästen */}
        <div className="grid gap-4 sm:grid-cols-2 items-stretch">
          {/* Kasten 1: Avatar + Coins */}
          <div className="p-4 rounded-2xl border border-black/5 bg-white shadow-sm h-full">
            <div className="flex items-start gap-4">
              {/* Avatar + Button */}
              <div className="flex flex-col items-center gap-2 self-start">
                <div className="w-28 h-28 rounded-full border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
                  <AvatarHeadImage
                    id={profile.avatarBaseId}
                    size={110}
                    alt={t('avatar.alt', { defaultValue: 'Dein Avatar' })}
                    className="w-full h-full object-contain"
                  />
                </div>

                <Link
                  to="/avatar"
                  state={{ backTo: '/profile' }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {t('avatar.change', { defaultValue: 'Avatar ändern' })}
                </Link>
              </div>

              {/* Coins */}
              <div className="flex-1">
                <div className="text-sm text-slate-500">
                  {t('wallet.coinsLabel', { defaultValue: 'Coins' })}
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <img
                    src={assetUrl('media/story/ui/coin-128.webp')}
                    alt=""
                    className="w-12 h-12"
                    loading="lazy"
                  />
                  <div className="text-3xl font-extrabold">
                    {profile.wallet?.coins ?? 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kasten 2: Fortschritt */}
          <div className="p-4 rounded-2xl border border-black/5 bg-white shadow-sm h-full">
            <ProfileProgressCard noCard />
          </div>

          {/* Kasten 3: Stickeralbum */}
          <Link
            to="/album"
            state={{ backTo: '/profile' }}
            className="p-4 rounded-2xl border border-black/5 bg-white shadow-sm hover:bg-slate-50 transition flex flex-col justify-between"
            aria-label={t('album.aria', { defaultValue: 'Sticker-Album öffnen' })}
          >
            <div>
              <div className="text-sm font-semibold text-anthracite-900">
                {t('album.title', { defaultValue: 'Sticker-Album' })}
              </div>
              <p className="mt-1 text-xs text-slate-600">
                {t('album.subtitle', { defaultValue: 'Sammle Sticker für jede abgeschlossene Folge' })}
              </p>
            </div>

            <div className="mt-3 text-sm font-semibold text-slate-700">
              {t('album.cta', { defaultValue: 'Öffnen →' })}
            </div>
          </Link>

          {/* Kasten 4: Bonusmaterial (eine Kachel mit 3 Einstiegen) */}
          <div className="p-4 rounded-2xl border border-black/5 bg-white shadow-sm">
            {/* Kopfbereich */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-anthracite-900">
                  {t('bonus.hub.title', { defaultValue: 'Bonuswelt' })}
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {t('bonus.hub.subtitle', { defaultValue: 'Extras aus der Story – zum Sammeln & Entdecken' })}
                </p>
              </div>
            </div>

            {/* 3 Mini-Kacheln */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Link
                to="/cards"
                state={{ backTo: '/profile' }}
                className="rounded-2xl border border-black/5 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-3 hover:shadow-sm transition"
                aria-label={t('bonus.hub.cards.aria', { defaultValue: 'Sammelkarten öffnen' })}
              >
                <div className="text-xl">🎴</div>
                <div className="mt-1 text-[11px] font-extrabold text-slate-900 leading-tight">
                  {t('bonus.hub.cards.title', { defaultValue: 'Karten' })}
                </div>
              </Link>

              <Link
                to="/newspaper"
                state={{ backTo: '/profile' }}
                className="rounded-2xl border border-black/5 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-3 hover:shadow-sm transition"
                aria-label={t('bonus.hub.newspaper.aria', { defaultValue: 'Schülerzeitung öffnen' })}
              >
                <div className="text-xl">📰</div>
                <div className="mt-1 text-[11px] font-extrabold text-slate-900 leading-tight">
                  {t('bonus.hub.newspaper.title', { defaultValue: 'Zeitung' })}
                </div>
              </Link>

              <Link
                to="/diaries"
                state={{ backTo: '/profile' }}
                className="rounded-2xl border border-black/5 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-3 hover:shadow-sm transition"
                aria-label={t('bonus.hub.diaries.aria', { defaultValue: 'Tagebuch öffnen' })}
              >
                <div className="text-xl">📔</div>
                <div className="mt-1 text-[11px] font-extrabold text-slate-900 leading-tight">
                  {t('bonus.hub.diaries.title', { defaultValue: 'Tagebuch' })}
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6">
  <ProfileThemeCard />
</div>

<div className="mt-4 p-4 rounded-2xl border border-black/5 bg-white shadow-sm">
  <div className="text-sm font-semibold text-anthracite-900">
    {t('rewards.title', { defaultValue: 'Besondere Belohnungen' })}
  </div>

  {latestSpecialSticker || latestSpecialBadge ? (
    <div className="mt-3 flex items-center gap-3">
      {latestSpecialSticker ? (
        <img
          src={assetUrl(latestSpecialSticker.image)}
          alt=""
          className="w-14 h-14 object-contain"
        />
      ) : latestSpecialBadge ? (
        <img
          src={assetUrl(latestSpecialBadge.image)}
          alt=""
          className="w-14 h-14 object-contain"
        />
      ) : null}

      <div className="min-w-0 flex-1">
<div className="text-sm font-semibold text-slate-900">
  {latestSpecialSticker?.title ?? latestSpecialBadge?.title}
</div>
        <div className="text-xs text-slate-600">
          {t('rewards.subtitle', { defaultValue: 'Deine besonderen Erfolge findest du im Album.' })}
        </div>
      </div>

      <Link
        to="/album"
        state={{ backTo: '/profile' }}
        className="text-xs px-3 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50"
      >
        {t('rewards.open', { defaultValue: 'Ansehen →' })}
      </Link>
    </div>
  ) : (
    <div className="mt-3 text-xs text-slate-500">
      {t('rewards.empty', { defaultValue: 'Hier erscheinen bald besondere Sticker und Badges.' })}
    </div>
  )}
</div>

        {/* Look Preview */}
        <div className="mt-6 rounded-2xl border border-black/5 bg-white shadow-sm p-4">
          <div className="text-sm font-semibold text-anthracite-900 mb-3">
            {t('look.title', { defaultValue: 'Dein Look' })}
          </div>

          <div className="flex justify-center">
            <AvatarStage
              avatarBaseId={profile.avatarBaseId}
              equipment={profile.equipment}
              height={520}
              width={360}
              withBackdrop
            />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            {t('look.hint', { defaultValue: 'Tippe unten auf ein Item, um es anzuziehen oder auszuziehen.' })}
          </p>
        </div>

        {/* Kleiderschrank */}
        <div className="mt-6 rounded-2xl border border-black/5 bg-white shadow-sm p-4">
          <div className="text-sm font-semibold text-anthracite-900 mb-4">
            {t('wardrobe.title', { defaultValue: 'Deine Items' })}
          </div>

          <SlotSection title={t('wardrobe.head', { defaultValue: 'Kopf' })} slot="head" />
          <SlotSection title={t('wardrobe.face', { defaultValue: 'Gesicht' })} slot="face" />
          <SlotSection title={t('wardrobe.top', { defaultValue: 'Oberteil' })} slot="top" />
          <SlotSection title={t('wardrobe.bottom', { defaultValue: 'Unterteil' })} slot="bottom" />
          <SlotSection title={t('wardrobe.feet', { defaultValue: 'Schuhe' })} slot="feet" />
          <SlotSection title={t('wardrobe.background', { defaultValue: 'Hintergrund' })} slot="background" />
          <SlotSection title={t('wardrobe.effect', { defaultValue: 'Effekt' })} slot="effect" />
        </div>

{/* Hidden entry (kid-safe, low attention) */}
<div
  className="mt-6 text-center text-xs text-slate-400 select-none touch-manipulation"
  {...lp}
  role="button"
  tabIndex={0}
  aria-label={t('adult.hiddenAria', { defaultValue: 'Open adult area' })}
  style={{
    WebkitUserSelect: 'none',
    userSelect: 'none',
    WebkitTouchCallout: 'none', // iOS: verhindert Callout
  }}
>

  {t('adult.hiddenVersion', { defaultValue: 'Version {{version}}', version: '0.0.0' })}
  <span className="ml-2 opacity-70">
    {t('adult.footerHint', { defaultValue: 'Adults: press and hold' })}
  </span>
</div>

<ParentGateDialog
  open={parentGateOpen}
  onClose={() => setParentGateOpen(false)}
  onUnlocked={() => navigate('/adult-settings')}
/>



      </div>
    </Layout>
  );
}
