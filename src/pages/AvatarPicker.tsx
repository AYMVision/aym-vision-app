// src/pages/AvatarPicker.tsx

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout';
import AvatarStage from '../components/AvatarStage';
import AvatarFullImage from '../components/AvatarFullImage';
import { AVATAR_BASES } from '../data/avatars';
import { ITEMS, ITEM_STYLE, type ItemDef } from '../data/items';
import { useProfile } from '../profile/useProfile';
import { resolveItem } from '../profile/itemAssets';
import { assetUrl } from '../common/assetUrl';
import type { Equipment, ItemSlot } from '../profile/types';

type Tab = 'meine' | 'neu';
type LocationState = { backTo?: string } | null;

const SLOT_CONFIGS: { slot: ItemSlot; icon: string; label: string; hint: string }[] = [
  { slot: 'background', icon: '🖼️', label: 'Hintergrund',  hint: 'Gib deinem Avatar einen eigenen Hintergrund.' },
  { slot: 'featured',  icon: '🎒', label: 'Gegenstände',   hint: 'Was trägst du so bei dir?' },
  { slot: 'effect',     icon: '✨', label: 'Effekte',       hint: 'Lass es um dich herum leuchten und funkeln.' },
];

// ── Kachel: Avatar-Figur ─────────────────────────────────────────────────────

function AvatarThumb({
  avatarBaseId, selected, isHalloween, onClick, onHoverStart, onHoverEnd,
}: {
  avatarBaseId: string; selected: boolean; isHalloween?: boolean;
  onClick: () => void; onHoverStart?: () => void; onHoverEnd?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      aria-pressed={selected}
      style={{ width: 76, height: 96 }}
      className={[
        'relative shrink-0 rounded-2xl border bg-white shadow-sm transition overflow-hidden',
        selected
          ? 'border-violet-500 ring-2 ring-violet-400/30 scale-[1.04]'
          : 'border-slate-200 hover:border-violet-300',
      ].join(' ')}
    >
      <div style={{ width: 115, height: 150, transform: 'translate(-19px, -6px) scale(1.22)', transformOrigin: 'top left' }}>
        <AvatarStage avatarBaseId={avatarBaseId} width={136} height={176} withBackdrop={false} />
      </div>
      {isHalloween && <span className="absolute top-1 right-1 text-sm leading-none z-10">🎃</span>}
    </button>
  );
}

// ── Kachel: besessenes Item ──────────────────────────────────────────────────

function ItemTile({
  slot, id, equipped, isHalloween, onClick, onHoverStart, onHoverEnd,
}: {
  slot: ItemSlot; id: string; equipped: boolean; isHalloween?: boolean;
  onClick: () => void; onHoverStart?: () => void; onHoverEnd?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      aria-pressed={equipped}
      className={[
        'relative w-full aspect-square rounded-2xl border bg-white p-2.5 transition flex items-center justify-center',
        equipped
          ? 'border-violet-500 ring-2 ring-violet-400/30 bg-violet-50/50'
          : 'border-slate-200 hover:border-violet-300',
      ].join(' ')}
    >
      {isHalloween && <span className="absolute top-1 right-1 text-[11px] leading-none">🎃</span>}
      <img src={resolveItem(slot, id)} alt="" className="w-full h-full object-contain" loading="lazy" decoding="async" />
    </button>
  );
}

// ── Kachel: nichts auswählen ─────────────────────────────────────────────────

function NothingTile({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'w-full aspect-square rounded-2xl border transition flex flex-col items-center justify-center gap-1',
        active
          ? 'border-violet-500 ring-2 ring-violet-400/30 bg-violet-50/50'
          : 'border-slate-200 bg-white hover:border-violet-300',
      ].join(' ')}
    >
      <span className="text-xl text-slate-300">✕</span>
      <span className="text-[10px] text-slate-400">Keins</span>
    </button>
  );
}

// ── Kachel: kaufbares Item ───────────────────────────────────────────────────

function ShopTile({
  slot, id, price, affordable, isHalloween, onTap, onHoverStart, onHoverEnd,
}: {
  slot: ItemSlot; id: string; price: number; affordable: boolean; isHalloween?: boolean;
  onTap: () => void; onHoverStart?: () => void; onHoverEnd?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="relative w-full aspect-square rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-2 flex flex-col items-center justify-center gap-1 transition hover:border-violet-300 hover:bg-violet-50/30 active:bg-slate-100"
    >
      {isHalloween && <span className="absolute top-1 right-1 text-[11px] leading-none">🎃</span>}
      {!affordable && !isHalloween && <span className="absolute top-1 right-1 text-[11px] leading-none opacity-50">🔒</span>}
      <img src={resolveItem(slot, id)} alt="" className={['flex-1 w-full min-h-0 object-contain', affordable ? 'opacity-50' : 'opacity-30'].join(' ')} loading="lazy" decoding="async" />
      <div className={[
        'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold shrink-0',
        affordable ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500',
      ].join(' ')}>
        <img src={assetUrl('media/story/ui/coin-128.webp')} alt="" className="w-3 h-3" />
        {price}
      </div>
    </button>
  );
}

