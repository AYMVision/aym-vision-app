import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { assetUrl } from '../common/assetUrl';
import { useProfile } from '../profile/useProfile';
import { playCoinSound, playStickerSound } from '../common/soundPlayer';

export type RewardFx = {
  id: string;
  kind: 'coin' | 'sticker';
  imgSrc: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  durationMs?: number; // ✅ optional
};

export type RewardFxApi = {
  walletElRef: React.MutableRefObject<HTMLDivElement | null>;
  profileElRef: React.MutableRefObject<HTMLDivElement | null>;

  flyCoinFromRect: (fromRect: DOMRect) => void;

  // ✅ opts: Ziel + Dauer
  flyStickerFromRect: (
    fromRect: DOMRect,
    stickerImgSrc: string,
    opts?: { toRect?: DOMRect; durationMs?: number }
  ) => void;

  activeRewards: RewardFx[];
  removeReward: (id: string) => void;
};

const Ctx = createContext<RewardFxApi | null>(null);

function centerOfRect(r: DOMRect) {
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// ✅ Zielpunkt: rechts-mittig im Avatar-Kreis
function rightCenterOfRect(r: DOMRect, insetPx = 6) {
  return { x: r.right - insetPx, y: r.top + r.height / 2 };
}

export function RewardFxProvider({ children }: { children: React.ReactNode }) {
  // Ziele (Header)
  const walletElRef = useRef<HTMLDivElement | null>(null);
  const profileElRef = useRef<HTMLDivElement | null>(null);

  const { profile } = useProfile();

  const [activeRewards, setActiveRewards] = useState<RewardFx[]>([]);

  const pushReward = (reward: RewardFx) => {
    setActiveRewards((prev) => [...prev, reward]);
  };

  const flyCoinFromRect = (fromRect: DOMRect) => {
    const walletEl = walletElRef.current;
    if (!walletEl) return;

    const from = centerOfRect(fromRect);
    const to = centerOfRect(walletEl.getBoundingClientRect());

    playCoinSound(profile.soundEnabled !== false);

    pushReward({
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      kind: 'coin',
      imgSrc: assetUrl('media/story/ui/coin-128.webp'),
      from,
      to,
      durationMs: 900,
    });
  };

  const flyStickerFromRect = (
    fromRect: DOMRect,
    stickerImgSrc: string,
    opts?: { toRect?: DOMRect; durationMs?: number }
  ) => {
    playStickerSound(profile.soundEnabled !== false);

    const from = centerOfRect(fromRect);


    // ✅ Priorität: opts.toRect -> profileElRef -> fallback (oben rechts)
    const toRect =
      opts?.toRect ??
      profileElRef.current?.getBoundingClientRect() ??
      new DOMRect(window.innerWidth - 44, 24, 24, 24);

    // ✅ Sticker soll NICHT in die Mitte, sondern rechts in den Kreis
    const to = rightCenterOfRect(toRect, 6);

    pushReward({
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      kind: 'sticker',
      imgSrc: stickerImgSrc,
      from,
      to,
      durationMs: opts?.durationMs ?? 2600, // ✅ langsamer Default
    });
  };

  const removeReward = (id: string) => {
    setActiveRewards((prev) => prev.filter((r) => r.id !== id));
  };

  const api = useMemo<RewardFxApi>(
    () => ({
      walletElRef,
      profileElRef,
      flyCoinFromRect,
      flyStickerFromRect,
      activeRewards,
      removeReward,
    }),
    [activeRewards]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useRewardFx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRewardFx must be used within <RewardFxProvider>');
  return ctx;
}
