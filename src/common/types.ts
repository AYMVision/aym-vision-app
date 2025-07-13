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

export type Character = {
  name: string;
  avatar: string;
};

export type Message = {
  type: 'main' | 'user' | 'other' | 'system';
  speaker?: Character;
  content?: string;
  image?: string;
  timestamp?: string;
  reactions?: string[];
};

export type Course = {
  id: string;
  title: string;
  image: string;
  description: string;
  script: {
    chapter: number;
    messages: Message[];
  }[];
};
