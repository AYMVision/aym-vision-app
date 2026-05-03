import type { Message } from '../../common/types';

export type TranscriptEntry =
  | {
      id: string;
      kind: 'message';
      message: Message;
    }
  | {
      id: string;
      kind: 'legacy_user_answer';
      stepId: string;
      text: string;
      timestamp?: string;
    }
  | {
      id: string;
      kind: 'legacy_amy_reply';
      stepId: string;
      text: string;
      isSafety?: boolean;
      timestamp?: string;
    }
  | {
      id: string;
      kind: 'input_answer';
      stepId: string;
      text?: string;
      choiceId?: string;
      timestamp?: string;
    }
  | {
      id: string;
      kind: 'item_answer';
      stepId: string;
      optionId: string;
      timestamp?: string;
    }
  | {
      id: string;
      kind: 'amy_feedback';
      stepId: string;
      text: string;
      timestamp?: string;
    }
  | {
      id: string;
      kind: 'reflection_answer';
      stepId: string;
      text?: string;
      choiceId?: string;
      timestamp?: string;
    }
  | {
      id: string;
      kind: 'amy_reaction';
      stepId: string;
      text: string;
      timestamp?: string;
    }
  | {
      id: string;
      kind: 'challenge_seen';
      stepId: string;
      timestamp?: string;
    };