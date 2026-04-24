import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../common/utils';

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm font-semibold',
        'bg-white/80 border border-white/60 text-[var(--color-teal-900)] backdrop-blur'
      )}
    >
      {children}
    </span>
  );
}

function Panel({
  title,
  children,
  kicker,
}: {
  title: string;
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
      {kicker ? (
        <div className="text-xs font-semibold text-[var(--color-teal-600)]">{kicker}</div>
      ) : null}
      <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
        {title}
      </h2>
      <div className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">
        {children}
      </div>
    </section>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group rounded-2xl border border-slate-100 bg-white shadow-sm"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4">
        <div className="font-semibold text-slate-900">{title}</div>
        <div className="shrink-0 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 group-open:rotate-45 transition-transform">
          +
        </div>
      </summary>
      <div className="px-5 pb-5 text-sm sm:text-base leading-relaxed text-slate-700">
        {children}
      </div>
    </details>
  );
}

function PrincipleCard({
  title,
  body,
  accentColor,
}: {
  title: string;
  body: string;
  accentColor: string;
}) {
  return (
    <div className="group bg-white hover:bg-slate-50/80 transition-colors p-5 sm:p-6 flex flex-col gap-3">
      <div className={cn('w-8 h-1 rounded-full', accentColor)} />
      <div className="text-lg sm:text-xl font-black text-slate-900 leading-none">{title}</div>
      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{body}</p>
    </div>
  );
}

function SidebarCard({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
      <div className="text-xs font-semibold text-[var(--color-teal-600)]">{kicker}</div>
      <div className="mt-2 font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">{body}</p>
    </div>
  );
}

function LearningModelStepLink({
  number,
  title,
  summary,
  targetId,
  dotColor,
  isLast = false,
}: {
  number: string;
  title: string;
  summary: string;
  targetId: string;
  dotColor: string;
  isLast?: boolean;
}) {
  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex gap-4">
      {/* Left: dot + line */}
      <div className="flex flex-col items-center shrink-0">
        <div className={cn('w-3 h-3 rounded-full mt-1.5 shrink-0', dotColor)} />
        {!isLast && <div className="w-px flex-1 bg-slate-200 mt-1" />}
      </div>

      {/* Right: content */}
      <button
        type="button"
        onClick={handleClick}
        className="group flex-1 text-left pb-5 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {title}
          </div>
          <span className="shrink-0 text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
            Mehr ↓
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500 leading-relaxed">{summary}</p>
      </button>
    </div>
  );
}

const learningModelDots = [
  'bg-sky-400',
  'bg-amber-400',
  'bg-emerald-400',
  'bg-violet-400',
  'bg-rose-400',
  'bg-indigo-400',
];

