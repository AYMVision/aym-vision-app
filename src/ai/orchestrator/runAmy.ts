// src/ai/orchestrator/runAmy.ts
// Ziel-Spezifikation v2: Analyse -> Flags -> Decision -> Reply (oder stumm bei SILENT_LOCK)
//
// Architektur:
// 1) Input normalisieren (Answer + Question + Tip)
// 2) Safety/Norm Flags (harte Gates)
// 3) Klassifikation A/B/C/UNSICHER (AmyAI)
// 4) Decision (Single Source of Truth): decideAmyFlowV2
// 5) Regelbasierte i18n-Antwort als stabile Basis: buildAmyReplyV2
// 6) Selector Layer (deterministisch, später KI-gestützt möglich):
//    - Mirror (A/B + UNLOCK) aus phr.mirrorBankByType (kein User-Text)
//    - Clarify (UNSICHER + RETRY) aus phr.clarifyBankByType
// 7) Output ist stabil + kindersicher + offline möglich

import { registerMlFailure, isMlDisabledForSession } from '../llm/mlSessionGuard';

import { AmyAI } from '../core/amyAI';
import { detectQuestionType } from '../core/amyQuestionType';
import { getAnswerQuestionRelation } from '../core/answerRelation';
import { extractKeyIdea } from '../core/extractKeyIdea';
import { detectContentFlags, isCriticalSafety, isNormViolation } from '../core/contentFlags';

import type { AmyRunInput, AmyRunOutput } from './types';
import { buildAmyReplyV2 } from '../reply/amyReplyV2';
import type { TipRelationV2 } from '../reply/tipRelationMap';

import { getSettingsSync } from '../../settings/appSettings';
import { canUseXenovaAuto } from '../llm/canUseXenova';

import { decideAmyFlowV2 } from '../core/amyDecision';
import type { AmyLabel } from '../core/amyAI';
import type { AmyQuestionType } from '../core/amyQuestionType';

import { detectUnsicherReason } from '../core/detectUnsicherReason';
import type { UnsicherReason } from '../core/detectUnsicherReason';

import { microTaskFromQuestion } from '../core/microTaskFromQuestion';

import i18n from '../../i18n';
import { getAmyPhrases } from '../lang/getAmyPhrases';

import { selectMirrorLine, selectClarifyLine } from '../reply/selectors';

// --------------------
// Singleton (klassifiziert nur A/B/C/UNSICHER; keine Texte!)
// --------------------
const amyAI = new AmyAI();

// --------------------
// Helpers: Input normalisieren
// --------------------
function safeTrim(s: unknown) {
  return String(s ?? '').trim();
}

function clampAttempt(n: unknown) {
  const x = Number(n ?? 0);
  return Number.isFinite(x) ? Math.max(0, Math.floor(x)) : 0;
}

// --------------------
// Main
// --------------------
export async function runAmy(input: AmyRunInput): Promise<AmyRunOutput> {
  // (0) Input normalisieren
  const userAnswer = safeTrim(input.userAnswer);
  const questionText = safeTrim(input.questionText);
  // tipText: Fallback auf questionText damit extractKeyIdea etwas zu verarbeiten hat
  const tipText = safeTrim(input.tipText) || questionText;
  const attemptCount = clampAttempt(input.attemptCount);

  // (0b) Sprache setzen (damit i18n / Phrases stimmen)
  const lang: 'de' | 'en' =
    String(input.language ?? 'de').toLowerCase().startsWith('en') ? 'en' : 'de';

  if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }

  // (1) Safety + Norm Flags aus UserAnswer
  const contentFlags = detectContentFlags(userAnswer);
  const mlDisabled = isMlDisabledForSession();
  const critical = isCriticalSafety(contentFlags);
  const norm = isNormViolation(contentFlags);

  // (2) Globales Local-ML Gate (entscheidet nur: dürfen wir ML versuchen?)
  const settings = getSettingsSync();
  const owlSetting = settings.owlMode;

  const wantsLocalMl =
    owlSetting === 'on'
      ? true
      : owlSetting === 'auto'
        ? canUseXenovaAuto()
        : false;

  const mlAllowed = wantsLocalMl && !mlDisabled && !critical && !norm;

  // (3) QuestionType: hint vom Step bevorzugt, sonst auto-detect
  const questionType = input.questionTypeHint ?? detectQuestionType({ questionText, tipText });

  // (4) Relation Answer ↔ Question (Tone Anchor für Bridge: aligned/generic/off-topic)
  const tipRelation: TipRelationV2 = getAnswerQuestionRelation(userAnswer, questionText);

  // (5) Label A/B/C/UNSICHER
  let label: AmyLabel = 'C';
  let confidence = 0.6;

  if (input.reflectionMode) {
    // Engagement-Gate für OR-Schritte: prüft Engagement, nicht Korrektheit.
    // Safety läuft immer davor (Schritt 1). bypassAi-Steps erreichen diesen Pfad nie.
    const wc = userAnswer.trim().split(/\s+/).filter(Boolean).length;
    if (wc < 3) {
      label = 'C'; // zu kurz → einmal Nudge
    } else {
      const hasReason = /weil|deshalb|wegen|dadurch|because|therefore/i.test(userAnswer);
      label = hasReason ? 'A' : 'B'; // ≥3 Wörter → pass
    }
    confidence = label === 'A' ? 0.85 : label === 'B' ? 0.75 : 0.6;
  } else {
  try {
    label = await amyAI.classifyAnswer(userAnswer, {
      questionType,
      reflectionMode: false,
    });
    confidence =
      label === 'A' ? 0.85 :
      label === 'B' ? 0.75 :
      label === 'UNSICHER' ? 0.75 :
      0.85;
  } catch {
    label = 'UNSICHER';
    confidence = 0.55;
  }
  } // end !reflectionMode

  // (5b) UNSICHER Reason (für Clarify-Auswahl)
  const unsicherReason: UnsicherReason | null =
    label === 'UNSICHER'
      ? detectUnsicherReason({ userAnswer, questionText, lang })
      : null;

  // (6) Decision (Single Source of Truth)
  const decision = decideAmyFlowV2({
    label,
    attemptCount,
    questionType,
    flags: contentFlags,
  });

  // i18n phrases einmal laden (inkl. Banks)
  const phr: any = getAmyPhrases(lang);

  // Debug Notes (nur lokal)
  const debugNotes: string[] = [];
  debugNotes.push(`owlMode=${owlSetting}`);
  debugNotes.push(`wantsLocalMl=${String(wantsLocalMl)}`);
  debugNotes.push(`mlAllowed=${String(mlAllowed)}`);
  debugNotes.push(`label=${label}`);
  debugNotes.push(`action=${decision.action}`);
  debugNotes.push(`qt=${questionType}`);
  debugNotes.push(`unsicherReason=${unsicherReason}`);
  debugNotes.push(`mlDisabled=${String(mlDisabled)}`);
  debugNotes.push(`critical=${String(critical)}`);
  debugNotes.push(`norm=${String(norm)}`);
  debugNotes.push(`questionTextHead=${questionText.slice(0,80)}`);
