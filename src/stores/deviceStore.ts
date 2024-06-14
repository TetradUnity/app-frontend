import { create } from "zustand";

type State = {
    type: "mobile" | "desktop"
};

type Action = {
    setType: (type: State['type']) => void,
};

export const useDeviceStore = create<State & Action>(set => ({
    type: "desktop",
    setType: type => set(state => ({
        type: type
    }))
}));