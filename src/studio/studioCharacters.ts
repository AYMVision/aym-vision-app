import { assetUrl } from '../common/assetUrl';

export type StudioCharacter = {
  id: string;
  name: string;
  avatarFile: string; // just the filename, use assetUrl('media/story/characters/' + file)
};

export const AMY_CHARACTER: StudioCharacter = {
  id: 'amy', name: 'Amy', avatarFile: 'amy-256.webp',
};

export const STUDIO_MAIN_CHARACTERS: StudioCharacter[] = [
  { id: 'mia', name: 'Mia', avatarFile: 'mia-256.webp' },
  { id: 'chioma', name: 'Chioma', avatarFile: 'chioma-256.webp' },
  { id: 'carlos', name: 'Carlos', avatarFile: 'carlos-256.webp' },
  { id: 'yasmin', name: 'Yasmin', avatarFile: 'yasmin-256.webp' },
  { id: 'igor', name: 'Igor', avatarFile: 'igor-256.webp' },
  { id: 'finn', name: 'Finn', avatarFile: 'finn-256.webp' },
  { id: 'dominik', name: 'Dominik', avatarFile: 'dominik-256.webp' },
  { id: 'jonas', name: 'Jonas', avatarFile: 'jonas-256.webp' },
  { id: 'tom', name: 'Tom', avatarFile: 'tom-256.webp' },
  { id: 'lukas', name: 'Lukas', avatarFile: 'lukas-256.webp' },
  { id: 'lisa', name: 'Lisa', avatarFile: 'lisa-256.webp' },
  { id: 'aylin', name: 'Aylin', avatarFile: 'aylin-256.webp' },
];

export const STUDIO_EXTRA_CHARACTERS: StudioCharacter[] = [
  { id: 'markus', name: 'Markus', avatarFile: 'markus-256.webp' },
  { id: 'amir', name: 'Amir', avatarFile: 'amir-256.webp' },
  { id: 'farida', name: 'Farida', avatarFile: 'farida-256.webp' },
  { id: 'noah', name: 'Noah', avatarFile: 'noah-256.webp' },
  { id: 'emma', name: 'Emma', avatarFile: 'emma-256.webp' },
  { id: 'elsa', name: 'Elsa', avatarFile: 'elsa-256.webp' },
];

export const CHARACTER_BG: Record<string, string> = {
  amy: 'bg-violet-100 border-violet-200',
  mia: 'bg-rose-100 border-rose-200',
  chioma: 'bg-amber-100 border-amber-200',
  carlos: 'bg-sky-100 border-sky-200',
  yasmin: 'bg-emerald-100 border-emerald-200',
  igor: 'bg-slate-200 border-slate-300',
  finn: 'bg-indigo-100 border-indigo-200',
  dominik: 'bg-orange-100 border-orange-200',
  jonas: 'bg-teal-100 border-teal-200',
  tom: 'bg-lime-100 border-lime-200',
  lukas: 'bg-cyan-100 border-cyan-200',
  lisa: 'bg-pink-100 border-pink-200',
  aylin: 'bg-purple-100 border-purple-200',
  markus: 'bg-stone-200 border-stone-300',
  amir: 'bg-yellow-100 border-yellow-200',
  farida: 'bg-red-100 border-red-200',
  noah: 'bg-blue-100 border-blue-200',
  emma: 'bg-green-100 border-green-200',
  elsa: 'bg-violet-50 border-violet-200',
};

export function getCharacterById(id: string): StudioCharacter | undefined {
  if (id === 'amy') return AMY_CHARACTER;
  return [...STUDIO_MAIN_CHARACTERS, ...STUDIO_EXTRA_CHARACTERS].find(c => c.id === id);
}

export function characterAvatarUrl(avatarFile: string): string {
  return assetUrl('media/story/characters/' + avatarFile);
}
