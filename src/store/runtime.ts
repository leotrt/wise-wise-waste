import { create } from 'zustand';

interface RuntimeState {
  currentProductId: string | null;
  setCurrentProductId: (id: string | null) => void;
  selectingDate: boolean;
  setSelectingDate: (selectingDate: boolean) => void;
  scanning: boolean;
  setScanning: (scanning: boolean) => void;
  searching: boolean;
  setSearching: (searching: boolean) => void;
  currentEan: string | null;
  setCurrentEan: (ean: string | null) => void;
}

export const useRuntimeStore = create<RuntimeState>()(
set => ({
  currentProductId: null,
  setCurrentProductId: (id: string | null) => set({ currentProductId: id }),
  selectingDate: false,
  setSelectingDate: (selectingDate: boolean) => set({ selectingDate }),
  scanning: false,
  setScanning: (scanning: boolean) => set({ scanning }),
  searching: false,
  setSearching: (searching: boolean) => set({ searching }),
  currentEan: null,
  setCurrentEan: (ean: string | null) => set({ currentEan: ean }),
})
);
