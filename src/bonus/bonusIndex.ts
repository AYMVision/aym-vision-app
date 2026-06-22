// src/bonus/bonusIndex.ts
// Single Source of Truth für Story-Welt (staffel-/episodenunabhängig erweiterbar).
// Charakterkarten werden automatisch aus CHARACTERS generiert.
// Freischaltung pro Charakter erfolgt über eine Map (chapterId -> characterId).

import { CHARACTERS } from '../content/characters';

// AKUELLES BONUSMATERIAL: Newsletter in dem er Artikel und Audio geht. Es Gibt Sammelkarten über die characters und Tagebücher von einzelnen Charakteren

export type BonusCategory =
  | 'characters'
  | 'diaries'
  | 'newspaper'
  | 'audio'
  | 'tips';

export type BonusMediaType = 'text' | 'audio' | 'link' | 'profile';

export type BonusUnlockRef =
  | { type: 'chapter'; id: string } // z.B. s1e01c07
  | { type: 'marker'; id: string }
  | { type: 'episode'; id: string }; // optional

export type CharacterId = keyof typeof CHARACTERS;

export type BonusBodyKind = 'md' | 'pdf';

export interface BonusItem {
  bonusId: string;
  category: BonusCategory;
  mediaType: BonusMediaType;

  // i18n Keys (bei Character-Profilen optional, Name kommt aus CHARACTERS)
  titleKey?: string;
  descriptionKey?: string;

  // Meta / Beziehungen
  characterId?: CharacterId; // für Profile
  topicTags?: string[];

  // Assets in /public/media/...
  coverImage?: string; // z.B. media/bonus/diaries/mia-entry1-512.webp
  audioSrc?: string;   // z.B. media/newspaper/audio/chatrules-chioma-dominik-01.mp3
  linkHref?: string;   // für “Online Blog” später (kann auch internal sein)

  // Artikeltext/PDF (datenarm in /public)
  bodyKind?: BonusBodyKind; // default: 'md'
  bodySrc?: string;         // Basis-Pfad OHNE Sprachsuffix & Extension
  // Beispiele:
  // - md:  "media/newspaper/articles/news-audio-chatrules"  -> + ".de.md"
  // - pdf: "media/newspaper/pdfs/news-audio-chatrules"      -> + ".de.pdf"

  released: boolean;
  unlockedBy?: BonusUnlockRef;
  /** Artikel ist ohne Story-Fortschritt für alle zugänglich */
  freeForAll?: boolean;

  // Sortierung innerhalb der Kategorie
  order: number;
}

export interface BonusCategoryMeta {
  id: BonusCategory;
  titleKey: string;     // Namespace 'bonus' wird im Page-Code genutzt
  subtitleKey?: string; // optional
  icon: string;         // emoji
  order: number;
}

export const BONUS_CATEGORIES: BonusCategoryMeta[] = [
  { id: 'characters', titleKey: 'categories.characters', icon: '👥', order: 1 },
  { id: 'diaries', titleKey: 'categories.diaries', icon: '📔', order: 2 },
  { id: 'newspaper', titleKey: 'categories.newspaper', icon: '📰', order: 3 },
  { id: 'audio', titleKey: 'categories.audio', icon: '🎧', order: 4 },
  { id: 'tips', titleKey: 'categories.tips', icon: '🧠', order: 5 },
];




/**
 * Map: wann wird welcher Character freigeschaltet?
 * - Keys = chapterId (z.B. s1e01c04)
 * - Values = characterIds aus CHARACTERS
 *
 * ⚠️ Hier nur IDs nutzen, die wirklich in CHARACTERS existieren.
 * Sobald du z.B. 'yasmin' in CHARACTERS ergänzt hast, kannst du sie hier aufnehmen.
 */


//_________________________________________________________
// SAMMELKARTEN HIER EINTRAGEN
//_________________________________________________________

