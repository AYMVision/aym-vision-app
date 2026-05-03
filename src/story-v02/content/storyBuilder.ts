// src/story-v02/content/storyBuilder.ts
//
// Builder-Helfer für Story-V02-Episoden.
// Ziel: kürzere, lesbarere Content-Dateien ohne Redundanz.
//
// Verwendung:
//   import { m, img, audio, typing, divider, amyTip, bonusLink,
//            privateChat, classChat, amyChat,
//            opt, optSegs, rc,
//            S, inp, IT, MIT, AF, GR, OR, AR, CH, C } from '../storyBuilder';

import type { Character, Message, Reaction, ReplyTo } from '../../common/types';
import type {
  StoryChapterV02,
  StoryStep,
  StoryMessageStep,
  InputStep,
  ItemStep,
  ItemOption,
  AmyFeedbackStep,
  ReflectionStep,
  ReflectionChoice,
  AmyReactionStep,
  ChallengeStep,
  ReflectionCategory,
} from '../types/storyTypes';
import type { IndicatorId, StoryDimensionId } from '../types/measurementTypes';
import type { ThemeId } from '../../competencies/themeMeta';

// ─── INTERNAL RAW TYPES ──────────────────────────────────────────────────────

type MsgExtra = {
  reactions?: Reaction[];
  replyTo?: ReplyTo;
  content?: string;
  forwarded?: {
    fromName?: string;
    fromChatLabel?: string;
  };
};

type Raw =
  | { _t: 'msg'; speaker: Character; content: string; ts: string; extra?: MsgExtra }
  | { _t: 'img'; speaker: Character; src: string; ts: string; extra?: MsgExtra }
  | { _t: 'sysimg'; src: string; ts?: string }
  | { _t: 'audio'; speaker: Character; src: string; ts: string; label?: string }
  | { _t: 'sysmsg'; content: string; ts: string }
  | { _t: 'typing'; content: string }
  | { _t: 'divider'; content: string }
  | { _t: 'amytip'; content: string }
  | { _t: 'bonus'; bonusId: string; content: string; linkTo: string; linkLabel?: string }
  | { _t: 'scene'; tone: 'private' | 'class'; names: string[]; title?: string };
 

// ─── MESSAGE FACTORIES ───────────────────────────────────────────────────────

/** Normale Chat-Nachricht (amy → type:'main', alle anderen → 'other') */
export const m = (speaker: Character, content: string, ts = '', extra?: MsgExtra): Raw =>
  ({ _t: 'msg', speaker, content, ts, extra });

/** Nachricht mit Bild (optionaler Text via extra.content) */
export const img = (speaker: Character, src: string, ts = '', extra?: MsgExtra): Raw =>
  ({ _t: 'img', speaker, src, ts, extra });

/** System-Bild ohne Speaker */
export const sysImg = (src: string, ts = ''): Raw =>
  ({ _t: 'sysimg', src, ts });

/** Sprachnachricht / Audio */
export const audio = (speaker: Character, src: string, ts: string, label?: string): Raw =>
  ({ _t: 'audio', speaker, src, ts, label });

/** Einfache System-Nachricht (z. B. "Lisa hinzugefügt.") */
export const sysMsg = (content: string, ts = ''): Raw => ({ _t: 'sysmsg', content, ts });

/** Tipp-Indikator im Chat */
export const typing = (content: string): Raw => ({ _t: 'typing', content });

/** Zeitlicher Abschnitt-Trenner */
export const divider = (content: string): Raw => ({ _t: 'divider', content });

/** Amy-Tipp-Karte (system) */
export const amyTip = (content: string): Raw => ({ _t: 'amytip', content });

/** Bonus-Link-Karte (Karte, Tagebuch, Artikel, …) */
export const bonusLink = (
  bonusId: string,
  content: string,
  linkTo: string,
  linkLabel = 'Öffnen →',
): Raw => ({ _t: 'bonus', bonusId, content, linkTo, linkLabel });

// ─── SCENE FACTORIES ─────────────────────────────────────────────────────────

/** Privat-Chat-Switch (z. B. privateChat('Du', 'Yasmin')) */
export const privateChat = (...names: string[]): Raw =>
  ({ _t: 'scene', tone: 'private', names });

/** Klassenchat-Switch */
export const classChat = (title = 'Klasse 7b'): Raw =>
  ({ _t: 'scene', tone: 'class', names: [], title });

/** Switch in den Amy-Chat (Du + Amy) */
export const amyChat = (): Raw => privateChat('Du', 'Amy');

// ─── MESSAGE COMPILER ────────────────────────────────────────────────────────

