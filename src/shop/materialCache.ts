import { get, set, del } from 'idb-keyval';
import { aymFetch } from '../identity/handshake';

export type CourseMaterial = {
  courseId: string;
  version: string;
  payload: unknown;
};

function cacheKey(courseId: string, profileId: string): string {
  return `aym-material:${profileId}:${courseId}`;
}

export async function getMaterial(courseId: string, profileId: string): Promise<CourseMaterial | null> {
  const cached = await get<CourseMaterial>(cacheKey(courseId, profileId));
  if (cached) return cached;

  const path = `/api/v1/extension/aym-vision/material/${encodeURIComponent(courseId)}?profileId=${encodeURIComponent(profileId)}`;
  try {
    const res = await aymFetch(path);
    if (res.status === 403) return null;
    if (!res.ok) return null;
    const data = await res.json() as CourseMaterial;
    await set(cacheKey(courseId, profileId), data);
    return data;
  } catch {
    return null;
  }
}

export async function checkForUpdate(courseId: string, profileId: string): Promise<boolean> {
  const cached = await get<CourseMaterial>(cacheKey(courseId, profileId));
  if (!cached) return false;

  const path = `/api/v1/extension/aym-vision/material/${encodeURIComponent(courseId)}/version?profileId=${encodeURIComponent(profileId)}`;
  try {
    const res = await aymFetch(path);
    if (!res.ok) return false;
    const { version } = await res.json() as { version: string };
    return version !== cached.version;
  } catch {
    return false;
  }
}

export async function refreshMaterial(courseId: string, profileId: string): Promise<CourseMaterial | null> {
  await del(cacheKey(courseId, profileId));
  return getMaterial(courseId, profileId);
}

export async function clearMaterial(courseId: string, profileId: string): Promise<void> {
  await del(cacheKey(courseId, profileId));
}
