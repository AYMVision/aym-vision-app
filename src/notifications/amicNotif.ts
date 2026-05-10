// src/notifications/amicNotif.ts
// Stores info about the next chapter's first sender for the "Amic hat..." banner.

const KEY = 'aym_next_amic_info';

export interface NextAmicInfo {
  /** Display name of the first message sender in the next chapter */
  senderName: string;
  /** The chapter that the sender's message appears in */
  chapterId: string;
  /** The course / episode this belongs to */
  courseId: string;
}

export function saveNextAmicInfo(info: NextAmicInfo): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(info));
  } catch {
    // ignore storage errors
  }
}

export function loadNextAmicInfo(): NextAmicInfo | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<NextAmicInfo>;
    if (
      typeof parsed.senderName === 'string' &&
      typeof parsed.chapterId === 'string' &&
      typeof parsed.courseId === 'string'
    ) {
      return parsed as NextAmicInfo;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearNextAmicInfo(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
