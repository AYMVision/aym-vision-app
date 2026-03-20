import type { UserProfile } from '../profile/types';

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

  if (newStreak === 5) {
    completedWeeks += 1;
    weekCompleted = true;

    if (!profile.progress.earnedBadges?.['weekly-streak-5']) {
      next = {
        ...profile,
        progress: {
          ...profile.progress,
          earnedBadges: {
            ...(profile.progress.earnedBadges ?? {}),
            'weekly-streak-5': true,
          },
        },
      };
      weeklyBadgeAwarded = true;
    }
  }

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