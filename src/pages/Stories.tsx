// src/pages/Stories.tsx
import React, { useMemo, useRef } from 'react';
import Layout from '../components/Layout';
import CourseCard from '../components/CourseCard';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../common/utils';
import { getProgress, getCompletedChapterCount } from '../progress/storyProgress';
import { assetUrl } from '../common/assetUrl';

import { getStoryCards } from '../content/contentIndex';
import { getPlayableEpisode } from '../content/getPlayableEpisode';
import { useProfile } from '../profile/useProfile'; // ✅ NEW
import { shouldBypassAll } from '../gating/entitlements';

function Panel({
  title,
  kicker,
  children,
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


function InfoTile({ title, text }: { title: string; text: string }) {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm flex flex-col">
      <div className="font-extrabold text-slate-900 leading-snug">{title}</div>
      <div className="mt-2 text-sm text-slate-700 leading-snug flex-1">{text}</div>
      <div className="mt-3 h-1 w-10 rounded-full bg-slate-100" />
    </div>
  );
}



function SwipeRow({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const st = useRef({
    down: false,
    dragged: false,
    x: 0,
    left: 0,
    pointerId: -1,
  });

  const isInteractiveTarget = (target: EventTarget | null) => {
    const el = target as HTMLElement | null;
    if (!el) return false;
    return Boolean(el.closest('button, a, input, textarea, select, label'));
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex gap-3 overflow-x-auto pb-2',
        'snap-x snap-mandatory',
        'items-stretch',
        'touch-pan-x select-none',
        '[&::-webkit-scrollbar]:hidden',
        className
      )}
      onPointerDown={(e) => {
        const el = ref.current;
        if (!el) return;

        // ✅ wenn user auf Button/Link klickt: NICHT drag-gen
        if (isInteractiveTarget(e.target)) return;

        st.current.down = true;
        st.current.dragged = false;
        st.current.x = e.clientX;
        st.current.left = el.scrollLeft;
        st.current.pointerId = e.pointerId;

        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || !st.current.down) return;

        const dx = e.clientX - st.current.x;

        // ✅ Drag erst ab Threshold werten (sonst “tap” = scroll = click kaputt)
        if (!st.current.dragged && Math.abs(dx) > 8) {
          st.current.dragged = true;
        }

        if (st.current.dragged) {
          el.scrollLeft = st.current.left - dx;
        }
      }}
      onPointerUp={() => {
        st.current.down = false;
        st.current.pointerId = -1;
        // dragged bleibt kurz true, damit click nach drag nicht “durchgeht”
        window.setTimeout(() => {
          st.current.dragged = false;
        }, 0);
      }}
      onPointerCancel={() => {
        st.current.down = false;
        st.current.dragged = false;
        st.current.pointerId = -1;
      }}
      onClickCapture={(e) => {
        // ✅ wenn es ein Drag war: Clicks danach blocken
        if (st.current.dragged) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {children}
    </div>
  );
}

const SURVEY_URL =
  'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__tVBf5hUMUNFRjhWUzdDMTBBWVlJMVJIRE80M0sxTy4u';

export default function Stories() {
  const navigate = useNavigate();
  const { t: tStories, i18n } = useTranslation('stories');
    const { t: tCommon } = useTranslation('common'); // ✅ swipeHint stabil
    const lang = (i18n.resolvedLanguage ?? i18n.language).startsWith('en') ? 'en' : 'de';
  const { profile } = useProfile(); // ✅ NEW

  // ✅ Reihenfolge: genau so wie Content Index es liefert
const cardsInOrder = useMemo(() => getStoryCards(), []);
const cardsForUI = cardsInOrder;

    const playableById = useMemo(() => {
    const m: { [key: string]: boolean } = {};
    for (const c of cardsForUI) {
      m[c.id] = Boolean(getPlayableEpisode(c.id, lang));
    }
    return m;
  }, [cardsForUI, lang]);

  // ✅ Progress je Story (0..100)
const progressById = cardsForUI.reduce<Record<string, number>>((acc, card) => {
  const p = getProgress(card.id);
  if (!p) {
    acc[card.id] = 0;
    return acc;
  }

  const totalChapters = Math.max(1, card.chaptersTotal ?? 1);
  const completedCount = getCompletedChapterCount(card.id);

  const finishedPct = p.finished ? 100 : Math.floor((completedCount / totalChapters) * 100);
  acc[card.id] = Math.max(0, Math.min(100, finishedPct));
  return acc;
}, {});

function isCourseFinished(courseId: string, chaptersTotal?: number) {
  const p = getProgress(courseId);
  if (!p) return false;
  if (p.finished) return true;

  const total = Math.max(1, chaptersTotal ?? 1);
  const completedCount = getCompletedChapterCount(courseId);
  return completedCount >= total;
}

  // ✅ “Kette”: Story N ist nur spielbar, wenn Story N-1 fertig ist (außer die erste)
function isUnlockedByChain(
  orderedCards: { id: string; chaptersTotal?: number }[],
  courseId: string
) {
  if (shouldBypassAll(courseId)) return true;

  const idx = orderedCards.findIndex((c) => c.id === courseId);
  if (idx <= 0) return true;
  const prev = orderedCards[idx - 1];
  return isCourseFinished(prev.id, prev.chaptersTotal);
}

  // ✅ Continue/Start Auswahl: released + playable
  const availableCards = cardsForUI.filter((c) => {
    const playable = playableById[c.id] ?? false;
    const unlocked = isUnlockedByChain(cardsInOrder, c.id);
    return c.released && playable && unlocked;
  });

  const currentCourseId = profile?.progress?.current?.courseId as string | undefined;

  const currentFromProfile =
    currentCourseId ? availableCards.find((c) => c.id === currentCourseId) : undefined;

  const currentCard =
    currentFromProfile ??
    availableCards.find((c) => {
      const pct = progressById[c.id] ?? 0;
      return pct > 0 && pct < 100;
    }) ??
    availableCards.find((c) => (progressById[c.id] ?? 0) === 0) ??
    availableCards[0];

  const currentPct = currentCard ? (progressById[currentCard.id] ?? 0) : 0;
  const hasStarted = currentPct > 0;
  const noAvailableStories = availableCards.length === 0;

  function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm font-semibold bg-white/80 border border-white/60 text-[var(--color-teal-900)] backdrop-blur">
      {children}
    </span>
  );
}

  

  return (
    <Layout backPath="/" hideFooter>
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-3 py-6 sm:py-10 space-y-6">
        {/* HERO – kids-first */}
      <section className="relative overflow-hidden rounded-3xl border border-white/50 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[var(--color-teal-50)]" />
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[var(--color-teal-200)]/30 blur-2xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[var(--color-teal-300)]/20 blur-2xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* TEXT */}
          <div className="lg:col-span-6 p-6 sm:p-10 lg:pr-6 flex flex-col justify-center">
            <div className="text-xs sm:text-sm font-semibold text-[var(--color-teal-700)]">
              {tStories('hero.kicker', { defaultValue: 'Amy Surfwing' })}
            </div>

            <h1 className="mt-2 text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--color-teal-900)] leading-tight">
              {tStories('hero.title', { defaultValue: 'Amy Surfwing wartet schon ✨' })}
            </h1>

            <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-700 leading-relaxed">
              {tStories('hero.lead', {
                defaultValue:
                  'Tauche ein in die Welt von Amy Surfwing! In jeder Story erlebst du, was Yasmin, Carlos & Co online passiert.',
              })}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>{tStories('hero.badges.0', { defaultValue: '5 min/Tag' })}</Badge>
              <Badge>{tStories('hero.badges.1', { defaultValue: '1 Amic/Tag' })}</Badge>
              <Badge>{tStories('hero.badges.2', { defaultValue: '5/Woche' })}</Badge>
              <Badge>{tStories('hero.badges.3', { defaultValue: '10 bis 12 Jahre' })}</Badge>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById('story-list')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
              >
                {tStories('hero.ctaPrimary', { defaultValue: 'Zu den Amics →' })}
              </button>

              <Link
                to="/parents"
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
              >
                {tStories('hero.ctaParents', { defaultValue: 'Für Eltern →' })}
              </Link>
            </div>
          </div>

          {/* MEDIA */}
          <div className="lg:col-span-6 relative min-h-[280px] sm:min-h-[340px] lg:min-h-[420px]">
            <img
              src={assetUrl('media/ui/stories/stories-hero-1024.webp')}
              alt={tStories('hero.imageAlt', { defaultValue: 'Story-Welt: Mia, Finn und Freunde' })}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/10 to-transparent lg:from-transparent lg:via-transparent lg:to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

     {/* ✅ CONTINUE / START – direkt unter Hero */}
{noAvailableStories ? (
  <Panel
    kicker={tStories('comingSoon.kicker', { defaultValue: 'Bald geht’s los' })}
    title={tStories('comingSoon.title', { defaultValue: 'Neue Stories kommen bald ✨' })}
  >
    <p className="text-sm text-slate-700">
      {tStories('comingSoon.text', {
        defaultValue:
          'Im Moment ist noch keine Story freigeschaltet. Schau bald wieder vorbei!',
      })}
    </p>
  </Panel>
) : currentCard ? (
  <Panel
    kicker={
      hasStarted
        ? tStories('continue.kicker', { defaultValue: 'Weiterlesen' })
        : tStories('start.kicker', { defaultValue: 'Jetzt starten' })
    }
    title={
      hasStarted
        ? tStories('continue.title', { defaultValue: 'Mach da weiter, wo du aufgehört hast' })
        : tStories('start.title', { defaultValue: 'Teste eine Story kostenfrei' })
    }
          >
            <div className="mt-2 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* Bild: nicht länglich, nie verzerrt */}
              <div className="lg:col-span-4">
                <div className="aspect-[16/10] max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={assetUrl(currentCard.cover?.trim() ? currentCard.cover : 'media/ui/locked-1024.webp')}
                    alt={tStories('continue.imageAlt', { defaultValue: 'Aktuelle Story' })}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text + CTA */}
              <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <div className="text-sm font-semibold text-slate-500">
                    {hasStarted
                      ? tStories('continue.label', { defaultValue: 'Aktuell' })
                      : tStories('start.label', { defaultValue: 'Neu für dich' })}
                  </div>

                  <div className="mt-1 text-lg font-extrabold text-slate-900 leading-snug">
                    {tStories(currentCard.titleKey)}
                  </div>

                  <div className="mt-1 text-sm text-slate-600">
                    {tStories(currentCard.descriptionKey)}
                  </div>
                </div>

                <div className="mt-4">
                  {hasStarted ? (
                    <>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>{tStories('continue.progress', { defaultValue: 'Fortschritt' })}</span>
                        <span>{currentPct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-[#0084ff]"
                          style={{ width: `${currentPct}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="text-xs font-semibold text-slate-500">
                      {tStories('start.hint', { defaultValue: 'Keine Anmeldung nötig – einfach loslesen.' })}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate(`/stories/${currentCard.id}`)}
                    className="mt-4 w-full inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
                  >
                    {hasStarted
                      ? tStories('continue.cta', { defaultValue: 'Weiterlesen →' })
                      : tStories('start.cta', { defaultValue: 'Jetzt starten →' })}
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        ) : null}


{/* HOW-TO (neu, strukturiert) */}
<Panel
  kicker={tStories('howto.kicker', { defaultValue: 'Kurz erklärt' })}
  title={tStories('howto.title', { defaultValue: 'So nutzt du Amy Surfwing' })}
>


  {/* FLOW */}
  <div className="mt-5">


    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {(['1', '2', '3', '4'] as const).map((k, idx) => (
        <div key={k} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-bold text-slate-400">Step {idx + 1}</div>
          <div className="mt-1 font-semibold text-slate-900">
            {tStories(`howto.flow.steps.${k}.title`)}
          </div>
          <div className="mt-1 text-sm text-slate-700 leading-snug">
            {tStories(`howto.flow.steps.${k}.text`)}
          </div>
        </div>
      ))}
    </div>
  </div>


  <div className="mt-5 font-semibold text-slate-900">
    {tStories('howto.cta', { defaultValue: 'Viel Spaß mit Amy Surfwing! 💬🦉' })}
  </div>
</Panel>

{/* GOOD TO KNOW – swipe cards */}
<Panel
  kicker={tStories('howto.info.kicker', { defaultValue: 'Gut zu wissen' })}
  title={tStories('howto.info.title', { defaultValue: 'Damit du dich gut zurechtfindest' })}
>
  <div className="mt-2">
    <SwipeRow className="-mx-4 px-4 lg:mx-0 lg:px-0">
            {/* 1) Order */}
      <div className="snap-start shrink-0 w-[78%] sm:w-[44%] lg:w-[320px]">
        <InfoTile
          title={tStories('howto.info.tiles.order.title', { defaultValue: 'Schritt für Schritt ➡️' })}
          text={tStories('howto.info.tiles.order.text', {
            defaultValue: 'Du machst die Kapitel der Reihe nach: erst das nächste, dann geht’s weiter.',
          })}
        />
      </div>
      {/* 2) Reflektion */}
            <div className="snap-start shrink-0 w-[78%] sm:w-[44%] lg:w-[320px]">
        <InfoTile
          title={tStories('howto.info.tiles.reflection.title', { defaultValue: 'Deine Sicht zählt 👁' })}
          text={tStories('howto.info.tiles.reflection.text', {
            defaultValue:
              'Du formulierst deine eigene Antwort – in deinen Worten. Es geht nicht um richtig oder falsch, sondern darum, deine Gedanken ernst zu nehmen.',
          })}
        />
      </div>

      {/* 3) Retry + Lock (combined) */}
      <div className="snap-start shrink-0 w-[78%] sm:w-[44%] lg:w-[320px]">
        <InfoTile
          title={tStories('howto.info.tiles.retryLock.title', { defaultValue: 'Wenn es nicht passt 🔁' })}
          text={tStories('howto.info.tiles.retryLock.text', {
            defaultValue:
              'Wenn deine Antwort zu kurz ist oder nicht zur Frage passt, fragt Amy nochmal. Nach 3 Versuchen ist kurz Pause – dann am besten mit Eltern anschauen.',
          })}
        />
      </div>

      {/* 4) Safe */}
      <div className="snap-start shrink-0 w-[78%] sm:w-[44%] lg:w-[320px]">
        <InfoTile
          title={tStories('howto.info.tiles.safe.title', { defaultValue: 'Fair & safe ✅' })}
          text={tStories('howto.info.tiles.safe.text', {
            defaultValue: 'Beleidigungen, Mobbing oder gefährliche Inhalte gehen nicht. Dann stoppt Amy.',
          })}
        />
      </div>

      {/* 5) Backup */}
      <div className="snap-start shrink-0 w-[78%] sm:w-[44%] lg:w-[320px]">
        <InfoTile
          title={tStories('howto.info.tiles.backup.title', { defaultValue: 'Speichern & Backup 💾' })}
          text={tStories('howto.info.tiles.backup.text', {
            defaultValue:
              'Dein Fortschritt bleibt auf deinem Gerät gespeichert. 💾 Wenn du möchtest, kannst du ihn zusätzlich sichern.',
          })}
        />
      </div>


    </SwipeRow>
  </div>

</Panel>



 {/* STORY CARDS */}
<Panel
  kicker={tStories('list.kicker', { defaultValue: 'Amy Surfwing' })}
  title={tStories('list.title', { defaultValue: 'Starte dein Amic' })}
>
  <div id="story-list" className="scroll-mt-24" />

  <p className="text-sm sm:text-base text-slate-700">
    {tStories('list.lead', { defaultValue: 'Ein Klick und du bist mitten im Abenteuer.' })}
  </p>



  <div className="mt-4">
    <SwipeRow className="-mx-4 px-4 lg:mx-0 lg:px-0">
      {cardsForUI.map((card) => {
        const playable = playableById[card.id] ?? false;

        const locked =
          !card.released ||
          !playable ||
          !isUnlockedByChain(cardsInOrder, card.id); // ✅ Kette immer auf cardsInOrder

        const coverPath = card.cover?.trim() ? card.cover : 'media/ui/locked-512.webp';
        const title = locked ? `🔒 ${tStories(card.titleKey)}` : tStories(card.titleKey);
        const description = tStories(card.descriptionKey);

        return (
          <div key={card.id} className="snap-start shrink-0 w-[78%] sm:w-[44%] lg:w-[320px]">
            <CourseCard
              compact
              locked={locked}
              image={assetUrl(coverPath)}
              title={title}
              description={description}
              progressPercent={locked ? 0 : (progressById[card.id] ?? 0)}
              onClick={() => {
                if (locked) return;
                navigate(`/stories/${card.id}`);
              }}
            />
          </div>
        );
      })}
    </SwipeRow>
  </div>
</Panel>



<Panel
  kicker={tStories('trust.kicker', { defaultValue: 'Vertrauen' })}
  title={tStories('trust.title', { defaultValue: 'Ein sicherer Raum für deine Gedanken' })}
>
  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
    {tStories('trust.body', {
      defaultValue:
        'In Amy Surfwing liest du nicht nur – du denkst mit. Niemand sieht, was du schreibst. Es gibt keine Likes, kein Ranking und keinen Vergleich. Dein Fortschritt bleibt auf deinem Gerät. Hier kannst du in Ruhe überlegen, was du richtig findest – und Schritt für Schritt lernen, selbst gute Entscheidungen zu treffen.',
    })}
  </p>


  <div className="mt-4 flex flex-wrap gap-2">
    {[
      'Privat 🔒',
      'Ohne Ranking 🚫',
      'Lokal gespeichert 💾',
      'Unterstützende KI 🤝',
    ].map((x, i) => (
      <span
        key={i}
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700"
      >
        {x}
      </span>
    ))}
  </div>

    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="text-sm font-semibold text-slate-900">
      {tStories('helpHint.title', { defaultValue: 'Wenn etwas komisch ist…' })}
    </div>
    <p className="mt-1 text-sm text-slate-700">
      {tStories('helpHint.body', {
        defaultValue:
          'Sprich kurz mit einer erwachsenen Person, der du vertraust (z. B. Eltern, Lehrkraft, Schulsozialarbeit).',
      })}
    </p>
  </div>

  <div className="mt-5 flex flex-wrap gap-3">
    <Link
      to="/concept"
      className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
    >
      Pädagogisches Konzept →
    </Link>

    <Link
      to="/parents"
      className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
    >
      Für Eltern →
    </Link>
  </div>

</Panel>


{/* AYM VISION – so sieht’s aus & das kann es */}
<Panel
  kicker={tStories('aym.kicker', { defaultValue: 'AYM VISION' })}
  title={tStories('aym.title', { defaultValue: 'So sieht’s aus – und das kannst du damit machen' })}
>
  {(() => {
    const items = [
      // ===== Erlebnis (3) =====
      {
        tag: tStories('aym.tags.experience', { defaultValue: 'Erlebnis' }),
        title: tStories('experience.cards.0.title', { defaultValue: 'Story erleben' }),
        text: tStories('experience.cards.0.text', {
          defaultValue:
            'Du tauchst in eine erzählte Welt ein: Mia, Igor & Co erleben Situationen aus dem digitalen Leben – mit Freundschaften, Geheimnissen und Konflikten.',
        }),
        img: 'media/ui/welcome/exp-story-1024.webp',
        alt: tStories('experience.cards.0.imageAlt', {
          defaultValue: 'Illustration: Charaktere in einer digitalen Story-Szene',
        }),
        object: 'object-top',
        mobileH: 'h-56',
        desktopH: 'h-72',
      },
      {
        tag: tStories('aym.tags.experience', { defaultValue: 'Erlebnis' }),
        title: tStories('experience.cards.1.title', { defaultValue: 'Weiterdenken' }),
        text: tStories('experience.cards.1.text', {
          defaultValue:
            'Beim Lesen bleibst du nicht nur Zuschauer: Was triggert dich? Was findest du unfair? Und warum sehen andere das vielleicht ganz anders?',
        }),
        img: 'media/ui/welcome/exp-reflect-1024.webp',
        alt: tStories('experience.cards.1.imageAlt', {
          defaultValue: 'Illustration: Nachdenklicher Moment in der Story',
        }),
        object: 'object-bottom',
        mobileH: 'h-56',
        desktopH: 'h-72',
      },
      {
        tag: tStories('aym.tags.experience', { defaultValue: 'Erlebnis' }),
        title: tStories('experience.cards.2.title', { defaultValue: 'Deine Sicht zählt' }),
        text: tStories('experience.cards.2.text', {
          defaultValue:
            'Du formulierst deine eigene Antwort – in deinen Worten. Es geht nicht um richtig oder falsch, sondern darum, deine Gedanken ernst zu nehmen.',
        }),
        img: 'media/ui/welcome/exp-decide-1024.webp',
        alt: tStories('experience.cards.2.imageAlt', {
          defaultValue: 'Illustration: Eigene Antwort im Story-Verlauf',
        }),
        object: 'object-cover',
        mobileH: 'h-56',
        desktopH: 'h-72',
      },

  // ===== Bonus (6) =====
{
  tag: tStories('aym.tags.bonus', { defaultValue: 'Bonus' }),
  title: tStories('bonus.cards.avatar.title', { defaultValue: 'Avatare' }),
  text: tStories('bonus.cards.avatar.text', {
    defaultValue:
      'Gestalte deinen eigenen Avatar und schalte neue Looks frei – so fühlt sich die Story-Welt noch mehr nach dir an.',
  }),
  img: 'media/ui/welcome/feat-avatar-1024.webp',
  alt: tStories('bonus.cards.avatar.imageAlt', {
    defaultValue: 'Bild: Avatar-Ansicht',
  }),
  object: 'object-cover',
  mobileH: 'h-56',
  desktopH: 'h-72',
},
{
  tag: tStories('aym.tags.bonus', { defaultValue: 'Bonus' }),
  title: tStories('bonus.cards.coins.title', { defaultValue: 'Coins' }),
  text: tStories('bonus.cards.coins.text', {
    defaultValue:
      'Verdiene Coins, wenn du aktiv bist – und nutze sie für neue Extras.',
  }),
  img: 'media/ui/about/sample-1024.webp',
  alt: tStories('bonus.cards.coins.imageAlt', {
    defaultValue: 'Bild: Coins-Übersicht',
  }),
  object: 'object-cover',
  mobileH: 'h-56',
  desktopH: 'h-72',
},
{
  tag: tStories('aym.tags.bonus', { defaultValue: 'Bonus' }),
  title: tStories('bonus.cards.sticker.title', { defaultValue: 'Sticker' }),
  text: tStories('bonus.cards.sticker.text', {
    defaultValue:
      'Für jedes abgeschlossene Kapitel bekommst du Sticker – kleine Zeichen dafür, dass du dranbleibst.',
  }),
  img: 'media/ui/welcome/feat-stickers-1024.webp',
  alt: tStories('bonus.cards.sticker.imageAlt', {
    defaultValue: 'Bild: Sticker-Album',
  }),
  object: 'object-cover',
  mobileH: 'h-56',
  desktopH: 'h-72',
},
{
  tag: tStories('aym.tags.bonus', { defaultValue: 'Bonus' }),
  title: tStories('bonus.cards.newspaper.title', { defaultValue: 'Schülerzeitung' }),
  text: tStories('bonus.cards.newspaper.text', {
    defaultValue:
      'Lies Bonusartikel und entdecke neue Perspektiven aus der Story-Welt.',
  }),
  img: 'media/ui/welcome/feat-newspaper-1024.webp',
  alt: tStories('bonus.cards.newspaper.imageAlt', {
    defaultValue: 'Bild: Schülerzeitung-Bereich',
  }),
  object: 'object-cover',
  mobileH: 'h-56',
  desktopH: 'h-72',
},
{
  tag: tStories('aym.tags.bonus', { defaultValue: 'Bonus' }),
  title: tStories('bonus.cards.diary.title', { defaultValue: 'Tagebuch' }),
  text: tStories('bonus.cards.diary.text', {
    defaultValue:
      'Halte deine Gedanken fest und sieh später nach, wie sich deine Sicht entwickelt hat.',
  }),
  img: 'media/ui/welcome/feat-tagebuch-1024.webp',
  alt: tStories('bonus.cards.diary.imageAlt', {
    defaultValue: 'Bild: Tagebuch-Ansicht',
  }),
  object: 'object-cover',
  mobileH: 'h-56',
  desktopH: 'h-72',
},
{
  tag: tStories('aym.tags.bonus', { defaultValue: 'Bonus' }),
  title: tStories('bonus.cards.collectibles.title', { defaultValue: 'Sammelkarten' }),
  text: tStories('bonus.cards.collectibles.text', {
    defaultValue:
      'Schalte besondere Karten frei, wenn du ganze Story-Abschnitte meisterst.',
  }),
  img: 'media/ui/welcome/feat-sammelkarten-1024.webp',
  alt: tStories('bonus.cards.collectibles.imageAlt', {
    defaultValue: 'Bild: Sammelkarten-Übersicht',
  }),
  object: 'object-cover',
  mobileH: 'h-56',
  desktopH: 'h-72',
},
    ];

    const CardTile = ({
      tag,
      title,
      text,
      img,
      alt,
      object,
      hClass,
    }: {
      tag: string;
      title: string;
      text: string;
      img: string;
      alt: string;
      object: string;
      hClass: string;
    }) => (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full">
        <div className="p-4 sm:p-5">
          <div className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold bg-slate-50 border border-slate-200 text-slate-700">
            {tag}
          </div>
          <div className="mt-2 font-extrabold text-slate-900 leading-snug">{title}</div>
          <div className="mt-1 text-sm text-slate-700 leading-snug">{text}</div>
        </div>
        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
          <div className="rounded-2xl overflow-hidden">
            <img
              src={assetUrl(img)}
              alt={alt}
              className={`w-full ${hClass} object-cover ${object}`}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    );

    return (
      <div className="mt-2">
        {/* Mobile: EIN Swipe für alle Karten */}
        <div className="lg:hidden -mx-4 px-4">
          <SwipeRow>
            {items.map((it, idx) => (
              <div key={idx} className="snap-start shrink-0 w-[85%] sm:w-[70%]">
                <CardTile
                  tag={it.tag}
                  title={it.title}
                  text={it.text}
                  img={it.img}
                  alt={it.alt}
                  object={it.object}
                  hClass={it.mobileH}
                />
              </div>
            ))}
          </SwipeRow>

          <div className="mt-2 text-xs font-semibold text-slate-500">
            {tCommon('swipeHint', { defaultValue: 'Wischen' })}
          </div>
        </div>

        {/* Desktop: Grid (2 Reihen) */}
        <div className="hidden lg:grid grid-cols-3 gap-4 sm:gap-6">
          {items.map((it, idx) => (
            <CardTile
              key={idx}
              tag={it.tag}
              title={it.title}
              text={it.text}
              img={it.img}
              alt={it.alt}
              object={it.object}
              hClass={it.desktopH}
            />
          ))}
        </div>
      </div>
    );
  })()}
</Panel>


        {/* SURVEY – separat */}
        <Panel
          kicker={tStories('survey.kicker', { defaultValue: 'Feedback' })}
          title={tStories('survey.title', { defaultValue: '📝 Kurze Umfrage' })}
        >
          <p className="text-sm sm:text-base text-slate-700">
            {tStories('survey.description', {
              defaultValue: 'Sag uns, wie dir die Story gefallen hat – anonym und in wenigen Minuten.',
            })}
          </p>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              {tStories('survey.noticeTitle', { defaultValue: 'Hinweis' })}
            </div>
            <p className="mt-1 text-sm text-slate-700">
              {tStories('survey.noticeBody', {
                defaultValue:
                  'Du wirst zu einem externen Formular (Microsoft Forms) weitergeleitet. Es gelten die Datenschutzbestimmungen des Anbieters.',
              })}
            </p>
          </div>

          <div className="mt-5">
            <a
              href={SURVEY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
            >
              {tStories('survey.cta', { defaultValue: 'Zur Umfrage →' })}
            </a>
          </div>
        </Panel>
      </div>
    </Layout>
  );
}
