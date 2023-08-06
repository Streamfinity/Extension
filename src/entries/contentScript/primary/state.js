import { create } from 'zustand';

export const useContentStore = create((set) => ({
    loading: null,
    status: null,
    user: null,
    setLoading: (loading) => set(() => ({ loading })),
    setStatus: (status) => set(() => ({ status })),
    setUser: (user) => set(() => ({ user })),
}));
