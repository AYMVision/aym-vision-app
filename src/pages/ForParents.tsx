// src/pages/ForParents.tsx
import React from 'react';
import Layout from '../components/Layout';
import SmartImage from '../components/SmartImage';
import { assetUrl } from '../common/assetUrl';
import { cn } from '../common/utils';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

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
      <div className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">{children}</div>
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
    <details className="group rounded-2xl border border-slate-100 bg-white shadow-sm" open={defaultOpen}>
      <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4">
        <div className="font-semibold text-slate-900">{title}</div>
        <div className="shrink-0 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 group-open:rotate-45 transition-transform">
          +
        </div>
      </summary>
      <div className="px-5 pb-5 text-sm sm:text-base leading-relaxed text-slate-700">{children}</div>
    </details>
  );
}

function OverviewCard({ t }: { t: (key: string, opts?: any) => string }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
      <div className="text-xs font-semibold text-[var(--color-teal-600)]">{t('sidebar.overview.kicker')}</div>

      <div className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">
        <div className="font-semibold text-slate-900">{t('sidebar.overview.whatTitle')}</div>
        <p className="mt-1">{t('sidebar.overview.whatBody')}</p>

<div className="mt-4 font-semibold text-slate-900">{t('sidebar.overview.principlesTitle')}</div>

<p className="mt-1 text-slate-700">{t('sidebar.overview.usp')}</p>

<div className="mt-3 flex flex-wrap gap-2">
  {(['0', '1', '2', '3','4','5'] as const).map((k) => (
    <span
      key={k}
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700"
    >
      {t(`sidebar.overview.principles.${k}`)}
    </span>
  ))}
</div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Link
          to="/faq"
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
        >
          {t('sidebar.buttons.faq')}
        </Link>

        <Link
          to="/concept"
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
        >
          {t('sidebar.buttons.concept')}
        </Link>
        
        <Link
  to="/parent-setup"
  className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
>
  {t('sidebar.buttons.settings')}
</Link>

      </div>
    </div>
  );
}

export default function ForParents() {
  const { t } = useTranslation('parents');

  return (
    <Layout>
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
{/* HERO */}
<section className="relative overflow-hidden rounded-3xl border border-white/50 shadow-lg bg-white">
  
  {/* Hintergrund-Verlauf (sehr subtil) */}
  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-teal-50)] via-white to-white" />

  {/* Grüner Glow NUR oben links */}
  <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[var(--color-teal-200)]/30 blur-2xl" />

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

      <p className="mt-4 text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
        {t('hero.leadEmphasis')}
      </p>

      <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-700 leading-relaxed">
        {t('hero.leadEmphasis2')}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/stories"
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
        >
          {t('hero.ctaPrimary')}
        </Link>

        <Link
          to="/parent-setup"
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
        >
          {t('hero.ctaSecondary')}
        </Link>
      </div>
    </div>

    {/* MEDIA */}
    <div className="lg:col-span-6 relative min-h-[280px] sm:min-h-[340px] lg:min-h-[420px]">
      <img
        src={assetUrl('media/ui/welcome/parents-hero-1024.webp')}
        alt={t('hero.bannerAlt')}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  </div>
