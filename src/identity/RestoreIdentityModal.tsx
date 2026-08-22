import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { restoreIdentity } from './keys';
import { loadIdentity } from './storage';
import { refreshOwnership } from '../shop/ownership';

type Screen = 'input' | 'success';

export function RestoreIdentityModal({ onDone, onCancel }: { onDone(): void; onCancel(): void }) {
  const { t } = useTranslation('profile');
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState<Screen>('input');
  const [restoredContent, setRestoredContent] = useState<string[]>([]);

  async function handleRestore() {
    setError(null);
    setLoading(true);
    try {
      const restored = await restoreIdentity(input.trim());
      localStorage.setItem(
        'aym_identity',
        JSON.stringify({ ...restored, backupConfirmedAt: Date.now(), createdAt: Date.now() })
      );
      // Sync ownership for all local profiles after restore
      const allProfileIds = Object.keys(localStorage)
        .filter(k => k.startsWith('aym_p_') && k.endsWith('__aym_user_profile'))
        .map(k => k.replace('__aym_user_profile', '').replace('aym_p_', ''));
      const results = await Promise.allSettled(allProfileIds.map(id => refreshOwnership(id)));
      const allOwned = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
      setRestoredContent([...new Set(allOwned)]);
      setScreen('success');
    } catch {
      setError(t('identity.restore.error'));
    } finally {
      setLoading(false);
    }
  }

  if (screen === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4">
          <div className="text-lg font-bold text-slate-900">
            {t('identity.restore.successTitle', { defaultValue: 'Identität wiederhergestellt ✓' })}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t('identity.restore.successBody', { defaultValue: 'Deine Identität wurde erfolgreich wiederhergestellt.' })}
          </p>
          {restoredContent.length > 0 ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 space-y-1">
              <div className="text-sm font-semibold text-emerald-800">
                {t('identity.restore.purchaseRestored', { defaultValue: 'Kauf wiederhergestellt:' })}
              </div>
              {restoredContent.map(id => (
                <div key={id} className="text-sm text-emerald-700">
                  ✓ {id === 's1'
                    ? t('identity.restore.contentS1', { defaultValue: 'Staffel 1' })
                    : id}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 space-y-2">
              <div>{t('identity.restore.noPurchase', { defaultValue: 'Kein Kauf mit diesen Wörtern gefunden.' })}</div>
              <div>{t('identity.restore.noPurchaseHint', { defaultValue: 'Bitte versuche es gleich noch einmal — oder schreib uns:' })}</div>
              <a
                href="mailto:hello@amysurfwing.de?subject=Kauf%20wiederherstellen"
                className="inline-flex items-center gap-1 font-semibold text-slate-800 underline underline-offset-2"
              >
                hello@amysurfwing.de →
              </a>
            </div>
          )}
          <button
            type="button"
            onClick={onDone}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {t('identity.restore.done', { defaultValue: 'Fertig' })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4">
        <div className="text-lg font-bold text-slate-900">{t('identity.restore.title')}</div>
        <p className="text-sm text-slate-600 leading-relaxed">{t('identity.restore.subtitle')}</p>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {t('identity.restore.warning')}
        </div>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setError(null); }}
          placeholder={t('identity.restore.placeholder')}
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-slate-500 focus:outline-none resize-none"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="button"
          onClick={handleRestore}
          disabled={loading || !input.trim()}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? '…' : t('identity.restore.confirm')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-center text-sm text-slate-500 hover:text-slate-700"
        >
          {t('identity.restore.cancel')}
        </button>
      </div>
    </div>
  );
}
