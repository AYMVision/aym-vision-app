// src/bonus/bonusAutoCollect.ts
import { unlockBonusById } from './unlockBonusById';
import { BONUS_INDEX } from './bonusIndex';

export function autoCollectCharacterCardsForChapter(chapterId: string): string[] {
  const items = BONUS_INDEX.filter(
    (x) =>
      x.category === 'characters' &&
      x.unlockedBy?.type === 'chapter' &&
      x.unlockedBy.id === chapterId
  );

  const newlyUnlocked: string[] = [];

  for (const it of items) {
    const wasNew = unlockBonusById(it.bonusId);
    if (wasNew) newlyUnlocked.push(it.bonusId);
  }

  return newlyUnlocked;
}
