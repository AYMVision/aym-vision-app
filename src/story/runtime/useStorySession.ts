import { useMemo, useReducer } from 'react';
import type { Message } from '../../common/types';
import type { Course } from '../../common/types';
import { adaptLegacyEpisodeToStepChapters } from '../engine/storyLegacyAdapter';
import {
  buildStoryRuntimeSnapshotV2,
  createInitialStoryRuntimeState,
  storyRuntimeReducer,
} from '../engine/storyRuntimeReducer';
import { getStepAt, getNextStepIndex, isLastStep } from '../engine/storyStepNavigator';
import { getInitialPhaseForStep } from '../engine/storyStepPhase';
import type { StoryRuntimePhase } from '../engine/storyRuntimeTypes';
import type { StoryStep } from '../engine/storyTypes';

export function useStorySession(args: {
  courseId: string;
  course: Pick<Course, 'script'> | null;
}) {
  const { courseId, course } = args;

  const chapters = useMemo(() => {
    if (!course) return [];
    return adaptLegacyEpisodeToStepChapters({
      courseId,
      script: course.script,
    });
  }, [course, courseId]);

  const [state, dispatch] = useReducer(
    storyRuntimeReducer,
    createInitialStoryRuntimeState({
      courseId,
      chapterIndex0: 0,
    })
  );

  const currentChapterSteps = chapters[state.chapterIndex0] ?? null;
  const currentStep = getStepAt(currentChapterSteps, state.stepIndex0);

  function resetSession(chapterIndex0 = 0) {
    dispatch({
      type: 'RESET_SESSION',
      payload: {
        courseId,
        chapterIndex0,
      },
    });
  }

  function restoreFromSnapshot(snapshot: ReturnType<typeof buildStoryRuntimeSnapshotV2>) {
    dispatch({
      type: 'RESTORE_SNAPSHOT',
      payload: snapshot,
    });
  }

  function setPhase(phase: StoryRuntimePhase) {
    dispatch({
      type: 'SET_PHASE',
      payload: { phase },
    });
  }

  function setChapter(chapterIndex0: number) {
    const nextChapter = chapters[chapterIndex0] ?? null;
    const firstStep = getStepAt(nextChapter, 0);

    dispatch({
      type: 'SET_CHAPTER',
      payload: {
        chapterIndex0,
        stepIndex0: 0,
        currentMessageIndexInStep: 0,
        clearCompletedStepIds: true,
      },
    });

    dispatch({
      type: 'SET_PHASE',
      payload: {
        phase: getInitialPhaseForStep(firstStep),
      },
    });
  }

  function setStep(stepIndex0: number, phase?: StoryRuntimePhase) {
    const step = getStepAt(currentChapterSteps, stepIndex0);

    dispatch({
      type: 'SET_STEP',
      payload: {
        stepIndex0,
        phase: phase ?? getInitialPhaseForStep(step),
        currentMessageIndexInStep: 0,
      },
    });
  }

  function markCurrentStepCompleted() {
    if (!currentStep) return;
    dispatch({
      type: 'MARK_STEP_COMPLETED',
      payload: {
        stepId: currentStep.id,
      },
    });
  }

  function setDisplayedMessages(messages: Message[]) {
    dispatch({
      type: 'SET_DISPLAYED_MESSAGES',
      payload: { messages },
    });
  }

  function appendDisplayedMessages(messages: Message[]) {
    dispatch({
      type: 'APPEND_DISPLAYED_MESSAGES',
      payload: { messages },
    });
  }

  function setCurrentMessageIndexInStep(index: number) {
    dispatch({
      type: 'SET_CURRENT_MESSAGE_INDEX_IN_STEP',
      payload: { index },
    });
  }

  function getAttemptForCurrentStep() {
    if (!currentStep) return 0;
    return state.attemptByStepId[currentStep.id] ?? 0;
  }

  function incAttemptForCurrentStep() {
    if (!currentStep) return;
    dispatch({
      type: 'INC_ATTEMPT_FOR_STEP',
      payload: {
        stepId: currentStep.id,
      },
    });
  }

  function resetAttemptForCurrentStep() {
    if (!currentStep) return;
    dispatch({
      type: 'RESET_ATTEMPT_FOR_STEP',
      payload: {
        stepId: currentStep.id,
      },
    });
  }

  function setLegacyAnswer(value?: string) {
    dispatch({
      type: 'SET_LEGACY_ANSWER',
      payload: { value },
    });
  }

  function setInputValue(value?: string) {
    dispatch({
      type: 'SET_INPUT_VALUE',
      payload: { value },
    });
  }

  function setReflectionValue(value?: string) {
    dispatch({
      type: 'SET_REFLECTION_VALUE',
      payload: { value },
    });
  }

  function advanceToNextStep(): boolean {
    if (!currentChapterSteps) return false;

    const nextStepIndex0 = getNextStepIndex(currentChapterSteps, state.stepIndex0);
    if (nextStepIndex0 == null) {
      return false;
    }

    const nextStep = getStepAt(currentChapterSteps, nextStepIndex0);

    dispatch({
      type: 'SET_STEP',
      payload: {
        stepIndex0: nextStepIndex0,
        phase: getInitialPhaseForStep(nextStep),
        currentMessageIndexInStep: 0,
      },
    });

    return true;
  }

  function isCurrentStepLast() {
    return isLastStep(currentChapterSteps, state.stepIndex0);
  }

  function buildSnapshot() {
    return buildStoryRuntimeSnapshotV2(state);
  }

  return {
    chapters,
    state,
    dispatch,

    currentChapterSteps,
    currentStep,

    resetSession,
    restoreFromSnapshot,
    setPhase,
    setChapter,
    setStep,

    markCurrentStepCompleted,
    setDisplayedMessages,
    appendDisplayedMessages,
    setCurrentMessageIndexInStep,

    getAttemptForCurrentStep,
    incAttemptForCurrentStep,
    resetAttemptForCurrentStep,

    setLegacyAnswer,
    setInputValue,
    setReflectionValue,

    advanceToNextStep,
    isCurrentStepLast,
    buildSnapshot,
  };
}

export type StorySessionApi = ReturnType<typeof useStorySession>;
export type CurrentStoryStep = StoryStep | null;