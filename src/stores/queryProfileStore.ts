import { UploadService, UploadType } from "@/services/upload.service";
import { IUser } from "@/types/api.types";
import { create } from "zustand";

type IQUser = IUser & {isMe: boolean};

type State = IQUser & {avatar_url: string};

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
    avatar_url: "/imgs/no_avatar.png",

    updateProfile: (profile) => set(state => {
        if (!profile) {
            return state;
        }

        let newState = {...state, ...profile};

        if (profile && profile.avatar) {
            newState.avatar_url = UploadService.getImageURL(UploadType.AVATAR, profile.avatar);
        }

        return newState;
    })
}));