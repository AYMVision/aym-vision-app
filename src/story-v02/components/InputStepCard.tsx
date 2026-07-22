// src/story-v02/components/InputStepCard.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { InputStep } from '../types/storyTypes';
import { STORY_CHARACTERS as characters } from '../../content/characters';
import ChatMessage from '../../components/ChatMessage';
import { detectContentFlags, isCriticalSafety } from '../../ai/core/contentFlags';
import { CRISIS_MESSAGE, CRISIS_AMY_REPLY } from '../../ai/core/safetyMessages';

type Props = {
  step: InputStep;
  onSubmit: (payload: { text?: string; choiceId?: string; choiceText?: string }) => void;
};

export default function InputStepCard({ step, onSubmit }: Props) {
  const { t } = useTranslation('stories');
  const [text, setText] = useState('');
  const [crisis, setCrisis] = useState(false);
  const [capturedText, setCapturedText] = useState('');

  const shouldShowPromptBubble = step.showPromptBubble !== false;

  const speaker =
    step.promptSpeakerId && characters[step.promptSpeakerId]
      ? characters[step.promptSpeakerId]
      : characters.yasmin;

  // Crisis state — zeigt Krisenhinweis, story geht erst nach Bestätigung weiter
  if (crisis) {
    return (
      <div className="w-full">
        {shouldShowPromptBubble && (
          <ChatMessage
            message={{
              id: `${step.id}-prompt`,
              type: speaker.id === 'amy' ? 'main' : 'other',
              speaker,
              content: step.prompt ?? t(step.promptKey ?? '', { defaultValue: '' }),
              timestamp: '',
            }}
          />
        )}
        {capturedText && (
          <ChatMessage
            message={{ id: `${step.id}-user-crisis`, type: 'user', content: capturedText, timestamp: '' }}
          />
        )}
        <ChatMessage
          message={{ id: `${step.id}-crisis-msg`, type: 'main', speaker: characters.amy, content: CRISIS_MESSAGE, timestamp: '' }}
        />
        <div className="mx-auto mt-2 mb-3 max-w-[560px] flex justify-end">
          <button
            type="button"
            onClick={() => onSubmit({ text: capturedText || undefined })}
            className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-600 active:scale-95 transition-transform"
          >
            Ich hab's gelesen →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {shouldShowPromptBubble ? (
        <ChatMessage
          message={{
            id: `${step.id}-prompt`,
            type: speaker.id === 'amy' ? 'main' : 'other',
            speaker,
            content: step.prompt ?? t(step.promptKey ?? '', { defaultValue: '' }),
            timestamp: '',
          }}
        />
      ) : null}

      <div className="mx-auto my-3 max-w-[560px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {step.mode === 'open_text' ? (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={step.maxLength ?? 220}
              placeholder={
                step.placeholderKey
                  ? t(step.placeholderKey, {
                      defaultValue:
                        step.id === 's1e01c01_input_chat_name' ? 'Dein Chatname' : 'Möchtest du etwas schreiben…',
                    })
                  : step.id === 's1e01c01_input_chat_name'
                  ? 'Dein Chatname'
                  : 'Möchtest du etwas schreiben…'
              }
              className="w-full min-h-[96px] rounded-xl border border-slate-200 px-3 py-2 text-base text-slate-900 outline-none focus:border-slate-400"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const trimmed = text.trim();

                  if (!trimmed && !step.emptySubmitsAllowed && step.required) return;

                  if (trimmed) {
                    const flags = detectContentFlags(trimmed);
                    if (isCriticalSafety(flags)) {
                      setCapturedText(trimmed);
                      setCrisis(true);
                      return;
                    }
                  }

                  onSubmit({ text: trimmed || undefined });
                }}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Weiter
              </button>
            </div>
          </>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {step.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() =>
                  onSubmit({
                    choiceId: choice.id,
                    choiceText: choice.text ?? t(choice.textKey ?? '', { defaultValue: '' }),
                  })
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left text-sm text-slate-900 hover:bg-slate-100"
              >
                {choice.text ?? t(choice.textKey ?? '', { defaultValue: '' })}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}