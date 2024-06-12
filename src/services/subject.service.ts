'use client'

import { api, catchApiError } from "@/api";
import {
    IAnnouncedSubject,
    IAnnouncedSubjectShort,
    IResponse,
    IStudentShortInfo,
    ISubject,
    ITArrResponse,
    ITResponse
} from "@/types/api.types";
import {AuthTokensService} from "@/services/auth-token.service";

let subjects: {[id: number]: ISubject} = {
    1: {
        title: "Фізика 05-10-2024",
        teacherInfo: {
            id: 3,
            first_name: "Юлія",
            last_name: "Вільтодівна"
        },
        materials: [
            {
                id: 2,
                title: "Закон тяжіння",
                date: new Date(1715839123000)
            },
            {
                id: 1,
                title: "Фізика - як наука. Вступний урок до курсу фізики. Базові поняття.",
                date: new Date(1715839416000)
            }
        ],
        tests: [
            {
                id: 1,
                date: new Date(),
                title: "Фізика як наука"
            }
        ]
    }
};

let subject_students: {[id: number]: IStudentShortInfo[]} = {
    1: [
        {
            id: 1,
            first_name: "Акакій",
            last_name: "Акакієвич",
            avatar: "",
        },
        {
            id: 2,
            first_name: "Олександр",
            last_name: "Дерево",
            avatar: "",
        },
        {
            id: 3,
            first_name: "Ірина",
            last_name: "Кущ",
            avatar: "",
        }
    ]
};

export type filterProps = {
    tags?: string[],
    has_exam?: boolean,
    first_name_teacher?: string,
    last_name_teacher?: string,
    title?: string
};

export const SubjectService = {
    async getSubject(subjectId: number): Promise<ITResponse<ISubject>> {
        try {
            const response = await api.get("/subject", {
                params: { subjectId }
            });

            return {
                success: true,
                data: response.data.subject
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    mock: {
        getSubject: (subjectId: number): Promise<ITResponse<ISubject>> => {
            return new Promise(resolve => {
                setTimeout(() => {
                    if (!subjects[subjectId]) {
                        resolve({
                            success: false,
                            error_code: "subject_not_found"
                        });
                    }
                    resolve({
                        success: true,
                        data: subjects[subjectId]
                    });
                }, 500 + (Math.random() * 700));
            });
        },

        getStudents: (subjectId: number): Promise<ITArrResponse<IStudentShortInfo>> => {
            return new Promise(resolve => {
                setTimeout(() => {
                    if (!subjects[subjectId]) {
                        resolve({
                            success: false,
                            error_code: "subject_not_found"
                        });
                    }
                    resolve({
                        success: true,
                        data: subject_students[subjectId]
                    });
                }, 500 + (Math.random() * 700));
            });
        }
    },
};