</section>
{/* CONTENT GRID */}
<div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
  {/* Left column */}
  <div className="lg:col-span-8 space-y-4 sm:space-y-6">

    {/* SETUP CALLOUT */}
    <div className="rounded-2xl border border-[var(--color-teal-200)] bg-[var(--color-teal-50)] p-5 sm:p-6">
      <div className="text-xs font-semibold text-[var(--color-teal-700)]">
        {t('setup.kicker', { defaultValue: 'App einrichten' })}
      </div>
      <h2 className="mt-1 text-base sm:text-lg font-semibold text-slate-900">
        {t('setup.title', { defaultValue: 'App für Ihr Kind einrichten' })}
      </h2>
      <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">
        {t('setup.body', { defaultValue: 'Datenschutz-Einstellungen anpassen, Amys Begleitmodus wählen und die App mit einem Passcode schützen — alles in wenigen Minuten.' })}
      </p>
      <div className="mt-4">
        <Link
          to="/parent-setup"
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
        >
          {t('setup.cta', { defaultValue: 'App jetzt einrichten →' })}
        </Link>
      </div>
    </div>

    <Panel
      title={t('sections.learnMain.title')}
      kicker={t('sections.learnMain.kicker')}
    >
      <p className="text-slate-700 leading-relaxed">
        {t('sections.learnMain.intro')}
      </p>

      <p className="mt-3 text-slate-700 leading-relaxed">
        {t('sections.learnMain.intro2')}
      </p>

      <div className="mt-6 space-y-3">
        {(['0', '1', '2', '3', '4', '5', '6'] as const).map((k) => (
<Accordion
  key={k}
  title={`${t(`sections.learnMain.items.${k}.icon`)} ${t(`sections.learnMain.items.${k}.title`)}`}
>

            <div className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                {t(`sections.learnMain.items.${k}.intro`)}
              </p>

              <div>
                <div className="font-semibold text-slate-900">
                  {t(`sections.learnMain.items.${k}.learnTitle`)}
                </div>

<ul className="mt-2 list-disc pl-5 space-y-1 text-slate-700">
  {(['0', '1', '2'] as const).map((p) => (
    <li key={p}>{t(`sections.learnMain.items.${k}.learnPoints.${p}`)}</li>
  ))}
</ul>
              </div>

              <Accordion title={t('sections.learnMain.howTitle')}>
                <div className="space-y-3">
                  <p className="text-slate-700 leading-relaxed">
                    {t(`sections.learnMain.items.${k}.howIntro`)}
                  </p>


                  
<ul className="list-disc pl-5 space-y-1 text-slate-700">
  {(['0', '1', '2'] as const).map((p) => (
    <li key={p}>{t(`sections.learnMain.items.${k}.howPoints.${p}`)}</li>
  ))}
</ul>
                </div>
              </Accordion>
            </div>
          </Accordion>
        ))}
      </div>
    </Panel>

    {/* STAFFEL 1 */}
    <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5 sm:p-6">
      <div className="text-xs font-semibold text-violet-600 uppercase tracking-wide">Staffel 1</div>
      <h2 className="mt-1 text-base sm:text-lg font-semibold text-violet-900">
        Was dein Kind in dieser Staffel erlebt
      </h2>
      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
        Die erste Staffel von Amy Surfwing begleitet Kinder in fünf Geschichten durch typische Situationen ihrer digitalen Lebenswelt. Dabei erleben sie ganz nebenbei, wie sie online cleverer, sicherer und selbstbestimmter unterwegs sein können.
      </p>
      <div className="mt-4 space-y-3">

        {/* Folge 1 */}
        <div className="rounded-xl bg-white border border-violet-100 px-4 py-3">
          <div className="font-semibold text-slate-900 text-sm leading-snug">Folge 1: Wirbel am Wasserfall</div>
          <p className="mt-0.5 text-xs text-slate-500 italic">Was passiert, wenn der Wunsch nach dem perfekten Post plötzlich wichtiger wird als das, was um mich herum passiert?</p>
          <div className="mt-3 space-y-1 divide-y divide-violet-50">
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>💪 Über das eigene Verhalten nachdenken</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Yasmin will unbedingt mitreden und etwas Cooles posten. Kinder erleben, was FOMO mit den eigenen Entscheidungen machen kann und wann es sich lohnt, kurz innezuhalten.</p>
            </details>
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>🌍 Folgen des eigenen Handelns einschätzen</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Aus einem coolen KI Bild wird plötzlich eine ziemlich große Sache. Kinder erleben, warum es wichtig ist, vor dem Posten und Weiterleiten auch an andere zu denken.</p>
            </details>
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>🕵️ Quellen bewerten, Fake News und Manipulation erkennen</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Ein Online Tipp passt nicht mehr zur Wirklichkeit und ein überzeugendes Bild erzählt nicht die ganze Wahrheit. Die Klasse nutzt unter anderem Bildersuche und digitale Hinweise, um herauszufinden, was wirklich los ist.</p>
            </details>
          </div>
        </div>

        {/* Folge 2 */}
        <div className="rounded-xl bg-white border border-violet-100 px-4 py-3">
          <div className="font-semibold text-slate-900 text-sm leading-snug">Folge 2: Chaos im Klassenchat</div>
          <p className="mt-0.5 text-xs text-slate-500 italic">Was hilft, wenn ein Klassenchat plötzlich völlig eskaliert?</p>
          <div className="mt-3 space-y-1 divide-y divide-violet-50">
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>🤝 Respektvoll digital kommunizieren und zusammenarbeiten</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Streit, Beleidigungen, Ausschluss und Mitläufer bringen den Klassenchat ordentlich durcheinander. Kinder erleben, warum Netiquette und gemeinsame Regeln wichtig sind und wie man Konflikte auch wieder beruhigen kann.</p>
            </details>
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>👁️ Situationen aus anderen Blickwinkeln betrachten</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Ein Streit sieht je nach Beteiligtem ziemlich unterschiedlich aus. Kinder wechseln die Perspektive und überlegen, wie Nachrichten, Reaktionen und Ausschluss bei anderen ankommen.</p>
            </details>
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>🌍 Folgen des eigenen Handelns einschätzen</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Wer heizt einen Streit an und wer hilft, ihn zu lösen? Die Klasse probiert konkrete Lösungen aus, entwickelt Regeln, diskutiert unterschiedliche Meinungen und stimmt gemeinsam darüber ab, wie ihr Chat künftig funktionieren soll.</p>
            </details>
          </div>
        </div>

        {/* Folge 3 */}
        <div className="rounded-xl bg-white border border-violet-100 px-4 py-3">
          <div className="font-semibold text-slate-900 text-sm leading-snug">Folge 3: Nacht im Netz</div>
          <p className="mt-0.5 text-xs text-slate-500 italic">Warum ist Aufhören manchmal so schwer, obwohl man es eigentlich längst wollte?</p>
          <div className="mt-3 space-y-1 divide-y divide-violet-50">
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>💡 Medien kritisch verstehen und reflektieren</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Feeds, Algorithmen, Streaks und limitierte Events sorgen dafür, dass Finn und seine Freunde immer wieder zurückkommen. Kinder entdecken spielerisch, mit welchen Tricks Apps und Games um ihre Aufmerksamkeit kämpfen.</p>
            </details>
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>💪 Über das eigene Verhalten nachdenken</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Finn merkt irgendwann selbst, dass Games, Chats und Onlinezeit gerade zu viel werden. Kinder beschäftigen sich mit Bildschirmzeit, Schlaf, FOMO und der Frage, wann aus Spaß Stress wird.</p>
            </details>
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>🛡️ Sich im Netz schützen</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Push Nachrichten ausschalten, Handy weglegen, Offline Zeiten ausprobieren oder sich Unterstützung holen. Kinder lernen einfache Strategien kennen, mit denen sie ihre Medienzeit selbstbestimmter gestalten können.</p>
            </details>
          </div>
        </div>

        {/* Folge 4 */}
        <div className="rounded-xl bg-white border border-violet-100 px-4 py-3">
          <div className="font-semibold text-slate-900 text-sm leading-snug">Folge 4: Stress im Skatepark</div>
          <p className="mt-0.5 text-xs text-slate-500 italic">Wie schnell entsteht eine Meinung über jemanden, obwohl wichtige Teile der Geschichte fehlen?</p>
          <div className="mt-3 space-y-1 divide-y divide-violet-50">
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>👁️ Situationen aus anderen Blickwinkeln betrachten</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Amir wird aufgrund einzelner Informationen und seiner Herkunft in eine Schublade gesteckt. Neue Begegnungen zeigen der Klasse nach und nach ganz andere Seiten von ihm.</p>
            </details>
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>💡 Medien kritisch verstehen und reflektieren</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Ein Foto, ein paar Nachrichten und schon scheint die Sache klar. Kinder erleben, wie aus einzelnen Informationen Vermutungen und scheinbar sichere Urteile entstehen können.</p>
            </details>
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>🌍 Folgen des eigenen Handelns einschätzen</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Öffentliche Anschuldigungen und Spott treffen einen echten Menschen. Gleichzeitig erleben Kinder, wie viel es bewirken kann, für jemanden einzustehen, ein Urteil zu korrigieren und sich zu entschuldigen.</p>
            </details>
          </div>
        </div>

        {/* Folge 5 */}
        <div className="rounded-xl bg-white border border-violet-100 px-4 py-3">
          <div className="font-semibold text-slate-900 text-sm leading-snug">Folge 5: Wolf im Chat</div>
          <p className="mt-0.5 text-xs text-slate-500 italic">Was passiert, wenn KI-Sticker von Mitschülern erstellt und &quot;Beweis&quot;-Fotos veröffentlicht werden?</p>
          <div className="mt-3 space-y-1 divide-y divide-violet-50">
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>🛡️ Sich im Netz schützen</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Ein KI-Sticker wird aus dem Foto eines Mitschülers erstellt. Kinder beschäftigen sich mit Privatsphäre und dem Umgang mit Bildern.</p>
            </details>
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>🌍 Folgen des eigenen Handelns einschätzen</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Der Sticker soll nicht weitergeleitet werden und trotzdem verbreitet er sich rasant. Kinder erleben, wie aus vielen kleinen Entscheidungen eine große Wirkung entsteht und wie man reagieren kann.</p>
            </details>
            <details className="group pt-1">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-slate-700 py-1 gap-2">
                <span>🕵️ Quellen bewerten, Fake News und Manipulation erkennen</span>
                <span className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-1 text-xs text-slate-600 leading-snug pb-2">Dann sorgt ein vermeintlicher Wolf für Aufregung. Kinder erleben, warum mehrere Quellen nicht automatisch mehrere Beweise sind, wie Gerüchte glaubwürdiger werden und warum gute Recherche vor dem Veröffentlichen wichtig ist.</p>
            </details>
          </div>
        </div>

      </div>

      {/* Mehr als einzelne Medienthemen */}
      <div className="mt-4 rounded-xl bg-white border border-violet-100 px-4 py-4">
        <div className="font-semibold text-slate-900 text-sm">Mehr als einzelne Medienthemen</div>
        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
          In allen fünf Folgen üben Kinder immer wieder vier Fähigkeiten, die sie durch ihre digitale Lebenswelt begleiten:
        </p>
        <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
          <li><strong className="text-slate-800">Urteilsvermögen</strong> – Informationen hinterfragen und sich eine eigene Meinung bilden</li>
          <li><strong className="text-slate-800">Perspektivfähigkeit</strong> – verstehen, wie Situationen auf andere wirken</li>
          <li><strong className="text-slate-800">Selbststeuerung</strong> – das eigene digitale Verhalten bewusst gestalten</li>
          <li><strong className="text-slate-800">Verantwortungsvolles Handeln</strong> – Folgen mitdenken und fair handeln</li>
        </ul>
        <p className="mt-3 text-xs text-slate-600 leading-relaxed">
          Jede Folge enthält kurze Reflexionsfragen, Wissensmomente und Entscheidungspunkte, die Kinder zum Mitdenken einladen. Ohne Bewertung und ohne Ranking.
        </p>
      </div>
    </div>

    <Panel
  title={t('sections.whyApp.title')}
  kicker={t('sections.whyApp.kicker')}
