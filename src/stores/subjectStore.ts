import { ISubject, IStudentShortInfo, IGrade } from "@/types/api.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = ISubject & {
    subjectId: number,

    students: IStudentShortInfo[],
    studentsFetchingState: "not_fetched" | "fetching" | "success" | "error",

    grades: IGrade[]
};

type Action = {
    updateSubjectInfo: (data: (ISubject & {subjectId: number}) | undefined) => void,
    updateStudents: (data: IStudentShortInfo[] | undefined) => void,
    updateFetchStatus: (status: State["studentsFetchingState"]) => void
};

export const useSubjectStore = create( devtools<State & Action>( (set, get) => ({
    subjectId: -1,
    title: "",
    teacherInfo: {
        id: -1,
        first_name: "",
        last_name: ""
    },
    materials: [],
    tests: [],

    students: [],
    studentsFetchingState: "not_fetched",

    savedScrollPosition: 0,

    // TODO: Make it a worker when back end will be ready. 
    grades: [
        {grade: 9, reason: "test", date: new Date(1715839132000)},
        {grade: 11, reason: "conference", date: new Date(1715839123000)},
        {grade: 10, reason: "task", date: new Date(1715839100000)},
        {grade: 8, reason: "conference", date: new Date(1715839100000)},
        {grade: 12, reason: "task", date: new Date(1715839100000)}
    ],

    updateSubjectInfo: (data) => set(state => {
        if (data) {
            return {...state, ...data};
        }
        return state;
    }),
    updateStudents: (data) => set(state => {
        if (data) {
            return {...state, students: data, studentsFetchingState: "success"};
        }
        return state;
    }),
    updateFetchStatus: (status) => set(state => ({...state, studentsFetchingState: status}))
}) ));