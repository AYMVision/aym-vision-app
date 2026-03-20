import type { UserProfile } from '../profile/types';
import { applyDailyStreak } from './streak';
import { applyThemeRewards } from '../competencies/applyThemes';
import { getChapterThemes } from '../competencies/getChapterThemes';

export type ChapterMeta = {
  seasonId: string;
  episodeId: string;
  courseId: string;
  chapterIndex0: number;
  chapterCount: number;
};

function chapterKey(m: ChapterMeta) {
  const c = String(m.chapterIndex0 + 1).padStart(2, '0');
  return `${m.seasonId}:${m.episodeId}:c${c}`;
}

export function applyChapterReward(profile: UserProfile, meta: ChapterMeta) {
  const prevProgress = profile.progress ?? ({} as UserProfile['progress']);
  const prevCompletedChapters = prevProgress.completedChapters ?? {};
  const prevCompletedEpisodes = prevProgress.completedEpisodes ?? {};
  const prevEarnedStickers = prevProgress.earnedStickers ?? {};
  const prevEarnedBadges = prevProgress.earnedBadges ?? {};

  const key = chapterKey(meta);

  const base: UserProfile = {
    ...profile,
    progress: {
      ...prevProgress,
      current: {
        seasonId: meta.seasonId,
        episodeId: meta.episodeId,
        courseId: meta.courseId,
        chapterIndex: meta.chapterIndex0 + 1,
        updatedAt: Date.now(),
      },
      completedChapters: prevCompletedChapters,
      completedEpisodes: prevCompletedEpisodes,
      earnedStickers: prevEarnedStickers,
      earnedBadges: prevEarnedBadges,
      themePoints: prevProgress.themePoints ?? {},
      weeklyStreak: prevProgress.weeklyStreak ?? {
        lastActiveDay: '',
        currentStreak: 0,
        longestStreak: 0,
        completedWeeks: 0,
      },
    },
    updatedAt: Date.now(),
  };

  if (base.progress.completedChapters[key]) {
    return {
      profile: base,
      coinAwarded: false,
      stickerAwarded: false,
      episodeBonusAwarded: false,
      starterStickerAwarded: false,
      weeklyBadgeAwarded: false,
    };
  }

  const coins = base.wallet.coins ?? 0;
  const totalEarned = base.wallet.totalEarned ?? 0;

  const coinAwarded = true;

  let next: UserProfile = {
    ...base,
    wallet: {
      ...base.wallet,
      coins: coins + 1,
      totalEarned: totalEarned + 1,
    },
    progress: {
      ...base.progress,
      completedChapters: { ...base.progress.completedChapters, [key]: true },
    },
  };

  // Themen für genau dieses Chapter
  const chapterThemes = getChapterThemes(meta.courseId, meta.chapterIndex0);
  next = applyThemeRewards(next, chapterThemes);

  // Streak anwenden
    const streakResult = applyDailyStreak(next);
  next = streakResult.profile;

  const weeklyBadgeAwarded = streakResult.weeklyBadgeAwarded;

  const episodeKey = `${meta.seasonId}:${meta.episodeId}`;
  const wasEpisodeCompleted = !!next.progress.completedEpisodes?.[episodeKey];

  let completedCount = 0;
  for (let i = 1; i <= meta.chapterCount; i++) {
    const c = String(i).padStart(2, '0');
    const k = `${meta.seasonId}:${meta.episodeId}:c${c}`;
    if (next.progress.completedChapters?.[k]) completedCount++;
  }

  const isEpisodeCompleteNow = completedCount >= meta.chapterCount;
  const episodeJustCompletedNow = !wasEpisodeCompleted && isEpisodeCompleteNow;

  let episodeBonusAwarded = false;

  if (episodeJustCompletedNow) {
    next = {
      ...next,
      wallet: {
        ...next.wallet,
        coins: (next.wallet.coins ?? 0) + 5,
        totalEarned: (next.wallet.totalEarned ?? 0) + 5,
      },
      progress: {
        ...next.progress,
        completedEpisodes: {
          ...(next.progress.completedEpisodes ?? {}),
          [episodeKey]: true,
        },
      },
    };
    episodeBonusAwarded = true;
  }

  let stickerAwarded = false;

  if (episodeJustCompletedNow && !next.progress.earnedStickers?.[episodeKey]) {
    next = {
      ...next,
      progress: {
        ...next.progress,
        earnedStickers: {
          ...(next.progress.earnedStickers ?? {}),
          [episodeKey]: true,
        },
      },
    };
    stickerAwarded = true;
  }

  // ✅ Starter-Sondersticker nach den ersten 5 abgeschlossenen Chaptern insgesamt
  let starterStickerAwarded = false;

  const totalCompletedChaptersOverall = Object.keys(next.progress.completedChapters ?? {}).length;

  if (
    totalCompletedChaptersOverall >= 5 &&
    !next.progress.earnedStickers?.['starter-first-5']
  ) {
    next = {
      ...next,
      progress: {
        ...next.progress,
        earnedStickers: {
          ...(next.progress.earnedStickers ?? {}),
          'starter-first-5': true,
        },
      },
    };
    starterStickerAwarded = true;
  }

 

  return {
    profile: next,
    coinAwarded,
    stickerAwarded,
    episodeBonusAwarded,
    starterStickerAwarded,
    weeklyBadgeAwarded,
  };
}