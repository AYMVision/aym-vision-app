// src/story-v02/components/ItemStepCard.tsx

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ItemStep } from '../types/storyTypes';
import { STORY_CHARACTERS as characters } from '../../content/characters';
import ChatMessage from '../../components/ChatMessage';

type Props = {
  step: ItemStep;
  onSelect: (payload: {
    optionId: string;
    optionText: string;
    score: 0 | 1 | 2 | 3;
  }) => void;
};

export default function ItemStepCard({ step, onSelect }: Props) {
  const { t } = useTranslation('stories');

  const shuffledOptions = useMemo(
    () => [...step.options].sort(() => Math.random() - 0.5),
    [step.id]
  );

  return (
    <div className="w-full">
      <ChatMessage
        message={{
          id: `${step.id}-prompt`,
          type: 'main',
          speaker: characters.amy,
          content: step.prompt ?? t(step.promptKey ?? '', { defaultValue: '' }),
          timestamp: '',
        }}
      />

      <div className="mx-auto my-3 max-w-[560px] rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
        <div className="mb-3 text-xs text-slate-500 font-medium">
          {t('item.singleHint', { defaultValue: 'Wähle eine Antwort aus.' })}
        </div>
        <div className="flex flex-col gap-2">
          {shuffledOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                onSelect({
                  optionId: option.id,
                  optionText: option.text ?? t(option.textKey ?? '', { defaultValue: '' }),
                  score: option.score,
                })
              }
              className="rounded-xl border border-rose-200 bg-white px-3 py-3 text-left text-sm text-slate-900 hover:bg-rose-100"
            >
              {option.text ?? t(option.textKey ?? '', { defaultValue: '' })}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}