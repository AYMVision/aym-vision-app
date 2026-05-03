export type StoredAnswer = {
  chapter: number;
  text: string;
  timestamp?: string;
};

export type StoredProgress = {
  unlockedEpisode: number;
  answers: StoredAnswer[];
  finished: boolean;
};

const PROGRESS_VERSION = 'v2';
const keyFor = (courseId: string) => `aym_story_progress_${PROGRESS_VERSION}_${courseId}`;

export function getProgress(courseId: string): StoredProgress | null {
  try {
    const raw = localStorage.getItem(keyFor(courseId));
    return raw ? (JSON.parse(raw) as StoredProgress) : null;
  } catch {
    return null;
  }
}

export function setProgress(courseId: string, data: StoredProgress) {
  try {
    localStorage.setItem(keyFor(courseId), JSON.stringify(data));
  } catch {}
}

export function clearProgress(courseId: string) {
  try {
    localStorage.removeItem(keyFor(courseId));
  } catch {}
}

export function pushAnswer(courseId: string, chapter: number, text: string) {
  const prev =
    getProgress(courseId) ||
    ({
      unlockedEpisode: 1,
      answers: [],
      finished: false,
    } as StoredProgress);

  const updated: StoredProgress = {
    ...prev,
    answers: [
      ...prev.answers,
      { chapter, text, timestamp: new Date().toISOString() },
    ],
  };

  setProgress(courseId, updated);
}

export function markChapterCompleted(
  courseId: string,
  justFinishedChapterIndex: number,
  isLastChapter: boolean
) {
  const prev =
    getProgress(courseId) ||
    ({
      unlockedEpisode: 1,
      answers: [],
      finished: false,
    } as StoredProgress);

  const nextUnlocked = Math.max(
    prev.unlockedEpisode,
    justFinishedChapterIndex + 2
  );

  const updated: StoredProgress = {
    ...prev,
    unlockedEpisode: nextUnlocked,
    finished: isLastChapter ? true : prev.finished,
  };

  setProgress(courseId, updated);
}

export function getCompletedChapterCount(courseId: string): number {
  const p = getProgress(courseId);
  if (!p) return 0;
  return Math.max(0, p.unlockedEpisode - 1);
}

export function hasCompletedChapter(courseId: string, chapterIndex0: number): boolean {
  const p = getProgress(courseId);
  if (!p) return false;
  return p.unlockedEpisode >= chapterIndex0 + 2;
}