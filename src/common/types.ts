// Optionales Theme für Main-Sprechblasen
export type BubbleTheme = {
  bg: string; // z. B. 'bg-rose-50'
  border: string; // z. B. 'border-rose-200'
  text: string; // z. B. 'text-rose-900'
};

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
  // ▼ Neu: Theme, das NUR für 'main'-Bubbles dieses Characters verwendet wird (optional)
  mainTheme?: BubbleTheme;
};

export type Message = {
  type: 'main' | 'user' | 'other' | 'system';
  speaker?: Character;
  content?: string;
  image?: string;
  timestamp?: string;
  reactions?: string[];
  // NEU: Reply/Quote
  replyTo?: {
    text: string; // kurzer Vorschauteil der Original-Nachricht
    speakerName?: string; // optional: Name des ursprünglichen Senders
  };
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
