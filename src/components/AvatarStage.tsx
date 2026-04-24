import React from 'react';
import type { Equipment, ItemSlot } from '../profile/types';
import AvatarFullImage from './AvatarFullImage';
import SmartImage from './SmartImage';
import { resolveItem } from '../profile/itemAssets';
import { ITEM_STYLE } from '../data/items';

type Props = {
  avatarBaseId: string;
  equipment?: Equipment;
  height?: number;
  width?: number;
  withBackdrop?: boolean;
};

type LayerFailState = 0 | 1 | 2;

const SLOT_STYLE: Record<ItemSlot, string> = {
  background: '',
  featured: '',
  effect: '',
};

export default function AvatarStage({
  avatarBaseId,
  equipment,
  height = 520,
  width = 360,
  withBackdrop = true,
}: Props) {
  const [fail, setFail] = React.useState<Record<string, LayerFailState>>({});

  const getKey = (slot: ItemSlot, id: string) => `${slot}:${id}`;

  const getLayerState = (slot: ItemSlot, id: string) => {
    const key = getKey(slot, id);
    return fail[key] ?? 0;
  };

  const markFailed = (slot: ItemSlot, id: string) => {
    const key = getKey(slot, id);
    setFail((prev) => {
      const current = prev[key] ?? 0;
      const next: LayerFailState = current === 0 ? 1 : 2;
      return { ...prev, [key]: next };
    });
  };

  const frameClass = withBackdrop
    ? 'rounded-2xl bg-white border border-slate-200 p-3'
    : '';

  const backgroundId = equipment?.background ?? null;
  const featuredId = equipment?.featured ?? null;
  const effectId = equipment?.effect ?? null;

  return (
    <div className={frameClass}>
      <div
        className="relative overflow-hidden"
        style={{ height, width, maxWidth: '100%' }}
      >
        {backgroundId && getLayerState('background', backgroundId) < 2 && (
          <SmartImage
            alt=""
            className={
              'absolute inset-0 w-full h-full object-cover pointer-events-none ' +
              (ITEM_STYLE[`background:${backgroundId}`] ?? SLOT_STYLE.background)
            }
            sizes={`${width}px`}
            width={width}
            height={height}
            webp={[
              { src: resolveItem('background', backgroundId, 512), w: 512 },
              { src: resolveItem('background', backgroundId, 768), w: 768 },
            ]}
            fallback={resolveItem('background', backgroundId, 512)}
            onErrorFallback=""
            loading="lazy"
            decoding="async"
            onError={() => markFailed('background', backgroundId)}
          />
        )}

        <AvatarFullImage
          id={avatarBaseId}
          width={width}
          height={height}
          alt="Avatar"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {featuredId && getLayerState('featured', featuredId) < 2 && (
          <SmartImage
            alt=""
            className={
              'absolute inset-0 w-full h-full object-contain pointer-events-none ' +
              (ITEM_STYLE[`featured:${featuredId}`] ?? SLOT_STYLE.featured)
            }
            sizes={`${width}px`}
            width={width}
            height={height}
            webp={[
              { src: resolveItem('featured', featuredId, 512), w: 512 },
              { src: resolveItem('featured', featuredId, 768), w: 768 },
            ]}
            fallback={resolveItem('featured', featuredId, 512)}
            onErrorFallback=""
            loading="lazy"
            decoding="async"
            onError={() => markFailed('featured', featuredId)}
          />
        )}

        {effectId && getLayerState('effect', effectId) < 2 && (
          <SmartImage
            alt=""
            className={
              'absolute inset-0 w-full h-full object-contain pointer-events-none ' +
              (ITEM_STYLE[`effect:${effectId}`] ?? SLOT_STYLE.effect)
            }
            sizes={`${width}px`}
            width={width}
            height={height}
            webp={[
              { src: resolveItem('effect', effectId, 512), w: 512 },
              { src: resolveItem('effect', effectId, 768), w: 768 },
            ]}
            fallback={resolveItem('effect', effectId, 512)}
            onErrorFallback=""
            loading="lazy"
            decoding="async"
            onError={() => markFailed('effect', effectId)}
          />
        )}
      </div>
    </div>
  );
}