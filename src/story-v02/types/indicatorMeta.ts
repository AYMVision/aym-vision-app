// src/story-v02/types/indicatorMeta.ts

import type { IndicatorId, StoryDimensionId } from './measurementTypes';

export type IndicatorMeta = {
  id: IndicatorId;
  dimension: StoryDimensionId;
  labelKey: string;
  descriptionKey: string;
};

export const INDICATOR_META: Record<IndicatorId, IndicatorMeta> = {
  privacy_protect: {
    id: 'privacy_protect',
    dimension: 'responsibility',
    labelKey: 'stories:measurement.indicators.privacyProtect.label',
    descriptionKey: 'stories:measurement.indicators.privacyProtect.description',
  },

  do_not_harm: {
    id: 'do_not_harm',
    dimension: 'responsibility',
    labelKey: 'stories:measurement.indicators.doNotHarm.label',
    descriptionKey: 'stories:measurement.indicators.doNotHarm.description',
  },

  intervene: {
    id: 'intervene',
    dimension: 'responsibility',
    labelKey: 'stories:measurement.indicators.intervene.label',
    descriptionKey: 'stories:measurement.indicators.intervene.description',
  },

  take_responsibility: {
    id: 'take_responsibility',
    dimension: 'responsibility',
    labelKey: 'stories:measurement.indicators.takeResponsibility.label',
    descriptionKey: 'stories:measurement.indicators.takeResponsibility.description',
  },

  interrupt_impulse: {
    id: 'interrupt_impulse',
    dimension: 'self_regulation',
    labelKey: 'stories:measurement.indicators.interruptImpulse.label',
    descriptionKey: 'stories:measurement.indicators.interruptImpulse.description',
  },

  keep_limits: {
    id: 'keep_limits',
    dimension: 'self_regulation',
    labelKey: 'stories:measurement.indicators.keepLimits.label',
    descriptionKey: 'stories:measurement.indicators.keepLimits.description',
  },

  steer_attention: {
    id: 'steer_attention',
    dimension: 'self_regulation',
    labelKey: 'stories:measurement.indicators.steerAttention.label',
    descriptionKey: 'stories:measurement.indicators.steerAttention.description',
  },

  pursue_goal: {
    id: 'pursue_goal',
    dimension: 'self_regulation',
    labelKey: 'stories:measurement.indicators.pursueGoal.label',
    descriptionKey: 'stories:measurement.indicators.pursueGoal.description',
  },

  perspectives_recognize: {
    id: 'perspectives_recognize',
    dimension: 'perspective',
    labelKey: 'stories:measurement.indicators.perspectivesRecognize.label',
    descriptionKey: 'stories:measurement.indicators.perspectivesRecognize.description',
  },

  media_effect_understand: {
    id: 'media_effect_understand',
    dimension: 'perspective',
    labelKey: 'stories:measurement.indicators.mediaEffectUnderstand.label',
    descriptionKey: 'stories:measurement.indicators.mediaEffectUnderstand.description',
  },

  perspectives_distinguish: {
    id: 'perspectives_distinguish',
    dimension: 'perspective',
    labelKey: 'stories:measurement.indicators.perspectivesDistinguish.label',
    descriptionKey: 'stories:measurement.indicators.perspectivesDistinguish.description',
  },

  roles_understand: {
    id: 'roles_understand',
    dimension: 'perspective',
    labelKey: 'stories:measurement.indicators.rolesUnderstand.label',
    descriptionKey: 'stories:measurement.indicators.rolesUnderstand.description',
  },

  credibility_assess: {
    id: 'credibility_assess',
    dimension: 'judgement',
    labelKey: 'stories:measurement.indicators.credibilityAssess.label',
    descriptionKey: 'stories:measurement.indicators.credibilityAssess.description',
  },

  manipulation_recognize: {
    id: 'manipulation_recognize',
    dimension: 'judgement',
    labelKey: 'stories:measurement.indicators.manipulationRecognize.label',
    descriptionKey: 'stories:measurement.indicators.manipulationRecognize.description',
  },

  information_classify: {
    id: 'information_classify',
    dimension: 'judgement',
    labelKey: 'stories:measurement.indicators.informationClassify.label',
    descriptionKey: 'stories:measurement.indicators.informationClassify.description',
  },

  judgement_explain: {
    id: 'judgement_explain',
    dimension: 'judgement',
    labelKey: 'stories:measurement.indicators.judgementExplain.label',
    descriptionKey: 'stories:measurement.indicators.judgementExplain.description',
  },

  rules_consequences: {
    id: 'rules_consequences',
    dimension: 'responsibility',
    labelKey: 'stories:measurement.indicators.rulesConsequences.label',
    descriptionKey: 'stories:measurement.indicators.rulesConsequences.description',
  },

  regulate_emotions: {
    id: 'regulate_emotions',
    dimension: 'self_regulation',
    labelKey: 'stories:measurement.indicators.regulateEmotions.label',
    descriptionKey: 'stories:measurement.indicators.regulateEmotions.description',
  },

  goal_conflicts: {
    id: 'goal_conflicts',
    dimension: 'perspective',
    labelKey: 'stories:measurement.indicators.goalConflicts.label',
    descriptionKey: 'stories:measurement.indicators.goalConflicts.description',
  },
};