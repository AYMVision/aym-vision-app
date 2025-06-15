export type Bubble = {
  type: 'main' | 'user' | 'other';
  speaker: string;
  avatar?: string;
  content: string;
  image?: string;
  timestamp?: string;
  reactions?: { type: string; emoji: string }[];
  isQuestion?: boolean;
  inputExpected?: boolean;
  quote?: string;
};
