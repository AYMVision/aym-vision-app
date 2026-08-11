import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdentity } from './useIdentity';
import { markBackupConfirmed } from './storage';
import { pickQuizIndices, checkQuizAnswers } from './backupQuiz';

type Screen = 'congrats' | 'why' | 'words' | 'quiz';

export function BackupPrompt({ onDone, onCancel }: { onDone(): void; onCancel(): void }) {
  if (import.meta.env.VITE_SKIP_BACKUP_GATE === 'true') {
    markBackupConfirmed();
    onDone();
    return null;
  }

  const { t } = useTranslation('profile');
  const { identity } = useIdentity();
  const mnemonic = identity?.mnemonic ?? '';
  const words = mnemonic.trim().split(/\s+/);

  const [screen, setScreen] = useState<Screen>('congrats');
  const [quizIndices] = useState(() => pickQuizIndices(Math.random));
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [quizError, setQuizError] = useState(false);

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

  if (screen === 'congrats') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4">
          <div className="text-2xl font-bold text-slate-900">{t('identity.backup.headline')}</div>
          <div className="text-lg font-semibold text-emerald-700">{t('identity.backup.congrats')}</div>
          <button
            type="button"
            onClick={() => setScreen('why')}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Weiter →
          </button>
          <button type="button" onClick={onCancel} className="w-full text-center text-sm text-slate-500 hover:text-slate-700">
            {t('identity.backup.skip')}
          </button>
          <p className="text-xs text-slate-400 text-center">{t('identity.backup.skipHint')}</p>
        </div>
      </div>
    );
  }

  if (screen === 'why') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4">
          <div className="text-lg font-bold text-slate-900">{t('identity.backup.whyTitle')}</div>
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
        </div>
      </div>
    );
  }

  if (screen === 'words') {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 sm:items-center">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="text-lg font-bold text-slate-900">{t('identity.backup.writeDownTitle')}</div>
          <p className="text-xs text-amber-700 font-medium">{t('identity.backup.writeDownHint')}</p>
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
            onClick={() => setScreen('quiz')}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Ich habe sie aufgeschrieben →
          </button>
          <button type="button" onClick={onCancel} className="w-full text-center text-sm text-slate-500 hover:text-slate-700">
            {t('identity.backup.skip')}
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