const CHARACTER_UNLOCKS_BY_CHAPTER: Record<string, CharacterId[]> = {
  // s1e01: bonusLink für Yasmin feuert in c02 → c02 noch nicht abgeschlossen beim Feuern
  // → Marker-Fallback greift; nach Kapitelabschluss via completedChapters gesichert
  s1e01c02: ['yasmin'],  // bonusLink in c02 (Yasmin schreibt Freundebuch)
  s1e01c04: ['lukas'],   // bonusLink in c08 (Lukas schreibt Freundebuch)

  // s1e02
  s1e02c04: ['alvarez'], // bonusLink in c04 (Chioma: "Hier der Link, viel Spaß!")
  s1e02c06: ['chioma'],  // bonusLink in c06 (Chioma schreibt Freundebuch)
  s1e02c09: ['carlos'],  // bonusLink in c09 (Carlos schreibt Freundebuch)

  // s1e03
  s1e03c02: ['schubert'],
  s1e03c08: ['finn'],

  // s1e04
  s1e04c02: ['jonas'],  // bonusLink in c02 (Jonas schreibt Freundebuch)
  s1e04c06: ['amir'],
};

/**
 * Optional: fixe Reihenfolge der Karten im Album.
 * Alles nicht gesetzte wird alphabetisch stabil einsortiert (nach den gesetzten).
 */
const CHARACTER_ORDER: Partial<Record<CharacterId, number>> = {
  amy: 1,
  yasmin: 2,
  lukas: 3,
  alvarez: 4,
  chioma: 5,
  carlos: 6,
  schubert: 7,
  finn: 8,
  igor: 9,
  dominik: 10,
  lisa: 11,
  mia: 12,
  jonas: 13,
  aylin: 14,
  markus: 15,
  tom: 16,
  elsa: 17,
  amir: 18,
  farida: 19,
  emma: 20,
};

const ALL_CHARACTER_IDS: CharacterId[] = Object.keys(CHARACTERS) as CharacterId[];
const FALLBACK_SORTED_CHARACTER_IDS: CharacterId[] = [...ALL_CHARACTER_IDS].sort((a, b) =>
  a.localeCompare(b)
);

function buildCharacterUnlockRef(characterId: CharacterId): BonusUnlockRef | undefined {
  for (const [chapterId, ids] of Object.entries(CHARACTER_UNLOCKS_BY_CHAPTER)) {
    if (ids.includes(characterId)) return { type: 'chapter', id: chapterId };
  }
  return undefined;
}

function getCharacterOrder(characterId: CharacterId): number {
  const manual = CHARACTER_ORDER[characterId];
  if (typeof manual === 'number') return manual;

  const idx = FALLBACK_SORTED_CHARACTER_IDS.indexOf(characterId);
  // hinter den manuell gesetzten, stabil & deterministisch
  return 1000 + (idx >= 0 ? idx : 999);
}

/**
 * Charakterkarten automatisch generieren:
 * - released: true für alle (damit du ein echtes Sammelalbum siehst)
 * - unlockedBy: nur wenn gemappt => sonst bleibt es locked
 *
 * Locked funktioniert, weil isBonusUnlocked auf progress.seenChapterIds prüft.
 * Für "noch nicht gemappt" setzen wir unlockedBy auf ein unmögliches Kapitel,
 * damit sie NICHT frei werden.
 */
const NEVER_CHAPTER: BonusUnlockRef = { type: 'chapter', id: '__never__' };

const CHARACTER_CARDS: BonusItem[] = ALL_CHARACTER_IDS
  .map((characterId) => {
    const unlockRef = buildCharacterUnlockRef(characterId);

    return {
      bonusId: `char-${characterId}`,
      category: 'characters',
      mediaType: 'profile',
      characterId,
      released: true,
      unlockedBy: unlockRef ?? NEVER_CHAPTER,
      order: getCharacterOrder(characterId),
    } satisfies BonusItem;
  })
  .sort((a, b) => a.order - b.order);







/**
 * Nicht-Character Bonusitems manuell pflegen (Tagebuch, Zeitung, Tipps, Audio...).
 */



