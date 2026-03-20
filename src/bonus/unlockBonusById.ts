// src/bonus/unlockBonusById.ts
import { loadSeenBonusIds, markBonusSeen } from './bonusSeen';

/**
 * Marks a bonusId as unlocked/seen (idempotent).
 * @returns true if it was newly unlocked, false if it already existed.
 */
export function unlockBonusById(bonusId: string): boolean {
  if (!bonusId) return false;

  const seen = new Set(loadSeenBonusIds());
  if (seen.has(bonusId)) return false;

  markBonusSeen(bonusId);
  return true;
}
