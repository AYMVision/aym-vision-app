// src/bonus/bonusCards.ts
import type { BonusItem } from './bonusIndex';

export type CardState = 'unknown' | 'unlocked' | 'collected';

export function getCharacterCardState(args: {
  item: BonusItem;
  unlocked: boolean;
  opened: boolean;
}): CardState {
  const { item, unlocked, opened } = args;

  // nur für profile/cards gedacht
  if (item.mediaType !== 'profile') return unlocked ? 'collected' : 'unknown';

  if (!unlocked) return 'unknown';
  if (!opened) return 'unlocked';
  return 'collected';
}
