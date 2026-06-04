// src/i18n.d.ts
// Statische Typen für i18next Namespaces (aus den JSON-Dateien abgeleitet).

import 'i18next';

import common from './i18n/locales/de/common.json';
import navigation from './i18n/locales/de/navigation.json';
import layout from './i18n/locales/de/layout.json';
import notFound from './i18n/locales/de/notFound.json';

import welcome from './i18n/locales/de/welcome.json';
import courses from './i18n/locales/de/courses.json';
import about from './i18n/locales/de/about.json';
import stories from './i18n/locales/de/stories.json';

import profile from './i18n/locales/de/profile.json';
import avatar from './i18n/locales/de/avatar.json';
import bonus from './i18n/locales/de/bonus.json';
import amy from './i18n/locales/de/amy.json';
import adult from './i18n/locales/de/adult.json';
import ai from './i18n/locales/de/ai.json';
import album from './i18n/locales/de/album.json';
import parents from './i18n/locales/de/parents.json';
import concept from './i18n/locales/de/concept.json';
import themes from './i18n/locales/de/themes.json';
import studio from './i18n/locales/de/studio.json';


declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      navigation: typeof navigation;
      layout: typeof layout;
      notFound: typeof notFound;

      welcome: typeof welcome;
      courses: typeof courses;
      about: typeof about;
      stories: typeof stories;

      profile: typeof profile;
      avatar: typeof avatar;
      bonus: typeof bonus;
      amy: typeof amy;
      adult: typeof adult;
      ai: typeof ai;
      album: typeof album;
      parents: typeof parents;
      concept: typeof concept;
      themes: typeof themes;
      studio: typeof studio;
    };
  }
}
