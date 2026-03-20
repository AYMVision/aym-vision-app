import Layout from '../components/Layout';
import { cn } from '../common/utils';

function Card({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <section className="w-full bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="shrink-0 w-10 h-10 rounded-2xl bg-[var(--color-teal-100)] flex items-center justify-center text-lg">
            <span aria-hidden="true">{icon}</span>
          </div>
        ) : null}

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
            {title}
          </h2>
          <div className="mt-2 text-sm sm:text-base leading-relaxed text-slate-700">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ForKids() {
  return (
    <Layout>
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 sm:p-8">
          <p className="text-sm sm:text-base text-[var(--color-teal-600)] font-semibold">
            Für dich (5.–7. Klasse)
          </p>

          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[var(--color-teal-900)] leading-tight">
            Stell dir vor: Du öffnest ein Buch – und es antwortet dir.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed">
            Hier liest du Chats aus einer Geschichte. Figuren erleben Dinge – manchmal
            witzig, manchmal schwierig. Und zwischendurch fragt dich Amy:
            <span className="font-semibold text-slate-900"> „Wie siehst du das?“</span>
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              'Lesen',
              'Antworten',
              'Weiterdenken',
              'Ohne Druck',
              'Ohne Publikum',
            ].map((t) => (
              <span
                key={t}
                className={cn(
                  'px-3 py-1 rounded-full text-xs sm:text-sm font-semibold',
                  'bg-[var(--color-teal-50)] text-[var(--color-teal-800)] border border-[var(--color-teal-100)]'
                )}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-5">
          <Card title="Was ist das hier?" icon="📖">
            <p>
              Amy ist eine <span className="font-semibold">Geschichten-Welt</span>, die
              du wie ein Buch entdecken kannst – nur eben im Chat-Stil.
            </p>
            <p className="mt-3">
              Du bestimmst nicht alles. Aber deine Antworten können neue Gedanken
              öffnen und zeigen, wie man eine Situation auch sehen kann.
            </p>
          </Card>

          <Card title="Wer ist Amy?" icon="🤖">
            <p>
              Amy ist <span className="font-semibold">kein echter Mensch</span>.
              Sie ist ein digitales Programm.
            </p>
            <p className="mt-3">
              Sie reagiert auf das, was du schreibst, stellt Fragen und hilft dir,
              Dinge aus einem neuen Blickwinkel zu betrachten – ohne dich zu bewerten.
            </p>
          </Card>

          <Card title="Bleibt das privat?" icon="🔒">
            <p>
              In der aktuellen Version brauchst du <span className="font-semibold">kein Konto</span>.
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>Deine Antworten bleiben auf deinem Gerät.</li>
              <li>Niemand gibt dir Noten oder Punkte für „cool“ sein.</li>
              <li>Hier geht es darum, ehrlich denken zu dürfen.</li>
            </ul>
          </Card>

          <Card title="Wenn etwas dich belastet" icon="🫶">
            <p>
              Manchmal fühlt sich etwas im echten Leben schwer an. Dann ist es
              gut, mit einem Erwachsenen zu sprechen, dem du vertraust
              (z. B. Eltern, Lehrkraft, Schulsozialarbeit).
            </p>
            <p className="mt-3">
              Amy kann helfen, nachzudenken – aber sie ersetzt keine echten Gespräche.
            </p>
          </Card>

          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-[var(--color-teal-900)]">
              Und jetzt?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">
              Starte einfach mit einer Folge. Lies den Chat. Antworte. Schau, was du
              dabei über dich und digitale Situationen lernst.
            </p>
            <div className="mt-4 text-sm font-semibold text-[var(--color-teal-700)]">
              Viel Spaß in der Welt von Amy ✨
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
