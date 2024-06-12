'use client'

import { api, catchApiError } from "@/api";
import {
    IResponse
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
    }
};