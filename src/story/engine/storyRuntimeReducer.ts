import type { Message } from '../../common/types';
import type {
  StoryRuntimePhase,
  StoryRuntimeSnapshotV2,
  StoryRuntimeState,
} from './storyRuntimeTypes';

export type StoryRuntimeAction =
  | {
      type: 'RESET_SESSION';
      payload: {
        courseId: string;
        chapterIndex0?: number;
      };
    }
  | {
      type: 'RESTORE_SNAPSHOT';
      payload: StoryRuntimeSnapshotV2;
    }
  | {
      type: 'SET_PHASE';
      payload: {
        phase: StoryRuntimePhase;
      };
    }
  | {
      type: 'SET_CHAPTER';
      payload: {
        chapterIndex0: number;
        stepIndex0?: number;
        currentMessageIndexInStep?: number;
        clearCompletedStepIds?: boolean;
      };
    }
  | {
      type: 'SET_STEP';
      payload: {
        stepIndex0: number;
        phase?: StoryRuntimePhase;
        currentMessageIndexInStep?: number;
      };
    }
  | {
      type: 'MARK_STEP_COMPLETED';
      payload: {
        stepId: string;
      };
    }
  | {
      type: 'SET_DISPLAYED_MESSAGES';
      payload: {
        messages: Message[];
      };
    }
  | {
      type: 'APPEND_DISPLAYED_MESSAGES';
      payload: {
        messages: Message[];
      };
    }
  | {
      type: 'SET_CURRENT_MESSAGE_INDEX_IN_STEP';
      payload: {
        index: number;
      };
    }
  | {
      type: 'SET_ATTEMPT_FOR_STEP';
      payload: {
        stepId: string;
        value: number;
      };
    }
  | {
      type: 'INC_ATTEMPT_FOR_STEP';
      payload: {
        stepId: string;
      };
    }
  | {
      type: 'RESET_ATTEMPT_FOR_STEP';
      payload: {
        stepId: string;
      };
    }
  | {
      type: 'SET_LEGACY_ANSWER';
      payload: {
        value?: string;
      };
    }
  | {
      type: 'SET_INPUT_VALUE';
      payload: {
        value?: string;
      };
    }
  | {
      type: 'SET_REFLECTION_VALUE';
      payload: {
        value?: string;
      };
    };

function mergeUniqueById<T extends { id?: string }>(prev: T[], next: T[]) {
  const seen = new Set(prev.map((m) => m.id).filter(Boolean) as string[]);
  const merged = [...prev];

  for (const m of next) {
    const id = m.id;
    if (id && seen.has(id)) continue;
    if (id) seen.add(id);
    merged.push(m);
  }

  return merged;
}

export function createInitialStoryRuntimeState(args: {
  courseId: string;
  chapterIndex0?: number;
}): StoryRuntimeState {
  return {
    courseId: args.courseId,
    chapterIndex0: args.chapterIndex0 ?? 0,
    stepIndex0: 0,
    phase: 'playing_story',
    displayedMessages: [],
    completedStepIds: [],
    currentMessageIndexInStep: 0,
    attemptByStepId: {},
    currentLegacyAnswer: undefined,
    currentInputValue: undefined,
    currentReflectionValue: undefined,
    updatedAt: Date.now(),
  };
}

export function buildStoryRuntimeSnapshotV2(
  state: StoryRuntimeState
): StoryRuntimeSnapshotV2 {
  return {
    courseId: state.courseId,
    chapterIndex0: state.chapterIndex0,
    stepIndex0: state.stepIndex0,
    phase: state.phase,
    displayedMessages: state.displayedMessages,
    completedStepIds: state.completedStepIds,
    currentMessageIndexInStep: state.currentMessageIndexInStep,
    attemptByStepId: state.attemptByStepId,
    updatedAt: Date.now(),
  };
}

