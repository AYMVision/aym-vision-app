// src/story-v02/runtime/storyScoreAggregator.ts

import { loadItemResponses } from './storyResponseStore';
import type { StoryDimensionId } from '../types/measurementTypes';

export type DimensionLevel = 'growing' | 'visible' | 'frequent';

export type DimensionScore = {
  dimension: StoryDimensionId;
  count: number;
  avgScore: number;
  level: DimensionLevel;
};

function scoreToLevel(avg: number): DimensionLevel {
  if (avg >= 2.5) return 'frequent';
  if (avg >= 1.5) return 'visible';
  return 'growing';
}

export function aggregateDimensionScores(): DimensionScore[] {
  const responses = loadItemResponses();

  const byDimension: Partial<Record<StoryDimensionId, { total: number; count: number }>> = {};

  for (const r of responses) {
    const dim = r.dimension;
    if (!byDimension[dim]) {
      byDimension[dim] = { total: 0, count: 0 };
    }
    byDimension[dim]!.total += r.score;
    byDimension[dim]!.count += 1;
  }

  return (Object.entries(byDimension) as [StoryDimensionId, { total: number; count: number }][])
    .map(([dimension, { total, count }]) => {
      const avgScore = total / count;
      return {
        dimension,
        count,
        avgScore,
        level: scoreToLevel(avgScore),
      };
    })
    .sort((a, b) => b.avgScore - a.avgScore);
}

export function totalItemResponseCount(): number {
  return loadItemResponses().length;
}
