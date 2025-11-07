// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Falls deine Hauptsprache DE ist, nimm 'de'; sonst 'en'
    fallbackLng: 'de',
    supportedLngs: ['de', 'en'],
    debug: true,

    // Wir arbeiten mit mehreren Namespaces
    defaultNS: 'welcome',
    ns: ['welcome', 'navigation', 'courses', 'about', 'stories'],

    interpolation: { escapeValue: false },

    backend: {
      // => /public/locales/de/stories.json etc.
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Praktisch, damit t('foo') nicht null zurückgibt, wenn ein Key fehlt
    returnNull: false,
  });

export default i18n;

// ---- Typen für deine Namespaces (damit TS zufrieden ist) ----
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'welcome';
    resources: {
      welcome: {
        title: string;
        subtitle: string;
        welcome: string;
        intro: string;
        discover: string;
        more: string;
      };
      navigation: {
        home: string;
        stories: string;
        about: string;
        cooperations: string;
      };
      courses: {
        headline: string;
        done: string;
        inProgress: string;
        new: string;
      };
      about: {
        ourVision: { title: string; copy: string };
        ourMotivation: { title: string; copy: string };
        ourEducationalApproach: {
          title: string;
          copy1: string;
          copy2: string;
          copy3: string;
        };
        ourMethod: { title: string; copy: string };
        ourTeam: {
          title: string;
          members: Array<{ name: string; role: string; bio: string }>;
        };
        amplifyYourMind: { title: string; copy: string };
        whyAmy: { title: string; copy: string };
        callForAction: { title: string; copy: string; button: string };
      };
      // <-- NEU: stories
      stories: {
        howto: {
          title: string;
          lead: string;
          steps: {
            '1': { title: string; text: string };
            '2': { title: string; text: string };
            '3': { title: string; text: string };
          };
          cta: string;
        };
      };
    };
  }
}
