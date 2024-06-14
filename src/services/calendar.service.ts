'use client'

import { api, catchApiError } from "@/api";
import {
    ITArrResponse,
    ITResponse,
    SubjectNamespace
} from "@/types/api.types";

export type CalendarFilter = {
    withGrade: boolean,
    subjects_id: number[]
};

export const CalendarService = {
    async getMonth(year: number, month: number, filter: CalendarFilter): Promise<ITResponse<SubjectNamespace.IGrade[] | SubjectNamespace.IEvent[]>> {
        try {
            const response = await api.post("/calendar/get-month", filter, {
                params: { year, month }
            });

            return {
                success: true,
                data: response.data.grades || response.data.events,
            }
        } catch (error) {
            return catchApiError(error);
        }
    },
};