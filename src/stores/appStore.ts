import { create } from "zustand";

type State = {
    isLoading: boolean,
};

type Action = {
    setLoading: (loading: State['isLoading']) => void
};

export const useAppStore = create<State & Action>(set => ({
    isLoading: false,
    setLoading: (isLoading) => set(state => ({isLoading: isLoading}))
}));