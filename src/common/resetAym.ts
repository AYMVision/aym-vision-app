// src/common/resetAym.ts
import { clearProfile } from '../profile/storage';
import { clearSeenBonusIds } from '../bonus/bonusSeen';
import { clearAllStoryV02Responses } from '../story-v02/runtime/storyResponseStore';
import { clearTopicSeen } from '../story-v02/runtime/storyTopicStore';
import { resetParentPasscode } from '../settings/parentLock';
import { resetDiaryPin } from '../diary/diaryPin';

/** Löscht alle Kinderdaten (Profil, Fortschritt, Sticker, Bonus, Entwicklungsbereiche, Tagebuch).
 *  Eltern-Passcode und App-Einstellungen bleiben erhalten. */
export function resetChildData(): void {
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

/** Löscht alle lokal gespeicherten Daten der App (inkl. Eltern-Passcode, Einstellungen).
 *  Entspricht einer vollständigen DSGVO-Löschung auf diesem Gerät. */
export function deleteAllData(): void {
  resetChildData();
  resetParentPasscode();

  // Entitlements / Freischaltcodes
  for (const k of Object.keys(localStorage)) {
    if (k.startsWith('aym-') || k.startsWith('aym_')) {
      localStorage.removeItem(k);
    }
  }
}

/** @deprecated Verwende resetChildData() oder deleteAllData() */
export function resetAymAll() {
  resetChildData();
  window.location.reload();
}
