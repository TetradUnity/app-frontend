'use client'

import { api, catchApiError } from "@/api";
import { IProfileResponse, ITResponse } from "@/types/api.types";

export const UserService = {
    async getProfile(userId?: number): Promise<ITResponse<IProfileResponse>> {
        try {
            const response = await api.get("/user/get", {
                params: {
                    id: userId
                }
            });

            return {
                success: true,
                data: response.data.user
            }
        } catch (e) {
            return catchApiError(e);
        }
    }
};