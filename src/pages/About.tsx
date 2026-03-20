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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((it) => (
        <li key={it} className="leading-relaxed">
          {it}
        </li>
      ))}
    </ul>
  );
}

function PersonCard({
  name,
  role,
  bio,
  imgKey,
  imgAlt,
}: {
  name: string;
  role: string;
  bio: string;
  imgKey: string;
  imgAlt: string;
}) {
  const base = `media/ui/about/${imgKey}`;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 flex flex-row gap-4 lg:flex-col lg:gap-3">
        <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
          <SmartImage
            alt={imgAlt}
            className="w-full h-full object-cover object-top"
            sizes="80px"
            avif={[
              { src: assetUrl(`${base}-512.avif`), w: 512 },
              { src: assetUrl(`${base}-768.avif`), w: 768 },
            ]}
            webp={[
              { src: assetUrl(`${base}-512.webp`), w: 512 },
              { src: assetUrl(`${base}-768.webp`), w: 768 },
            ]}
            fallback={assetUrl(`${base}-512.webp`)}
          />
        </div>

        <div className="min-w-0">
          <div className="font-semibold text-slate-900">{name}</div>
          <div className="text-sm text-slate-600">{role}</div>
          <div className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">{bio}</div>
        </div>
      </div>
    </div>
  );
}

function StatementCard({
  text,
  featured = false,
}: {
  text: string;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-4 sm:p-5 shadow-sm',
        featured
          ? 'border-[var(--color-teal-200)] bg-[var(--color-teal-50)]'
          : 'border-slate-200 bg-slate-50'
      )}
    >
      <p className="text-sm sm:text-base leading-relaxed text-slate-800 font-medium">
        {text}
      </p>
    </div>
  );
}

function ValueCard({
  title,
  body,
  colorClass,
}: {
  title: string;
  body: string;
  colorClass: string;
}) {
  return (
    <div className={cn('rounded-2xl border p-4 sm:p-5 shadow-sm', colorClass)}>
      <div className="font-bold text-slate-900">{title}</div>
      <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">{body}</p>
    </div>
  );
}

