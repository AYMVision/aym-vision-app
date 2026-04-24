import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import { amyChat, m, S, C } from '../storyBuilder';

const c01 = C('s1e04c01', 0, 'Amic 1', 'Coming soon', [
  S('s1e04c01_story_placeholder', [
    amyChat(),
    m(ch.amy, 'This episode will be available soon.'),
  ]),
]);

const s1e04En: StoryEpisodeV02 = {
  id: 's1e04',
  seasonId: 's1',
  episodeId: 's1e04',
  courseId: 's1e04',
  chapters: [c01],
};

export default s1e04En;