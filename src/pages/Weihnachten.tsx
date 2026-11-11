// src/pages/Weihnachten.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { assetUrl } from '../common/assetUrl';

const EVENTS = [
  {
    num: 1,
    advent: '1. Advent',
    day: 'Do, 3. Dez.',
    time: '16:00 – 17:30 Uhr',
    title: 'Anstoß im Weihnachtslicht',
    lead: 'Markus spielt lieber online. Schafft er es noch rechtzeitig zum Anpfiff?',
    emoji: '⚽',
    cover: '/media/story/episodes/sp0e02/Cover_sp0e02-512.webp',
    location: 'Stadtbücherei Gifhorn, Cardenap 1',
    contact: 'buecherei@stadt-gifhorn.de',
    deviceNote: 'Geräte in begrenzter Anzahl vor Ort',
    from: 'from-teal-50',
    border: 'border-teal-200',
    num_color: 'text-[var(--color-teal-600)]',
    link_color: 'text-[var(--color-teal-700)]',
    badge: 'bg-[var(--color-teal-50)] text-[var(--color-teal-700)] border-[var(--color-teal-200)]',
    placeholder: 'bg-teal-100',
  },
  {
    num: 2,
    advent: '2. Advent',
    day: 'Fr, 11. Dez.',
    time: '14:30 – 16:00 Uhr',
    title: 'Freundschaft auf Probe',
    lead: 'Yasmin fühlt sich ausgeschlossen. Kann ihr die Advents-Challenge helfen?',
    emoji: '🤝',
    cover: '/media/story/episodes/sp0e03/Cover_sp0e03-512.webp',
    location: 'Schütte, Steinweg 29',
    contact: 'hello@amysurfwing.de',
    deviceNote: 'Eigenes Handy oder Tablet mitbringen',
    from: 'from-violet-50',
    border: 'border-violet-200',
    num_color: 'text-violet-600',
    link_color: 'text-violet-700',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    placeholder: 'bg-violet-100',
  },
  {
    num: 3,
    advent: '3. Advent',
    day: 'Di, 15. Dez.',
    time: '16:00 – 17:30 Uhr',
    title: 'Weihnachten kann man nicht planen',
    lead: 'Die 7b hat alle Hände voll zu tun. Kann KI die Feier retten?',
    emoji: '🎄',
    cover: '/media/story/episodes/sp0e04/Cover_sp0e04-512.webp',
    location: 'Stadtbücherei Gifhorn, Cardenap 1',
    contact: 'buecherei@stadt-gifhorn.de',
    deviceNote: 'Geräte in begrenzter Anzahl vor Ort',
    from: 'from-amber-50',
    border: 'border-amber-200',
    num_color: 'text-amber-600',
    link_color: 'text-amber-700',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    placeholder: 'bg-amber-100',
  },
  {
    num: 4,
    advent: '4. Advent',
    day: 'Di, 22. Dez.',
    time: '16:00 – 17:30 Uhr',
    title: 'KI, Küsse & Kevin',
    lead: 'Emma vertraut sich einem KI-Chatbot an. Versteht er sie wirklich besser?',
    emoji: '💬',
    cover: '/media/story/episodes/sp0e05/cover_sp0e05-512.webp',
    location: 'Spielbörse, Steinweg 11',
    contact: 'hello@amysurfwing.de',
    deviceNote: 'Eigenes Handy oder Tablet mitbringen',
    from: 'from-rose-50',
    border: 'border-rose-200',
    num_color: 'text-rose-600',
    link_color: 'text-rose-700',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    placeholder: 'bg-rose-100',
  },
];

