// src/pages/AdultSettings.tsx
import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import Layout from '../components/Layout';

import { loadSettings, saveSettings, type OwlMode } from '../settings/appSettings';
import {
  hasParentPasscode,
  isParentUnlocked,
  lockParentNow,
  MASTER_RESET_CODE,
  resetParentPasscode,
  setParentPasscode,
  setParentUnlockedForMinutes,
  verifyParentPasscode,
} from '../settings/parentLock';

import { getEntitlements } from '../gating/entitlements';
import { applyUnlockCode } from '../gating/unlockCodes';
import { canOpenTestSettings } from '../settings/testAccess';
import { resetChildData, deleteAllData } from '../common/resetAym';
import { exportBackup, importBackup } from '../common/backupRestore';
import { hasDiaryPin, resetDiaryPin } from '../diary/diaryPin';
import { getConsentStatus, setConsent } from '../analytics/consent';
import { getDecisionCount, clearAnalytics } from '../analytics/analyticsStore';
import { shareOrDownloadAnalytics } from '../analytics/analyticsExport';

import {
  aggregateDimensionScores,
  totalItemResponseCount,
} from '../story-v02/runtime/storyScoreAggregator';
import { DIMENSION_META } from '../story-v02/types/dimensionMeta';
import { clearAllStoryV02Responses } from '../story-v02/runtime/storyResponseStore';
import type { StoryDimensionId } from '../story-v02/types/measurementTypes';
import { useProfile } from '../profile/useProfile';
import { THEME_META, THEME_ORDER } from '../competencies/themeMeta';
import { getThemeStickerThreshold } from '../progress/rewardCatalog';

type LocationState = {
  backTo?: string;
  openSection?: string;
} | null;

type AccordionSectionId =
  | 'overview'
  | 'manage'
  | 'analytics'
  | 'transparency'
  | 'protection'
  | 'danger';

function AccordionSection({
  title,
  subtitle,
  badge,
  open,
  onToggle,
  children,
  tone = 'default',
}: {
  title: string;
  subtitle: string;
  badge?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  tone?: 'default' | 'danger';
}) {
  const wrapperClass =
    tone === 'danger'
      ? 'border-red-200 bg-white'
      : 'border-slate-200 bg-white';

  const headerHoverClass =
    tone === 'danger'
      ? 'hover:bg-red-50/60'
      : 'hover:bg-slate-50';

  const iconWrapClass =
    tone === 'danger'
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-slate-50 text-slate-700 border-slate-200';

  const badgeClass =
    tone === 'danger'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-slate-200 bg-slate-50 text-slate-600';

  return (
    <section className={`rounded-2xl border shadow-sm ${wrapperClass}`}>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left transition sm:px-6 ${headerHoverClass}`}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h2>
            {badge ? (
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badgeClass}`}>
                {badge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>

        <span
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm transition ${iconWrapClass} ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {open ? <div className="border-t border-slate-100 px-5 py-5 sm:px-6 sm:py-6">{children}</div> : null}
    </section>
  );
}

