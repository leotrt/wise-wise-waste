import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid';

export interface InventoryState {
  inventory: Inventory;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => InventoryItem;
  removeInventoryItem: (id: InventoryItem['id']) => void;
  upsertInventoryItem: (item: InventoryItem) => void;
}

export interface InventoryItem {
  id: string;
  ean?: string;
  name: string;
  photoUrl?: string;
  dueDate?: Date;
  openedDate?: Date;
  daysOpened?: number;
}

export interface Inventory {
  ids: InventoryItem['id'][];
  entities: Record<InventoryItem['id'], InventoryItem>;
}

export const useInventoryStore = create<InventoryState>()(
persist(
(set, get) => ({
  inventory: {
    ids: [],
    entities: {},
  },
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => {
    console.log('addInventoryItem', item);
    const id = nanoid(12);
    const createdItem = { ...item, id } as InventoryItem;
    set({
      inventory: {
        ids: [...get().inventory.ids, id],
        entities: {
          ...get().inventory.entities,
          [id]: createdItem
        },
      },
    });

    return createdItem;
  },
  removeInventoryItem: (id: InventoryItem['id']) => {
    const { [id]: _, ...entities } = get().inventory.entities;
    set({
      inventory: {
        ids: get().inventory.ids.filter(itemId => itemId !== id),
        entities,
      },
    });
  },
  upsertInventoryItem: (item: InventoryItem) => {
    set({
      inventory: {
        ids: Array.from(new Set([...get().inventory.ids, item.id])),
        entities: {
          ...get().inventory.entities,
          [item.id]: item,
        },
      },
    });
  }
}),
{
  name: 'food-storage', // name of the item in the storage (must be unique)
})
)
