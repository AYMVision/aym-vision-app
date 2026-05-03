export type StoryDimension =
  | 'perspektivfaehigkeit'
  | 'urteilsvermoegen'
  | 'selbststeuerung'
  | 'verantwortung';

export type MeasurementScore = 0 | 1 | 2 | 3;

export type StoredItemMeasurement = {
  itemId: string;
  courseId: string;
  chapterIndex0: number;
  dimension: StoryDimension;
  indicatorId: string;
  selectedOptionId: string;
  score: MeasurementScore;
  timestamp: string;
};