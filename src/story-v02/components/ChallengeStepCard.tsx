// src/story-v02/components/ChallengeStepCard.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { STORY_CHARACTERS as characters } from '../../content/characters';
import ChatMessage from '../../components/ChatMessage';
import { updateChallengeDecision } from '../runtime/storyResponseStore';
import { markBonusUnlocked } from '../../bonus/bonusSeen';

type Props = {
  challengeId: string;
  text: string;
  courseId: string;
  linkBonusId?: string;
  linkTo?: string;
  linkLabel?: string;
  linkContent?: string;
  onOpenBonusLink?: (payload: { linkTo: string; bonusId?: string }) => void;
};

export default function ChallengeStepCard({
  challengeId,
  text,
  courseId,
  linkBonusId,
  linkTo,
  linkLabel,
  linkContent,
  onOpenBonusLink,
}: Props) {
  const { t } = useTranslation('stories');
  const navigate = useNavigate();
  const [reaction, setReaction] = useState<'accept' | 'skip' | null>(null);

  function handleDecision(decision: 'accepted' | 'deferred') {
    setReaction(decision === 'accepted' ? 'accept' : 'skip');
    updateChallengeDecision(challengeId, courseId, decision);
  }

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
              onClick={() => handleDecision('deferred')}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t('challenge.skip', { defaultValue: 'Vielleicht später' })}
            </button>
            <button
              type="button"
              onClick={() => handleDecision('accepted')}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              {t('challenge.accept', { defaultValue: '🌱 Ich probiere es!' })}
            </button>
          </div>
        ) : reaction === 'accept' ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-800">
            {t('challenge.reactionAccept', { defaultValue: '🌱 Super! Du findest sie jederzeit in deinem Profil.' })}
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">
            {t('challenge.reactionSkip', { defaultValue: '😊 Kein Problem! Du findest sie in deinem Profil, wenn du Lust bekommst.' })}
          </div>
        )}

        {/* Bonus-Link */}
        {linkTo && (
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (onOpenBonusLink) {
                  onOpenBonusLink({ linkTo, bonusId: linkBonusId });
                } else {
                  if (linkBonusId) markBonusUnlocked(linkBonusId);
                  navigate(linkTo);
                }
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-50 active:scale-95 transition-transform"
            >
              {linkContent && <span className="text-slate-500 font-semibold">{linkContent}</span>}
              {linkContent && <span className="text-slate-300 mx-1">·</span>}
              {linkLabel ?? 'Öffnen →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
