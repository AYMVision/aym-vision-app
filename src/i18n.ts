import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    ns: ['welcome'],
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/src/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;

declare module 'i18next' {
  interface CustomTypeOptions {
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
        ourVision: {
          title: string;
          copy: string;
        };
        ourMotivation: {
          title: string;
          copy: string;
        };
        ourEducationalApproach: {
          title: string;
          copy1: string;
          copy2: string;
          copy3: string;
        };
        ourMethod: {
          title: string;
          copy: string;
        };
        ourTeam: {
          title: string;
          members: Array<{
            name: string;
            role: string;
            bio: string;
          }>;
        };
        amplifyYourMind: {
          title: string;
          copy: string;
        };
        whyAmy: {
          title: string;
          copy: string;
        };
        callForAction: {
          title: string;
          copy: string;
          button: string;
        };
      };
    };
  }
}
