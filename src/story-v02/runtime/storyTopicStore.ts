// src/story-v02/runtime/storyTopicStore.ts

import type { ThemeId } from '../../competencies/themeMeta';

export type StoredTopicSeen = {
  topicId: ThemeId;
  courseId: string;
  chapterId: string;
  chapterIndex0: number;
  stepId: string;
  timestamp: string;
};

const TOPIC_KEY = 'aym_story_v02_topic_seen';

function loadAll(): StoredTopicSeen[] {
  try {
    const raw = localStorage.getItem(TOPIC_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAll(data: StoredTopicSeen[]): void {
  try {
    localStorage.setItem(TOPIC_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function markTopicsSeen(args: {
  topicIds: ThemeId[];
  courseId: string;
  chapterId: string;
  chapterIndex0: number;
  stepId: string;
}): void {
  if (!args.topicIds.length) return;

  const existing = loadAll();
  const next = [...existing];

  for (const topicId of args.topicIds) {
    const alreadyExists = existing.some(
      (x) =>
        x.topicId === topicId &&
        x.courseId === args.courseId &&
        x.chapterId === args.chapterId &&
        x.stepId === args.stepId
    );

    if (alreadyExists) continue;

    next.push({
      topicId,
      courseId: args.courseId,
      chapterId: args.chapterId,
      chapterIndex0: args.chapterIndex0,
      stepId: args.stepId,
      timestamp: new Date().toISOString(),
    });
  }

  saveAll(next);
}

export function loadTopicSeen(): StoredTopicSeen[] {
  return loadAll();
}

export function clearTopicSeen(): void {
  try {
    localStorage.removeItem(TOPIC_KEY);
  } catch {
    // ignore
  }
}