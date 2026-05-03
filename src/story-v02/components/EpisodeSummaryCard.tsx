// src/story-v02/components/EpisodeSummaryCard.tsx
// Abschluss-Karte die direkt im Messenger-Feed erscheint (kein Fullscreen-Modal).
// Gleicher Look wie die ehemalige EpisodeCelebrationModal, aber als Inline-Karte.

import { useEffect, useState } from 'react';
import { assetUrl } from '../../common/assetUrl';

// ---------------------------------------------------------------------------
// Sticker mit Bounce-Pop-Animation
// ---------------------------------------------------------------------------

function StickerReveal({ src }: { src?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        transition: visible
          ? 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease'
          : 'none',
        transform: visible ? 'scale(1)' : 'scale(0.25)',
        opacity: visible ? 1 : 0,
      }}
    >
      {src ? (
        <img
          src={src}
          alt="Sticker"
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl drop-shadow-xl"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="text-7xl select-none">🏆</div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

type Props = {
  episodeTitle?: string;
  stickerImage?: string;
  bonusCoins?: number;
  onViewSticker: () => void;
  onContinue: () => void;
  onProfile?: () => void;
};

export default function EpisodeSummaryCard({
  episodeTitle,
  stickerImage,
  bonusCoins = 5,
  onViewSticker,
  onContinue,
  onProfile,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const stickerSrc = stickerImage ? assetUrl(stickerImage) : undefined;

  return (
    <div
      className="my-4 mx-1 rounded-3xl overflow-hidden shadow-xl"
      style={{
        transition: 'transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.35s ease',
        transform: mounted ? 'scale(1)' : 'scale(0.85)',
        opacity: mounted ? 1 : 0,
        background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%)',
      }}
    >
      {/* Konfetti-Dekoration */}
      <div className="relative overflow-hidden px-5 pt-6 pb-5">
        {/* Hintergrund-Sterne */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden
          style={{ fontSize: 18, lineHeight: 1, opacity: 0.18 }}
        >
          {['⭐', '✨', '🌟', '⭐', '✨', '🌟', '⭐', '✨'].map((s, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${[8, 20, 35, 50, 62, 75, 85, 92][i]}%`,
                top: `${[10, 60, 20, 70, 15, 55, 30, 75][i]}%`,
              }}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="relative flex flex-col items-center gap-4 text-center">
          {/* Stars */}
          <div className="text-2xl select-none tracking-widest">⭐ ⭐ ⭐</div>

          {/* Sticker */}
          <StickerReveal src={stickerSrc} />

          {/* Title */}
          <div className="space-y-1.5">
            <div className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {episodeTitle ? `${episodeTitle} geschafft!` : 'Episode abgeschlossen!'}
            </div>
            <div className="text-sm text-violet-200 font-semibold">
              🎉 Super gemacht! Dein Sticker wartet im Sammelalbum.
            </div>
          </div>

          {/* Bonus Coins Badge */}
          {bonusCoins > 0 && (
            <div className="flex items-center gap-1.5 rounded-2xl bg-amber-400/20 border border-amber-400/40 px-4 py-2">
              <img
                src={assetUrl('media/story/ui/coin-128.webp')}
                alt=""
                className="w-5 h-5"
              />
              <span className="text-sm font-extrabold text-amber-200">
                +{bonusCoins} Bonus-Coins
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-2.5 w-full mt-1">
            <button
              type="button"
              onClick={onViewSticker}
              className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-violet-900 shadow-md hover:bg-violet-50 active:scale-95 transition-transform"
            >
              Sticker ansehen ✨
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="w-full rounded-2xl border-2 border-violet-400 bg-transparent px-5 py-3 text-sm font-semibold text-violet-100 hover:bg-violet-800/50 active:scale-95 transition-transform"
            >
              Zur Story-Liste →
            </button>
            {onProfile && (
              <button
                type="button"
                onClick={onProfile}
                className="w-full rounded-2xl border border-violet-400/40 bg-transparent px-5 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-800/30 active:scale-95 transition-transform"
              >
                Profil &amp; Bonuswelt →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
