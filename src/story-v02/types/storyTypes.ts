// src/story-v02/types/storyTypes.ts

import type { Message } from '../../common/types';
import type { ThemeId } from '../../competencies/themeMeta';
import type { IndicatorId, ItemScore, StoryDimensionId } from './measurementTypes';

export type StoryStepType =
  | 'story'
  | 'input'
  | 'item'
  | 'amy_feedback'
  | 'reflection'
  | 'amy_reaction'
  | 'challenge';

export type ReflectionKind =
  | 'guided_choice'
  | 'open_text';

export type ReflectionCategory =
  | 'FEELING'
  | 'ACTION'
  | 'PERSPECTIVE'
  | 'KNOWLEDGE'
  | 'CHALLENGE'
  | 'GENERAL';

export type StoryStepBase = {
  id: string;
  type: StoryStepType;
  titleKey?: string;
  topicIds?: ThemeId[];
};

export type StoryMessageStep = StoryStepBase & {
  type: 'story';
  messages: Message[];
};

export type InputChoice = {
  id: string;
  text?: string;
  textKey?: string;
};

type InputStepBase = StoryStepBase & {
  type: 'input';
  prompt?: string;
  promptKey?: string;
  required?: boolean;
  emptySubmitsAllowed?: boolean;
  storeResponse: true;
  showPromptBubble?: boolean;
  promptSpeakerId?: string;
};

export type InputStep =
  | (InputStepBase & {
      mode: 'open_text';
      placeholderKey?: string;
      maxLength?: number;
    })
  | (InputStepBase & {
      mode: 'single_choice';
      choices: InputChoice[];
    });

export type ItemOptionReaction =
  | {
      kind: 'static_text';
      text?: string;
      textKey?: string;
    }
  | {
      kind: 'segments';
      segments: Array<{
        id: string;
        text?: string;
        textKey?: string;
      }>;
    };

export type ItemOption = {
  id: string;
  text?: string;
  textKey?: string;
  score: ItemScore;
  reaction?: ItemOptionReaction;
};

export type ItemStep = StoryStepBase & {
  type: 'item';
  prompt?: string;
  promptKey?: string;
  dimension: StoryDimensionId;
  indicatorId: IndicatorId;
  options: ItemOption[];
  /** 'single' (default) = one option, 'multiple' = multi-select unscored question */
  selectionMode?: 'single' | 'multiple';
  /** Multi-select: minimum number of selections required before submitting */
  minSelections?: number;
  /** Multi-select: maximum number of selections allowed */
  maxSelections?: number;
  /** Multi-select: helper text shown below the prompt (e.g. "Du kannst mehrere auswählen.") */
  helperText?: string;
};

export type AmyFeedbackStep = StoryStepBase & {
  type: 'amy_feedback';
  sourceStepId: string;
};

export type ReflectionChoiceReaction =
  | {
      kind: 'static_text';
      text?: string;
      textKey?: string;
    }
  | {
      kind: 'segments';
      segments: Array<{
        id: string;
        text?: string;
        textKey?: string;
      }>;
    };

export type ReflectionChoice = {
  id: string;
  text?: string;
  textKey?: string;
  reaction?: ReflectionChoiceReaction;
};

type ReflectionStepBase = StoryStepBase & {
  type: 'reflection';
  prompt?: string;
  promptKey?: string;
  reflectionCategory?: ReflectionCategory;
  storeResponse: true;
  useRunAmy?: boolean;
};

export type ReflectionStep =
  | (ReflectionStepBase & {
      reflectionKind: 'guided_choice';
      choices: ReflectionChoice[];
    })
  | (ReflectionStepBase & {
      reflectionKind: 'open_text';
      placeholderKey?: string;
      maxLength?: number;
      /** KI-Bewertung überspringen. Jede nicht-leere Antwort wird sofort akzeptiert. */
      bypassAi?: boolean;
      /** Amy-Antworttext, der beim AR-Step angezeigt wird wenn bypassAi: true */
      fixedAmyReply?: string;
      /** Amy-Antworttext bei trivialem/nichtssagendem Input (z.B. "nichts", "k.a.") — sanfter Nudge */
      fixedAmyReplyVague?: string;
    });

export type AmyReactionStep = StoryStepBase & {
  type: 'amy_reaction';
  sourceStepId: string;
  reactionMode?: 'static' | 'generated';
  textKey?: string;
};

export type ChallengeStep = StoryStepBase & {
  type: 'challenge';
  prompt?: string;
  promptKey?: string;
  storeSeen?: boolean;
  linkBonusId?: string;
  linkTo?: string;
  linkLabel?: string;
  linkContent?: string;
};

export type StoryStep =
  | StoryMessageStep
  | InputStep
  | ItemStep
  | AmyFeedbackStep
  | ReflectionStep
  | AmyReactionStep
  | ChallengeStep;

export type StoryChapterV02 = {
  id: string;
  chapterIndex0: number;
  chapterTitle?: string;
  chapterSubtitle?: string;
  isEpilogue?: boolean;  // true → kein Coin, aber Episode-Belohnungen laufen normal
  steps: StoryStep[];
};

export type StoryEpisodeV02 = {
  id: string;
  seasonId: string;
  episodeId: string;
  courseId: string;
  chapters: StoryChapterV02[];
};