import { DIARY_ENTRIES, type DiaryId } from './diaryEntries';
import { unlockBonusById } from './unlockBonusById.ts'; // Pfad ggf. anpassen



/**
 * Unlockt alle Diary-Entry-BonusIds, die nach einem Kapitel freigeschaltet werden sollen.
 * chapterId Beispiel: "s1e01c01"
 */
export function unlockDiaryEntriesForChapter(chapterId: string): string[] {
  const unlocked: string[] = [];
  const diaryIds = Object.keys(DIARY_ENTRIES) as DiaryId[];

  for (const diaryId of diaryIds) {
    const entries = DIARY_ENTRIES[diaryId] ?? [];

    // ✅ sobald irgendein Entry dieses Diaries für das Kapitel kommt, Buch mit freischalten
    let unlockedBookForThisChapter = false;

    for (const e of entries) {
      if (e.unlock?.afterChapterId !== chapterId) continue;
      if (!e.bonusId) continue;

      if (!unlockedBookForThisChapter) {
        const bookWasNew = unlockBonusById(diaryId);
        if (bookWasNew) unlocked.push(diaryId);
        unlockedBookForThisChapter = true;
      }

      const wasNew = unlockBonusById(e.bonusId);
      if (wasNew) unlocked.push(e.bonusId);
    }
  }

  return unlocked;
}

