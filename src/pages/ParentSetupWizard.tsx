// src/pages/ParentSetupWizard.tsx
// Eltern-Setup: Legal → Eltern-Code (Pflicht) → Zugang (optional) → Fertig

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { hasParentPasscode, setParentPasscode, setParentUnlockedForMinutes } from '../settings/parentLock';
import { isParentSetupDone, markParentSetupDone, shouldSkipOnboarding } from '../common/firstRun';
import { isSeasonOwnedLocally, refreshOwnership } from '../shop/ownership';
import { paymentLinkFor, computeProfileHash } from '../shop/stripe';
import { loadIdentity } from '../identity/storage';
import { useIdentity } from '../identity/useIdentity';
import { BackupPrompt } from '../identity/BackupPrompt';
import { getActiveProfileId } from '../profile/profileStorage';
import { aymFetch } from '../identity/handshake';
import { parseVoucherInput } from '../shop/qrScanner';

type Step = 'legal' | 'code' | 'access' | 'choice' | 'done';

function CloseButton({ onClose, label }: { onClose: () => void; label: string }) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClose}
        aria-label={label}
        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-lg"
      >
        ✕
      </button>
    </div>
  );
}

function getStartStep(): Step {
  if (!isParentSetupDone()) return 'legal';
  if (!hasParentPasscode()) return 'code';
  return 'done';
}

