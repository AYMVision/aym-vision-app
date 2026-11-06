import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { assetUrl } from '../common/assetUrl';
import { cn } from '../common/utils';

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm font-semibold',
      'bg-white/80 border border-white/60 text-[var(--color-teal-900)] backdrop-blur'
    )}>
      {children}
    </span>
  );
}

function Panel({ title, kicker, children }: { title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
      {kicker && <div className="text-xs font-semibold text-[var(--color-teal-600)] uppercase tracking-wide">{kicker}</div>}
      <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">{title}</h2>
      <div className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

export default function FuerSchulen() {
  const { t } = useTranslation('marketing');

  return (
    <Layout>
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden rounded-3xl border border-white/50 shadow-lg bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-teal-50)] via-white to-white" />
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[var(--color-teal-200)]/30 blur-2xl" />
          <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-6 p-6 sm:p-10 lg:pr-6 flex flex-col justify-center">
              <div className="text-xs sm:text-sm font-semibold text-[var(--color-teal-700)]">{t('schools.kicker')}</div>
              <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--color-teal-900)] leading-tight">
                {t('schools.hero')}
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed">{t('schools.heroLead')}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge>{t('schools.badge1')}</Badge>
                <Badge>{t('schools.badge2')}</Badge>
                <Badge>{t('schools.badge3')}</Badge>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/anfrage" className="inline-flex items-center justify-center rounded-2xl px-7 py-3.5 text-base font-bold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors shadow-md">
                  {t('schools.ctaButton')}
                </Link>
                <Link to="/concept" className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors">
                  {t('schools.ctaSecondary')}
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px]">
              <img
                src={assetUrl('media/ui/welcome/exp-reflect-1024.webp')}
                alt={t('schools.heroImgAlt')}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ── BIG STATEMENT ── */}
        <div className="rounded-3xl bg-[var(--color-teal-900)] p-8 sm:p-12 text-center">
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-relaxed max-w-3xl mx-auto">
            {t('schools.bigStatement')}
          </p>
        </div>

        {/* ── CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">

          {/* Main column */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">

            <Panel kicker={t('schools.kicker')} title={t('schools.learnTitle')}>
              <p className="mb-4">{t('schools.learnIntro')}</p>
              <ul className="space-y-2">
                {(['learn1', 'learn2', 'learn3', 'learn4'] as const).map(key => (
                  <li key={key} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-[var(--color-teal-600)] font-bold">✓</span>
                    <span>{t(`schools.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel kicker={t('schools.kicker')} title={t('schools.howTitle')}>
              <ol className="space-y-4">
                {(['how1', 'how2', 'how3', 'how4'] as const).map((key, i) => (
                  <li key={key} className="flex items-start gap-4">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-[var(--color-teal-100)] text-[var(--color-teal-700)] font-extrabold text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{t(`schools.${key}`)}</span>
                  </li>
                ))}
              </ol>
            </Panel>

            <div className="rounded-2xl border border-[var(--color-teal-200)] bg-[var(--color-teal-50)] p-5 sm:p-6">
              <div className="text-xs font-semibold text-[var(--color-teal-700)] uppercase tracking-wide">{t('schools.pilotSub')}</div>
              <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">{t('schools.pilotTitle')}</h2>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">{t('schools.pilotText')}</p>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="text-xs font-semibold text-[var(--color-teal-600)] uppercase tracking-wide">{t('schools.kicker')}</div>
              <div className="mt-2 font-semibold text-slate-900">{t('schools.quickFactsTitle')}</div>
              <ul className="mt-3 space-y-2">
                {(['fact1', 'fact2', 'fact3', 'fact4'] as const).map(key => (
                  <li key={key} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal-500)] shrink-0" />
                    {t(`schools.${key}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="text-xs font-semibold text-[var(--color-teal-600)] uppercase tracking-wide">Datenschutz</div>
              <div className="mt-2 font-semibold text-slate-900">{t('schools.dsgvoTitle')}</div>
              <ul className="mt-3 space-y-2">
                {(['dsgvo1', 'dsgvo2', 'dsgvo3'] as const).map(key => (
                  <li key={key} className="text-xs text-slate-500 leading-relaxed">{t(`schools.${key}`)}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--color-teal-700)] rounded-2xl p-5 text-center space-y-3">
              <p className="text-lg font-extrabold text-white">{t('schools.ctaButton')}</p>
              <p className="text-sm text-[var(--color-teal-100)] leading-relaxed">{t('schools.ctaText', { defaultValue: 'Wir melden uns innerhalb von zwei Werktagen.' })}</p>
              <Link to="/anfrage" className="block w-full py-3.5 rounded-xl bg-white text-[var(--color-teal-700)] font-extrabold text-base hover:bg-[var(--color-teal-50)] transition-colors">
                {t('schools.ctaButton')} →
              </Link>
            </div>

          </div>
        </div>

        {/* ── ÜBER AYM VISION ── */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 sm:p-8">
          <div className="text-xs font-semibold text-[var(--color-teal-600)] uppercase tracking-wide">{t('about.kicker')}</div>
          <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl">{t('about.text')}</p>
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-4">{t('about.partnerTitle')}</p>
            <div className="flex items-center gap-6 flex-wrap">
              <a href="https://hafven.de/impact-accelerator" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-90 transition-opacity">
                <img src={assetUrl('media/ui/HafvenImpactAccelerator_Logo_schwarz.png')} alt={t('about.hafvenAlt')} className="h-6 w-auto" loading="lazy" />
              </a>
              <a href="https://www.nbank.de" target="_blank" rel="noopener noreferrer" className="opacity-75 hover:opacity-100 transition-opacity">
                <img src={assetUrl('media/ui/Siegel_Gründungsstipendium_Start-up_2024.png')} alt={t('about.nbankAlt')} className="h-10 w-auto" loading="lazy" />
              </a>
              <a href="https://www.braunschweig.de/wirtschaft_wissenschaft/innovationsfoerderung/win_startup_akademie_fuer_wachstum_und_innovation.php" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-90 transition-opacity">
                <img src={assetUrl('media/ui/300_WIN_Logo_2022_BS_Unterstuetzung.webp')} alt={t('about.winAlt')} className="h-10 w-auto" loading="lazy" />
              </a>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
