import amyDE from './locales/de/amy.json';
import amyEN from './locales/en/amy.json';

import commonDE from './locales/de/common.json';
import commonEN from './locales/en/common.json';

// Optional, falls du stories auch als JSON hast:
import storiesDE from './locales/de/stories.json';
import storiesEN from './locales/en/stories.json';

export const resources = {
  de: {
    common: commonDE,
    amy: amyDE,
    stories: storiesDE,
  },
  en: {
    common: commonEN,
    amy: amyEN,
    stories: storiesEN,
  },
} as const;