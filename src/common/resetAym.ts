// src/common/resetAym.ts
import { clearProfile } from '../profile/storage';
import { clearSeenBonusIds } from '../bonus/bonusSeen';

export function resetAymAll() {
  // Story progress (alle Versionen / alle Courses)
  for (const k of Object.keys(localStorage)) {
    if (k.startsWith('aym_story_progress_')) localStorage.removeItem(k);

    // Sticker/Seen (falls du alte Prefixe hast)
    if (k.startsWith('aym_seen_stickers_')) localStorage.removeItem(k);

    // (Optional) falls du alte Keys hattest:
    if (k.startsWith('story_progress_')) localStorage.removeItem(k);
    if (k.startsWith('aym_story_progress_v')) localStorage.removeItem(k);
  }

  // Bonus "gesehen"
  clearSeenBonusIds();

  // Profile (Coins, Inventory, Equipment, Progress)
  clearProfile();

  window.location.reload();
}