export default function Concept() {
  const { t } = useTranslation('concept');

  const principleAccents = [
    'bg-teal-400',
    'bg-sky-400',
    'bg-violet-400',
    'bg-amber-400',
    'bg-emerald-400',
  ];

  return (
    <Layout>
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* HERO */}

<section className="relative overflow-hidden rounded-3xl border border-white/50 shadow-lg">
  <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[var(--color-teal-50)]" />
  <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[var(--color-teal-200)]/30 blur-2xl" />
  <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[var(--color-teal-300)]/20 blur-2xl" />

  <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch">
    {/* TEXT */}
    <div className="lg:col-span-6 p-6 sm:p-10 lg:pr-6 flex flex-col justify-center">
      <div className="text-xs sm:text-sm font-semibold text-[var(--color-teal-700)]">
        {t('hero.kicker')}
      </div>

      <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--color-teal-900)] leading-tight">
        {t('hero.title')}
      </h1>

      <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-700 leading-relaxed">
        {t('hero.lead')}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge>{t('hero.badges.0')}</Badge>
        <Badge>{t('hero.badges.1')}</Badge>
        <Badge>{t('hero.badges.2')}</Badge>
        <Badge>{t('hero.badges.3')}</Badge>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/parents"
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
        >
          {t('hero.ctaPrimary')}
        </Link>

        <Link
          to="/stories"
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
        >
          {t('hero.ctaSecondary')}
        </Link>
      </div>
    </div>

    {/* MEDIA */}
    <div className="lg:col-span-6 relative min-h-[280px] sm:min-h-[340px] lg:min-h-[420px]">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/ui/Kids_surfen_smart-poster.jpg"
      >
        <source src="/media/ui/Kids_surfen_smart.mp4" type="video/mp4" />
      </video>

      {/* sanfter Übergang zur Textseite */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/10 to-transparent lg:from-transparent lg:via-transparent lg:to-transparent pointer-events-none" />
    </div>
  </div>
  
</section>

        {/* CONTENT GRID */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* ZIEL */}
<section id="goal-section" className="scroll-mt-24">
  <Panel kicker={t('goal.kicker')} title={t('goal.title')}>
    <p>{t('goal.body')}</p>
  </Panel>
</section>

            {/* AMY-SURFWING-LERNMODELL */}
            <section id="learning-model-top" className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6">
              <div className="text-xs font-semibold text-[var(--color-teal-600)]">
                {t('learningModel.kicker')}
              </div>

              <h2 className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">
                {t('learningModel.title')}
              </h2>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">
                {t('learningModel.intro')}
              </p>



{/* KLICKBARE SCHRITTE */}
<div className="mt-6">
  {[
    { key: '0', targetId: 'fields-section' },
    { key: '1', targetId: 'story-reflection-section' },
    { key: '2', targetId: 'skills-section' },
    { key: '3', targetId: 'learning-spiral-section' },
    { key: '4', targetId: 'dimensions-section' },
    { key: '5', targetId: 'model-section' },
  ].map(({ key, targetId }, idx) => (
    <LearningModelStepLink
      key={key}
      number={t(`learningModel.steps.${key}.number`)}
      title={t(`learningModel.steps.${key}.title`)}
      summary={t(`learningModel.steps.${key}.summary`)}
      targetId={targetId}
      dotColor={learningModelDots[idx]}
    />
  ))}

  {/* Abschluss: Medienreife */}
  <div className="flex gap-4 mt-1">
    <div className="flex flex-col items-center shrink-0">
      <div className="w-3 h-3 rounded-full mt-1.5 bg-slate-300" />
    </div>
    <button
      type="button"
      onClick={() => document.getElementById('didactic-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      className="group flex-1 text-left pb-2 hover:opacity-80 transition-opacity"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-base sm:text-lg font-bold text-slate-400 leading-snug">
          {t('learningModel.resultTitle')}
        </div>
        <span className="shrink-0 text-xs font-semibold text-slate-300 group-hover:text-slate-500 transition-colors">
          Mehr ↓
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-400 leading-relaxed">{t('learningModel.resultBody')}</p>
    </button>
  </div>
</div>
          
              
            </section>

            {/* KERNMODELL */}
<section id="model-section" className="scroll-mt-24">
  <Panel kicker={t('model.kicker')} title={t('model.title')}>
    <p>{t('model.intro')}</p>

    <div className="mt-4 text-sm sm:text-base leading-relaxed text-slate-700">
      {t('model.logic')}
    </div>

              <div className="mt-6 space-y-5">
                {/* DIGITALE LERNFELDER */}
                <section
  id="fields-section"
  className="scroll-mt-24 rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6"
>
                  <div className="text-xs font-semibold text-sky-700">{t('fields.kicker')}</div>
                  <h3 className="mt-1 text-base sm:text-lg font-semibold text-slate-900">
                    {t('fields.title')}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">
                    {t('fields.intro')}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(['0', '1', '2', '3', '4', '5', '6'] as const).map((k) => (
                      <div
                        key={k}
                        className="inline-flex items-center rounded-2xl px-3 py-2 text-xs sm:text-sm font-medium bg-white/90 text-slate-700 shadow-sm"
                      >
                        {t(`fields.items.${k}`)}
                      </div>
                    ))}
                  </div>
<button
  type="button"
  onClick={() => {
    const el = document.getElementById('learning-model-top');
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }}
  className="mt-4 inline-flex text-sm font-medium text-slate-500 hover:text-slate-700"
>
  {t('navigation.backToModel')}
</button>
                </section>

                {/* FÄHIGKEITEN */}
                <section
  id="skills-section"
  className="scroll-mt-24 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6"
>
                  <div className="text-xs font-semibold text-emerald-700">{t('skills.kicker')}</div>
                  <h3 className="mt-1 text-base sm:text-lg font-semibold text-slate-900">
                    {t('skills.title')}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">
                    {t('skills.intro')}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(['0', '1', '2', '3', '4', '5', '6'] as const).map((k) => (
                      <div
                        key={k}
                        className="inline-flex items-center rounded-2xl px-3 py-2 text-xs sm:text-sm font-medium bg-white/90 text-slate-700 shadow-sm"
                      >
                        {t(`skills.items.${k}`)}
                      </div>
                    ))}
                  </div>
                  <button
  type="button"
  onClick={() => {
    const el = document.getElementById('learning-model-top');
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }}
  className="mt-4 inline-flex text-sm font-medium text-slate-500 hover:text-slate-700"
>
  {t('navigation.backToModel')}
</button>
                </section>

                {/* WIRKDIMENSIONEN */}
                <section
  id="dimensions-section"
  className="scroll-mt-24 rounded-2xl border border-violet-200 bg-violet-50 p-5 sm:p-6"
>
                  <div className="text-xs font-semibold text-violet-700">{t('dimensions.kicker')}</div>
                  <h3 className="mt-1 text-base sm:text-lg font-semibold text-slate-900">
                    {t('dimensions.title')}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">
                    {t('dimensions.intro')}
                  </p>

                  <div className="mt-4 space-y-2">
                    {(['0', '1', '2', '3'] as const).map((k) => (
                      <details
                        key={k}
                        className="group rounded-2xl bg-white/90 shadow-sm"
                      >
                        <summary className="list-none cursor-pointer px-4 py-3 flex items-center justify-between gap-3">
                          <span className="text-sm sm:text-base font-medium text-slate-800">
                            {t(`dimensions.items.${k}.title`)}
                          </span>
                          <span className="shrink-0 text-slate-500 transition-transform group-open:rotate-45">
                            +
                          </span>
                        </summary>

                        <div className="px-4 pb-4 text-sm sm:text-base leading-relaxed text-slate-700">
                          {t(`dimensions.items.${k}.body`)}
                        </div>
                      </details>
                    ))}
                  </div>
                  <button
  type="button"
  onClick={() => {
    const el = document.getElementById('learning-model-top');
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }}
  className="mt-4 inline-flex text-sm font-medium text-slate-500 hover:text-slate-700"
>
  {t('navigation.backToModel')}
</button>
                </section>
              </div>
            </Panel>
            </section>


{/* STORY & REFLEXION / LERNSPIRALE */}
<div className="grid grid-cols-1 gap-4">
  <section id="story-reflection-section" className="scroll-mt-24">
    <Panel
      kicker={t('storyReflection.kicker')}
      title={t('storyReflection.title')}
    >
      <p>{t('storyReflection.body')}</p>
      <p className="mt-3">{t('storyReflection.body2')}</p>

      <div className="mt-4 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('learning-model-top');
            if (el) {
              el.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }
          }}
          className="inline-flex text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          {t('navigation.backToModel')}
        </button>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('principles-section');
            if (el) {
              el.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }
          }}
          className="inline-flex text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          {t('navigation.toPrinciples')}
        </button>
      </div>
    </Panel>
  </section>

  <section id="learning-spiral-section" className="scroll-mt-24">
    <Panel
      kicker={t('learningSpiral.kicker')}
      title={t('learningSpiral.title')}
    >
      <p>{t('learningSpiral.body')}</p>
      <p className="mt-3">{t('learningSpiral.body2')}</p>

      <div className="mt-4 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('learning-model-top');
            if (el) {
              el.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }
          }}
          className="inline-flex text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          {t('navigation.backToModel')}
        </button>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('principles-section');
            if (el) {
              el.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }
          }}
          className="inline-flex text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          {t('navigation.toPrinciples')}
        </button>
      </div>
    </Panel>
  </section>
