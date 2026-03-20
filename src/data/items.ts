// src/profile/items.ts
import type { ItemSlot } from '../profile/types';

export type ItemDef = {
  id: string;        // z.B. "cap_2"
  slot: ItemSlot;    // "head" | "face" | "top" | ...
  starter?: boolean; // sofort im Inventar?
};

/**
 * ✅ Single Source of Truth: Alle Items
 * Wichtig: IDs müssen exakt so heißen wie in resolveItem(slot,id,...)
 */
export const ITEMS: ItemDef[] = [
  // 🧢 HEAD
  { id: 'cap_2', slot: 'head', starter: true },
  { id: 'wollyhat_1', slot: 'head', starter: true },

  // 👓 FACE
  { id: 'glasses_1', slot: 'face', starter: true },

  // 👕 TOP
  { id: 'hoody_amy', slot: 'top', starter: true },
  { id: 'hoody_1', slot: 'top', starter: true },

  // 👖 BOTTOM
  // { id: 'pants_1', slot: 'bottom', label: 'Hose', starter: true },


  // 👟 FEET
  //{ id: 'trainers_1', slot: 'feet', label: 'Sneaker', starter: true },

  // 🌲 BACKGROUND
  { id: 'forest_1', slot: 'background', starter: true },

  // ✨ EFFECT
  //{ id: 'aura_1', slot: 'effect', label: 'Aura', starter: true },
];

/**
 * ✅ Starter-Inventar aus ITEMS ableiten (nur 1x pflegen!)
 */
export function getStarterInventory(): Record<ItemSlot, string[]> {
  const inv: Record<ItemSlot, string[]> = {
    head: [],
    face: [],
    top: [],
    bottom: [],
    feet: [],
    background: [],
    effect: [],
  };

  for (const it of ITEMS) {
    if (!it.starter) continue;
    inv[it.slot].push(it.id);
  }

  return inv;
}

/**
 * ✅ Starter-Equipment (was "angezogen" ist) aus einer Default-Outfit-Map.
 * => Damit kannst du "erstes Outfit" exakt steuern.
 *
 * Du änderst hier später einfach die IDs, wenn du Default-Outfit ändern willst.
 */
export const DEFAULT_EQUIPMENT: Record<ItemSlot, string | null> = {
  head: 'cap_2',
  face: 'glasses_1',
  top: 'hoody_amy',
  bottom: null,
  feet: null,
  background: 'forest_1',
  effect: null,
};


/**
 * ✅ Optional: Positions-Styles zentral (statt in AvatarStage)
 * Key: "<slot>:<id>"
 */
export const ITEM_STYLE: Partial<Record<string, string>> = {
  // face
  'face:glasses_1': 'transform scale-[0.24] translate-y-[-184px] translate-x-[2px]',
  // head
  'head:cap_2': 'transform origin-bottom perspective-[800px] rotateX(-4deg) scale-[0.43] translate-y-[-350px] translate-x-[4px]',

  // top
 'top:hoody_amy': 'transform origin-bottom perspective-[800px] rotateX(-4deg) scale-[0.53] translate-y-[-190px] translate-x-[4px]',
  'top:hoody_1': 'transform origin-bottom perspective-[400px] rotateX(-4deg) scale-[0.59] translate-y-[-160px] translate-x-[4px]',

  // bottom
 


  // feet


  // background

  // effect

};