function compileMsg(stepId: string, i: number, raw: Raw): Message {
  const id = `${stepId}#${i}`;
  switch (raw._t) {
    case 'msg': {
      const msg: Message = {
        id,
        type: raw.speaker.id === 'amy' ? 'main' : 'other',
        speaker: raw.speaker,
        content: raw.content,
        timestamp: raw.ts,
      };
      if (raw.extra?.reactions) msg.reactions = raw.extra.reactions;
      if (raw.extra?.replyTo) msg.replyTo = raw.extra.replyTo;
      if (raw.extra?.forwarded) msg.forwarded = raw.extra.forwarded;
      return msg;
    }
    case 'img': {
      const msg: Message = {
        id,
        type: raw.speaker.id === 'amy' ? 'main' : 'other',
        speaker: raw.speaker,
        image: raw.src,
        content: raw.extra?.content ?? '',
        timestamp: raw.ts,
      };
      if (raw.extra?.reactions) msg.reactions = raw.extra.reactions;
      if (raw.extra?.replyTo) msg.replyTo = raw.extra.replyTo;
      if (raw.extra?.forwarded) msg.forwarded = raw.extra.forwarded;
      return msg;
    }
        case 'sysimg':
      return {
        id,
        type: 'system',
        image: raw.src,
        timestamp: raw.ts ?? '',
      };
    case 'audio':
      return {
        id,
        type: 'audio',
        speaker: raw.speaker,
        audioSrc: raw.src,
        audioLabel: raw.label ?? 'Sprachnachricht',
        timestamp: raw.ts,
      };
    case 'sysmsg':
      return { id, type: 'system', content: raw.content, timestamp: raw.ts };
    case 'typing':
      return { id, type: 'system', kind: 'typing-indicator', content: raw.content, timestamp: '' };
    case 'divider':
      return { id, type: 'system', kind: 'chapter-divider', content: raw.content, timestamp: '' };
    case 'amytip':
      return { id, type: 'system', kind: 'amy-tip', content: raw.content, timestamp: '' };
    case 'bonus':
      return {
        id,
        type: 'system',
        kind: 'bonus-link',
        content: raw.content,
        linkTo: raw.linkTo,
        linkLabel: raw.linkLabel,
        bonusId: raw.bonusId,
        timestamp: '',
      };
    case 'scene': {
      const tone = raw.tone;
      return {
        id,
        type: 'system',
        kind: 'chat-switch',
        scene: {
          tone,
          labelKey: tone === 'class' ? 'stories:chatSwitch.class' : 'stories:chatSwitch.private',
          title: raw.title ?? '',
          participants: raw.names.map(name => ({ name })),
        },
        timestamp: '',
      };
    }
  }
}

// ─── STEP FACTORIES ──────────────────────────────────────────────────────────

/** Story-Step: Nachrichten + optionale Topics */
export function S(
  id: string,
  rawMessages: Raw[],
  topics: ThemeId[] = [],
): StoryMessageStep {
  return {
    id,
    type: 'story',
    topicIds: topics,
    messages: rawMessages.map((raw, i) => compileMsg(id, i, raw)),
  };
}

/** Input-Step (open_text) */
export function inp(
  id: string,
  promptKey: string,
  opts: {
    required?: boolean;
    emptySubmitsAllowed?: boolean;
    placeholderKey?: string;
    maxLength?: number;
    topics?: ThemeId[];
    promptSpeakerId?: string;
  } = {},
): InputStep {
  return {
    id,
    type: 'input',
    promptKey,
    mode: 'open_text',
    required: opts.required ?? false,
    emptySubmitsAllowed: opts.emptySubmitsAllowed ?? true,
    placeholderKey: opts.placeholderKey ?? 'stories:common.replyPlaceholder',
    maxLength: opts.maxLength ?? 120,
    storeResponse: true,
    topicIds: opts.topics ?? [],
    showPromptBubble: false,
    promptSpeakerId: opts.promptSpeakerId,
  };
}

// ─── OPTION FACTORIES ────────────────────────────────────────────────────────

/** Einfache Option ohne Reaktion */
export const opt = (id: string, text: string, score: 0 | 1 | 2 | 3): ItemOption =>
  ({ id, text, score });

/** Option mit Segment-Reaktion (texte als rest-args) */
export function optSegs(
  id: string,
  text: string,
  score: 0 | 1 | 2 | 3,
  ...segments: string[]
): ItemOption {
  return {
    id,
    text,
    score,
    reaction: {
      kind: 'segments',
      segments: segments.map((s, i) => ({ id: `${id}${i + 1}`, text: s })),
    },
  };
}

