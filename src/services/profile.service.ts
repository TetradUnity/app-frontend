'use client'

import { API_URL, catchApiError } from "@/api";
import { IProfileResponse } from "@/types/api.types";
import axios from "axios";

export const ProfileService = {
    async getProfile(userId?: number): Promise<IProfileResponse> {
        try {
            const response = await axios.get(API_URL + "/profile", {
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