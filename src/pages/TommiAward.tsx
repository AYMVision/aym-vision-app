import Layout from '../components/Layout';

const FACHJURY_VIDEO = '/media/ui/Tommi/amy-surfwing-fachjury.mp4';
const KIDSJURY_VIDEO = '/media/ui/Tommi/amy-surfwing-kidsjury.mp4';
const FACHJURY_PDF = '/media/ui/Tommi/AmySurfwing_TOMMI_Onepager.pdf';
const KIDSJURY_PDF = '/media/ui/Tommi/AmySurfwing_TOMMI_Onepager_KIDS.pdf';

function JurySection({
  label,
  title,
  intro,
  videoSrc,
  pdfHref,
  pdfLabel,
  color,
}: {
  label: string;
  title: string;
  intro: string;
  videoSrc: string;
  pdfHref: string;
  pdfLabel: string;
  color: 'violet' | 'teal';
}) {
  const accent =
    color === 'violet'
      ? {
          kicker: 'text-violet-600',
          border: 'border-violet-100',
          bg: 'bg-violet-50',
          btn: 'bg-violet-600 hover:bg-violet-700',
          tag: 'bg-violet-100 text-violet-700 border-violet-200',
        }
      : {
          kicker: 'text-teal-600',
          border: 'border-teal-100',
          bg: 'bg-teal-50',
          btn: 'bg-teal-600 hover:bg-teal-700',
          tag: 'bg-teal-100 text-teal-700 border-teal-200',
        };

  return (
    <div className={`rounded-2xl border ${accent.border} ${accent.bg} p-5 sm:p-6`}>
      <div className={`text-xs font-semibold uppercase tracking-wide ${accent.kicker}`}>{label}</div>
      <h2 className="mt-1 text-base sm:text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{intro}</p>

      <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <video
          controls
          className="w-full h-auto block"
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
          Dein Browser unterstützt keine Videowiedergabe.
        </video>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={pdfHref}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors ${accent.btn}`}
        >
          <span>📄</span>
          {pdfLabel}
        </a>
        <a
          href={pdfHref}
          download
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:border-slate-300 transition-colors"
        >
          <span>⬇️</span>
          Herunterladen
        </a>
      </div>
    </div>
  );
}

export default function TommiAward() {
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
        <JurySection
          label="Kids-Jury"
          title="Video und Onepager für die Kids-Jury"
          intro="AMY SURFWING für euch erklärt: Was erwartet euch? Wie funktioniert’s? Und was könnt ihr erleben?"
          videoSrc={KIDSJURY_VIDEO}
          pdfHref={KIDSJURY_PDF}
          pdfLabel="Onepager Kids-Jury ansehen"
          color="violet"
        />

        {/* FACH-JURY */}
        <JurySection
          label="Fach-Jury"
          title="Video und Onepager für die Fach-Jury"
          intro="AMY SURFWING für die Fachjury erklärt: Wie funktioniert die App, was ist die Idee dahinter und was können Kinder dabei lernen?"
          videoSrc={FACHJURY_VIDEO}
          pdfHref={FACHJURY_PDF}
          pdfLabel="Onepager Fach-Jury ansehen"
          color="teal"
        />

        {/* PRESSE UND MEDIEN */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Presse und Medien</div>
          <h2 className="mt-1 text-base sm:text-lg font-semibold text-slate-900">Pressebereich</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
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


{/* Logo für hellen Hintergrund */}
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

            {/* Logo für dunklen Hintergrund */}
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

        {/* FOOTER NOTE */}
        <p className="text-center text-xs text-slate-400">
          Amy Surfwing · AYM Vision · TOMMI Award 2026
        </p>
      </div>
    </Layout>
  );
}
