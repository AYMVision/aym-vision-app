// src/pages/Presse.tsx
import { useState } from 'react';
import Layout from '../components/Layout';

const HALLOWEEN_URL = 'https://www.amysurfwing.de/#/stories-v02/sp0e01';

const SCREENSHOTS = [1, 2, 3, 4, 5].map(n => `/media/ui/Tommi/AmySurfwing${n}.png`);

const PM = '/media/ui/Pressemappe';
const TM = '/media/ui/Tommi';

const LOGOS = [
  { label: 'Logo mit Eule',  url: `${TM}/Logo%20Amy%20Surfwing%20mit%20Eule.png` },
  { label: 'Logo ohne Eule', url: `${PM}/Logo_AmySurfwing%20ohne%20Eule.png` },
  { label: 'Amy Icon',       url: `${PM}/Logo_Amy.png` },
  { label: 'Amy im Kreis',   url: `${PM}/Amy%20im%20Kreis.png` },
];

const FOTOS = [
  { label: 'TOMMI-Nominierung', url: `${TM}/tommi_nominiert.jpeg`,          narrow: true },
  { label: 'Gründerinnenfoto',  url: `${PM}/GruenderinnenFoto.png`,         narrow: true },
];

const DOCS = [
  { label: 'Read-Deck',                    url: `${PM}/AmySurfwing_Read-Deck.pdf`,                                              icon: '📑', date: '12. Okt. 2026' },
  { label: 'Pressemitteilung TOMMI + Halloween', url: `${PM}/2026_10_13%20Pressemitteilung_AmySurfwing_TOMMI_Halloween.docx`, icon: '📰', date: '13. Okt. 2026' },
  { label: 'Pressemitteilung Gründung',    url: `${PM}/PR%20Mitteilung%20zur%20Gr%C3%BCndung.docx`,                            icon: '📰', date: '04. Sept. 2026' },
];

function CopyLinkBox({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="flex-1 text-sm text-slate-600 truncate font-mono select-all">{url}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors"
      >
        {copied ? '✓ Kopiert' : 'Kopieren'}
      </button>
    </div>
  );
}

