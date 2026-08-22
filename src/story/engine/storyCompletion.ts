import { markChapterCompleted, getProgress } from '../../progress/storyProgress';
import { recordNewChapterCompletion } from '../../gating/gateEngine';
import { unlockDiaryEntriesForChapter } from '../../bonus/unlockDiaryEntriesForChapter';
import { autoCollectCharacterCardsForChapter } from '../../bonus/bonusAutoCollect';
import { applyChapterReward } from '../../progress/progressEngine';
import { aymFetch } from '../../identity/handshake';
import { getActiveProfileId } from '../../profile/profileStorage';

type EpisodeMetaLike = {
  seasonId: string;
  episodeId: string;
  stickerImage: string;
};

type ProfileUpdater<TProfile> = (
  updater: (prev: TProfile) => TProfile
) => void;

export type ChapterCompletionResult = {
  wasAlreadyCompletedBeforeAnswer: boolean;
  isEpisodeFinishedNow: boolean;
  chapterId: string;
  newlyUnlockedCardIds: string[];
  coinAwarded: boolean;
  stickerAwarded: boolean;
  episodeBonusAwarded: boolean;
  starterStickerAwarded: boolean;
  weeklyBadgeAwarded: boolean;
  newThemeStickerIds: string[];
  newMilestoneStickerIds: string[];
  progressDebug?: string;
};

export function completeStoryChapter<TProfile>(args: {
  courseId: string;
  chapterIndex0: number;
  chapterCount: number;
  episodeMeta: EpisodeMetaLike;
  updateProfile: ProfileUpdater<TProfile>;
  wasAlreadyCompletedBeforeAnswer: boolean;
  skipCoin?: boolean;
  getProfileResult?: (nextProfile: TProfile) => void;
  enableDebug?: boolean;
}): ChapterCompletionResult {
  const {
    courseId,
    chapterIndex0,
    chapterCount,
    episodeMeta,
    updateProfile,
    wasAlreadyCompletedBeforeAnswer,
    skipCoin = false,
    getProfileResult,
    enableDebug = false,
  } = args;

  const isLast = chapterIndex0 >= chapterCount - 1;

  markChapterCompleted(courseId, chapterIndex0, isLast);

  if (!wasAlreadyCompletedBeforeAnswer) {
    recordNewChapterCompletion({
      episodeId: courseId,
      chapterIndex0,
    });
  }

  const chapterId = `${courseId}c${String(chapterIndex0 + 1).padStart(2, '0')}`;
  unlockDiaryEntriesForChapter(chapterId);

  const newlyUnlockedCardIds = autoCollectCharacterCardsForChapter(chapterId);

  let coinAwarded = false;
  let stickerAwarded = false;
  let episodeBonusAwarded = false;
  let starterStickerAwarded = false;
  let weeklyBadgeAwarded = false;
  let newThemeStickerIds: string[] = [];
  let newMilestoneStickerIds: string[] = [];

  updateProfile((prev: any) => {
    const result = applyChapterReward(prev as any, {
      seasonId: episodeMeta.seasonId,
      episodeId: episodeMeta.episodeId,
      courseId,
      chapterIndex0,
      chapterCount,
      skipCoin,
    }) as {
      profile: any;
      coinAwarded: boolean;
      stickerAwarded: boolean;
      episodeBonusAwarded: boolean;
      starterStickerAwarded: boolean;
      weeklyBadgeAwarded: boolean;
      newThemeStickerIds: string[];
      newMilestoneStickerIds: string[];
    };

    coinAwarded = result.coinAwarded;
    stickerAwarded = result.stickerAwarded;
    episodeBonusAwarded = result.episodeBonusAwarded;
    starterStickerAwarded = result.starterStickerAwarded;
    weeklyBadgeAwarded = result.weeklyBadgeAwarded;
    newThemeStickerIds = result.newThemeStickerIds ?? [];
    newMilestoneStickerIds = result.newMilestoneStickerIds ?? [];

    getProfileResult?.(result.profile);

    return result.profile;
  });

  if (episodeBonusAwarded) {
    const profileId = getActiveProfileId();
    if (profileId) {
      void aymFetch('/api/v1/aym/course-state', {
        method: 'POST',
        body: JSON.stringify({ courseId, status: 'FINISHED', profileId }),
      }).then(async (res) => {
        if (!res.ok) return;
        const data = await res.json().catch(() => null) as { completionCertificate?: { hash: string; verifyUrl: string } } | null;
        if (data?.completionCertificate) {
          localStorage.setItem(
            `aym_p_${profileId}__aym_completion_cert`,
            JSON.stringify(data.completionCertificate),
          );
        }
      }).catch(() => {});
    }
  }

  let progressDebug: string | undefined;
  if (enableDebug) {
    const pAfterComplete = getProgress(courseId);
    progressDebug =
      `afterComplete | current=${chapterIndex0} | unlockedEpisode=${String(
        pAfterComplete?.unlockedEpisode
      )} | finished=${String(pAfterComplete?.finished)}`;
  }

  return {
    wasAlreadyCompletedBeforeAnswer,
    isEpisodeFinishedNow: isLast,
    chapterId,
    newlyUnlockedCardIds,
    coinAwarded,
    stickerAwarded,
    episodeBonusAwarded,
    starterStickerAwarded,
    weeklyBadgeAwarded,
    newThemeStickerIds,
    newMilestoneStickerIds,
    progressDebug,
  };
}