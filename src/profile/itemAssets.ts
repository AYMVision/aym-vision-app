// src/profile/itemAssets.ts
import { assetUrl } from '../common/assetUrl';
import type { ItemSlot } from './types';

export function resolveItem(slot: ItemSlot, id: string, size = 512) {
  return assetUrl(`media/items/${slot}/${id}-${size}.webp`);
}
// NEU: Stage-Overlay Assets (gleiches Koordinatensystem wie AvatarFullImage)
export function resolveStageItem(slot: ItemSlot, id: string, size = 768) {
  return assetUrl(`media/avatar-items/${slot}/${id}-${size}.webp`);
}