export default function AdultSettings() {
  const { t } = useTranslation(['adult', 'parents', 'stories', 'themes']);
  const location = useLocation();
  const { profile } = useProfile();
  const themePoints = profile.progress?.themePoints ?? {};

  const locationState = (location.state as LocationState) ?? null;
  const backTo = locationState?.backTo || '/parents';

  const [owlMode, setOwlMode] = useState<OwlMode>(() => loadSettings().owlMode);
  const [remindersEnabled, setRemindersEnabled] = useState(() => loadSettings().remindersEnabled);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof Notification === 'undefined') return 'unsupported';
    return Notification.permission;
  });

  const [code, setCode] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState<'neutral' | 'success' | 'error'>('neutral');

  const [refreshTick, setRefreshTick] = useState(0);
  const [passcode, setPasscode] = useState('');
  const [passcodeRepeat, setPasscodeRepeat] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [unlockBusy, setUnlockBusy] = useState(false);
  const [learningTraceTick, setLearningTraceTick] = useState(0);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  const [showForgotFlow, setShowForgotFlow] = useState(false);
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [resetCodeError, setResetCodeError] = useState('');

  const [changeCurrentPass, setChangeCurrentPass] = useState('');
  const [changeNewPass, setChangeNewPass] = useState('');
  const [changeNewPassRepeat, setChangeNewPassRepeat] = useState('');
  const [changePassError, setChangePassError] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState(false);

  const [profileResetConfirmed, setProfileResetConfirmed] = useState(false);
  const [profileResetDone, setProfileResetDone] = useState(false);

  const [deleteAllStep, setDeleteAllStep] = useState<'idle' | 'confirm'>('idle');
  const [deleteAllConfirmed, setDeleteAllConfirmed] = useState(false);

  const [diaryPinExists, setDiaryPinExists] = useState(() => hasDiaryPin());
  const [diaryPinResetDone, setDiaryPinResetDone] = useState(false);

  const [importStatus, setImportStatus] = useState<
    { ok: true; restoredKeys: number } | { ok: false; error: string } | null
  >(null);
  const [importBusy, setImportBusy] = useState(false);

  const [openSections, setOpenSections] = useState<Record<AccordionSectionId, boolean>>({
    overview: true,
    manage: false,
    analytics: false,
    transparency: false,
    protection: false,
    danger: false,
  });

  const [consentStatus, setConsentStatus] = useState(() => getConsentStatus());
  const [decisionCount, setDecisionCount] = useState(() => getDecisionCount());
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'done' | 'error'>('idle');
  const [analyticsClearDone, setAnalyticsClearDone] = useState(false);

  useEffect(() => {
    const section = locationState?.openSection as AccordionSectionId | undefined;
    if (section && section in openSections) {
      setOpenSections((prev) => ({ ...prev, [section]: true }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveSettings({ owlMode });
  }, [owlMode]);

  useEffect(() => {
    saveSettings({ remindersEnabled });
  }, [remindersEnabled]);

  async function handleToggleReminders() {
    if (notifPermission === 'unsupported') return;

    if (!remindersEnabled) {
      // Einschalten: ggf. Browser-Erlaubnis anfragen
      if (notifPermission === 'default') {
        const result = await Notification.requestPermission();
        setNotifPermission(result);
        if (result !== 'granted') return;
      }
      if (notifPermission === 'denied') return;
      setRemindersEnabled(true);
    } else {
      setRemindersEnabled(false);
    }
  }

  const modeLabel = useMemo(() => {
    if (owlMode === 'on') return t('adult:sections.ai.modes.on.title');
    if (owlMode === 'auto') return t('adult:sections.ai.modes.auto.title');
    return t('adult:sections.ai.modes.off.title');
  }, [owlMode, t]);

  const dimensionScores = useMemo(() => aggregateDimensionScores(), [learningTraceTick]);
  const itemCount = useMemo(() => totalItemResponseCount(), [learningTraceTick]);

  const DIMENSION_ICONS: Record<StoryDimensionId, string> = {
    perspective: '👁️',
    judgement: '⚖️',
    self_regulation: '💪',
    responsibility: '🌍 ',
  };

  const DIMENSION_JSON_KEY: Record<StoryDimensionId, string> = {
    perspective: 'perspective',
    judgement: 'judgement',
    self_regulation: 'selfRegulation',
    responsibility: 'responsibility',
  };

  function toggleSection(sectionId: AccordionSectionId) {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }

  function handleDeleteLearningTrace() {
    clearAllStoryV02Responses();
    setDeleteConfirmed(true);
    setLearningTraceTick((v) => v + 1);
  }

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
        <div className="mx-auto max-w-xl px-4 py-10">
          <h1 className="text-xl font-bold">
            {needsSetup
              ? t('adult:parent.titleSetup', {
                  defaultValue: 'Eltern-Einstellungen einrichten',
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
                    'Gib den Passcode ein, um die Eltern-Einstellungen zu öffnen.',
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

            {!needsSetup && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                {!showForgotFlow ? (
                  <button
                    type="button"
                    onClick={() => setShowForgotFlow(true)}
                    className="text-sm text-slate-400 hover:text-slate-600"
                  >
                    {t('adult:parent.forgotLink', { defaultValue: 'Passcode vergessen?' })}
                  </button>
                ) : (
                  <div>
                    <p className="mb-3 text-sm text-slate-600">
                      {t('adult:parent.resetHint', {
                        defaultValue:
                          'Gib den Master-Reset-Code ein. Du findest ihn in den FAQ dieser App.',
                      })}
                    </p>
                    <input
                      type="text"
                      value={resetCodeInput}
                      onChange={(e) => setResetCodeInput(e.target.value)}
                      placeholder={t('adult:parent.resetPlaceholder', {
                        defaultValue: 'Reset-Code',
                      })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                    {resetCodeError && (
                      <div className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {resetCodeError}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={handleResetWithMasterCode}
                        className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        {t('adult:parent.resetConfirm', { defaultValue: 'Zurücksetzen' })}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotFlow(false);
                          setResetCodeInput('');
                          setResetCodeError('');
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {t('adult:parent.resetCancel', { defaultValue: 'Abbrechen' })}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
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

  function handleResetWithMasterCode() {
    if (resetCodeInput.trim() !== MASTER_RESET_CODE) {
      setResetCodeError(
        t('adult:parent.resetError', { defaultValue: 'Falscher Reset-Code.' })
      );
      return;
    }
    resetParentPasscode();
    setShowForgotFlow(false);
    setResetCodeInput('');
    setResetCodeError('');
    setPasscode('');
    setPasscodeRepeat('');
    setPasscodeError('');
    setRefreshTick((v) => v + 1);
  }

  function handleDiaryPinReset() {
    resetDiaryPin();
    setDiaryPinExists(false);
    setDiaryPinResetDone(true);
  }

  function handleResetProfile() {
    resetChildData();
    setProfileResetDone(true);
    setTimeout(() => window.location.reload(), 1500);
  }

  function handleDeleteAll() {
    deleteAllData();
    setTimeout(() => window.location.reload(), 1500);
  }

  async function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportBusy(true);
    setImportStatus(null);
    const result = await importBackup(file);
    setImportStatus(result);
    setImportBusy(false);
    e.target.value = '';
    if (result.ok) {
      setTimeout(() => window.location.reload(), 1500);
    }
  }

  async function handleChangePasscode() {
    const current = changeCurrentPass.trim();
    const newP = changeNewPass.trim();
    const newRepeat = changeNewPassRepeat.trim();

    if (newP.length < 6) {
      setChangePassError(
        t('adult:parent.errorTooShort', { defaultValue: 'Bitte mindestens 6 Zeichen.' })
      );
      return;
    }
    if (newP !== newRepeat) {
      setChangePassError(
        t('adult:parent.errorMismatch', { defaultValue: 'Die Passcodes stimmen nicht überein.' })
      );
      return;
    }
    const verified = await verifyParentPasscode(current);
    if (!verified) {
      setChangePassError(
        t('adult:parent.errorWrong', { defaultValue: 'Passcode stimmt nicht.' })
      );
      return;
    }
    await setParentPasscode(newP);
    setChangeCurrentPass('');
    setChangeNewPass('');
    setChangeNewPassRepeat('');
    setChangePassError('');
    setChangePassSuccess(true);
    setTimeout(() => setChangePassSuccess(false), 3000);
  }

  return (
    <Layout backPath={backTo} hideFooter>
      <div className="w-full mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">{t('adult:adult.title')}</h1>
        <p className="mt-2 text-slate-600">{t('adult:adult.subtitle')}</p>

        <div className="mt-8 space-y-4">
          <AccordionSection
            title={t('adult:accordions.overview.title', { defaultValue: 'Überblick' })}
            subtitle={t('adult:accordions.overview.subtitle', { defaultValue: 'Fortschritt und bisher sichtbare Entwicklung' })}
            badge={t('adult:accordions.overview.badge', { defaultValue: '2 Bereiche' })}
            open={openSections.overview}
            onToggle={() => toggleSection('overview')}
          >
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  {t('adult:mediaSkills.title', { defaultValue: 'Lern- und Erfahrungsmomente zur Medienkompetenz' })}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {t('adult:mediaSkills.subtitle', {
                    defaultValue:
                      'Hier siehst du, welche Themen in bereits abgeschlossenen Kapiteln bisher vorkamen und wie weit dein Kind darin schon gekommen ist.',
                  })}
                </p>

                <div className="mt-5 space-y-3">
                  {THEME_ORDER.map((themeId) => {
                    const meta = THEME_META[themeId];
                    const pts = themePoints[themeId] ?? 0;
                    const maxPts = getThemeStickerThreshold(themeId, 3);
                    const pct = Math.min(100, Math.round((pts / maxPts) * 100));
                    const level =
                      pts >= getThemeStickerThreshold(themeId, 3)
                        ? 3
                        : pts >= getThemeStickerThreshold(themeId, 2)
                        ? 2
                        : pts >= getThemeStickerThreshold(themeId, 1)
                        ? 1
                        : 0;

                    return (
                      <div key={themeId}>
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-1.5">
                            <span aria-hidden>{meta.emoji}</span>
                            <span className="truncate text-xs font-semibold text-slate-800">
                              {t(meta.parentLabelKey, { ns: 'themes', defaultValue: themeId })}
                            </span>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-xs text-slate-500">{t('adult:themes.pts', { defaultValue: '{{count}} Pkt', count: pts })}</span>
                            {level > 0 && (
                              <span className="rounded-full border border-[var(--color-teal-200)] bg-[var(--color-teal-50)] px-1.5 py-0.5 text-[10px] font-extrabold text-[var(--color-teal-700)]">
                                {t('adult:themes.level', { defaultValue: 'Stufe {{level}}', level })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-1.5 rounded-full bg-[var(--color-teal-500)] transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
                  *Die Themenfelder basieren auf den Medienkompetenzen der Kompetenzrahmen DigComp (EU), MIL (UNESCO) und dem Medienkompetenzrahmen NRW und wurden für unser Modell sprachlich angepasst.
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  {t('adult:learningTrace.title', { defaultValue: 'Wirkung' })}
                </h3>

                <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('adult:learningTrace.whatIsThis', {
                      defaultValue: 'Was bisher sichtbar wird',
                    })}
                  </div>
                  <p className="text-sm text-slate-600">
                    {t('adult:learningTrace.explanation', {
                      defaultValue:
                        'Diese App zeigt im Hintergrund, welche Tendenzen sich aus den Antworten deines Kindes in der Story ergeben. Es gibt kein Richtig oder Falsch. Alle Daten bleiben ausschließlich lokal auf diesem Gerät gespeichert und werden nicht weitergegeben oder übertragen.',
                    })}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="mb-3 text-sm font-semibold text-slate-900">
                    {t('adult:learningTrace.sectionTitle', {
                      defaultValue: 'Was bisher sichtbar wird',
                    })}
                  </div>

                  {dimensionScores.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      {t('adult:learningTrace.emptyState', {
                        defaultValue:
                          'Sobald dein Kind die ersten Story-Abschnitte erlebt hat, erscheinen hier erste Eindrücke.',
                      })}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {dimensionScores.map((ds) => {
                        const meta = DIMENSION_META[ds.dimension];
                        const label = t(meta.labelKey, { defaultValue: meta.id });
                        const levelText = t(`adult:learningTrace.levels.${ds.level}`, {
                          defaultValue: ds.level,
                        });

                        return (
                          <div key={ds.dimension} className="flex items-center gap-3">
                            <span className="text-xl leading-none" aria-hidden="true">
                              {DIMENSION_ICONS[ds.dimension]}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold leading-tight text-slate-800">
                                {label}
                              </div>
                              <div className="mt-0.5 text-xs text-slate-500">{levelText}</div>
                            </div>
                          </div>
                        );
                      })}

                      <p className="pt-1 text-xs text-slate-400">
                        {t('adult:learningTrace.itemCount', {
                          defaultValue: 'Basiert auf {{count}} Entscheidungen in der Story.',
                          count: itemCount,
                        })}{' '}
                        {t('adult:learningTrace.disclaimer', {
                          defaultValue: 'Diese Einschätzung ist keine psychologische Diagnose.',
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Level-Erklärung */}
                <details className="mt-4 group">
                  <summary className="cursor-pointer list-none text-xs font-semibold text-[var(--color-teal-700)] hover:underline">
                    <span className="group-open:hidden">▸ </span>
                    <span className="hidden group-open:inline">▾ </span>
                    {t('adult:learningTrace.levelExplanation.toggle', { defaultValue: 'Was bedeuten diese Einstufungen?' })}
                  </summary>
                  <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm">
                    <p className="text-slate-600 leading-relaxed">
                      {t('adult:learningTrace.levelExplanation.intro', {
                        defaultValue: 'Die Einstufungen zeigen, wie häufig Ihr Kind in der Story Verhaltensweisen gezeigt hat, die einem Entwicklungsbereich zugeordnet werden können – keine Bewertung, sondern eine Beobachtung.',
                      })}
                    </p>
                    <div className="mt-3 space-y-2.5">
                      {(['growing', 'visible', 'frequent'] as const).map((lvl) => (
                        <div key={lvl} className="flex gap-2.5">
                          <span className="mt-0.5 shrink-0 text-base">
                            {lvl === 'growing' ? '🌱' : lvl === 'visible' ? '📈' : '⭐'}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-800">
                              {t(`adult:learningTrace.levelExplanation.items.${lvl}.label`, { defaultValue: lvl })}
                              {' — '}
                            </span>
                            <span className="text-slate-600">
                              {t(`adult:learningTrace.levelExplanation.items.${lvl}.description`, { defaultValue: '' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
                      {t('adult:learningTrace.levelExplanation.disclaimer', {
                        defaultValue: 'Alle Einstufungen basieren ausschließlich auf dem Verhalten in der Story und sind keine psychologische oder diagnostische Aussage.',
                      })}
                    </p>
                  </div>
                </details>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  {deleteConfirmed ? (
                    <p className="text-sm text-emerald-700">
                      {t('adult:learningTrace.deleteConfirm', {
                        defaultValue: 'Alle gespeicherten Entwicklungsbereiche wurden gelöscht.',
                      })}
                    </p>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        ⚠️ {t('adult:learningTrace.deleteWarning', {
                          defaultValue: 'Das Löschen entfernt alle bisher erfassten Entwicklungsbeobachtungen unwiderruflich. Der Lernfortschritt in der Story (gespielte Kapitel, Entscheidungen) bleibt erhalten – nur die Auswertung der Entwicklungsbereiche wird zurückgesetzt.',
                        })}
                      </p>
                      <button
                        type="button"
                        onClick={handleDeleteLearningTrace}
                        className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                      >
                        {t('adult:learningTrace.deleteButton', {
                          defaultValue: 'Entwicklungsbereiche löschen',
                        })}
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </AccordionSection>

          <AccordionSection
            title={t('adult:accordions.manage.title', { defaultValue: 'App verwalten' })}
            subtitle={t('adult:accordions.manage.subtitle', { defaultValue: 'Einstellungen und Freigaben' })}
            badge={canOpenTestSettings()
              ? t('adult:accordions.manage.badge3', { defaultValue: '3 Bereiche' })
              : t('adult:accordions.manage.badge2', { defaultValue: '2 Bereiche' })}
            open={openSections.manage}
            onToggle={() => toggleSection('manage')}
          >
            <div className="space-y-6">
              <section
                id="ai-modes"
                className="rounded-2xl border border-slate-200 bg-white p-5 scroll-mt-24"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {t('adult:ai.title', { defaultValue: 'AI / Owl Mode' })}
                    </h3>
                    <div className="mt-1 text-sm text-slate-600">{t('adult:ai.owlMode.help')}</div>
                  </div>

                  <span className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
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
                  <p className="mt-1 text-sm text-slate-600">
                    {t('adult:sections.ai.performanceHint')}
                  </p>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">{t('adult:sections.ai.safeAi.title', { defaultValue: 'Safe AI' })}: </span>
                    {t('adult:sections.ai.safeAi.text', { defaultValue: 'Die KI arbeitet innerhalb klarer pädagogischer Leitplanken.' })}
                  </div>

                  <div className="mt-3">
                    <Link
                      to="/parents#ki-einsatz"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="off">{t('adult:ai.owlMode.off')}</option>
                    <option value="auto">{t('adult:ai.owlMode.auto')}</option>
                    <option value="on">{t('adult:ai.owlMode.on')}</option>
                  </select>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  {t('adult:reminders.title', { defaultValue: 'Erinnerungen' })}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {t('adult:reminders.description', {
                    defaultValue: 'Wenn ein neuer Amic verfügbar ist, kann die App dein Kind erinnern. Du entscheidest hier, ob das gewünscht ist.',
                  })}
                </p>

                <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      {remindersEnabled
                        ? t('adult:reminders.statusOn', { defaultValue: 'Erinnerungen aktiv' })
                        : t('adult:reminders.statusOff', { defaultValue: 'Erinnerungen deaktiviert' })}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {notifPermission === 'unsupported'
                        ? t('adult:reminders.unsupported', { defaultValue: 'Dieses Gerät unterstützt keine Benachrichtigungen.' })
                        : notifPermission === 'denied'
                        ? t('adult:reminders.denied', { defaultValue: 'Benachrichtigungen wurden im Browser blockiert. Bitte in den Browser-Einstellungen erlauben.' })
                        : remindersEnabled
                        ? t('adult:reminders.hintOn', { defaultValue: 'Dein Kind bekommt eine Erinnerung, wenn ein neuer Amic bereit ist.' })
                        : t('adult:reminders.hintOff', { defaultValue: 'Dein Kind bekommt keine Erinnerungen.' })}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={notifPermission === 'unsupported' || notifPermission === 'denied'}
                    onClick={handleToggleReminders}
                    className={[
                      'shrink-0 relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none disabled:opacity-40',
                      remindersEnabled ? 'bg-[var(--color-teal-600)]' : 'bg-slate-300',
                    ].join(' ')}
                    aria-pressed={remindersEnabled}
                    aria-label={t('adult:reminders.toggle', { defaultValue: 'Erinnerungen umschalten' })}
                  >
                    <span
                      className={[
                        'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                        remindersEnabled ? 'translate-x-6' : 'translate-x-1',
                      ].join(' ')}
                    />
                  </button>
                </div>

                {notifPermission === 'denied' && (
                  <p className="mt-3 text-xs text-amber-700">
                    {t('adult:reminders.deniedHint', { defaultValue: 'Um Erinnerungen zu aktivieren, Benachrichtigungen für diese Seite in den Browser-Einstellungen erlauben und dann neu laden.' })}
                  </p>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  {t('adult:unlock.title', { defaultValue: 'Freischaltcode' })}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {t('adult:unlock.description', {
                    defaultValue:
                      'Wenn du einen Freischaltcode erhalten hast, kannst du ihn hier eingeben.',
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
                  <div className={`mt-4 rounded-xl border p-3 text-sm ${statusClass}`}>
                    {statusMessage}
                  </div>
                ) : null}
              </section>

              {canOpenTestSettings() ? (
                <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-semibold text-slate-800">
                    {t('adult:testMode.title', { defaultValue: 'Testseite (optional)' })}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {t('adult:testMode.description', {
                      defaultValue:
                        'Dieser Bereich ist nur für interne Tests oder Entwicklung gedacht.',
                    })}
                  </p>
                  <div className="mt-3">
                    <Link
                      to="/test-settings"
                      className="text-sm font-semibold text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]"
                    >
                      {t('adult:testMode.openPage', { defaultValue: 'Zur Testseite →' })}
                    </Link>
                  </div>
                </section>
              ) : null}
            </div>
          </AccordionSection>

          <AccordionSection
            title={t('adult:accordions.analytics.title', { defaultValue: 'Qualitätssicherung' })}
            subtitle={t('adult:accordions.analytics.subtitle', { defaultValue: 'Freiwillige Daten zur Verbesserung der App' })}
            open={openSections.analytics}
            onToggle={() => toggleSection('analytics')}
          >
            <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-5">

              {/* Erklärung */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed">
                <p className="font-semibold text-slate-900 mb-1">{t('adult:accordions.analytics.whyTitle', { defaultValue: 'Wofür sind diese Daten?' })}</p>
                <p>{t('adult:accordions.analytics.whyBody', { defaultValue: 'Wenn du zustimmst, speichert die App anonym, welche Story-Entscheidungen dein Kind trifft — ohne Text, ohne Namen. Diese Daten helfen uns, die Wirksamkeit der App zu verstehen und sie weiterzuentwickeln.' })}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {t('adult:accordions.analytics.whyNote', { defaultValue: 'Alle Daten bleiben lokal auf diesem Gerät. Du kannst sie jederzeit herunterladen oder löschen.' })}
                </p>
              </div>

              {/* Consent Toggle */}
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-2">{t('adult:accordions.analytics.consentLabel', { defaultValue: 'Datenweitergabe zur Qualitätssicherung' })}</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setConsent(true); setConsentStatus('granted'); }}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                      consentStatus === 'granted'
                        ? 'bg-[var(--color-teal-700)] border-[var(--color-teal-700)] text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {t('adult:accordions.analytics.consentYes', { defaultValue: '✓ Ja, ich helfe gern' })}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setConsent(false); setConsentStatus('denied'); }}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                      consentStatus === 'denied'
                        ? 'bg-slate-800 border-slate-800 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {t('adult:accordions.analytics.consentNo', { defaultValue: 'Nein danke' })}
                  </button>
                </div>
                {consentStatus === 'granted' && (
                  <p className="mt-2 text-xs text-[var(--color-teal-700)]">
                    {t('adult:accordions.analytics.consentActiveNote', { defaultValue: 'Aktiv — Entscheidungsdaten werden lokal gespeichert.' })}
                  </p>
                )}
                {consentStatus === 'denied' && (
                  <p className="mt-2 text-xs text-slate-500">{t('adult:accordions.analytics.consentDeniedNote', { defaultValue: 'Deaktiviert — es werden keine Daten gespeichert.' })}</p>
                )}
              </div>

              {/* Stats */}
              {consentStatus === 'granted' && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t('adult:accordions.analytics.statsHeading', { defaultValue: 'Gespeicherte Daten' })}</div>
                  <div className="text-sm text-slate-800">
                    {t('adult:accordions.analytics.statsDecisions', { defaultValue: 'Story-Entscheidungen erfasst:' })} <span className="font-extrabold">{decisionCount}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {t('adult:accordions.analytics.statsWhatStored', { defaultValue: 'Was gespeichert wird: Schritt-ID, Score (A/B/C), Themen-Tag, Anzahl Versuche, Datum.' })}<br />
                    {t('adult:accordions.analytics.statsWhatNot', { defaultValue: 'Was nicht gespeichert wird: Texteingaben, Namen, Standort.' })}
                  </p>
                </div>
              )}

              {/* Export / Share */}
              {consentStatus === 'granted' && decisionCount > 0 && (
                <div>
                  <div className="text-sm font-semibold text-slate-900 mb-2">{t('adult:accordions.analytics.shareTitle', { defaultValue: 'Daten teilen oder herunterladen' })}</div>
                  <p className="text-xs text-slate-500 mb-3">
                    {t('adult:accordions.analytics.shareHint', { defaultValue: 'Auf dem Handy öffnet sich der Share-Dialog — du kannst die Datei per E-Mail oder einem anderen Kanal senden. Auf dem Computer wird eine JSON-Datei heruntergeladen.' })}
                  </p>
                  <button
                    type="button"
                    disabled={shareStatus === 'sharing'}
                    onClick={async () => {
                      setShareStatus('sharing');
                      const completed = Object.entries(profile.progress?.completedChapters ?? {})
                        .filter(([, done]) => done)
                        .map(([key]) => key);
                      const result = await shareOrDownloadAnalytics({
                        chaptersCompleted: completed,
                        currentEpisodeId: profile.progress?.current?.episodeId,
                        themePoints: profile.progress?.themePoints ?? {},
                      });
                      setShareStatus(result === 'error' ? 'error' : 'done');
                      setTimeout(() => setShareStatus('idle'), 4000);
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {shareStatus === 'sharing'
                      ? t('adult:accordions.analytics.shareBusy', { defaultValue: 'Wird vorbereitet …' })
                      : t('adult:accordions.analytics.shareButton', { defaultValue: '📤 Daten teilen / herunterladen' })}
                  </button>
                  {shareStatus === 'done' && (
                    <p className="mt-2 text-xs text-emerald-700">{t('adult:accordions.analytics.shareDone', { defaultValue: 'Erfolgreich geteilt oder heruntergeladen.' })}</p>
                  )}
                  {shareStatus === 'error' && (
                    <p className="mt-2 text-xs text-red-700">{t('adult:accordions.analytics.shareError', { defaultValue: 'Fehler beim Teilen. Bitte nochmal versuchen.' })}</p>
                  )}
                </div>
              )}

              {/* Löschen */}
              {consentStatus === 'granted' && decisionCount > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  {analyticsClearDone ? (
                    <p className="text-sm text-emerald-700">{t('adult:accordions.analytics.clearDone', { defaultValue: 'Alle Analysedaten wurden gelöscht.' })}</p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        clearAnalytics();
                        setDecisionCount(0);
                        setAnalyticsClearDone(true);
                      }}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      {t('adult:accordions.analytics.clearButton', { defaultValue: 'Analysedaten löschen' })}
                    </button>
                  )}
                </div>
              )}
            </section>
          </AccordionSection>

          <AccordionSection
            title={t('adult:accordions.transparency.title', { defaultValue: 'Datenschutz & Transparenz' })}
            subtitle={t('adult:accordions.transparency.subtitle', { defaultValue: 'Welche Daten lokal gespeichert werden' })}
            badge={t('adult:accordions.transparency.badge', { defaultValue: '1 Bereich' })}
            open={openSections.transparency}
            onToggle={() => toggleSection('transparency')}
          >
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                {t('adult:privacy.title', { defaultValue: 'Datenschutz & gespeicherte Daten' })}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {t('adult:privacy.intro', {
                  defaultValue:
                    'Diese App speichert alle Daten ausschließlich lokal auf diesem Gerät. Es werden keine Daten an Server übertragen oder weitergegeben.',
                })}
              </p>

              <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                {[
                  {
                    label: t('adult:privacy.items.profile', { defaultValue: 'Kinderprofil' }),
                    detail: t('adult:privacy.items.profileDetail', {
                      defaultValue: 'Avatar, Münzen, Sticker, Abzeichen',
                    }),
                  },
                  {
                    label: t('adult:privacy.items.progress', { defaultValue: 'Lernfortschritt' }),
                    detail: t('adult:privacy.items.progressDetail', {
                      defaultValue:
                        'Abgeschlossene Kapitel, Anzahl der behandelten Themen in der Story',
                    }),
                  },
                  {
                    label: t('adult:privacy.items.traces', { defaultValue: 'Entwicklungsbereiche' }),
                    detail: t('adult:privacy.items.tracesDetail', {
                      defaultValue: 'Reaktionen auf Situationen in der Story (lokal, anonym)',
                    }),
                  },
                  {
                    label: t('adult:privacy.items.passcode', { defaultValue: 'Eltern-Passcode' }),
                    detail: t('adult:privacy.items.passcodeDetail', {
                      defaultValue: 'Als SHA-256-Hash – nicht lesbar, nur lokal',
                    }),
                  },
                  {
                    label: t('adult:privacy.items.diary', { defaultValue: 'Tagebuch' }),
                    detail: t('adult:privacy.items.diaryDetail', {
                      defaultValue:
                        'Persönliche Einträge des Kindes (lokal, PIN-geschützt möglich)',
                    }),
                  },
                  {
                    label: t('adult:privacy.items.settings', { defaultValue: 'App-Einstellungen' }),
                    detail: t('adult:privacy.items.settingsDetail', {
                      defaultValue: 'Spracheinstellung, Eule-Modus',
                    }),
                  },
                  {
                    label: t('adult:accordions.analytics.privacyLabel', { defaultValue: 'Qualitätssicherung (optional)' }),
                    detail: t('adult:accordions.analytics.privacyDetail', { defaultValue: 'Nur bei Zustimmung: anonyme Entscheidungsdaten (Schritt-ID, Score, Thema, Datum). Kein Freitext, kein Name. Lokal gespeichert, manuell exportierbar.' }),
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-teal-400)]" />
                    <span>
                      <span className="font-semibold text-slate-800">{item.label}:</span>{' '}
                      <span className="text-slate-600">{item.detail}</span>
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs text-slate-400">
                {t('adult:privacy.note', {
                  defaultValue:
                    'Wenn du diesen Browser-Speicher oder die App-Daten löschst, werden alle Daten unwiderruflich entfernt.',
                })}
              </p>
            </section>
          </AccordionSection>

          <AccordionSection
            title={t('adult:accordions.protection.title', { defaultValue: 'Schutz & Sicherung' })}
            subtitle={t('adult:accordions.protection.subtitle', { defaultValue: 'Passcode, Tagebuchschutz und Backup' })}
            badge={t('adult:accordions.protection.badge', { defaultValue: '3 Bereiche' })}
            open={openSections.protection}
            onToggle={() => toggleSection('protection')}
          >
            <div className="space-y-6">
              {hasParentPasscode() && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {t('adult:parent.changeTitle', { defaultValue: 'Passcode ändern' })}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {t('adult:parent.changeHint', {
                      defaultValue: 'Gib zuerst den aktuellen Passcode ein, dann den neuen.',
                    })}
                  </p>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-xs text-slate-500">
                        {t('adult:parent.changeCurrent', { defaultValue: 'Aktueller Passcode' })}
                      </label>
                      <input
                        type="password"
                        value={changeCurrentPass}
                        onChange={(e) => setChangeCurrentPass(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">
                        {t('adult:parent.changeNew', {
                          defaultValue: 'Neuer Passcode (mind. 6 Zeichen)',
                        })}
                      </label>
                      <input
                        type="password"
                        value={changeNewPass}
                        onChange={(e) => setChangeNewPass(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">
                        {t('adult:parent.changeRepeat', {
                          defaultValue: 'Neuer Passcode wiederholen',
                        })}
                      </label>
                      <input
                        type="password"
                        value={changeNewPassRepeat}
                        onChange={(e) => setChangeNewPassRepeat(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                  </div>

                  {changePassError && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {changePassError}
                    </div>
                  )}
                  {changePassSuccess && (
                    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                      {t('adult:parent.changeSuccess', {
                        defaultValue: 'Passcode wurde erfolgreich geändert.',
                      })}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleChangePasscode}
                    className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    {t('adult:parent.changeSave', { defaultValue: 'Passcode ändern' })}
                  </button>
                </section>
              )}

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  {t('adult:diary.title', { defaultValue: 'Kinder-Tagebuch' })}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {t('adult:diary.body', {
                    defaultValue:
                      'Das persönliche Tagebuch deines Kindes kann mit einem PIN geschützt werden. Wenn dein Kind seinen PIN vergessen hat, kannst du ihn hier zurücksetzen. Die Einträge bleiben dabei erhalten.',
                  })}
                </p>

                <div className="mt-4">
                  {!diaryPinExists ? (
                    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                      {t('adult:diary.noPin', {
                        defaultValue: 'Das Tagebuch ist aktuell nicht mit einem PIN geschützt.',
                      })}
                    </div>
                  ) : diaryPinResetDone ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                      {t('adult:diary.resetDone', {
                        defaultValue:
                          'PIN wurde zurückgesetzt. Dein Kind kann beim nächsten Öffnen einen neuen PIN festlegen.',
                      })}
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        {t('adult:diary.resetWarning', {
                          defaultValue:
                            'Der Tagebuch-PIN wird gelöscht. Alle Einträge bleiben erhalten.',
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={handleDiaryPinReset}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100"
                      >
                        {t('adult:diary.resetButton', {
                          defaultValue: 'Tagebuch-PIN zurücksetzen',
                        })}
                      </button>
                    </>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  {t('adult:backup.title', { defaultValue: 'Backup & Wiederherstellen' })}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {t('adult:backup.body', {
                    defaultValue:
                      'Speichere den Lernfortschritt als Datei auf deinem Gerät und spiele ihn auf einem anderen Gerät wieder ein. Der Eltern-Passcode wird nicht gesichert.',
                  })}
                </p>

                <div className="mt-5">
                  <div className="text-sm font-semibold text-slate-800">
                    {t('adult:backup.exportTitle', { defaultValue: 'Backup exportieren' })}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t('adult:backup.exportHint', {
                      defaultValue:
                        'Lädt eine JSON-Datei mit allen Profil- und Fortschrittsdaten herunter.',
                    })}
                  </p>
                  <button
                    type="button"
                    onClick={() => exportBackup()}
                    className="mt-3 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    {t('adult:backup.exportButton', { defaultValue: 'Backup herunterladen' })}
                  </button>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-5">
                  <div className="text-sm font-semibold text-slate-800">
                    {t('adult:backup.importTitle', { defaultValue: 'Backup einspielen' })}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t('adult:backup.importHint', {
                      defaultValue:
                        'Wähle eine zuvor gespeicherte Backup-Datei aus. Bestehende Daten werden überschrieben.',
                    })}
                  </p>

                  <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100">
                    {importBusy
                      ? t('adult:backup.importing', { defaultValue: 'Wird importiert …' })
                      : t('adult:backup.importButton', {
                          defaultValue: 'Backup-Datei auswählen …',
                        })}
                    <input
                      type="file"
                      accept=".json,application/json"
                      className="sr-only"
                      disabled={importBusy}
                      onChange={handleImportFile}
                    />
                  </label>

                  {importStatus && (
                    <div
                      className={`mt-3 rounded-xl border px-3 py-2 text-sm ${
                        importStatus.ok
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border-red-200 bg-red-50 text-red-700'
                      }`}
                    >
                      {importStatus.ok
                        ? t('adult:backup.importSuccess', {
                            defaultValue:
                              'Backup eingespielt ({{count}} Einträge). App wird neu geladen …',
                            count: importStatus.restoredKeys,
                          })
                        : importStatus.error}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </AccordionSection>

          <AccordionSection
            title={t('adult:accordions.danger.title', { defaultValue: 'Zurücksetzen & Löschen' })}
            subtitle={t('adult:accordions.danger.subtitle', { defaultValue: 'Sensible Aktionen mit möglichem Datenverlust' })}
            badge={t('adult:accordions.danger.badge', { defaultValue: '2 Aktionen' })}
            open={openSections.danger}
            onToggle={() => toggleSection('danger')}
            tone="danger"
          >
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  {t('adult:reset.profileTitle', { defaultValue: 'Kinderprofil zurücksetzen' })}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {t('adult:reset.profileBody', {
                    defaultValue:
                      'Löscht alle Lernfortschritte, Sticker, Münzen und Entwicklungsbereiche des Kindes. Der Eltern-Passcode und die App-Einstellungen bleiben erhalten.',
                  })}
                </p>

                <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                  {t('adult:reset.profileWarning', {
                    defaultValue:
                      'Diese Aktion kann nicht rückgängig gemacht werden. Alle Fortschritte gehen verloren.',
                  })}
                </div>

                {profileResetDone ? (
                  <p className="mt-4 text-sm font-semibold text-emerald-700">
                    {t('adult:reset.profileDone', {
                      defaultValue: 'Profil wird zurückgesetzt …',
                    })}
                  </p>
                ) : (
                  <>
                    <label className="mt-4 flex cursor-pointer select-none items-center gap-2">
                      <input
                        type="checkbox"
                        checked={profileResetConfirmed}
                        onChange={(e) => setProfileResetConfirmed(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 accent-red-600"
                      />
                      <span className="text-sm text-slate-700">
                        {t('adult:reset.profileCheckbox', {
                          defaultValue:
                            'Ich verstehe, dass alle Kinderdaten unwiderruflich gelöscht werden.',
                        })}
                      </span>
                    </label>

                    <button
                      type="button"
                      disabled={!profileResetConfirmed}
                      onClick={handleResetProfile}
                      className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t('adult:reset.profileButton', {
                        defaultValue: 'Kinderprofil jetzt zurücksetzen',
                      })}
                    </button>
                  </>
                )}
              </section>

              <section className="rounded-2xl border border-red-100 bg-white p-5">
                <h3 className="text-lg font-semibold text-red-800">
                  {t('adult:reset.allTitle', { defaultValue: 'Alle lokalen Daten löschen' })}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {t('adult:reset.allBody', {
                    defaultValue:
                      'Löscht sämtliche auf diesem Gerät gespeicherten App-Daten – inklusive Kinderprofil, Eltern-Passcode und App-Einstellungen. Entspricht einer vollständigen Datenlöschung gemäß DSGVO.',
                  })}
                </p>

                {deleteAllStep === 'idle' ? (
                  <button
                    type="button"
                    onClick={() => setDeleteAllStep('confirm')}
                    className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    {t('adult:reset.allButton', { defaultValue: 'Alle Daten löschen …' })}
                  </button>
                ) : (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-800">
                      {t('adult:reset.allConfirmTitle', {
                        defaultValue: 'Bist du sicher?',
                      })}
                    </p>
                    <p className="mt-1 text-sm text-red-700">
                      {t('adult:reset.allConfirmBody', {
                        defaultValue:
                          'Nach dem Löschen sind alle Daten dieser App auf diesem Gerät unwiderruflich entfernt. Die App startet danach neu.',
                      })}
                    </p>

                    <label className="mt-3 flex cursor-pointer select-none items-center gap-2">
                      <input
                        type="checkbox"
                        checked={deleteAllConfirmed}
                        onChange={(e) => setDeleteAllConfirmed(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 accent-red-600"
                      />
                      <span className="text-sm text-red-800">
                        {t('adult:reset.allCheckbox', {
                          defaultValue: 'Ja, ich möchte alle Daten unwiderruflich löschen.',
                        })}
                      </span>
                    </label>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        disabled={!deleteAllConfirmed}
                        onClick={handleDeleteAll}
                        className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {t('adult:reset.allConfirmButton', {
                          defaultValue: 'Jetzt alles löschen',
                        })}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteAllStep('idle');
                          setDeleteAllConfirmed(false);
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {t('adult:reset.allCancel', { defaultValue: 'Abbrechen' })}
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </AccordionSection>
        </div>

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