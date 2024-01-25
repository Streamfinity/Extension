/**
 * store for the application state.
 *
 * @typedef {Object} AppStore
 * @property {null|string} appError - The current application error.
 * @property {null|string} currentUrl - The current URL.
 * @property {null|string} reactionPolicy - The current reaction policy.
 * @property {boolean} isVisible - Indicates whether the application is visible.
 * @property {function} setAppError - Sets the application error.
 * @property {function} setCurrentUrl - Sets the current URL.
 * @property {function} setReactionPolicy - Sets the reaction policy.
 * @property {function} setIsVisible - Sets the visibility of the application.
 */

import { create } from 'zustand';

/**
 * Creates and initializes the app store using Zustand.
 *
 * @param {function} set - The set function provided by Zustand.
 * @returns {AppStore} The app store object.
 */
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
