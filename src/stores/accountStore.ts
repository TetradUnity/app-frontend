import { create } from "zustand";

type State = {
    role: "student" | "teacher",
};

type Action = {
    setRole: (role: State['role']) => void
};

export const useAccountStore = create<State & Action>(set => ({
    role: "student",
    setRole: (role) => set(state => ({role: role}))
}));