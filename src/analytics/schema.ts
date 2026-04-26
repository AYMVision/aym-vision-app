// src/analytics/schema.ts
// Pilot-Phase: lokale Datenerfassung ohne Server.
// schemaVersion ermöglicht spätere Migration.

export const ANALYTICS_SCHEMA_VERSION = 1 as const;
export const ANALYTICS_STORE_KEY = 'aym_analytics_v1';
export const ANALYTICS_CONSENT_KEY = 'aym_analytics_consent_v1';
export const ANALYTICS_MAX_DECISIONS = 500;

export type DecisionScore = 'A' | 'B' | 'C' | 'UNSICHER' | 'bypass' | 'trivial';

export interface StepDecision {
  stepId: string;
  episodeId: string;       // abgeleitet aus stepId, z.B. 's1e02'
  type: 'open_text' | 'guided_choice';
  score?: DecisionScore;
  choiceId?: string;       // nur bei guided_choice
  topicIds?: string[];     // Themen-Tags des Steps
  attemptCount: number;
  date: string;            // YYYY-MM-DD — kein präziser Zeitstempel
  // KEIN freitext, KEIN name, KEIN persönlicher Inhalt
}

export interface AnalyticsMeta {
  pseudoId: string;        // zufällige ID, kein Bezug zu echten Daten
  appVersion: string;
  lang: string;
  firstSeen: string;       // YYYY-MM-DD
  lastSeen: string;
}

export interface AnalyticsStore {
  schemaVersion: typeof ANALYTICS_SCHEMA_VERSION;
  meta: AnalyticsMeta;
  decisions: StepDecision[];
}

export type ConsentStatus = 'granted' | 'denied' | 'unknown';
