import Layout from '../components/Layout';

function HelpCard({
  number,
  name,
  hours,
  url,
  description,
}: {
  number: string;
  name: string;
  hours: string;
  url: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{hours}</p>
          <h2 className="mt-1 text-lg font-extrabold text-slate-900">{name}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs text-[var(--color-teal-700)] underline hover:text-[var(--color-teal-900)]"
          >
            {url.replace('https://', '')}
          </a>
        </div>
        <a
          href={`tel:${number.replace(/\s/g, '')}`}
          className="shrink-0 flex items-center justify-center gap-2 rounded-xl px-5 py-3
                     bg-[var(--color-teal-600)] text-white text-lg font-bold tracking-wide
                     hover:bg-[var(--color-teal-700)] transition-colors"
          aria-label={`${name} anrufen: ${number}`}
        >
          📞 {number}
        </a>
      </div>
    </div>
  );
}

export default function Hilfe() {
  return (
    <Layout>
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-4">

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <h1 className="text-2xl font-extrabold text-[var(--color-teal-900)]">
            Hilfe & Notfallkontakte
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Wenn ein Kind in einer schwierigen Situation steckt oder Unterstützung braucht,
            sind diese Stellen rund um die Uhr erreichbar — kostenlos und anonym.
          </p>
        </div>

        <HelpCard
          name="Telefonseelsorge"
          number="0800 111 0 111"
          hours="Kostenlos · 24 Stunden täglich"
          url="https://www.telefonseelsorge.de"
          description="Für Kinder, Jugendliche und Erwachsene in Krisen — anonym, vertraulich, rund um die Uhr."
        />

        <HelpCard
          name="Nummer gegen Kummer"
          number="116 111"
          hours="Kostenlos · Mo–Sa 14–20 Uhr"
          url="https://www.nummergegenkummer.de"
          description="Das Kinder- und Jugendtelefon — speziell für Kinder und Jugendliche, die reden möchten."
        />

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-500 space-y-1">
          <p className="font-semibold text-slate-600">Hinweis</p>
          <p>
            Diese Angaben werden von uns regelmäßig geprüft. Aktuelle Informationen finden Sie
            direkt bei{' '}
            <a
              href="https://www.telefonseelsorge.de"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-700"
            >
              telefonseelsorge.de
            </a>{' '}
            und{' '}
            <a
              href="https://www.nummergegenkummer.de"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-700"
            >
              nummergegenkummer.de
            </a>
            .
          </p>
          <p className="pt-1">
            Bei einem Notfall wählen Sie bitte den Notruf{' '}
            <a href="tel:112" className="font-semibold text-slate-700">112</a>.
          </p>
        </div>

      </div>
    </Layout>
  );
}
