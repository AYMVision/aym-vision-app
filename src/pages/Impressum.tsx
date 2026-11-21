import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { assetUrl } from '../common/assetUrl';

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
              Die Inhalte richten sich an Kinder im Alter von 09 bis 12 Jahren und sollten idealerweise von Eltern begleitet werden.
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

        <Section title="Angaben gemäß § 5 DDG">
          <p className="font-semibold">AYM VISION GmbH</p>
          <p>Schmiedeberg 15</p>
          <p>38551 Ribbesbüttel</p>
          <p>Deutschland</p>
          <p className="pt-2 font-semibold">Geschäftsführerin:</p>
          <p>Ann-Sofie Höbrink</p>
        </Section>

        <Section title="Eintrag im Handelsregister">
          <p>Registergericht: Amtsgericht Hildesheim</p>
          <p>Registernummer: HRB 211029</p>
        </Section>

                <Section title="Kontakt">
          {/* ✏️ PLATZHALTER: Telefonnummer (optional, aber üblich) */}
          <p></p>
          {/* ✏️ PLATZHALTER: E-Mail-Adresse */}
          <p>E-Mail: hello@amysurfwing.de</p>
        </Section>

        <Section title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
          <p>Ann-Sofie Höbrink, Beerbüsche 8, 38551 Ribbesbüttel</p>
          <p>Melina Wiegers, Vis Hermann Hesse 11, 6926 Montagnola, TI, Schweiz</p>
        </Section>

                <Section title="Hinweis gemäß § 36 VSBG:">
          {/* ✏️ PLATZHALTER: Vollständiger Name + Anschrift der inhaltlich verantwortlichen Person */}
          <p>Wir sind weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
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

        {/* ─── Quellen & Lizenzen ─── */}
        <Section title="Quellen & Lizenzen">
          <p>
            Verwendete Schriften, Musik, Audioinhalte und Open-Source-Bibliotheken findest du auf der Seite{' '}
            <Link to="/quellen" className="underline text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]">
              Quellen & Lizenzen
            </Link>
            .
          </p>
        </Section>

        <Section title="KI-Einsatz">
          <p>
            Amy Surfwing nutzt Künstliche Intelligenz an zwei Stellen:
          </p>
          <p className="mt-2 font-semibold">Bildmaterial</p>
          <p>
            Die Illustrationen und Bilder in der App wurden mit Unterstützung von ChatGPT (OpenAI) erstellt.
            Sie sind kein Werk einzelner Personen und werden als KI-generierte Inhalte verwendet.
          </p>
          <p className="mt-2 font-semibold">Reflexionsfunktion</p>
          <p>
            Die App enthält ein lokal auf dem Gerät laufendes Klassifikationsmodul (MiniLM via @xenova/transformers).
            Es ordnet Texteingaben im Hintergrund einer vordefinierten Kategorie zu.
            Das Modul erzeugt keine eigenen Inhalte — angezeigte Rückmeldungen sind vorab verfasste Texte.
            Es findet keine Datenübertragung statt.
          </p>
          <p className="mt-2">
            Ausführliche Informationen findest du auf der Seite{' '}
            <Link to="/parents#ki-einsatz" className="underline text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]">
              Für Eltern
            </Link>
            .
          </p>
        </Section>

        <Section title="Urheberrecht">
          <p>© 2025–2026 Amy Surfwing. Alle Rechte vorbehalten.</p>
          <p className="mt-2">
            Story-Inhalte, Texte, Dialoge, Charaktere (Amy Surfwing, Yasmin, Carlos u. a.) und
            Illustrationen stehen unter der Lizenz{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]"
            >
              Creative Commons BY-NC-ND 4.0
            </a>
            {' '}— Teilen erlaubt, keine kommerzielle Nutzung, keine Bearbeitung, Namensnennung erforderlich.
          </p>
          <p className="mt-2">Der App-Quellcode ist proprietär. Alle Rechte vorbehalten.</p>
        </Section>

        <Section title="Nutzergenerierte Inhalte (Amic Creator Studio)">
          <p>
            Das Amic Creator Studio ermöglicht Nutzer:innen das eigenständige Erstellen von
            Geschichten im Amic-Chat-Format. Amy Surfwing prüft diese Inhalte weder vorab noch
            nachträglich und übernimmt keine Haftung für nutzergenerierte Inhalte. Für die
            erstellten Inhalte und deren Weitergabe sind ausschließlich die erstellenden Personen
            verantwortlich. Inhalte, die gegen geltendes Recht oder die guten Sitten verstoßen,
            sind untersagt. Das Erstellen und Teilen von Inhalten, die Minderjährige gefährden
            oder diskriminieren, ist verboten.
          </p>
        </Section>

        <Section title="Datenschutz">
          <p>
            Informationen zum Umgang mit personenbezogenen Daten findest du in unserer{' '}
            <a
              href={assetUrl('datenschutz-web.pdf')}
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
          Stand: November 2026
        </p>

      </div>
    </Layout>
  );
}
