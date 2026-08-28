import { useState } from 'react';
import Layout from '../components/Layout';
import { RestoreIdentityModal } from '../identity/RestoreIdentityModal';

const FACHJURY_VIDEO = '/media/ui/Tommi/amy-surfwing-fachjury.mp4';
const KIDSJURY_VIDEO = '/media/ui/Tommi/amy-surfwing-kidsjury.mp4';
const FACHJURY_PDF = '/media/ui/Tommi/AmySurfwing_TOMMI_Onepager.pdf';
const KIDSJURY_PDF = '/media/ui/Tommi/AmySurfwing_TOMMI_Onepager_KIDS.pdf';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
      {children}
    </div>
  );
}

function DeviceCard({ icon, title, steps, mobileHint }: { icon: string; title: string; steps: string[]; mobileHint?: boolean }) {
  return (
    <details className="group rounded-xl border border-slate-100 bg-slate-50">
      <summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer list-none select-none">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold text-slate-800">{title}</span>
        </div>
        <span className="text-slate-400 text-xs transition-transform group-open:rotate-180">▼</span>
      </summary>
      <div className="px-4 pb-4 space-y-2">
        {mobileHint && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 leading-relaxed">
            <strong>Wichtig:</strong> Erst als App installieren, dann öffnen und Code eingeben.
          </div>
        )}
        <ol className="space-y-1.5">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
              <span className="shrink-0 w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}

export default function TommiAward() {
  const [showRestore, setShowRestore] = useState(false);
  return (
    <Layout>
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">

        {/* HEADER */}
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-violet-800 text-white p-7 sm:p-10 shadow-lg">
          <div className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-violet-200">
            TOMMI Award 2026
          </div>
          <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold leading-tight">
            Amy Surfwing
          </h1>
          <p className="mt-3 text-sm sm:text-base text-violet-100 leading-relaxed max-w-2xl">
            Unterlagen für die Jury & Pressekit
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white/20 border border-white/30 text-white">
              📱 Interaktive Chat-Serie
            </span>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white/20 border border-white/30 text-white">
              🎮 Spiel & Story
            </span>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white/20 border border-white/30 text-white">
              🎓 Medienreife
            </span>
          </div>
        </div>

{/* KIDS-JURY */}
        <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5 sm:p-6 space-y-5">
          <div>
            <SectionLabel>Kids-Jury</SectionLabel>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              Onepager und Video für die Kids-Jury
            </h2>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">
              AMY SURFWING für euch erklärt: Was erwartet euch? Wie funktioniert's? Und was könnt ihr erleben?
            </p>
          </div>

          {/* Onepager prominent */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={KIDSJURY_PDF}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-5 py-4 text-sm font-bold text-white transition-colors text-center"
            >
              <span className="text-lg">📄</span>
              Onepager Kids-Jury ansehen
            </a>
            <a
              href={KIDSJURY_PDF}
              download
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 hover:border-slate-300 transition-colors"
            >
              <span>⬇️</span> Herunterladen
            </a>
          </div>

          {/* Video */}
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <video controls className="w-full h-auto block" preload="metadata">
              <source src={KIDSJURY_VIDEO} type="video/mp4" />
              Dein Browser unterstützt keine Videowiedergabe.
            </video>
          </div>
        </div>

        {/* FACH-JURY */}
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5 sm:p-6 space-y-5">
          <div>
            <SectionLabel>Fach-Jury</SectionLabel>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              Onepager und Video für die Fach-Jury
            </h2>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">
              AMY SURFWING für die Fachjury erklärt: Wie funktioniert die App, was ist die Idee dahinter und was können Kinder dabei lernen?
            </p>
          </div>

          {/* Onepager prominent */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={FACHJURY_PDF}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 px-5 py-4 text-sm font-bold text-white transition-colors text-center"
            >
              <span className="text-lg">📄</span>
              Onepager Fach-Jury ansehen
            </a>
            <a
              href={FACHJURY_PDF}
              download
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 hover:border-slate-300 transition-colors"
            >
              <span>⬇️</span> Herunterladen
            </a>
          </div>

          {/* Video */}
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <video controls className="w-full h-auto block" preload="metadata">
              <source src={FACHJURY_VIDEO} type="video/mp4" />
              Dein Browser unterstützt keine Videowiedergabe.
            </video>
          </div>
        </div>

        {/* INSTALLATION */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
          <div>
            <SectionLabel>Installation</SectionLabel>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">So wird AMY SURFWING genutzt</h2>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">
              AMY SURFWING läuft im Browser und als App — kein App Store nötig. Einfach die passende Option ausklappen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DeviceCard
              icon="🌐"
              title="Im Browser (ohne Installation)"
              steps={[
                'Den Link direkt im Browser öffnen.',
                'Unten auf der Startseite den Freischaltungscode eingeben — fertig.',
              ]}
            />
            <DeviceCard
              icon="🍎"
              title="iPhone / iOS"
              mobileHint
              steps={[
                'Den Link in Safari öffnen.',
                'Unten auf das Teilen-Symbol tippen.',
                'Nach unten scrollen und „Zum Home-Bildschirm" auswählen.',
                'Auf „Hinzufügen" tippen — App ist installiert.',
                'App öffnen und Freischaltungscode eingeben.',
              ]}
            />
            <DeviceCard
              icon="🤖"
              title="Android"
              mobileHint
              steps={[
                'Den Link in Chrome öffnen.',
                'Oben rechts auf das Drei-Punkte-Menü tippen.',
                '„App installieren" oder „Zum Startbildschirm hinzufügen" auswählen.',
                'App öffnen und Freischaltungscode eingeben.',
              ]}
            />
            <DeviceCard
              icon="🖥️"
              title="Mac"
              steps={[
                'Den Link in Safari öffnen.',
                'Oben in der Menüleiste „Ablage" → „Zum Dock hinzufügen…" klicken.',
                'Namen bestätigen und „Hinzufügen" klicken.',
                'App öffnen und Freischaltungscode eingeben.',
              ]}
            />
            <DeviceCard
              icon="💻"
              title="Windows / PC"
              steps={[
                'Den Link in Chrome öffnen.',
                'Rechts in der Adressleiste auf das Installieren-Symbol klicken.',
                'Falls nicht sichtbar: Drei-Punkte-Menü → „Diese Seite als App installieren".',
                'Mit „Installieren" bestätigen, App öffnen und Code eingeben.',
              ]}
            />
          </div>
        </div>

        {/* HINWEISE ZUM TESTEN */}
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 sm:p-6">
          <SectionLabel>Hinweise zum Testen</SectionLabel>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm text-slate-700 leading-relaxed">
              <span className="shrink-0 text-base">⚠️</span>
              <span>Durch die vollständige Tommi-Jury-Freischaltung kann es beim Weiterspielen Button zu einem Sprung ans Ende der Story kommen. In diesem Fall bitte über AMY SURFWING das gewünschte Kapitel auswählen.</span>
            </li>
            <li className="flex gap-3 text-sm text-slate-700 leading-relaxed">
              <span className="shrink-0 text-base">💡</span>
              <span><strong>Unsere Empfehlung:</strong> Startet mit dem Kinder-Onboarding, spielt zunächst einige Kapitel der Reihe nach und stöbert anschließend gerne durch die gesamte Staffel und die Bonuswelt.</span>
            </li>
          </ul>
        </div>

        {/* DATENSCHUTZ */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <SectionLabel>Datenschutz</SectionLabel>
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              AMY SURFWING speichert keine Daten in der Cloud, das ist eine bewusste Entscheidung für maximalen Datenschutz, besonders mit Blick auf unsere junge Zielgruppe. Alles bleibt auf eurem Gerät.
            </p>
            <p>
              Damit ihr flexibel testen könnt, auch auf einem anderen Gerät oder nach einer Pause, erhaltet ihr beim Einrichten 24 persönliche Wörter. Das ist euer persönlicher Zugang. Einmal kopieren oder direkt per <strong>„Per E-Mail an mich senden"</strong> sichern.
            </p>
            <p>
              Auf neuem Gerät: Amy Surfwing öffnen und unten auf „Zugang wiederherstellen" tippen — oder direkt hier:
            </p>
            <button
              type="button"
              onClick={() => setShowRestore(true)}
              className="mt-1 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              🔑 Zugang wiederherstellen
            </button>
          </div>
        </div>

        {showRestore && (
          <RestoreIdentityModal
            onDone={() => setShowRestore(false)}
            onCancel={() => setShowRestore(false)}
          />
        )}

        {/* PRESSE UND MEDIEN */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <SectionLabel>Presse und Medien</SectionLabel>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">Pressebereich</h2>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">
            Bilder und Logos zur Verwendung in Presseberichten und Medien.
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Packshot */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex flex-col items-center gap-3">
              <img
                src="/media/ui/Tommi/Amy%20Surfwing%20Packshot.png"
                alt="Amy Surfwing Packshot"
                className="w-full max-w-[200px] object-contain rounded-lg"
              />
              <div className="text-center">
                <div className="text-xs font-semibold text-slate-800">Amy Surfwing Packshot</div>
                <div className="text-xs text-slate-500 mt-0.5">PNG · Hochauflösend</div>
              </div>
              <a
                href="/media/ui/Tommi/Amy%20Surfwing%20Packshot.png"
                download
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
              >
                <span>⬇️</span> Herunterladen
              </a>
            </div>

            {/* Logo hell */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex flex-col items-center gap-3">
              <img
                src="/media/ui/Tommi/Logo%20Amy%20Surfwing%20mit%20Eule.png"
                alt="Amy Surfwing Logo"
                className="w-full max-w-[200px] object-contain"
              />
              <div className="text-center">
                <div className="text-xs font-semibold text-slate-800">Logo (für hellen Hintergrund)</div>
                <div className="text-xs text-slate-500 mt-0.5">PNG</div>
              </div>
              <a
                href="/media/ui/Tommi/Logo%20Amy%20Surfwing%20mit%20Eule.png"
                download
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
              >
                <span>⬇️</span> Herunterladen
              </a>
            </div>

            {/* Logo dunkel */}
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 flex flex-col items-center gap-3">
              <img
                src="/media/ui/Tommi/Logo%20Amy%20Surfwing%20mit%20wei%C3%9Fer%20Eule.png"
                alt="Amy Surfwing Logo (weiß)"
                className="w-full max-w-[200px] object-contain"
              />
              <div className="text-center">
                <div className="text-xs font-semibold text-slate-200">Logo (für dunklen Hintergrund)</div>
                <div className="text-xs text-slate-400 mt-0.5">PNG</div>
              </div>
              <a
                href="/media/ui/Tommi/Logo%20Amy%20Surfwing%20mit%20wei%C3%9Fer%20Eule.png"
                download
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <span>⬇️</span> Herunterladen
              </a>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-slate-400">
          Amy Surfwing · AYM Vision · TOMMI Award 2026
        </p>

      </div>
    </Layout>
  );
}