function GlimpseCard({
  base,
  alt,
  title,
  body,
}: {
  base: string;
  alt: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      <SmartImage
        alt={alt}
        className="w-full h-56 sm:h-44 object-cover object-top"
        sizes="(min-width: 640px) 220px, 100vw"
        webp={[{ src: assetUrl(`${base}-1024.webp`), w: 1024 }]}
        fallback={assetUrl(`${base}-1024.webp`)}
      />
      <div className="p-4">
        <div className="font-semibold text-slate-900">{title}</div>
        <p className="mt-2 text-sm text-slate-700 leading-relaxed">{body}</p>
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

function SidebarMiniCard({
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

export default function About() {
  const { t } = useTranslation('about');

  const heroBadges = [0, 1, 2, 3]
    .map((i) => t(`hero.badges.${i}`))
    .filter((badge) => badge && badge.trim().length > 0);

  const guidingThoughts = [0, 1, 2, 3].map((i) => t(`guidingThoughts.items.${i}`));
  const nonGoals = [0, 1, 2].map((i) => t(`right.quick.nonGoalsItems.${i}`));

  const valueColors = [
    'border-teal-200 bg-teal-50/60',
    'border-sky-200 bg-sky-50/60',
    'border-violet-200 bg-violet-50/60',
    'border-amber-200 bg-amber-50/60',
    'border-emerald-200 bg-emerald-50/60',
    'border-rose-200 bg-rose-50/60',
  ];

  const heroImgBase = 'media/ui/about/hero';

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
                to="/parents"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
              >
                {t('hero.ctaParents')}
              </Link>

              <a
                href="#call-for-action"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
              >
                {t('hero.ctaCoop')}
              </a>
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
              <Panel title={t('positioning.cards.0.title')} kicker={t('positioning.cards.0.kicker')}>
                <p>{t('positioning.cards.0.body')}</p>
              </Panel>
              <Panel title={t('positioning.cards.1.title')} kicker={t('positioning.cards.1.kicker')}>
                <p>{t('positioning.cards.1.body')}</p>
              </Panel>
            </section>

            {/* GUIDING THOUGHTS */}
            <Panel title={t('guidingThoughts.title')} kicker={t('guidingThoughts.kicker')}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <StatementCard text={guidingThoughts[0]} featured />
                </div>
                <StatementCard text={guidingThoughts[1]} />
                <StatementCard text={guidingThoughts[2]} />
                <div className="md:col-span-2">
                  <StatementCard text={guidingThoughts[3]} />
                </div>
              </div>
            </Panel>

            {/* METHOD */}
            <Panel title={t('method.title')} kicker={t('method.kicker')}>
              <p>{t('method.copy1')}</p>
              <p className="mt-3">{t('method.copy2')}</p>
            </Panel>

            {/* VALUES */}
            <Panel title={t('values.title')} kicker={t('values.kicker')}>
              <p>{t('values.intro')}</p>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {(['0', '1', '2', '3', '4', '5'] as const).map((k, idx) => (
                  <ValueCard
                    key={k}
                    title={t(`values.items.${k}.title`)}
                    body={t(`values.items.${k}.body`)}
                    colorClass={valueColors[idx]}
                  />
                ))}
              </div>
            </Panel>

            {/* GLIMPSES */}
            <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
              <div className="text-xs font-semibold text-[var(--color-teal-600)]">
                {t('glimpses.kicker')}
              </div>

              <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
                {t('glimpses.title')}
              </h2>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">
                {t('glimpses.copy')}
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[0, 1, 2].map((idx) => {
                  const base = `media/ui/about/glimpse-${idx + 1}`;
                  return (
                    <GlimpseCard
                      key={idx}
                      base={base}
                      alt={t(`glimpses.items.${idx}.alt`)}
                      title={t(`glimpses.items.${idx}.title`)}
                      body={t(`glimpses.items.${idx}.body`)}
                    />
                  );
                })}
              </div>
            </section>

            {/* ACCORDIONS */}
            <div className="space-y-3">
              <Accordion title={t('brand.title')} ariaLabel={t('brand.aria')} defaultOpen>
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
                    bio={t('team.people.0.bio')}
                    imgKey="melina"
                    imgAlt={t('team.people.0.imageAlt')}
                  />
                  <PersonCard
                    name={t('team.people.1.name')}
                    role={t('team.people.1.role')}
                    bio={t('team.people.1.bio')}
                    imgKey="annsofie"
                    imgAlt={t('team.people.1.imageAlt')}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
                <div className="text-xs font-semibold text-[var(--color-teal-600)]">
                  {t('right.quick.kicker')}
                </div>

                <div className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed space-y-3">
                  <div>
                    <div className="font-semibold text-slate-900">{t('right.quick.whatTitle')}</div>
                    <div className="mt-1">{t('right.quick.whatBody')}</div>
                  </div>

                  <div>
                    <div className="font-semibold text-slate-900">{t('right.quick.forWhoTitle')}</div>
                    <div className="mt-1">{t('right.quick.forWhoBody')}</div>
                  </div>

                  <div>
                    <div className="font-semibold text-slate-900">{t('right.quick.nonGoalsTitle')}</div>
                    <BulletList items={nonGoals} />
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <Link
                    to="/concept"
                    className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
                  >
                    {t('right.quick.ctaConcept')}
                  </Link>
                  <a
                    href={t('right.quick.privacyPdfHref')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
                  >
                    {t('right.quick.ctaPrivacy')}
                  </a>
                </div>
              </div>

              <SidebarMiniCard
                kicker={t('right.note.kicker')}
                title={t('right.note.title')}
                body={t('right.note.body')}
              />
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}