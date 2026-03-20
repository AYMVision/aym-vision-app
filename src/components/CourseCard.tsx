// src/components/CourseCard.tsx

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SmartImage, { type SrcCandidate } from './SmartImage';
import { assetUrl } from '../common/assetUrl';

interface Props {
  title: string;
  description: string;

  image: string;

  imageAvif?: SrcCandidate[];
  imageWebp?: SrcCandidate[];
  imageFallback?: string;

  className?: string;

  progressPercent?: number;
  locked?: boolean;
  onClick: () => void;

  compact?: boolean;
}

const LOCKED_FALLBACK = {
  avif: [
    { src: assetUrl('media/ui/locked-512.avif'), w: 512 },
    { src: assetUrl('media/ui/locked-1024.avif'), w: 1024 },
  ],
  webp: [
    { src: assetUrl('media/ui/locked-512.webp'), w: 512 },
    { src: assetUrl('media/ui/locked-1024.webp'), w: 1024 },
  ],
  fallback: assetUrl('media/ui/locked-1024.webp'),
};

export default function CourseCard({
  title,
  description,
  image,
  imageAvif,
  imageWebp,
  imageFallback,
  className,
  progressPercent,
  locked = false,
  onClick,
  compact = false,
}: Props) {
  const { t } = useTranslation('courses');

  const pct = useMemo(() => {
    const raw = Math.floor(progressPercent ?? 0);
    return Math.max(0, Math.min(100, raw));
  }, [progressPercent]);

  const state = useMemo(() => {
    if (locked) {
      return { label: t('locked', { defaultValue: 'Gesperrt' }), color: 'bg-slate-100 text-slate-700' };
    }
    if (pct >= 100) return { label: t('done', { defaultValue: 'Fertig' }), color: 'bg-emerald-100 text-emerald-800' };
    if (pct > 0) return { label: t('inProgress', { defaultValue: 'In Arbeit' }), color: 'bg-amber-100 text-amber-800' };
    return { label: t('new', { defaultValue: 'Neu' }), color: 'bg-indigo-100 text-indigo-800' };
  }, [locked, pct, t]);

  const showProgressBar = !locked && (pct > 0 || pct === 100);

const effectiveAvif = imageAvif;
const effectiveWebp = imageWebp;
const effectiveFallback = imageFallback ?? image;

  // ✅ COMPACT = Modern Game Tile (kein Text auf Bild, kein Stretch, sauberer Body)
  if (compact) {
    return (
      <button
        type="button"
        onClick={() => {
          if (locked) return;
          onClick();
        }}
        disabled={locked}
        className={[
          'w-full h-full text-left rounded-2xl border border-black/5 bg-white shadow-sm overflow-hidden',
          locked ? 'cursor-not-allowed' : 'cursor-pointer transition hover:shadow-md hover:scale-[1.01] focus:outline-none',
          className ?? '',
        ].join(' ')}
      >
        <div className="h-full flex flex-col">
          {/* Image (fixed ratio, never distorted) */}
<div className="relative w-full aspect-[16/9] bg-slate-100 overflow-hidden">
  <SmartImage
    alt={title}
    className={[
      "absolute inset-0 w-full h-full object-cover transition",
      locked ? "blur-[3px] scale-105" : ""
    ].join(" ")}
    sizes="(min-width: 1024px) 380px, 80vw"
    avif={effectiveAvif}
    webp={effectiveWebp}
    fallback={effectiveFallback}
    loading="lazy"
    decoding="async"
  />

  {/* leichter Weiß-Overlay wenn locked */}
  {locked && (
    <div className="absolute inset-0 bg-white/60" />
  )}

</div>

          {/* Body fills remaining space (no empty white bottom) */}
          <div className="flex-1 min-h-0 p-4 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {/* Title always visible (1 line) */}
                <div className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug truncate">
                  {title}
                </div>
                {/* Description visible (2 lines) */}
                <div className="mt-1 text-sm text-slate-600 leading-snug line-clamp-4">
                  {description}
                </div>
              </div>

              <span className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${state.color}`}>
                {state.label}
              </span>
            </div>

            {/* Spacer pushes progress to bottom neatly */}
            <div className="flex-1" />

            {showProgressBar ? (
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>{t('progress', { defaultValue: 'Fortschritt' })}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={pct === 100 ? 'h-2 rounded-full bg-emerald-500' : 'h-2 rounded-full bg-[#0084ff]'}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ) : (
              // tiny footer line so it still feels "filled" even at 0%
              <div className="mt-3 h-2 w-full rounded-full bg-slate-100" />
            )}
          </div>
        </div>
      </button>
    );
  }

  // ✅ DEFAULT (non-compact) – dein Listenlayout
  const cardPadding = 'p-5 sm:p-6';
  const titleSize = 'text-lg';
  const descClamp = 'line-clamp-3';

  return (
    <button
      type="button"
      onClick={() => {
        if (locked) return;
        onClick();
      }}
      disabled={locked}
      className={[
        `w-full h-full text-left rounded-2xl border border-black/5 bg-white shadow-sm ${cardPadding} flex flex-col gap-3`,
        className ?? '',
        locked
          ? 'cursor-not-allowed'
          : 'cursor-pointer transition hover:shadow-md hover:scale-[1.01] focus:outline-none',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-50">
<SmartImage
  alt={title}
  className="w-full h-full object-cover"
  sizes="96px"
  avif={effectiveAvif}
  webp={effectiveWebp}
  fallback={effectiveFallback}
  loading="lazy"
  decoding="async"
/>

{locked && (
  <>
    <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />
    <div className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-extrabold text-slate-700 border border-slate-200">
      🔒 {t('locked', { defaultValue: 'Gesperrt' })}
    </div>
  </>
)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className={`${titleSize} font-bold text-anthracite-950 leading-snug`}>
                {title}
              </div>
              <div className={`mt-1 text-sm text-slate-600 leading-snug ${descClamp}`}>
                {description}
              </div>
            </div>

            <div className="shrink-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${state.color}`}>
                {state.label}
                {!locked && showProgressBar && <span className="ml-2 text-[11px] opacity-80">{pct}%</span>}
              </span>
            </div>
          </div>

          {showProgressBar && (
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={pct === 100 ? 'h-2 rounded-full bg-emerald-500' : 'h-2 rounded-full bg-[#0084ff]'}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
