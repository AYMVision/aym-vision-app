import Layout from '../components/Layout';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
      <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-slate-700 space-y-2">{children}</div>
    </section>
  );
}

export default function Widerruf() {
  return (
    <Layout>
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-4">

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <h1 className="text-2xl font-extrabold text-[var(--color-teal-900)]">
            Vertrag widerrufen
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag
            zu widerrufen.
          </p>
        </div>

        <Section title="Widerruf per E-Mail oder Post">
          <p>
            Um Ihr Widerrufsrecht auszuüben, teilen Sie uns Ihre Entscheidung durch eine
            eindeutige Erklärung mit:
          </p>
          <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="font-semibold text-slate-800">AYM VISION GmbH</p>
            <p>Schmiedeberg 15, 38551 Ribbesbüttel</p>
            <p>
              E-Mail:{' '}
              <a
                href="mailto:hello@amysurfwing.de"
                className="text-[var(--color-teal-700)] underline"
              >
                hello@amysurfwing.de
              </a>
            </p>
            <p>Telefon: 0157 / 71496369</p>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Zur Wahrung der Widerrufsfrist reicht es, die Mitteilung vor Ablauf der
            14-Tage-Frist abzusenden.
          </p>
        </Section>

        <Section title="Muster-Widerrufsformular">
          <p className="text-xs text-slate-500">
            Die Verwendung des Musters ist nicht vorgeschrieben — Sie können auch formlos
            widerrufen. Das Muster dient nur als Hilfestellung.
          </p>
          <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 space-y-2 font-mono text-xs">
            <p>An: AYM VISION GmbH, Schmiedeberg 15, 38551 Ribbesbüttel</p>
            <p>E-Mail: hello@amysurfwing.de</p>
            <p className="pt-2">
              Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag
              über den Kauf der folgenden digitalen Inhalte:
            </p>
            <p>Bestellt am (*) / erhalten am (*):</p>
            <p>Name des/der Verbraucher(s):</p>
            <p>Anschrift des/der Verbraucher(s):</p>
            <p>Datum:</p>
            <p className="pt-2 text-slate-400">(*) Unzutreffendes streichen.</p>
          </div>
        </Section>

        <Section title="Folgen des Widerrufs">
          <p>
            Wenn Sie diesen Vertrag widerrufen, erstatten wir Ihnen alle Zahlungen, die
            wir von Ihnen erhalten haben, unverzüglich und spätestens binnen 14 Tagen ab
            dem Tag, an dem Ihre Widerrufserklärung bei uns eingegangen ist. Für die
            Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der
            ursprünglichen Transaktion eingesetzt haben.
          </p>
        </Section>

        <Section title="Erlöschen des Widerrufsrechts">
          <p>
            Ihr Widerrufsrecht erlischt, wenn wir Ihnen die Staffel bereitgestellt haben,
            Sie ausdrücklich zugestimmt haben, dass wir mit der Vertragserfüllung vor
            Ablauf der Widerrufsfrist beginnen, und Sie Ihre Kenntnis davon bestätigt
            haben, dass Ihr Widerrufsrecht mit der Bereitstellung erlischt.
          </p>
        </Section>

      </div>
    </Layout>
  );
}
