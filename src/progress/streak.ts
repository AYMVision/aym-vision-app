import type { UserProfile } from '../profile/types';
import { earnCoins } from '../profile/wallet';

function todayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Gibt alle Datums-Strings der letzten `days` Tage zurück (inklusive heute). */
function lastNDays(days: number): Set<string> {
  const result = new Set<string>();
  const base = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    result.add(`${y}-${m}-${day}`);
  }
  return result;
}

export function applyDailyStreak(profile: UserProfile) {
  const today = todayStr();

  const current = profile.progress.weeklyStreak ?? {
    lastActiveDay: '',
    currentStreak: 0,
    longestStreak: 0,
    completedWeeks: 0,
    recentPlayDates: [],
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

  // recentPlayDates aktualisieren: heute hinzufügen, alles älter als 7 Tage entfernen
  const window7 = lastNDays(7);
  const updatedDates = [
    ...(current.recentPlayDates ?? []).filter((d) => window7.has(d)),
    today,
  ];
  // Duplikate entfernen (sicherheitshalber)
  const uniqueDates = [...new Set(updatedDates)];

  // Anzahl Tage in den letzten 7 Tagen
  const daysInLast7 = uniqueDates.filter((d) => window7.has(d)).length;

  // currentStreak weiterhin als "Tage gespielt insgesamt" führen (für Sticker bei 10/20)
  const newStreak = current.currentStreak + 1;

  let completedWeeks = current.completedWeeks;
  let weekCompleted = false;
  let weeklyBadgeAwarded = false;

  let next = profile;

  // 5-von-7-Badge: einmalig, sobald 5 Tage innerhalb der letzten 7 erreicht sind
  if (daysInLast7 >= 5 && !profile.progress.earnedBadges?.['weekly-streak-5']) {
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

  // Wiederkehrende +2 Coins alle 7 gespielte Tage (insgesamt)
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
        recentPlayDates: uniqueDates,
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
