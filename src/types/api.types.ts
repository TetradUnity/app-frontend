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
    avatar?: string,
    role: "CHIEF_TEACHER" | "TEACHER" | "STUDENT" | "GUEST"
}

export interface ISearchUserResult {
    id: number,
    first_name: string,
    last_name: string,
    email: string
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

export interface ISubjectShort {
    id: number
    banner: string

    teacher_first_name?: string,
    teacher_last_name?: string,
    teacher_id?: number,

    type: "ANNOUNCED_SUBJECT" | "PREPARING_SUBJECT" | "READY_SUBJECT" | "ACTIVE_SUBJECT",

    title: string
}

export interface ISubject {
    title: string,
    teacherInfo: ITeacherShortInfo,
    materials: IMaterialShortInfo[],
    tests: ITestShortInfo[]
}
export interface IMaterial {
    title: string,
    content: string,
    date: Date
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

    banner: string
}

export type IAnnouncedSubject = 
    | IAnnouncedSubjectBase & {time_exam_end: number; duration_exam: number}
    | IAnnouncedSubjectBase & {time_exam_end?: never; duration_exam?: never};


export interface IAnnouncedSubjectShort {
    id: number

    title: string,
    short_description: string,
    tags: [],

    teacher_first_name: string,
    teacher_last_name: string,
    teacher_id: number,

    banner: string
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

export type IStudentShortInfo = ITeacherShortInfo & {
    avatar: string
};

export interface IGrade {
    grade: number,
    reason: "task" | "test" | "conference",
    date: Date
}

export namespace TestsNamespace {
    export type AnswerType = number[] | string[] | undefined[];
    export type QuestionType = "ONE_ANSWER" | "MULTI_ANSWER" | "TEXT";

    export type Test = [
        {
            time: number,
            passing_grade: number,
        },
        ...Question[]
    ]

    export interface Question {
        title: string,
        type: QuestionType,
        answers: Answer[]
    } 

    export type Answer = {
        isCorrect?: boolean,
        content: string
    };


    export interface ProdQuestion {
        title: string,
        type:  QuestionType,
        answers: string[]
    };
    export type ProdTest = ProdQuestion[];

    export interface CandidateQuestion {
        title: string,
        type:  QuestionType,
        answers: Answer[],
        your_answer: string[] | number[] | []
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
    exam?: string,
    banner: string
}

export namespace Drafts {
    export type SubjectParams = Partial<CreateSubjectParams & {
        duration_dayjs: [number | undefined, number | undefined],
        exam_plain: Drafts.Test,
        isExamRequired: boolean
    }>;
    export type Test = Partial<TestsNamespace.Test>;

    export type Material = {
        title?: string,
        homework?: boolean,
        homework_deadline?: number,
        material?: string
    };

    export type TestMaterial = {
        title?: string,
        deadline?: number,
        max_attempts?: number,
        test?: Drafts.Test
    }
}

export interface ICandidate {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    result: number;
    duration?: number;
}