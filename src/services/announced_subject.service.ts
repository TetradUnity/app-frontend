
'use client'

import { api, catchApiError } from "@/api";
import {
    IAnnouncedSubject,
    IAnnouncedSubjectShort,
    ICandidate,
    IResponse,
    ITArrResponse,
    ITResponse,
    Responses,
    TestsNamespace
} from "@/types/api.types";

export type filterProps = {
    tags?: string[],
    has_exam?: boolean,
    first_name_teacher?: string,
    last_name_teacher?: string,
    title?: string
};
export const AnnouncedSubjectService = {
    // student or guest
    async startExam(uid: string): Promise<Responses.StartExamResponse> {
        try {
            const response = await api.post("/subject/start-exam", {}, {
                params: { uid }
            });

            return {
                success: true,
                data: JSON.parse(response.data.exam),
                time_end: response.data.time_end,
                savedAnswers: response.data.savedAnswers
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

    async finishExam(uid: string, answers: TestsNamespace.AnswerType[]): Promise<Responses.FinishExamResponse> {
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

    async getAnnouncedSubjects(page=1, filters?: filterProps): Promise<Responses.GetAnnouncedSubjectsResponse> {
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

    async getAnnouncedSubjectInfo(id: number): Promise<Responses.GetAnnouncedSubjectResponse> {
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
    async register(subject_id: number, email?: string, first_name?: string, last_name?: string): Promise<IResponse> {
        try {
            await api.post("/subject/apply-subject", {
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

    // teacher
    async approveStudents(subject_id: number): Promise<IResponse> {
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
    async getCandidates(subjectId: number, page: number): Promise<Responses.GetCandidatesResponse> {
        try {
            const response = await api.get("/subject/get-candidates", {
               params: { subjectId, page }
           });

           return {
               success: true,
               data: response.data.candidates,
               title: response.data.title,
               banner: response.data.banner,
               has_exam: response.data.has_exam,
               average_result: response.data.average_result,
               count_candidates: response.data.count_candidates
           }
       } catch (e) {
           return catchApiError(e);
       }
    },
    async getAnswersCandidate(id: number): Promise<Responses.GetAnswersCandidateResponse> {
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