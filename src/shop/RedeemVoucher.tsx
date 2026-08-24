import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { aymFetch } from '../identity/handshake';
import { getActiveProfileId, setActiveProfileId } from '../profile/profileStorage';
import { loadProfilesIndex, createProfile } from '../profile/profileIndex';
import { ensureIdentity } from '../identity/storage';
import { refreshOwnership } from './ownership';
import { useIdentity } from '../identity/useIdentity';
import { BackupPrompt } from '../identity/BackupPrompt';
import { parseVoucherInput, scanFromVideo } from './qrScanner';
import { isParentUnlocked } from '../settings/parentLock';
import ParentGateDialog from '../components/ParentGateDialog';

type RedeemResponse = {
  contentId: string;
  ownedContent: string[];
};

type Screen =
  | { kind: 'input' }
  | { kind: 'confirming'; voucherId: string }
  | { kind: 'loading' }
  | { kind: 'success'; contentId: string }
  | { kind: 'alreadyOwned' }
  | { kind: 'notFound' }
  | { kind: 'error'; message?: string }
  | { kind: 'backup' };

export default function RedeemVoucher() {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();
  const { needsBackup } = useIdentity();

  const [parentGateOpen, setParentGateOpen] = useState(!isParentUnlocked());
  const [screen, setScreen] = useState<Screen>({ kind: 'input' });

  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [scanning, setScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanning(true);

      scanIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        const result = await scanFromVideo(videoRef.current);
        if ('voucherId' in result) {
          stopCamera();
          setScreen({ kind: 'confirming', voucherId: result.voucherId });
        }
      }, 800);
    } catch {
      setInputError('Kamera nicht verfügbar – bitte Code manuell eingeben.');
    }
  }

  function handleManualSubmit() {
    const id = parseVoucherInput(inputValue);
    if (!id) {
      setInputError(t('identity.voucher.invalidCode'));
      return;
    }
    setInputError('');
    setScreen({ kind: 'confirming', voucherId: id });
  }

  async function handleConfirm(voucherId: string) {
    setScreen({ kind: 'loading' });

    // Identität (Schlüsselpaar) automatisch erstellen falls noch nicht vorhanden
    await ensureIdentity();

    // Aktives Profil sicherstellen — erstes vorhandenes nehmen oder neu anlegen
    let profileId = getActiveProfileId();
    if (!profileId) {
      const profiles = loadProfilesIndex();
      if (profiles.length > 0) {
        profileId = profiles[0].id;
        setActiveProfileId(profileId);
      } else {
        const profile = createProfile('');
        setActiveProfileId(profile.id);
        profileId = profile.id;
      }
    }

    try {
      const body = JSON.stringify({ voucherId, profileId });
      const res = await aymFetch('/api/v1/extension/aym-vision/voucher/redeem', {
        method: 'POST',
        body,
      });

      if (res.status === 409) {
        setScreen({ kind: 'alreadyOwned' });
        return;
      }
      if (res.status === 404) {
        setScreen({ kind: 'notFound' });
        return;
      }
      if (!res.ok) {
        setScreen({ kind: 'error' });
        return;
      }

      const data = await res.json() as RedeemResponse;

      await refreshOwnership(profileId);
      setScreen({ kind: 'success', contentId: data.contentId });
    } catch {
      setScreen({ kind: 'error' });
    }
  }

  if (parentGateOpen) {
    return (
      <ParentGateDialog
        open={true}
        onUnlocked={() => setParentGateOpen(false)}
        onClose={() => navigate(-1)}
      />
    );
  }

  if (screen.kind === 'backup') {
    return (
      <BackupPrompt
        onDone={() => navigate('/stories')}
        onCancel={() => navigate('/stories')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-md">

        {/* Input screen */}
        {screen.kind === 'input' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-slate-900">{t('identity.voucher.title')}</h1>

            {/* Camera scanner */}
            <div className="rounded-2xl overflow-hidden bg-black aspect-square relative">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              {!scanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-6 py-3 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 active:scale-[0.97] transition-all"
                  >
                    {t('identity.voucher.scanButton')}
                  </button>
                </div>
              )}
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-4 border-white/70 rounded-2xl" />
                </div>
              )}
            </div>

            <div className="text-center text-sm text-slate-500">oder</div>

            {/* Manual input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                {t('identity.voucher.inputLabel')}
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={e => { setInputValue(e.target.value); setInputError(''); }}
                placeholder={t('identity.voucher.inputPlaceholder')}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              {inputError && <p className="text-sm text-red-600">{inputError}</p>}
              <button
                type="button"
                onClick={handleManualSubmit}
                disabled={!inputValue.trim()}
                className="w-full py-3 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 disabled:opacity-40 active:scale-[0.97] transition-all"
              >
                {t('identity.voucher.confirm')}
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-2 text-sm text-slate-500 hover:text-slate-700"
            >
              {t('identity.voucher.back')}
            </button>
          </div>
        )}

        {/* Confirmation screen */}
        {screen.kind === 'confirming' && (
          <div className="space-y-6 text-center">
            <div className="text-5xl">🎟️</div>
            <h2 className="text-xl font-extrabold text-slate-900">{t('identity.voucher.confirmTitle')}</h2>
            <p className="text-slate-600">{t('identity.voucher.confirmText')}</p>
            <p className="text-xs font-mono text-slate-400 break-all">{screen.voucherId}</p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleConfirm(screen.voucherId)}
                className="w-full py-3 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 active:scale-[0.97] transition-all"
              >
                {t('identity.voucher.confirm')}
              </button>
              <button
                type="button"
                onClick={() => setScreen({ kind: 'input' })}
                className="w-full py-2 text-sm text-slate-500 hover:text-slate-700"
              >
                {t('identity.voucher.cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {screen.kind === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="w-10 h-10 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
            <p className="text-slate-500 text-sm">Einlösen …</p>
          </div>
        )}

        {/* Success */}
        {screen.kind === 'success' && (
          <div className="space-y-6 text-center">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-extrabold text-slate-900">{t('identity.voucher.successTitle')}</h2>
            <p className="text-slate-600">{t('identity.voucher.successText')}</p>
            <button
              type="button"
              onClick={() => {
                if (needsBackup && screen.kind === 'success' && screen.contentId !== 's1-full') {
                  setScreen({ kind: 'backup' });
                } else {
                  navigate('/stories');
                }
              }}
              className="w-full py-3 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 active:scale-[0.97] transition-all"
            >
              {t('identity.voucher.done')}
            </button>
          </div>
        )}

        {/* Already owned */}
        {screen.kind === 'alreadyOwned' && (
          <div className="space-y-6 text-center">
            <div className="text-5xl">✅</div>
            <h2 className="text-xl font-extrabold text-slate-900">{t('identity.voucher.alreadyOwned')}</h2>
            <button
              type="button"
              onClick={() => navigate('/stories')}
              className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 active:scale-[0.97] transition-all"
            >
              {t('identity.voucher.back')}
            </button>
          </div>
        )}

        {/* Not found */}
        {screen.kind === 'notFound' && (
          <div className="space-y-6 text-center">
            <div className="text-5xl">🔍</div>
            <h2 className="text-xl font-extrabold text-slate-900">{t('identity.voucher.notFound')}</h2>
            <button
              type="button"
              onClick={() => setScreen({ kind: 'input' })}
              className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 active:scale-[0.97] transition-all"
            >
              {t('identity.voucher.back')}
            </button>
          </div>
        )}

        {/* Error */}
        {screen.kind === 'error' && (
          <div className="space-y-6 text-center">
            <div className="text-5xl">⚠️</div>
            <h2 className="text-xl font-extrabold text-slate-900">{t('identity.voucher.error')}</h2>
            <button
              type="button"
              onClick={() => setScreen({ kind: 'input' })}
              className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 active:scale-[0.97] transition-all"
            >
              {t('identity.voucher.back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
