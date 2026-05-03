import type { UserProfile } from '../profile/types';
import { applyDailyStreak } from './streak';
import { applyThemeRewards } from '../competencies/applyThemes';
import { getChapterThemes } from '../competencies/getChapterThemes';
import { applyThemeStickerRewards } from './themeStickerEngine';
import { STICKER_CATALOG } from './rewardCatalog';

const CATALOG_IDS = new Set(STICKER_CATALOG.map((s) => s.id));

export type ChapterMeta = {
  seasonId: string;
  episodeId: string;
  courseId: string;
  chapterIndex0: number;
  chapterCount: number;
  skipCoin?: boolean; // true für Epilog-Chapter — kein 1-Coin-Award
};

function chapterKey(m: ChapterMeta) {
  const c = String(m.chapterIndex0 + 1).padStart(2, '0');
  return `${m.seasonId}:${m.episodeId}:c${c}`;
}

function awardMilestoneSticker(
  profile: UserProfile,
  stickerId: string
): { profile: UserProfile; awarded: boolean } {
  if (profile.progress?.earnedStickers?.[stickerId]) {
    return { profile, awarded: false };
  }

  const now = Date.now();

  return {
    awarded: true,
    profile: {
      ...profile,
      progress: {
        ...profile.progress,
        earnedStickers: {
          ...(profile.progress?.earnedStickers ?? {}),
          [stickerId]: true,
        },
        earnedStickersAt: {
          ...(profile.progress?.earnedStickersAt ?? {}),
          [stickerId]: now,
        },
      },
    },
  };
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
      earnedStickersAt: prevProgress.earnedStickersAt ?? {},
      themePoints: prevProgress.themePoints ?? {},
      weeklyStreak: prevProgress.weeklyStreak ?? {
        lastActiveDay: '',
        currentStreak: 0,
        longestStreak: 0,
        completedWeeks: 0,
      },
      activity: prevProgress.activity ?? {
        totalPlayedDays: 0,
        lastPlayedDay: '',
      },
      diary: prevProgress.diary ?? {
        usedDays: 0,
        lastUsedDay: '',
      },
      friendbook: prevProgress.friendbook ?? {
        hasOwnEntry: false,
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
      newThemeStickerIds: [],
      newMilestoneStickerIds: [],
    };
  }

  const coins = base.wallet.coins ?? 0;
  const totalEarned = base.wallet.totalEarned ?? 0;
  const coinAwarded = !meta.skipCoin;

  let next: UserProfile = {
    ...base,
    wallet: {
      ...base.wallet,
      coins: coinAwarded ? coins + 1 : coins,
      totalEarned: coinAwarded ? totalEarned + 1 : totalEarned,
    },
    progress: {
      ...base.progress,
      completedChapters: { ...base.progress.completedChapters, [key]: true },
    },
  };

  // Themen für genau dieses Chapter
  const chapterThemes = getChapterThemes(meta.courseId, meta.chapterIndex0);
  next = applyThemeRewards(next, chapterThemes);

  // Themen-Sticker prüfen (nach Points-Update)
  const themeStickerResult = applyThemeStickerRewards(next);
  next = themeStickerResult.profile;
  const newThemeStickerIds = themeStickerResult.newThemeStickerIds;

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
    const now = Date.now();
    next = {
      ...next,
      progress: {
        ...next.progress,
        earnedStickers: {
          ...(next.progress.earnedStickers ?? {}),
          [episodeKey]: true,
        },
        earnedStickersAt: {
          ...(next.progress.earnedStickersAt ?? {}),
          [episodeKey]: now,
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
    const now = Date.now();
    next = {
      ...next,
      progress: {
        ...next.progress,
        earnedStickers: {
          ...(next.progress.earnedStickers ?? {}),
          'starter-first-5': true,
        },
        earnedStickersAt: {
          ...(next.progress.earnedStickersAt ?? {}),
          'starter-first-5': now,
        },
      },
    };
    starterStickerAwarded = true;
  }

  const newMilestoneStickerIds: string[] = [];

  // ✅ Weitere Milestones
  const earnedStickerIds = Object.keys(next.progress.earnedStickers ?? {});
  const totalCompletedEpisodesOverall = Object.keys(next.progress.completedEpisodes ?? {}).length;

  // 10 Kapitel
  if (totalCompletedChaptersOverall >= 10) {
    const res = awardMilestoneSticker(next, 'milestone-10-chapters');
    next = res.profile;
    if (res.awarded) newMilestoneStickerIds.push('milestone-10-chapters');
  }

  // erste Staffel (pragmatisch: 8 abgeschlossene Episoden)
  if (totalCompletedEpisodesOverall >= 8) {
    const res = awardMilestoneSticker(next, 'milestone-first-season');
    next = res.profile;
    if (res.awarded) newMilestoneStickerIds.push('milestone-first-season');
  }

  // 10 / 25 / 50 Sticker gesammelt — nur Katalog-IDs zählen (earnedStickers + earnedBadges)
  const totalEarnedStickersCount = [
    ...Object.keys(next.progress.earnedStickers ?? {}),
    ...Object.keys(next.progress.earnedBadges ?? {}),
  ].filter((id) => CATALOG_IDS.has(id)).length;

  if (totalEarnedStickersCount >= 10) {
    const res = awardMilestoneSticker(next, 'milestone-10-stickers');
    next = res.profile;
    if (res.awarded) newMilestoneStickerIds.push('milestone-10-stickers');
  }

  if (totalEarnedStickersCount >= 25) {
    const res = awardMilestoneSticker(next, 'milestone-25-stickers');
    next = res.profile;
    if (res.awarded) newMilestoneStickerIds.push('milestone-25-stickers');
  }

  if (totalEarnedStickersCount >= 50) {
    const res = awardMilestoneSticker(next, 'milestone-50-stickers');
    next = res.profile;
    if (res.awarded) newMilestoneStickerIds.push('milestone-50-stickers');
  }

  // erster Themen-Sticker
  const hasAnyThemeSticker = earnedStickerIds.some((id) => id.startsWith('theme-'));
  if (hasAnyThemeSticker) {
    const res = awardMilestoneSticker(next, 'milestone-first-theme-sticker');
    next = res.profile;
    if (res.awarded) newMilestoneStickerIds.push('milestone-first-theme-sticker');
  }

  // alle 7 Themen: Stufe-1-Sticker in jedem Thema gesammelt
  const allThemesOnce =
    ['talk-act', 'reflect-understand', 'safe-online', 'info-check', 'creative', 'fairness', 'problem-solving']
      .every((themeId) => !!next.progress.earnedStickers?.[`theme-${themeId}-1`]);

  if (allThemesOnce) {
    const res = awardMilestoneSticker(next, 'milestone-all-themes-once');
    next = res.profile;
    if (res.awarded) newMilestoneStickerIds.push('milestone-all-themes-once');
  }

  // 30 Tage insgesamt gespielt
  const totalPlayedDays = next.progress?.activity?.totalPlayedDays ?? 0;
  if (totalPlayedDays >= 30) {
    const res = awardMilestoneSticker(next, 'milestone-played-30-days');
    next = res.profile;
    if (res.awarded) newMilestoneStickerIds.push('milestone-played-30-days');
  }

  // 3 Tage Tagebuch genutzt
  const diaryUsedDays = next.progress?.diary?.usedDays ?? 0;
  if (diaryUsedDays >= 10) {
    const res = awardMilestoneSticker(next, 'milestone-diary-10-days');
    next = res.profile;
    if (res.awarded) newMilestoneStickerIds.push('milestone-diary-10-days');
  }

  // Freundebucheintrag geschrieben
  const hasFriendbookEntry = !!next.progress?.friendbook?.hasOwnEntry;
  if (hasFriendbookEntry) {
    const res = awardMilestoneSticker(next, 'milestone-friendbook-entry');
    next = res.profile;
    if (res.awarded) newMilestoneStickerIds.push('milestone-friendbook-entry');
  }

  return {
    profile: next,
    coinAwarded,
    stickerAwarded,
    episodeBonusAwarded,
    starterStickerAwarded,
    weeklyBadgeAwarded,
    newThemeStickerIds,
    newMilestoneStickerIds,
  };
}