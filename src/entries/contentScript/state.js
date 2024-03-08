import { create } from 'zustand';

export const MESSAGE_ERROR = 'error';
export const MESSAGE_SUCCESS = 'success';

export const useAppStore = create((set) => ({
    appMessage: null,
    currentUrl: null,
    reactionPolicy: null,
    isVisible: true,
    setAppMessage: (appMessage) => set(() => ({ appMessage })),
    setCurrentUrl: (currentUrl) => set(() => ({ currentUrl })),
    setReactionPolicy: (reactionPolicy) => set(() => ({ reactionPolicy })),
    setIsVisible: (isVisible) => set(() => ({ isVisible })),
}));
