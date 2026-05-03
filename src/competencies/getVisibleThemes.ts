import type { ProgressState } from '../profile/types';
import { THEME_META, THEME_ORDER } from './themeMeta';

export function getVisibleThemes(progress?: ProgressState) {
  const points = progress?.themePoints ?? {};

  return THEME_ORDER
    .map((id) => {
      const theme = THEME_META[id];

      return {
        ...theme,
        points: points[id] ?? 0,
      };
    })
    .filter((theme) => theme.points > 0)
    .sort((a, b) => b.points - a.points);
}