>
  <p className="text-slate-700 leading-relaxed">
    {t('sections.whyApp.intro')}
  </p>

  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {(['0', '1', '2', '3', '4', '5'] as const).map((k) => (
      <div
        key={k}
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="text-2xl" aria-hidden="true">
          {t(`sections.whyApp.cards.${k}.icon`)}
        </div>

        <h3 className="mt-3 text-lg font-bold text-slate-900 leading-snug">
          {t(`sections.whyApp.cards.${k}.title`)}
        </h3>

        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          {t(`sections.whyApp.cards.${k}.text`)}
        </p>
      </div>
    ))}
  </div>
</Panel>

{/* Eltern entlasten */}
<Accordion title={t('accordions.parentsRelief.title')}>
  <p className="mb-3">{t('accordions.parentsRelief.intro')}</p>

  <ul className="list-disc pl-5 space-y-1">
    <li>{t('accordions.parentsRelief.items.0')}</li>
    <li>{t('accordions.parentsRelief.items.1')}</li>
    <li>{t('accordions.parentsRelief.items.2')}</li>
    <li>{t('accordions.parentsRelief.items.3')}</li>
    <li>{t('accordions.parentsRelief.items.4')}</li>
  </ul>

  <p className="mt-3">{t('accordions.parentsRelief.footer')}</p>
