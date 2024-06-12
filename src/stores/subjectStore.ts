import { UploadService, UploadType } from "@/services/upload.service";
import { IStudentShortInfo, IGrade, SubjectNamespace } from "@/types/api.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type StatusType = "SUCCESS" | "FETCHING" | "NOT_FETCHED" | `${string}`;

type State =  {
    subject: SubjectNamespace.ISubject & {id: number},

    materials: SubjectNamespace.IEducationMaterial[],
    materialsFetchingStatus: StatusType,

    grades: IGrade[]
    gradesFetchingStatus: StatusType,

    students: IStudentShortInfo[],
    studentsFetchingStatus: StatusType,
};

type Action = {
    updateSubjectInfo: (data: State["subject"] | undefined) => void,
    
    updateMaterials: (data: State["materials"]) => void,
    updateMaterialFetchStatus: (status: StatusType) => void,

    updateGrades: (data: State["grades"]) => void,
    updateGradesFetchStatus: (status: StatusType) => void,

    updateStudents: (data: State["students"]) => void,
    updateStudentsFetchStatus: (status: StatusType) => void,
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

    materials: [],
    materialsFetchingStatus: "NOT_FETCHED",

    grades: [],
    gradesFetchingStatus: "NOT_FETCHED",

    students: [],
    studentsFetchingStatus: "NOT_FETCHED",

    updateSubjectInfo: data => set(state => {
        if (data) {
            return {...state, subject: {...data, banner: UploadService.getImageURL(UploadType.BANNER, data.banner)}};
        }
        return state;
    }),

    updateMaterials: data => set(state => ({...state, materials: data})),
    updateMaterialFetchStatus: status => set(state => ({...state, materialsFetchingStatus: status})),

    updateStudents: data => set(state => ({...state, students: data})),
    updateStudentsFetchStatus: status => set(state => ({...state, studentsFetchingStatus: status})),

    updateGrades: data => set(state => ({...state, grades: data})),
    updateGradesFetchStatus: status => set(state => ({...state, gradesFetchingStatus: status}))
}) ));