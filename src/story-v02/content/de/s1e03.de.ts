import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import { amyChat, m, S, C } from '../storyBuilder';

const c01 = C('s1e03c01', 0, 'Amic 1', 'Bald verfügbar', [
  S('s1e03c01_story_placeholder', [
    amyChat(),
    m(ch.amy, 'Diese Episode ist bald verfügbar.'),
  ]),
]);

const s1e03De: StoryEpisodeV02 = {
  id: 's1e03',
  seasonId: 's1',
  episodeId: 's1e03',
  courseId: 's1e03',
  chapters: [c01],
};

export default s1e03De;