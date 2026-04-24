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

        <Section title="Datenschutz">
          <p>
            Informationen zum Umgang mit personenbezogenen Daten findest du in unserer{' '}
            <a
              href="datenschutz-web.pdf"
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
