// src/pages/AvatarPicker.tsx

import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout';
import AvatarStage from '../components/AvatarStage';
import { AVATAR_BASES } from '../data/avatars';
import { ITEMS, type ItemDef } from '../data/items';
import { useProfile } from '../profile/useProfile';
import { resolveItem } from '../profile/itemAssets';
import { assetUrl } from '../common/assetUrl';
import type { Equipment, ItemSlot } from '../profile/types';

type Tab = 'avatars' | 'items' | 'shop';

type LocationState = {
  backTo?: string;
  initialTab?: Tab;
} | null;

const SLOT_SECTIONS: { slot: ItemSlot; icon: string; labelKey: string; defaultValue: string }[] = [
  {
    slot: 'featured',
    icon: '🎒',
    labelKey: 'avatar.sections.featured',
    defaultValue: 'Gegenstände',
  },
  {
    slot: 'background',
    icon: '🖼️',
    labelKey: 'avatar.sections.background',
    defaultValue: 'Hintergründe',
  },
  {
    slot: 'effect',
    icon: '✨',
    labelKey: 'avatar.sections.effect',
    defaultValue: 'Effekte',
  },
];

function AvatarThumb({
  avatarBaseId,
  selected,
  onClick,
}: {
  avatarBaseId: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'shrink-0 rounded-2xl border bg-white shadow-sm transition overflow-hidden',
        selected
          ? 'border-slate-900 ring-2 ring-slate-900/10 scale-[1.03]'
          : 'border-slate-200 hover:border-slate-300',
      ].join(' ')}
    >
      <div className="w-[90px] h-[112px] overflow-hidden bg-white">
        <div
          style={{
            width: 136,
            height: 176,
            transform: 'translate(-24px, -8px) scale(1.26)',
            transformOrigin: 'top left',
          }}
        >
          <AvatarStage
            avatarBaseId={avatarBaseId}
            width={136}
            height={176}
            withBackdrop={false}
          />
        </div>
      </div>
    </button>
  );
}

function ItemCard({
  slot,
  id,
  equipped,
  onClick,
}: {
  slot: ItemSlot;
  id: string;
  equipped: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={equipped}
      className={[
        'w-[74px] h-[74px] shrink-0 rounded-2xl border bg-white p-2 transition flex items-center justify-center',
        equipped
          ? 'border-slate-900 ring-2 ring-slate-900/10'
          : 'border-slate-200 hover:border-slate-300',
      ].join(' ')}
      title={id}
    >
      <img
        src={resolveItem(slot, id)}
        alt=""
        className="max-h-full max-w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </button>
  );
}

function ClearCard({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'w-[74px] h-[74px] shrink-0 rounded-2xl border bg-white p-2 transition flex items-center justify-center',
        active
          ? 'border-slate-900 ring-2 ring-slate-900/10'
          : 'border-slate-200 hover:border-slate-300',
      ].join(' ')}
      title="None"
    >
      <span className="text-2xl text-slate-300">✕</span>
    </button>
  );
}

function ShopItemChip({
  item,
  owned,
  affordable,
  onBuy,
  onPreviewStart,
  onPreviewEnd,
}: {
  item: ItemDef;
  owned: boolean;
  affordable: boolean;
  onBuy?: () => void;
  onPreviewStart: () => void;
  onPreviewEnd: () => void;
}) {
  return (
    <div
      className="w-[88px] shrink-0"
      onMouseEnter={onPreviewStart}
      onMouseLeave={onPreviewEnd}
      onFocus={onPreviewStart}
      onBlur={onPreviewEnd}
    >
      <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-2">
        <div className="h-[72px] flex items-center justify-center overflow-hidden">
          <img
            src={resolveItem(item.slot, item.id)}
            alt=""
            className="max-h-full max-w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>

        {owned ? (
          <div className="mt-2 flex items-center justify-center rounded-xl bg-emerald-50 py-1.5 text-[11px] font-extrabold text-emerald-700">
            ✓
          </div>
        ) : typeof item.shopPrice === 'number' ? (
          <button
            type="button"
            onClick={onBuy}
            disabled={!affordable}
            className={[
              'mt-2 w-full rounded-xl py-1.5 text-[11px] font-extrabold transition flex items-center justify-center gap-1',
              affordable
                ? 'bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed',
            ].join(' ')}
          >
            <img
              src={assetUrl('media/story/ui/coin-128.webp')}
              alt=""
              className="w-3.5 h-3.5"
              loading="lazy"
            />
            {item.shopPrice}
          </button>
        ) : (
          <div className="mt-2 flex items-center justify-center rounded-xl bg-slate-50 py-1.5 text-[10px] font-bold text-slate-400">
            —
          </div>
        )}
      </div>
    </div>
  );
}

