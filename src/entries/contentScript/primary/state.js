import { create } from 'zustand';

export const useAppStore = create((set) => ({
    appError: null,
    currentUrl: null,
    reactionPolicy: null,
    isVisible: true,
    setAppError: (appError) => set(() => ({ appError })),
    setCurrentUrl: (currentUrl) => set(() => ({ currentUrl })),
    setReactionPolicy: (reactionPolicy) => set(() => ({ reactionPolicy })),
    setIsVisible: (isVisible) => set(() => ({ isVisible })),
}));