// ─── ITEM STEP ───────────────────────────────────────────────────────────────

/** Standard-Item (Wirkungsmessung, genau 4 Optionen) */
export function IT(
  id: string,
  prompt: string,
  dimension: StoryDimensionId,
  indicatorId: IndicatorId,
  options: ItemOption[],
  topics: ThemeId[] = [],
): ItemStep {
  return { id, type: 'item', prompt, dimension, indicatorId, options, topicIds: topics };
}

/** Multi-Select-Item (unbewertete Mehrfachwahl) */
export function MIT(
  id: string,
  prompt: string,
  dimension: StoryDimensionId,
  indicatorId: IndicatorId,
  options: ItemOption[],
  opts: {
    minSelections?: number;
    maxSelections?: number;
    helperText?: string;
    topics?: ThemeId[];
  } = {},
): ItemStep {
  return {
    id,
    type: 'item',
    prompt,
    dimension,
    indicatorId,
    options,
    selectionMode: 'multiple',
    minSelections: opts.minSelections,
    maxSelections: opts.maxSelections,
    helperText: opts.helperText,
    topicIds: opts.topics ?? [],
  };
}

/** Amy-Feedback-Step */
export const AF = (id: string, sourceStepId: string): AmyFeedbackStep =>
  ({ id, type: 'amy_feedback', sourceStepId });

// ─── REFLECTION ──────────────────────────────────────────────────────────────

/** Reflection-Choice mit optionaler Segment-Reaktion */
export function rc(id: string, text: string, ...segments: string[]): ReflectionChoice {
  if (segments.length === 0) return { id, text };
  return {
    id,
    text,
    reaction: {
      kind: 'segments',
      segments: segments.map((s, i) => ({ id: `${id}${i + 1}`, text: s })),
    },
  };
}

/** Geführte Reflexion (guided_choice) */
export function GR(
  id: string,
  prompt: string,
  choices: ReflectionChoice[],
  opts: { category?: ReflectionCategory; topics?: ThemeId[] } = {},
): ReflectionStep {
  return {
    id,
    type: 'reflection',
    prompt,
    reflectionKind: 'guided_choice',
    reflectionCategory: opts.category ?? 'ACTION',
    choices,
    storeResponse: true,
    topicIds: opts.topics ?? [],
  };
}

/** Offene Reflexion (open_text) */
export function OR(
  id: string,
  prompt: string,
  opts: {
    category?: ReflectionCategory;
    placeholderKey?: string;
    maxLength?: number;
    topics?: ThemeId[];
    /**
     * KI-Bewertung überspringen — für Perspektiv- und Kreativfragen,
     * bei denen jede ehrliche Antwort gültig ist.
     * Immer zusammen mit fixedAmyReply verwenden, damit der AR-Step etwas anzeigt.
     */
    bypassAi?: boolean;
    /** Fixer Amy-Text für den AR-Step wenn bypassAi: true */
    fixedAmyReply?: string;
    /** Amy-Antwort bei trivialem Input (z.B. "nichts", "k.a.") — sanfter Nudge. Nur wirksam wenn bypassAi: true */
    fixedAmyReplyVague?: string;
  } = {},
): ReflectionStep {
  return {
    id,
    type: 'reflection',
    prompt,
    reflectionKind: 'open_text',
    reflectionCategory: opts.category ?? 'ACTION',
    placeholderKey: opts.placeholderKey ?? 'stories:common.replyPlaceholder',
    maxLength: opts.maxLength ?? 280,
    storeResponse: true,
    topicIds: opts.topics ?? [],
    bypassAi: opts.bypassAi,
    fixedAmyReply: opts.fixedAmyReply,
    fixedAmyReplyVague: opts.fixedAmyReplyVague,
  };
}

/** Amy-Reaktions-Step */
export const AR = (id: string, sourceStepId: string): AmyReactionStep =>
  ({ id, type: 'amy_reaction', sourceStepId });

/** Challenge-Step */
export const CH = (id: string, prompt: string): ChallengeStep =>
  ({ id, type: 'challenge', prompt, storeSeen: true });

// ─── CHAPTER ─────────────────────────────────────────────────────────────────

/** Chapter-Builder */
export function C(
  id: string,
  idx: number,
  title: string,
  subtitle: string,
  steps: StoryStep[],
  opts: { isEpilogue?: boolean } = {},
): StoryChapterV02 {
  return { id, chapterIndex0: idx, chapterTitle: title, chapterSubtitle: subtitle, steps, ...opts };
}