// ── Abschnitts-Header ────────────────────────────────────────────────────────

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3">
      <div className="text-sm font-extrabold text-slate-800">{title}</div>
      {hint && <div className="text-xs text-slate-400 mt-0.5">{hint}</div>}
    </div>
  );
}

// ── Hauptseite ───────────────────────────────────────────────────────────────

export default function AvatarPicker() {
  const { t } = useTranslation('profile');
  const location = useLocation();
  const state = (location.state ?? null) as LocationState;
  const backTo = state?.backTo ?? '/profile';

  const { profile, updateProfile } = useProfile();

  const [tab, setTab]                   = useState<Tab>('meine');
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [hoverItem, setHoverItem]       = useState<{ slot: ItemSlot; id: string } | null>(null);
  const [confirmingItem, setConfirmingItem] = useState<(ItemDef & { shopPrice: number }) | null>(null);
  const [showPurchaseToast, setShowPurchaseToast] = useState(false);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (previewTimerRef.current) clearTimeout(previewTimerRef.current); }, []);

  const coins = profile.wallet?.coins ?? 0;

  // Hover takes precedence; if modal is open, show that item
  const activePreview = confirmingItem
    ? { slot: confirmingItem.slot, id: confirmingItem.id }
    : hoverItem;

  const previewEquipment: Equipment = activePreview
    ? { ...profile.equipment, [activePreview.slot]: activePreview.id }
    : profile.equipment;

  function selectAvatar(id: string) {
    updateProfile((prev) => ({ ...prev, avatarBaseId: id, updatedAt: Date.now() }));
  }

  function equipItem(slot: ItemSlot, id: string | null) {
    updateProfile((prev) => ({
      ...prev,
      equipment: { ...prev.equipment, [slot]: id },
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

  function handleBuyIntent(item: ItemDef & { shopPrice: number }) {
    if (coins < item.shopPrice) {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
      setHoverItem({ slot: item.slot, id: item.id });
      previewTimerRef.current = setTimeout(() => setHoverItem(null), 2500);
      return;
    }
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    setConfirmingItem(item);
    setHoverItem(null);
  }

  function handleBuyCancel() {
    setConfirmingItem(null);
  }

  function handleBuyConfirm() {
    if (!confirmingItem) return;
    if (coins < confirmingItem.shopPrice) { setConfirmingItem(null); return; }
    buyItem(confirmingItem);
    equipItem(confirmingItem.slot, confirmingItem.id);
    setConfirmingItem(null);
    setShowPurchaseToast(true);
    setTimeout(() => setShowPurchaseToast(false), 3500);
  }

  return (
    <Layout hideFooter backPath={backTo} fullHeight>
      <div className="w-full max-w-xl mx-auto h-full flex flex-col">

        {/* ── Kompakte Vorschau — antippen zum Vergrößern ── */}
        <div className="flex-shrink-0 px-4 pt-3 pb-2">
          <button
            type="button"
            onClick={() => setShowFullscreen(true)}
            className="w-full rounded-2xl overflow-hidden border border-black/5 shadow-sm bg-gradient-to-b from-violet-100/50 to-white transition hover:shadow-md active:scale-[0.99] text-left"
          >
            <div className="relative flex justify-center pt-3 pb-1">
              {/* Coin-Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-100 rounded-full px-2.5 py-1 z-10">
                <img src={assetUrl('media/story/ui/coin-128.webp')} alt="" className="w-4 h-4" loading="lazy" />
                <span className="text-sm font-extrabold text-amber-800">{coins}</span>
              </div>
              {/* Eigene Layer-Preview: gleiche URLs wie Kacheln → sofort aus Browser-Cache */}
              <div className="relative overflow-hidden" style={{ width: 180, height: 224 }}>
                {previewEquipment.background && (
                  <img
                    src={resolveItem('background', previewEquipment.background)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                )}
                <AvatarFullImage
                  id={profile.avatarBaseId}
                  width={180}
                  height={224}
                  alt="Avatar"
                  className="absolute inset-0 w-full h-full object-contain"
                  loading="eager"
                />
                {previewEquipment.featured && (
                  <img
                    src={resolveItem('featured', previewEquipment.featured)}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${ITEM_STYLE[`featured:${previewEquipment.featured}`] ?? ''}`}
                  />
                )}
                {previewEquipment.effect && (
                  <img
                    src={resolveItem('effect', previewEquipment.effect)}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${ITEM_STYLE[`effect:${previewEquipment.effect}`] ?? ''}`}
                  />
                )}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 text-center pb-2.5 px-4">
              Tippen zum Vergrößern · Items antippen für Vorschau
            </div>
          </button>
        </div>

        {/* ── Tab-Leiste ── */}
        <div className="flex-shrink-0 px-4 pb-2">
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">
            {([['meine', 'Meine Sachen'], ['neu', 'Neue Sachen']] as [Tab, string][]).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={[
                  'rounded-xl px-3 py-1 text-[12px] font-extrabold transition',
                  tab === key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollbarer Inhalt ── */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-28">

          {/* ── MEINE SACHEN ── */}
          {tab === 'meine' && (
            <div className="space-y-7 pt-1">

              {/* Figur wählen */}
              <div>
                <SectionHeader
                  title="👤 Deine Figur"
                  hint={t('avatar.avatars.hint', { defaultValue: 'Wähle die Figur, die am besten zu dir passt.' })}
                />
                <div className="grid grid-cols-4 gap-2 justify-items-center">
                  {AVATAR_BASES.map((a) => (
                    <AvatarThumb
                      key={a.id}
                      avatarBaseId={a.id}
                      selected={profile.avatarBaseId === a.id}
                      isHalloween={a.tag === 'halloween'}
                      onClick={() => selectAvatar(a.id)}
                      onHoverStart={() => setHoverItem(null)}
                      onHoverEnd={() => setHoverItem(null)}
                    />
                  ))}
                </div>
              </div>

              {/* Hintergrund / Gegenstände / Effekte — alle besessenen Items inkl. Halloween */}
              {(() => {
                const anyOwned = SLOT_CONFIGS.some(({ slot }) => (profile.inventory[slot] ?? []).length > 0);
                return (
                  <>
                    {SLOT_CONFIGS.map(({ slot, icon, label, hint }) => {
                      const ownedIds   = profile.inventory[slot] ?? [];
                      const equippedId = profile.equipment[slot] ?? null;
                      if (ownedIds.length === 0) return null;
                      return (
                        <div key={slot}>
                          <SectionHeader title={`${icon} ${label}`} hint={hint} />
                          <div className="grid grid-cols-4 gap-2">
                            <NothingTile
                              active={equippedId === null || !ownedIds.includes(equippedId)}
                              onClick={() => { equipItem(slot, null); setHoverItem(null); }}
                            />
                            {ownedIds.map((id) => {
                              const itm = ITEMS.find((i) => i.slot === slot && i.id === id);
                              return (
                                <ItemTile
                                  key={id}
                                  slot={slot}
                                  id={id}
                                  equipped={equippedId === id}
                                  isHalloween={itm?.tag === 'halloween'}
                                  onClick={() => { equipItem(slot, equippedId === id ? null : id); setHoverItem(null); }}
                                  onHoverStart={() => setHoverItem({ slot, id })}
                                  onHoverEnd={() => setHoverItem(null)}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {!anyOwned && (
                      <p className="text-xs text-slate-400 py-2">
                        Noch keine Items — schau bei <button type="button" onClick={() => setTab('neu')} className="text-violet-600 font-semibold underline">Neue Sachen</button> vorbei ✨
                      </p>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* ── NEUE SACHEN ── */}
          {tab === 'neu' && (
            <div className="space-y-7 pt-1">

              {/* Coins-Info */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img src={assetUrl('media/story/ui/coin-128.webp')} alt="" className="w-5 h-5" loading="lazy" />
                    <span className="text-sm font-extrabold text-slate-800">Deine Coins</span>
                  </div>
                  <span className="text-xl font-extrabold text-slate-900">{coins}</span>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div>💬 Pro Amic gespielt → <strong>+1 Coin</strong></div>
                  <div>🏁 Episode abgeschlossen → <strong>+5 Coins</strong></div>
                  <div>⭐ 7 Tage am Stück → <strong>+2 Extra-Coins</strong></div>
                </div>
              </div>

              {/* Shop-Items je Kategorie (ohne Halloween) */}
              {SLOT_CONFIGS.map(({ slot, icon, label }) => {
                const ownedIds   = profile.inventory[slot] ?? [];
                const ownedSet   = new Set(ownedIds);
                const shopItems  = ITEMS.filter(
                  (i) => i.slot === slot && !ownedSet.has(i.id) && typeof i.shopPrice === 'number' && i.tag !== 'halloween'
                );
                if (shopItems.length === 0) return null;

                return (
                  <div key={slot}>
                    <SectionHeader title={`${icon} ${label}`} />
                    <div className="grid grid-cols-4 gap-2">
                      {shopItems.map((item) => (
                        <ShopTile
                          key={item.id}
                          slot={slot}
                          id={item.id}
                          price={item.shopPrice as number}
                          affordable={coins >= (item.shopPrice as number)}
                          isHalloween={item.tag === 'halloween'}
                          onTap={() => handleBuyIntent(item as ItemDef & { shopPrice: number })}
                          onHoverStart={() => setHoverItem({ slot, id: item.id })}
                          onHoverEnd={() => setHoverItem(null)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Halloween-Shop */}
              {(() => {
                const halloweenShopItems = SLOT_CONFIGS.flatMap(({ slot }) => {
                  const ownedSet = new Set(profile.inventory[slot] ?? []);
                  return ITEMS.filter(
                    (i) => i.slot === slot && i.tag === 'halloween' && !ownedSet.has(i.id) && typeof i.shopPrice === 'number'
                  );
                });
                if (halloweenShopItems.length === 0) return null;
                return (
                  <div>
                    <SectionHeader title="🎃 Halloween" hint="Spezielle Items — freischaltbar über Coins oder das Halloween-Special." />
                    <div className="grid grid-cols-4 gap-2">
                      {halloweenShopItems.map((item) => (
                        <ShopTile
                          key={`${item.slot}:${item.id}`}
                          slot={item.slot}
                          id={item.id}
                          price={item.shopPrice as number}
                          affordable={coins >= (item.shopPrice as number)}
                          isHalloween
                          onTap={() => handleBuyIntent(item as ItemDef & { shopPrice: number })}
                          onHoverStart={() => setHoverItem({ slot: item.slot, id: item.id })}
                          onHoverEnd={() => setHoverItem(null)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Alles freigeschaltet */}
              {SLOT_CONFIGS.every(({ slot }) => {
                const ownedSet = new Set(profile.inventory[slot] ?? []);
                return ITEMS.filter((i) => i.slot === slot && typeof i.shopPrice === 'number')
                  .every((i) => ownedSet.has(i.id));
              }) && (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="text-sm font-extrabold text-slate-700">Du hast alles freigeschaltet!</p>
                  <p className="text-xs text-slate-400 mt-1">Du bist unschlagbar.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Vollbild-Vorschau ── */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-6"
          onClick={() => setShowFullscreen(false)}
        >
          <div
            className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-violet-100/60 to-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowFullscreen(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 text-white text-sm flex items-center justify-center hover:bg-black/40 transition"
            >
              ✕
            </button>
            <div className="flex justify-center pt-6 pb-2 px-6">
              <AvatarStage
                key={`full-${profile.avatarBaseId}-${previewEquipment?.featured ?? ''}-${previewEquipment?.background ?? ''}-${previewEquipment?.effect ?? ''}`}
                avatarBaseId={profile.avatarBaseId}
                equipment={previewEquipment}
                width={280}
                height={350}
                withBackdrop={false}
              />
            </div>
            <p className="text-xs text-slate-400 text-center pb-5 px-6">Tippe irgendwo zum Schließen</p>
          </div>
        </div>
      )}

      {/* ── Kaufbestätigung — Bottom Sheet ── */}
      {confirmingItem && (
        <div
          className="fixed inset-0 z-[200] bg-gradient-to-t from-black/60 via-black/10 to-transparent"
          onClick={handleBuyCancel}
        >
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white shadow-2xl px-5 pt-4 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ziehgriff */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />

            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100">
                <img src={resolveItem(confirmingItem.slot, confirmingItem.id)} alt="" className="w-10 h-10 object-contain" />
              </div>
              <div className="flex-1">
                <div className="text-base font-extrabold text-slate-900 leading-tight">
                  {t('avatar.shop.confirmTitle', { defaultValue: 'Wirklich kaufen?' })}
                </div>
                <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                  <img src={assetUrl('media/story/ui/coin-128.webp')} alt="" className="w-4 h-4" />
                  <span className="font-bold text-slate-700">{confirmingItem.shopPrice}</span>
                  <span>Coins · du hast noch {Math.max(0, coins - confirmingItem.shopPrice)} übrig</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBuyCancel}
                className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleBuyConfirm}
                className="flex-1 rounded-2xl bg-[var(--color-teal-600)] py-3 text-sm font-bold text-white hover:bg-[var(--color-teal-700)]"
              >
                Ja, kaufen!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {showPurchaseToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] px-4 py-3 rounded-2xl bg-slate-900 text-white text-sm font-semibold shadow-xl whitespace-nowrap">
          ✓ {t('avatar.shop.purchaseToast', { defaultValue: 'Sieht gut aus! Du findest es jetzt in Meine Sachen.' })}
        </div>
      )}
    </Layout>
  );
}
