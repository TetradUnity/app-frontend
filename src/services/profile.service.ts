'use client'

import { api, catchApiError } from "@/api";
import { IProfileResponse } from "@/types/api.types";

export const ProfileService = {
    async getProfile(userId?: number): Promise<IProfileResponse> {
        try {
            const response = await api.get("/profile", {
                params: {
                    userId
                }
            });

            return {
                success: true,
                data: response.data
            }
        } catch (e) {
            return catchApiError(e);
        }
    }
};