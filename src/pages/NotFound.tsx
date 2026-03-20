// src/pages/NotFound.tsx
// 404 page (AYM-Vision Aufräum-Leitfaden):
// - i18n: keine hardcodierten Texte (nur defaultValue sparsam)
// - Assets: aus /public via assetUrl(...), keine Runtime-Imports aus public
// - UI: ruhig, freundlich, klare Rückführung

import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout';
import { assetUrl } from '../common/assetUrl';

type NotFoundLocationState = {
  backTo?: string;
};

export default function NotFound() {
  const { t } = useTranslation('notFound');

  // ✅ optional: falls jemand von einer internen Seite kommt, zurück dorthin
  const location = useLocation();
  const state = (location.state ?? null) as NotFoundLocationState | null;
  const backTo = state?.backTo ?? '/';

  // ✅ Bild aus /public via assetUrl (deploy-sicher)
  // Tipp: besser als webp/avif ausliefern, wenn vorhanden (z.B. amy-512.webp)
  const amyImage = assetUrl('media/ui/notfound/amy_lg.png');

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <img
          src={amyImage}
          alt={t('imageAlt', { defaultValue: 'Amy hilft dir weiter' })}
          className="w-48 sm:w-56 md:w-64 mb-8 select-none"
          draggable={false}
          loading="lazy"
        />

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-teal-900)] mb-4">
          {t('title', { defaultValue: 'Ups… hier ist etwas schiefgelaufen' })}
        </h1>

        <p className="max-w-md text-base text-[var(--color-teal-700)] mb-8">
          {t('description', {
            defaultValue:
              'Diese Seite gibt es leider nicht (mehr). Aber keine Sorge – Amy bringt dich zurück.',
          })}
        </p>

        <Link
          to={backTo}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[var(--color-teal-900)]
                     ring-1 ring-black/5 hover:shadow-md hover:ring-black/10 transition"
          aria-label={t('backHomeAria', { defaultValue: 'Zurück zur App' })}
        >
          ← {t('backHome', { defaultValue: 'Zur Startseite' })}
        </Link>
      </main>
    </Layout>
  );
}
