// src/story-v02/types/dimensionMeta.ts

import type { StoryDimensionId } from './measurementTypes';

export type DimensionMeta = {
  id: StoryDimensionId;
  labelKey: string;
  descriptionKey: string;
};

export const DIMENSION_META: Record<StoryDimensionId, DimensionMeta> = {
  perspective: {
    id: 'perspective',
    labelKey: 'stories:measurement.dimensions.perspective.label',
    descriptionKey: 'stories:measurement.dimensions.perspective.description',
  },

  judgement: {
    id: 'judgement',
    labelKey: 'stories:measurement.dimensions.judgement.label',
    descriptionKey: 'stories:measurement.dimensions.judgement.description',
  },

  self_regulation: {
    id: 'self_regulation',
    labelKey: 'stories:measurement.dimensions.selfRegulation.label',
    descriptionKey: 'stories:measurement.dimensions.selfRegulation.description',
  },

  responsibility: {
    id: 'responsibility',
    labelKey: 'stories:measurement.dimensions.responsibility.label',
    descriptionKey: 'stories:measurement.dimensions.responsibility.description',
  },
};