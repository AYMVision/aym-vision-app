// src/bonus/bonusIndex.ts
// Single Source of Truth für Bonuswelt (staffel-/episodenunabhängig erweiterbar).
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
  // s1e01c01: (aus deiner Liste: Yasmin Lisa Mia Finn Dominik Elsa Igor Markus Chioma)
  // Aktuell existieren in CHARACTERS davon: mia, finn, dominik, chioma
  s1e01c01: [],
  s1e01c02: ['amy'],
  s1e01c03: [],
  s1e01c04: [],
  s1e01c05: ['lukas'],
  s1e01c06: [],
  s1e01c07: ['yasmin'],
  s1e01c08: [],

  s2e01c01: ['dominik'],
  s2e01c02: [],
  s2e01c03: [],
  s2e01c04: ['alvarez'],
  s2e01c05: ['chioma'],
  s2e01c06: [],
  s2e01c07: [],
  s2e01c08: [],
  s2e01c09: ['carlos'],
  s2e01c10: [],
};

/**
 * Optional: fixe Reihenfolge der Karten im Album.
 * Alles nicht gesetzte wird alphabetisch stabil einsortiert (nach den gesetzten).
 */
const CHARACTER_ORDER: Partial<Record<CharacterId, number>> = {
  amy: 1,
  lukas: 2,
  yasmin: 3,
  dominik: 4,
  alvarez: 5,
  chioma: 6,
  carlos: 7,
  igor: 8,
  lisa: 9,
  finn: 10,
  mia: 11,
  jonas: 12,
  aylin: 13,
  markus: 14,
  tom: 15,
  elsa: 16,
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
    topicTags: ['teamTalk', 'safe'],
    mediaType: 'audio',
    coverImage: 'media/newspaper/chatrules-512.webp',
    audioSrc: 'media/newspaper/audio/chatrules-chioma-dominik.mp3',
  bodySrc: 'media/newspaper/chatrules-chioma-dominik',
  bodyKind: 'md',
  titleKey: 'chatrules-chioma-dominik.title',
  descriptionKey: 'chatrules-chioma-dominik.description',
    released: true,
    unlockedBy: { type: 'chapter', id: 's1e02c07' },
    order: 40,
  },

//_________________________________________________________
// ARTIKEL HIER EINTRAGEN
//_________________________________________________________

  {
    bonusId: 'tip-amy-staunen',
    category: 'newspaper',
    topicTags: ['reflect'],
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/tip-amy-staunen',
    coverImage: 'media/bonus/newspaper/tip-amy-staunen.webp',
    released: true,
    unlockedBy: { type: 'marker', id: 's1e01c03' },
    order: 50,
  },

    {
    bonusId: 'tip-carlos-geodaten',
    category: 'newspaper',
    topicTags: ['reflect'],
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/tip-carlos-geodaten',
    coverImage: 'media/bonus/newspaper/tip-carlos-geodaten.webp',
    released: true,
    // unlockedBy: { type: 'marker', id: 's1e01c06-tip-carlos-geodaten' },
        unlockedBy: undefined,
    order: 51,
  },

      {
    bonusId: 'tip-aylin-kileitfaden',
    category: 'newspaper',
    topicTags: ['create', 'solve'],
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/tip-aylin-kileitfaden',
    coverImage: 'media/bonus/newspaper/tip-aylin-kileitfaden.webp',
    released: true,
    unlockedBy: { type: 'marker', id: 's1e01c08-tip-aylin-kileitfaden' },
    order: 52,
  },

  {
    bonusId: 'tip-carlos-audio-howto',
    category: 'newspaper',
    topicTags: ['create', 'teamTalk'],
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/tip-carlos-audio',
    coverImage: 'media/bonus/newspaper/tip-carlos-audio.webp',
    released: true,
    unlockedBy: { type: 'marker', id: 's1e02c07-tip-carlos-audio-howto' },
    order: 53,
  },


  {
    bonusId: 'tip-chioma-groupchats',
    category: 'newspaper',
    topicTags: ['teamTalk', 'safe', 'fair'],
    mediaType: 'text',
    bodyKind: 'md',
    bodySrc: 'media/newspaper/articles/news-audio-chatrules',
    coverImage: 'media/bonus/newspaper/news-audio-chatrules.webp',
    released: true,
    unlockedBy: { type: 'marker', id: 's1e02c10-tip-chioma-groupchats' },
    order: 54,
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
  coverImage: 'media/bonus/diaries/yasmin-book-512.webp',
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
  coverImage: 'media/bonus/diaries/mia-book-512.webp',
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
  coverImage: 'media/bonus/diaries/jonas-book-512.webp',
  released: true,
  unlockedBy: { type: 'chapter', id: 's1e??c??' }, // wenn du weißt, wann es starten soll
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

