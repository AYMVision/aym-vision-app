// src/story-v02/components/MultiSelectItemCard.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ItemOption, ItemStep } from '../types/storyTypes';
import type { ItemScore } from '../types/measurementTypes';
import { STORY_CHARACTERS as characters } from '../../content/characters';
import ChatMessage from '../../components/ChatMessage';

type SubmitPayload = {
  selectedOptionIds: string[];
  selectedOptionTexts: string[];
  optionScores: Record<string, ItemScore>;
};

type Props = {
  step: ItemStep;
  onSubmit: (payload: SubmitPayload) => void;
};

function optionText(option: ItemOption, t: (key: string, opts?: any) => string): string {
  return option.text ?? t(option.textKey ?? '', { defaultValue: '' });
}

export default function MultiSelectItemCard({ step, onSubmit }: Props) {
  const { t } = useTranslation('stories');

  const minSel = step.minSelections ?? 1;
  const maxSel = step.maxSelections ?? step.options.length;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  function toggle(id: string) {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size < maxSel) {
          next.add(id);
        }
      }
      return next;
    });
  }

  function handleSubmit() {
    if (selected.size < minSel) return;
    setSubmitted(true);
  }

  function handleContinue() {
    const selectedOptionIds = [...selected];
    const selectedOptionTexts = selectedOptionIds.map((id) => {
      const opt = step.options.find((o) => o.id === id);
      return opt ? optionText(opt, t) : id;
    });
    const optionScores: Record<string, ItemScore> = {};
    step.options.forEach((opt) => {
      optionScores[opt.id] = opt.score;
    });

    onSubmit({ selectedOptionIds, selectedOptionTexts, optionScores });
  }

  const prompt = step.prompt ?? t(step.promptKey ?? '', { defaultValue: '' });
  const helper = step.helperText ?? t('item.multiHint', { defaultValue: 'Du kannst mehrere Antwortoptionen auswählen.' });
  const canSubmit = selected.size >= minSel;

  return (
    <div className="w-full">
      <ChatMessage
        message={{
          id: `${step.id}-prompt`,
          type: 'main',
          speaker: characters.amy,
          content: prompt,
          timestamp: '',
        }}
      />

      <div className="mx-auto my-3 max-w-[560px] rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-700">
          <span aria-hidden>ℹ️</span>
          {helper}
        </div>

        <div className="flex flex-col gap-2">
          {step.options.map((option) => {
            const isSelected = selected.has(option.id);
            const isCorrect = option.score > 0;

            let itemCls =
              'flex items-start gap-3 rounded-xl border px-3 py-3 text-left text-sm text-slate-900 transition-colors cursor-pointer select-none';

            if (!submitted) {
              itemCls += isSelected
                ? ' border-rose-400 bg-rose-100'
                : ' border-rose-200 bg-white hover:bg-rose-50';
            } else if (isSelected) {
              itemCls += isCorrect
                ? ' border-emerald-400 bg-emerald-50'
                : ' border-red-300 bg-red-50';
            } else {
              itemCls += ' border-rose-100 bg-white opacity-60';
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggle(option.id)}
                className={itemCls}
                aria-pressed={isSelected}
              >
                {/* Checkbox indicator */}
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors"
                  style={{
                    borderColor: submitted
                      ? isSelected
                        ? isCorrect ? '#10b981' : '#ef4444'
                        : '#e2e8f0'
                      : isSelected ? '#e11d48' : '#fda4af',
                    background: isSelected
                      ? submitted
                        ? isCorrect ? '#d1fae5' : '#fee2e2'
                        : '#fda4af'
                      : 'white',
                  }}
                >
                  {isSelected && !submitted && (
                    <svg className="h-3 w-3 text-rose-700" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                  )}
                  {isSelected && submitted && isCorrect && (
                    <svg className="h-3 w-3 text-emerald-700" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                  )}
                  {isSelected && submitted && !isCorrect && (
                    <svg className="h-3 w-3 text-red-600" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                  )}
                </span>

                <span className="flex-1">{optionText(option, t)}</span>

                {submitted && isSelected && (
                  <span className={`ml-1 flex-shrink-0 text-xs font-semibold ${isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                    {isCorrect ? 'Richtig' : 'Nicht ganz'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <div className="mt-3 flex items-center justify-between">
            {maxSel > 1 && (
              <span className="text-xs text-slate-400">
                {selected.size} von max. {maxSel} ausgewählt
              </span>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="ml-auto rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Abschicken
            </button>
          </div>
        ) : (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
            >
              Weiter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
