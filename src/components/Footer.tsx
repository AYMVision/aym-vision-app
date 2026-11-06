import React from 'react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../common/assetUrl';

const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as unknown as { standalone?: boolean }).standalone === true;

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t mt-8 py-6 px-4 text-sm bg-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600">

        {/* Left: Copyright */}
        <span>© {new Date().getFullYear()} AYM Vision</span>

        {/* Center: Interne Seiten + B2B (nur im Browser) */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/faq"
            className="hover:text-[var(--color-teal-500)] transition-colors"
          >
            FAQ
          </Link>
          {!isStandalone && (
            <>
              <Link
                to="/fuer-schulen"
                className="hover:text-[var(--color-teal-500)] transition-colors"
              >
                Für Schulen
              </Link>
              <Link
                to="/fuer-organisationen"
                className="hover:text-[var(--color-teal-500)] transition-colors"
              >
                Für Organisationen
              </Link>
            </>
          )}
        </div>

        {/* Right: Rechtliches */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-end">
          <a
            href="mailto:hello@amysurfwing.de"
            className="hover:underline"
          >
            Kontakt
          </a>

          <Link to="/agb" className="hover:underline">
            AGB
          </Link>

          <Link to="/widerruf" className="hover:underline">
            Vertrag widerrufen
          </Link>

          <Link to="/hilfe" className="hover:underline">
            Hilfe &amp; Notfall
          </Link>

          <Link to="/systemvoraussetzungen" className="hover:underline">
            Systemvoraussetzungen
          </Link>

          <Link
            to="/impressum"
            className="hover:underline"
          >
            Impressum
          </Link>

          <a
            href={assetUrl('datenschutz-web.pdf')}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Datenschutz
          </a>
        </div>

      </div>

      {/* Partner badges */}
      <div className="max-w-7xl mx-auto mt-5 pt-4 border-t border-slate-100 flex justify-center">
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <span className="text-xs text-slate-400">Gefördert &amp; unterstützt von</span>
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
              className="h-7 w-auto"
              loading="lazy"
            />
          </a>
          <a
            href="https://www.nbank.de"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-75 hover:opacity-100 transition-opacity"
            aria-label="NBank Gründungsstipendium"
          >
            <img
              src={assetUrl('media/ui/Siegel_Gründungsstipendium_Start-up_2024.png')}
              alt="Gründungsstipendium Start-up 2025/2026 – NBank"
              className="h-12 w-auto"
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
              alt="Unterstützt von WIN Startup Academy Braunschweig"
              className="h-12 w-auto"
              loading="lazy"
            />
          </a>
          <a
            href="https://tommi.kids/magazin/die-tomminierten-2026/"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-75 hover:opacity-100 transition-opacity"
            aria-label="TOMMI Games Award 2026 – nominiert in Kategorie App und Bildung"
          >
            <img
              src={assetUrl('media/ui/Tommi_award_nominierung_2026.png')}
              alt="TOMMI Games Award 2026 – nominiert"
              className="h-12 w-auto"
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