const OTHER_BONUS_ITEMS: BonusItem[] = [
  // --- s1e01c02: Mias Tagebuch Eintrag 1 ---


//_________________________________________________________
// AUDIO-BEITRÄGE HIER EINTRAGEN
//_________________________________________________________


  // --- s1e02c07: Schülerzeitung Audio-Beitrag + Carlos Tipp ---
  {
    bonusId: 'chatrules-chioma-dominik',
    category: 'newspaper',
    mediaType: 'audio',
    coverImage: 'media/newspaper/articles/chatrules-chioma-dominik/cover-512.webp',
    audioSrc: 'media/newspaper/articles/chatrules-chioma-dominik/audio.mp3',
    bodySrc: 'media/newspaper/articles/chatrules-chioma-dominik/article',
    bodyKind: 'md',
    released: true,
    unlockedBy: { type: 'chapter', id: 's1e02c07' },
    order: 40,
  },

    {
  bonusId: 'chioma-news-school-social-media',
  category: 'newspaper',
  released: true,
  order: 6,
  mediaType: 'audio',
  coverImage: 'media/newspaper/articles/chioma-news-school-social-media/cover-1024.webp',
  audioSrc: 'media/newspaper/articles/chioma-news-school-social-media/audio.mp3',
  bodySrc: 'media/newspaper/articles/chioma-news-school-social-media/article',
  bodyKind: 'md',
  unlockedBy: { type: 'chapter', id: 's1e01c01' },
},

//_________________________________________________________
// ARTIKEL HIER EINTRAGEN
//_________________________________________________________

  {
    bonusId: 'tip-amy-staunen',
    category: 'newspaper',
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/tip-amy-staunen/article',
    coverImage: 'media/newspaper/articles/tip-amy-staunen/cover-1024.webp',
    released: true,
    unlockedBy: { type: 'marker', id: 's1e01c03' },
    order: 50,
  },

    {
    bonusId: 'tip-carlos-geodaten',
    category: 'newspaper',
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/tip-carlos-geodaten/article',
    coverImage: 'media/newspaper/articles/tip-carlos-geodaten/cover-1024.webp',
    released: true,
    unlockedBy: { type: 'marker', id: 's1e01c06-tip-carlos-geodaten' },
    order: 51,
  },

      {
    bonusId: 'tip-aylin-kileitfaden',
    category: 'newspaper',
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/tip-aylin-kileitfaden/article',
    coverImage: 'media/newspaper/articles/tip-aylin-kileitfaden/cover-1024.webp',
    released: true,
    unlockedBy: { type: 'marker', id: 's1e01c08-tip-aylin-kileitfaden' },
    order: 52,
  },

  {
    bonusId: 'tip-carlos-audio-howto',
    category: 'newspaper',
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/tip-carlos-audio-howto/article',
    coverImage: 'media/newspaper/articles/tip-carlos-audio-howto/cover-512.webp',
    released: true,
    unlockedBy: { type: 'marker', id: 's1e02c07-tip-carlos-audio-howto' },
    order: 53,
  },


  {
    bonusId: 'tip-chioma-groupchats',
    category: 'newspaper',
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/tip-chioma-groupchats/article',
    coverImage: 'media/newspaper/articles/tip-chioma-groupchats/cover-512.webp',
    released: true,
    unlockedBy: { type: 'marker', id: 's1e02c10-tip-chioma-groupchats' },
    order: 54,
  },

  {
  bonusId: 'tip-aylin-ki-schule',
  category: 'newspaper',
  released: true,
  order: 5,
  mediaType: 'text',
  freeForAll: true,
  coverImage: 'media/newspaper/articles/chioma-news-school-ai/cover-1024.webp',
  bodySrc: 'media/newspaper/articles/chioma-news-school-ai/article',
  bodyKind: 'md',
},



  // --- Chioma Weekly #3: Schnell gemacht – aber ist es noch deins? ---
  {
    bonusId: 'chioma-news-schnell-gemacht',
    category: 'newspaper',
    released: true,
    order: 9,
    mediaType: 'audio',
    coverImage: 'media/newspaper/articles/chioma-news-schnell-gemacht/cover-1024.webp',
    audioSrc: 'media/newspaper/articles/chioma-news-schnell-gemacht/audio.mp3',
    bodySrc: 'media/newspaper/articles/chioma-news-schnell-gemacht/article',
    bodyKind: 'md',
    unlockedBy: { type: 'chapter', id: 's1e01c01' },
  },

  // --- Chioma Weekly #2: KI bei den Hausaufgaben ---
  {
    bonusId: 'chioma-news-ki-hausaufgaben',
    category: 'newspaper',
    released: true,
    order: 8,
    mediaType: 'audio',
    coverImage: 'media/newspaper/articles/chioma-news-ki-hausaufgaben/cover-1024.webp',
    audioSrc: 'media/newspaper/articles/chioma-news-ki-hausaufgaben/audio.mp3',
    bodySrc: 'media/newspaper/articles/chioma-news-ki-hausaufgaben/article',
    bodyKind: 'md',
    unlockedBy: { type: 'chapter', id: 's1e01c01' },
  },

  // --- Chioma Weekly #4: Du gegen dein Handy – Wer gewinnt? (Audio) ---
  {
    bonusId: 'chioma-news-david-goliath-audio',
    category: 'newspaper',
    released: true,
    order: 7,
    mediaType: 'audio',
    coverImage: 'media/newspaper/articles/chioma-news-david-goliath-audio/cover-1024.webp',
    audioSrc: 'media/newspaper/articles/chioma-news-david-goliath-audio/audio.mp3',
    bodySrc: 'media/newspaper/articles/chioma-news-david-goliath-audio/article',
    bodyKind: 'md',
    unlockedBy: { type: 'chapter', id: 's1e03c03' },
  },


  // --- s1e04c02: Amy Mini-Challenge – Raus aus der Vergleichs-Falle ---
  {
    bonusId: 'vergleichs-falle',
    category: 'newspaper',
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/vergleichs-falle/article',
    released: true,
    unlockedBy: { type: 'chapter', id: 's1e04c02' },
    order: 55,
  },

  // --- s1e04c09: Amy Challenge – Was steckt hinter dem ersten Eindruck? ---
  {
    bonusId: 'urteilen-ueber-andere',
    category: 'newspaper',
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/urteilen-ueber-andere/article',
    released: true,
    unlockedBy: { type: 'chapter', id: 's1e04c09' },
    order: 56,
  },

  // --- s1e03c07: Carlos – Die Tricks der Spiele ---
  {
    bonusId: 'tip-carlos-game-tricks',
    category: 'newspaper',
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/tip-carlos-game-tricks/article',
    coverImage: 'media/newspaper/articles/tip-carlos-game-tricks/cover-1024.webp',
    released: true,
    unlockedBy: { type: 'chapter', id: 's1e03c07' },
    order: 57,
  },

  // --- s1e03c10: Jonas interviewt Tom – Offline-Inseln ---
  {
    bonusId: 'article-jonas-tom-offline-inseln',
    category: 'newspaper',
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/article-jonas-tom-offline-inseln/article',
    coverImage: 'media/newspaper/articles/article-jonas-tom-offline-inseln/cover-1024.webp',
    released: true,
    unlockedBy: { type: 'chapter', id: 's1e03c10' },
    order: 58,
  },

  // --- s1e04c03: Chioma Weekly5 – Du denkst, du kennst jemanden? ---
  {
    bonusId: 'chioma-news-denkst-du-kennst-jemanden',
    category: 'newspaper',
    released: true,
    order: 10,
    mediaType: 'audio',
    audioSrc: 'media/newspaper/articles/chioma-news-denkst-du-kennst-jemanden/audio.mp3',
    bodySrc: 'media/newspaper/articles/chioma-news-denkst-du-kennst-jemanden/article',
    bodyKind: 'md',
    unlockedBy: { type: 'chapter', id: 's1e04c03' },
  },

  // --- s1e04c10: Jonas interviewt Amir ---
  {
    bonusId: 'article-jonas-amir-interview',
    category: 'newspaper',
    released: true,
    order: 59,
    mediaType: 'audio',
    audioSrc: 'media/newspaper/articles/article-jonas-amir-int/audio.mp3',
    bodySrc: 'media/newspaper/articles/article-jonas-amir-int/article',
    bodyKind: 'md',
    unlockedBy: { type: 'chapter', id: 's1e04c10' },
  },

//_________________________________________________________
// TAGEBUCH-EINTRÄGE HIER EINTRAGEN
//_________________________________________________________


// --- Tagebücher (Container) ---
// BONUS_INDEX Ausschnitt: nur Bücher
{
  bonusId: 'diary_yasmin',
  category: 'diaries',
  mediaType: 'text',
titleKey: 'diaries.books.yasmin.title',
descriptionKey: 'diaries.books.yasmin.desc',
  coverImage: 'media/story/characters/yasmin-512.webp',
  released: true,
  unlockedBy: { type: 'chapter', id: 's1e01c01' }, // erstes Auftauchen
  order: 60,
},
{
  bonusId: 'diary_mia',
  category: 'diaries',
  mediaType: 'text',
titleKey: 'diaries.books.mia.title',
descriptionKey: 'diaries.books.mia.desc',
  coverImage: 'media/story/characters/mia-512.webp',
  released: true,
  unlockedBy: { type: 'chapter', id: 's1e03c02' },
  order: 61,
},
{
  bonusId: 'diary_jonas',
  category: 'diaries',
  mediaType: 'text',
  titleKey: 'diaries.books.jonas.title',
descriptionKey: 'diaries.books.jonas.desc',
  coverImage: 'media/story/characters/jonas-512.webp',
  released: true,
  unlockedBy: { type: 'chapter', id: 's1e04c04' },
  order: 62,
},





];






