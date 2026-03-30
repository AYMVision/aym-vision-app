import type { UserProfile } from './types';
import { getStarterInventory } from '../data/items';

export function createDefaultProfile(): UserProfile {
  const now = Date.now();

  return {
    version: 2,
    avatarBaseId: 'kid_01',
    wallet: { coins: 0, totalEarned: 0, totalSpent: 0 },


  myCard: { 
    name: '',
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

    equipment: {
      head: null,
      face: null,
      top: null,
      bottom: null,
      feet: null,
      background: null,
      effect: null,
    },

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