import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getActiveProfileId } from '../profile/profileStorage';
import { assetUrl } from '../common/assetUrl';
import Layout from '../components/Layout';

type CertData = {
  hash: string;
  verifyUrl: string;
  courseId?: string;
  completionDate?: string;
  chatName?: string;
  avatarBaseId?: string;
};

function loadCert(): CertData | null {
  const profileId = getActiveProfileId();
  if (!profileId) return null;
  try {
    const raw = localStorage.getItem(`aym_p_${profileId}__aym_completion_cert`);
    return raw ? (JSON.parse(raw) as CertData) : null;
  } catch {
    return null;
  }
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('de-DE', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function Zertifikat() {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();
  const cert = loadCert();

  if (!cert) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-8 text-center">
          <p className="text-slate-500">{t('cert.noCert')}</p>
          <button onClick={() => navigate('/profile')} className="text-sm font-semibold text-teal-600 hover:underline">
            {t('cert.backBtn')}
          </button>
        </div>
      </Layout>
    );
  }

  const name = cert.chatName?.trim() || '—';
  const date = cert.completionDate ? formatDate(cert.completionDate) : null;
  const skills = t('cert.skills', { returnObjects: true }) as { name: string; detail: string }[];
  const themes = t('cert.themes', { returnObjects: true }) as { emoji: string; name: string }[];

  return (
    <Layout>
      {/* Aktionsleiste */}
      <div className="print:hidden flex items-center justify-between gap-3 px-4 py-3 max-w-2xl mx-auto w-full">
        <button
          onClick={() => navigate('/profile')}
          className="text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors"
        >
          {t('cert.backBtn')}
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition-colors shadow-sm"
        >
          🖨️ {t('cert.printBtn')}
        </button>
      </div>

      {/* Zertifikat */}
      <div className="cert-page mx-auto max-w-2xl w-full px-4 pb-10">

        {/* ── Äußerer Rahmen ── */}
        <div
          className="rounded-2xl p-[6px] shadow-2xl"
          style={{ background: '#0f766e' }}
        >
          {/* ── Innerer Rahmen mit Urkundenpapier-Textur ── */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: '#FFFEF5',
              backgroundImage: 'radial-gradient(circle, #d1fae5 1px, transparent 1px)',
              backgroundSize: '18px 18px',
              border: '2px solid #99f6e4',
            }}
          >

            {/* ── Kopfbereich ── */}
            <div className="text-center pt-5 pb-3 px-6">
              <div
                className="text-sm select-none"
                style={{ color: '#99f6e4', letterSpacing: '0.55em' }}
              >
                ✦ ✦ ✦ ✦ ✦
              </div>
              <img
                src={assetUrl('media/ui/Tommi/Logo%20Amy%20Surfwing%20mit%20wei%C3%9Fer%20Eule.png')}
                alt="Amy Surfwing"
                className="h-10 w-auto mx-auto mt-2"
                style={{ filter: 'drop-shadow(0 1px 3px rgba(15,118,110,0.3))' }}
              />
              <div
                className="mt-2 text-[10px] font-bold uppercase"
                style={{ color: '#0f766e', letterSpacing: '0.4em' }}
              >
                {t('cert.heading')}
              </div>
              <div
                className="mt-2 text-sm select-none"
                style={{ color: '#99f6e4', letterSpacing: '0.55em' }}
              >
                ✦ ✦ ✦ ✦ ✦
              </div>
            </div>

            {/* ── Trennlinie ── */}
            <div className="mx-6 border-t-2 border-teal-200" />

            {/* ── Amy-Figur + Name ── */}
            <div className="text-center px-6 pt-5 pb-4">
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <div
                    className="absolute rounded-full blur-2xl"
                    style={{
                      inset: '-8px',
                      background: 'radial-gradient(circle, #fde68a 20%, transparent 70%)',
                    }}
                  />
                  <img
                    src={assetUrl('media/ui/Pressemappe/Logo_Amy.png')}
                    alt="Amy Surfwing"
                    className="relative object-contain drop-shadow-lg"
                    style={{ width: 112, height: 112 }}
                  />
                </div>
              </div>

              <p
                className="text-[10px] font-bold uppercase"
                style={{ color: '#94a3b8', letterSpacing: '0.3em' }}
              >
                Diese Urkunde bestätigt
              </p>

              <div className="mt-2">
                <span
                  className="font-black tracking-tight leading-none"
                  style={{ fontSize: 'clamp(2rem, 8vw, 2.8rem)', color: '#134e4a' }}
                >
                  {name}
                </span>
              </div>
              <div className="text-amber-400 text-base mt-1 select-none">✨ ✨ ✨</div>

              <p className="mt-2 text-sm font-medium" style={{ color: '#475569' }}>
                {t('cert.completedLabel')}
              </p>

              {/* Staffel-Siegel */}
              <div
                className="mt-3 inline-flex items-center gap-2.5 rounded-2xl px-5 py-2 shadow-md"
                style={{ background: '#0f766e' }}
              >
                <span className="text-white font-black text-sm">🏆 {t('cert.seasonLabel')}</span>
                <span style={{ color: '#5eead4', fontSize: 11 }}>·</span>
                <span className="text-xs" style={{ color: '#99f6e4' }}>{t('cert.seasonSubtitle')}</span>
              </div>
            </div>

            {/* ── Trennlinie dekorativ ── */}
            <div className="mx-6 border-t-2 border-dashed border-teal-200" />

            {/* ── 4 Mediareife-Bereiche ── */}
            <div className="px-6 py-3">
              <div
                className="text-[9px] font-black uppercase mb-2"
                style={{ color: '#0f766e', letterSpacing: '0.3em' }}
              >
                {t('cert.skillsTitle')}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-xl px-3 py-2"
                    style={{ background: 'rgba(240,253,250,0.9)', border: '1px solid #99f6e4' }}
                  >
                    <div className="text-xs font-extrabold" style={{ color: '#134e4a' }}>{skill.name}</div>
                    <div className="text-[10px] mt-0.5 leading-snug" style={{ color: '#0f766e' }}>{skill.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 7 Themen ── */}
            <div className="px-6 pb-3">
              <div
                className="text-[9px] font-black uppercase mb-2"
                style={{ color: '#0f766e', letterSpacing: '0.3em' }}
              >
                {t('cert.themesTitle')}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {themes.map((theme) => (
                  <span
                    key={theme.name}
                    className="inline-flex items-center gap-1 rounded-full text-[10px] font-semibold"
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      padding: '3px 10px',
                    }}
                  >
                    <span aria-hidden>{theme.emoji}</span>
                    {theme.name}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Trennlinie ── */}
            <div className="mx-6 border-t-2 border-teal-200" />

            {/* ── Footer: Datum + Siegel ── */}
            <div className="px-6 py-3 flex items-end justify-between gap-4">
              <div>
                {date && (
                  <>
                    <div className="text-[9px] font-bold uppercase" style={{ color: '#94a3b8', letterSpacing: '0.25em' }}>
                      {t('cert.completedOn')}
                    </div>
                    <div className="text-sm font-semibold mt-0.5" style={{ color: '#1e293b' }}>{date}</div>
                  </>
                )}
                <div className="text-[10px] mt-1" style={{ color: '#64748b' }}>{t('cert.issuedBy')}</div>
                <div className="text-[9px] mt-0.5 font-mono" style={{ color: '#94a3b8' }}>
                  {cert.hash.slice(0, 16)}…
                </div>
              </div>

              {/* Rundes Siegel */}
              <div
                className="shrink-0 rounded-full flex flex-col items-center justify-center shadow-lg"
                style={{
                  width: 68,
                  height: 68,
                  background: '#0f766e',
                  border: '3px solid #99f6e4',
                  outline: '2px solid #0f766e',
                  outlineOffset: '3px',
                }}
              >
                <span className="text-white font-black text-[9px] uppercase leading-tight text-center">
                  AYM<br />VISION
                </span>
                <span className="text-teal-300 text-[8px] mt-0.5">✦ ✦ ✦</span>
              </div>
            </div>

            {/* ── Abschluss-Ornament ── */}
            <div className="text-center pb-4">
              <div
                className="text-xs select-none"
                style={{ color: '#99f6e4', letterSpacing: '0.55em' }}
              >
                ✦ ✦ ✦ ✦ ✦
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm;
          }
          html, body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          nav, header, footer, .print\\:hidden {
            display: none !important;
          }
          main {
            display: block !important;
            padding: 0 !important;
          }
          .cert-page {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 auto !important;
            zoom: 0.85;
          }
          .cert-page > div {
            box-shadow: none !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </Layout>
  );
}
