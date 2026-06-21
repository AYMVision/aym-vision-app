// src/content/characters.ts
import type { Character } from '../common/types';

export type CharacterCardMedia = {
  // Portrait fürs Album + Öffnen
  portrait: string; // public/media/...
  // Detailansicht
  detailImage?: string; // public/media/...
  // ✅ NEU: 1..n zusätzliche Bilder (für Fotoleiste)
  extraImages?: string[]; // public/media/...
  // optional Video
  detailVideo?: string; // public/media/...mp4
};

export type CharacterEx = {
  id: string;
  name: string;
  avatar?: string;
  mainTheme?: {
    bg: string;
    border: string;
    text: string;
  };

  card?: CharacterCardMedia;
  bioKey?: string;
  detailCaptionKey?: string;
};


const ROOT = 'media/story/characters';

// Konventionen:
// - Portrait: <id>-512.webp
// - Detail Image: <id>-detail-1024.webp
function portraitPath(id: string) {
  return `${ROOT}/${id}-512.webp`;
}
function detailImagePath(id: string) {
  return `${ROOT}/${id}-detail-1024.webp`;
}

export const CHARACTERS = {
  amy: {
    id: 'amy',
    name: 'Amy',
    avatar: 'amy',
    mainTheme: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-900',
    },
    card: {
      portrait: portraitPath('amy'),
      detailImage: detailImagePath('amy'),
    extraImages: [
      `${ROOT}/amy-extra-1-512.webp`,
      `${ROOT}/amy-extra-2-512.webp`,
    ],
    },
    bioKey: 'characters.amy.bio',
    detailCaptionKey: 'characters.amy.detailCaption',
  },

  chioma: {
    id: 'chioma',
    name: 'Chioma',
    avatar: 'chioma',
    card: {
      portrait: portraitPath('chioma'),
      detailImage: detailImagePath('chioma'),
    },
    
    bioKey: 'characters.chioma.bio',
    detailCaptionKey: 'characters.chioma.detailCaption',
  },


lisa: {
  id: 'lisa',
  name: 'Lisa',
  avatar: 'lisa',
  card: {
    portrait: portraitPath('lisa'),
    detailImage: detailImagePath('lisa'),

    // ✅ NEU: zusätzliche Bilder für die Fotoleiste
    extraImages: [
      `${ROOT}/lisa-extra-1-512.webp`,
      `${ROOT}/lisa-extra-2-512.webp`,
    ],

  },
  bioKey: 'characters.lisa.bio',
  detailCaptionKey: 'characters.lisa.detailCaption',
},

  yasmin: { 
    id: 'yasmin', 
    name: 'Yasmin', 
    avatar: 'yasmin',
    card: {
      portrait: portraitPath('yasmin'),
      detailImage: detailImagePath('yasmin'),
                extraImages: [
      `${ROOT}/yasmin-extra-1-512.webp`,
      `${ROOT}/yasmin-extra-2-512.webp`,
    ],
    },
    bioKey: 'characters.yasmin.bio',
  },

  dominik: {
    id: 'dominik',
    name: 'Dominik',
    avatar: 'dominik',
    card: {
      portrait: portraitPath('dominik'),
      detailImage: detailImagePath('dominik'),
          extraImages: [
      `${ROOT}/dominik-extra-1-512.webp`,
      `${ROOT}/dominik-extra-2-512.webp`,
    ],

    },
    bioKey: 'characters.dominik.bio',
  },

    lukas: {
    id: 'lukas',
    name: 'Lukas',
    avatar: 'lukas',
    card: {
      portrait: portraitPath('lukas'),
      detailImage: detailImagePath('lukas'),
          extraImages: [
      `${ROOT}/lukas-extra-1-512.webp`,
      `${ROOT}/lukas-extra-2-512.webp`,
    ],

    },
    bioKey: 'characters.lukas.bio',
  },

    jonas: {
    id: 'jonas',
    name: 'Jonas',
    avatar: 'jonas',
    card: {
      portrait: portraitPath('jonas'),
      detailImage: detailImagePath('jonas'),
          extraImages: [
      `${ROOT}/jonas-extra-1-512.webp`,
      `${ROOT}/jonas-extra-2-512.webp`,
    ],

    },
    bioKey: 'characters.jonas.bio',
  },

  schubert: {
  id: 'schubert',
  name: 'Mrs. schubert',
  avatar: 'schubert',
  card: {
    portrait: portraitPath('schubert'),
    detailImage: detailImagePath('schubert'),
    extraImages: [
      `${ROOT}/schubert-extra-1-512.webp`,
      `${ROOT}/schubert-extra-2-512.webp`,
    ],
  },
  bioKey: 'characters.schubert.bio',
},

    carlos: {
    id: 'carlos',
    name: 'Carlos',
    avatar: 'carlos',
    card: {
      portrait: portraitPath('carlos'),
      detailImage: detailImagePath('carlos'),
          extraImages: [
      `${ROOT}/carlos-extra-1-512.webp`,
      `${ROOT}/carlos-extra-2-512.webp`,
    ],

    },
    bioKey: 'characters.carlos.bio',
  },

  aylin: { id: 'aylin', name: 'Aylin', avatar: 'aylin',
        card: {
      portrait: portraitPath('aylin'),
      detailImage: detailImagePath('aylin'),
          extraImages: [
      `${ROOT}/aylin-extra-1-512.webp`,
      `${ROOT}/aylin-extra-2-512.webp`,
    ],

    },
    bioKey: 'characters.aylin.bio',
    },

  mia: {
    id: 'mia',
    name: 'Mia',
    avatar: 'mia',
    card: {
      portrait: portraitPath('mia'),
      detailImage: detailImagePath('mia'),
          extraImages: [
      `${ROOT}/mia-extra-1-512.webp`,
      `${ROOT}/mia-extra-2-512.webp`,
    ],

    },
    bioKey: 'characters.mia.bio',
  },

  finn: {
    id: 'finn',
    name: 'Finn',
    avatar: 'finn',
    card: {
      portrait: portraitPath('finn'),
      detailImage: detailImagePath('finn'),
          extraImages: [
      `${ROOT}/finn-extra-1-512.webp`,
      `${ROOT}/finn-extra-2-512.webp`,
    ],

    },
    bioKey: 'characters.finn.bio',
  },

  tom: {
    id: 'tom',
    name: 'Tom',
    avatar: 'tom',
    card: {
      portrait: portraitPath('tom'),
      detailImage: detailImagePath('tom'),
          extraImages: [
      `${ROOT}/tom-extra-1-512.webp`,
      `${ROOT}/tom-extra-2-512.webp`,
    ],

    },
    bioKey: 'characters.tom.bio',
  },