</Accordion>


            {/* 3) Datenschutz / Privatsphäre */}
            <Accordion title={t('accordions.privacy.title')}>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('accordions.privacy.items.0')}</li>
                <li>{t('accordions.privacy.items.1')}</li>
                <li>{t('accordions.privacy.items.2')}</li>
                <li>{t('accordions.privacy.items.3')}</li>
              </ul>

              <Link
                to="/adult-settings"
                state={{ backTo: '/parents', openSection: 'analytics' }}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-teal-700)] hover:underline"
              >
                Einstellungen &amp; Datenweitergabe öffnen →
              </Link>

              <div className="mt-4 rounded-xl border border-[var(--color-teal-100)] bg-[var(--color-teal-50)] p-4 text-sm text-slate-700 space-y-2">
                <p className="font-semibold text-slate-900">Freiwillige Qualitätssicherung</p>
                <p>
                  AYM Vision kann — mit deiner ausdrücklichen Zustimmung — anonyme Nutzungsdaten
                  lokal speichern und auf deinen Wunsch hin teilen. Diese helfen uns, die pädagogische
                  Wirksamkeit der App zu verstehen.
                </p>
                <p className="font-semibold text-slate-800 mt-1">Was gespeichert wird (nur bei Zustimmung):</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Welche Story-Kapitel gespielt wurden</li>
                  <li>Score der Reflexionsfragen (A / B / C — ohne den Text selbst)</li>
                  <li>Themen-Tags der Schritte (z.B. "Datenschutz")</li>
                  <li>Datum (nur Tag, keine Uhrzeit)</li>
                </ul>
                <p className="font-semibold text-slate-800 mt-1">Was niemals gespeichert wird:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Texteingaben oder Antworten deines Kindes</li>
                  <li>Name, Alter oder persönliche Angaben</li>
                  <li>Standort, IP-Adresse oder Gerätedaten</li>
                </ul>
                <p className="mt-2 text-xs text-slate-500">
                  Alle Daten bleiben lokal auf diesem Gerät. Du kannst sie in den Eltern-Einstellungen
                  einsehen, herunterladen oder jederzeit löschen.
                </p>
                <Link
                  to="/adult-settings"
                  state={{ backTo: '/parents', openSection: 'analytics' }}
                  className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-teal-700)] hover:underline"
                >
                  Jetzt in den Einstellungen aktivieren →
                </Link>
              </div>
            </Accordion>

            {/* 4+5) KI – zusammengefasst als Accordion */}
            <div id="ki-einsatz" className="scroll-mt-24">
            <Accordion title={t('sections.ai.title')}>
              <p>{t('sections.ai.introShort')}</p>
              <p className="mt-3">{t('sections.ai.description')}</p>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <span className="font-semibold text-slate-900">{t('sections.ai.safeAi.title')}: </span>
                {t('sections.ai.safeAi.text')}
              </div>

              <p className="mt-4 font-semibold text-slate-900">{t('sections.ai.control')}</p>

              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-slate-900">{t('sections.ai.modes.on.title')}</span>
                  {' — '}{t('sections.ai.modes.on.text')}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">{t('sections.ai.modes.auto.title')}</span>
                  {' — '}{t('sections.ai.modes.auto.text')}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">{t('sections.ai.modes.off.title')}</span>
                  {' — '}{t('sections.ai.modes.off.text')}
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-500">{t('sections.ai.changeHint')}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/adult-settings#ai-modes"
                  state={{ backTo: '/parents' }}
                  className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
                >
                  {t('sections.ai.ctaModes')}
                </Link>
                <Link
                  to="/impressum"
                  className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white border border-slate-200 text-slate-500 hover:border-slate-300 transition-colors text-sm"
                >
                  {t('sections.ai.ctaImpressum')}
                </Link>
              </div>
            </Accordion>
            </div>

            {/* 6) Parents can do */}
            <Panel title={t('sections.parentsCanDo.title')} kicker={t('sections.parentsCanDo.kicker')}>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('sections.parentsCanDo.items.0')}</li>
                <li>{t('sections.parentsCanDo.items.1')}</li>
                <li>{t('sections.parentsCanDo.items.2')}</li>
                <li>{t('sections.parentsCanDo.items.3')}</li>
              </ul>
            </Panel>

            {/* Förderung */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
              <div className="text-xs font-semibold text-[var(--color-teal-600)]">{t('cooperation.kicker')}</div>
              <h2 className="mt-1 text-base font-semibold text-slate-900">{t('cooperation.title')}</h2>

              <div className="mt-4 flex flex-col gap-4 pb-4 border-b border-slate-100">
                <a
                  href="https://hafven.de/impact-accelerator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 opacity-80 hover:opacity-100 transition-opacity self-start"
                  aria-label={t('cooperation.hafven.ariaLabel')}
                >
                  <img
                    src={assetUrl('media/ui/HafvenImpactAccelerator_Logo_schwarz.png')}
                    alt={t('cooperation.hafven.imgAlt')}
                    className="h-9 w-auto"
                    loading="lazy"
                  />
                </a>
                <p className="text-sm text-slate-700 leading-relaxed">
                  <Trans i18nKey="cooperation.hafven.text" t={t} components={{ bold: <strong /> }} />
                </p>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-5 border-b border-slate-100">
                <a
                  href="https://www.nbank.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                  aria-label={t('cooperation.nbank.ariaLabel')}
                >
                  <img
                    src={assetUrl('media/ui/Siegel_Gründungsstipendium_Start-up_2024.png')}
                    alt={t('cooperation.nbank.imgAlt')}
                    className="h-24 w-auto"
                    loading="lazy"
                  />
                </a>
                <p className="text-sm text-slate-700 leading-relaxed">
                  <Trans i18nKey="cooperation.nbank.text" t={t} components={{ bold: <strong /> }} />
                </p>
              </div>

              {/* WIN Startup Academy Braunschweig */}
              <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href="https://www.win-bs.de/startup-academy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                  aria-label={t('cooperation.win.ariaLabel')}
                >
                  <img
                    src={assetUrl('media/ui/300_WIN_Logo_2022_BS_Unterstuetzung.webp')}
                    alt={t('cooperation.win.imgAlt')}
                    className="h-10 w-auto"
                    loading="lazy"
                  />
                </a>
                <p className="text-sm text-slate-700 leading-relaxed">
                  <Trans i18nKey="cooperation.win.text" t={t} components={{ bold: <strong /> }} />
                </p>
              </div>
            </section>

            {/* Blog */}
            <section className="bg-white rounded-2xl border border-[var(--color-teal-100)] shadow-sm p-5 sm:p-6">
              <div className="text-xs font-semibold text-[var(--color-teal-600)]">{t('sidebar.blog.kicker')}</div>
              <h2 className="mt-1 text-base font-semibold text-slate-900">{t('sidebar.blog.title')}</h2>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {t('sidebar.blog.body')}
              </p>
              <a
                href="https://www.amysurfwing.de/blog/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors text-sm"
              >
                {t('sidebar.blog.cta')}
              </a>
            </section>

            {/* 7) Warn */}
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6 shadow-sm">
              <div className="text-xs font-semibold text-amber-800">{t('warn.kicker')}</div>
              <h2 className="mt-1 text-base sm:text-lg font-semibold text-amber-900">{t('warn.title')}</h2>
              <p className="mt-3 text-sm sm:text-base text-amber-900/90 leading-relaxed">{t('warn.body')}</p>
            </section>
          </div>

          {/* Right column (Desktop only) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              <OverviewCard t={t} />

              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
                <div className="text-xs font-semibold text-[var(--color-teal-600)]">{t('sidebar.transparency.kicker')}</div>
                <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">{t('sidebar.transparency.body')}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}