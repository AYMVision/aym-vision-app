import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdentity } from './useIdentity';
import { markBackupConfirmed } from './storage';
import { pickQuizIndices, checkQuizAnswers } from './backupQuiz';

type Screen = 'congrats' | 'why' | 'words' | 'quiz';

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
  const [quizIndices] = useState(() => pickQuizIndices(Math.random));
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [quizError, setQuizError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnswer = useCallback((i: number, value: string) => {
    setAnswers(prev => { const next = [...prev]; next[i] = value; return next; });
    setQuizError(false);
  }, []);

  function handleConfirm() {
    if (!checkQuizAnswers(mnemonic, quizIndices, answers)) {
      setQuizError(true);
      return;
    }
    markBackupConfirmed();
    onDone();
  }

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
            Wörter anzeigen →
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
            {copied ? 'Kopiert ✓' : mode === 'jury' ? t('identity.backup.juryCopyAll') : 'Wörter kopieren'}
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
            {mode === 'jury' ? t('identity.backup.juryConfirm') : 'Ich habe sie gesichert →'}
          </button>
          <button type="button" onClick={onCancel} className="w-full text-center text-sm text-slate-500 hover:text-slate-700">
            {mode === 'jury' ? t('identity.backup.jurySkip') : t('identity.backup.skip')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4">
        <div className="text-lg font-bold text-slate-900">{t('identity.backup.quizTitle')}</div>
        {quizIndices.map((wordIdx, i) => (
          <div key={wordIdx} className="space-y-1">
            <label className="text-sm text-slate-600">
              {t('identity.backup.quizPrompt', { number: wordIdx + 1 })}
            </label>
            <input
              type="text"
              value={answers[i]}
              onChange={e => handleAnswer(i, e.target.value)}
              placeholder={t('identity.backup.quizPlaceholder')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-slate-500 focus:outline-none"
            />
          </div>
        ))}
        {quizError && (
          <p className="text-sm text-red-600">{t('identity.backup.quizError')}</p>
        )}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {t('identity.backup.confirm')}
        </button>
        <button type="button" onClick={onCancel} className="w-full text-center text-sm text-slate-500 hover:text-slate-700">
          {t('identity.backup.skip')}
        </button>
        <p className="text-xs text-slate-400 text-center">{t('identity.backup.skipHint')}</p>
      </div>
    </div>
  );
}
