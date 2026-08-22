import adultDE from './locales/de/adult.json';
import adultEN from './locales/en/adult.json';

import amyDE from './locales/de/amy.json';
import amyEN from './locales/en/amy.json';

import commonDE from './locales/de/common.json';
import commonEN from './locales/en/common.json';

import storiesDE from './locales/de/stories.json';
import storiesEN from './locales/en/stories.json';

import lexikonDE from './locales/de/lexikon.json';
import lexikonEN from './locales/en/lexikon.json';

import profileDE from './locales/de/profile.json';
import profileEN from './locales/en/profile.json';

import coursesDE from './locales/de/courses.json';
import coursesEN from './locales/en/courses.json';

import navigationDE from './locales/de/navigation.json';
import navigationEN from './locales/en/navigation.json';

export const resources = {
  de: {
    adult: adultDE,
    common: commonDE,
    amy: amyDE,
    stories: storiesDE,
    lexikon: lexikonDE,
    profile: profileDE,
    courses: coursesDE,
    navigation: navigationDE,
  },
  en: {
    adult: adultEN,
    common: commonEN,
    amy: amyEN,
    stories: storiesEN,
    lexikon: lexikonEN,
    profile: profileEN,
    courses: coursesEN,
    navigation: navigationEN,
  },
} as const;