export const BONUS_INDEX: BonusItem[] = [...CHARACTER_CARDS, ...OTHER_BONUS_ITEMS];





/**
 * Topic-Tags für Newspaper- & Bonus-Beiträge
 *
 * Jeder Beitrag bekommt **mindestens ein Topic**.
 * Die Topics helfen beim Filtern, Verstehen und Einordnen.
 */

 //['infoCheck'],
// 👉 Infos clever checken
// Alles rund um:
// - Fake News erkennen
// - Quellen prüfen
// - Wahrheit vs. Gerücht
// - Überschriften & Clickbait durchschauen
// - „Stimmt das wirklich?“

// ------------------------------------------------

// ['teamTalk'],
// 👉 Gemeinsam reden & handeln
// Alles rund um:
// - Klassen- & Gruppenchat-Regeln
// - Streit klären
// - Abstimmungen & Meinungen
// - Respektvoll schreiben
// - Zusammen Entscheidungen treffen

// ------------------------------------------------

// ['create'],
// 👉 Selbst kreativ werden
// Alles rund um:
// - Eigene Texte, Posts, Audios oder Videos erstellen
// - Schülerzeitung, Podcast, Umfragen
// - Ideen entwickeln & umsetzen
// - Kreativ mit Technik umgehen

// ------------------------------------------------

// ['safe'],
// 👉 Sicher im Netz
// Alles rund um:
// - Privatsphäre & persönliche Daten
// - Accounts & Passwörter
// - Fotos & Rechte
// - Was tun bei Stress, Druck oder Angst?
// - Hilfe holen & sich schützen

// ------------------------------------------------

// ['solve'],
// 👉 Schlau Lösungen finden
// Alles rund um:
// - Probleme im Netz lösen
// - Konflikte deeskalieren
// - Nachdenken statt sofort reagieren
// - Schritt-für-Schritt-Lösungen
// - „Was ist jetzt die beste Lösung?“

// ------------------------------------------------

// ['reflect'],
// 👉 Nachdenken & verstehen
// Alles rund um:
// - Eigene Gefühle & Gedanken
// - Wirkung von Medien auf mich
// - Warum handeln Menschen so?
// - Folgen von Entscheidungen
// - Selbstreflexion & Lernen aus Fehlern

// ------------------------------------------------

// ['fair'],
// 👉 Fair sein & Haltung zeigen
// Alles rund um:
// - Respekt & Werte
// - Gerechtigkeit
// - Mobbing & Ausgrenzung
// - Zivilcourage
// - Für andere einstehen

