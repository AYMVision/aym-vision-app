import React from 'react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../common/assetUrl';

const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as unknown as { standalone?: boolean }).standalone === true;

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t mt-8 bg-white">

      {/* ── Zone 1: Copyright + Navigation ── */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-600">
        <span className="font-medium text-slate-500">© {new Date().getFullYear()} AYM Vision GmbH</span>
        <span className="hidden sm:inline text-slate-200">|</span>
        <Link to="/faq" className="hover:text-[var(--color-teal-600)] transition-colors">FAQ</Link>
        {!isStandalone && (
          <>
            <Link to="/fuer-schulen" className="hover:text-[var(--color-teal-600)] transition-colors">Für Schulen</Link>
            <Link to="/fuer-organisationen" className="hover:text-[var(--color-teal-600)] transition-colors">Für Organisationen</Link>
          </>
        )}
        <a href="mailto:hello@amysurfwing.de" className="hover:text-[var(--color-teal-600)] transition-colors">Kontakt</a>
      </div>

      {/* ── Zone 2: Rechtliches ── */}
      <div className="max-w-4xl mx-auto px-4 pb-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
        <Link to="/agb" className="hover:underline">AGB</Link>
        <Link to="/widerruf" className="hover:underline">Widerruf</Link>
        <Link to="/hilfe" className="hover:underline">Hilfe &amp; Notfall</Link>
        <Link to="/systemvoraussetzungen" className="hover:underline">Systemvoraussetzungen</Link>
        <Link to="/impressum" className="hover:underline">Impressum</Link>
        <a href={assetUrl('datenschutz-web.pdf')} target="_blank" rel="noopener noreferrer" className="hover:underline">Datenschutz</a>
      </div>

      {/* ── Trennlinie ── */}
      <div className="border-t border-slate-100" />

      {/* ── Zone 3: Förderung ── */}
      <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">

        {/* Links: Gefördert von — NBank als Hauptförderer */}
        <div className="flex flex-col items-center sm:items-start gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Gefördert von</span>
          <a
            href="https://www.nbank.de"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80 hover:opacity-100 transition-opacity"
            aria-label="NBank Gründungsstipendium"
          >
            <img
              src={assetUrl('media/ui/Siegel_Gründungsstipendium_Start-up_2024.png')}
              alt="Gründungsstipendium Start-up 2025/2026 – NBank"
              className="h-14 w-auto"
              loading="lazy"
            />
          </a>
        </div>

        {/* Rechts: Unterstützt von — Hafven + WIN */}
        <div className="flex flex-col items-center sm:items-end gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Unterstützt von</span>
          <div className="flex items-center gap-5">
            <a
              href="https://hafven.de/impact-accelerator"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-90 transition-opacity"
              aria-label="Hafven Impact Accelerator"
            >
              <img
                src={assetUrl('media/ui/HafvenImpactAccelerator_Logo_schwarz.png')}
                alt="Hafven Impact Accelerator"
                className="h-6 w-auto"
                loading="lazy"
              />
            </a>
            <a
              href="https://www.braunschweig.de/wirtschaft_wissenschaft/innovationsfoerderung/win_startup_akademie_fuer_wachstum_und_innovation.php"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-90 transition-opacity"
              aria-label="WIN Startup Academy Braunschweig"
            >
              <img
                src={assetUrl('media/ui/300_WIN_Logo_2022_BS_Unterstuetzung.webp')}
                alt="WIN Startup Academy Braunschweig"
                className="h-8 w-auto"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>

      {/* ── Zone 4: Auszeichnungen ── */}
      <div className="border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {/* TOMMI */}
          <div className="flex items-center gap-3">
            <a
              href="https://tommi.kids/magazin/die-tomminierten-2026/"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 transition-opacity"
              aria-label="TOMMI Games Award 2026"
            >
              <img
                src={assetUrl('media/ui/Tommi_award_nominierung_2026.png')}
                alt="TOMMI Games Award 2026 – nominiert"
                className="h-12 w-auto"
                loading="lazy"
              />
            </a>
            <div>
              <div className="text-xs font-semibold text-slate-700">🏆 Nominiert: TOMMI Games Award 2026</div>
              <div className="text-[11px] text-slate-400">Kategorie App &amp; Bildung</div>
            </div>
          </div>

          {/* Digitales Hannover */}
          <div className="flex items-center gap-3">
            <a
              href="https://digitaleshannover.de/die-eins-des-monats-oktober-amy-surfwing-kids-surfen-smart/"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Digitales Hannover – Die Eins des Monats"
            >
              <img
                src={assetUrl('media/ui/Digitales Hannover die eins des Monats.png')}
                alt="Digitales Hannover – Die Eins des Monats"
                className="h-12 w-auto"
                loading="lazy"
              />
            </a>
            <div>
              <div className="text-xs font-semibold text-slate-700">🌟 Die Eins des Monats</div>
              <div className="text-[11px] text-slate-400">Digitales Hannover</div>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
