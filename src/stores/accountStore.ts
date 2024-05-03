import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
    role: "student" | "teacher",
};

type Action = {
    setRole: (role: State['role']) => void
};

export const useAccountStore = create(devtools<State & Action>(set => ({
    role: "student",
    setRole: (role) => set(state => ({role: role}))
})));