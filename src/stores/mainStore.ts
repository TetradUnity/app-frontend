import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
    clicks: number
};

type Action = {
    setClicks: (clicks: State['clicks']) => void
};

export const useMainStore = create(devtools<State & Action>(set => ({
    clicks: 0,
    setClicks: (clicks) => set(state => ({clicks: clicks}))
})));