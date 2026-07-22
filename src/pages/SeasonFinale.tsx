// src/pages/SeasonFinale.tsx
// Season-1-Finale: Feier-Seite nach Abschluss aller fünf Episoden.
// Wird nach dem EpisodeSummaryCard von s1e05 aufgerufen.

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { assetUrl } from '../common/assetUrl';
import { useProfile } from '../profile/useProfile';

// Alle fünf Staffel-1-Sticker (256px reicht für die Collage)
const S1_STICKERS = [
  'media/stickers/episodes/s1e01-256.webp',
  'media/stickers/episodes/s1e02-256.webp',
  'media/stickers/episodes/s1e03-256.webp',
  'media/stickers/episodes/s1e04-256.webp',
  'media/stickers/episodes/s1e05-256.webp',
];

// Feste Sternpositionen (kein Math.random — deterministisch)
const STARS: { left: number; top: number; size: number; opacity: number }[] = [
  { left: 5,  top: 8,  size: 2, opacity: 0.25 },
  { left: 14, top: 42, size: 3, opacity: 0.18 },
  { left: 22, top: 75, size: 2, opacity: 0.30 },
  { left: 30, top: 20, size: 2, opacity: 0.20 },
  { left: 40, top: 62, size: 3, opacity: 0.15 },
  { left: 50, top: 5,  size: 2, opacity: 0.28 },
  { left: 58, top: 85, size: 2, opacity: 0.22 },
  { left: 67, top: 33, size: 3, opacity: 0.18 },
  { left: 75, top: 55, size: 2, opacity: 0.25 },
  { left: 83, top: 15, size: 2, opacity: 0.20 },
  { left: 91, top: 70, size: 3, opacity: 0.15 },
  { left: 96, top: 40, size: 2, opacity: 0.30 },
  { left: 10, top: 58, size: 2, opacity: 0.18 },
  { left: 18, top: 92, size: 2, opacity: 0.22 },
  { left: 35, top: 3,  size: 3, opacity: 0.17 },
  { left: 46, top: 80, size: 2, opacity: 0.25 },
  { left: 53, top: 28, size: 2, opacity: 0.20 },
  { left: 71, top: 95, size: 2, opacity: 0.15 },
  { left: 79, top: 48, size: 3, opacity: 0.18 },
  { left: 88, top: 7,  size: 2, opacity: 0.25 },
  { left: 7,  top: 30, size: 2, opacity: 0.22 },
  { left: 27, top: 50, size: 3, opacity: 0.17 },
  { left: 62, top: 12, size: 2, opacity: 0.20 },
  { left: 93, top: 60, size: 2, opacity: 0.28 },
];

function StickerPop({ src, delay }: { src: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(id);
  }, [delay]);

  return (
    <div
      style={{
        transition: visible
          ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease'
          : 'none',
        transform: visible ? 'scale(1) rotate(0deg)' : 'scale(0.1) rotate(-20deg)',
        opacity: visible ? 1 : 0,
      }}
    >
      <img
        src={assetUrl(src)}
        alt=""
        className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-lg"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
    </div>
  );
}

