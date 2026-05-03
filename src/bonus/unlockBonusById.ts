// src/bonus/unlockBonusById.ts
import { markBonusUnlocked } from './bonusSeen';

/**
 * Called by the story engine when a bonus-link message appears in auto-play.
 * Writes to aym_bonus_markers_v1 (unlock state), NOT to aym_seen_bonus_v1 (read state).
 * This keeps "newly unlocked" and "already read" as independent states so that
 * the Newspaper "Neu freigeschaltet" section shows correctly until the user clicks through.
 *
 * @returns true if newly unlocked, false if already was unlocked.
 */
export function unlockBonusById(bonusId: string): boolean {
  return markBonusUnlocked(bonusId);
}
