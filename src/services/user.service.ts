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
    },

    async editProfile({email, password, first_name, last_name, oldPassword, avatar}: {email?: string, password?: string, first_name?: string, last_name?: string, oldPassword?: string, avatar?: string}): Promise<ITResponse<IProfileResponse>> {
        try {
            const response = await api.put("/user/edit", {
                email,
                password,
                first_name,
                last_name,
                oldPassword,
                avatar
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