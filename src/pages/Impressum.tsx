import { useState } from 'react';
import Layout from '../components/Layout';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
      <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-slate-700 space-y-1">{children}</div>
    </section>
  );
}

function DisclaimerSection() {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0" aria-hidden>⚠️</span>
        <div>
          <h2 className="text-base font-extrabold text-amber-900">Rechtliche Hinweise</h2>
          <div className="mt-3 text-sm leading-relaxed text-amber-900 space-y-3">
            <p>
              Amy Surfwing ist ein pädagogisches Lernangebot zur Förderung von Medienkompetenz bei Kindern.
            </p>
            <p>
              Die Inhalte richten sich an Kinder im Alter von 10 bis 12 Jahren und sollten idealerweise von Eltern begleitet werden.
            </p>
            <p>
              Die Inhalte von Amy Surfwing dienen ausschließlich der Information und Bildung. Sie stellen keine Rechtsberatung dar.
            </p>
            <p>
              Die Inhalte ersetzen keine medizinische, psychologische oder therapeutische Beratung.
            </p>
            <p className="font-semibold">
              Amy Surfwing ist kein Notfall- oder Beratungsdienst. In akuten Situationen wenden Sie sich bitte an eine Vertrauensperson oder eine geeignete Beratungsstelle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const MEDIA_CREDITS = [
  {
    type: 'Soundeffekt',
    title: '„Short Success Sound – Glockenspiel / Treasure / Video Game" von freesound_community',
    source: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    usedFor: 'Coin-Belohnungseffekt',
  },
  {
    type: 'Soundeffekt',
    title: 'Sticker-Reward-Sound von Crunchpix Studio',
    source: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    usedFor: 'Sticker-Belohnungseffekt',
  },
  {
    type: 'Soundeffekt',
    title: '„Episoden-Abschluss-Sound" von freesound_community',
    source: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    usedFor: 'Abschluss einer Episode',
  },
  {
    type: 'Musik',
    title: 'Vlad Krotov',
    source: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    usedFor: 'Diskussion zwischen Chioma und Dominik; Weeklys mit Chioma',
  },
  {
    type: 'Hintergrundgeräusche',
    title: '„school break noise outdoor.wav" von Libra222',
    source: 'Freesound',
    license: 'Creative Commons Zero (CC0)',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    usedFor: 'Diskussion zwischen Chioma und Dominik; Weeklys mit Chioma',
  },
];

function MediaCreditsSection() {
  const [open, setOpen] = useState(false);
  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
        aria-expanded={open}
      >
        <div>
          <div className="text-base font-extrabold text-slate-900">Verwendete Audioinhalte</div>
          <div className="mt-0.5 text-xs text-slate-500">Musik und Hintergrundgeräusche</div>
        </div>
        <div className="shrink-0 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 transition-transform" style={{ transform: open ? 'rotate(45deg)' : undefined }}>
          +
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5">
          <div className="divide-y divide-slate-100">
            {MEDIA_CREDITS.map((c) => (
              <div key={c.title} className="py-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wide shrink-0">{c.type}</span>
                  <span className="font-semibold text-sm text-slate-900">{c.title}</span>
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {c.source} &mdash;{' '}
                  <a
                    href={c.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]"
                  >
                    {c.license}
                  </a>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Verwendet für: {c.usedFor}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

const LICENSES = [
  {
    name: 'Baloo Bhaijaan 2',
    type: 'SIL Open Font License 1.1 (OFL)',
    author: 'Ek Type',
    url: 'https://scripts.sil.org/OFL',
  },
  {
    name: 'Caveat',
    type: 'SIL Open Font License 1.1 (OFL)',
    author: 'Impallari Type',
    url: 'https://scripts.sil.org/OFL',
  },
  {
    name: '@xenova/transformers',
    type: 'Apache License 2.0',
    author: 'Xenova / Hugging Face',
    url: 'https://www.apache.org/licenses/LICENSE-2.0',
  },
  {
    name: 'lucide-react',
    type: 'ISC License',
    author: 'Lucide Contributors',
    url: 'https://opensource.org/license/isc-license-txt',
  },
  {
    name: 'React',
    type: 'MIT License',
    author: 'Meta Platforms, Inc.',
    url: 'https://opensource.org/licenses/MIT',
  },
  {
    name: 'Vite',
    type: 'MIT License',
    author: 'Evan You',
    url: 'https://opensource.org/licenses/MIT',
  },
  {
    name: 'Tailwind CSS',
    type: 'MIT License',
    author: 'Tailwind Labs, Inc.',
    url: 'https://opensource.org/licenses/MIT',
  },
];

function LicensesSection() {
  const [open, setOpen] = useState(false);
  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
        aria-expanded={open}
      >
        <div>
          <div className="text-base font-extrabold text-slate-900">Lizenzen & Open-Source-Hinweise</div>
          <div className="mt-0.5 text-xs text-slate-500">Verwendete Schriften und Bibliotheken</div>
        </div>
        <div className="shrink-0 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 transition-transform" style={{ transform: open ? 'rotate(45deg)' : undefined }}>
          +
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5">
          <div className="divide-y divide-slate-100">
            {LICENSES.map((l) => (
              <div key={l.name} className="py-3 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <div className="font-semibold text-sm text-slate-900 sm:w-48 shrink-0">{l.name}</div>
                <div className="text-xs text-slate-500 mt-0.5 sm:mt-0">
                  {l.type} &mdash; {l.author}
                  {' · '}
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]"
                  >
                    Lizenztext
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Der vollständige Quellcode der verwendeten Open-Source-Pakete ist über die jeweiligen Repositories zugänglich.
          </p>
        </div>
      )}
    </section>
  );
}

export default function Impressum() {
  return (
    <Layout title="Impressum">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

        <h1 className="text-2xl font-extrabold text-slate-900">Impressum</h1>

        {/*
         * ─────────────────────────────────────────────────────
         * PLATZHALTER — bitte ersetzen:
         * ─────────────────────────────────────────────────────
         */}

        <Section title="Angaben gemäß § 5 TMG">
          {/* ✏️ PLATZHALTER: Vollständiger Name der verantwortlichen Person oder des Unternehmens */}
          <p className="font-semibold">AYM-Vision – ein Bildungsprojekt zur Förderung von Medienkompetenz bei Kindern
und Jugendlichen</p>
<p>Rechtsform: Gesellschaft bürgerlichen Rechts (GbR) – Übergangsphase
(Gründung einer UG / GmbH geplant)</p>
<p className="font-semibold">Gesetzliche Vertreter:</p>
<p>Ann-Sofie Höbrink, Co-Founderin</p>
<p>Melina Wiegers, Co-Founderin</p>
          {/* ✏️ PLATZHALTER: Straße und Hausnummer */}
          <p>Beerbüsche 8</p>
          {/* ✏️ PLATZHALTER: Postleitzahl und Stadt */}
          <p>38551 Ribbesbüttel</p>
          {/* ✏️ PLATZHALTER: Land (wenn relevant) */}
          <p>Deutschland</p>
        </Section>

        <Section title="Eintrag im Handelsregister*">
          {/* ✏️ PLATZHALTER: Telefonnummer (optional, aber üblich) */}
          <p>Aktuell: Nicht erforderlich</p>
          {/* ✏️ PLATZHALTER: E-Mail-Adresse */}
          <p>Registergericht:</p>
          <p>Registernummer:</p>
          <p>* Die Eintragung ins Handelsregister befindet sich in Vorbereitung. Registergericht und Registernummer
werden nachgetragen.</p>
        </Section>

                <Section title="Kontakt">
          {/* ✏️ PLATZHALTER: Telefonnummer (optional, aber üblich) */}
          <p></p>
          {/* ✏️ PLATZHALTER: E-Mail-Adresse */}
          <p>E-Mail: hello@aymvision.de</p>
        </Section>

        <Section title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
          {/* ✏️ PLATZHALTER: Vollständiger Name + Anschrift der inhaltlich verantwortlichen Person */}
          <p>Ann-Sofie Höbrink, Beerbüsche 8, 38551 Ribbelbüttel</p>
          <p>Melina Wiegers, Vis Hermann Hesse 11,6926 Montagnola, TI, Schweiz</p>
        </Section>

                <Section title="Online-Streitbeilegung">
          {/* ✏️ PLATZHALTER: Vollständiger Name + Anschrift der inhaltlich verantwortlichen Person */}
          <p>Unter https://ec.europa.eu/consumers/odr/ stellt die Europäische Kommission eine Plattform
zur Online-Streitbeilegung bereit, die Verbraucher für die Beilegung einer Streitigkeit nutzen
können. Unter dem Link finden Sie auch weitere Informationen zum Thema Streitschlichtung.</p>
<p className="font-semibold">Außergerichtliche Streitbeilegung</p>
          <p>Wir sind weder verpflichtet noch dazu bereit, im Falle einer Streitigkeit mit einem Verbraucher
an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </Section>

        {/*
         * Optional — nur eintragen wenn zutreffend:
         */}

        {/* <Section title="Umsatzsteuer-ID">
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:
          </p>
          <p>[DE ......]</p>
        </Section> */}

        {/* <Section title="Berufsrechtliche Angaben">
          <p>[z.B. zuständige Kammer, anwendbares Berufsrecht]</p>
        </Section> */}

        {/* ─── Disclaimer ─── */}
        <DisclaimerSection />

        {/* ─── Lizenzen ─── */}
        <LicensesSection />

        {/* ─── Audioinhalte ─── */}
        <MediaCreditsSection />

        <Section title="Datenschutz">
          <p>
            Informationen zum Umgang mit personenbezogenen Daten findest du in unserer{' '}
            <a
              href="/datenschutz-web.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]"
            >
              Datenschutzerklärung (PDF)
            </a>
            .
          </p>
        </Section>

        <p className="text-xs text-slate-400 pt-2">
          Stand: April 2026
        </p>

      </div>
    </Layout>
  );
}
