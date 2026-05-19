import type { ItemSlot, Inventory, Equipment } from '../profile/types';

export type ItemDef = {
  id: string;
  slot: ItemSlot;
  starter?: boolean;
  shopPrice?: number;
  labelKey?: string;
};

export const ITEMS: ItemDef[] = [
  // 🎒 Featured / Gegenstände
  {
    id: 'item_backpack_amy',
    slot: 'featured',
    starter: true,
    labelKey: 'items.backpackAmy',
  },
  {
    id: 'item_backpack',
    slot: 'featured',
    shopPrice: 8,
    labelKey: 'items.backpack',
  },
  {
    id: 'item_ballet-pointe-shoes',
    slot: 'featured',
    shopPrice: 15,
    labelKey: 'items.balletPointeShoes',
  },
  {
    id: 'item_book',
    slot: 'featured',
    shopPrice: 5,
    labelKey: 'items.book',
  },
  {
    id: 'item_color-palette',
    slot: 'featured',
    shopPrice: 8,
    labelKey: 'items.colorPalette',
  },
  {
    id: 'item_comics',
    slot: 'featured',
    shopPrice: 7,
    labelKey: 'items.comics',
  },
  {
    id: 'item_e-guitar',
    slot: 'featured',
    shopPrice: 25,
    labelKey: 'items.eGuitar',
  },
  {
    id: 'item_equestrian-helmet',
    slot: 'featured',
    shopPrice: 12,
    labelKey: 'items.equestrianHelmet',
  },
  {
    id: 'item_guitar',
    slot: 'featured',
    shopPrice: 25,
    labelKey: 'items.guitar',
  },
  {
    id: 'item_headphones',
    slot: 'featured',
    shopPrice: 18,
    labelKey: 'items.headphones',
  },
  {
    id: 'item_ice-scates_white',
    slot: 'featured',
    shopPrice: 20,
    labelKey: 'items.iceScatesWhite',
  },
  {
    id: 'item_ice-skates_black',
    slot: 'featured',
    shopPrice: 20,
    labelKey: 'items.iceSkatesBlack',
  },
  {
    id: 'item_microphone',
    slot: 'featured',
    shopPrice: 9,
    labelKey: 'items.microphone',
  },
  {
    id: 'item_mountain-bike',
    slot: 'featured',
    shopPrice: 25,
    labelKey: 'items.mountainBike',
  },
  {
    id: 'item_pet-cat',
    slot: 'featured',
    shopPrice: 18,
    labelKey: 'items.petCat',
  },
  {
    id: 'item_pet-dog',
    slot: 'featured',
    shopPrice: 18,
    labelKey: 'items.petDog',
  },
  {
    id: 'item_plush-dog',
    slot: 'featured',
    shopPrice: 15,
    labelKey: 'items.plushDog',
  },
  {
    id: 'item_riding-boots',
    slot: 'featured',
    shopPrice: 15,
    labelKey: 'items.ridingBoots',
  },
  {
    id: 'item_rollerblades',
    slot: 'featured',
    shopPrice: 20,
    labelKey: 'items.rollerblades',
  },
  {
    id: 'item_scooter',
    slot: 'featured',
    shopPrice: 12,
    labelKey: 'items.scooter',
  },
  {
    id: 'item_skateboard',
    slot: 'featured',
    shopPrice: 16,
    labelKey: 'items.skateboard',
  },
  {
    id: 'item_soccer-ball',
    slot: 'featured',
    shopPrice: 8,
    labelKey: 'items.soccerBall',
  },
  {
    id: 'item_teddy-bear',
    slot: 'featured',
    shopPrice: 7,
    labelKey: 'items.teddyBear',
  },
  {
    id: 'item_tennis-racket_purple',
    slot: 'featured',
    shopPrice: 20,
    labelKey: 'items.tennisRacketPurple',
  },
  {
    id: 'item_violin',
    slot: 'featured',
    shopPrice: 25,
    labelKey: 'items.violin',
  },

  // 🖼 Hintergründe
  {
    id: 'baumhaus_1',
    slot: 'background',
    shopPrice: 7,
    labelKey: 'items.baumhaus1',
  },
  {
    id: 'berge_1',
    slot: 'background',
    shopPrice: 7,
    labelKey: 'items.berge1',
  },
  {
    id: 'camping_1',
    slot: 'background',
    shopPrice: 7,
    labelKey: 'items.camping1',
  },
  {
    id: 'city_1',
    slot: 'background',
    shopPrice: 7,
    labelKey: 'items.city1',
  },
  {
    id: 'flower_1',
    slot: 'background',
    shopPrice: 7,
    labelKey: 'items.flower1',
  },
  {
    id: 'forest_1',
    slot: 'background',
    starter: true,
    labelKey: 'items.forest1',
  },
  {
    id: 'magischer_Schulhof_1',
    slot: 'background',
    shopPrice: 7,
    labelKey: 'items.magischerSchulhof1',
  },
  {
    id: 'park_1',
    slot: 'background',
    shopPrice: 7,
    labelKey: 'items.park1',
  },
  {
    id: 'see-winter_1',
    slot: 'background',
    shopPrice: 7,
    labelKey: 'items.seeWinter1',
  },
  {
    id: 'stadium_1',
    slot: 'background',
    shopPrice: 7,
    labelKey: 'items.stadium1',
  },
  {
    id: 'tennis_1',
    slot: 'background',
    shopPrice: 7,
    labelKey: 'items.tennis1',
  },

  // ✨ Effekte
  {
    id: 'herzen_1',
    slot: 'effect',
    shopPrice: 6,
    labelKey: 'items.herzen1',
  },
  {
    id: 'sparkling_1',
    slot: 'effect',
    shopPrice: 6,
    labelKey: 'items.sparkling1',
  },
];

