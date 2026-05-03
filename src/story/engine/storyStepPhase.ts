import type { StoryRuntimePhase } from './storyRuntimeTypes';
import type { StoryStep } from './storyTypes';

export function getInitialPhaseForStep(step: StoryStep | null): StoryRuntimePhase {
  if (!step) return 'chapter_finished';

  switch (step.type) {
    case 'story':
      return 'playing_story';

    case 'legacy_prompt':
      return 'awaiting_legacy_answer';

    case 'legacy_reaction':
      return 'showing_legacy_reaction';

    case 'input':
      return 'awaiting_input';

    case 'item':
      return 'awaiting_item_choice';

    case 'reflection':
      return 'awaiting_reflection';

    case 'amy_feedback':
      return 'showing_amy_feedback';

    case 'amy_reaction':
      return 'showing_amy_reaction';

    case 'challenge':
      return 'showing_challenge';

    default:
      return 'playing_story';
  }
}