// src/i18n.ts
import i18n, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ✅ Alle Namespaces, die es gibt (nur Liste, noch nicht laden)
export const I18N_NAMESPACES = [
  'common',
  'navigation',
  'layout',
  'notFound',
  'welcome',
  'courses',
  'about',
  'stories',
  'album',
  'profile',
  'avatar',
  'bonus',
  'adult',
  'amy',
  'ai',
  'parents',
  'concept',
  'themes',
] as const;

export type I18nNamespace = (typeof I18N_NAMESPACES)[number];

// ✅ Cache, damit wir pro (lang+ns) nur 1x laden
const loaded = new Set<string>();

async function importNamespace(lng: string, ns: I18nNamespace): Promise<Resource> {
  // Vite kann JSON dynamisch importieren.
  // Wichtig: Pfad muss auf src zeigen.
  switch (lng) {
    case 'de':
      return (await import(`./i18n/locales/de/${ns}.json`)).default as Resource;
    case 'en':
      return (await import(`./i18n/locales/en/${ns}.json`)).default as Resource;
    default:
      // fallback auf de, falls mal was Exotisches kommt
      return (await import(`./i18n/locales/de/${ns}.json`)).default as Resource;
  }
}

export async function ensureNamespace(lng: string, ns: I18nNamespace) {
  const key = `${lng}:${ns}`;
  if (loaded.has(key)) return;

  const data = await importNamespace(lng, ns);
  i18n.addResourceBundle(lng, ns, data, true, true);
  loaded.add(key);
}

export async function ensureNamespaces(lng: string, namespaces: I18nNamespace[]) {
  for (const ns of namespaces) {
    await ensureNamespace(lng, ns);
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'de',
    supportedLngs: ['de', 'en'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    cleanCode: true,

    debug: true,

    defaultNS: 'common',

    // ✅ Wichtig: keine Http-Backend Namespaces-Liste hier “hart laden”.
    // Wir laden per ensureNamespace()
    ns: [...I18N_NAMESPACES],

    interpolation: { escapeValue: false },

    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    returnNull: false,
  });

export default i18n;