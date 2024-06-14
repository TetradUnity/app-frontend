'use client'

import {api, catchApiError} from "@/api";
import {
    ICertificate,
    IResponse,
    ITArrResponse
} from "@/types/api.types";

export const CertificateService = {
    async getCertificates(student_id: number): Promise<ITArrResponse<ICertificate[]>> {
        try {
            const response = await api.get("/get-certificates", {
                params: {
                    student_id: student_id
                }
            })

            return {
                success: true,
                data: response.data.certificates,
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async checkCertificate(uid: string): Promise<IResponse & { isCorrect?: boolean }> {
        try {
            const response = await api.post("/certificate/check-certificate", {}, {
                params: {uid}
            });

            return {
                success: true,
                isCorrect: response.data.isCorrect
            }
        } catch (error) {
            return catchApiError(error);
        }
    }
};