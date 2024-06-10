'use client'

import { api, catchApiError } from "@/api";
import {
    ICandidate,
    IResponse,
    ITArrResponse,
    ITResponse,
    TestsNamespace
} from "@/types/api.types";

export const AnnouncedSubjectService = {
    // student or guest
    async startExam(uid: string): Promise<ITResponse<TestsNamespace.ProdTest> & {time_end?: number}> {
        try {
            const response = await api.post("/subject/start-exam", {}, {
                params: { uid }
            });

            return {
                success: true,
                data: JSON.parse(response.data.exam),
                time_end: response.data.time_end
            }
        } catch (e) {
            return catchApiError(e);
        }
    },

    async updateAnswers(uid: string, answers: TestsNamespace.AnswerType[]): Promise<IResponse> {
        try {
            await api.post("/subject/update-answer", {
                answer: JSON.stringify(answers), uid
            });

            return {
                success: true
            }
        } catch (e) {
            return catchApiError(e);
        }
    },

    async finishExam(uid: string, answers: TestsNamespace.AnswerType[]): Promise<IResponse & {result?: number, passing_grade?: number}> {
        try {
            const response = await api.post("/subject/send-answer-exam", {
                answer: JSON.stringify(answers), uid
            });

            return {
                success: true,
                result: response.data.result,
                passing_grade: response.data.passing_grade
            }
        } catch (e) {
            return catchApiError(e);
        }
    },

    // teacher
    async startSubject(subject_id: number): Promise<IResponse> {
        try {
             await api.post("/subject/approve-students", {}, {
                params: { subject_id }
            });

            return {
                success: true
            }
        } catch (e) {
            return catchApiError(e);
        }
    },
    async rejectCandidate(id: number): Promise<IResponse> {
        try {
             await api.post("/subject/reject-candidate", {}, {
                params: { id }
            });

            return {
                success: true
            }
        } catch (e) {
            return catchApiError(e);
        }
    },
    async getCandidates(subjectId: number): Promise<ITArrResponse<ICandidate> & {title?: string, banner?: string, has_exam?: boolean}> {
        try {
            const response = await api.get("/subject/get-candidates", {
               params: { subjectId }
           });

           return {
               success: true,
               data: response.data.candidates,
               title: response.data.title,
               banner: response.data.banner,
               has_exam: response.data.has_exam
           }
       } catch (e) {
           return catchApiError(e);
       }
    },
    async getAnswersCandidate(id: number): Promise<ITResponse<TestsNamespace.CandidateQuestion[]>> {
        try {
            const response = await api.get("/subject/get-answers-candidate", {
               params: { id }
           });

           return {
               success: true,
               data: JSON.parse(response.data.answers)
           }
       } catch (e) {
           return catchApiError(e);
       }
    },
    async cancelSubject(subject_id: number): Promise<IResponse> {
        try {
            await api.delete("/subject/delete-announce-subject", {
               params: { subject_id }
            });

           return {
               success: true
           }
       } catch (e) {
           return catchApiError(e);
       }
    }
};