import { assetUrl } from './assetUrl';

export type ImageCandidate = { src: string; w: number };

export type AvatarImageSet = {
  avif: ImageCandidate[];
  webp: ImageCandidate[];
  fallback: string;
  onErrorFallback: string;
};

const DEFAULT_AVATAR_ID = 'default';

/**
 * Liefert IMMER ein vollständiges, TS-sicheres Avatar-Set
 * Ordnerstruktur:
 * public/media/characters/{id}.{size}.avif|webp
 */
export function getCharacterAvatar(
  avatarId?: string,
  size: 256 | 512 = 256
): AvatarImageSet {
  const id = (avatarId?.trim() || DEFAULT_AVATAR_ID).toLowerCase();

  return {
    avif: [
      {
        src: assetUrl(`media/characters/${id}.${size}.avif`),
        w: size,
      },
    ],
    webp: [
      {
        src: assetUrl(`media/characters/${id}.${size}.webp`),
        w: size,
      },
    ],
    fallback: assetUrl(`media/characters/${id}.${size}.webp`),
    onErrorFallback: assetUrl(`media/characters/${DEFAULT_AVATAR_ID}.${size}.webp`),
  };
}
