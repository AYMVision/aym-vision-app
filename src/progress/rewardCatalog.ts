export type SpecialStickerMeta = {
  id: string;
  title: string;
  image: string;
};

export type BadgeMeta = {
  id: string;
  title: string;
  image: string;
};

export const SPECIAL_STICKERS: SpecialStickerMeta[] = [
  {
    id: 'starter-first-5',
    title: 'Mega. Du hast die ersten 5 Tage erfolgreich gemeistert!',
    image: 'media/stickers/badges/starter-first-5-512.webp',
  },
];

export const SPECIAL_BADGES: BadgeMeta[] = [
  {
    id: 'weekly-streak-5',
    title: '5-Day Streak',
    image: 'media/stickers/badges/weekly-streak-5-512.webp',
  },
];