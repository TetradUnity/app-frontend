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
    last_name: string,
    avatar: string
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

export namespace SubjectNamespace {
    export interface ISubject {
        title: string,
        banner: string,
        teacher_first_name: string,
        teacher_last_name: string,
        teacher_id: number
    }

    export interface ISubjectShort {
        id: number
        banner: string

        teacher_first_name?: string,
        teacher_last_name?: string,
        teacher_id?: number,

        type: "ANNOUNCED_SUBJECT" | "PREPARING_SUBJECT" | "READY_SUBJECT" | "ACTIVE_SUBJECT",
        info: number,

        title: string
    }

    export interface IEducationMaterialProps {
        title: string,
        subject_id: number,
        is_test: boolean,
        content: string,
        deadline: number
    }

    export interface IEducationMaterial {
        id: number,
        title: string,
        is_test: boolean,
        deadline: number,
        time_created: number
    }

    export interface IStudentHomeworkShortInfo {
        id: number,
        first_name: string,
        last_name: string,
        avatar: string,
        value: number,
        dispatch_time: number,
        attempt: number
    }

    export interface IGrade {
        id: number,
        value: number,
        date: number,
        reason: string
    }

    export interface IEvent {
        id: number,
        title: string,
        date: number,
        type: "education_material" | "conference" | "test"
    }
    
    export interface ISingleEducationBase {
        title: string,
        date: number,
        deadline: number,
        is_test: boolean,
        content?: string,
    }

    export interface ISingleEducationMaterial extends ISingleEducationBase {
        homework: string[]
    }

    export interface ISingleEducationTest extends ISingleEducationBase {
        your_attempts: number,
        available_attempt: number,
        amount_questions: number,
        duration: number,
        test: TestsNamespace.CandidateQuestion[],
        grade?: number
    }
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

export type IStudentShortInfo = ITeacherShortInfo;

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
            passing_grade?: number,
            count_attempts?: number,
            viewing_correct_answers?: boolean,
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
        viewing_correct_answers?: boolean,
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

export interface ICertificate {
    uid: string,
    title: string,
    type: "PARTICIPATION" | "GOOD_RESULTS" | "EXCELLENT_RESULTS"
}