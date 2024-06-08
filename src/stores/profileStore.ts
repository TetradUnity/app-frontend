import { IUser } from "@/types/api.types";
import { create } from "zustand";

type State = IUser;

type Action = {
    updateProfile: (profile: IUser | undefined) => void
};

export const useProfileStore = create<State & Action>(set => ({
    id: -1,
    email: "",
    first_name: "",
    last_name: "",
    role: "STUDENT",
    avatar: "/imgs/no_avatar.png",

    updateProfile: (profile) => set(state => {
        return profile || state;
    })
}));