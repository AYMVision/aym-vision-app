import type { StoryTranscriptSnapshot } from '../common/types';
import type { ThemeId } from '../competencies/themeMeta';

export type ItemSlot =
  | 'head'
  | 'face'
  | 'top'
  | 'bottom'
  | 'feet'
  | 'background'
  | 'effect';

export type StoryPhase =
  | 'playing'
  | 'awaiting_answer'
  | 'resolving'
  | 'unlocked'
  | 'finished';

export type Equipment = Record<ItemSlot, string | null>;
export type Inventory = Record<ItemSlot, string[]>;

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

export type ProgressState = {
  completedChapters: Record<string, true>;
  completedEpisodes: Record<string, true>;
  earnedStickers: Record<string, true>;
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
};