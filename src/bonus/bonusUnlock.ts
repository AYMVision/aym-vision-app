// src/bonus/bonusUnlock.ts
import type { BonusItem } from './bonusIndex';
import { isBonusMarkerUnlocked } from './bonusSeen';
import { shouldBypassAll } from '../gating/entitlements';

export interface BonusProgressSnapshot {
  seenChapterIds: string[]; // z.B. ['s1e01c01','s1e01c02',...]
  seenEpisodeIds?: string[];
}

export function isBonusUnlocked(item: BonusItem, progress: BonusProgressSnapshot): boolean {
  // AMY-DEV: alles freischalten (Story-Kapitel + alle Bonus-Inhalte)
  if (shouldBypassAll()) return true;

  if (item.category === 'characters' && item.characterId === 'amy') {
    return true;
  }
  // Behalte dein bisheriges Konzept bei: released muss true sein
  if (!item.released) return false;

  // Wenn keine Unlock-Regel: released reicht
  if (!item.unlockedBy) return true;

  if (item.unlockedBy.type === 'chapter') {
    // Primär: Chapter in Profil abgeschlossen?
    if (progress.seenChapterIds.includes(item.unlockedBy.id)) return true;
    // Fallback: autoCollectCharacterCardsForChapter hat den Marker gesetzt?
    // (greift, wenn Profil noch nicht committed ist oder nach Page-Reload)
    if (item.category === 'characters' && item.bonusId) {
      return isBonusMarkerUnlocked(item.bonusId);
    }
    return false;
  }

  if (item.unlockedBy.type === 'episode') {
    return (progress.seenEpisodeIds ?? []).includes(item.unlockedBy.id);
  }

  if (item.unlockedBy.type === 'marker') {
    // Marker wird beim Erreichen in der Story gesetzt (aym_bonus_markers_v1).
    // Getrennt vom "gelesen"-Status (aym_seen_bonus_v1) → "Neu freigeschaltet" funktioniert.
    return isBonusMarkerUnlocked(item.bonusId);
  }

  return false;
}

/**
 * Prüft ob eine Charakterkarte durch echten Story-Fortschritt freigeschaltet ist.
 * Ignoriert bewusst shouldBypassAll() — damit sehen auch Beta-Nutzer nur
 * Charaktere, die sie in der Story wirklich schon getroffen haben.
 */
export function isCharacterUnlockedByProgress(item: BonusItem, progress: BonusProgressSnapshot): boolean {
  if (item.characterId === 'amy') return true;
  if (!item.released) return false;
  if (!item.unlockedBy || item.unlockedBy.id === '__never__') return false;
  if (item.unlockedBy.type === 'chapter') {
    return progress.seenChapterIds.includes(item.unlockedBy.id);
  }
  return false;
}

export function sortBonus(items: BonusItem[]) {
  return [...items].sort((a, b) => a.order - b.order);
}
