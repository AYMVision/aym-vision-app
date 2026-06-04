// src/pages/Onboarding.tsx
// 3-step onboarding: Welcome (Amy Surfwing), Avatar + Sound, Ready + Reminders

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isStandalonePwa } from '../common/usePwaContext';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../profile/useProfile';
import { AVATAR_BASES } from '../data/avatars';
import { assetUrl } from '../common/assetUrl';
import { markFirstRunDone } from '../common/firstRun';
import { BETA_ACTIVE, getPendingBetaCode, setBetaCodeApplied, clearPendingBetaCode, BETA_END_DATE_DISPLAY, BETA_CONTACT_EMAIL } from '../beta/betaConfig';
import { applyUnlockCode } from '../gating/unlockCodes';
import { setConsent } from '../analytics/consent';
import { loadSettings } from '../settings/appSettings';
import {
  enableReminders,
  disableReminders,
  getReminderCapability,
  getReminderHint,
} from '../notifications/reminderService';
import AvatarLookCircle from '../components/AvatarLookCircle';
import { useTranslation as useI18n } from 'react-i18next';

type Step = 'welcome' | 'info' | 'avatar' | 'ready' | 'beta';

function ProgressDots({ step, isBeta }: { step: Step; isBeta: boolean }) {
  const steps: Step[] = isBeta
    ? ['welcome', 'info', 'avatar', 'ready', 'beta']
    : ['welcome', 'info', 'avatar', 'ready'];
  return (
    <div className="flex justify-center gap-2 pb-6">
      {steps.map(s => (
        <div
          key={s}
          className={[
            'h-2 rounded-full transition-all duration-300',
            s === step
              ? (s === 'beta' ? 'bg-violet-500 w-5' : 'bg-teal-500 w-5')
              : 'bg-slate-200 w-2',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={[
        'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400',
        on ? 'bg-teal-500' : 'bg-slate-200',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
          on ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  );
}

function WelcomeStep({ onNext, isBeta }: { onNext: () => void; isBeta: boolean }) {
  const { t } = useTranslation('welcome');
  const { t: tStories } = useTranslation('stories');
  return (
    <div className="flex flex-col">
      {/* Hero — gleiche Grafik wie Stories-Seite */}
      <div className="relative overflow-hidden rounded-t-3xl min-h-[220px]">
        <img
          src={assetUrl('media/ui/stories/stories-hero-512.webp')}
          alt={t('onboarding.welcome.imageAlt')}
          className="w-full h-full object-cover object-top absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />

        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-white/90 backdrop-blur text-teal-700 border border-white/60">
            {t('onboarding.welcome.badge')}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-extrabold text-white leading-tight whitespace-pre-line">
            {t('onboarding.welcome.title')}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pt-5 pb-4 flex flex-col gap-4">
        {isBeta && (
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-2xl px-4 py-3">
            <span className="text-base">🧪</span>
            <div>
              <div className="text-xs font-extrabold text-violet-600 uppercase tracking-widest leading-none mb-0.5">
                {tStories('beta.welcome.kicker')}
              </div>
              <div className="text-xs text-violet-700 leading-snug">
                {tStories('beta.welcome.subline')}
              </div>
            </div>
          </div>
        )}
        <p className="text-base text-slate-700 leading-relaxed">
          {t('onboarding.welcome.lead')}
        </p>

        {/* Charakter-Reihe */}
        <div className="flex items-end justify-between gap-1">
          {[
            { name: 'Mia',    id: 'mia'    },
            { name: 'Chioma', id: 'chioma' },
            { name: 'Carlos', id: 'carlos' },
            { name: 'Yasmin', id: 'yasmin' },
            { name: 'Igor',   id: 'igor'   },
          ].map(c => (
            <div key={c.id} className="flex flex-col items-center gap-1 flex-1">
              <img
                src={assetUrl(`media/story/characters/${c.id}-256.webp`)}
                alt={c.name}
                className="w-12 h-12 rounded-full object-cover object-top border-2 border-white shadow-sm"
              />
              <span className="text-[10px] font-semibold text-slate-500">{c.name}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {(['badge0', 'badge1', 'badge2'] as const).map(key => (
            <span
              key={key}
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white border border-slate-200 text-slate-700"
            >
              {t(`onboarding.welcome.${key}`)}
            </span>
          ))}
        </div>

        <button
          onClick={onNext}
          className="w-full bg-[var(--color-teal-600)] hover:bg-[var(--color-teal-700)] active:scale-[0.98] text-white font-bold rounded-2xl py-3.5 text-base shadow-md transition-all mt-1"
        >
          {t('onboarding.welcome.cta')}
        </button>
      </div>
    </div>
  );
}

function InfoStep({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation('welcome');

  const features = [
    { emoji: '📱', titleKey: 'feature1title', bodyKey: 'feature1body' },
    { emoji: '🏆', titleKey: 'feature2title', bodyKey: 'feature2body' },
    { emoji: '🌐', titleKey: 'feature0title', bodyKey: 'feature0body' },
  ] as const;

  return (
    <div className="flex flex-col px-5 pt-6 pb-4">
      {/* Amy als Erzählerin */}
      <div className="flex items-center gap-3 mb-5">
        <img
          src={assetUrl('media/story/characters/amy-256.webp')}
          alt="Amy"
          className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0 border-2 border-teal-100 shadow-sm"
        />
        <div className="bg-teal-50 border border-teal-100 rounded-2xl px-4 py-2.5 text-sm font-semibold text-teal-800 leading-snug">
          {t('onboarding.info.amyIntro')}
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-5">
        {features.map(f => (
          <div key={f.titleKey} className="flex gap-3 items-start bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <span className="text-2xl leading-none mt-0.5">{f.emoji}</span>
            <div>
              <div className="text-sm font-bold text-slate-900">{t(`onboarding.info.${f.titleKey}`)}</div>
              <div className="text-xs text-slate-600 mt-0.5 leading-snug">{t(`onboarding.info.${f.bodyKey}`)}</div>
            </div>
          </div>
        ))}
        <div className="flex gap-3 items-start bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <span className="text-2xl leading-none mt-0.5">💬</span>
          <div>
            <div className="text-sm font-bold text-slate-900">{t('onboarding.info.amicTitle')}</div>
            <div className="text-xs text-slate-600 mt-0.5 leading-snug">{t('onboarding.info.amicExplain')}</div>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-[var(--color-teal-600)] hover:bg-[var(--color-teal-700)] active:scale-[0.98] text-white font-bold rounded-2xl py-3.5 text-base shadow-md transition-all"
      >
        {t('onboarding.info.cta')}
      </button>
    </div>
  );
}

function AvatarStep({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation('welcome');
  const { profile, updateProfile } = useProfile();
  const [selected, setSelected] = useState(profile.avatarBaseId ?? 'kid_01');
  const [soundOn, setSoundOn] = useState(profile.soundEnabled !== false);

  function handleConfirm() {
    updateProfile(prev => ({ ...prev, avatarBaseId: selected, soundEnabled: soundOn }));
    onNext();
  }

  return (
    <div className="flex flex-col px-5 pt-6 pb-4">
      <h2 className="text-xl font-bold text-anthracite-900 text-center mb-1">
        {t('onboarding.avatar.title')}
      </h2>
      <p className="text-sm text-slate-500 text-center mb-4">
        {t('onboarding.avatar.hint')}
      </p>

      <div className="grid grid-cols-4 gap-3 mb-5 max-h-64 overflow-y-auto">
        {AVATAR_BASES.map(avatar => (
          <button
            key={avatar.id}
            onClick={() => setSelected(avatar.id)}
            className={[
              'rounded-full transition-all flex items-center justify-center',
              selected === avatar.id
                ? 'ring-[3px] ring-teal-500 scale-110 shadow-md'
                : 'opacity-70 hover:opacity-100',
            ].join(' ')}
          >
            <AvatarLookCircle
              avatarBaseId={avatar.id}
              size={64}
              alt={avatar.label}
            />
          </button>
        ))}
      </div>

      {/* Sound-Toggle */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-5">
        <span className="text-sm font-semibold text-slate-700">
          {t('onboarding.avatar.soundLabel')}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {soundOn ? t('onboarding.avatar.soundOn') : t('onboarding.avatar.soundOff')}
          </span>
          <Toggle on={soundOn} onToggle={() => setSoundOn(v => !v)} />
        </div>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full bg-[var(--color-teal-600)] hover:bg-[var(--color-teal-700)] active:scale-[0.98] text-white font-bold rounded-2xl py-3.5 text-base shadow-md transition-all"
      >
        {t('onboarding.avatar.cta')}
      </button>
    </div>
  );
}

function ReadyStep({ onFinish, isBeta }: { onFinish: (destination: 'story' | 'overview') => void; isBeta: boolean }) {
  const { t } = useTranslation('welcome');
  const { t: tStories } = useTranslation('stories');
  const [remindersOn, setRemindersOn] = useState(loadSettings().remindersEnabled);
  const reminderCap = getReminderCapability();

  async function handleToggleReminders() {
    if (remindersOn) {
      await disableReminders();
      setRemindersOn(false);
    } else {
      const ok = await enableReminders();
      setRemindersOn(ok);
    }
  }

  return (
    <div className="flex flex-col items-center text-center px-6 pt-8 pb-4">
      <video
        src="/media/ui/Amy_Video_Intro.MP4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full max-h-48 object-cover mb-4 rounded-2xl"
      />
      <h2 className="text-2xl font-bold text-anthracite-900 leading-tight mb-2">
        {t('onboarding.ready.title')}
      </h2>
      <p className="text-base text-slate-600 leading-relaxed max-w-xs mb-5">
        {t('onboarding.ready.lead')}
      </p>

      {/* Reminders-Toggle — nur in installierter PWA sinnvoll */}
      {isStandalonePwa() && reminderCap !== 'none' && (
        <div className="w-full max-w-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-700 text-left leading-snug">
              {t('onboarding.ready.remindersLabel')}
            </span>
            <Toggle on={remindersOn} onToggle={handleToggleReminders} />
          </div>
          <p className="mt-1.5 text-xs text-slate-500 text-left leading-snug">
            {getReminderHint(remindersOn)}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => onFinish('story')}
          className="w-full bg-[var(--color-teal-600)] hover:bg-[var(--color-teal-700)] active:scale-[0.98] text-white font-bold rounded-2xl py-3.5 text-base shadow-md transition-all"
        >
          {isBeta ? tStories('beta.ready.cta', { defaultValue: 'Weiter →' }) : t('onboarding.ready.ctaStart', { defaultValue: 'Los geht\'s →' })}
        </button>
        {!isBeta && (
          <>
            <button
              onClick={() => onFinish('overview')}
              className="w-full bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-semibold rounded-2xl py-3 text-base border border-slate-200 transition-all"
            >
              {t('onboarding.ready.ctaOverview')}
            </button>
            <Link
              to="/parents"
              className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium py-2 transition-colors"
            >
              {t('onboarding.ready.ctaParents')}
            </Link>
          </>
        )}
      </div>

      {/* Install hint — only when not already in PWA mode */}
      {!isStandalonePwa() && (
        <div className="mt-5 w-full max-w-xs rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">📲</span>
            <span className="text-xs font-bold text-slate-800">
              {t('onboarding.ready.installTitle', { defaultValue: 'App zum Home-Bildschirm hinzufügen' })}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-2">
            {t('onboarding.ready.installHint', { defaultValue: 'So läuft Amy Surfwing wie eine richtige App – schneller und immer griffbereit.' })}
          </p>
          <Link
            to="/install"
            className="text-xs font-semibold text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]"
          >
            {t('onboarding.ready.installCta', { defaultValue: 'Anleitung ansehen →' })}
          </Link>
        </div>
      )}
    </div>
  );
}

function BetaStep({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation('stories');
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex flex-col px-6 pt-8 pb-5">
      <div className="flex flex-col items-center gap-3 mb-5 text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-violet-200 shadow-lg">
          <img
            src={assetUrl('media/story/characters/amy-256.webp')}
            alt="Amy"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="text-xs font-extrabold text-violet-500 uppercase tracking-widest">
          {t('beta.welcome.kicker')}
        </div>
        <h2 className="text-xl font-bold text-slate-900 leading-snug">
          {t('beta.welcome.headline')}
        </h2>
      </div>

      {/* Rahmenbedingungen */}
      <div className="flex flex-col gap-2 mb-5">
        <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2.5">
          <span className="text-base">📅</span>
          <span className="text-xs text-violet-800 leading-snug">
            {t('beta.welcome.accessUntil', { date: BETA_END_DATE_DISPLAY })}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2.5">
          <span className="text-base">⏱️</span>
          <span className="text-xs text-violet-800 leading-snug">
            {t('beta.welcome.pacing')}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2.5">
          <span className="text-base">💬</span>
          <span className="text-xs text-violet-800 leading-snug">
            {t('beta.welcome.contactHint')}{' '}
            <a
              href={`mailto:${BETA_CONTACT_EMAIL}`}
              className="font-semibold underline"
            >
              {BETA_CONTACT_EMAIL}
            </a>
          </span>
        </div>
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 bg-slate-50 rounded-2xl border border-slate-200 p-4 cursor-pointer mb-4">
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-violet-600 flex-shrink-0"
        />
        <span className="text-xs text-slate-600 leading-relaxed">
          {t('beta.welcome.consentLabel')}
        </span>
      </label>

      <button
        type="button"
        onClick={onComplete}
        disabled={!agreed}
        className={[
          'w-full py-3.5 rounded-2xl font-bold text-base transition-all mb-3',
          agreed
            ? 'bg-violet-600 text-white shadow-md hover:bg-violet-700 active:scale-[0.98]'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed',
        ].join(' ')}
      >
        {t('beta.welcome.cta')}
      </button>

      {/* Mehr Infos für Eltern */}
      <Link
        to="/parents"
        className="w-full text-center text-xs text-slate-400 hover:text-violet-600 transition-colors py-1"
      >
        {t('beta.welcome.parentsLink')}
      </Link>
    </div>
  );
}

function LangPills() {
  const { i18n } = useI18n();
  const current = (i18n.resolvedLanguage ?? i18n.language).startsWith('en') ? 'en' : 'de';
  return (
    <div className="flex gap-1">
      {(['de', 'en'] as const).map(lang => (
        <button
          key={lang}
          onClick={() => i18n.changeLanguage(lang)}
          className={[
            'px-2.5 py-1 rounded-full text-xs font-semibold transition-colors',
            current === lang
              ? 'bg-teal-600 text-white'
              : 'bg-white/80 text-slate-500 hover:text-teal-700 border border-slate-200',
          ].join(' ')}
        >
          {lang === 'de' ? '🇩🇪 DE' : '🇬🇧 EN'}
        </button>
      ))}
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { t } = useTranslation('navigation');
  const [pendingCode] = useState<string | null>(() => BETA_ACTIVE ? getPendingBetaCode() : null);
  const isBeta = !!pendingCode;
  const [step, setStep] = useState<Step>('welcome');

  const stepOrder: Step[] = isBeta
    ? ['welcome', 'info', 'avatar', 'ready', 'beta']
    : ['welcome', 'info', 'avatar', 'ready'];

  function handleFinish(destination: 'story' | 'overview') {
    markFirstRunDone();
    if (isBeta) {
      setStep('beta');
      return;
    }
    if (destination === 'story') {
      navigate('/stories-v02/s1e01/s1e01c01', { replace: true });
    } else {
      navigate('/stories', { replace: true });
    }
  }

  function handleBetaComplete() {
    applyUnlockCode(pendingCode!);
    setConsent(true);
    setBetaCodeApplied(pendingCode!);
    clearPendingBetaCode();
    navigate('/stories-v02/s1e01/s1e01c01', { replace: true });
  }

  function handleBack() {
    const idx = stepOrder.indexOf(step);
    if (idx > 0) setStep(stepOrder[idx - 1]);
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center relative">
      {/* Zurück-Pfeil — ab Schritt 2, nicht auf Beta-Step */}
      {step !== 'welcome' && step !== 'beta' && (
        <button
          onClick={handleBack}
          aria-label={t('back', { defaultValue: 'Zurück' })}
          className="fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm transition-colors"
        >
          ←
        </button>
      )}
      {/* Sprach-Pills fest oben rechts */}
      <div className="fixed top-4 right-4 z-50">
        <LangPills />
      </div>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl mt-8 mb-8 mx-4 overflow-hidden">
        {step === 'welcome' && <WelcomeStep onNext={() => setStep('info')} isBeta={isBeta} />}
        {step === 'info' && <InfoStep onNext={() => setStep('avatar')} />}
        {step === 'avatar' && <AvatarStep onNext={() => setStep('ready')} />}
        {step === 'ready' && <ReadyStep onFinish={handleFinish} isBeta={isBeta} />}
        {step === 'beta' && <BetaStep onComplete={handleBetaComplete} />}
        <ProgressDots step={step} isBeta={isBeta} />
      </div>
    </div>
  );
}
