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
import { saveSettings, loadSettings } from '../settings/appSettings';
import AvatarLookCircle from '../components/AvatarLookCircle';
import { useTranslation as useI18n } from 'react-i18next';

type Step = 'welcome' | 'info' | 'avatar' | 'ready';

function ProgressDots({ step }: { step: Step }) {
  const steps: Step[] = ['welcome', 'info', 'avatar', 'ready'];
  return (
    <div className="flex justify-center gap-2 pb-6">
      {steps.map(s => (
        <div
          key={s}
          className={[
            'h-2 rounded-full transition-all duration-300',
            s === step ? 'bg-teal-500 w-5' : 'bg-slate-200 w-2',
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

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation('welcome');
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
        <p className="text-base text-slate-700 leading-relaxed">
          {t('onboarding.welcome.lead')}
        </p>

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
      <h2 className="text-xl font-bold text-anthracite-900 text-center mb-4">
        {t('onboarding.info.title')}
      </h2>

      <div className="flex flex-col gap-3 mb-5">
        <div className="flex gap-3 items-start bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <span className="text-2xl leading-none mt-0.5">💬</span>
          <div>
            <div className="text-sm font-bold text-slate-900">{t('onboarding.info.amicTitle')}</div>
            <div className="text-xs text-slate-600 mt-0.5 leading-snug">{t('onboarding.info.amicExplain')}</div>
          </div>
        </div>
        {features.map(f => (
          <div key={f.titleKey} className="flex gap-3 items-start bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <span className="text-2xl leading-none mt-0.5">{f.emoji}</span>
            <div>
              <div className="text-sm font-bold text-slate-900">{t(`onboarding.info.${f.titleKey}`)}</div>
              <div className="text-xs text-slate-600 mt-0.5 leading-snug">{t(`onboarding.info.${f.bodyKey}`)}</div>
            </div>
          </div>
        ))}
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

function ReadyStep({ onFinish }: { onFinish: (destination: 'story' | 'overview') => void }) {
  const { t } = useTranslation('welcome');
  const [remindersOn, setRemindersOn] = useState(loadSettings().remindersEnabled);

  function handleToggleReminders() {
    const next = !remindersOn;
    setRemindersOn(next);
    if (next && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(perm => {
        if (perm !== 'granted') setRemindersOn(false);
        else saveSettings({ remindersEnabled: true });
      });
    } else {
      saveSettings({ remindersEnabled: next });
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

      {/* Reminders-Toggle */}
      <div className="flex items-center justify-between w-full max-w-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-5">
        <span className="text-sm font-semibold text-slate-700 text-left leading-snug">
          {t('onboarding.ready.remindersLabel')}
        </span>
        <Toggle on={remindersOn} onToggle={handleToggleReminders} />
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => onFinish('story')}
          className="w-full bg-[var(--color-teal-600)] hover:bg-[var(--color-teal-700)] active:scale-[0.98] text-white font-bold rounded-2xl py-3.5 text-base shadow-md transition-all"
        >
          {t('onboarding.ready.ctaStart')}
        </button>
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
  const [step, setStep] = useState<Step>('welcome');

  function handleFinish(destination: 'story' | 'overview') {
    markFirstRunDone();
    if (destination === 'story') {
      navigate('/stories-v02/s1e01/s1e01c01', { replace: true });
    } else {
      navigate('/stories', { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center relative">
      {/* Sprach-Pills fest oben rechts */}
      <div className="fixed top-4 right-4 z-50">
        <LangPills />
      </div>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl mt-8 mb-8 mx-4 overflow-hidden">
        {step === 'welcome' && <WelcomeStep onNext={() => setStep('info')} />}
        {step === 'info' && <InfoStep onNext={() => setStep('avatar')} />}
        {step === 'avatar' && <AvatarStep onNext={() => setStep('ready')} />}
        {step === 'ready' && <ReadyStep onFinish={handleFinish} />}
        <ProgressDots step={step} />
      </div>
    </div>
  );
}
