import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Layout from '../components/Layout';

import {
  getEntitlements,
  resetEntitlements,
  setBypassAll,
  setBypassUntil,
  unlockEpisode,
  removeUnlockedEpisode,
} from '../gating/entitlements';

import { applyUnlockCode } from '../gating/unlockCodes';
import { canOpenTestSettings } from '../settings/testAccess';
import {
  hasParentPasscode,
  isParentUnlocked,
  setParentPasscode,
  setParentUnlockedForMinutes,
  verifyParentPasscode,
} from '../settings/parentLock';

export default function TestSettings() {
  const { t } = useTranslation('adult');

  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState<'neutral' | 'success' | 'error'>('neutral');

  const [episodeInput, setEpisodeInput] = useState('s1e01');
  const [untilInput, setUntilInput] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);

  const [accessCode, setAccessCode] = useState('');
  const [accessError, setAccessError] = useState('');

  const [passcode, setPasscode] = useState('');
  const [passcodeRepeat, setPasscodeRepeat] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [unlockBusy, setUnlockBusy] = useState(false);

  const entitlements = useMemo(() => getEntitlements(), [refreshTick]);
  const unlockedEpisodes = entitlements.unlockedEpisodes ?? [];

  const activeUnlockSummary = useMemo(() => {
    const parts: string[] = [];

    if (entitlements.bypassAll) {
      parts.push(
        t('unlock.allUnlocked', { defaultValue: 'Alle Inhalte freigeschaltet' })
      );
    }

    if (entitlements.bypassUntil) {
      parts.push(
        t('unlock.until', {
          defaultValue: 'Freigabe bis {{date}}',
          date: entitlements.bypassUntil,
        })
      );
    }

    if (unlockedEpisodes.length > 0) {
      parts.push(
        t('unlock.episodes', {
          defaultValue: 'Episoden: {{episodes}}',
          episodes: unlockedEpisodes.map((x) => x.toUpperCase()).join(', '),
        })
      );
    }

    if (parts.length === 0) {
      return t('unlock.none', { defaultValue: 'Keine aktiven Freischaltungen.' });
    }

    return parts.join(' · ');
  }, [entitlements.bypassAll, entitlements.bypassUntil, unlockedEpisodes, t]);

  const statusClass =
    statusTone === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : statusTone === 'error'
      ? 'border-red-200 bg-red-50 text-red-800'
      : 'border-slate-200 bg-slate-50 text-slate-700';

  function refreshUi(
    message?: string,
    tone: 'neutral' | 'success' | 'error' = 'neutral'
  ) {
    if (message) {
      setStatusMessage(message);
      setStatusTone(tone);
    }
    setRefreshTick((v) => v + 1);
  }

  function handleApplyAccessCode() {
    const result = applyUnlockCode(accessCode);
    setAccessError(result.message);

    if (result.ok) {
      setAccessCode('');
      setRefreshTick((v) => v + 1);
    }
  }

  async function handleSetupPasscode() {
    const p1 = passcode.trim();
    const p2 = passcodeRepeat.trim();

    if (p1.length < 6) {
      setPasscodeError('Bitte mindestens 6 Zeichen.');
      return;
    }

    if (p1 !== p2) {
      setPasscodeError('Die Passcodes stimmen nicht überein.');
      return;
    }

    setUnlockBusy(true);
    setPasscodeError('');

    try {
      const ok = await setParentPasscode(p1);
      if (!ok) {
        setPasscodeError('Bitte mindestens 6 Zeichen.');
        return;
      }

      setParentUnlockedForMinutes(10);
      setPasscode('');
      setPasscodeRepeat('');
    } finally {
      setUnlockBusy(false);
    }
  }

  async function handleUnlockWithPasscode() {
    const p = passcode.trim();

    if (!p) {
      setPasscodeError('Passcode stimmt nicht.');
      return;
    }

    setUnlockBusy(true);
    setPasscodeError('');

    try {
      const ok = await verifyParentPasscode(p);
      if (!ok) {
        setPasscodeError('Passcode stimmt nicht.');
        return;
      }

      setParentUnlockedForMinutes(10);
      setPasscode('');
      setPasscodeRepeat('');
    } finally {
      setUnlockBusy(false);
    }
  }

  function handleToggleBypassAll(next: boolean) {
    setBypassAll(next);
    refreshUi(
      next
        ? t('testMode.global.enabled', {
            defaultValue: 'Alle Inhalte wurden freigeschaltet.',
          })
        : t('testMode.global.disabled', {
            defaultValue: 'Die globale Freischaltung wurde deaktiviert.',
          }),
      'success'
    );
  }

  function handleUnlockEpisode() {
    const normalized = episodeInput.trim().toLowerCase();

    if (!normalized) {
      refreshUi(
        t('testMode.episode.missing', {
          defaultValue: 'Bitte gib eine Episode ein.',
        }),
        'error'
      );
      return;
    }

    unlockEpisode(normalized);
    refreshUi(
      t('testMode.episode.unlocked', {
        defaultValue: 'Episode {{episode}} wurde freigeschaltet.',
        episode: normalized.toUpperCase(),
      }),
      'success'
    );
  }

  function handleRemoveEpisode() {
    const normalized = episodeInput.trim().toLowerCase();

    if (!normalized) {
      refreshUi(
        t('testMode.episode.missing', {
          defaultValue: 'Bitte gib eine Episode ein.',
        }),
        'error'
      );
      return;
    }

    removeUnlockedEpisode(normalized);
    refreshUi(
      t('testMode.episode.removed', {
        defaultValue: 'Episode {{episode}} wurde entfernt.',
        episode: normalized.toUpperCase(),
      }),
      'success'
    );
  }

  function handleSetBypassUntil() {
    const normalized = untilInput.trim();

    if (!normalized) {
      setBypassUntil(undefined);
      refreshUi(
        t('testMode.until.removed', {
          defaultValue: 'Datumsfreigabe wurde entfernt.',
        }),
        'success'
      );
      return;
    }

    setBypassUntil(normalized);
    refreshUi(
      t('testMode.until.set', {
        defaultValue: 'Freischaltung bis {{date}} gesetzt.',
        date: normalized,
      }),
      'success'
    );
  }

  function handleResetEntitlements() {
    resetEntitlements();
    refreshUi(
      t('testMode.reset.entitlementsDone', {
        defaultValue: 'Alle Freischaltungen wurden entfernt.',
      }),
      'success'
    );
  }

  function handleResetSession() {
    sessionStorage.clear();
    refreshUi(
      t('testMode.reset.sessionDone', {
        defaultValue: 'Die aktuelle Sitzung wurde zurückgesetzt.',
      }),
      'success'
    );
  }

  if (!canOpenTestSettings()) {
    return (
      <Layout backPath="/parents" hideFooter>
        <div className="max-w-xl mx-auto px-4 py-10">
          <h1 className="text-xl font-bold">
            {t('testMode.title', { defaultValue: 'Testmodus' })}
          </h1>
          <p className="mt-2 text-slate-600">
            {t('testMode.locked', {
              defaultValue: 'Dieser Bereich ist nicht freigeschaltet. Gib einen Testcode ein.',
            })}
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="text-xs text-slate-500">
              {t('unlock.inputPlaceholder', { defaultValue: 'Code eingeben' })}
            </label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder={t('unlock.inputPlaceholder', { defaultValue: 'Code eingeben' })}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />

            {accessError ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {accessError}
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleApplyAccessCode}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {t('unlock.apply', { defaultValue: 'Code anwenden' })}
              </button>

              <Link
                to="/parents"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Zur Elternseite
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isParentUnlocked()) {
    const needsSetup = !hasParentPasscode();

    return (
      <Layout backPath="/parents" hideFooter>
        <div className="max-w-xl mx-auto px-4 py-10">
          <h1 className="text-xl font-bold">
            {needsSetup ? 'Testbereich einrichten' : 'Testbereich entsperren'}
          </h1>
          <p className="mt-2 text-slate-600">
            {needsSetup
              ? 'Lege einen Passcode fest. Danach kannst du den Testbereich öffnen.'
              : 'Gib den Passcode ein, um den Testbereich zu öffnen.'}
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="text-xs text-slate-500">Passcode</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="mind. 6 Zeichen"
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />

            {needsSetup ? (
              <div className="mt-4">
                <label className="text-xs text-slate-500">Passcode wiederholen</label>
                <input
                  type="password"
                  value={passcodeRepeat}
                  onChange={(e) => setPasscodeRepeat(e.target.value)}
                  placeholder="nochmal eingeben"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            ) : null}

            {passcodeError ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {passcodeError}
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={needsSetup ? handleSetupPasscode : handleUnlockWithPasscode}
                disabled={unlockBusy}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {needsSetup ? 'Einrichten' : 'Öffnen'}
              </button>

              <Link
                to="/parents"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Zur Elternseite
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout backPath="/adult-settings" hideFooter>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">
          {t('testMode.title', { defaultValue: 'Testmodus' })}
        </h1>
        <p className="mt-2 text-slate-600">
          {t('testMode.description', {
            defaultValue: 'Für Entwicklung, interne Tests und Pilotphasen.',
          })}
        </p>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">
            {t('unlock.statusTitle', { defaultValue: 'Aktive Freischaltungen' })}
          </div>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            {activeUnlockSummary}
          </div>

          {statusMessage ? (
            <div className={`mt-4 rounded-xl border p-3 text-sm ${statusClass}`}>
              {statusMessage}
            </div>
          ) : null}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">
            {t('testMode.global.title', { defaultValue: 'Globale Freischaltung' })}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {t('testMode.global.description', {
              defaultValue: 'Hebt Tages- und Wochenlimits sowie Kapitel-Sperren auf.',
            })}
          </p>

          <label className="mt-4 flex items-center gap-3 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={entitlements.bypassAll === true}
              onChange={(e) => handleToggleBypassAll(e.target.checked)}
            />
            {t('testMode.global.label', {
              defaultValue: 'Alle Inhalte freischalten',
            })}
          </label>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">
            {t('testMode.until.title', {
              defaultValue: 'Freischaltung bis Datum',
            })}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {t('testMode.until.description', {
              defaultValue: 'Beispiel: 2026-03-30',
            })}
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={untilInput}
              onChange={(e) => setUntilInput(e.target.value)}
              placeholder={t('testMode.until.placeholder', {
                defaultValue: 'YYYY-MM-DD',
              })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <button
              type="button"
              onClick={handleSetBypassUntil}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t('testMode.until.apply', { defaultValue: 'Anwenden' })}
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">
            {t('testMode.episode.title', {
              defaultValue: 'Episode freischalten',
            })}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {t('testMode.episode.description', {
              defaultValue: 'Beispiel: s1e01',
            })}
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={episodeInput}
              onChange={(e) => setEpisodeInput(e.target.value)}
              placeholder={t('testMode.episode.placeholder', {
                defaultValue: 's1e01',
              })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <button
              type="button"
              onClick={handleUnlockEpisode}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t('testMode.episode.unlock', {
                defaultValue: 'Freischalten',
              })}
            </button>
            <button
              type="button"
              onClick={handleRemoveEpisode}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t('testMode.episode.remove', {
                defaultValue: 'Entfernen',
              })}
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">
            {t('testMode.reset.title', { defaultValue: 'Zurücksetzen' })}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {t('testMode.reset.description', {
              defaultValue: 'Hilfreich, wenn du einen Testlauf sauber neu starten möchtest.',
            })}
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={handleResetEntitlements}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t('testMode.reset.entitlements', {
                defaultValue: 'Testfreischaltungen entfernen',
              })}
            </button>

            <button
              type="button"
              onClick={handleResetSession}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t('testMode.reset.session', {
                defaultValue: 'Sitzung zurücksetzen',
              })}
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}