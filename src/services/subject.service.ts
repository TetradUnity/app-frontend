'use client'

import { api, catchApiError } from "@/api";
import {
    ITArrResponse,
    ITResponse,
    SubjectNamespace
} from "@/types/api.types";

export const SubjectService = {
    async getSubjects(): Promise<ITArrResponse<SubjectNamespace.ISubject>> {
        try {
            const response = await api.get("/subject/get-subjects");

            return {
                success: true,
                data: response.data.subjects
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async getSubject(subjectId: number): Promise<ITResponse<SubjectNamespace.ISubject>> {
        try {
            const response = await api.get("/subject/get", {
                params: { subjectId }
            });

            return {
                success: true,
                data: response.data.subject
            }
        } catch (error) {
            return catchApiError(error);
        }
    }
};