</div>



            {/* LERNPRINZIPIEN */}
<section id="principles-section" className="scroll-mt-24">
  <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 sm:p-8">
    <div className="text-xs sm:text-sm font-semibold text-[var(--color-teal-600)]">
      {t('principles.kicker')}
    </div>
    <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
      {t('principles.title')}
    </h2>
    <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
      {t('principles.intro')}
    </p>

    <div className="mt-7 grid grid-cols-2 md:grid-cols-3 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
      {(['0', '1', '2', '3', '4'] as const).map((k, idx) => (
        <PrincipleCard
          key={k}
          title={t(`principles.items.${k}`)}
          body={t(`principles.explain.${k}`)}
          accentColor={principleAccents[idx]}
        />
      ))}
      {/* 6th cell to fill the 2×3 grid evenly */}
      <div className="bg-white p-5 sm:p-6" />
    </div>

    <button
      type="button"
      onClick={() => document.getElementById('learning-model-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      className="mt-5 inline-flex text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
    >
      {t('navigation.backToModel')}
    </button>
  </div>
</section>

{/* DIDAKTISCHE UMSETZUNG */}
<section id="didactic-section" className="scroll-mt-24">
  <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 sm:p-8">
    <div className="text-xs sm:text-sm font-semibold text-[var(--color-teal-600)]">
      {t('didactics.kicker')}
    </div>
    <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
      {t('didactics.title')}
    </h2>
    <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
      {t('didactics.intro')}
    </p>

    <div className="mt-7 grid grid-cols-2 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
      {(['0', '1', '2', '3'] as const).map((k, idx) => (
        <PrincipleCard
          key={k}
          title={t(`didactics.items.${k}`)}
          body={t(`didactics.explain.${k}`)}
          accentColor={principleAccents[idx]}
        />
      ))}
    </div>

    <button
      type="button"
      onClick={() => document.getElementById('learning-model-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      className="mt-5 inline-flex text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
    >
      {t('navigation.backToModel')}
    </button>
  </div>
</section>


            {/* ZIELGRUPPE */}
            <Accordion title={t('target.title')}>
              <div className="text-xs font-semibold text-[var(--color-teal-600)]">
                {t('target.kicker')}
              </div>

              <p className="mt-3">{t('target.body')}</p>
              <p className="mt-3">{t('target.body2')}</p>
              <p className="mt-3 text-sm text-slate-600">{t('target.note')}</p>
            </Accordion>

            {/* FACHLICHE EINORDNUNG */}
            <Panel kicker={t('frameworks.kicker')} title={t('frameworks.title')}>
              <p>{t('frameworks.body')}</p>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">
                  {t('evidence.title')}
                </div>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  {t('evidence.body1')}
                </p>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  {t('evidence.body2')}
                </p>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  {t('evidence.body3')}
                </p>
              </div>
            </Panel>
          </div>

          {/* RIGHT */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
                <div className="text-xs font-semibold text-[var(--color-teal-600)]">
                  {t('sidebar.overview.kicker')}
                </div>

                <div className="mt-2 font-semibold text-slate-900">
                  {t('sidebar.overview.title')}
                </div>

                <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">
                  {t('sidebar.overview.body')}
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">
                      {t('sidebar.overview.sections.goalLabel')}
                    </div>
                    <div className="mt-1 text-sm text-slate-800">
                      {t('sidebar.overview.sections.goalValue')}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-500">
                      {t('sidebar.overview.sections.logicLabel')}
                    </div>
                    <div className="mt-1 text-sm text-slate-800">
                      {t('sidebar.overview.sections.logicValue')}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-500">
                      {t('sidebar.overview.sections.targetLabel')}
                    </div>
                    <div className="mt-1 text-sm text-slate-800">
                      {t('sidebar.overview.sections.targetValue')}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-500">
                      {t('sidebar.overview.sections.frameworkLabel')}
                    </div>
                    <div className="mt-1 text-sm text-slate-800">
                      {t('sidebar.overview.sections.frameworkValue')}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <Link
                    to="/parents"
                    className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
                  >
                    {t('sidebar.overview.ctaPrimary')}
                  </Link>

                  <Link
                    to="/stories"
                    className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
                  >
                    {t('sidebar.overview.ctaSecondary')}
                  </Link>
                </div>
              </div>


            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}