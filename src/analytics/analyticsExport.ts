// src/analytics/analyticsExport.ts
// Export via Web Share API (Mobile) oder JSON-Download (Desktop).

import { loadStore } from './analyticsStore';
import type { StepDecision } from './schema';

export interface ProfileSnapshot {
  chaptersCompleted: string[];
  currentEpisodeId?: string;
  themePoints: Record<string, number>;
}

export interface ExportPayload {
  schemaVersion: 1;
  exportedAt: string;
  meta: ReturnType<typeof loadStore>['meta'];
  profileSnapshot: ProfileSnapshot;
  decisions: StepDecision[];
  aggregations: {
    totalDecisions: number;
    scoreDistribution: Record<string, number>;
    episodesPlayed: string[];
    chaptersCompleted: number;
  };
}

export function buildExportPayload(snapshot: ProfileSnapshot): ExportPayload {
  const store = loadStore();

  const scoreDistribution: Record<string, number> = {};
  for (const d of store.decisions) {
    const s = d.score ?? 'unknown';
    scoreDistribution[s] = (scoreDistribution[s] ?? 0) + 1;
  }

  const episodesPlayed = [...new Set(store.decisions.map((d) => d.episodeId))].filter(
    (e) => e !== 'unknown'
  );

  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    meta: { ...store.meta },
    profileSnapshot: snapshot,
    decisions: store.decisions,
    aggregations: {
      totalDecisions: store.decisions.length,
      scoreDistribution,
      episodesPlayed,
      chaptersCompleted: snapshot.chaptersCompleted.length,
    },
  };
}

export async function shareOrDownloadAnalytics(
  snapshot: ProfileSnapshot
): Promise<'shared' | 'downloaded' | 'cancelled' | 'error'> {
  try {
    const payload = buildExportPayload(snapshot);
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const filename = `aym-daten-${payload.meta.pseudoId.slice(0, 8)}-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    // Mobile: Web Share API mit Datei
    if (typeof navigator !== 'undefined' && typeof (navigator as any).canShare === 'function') {
      const file = new File([blob], filename, { type: 'application/json' });
      if ((navigator as any).canShare({ files: [file] })) {
        try {
          await (navigator as any).share({
            title: 'AYM Vision – Nutzungsdaten',
            text: 'Anonyme Nutzungsdaten zur Qualitätssicherung von AYM Vision.',
            files: [file],
          });
          return 'shared';
        } catch (e: any) {
          // AbortError = User hat abgebrochen — kein Fehler
          if (e?.name === 'AbortError') return 'cancelled';
          // Anderer Fehler → Fallback Download
        }
      }
    }

    // Desktop / Fallback: direkter Download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return 'downloaded';
  } catch {
    return 'error';
  }
}
