import type { UserProfile } from './types';
import { getStarterInventory, getDefaultEquipment } from '../data/items';

export function createDefaultProfile(): UserProfile {
  const now = Date.now();

  return {
    version: 3,
    avatarBaseId: 'default',

    wallet: {
      coins: 0,
      totalEarned: 0,
      totalSpent: 0,
    },

    chatName: '',

    myCard: {
      mostly: '',
      hobbies: [],
      othersLike: [],
      annoys: [],
      colors: '',
      happy: '',
      netRule: '',
      funFact: '',
    },

    inventory: getStarterInventory(),
    equipment: getDefaultEquipment(),

    progress: {
      completedChapters: {},
      completedEpisodes: {},
      earnedStickers: {},
      earnedBadges: {},
      current: undefined,
      weeklyStreak: {
        lastActiveDay: '',
        currentStreak: 0,
        longestStreak: 0,
        completedWeeks: 0,
        recentPlayDates: [],
      },
      themePoints: {
        'info-check': 0,
        'talk-act': 0,
        'creative': 0,
        'safe-online': 0,
        'problem-solving': 0,
        'reflect-understand': 0,
        'fairness': 0,
      },
    },

    createdAt: now,
    updatedAt: now,
  };
}