import { create } from 'zustand';

export const useContentStore = create((set) => ({
    loading: null,
    status: null,
    user: null,
    setLoading: (loading) => set(() => ({ loading })),
    setStatus: (status) => set(() => ({ status })),
    setUser: (user) => set(() => ({ user })),
}));

export const useAppStore = create((set) => ({
    appError: null,
    currentUrl: null,
    reactionPolicy: null,
    setAppError: (appError) => set(() => ({ appError })),
    setCurrentUrl: (currentUrl) => set(() => ({ currentUrl })),
    setReactionPolicy: (reactionPolicy) => set(() => ({ reactionPolicy })),
}));
