// src/ai/index.ts
export { runAmy } from './orchestrator/runAmy';
export type { AmyRunInput, AmyRunOutput } from './orchestrator/types';

// optional: wenn du einzelne Bausteine extern brauchst
export { detectQuestionType } from './core/amyQuestionType';
export { detectContentFlags, isCriticalSafety, isNormViolation } from './core/contentFlags';
export type { ContentFlags } from './core/contentFlags';
