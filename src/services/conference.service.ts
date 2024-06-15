'use client'

import { api, catchApiError } from "@/api";
import {
    IResponse,
    Responses
} from "@/types/api.types";

type ConferenceCreateParams = {
    link: string,
    subject_id: number,
    date: number,
}

export const ConferenceService = {
    async createConference(params : ConferenceCreateParams): Promise<Responses.CreateConferenceResponse> {
        try {
            const response = await api.post("/conference/create", params);

            return {
                success: true,
                id: response.data.id
            };
        } catch (error) {
            return catchApiError(error);
        }
    },

    async evaluateConference(conferenceId: number, studentId: number, grade: number): Promise<IResponse> {
        try {
            const response = await api.post("/conference/rate-conference", {
                conference_id: conferenceId, student_id: studentId, result: grade
            });

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    }
};