// src/common/types.ts
// Single Source of Truth: Content-Types für Stories + UI-Rendering
// ✅ contentIndex + courseLoader + ChatMessage kompatibel
// ✅ keine src/assets imports im Content
// ✅ media Pfade sind relativ (public/...), deployment-sicher via assetUrl(...)

export type SeasonId = string;  // z.B. "s1"
export type EpisodeId = string; // z.B. "s1e01"
export type CourseId = string;  // z.B. "s1e01"

// -----------------------------
// UI Theme (optional pro Character)
// -----------------------------
export type BubbleTheme = {
  bg: string;     // z.B. "bg-rose-50"
  border: string; // z.B. "border-rose-200"
  text: string;   // z.B. "text-rose-900"
};

// -----------------------------
// Content: Characters
// -----------------------------
/**
 * Character.avatar:
 * - empfohlen: avatarId (z.B. "amy", "yasmin")
 * - optional: direkter Pfad/URL ("/media/..", "https://..", "data:..")
 *
 * WICHTIG: wenn es kein URL/Pfad ist, wird es als avatarId behandelt
 * und in der UI auf public/media/story/characters/<id>-<size>.<ext> aufgelöst.
 */
export type Character = {
  id: string;       // stabiler Key (z.B. "amy")
  name: string;     // Anzeige-Name (z.B. "Amy")
  avatar?: string;  // avatarId ODER direkter Pfad/URL
  mainTheme?: BubbleTheme; // optional: Theme für main-bubbles dieses Characters
};

// -----------------------------
// Reactions / Replies
// -----------------------------
export type Reaction = {
  emoji: string;    // z.B. "❤️"
  type?: string;    // optional: "like" | "laugh" | ...
};

export type ReplyTo = {
  text: string;
  speakerName?: string;
};

// -----------------------------
// Messages
// -----------------------------
export type MessageType = 'main' | 'user' | 'other' | 'audio' | 'system';

export type MessageKind =
  | 'amy-question'
  | 'amy-tip'
  | 'safety-self-harm'
  | 'chat-switch'
  | 'bonus-link'
  | 'diary-unlock'
  | 'article-unlock';

// -----------------------------
// Chat-Gruppen / Szenen
// -----------------------------
export type ChatTone = 'private' | 'class' | 'newsroom';

export type ChatScene = {
  tone: ChatTone;
  labelKey: string; // i18n-Key (z.B. "stories:chatSwitch.class")

  // ✅ Anzeige im Header / Switch-Karte:
  // - class: z.B. "Klasse 7b"
  // - private/newsroom: optional leer (dann fallback participants)
  title?: string;

  // ✅ nur für private/newsroom sinnvoll
  participants?: Array<{ name: string }>;
};


// -----------------------------
// Message
// -----------------------------
export type Message = {
  /**
   * Optional, damit alte Scripts nicht rot sind.
   * Empfehlung: für neue Stories immer setzen (stabile Keys, Tracking, Replay).
   */
  id?: string;

  type: MessageType;

  /**
   * Optionaler Spezialtyp:
   * - 'safety-self-harm' => Safety-Card Rendering
   * - 'chat-switch'     => Systemkarte + Szene-Wechsel
   */
  kind?: MessageKind;

  /** Optionaler Szenen-Kontext (z.B. bei chat-switch) */
  scene?: ChatScene;

  /**
   * Bei 'user' und 'system' oft leer.
   * Bei 'main' / 'other' empfohlen.
   */
  speaker?: Character;

  /** Textinhalt */
  content?: string;

  /**
   * Bildpfad/URL:
   * - empfohlen: "media/..." (public/)
   * - optional: bereits via assetUrl(...) aufgelöst
   */
  image?: string;
  linkTo?: string;        // z.B. "/newspaper/chatrules-chioma-dominik"
  linkLabelKey?: string;  // optional i18n
  linkLabel?: string;     // fallback text

  /** z.B. "19:36" (wird in ChatMessage angezeigt) */
  timestamp?: string;

  /** Immer strukturiert, niemals string[] */
  reactions?: Reaction[];

  replyTo?: ReplyTo;
    // ✅ neu (für diary/article unlock)
  bonusId?: string;   // generischer Bonus-Key (z.B. "diary-yasmin-01" oder "article-chatrules-chioma")
    /** ✅ Audio (Sprachnachricht) */
  audioSrc?: string;         // "media/story/episodes/s1e01/xxx.mp3"
  audioDurationSec?: number; // optional (falls du sie kennst)
  audioLabel?: string;       // z.B. "Sprachnachricht"

  /** ✅ WhatsApp-style "Weitergeleitet" */
  forwarded?: {
    fromName?: string;     // "Carlos"
    fromChatLabel?: string; // z.B. "Klassenchat 7b" / "Privat"
  };

  /** ✅ Reply / Quote existiert schon bei dir:
   * replyTo?: { text: string; speakerName?: string }
   * Das lassen wir und rendern es WhatsApp-artig.
   */


};

// -----------------------------
// Stories / Courses
// -----------------------------
export type CourseChapter = {
  /**
   * Chapter Nummer wie du es bereits nutzt.
   * (Du kannst 1..N machen; intern nutzt du in Story.tsx chapterIndex0 separat.)
   */
  chapter: number;
  messages: Message[];
};

export type Course = {
  /** muss == contentIndex.courseId sein (z.B. "s1e01") */
  id: CourseId;

  /** Anzeige-Titel (visuell) */
  title: string;

  /** Coverbild: "media/story/episodes/s1e01/s1e01-512.webp" */
  image: string;

  description: string;

  script: CourseChapter[];
   // ✅ NEU: Wird am Ende der Episode automatisch abgespielt (Cliffhanger / Outro)
  epilogue?: Message[];
};

export type StoryTranscriptSnapshot = {
  displayedMessages: Message[];
  chapter: number;
  currentMessageIndex: number;
  phase?: 'playing' | 'awaiting_answer' | 'resolving' | 'unlocked' | 'finished';
  attemptByQuestion: Record<string, number>;
  updatedAt: number;
};

