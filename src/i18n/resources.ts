import amyDE from './locales/de/amy.json';
import amyEN from './locales/en/amy.json';

import commonDE from './locales/de/common.json';
import commonEN from './locales/en/common.json';

import storiesDE from './locales/de/stories.json';
import storiesEN from './locales/en/stories.json';

import lexikonDE from './locales/de/lexikon.json';
import lexikonEN from './locales/en/lexikon.json';

export const resources = {
  de: {
    common: commonDE,
    amy: amyDE,
    stories: storiesDE,
    lexikon: lexikonDE,
  },
  en: {
    common: commonEN,
    amy: amyEN,
    stories: storiesEN,
    lexikon: lexikonEN,
  },
} as const;