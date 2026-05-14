// src/story-v02/components/ReflectionStepCard.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReflectionStep } from '../types/storyTypes';
import { STORY_CHARACTERS as characters } from '../../content/characters';
import ChatMessage from '../../components/ChatMessage';
import { runAmy } from '../../ai/orchestrator/runAmy';
import { isCriticalSafety } from '../../ai/core/contentFlags';
import { isTrivialInput } from '../utils/isTrivialInput';
import { trackReflectionStep } from '../../analytics/analyticsEvents';

// ---------------------------------------------------------------------------
// Phase state machine
//
//  idle ──► loading ──► unlocked           (A / B)
//                   ──► retry              (C / UNSICHER / safety attempt 0–1)
//                   ──► support_required   (forcedUnlock + critical, OR forcedUnlock + C)
//
// support_required: AI check still runs on every Senden.
//   - pass (A/B, non-critical) → unlocked (amyReply cleared — no double display in amy_reaction)
//   - fail (C / critical)      → stay in support_required, NO new Amy hint shown
//
// The adult hint stays visible until a genuine answer unlocks progress.
// ---------------------------------------------------------------------------
type Phase = 'idle' | 'loading' | 'retry' | 'unlocked' | 'support_required';

type Props = {
  step: ReflectionStep;
  onSubmit: (payload: { text?: string; choiceId?: string; choiceText?: string; amyReply?: string }) => void;
};

