import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import { amyChat, m, S, C } from '../storyBuilder';

const c01 = C('s1e06c01', 0, 'Amic 1', 'Bald verfügbar', [
  S('s1e06c01_story_placeholder', [
    amyChat(),
    m(ch.amy, 'Diese Episode ist bald verfügbar.'),
  ]),
]);

const s1e06De: StoryEpisodeV02 = {
  id: 's1e06',
  seasonId: 's1',
  episodeId: 's1e06',
  courseId: 's1e06',
  chapters: [c01],
};

export default s1e06De;