const FAQ_ITEMS = [
  { q: 'Brauche ich eine Anmeldung?', a: 'Ja, bitte melde dich per E-Mail an. Teile dabei Name, Alter und eventuelle Allergien deines Kindes sowie eine Notfall-Telefonnummer mit. Alle vier Termine haben begrenzte Plätze.' },
  { q: 'Was kostet die Teilnahme?', a: 'Eintritt frei – für alle vier Termine! Kekse sind auch dabei.' },
  { q: 'Für wen sind die Workshops geeignet?', a: 'Für Kinder der 4.–6. Klasse (ca. 9–12 Jahre). Vorkenntnisse sind nicht nötig.' },
  { q: 'Muss ich ein Gerät mitbringen?', a: 'Das hängt vom Termin ab. Bei den Terminen in der Stadtbücherei (3.12. und 15.12.) stehen Geräte bereit. Für die Termine in der Schütte, Steinweg 29 (11.12.) und in der Spielbörse, Steinweg 11 (22.12.) bitte ein eigenes Handy oder Tablet mitbringen.' },
  { q: 'Muss mein Kind alle vier Termine besuchen?', a: 'Nein – jedes Special ist eine eigene Geschichte. Die Termine können unabhängig voneinander besucht werden.' },
  { q: 'Kann mein Kind die Specials auch zuhause spielen?', a: 'Ja! Jeden Adventssonntag wird ein neues Special in der Amy Surfwing App freigeschaltet – kostenlos, direkt im Browser, ohne Download.' },
];

