import { title } from "process";

// Response interfaces
export interface IResponse {
    success: boolean,
    data?: any,
    error_code?: string
}

export interface ITResponse<T> extends IResponse {
    data?: T
}
export interface ITArrResponse<T> extends IResponse {
    data?: T[]
}


// Model interfaces
export interface IUser {
    id: number,
    email: string,
    first_name: string | undefined,
    last_name: string | undefined,
    avatar: string
    role: "CHIEF_TEACHER" | "TEACHER" | "STUDENT"
}

export interface ITeacherShortInfo {
    id: number,
    first_name: string,
    last_name: string
}

export interface IMaterialShortInfo {
    id: number,
    title: string,
    date: Date
}

export interface ITestShortInfo {
    id: number,
    title: string,
    date: Date
}

export interface ISubject {
    title: string,
    teacherInfo: ITeacherShortInfo,
    materials: IMaterialShortInfo[],
    tests: ITestShortInfo[]
}



type IAnnouncedSubjectBase = {
    time_start: number;
  
    title: string;
    description: string;
    duration: number;
    timetable: string;
  
    teacher_first_name: string;
    teacher_last_name: string;
    teacher_id: number;
}

export type IAnnouncedSubject = 
    | IAnnouncedSubjectBase & {time_exam_end: number; duration_exam: number}
    | IAnnouncedSubjectBase & {time_exam_end?: never; duration_exam?: never};


export interface IAnnouncedSubjectShort {
    id: number,

    time_exam_end: number,
    time_start: number,

    title: string,
    short_description: string,
    tags: [],

    teacher_first_name: string,
    teacher_last_name: string,
    teacher_id: number
}

/* TEMPORARY */
export interface TemporaryAnnoncedSubjectInfo {
    id: number,
    title: string,
    teacher_id: number,
    description: string,
    is_active: boolean,
    created_at: string,
    exam: any,
    exam_end_date: any,
    start_date: string,
    banner: string,

    duration: string,
    timetable: string,
}
export interface SubjectCardProps {
    subject: TemporaryAnnoncedSubjectInfo
}

export type IStudentShortInfo = ITeacherShortInfo;

export interface IGrade {
    grade: number,
    reason: "task" | "test" | "conference",
    date: Date
}

export namespace TestsNamespace {
    export type Test = [
        {
            time: number,
        },
        ...Question[]
    ]

    export interface Question {
        title: string,
        type: "ONE_ANSWER" | "MULTI_ANSWER" | "TEXT",
        answers: Answer[]
    } 

    export type Answer = {
        isCorrect: boolean,
        content: string
    };

    export type ProdTest = [
        {
            time: number,
        },
        ...ProdQuestion[]
    ];

    export interface ProdQuestion {
        title: string,
        type: "ONE_ANSWER" | "MULTI_ANSWER" | "TEXT",
        answers: ProdAnswer[]
    };

    export type ProdAnswer = {
        content: string
    };
}

export interface CreateSubjectParams {
    title: string,
    description: string,
    short_description: string,
    start: number,
    exam_end?: number,
    duration: number,
    timetable: string,
    teacherEmail: string,
    tags: string[],
    exam: string | null
}