debugNotes.push(`tipTextHead=${tipText.slice(0,80)}`);

  // (7) KeyIdea aus TipText (optional ML; muss robust sein)
  const useMLKeyIdea = (input.useMLKeyIdea ?? true) && mlAllowed;
  let keyIdea = '';

  try {
    keyIdea = await extractKeyIdea(tipText, { useML: useMLKeyIdea });
  } catch (e: any) {
    const msg = String(e?.message ?? e);
    if (msg.includes('pipeline') || msg.includes('model')) registerMlFailure(msg);
    else console.warn('[ML] soft failure (ignored):', msg);
  }

  // (8) SILENT_LOCK: absichtlich keine volle Amy-Antwort mehr
  if (decision.action === 'SILENT_LOCK') {
    const hint =
      phr?.adultHint?.[0] ??
      phr?.adultGate?.[0] ??
      'Hol bitte kurz einen Erwachsenen dazu.';

    return {
      label,
      confidence,
      action: decision.action,
      mustReAnswer: decision.mustReAnswer,
      amyReplyText: hint,
      miniTipType: decision.miniTipType,
      offlineHint: true,
      contentFlags,
      unsicherReason,
      tipRelation,
      questionType,
      debug: { source: 'runAmy', notes: debugNotes },
    };
  }

  // (9) MicroTask aus der Originalfrage (regelbasiert)
  const microFromQuestion = microTaskFromQuestion(
    { lang, questionText, questionType },
    i18n.t.bind(i18n)
  );

  // (10) Mirror (nur aus Bank, kein User-Text!)
  const mirror =
    decision.action === 'UNLOCK' && (label === 'A' || label === 'B')
      ? selectMirrorLine({
          lang,
          qt: questionType,
          seed: `${label}|${questionType}|${tipRelation}|${attemptCount}`,
          mirrorBankByType: phr?.mirrorBankByType ?? {},
        })
      : '';

  debugNotes.push(`mirrorLen=${mirror.length}`);
  debugNotes.push(`mirrorHead=${mirror ? mirror.slice(0, 60) : ''}`);

  // (11) Clarify (nur bei UNSICHER + RETRY)
  const clarify =
    decision.action === 'RETRY' && label === 'UNSICHER'
      ? selectClarifyLine({
          lang,
          qt: questionType,
          seed: `${label}|${questionType}|${unsicherReason}|${attemptCount}`,
          clarifyBankByType: phr?.clarifyBankByType ?? {},
        })
      : '';

  debugNotes.push(`clarifyLen=${clarify.length}`);
  debugNotes.push(`clarifyHead=${clarify ? clarify.slice(0, 60) : ''}`);

  // (12) Build Reply (Clarify ersetzt Rephrase komplett)
  const amyReplyText = buildAmyReplyV2({
    lang,
    decision,
    userAnswer,
    tipRelation,
    keyIdea,
    questionText,
    contentFlags,

    rewrite: mirror ? { mirror } : undefined,

    microTaskOverride:
      clarify ||
      (decision.action === 'RETRY' || decision.mode === 'norm-stop'
        ? microFromQuestion
        : undefined),

    t: i18n.t.bind(i18n),
  });

  // (13) Final Output
  return {
    label,
    confidence,
    action: decision.action,
    mustReAnswer: decision.mustReAnswer,
    amyReplyText,

    miniTipType: decision.miniTipType,
    offlineHint: decision.offlineHint,

    contentFlags,
    unsicherReason,
    tipRelation,
    questionType,

    debug: { source: 'runAmy', notes: debugNotes },
  };
}