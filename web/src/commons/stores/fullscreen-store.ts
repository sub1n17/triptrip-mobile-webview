import { create } from 'zustand';

interface fullscreenStore {
    isImageFullscreen: boolean;
    setImageFullscreen: (v: boolean) => void;
}

export const useFullscreenStore = create<fullscreenStore>((set) => ({
    isImageFullscreen: false,
    setImageFullscreen: (isOpen: boolean) => set({ isImageFullscreen: isOpen }),
}));
