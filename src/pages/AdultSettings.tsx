// src/pages/AdultSettings.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import Layout from '../components/Layout';

import { loadSettings, saveSettings, type OwlMode } from '../settings/appSettings';
import {
  hasParentPasscode,
  isParentUnlocked,
  lockParentNow,
  setParentPasscode,
  setParentUnlockedForMinutes,
  verifyParentPasscode,
} from '../settings/parentLock';

import { getEntitlements } from '../gating/entitlements';
import { applyUnlockCode } from '../gating/unlockCodes';
import { canOpenTestSettings } from '../settings/testAccess';

import ParentThemeCard from '../components/ParentThemeCard';

type LocationState = {
  backTo?: string;
} | null;

export default function AdultSettings() {
  const { t } = useTranslation(['adult', 'parents']);
  const location = useLocation();

  const locationState = (location.state as LocationState) ?? null;
  const backTo = locationState?.backTo || '/parents';

  const [owlMode, setOwlMode] = useState<OwlMode>(() => loadSettings().owlMode);

  const [code, setCode] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState<'neutral' | 'success' | 'error'>('neutral');

  const [refreshTick, setRefreshTick] = useState(0);
    const [passcode, setPasscode] = useState('');
  const [passcodeRepeat, setPasscodeRepeat] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [unlockBusy, setUnlockBusy] = useState(false);

  useEffect(() => {
    saveSettings({ owlMode });
  }, [owlMode]);

  const modeLabel = useMemo(() => {
    if (owlMode === 'on') return t('adult:sections.ai.modes.on.title');
    if (owlMode === 'auto') return t('adult:sections.ai.modes.auto.title');
    return t('adult:sections.ai.modes.off.title');
  }, [owlMode, t]);

  const entitlements = useMemo(() => getEntitlements(), [refreshTick]);
  const unlockedEpisodes = entitlements.unlockedEpisodes ?? [];

  const activeUnlockSummary = useMemo(() => {
    const parts: string[] = [];

    if (entitlements.bypassAll) {
      parts.push(t('adult:unlock.allUnlocked', { defaultValue: 'Alle Inhalte freigeschaltet' }));
    }

    if (entitlements.bypassUntil) {
      parts.push(
        t('adult:unlock.until', {
          defaultValue: 'Freigabe bis {{date}}',
          date: entitlements.bypassUntil,
        })
      );
    }

    if (unlockedEpisodes.length > 0) {
      parts.push(
        t('adult:unlock.episodes', {
          defaultValue: 'Episoden: {{episodes}}',
          episodes: unlockedEpisodes.map((x) => x.toUpperCase()).join(', '),
        })
      );
    }

    if (parts.length === 0) {
      return t('adult:unlock.none', { defaultValue: 'Keine aktiven Freischaltungen.' });
    }

    return parts.join(' · ');
  }, [entitlements.bypassAll, entitlements.bypassUntil, unlockedEpisodes, t]);

  const statusClass =
    statusTone === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : statusTone === 'error'
      ? 'border-red-200 bg-red-50 text-red-800'
      : 'border-slate-200 bg-slate-50 text-slate-700';

  function handleApplyCode() {
    const result = applyUnlockCode(code);
    setStatusMessage(result.message);
    setStatusTone(result.ok ? 'success' : 'error');
    if (result.ok) setCode('');
    setRefreshTick((v) => v + 1);
  }

  if (!isParentUnlocked()) {
    const needsSetup = !hasParentPasscode();

    return (
      <Layout backPath={backTo} hideFooter>
        <div className="max-w-xl mx-auto px-4 py-10">
          <h1 className="text-xl font-bold">
            {needsSetup
              ? t('adult:parent.titleSetup', {
                  defaultValue: 'Erwachsenen-Einstellungen einrichten',
                })
              : t('adult:parent.titleUnlock', {
                  defaultValue: 'Erwachsenenbereich',
                })}
          </h1>

          <p className="mt-2 text-slate-600">
            {needsSetup
              ? t('adult:parent.bodySetup', {
                  defaultValue:
                    'Lege einen Passcode fest. Damit können Erwachsene später Einstellungen öffnen.',
                })
              : t('adult:parent.bodyUnlock', {
                  defaultValue:
                    'Gib den Passcode ein, um die Erwachsenen-Einstellungen zu öffnen.',
                })}
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <label className="text-xs text-slate-500">
                {t('adult:parent.passLabel', { defaultValue: 'Passcode' })}
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder={t('adult:parent.passPlaceholder', {
                  defaultValue: 'mind. 6 Zeichen',
                })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            {needsSetup ? (
              <div className="mt-4">
                <label className="text-xs text-slate-500">
                  {t('adult:parent.passLabel2', { defaultValue: 'Passcode wiederholen' })}
                </label>
                <input
                  type="password"
                  value={passcodeRepeat}
                  onChange={(e) => setPasscodeRepeat(e.target.value)}
                  placeholder={t('adult:parent.passPlaceholder2', {
                    defaultValue: 'nochmal eingeben',
                  })}
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
                {needsSetup
                  ? t('adult:parent.setup', { defaultValue: 'Einrichten' })
                  : t('adult:parent.unlock', { defaultValue: 'Öffnen' })}
              </button>

              <Link
                to="/parents"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                {t('adult:parent.cancel', { defaultValue: 'Zur Elternseite' })}
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

    async function handleSetupPasscode() {
    const p1 = passcode.trim();
    const p2 = passcodeRepeat.trim();

    if (p1.length < 6) {
      setPasscodeError(
        t('adult:parent.errorTooShort', { defaultValue: 'Bitte mindestens 6 Zeichen.' })
      );
      return;
    }

    if (p1 !== p2) {
      setPasscodeError(
        t('adult:parent.errorMismatch', { defaultValue: 'Die Passcodes stimmen nicht überein.' })
      );
      return;
    }

    setUnlockBusy(true);
    setPasscodeError('');

    try {
      const ok = await setParentPasscode(p1);
      if (!ok) {
        setPasscodeError(
          t('adult:parent.errorTooShort', { defaultValue: 'Bitte mindestens 6 Zeichen.' })
        );
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
      setPasscodeError(
        t('adult:parent.errorWrong', { defaultValue: 'Passcode stimmt nicht.' })
      );
      return;
    }

    setUnlockBusy(true);
    setPasscodeError('');

    try {
      const ok = await verifyParentPasscode(p);
      if (!ok) {
        setPasscodeError(
          t('adult:parent.errorWrong', { defaultValue: 'Passcode stimmt nicht.' })
        );
        return;
      }

      setParentUnlockedForMinutes(10);
      setPasscode('');
      setPasscodeRepeat('');
    } finally {
      setUnlockBusy(false);
    }
  }

  return (
    <Layout backPath={backTo} hideFooter>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">{t('adult:adult.title')}</h1>
        <p className="mt-2 text-slate-600">{t('adult:adult.subtitle')}</p>

        <div className="mt-6">
  <ParentThemeCard />
</div>

        <section
          id="ai-modes"
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 scroll-mt-24 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">{t('adult:ai.title')}</div>
              <div className="mt-1 text-sm text-slate-600">{t('adult:ai.owlMode.help')}</div>
            </div>

            <span className="shrink-0 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
              {modeLabel}
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              {t('adult:sections.ai.modeTitle')}
            </div>

            <div className="mt-3 space-y-3 text-sm text-slate-700">
              <div>
                <div className="font-semibold text-slate-900">
                  {t('adult:sections.ai.modes.on.title')}
                </div>
                <p className="mt-1">{t('adult:sections.ai.modes.on.text')}</p>
              </div>

              <div>
                <div className="font-semibold text-slate-900">
                  {t('adult:sections.ai.modes.auto.title')}
                </div>
                <p className="mt-1">{t('adult:sections.ai.modes.auto.text')}</p>
              </div>

              <div>
                <div className="font-semibold text-slate-900">
                  {t('adult:sections.ai.modes.off.title')}
                </div>
                <p className="mt-1">{t('adult:sections.ai.modes.off.text')}</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600">{t('adult:sections.ai.changeHint')}</p>
            <p className="mt-1 text-sm text-slate-600">{t('adult:sections.ai.performanceHint')}</p>

            <div className="mt-3">
              <Link
                to="/parents"
                className="text-sm font-semibold text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]"
              >
                {t('adult:ai.moreInfo', { defaultValue: 'Mehr Infos für Eltern →' })}
              </Link>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-xs text-slate-500">{t('adult:ai.owlMode.label')}</label>
            <select
              value={owlMode}
              onChange={(e) => setOwlMode(e.target.value as OwlMode)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
            >
              <option value="off">{t('adult:ai.owlMode.off')}</option>
              <option value="auto">{t('adult:ai.owlMode.auto')}</option>
              <option value="on">{t('adult:ai.owlMode.on')}</option>
            </select>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            {t('adult:unlock.title', { defaultValue: 'Freischaltcode' })}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {t('adult:unlock.description', {
              defaultValue: 'Wenn du einen Freischaltcode erhalten hast, kannst du ihn hier eingeben.',
            })}
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('adult:unlock.inputPlaceholder', {
                defaultValue: 'Code eingeben',
              })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <button
              type="button"
              onClick={handleApplyCode}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {t('adult:unlock.apply', { defaultValue: 'Code anwenden' })}
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t('adult:unlock.statusTitle', { defaultValue: 'Aktive Freischaltungen' })}
            </div>
            <div className="mt-2 text-sm text-slate-700">{activeUnlockSummary}</div>
          </div>

          {statusMessage ? (
            <div className={`mt-4 rounded-xl border p-3 text-sm ${statusClass}`}>{statusMessage}</div>
          ) : null}
        </section>

        {canOpenTestSettings() ? (
          <div className="mt-6">
            <Link
              to="/test-settings"
              className="text-sm font-semibold text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]"
            >
              {t('adult:testMode.openPage', { defaultValue: 'Zur Testseite →' })}
            </Link>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {t('adult:ai.note', {
              defaultValue: 'Änderungen werden automatisch gespeichert.',
            })}
          </div>

          <button
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            onClick={() => {
              lockParentNow();
              window.history.back();
            }}
          >
            {t('adult:adult.lockNow')}
          </button>
        </div>
      </div>
    </Layout>
  );
}