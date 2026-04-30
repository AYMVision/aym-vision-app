import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

function FaqItem({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 last:border-0 py-5 first:pt-0">
      <h2 className="text-base font-semibold text-[var(--color-teal-900)]">{question}</h2>
      <div className="mt-2 text-sm leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

export default function FAQ() {
  return (
    <Layout>
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Elternbereich */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <div className="text-xs font-semibold text-[var(--color-teal-600)] mb-1">Elternbereich</div>
          <h1 className="text-xl font-extrabold text-[var(--color-teal-900)] mb-5">
            Häufige Fragen
          </h1>

          <FaqItem question="Ich habe mein Eltern-Passcode vergessen. Was kann ich tun?">
            <p>
              Öffne den Elternbereich und gib das Passwort ein. Nach mehreren Fehlversuchen
              erscheint automatisch die Option <strong>„Passcode vergessen?"</strong> — darüber
              kannst du den Passcode zurücksetzen. Alle Lernfortschritte und Profileinstellungen
              des Kindes bleiben dabei erhalten.
            </p>
          </FaqItem>

          <FaqItem question="Wie ändere ich meinen Eltern-Passcode?">
            <p>
              Wenn du bereits eingeloggt bist, findest du im{' '}
              <Link to="/parents" className="font-semibold text-[var(--color-teal-700)] underline underline-offset-2">
                Elternbereich
              </Link>{' '}
              den Abschnitt <strong>„Passcode ändern"</strong>. Dort gibst du deinen aktuellen
              Passcode sowie zweimal den neuen Passcode ein (mindestens 6 Zeichen).
            </p>
          </FaqItem>

          <FaqItem question="Wie lange bleibt der Elternbereich entsperrt?">
            <p>
              Nach der Eingabe des richtigen Passcodes bleibt der Elternbereich 10 Minuten
              geöffnet. Danach wirst du automatisch wieder gesperrt. Du kannst den Bereich
              auch manuell über <strong>„Elternbereich sperren"</strong> schließen.
            </p>
          </FaqItem>

          <FaqItem question="Werden Fortschritte gespeichert?">
            <p>
              Alle Lernfortschritte, Sticker und Profileinstellungen werden lokal auf diesem
              Gerät gespeichert. Es wird kein Konto benötigt. Falls du das Gerät wechselst
              oder den Browser-Speicher löschst, gehen die Daten verloren.
            </p>
          </FaqItem>
        </section>

      </div>
    </Layout>
  );
}
