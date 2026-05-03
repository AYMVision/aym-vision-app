// src/story-v02/types/storyRuntimeTypes.ts

import type { Message } from '../../common/types';
import type { ItemScore, IndicatorId, StoryDimensionId } from './measurementTypes';

export type StoryRuntimePhase =
  | 'playing_story'
  | 'awaiting_input'
  | 'awaiting_item_choice'
  | 'awaiting_item_multi_choice'
  | 'showing_amy_feedback'
  | 'awaiting_reflection'
  | 'showing_amy_reaction'
  | 'showing_challenge'
  | 'chapter_finished'
  | 'episode_finished';

export type TranscriptEntry =
  | {
      kind: 'message';
      id: string;
      message: Message;
    }
  | {
      kind: 'input_response';
      id: string;
      stepId: string;
      text?: string;
      choiceId?: string;
      choiceText?: string;
      promptText?: string; // Frage-Prompt — gespeichert wenn showPromptBubble !== false
    }
  | {
      kind: 'item_response';
      id: string;
      stepId: string;
      optionId: string;
      optionText: string;
      dimension: StoryDimensionId;
      indicatorId: IndicatorId;
      score: ItemScore;
      promptText?: string; // Amy's question — persisted so it stays visible in transcript
    }
  | {
      kind: 'item_multi_response';
      id: string;
      stepId: string;
      selectedOptionIds: string[];
      selectedOptionTexts: string[];
      /** score per optionId — used to render correctness in transcript */
      optionScores: Record<string, ItemScore>;
      dimension: StoryDimensionId;
      indicatorId: IndicatorId;
      promptText?: string; // Amy's question — persisted so it stays visible in transcript
    }
  | {
      kind: 'amy_feedback';
      id: string;
      stepId: string;
      lines: string[];
    }
  | {
      kind: 'reflection_response';
      id: string;
      stepId: string;
      text?: string;
      choiceId?: string;
      choiceText?: string;
      promptText?: string;   // Amy's question — persisted so it stays visible in transcript
      amyReplyText?: string; // Amy's reply (open_text unlocked path)
    }
  | {
      kind: 'amy_reaction';
      id: string;
      stepId: string;
      lines: string[];
    }
  | {
      kind: 'challenge';
      id: string;
      stepId: string;
      text: string;
    }
  | {
      kind: 'episode_summary';
      id: string;
      courseId: string;
      bonusCoins: number;
      stickerAwarded: boolean;
    };

export type StoryRuntimeState = {
  courseId: string;
  chapterId: string;
  chapterIndex0: number;
  stepIndex0: number;
  phase: StoryRuntimePhase;

  storyCursor?: {
    messageIndex0: number;
  };

  transcript: TranscriptEntry[];
  completedStepIds: string[];
  activeStepId?: string;

  inputDraft?: string;
  reflectionDraft?: string;
};


export type StorySessionSnapshot = {
  courseId: string;
  chapterId: string;
  chapterIndex0: number;
  stepIndex0: number;
  phase: StoryRuntimePhase;
  storyCursor?: {
    messageIndex0: number;
  };
  transcript: TranscriptEntry[];
  completedStepIds: string[];
  activeStepId?: string;
  lastVisibleEntryId?: string;
  updatedAt: number;
};