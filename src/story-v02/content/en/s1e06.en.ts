import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import { amyChat, m, S, C } from '../storyBuilder';

const c01 = C('s1e06c01', 0, 'Amic 1', 'Coming soon', [
  S('s1e06c01_story_placeholder', [
    amyChat(),
    m(ch.amy, 'This episode will be available soon.'),
  ]),
]);

const s1e06En: StoryEpisodeV02 = {
  id: 's1e06',
  seasonId: 's1',
  episodeId: 's1e06',
  courseId: 's1e06',
  chapters: [c01],
};

export default s1e06En;