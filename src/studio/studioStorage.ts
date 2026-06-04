import type { StudioStory } from './studioTypes';

const STORIES_KEY = 'aym_studio_stories';

export type SavedStory = {
  id: string;
  savedAt: number;
  story: StudioStory;
};

export function getSavedStories(): SavedStory[] {
  try {
    const raw = localStorage.getItem(STORIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedStory[];
  } catch {
    return [];
  }
}

export function saveStoryToList(story: StudioStory): string {
  try {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const stories = getSavedStories();
    stories.push({ id, savedAt: Date.now(), story });
    localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
    return id;
  } catch {
    return '';
  }
}

export function deleteSavedStory(id: string): void {
  try {
    const stories = getSavedStories().filter((s) => s.id !== id);
    localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
  } catch { /* ignore */ }
}

export function clearAllSavedStories(): void {
  try {
    localStorage.removeItem(STORIES_KEY);
  } catch { /* ignore */ }
}
