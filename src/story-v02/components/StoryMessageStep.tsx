// src/story-v02/components/StoryMessageStep.tsx

import React from 'react';
import type { StoryMessageStep as StoryMessageStepType } from '../types/storyTypes';
import ChatMessage from '../../components/ChatMessage';

type Props = {
  step: StoryMessageStepType;
  onOpenBonusLink?: (payload: { linkTo: string; bonusId?: string }) => void;
};

export default function StoryMessageStep({ step, onOpenBonusLink }: Props) {
  return (
    <>
      {step.messages.map((message, index) => {
        const key = message.id ?? `${step.id}-msg-${index}`;

        return (
          <div key={key} data-story-message-id={message.id ?? key}>
            <ChatMessage
              message={message}
              onOpenBonusLink={onOpenBonusLink}
            />
          </div>
        );
      })}
    </>
  );
}