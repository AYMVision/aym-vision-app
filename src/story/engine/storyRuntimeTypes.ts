import type { Message } from '../../common/types';

export type StoryRuntimePhase =
  | 'playing_story'
  | 'awaiting_legacy_answer'
  | 'resolving_legacy_answer'
  | 'showing_legacy_reaction'
  | 'awaiting_input'
  | 'awaiting_item_choice'
  | 'awaiting_reflection'
  | 'showing_amy_feedback'
  | 'showing_amy_reaction'
  | 'showing_challenge'
  | 'chapter_finished'
  | 'episode_finished';

export type StoryRuntimeState = {
  courseId: string;
  chapterIndex0: number;
  stepIndex0: number;
  phase: StoryRuntimePhase;
  displayedMessages: Message[];
  completedStepIds: string[];
  currentMessageIndexInStep: number;
  attemptByStepId: Record<string, number>;
  currentLegacyAnswer?: string;
  currentInputValue?: string;
  currentReflectionValue?: string;
  updatedAt: number;
};

export type StoryRuntimeSnapshotV2 = {
  courseId: string;
  chapterIndex0: number;
  stepIndex0: number;
  phase: StoryRuntimePhase;
  displayedMessages: Message[];
  completedStepIds: string[];
  currentMessageIndexInStep: number;
  attemptByStepId: Record<string, number>;
  updatedAt: number;
};