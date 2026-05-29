// src/beta/BetaWelcomeScreen.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { assetUrl } from '../common/assetUrl';
import { setConsent } from '../analytics/consent';
import { setBetaCodeApplied, clearPendingBetaCode } from './betaConfig';
import { applyUnlockCode } from '../gating/unlockCodes';

interface Props {
  code: string;
}

export default function BetaWelcomeScreen({ code }: Props) {
  const { t } = useTranslation('stories');
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  function handleStart() {
    if (!agreed) return;
    applyUnlockCode(code);
    setConsent(true);
    setBetaCodeApplied(code);
    clearPendingBetaCode();
    navigate('/stories-v02/s1e01/s1e01c01', { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-slate-100 flex items-center justify-center px-5">
      <div className="max-w-sm w-full flex flex-col items-center gap-6 py-12">

        {/* Amy image */}
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-violet-200 shadow-lg">
          <img
            src={assetUrl('media/story/characters/amy-256.webp')}
            alt="Amy"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Text */}
        <div className="text-center">
          <div className="text-xs font-extrabold text-violet-500 uppercase tracking-widest mb-2">
            {t('beta.welcome.kicker')}
          </div>
          <h1 className="text-xl font-bold text-slate-900 leading-snug mb-3">
            {t('beta.welcome.headline')}
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            {t('beta.welcome.subline')}
          </p>
        </div>

        {/* Consent */}
        <label className="flex items-start gap-3 bg-white rounded-2xl border border-slate-200 p-4 cursor-pointer shadow-sm">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-violet-600 flex-shrink-0"
          />
          <span className="text-xs text-slate-600 leading-relaxed">
            {t('beta.welcome.consentLabel')}
          </span>
        </label>

        {/* CTA */}
        <button
          type="button"
          onClick={handleStart}
          disabled={!agreed}
          className={[
            'w-full py-3.5 rounded-2xl font-bold text-sm transition-all',
            agreed
              ? 'bg-violet-600 text-white shadow-md hover:bg-violet-700 active:scale-[0.98]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed',
          ].join(' ')}
        >
          {t('beta.welcome.cta')}
        </button>

      </div>
    </div>
  );
}
