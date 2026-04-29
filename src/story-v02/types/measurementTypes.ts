// src/story-v02/types/measurementTypes.ts

export type StoryDimensionId =
  | 'perspective'
  | 'judgement'
  | 'self_regulation'
  | 'responsibility';

export type IndicatorId =
  | 'privacy_protect'
  | 'do_not_harm'
  | 'intervene'
  | 'take_responsibility'
  | 'interrupt_impulse'
  | 'keep_limits'
  | 'steer_attention'
  | 'pursue_goal'
  | 'perspectives_recognize'
  | 'media_effect_understand'
  | 'perspectives_distinguish'
  | 'roles_understand'
  | 'credibility_assess'
  | 'manipulation_recognize'
  | 'information_classify'
  | 'judgement_explain'
  | 'rules_consequences'
  | 'regulate_emotions'
  | 'goal_conflicts';

export type ItemScore = 0 | 1 | 2 | 3;