export function storyRuntimeReducer(
  state: StoryRuntimeState,
  action: StoryRuntimeAction
): StoryRuntimeState {
  switch (action.type) {
    case 'RESET_SESSION': {
      return createInitialStoryRuntimeState({
        courseId: action.payload.courseId,
        chapterIndex0: action.payload.chapterIndex0 ?? 0,
      });
    }

    case 'RESTORE_SNAPSHOT': {
      return {
        courseId: action.payload.courseId,
        chapterIndex0: action.payload.chapterIndex0,
        stepIndex0: action.payload.stepIndex0,
        phase: action.payload.phase,
        displayedMessages: action.payload.displayedMessages ?? [],
        completedStepIds: action.payload.completedStepIds ?? [],
        currentMessageIndexInStep: action.payload.currentMessageIndexInStep ?? 0,
        attemptByStepId: action.payload.attemptByStepId ?? {},
        currentLegacyAnswer: undefined,
        currentInputValue: undefined,
        currentReflectionValue: undefined,
        updatedAt: Date.now(),
      };
    }

    case 'SET_PHASE': {
      return {
        ...state,
        phase: action.payload.phase,
        updatedAt: Date.now(),
      };
    }

    case 'SET_CHAPTER': {
      return {
        ...state,
        chapterIndex0: action.payload.chapterIndex0,
        stepIndex0: action.payload.stepIndex0 ?? 0,
        currentMessageIndexInStep: action.payload.currentMessageIndexInStep ?? 0,
        completedStepIds: action.payload.clearCompletedStepIds ? [] : state.completedStepIds,
        currentLegacyAnswer: undefined,
        currentInputValue: undefined,
        currentReflectionValue: undefined,
        updatedAt: Date.now(),
      };
    }

    case 'SET_STEP': {
      return {
        ...state,
        stepIndex0: action.payload.stepIndex0,
        currentMessageIndexInStep: action.payload.currentMessageIndexInStep ?? 0,
        phase: action.payload.phase ?? state.phase,
        currentLegacyAnswer: undefined,
        currentInputValue: undefined,
        currentReflectionValue: undefined,
        updatedAt: Date.now(),
      };
    }

    case 'MARK_STEP_COMPLETED': {
      if (state.completedStepIds.includes(action.payload.stepId)) {
        return state;
      }

      return {
        ...state,
        completedStepIds: [...state.completedStepIds, action.payload.stepId],
        updatedAt: Date.now(),
      };
    }

    case 'SET_DISPLAYED_MESSAGES': {
      return {
        ...state,
        displayedMessages: action.payload.messages,
        updatedAt: Date.now(),
      };
    }

    case 'APPEND_DISPLAYED_MESSAGES': {
      return {
        ...state,
        displayedMessages: mergeUniqueById(
          state.displayedMessages,
          action.payload.messages
        ),
        updatedAt: Date.now(),
      };
    }

    case 'SET_CURRENT_MESSAGE_INDEX_IN_STEP': {
      return {
        ...state,
        currentMessageIndexInStep: action.payload.index,
        updatedAt: Date.now(),
      };
    }

    case 'SET_ATTEMPT_FOR_STEP': {
      return {
        ...state,
        attemptByStepId: {
          ...state.attemptByStepId,
          [action.payload.stepId]: action.payload.value,
        },
        updatedAt: Date.now(),
      };
    }

    case 'INC_ATTEMPT_FOR_STEP': {
      return {
        ...state,
        attemptByStepId: {
          ...state.attemptByStepId,
          [action.payload.stepId]:
            (state.attemptByStepId[action.payload.stepId] ?? 0) + 1,
        },
        updatedAt: Date.now(),
      };
    }

    case 'RESET_ATTEMPT_FOR_STEP': {
      if (!(action.payload.stepId in state.attemptByStepId)) {
        return state;
      }

      const next = { ...state.attemptByStepId };
      delete next[action.payload.stepId];

      return {
        ...state,
        attemptByStepId: next,
        updatedAt: Date.now(),
      };
    }

    case 'SET_LEGACY_ANSWER': {
      return {
        ...state,
        currentLegacyAnswer: action.payload.value,
        updatedAt: Date.now(),
      };
    }

    case 'SET_INPUT_VALUE': {
      return {
        ...state,
        currentInputValue: action.payload.value,
        updatedAt: Date.now(),
      };
    }

    case 'SET_REFLECTION_VALUE': {
      return {
        ...state,
        currentReflectionValue: action.payload.value,
        updatedAt: Date.now(),
      };
    }

    default:
      return state;
  }
}