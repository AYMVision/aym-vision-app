// src/components/AvatarFullImage.tsx
// Rendert ein Full-Body-Avatarbild (AVIF/WebP + Fallback)
// Asset-Struktur:
// /public/media/avatars/full/
//   ├─ {id}-384.avif | .webp
//   ├─ {id}-768.avif | .webp
//   └─ default-384.avif | .webp   (Fallback wenn id leer oder Datei fehlt)
// WICHTIG: Für jede ID in AVATAR_BASES müssen die 4 Dateien existieren:
//   {id}-384.avif, {id}-384.webp, {id}-768.avif, {id}-768.webp

import SmartImage from './SmartImage';
import { assetUrl } from '../common/assetUrl';

type AvatarFullImageProps = {
  /** Avatar-ID ohne Größen-/Format-Suffix (z. B. "amy") */
  id?: string;

  /** Zielbreite in px (für sizes + width) */
  width?: number;

  /** Optional: feste Höhe (CLS-Vermeidung) */
  height?: number;

  alt?: string;
  className?: string;

  /** Für Above-the-fold ggf. "eager" */
  loading?: 'lazy' | 'eager';
};

const BASE_PATH = 'media/avatars/full';
const DEFAULT_ID = 'default';

export default function AvatarFullImage({
  id,
  width = 280,
  height,
  alt = 'Fullbody Avatar',
  className = '',
  loading = 'lazy',
}: AvatarFullImageProps) {
  const safeId = (id?.trim() || DEFAULT_ID).toLowerCase();

  return (
    <SmartImage
      alt={alt}
      className={className}
      sizes={`${width}px`}
      width={width}
      height={height}
      avif={[
        { src: assetUrl(`${BASE_PATH}/${safeId}-384.avif`), w: 384 },
        { src: assetUrl(`${BASE_PATH}/${safeId}-768.avif`), w: 768 },
      ]}
      webp={[
        { src: assetUrl(`${BASE_PATH}/${safeId}-384.webp`), w: 384 },
        { src: assetUrl(`${BASE_PATH}/${safeId}-768.webp`), w: 768 },
      ]}
      /** Fallback MUSS immer existieren */
      fallback={assetUrl(`${BASE_PATH}/${safeId}-384.webp`)}
      onErrorFallback={assetUrl(`${BASE_PATH}/${DEFAULT_ID}-384.webp`)}
      loading={loading}
      decoding="async"
    />
  );
}
