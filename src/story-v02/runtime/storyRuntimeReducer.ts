// src/story-v02/runtime/storyRuntimeReducer.ts

import type { Message } from '../../common/types';
import type { StoryChapterV02, StoryStep } from '../types/storyTypes';
import type {
  StoryRuntimePhase,
  StoryRuntimeState,
  TranscriptEntry,
} from '../types/storyRuntimeTypes';
import { getEntryPhaseForStep, getNextStepIndex0, isLastStep } from './storyStepNavigator';
import type { IndicatorId, ItemScore, StoryDimensionId } from '../types/measurementTypes';

type StartChapterAction = {
  type: 'START_CHAPTER';
  payload: {
    courseId: string;
    chapter: StoryChapterV02;
  };
};

type AdvanceToChapterAction = {
  type: 'ADVANCE_TO_CHAPTER';
  payload: {
    courseId: string;
    chapter: StoryChapterV02;
  };
};

type AppendStoryMessageAction = {
  type: 'APPEND_STORY_MESSAGE';
  payload: {
    message: Message;
  };
};

type CompleteStoryStepAction = {
  type: 'COMPLETE_STORY_STEP';
  payload: {
    step: StoryStep;
  };
};

type SubmitInputAction = {
  type: 'SUBMIT_INPUT';
  payload: {
    stepId: string;
    text?: string;
    choiceId?: string;
    choiceText?: string;
    promptText?: string;
  };
};

type SubmitItemAction = {
  type: 'SUBMIT_ITEM';
  payload: {
    stepId: string;
    optionId: string;
    optionText: string;
    dimension: StoryDimensionId;
    indicatorId: IndicatorId;
    score: ItemScore;
    promptText?: string;
  };
};

type SubmitItemMultiAction = {
  type: 'SUBMIT_ITEM_MULTI';
  payload: {
    stepId: string;
    selectedOptionIds: string[];
    selectedOptionTexts: string[];
    optionScores: Record<string, ItemScore>;
    dimension: StoryDimensionId;
    indicatorId: IndicatorId;
    promptText?: string;
  };
};

type ShowAmyFeedbackAction = {
  type: 'SHOW_AMY_FEEDBACK';
  payload: {
    stepId: string;
    lines: string[];
  };
};

type SubmitReflectionAction = {
  type: 'SUBMIT_REFLECTION';
  payload: {
    stepId: string;
    text?: string;
    choiceId?: string;
    choiceText?: string;
    promptText?: string;
    amyReplyText?: string;
  };
};

type ShowAmyReactionAction = {
  type: 'SHOW_AMY_REACTION';
  payload: {
    stepId: string;
    lines: string[];
  };
};

type ShowChallengeAction = {
  type: 'SHOW_CHALLENGE';
  payload: {
    stepId: string;
    text: string;
  };
};

type GoToNextStepAction = {
  type: 'GO_TO_NEXT_STEP';
  payload: {
    chapter: StoryChapterV02;
  };
};

type RestoreSnapshotAction = {
  type: 'RESTORE_SNAPSHOT';
  payload: StoryRuntimeState;
};

type AddEpisodeSummaryAction = {
  type: 'ADD_EPISODE_SUMMARY';
  payload: {
    id: string;
    courseId: string;
    bonusCoins: number;
    stickerAwarded: boolean;
  };
};

export type StoryRuntimeAction =
  | StartChapterAction
  | AppendStoryMessageAction
  | AdvanceToChapterAction
  | CompleteStoryStepAction
  | SubmitInputAction
  | SubmitItemAction
  | SubmitItemMultiAction
  | ShowAmyFeedbackAction
  | SubmitReflectionAction
  | ShowAmyReactionAction
  | ShowChallengeAction
  | GoToNextStepAction
  | RestoreSnapshotAction
  | AddEpisodeSummaryAction;

function makeTranscriptId(prefix: string, seed: string) {
  return `${prefix}:${seed}`;
}

function addCompletedStepId(state: StoryRuntimeState, stepId: string): string[] {
  if (state.completedStepIds.includes(stepId)) return state.completedStepIds;
  return [...state.completedStepIds, stepId];
}

function pushTranscriptEntry(
  transcript: TranscriptEntry[],
  entry: TranscriptEntry
): TranscriptEntry[] {
  if (transcript.some((x) => x.id === entry.id)) return transcript;
  return [...transcript, entry];
}

export function createInitialStoryRuntimeState(args: {
  courseId: string;
  chapter: StoryChapterV02;
}): StoryRuntimeState {
  const firstStep = args.chapter.steps[0];

  return {
    courseId: args.courseId,
    chapterId: args.chapter.id,
    chapterIndex0: args.chapter.chapterIndex0,
    stepIndex0: 0,
    phase: firstStep ? getEntryPhaseForStep(firstStep) : 'chapter_finished',
    storyCursor: firstStep?.type === 'story' ? { messageIndex0: 0 } : undefined,
    transcript: [],
    completedStepIds: [],
    activeStepId: firstStep?.id,
    inputDraft: '',
    reflectionDraft: '',
  };
}

