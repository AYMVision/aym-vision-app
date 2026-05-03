// src/story-v02/components/ChallengeStepCard.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { STORY_CHARACTERS as characters } from '../../content/characters';
import ChatMessage from '../../components/ChatMessage';

type Props = {
  challengeId: string;
  text: string;
};

export default function ChallengeStepCard({ challengeId, text }: Props) {
  const { t } = useTranslation('stories');
  const [reaction, setReaction] = useState<'accept' | 'skip' | null>(null);

  return (
    <div className="w-full">
      <ChatMessage
        message={{
          id: `challenge-${challengeId}`,
          type: 'main',
          speaker: characters.amy,
          content: `🎯 Challenge\n\n${text}`,
          timestamp: '',
        }}
      />

      <div className="mx-auto mt-1 mb-3 max-w-[560px]">
        {reaction === null ? (
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setReaction('skip')}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t('challenge.skip', { defaultValue: 'Heute lieber nicht' })}
            </button>
            <button
              type="button"
              onClick={() => setReaction('accept')}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              {t('challenge.accept', { defaultValue: '🌱 Ich nehme sie an!' })}
            </button>
          </div>
        ) : reaction === 'accept' ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-800">
            {t('challenge.reactionAccept', { defaultValue: '🌱 Super! Viel Spaß dabei.' })}
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">
            {t('challenge.reactionSkip', { defaultValue: '😊 Kein Problem! Vielleicht ein anderes Mal.' })}
          </div>
        )}
      </div>
    </div>
  );
}
