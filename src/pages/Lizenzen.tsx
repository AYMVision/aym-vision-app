import Layout from '../components/Layout';

const FONTS = [
  {
    name: 'Baloo Bhaijaan 2',
    author: 'Ek Type',
    license: 'SIL Open Font License 1.1 (OFL)',
    url: 'https://scripts.sil.org/OFL',
    usedFor: 'Haupt-Schriftart der App',
  },
  {
    name: 'Caveat',
    author: 'Impallari Type',
    license: 'SIL Open Font License 1.1 (OFL)',
    url: 'https://scripts.sil.org/OFL',
    usedFor: 'Tagebuch-Schriftart',
  },
];

const AUDIO = [
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
    type: 'Musik',
    title: '„Happy Kids Background Music" von BombinSound',
    source: 'Pixabay',
    license: 'Pixabay Content License',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    usedFor: 'Staffel-1-Finale',
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

const LIBRARIES = [
  { name: 'React', author: 'Meta Platforms, Inc.', license: 'MIT License', url: 'https://opensource.org/licenses/MIT' },
  { name: 'Vite', author: 'Evan You', license: 'MIT License', url: 'https://opensource.org/licenses/MIT' },
  { name: 'Tailwind CSS', author: 'Tailwind Labs, Inc.', license: 'MIT License', url: 'https://opensource.org/licenses/MIT' },
  { name: 'lucide-react', author: 'Lucide Contributors', license: 'ISC License', url: 'https://opensource.org/license/isc-license-txt' },
  { name: 'react-router-dom', author: 'Remix Software', license: 'MIT License', url: 'https://opensource.org/licenses/MIT' },
  { name: 'i18next', author: 'Jan Mühlemann', license: 'MIT License', url: 'https://opensource.org/licenses/MIT' },
  { name: '@tanstack/react-query', author: 'Tanner Linsley', license: 'MIT License', url: 'https://opensource.org/licenses/MIT' },
  { name: '@xenova/transformers', author: 'Xenova / Hugging Face', license: 'Apache License 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0' },
  { name: '@noble/ciphers & @noble/hashes', author: 'Paul Miller', license: 'MIT License', url: 'https://opensource.org/licenses/MIT' },
  { name: '@scure/bip39', author: 'Paul Miller', license: 'MIT License', url: 'https://opensource.org/licenses/MIT' },
  { name: 'idb-keyval', author: 'Jake Archibald', license: 'MIT License', url: 'https://opensource.org/licenses/MIT' },
  { name: 'qr-scanner', author: 'Nimiq', license: 'MIT License', url: 'https://opensource.org/licenses/MIT' },
  { name: 'qrcode', author: 'soldair', license: 'MIT License', url: 'https://opensource.org/licenses/MIT' },
  { name: 'lz-string', author: 'pieroxy', license: 'MIT License', url: 'https://opensource.org/licenses/MIT' },
  { name: 'dom-to-image-more', author: 'Heitor Augusto / Lautaro Capella', license: 'MIT License', url: 'https://opensource.org/licenses/MIT' },
];

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="pt-2">
      <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}

export default function Lizenzen() {
  return (
    <Layout title="Quellen & Lizenzen">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        <h1 className="text-2xl font-extrabold text-slate-900">Quellen & Lizenzen</h1>
        <p className="text-sm text-slate-500">
          Alle in der App verwendeten Drittinhalte und Open-Source-Bibliotheken mit ihren Lizenzen.
        </p>

        {/* Schriften */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
          <SectionHeader title="Schriften" subtitle="Verwendete Schriftarten" />
          <div className="divide-y divide-slate-100">
            {FONTS.map((f) => (
              <div key={f.name} className="py-3">
                <div className="font-semibold text-sm text-slate-900">{f.name}</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {f.author} &mdash;{' '}
                  <a href={f.url} target="_blank" rel="noopener noreferrer"
                    className="underline text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]">
                    {f.license}
                  </a>
                </div>
                <div className="mt-0.5 text-xs text-slate-400">Verwendet für: {f.usedFor}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Icons */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
          <SectionHeader title="Symbole & Icons" />
          <div className="py-1">
            <div className="font-semibold text-sm text-slate-900">Lucide Icons</div>
            <div className="mt-0.5 text-xs text-slate-500">
              Lucide Contributors &mdash;{' '}
              <a href="https://opensource.org/license/isc-license-txt" target="_blank" rel="noopener noreferrer"
                className="underline text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]">
                ISC License
              </a>
            </div>
          </div>
        </section>

        {/* Musik & Audio */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
          <SectionHeader title="Musik & Audio" subtitle="Soundeffekte, Musik und Hintergrundgeräusche" />
          <div className="divide-y divide-slate-100">
            {AUDIO.map((a) => (
              <div key={a.title} className="py-3">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wide shrink-0">{a.type}</span>
                  <span className="font-semibold text-sm text-slate-900">{a.title}</span>
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {a.source} &mdash;{' '}
                  <a href={a.licenseUrl} target="_blank" rel="noopener noreferrer"
                    className="underline text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]">
                    {a.license}
                  </a>
                </div>
                <div className="mt-0.5 text-xs text-slate-400">Verwendet für: {a.usedFor}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Bilder */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
          <SectionHeader title="Bilder & Illustrationen" />
          <p className="text-sm text-slate-700">
            Die Illustrationen und Bilder in der App wurden mit Unterstützung von ChatGPT (OpenAI) erstellt.
            Die Nutzungsbedingungen von OpenAI erlauben die kommerzielle Verwendung von mit dem Dienst erstellten Inhalten.
          </p>
        </section>

        {/* Open-Source-Bibliotheken */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
          <SectionHeader title="Open-Source-Bibliotheken" subtitle="Verwendete Software-Pakete (Auswahl)" />
          <div className="divide-y divide-slate-100">
            {LIBRARIES.map((l) => (
              <div key={l.name} className="py-3 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <div className="font-semibold text-sm text-slate-900 sm:w-56 shrink-0">{l.name}</div>
                <div className="text-xs text-slate-500 mt-0.5 sm:mt-0">
                  {l.license} &mdash; {l.author}
                  {' · '}
                  <a href={l.url} target="_blank" rel="noopener noreferrer"
                    className="underline text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]">
                    Lizenztext
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Der vollständige Quellcode der verwendeten Open-Source-Pakete ist über die jeweiligen Repositories zugänglich.
          </p>
        </section>

        <p className="text-xs text-slate-400 pt-2">Stand: November 2026</p>

      </div>
    </Layout>
  );
}
