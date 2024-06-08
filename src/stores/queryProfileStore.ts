import { IUser } from "@/types/api.types";
import { create } from "zustand";

type IQUser = IUser & {isMe: boolean};

type State = IQUser;

type Action = {
    updateProfile: (profile: IQUser | undefined) => void
};

export const useQueryProfileStore = create<State & Action>(set => ({
    id: -1,
    email: "",
    first_name: "",
    last_name: "",
    role: "STUDENT",
    isMe: false,
    avatar: "/imgs/no_avatar.png",

    updateProfile: (profile) => set(state => {
        return profile || state;
    })
}));