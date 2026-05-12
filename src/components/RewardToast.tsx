// src/components/RewardToast.tsx
// Centered achievement card that shows stickers + coins, auto-dismisses after 2.5s.

import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../common/assetUrl';

export type RewardToastData = {
  stickers: Array<{ image: string; title: string }>;
  coins: number;
};

type Props = {
  reward: RewardToastData;
  onDismiss: () => void;
};

export default function RewardToast({ reward, onDismiss }: Props) {
  // Base 3s + 1.5s per sticker so there's enough time to look at each one
  const DISPLAY_MS = 3000 + reward.stickers.length * 1500;
  const FADEOUT_MS = 350; // matches reward-fadeout animation duration
  const [visible, setVisible] = useState(true);
  const dismissedRef = useRef(false);

  function safeDismiss() {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    onDismiss();
  }

  useEffect(() => {
    // Start fade-out after display duration
    const fadeTimer = setTimeout(() => setVisible(false), DISPLAY_MS);
    // Hard fallback: always call onDismiss even if onAnimationEnd never fires (iOS)
    const hardTimer = setTimeout(safeDismiss, DISPLAY_MS + FADEOUT_MS + 100);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hardTimer);
    };
  }, []);

  function handleAnimationEnd(e: React.AnimationEvent) {
    if (e.animationName.includes('reward-fadeout')) {
      safeDismiss();
    }
  }

  function handleTap() {
    setVisible(false);
    // Small delay so the fade-out plays before dismissing
    setTimeout(safeDismiss, FADEOUT_MS);
  }

  const hasStickers = reward.stickers.length > 0;
  const hasCoins = reward.coins > 0;

  return (
    // Outer wrapper: pointer-events:none so the backdrop never blocks touches.
    // Only the card itself captures taps (pointer-events:auto below).
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className={visible ? 'reward-toast-enter' : 'reward-toast-exit'}
        onAnimationEnd={handleAnimationEnd}
        onClick={handleTap}
        style={{
          pointerEvents: 'auto',
          cursor: 'pointer',
          background: 'linear-gradient(145deg, #fff7f9 0%, #fff 100%)',
          border: '2px solid #fda4af',
          borderRadius: '24px',
          padding: '28px 32px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          minWidth: '220px',
          maxWidth: '340px',
          textAlign: 'center',
        }}
      >
        {/* Header */}
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#be123c', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Amic geschafft! ✨
        </div>

        {/* Stickers */}
        {hasStickers && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
            {reward.stickers.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <img
                  src={assetUrl(s.image)}
                  alt={s.title}
                  style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
                />
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{s.title}</div>
              </div>
            ))}
          </div>
        )}

        {/* Coins */}
        {hasCoins && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fef9c3',
            border: '1.5px solid #fde047',
            borderRadius: '999px',
            padding: '6px 16px',
          }}>
            <span style={{ fontSize: '20px' }}>🪙</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#92400e' }}>
              +{reward.coins} {reward.coins === 1 ? 'Münze' : 'Münzen'}
            </span>
          </div>
        )}

        {/* Tap-to-dismiss hint */}
        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
          Tippe zum Schließen
        </div>
      </div>
    </div>
  );
}
