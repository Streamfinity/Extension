import { create } from 'zustand';

export const useAppStore = create((set) => ({
    currentUrl: null,
    currentChannel: { handle: null, id: null, url: null },
    isVisible: true,
    overrideState: null,
    isDarkMode: false,
    isDeviceDarkMode: false,
    isCompact: null,
    isMinimized: null,
    setCurrentUrl: (currentUrl) => set(() => ({ currentUrl })),
    setCurrentChannel: (currentChannel) => set(() => ({ currentChannel })),
    setIsVisible: (isVisible) => set(() => ({ isVisible })),
    setOverrideState: (overrideState) => set(() => ({ overrideState })),
    setIsDarkMode: (isDarkMode) => set(() => ({ isDarkMode })),
    setIsDeviceDarkMode: (isDeviceDarkMode) => set(() => ({ isDeviceDarkMode })),
    setIsCompact: (isCompact) => set(() => ({ isCompact })),
    setIsMinimized: (isMinimized) => set(() => ({ isMinimized })),
}));
