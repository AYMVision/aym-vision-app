import type { Message } from '../../common/types';
import type { ThemeId } from '../../competencies/themeMeta';

export type StoryStepType =
  | 'story'
  | 'input'
  | 'item'
  | 'amy_feedback'
  | 'reflection'
  | 'amy_reaction'
  | 'challenge'
  | 'legacy_prompt'
  | 'legacy_reaction';

export type StoryStepBase = {
  id: string;
  type: StoryStepType;
  topicIds?: ThemeId[];
};

export type StoryMessageStep = StoryStepBase & {
  type: 'story';
  messages: Message[];
};

export type LegacyPromptStep = StoryStepBase & {
  type: 'legacy_prompt';
  questionMessage: Message;
  tipMessage?: Message;
};

export type LegacyReactionStep = StoryStepBase & {
  type: 'legacy_reaction';
  tipMessage?: Message;
};

export type InputMode = 'open_text' | 'single_choice';

export type InputChoice = {
  id: string;
  textKey: string;
};

export type InputStep = StoryStepBase & {
  type: 'input';
  promptKey: string;
  mode: InputMode;
  placeholderKey?: string;
  maxLength?: number;
  choices?: InputChoice[];
  profileEffect?: {
    type: 'set_profile_name';
  };
};

export type StoryDimension =
  | 'perspektivfaehigkeit'
  | 'urteilsvermoegen'
  | 'selbststeuerung'
  | 'verantwortung';

export type ItemOptionReaction =
  | {
      kind: 'static_text';
      textKey: string;
    }
  | {
      kind: 'segments';
      segments: {
        role: 'description' | 'consequence' | 'inner_effect' | 'impulse';
        textKey: string;
      }[];
    }
  | {
      kind: 'generated';
      reactionType: 'item_feedback';
    };

export type ItemOption = {
  id: string;
  textKey: string;
  score: 0 | 1 | 2 | 3;
  reaction?: ItemOptionReaction;
};

export type ItemStep = StoryStepBase & {
  type: 'item';
  promptKey: string;
  dimension: StoryDimension;
  indicatorId: string;
  options: [ItemOption, ItemOption, ItemOption, ItemOption];
};

export type AmyFeedbackStep = StoryStepBase & {
  type: 'amy_feedback';
  sourceStepId: string;
};

export type ReflectionMode = 'open_text' | 'single_choice';

export type ReflectionChoice = {
  id: string;
  textKey: string;
};

export type ReflectionKind =
  | 'FEELING'
  | 'ACTION'
  | 'PERSPECTIVE'
  | 'KNOWLEDGE'
  | 'CHALLENGE'
  | 'GENERAL';

export type ReflectionStep = StoryStepBase & {
  type: 'reflection';
  promptKey: string;
  mode: ReflectionMode;
  placeholderKey?: string;
  maxLength?: number;
  choices?: ReflectionChoice[];
  reflectionKind?: ReflectionKind;
  storeResponse: true;
};

export type AmyReactionStep = StoryStepBase & {
  type: 'amy_reaction';
  sourceStepId: string;
  reactionMode?: 'static' | 'generated';
  textKey?: string;
};

export type ChallengeStep = StoryStepBase & {
  type: 'challenge';
  promptKey: string;
  storeSeen?: boolean;
};

export type StoryStep =
  | StoryMessageStep
  | LegacyPromptStep
  | LegacyReactionStep
  | InputStep
  | ItemStep
  | AmyFeedbackStep
  | ReflectionStep
  | AmyReactionStep
  | ChallengeStep;

export type StoryChapterSteps = {
  chapterIndex0: number;
  steps: StoryStep[];
};