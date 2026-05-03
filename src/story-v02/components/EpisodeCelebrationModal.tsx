// src/story-v02/components/EpisodeCelebrationModal.tsx
// Vollbild-Feier wenn eine Episode abgeschlossen wurde.
// Konfetti + Sticker-Reveal + Buttons.

import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../../common/assetUrl';

// ---------------------------------------------------------------------------
// Konfetti-Partikel
// ---------------------------------------------------------------------------

const CONFETTI_COLORS = [
  '#f43f5e', '#fb923c', '#facc15', '#4ade80',
  '#38bdf8', '#818cf8', '#e879f9', '#fb7185',
];

const CONFETTI_SHAPES: Array<'circle' | 'square' | 'star'> = ['circle', 'square', 'star'];

type Particle = {
  id: number;
  x: number;       // % from left
  delay: number;   // s
  duration: number; // s
  size: number;    // px
  color: string;
  shape: 'circle' | 'square' | 'star';
  rotate: number;
};

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.8,
    duration: 2.2 + Math.random() * 1.6,
    size: 8 + Math.floor(Math.random() * 10),
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
    rotate: Math.random() * 360,
  }));
}

function ConfettiParticle({ p }: { p: Particle }) {
  const starPath =
    'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z';

  const sharedStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${p.x}%`,
    top: '-20px',
    width: p.size,
    height: p.size,
    backgroundColor: p.shape !== 'star' ? p.color : 'transparent',
    borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '2px' : '0',
    animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
    transform: `rotate(${p.rotate}deg)`,
  };

  if (p.shape === 'star') {
    return (
      <svg
        style={{ ...sharedStyle, backgroundColor: 'transparent', overflow: 'visible' }}
        viewBox="0 0 24 24"
        fill={p.color}
      >
        <path d={starPath} />
      </svg>
    );
  }

  return <div style={sharedStyle} />;
}

// ---------------------------------------------------------------------------
// Sticker-Bild mit Bounce-Pop
// ---------------------------------------------------------------------------

function StickerReveal({ src, fallbackEmoji }: { src?: string; fallbackEmoji?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="flex items-center justify-center"
      style={{
        transition: visible
          ? 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease'
          : 'none',
        transform: visible ? 'scale(1)' : 'scale(0.3)',
        opacity: visible ? 1 : 0,
      }}
    >
      {src ? (
        <img
          src={src}
          alt="Sticker"
          className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl drop-shadow-2xl"
          onError={(e) => {
            // Fallback: hide img if missing
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="text-9xl select-none">{fallbackEmoji ?? '🏆'}</div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

type Props = {
  episodeTitle?: string;
  stickerImage?: string;       // e.g. 'media/stickers/episodes/s1e01-512.webp'
  onViewSticker: () => void;   // → navigate to StickerAlbum
  onContinue: () => void;      // → navigate home/next
};

export default function EpisodeCelebrationModal({
  episodeTitle,
  stickerImage,
  onViewSticker,
  onContinue,
}: Props) {
  const [particles] = useState(() => makeParticles(52));
  const containerRef = useRef<HTMLDivElement>(null);

  const stickerSrc = stickerImage ? assetUrl(stickerImage) : undefined;

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg) scale(0.6); opacity: 0; }
        }
        @keyframes celebration-slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center px-4"
        style={{ background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)' }}
      >
        {/* Konfetti-Layer */}
        <div
          ref={containerRef}
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {particles.map((p) => (
            <ConfettiParticle key={p.id} p={p} />
          ))}
        </div>

        {/* Content card */}
        <div
          className="relative z-10 flex flex-col items-center gap-5 text-center max-w-sm w-full"
          style={{ animation: 'celebration-slide-up 0.5s ease both' }}
        >
          {/* Stars decoration */}
          <div className="text-3xl select-none">⭐ ⭐ ⭐</div>

          {/* Sticker */}
          <StickerReveal src={stickerSrc} fallbackEmoji="🏆" />

          {/* Texts */}
          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {episodeTitle
                ? `${episodeTitle} geschafft!`
                : 'Episode abgeschlossen!'}
            </div>
            <div className="text-base text-violet-200 font-semibold">
              🎉 Super gemacht! Dein Sticker wartet im Sammelalbum.
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 w-full mt-2">
            <button
              type="button"
              onClick={onViewSticker}
              className="w-full rounded-2xl bg-white px-6 py-3 text-base font-extrabold text-violet-900 shadow-lg hover:bg-violet-50 active:scale-95 transition-transform"
            >
              Sticker ansehen ✨
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="w-full rounded-2xl border-2 border-violet-400 bg-transparent px-6 py-3 text-base font-semibold text-violet-100 hover:bg-violet-800 active:scale-95 transition-transform"
            >
              Weiter
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
