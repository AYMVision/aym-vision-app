// src/profile/coins.ts
// Business logic: Coins verdienen & ausgeben
// - defensiv gegenüber unvollständigen Profilen
// - vorbereitet für spätere Auswertung (reason)

import type { UserProfile } from './types';

export type CoinReason =
  | 'EPISODE_COMPLETE'
  | 'GOOD_CHOICE'
  | 'STREAK'
  | 'ARTICLE_READ'
  | 'DEBUG';

function normalizeWallet(profile: UserProfile) {
  return {
    coins: profile.wallet?.coins ?? 0,
    totalEarned: profile.wallet?.totalEarned ?? 0,
    totalSpent: profile.wallet?.totalSpent ?? 0,
  };
}

export function earnCoins(
  profile: UserProfile,
  amount: number,
  _reason: CoinReason // bewusst noch nicht ausgewertet
): UserProfile {
  if (!Number.isFinite(amount) || amount <= 0) return profile;

  const wallet = normalizeWallet(profile);
  const now = Date.now();

  return {
    ...profile,
    wallet: {
      ...wallet,
      coins: wallet.coins + amount,
      totalEarned: wallet.totalEarned + amount,
    },
    updatedAt: now,
  };
}

export function spendCoins(
  profile: UserProfile,
  amount: number
): { ok: boolean; profile: UserProfile } {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: true, profile };
  }

  const wallet = normalizeWallet(profile);

  if (wallet.coins < amount) {
    return { ok: false, profile };
  }

  const now = Date.now();

  return {
    ok: true,
    profile: {
      ...profile,
      wallet: {
        ...wallet,
        coins: wallet.coins - amount,
        totalSpent: wallet.totalSpent + amount,
      },
      updatedAt: now,
    },
  };
}
