import React from 'react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../common/assetUrl';


const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t mt-8 py-6 px-4 text-sm bg-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600">

        {/* Left: Copyright */}
        <span>© {new Date().getFullYear()} AYM Vision</span>

        {/* Center: Interne Seiten */}
        <div className="flex flex-wrap gap-4 justify-center">

          <Link
            to="/faq"
            className="hover:text-[var(--color-teal-500)] transition-colors"
          >
            FAQ
          </Link>
        </div>

        {/* Right: Rechtliches */}
        <div className="flex gap-4">
          <a
            href="mailto:hello@aymvision.de"
            className="hover:underline"
          >
            Kontakt
          </a>

          <Link
            to="/impressum"
            className="hover:underline"
          >
            Impressum
          </Link>

          <a
            href="/datenschutz-web.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Datenschutz
          </a>
        </div>

      </div>

      {/* Hafven partnership badge */}
      <div className="max-w-7xl mx-auto mt-5 pt-4 border-t border-slate-100 flex justify-center">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Unterstützt von</span>
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
