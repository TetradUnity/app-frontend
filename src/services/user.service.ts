'use client'

import { api, catchApiError } from "@/api";
import { IProfileResponse } from "@/types/api.types";

export const UserService = {
    async getProfile(userId?: number): Promise<IProfileResponse> {
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