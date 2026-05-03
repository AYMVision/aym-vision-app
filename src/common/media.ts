// src/common/media.ts
// Central asset path helpers (public/media/..)
// Use these if you want consistent paths everywhere.

export type ImgSize = 256 | 512 | 768 | 1024;

export function characterImg(id: string, size: ImgSize) {
  return {
    avif: `media/characters/${id}/${size}.avif`,
    webp: `media/characters/${id}/${size}.webp`,
  };
}

export function episodeCover(episodeId: string, size: ImgSize) {
  return {
    avif: `media/story/episodes/${episodeId}/${episodeId}-${size}.avif`,
    webp: `media/story/episodes/${episodeId}/${episodeId}-${size}.webp`,
  };
}

export function episodeImage(episodeId: string, fileBase: string, size: ImgSize) {
  return {
    avif: `media/story/episodes/${episodeId}/images/${fileBase}-${size}.avif`,
    webp: `media/story/episodes/${episodeId}/images/${fileBase}-${size}.webp`,
  };
}
