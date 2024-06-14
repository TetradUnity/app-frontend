'use client'

import { api, catchApiError } from "@/api";
import {
    IResponse,
    IStudentShortInfo,
    ITArrResponse,
    ITResponse, SubjectNamespace, TestsNamespace
} from "@/types/api.types";

export const EducationService = {
    async getEducationMaterials(subjectId: number, page: number): Promise<ITArrResponse<SubjectNamespace.IEducationMaterial>> {
        try {
            const response = await api.get("/education/get-education-materials", {
                params: { subject_id: subjectId, page: page }
            });

            return {
                success: true,
                data: response.data.education_materials
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async createEducationMaterial(props: SubjectNamespace.IEducationMaterialProps): Promise<IResponse> {
        try {
            await api.post("/education/create-education-material", props);

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async getEducationMaterial(educationId: number): Promise<ITResponse<SubjectNamespace.ISingleEducationMaterial & SubjectNamespace.ISingleEducationTest>> {
        try {
            const response = await api.post("/education/open-education-material", {}, {
                params: { education_id: educationId }
            });

            return {
                success: true,
                data: {
                    your_attempts: response.data.your_attempts,
                    available_attempt: response.data.available_attempt,
                    amount_questions: response.data.amount_questions,
                    duration: response.data.duration,
                    test: response.data.test ? JSON.parse(response.data.test) : undefined,
                    content: response.data.content,
                    date: response.data.date,
                    deadline: response.data.deadline,
                    homework: response.data.homework ? JSON.parse(response.data.homework) : [],
                    title: response.data.title,
                    is_test: response.data.is_test,
                    grade: response.data.grade,
                    is_test_going: response.data.is_test_going
                }
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async startTest(educationMaterialId: number): Promise<ITResponse<TestsNamespace.ProdTest> & {savedAnswers?: TestsNamespace.AnswerType[]; time_end?: number}> {
        try {
            const response = await api.post("/education/start-test", {}, {
                params: { education_id: educationMaterialId }
            });

            return {
                success: true,
                data: JSON.parse(response.data.test),
                savedAnswers: response.data.saved_answer ? JSON.parse(response.data.saved_answer) : undefined,
                time_end: response.data.end_time
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async updateAnswersTest(educationMaterialId: number, answers: TestsNamespace.AnswerType[]): Promise<IResponse> {
        try {
            await api.post("/education/update-answers-test", {
                "model": JSON.stringify(answers)
            }, {
                params: { education_id: educationMaterialId }
            });

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async sendHomework(educationMaterialId: number, content: TestsNamespace.AnswerType[] | string[]): Promise<IResponse & {result?: number}> {
        try {
            const response = await api.post("/education/send-homework", {
                "model": JSON.stringify(content)
            }, {
                params: { education_id: educationMaterialId }
            });

            return {
                success: true,
                result: response.data.result
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async viewHomeworks(educationMaterialId: number, page: number): Promise<ITArrResponse<SubjectNamespace.IStudentHomeworkShortInfo> & {count_homework?: number, average_grade?: number}> {
        try {
            const response = await api.get("/education/view-homeworks", {
                params: { education_id: educationMaterialId, page }
            });

            return {
                success: true,
                data: response.data.homeworks,
                count_homework: response.data.count_homework,
                average_grade: response.data.average_grade
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async viewHomework(gradeId: number): Promise<ITResponse<TestsNamespace.Question[] | string[]>> {
        try {
            const response = await api.post("/education/view-homework", {}, {
                params: { grade_id: gradeId }
            });

            let toParse = response.data.test || response.data.files;

            return {
                success: true,
                data: toParse ? JSON.parse(toParse) : undefined
            }
        } catch (error) {
            return catchApiError(error);
        }
    },
};