export default function AvatarPicker() {
  const { t } = useTranslation('profile');
  const location = useLocation();
  const state = (location.state ?? null) as LocationState;

  const backTo = state?.backTo ?? '/profile';

  const { profile, updateProfile } = useProfile();
  const [tab, setTab] = useState<Tab>(state?.initialTab ?? 'avatars');
  const [previewItem, setPreviewItem] = useState<{ slot: ItemSlot; id: string } | null>(null);

  const coins = profile.wallet?.coins ?? 0;
  const [confirmingItem, setConfirmingItem] = useState<(ItemDef & { shopPrice: number }) | null>(null);

  const previewEquipment: Equipment = previewItem
    ? {
        ...profile.equipment,
        [previewItem.slot]: previewItem.id,
      }
    : profile.equipment;

  const itemsBySlot = useMemo(() => {
    return {
      featured: ITEMS.filter((item) => item.slot === 'featured'),
      background: ITEMS.filter((item) => item.slot === 'background'),
      effect: ITEMS.filter((item) => item.slot === 'effect'),
    } as Record<ItemSlot, ItemDef[]>;
  }, []);

  function selectAvatar(id: string) {
    updateProfile((prev) => ({
      ...prev,
      avatarBaseId: id,
      updatedAt: Date.now(),
    }));
  }

  function equipItem(slot: ItemSlot, id: string | null) {
    updateProfile((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [slot]: id,
      },
      updatedAt: Date.now(),
    }));
  }

  function buyItem(item: ItemDef & { shopPrice: number }) {
    const owned = (profile.inventory[item.slot] ?? []).includes(item.id);
    if (owned || coins < item.shopPrice) return;

    updateProfile((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        coins: prev.wallet.coins - item.shopPrice,
        totalSpent: (prev.wallet.totalSpent ?? 0) + item.shopPrice,
      },
      inventory: {
        ...prev.inventory,
        [item.slot]: [...(prev.inventory[item.slot] ?? []), item.id],
      },
      updatedAt: Date.now(),
    }));
  }

  return (
    <Layout hideFooter backPath={backTo}>
      <div className="w-full max-w-xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-xl font-extrabold text-slate-900">
            {t('avatar.title', { defaultValue: 'Dein Avatar' })}
          </h1>
        </div>

        {/* Sticky Vorschau */}
        <div className="sticky top-2 z-20 mb-6">
          <div className="rounded-3xl border border-black/5 bg-white/95 backdrop-blur shadow-sm px-3 pt-3 pb-2">
            <div className="relative flex justify-center">
              <AvatarStage
                avatarBaseId={profile.avatarBaseId}
                equipment={previewEquipment}
                width={320}
                height={390}
                withBackdrop
              />
            </div>
          </div>
        </div>

        {/* Reiter */}
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => setTab('avatars')}
            className={[
              'rounded-xl px-2 py-2.5 text-[11px] font-extrabold transition',
              tab === 'avatars'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            <span className="mr-1">👤</span>
            {t('avatar.tabs.avatars', { defaultValue: 'Avatare' })}
          </button>

          <button
            type="button"
            onClick={() => setTab('items')}
            className={[
              'rounded-xl px-2 py-2.5 text-[11px] font-extrabold transition',
              tab === 'items'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            <span className="mr-1">🎒</span>
            {t('avatar.tabs.items', { defaultValue: 'Meine Sachen' })}
          </button>

          <button
            type="button"
            onClick={() => setTab('shop')}
            className={[
              'rounded-xl px-2 py-2.5 text-[11px] font-extrabold transition',
              tab === 'shop'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            <span className="mr-1">✨</span>
            {t('avatar.tabs.shop', { defaultValue: 'Neue Sachen' })}
          </button>
        </div>

        {/* Avatare */}
        {tab === 'avatars' && (
          <div>
            <div className="text-xs text-slate-500 mb-3 text-center">
              {t('avatar.avatars.hint', {
                defaultValue: 'Wähle die Figur, die am besten zu dir passt.',
              })}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {AVATAR_BASES.map((a) => {
                const selected = profile.avatarBaseId === a.id;
                return (
                  <AvatarThumb
                    key={a.id}
                    avatarBaseId={a.id}
                    selected={selected}
                    onClick={() => selectAvatar(a.id)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Meine Sachen */}
        {tab === 'items' && (
          <div className="space-y-5">
            {SLOT_SECTIONS.map(({ slot, icon, labelKey, defaultValue }) => {
              const owned = profile.inventory[slot] ?? [];
              const equipped = profile.equipment[slot] ?? null;

              return (
                <div key={slot}>
                  <div className="mb-2 text-xs font-extrabold text-slate-500 uppercase tracking-wide">
                    {icon} {t(labelKey, { defaultValue })}
                  </div>

                  {owned.length === 0 ? (
                    <div className="text-xs text-slate-400">
                      {t('avatar.items.empty', {
                        defaultValue: 'Hier erscheint bald etwas.',
                      })}
                    </div>
                  ) : (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      <ClearCard
                        active={equipped === null}
                        onClick={() => equipItem(slot, null)}
                      />

                      {owned.map((id) => (
                        <ItemCard
                          key={id}
                          slot={slot}
                          id={id}
                          equipped={equipped === id}
                          onClick={() => equipItem(slot, equipped === id ? null : id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Neue Sachen */}
{tab === 'shop' && (
  <div className="space-y-6">

    {/* 💰 Coins (wieder prominent im Shop) */}
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-center gap-2">
        <img
          src={assetUrl('media/story/ui/coin-128.webp')}
          alt=""
          className="w-6 h-6"
          loading="lazy"
        />
        <span className="text-2xl font-extrabold text-slate-900">
          {coins}
        </span>
      </div>

      <div className="mt-1 text-center text-[11px] font-semibold text-slate-500">
        {t('avatar.shop.coinsHint', {
          defaultValue: 'Mit Coins kannst du neue Sachen freischalten.',
        })}
      </div>
    </div>
            {SLOT_SECTIONS.map(({ slot, icon, labelKey, defaultValue }) => {
              const slotItems = itemsBySlot[slot];
              if (slotItems.length === 0) return null;

              return (
                <div key={slot}>
                  <div className="mb-3 text-sm font-extrabold text-slate-700">
                    <span className="mr-2">{icon}</span>
                    {t(labelKey, { defaultValue })}
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {slotItems.map((item) => {
                      const owned = (profile.inventory[item.slot] ?? []).includes(item.id);
                      const affordable =
                        typeof item.shopPrice === 'number' && coins >= item.shopPrice;

                      return (
                        <ShopItemChip
                          key={item.id}
                          item={item}
                          owned={owned}
                          affordable={affordable}
                          onBuy={
                            typeof item.shopPrice === 'number'
                              ? () => setConfirmingItem(item as ItemDef & { shopPrice: number })
                              : undefined
                          }
                          onPreviewStart={() => setPreviewItem({ slot: item.slot, id: item.id })}
                          onPreviewEnd={() => setPreviewItem(null)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Kaufbestätigung */}
      {confirmingItem ? (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-sm rounded-3xl bg-white shadow-xl p-6">
            <div className="text-center mb-4">
              <div className="h-[72px] flex items-center justify-center mb-3">
                <img
                  src={resolveItem(confirmingItem.slot, confirmingItem.id)}
                  alt=""
                  className="max-h-full max-w-[72px] object-contain"
                />
              </div>
              <div className="text-base font-extrabold text-slate-900 mb-1">
                {t('avatar.shop.confirmTitle', { defaultValue: 'Wirklich kaufen?' })}
              </div>
              <div className="flex items-center justify-center gap-1.5 text-sm text-slate-600">
                <img src={assetUrl('media/story/ui/coin-128.webp')} alt="" className="w-4 h-4" />
                <span className="font-bold">{confirmingItem.shopPrice}</span>
                <span>{t('avatar.shop.confirmCoins', { defaultValue: 'Coins' })}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmingItem(null)}
                className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                {t('avatar.shop.cancel', { defaultValue: 'Abbrechen' })}
              </button>
              <button
                type="button"
                onClick={() => {
                  buyItem(confirmingItem);
                  setConfirmingItem(null);
                }}
                className="flex-1 rounded-2xl bg-[var(--color-teal-600)] py-3 text-sm font-bold text-white hover:bg-[var(--color-teal-700)]"
              >
                {t('avatar.shop.confirmBuy', { defaultValue: 'Ja, kaufen!' })}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Layout>
  );
}