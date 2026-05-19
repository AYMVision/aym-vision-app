import Layout from '../components/Layout';
import { cn } from '../common/utils';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { assetUrl } from '../common/assetUrl';
import SmartImage from '../components/SmartImage';

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
  className,
}: {
  title: string;
  kicker?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6', className)}>
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
  ariaLabel,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  ariaLabel: string;
}) {
  return (
    <details
      className="group rounded-2xl border border-slate-100 bg-white shadow-sm"
      open={defaultOpen}
    >
      <summary
        className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4"
        aria-label={ariaLabel}
      >
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


function PersonCard({
  name,
  role,
  degree,
  furtherEd,
  experience,
  quote,
  degreeLabel,
  furtherEdLabel,
  experienceLabel,
  imgKey,
  imgAlt,
  linkedIn,
}: {
  name: string;
  role: string;
  degree: string;
  furtherEd: string;
  experience: string;
  quote: string;
  degreeLabel: string;
  furtherEdLabel: string;
  experienceLabel: string;
  imgKey: string;
  imgAlt: string;
  linkedIn?: string;
}) {
  const base = `media/ui/about/${imgKey}`;
  const rows = [
    { label: degreeLabel, value: degree },
    { label: furtherEdLabel, value: furtherEd },
    { label: experienceLabel, value: experience },
  ];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col items-center gap-3 mb-5">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
            <SmartImage
              alt={imgAlt}
              className="w-full h-full object-cover object-top"
              sizes="128px"
              avif={[{ src: assetUrl(`${base}-512.avif`), w: 512 }]}
              webp={[{ src: assetUrl(`${base}-512.webp`), w: 512 }]}
              fallback={assetUrl(`${base}-512.webp`)}
            />
          </div>
          <div className="text-center">
            <div className="font-bold text-slate-900">{name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{role}</div>
          </div>
        </div>

        <div className="space-y-2">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex gap-2">
              <span className="shrink-0 w-28 text-[10px] font-semibold text-slate-400 uppercase tracking-wide pt-0.5">
                {label}
              </span>
              <span className="text-xs text-slate-700 leading-relaxed">{value}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 pl-3 border-l-2 border-[var(--color-teal-300)] text-xs sm:text-sm italic text-slate-600 leading-relaxed">
          {quote}
        </p>

        {linkedIn && (
          <a
            href={linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#0A66C2] hover:underline"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}




function SpotlightCard({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="text-xs font-semibold text-[var(--color-teal-600)]">{kicker}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{title}</div>
      <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">{body}</p>
    </div>
  );
}


export default function About() {
  const { t } = useTranslation('about');

  const heroBadges = [0, 1, ]
    .map((i) => t(`hero.badges.${i}`))
    .filter((badge) => badge && badge.trim().length > 0);

  const guidingThoughts = [0, 1, 2, 3].map((i) => t(`guidingThoughts.items.${i}`));
const valueAccents = [
    'bg-teal-400',
    'bg-sky-400',
    'bg-violet-400',
    'bg-amber-400',
    'bg-emerald-400',
    'bg-rose-400',
  ];

  const heroImgBase = 'media/ui/about/hero';

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
              <span className="font-semibold text-slate-900"> {t('hero.leadEmphasis')}</span>
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {heroBadges.map((b) => (
                <Badge key={b}>{b}</Badge>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/stories"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
              >
                {t('hero.ctaStories')}
              </Link>

              <Link
                to="/about#call-for-action"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
              >
                {t('hero.ctaCoop')}
              </Link>
            </div>
          </div>

          {/* MEDIA */}
<div className="lg:col-span-6 relative h-64 sm:h-72 lg:min-h-[420px]">
  <img
    src={assetUrl(`${heroImgBase}-1024.webp`)}
    alt={t('hero.imageAlt')}
    className="absolute inset-0 w-full h-full object-contain object-bottom lg:object-contain"
    loading="lazy"
  />

  <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/10 to-transparent lg:from-transparent lg:via-transparent lg:to-transparent pointer-events-none" />
</div>
        </div>
      </section>

        {/* BIG STATEMENT BREAK */}
        <section className="mt-6 sm:mt-8 rounded-3xl border border-[var(--color-teal-100)] bg-[var(--color-teal-50)] px-6 py-8 sm:px-8 sm:py-10 shadow-sm">
          <div className="max-w-4xl">
            <div className="text-xs sm:text-sm font-semibold text-[var(--color-teal-700)]">
              {t('statement.kicker')}
            </div>
            <p className="mt-3 text-xl sm:text-2xl lg:text-3xl font-semibold text-[var(--color-teal-900)] leading-relaxed">
              {t('statement.text')}
            </p>
          </div>
        </section>

        {/* CONTENT GRID */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* VISION / MISSION */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SpotlightCard
                kicker={t('vision.kicker')}
                title={t('vision.title')}
                body={t('vision.copy')}
              />
              <SpotlightCard
                kicker={t('mission.kicker')}
                title={t('mission.title')}
                body={t('mission.copy')}
              />
            </section>

            {/* MOTIVATION */}
            <Panel title={t('motivation.title')} kicker={t('motivation.kicker')}>
              <p>{t('motivation.copy')}</p>
            </Panel>

            {/* POSITIONING */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-[var(--color-teal-100)] bg-[var(--color-teal-50)] px-6 py-8 sm:px-8 sm:py-10 shadow-sm"
                >
                  <div className="text-xs sm:text-sm font-semibold text-[var(--color-teal-700)]">
                    {t(`positioning.cards.${i}.kicker`)}
                  </div>
                  <p className="mt-3 text-xl sm:text-2xl font-semibold text-[var(--color-teal-900)] leading-snug">
                    {t(`positioning.cards.${i}.body`)}
                  </p>
                </div>
              ))}
            </section>


            {/* GUIDING THOUGHTS */}
            <section className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
              <div className="px-6 pt-6 sm:px-8 sm:pt-8 pb-2">
                <div className="text-xs sm:text-sm font-semibold text-[var(--color-teal-600)]">
                  {t('guidingThoughts.kicker')}
                </div>
                <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
                  {t('guidingThoughts.title')}
                </h2>
              </div>

              <div className="divide-y divide-slate-100">
                {guidingThoughts.map((text, i) => {
                  const numColors = ['text-[var(--color-teal-400)]', 'text-sky-300', 'text-violet-300', 'text-amber-300'];
                  return (
                    <div key={i} className="group flex gap-5 sm:gap-7 px-6 sm:px-8 py-5 sm:py-6 transition-colors hover:bg-slate-50/60">
                      <div className={cn(
                        'shrink-0 text-3xl sm:text-4xl font-black tabular-nums leading-none mt-0.5 select-none',
                        numColors[i]
                      )}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <p className="text-base sm:text-lg font-black leading-snug text-[var(--color-teal-900)]">
                        {text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* METHOD */}
            <Panel title={t('method.title')} kicker={t('method.kicker')}>
              <p>{t('method.copy1')}</p>
              <p className="mt-3">{t('method.copy2')}</p>
            </Panel>

            {/* VALUES */}
            <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 sm:p-8">
              <div className="text-xs sm:text-sm font-semibold text-[var(--color-teal-600)]">
                {t('values.kicker')}
              </div>
              <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
                {t('values.title')}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                {t('values.intro')}
              </p>

              <div className="mt-7 grid grid-cols-2 md:grid-cols-3 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
                {(['0', '1', '2', '3', '4', '5'] as const).map((k, idx) => (
                  <div key={k} className="group bg-white hover:bg-slate-50/80 transition-colors p-5 sm:p-6 flex flex-col gap-3">
                    <div className={cn('w-8 h-1 rounded-full', valueAccents[idx])} />
                    <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
                      {t(`values.items.${k}.title`)}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {t(`values.items.${k}.body`)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* GLIMPSES */}
            <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
              <div className="text-xs font-semibold text-[var(--color-teal-600)]">
                {t('glimpses.kicker')}
              </div>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                {t('glimpses.lead')}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[3/4]">
                    <SmartImage
                      alt={t(`glimpses.items.${idx}.alt`)}
                      className={cn(
                        'absolute inset-0 w-full h-full object-cover object-top',
                        idx === 1 && 'scale-[1.0] origin-top'
                      )}
                      sizes="(min-width: 640px) 33vw, 33vw"
                      webp={[{ src: assetUrl(`media/ui/about/glimpse-${idx + 1}-1024.webp`), w: 1024 }]}
                      fallback={assetUrl(`media/ui/about/glimpse-${idx + 1}-1024.webp`)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-3 sm:p-4">
                      <span className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-widest">
                        {t(`glimpses.items.${idx}.label`)}
                      </span>
                      <div className="mt-0.5 text-xs sm:text-sm font-semibold text-white leading-snug">
                        {t(`glimpses.items.${idx}.caption`)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ACCORDIONS */}
            <div className="space-y-3">
              <Accordion title={t('brand.title')} ariaLabel={t('brand.aria')}>
                <p>{t('brand.copy1')}</p>
                <p className="mt-3">{t('brand.copy2')}</p>
              </Accordion>

              <Accordion title={t('whyAmy.title')} ariaLabel={t('whyAmy.aria')}>
                <p>{t('whyAmy.copy')}</p>
              </Accordion>
            </div>

            {/* CTA */}
            <section
              id="call-for-action"
              className="scroll-mt-24 rounded-3xl border border-white/50 shadow-lg overflow-hidden"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-teal-700)] to-[var(--color-teal-600)]" />
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-2xl" />

                <div className="relative p-6 sm:p-8 text-white">
                  <div className="text-xs sm:text-sm font-semibold text-white/90">
                    {t('cta.kicker')}
                  </div>
                  <h2 className="mt-2 text-xl sm:text-2xl font-extrabold">{t('cta.title')}</h2>
                  <p className="mt-3 text-sm sm:text-base text-white/90 leading-relaxed">
                    {t('cta.copy')}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={t('cta.mailtoHref')}
                      className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-white text-[var(--color-teal-900)] hover:bg-white/90 transition-colors"
                    >
                      {t('cta.primary')}
                    </a>

                    <Link
                      to="/concept"
                      className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-transparent border border-white/60 text-white hover:bg-white/10 transition-colors"
                    >
                      {t('cta.secondary')}
                    </Link>
                  </div>

                  <div className="mt-4 text-xs text-white/80">{t('cta.note')}</div>
                </div>
              </div>
            </section>

            {/* KOOPERATIONEN & FÖRDERUNG */}
            <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
              <div className="text-xs font-semibold text-[var(--color-teal-600)]">Kooperationen & Förderung</div>
              <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
                Unterstützt von
              </h2>

              {/* Hafven */}
              <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-5 border-b border-slate-100">
                <a
                  href="https://hafven.de/impact-accelerator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="Hafven Impact Accelerator"
                >
                  <img
                    src={assetUrl('media/ui/HafvenImpactAccelerator_Logo_schwarz.png')}
                    alt="Hafven Impact Accelerator"
                    className="h-10 w-auto"
                    loading="lazy"
                  />
                </a>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Amy Surfwing wird vom <strong>Hafven Impact Accelerator</strong> unterstützt — einem Programm für soziale Innovationen und gesellschaftlich wirksame Projekte in Hannover.
                </p>
              </div>

              {/* NBank Gründungsstipendium */}
              <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href="https://www.nbank.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="NBank Gründungsstipendium"
                >
                  <img
                    src={assetUrl('media/ui/Siegel_Gründungsstipendium_Start-up_2024.png')}
                    alt="Gründungsstipendium Start-up 2025/2026 – NBank"
                    className="h-20 w-auto"
                    loading="lazy"
                  />
                </a>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Amy Surfwing ist Trägerin des <strong>Gründungsstipendiums der NBank</strong> (2025/2026) — der Investitions- und Förderbank des Landes Niedersachsen. Das Stipendium fördert innovative Gründungsvorhaben mit besonderem gesellschaftlichem Mehrwert.
                </p>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
                <div className="text-xs font-semibold text-[var(--color-teal-600)]">
                  {t('team.kicker')}
                </div>
                <div className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <div className="font-semibold text-slate-900">{t('team.title')}</div>
                  <p className="mt-1">{t('team.lead')}</p>
                </div>

                <div className="mt-4 space-y-3">
                  <PersonCard
                    name={t('team.people.0.name')}
                    role={t('team.people.0.role')}
                    degree={t('team.people.0.degree')}
                    furtherEd={t('team.people.0.furtherEd')}
                    experience={t('team.people.0.experience')}
                    quote={t('team.people.0.quote')}
                    degreeLabel={t('team.labels.degree')}
                    furtherEdLabel={t('team.labels.furtherEd')}
                    experienceLabel={t('team.labels.experience')}
                    imgKey="melina"
                    imgAlt={t('team.people.0.imageAlt')}
                    linkedIn="https://www.linkedin.com/in/melina-wiegers-b0829537a/"
                  />
                  <PersonCard
                    name={t('team.people.1.name')}
                    role={t('team.people.1.role')}
                    degree={t('team.people.1.degree')}
                    furtherEd={t('team.people.1.furtherEd')}
                    experience={t('team.people.1.experience')}
                    quote={t('team.people.1.quote')}
                    degreeLabel={t('team.labels.degree')}
                    furtherEdLabel={t('team.labels.furtherEd')}
                    experienceLabel={t('team.labels.experience')}
                    imgKey="annsofie"
                    imgAlt={t('team.people.1.imageAlt')}
                    linkedIn="https://www.linkedin.com/in/ann-sofie-h%C3%B6brink-318aa72a2/"
                  />
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}