export function storyRuntimeReducer(
  state: StoryRuntimeState,
  action: StoryRuntimeAction
): StoryRuntimeState {
  switch (action.type) {
    case 'START_CHAPTER': {
      return createInitialStoryRuntimeState({
        courseId: action.payload.courseId,
        chapter: action.payload.chapter,
      });
    }

        case 'ADVANCE_TO_CHAPTER': {
      const firstStep = action.payload.chapter.steps[0];

      return {
        ...state,
        courseId: action.payload.courseId,
        chapterId: action.payload.chapter.id,
        chapterIndex0: action.payload.chapter.chapterIndex0,
        stepIndex0: 0,
        phase: firstStep ? getEntryPhaseForStep(firstStep) : 'chapter_finished',
        storyCursor: firstStep?.type === 'story' ? { messageIndex0: 0 } : undefined,
        activeStepId: firstStep?.id,
        inputDraft: '',
        reflectionDraft: '',
      };
    }

    case 'APPEND_STORY_MESSAGE': {
      const message = action.payload.message;
      const messageId = message.id ?? `msg-${state.chapterId}-${state.transcript.length + 1}`;

      return {
        ...state,
        transcript: pushTranscriptEntry(state.transcript, {
          kind: 'message',
          id: makeTranscriptId('message', messageId),
          message,
        }),
        storyCursor: {
          messageIndex0: (state.storyCursor?.messageIndex0 ?? 0) + 1,
        },
      };
    }

    case 'COMPLETE_STORY_STEP': {
      return {
        ...state,
        completedStepIds: addCompletedStepId(state, action.payload.step.id),
      };
    }

    case 'SUBMIT_INPUT': {
      return {
        ...state,
        transcript: pushTranscriptEntry(state.transcript, {
          kind: 'input_response',
          id: makeTranscriptId('input', action.payload.stepId),
          stepId: action.payload.stepId,
          text: action.payload.text,
          choiceId: action.payload.choiceId,
          choiceText: action.payload.choiceText,
          promptText: action.payload.promptText || undefined,
        }),
        completedStepIds: addCompletedStepId(state, action.payload.stepId),
        inputDraft: '',
      };
    }

    case 'SUBMIT_ITEM': {
      return {
        ...state,
        transcript: pushTranscriptEntry(state.transcript, {
          kind: 'item_response',
          id: makeTranscriptId('item', action.payload.stepId),
          stepId: action.payload.stepId,
          optionId: action.payload.optionId,
          optionText: action.payload.optionText,
          dimension: action.payload.dimension,
          indicatorId: action.payload.indicatorId,
          score: action.payload.score,
          promptText: action.payload.promptText || undefined,
        }),
        completedStepIds: addCompletedStepId(state, action.payload.stepId),
      };
    }

    case 'SUBMIT_ITEM_MULTI': {
      return {
        ...state,
        transcript: pushTranscriptEntry(state.transcript, {
          kind: 'item_multi_response',
          id: makeTranscriptId('item-multi', action.payload.stepId),
          stepId: action.payload.stepId,
          selectedOptionIds: action.payload.selectedOptionIds,
          selectedOptionTexts: action.payload.selectedOptionTexts,
          optionScores: action.payload.optionScores,
          dimension: action.payload.dimension,
          indicatorId: action.payload.indicatorId,
          promptText: action.payload.promptText || undefined,
        }),
        completedStepIds: addCompletedStepId(state, action.payload.stepId),
      };
    }

    case 'SHOW_AMY_FEEDBACK': {
      return {
        ...state,
        transcript: pushTranscriptEntry(state.transcript, {
          kind: 'amy_feedback',
          id: makeTranscriptId('amy-feedback', action.payload.stepId),
          stepId: action.payload.stepId,
          lines: action.payload.lines,
        }),
      };
    }

    case 'SUBMIT_REFLECTION': {
      return {
        ...state,
        transcript: pushTranscriptEntry(state.transcript, {
          kind: 'reflection_response',
          id: makeTranscriptId('reflection', action.payload.stepId),
          stepId: action.payload.stepId,
          text: action.payload.text,
          choiceId: action.payload.choiceId,
          choiceText: action.payload.choiceText,
          promptText: action.payload.promptText,
          amyReplyText: action.payload.amyReplyText,
        }),
        completedStepIds: addCompletedStepId(state, action.payload.stepId),
        reflectionDraft: '',
      };
    }

    case 'SHOW_AMY_REACTION': {
      return {
        ...state,
        transcript: pushTranscriptEntry(state.transcript, {
          kind: 'amy_reaction',
          id: makeTranscriptId('amy-reaction', action.payload.stepId),
          stepId: action.payload.stepId,
          lines: action.payload.lines,
        }),
      };
    }

    case 'SHOW_CHALLENGE': {
      return {
        ...state,
        transcript: pushTranscriptEntry(state.transcript, {
          kind: 'challenge',
          id: makeTranscriptId('challenge', action.payload.stepId),
          stepId: action.payload.stepId,
          text: action.payload.text,
        }),
        completedStepIds: addCompletedStepId(state, action.payload.stepId),
      };
    }

    case 'GO_TO_NEXT_STEP': {
      const nextStepIndex0 = getNextStepIndex0(action.payload.chapter, state.stepIndex0);

      if (nextStepIndex0 == null) {
        return {
          ...state,
          phase: 'chapter_finished',
          activeStepId: undefined,
          storyCursor: undefined,
        };
      }

      const nextStep = action.payload.chapter.steps[nextStepIndex0];

      return {
        ...state,
        stepIndex0: nextStepIndex0,
        activeStepId: nextStep.id,
        phase: getEntryPhaseForStep(nextStep),
        storyCursor: nextStep.type === 'story' ? { messageIndex0: 0 } : undefined,
      };
    }

    case 'RESTORE_SNAPSHOT': {
      return action.payload;
    }

    case 'ADD_EPISODE_SUMMARY': {
      return {
        ...state,
        phase: 'episode_finished',
        transcript: pushTranscriptEntry(state.transcript, {
          kind: 'episode_summary',
          id: action.payload.id,
          courseId: action.payload.courseId,
          bonusCoins: action.payload.bonusCoins,
          stickerAwarded: action.payload.stickerAwarded,
        }),
      };
    }

    default:
      return state;
  }
}