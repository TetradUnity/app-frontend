'use client'

import { api, catchApiError } from "@/api";
import { IStudentShortInfo, ISubject, ISubjectResponse, ISubjectStudentsResponse } from "@/types/api.types";

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

export const SubjectService = {
    // TODO: Release api calls when it's wiil be ready

    mock: {
        getSubject: (subjectId: number): Promise<ISubjectResponse> => {
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

        getStudents: (subjectId: number): Promise<ISubjectStudentsResponse> => {
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
    }
};