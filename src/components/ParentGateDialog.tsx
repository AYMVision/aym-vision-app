// src/components/ParentGateDialog.tsx
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  hasParentPasscode,
  isParentUnlocked,
  MASTER_RESET_CODE,
  resetParentPasscode,
  setParentPasscode,
  setParentUnlockedForMinutes,
  verifyParentPasscode,
} from '../settings/parentLock';

const FAILED_ATTEMPTS_BEFORE_HINT = 3;

type Props = {
  open: boolean;
  onClose: () => void;
  onUnlocked: () => void;
};

export default function ParentGateDialog({ open, onClose, onUnlocked }: Props) {
  const { t } = useTranslation('adult');

  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const [showReset, setShowReset] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [resetErr, setResetErr] = useState<string | null>(null);

  const hasPass = hasParentPasscode();

  const title = useMemo(() => {
    return hasPass ? t('parent.titleUnlock') : t('parent.titleSetup');
  }, [hasPass, t]);

  if (!open) return null;

  const close = () => {
    setPass('');
    setPass2('');
    setErr(null);
    setBusy(false);
    setFailedAttempts(0);
    setShowReset(false);
    setResetCode('');
    setResetErr(null);
    onClose();
  };

  const doUnlock = async () => {
    setErr(null);
    setBusy(true);
    try {
      if (isParentUnlocked()) {
        onUnlocked();
        close();
        return;
      }

      if (!hasPass) {
        if (pass !== pass2) {
          setErr(t('parent.errorMismatch'));
          return;
        }
        const ok = await setParentPasscode(pass);
        if (!ok) {
          setErr(t('parent.errorTooShort'));
          return;
        }
        setParentUnlockedForMinutes(10);
        onUnlocked();
        close();
        return;
      }

      const ok = await verifyParentPasscode(pass);
      if (!ok) {
        setFailedAttempts((prev) => prev + 1);
        setErr(t('parent.errorWrong'));
        return;
      }
      setParentUnlockedForMinutes(10);
      onUnlocked();
      close();
    } finally {
      setBusy(false);
    }
  };

  const doReset = () => {
    setResetErr(null);
    if (resetCode.trim() === MASTER_RESET_CODE) {
      resetParentPasscode();
      close();
    } else {
      setResetErr(t('parent.resetError'));
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-4 shadow-xl">

        {!showReset ? (
          <>
            <div className="text-lg font-semibold">{title}</div>
            <div className="mt-2 text-sm text-slate-600">
              {hasPass ? t('parent.bodyUnlock') : t('parent.bodySetup')}
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-xs text-slate-500">{t('parent.passLabel')}</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-[16px]"
                placeholder={t('parent.passPlaceholder')}
              />

              {!hasPass && (
                <>
                  <label className="text-xs text-slate-500">{t('parent.passLabel2')}</label>
                  <input
                    type="password"
                    value={pass2}
                    onChange={(e) => setPass2(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-[16px]"
                    placeholder={t('parent.passPlaceholder2')}
                  />
                </>
              )}

              {err && <div className="text-sm text-red-600">{err}</div>}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
                onClick={close}
                disabled={busy}
              >
                {t('parent.cancel')}
              </button>
              <button
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-60"
                onClick={doUnlock}
                disabled={busy}
              >
                {hasPass ? t('parent.unlock') : t('parent.setup')}
              </button>
            </div>

            {hasPass && failedAttempts >= FAILED_ATTEMPTS_BEFORE_HINT && (
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  {t('parent.forgotLink')}
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-lg font-semibold">{t('parent.forgotLink')}</div>
            <p className="mt-2 text-sm text-slate-600">{t('parent.resetHint')}</p>

            <div className="mt-4 space-y-2">
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-[16px]"
                placeholder={t('parent.resetPlaceholder')}
                autoCapitalize="characters"
              />
              {resetErr && <div className="text-sm text-red-600">{resetErr}</div>}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
                onClick={() => { setShowReset(false); setResetCode(''); setResetErr(null); }}
              >
                {t('parent.resetCancel')}
              </button>
              <button
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
                onClick={doReset}
              >
                {t('parent.resetConfirm')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
