// src/beta/BetaCompletionModal.tsx
// Shown after completing s1e01 as a beta tester.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { assetUrl } from '../common/assetUrl';
import { shareOrDownloadAnalytics } from '../analytics/analyticsExport';
import { markBetaCompletionShown } from './betaConfig';
import type { ProfileSnapshot } from '../analytics/analyticsExport';

const CONTACT_EMAIL = 'hello@amysurfwing.de';

interface Props {
  profileSnapshot: ProfileSnapshot;
}

export default function BetaCompletionModal({ profileSnapshot }: Props) {
  const { t } = useTranslation('stories');
  const navigate = useNavigate();
  const [sendState, setSendState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSend() {
    setSendState('loading');
    const result = await shareOrDownloadAnalytics(profileSnapshot);
    if (result === 'error') {
      setSendState('error');
    } else {
      setSendState('success');
    }
  }

  function handleDismiss() {
    markBetaCompletionShown();
    navigate('/stories', { replace: true });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-100 to-indigo-50 px-6 pt-7 pb-5 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-violet-200">
            <img
              src={assetUrl('media/story/characters/amy-256.webp')}
              alt="Amy"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="text-xs font-extrabold text-violet-500 uppercase tracking-widest">
            {t('beta.completion.kicker')}
          </div>
          <h2 className="text-base font-bold text-slate-900 leading-snug">
            {t('beta.completion.headline')}
          </h2>
        </div>

        {/* Send section */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <div className="font-semibold text-sm text-slate-900 mb-1">
              {t('beta.completion.sendTitle')}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('beta.completion.sendBody')}
            </p>
          </div>

          {sendState === 'idle' && (
            <button
              type="button"
              onClick={handleSend}
              className="w-full py-3 rounded-2xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-colors"
            >
              {t('beta.completion.sendCta')}
            </button>
          )}
          {sendState === 'loading' && (
            <div className="text-center text-sm text-slate-400 py-2">
              {t('beta.completion.sendPreparing')}
            </div>
          )}
          {sendState === 'success' && (
            <div className="flex flex-col gap-2">
              <div className="text-center text-sm text-emerald-600 font-semibold py-1">
                {t('beta.completion.sendSuccess')}
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Beta Feedback`}
                className="w-full py-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-700 text-center hover:bg-emerald-100 transition-colors"
              >
                📧 {CONTACT_EMAIL}
              </a>
            </div>
          )}
          {sendState === 'error' && (
            <div className="text-center text-sm text-red-500 py-2">
              {t('beta.completion.sendError')}
            </div>
          )}

          {/* s1e02 CTA */}
          <div className="border-t border-slate-100 pt-4">
            <div className="text-xs font-extrabold text-teal-600 uppercase tracking-widest mb-1">
              {t('beta.completion.s2Kicker')}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-2">
              {t('beta.completion.s2Text')}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Beta s1e02`}
              className="inline-flex items-center text-xs font-semibold text-teal-600 hover:underline"
            >
              {t('beta.completion.s2Cta')}
            </a>
          </div>

          {/* Dismiss */}
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {t('beta.completion.dismiss')}
          </button>
        </div>

      </div>
    </div>
  );
}
