// src/story-v02/runtime/storyCompletionBridge.ts

import type { EpisodeMeta } from '../../content/contentIndex';
import { completeStoryChapter, type ChapterCompletionResult } from '../../story/engine/storyCompletion';

type ProfileUpdater<TProfile> = (
  updater: (prev: TProfile) => TProfile
) => void;

export function completeStoryV02Chapter<TProfile>(args: {
  courseId: string;
  chapterIndex0: number;
  chapterCount: number;
  episodeMeta: EpisodeMeta;
  updateProfile: ProfileUpdater<TProfile>;
  wasAlreadyCompletedBeforeAnswer: boolean;
  isEpilogue?: boolean;
  enableDebug?: boolean;
}): ChapterCompletionResult {
  return completeStoryChapter({
    courseId: args.courseId,
    chapterIndex0: args.chapterIndex0,
    chapterCount: args.chapterCount,
    episodeMeta: {
      seasonId: args.episodeMeta.seasonId,
      episodeId: args.episodeMeta.episodeId,
      stickerImage: args.episodeMeta.stickerImage,
    },
    updateProfile: args.updateProfile,
    wasAlreadyCompletedBeforeAnswer: args.wasAlreadyCompletedBeforeAnswer,
    skipCoin: args.isEpilogue ?? false,
    enableDebug: args.enableDebug,
  });
}