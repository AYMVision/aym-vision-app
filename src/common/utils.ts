import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProgressState {
  unlockedEpisode: number;
  answers: string[];
  finished: boolean;
}
const STORAGE_KEY_PREFIX = 'aym-vision-progress-';

export function getProgress(courseId: string): ProgressState | null {
  const raw = localStorage.getItem(STORAGE_KEY_PREFIX + courseId);
  return raw ? JSON.parse(raw) : null;
}

export function setProgress(courseId: string, state: ProgressState) {
  localStorage.setItem(STORAGE_KEY_PREFIX + courseId, JSON.stringify(state));
}

export function resetProgress(courseId: string) {
  localStorage.removeItem(STORAGE_KEY_PREFIX + courseId);
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
