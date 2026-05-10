// src/lexikon/lexikonTypes.ts

export interface LexikonEntry {
  /** Unique identifier, used in [[termId]] markers */
  id: string;
  /** Display title */
  title: string;
  /** Short teaser shown in search results / list */
  teaser: string;
  /** Full explanation — Carlos explains it "für die Lehrerin" (clear but not patronizing) */
  body: string;
  /** Optional fun fact or related note */
  didYouKnow?: string;
  /** chapterId after which this entry becomes visible, e.g. 's1e03c03' */
  firstAppearance?: string;
}
