'use client'

import {api, catchApiError} from "@/api";
import {
    ICertificate,
    IResponse,
    ITResponse,
    Responses
} from "@/types/api.types";

export const CertificateService = {
    async getCertificates(student_id: number): Promise<Responses.GetCertifacatesResponse> {
        try {
            const response = await api.get("/certificate/get-certificates", {
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

    async checkCertificate(uid: string): Promise<Responses.CheckCertificateResponse> {
        try {
            const response = await api.get("/certificate/check-certificate", {
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