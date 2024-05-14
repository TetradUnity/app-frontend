import { create } from "zustand";

type State = {
    isLoading: boolean,
    isFailedToLoad: boolean
};

type Action = {
    setLoading: (loading: State['isLoading']) => void,
    setFailedToLoad: (loading: State['isFailedToLoad']) => void
};

export const useAppStore = create<State & Action>(set => ({
    isLoading: false,
    isFailedToLoad: false,

    setLoading: (isLoading) => set(state => ({isLoading: isLoading})),
    setFailedToLoad: (isFailedToLoad) => set(state => ({isFailedToLoad: isFailedToLoad}))
}));