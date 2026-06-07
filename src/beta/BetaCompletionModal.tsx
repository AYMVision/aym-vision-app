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

type SendState = 'idle' | 'loading' | 'downloaded' | 'shared' | 'sent' | 'error';

export default function BetaCompletionModal({ profileSnapshot }: Props) {
  const { t } = useTranslation('stories');
  const navigate = useNavigate();
  const [sendState, setSendState] = useState<SendState>('idle');
  const [copied, setCopied] = useState(false);

  async function handleSend() {
    setSendState('loading');
    const result = await shareOrDownloadAnalytics(profileSnapshot);
    if (result === 'error') {
      setSendState('error');
    } else if (result === 'cancelled') {
      setSendState('idle');
    } else if (result === 'shared') {
      setSendState('shared');
    } else {
      setSendState('downloaded');
    }
  }

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: just open mailto
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

        <div className="px-6 py-5 flex flex-col gap-4">

          {/* ── Send section ── */}
          <div className="flex flex-col gap-3">
            <div>
              <div className="font-semibold text-sm text-slate-900 mb-1">
                {t('beta.completion.sendTitle')}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('beta.completion.sendBody')}
              </p>
            </div>

            {/* idle */}
            {sendState === 'idle' && (
              <button
                type="button"
                onClick={handleSend}
                className="w-full py-3 rounded-2xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-colors"
              >
                {t('beta.completion.sendCta')}
              </button>
            )}

            {/* loading */}
            {sendState === 'loading' && (
              <div className="text-center text-sm text-slate-400 py-2">
                {t('beta.completion.sendPreparing')}
              </div>
            )}

            {/* downloaded → show email to copy, then send manually */}
            {sendState === 'downloaded' && (
              <div className="flex flex-col gap-2">
                <div className="text-sm text-emerald-700 font-semibold">
                  {t('beta.completion.downloadedTitle')}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t('beta.completion.downloadedHint')}
                </p>
                {/* Copyable email address */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-full py-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-700 text-center hover:bg-emerald-100 transition-colors"
                >
                  {copied
                    ? t('beta.completion.emailCopied')
                    : `📧 ${CONTACT_EMAIL} — kopieren`}
                </button>
                <button
                  type="button"
                  onClick={() => setSendState('sent')}
                  className="text-xs text-slate-400 hover:text-slate-600 text-center py-1 transition-colors"
                >
                  {t('beta.completion.alreadySent')}
                </button>
              </div>
            )}

            {/* shared → done immediately */}
            {sendState === 'shared' && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-center">
                <div className="text-sm font-bold text-emerald-700">
                  {t('beta.completion.sharedSuccess')}
                </div>
              </div>
            )}

            {/* sent → thank you */}
            {sendState === 'sent' && (
              <div className="rounded-2xl bg-violet-50 border border-violet-200 px-4 py-3 text-center">
                <div className="text-sm font-bold text-violet-700">
                  {t('beta.completion.sentThanks')}
                </div>
              </div>
            )}

            {/* error */}
            {sendState === 'error' && (
              <div className="flex flex-col gap-2">
                <div className="text-center text-sm text-red-500">
                  {t('beta.completion.sendError')}
                </div>
                <button
                  type="button"
                  onClick={() => setSendState('idle')}
                  className="w-full py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {t('beta.completion.tryAgain')}
                </button>
              </div>
            )}
          </div>

          {/* ── s1e02 / Alarm im Klassenchat ── */}
          <div className="rounded-2xl bg-teal-50 border border-teal-200 px-4 py-4">
            <div className="text-xs font-extrabold text-teal-600 uppercase tracking-widest mb-1">
              {t('beta.completion.s2Kicker')}
            </div>
            <p className="text-sm font-semibold text-teal-900 leading-snug mb-1">
              {t('beta.completion.s2Title')}
            </p>
            <p className="text-xs text-teal-700 leading-relaxed mb-3">
              {t('beta.completion.s2Text')}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Alarm im Klassenchat – Zweite Welle`}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors"
            >
              ✉️ {t('beta.completion.s2Cta')}
            </a>
          </div>

          {/* ── Dismiss ── */}
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
