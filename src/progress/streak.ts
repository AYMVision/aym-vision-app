import type { UserProfile } from '../profile/types';
import { earnCoins } from '../profile/wallet';

function todayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function applyDailyStreak(profile: UserProfile) {
  const today = todayStr();
  const yesterday = yesterdayStr();

  const current = profile.progress.weeklyStreak ?? {
    lastActiveDay: '',
    currentStreak: 0,
    longestStreak: 0,
    completedWeeks: 0,
  };

  const activity = profile.progress.activity ?? {
    totalPlayedDays: 0,
    lastPlayedDay: '',
  };

  // Wenn heute schon gezählt wurde: nichts mehr erhöhen
  if (current.lastActiveDay === today) {
    return {
      profile,
      streakIncreased: false,
      weekCompleted: false,
      weeklyBadgeAwarded: false,
    };
  }

  let newStreak = 1;

  if (current.lastActiveDay === yesterday) {
    newStreak = current.currentStreak + 1;
  }

  let completedWeeks = current.completedWeeks;
  let weekCompleted = false;
  let weeklyBadgeAwarded = false;

  let next = profile;

  // Einmalig-Badge bei 5 Tagen
  if (newStreak === 5 && !profile.progress.earnedBadges?.['weekly-streak-5']) {
    next = {
      ...next,
      progress: {
        ...next.progress,
        earnedBadges: {
          ...(next.progress.earnedBadges ?? {}),
          'weekly-streak-5': true,
        },
      },
    };
    weeklyBadgeAwarded = true;
  }

  // Wiederkehrende +2 Coins alle 7 Tage am Stück
  if (newStreak % 7 === 0) {
    completedWeeks += 1;
    weekCompleted = true;
    next = earnCoins(next, 2, 'STREAK');
  }

  if (newStreak >= 10 && !next.progress.earnedStickers?.['streak-10']) {
    const now = Date.now();
    next = {
      ...next,
      progress: {
        ...next.progress,
        earnedStickers: {
          ...(next.progress.earnedStickers ?? {}),
          'streak-10': true,
        },
        earnedStickersAt: {
          ...(next.progress.earnedStickersAt ?? {}),
          'streak-10': now,
        },
      },
    };
  }

  if (newStreak >= 20 && !next.progress.earnedStickers?.['streak-20']) {
    const now = Date.now();
    next = {
      ...next,
      progress: {
        ...next.progress,
        earnedStickers: {
          ...(next.progress.earnedStickers ?? {}),
          'streak-20': true,
        },
        earnedStickersAt: {
          ...(next.progress.earnedStickersAt ?? {}),
          'streak-20': now,
        },
      },
    };
  }

  const totalPlayedDays =
    activity.lastPlayedDay === today
      ? activity.totalPlayedDays
      : activity.totalPlayedDays + 1;

  const finalProfile: UserProfile = {
    ...next,
    progress: {
      ...next.progress,
      weeklyStreak: {
        lastActiveDay: today,
        currentStreak: newStreak,
        longestStreak: Math.max(current.longestStreak, newStreak),
        completedWeeks,
      },
      activity: {
        totalPlayedDays,
        lastPlayedDay: today,
      },
    },
    updatedAt: Date.now(),
  };

  return {
    profile: finalProfile,
    streakIncreased: true,
    weekCompleted,
    weeklyBadgeAwarded,
  };
}