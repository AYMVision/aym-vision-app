// src/story-v02/components/StoryStepRenderer.tsx

import React from 'react';
import type { StoryStep } from '../types/storyTypes';
import StoryMessageStep from './StoryMessageStep';
import InputStepCard from './InputStepCard';
import ItemStepCard from './ItemStepCard';
import AmyFeedbackStepCard from './AmyFeedbackStepCard';
import ReflectionStepCard from './ReflectionStepCard';
import AmyReactionStepCard from './AmyReactionStepCard';
import ChallengeStepCard from './ChallengeStepCard';

type Props = {
  step: StoryStep;
  amyLines?: string[];
  onOpenBonusLink?: (payload: { linkTo: string; bonusId?: string }) => void;
  onSubmitInput?: (payload: { text?: string; choiceId?: string; choiceText?: string }) => void;
  onSelectItem?: (payload: { optionId: string; optionText: string; score: 0 | 1 | 2 | 3 }) => void;
  onSubmitReflection?: (payload: { text?: string; choiceId?: string; choiceText?: string }) => void;
};

export default function StoryStepRenderer({
  step,
  amyLines = [],
  onOpenBonusLink,
  onSubmitInput,
  onSelectItem,
  onSubmitReflection,
}: Props) {
  switch (step.type) {
    case 'story':
      return (
        <StoryMessageStep
          step={step}
          onOpenBonusLink={onOpenBonusLink}
        />
      );

    case 'input':
      return onSubmitInput ? (
        <InputStepCard step={step} onSubmit={onSubmitInput} />
      ) : null;

    case 'item':
      return onSelectItem ? (
        <ItemStepCard step={step} onSelect={onSelectItem} />
      ) : null;

    case 'amy_feedback':
      return <AmyFeedbackStepCard lines={amyLines} />;

    case 'reflection':
      return onSubmitReflection ? (
        <ReflectionStepCard step={step} onSubmit={onSubmitReflection} />
      ) : null;

    case 'amy_reaction':
      return <AmyReactionStepCard lines={amyLines} />;

    case 'challenge': {
      const challengeText = step.type === 'challenge'
        ? (step.prompt ?? '')
        : '';
      return <ChallengeStepCard challengeId={step.id} text={challengeText} />;
    }

    default:
      return null;
  }
}