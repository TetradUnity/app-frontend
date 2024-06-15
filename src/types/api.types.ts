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
        reason: "TEST" | "EDUCATION_MATERIAL" | "CONFERENCES"
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
        grade?: number,
        is_test_going: boolean
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

export type IStudentShortInfo = ITeacherShortInfo & {
    average_grade?: number
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

export namespace Responses {
    // announced_subject.service.ts
    export type StartExamResponse = ITResponse<TestsNamespace.ProdTest> & {
        time_end?: number,
        savedAnswers?: TestsNamespace.AnswerType[]
    };
    export type FinishExamResponse = IResponse & {result?: number, passing_grade?: number};
    export type GetAnnouncedSubjectsResponse = ITArrResponse<IAnnouncedSubjectShort> & {count_pages?: number};
    export type GetAnnouncedSubjectResponse = ITResponse<IAnnouncedSubject>;
    export type GetCandidatesResponse = ITArrResponse<ICandidate> & {
        title?: string,
        banner?: string,
        has_exam?: boolean,
        average_result?: number,
        count_candidates?: number
    };
    export type GetAnswersCandidateResponse = ITResponse<TestsNamespace.CandidateQuestion[]>;

    // calendar.service.ts
    export type GetMonthResponse = ITResponse<SubjectNamespace.IGrade[] | SubjectNamespace.IEvent[]>;

    // certificate.service.ts
    export type GetCertifacatesResponse = ITResponse<ICertificate[]>;
    export type CheckCertificateResponse = IResponse & { isCorrect?: boolean };

    // chief_teacher.service.ts
    export type FindTeacherByEmailResponse = ITArrResponse<ISearchUserResult>;
    export type CreateSubjectResponse = IResponse & {subject_id?: number};

    // conference.service.ts
    export type CreateConferenceResponse = IResponse & {id?: number};

    // education.service.ts
    export type GetEducationMaterialsResponse = ITArrResponse<SubjectNamespace.IEducationMaterial>;
    export type GetEducationMaterialResponse = ITResponse<SubjectNamespace.ISingleEducationMaterial & SubjectNamespace.ISingleEducationTest>;
    export type StartTestResponse = ITResponse<TestsNamespace.ProdTest> & {
        savedAnswers?: TestsNamespace.AnswerType[];
        time_end?: number
    };
    export type SendHomeworkResponse = IResponse & {
        result?: number
    };
    export type ViewHomeworksResponse = ITArrResponse<SubjectNamespace.IStudentHomeworkShortInfo> & {
        count_homework?: number,
        average_grade?: number
    };
    export type ViewHomeworkResponse = ITResponse<TestsNamespace.Question[] | string[]>;

    // grade.service.ts
    export type GetGradesResponse = ITArrResponse<SubjectNamespace.IGrade>;

    // subject.service.ts
    export type GetSubjectsResponse = ITArrResponse<SubjectNamespace.ISubjectShort>;
    export type GetSubjectResponse = ITResponse<SubjectNamespace.ISubject>;
    export type GetStudentsResponse = ITArrResponse<IStudentShortInfo> & {
        count?: number
    };
    export type GetAllStudentsResponse = ITArrResponse<IStudentShortInfo>;
    export type FinishSubjectResponse = IResponse & {
        no_rate_task_id?: number,
        no_rate_task_title?: string,
        no_ended_task_id?: number,
        no_ended_task_title?: string,
    };

    // tags.service.ts
    export type TagsSearchResponse = ITResponse<string[]>;

    // user.service.ts
    export type GetProfileResponse = ITResponse<IUser>;
    export type FindUsersResponse = ITResponse<IUser[]>;
}