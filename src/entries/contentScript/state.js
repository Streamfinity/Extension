/**
 * Creates a custom hook using Zustand library to manage application state.
 * The hook provides access to various state variables such as currentUrl, currentChannel, reactionPolicy, etc.
 * It also exposes setter functions to update these state variables.
 * @returns {Object} The custom hook object with state variables and setter functions.
 */
import { create } from 'zustand';

export const useAppStore = create((set) => ({
    currentUrl: null,
    currentChannel: { handle: null, id: null, url: null },
    reactionPolicy: null,
    isVisible: true,
    overrideState: null,
    isDarkMode: false,
    isDeviceDarkMode: false,
    isCompact: null,
    setCurrentUrl: (currentUrl) => set(() => ({ currentUrl })),
    setCurrentChannel: (currentChannel) => set(() => ({ currentChannel })),
    setReactionPolicy: (reactionPolicy) => set(() => ({ reactionPolicy })),
    setIsVisible: (isVisible) => set(() => ({ isVisible })),
    setOverrideState: (overrideState) => set(() => ({ overrideState })),
    setIsDarkMode: (isDarkMode) => set(() => ({ isDarkMode })),
    setIsDeviceDarkMode: (isDeviceDarkMode) => set(() => ({ isDeviceDarkMode })),
    setIsCompact: (isCompact) => set(() => ({ isCompact })),
}));
