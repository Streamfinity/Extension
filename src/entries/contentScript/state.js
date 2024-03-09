import { create } from 'zustand';

export const MESSAGE_ERROR = 'error';
export const MESSAGE_SUCCESS = 'success';

export const useAppStore = create((set) => ({
    appMessage: null,
    currentUrl: null,
    currentChannel: { handle: null, id: null, url: null },
    reactionPolicy: null,
    isVisible: true,
    overrideState: null,
    isDarkMode: false,
    isDeviceDarkMode: false,
    setAppMessage: (appMessage) => set(() => ({ appMessage })),
    setCurrentUrl: (currentUrl) => set(() => ({ currentUrl })),
    setCurrentChannel: (currentChannel) => set(() => ({ currentChannel })),
    setReactionPolicy: (reactionPolicy) => set(() => ({ reactionPolicy })),
    setIsVisible: (isVisible) => set(() => ({ isVisible })),
    setOverrideState: (overrideState) => set(() => ({ overrideState })),
    setIsDarkMode: (isDarkMode) => set(() => ({ isDarkMode })),
    setIsDeviceDarkMode: (isDeviceDarkMode) => set(() => ({ isDeviceDarkMode })),
}));
