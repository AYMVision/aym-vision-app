export type StudioTopicId =
  | 'infoCheck' | 'teamTalk' | 'create' | 'safe'
  | 'solve' | 'reflect' | 'fair' | 'free';

export type StudioMessage = {
  id: string;
  characterId: string;
  text: string;
};

export type StudioStory = {
  v: 1;
  title?: string;
  tag: StudioTopicId;
  characters: string[]; // selected IDs (amy always included)
  messages: StudioMessage[];
  amyQuestion: string; // required
  amyTip: string;      // required
  createdAt: number;
};
