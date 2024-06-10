'use client'

import { api, catchApiError } from "@/api";
import {
    IResponse,
    ITResponse,
    TestsNamespace
} from "@/types/api.types";

export const AnnouncedSubjectService = {
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

    async finishExam(uid: string, answers: TestsNamespace.AnswerType[]): Promise<IResponse> {
        try {
            await api.post("/subject/send-answer-exam", {
                answer: JSON.stringify(answers), uid
            });

            return {
                success: true
            }
        } catch (e) {
            return catchApiError(e);
        }
    }
};