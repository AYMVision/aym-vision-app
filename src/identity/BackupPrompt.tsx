import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdentity } from './useIdentity';
import { markBackupConfirmed } from './storage';

type Screen = 'congrats' | 'why' | 'words';

export function BackupPrompt({ onDone, onCancel, mode }: { onDone(): void; onCancel(): void; mode?: 'jury' }) {
  if (import.meta.env.VITE_SKIP_BACKUP_GATE === 'true') {
    markBackupConfirmed();
    onDone();
    return null;
  }

  const { t } = useTranslation('profile');
  const { identity } = useIdentity();
  const mnemonic = identity?.mnemonic ?? '';
  const words = mnemonic.trim().split(/\s+/);

  const [screen, setScreen] = useState<Screen>(() => mode === 'jury' ? 'words' : 'congrats');
  const [copied, setCopied] = useState(false);

  if (screen === 'congrats' || screen === 'why') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4">
          <div className="text-2xl font-bold text-slate-900">{t('identity.backup.headline')}</div>
          <p className="text-sm text-slate-600 leading-relaxed">{t('identity.backup.whyText')}</p>
          <button
            type="button"
            onClick={() => setScreen('words')}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Meine 24 Wörter ansehen →
          </button>
          <button type="button" onClick={onCancel} className="w-full text-center text-sm text-slate-500 hover:text-slate-700">
            {t('identity.backup.skip')}
          </button>
          <p className="text-xs text-slate-400 text-center">{t('identity.backup.skipHint')}</p>
        </div>
      </div>
    );
  }

  if (screen === 'words') {
    const mailtoHref = `mailto:?subject=${encodeURIComponent(t('identity.backup.juryMailSubject'))}&body=${encodeURIComponent(t('identity.backup.juryMailBody') + '\n\n' + mnemonic)}`;

    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 sm:items-center">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
          {mode === 'jury' ? (
            <>
              <div className="text-lg font-bold text-slate-900">{t('identity.backup.juryHeadline')}</div>
              <p className="text-sm text-slate-600 leading-relaxed">{t('identity.backup.juryWhyText')}</p>
            </>
          ) : (
            <div className="text-lg font-bold text-slate-900">{t('identity.backup.writeDownTitle')}</div>
          )}
          <div className="grid grid-cols-3 gap-2">
            {words.map((word, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-center">
                <div className="text-[10px] text-slate-400">{i + 1}</div>
                <div className="text-sm font-semibold text-slate-800 font-mono">{word}</div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(mnemonic);
              setCopied(true);
              setTimeout(() => setCopied(false), 2500);
            }}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
              copied
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {copied ? 'Kopiert ✓' : mode === 'jury' ? t('identity.backup.juryCopyAll') : 'Alle 24 Wörter kopieren'}
          </button>
          {mode === 'jury' && (
            <a
              href={mailtoHref}
              className="block w-full text-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {t('identity.backup.juryMailLink')}
            </a>
          )}
          <button
            type="button"
            onClick={() => { markBackupConfirmed(); onDone(); }}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {mode === 'jury' ? t('identity.backup.juryConfirm') : 'Gespeichert & weiter'}
          </button>
          <button type="button" onClick={onCancel} className="w-full text-center text-sm text-slate-500 hover:text-slate-700">
            {mode === 'jury' ? t('identity.backup.jurySkip') : t('identity.backup.skip')}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