export default function ReflectionStepCard({ step, onSubmit }: Props) {
  const { t, i18n } = useTranslation('stories');

  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [amyReply, setAmyReply] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastSubmitted, setLastSubmitted] = useState('');

  function handleBypassSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;

    // First trivial attempt: show a gentle nudge and reopen textarea
    if (isTrivialInput(trimmed) && attemptCount === 0) {
      const vagueReply =
        step.fixedAmyReplyVague ??
        'Magst du noch etwas mehr schreiben? Auch kurze Gedanken sind willkommen! 😊';
      setAmyReply(vagueReply);
      setAttemptCount(1);
      setText('');
      setPhase('retry');
      trackReflectionStep({ stepId: step.id, type: 'open_text', score: 'trivial', topicIds: step.topicIds, attemptCount: 1 });
      return;
    }

    setLastSubmitted(trimmed);
    setPhase('unlocked');
    trackReflectionStep({ stepId: step.id, type: 'open_text', score: 'bypass', topicIds: step.topicIds, attemptCount });
  }

  async function handleOpenTextSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Capture whether we're already past the limit before the phase changes to loading.
    const fromSupportRequired = phase === 'support_required';

    setPhase('loading');
    setLastSubmitted(trimmed);

    try {
      const result = await runAmy({
        userAnswer: trimmed,
        questionText: step.prompt ?? t(step.promptKey ?? '', { defaultValue: '' }),
        tipText: '',
        language: i18n.language,
        attemptCount,
        reflectionMode: true,
      });

      const critical = isCriticalSafety(result.contentFlags);
      const forcedUnlock = attemptCount >= 2;

      const nextAttempt = attemptCount + 1;

      if (fromSupportRequired) {
        if (!result.mustReAnswer && !critical) {
          setAmyReply('');
          setPhase('unlocked');
          trackReflectionStep({ stepId: step.id, type: 'open_text', score: result.label, topicIds: step.topicIds, attemptCount: nextAttempt });
        } else {
          setAttemptCount((c) => c + 1);
          setText('');
          setPhase('support_required');
          trackReflectionStep({ stepId: step.id, type: 'open_text', score: result.label, topicIds: step.topicIds, attemptCount: nextAttempt });
        }
      } else {
        // Normal path — update Amy's reply for display.
        setAmyReply(result.amyReplyText);

        if (!result.mustReAnswer || forcedUnlock) {
          if (critical && !forcedUnlock) {
            setAttemptCount((c) => c + 1);
            setText('');
            setPhase('retry');
            trackReflectionStep({ stepId: step.id, type: 'open_text', score: result.label, topicIds: step.topicIds, attemptCount: nextAttempt });
          } else if (critical && forcedUnlock) {
            setAttemptCount((c) => c + 1);
            setText('');
            setPhase('support_required');
            trackReflectionStep({ stepId: step.id, type: 'open_text', score: result.label, topicIds: step.topicIds, attemptCount: nextAttempt });
          } else if (forcedUnlock && result.mustReAnswer) {
            setAttemptCount((c) => c + 1);
            setText('');
            setPhase('support_required');
            trackReflectionStep({ stepId: step.id, type: 'open_text', score: result.label, topicIds: step.topicIds, attemptCount: nextAttempt });
          } else {
            setPhase('unlocked');
            trackReflectionStep({ stepId: step.id, type: 'open_text', score: result.label, topicIds: step.topicIds, attemptCount: nextAttempt });
          }
        } else {
          // C or UNSICHER (not yet forced unlock).
          setAttemptCount((c) => c + 1);
          setText('');
          setPhase('retry');
          trackReflectionStep({ stepId: step.id, type: 'open_text', score: result.label, topicIds: step.topicIds, attemptCount: nextAttempt });
        }
      }
    } catch {
      // Fallback: never block the story on unexpected errors.
      onSubmit({ text: trimmed });
    }
  }

  // ---------------------------------------------------------------------------
  // open_text
  // ---------------------------------------------------------------------------
  if (step.reflectionKind === 'open_text') {
    const promptText = step.prompt ?? t(step.promptKey ?? '', { defaultValue: '' });

    const showUserBubble = phase !== 'idle';
    // Amy's reply is shown inline only during retry/support_required (as guidance to improve).
    // In unlocked, it's forwarded to the amy_reaction step (same pattern as item/input cards).
    const showAmyReply = (phase === 'retry' || phase === 'support_required') && !!amyReply;
    const showTextarea = phase === 'idle' || phase === 'retry' || phase === 'support_required';

    return (
      <div className="w-full">
        {/* Amy's question */}
        <ChatMessage
          message={{
            id: `${step.id}-prompt`,
            type: 'main',
            speaker: characters.amy,
            content: promptText,
            timestamp: '',
          }}
        />

        {/* User's submitted answer */}
        {showUserBubble && lastSubmitted ? (
          <ChatMessage
            message={{
              id: `${step.id}-user-${attemptCount}`,
              type: 'user',
              content: lastSubmitted,
              timestamp: '',
            }}
          />
        ) : null}

        {/* Loading */}
        {phase === 'loading' ? (
          <div className="mx-auto my-2 max-w-[560px] flex justify-start px-2">
            <span className="text-sm text-slate-400 animate-pulse">
              {t('common.amyThinking', { defaultValue: 'Amy denkt nach…' })}
            </span>
          </div>
        ) : null}

        {/* Amy's reply — hint stays visible in support_required until answer passes */}
        {showAmyReply ? (
          <ChatMessage
            message={{
              id: `${step.id}-amy-reply-${attemptCount}`,
              type: 'main',
              speaker: characters.amy,
              content: amyReply,
              timestamp: '',
            }}
          />
        ) : null}

        {/* Textarea — visible during idle, retry and support_required */}
        {showTextarea ? (
          <div className="mx-auto my-3 max-w-[560px] rounded-2xl border border-violet-200 bg-violet-50 p-4 shadow-sm">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={step.maxLength ?? 220}
              placeholder={
                step.placeholderKey
                  ? t(step.placeholderKey, { defaultValue: 'Deine Antwort…' })
                  : 'Deine Antwort…'
              }
              className="w-full min-h-[110px] rounded-xl border border-violet-200 bg-white px-3 py-2 text-base text-slate-900 outline-none focus:border-violet-400"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={step.bypassAi ? handleBypassSubmit : handleOpenTextSubmit}
                disabled={phase === 'loading' || !text.trim()}
                className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-600 disabled:opacity-40"
              >
                {t('common.send', { defaultValue: 'Senden' })}
              </button>
            </div>
          </div>
        ) : null}

        {/* Continue — only after unlock */}
        {phase === 'unlocked' ? (
          <div className="mx-auto mt-1 mb-3 max-w-[560px] flex justify-end">
            <button
              type="button"
              onClick={() => onSubmit({
                text: lastSubmitted || undefined,
                amyReply: step.bypassAi
                  ? (step.fixedAmyReply || undefined)
                  : (amyReply || undefined),
              })}
              className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-600"
            >
              {t('common.continue', { defaultValue: 'Weiter' })}
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // guided_choice — no validation needed, choices are pre-defined
  // ---------------------------------------------------------------------------
  if (step.reflectionKind === 'guided_choice') {
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

        <div className="mx-auto my-3 max-w-[560px] rounded-2xl border border-violet-200 bg-violet-50 p-4 shadow-sm">
          <div className="flex flex-col gap-2">
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
                className="rounded-xl border border-violet-200 bg-white px-3 py-3 text-left text-sm text-slate-900 hover:bg-violet-100"
              >
                {choice.text ?? t(choice.textKey ?? '', { defaultValue: '' })}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
