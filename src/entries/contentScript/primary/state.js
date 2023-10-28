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
    currentUrl: null,
    reactionPolicy: null,
    setCurrentUrl: (currentUrl) => set(() => ({ currentUrl })),
    setReactionPolicy: (reactionPolicy) => set(() => ({ reactionPolicy })),
}));
