// src/story-v02/runtime/storyResponseStore.ts

import type { IndicatorId, ItemScore, StoryDimensionId } from '../types/measurementTypes';

export type StoredInputResponse = {
  inputId: string;
  courseId: string;
  chapterId: string;
  chapterIndex0: number;
  text?: string;
  choiceId?: string;
  timestamp: string;
};

export type StoredItemResponse = {
  itemId: string;
  courseId: string;
  chapterId: string;
  chapterIndex0: number;
  dimension: StoryDimensionId;
  indicatorId: IndicatorId;
  selectedOptionId: string;
  score: ItemScore;
  timestamp: string;
};

export type StoredReflectionResponse = {
  reflectionId: string;
  courseId: string;
  chapterId: string;
  chapterIndex0: number;
  text?: string;
  choiceId?: string;
  timestamp: string;
};

export type StoredChallengeStatus = {
  challengeId: string;
  courseId: string;
  chapterId: string;
  chapterIndex0: number;
  seen: boolean;
  timestamp: string;
};

const INPUT_KEY = 'aym_story_v02_input_responses';
const ITEM_KEY = 'aym_story_v02_item_responses';
const REFLECTION_KEY = 'aym_story_v02_reflection_responses';
const CHALLENGE_KEY = 'aym_story_v02_challenge_status';

function loadJsonArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveJsonArray<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function loadInputResponses(): StoredInputResponse[] {
  return loadJsonArray<StoredInputResponse>(INPUT_KEY);
}

export function saveInputResponse(response: StoredInputResponse): void {
  const all = loadInputResponses();
  const filtered = all.filter(
    (x) => !(x.courseId === response.courseId && x.inputId === response.inputId)
  );
  saveJsonArray(INPUT_KEY, [...filtered, response]);
}

export function loadItemResponses(): StoredItemResponse[] {
  return loadJsonArray<StoredItemResponse>(ITEM_KEY);
}

export function saveItemResponse(response: StoredItemResponse): void {
  const all = loadItemResponses();
  const filtered = all.filter(
    (x) => !(x.courseId === response.courseId && x.itemId === response.itemId)
  );
  saveJsonArray(ITEM_KEY, [...filtered, response]);
}

export function loadReflectionResponses(): StoredReflectionResponse[] {
  return loadJsonArray<StoredReflectionResponse>(REFLECTION_KEY);
}

export function saveReflectionResponse(response: StoredReflectionResponse): void {
  const all = loadReflectionResponses();
  const filtered = all.filter(
    (x) => !(x.courseId === response.courseId && x.reflectionId === response.reflectionId)
  );
  saveJsonArray(REFLECTION_KEY, [...filtered, response]);
}

export function loadChallengeStatuses(): StoredChallengeStatus[] {
  return loadJsonArray<StoredChallengeStatus>(CHALLENGE_KEY);
}

export function saveChallengeStatus(status: StoredChallengeStatus): void {
  const all = loadChallengeStatuses();
  const filtered = all.filter(
    (x) => !(x.courseId === status.courseId && x.challengeId === status.challengeId)
  );
  saveJsonArray(CHALLENGE_KEY, [...filtered, status]);
}

export function clearAllStoryV02Responses(): void {
  try {
    localStorage.removeItem(INPUT_KEY);
    localStorage.removeItem(ITEM_KEY);
    localStorage.removeItem(REFLECTION_KEY);
    localStorage.removeItem(CHALLENGE_KEY);
  } catch {
    // ignore
  }
}