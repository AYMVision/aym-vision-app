import type { Message } from '../../common/types';
import type { StoryChapterSteps, StoryStep } from './storyTypes';
import { getQuestionIndex, getTipIndex } from './storySelectors';

export function adaptLegacyChapterToSteps(args: {
  courseId: string;
  chapterIndex0: number;
  messages: Message[];
}): StoryChapterSteps {
  const { courseId, chapterIndex0, messages } = args;

  const qIdx = getQuestionIndex(messages);
  const tIdx = getTipIndex(messages);

  if (qIdx < 0) {
    return {
      chapterIndex0,
      steps: [
        {
          id: `${courseId}-c${String(chapterIndex0 + 1).padStart(2, '0')}-story-full`,
          type: 'story',
          messages,
        },
      ],
    };
  }

  const before = messages.slice(0, qIdx);
  const questionMessage = messages[qIdx];
  const tipMessage = tIdx >= 0 ? messages[tIdx] : undefined;

  const afterStart = tIdx >= 0 ? Math.max(qIdx + 1, tIdx + 1) : qIdx + 1;
  const after = messages.slice(afterStart);

  const steps: StoryStep[] = [];

  if (before.length > 0) {
    steps.push({
      id: `${courseId}-c${String(chapterIndex0 + 1).padStart(2, '0')}-story-before`,
      type: 'story',
      messages: before,
    });
  }

  steps.push({
    id: `${courseId}-c${String(chapterIndex0 + 1).padStart(2, '0')}-legacy-prompt`,
    type: 'legacy_prompt',
    questionMessage,
    tipMessage,
  });

  steps.push({
    id: `${courseId}-c${String(chapterIndex0 + 1).padStart(2, '0')}-legacy-reaction`,
    type: 'legacy_reaction',
  });

  if (after.length > 0) {
    steps.push({
      id: `${courseId}-c${String(chapterIndex0 + 1).padStart(2, '0')}-story-after`,
      type: 'story',
      messages: after,
    });
  }

  return {
    chapterIndex0,
    steps,
  };
}

export function adaptLegacyEpisodeToStepChapters(args: {
  courseId: string;
  script: Array<{ messages: Message[] }>;
}): StoryChapterSteps[] {
  const { courseId, script } = args;

  return script.map((chapter, chapterIndex0) =>
    adaptLegacyChapterToSteps({
      courseId,
      chapterIndex0,
      messages: chapter.messages ?? [],
    })
  );
}