import { create } from 'zustand';

interface AppState {
  isOnline: boolean;
  isDarkMode: boolean;
  setOnline: (online: boolean) => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOnline: true,
  isDarkMode: false,
  setOnline: (online) => set({ isOnline: online }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));