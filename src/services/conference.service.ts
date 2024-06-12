'use client'

import { api, catchApiError } from "@/api";
import {
    IResponse
} from "@/types/api.types";

type ConferenceCreateParams = {
    title: string,
    link: string,
    subject_id: number,
    date: number,
}

export const ConferenceService = {
    async createConference(params : ConferenceCreateParams): Promise<IResponse & {id?: number}> {
        try {
            const response = await api.post("/conference/create", params);

            return {
                success: true,
                id: response.data.id
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async evaluateConference(grade: number, conferenceId: number): Promise<IResponse> {
        try {
            const response = await api.post("/conference/rate-conference", {}, {
                params: { result: grade, conference_id: conferenceId}
            });

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    }
};