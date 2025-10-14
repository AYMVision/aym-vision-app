import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
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

const keyFor = (courseId: string) => `story_progress_${courseId}`;

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

// Push a user's answer immediately after they submit it.
export function pushAnswer(courseId: string, chapter: number, text: string) {
  const prev =
    getProgress(courseId) ||
    ({
      unlockedEpisode: 0,
      answers: [],
      finished: false,
    } as StoredProgress);

  const updated: StoredProgress = {
    ...prev,
    // answers are appended; do not change unlockedEpisode/finished here
    answers: [
      ...prev.answers,
      { chapter, text, timestamp: new Date().toISOString() },
    ],
  };

  setProgress(courseId, updated);
}

// Mark a chapter as completed (unlock next) and optionally finished at the end.
export function markChapterCompleted(
  courseId: string,
  justFinishedChapterIndex: number,
  isLastChapter: boolean
) {
  const prev =
    getProgress(courseId) ||
    ({
      unlockedEpisode: 0,
      answers: [],
      finished: false,
    } as StoredProgress);

  const nextUnlocked = Math.max(
    prev.unlockedEpisode,
    justFinishedChapterIndex + 1
  );

  const updated: StoredProgress = {
    ...prev,
    unlockedEpisode: nextUnlocked,
    finished: isLastChapter ? true : prev.finished,
  };

  setProgress(courseId, updated);
}

const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1)); // Remove the '#' from the hash
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return null;
};

export default ScrollToHash;