export default function Presse() {
  const [videoOpen, setVideoOpen] = useState(false);
  return (
    <Layout>
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">

        {/* ── HERO ── */}
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-violet-800 text-white p-7 sm:p-10 shadow-lg">
          <div className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-violet-200">
            Presseinformationen
          </div>
          <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold leading-tight">
            Amy Surfwing
          </h1>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white/20 border border-white/30 text-white">
              🏆 Doppelt TOMMI-nominiert 2026
            </span>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white/20 border border-white/30 text-white">
              📱 Interaktive Chat-Serie
            </span>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white/20 border border-white/30 text-white">
              🎓 Medienkompetenz für 9–12-Jährige
            </span>
          </div>
        </div>

        {/* ── Kontakt + Video nebeneinander ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">

          {/* Kontakt (schmaler) */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 flex flex-col gap-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Pressekontakt</div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✉️</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">Ann-Sofie Höbrink</p>
                <p className="text-xs text-slate-500">Interviews, Rückfragen, Bildmaterial</p>
              </div>
            </div>
            <a
              href="mailto:hello@amysurfwing.de"
              className="text-sm font-semibold text-violet-700 hover:text-violet-900 transition-colors"
            >
              hello@amysurfwing.de →
            </a>
          </div>

          {/* Video (klickbare Vorschau) */}
          <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
            <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Video</div>
                <p className="text-sm font-extrabold text-slate-900 leading-snug">Halloween-Spezial – Trailer</p>
              </div>
              <a
                href={`${PM}/halloweenspezial_video_melina.mp4`}
                download
                onClick={e => e.stopPropagation()}
                className="shrink-0 text-xs font-semibold text-violet-600 hover:text-violet-800 px-2.5 py-1 rounded-lg border border-violet-200 hover:bg-violet-50 transition-colors"
              >
                ⬇
              </a>
            </div>
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="relative w-full block overflow-hidden bg-slate-900 group"
              style={{ aspectRatio: '16/9' }}
              aria-label="Video abspielen"
            >
              <video
                src={`${PM}/halloweenspezial_video_melina.mp4`}
                preload="metadata"
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-900 ml-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

        </div>

        {/* ── Kurzbeschreibung (volle Breite) ── */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Kurzbeschreibung
          </div>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
            Medienreife ist nichts, was man in einem Workshop abhakt. Sie zeigt sich, wenn der Klassenchat kippt, ein Deepfake auftaucht oder alle auf „Teilen" drücken und das Kind entscheiden muss: Mache ich da mit? Glaube ich das? Wann ist genug?
          </p>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
            Mit Amy Surfwing erleben 9- bis 12-Jährige genau solche Szenarien in interaktiven Chats. Fünf Minuten pro Tag fiebern sie mit ihren fiktiven Freunden aus der 7b. Und morgen wollen sie wissen, wie es weitergeht.
          </p>
        </div>

        {/* ── HALLOWEEN SPECIAL ── */}
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 sm:p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
            🎃 Kostenlos ausprobieren
          </div>
          <h2 className="text-base font-extrabold text-slate-900 mb-1">
            Halloween-Spezial – 5 Kapitel, komplett kostenlos
          </h2>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            Direkt im Browser spielbar, ohne Anmeldung. Link zum Weiterschicken:
          </p>
          <CopyLinkBox url={HALLOWEEN_URL} />
        </div>

        {/* ── JURY-ZITATE ── */}
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            TOMMI-Jurybegründungen 2026
          </div>

          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5 sm:p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">
              Kategorie Apps
            </div>
            <blockquote className="text-sm sm:text-base text-slate-800 leading-relaxed italic">
              „Amy Surfwing vermittelt Medienkompetenz in einer interaktiven Chat-Story, die sich an
              der Lebensrealität von Kindern und Jugendlichen orientiert. Themen wie Klassenchats,
              Fake News, KI, FOMO, Gruppendruck oder der Umgang mit sozialen Medien werden
              aufgegriffen. Amy Surfwing verbindet ansprechendes Gamedesign und sensibilisiert Kinder
              spielerisch für einen reflektierten Umgang mit digitalen Medien."
            </blockquote>
            <p className="mt-3 text-xs text-violet-600 font-semibold">— TOMMI-Jury 2026</p>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5 sm:p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">
              Kategorie Bildung
            </div>
            <blockquote className="text-sm sm:text-base text-slate-800 leading-relaxed italic">
              „Amy Surfwing – Kids surfen smart greift Situationen auf, denen Kinder in ihrem
              täglichen digitalen Alltag begegnen. Durch die kurzen, interaktiven Chatgeschichten
              und Challenges lernen Kinder, Situationen im Netz selbstständig zu reflektieren –
              ohne erhobenen Zeigefinger von Eltern oder einer Lehrkraft."
            </blockquote>
            <p className="mt-3 text-xs text-teal-700 font-semibold">— TOMMI-Jury 2026</p>
          </div>
        </div>

        {/* ── SCREENSHOTS ── */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Screenshots
          </div>
          <div className="grid grid-cols-5 gap-2">
            {SCREENSHOTS.map((url, i) => (
              <a
                key={url}
                href={url}
                download
                className="group relative block aspect-[9/20] rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-slate-50"
              >
                <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold bg-black/60 rounded-lg px-2 py-1">
                    ⬇ Download
                  </span>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">Auf Screenshot klicken zum Herunterladen</p>
        </div>

        {/* ── LOGOS ── */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Logos
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LOGOS.map(({ label, url }) => (
              <a
                key={url}
                href={url}
                download
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 hover:border-slate-300 hover:bg-white transition-all shadow-sm"
              >
                <img src={url} alt={label} className="h-16 object-contain" />
                <span className="text-xs font-semibold text-slate-600 text-center group-hover:text-slate-900 transition-colors">
                  ⬇ {label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ── FOTOS ── */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Fotos
          </div>
          <div className="flex flex-wrap gap-4 items-start">
            {FOTOS.map(({ label, url }) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-slate-50"
                style={{ width: 180, height: 240 }}
              >
                <img src={url} alt={label} className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end justify-between p-3">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold bg-black/60 rounded-lg px-2 py-1">
                    {label}
                  </span>
                  <a
                    href={url}
                    download
                    onClick={e => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold bg-black/60 rounded-lg px-2 py-1"
                  >
                    ⬇ Download
                  </a>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── DOKUMENTE ── */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Dokumente
          </div>
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white overflow-hidden">
            {DOCS.map(({ label, url, icon, date }) => (
              <div key={url} className="flex items-center gap-3 px-5 py-3.5 group hover:bg-slate-50 transition-colors">
                <span className="text-xl shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-800">{label}</span>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{date}</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="shrink-0 text-xs text-violet-600 hover:text-violet-800 font-medium px-2 py-1 rounded-lg hover:bg-violet-50 transition-colors"
                  title="Öffnen"
                >
                  Öffnen
                </a>
                <a
                  href={url}
                  download
                  onClick={e => e.stopPropagation()}
                  className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Herunterladen"
                >
                  ⬇
                </a>
              </div>
            ))}
          </div>
        </div>


      </div>

      {/* ── Video-Lightbox ── */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setVideoOpen(false)}
        >
          <div className="relative w-full max-w-sm sm:max-w-md" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setVideoOpen(false)}
              className="absolute -top-9 right-0 text-white/80 hover:text-white text-sm font-semibold transition-colors"
            >
              ✕ Schließen
            </button>
            <video
              controls
              playsInline
              autoPlay
              className="w-full max-h-[70dvh] rounded-2xl shadow-2xl"
            >
              <source src={`${PM}/halloweenspezial_video_melina.mp4`} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </Layout>
  );
}
