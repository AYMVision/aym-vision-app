import type { StoryTranscriptSnapshot } from '../common/types';
import type { ThemeId } from '../competencies/themeMeta';

export type ItemSlot =
  | 'featured'
  | 'background'
  | 'effect';

export type StoryPhase =
  | 'playing'
  | 'awaiting_answer'
  | 'resolving'
  | 'unlocked'
  | 'finished';

export type Equipment = {
  featured: string | null;
  background: string | null;
  effect: string | null;
};

export type Inventory = {
  featured: string[];
  background: string[];
  effect: string[];
};

export type Wallet = {
  coins: number;
  totalEarned: number;
  totalSpent: number;
};

export type WeeklyStreakState = {
  lastActiveDay: string;
  currentStreak: number;
  longestStreak: number;
  completedWeeks: number;
};

export type ActivityProgressState = {
  totalPlayedDays: number;
  lastPlayedDay: string;
};

export type DiaryProgressState = {
  usedDays: number;
  lastUsedDay: string;
};

export type FriendbookProgressState = {
  hasOwnEntry: boolean;
};

export type ProgressState = {
  completedChapters: Record<string, true>;
  completedEpisodes: Record<string, true>;
  earnedStickers: Record<string, true>;
  earnedStickersAt?: Record<string, number>; // Unix-Timestamp wann verdient
  earnedBadges: Record<string, true>;
  current?: {
    seasonId: string;
    episodeId: string;
    courseId: string;
    chapterIndex: number;
    updatedAt: number;
  };
  weeklyStreak?: WeeklyStreakState;
  themePoints?: Partial<Record<ThemeId, number>>;

  // NEU: für zusätzliche Milestones
  activity?: ActivityProgressState;
  diary?: DiaryProgressState;
  friendbook?: FriendbookProgressState;
};

export type UserProfile = {
  version: number;
  avatarBaseId: string;
  wallet: Wallet;
  inventory: Inventory;
  equipment: Equipment;
  progress: ProgressState;
  createdAt: number;
  updatedAt: number;
  storyTranscripts?: Record<string, StoryTranscriptSnapshot>;
  chatName?: string;
  soundEnabled?: boolean; // undefined = true (Standard: an)

  myCard?: {
    mostly: string;
    hobbies: string[];
    othersLike: string[];
    annoys: string[];
    colors: string;
    happy: string;
    netRule: string;
    funFact: string;
  };
};