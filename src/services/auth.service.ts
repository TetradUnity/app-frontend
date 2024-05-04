'use client'

import { api, catchApiError } from "@/api";
import { IResponse } from "@/types/api.types";
import { AuthTokensService } from "./auth-token.service";

export const AuthService = {
    async login(email: string, password: string): Promise<IResponse> {
        try {
            const response = await api.post("/authorization/login", {
                email, password
            });

            AuthTokensService.setAuthToken(response.data.accessToken);
            AuthTokensService.setRefreshToken(response.data.refreshToken);

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async createUser(email: string, first_name: string, last_name: string, password: string): Promise<IResponse> {
        try {
            const response = await api.post("/authorization/create-user", {
                email, first_name, last_name, password
            });

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    },


    async refreshToken(): Promise<IResponse> {
        try {
            const response = await api.post("/authorization/refresh-authorized");

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    }
};