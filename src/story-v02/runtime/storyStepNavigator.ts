// src/story-v02/runtime/storyStepNavigator.ts

import type {
  AmyFeedbackStep,
  AmyReactionStep,
  ChallengeStep,
  InputStep,
  ItemStep,
  ReflectionStep,
  StoryChapterV02,
  StoryMessageStep,
  StoryStep,
} from '../types/storyTypes';
import type { StoryRuntimePhase } from '../types/storyRuntimeTypes';

export function getStepAt(
  chapter: StoryChapterV02,
  stepIndex0: number
): StoryStep | null {
  return chapter.steps[stepIndex0] ?? null;
}

export function isStoryStep(step: StoryStep): step is StoryMessageStep {
  return step.type === 'story';
}

export function isInputStep(step: StoryStep): step is InputStep {
  return step.type === 'input';
}

export function isItemStep(step: StoryStep): step is ItemStep {
  return step.type === 'item';
}

export function isReflectionStep(step: StoryStep): step is ReflectionStep {
  return step.type === 'reflection';
}

export function isAmyFeedbackStep(step: StoryStep): step is AmyFeedbackStep {
  return step.type === 'amy_feedback';
}

export function isAmyReactionStep(step: StoryStep): step is AmyReactionStep {
  return step.type === 'amy_reaction';
}

export function isChallengeStep(step: StoryStep): step is ChallengeStep {
  return step.type === 'challenge';
}

export function getEntryPhaseForStep(step: StoryStep): StoryRuntimePhase {
  switch (step.type) {
    case 'story':
      return 'playing_story';
    case 'input':
      return 'awaiting_input';
    case 'item':
      return step.selectionMode === 'multiple'
        ? 'awaiting_item_multi_choice'
        : 'awaiting_item_choice';
    case 'amy_feedback':
      return 'showing_amy_feedback';
    case 'reflection':
      return 'awaiting_reflection';
    case 'amy_reaction':
      return 'showing_amy_reaction';
    case 'challenge':
      return 'showing_challenge';
    default:
      return 'playing_story';
  }
}

export function getNextStepIndex0(
  chapter: StoryChapterV02,
  currentStepIndex0: number
): number | null {
  const next = currentStepIndex0 + 1;
  return chapter.steps[next] ? next : null;
}

export function isLastStep(
  chapter: StoryChapterV02,
  stepIndex0: number
): boolean {
  return stepIndex0 >= chapter.steps.length - 1;
}