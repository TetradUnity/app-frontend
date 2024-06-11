'use client'

import { api, catchApiError } from "@/api";
import {
    IAnnouncedSubject,
    IAnnouncedSubjectShort,
    IMaterial,
    IResponse,
    IStudentShortInfo,
    ISubject,
    ITArrResponse,
    ITResponse,
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

export type filterProps = {
    tags?: string[],
    has_exam?: boolean,
    first_name_teacher?: string,
    last_name_teacher?: string,
    title?: string
};

export const SubjectService = {
    async getAnnouncedSubjects(page=1, filters?: filterProps): Promise<ITArrResponse<IAnnouncedSubjectShort> & {count_pages?: number}> {
        try {
            const response = await api.post("/subject/get-announce-subjects", {
                title: filters?.title,
                first_name_teacher: filters?.first_name_teacher,
                last_name_teacher: filters?.last_name_teacher,
                has_exam: filters?.has_exam,
                tags: filters?.tags
            }, {
                params: { page }
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

    async register(subject_id: number, email: string, first_name?: string, last_name?: string): Promise<IResponse> {
        try {
            const response = await api.post("/subject/apply-subject", {
                subject_id, email,
                first_name, last_name
            });

            return {
                success: true
            }
        } catch (e) {
            return catchApiError(e);
        }
    },

    async createLinkExam(
        subjectId: number,
        email: string,
        first_name: string,
        last_name: string,
    ): Promise<IResponse> {
        try {
            await api.post("/subject/create-link-exam", {
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