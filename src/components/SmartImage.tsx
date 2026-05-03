// src/components/SmartImage.tsx
import React, { useRef } from 'react';

export type SrcCandidate = { src: string; w: number };

type SmartImageProps = {
  alt: string;
  className?: string;
  sizes?: string;

  width?: number;
  height?: number;
  style?: React.CSSProperties;

  avif?: SrcCandidate[];
  webp?: SrcCandidate[];

  fallback: string;
  onErrorFallback?: string;

   onError?: () => void;

  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
};

function toSrcSet(list?: SrcCandidate[]) {
  if (!list?.length) return undefined;
  return list.map((c) => `${c.src} ${c.w}w`).join(', ');
}

export default function SmartImage({
  alt,
  className,
  sizes,
  width,
  height,
  style,
  avif,
  webp,
  fallback,
  onErrorFallback,
  onError,
  loading = 'lazy',
  decoding = 'async',
}: SmartImageProps) {
  const avifSet = toSrcSet(avif);
  const webpSet = toSrcSet(webp);

  const swappedRef = useRef(false);

  return (
    <picture>
      {avifSet ? <source type="image/avif" srcSet={avifSet} sizes={sizes} /> : null}
      {webpSet ? <source type="image/webp" srcSet={webpSet} sizes={sizes} /> : null}

      <img
        src={fallback}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        style={style}
onError={(e) => {
  // 1) Aufrufer informieren (z.B. StickerTile -> 🎁 anzeigen)
  onError?.();

  // 2) Wenn der Aufrufer selbst reagiert (Emoji etc.), NICHT weiter swappen.
  //    Sonst entstehen extra Requests / kaputtes Bild-Geflimmer.
  if (onError) return;

  // 3) Optionaler interner Swap (nur wenn KEIN onError-Callback übergeben wurde)
  if (!onErrorFallback) return;
  if (swappedRef.current) return;
  swappedRef.current = true;
  e.currentTarget.src = onErrorFallback;
}}


      />
    </picture>
  );
}
