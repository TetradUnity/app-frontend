import { create } from "zustand";

type State = {
    isVisible: boolean,
    progress: number,
    error: string
};

type Action = {
    setVisible: (isVisible: State['isVisible']) => void,
    setProgress: (progress: State['progress']) => void,
    setError: (error: State["error"]) => void
};

export const useUploadStore = create<State & Action>(set => ({
    isVisible: false,
    progress: 0,
    error: "",

    setVisible: (isVisible) => set(state => ({isVisible: isVisible})),
    setProgress: (progress) => set(state => ({progress: progress})),
    setError: (error) => set(state => ({error: error}))
}));