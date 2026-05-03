// src/ai/orchestrator/types.ts
// Ziel-Spezifikation v2: Endgültige öffentliche Typen für Amy (PWA/offline).

import type { AmyQuestionType } from '../core/amyQuestionType';
import type { AmyLabel } from '../core/amyAI';
import type { ContentFlags } from '../core/contentFlags';
import type { MiniTipType, AmyAction } from '../core/amyDecision';
import type { UnsicherReason } from '../core/detectUnsicherReason';




export type AmyRunInput = {
  userAnswer: string;
  questionText: string;
  tipText: string;
  episodeId?: string | number;
  chapterIndex?: number;

  language: string; // 'de' | 'en' ...
  attemptCount: number; // 0-basiert: bisherige Submits vor diesem Run

  // optional knobs
  timeSpentReading?: number;

  // feature flags
  useMLKeyIdea?: boolean;

  /**
   * Reflection mode: skips ACTION/FEELING keyword gates in AmyAI.
   * Use when calling runAmy for open reflection questions — prevents false
   * negatives caused by domain-specific keyword lists designed for item scoring.
   */
  reflectionMode?: boolean;
};

export type AmyDebugInfo = {
  source: 'runAmy';
  notes: string[];
};

export type AmyRunOutput = {
  label: AmyLabel;
  confidence: number;
  action: AmyAction;
  mustReAnswer: boolean;
  amyReplyText: string;

  // optional UI signals
  miniTipType: MiniTipType;
  offlineHint: boolean;

  contentFlags: ContentFlags;
  unsicherReason?: UnsicherReason | null;

  tipRelation?: 'aligned' | 'generic' | 'off-topic';
  questionType: AmyQuestionType;
  

  debug?: AmyDebugInfo;
};

