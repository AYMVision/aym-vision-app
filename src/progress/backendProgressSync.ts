import { aymFetch } from '../identity/handshake';
import { loadIdentity } from '../identity/storage';
import { deriveBackendProfileId } from '../identity/keys';
import { markChapterCompleted, getProgress } from './storyProgress';
import { getEpisodeMetaByCourseId } from '../content/contentIndex';

export async function syncChapterProgress(courseId: string, chapterIndex0: number): Promise<void> {
  const identity = loadIdentity();
  if (!identity) return;
  const profileId = deriveBackendProfileId(identity.mnemonic);
  try {
    await aymFetch('/api/v1/extension/aym-vision/chapter-progress', {
      method: 'POST',
      body: JSON.stringify({ profileId, courseId, chapterIndex: chapterIndex0 }),
    });
  } catch {}
}

export async function restoreProgressFromBackend(): Promise<boolean> {
  const identity = loadIdentity();
  if (!identity) return false;
  const profileId = deriveBackendProfileId(identity.mnemonic);
  try {
    const res = await aymFetch(
      `/api/v1/extension/aym-vision/chapter-progress?profileId=${encodeURIComponent(profileId)}`
    );
    if (!res.ok) return false;
    const data = await res.json() as { courseId: string; chapterIndex: number }[];
    if (!Array.isArray(data) || data.length === 0) return false;
    for (const { courseId, chapterIndex } of data) {
      const meta = getEpisodeMetaByCourseId(courseId);
      const isLast = meta ? chapterIndex >= meta.chapterCount - 1 : false;
      const existing = getProgress(courseId);
      if (!existing || existing.unlockedEpisode < chapterIndex + 2) {
        markChapterCompleted(courseId, chapterIndex, isLast);
      }
    }
    return true;
  } catch {
    return false;
  }
}