function ShareButton() {
  const [copied, setCopied] = useState(false);
  const url = 'https://app.amysurfwing.de/#/weihnachten';
  const text = '🎄 Kekse, Klicks & Weihnachtsabenteuer! Amy Surfwing Weihnachts-Specials in Gifhorn – Eintritt frei!';

  async function handleShare() {
    if (navigator.share) {
      try { await navigator.share({ title: 'Amy Surfwing – Weihnachten in Gifhorn', text, url }); } catch { /* abgebrochen */ }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button type="button" onClick={handleShare}
      className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
    >
      {copied ? '✓ Link kopiert!' : '🔗 Weiterempfehlen'}
    </button>
  );
}

export default function Weihnachten() {
  return (
    <Layout>
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-4 sm:space-y-6">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden rounded-3xl border border-white/50 shadow-lg bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-teal-50)] via-white to-amber-50/40" />
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[var(--color-teal-200)]/30 blur-2xl" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-amber-200/25 blur-2xl" />

          <div className="relative">
            {/* Text */}
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-teal-700)] mb-1">
                <span>✨</span>
                <span>Gifhorn · Adventszeit 2025</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-teal-900)] leading-tight">
                Kekse, Klicks &<br />
                Weihnachts&shy;abenteuer
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Vier interaktive Workshop-Abende für Kinder der 4.–6.&nbsp;Klasse. Gemeinsam Geschichten
                erleben, Entscheidungen treffen, über KI&nbsp;& Freundschaft reden.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: '🎟️ Eintritt frei',   cls: 'bg-teal-50 border-teal-200 text-teal-800' },
                  { label: '📚 4.–6. Klasse',    cls: 'bg-violet-50 border-violet-200 text-violet-800' },
                  { label: '⏱ 90 Minuten',       cls: 'bg-amber-50 border-amber-200 text-amber-800' },
                  { label: '🍪 Kekse inklusive', cls: 'bg-rose-50 border-rose-200 text-rose-800' },
                ].map(b => (
                  <span key={b.label} className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${b.cls}`}>
                    {b.label}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="mailto:hello@amysurfwing.de"
                  className="inline-flex items-center justify-center rounded-2xl px-6 py-3 font-bold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors shadow-md"
                >
                  ✉️ Jetzt anmelden
                </a>
                <ShareButton />
              </div>
            </div>

          </div>
        </section>

        {/* ── TERMINE ── */}
        <div>
          <div className="text-xs font-semibold text-[var(--color-teal-600)] uppercase tracking-widest mb-3 px-0.5">
            Vier Termine im Advent
          </div>
          <div className="space-y-3">
            {EVENTS.map(ev => (
              <section
                key={ev.num}
                className={`bg-gradient-to-br ${ev.from} via-white to-white rounded-2xl shadow-sm border ${ev.border} p-5 sm:p-6 overflow-hidden relative`}
              >
                {/* Große dekorative Nummer im Hintergrund */}
                <div className={`absolute -right-2 -top-3 text-[80px] font-black leading-none ${ev.num_color} opacity-[0.07] select-none pointer-events-none`}>
                  {ev.num}
                </div>

                <div className="relative flex items-start gap-4">
                  {/* Cover-Bild oder farbiger Platzhalter */}
                  <div className="shrink-0 w-20 flex flex-col gap-2 items-center">
                    <div className={`w-20 aspect-[3/4] rounded-xl overflow-hidden ${ev.cover ? '' : ev.placeholder + ' flex items-center justify-center'} shadow-sm border border-white/80`}>
                      {ev.cover ? (
                        <img
                          src={assetUrl(ev.cover)}
                          alt={ev.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-4xl">{ev.emoji}</span>
                      )}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wide border rounded-full px-2 py-0.5 text-center leading-tight whitespace-nowrap ${ev.badge}`}>
                      {ev.advent}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`text-[11px] font-bold uppercase tracking-wide ${ev.num_color} mb-0.5`}>
                      {ev.day} · {ev.time}
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {ev.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{ev.lead}</p>

                    <div className="mt-3 grid grid-cols-1 gap-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5"><span>📍</span><span>{ev.location}</span></div>
                      <div className="flex items-center gap-1.5"><span>📱</span><span>{ev.deviceNote}</span></div>
                      <div className="flex items-center gap-1.5">
                        <span>✉️</span>
                        <a href={`mailto:${ev.contact}`} className={`font-medium hover:underline ${ev.link_color}`}>{ev.contact}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* ── WAS ERWARTET DIE KINDER ── */}
        <section className="rounded-2xl border border-[var(--color-teal-200)] bg-[var(--color-teal-50)] p-5 sm:p-6">
          <div className="text-xs font-semibold text-[var(--color-teal-700)] uppercase tracking-wide">
            Über die Workshops
          </div>
          <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
            Was erwartet die Kinder?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
            Die Kinder lesen eine Geschichte wie einen echten Chat — mit Yasmin, Markus und der 7b.
            Sie treffen eigene Entscheidungen und tauschen sich in der Gruppe darüber aus.
            Es geht um KI, Freundschaft, Online-Verhalten und das, was uns dabei wirklich beschäftigt.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['💬 Chat-Story', '🤔 Eigene Entscheidungen', '👥 Gemeinsam reflektieren', '🤖 KI verstehen'].map(tag => (
              <span key={tag} className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold bg-white border border-[var(--color-teal-200)] text-[var(--color-teal-800)]">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* ── SO BIST DU DABEI ── */}
        <section className="rounded-2xl border border-[var(--color-teal-200)] bg-[var(--color-teal-50)] p-5 sm:p-6">
          <div className="text-xs font-semibold text-[var(--color-teal-700)] uppercase tracking-wide">
            Anmeldung
          </div>
          <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
            So bist du dabei
          </h2>
          <div className="mt-4 space-y-3">
            {[
              { n: '1', emoji: '📅', label: 'Termin aussuchen', sub: 'Such dir einen oder mehrere Adventsabende aus.' },
              { n: '2', emoji: '✉️', label: 'Per E-Mail anmelden', sub: 'Name, Alter, eventuelle Allergien und Notfall-Telefonnummer angeben.' },
              { n: '3', emoji: '🎉', label: 'Einfach hinkommen', sub: 'Pünktlich erscheinen — und Spaß haben!' },
            ].map(step => (
              <div key={step.n} className="flex items-start gap-3 bg-white/60 rounded-xl p-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-teal-600)] text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {step.n}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{step.emoji} {step.label}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{step.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="mailto:hello@amysurfwing.de"
              className="inline-flex items-center justify-center rounded-2xl px-6 py-3 font-bold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors shadow-md"
            >
              ✉️ Jetzt anmelden
            </a>
            <ShareButton />
          </div>
          <p className="mt-4 text-xs text-slate-500 leading-relaxed">
            Eine Aufsichtspflicht wird nicht übernommen. Bitte telefonisch erreichbar bleiben und das Kind pünktlich abholen.
          </p>
        </section>

        {/* ── ZUHAUSE SPIELEN ── */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
          <div className="text-xs font-semibold text-[var(--color-teal-600)] uppercase tracking-wide">
            Amy Surfwing App
          </div>
          <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
            📱 Auch zuhause spielbar
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
            Jeden Adventssonntag wird ein neues Special in der Amy Surfwing App freigeschaltet —
            kostenlos, direkt im Browser, ohne Download. Das erste Special ist ab dem{' '}
            <strong>1. Advent (30. November)</strong> spielbar.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
            >
              Zur App →
            </Link>
            <Link
              to="/parents"
              className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
            >
              Infos für Eltern →
            </Link>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
          <div className="text-xs font-semibold text-[var(--color-teal-600)] uppercase tracking-wide">
            Fragen & Antworten
          </div>
          <h2 className="mt-1 text-base sm:text-lg font-semibold text-[var(--color-teal-900)] mb-4">
            Häufige Fragen
          </h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="group rounded-2xl border border-slate-100 bg-slate-50/50">
                <summary className="cursor-pointer list-none px-4 py-3.5 flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-900 text-sm">{item.q}</span>
                  <span className="shrink-0 w-7 h-7 rounded-full border border-[var(--color-teal-200)] bg-[var(--color-teal-50)] flex items-center justify-center text-[var(--color-teal-600)] group-open:rotate-45 transition-transform text-sm font-bold">
                    +
                  </span>
                </summary>
                <p className="px-4 pb-4 text-sm text-slate-700 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── ÜBER AMY SURFWING ── */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={assetUrl('media/story/characters/amy-256.webp')}
              alt="Amy"
              className="w-11 h-11 rounded-full object-cover object-top border-2 border-[var(--color-teal-100)] shrink-0"
            />
            <div>
              <div className="text-xs font-semibold text-[var(--color-teal-600)] uppercase tracking-wide">Amy Surfwing</div>
              <div className="font-semibold text-[var(--color-teal-900)] text-sm">Was ist Amy Surfwing?</div>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500 mb-1">Die neue Chat-Serie für Kids in einer interaktiven Story-Welt.</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Amy Surfwing ist eine interaktive Chat-Serie für Kids ab 9 Jahren. In einer Story-Welt erleben sie
            zusammen mit Yasmin, Carlos und Co spannende Situationen aus dem digitalen Alltag – fünf Minuten pro Tag.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['📖 Story statt Unterricht', '⏱️ 5 Minuten statt endloser Bildschirmzeit', '🤔 Reflexion statt Konsum', '🌐 Training für die digitale Realität', '🌱 Altersgerecht statt überfordernd', '🔒 Sicherer Raum statt soziales Netzwerk'].map(p => (
              <span key={p} className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">{p}</span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/" className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors text-sm">
              Mehr erfahren →
            </Link>
            <Link to="/parents" className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors text-sm">
              Für Eltern →
            </Link>
          </div>
        </section>

        {/* ── PARTNER ── */}
        <div className="text-center py-2">
          <p className="text-xs text-slate-400 mb-3">In Kooperation mit</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className="text-sm font-semibold text-slate-500">Stadt Gifhorn · Stadtbücherei</span>
            <span className="text-sm font-semibold text-slate-500">schütte</span>
            <span className="text-sm font-semibold text-slate-500">Spielbörse</span>
            <span className="text-sm font-semibold text-slate-500">wistagifhorn</span>
          </div>
        </div>

        {/* ── FOOTER SHARE ── */}
        <div className="text-center pb-4">
          <p className="text-sm text-slate-500 mb-3">
            Kinder aus deiner Schule oder deinem Verein könnten das auch mögen?
          </p>
          <ShareButton />
        </div>

      </div>
    </Layout>
  );
}