export default function ParentSetupWizard() {
  const { t } = useTranslation('adult');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const prefillCode = searchParams.get('code') ?? '';
  const isTommi = searchParams.get('context') === 'tommi';
  const { needsBackup } = useIdentity();

  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? null;
  function goToNext() {
    if (returnTo) {
      navigate(returnTo, { replace: true });
    } else {
      setStep('choice');
    }
  }

  const [step, setStep] = useState<Step>(getStartStep);
  const [legalChecked, setLegalChecked] = useState(isTommi);

  // Wenn bereits fertig eingerichtet (z.B. direkt per URL) → zu Eltern-Einstellungen
  useEffect(() => {
    if (step === 'done') navigate('/adult-settings', { replace: true });
  }, [step, navigate]);

  // Code-Step
  const [codeInput, setCodeInput] = useState('');
  const [codeRepeat, setCodeRepeat] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeBusy, setCodeBusy] = useState(false);

  // Zugang-Step
  const [voucherInput, setVoucherInput] = useState(prefillCode);
  const [voucherError, setVoucherError] = useState('');
  const [voucherBusy, setVoucherBusy] = useState(false);
  const [voucherSuccess, setVoucherSuccess] = useState(false);
  const [redeemedContentId, setRedeemedContentId] = useState<string | null>(null);
  const [showBackup, setShowBackup] = useState(false);

  function advanceToCode() {
    markParentSetupDone();
    setStep('code');
  }

  function advanceToAccess() {
    const pid = getActiveProfileId();
    if (pid && isSeasonOwnedLocally(pid, 's1')) {
      setStep('done');
    } else {
      setStep('access');
    }
  }

  async function handleCodeSubmit() {
    setCodeError('');
    if (codeInput.length < 6) {
      setCodeError(t('parent.errorTooShort'));
      return;
    }
    if (codeInput !== codeRepeat) {
      setCodeError(t('parent.errorMismatch'));
      return;
    }
    setCodeBusy(true);
    try {
      const ok = await setParentPasscode(codeInput);
      if (!ok) {
        setCodeError(t('parent.errorTooShort'));
        return;
      }
      setParentUnlockedForMinutes(10);
      advanceToAccess();
    } finally {
      setCodeBusy(false);
    }
  }

  async function handleVoucherSubmit() {
    const id = parseVoucherInput(voucherInput);
    if (!id) {
      setVoucherError(t('wizard.access.errorInvalid'));
      return;
    }
    const profileId = getActiveProfileId();
    if (!profileId) {
      setVoucherError(t('wizard.access.errorNoProfile'));
      return;
    }
    setVoucherBusy(true);
    setVoucherError('');
    try {
      const body = JSON.stringify({ voucherId: id, profileId });
      const res = await aymFetch('/api/v1/aym/voucher/redeem', {
        method: 'POST',
        body,
      });
      if (res.status === 409) {
        await refreshOwnership(profileId);
        setVoucherSuccess(true);
        return;
      }
      if (res.status === 404) {
        setVoucherError(t('wizard.access.errorNotFound'));
        return;
      }
      if (!res.ok) {
        setVoucherError(t('wizard.access.errorGeneric'));
        return;
      }
      const data = await res.json() as { contentId: string };
      setRedeemedContentId(data.contentId ?? null);
      await refreshOwnership(profileId);
      setVoucherSuccess(true);
    } catch {
      setVoucherError(t('wizard.access.errorNetwork'));
    } finally {
      setVoucherBusy(false);
    }
  }

  const close = () => navigate(-1);

  // ── Step: Legal ──────────────────────────────────────────────────────────
  if (step === 'legal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-white flex flex-col items-center justify-start px-4 py-10">
        <div className="w-full max-w-md space-y-6">
          <CloseButton onClose={close} label={t('wizard.closeLabel')} />
          <div className="text-center">
            <div className="text-5xl mb-3">🦉</div>
            <h1 className="text-2xl font-extrabold text-slate-900">{t('wizard.legal.title')}</h1>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {t('wizard.legal.subtitle')}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">🔑</span>
              <div>
                <div className="text-sm font-semibold text-slate-900">{t('wizard.legal.step1Title')}</div>
                <div className="text-xs text-slate-500">{t('wizard.legal.step1Body')}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">🎟️</span>
              <div>
                <div className="text-sm font-semibold text-slate-900">{t('wizard.legal.step2Title')}</div>
                <div className="text-xs text-slate-500">{t('wizard.legal.step2Body')}</div>
              </div>
            </div>
          </div>

          <label className={`flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 ${isTommi ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}>
            <input
              type="checkbox"
              checked={legalChecked}
              onChange={isTommi ? undefined : e => setLegalChecked(e.target.checked)}
              disabled={isTommi}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-teal-600 shrink-0"
            />
            <span className="text-sm text-slate-700 leading-snug">
              {t('parent.legalConfirm')}
            </span>
          </label>

          {isTommi && (
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <p className="text-sm text-violet-800 leading-relaxed">
                ℹ️ {t('wizard.legal.tommiNote')}
              </p>
            </div>
          )}

          <button
            type="button"
            disabled={!legalChecked}
            onClick={advanceToCode}
            className="w-full py-3 rounded-2xl bg-teal-600 text-white font-extrabold text-sm hover:bg-teal-700 disabled:opacity-40 transition-colors"
          >
            {t('wizard.next')}
          </button>

        </div>
      </div>
    );
  }

  // ── Step: Eltern-Code ────────────────────────────────────────────────────
  if (step === 'code') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-white flex flex-col items-center justify-start px-4 py-10">
        <div className="w-full max-w-sm space-y-5">
          <CloseButton onClose={close} label={t('wizard.closeLabel')} />
          <div className="text-center">
            <div className="text-4xl mb-2">🔑</div>
            <h1 className="text-2xl font-extrabold text-slate-900">{t('wizard.code.title')}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {t('wizard.code.subtitle')}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('parent.passLabel')}</label>
              <input
                type="password"
                value={codeInput}
                onChange={e => { setCodeInput(e.target.value); setCodeError(''); }}
                placeholder={t('parent.passPlaceholder')}
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-teal-300"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('parent.passLabel2')}</label>
              <input
                type="password"
                value={codeRepeat}
                onChange={e => { setCodeRepeat(e.target.value); setCodeError(''); }}
                placeholder={t('parent.passPlaceholder2')}
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-teal-300"
                autoComplete="new-password"
                onKeyDown={e => { if (e.key === 'Enter') handleCodeSubmit(); }}
              />
            </div>
            {codeError && <p className="text-sm text-red-600">{codeError}</p>}
          </div>

          <button
            type="button"
            disabled={!codeInput || !codeRepeat || codeBusy}
            onClick={handleCodeSubmit}
            className="w-full py-3 rounded-2xl bg-teal-600 text-white font-extrabold text-sm hover:bg-teal-700 disabled:opacity-40 transition-colors"
          >
            {codeBusy ? '…' : t('wizard.next')}
          </button>
        </div>
      </div>
    );
  }

  // ── Step: Zugang ─────────────────────────────────────────────────────────
  if (step === 'access') {
    if (voucherSuccess) {
      if (showBackup) {
        return (
          <BackupPrompt
            onDone={() => goToNext()}
            onCancel={() => goToNext()}
          />
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-white flex flex-col items-center justify-start px-4 py-10">
          <div className="w-full max-w-md space-y-5">
            <CloseButton onClose={close} label={t('wizard.closeLabel')} />
            <div className="text-6xl text-center">🎉</div>
            <h2 className="text-2xl font-extrabold text-slate-900 text-center">{t('wizard.voucherSuccess.title')}</h2>
            <p className="text-sm text-slate-500 text-center">{t('wizard.voucherSuccess.subtitle')}</p>
            <button
              type="button"
              onClick={() => {
                if (needsBackup && redeemedContentId !== 's1-full') {
                  setShowBackup(true);
                } else {
                  goToNext();
                }
              }}
              className="w-full py-3 rounded-2xl bg-teal-600 text-white font-extrabold text-sm hover:bg-teal-700 transition-colors"
            >
              {t('wizard.next')}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-white flex flex-col items-center justify-start px-4 py-10">
        <div className="w-full max-w-md space-y-5">
          <CloseButton onClose={close} label={t('wizard.closeLabel')} />
          <div className="text-center">
            <div className="text-4xl mb-2">🎟️</div>
            <h1 className="text-2xl font-extrabold text-slate-900">{t('wizard.access.title')}</h1>
          </div>

          {/* Gutschein */}
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 space-y-3">
            <div className="text-sm font-semibold text-teal-900">{t('wizard.access.voucherLabel')}</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherInput}
                onChange={e => { setVoucherInput(e.target.value); setVoucherError(''); }}
                placeholder={t('wizard.access.voucherPlaceholder')}
                className="flex-1 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-300"
                autoCapitalize="characters"
              />
              <button
                type="button"
                onClick={handleVoucherSubmit}
                disabled={!voucherInput.trim() || voucherBusy}
                className="shrink-0 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-teal-700 disabled:opacity-40 transition-colors"
              >
                {voucherBusy ? '…' : t('wizard.access.redeem')}
              </button>
            </div>
            {voucherError && <p className="text-xs text-red-600">{voucherError}</p>}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-semibold">{t('wizard.access.divider')}</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>



          {/* Kaufen */}
          <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-4 ${isTommi ? 'opacity-40 pointer-events-none' : ''}`}>
            <div>
              <div className="text-lg font-extrabold text-slate-900">{t('wizard.access.price')}</div>
              <div className="text-xs text-slate-400">{t('wizard.access.priceNote')}</div>
            </div>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>{t('wizard.access.feature1')}</li>
              <li>{t('wizard.access.feature2')}</li>
              <li>{t('wizard.access.feature3')}</li>
              <li>{t('wizard.access.feature4')}</li>
            </ul>
            <button
              type="button"
              onClick={() => {
                const identity = loadIdentity();
                const profileId = getActiveProfileId();
                if (!identity || !profileId) return;
                try {
                  const hash = computeProfileHash(identity.publicKeyHex, profileId);
                  const link = paymentLinkFor('s1', hash);
                  window.open(link, '_blank', 'noopener,noreferrer');
                } catch {
                  // no payment link configured
                }
              }}
              className="w-full py-3 rounded-2xl bg-teal-700 text-white font-extrabold text-sm hover:bg-teal-800 transition-colors"
            >
              {t('wizard.access.buyNow')}
            </button>
          </div>

          <button
            type="button"
            onClick={() => goToNext()}
            className="w-full py-2 text-sm text-slate-400 hover:text-slate-600"
          >
            {t('wizard.access.skip')}
          </button>
        </div>
      </div>
    );
  }

  // ── Step: Choice ─────────────────────────────────────────────────────────
  if (step === 'choice') {
    const childStarted = shouldSkipOnboarding();
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-white flex flex-col items-center justify-start px-4 py-10">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center space-y-2">
            <div className="text-4xl">✅</div>
            <h1 className="text-2xl font-extrabold text-slate-900">{t('wizard.choice.title')}</h1>
            <p className="text-sm text-slate-500">{t('wizard.choice.subtitle')}</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/adult-settings')}
            className="w-full py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors text-left px-5"
          >
            <div className="font-extrabold">{t('wizard.choice.parentArea')}</div>
            <div className="text-xs text-slate-400 mt-0.5">{t('wizard.choice.parentAreaSub')}</div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/start')}
            className="w-full py-3 rounded-2xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors text-left px-5"
          >
            <div className="font-extrabold">{t('wizard.choice.onboarding')}</div>
            <div className="text-xs text-teal-100 mt-0.5">{t('wizard.choice.onboardingSub')}</div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/stories')}
            className="w-full py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors text-left px-5"
          >
            <div className="font-extrabold">
              {childStarted ? t('wizard.choice.continue') : t('wizard.choice.stories')}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {childStarted ? t('wizard.choice.continueSub') : t('wizard.choice.storiesSub')}
            </div>
          </button>
        </div>
      </div>
    );
  }

  // ── Step: Done → useEffect leitet direkt zu /adult-settings weiter
  return null;
}