markus: {
  id: 'markus',
  name: 'Markus',
  avatar: 'markus',
  card: {
    portrait: portraitPath('markus'),
    detailImage: detailImagePath('markus'),
    extraImages: [
      `${ROOT}/markus-extra-1-512.webp`,
      `${ROOT}/markus-extra-2-512.webp`,
    ],
  },
  bioKey: 'characters.markus.bio',
},

elsa: {
  id: 'elsa',
  name: 'Elsa',
  avatar: 'elsa',
  card: {
    portrait: portraitPath('elsa'),
    detailImage: detailImagePath('elsa'),
    extraImages: [
      `${ROOT}/elsa-extra-1-512.webp`,
      `${ROOT}/elsa-extra-2-512.webp`,
    ],
  },
  bioKey: 'characters.elsa.bio',
},

igor: {
  id: 'igor',
  name: 'Igor',
  avatar: 'igor',
  card: {
    portrait: portraitPath('igor'),
    detailImage: detailImagePath('igor'),
    extraImages: [
      `${ROOT}/igor-extra-1-512.webp`,
      `${ROOT}/igor-extra-2-512.webp`,
    ],
  },
  bioKey: 'characters.igor.bio',
},

alvarez: {
  id: 'alvarez',
  name: 'Mr. Alvarez',
  avatar: 'alvarez',
  card: {
    portrait: portraitPath('alvarez'),
    detailImage: detailImagePath('alvarez'),
    extraImages: [
      `${ROOT}/alvarez-extra-1-512.webp`,
      `${ROOT}/alvarez-extra-2-512.webp`,
    ],
  },
  bioKey: 'characters.alvarez.bio',
},

emma: {
  id: 'emma',
  name: 'Emma',
  avatar: 'emma',
  card: {
    portrait: portraitPath('emma'),
    detailImage: detailImagePath('emma'),
    extraImages: [
      `${ROOT}/emma-extra-1-512.webp`,
      `${ROOT}/emma-extra-2-512.webp`,
    ],
  },
  bioKey: 'characters.emma.bio',
},

noah: {
  id: 'noah',
  name: 'Noah',
  avatar: 'noah',
  card: {
    portrait: portraitPath('noah'),
    detailImage: detailImagePath('noah'),
    extraImages: [
      `${ROOT}/noah-extra-1-512.webp`,
      `${ROOT}/noah-extra-2-512.webp`,
    ],
  },
  bioKey: 'characters.noah.bio',
},

farida: {
  id: 'farida',
  name: 'Farida',
  avatar: 'farida',
  card: {
    portrait: portraitPath('farida'),
    detailImage: detailImagePath('farida'),
    extraImages: [
      `${ROOT}/farida-extra-1-512.webp`,
      `${ROOT}/farida-extra-2-512.webp`,
    ],
  },
  bioKey: 'characters.farida.bio',
},

amir: {
  id: 'amir',
  name: 'Amir',
  avatar: 'amir',
  card: {
    portrait: portraitPath('amir'),
    detailImage: detailImagePath('amir'),
    extraImages: [
      `${ROOT}/amir-extra-1-512.webp`,
      `${ROOT}/amir-extra-2-512.webp`,
    ],
  },
  bioKey: 'characters.amir.bio',
},



} as const satisfies Record<string, CharacterEx>;





export const STORY_CHARACTERS: Record<string, Character> = {
  amy: CHARACTERS.amy,
  chioma: CHARACTERS.chioma,
  lisa: CHARACTERS.lisa,
  yasmin: CHARACTERS.yasmin,
  dominik: CHARACTERS.dominik,
  lukas: CHARACTERS.lukas,
  jonas: CHARACTERS.jonas,
  carlos: CHARACTERS.carlos,
  aylin: CHARACTERS.aylin,
  mia: CHARACTERS.mia,
  finn: CHARACTERS.finn,
  tom: CHARACTERS.tom,
  markus: CHARACTERS.markus,
  elsa: CHARACTERS.elsa,
  igor: CHARACTERS.igor,
  alvarez: CHARACTERS.alvarez,
  emma: CHARACTERS.emma,
  farida: CHARACTERS.farida,
  amir: CHARACTERS.amir,
};
