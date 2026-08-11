// src/common/resetAym.ts
import { clearProfile } from '../profile/storage';
import { clearSeenBonusIds } from '../bonus/bonusSeen';
import { clearAllStoryV02Responses } from '../story-v02/runtime/storyResponseStore';
import { clearTopicSeen } from '../story-v02/runtime/storyTopicStore';
import { resetParentPasscode } from '../settings/parentLock';
import { resetDiaryPin } from '../diary/diaryPin';
import { pStorage } from '../profile/profileStorage';
import { deleteProfile } from '../profile/profileIndex';

/** Löscht alle Kinderdaten des AKTIVEN Profils.
 *  Andere Profile und Eltern-Passcode bleiben erhalten. */
export function resetChildData(): void {
  // Alle profil-gebundenen Keys des aktiven Profils löschen
  for (const k of pStorage.allScopedKeys()) {
    localStorage.removeItem(k);
  }
  // Legacy-Fallback (vor Migration)
  for (const k of Object.keys(localStorage)) {
    if (
      k.startsWith('aym_story_progress_') ||
      k.startsWith('aym_seen_stickers_') ||
      k.startsWith('story_progress_') ||
      k === 'aym_diary_me_v1'
    ) {
      localStorage.removeItem(k);
    }
  }
  clearSeenBonusIds();
  clearAllStoryV02Responses();
  clearTopicSeen();
  resetDiaryPin();
  clearProfile();
}

/** Löscht ein bestimmtes Profil komplett (Elternbereich). */
export function resetProfileById(profileId: string): void {
  deleteProfile(profileId);
}

/** Löscht alle lokal gespeicherten Daten der App (inkl. Eltern-Passcode, Einstellungen).
 *  Entspricht einer vollständigen DSGVO-Löschung auf diesem Gerät. */
export function deleteAllData(): void {
  resetParentPasscode();
  for (const k of Object.keys(localStorage)) {
    if (k.startsWith('aym-') || k.startsWith('aym_') || k.startsWith('story-v02-')) {
      localStorage.removeItem(k);
    }
  }
}

/** @deprecated Verwende resetChildData() oder deleteAllData() */
export function resetAymAll() {
  resetChildData();
  window.location.reload();
}
