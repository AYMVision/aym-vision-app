// src/components/AvatarStage.tsx
// Avatar stage compositing (AYM-Vision Aufräum-Leitfaden):
// - Assets aus /public über resolver (resolveItem, AvatarFullImage)
// - Kein Hardcode-assetUrl für Items in Komponenten
// - Robust: 768 → 512 fallback, ansonsten Layer ausblenden (kein Ersatzbild)
// - Alignment: Slot- und Item-spezifische Transform-Styles möglich

import React from 'react';
import type { Equipment, ItemSlot } from '../profile/types';
import AvatarFullImage from './AvatarFullImage';
import { resolveItem } from '../profile/itemAssets';
import { ITEM_STYLE } from '../data/items';



/**
 * 🎨 Layer-Reihenfolge (von unten nach oben)
 */
const LAYER_ORDER: ItemSlot[] = [
  'background',
  'bottom',
  'feet',
  'top',
  'face',
  'head',
  'effect',
];

/**
 * ✅ Slot-Defaults: grobe Ausrichtung je Slot.
 * Hinweis: Tailwind scale/translate funktionieren nur mit `transform`.
 */
const SLOT_STYLE: Record<ItemSlot, string> = {
  background: '', // object-cover
  bottom: '',
  feet: '',
  top: '',
  face: 'transform', // erstmal neutral, damit ITEM_STYLE eindeutig wirkt
  head: 'transform',
  effect: '',
};



type Props = {
  avatarBaseId: string;
  equipment?: Equipment;
  height?: number;
  width?: number;
  withBackdrop?: boolean;
};

type LayerFailState = 0 | 1 | 2; // 0=ok, 1=768 failed -> try 512, 2=hide

export default function AvatarStage({
  avatarBaseId,
  equipment,
  height = 520,
  width = 360,
  withBackdrop = true,
}: Props) {
  const [fail, setFail] = React.useState<Record<string, LayerFailState>>({});

  const getKey = (slot: ItemSlot, id: string) => `${slot}:${id}`;

  const getLayerSrc = (slot: ItemSlot, id: string) => {
    const key = getKey(slot, id);
    const state = fail[key] ?? 0;

    if (state === 0) return resolveItem(slot, id, 768);
    if (state === 1) return resolveItem(slot, id, 512);
    return null;
  };

  const markFailed = (slot: ItemSlot, id: string) => {
    const key = getKey(slot, id);
    setFail((m) => {
      const current = m[key] ?? 0;
      const next: LayerFailState = current === 0 ? 1 : 2; // 768->512->hide
      return { ...m, [key]: next };
    });
  };

  const frameClass = withBackdrop
    ? 'rounded-2xl bg-white border border-slate-200 p-3'
    : '';

  return (
    <div className={frameClass}>
      <div className="relative overflow-hidden" style={{ height, width, maxWidth: '100%' }}>
  {/* Background (unter allem) */}
  {(() => {
    const bgId = equipment?.background ?? null;
    if (!bgId) return null;

    const src = getLayerSrc('background', bgId);
    if (!src) return null;

    const styleKey = `background:${bgId}`;
    const overlayStyle = ITEM_STYLE[styleKey] ?? SLOT_STYLE.background ?? '';

    return (
      <img
        key={styleKey}
        src={src}
        alt=""
        className={'absolute inset-0 w-full h-full pointer-events-none object-cover ' + overlayStyle}
        loading="lazy"
        onError={() => markFailed('background', bgId)}
        decoding="async"
      />
    );
  })()}

  {/* Base-Avatar (über dem Hintergrund) */}
  <AvatarFullImage
    id={avatarBaseId}
    width={width}
    alt="Avatar"
    className="absolute inset-0 w-full h-full object-contain"
  />

  {/* Item-Layer (ohne background) */}
  {LAYER_ORDER.filter((s) => s !== 'background').map((slot) => {
    const id = equipment?.[slot] ?? null;
    if (!id) return null;

    const src = getLayerSrc(slot, id);
    if (!src) return null;

    const styleKey = `${slot}:${id}`;
    const overlayStyle = ITEM_STYLE[styleKey] ?? SLOT_STYLE[slot] ?? '';

    return (
      <img
        key={styleKey}
        src={src}
        alt=""
        className={
          'absolute inset-0 w-full h-full pointer-events-none object-contain ' +
          overlayStyle
        }
        loading="lazy"
        onError={() => markFailed(slot, id)}
        decoding="async"
      />
    );
  })}
</div>

    </div>
  );
}
