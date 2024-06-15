import { UploadService, UploadType } from "@/services/upload.service";
import { IStudentShortInfo, IGrade, SubjectNamespace } from "@/types/api.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type StatusType = "SUCCESS" | "FETCHING" | "NOT_FETCHED" | `${string}`;

type State =  {
    subject: SubjectNamespace.ISubject & {id: number}
};

type Action = {
    updateSubjectInfo: (data: State["subject"] | undefined) => void,
};

export const useSubjectStore = create( devtools<State & Action>( (set, get) => ({
    subject: {
        id: -1,
        title: "",
        banner: "",
        teacher_first_name: "",
        teacher_last_name: "",
        teacher_id: -1
    },

    updateSubjectInfo: data => set(state => {
        if (data) {
            return {...state, subject: {...data, banner: UploadService.getImageURL(UploadType.BANNER, data.banner)}};
        }
        return state;
    })
}) ));