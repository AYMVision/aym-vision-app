// src/pages/InstallGuide.tsx
// Gerätespezifische Anleitung: "App zum Home-Bildschirm hinzufügen"

import { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { isStandalonePwa } from '../common/usePwaContext';

type DeviceType = 'ios' | 'android' | 'desktop-chrome' | 'desktop-other';

function detectDevice(): DeviceType {
  const ua = navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isChrome = /Chrome/i.test(ua) && !/Chromium/i.test(ua);
  if (isIos) return 'ios';
  if (isAndroid) return 'android';
  if (isChrome) return 'desktop-chrome';
  return 'desktop-other';
}

type StepProps = {
  number: number;
  icon: string;
  title: string;
  detail?: string;
};

function Step({ number, icon, title, detail }: StepProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-teal-600)] text-sm font-bold text-white">
        {number}
      </div>
      <div className="pt-0.5">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{icon}</span>
          <span className="text-sm font-semibold text-slate-900">{title}</span>
        </div>
        {detail && <p className="mt-1 text-xs text-slate-500 leading-relaxed">{detail}</p>}
      </div>
    </div>
  );
}

type InstructionSet = {
  title: string;
  browser: string;
  browserNote?: string;
  steps: StepProps[];
};

const INSTRUCTIONS: Record<DeviceType, InstructionSet> = {
  ios: {
    title: 'iPhone / iPad',
    browser: 'Safari',
    browserNote: 'Wichtig: Nur Safari unterstützt die Installation. Chrome & Firefox auf iOS funktionieren nicht.',
    steps: [
      { number: 1, icon: '🧭', title: 'Seite in Safari öffnen', detail: 'Falls du einen anderen Browser nutzt, kopiere die URL und öffne sie in Safari.' },
      { number: 2, icon: '📤', title: 'Teilen-Symbol antippen', detail: 'Das Symbol sieht aus wie ein Kasten mit einem Pfeil nach oben — unten in der Symbolleiste.' },
      { number: 3, icon: '📲', title: '"Zum Home-Bildschirm" wählen', detail: 'Scrolle in der Liste nach unten, bis du den Eintrag siehst, und tippe darauf.' },
      { number: 4, icon: '✅', title: '"Hinzufügen" bestätigen', detail: 'Der Name kann angepasst werden. Dann auf "Hinzufügen" tippen.' },
    ],
  },
  android: {
    title: 'Android',
    browser: 'Chrome',
    browserNote: 'Am einfachsten geht es mit Chrome. In Firefox und Samsung Internet klappt es ähnlich.',
    steps: [
      { number: 1, icon: '🌐', title: 'Chrome öffnen und Seite aufrufen', detail: 'Tippe in die Adressleiste und gib die Adresse der App ein.' },
      { number: 2, icon: '⋮', title: 'Menü öffnen', detail: 'Tippe auf die drei Punkte oben rechts.' },
      { number: 3, icon: '📲', title: '"App installieren" oder "Zum Startbildschirm"', detail: 'Je nach Android-Version steht dort "App installieren" oder "Zum Startbildschirm hinzufügen".' },
      { number: 4, icon: '✅', title: '"Installieren" bestätigen', detail: 'Die App erscheint danach auf deinem Startbildschirm.' },
    ],
  },
  'desktop-chrome': {
    title: 'Computer (Chrome)',
    browser: 'Chrome',
    steps: [
      { number: 1, icon: '🖥️', title: 'Installations-Symbol in der Adressleiste', detail: 'In Chrome erscheint rechts in der Adressleiste ein kleines Computer-Symbol mit einem Pfeil. Klicke darauf.' },
      { number: 2, icon: '✅', title: '"Installieren" bestätigen', detail: 'Ein Fenster erscheint — bestätige mit "Installieren". Die App öffnet sich dann in einem eigenen Fenster.' },
    ],
  },
  'desktop-other': {
    title: 'Computer (andere Browser)',
    browser: 'Edge / Firefox / Safari',
    steps: [
      { number: 1, icon: '🌐', title: 'Chrome oder Edge installieren', detail: 'Für die beste Erfahrung empfehlen wir Chrome oder Microsoft Edge.' },
      { number: 2, icon: '📋', title: 'URL kopieren und in Chrome/Edge öffnen', detail: 'Kopiere die Adresse aus deinem Browser und öffne sie in Chrome oder Edge.' },
      { number: 3, icon: '📲', title: 'Installationshinweis folgen', detail: 'In der Adressleiste erscheint ein Installations-Symbol. Klicke darauf und bestätige.' },
    ],
  },
};

// Zeige alle Geräte-Typen als Tabs
const ALL_DEVICES: DeviceType[] = ['ios', 'android', 'desktop-chrome', 'desktop-other'];
const DEVICE_LABELS: Record<DeviceType, string> = {
  ios: '🍎 iPhone/iPad',
  android: '🤖 Android',
  'desktop-chrome': '💻 PC Chrome',
  'desktop-other': '💻 PC Andere',
};

export default function InstallGuide() {
  const alreadyInstalled = isStandalonePwa();
  const detectedDevice = useMemo(() => detectDevice(), []);

  // Show detected device tab first, let user switch
  const defaultTab = detectedDevice;

  return (
    <Layout backPath="/" hideFooter>
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">App installieren</h1>
        <p className="mt-2 text-sm text-slate-600">
          Speichere Amy Surfwing auf deinem Home-Bildschirm — so hast du sie immer griffbereit, auch ohne Browser.
        </p>

        {alreadyInstalled ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-sm font-bold text-emerald-800">App bereits installiert!</div>
            <p className="mt-1 text-sm text-emerald-700">
              Du öffnest die App gerade direkt vom Home-Bildschirm. Alles ist eingerichtet.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            <strong>Warum installieren?</strong> Als installierte App läuft Amy Surfwing schneller, nimmt keine Browser-Tabs weg und funktioniert besser offline. Dein Spielstand bleibt länger erhalten.
          </div>
        )}

        {/* Tabs */}
        <InstallTabs defaultTab={defaultTab} />

        {/* iOS Datenverlust-Hinweis */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">⚠️</span>
            <div>
              <div className="text-sm font-bold text-slate-800">Wichtig für iOS (iPhone/iPad)</div>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                iOS löscht die Daten installierter Web-Apps nach ca. <strong>7 Tagen Inaktivität</strong> automatisch.
                Wenn du die App länger nicht nutzt, kann dein Spielstand verloren gehen.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                <strong>Lösung:</strong> Erstelle regelmäßig einen Transfer-Link in deinem Profil — damit kannst du deinen Spielstand jederzeit wiederherstellen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function InstallTabs({ defaultTab }: { defaultTab: DeviceType }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const inst = INSTRUCTIONS[activeTab];

  return (
    <div className="mt-6">
      {/* Tab-Buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {ALL_DEVICES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setActiveTab(d)}
            className={[
              'rounded-xl border px-3 py-1.5 text-xs font-semibold transition',
              activeTab === d
                ? 'border-[var(--color-teal-600)] bg-[var(--color-teal-600)] text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            ].join(' ')}
          >
            {DEVICE_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Instruction card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Anleitung für
        </div>
        <div className="text-lg font-bold text-slate-900">{inst.title}</div>
        {inst.browser && (
          <div className="mt-0.5 text-sm text-slate-500">Browser: {inst.browser}</div>
        )}
        {inst.browserNote && (
          <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 leading-relaxed">
            {inst.browserNote}
          </div>
        )}

        <div className="mt-5 space-y-5">
          {inst.steps.map((s) => (
            <Step key={s.number} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
}

