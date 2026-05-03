import type { StoryChapterSteps, StoryStep } from './storyTypes';

export function getStepAt(
  chapterSteps: StoryChapterSteps | null | undefined,
  stepIndex0: number
): StoryStep | null {
  if (!chapterSteps) return null;
  if (stepIndex0 < 0) return null;
  return chapterSteps.steps[stepIndex0] ?? null;
}

export function getNextStepIndex(
  chapterSteps: StoryChapterSteps | null | undefined,
  currentStepIndex0: number
): number | null {
  if (!chapterSteps) return null;

  const next = currentStepIndex0 + 1;
  return next < chapterSteps.steps.length ? next : null;
}

export function isLastStep(
  chapterSteps: StoryChapterSteps | null | undefined,
  stepIndex0: number
): boolean {
  if (!chapterSteps) return true;
  return stepIndex0 >= chapterSteps.steps.length - 1;
}

export function getStepById(
  chapterSteps: StoryChapterSteps | null | undefined,
  stepId: string
): StoryStep | null {
  if (!chapterSteps) return null;
  return chapterSteps.steps.find((s) => s.id === stepId) ?? null;
}