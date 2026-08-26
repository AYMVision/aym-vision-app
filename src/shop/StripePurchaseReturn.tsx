import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { aymFetch } from '../identity/handshake';
import { getActiveProfileId } from '../profile/profileStorage';
import { refreshOwnership } from './ownership';
import { useIdentity } from '../identity/useIdentity';
import { BackupPrompt } from '../identity/BackupPrompt';
import { extractSessionId } from './stripe';

type Screen =
  | { kind: 'processing' }
  | { kind: 'success' }
  | { kind: 'error'; messageKey: string }
  | { kind: 'backup' };

export default function StripePurchaseReturn() {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();
  const location = useLocation();
  const { needsBackup } = useIdentity();

  const [screen, setScreen] = useState<Screen>({ kind: 'processing' });

  useEffect(() => {
    const sessionId = extractSessionId(window.location.href);
    const profileId = getActiveProfileId();

    if (!sessionId || !profileId) {
      setScreen({ kind: 'error', messageKey: 'shop.return.errorGeneral' });
      return;
    }

    (async () => {
      try {
        const body = JSON.stringify({ sessionId, profileId });
        const res = await aymFetch('/api/v1/extension/aym-vision/purchase/stripe', {
          method: 'POST',
          body,
        });

        if (res.status === 402) {
          setScreen({ kind: 'error', messageKey: 'shop.return.errorUnpaid' });
          return;
        }
        if (res.status === 409) {
          setScreen({ kind: 'error', messageKey: 'shop.return.errorOwned' });
          return;
        }
        if (res.status === 422) {
          setScreen({ kind: 'error', messageKey: 'shop.return.errorMismatch' });
          return;
        }
        if (!res.ok) {
          setScreen({ kind: 'error', messageKey: 'shop.return.errorGeneral' });
          return;
        }

        await refreshOwnership();
        setScreen({ kind: 'success' });
      } catch {
        setScreen({ kind: 'error', messageKey: 'shop.return.errorGeneral' });
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  if (screen.kind === 'backup') {
    return (
      <BackupPrompt
        onDone={() => navigate('/stories')}
        onCancel={() => navigate('/stories')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">

        {screen.kind === 'processing' && (
          <>
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
            <p className="text-slate-600 font-semibold">{t('shop.return.processing')}</p>
          </>
        )}

        {screen.kind === 'success' && (
          <>
            <div className="text-6xl">🎉</div>
            <h1 className="text-2xl font-extrabold text-slate-900">{t('shop.return.successTitle')}</h1>
            <p className="text-slate-600">{t('shop.return.successText')}</p>
            <button
              type="button"
              onClick={() => {
                if (needsBackup) {
                  setScreen({ kind: 'backup' });
                } else {
                  navigate('/stories');
                }
              }}
              className="w-full py-3 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 active:scale-[0.97] transition-all"
            >
              {t('identity.voucher.done')}
            </button>
          </>
        )}

        {screen.kind === 'error' && (
          <>
            <div className="text-5xl">⚠️</div>
            <h1 className="text-xl font-extrabold text-slate-900">{t(screen.messageKey)}</h1>
            <button
              type="button"
              onClick={() => navigate('/stories')}
              className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 active:scale-[0.97] transition-all"
            >
              {t('shop.return.toProfile')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
