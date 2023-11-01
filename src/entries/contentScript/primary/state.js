import { create } from 'zustand';

export const useAppStore = create((set) => ({
    appError: null,
    currentUrl: null,
    reactionPolicy: null,
    setAppError: (appError) => set(() => ({ appError })),
    setCurrentUrl: (currentUrl) => set(() => ({ currentUrl })),
    setReactionPolicy: (reactionPolicy) => set(() => ({ reactionPolicy })),
}));