export default function SeasonFinale() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { profile } = useProfile();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const audioPlays = useRef(0);
  const videoPlays = useRef(0);
  const chatName = profile.chatName?.trim() || null;

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 120);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }
    return () => clearTimeout(id);
  }, []);

  function handleAudioEnded() {
    audioPlays.current += 1;
    if (audioPlays.current < 2 && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }

  function handleVideoEnded() {
    videoPlays.current += 1;
    if (videoPlays.current < 3 && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }

  return (
    <div
      className="min-h-screen relative flex flex-col"
      style={{ background: 'linear-gradient(165deg, #0f0c29 0%, #302b63 55%, #1a1040 100%)' }}
    >
      {/* Musik */}
      <audio
        ref={audioRef}
        src={assetUrl('media/ui/Sound/happy-kids-background.mp3')}
        preload="auto"
        onEnded={handleAudioEnded}
      />

      {/* Sterne-Hintergrund */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: s.opacity }}
          />
        ))}
        {/* Decorative glow blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Zurück-Button (dezent oben links) */}
      <div className="relative z-10 pt-safe pt-4 px-4">
        <button
          type="button"
          onClick={() => navigate('/stories')}
          className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-200 transition-colors"
        >
          ← {t('back', { defaultValue: 'Zurück' })}
        </button>
      </div>

      {/* Hauptinhalt */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-6 pb-16 gap-7 max-w-lg mx-auto w-full">

        {/* Badge + Headline */}
        <div
          className="text-center"
          style={{
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(18px)',
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-900/50 px-3 py-1 mb-3">
            <span className="text-xs font-extrabold tracking-widest text-violet-300 uppercase">
              {t('seasonFinale.badge', { defaultValue: 'Staffel 1 · Abschluss' })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
            {t('seasonFinale.headline', { defaultValue: 'Ihr habt es geschafft!' })}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-violet-300 leading-relaxed">
            {t('seasonFinale.subline', { defaultValue: 'Alle fünf Folgen. Alle Herausforderungen. Durchgedacht.' })}
          </p>
        </div>

        {/* Video */}
        <div
          className="w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          style={{
            transition: 'opacity 0.8s ease 0.2s',
            opacity: mounted ? 1 : 0,
          }}
        >
          <video
            ref={videoRef}
            src={assetUrl('media/story/episodes/staffel1-feier.mp4')}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* ⭐⭐⭐ */}
        <div
          className="text-3xl tracking-widest select-none"
          style={{
            transition: 'opacity 0.6s ease 0.5s',
            opacity: mounted ? 1 : 0,
          }}
        >
          ⭐ ⭐ ⭐
        </div>

        {/* Sticker-Collage */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="text-xs font-extrabold text-violet-400 uppercase tracking-widest"
            style={{ transition: 'opacity 0.6s ease 0.6s', opacity: mounted ? 1 : 0 }}
          >
            {t('seasonFinale.yourStickers', { defaultValue: 'Deine Sticker dieser Staffel' })}
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            {S1_STICKERS.map((src, i) => (
              <StickerPop key={src} src={src} delay={700 + i * 180} />
            ))}
          </div>
        </div>

        {/* Amy-Nachricht */}
        <div
          className="w-full flex items-start gap-3"
          style={{
            transition: 'opacity 0.6s ease 1.8s, transform 0.6s ease 1.8s',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(10px)',
          }}
        >
          <img
            src={assetUrl('media/story/characters/amy-256.webp')}
            alt="Amy"
            className="w-10 h-10 rounded-full object-cover object-top border-2 border-violet-400/50 flex-shrink-0 mt-1 shadow-lg"
          />
          <div className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl rounded-tl-none px-4 py-3 shadow-md">
            <p className="text-sm text-white leading-relaxed">
              {chatName
                ? t('seasonFinale.amyMessage', {
                    name: chatName,
                    defaultValue: `Ich bin stolz auf dich, ${chatName}. 🦉 Du hast durchgehalten, mitgedacht und echte Entscheidungen getroffen — auch wenn es nicht einfach war. Das zählt.`,
                  })
                : t('seasonFinale.amyMessageNoName', {
                    defaultValue: 'Ich bin stolz auf dich. 🦉 Du hast durchgehalten, mitgedacht und echte Entscheidungen getroffen — auch wenn es nicht einfach war. Das zählt.',
                  })}
            </p>
          </div>
        </div>

        {/* Charakter-Teaser */}
        <div
          className="w-full rounded-2xl border border-violet-500/25 bg-white/5 backdrop-blur-sm px-4 py-4"
          style={{
            transition: 'opacity 0.6s ease 2.5s',
            opacity: mounted ? 1 : 0,
          }}
        >
          <div className="flex items-center gap-3 mb-2.5">
            <div className="flex -space-x-2 flex-shrink-0">
              {['yasmin', 'carlos', 'chioma'].map((ch) => (
                <img
                  key={ch}
                  src={assetUrl(`media/story/characters/${ch}-256.webp`)}
                  alt={ch}
                  className="w-8 h-8 rounded-full object-cover object-top border-2 border-violet-900/80 shadow-sm"
                />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-violet-900/80 bg-violet-700/80 flex items-center justify-center text-[10px] font-extrabold text-white">
                +3
              </div>
            </div>
            <span className="text-xs font-extrabold text-violet-400 uppercase tracking-wider">
              {t('seasonFinale.teaserLabel', { defaultValue: 'Was kommt als Nächstes?' })}
            </span>
          </div>
          <p className="text-sm font-semibold text-white leading-snug">
            {t('seasonFinale.teaserQuestion', { defaultValue: 'Welche Geheimnisse haben Yasmin, Carlos & Co. noch?' })}
          </p>
          <p className="text-xs text-violet-300 mt-1 leading-snug">
            {t('seasonFinale.teaserSub', { defaultValue: 'Ihre Geschichte hat gerade erst begonnen.' })}
          </p>
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col gap-3 w-full"
          style={{
            transition: 'opacity 0.6s ease 3s',
            opacity: mounted ? 1 : 0,
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/album')}
            className="w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-extrabold text-violet-900 shadow-lg hover:bg-violet-50 active:scale-95 transition-transform"
          >
            {t('seasonFinale.ctaAlbum', { defaultValue: 'Alle Sticker ansehen ✨' })}
          </button>
          <button
            type="button"
            onClick={() => navigate('/stories')}
            className="w-full rounded-2xl border-2 border-violet-500/70 bg-transparent px-5 py-3 text-sm font-semibold text-violet-200 hover:bg-violet-800/50 active:scale-95 transition-transform"
          >
            {t('seasonFinale.ctaStories', { defaultValue: 'Zur Übersicht →' })}
          </button>
        </div>

        {/* Credits */}
        <p className="text-[10px] text-violet-600/70 text-center leading-relaxed mt-2">
          {t('seasonFinale.musicCredit', {
            defaultValue:
              'Musik: „Happy Kids Background Music" von BombinSound · Pixabay Content License',
          })}
        </p>

      </div>
    </div>
  );
}
