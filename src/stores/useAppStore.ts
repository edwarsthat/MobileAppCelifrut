import { create } from 'zustand';

type AppStore = {
    loading: boolean;
    setLoading: (value: boolean) => void;
};

export const useAppStore = create<AppStore>((set) => ({
    loading: false,
    setLoading: (value) => set({ loading: value }),
}));
