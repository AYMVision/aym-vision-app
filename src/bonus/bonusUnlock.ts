// src/bonus/bonusUnlock.ts
import type { BonusItem } from './bonusIndex';
import { isBonusSeen } from './bonusSeen';

export interface BonusProgressSnapshot {
  seenChapterIds: string[]; // z.B. ['s1e01c01','s1e01c02',...]
  seenEpisodeIds?: string[];
}

export function isBonusUnlocked(item: BonusItem, progress: BonusProgressSnapshot): boolean {
    if (item.category === 'characters' && item.characterId === 'amy') {
    return true;
  }
  // Behalte dein bisheriges Konzept bei: released muss true sein
  if (!item.released) return false;

  // Wenn keine Unlock-Regel: released reicht
  if (!item.unlockedBy) return true;

  if (item.unlockedBy.type === 'chapter') {
    return progress.seenChapterIds.includes(item.unlockedBy.id);
  }

  if (item.unlockedBy.type === 'episode') {
    return (progress.seenEpisodeIds ?? []).includes(item.unlockedBy.id);
  }

  if (item.unlockedBy.type === 'marker') {
    // Marker wird beim Erreichen in der Story als "seen" markiert (bonusSeen)
    return isBonusSeen(item.bonusId);
  }

  return false;
}

export function sortBonus(items: BonusItem[]) {
  return [...items].sort((a, b) => a.order - b.order);
}
