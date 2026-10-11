// src/story-v02/components/ChallengeStepCard.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { updateChallengeDecision } from '../runtime/storyResponseStore';
import { markBonusUnlocked } from '../../bonus/bonusSeen';
import { assetUrl } from '../../common/assetUrl';

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
      <div className="mx-auto my-3 max-w-[560px] rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">

        {/* Header: Amy + Challenge-Label */}
        <div className="flex items-center gap-2.5 bg-emerald-600 px-4 py-2.5">
          <img
            src={assetUrl('media/story/characters/amy-256.webp')}
            alt="Amy"
            className="w-7 h-7 rounded-full object-cover border-2 border-emerald-400 flex-shrink-0"
          />
          <span className="text-sm font-bold text-white">Amy</span>
          <span className="text-emerald-300 mx-0.5">·</span>
          <span className="text-sm font-semibold text-emerald-100">
            🎯 {t('challenge.label', { defaultValue: 'Challenge' })}
          </span>
        </div>

        {/* Body: Aufgabentext */}
        <div className="bg-emerald-50 px-4 py-4">
          <p className="text-base text-slate-800 leading-relaxed whitespace-pre-line">{text}</p>
        </div>

        {/* Footer: Frage + Buttons */}
        <div className="border-t border-emerald-200 bg-white px-4 py-3">
          <p className="text-sm font-semibold text-slate-600 mb-3">
            {t('challenge.question', { defaultValue: 'Nimmst du die Challenge an?' })}
          </p>

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
    </div>
  );
}
