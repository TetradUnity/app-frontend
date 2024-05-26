import { title } from "process";

// Response interfaces
export interface IResponse {
    success: boolean,
    data?: any,
    error_code?: string
}

export interface IProfileResponse extends IResponse {
    data?: IUser;
}

export interface ISubjectResponse extends IResponse {
    data?: ISubject;
}
export interface ISubjectStudentsResponse extends IResponse {
    data?: IStudentShortInfo[];
}


// Model interfaces
export interface IUser {
    id: number,
    email: string,
    first_name: string | undefined,
    last_name: string | undefined,
    avatar: string
    role: "chief_teacher" | "teacher" | "student"
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

export type IStudentShortInfo = ITeacherShortInfo;

export interface IGrade {
    grade: number,
    reason: "task" | "test" | "conference",
    date: Date
}

export namespace TestsNamespace {
    export type Test = [
        {
            time: number
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