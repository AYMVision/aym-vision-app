// src/pages/SchoolSetupWizard.tsx
// Schul-Setup: Legal → Code → Zugang → Fertig

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { hasParentPasscode, setParentPasscode, setParentUnlockedForMinutes } from '../settings/parentLock';
import { isParentSetupDone, markParentSetupDone } from '../common/firstRun';
import { saveSettings } from '../settings/appSettings';
import { setConsent } from '../analytics/consent';
import { getActiveProfileId } from '../profile/profileStorage';
import { aymFetch } from '../identity/handshake';
import { parseVoucherInput } from '../shop/qrScanner';
import { loadIdentity } from '../identity/storage';
import { refreshOwnership } from '../shop/ownership';

type Step = 'legal' | 'code' | 'access' | 'done';

function CloseButton({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('adult');
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClose}
        aria-label={t('wizard.closeLabel')}
        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-lg"
      >
        ✕
      </button>
    </div>
  );
}

function activateEducationMode() {
  saveSettings({ educationMode: true, dailyLockEnabled: false, unlockPerWeek: 10 });
  setConsent(false);
}

function getStartStep(): Step {
  if (!isParentSetupDone()) return 'legal';
  if (!hasParentPasscode()) return 'code';
  return 'access';
}

export default function SchoolSetupWizard() {
  const { t } = useTranslation('adult');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillCode = searchParams.get('code') ?? '';

  const [step, setStep] = useState<Step>(getStartStep);
  const [legalChecked, setLegalChecked] = useState(false);

  const [codeInput, setCodeInput] = useState('');
  const [codeRepeat, setCodeRepeat] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeBusy, setCodeBusy] = useState(false);

  const [voucherInput, setVoucherInput] = useState(prefillCode);
  const [voucherError, setVoucherError] = useState('');
  const [voucherBusy, setVoucherBusy] = useState(false);
  const [voucherSuccess, setVoucherSuccess] = useState(false);

  const close = () => navigate(-1);

  function advanceToCode() {
    markParentSetupDone();
    setStep('code');
  }

  async function handleCodeSubmit() {
    setCodeError('');
    if (codeInput.length < 6) { setCodeError(t('parent.errorTooShort')); return; }
    if (codeInput !== codeRepeat) { setCodeError(t('parent.errorMismatch')); return; }
    setCodeBusy(true);
    try {
      const ok = await setParentPasscode(codeInput);
      if (!ok) { setCodeError(t('parent.errorTooShort')); return; }
      setParentUnlockedForMinutes(10);
      setStep('access');
    } finally {
      setCodeBusy(false);
    }
  }

  async function handleVoucherSubmit() {
    const id = parseVoucherInput(voucherInput);
    if (!id) { setVoucherError(t('wizard.access.errorInvalid')); return; }
    const profileId = getActiveProfileId();
    if (!profileId) { setVoucherError(t('wizard.access.errorNoProfile')); return; }
    setVoucherBusy(true);
    setVoucherError('');
    try {
      const { deriveBackendProfileId } = await import('../identity/keys');
      const currentIdentity = loadIdentity();
      if (!currentIdentity) { setVoucherError(t('wizard.access.errorNoProfile')); return; }
      const backendProfileId = deriveBackendProfileId(currentIdentity.mnemonic);
      const body = JSON.stringify({ voucherId: id, profileId: backendProfileId });
      const res = await aymFetch('/api/v1/extension/aym-vision/voucher/redeem', { method: 'POST', body });
      if (res.status === 409) { await refreshOwnership(); setVoucherSuccess(true); return; }
      if (res.status === 404) { setVoucherError(t('wizard.access.errorNotFound')); return; }
      if (!res.ok) { setVoucherError(t('wizard.access.errorGeneric')); return; }
      await refreshOwnership();
      setVoucherSuccess(true);
    } catch {
      setVoucherError(t('wizard.access.errorNetwork'));
    } finally {
      setVoucherBusy(false);
    }
  }

  // ── Legal ──────────────────────────────────────────────────────────────────
  if (step === 'legal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-white flex flex-col items-center justify-start px-4 py-10">
        <div className="w-full max-w-md space-y-6">
          <CloseButton onClose={close} />
          <div className="text-center">
            <div className="text-5xl mb-3">🏫</div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {t('schoolWizard.legal.title')}
            </h1>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {t('schoolWizard.legal.subtitle')}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">🔑</span>
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {t('schoolWizard.legal.step1Title')}
                </div>
                <div className="text-xs text-slate-500">
                  {t('schoolWizard.legal.step1Body')}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">🎟️</span>
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {t('schoolWizard.legal.step2Title')}
                </div>
                <div className="text-xs text-slate-500">
                  {t('schoolWizard.legal.step2Body')}
                </div>
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={legalChecked}
              onChange={e => setLegalChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-teal-600 shrink-0"
            />
            <span className="text-sm text-slate-700 leading-snug">
              {t('schoolWizard.legal.legalConfirm')}
            </span>
          </label>

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

  // ── Code ───────────────────────────────────────────────────────────────────
  if (step === 'code') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-white flex flex-col items-center justify-start px-4 py-10">
        <div className="w-full max-w-sm space-y-5">
          <CloseButton onClose={close} />
          <div className="text-center">
            <div className="text-4xl mb-2">🔑</div>
            <h1 className="text-2xl font-extrabold text-slate-900">{t('wizard.code.title')}</h1>
            <p className="mt-1 text-sm text-slate-500">{t('wizard.code.subtitle')}</p>
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

  // ── Zugang ─────────────────────────────────────────────────────────────────
  if (step === 'access') {
    if (voucherSuccess) {
      activateEducationMode();
      return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-white flex flex-col items-center justify-start px-4 py-10">
          <div className="w-full max-w-md space-y-5">
            <CloseButton onClose={close} />
            <div className="text-6xl text-center">🎉</div>
            <h2 className="text-2xl font-extrabold text-slate-900 text-center">{t('wizard.voucherSuccess.title')}</h2>
            <p className="text-sm text-slate-500 text-center">{t('wizard.voucherSuccess.subtitle')}</p>
            <button
              type="button"
              onClick={() => setStep('done')}
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
          <CloseButton onClose={close} />
          <div className="text-center">
            <div className="text-4xl mb-2">🎟️</div>
            <h1 className="text-2xl font-extrabold text-slate-900">{t('wizard.access.title')}</h1>
          </div>
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 space-y-3">
            <div className="text-sm font-semibold text-teal-900">{t('wizard.access.voucherLabel')}</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherInput}
                onChange={e => { setVoucherInput(e.target.value); setVoucherError(''); }}
                placeholder={t('wizard.access.voucherPlaceholder')}
                className="flex-1 border border-slate-300 rounded-xl px-3 py-2.5 text-[16px] font-mono focus:outline-none focus:ring-2 focus:ring-teal-300"
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
          <button
            type="button"
            onClick={() => { activateEducationMode(); setStep('done'); }}
            className="w-full py-2 text-sm text-slate-400 hover:text-slate-600"
          >
            {t('wizard.access.skip')}
          </button>
        </div>
      </div>
    );
  }

  // ── Done ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-white flex flex-col items-center justify-start px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center space-y-2">
          <div className="text-4xl">✅</div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t('schoolWizard.done.title')}</h1>
          <p className="text-sm text-slate-500 leading-relaxed">{t('schoolWizard.done.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/adult-settings')}
          className="w-full py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors"
        >
          Zum Verwaltungsbereich →
        </button>
        <button
          type="button"
          onClick={() => navigate('/stories')}
          className="w-full py-3 rounded-2xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
        >
          App starten →
        </button>
      </div>
    </div>
  );
}
