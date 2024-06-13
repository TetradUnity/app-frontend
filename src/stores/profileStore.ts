import { UploadService, UploadType } from "@/services/upload.service";
import { IUser } from "@/types/api.types";
import { getUserAvatar } from "@/utils/OtherUtils";
import { create } from "zustand";

type State = IUser & {avatar_url: string};

type Action = {
    updateProfile: (profile: IUser | undefined) => void
};

export const useProfileStore = create<State & Action>(set => ({
    id: -1,
    email: "",
    first_name: "",
    last_name: "",
    role: "GUEST",
    avatar: "",
    avatar_url: "/imgs/guest_avatar.png",

    updateProfile: (profile) => set(state => {
        if (!profile) {
            return state;
        }

        let newState = {...state, ...profile};

        if (profile) {
            newState.avatar_url = getUserAvatar(profile.avatar);
        }

        return newState;
    })
}));