export function getStarterInventory(): Inventory {
  return {
    featured: ITEMS.filter((i) => i.slot === 'featured' && i.starter).map((i) => i.id),
    background: ITEMS.filter((i) => i.slot === 'background' && i.starter).map((i) => i.id),
    effect: ITEMS.filter((i) => i.slot === 'effect' && i.starter).map((i) => i.id),
  };
}

export function getDefaultEquipment(): Equipment {
  return {
    featured: 'item_backpack_amy',
    background: 'forest_1',
    effect: null,
  };
}

export const ITEM_STYLE: Partial<Record<string, string>> = {
  // 🎒 BASIS / STANDARD
  // fallback (implizit)
  // transform scale-[0.55] translate-x-[0%] translate-y-[20%]

  // 🎒 Rucksäcke
  'featured:item_backpack_amy':
    'transform scale-[0.50] translate-x-[-26%] translate-y-[33%]',

  'featured:item_backpack':
    'transform scale-[0.52] translate-x-[-28%] translate-y-[30%]',

  // 🎸 MUSIK (größer + leicht gedreht)
  'featured:item_guitar':
    'transform scale-[0.74] translate-x-[20%] translate-y-[20%] rotate-[-5deg]',

  'featured:item_e-guitar':
    'transform scale-[0.74] translate-x-[20%] translate-y-[18%] rotate-[-7deg]',

  'featured:item_violin':
    'transform scale-[0.48] translate-x-[-22%] translate-y-[30%] rotate-[-16deg]',

  'featured:item_microphone':
    'transform scale-[0.30] translate-x-[-18%] translate-y-[30%] rotate-[4deg]',

  // 🎨 KREATIV / MEDIEN
  'featured:item_color-palette':
    'transform scale-[0.40] translate-x-[-24%] translate-y-[30%]',

  'featured:item_comics':
    'transform scale-[0.40] translate-x-[-24%] translate-y-[32%]',

  'featured:item_book':
    'transform scale-[0.40] translate-x-[-24%] translate-y-[30%] rotate-[-7deg]',

  'featured:item_headphones':
    'transform scale-[0.35] translate-x-[-24%] translate-y-[30%]',

  // 🚴 BEWEGUNG (größer)
  'featured:item_mountain-bike':
    'transform scale-[0.65] translate-x-[-20%] translate-y-[20%] rotate-[-4deg]',

  'featured:item_scooter':
    'transform scale-[0.62] translate-x-[20%] translate-y-[26%] rotate-[-4deg]',

  'featured:item_rollerblades':
    'transform scale-[0.40] translate-x-[-23%] translate-y-[33%]',

  'featured:item_skateboard':
    'transform scale-[0.53] translate-x-[-20%] translate-y-[25%] rotate-[-5deg]',

  // ⚽ SPORT / KLEIN
  'featured:item_soccer-ball':
    'transform scale-[0.30] translate-x-[30%] translate-y-[40%]',

  'featured:item_tennis-racket_purple':
    'transform scale-[0.52] translate-x-[-22%] translate-y-[20%] rotate-[-23deg]',

  // 🐶 PETS / SPIELZEUG
  'featured:item_pet-cat':
    'transform scale-[0.40] translate-x-[24%] translate-y-[34%]',

  'featured:item_pet-dog':
    'transform scale-[0.50] translate-x-[24%] translate-y-[30%]',

  'featured:item_plush-dog':
    'transform scale-[0.37] translate-x-[24%] translate-y-[34%]',

  'featured:item_teddy-bear':
    'transform scale-[0.42] translate-x-[24%] translate-y-[34%]',

  // 🐎 REITEN
  'featured:item_riding-boots':
    'transform scale-[0.37] translate-x-[-26%] translate-y-[30%]',

  'featured:item_equestrian-helmet':
    'transform scale-[0.30] translate-x-[-26%] translate-y-[30%]',

  // 🩰 TANZ
  'featured:item_ballet-pointe-shoes':
    'transform scale-[0.34] translate-x-[-20%] translate-y-[30%]',

  // ⛸ WINTER
  'featured:item_ice-scates_white':
    'transform scale-[0.35] translate-x-[-24%] translate-y-[30%]',

  'featured:item_ice-skates_black':
    'transform scale-[0.35] translate-x-[-24%] translate-y-[30%]',

  // 🖼 Hintergründe
  'background:baumhaus_1': '',
  'background:berge_1': '',
  'background:camping_1': '',
  'background:city_1': '',
  'background:flower_1': '',
  'background:forest_1': '',
  'background:magischer_Schulhof_1': '',
  'background:park_1': '',
  'background:see-winter_1': '',
  'background:stadium_1': '',
  'background:tennis_1': '',

  // ✨ Effekte
  'effect:glowing_energy_1':
    'transform scale-[1.08] translate-y-[-4%] opacity-85',

  'effect:herzen_1':
    'transform scale-[0.70] translate-y-[-23%] opacity-85',

  'effect:soft_glowing_1':
    'transform scale-[1.12] translate-y-[-2%] opacity-75',

  'effect:feuerwerk_1':
    'transform scale-[1.08] translate-y-[-6%] opacity-85',

  'effect:sparkling_1':
    'transform scale-[1.10] translate-y-[-5%] opacity-80',
};