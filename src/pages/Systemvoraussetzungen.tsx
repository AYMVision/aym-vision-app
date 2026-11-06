import Layout from '../components/Layout';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
      <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-slate-700 space-y-2">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 py-1.5 border-b border-slate-100 last:border-0">
      <span className="w-40 shrink-0 font-semibold text-slate-600">{label}</span>
      <span className="text-slate-700">{value}</span>
    </div>
  );
}

export default function Systemvoraussetzungen() {
  return (
    <Layout>
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-4">

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <h1 className="text-2xl font-extrabold text-[var(--color-teal-900)]">
            Systemvoraussetzungen
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Amy Surfwing ist eine Progressive Web App (PWA). Bitte prüfen Sie vor dem Kauf,
            ob Ihr Gerät die folgenden Anforderungen erfüllt.
          </p>
        </div>

        <Section title="Unterstützte Geräte & Browser">
          <Row label="iPhone / iPad" value="iOS 16.4 oder neuer, Safari" />
          <Row label="Android" value="Android 9 oder neuer, Chrome 80 oder neuer" />
          <Row label="Desktop" value="Chrome 80+, Edge 80+, Firefox 117+, Safari 16.4+" />
          <p className="text-xs text-slate-400 pt-1">
            Andere Browser können funktionieren, werden jedoch nicht offiziell unterstützt.
          </p>
        </Section>

        <Section title="Speicherplatz">
          <Row label="Empfohlen" value="ca. 300 MB freier Speicherplatz" />
          <p className="text-xs text-slate-500 pt-1">
            Inhalte (Bilder, Audio) werden beim ersten Aufruf jedes Kapitels heruntergeladen
            und danach lokal gespeichert. Der Speicherbedarf wächst mit der Nutzung.
          </p>
        </Section>

        <Section title="Internetverbindung">
          <p>Eine Internetverbindung ist erforderlich für:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Erstinstallation und erstes Öffnen der App</li>
            <li>Kauf und Einlösung eines Staffel-Codes</li>
            <li>App-Aktualisierungen</li>
            <li>Einrichtung auf einem neuen Gerät</li>
          </ul>
          <p className="mt-2">
            Nach dem ersten Laden sind die Lerninhalte <strong>offline verfügbar</strong>.
          </p>
        </Section>

        <Section title="KI-Funktion (Amy)">
          <p>
            Die KI-Begleitfunktion (Amy) läuft vollständig lokal auf dem Gerät — ohne
            Cloudverbindung. Im Verwaltungsbereich kann sie jederzeit angepasst werden:
          </p>
          <Row label={'Modus „Off“'} value="Kein zusätzlicher Download — 0 MB" />
          <Row label={'Modus „Auto“'} value="Lädt ca. 44 MB einmalig, nur auf leistungsstarken Geräten" />
          <Row label={'Modus „On“'} value="Lädt ca. 44 MB einmalig, unabhängig vom Gerät" />
          <p className="text-xs text-slate-500 pt-1">
            Ohne KI ist die Staffel vollständig nutzbar.
          </p>
        </Section>

        <Section title="Hinweise zu iOS">
          <p>
            Auf iPhone und iPad kann iOS die Daten einer installierten Web-App nach ca.{' '}
            <strong>7 Tagen ohne Nutzung</strong> automatisch löschen. Android-Geräte
            behalten die Daten in der Regel deutlich länger. Wir empfehlen, regelmäßig
            einen Spielstand-Link oder eine Sicherungsdatei im Verwaltungsbereich
            zu erstellen.
          </p>
        </Section>

        <Section title="Datenübertragungskosten">
          <p>
            Die Herstellung der technischen Voraussetzungen sowie potenzielle Kosten für
            die Datenübertragung Ihres Internetanbieters sind von Ihnen zu tragen.
            Beim erstmaligen Laden aller Inhalte können bis zu ca. 300 MB übertragen werden.
          </p>
        </Section>

      </div>
    </Layout>
  );
}
