import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import { amyChat, m, S, C } from '../storyBuilder';

const c01 = C('s1e05c01', 0, 'Amic 1', 'Bald verfügbar', [
  S('s1e05c01_story_placeholder', [
    amyChat(),
    m(ch.amy, 'Diese Episode ist bald verfügbar.'),
  ]),
]);

const s1e05De: StoryEpisodeV02 = {
  id: 's1e05',
  seasonId: 's1',
  episodeId: 's1e05',
  courseId: 's1e05',
  chapters: [c01],
};

export default s1e05De;