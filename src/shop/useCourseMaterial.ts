import { useQuery } from '@tanstack/react-query';
import { getMaterial, refreshMaterial, checkForUpdate, type CourseMaterial } from './materialCache';
import { refreshOwnership } from './ownership';
import { getActiveProfileId } from '../profile/profileStorage';

const STALE_TIME_MS = 6 * 60 * 60 * 1000; // 6h

export function useCourseMaterial(courseId: string) {
  const profileId = getActiveProfileId() ?? '';

  const { data, isLoading, error, refetch } = useQuery<CourseMaterial | null>({
    queryKey: ['course-material', courseId, profileId],
    queryFn: async () => {
      if (!profileId) return null;

      const needsUpdate = await checkForUpdate(courseId, profileId);
      if (needsUpdate) {
        return refreshMaterial(courseId, profileId);
      }

      const material = await getMaterial(courseId, profileId);

      if (material === null) {
        // 403 — clear local entitlement and resync
        await refreshOwnership(profileId);
      }

      return material;
    },
    staleTime: STALE_TIME_MS,
    enabled: !!profileId && !!courseId,
  });

  return { material: data ?? null, isLoading, error, refetch };
}
