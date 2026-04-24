// src/profile/itemAssets.ts
import { assetUrl } from '../common/assetUrl';
import type { ItemSlot } from './types';

export function resolveItem(slot: ItemSlot, id: string, size = 512) {
  return `/media/items/${slot}/${id}-${size}.webp`;
}