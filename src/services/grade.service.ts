'use client'

import { api, catchApiError } from "@/api";
import {
    IResponse,
    ITArrResponse,
    SubjectNamespace
} from "@/types/api.types";


export const GradeService = {
    async evaluate(result: number, gradeId: number): Promise<IResponse> {
        try {
            await api.post("/grade/rate", {}, {
                params: { result: result, grade_id: gradeId }
            });

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async getGrades(subject_id: number, page?: number): Promise<ITArrResponse<SubjectNamespace.IGrade>> {
        try {
            const response = await api.get("/grade/get-grades", {
                params: { subject_id, page }
            });

            return {
                success: true,
                data: response.data.grades
            }
        } catch (error) {
            return catchApiError(error);
        }
    }
};