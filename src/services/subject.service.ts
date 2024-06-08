'use client'

import { api, catchApiError } from "@/api";
import {
    IAnnouncedSubject,
    IAnnouncedSubjectShort,
    IStudentShortInfo,
    ISubject,
    ITArrResponse,
    ITResponse,
    IUser, ProdTest,
    TestsNamespace
} from "@/types/api.types";

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
        tests: []
    }
};

let subject_students: {[id: number]: IStudentShortInfo[]} = {
    1: [
        {
            id: 1,
            first_name: "Акакій",
            last_name: "Акакієвич",
        },
        {
            id: 2,
            first_name: "Олександр",
            last_name: "Дерево",
        },
        {
            id: 3,
            first_name: "Ірина",
            last_name: "Кущ",
        }
    ]
};

export type filtersType = {
    tags?: string[],
    hasExam?: boolean
};

export const SubjectService = {
    // TODO: Release api calls when it's will be ready

    async startExam(uid: string | string[]): Promise<ITResponse<TestsNamespace.ProdTest>> {
        try {
            const response = await api.post("/subject/start-exam", {
                uid
            });

            return {
                success: true,
                data: response.data
            }
        } catch (e) {
            return catchApiError(e);
        }
    },

    async sendAnswerExam(answer: string, uid: string): Promise<ITResponse<TestsNamespace.Test>> {
        try {
            const response = await api.post("/subject/send-answer-exam", {
                answer, uid
            });

            return {
                success: true,
                data: response.data
            }
        } catch (e) {
            return catchApiError(e);
        }
    },

    async getAnnouncedSubjects(page=1, filters?: filtersType): Promise<ITArrResponse<IAnnouncedSubjectShort> & {count_pages?: number}> {
        try {
            const response = await api.get("/subject/get-announce-subjects", {
                params: {
                    page,
                    tags: filters?.tags,
                    hasExam: filters?.hasExam
                }
            });

            return {
                success: true,
                data: response.data.subjects,
                count_pages: response.data.count_pages
            }
        } catch (e) {
            return catchApiError(e);
        }
    },

    async getAnnouncedSubjectInfo(id: number): Promise<ITResponse<IAnnouncedSubject>> {
        try {
            const response = await api.get("/subject/get-detail-announce-subject", {
                params: {
                    id
                }
            });

            return {
                success: true,
                data: response.data.subject,
            }
        } catch (e) {
            return catchApiError(e);
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
    async createLinkExam(
        subjectId: number,
        email: string,
        first_name: string,
        last_name: string,
    ): Promise<ITResponse<>> {
        try {
            const response = await api.post("/subject/create-link-exam", {
                subjectId,
                email,
                first_name,
                last_name,
            });

            return {
                success: true
            }
        } catch (e) {
            return catchApiError(e);
        }
    },
};